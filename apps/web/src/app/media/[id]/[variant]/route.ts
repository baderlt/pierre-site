import { apiOrigin,ApiError,logApiFailure } from '@/lib/api';
export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' };
const maxBytes = 10_000_000;
export async function GET(_request: Request, { params }: { params: Promise<{ id: string; variant: string }> }) {
  const { id, variant } = await params;
  if (!/^[1-9]\d{0,15}$/.test(id) || !['swatch', 'thumb', 'card', 'large', 'preview', 'texture', 'banner'].includes(variant)) return new Response(null, { status: 404, headers });
  const started=performance.now();
  try {
    const upstream = await fetch(`${apiOrigin()}/media/${id}/${variant}`, { cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(Number(process.env.API_TIMEOUT_MS) || 8000), headers: { Accept: 'image/webp' } });
    if (!upstream.ok) { if(upstream.status>=500||upstream.status===429)logApiFailure(`media/:id/${variant}`,started,new ApiError(upstream.status),upstream.status,upstream.headers.get('X-Request-ID'));await upstream.body?.cancel(); return new Response(null, { status: upstream.status === 404 ? 404 : 503, headers }); }
    if (!upstream.headers.get('Content-Type')?.startsWith('image/webp') || Number(upstream.headers.get('Content-Length') || 0) > maxBytes) { await upstream.body?.cancel(); return new Response(null, { status: 502, headers }); }
    // Complete a bounded derivative before returning it. Client navigation must not
    // cancel the upstream Undici stream while Node is still parsing its response.
    const reader = upstream.body?.getReader();
    if (!reader) return new Response(null, { status: 502, headers });
    let size = 0; const chunks: Uint8Array[] = [];
    while (true) { const { value, done } = await reader.read(); if (done) break; size += value.length; if (size > maxBytes) { await reader.cancel(); return new Response(null, { status: 502, headers }); } chunks.push(value); }
    const body = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.length; }
    return new Response(body, { headers: { ...headers, 'Content-Type': 'image/webp' } });
  } catch(error) { logApiFailure(`media/:id/${variant}`,started,error);return new Response(null, { status: 503, headers }); }
}

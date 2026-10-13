export type PreparedImage = { color: HTMLImageElement; bump: HTMLCanvasElement; previewUrl: string; width: number; height: number; originalWidth: number; originalHeight: number; dispose(): void };
export function prepareImage(source: string | File, crop?: number[] | null): Promise<PreparedImage>;
export function validateUpload(file: File): Promise<void>;

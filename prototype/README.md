# TIME STONE — Material Lab

A standalone React + Vite, Three.js, React Three Fiber, Drei and Tailwind CSS prototype. No backend, accounts, database, AI service or runtime asset CDN. Your photographs are processed locally and are never sent to a server.

## Install and run

Requires Node.js **20.19+ or 22.12+** and npm. From this directory:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://127.0.0.1:5173).

On Windows PowerShell, use `npm.cmd` instead of `npm` if script execution is restricted. The equivalent commands are `npm.cmd install` and `npm.cmd run dev`.

```sh
npm test          # targeted geometry, material, disposal and validation tests
npm run build    # static production bundle in dist/
npm run preview  # locally serve the production bundle
```

While the development server is running, open **http://127.0.0.1:5173/tests/browser.html** for the WebGL acceptance checks. These exercise real JPEG/PNG processing, resizing, GPU disposal across 16 replacements, object URL cleanup, and a GLB export/re-import through the standard Three.js GLTFLoader. The page can download asymmetric test photographs to verify upload orientation in the main app. The test page is excluded from the production build.

## Use

1. Choose a sample or upload a JPEG/PNG (up to 20 MB and 80 megapixels).
2. Choose slab, block or tile. Shape buttons load starting dimensions and preserve your current texture and finish.
3. Enter width, height and thickness in centimeters (0.5–500 cm). Valid changes update the mesh immediately; incomplete or out-of-range entries revert on blur.
4. Compare Honed, Polished and Rough presets. Each adjusts roughness, subtle bump intensity and clearcoat. Fine-tune the sliders, texture scale and rotation.
5. Drag to orbit, use the mouse wheel to zoom, or swipe/pinch on a touch device. Use the viewer toolbar for zoom, camera reset and fullscreen. An expanded-view fallback supports browsers without the Fullscreen API. Auto-rotation is optional and starts off.
6. **Save image** downloads the studio canvas as PNG. **Export 3D** downloads a GLB with embedded color textures, geometry, finish settings and dimension metadata. GLB units are meters; it opens in standard glTF viewers. The export contains the product only, without the studio or lighting. Bump shading is preview-only because glTF has no standard bump-map channel.

**Reset** restores the slab dimensions, honed finish and texture controls, and stops auto-rotation while preserving the selected photograph. The separate camera-reset button preserves all product settings. Reloading the page clears the locally held upload.

## How a photograph becomes a preview

- The browser validates the file signature, decodes the image, downsizes its longest side to at most 2048 pixels and compresses it as JPEG. Transparency is composited onto a neutral stone-colored background.
- A grayscale luminance map, capped at 1024 pixels and mixed with restrained deterministic grain, supplies an approximate bump texture.
- A lightly beveled box is generated from the centimeter dimensions, converted to meters. The front face fits the photograph; the back reuses it with an offset. Sides sample narrow strips according to their physical dimensions. Scale and rotation transform these UV mappings.
- Six non-metallic `MeshPhysicalMaterial` surfaces use the color and bump maps. Locally generated studio light panels supply environment reflections; directional and contact shadows ground the object.
- Rendering pauses when idle, resumes during camera movement, and runs continuously only for auto-rotation. Device pixel ratio is capped at 1.5. Geometry, materials and GPU textures are disposed on replacement. Input/preview blob URLs are revoked, and stale asynchronous uploads are discarded.

## Limits

A single photograph does **not** reveal hidden surfaces, actual veins through the stone, geometry, true height, roughness, or reflectance. Side and rear faces are explicitly labeled as approximations. Image brightness is not a measured height map. Lighting baked into a photograph remains visible, and colors depend on the photograph, lighting and display.

The front image fits the full rectangular face at scale 1; different image and product aspect ratios stretch the pattern. Repeated images may show seams. Finishes are material simulations; roughness does not change the silhouette. Orbit has limits near the poles to avoid singular camera positions. Mobile layout is checked with a browser viewport; physical iOS/Android gesture performance should be verified on target devices.

WebGL/hardware acceleration is required. A fallback is shown if initialization fails or the context is lost; reload to recover. PNG size follows the viewer resolution. Very large images still need decoding before their pixel dimensions can be checked. Uploads are held in memory only, and this prototype has no persistence.

The build succeeds with Vite's large-chunk advisory for the Three.js stack (approximately 344 KB gzipped for the main JavaScript bundle). The GLB exporter loads separately when needed.

## Demo image rights

Photographic textures by Poly Haven, licensed [CC0](https://polyhaven.com/license):

- [Marble Rock 01](https://polyhaven.com/a/marble_rock_01) — Veined marble; original 1K diffuse image.
- [Marble 01](https://polyhaven.com/a/marble_01) — Warm marble; cropped from the original 1K diffuse image to exclude grout.
- [Granite Tile 02](https://polyhaven.com/a/granite_tile_02) — Copper granite; cropped from the original 1K diffuse image to isolate a tile. This small crop has lower detail than the other samples; upload a high-resolution surface photograph for a better preview.

No AI-generated imagery is used. All included samples are bundled in `public/textures/` and loaded locally.

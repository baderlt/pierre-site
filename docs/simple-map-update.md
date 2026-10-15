# Simple magasin map replacement

14 October 2026. Replaced only the decorative 3D location illustration with a real, flat interactive map. Address, Google Maps directions, contact visibility, FR/EN/AR, RTL and the other homepage sections remain unchanged. No backend/database modification, dependency, deployment or VPS operation.

The existing approved public settings now contain `oued amlil taza` and a Google Maps place link. The map uses its explicit place pin **34.1868599, -4.2459147**, not the different `@` camera centre. No address or coordinates were taken from the WANY BIO reference image. Ambiguous, invalid, camera-only and short links without explicit coordinates fall back to the existing safe Google Maps link instead of plotting an invented location.

Uses the [official OpenStreetMap iframe embed](https://wiki.openstreetmap.org/wiki/Export#Embeddable_HTML), with attribution retained, native lazy loading, a translated frame title, no-referrer policy and a sandbox. The parent CSP allows only the specific map origin for this frame. The provider supplies its own interactive renderer/assets; no Three.js or map SDK was added to the application. The browser contacts OpenStreetMap and its tile service when loading the frame, so external availability/network costs apply. No API key or paid integration was configured. Google directions remain available independently of the embedded map. No fresh Lighthouse benchmark is claimed for this small replacement.

## Actual checks

- Production build passed; compilation 14.7 s, build TypeScript 13.7 s. [Build log](qa/simple-map/build.log).
- Separate TypeScript passed, exit 0. [Result](qa/simple-map/typecheck.json).
- Three focused URL/pin/translation unit tests passed. [Log](qa/simple-map/unit.log).
- Three corrected live-map browser tests passed, zero failures/skips, 30.2 s. Real provider frame/assets/tiles returned 200 and the map canvas and location marker were verified. [Results](qa/simple-map/browser-corrected.json), [provider requests](qa/simple-map/provider-diagnostic.json).
- FR/EN/AR layouts at 320/390/768/1536 px passed in those tests; additional 430/1024 px captures are recorded separately. Keyboard directions, safe links, iframe labelling and parent WCAG A/AA checks passed. Cross-origin provider accessibility is not certified; the axe `frame-tested` diagnostic was excluded, not its parent UI checks.
- The initial three browser tests failed because their selector assumed Leaflet tile elements. Inspection showed that the current provider uses a MapLibre canvas and successfully loaded real tiles. The corrected tests check that observed renderer/marker plus successful tile responses. [Initial failures retained](qa/simple-map/browser.json). No application timeout or protection was weakened.
- Backend tests were not repeated: backend validation, settings, endpoints and business data were not changed.

Screenshots: [desktop](qa/simple-map/fr-1536.png), [French mobile](qa/simple-map/fr-390.png), [English mobile](qa/simple-map/en-390.png), [Arabic mobile](qa/simple-map/ar-390.png).

Changed application files: `components/home-location.tsx`, `lib/magasin.ts`, `app/home-targeted.css` and `apps/web/next.config.ts` (specific iframe CSP origin). Focused tests: `tests/magasin.test.mjs`, `tests/simple-map.spec.ts`, and the old location-only assertions in `tests/homepage-targeted.spec.ts`. Next regenerated route-type output references. Other homepage sections, quotation logic, product viewer and original prototype were not edited.

Updated local preview: http://127.0.0.1:3023/fr. Stopped for review; no deployment or subsequent milestone authorized.

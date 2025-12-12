# Ruchin Audichya — Interactive 3D Portfolio (ruchinaudichya.in)

Premium 3D portfolio built with Next.js, React Three Fiber, and TailwindCSS. Optimized for Core Web Vitals, fast Vercel delivery, and search visibility so recruiters and clients quickly see the work.

## Features
- Immersive 3D world with guided story stops, minimap, and cinematic camera transitions.
- Day/night palette blending, WebGL fallback overlay, and responsive WASD/orbit controls.
- Asset pipeline ready for DRACO/KTX2; shared Suspense loader with progress UI.
- Sections for projects, skills, achievements, GitHub activity, guestbook, and contact.
- SEO-first routing with sitemap, robots, canonical, and descriptive headings.

## Stack
- Framework: Next.js (App Router)
- 3D: React Three Fiber, Drei
- Styling: TailwindCSS
- Animations: Framer Motion
- Testing: Playwright, Jest
- Deploy: Vercel

## Run Locally
```bash
npm install
npm run dev
```

## Build and Test
```bash
npm run build
npm run test       # Jest
npm run test:e2e   # Playwright
npm run analyze    # Bundle analyzer (ANALYZE=true)
npm run export     # Static export (if needed)
```

## SEO Checklist (Google & Vercel)
- Domain: https://ruchinaudichya.in/ with canonical set in `app/metadata.ts`.
- Provide title, description, open graph, and twitter card in `app/metadata.ts`.
- Keep `public/robots.txt` and `app/sitemap.ts` deployed for crawlability.
- Use H1 for the main page title and clear H2/H3 section headings.
- Add meaningful alt text on key images and descriptive link labels.
- Prefer short, keyword-rich summaries: "3D Portfolio", "Cloud & Frontend Engineer", "Next.js", "React Three Fiber".

## Performance Notes
- Use Next/Image or pre-optimized assets; avoid oversized textures.
- Post-processing kept light; scene tuned for mobile and desktop.
- Avoid blocking network calls in layouts; rely on Suspense for async work.

## Content Editing
- 3D world orchestration: `src/components/3d/RuchinWorld.tsx` and `src/components/3d/World/*`.
- Story stops & minimap labels: `src/data/stops.ts`.
- Loader & overlays: `src/components/ui/LoadingProgress.tsx`, `src/components/ui/StopCard.tsx`.
- UI sections: `src/components/sections/*`.
- Data/content: `src/data/*` and `content/`.

## Deployment
Push to main; Vercel auto-builds. Verify Core Web Vitals via Vercel Analytics or Lighthouse before publishing. PWA service worker is auto-registered via `next-pwa` using `public/sw.js`.

## Contact
Reach out via the in-site contact form or GitHub for collaborations.

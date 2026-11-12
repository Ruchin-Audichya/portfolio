# ruchinaudichya.in

Personal portfolio of Ruchin Audichya. Live at [ruchinaudichya.in](https://ruchinaudichya.in).

The site is built around one idea: the work is exact. To the paisa (Yatra Sync), the byte (Anvil) and the milligram (MediFast). Each of the three flagship projects has a small working demo on the homepage.

## Stack

- **Next.js 14** (App Router), statically rendered
- **Tailwind CSS**, with colours as CSS variables for light and dark themes
- **No animation library.** Motion is CSS plus one `IntersectionObserver`
- **MDX** for notes, **Resend** for the contact form, **Vercel** for hosting and analytics

## Run locally

```bash
npm install
npm run dev
```

## Check before pushing

```bash
npm run typecheck
npm run lint
npm run build
```

## Where things live

| What | Where |
| --- | --- |
| All copy: projects, experience, story, certifications | `src/lib/content.ts` |
| SEO metadata and structured data | `src/lib/seo.ts` |
| Design tokens, type and motion | `src/app/globals.css`, `tailwind.config.ts` |
| Homepage sections | `src/components/home/` |
| Interactive demos | `src/components/demos/` |
| Fare-split maths used by the Yatra Sync demo | `src/lib/fare.ts` |
| Case-study pages | `src/app/projects/[slug]/page.tsx` |
| Notes (MDX) | `src/content/posts/` |
| Résumé | `public/resume.pdf` |

## Environment

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Sends contact-form messages |
| `CONTACT_TO` | Optional. Where messages are delivered. Resend's test sender only delivers to the address the Resend account was created with |

## Deploy

Push to `main`. Vercel builds and deploys automatically.

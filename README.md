# Ruchin Audichya Portfolio

Hire-focused portfolio for AI/ML, Cloud, and Backend roles. Built with Next.js, TailwindCSS, Framer Motion, and a lightweight custom Three.js black-hole hero.

## Features
- Recruiter-first hero with email, phone, LinkedIn, GitHub, resume, hire, and project CTAs.
- STAR-method experience section for Secret Eye Pvt Ltd and AWS Cloud Club JECRC.
- Project case studies for MediFastRx, Placify AI, AWS/cloud work, automation, Linux, and this portfolio.
- Centralized content in `src/lib/content.ts` to reduce duplicated copy drift.
- SEO metadata, sitemap, robots, analytics, and contact/guestbook APIs.

## Stack
- Framework: Next.js App Router
- 3D: custom Three.js scene
- Styling: TailwindCSS
- Motion: Framer Motion
- Forms: React Hook Form, Zod, Resend
- Deploy: Vercel

## Run Locally
```bash
npm install
npm run dev
```

## Verify
```bash
npm run build
npm run lint
```

## Content Editing
- Main profile, skills, experience, certifications, recruiter snapshot, and projects: `src/lib/content.ts`
- Hero/contact profile fields used by the black-hole hero: `src/data/profile.ts`
- Homepage section order: `src/app/page.tsx`
- Project case-study route: `src/app/projects/[slug]/page.tsx`
- Resume download: `public/resume.pdf`

## Deployment
Push to main; Vercel auto-builds. Verify the homepage, project case-study pages, and contact form after deployment.

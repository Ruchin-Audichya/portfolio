# Deployment Guide

This portfolio is designed to be easily deployed on [Vercel](https://vercel.com), the creators of Next.js.

## Prerequisites

-   A GitHub account.
-   A Vercel account.
-   A custom domain (optional, but recommended: `ruchinaudichya.in`).

## Deploying to Vercel

1.  **Push your code to GitHub:**
    Ensure your project is pushed to a GitHub repository.

2.  **Import Project to Vercel:**
    -   Log in to Vercel.
    -   Click "Add New..." -> "Project".
    -   Select your GitHub repository.
    -   Vercel will automatically detect the Next.js framework.
    -   Click "Deploy".

3.  **Wait for Build:**
    Vercel will build and deploy your site. Once done, you'll get a live URL (e.g., `your-project.vercel.app`).

## Configuring Custom Domain (ruchinaudichya.in)

1.  **Go to Project Settings:**
    In your Vercel project dashboard, go to **Settings** -> **Domains**.

2.  **Add Domain:**
    -   Enter `ruchinaudichya.in` in the input field.
    -   Click "Add".

3.  **Configure DNS:**
    Vercel will provide you with the necessary DNS records to add to your domain registrar (e.g., GoDaddy, Namecheap).

    -   **A Record:** Point `@` to `76.76.21.21`.
    -   **CNAME Record:** Point `www` to `cname.vercel-dns.com`.

    *Note: Propagation may take up to 48 hours.*

## Environment Variables

If you add features that require API keys (e.g., a real email service or database), you can configure them in Vercel:

1.  Go to **Settings** -> **Environment Variables**.
2.  Add your keys (e.g., `NEXT_PUBLIC_ANALYTICS_ID`, `EMAIL_API_KEY`).

## Analytics

To enable Vercel Analytics:
1.  Go to the **Analytics** tab in your Vercel dashboard.
2.  Click "Enable".
3.  Redeploy your application.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Cache & Content Propagation

This project implements an edge-first caching strategy with the following characteristics:

- **HTML Pages** (`/`, `/eventos`): Cached for **5 minutes** at the edge (CDN) with 1-hour stale-while-revalidate window
- **APIs**: Never cached (`no-store`)
- **Static Assets**: Aggressively cached (1 year, immutable)

### ⏱️ Expected Content Update Times

- **Non-Critical Changes**: Up to 5 minutes for propagation
- **Critical Changes**: Use cache purging for immediate propagation (< 1 minute)

**See [CACHE-POLICY.md](CACHE-POLICY.md) for detailed cache strategy, editor guidelines, and cache purging instructions.**

### Check Cache Headers

```bash
./scripts/check-cache-headers.sh https://your-domain.com
```

### Purge Cache (for Critical Updates)

```bash
# Purge home page
./scripts/purge-cache.sh "/"

# Purge eventos
./scripts/purge-cache.sh "/eventos"

# See CACHE-POLICY.md for CDN-specific configuration
```

### CI/CD Integration

For automatic cache purging in your deployment pipeline, see [DEPLOYMENT-CACHE-GUIDE.md](DEPLOYMENT-CACHE-GUIDE.md) for:

- GitHub Actions examples
- GitLab CI examples
- Vercel integration
- AWS CloudFront integration
- Health check verification

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

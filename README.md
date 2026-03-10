<div align="center">

# ⚡ SolarisNerja Platform

<img src="https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&size=26&duration=3000&color=00F7FF&center=true&vCenter=true&width=700&lines=Edge-First+Next.js+Platform;High-Performance+Event+Infrastructure;CDN-Optimized+Content+Delivery;Modern+Web+Architecture" />

---

High-performance **Next.js edge platform** designed for scalable event publishing and ultra-fast content delivery.

</div>

---

# 🧠 Architecture Overview


Client
↓
Edge CDN (HTML Cache 5m)
↓
Next.js App Router
↓
Route Handlers
↓
Domain Logic
↓
PostgreSQL / External APIs


Core principles:

- **Edge-first architecture**
- **Deterministic caching**
- **Minimal backend complexity**
- **Fast content propagation**

---

# 🚀 Getting Started

Install dependencies

```bash
pnpm install

Run development server

pnpm dev

Open

http://localhost:3000

Edit

app/page.tsx

Hot reload is enabled automatically.

⚡ Cache & Content Propagation

The platform implements an edge-optimized caching strategy.

Resource	Cache Strategy
HTML Pages	5 min edge cache
APIs	no-store
Static Assets	1 year immutable
Propagation Expectations
Update Type	Time
Non-critical	~5 minutes
Critical	< 1 minute with purge
🧩 Cache Debugging

Check headers

./scripts/check-cache-headers.sh https://your-domain.com
🔥 Purge Cache
./scripts/purge-cache.sh "/"
./scripts/purge-cache.sh "/eventos"
🧰 CI/CD Cache Integration

Automated purge supported for:

GitHub Actions

GitLab CI

Vercel

AWS CloudFront

See

DEPLOYMENT-CACHE-GUIDE.md
📚 Documentation

Main resources

Next.js Docs
https://nextjs.org/docs

Learn Next.js
https://nextjs.org/learn

Next.js Repository
https://github.com/vercel/next.js

☁️ Deployment

The easiest deployment method:

Vercel

https://vercel.com/new
🧑‍💻 Author

Neil Muñoz Lago

Architect · Distributed Systems · Edge Platforms

GitHub → https://github.com/Neiland85
<div align="center">

Built with Next.js App Router + Edge Caching

</div> ```
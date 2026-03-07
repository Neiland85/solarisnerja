#!/bin/bash
set -e

echo "==> 1/3 Adding image assets..."
git add public/hero/ public/carousel/ public/gallery/ public/og-image.jpg

git commit -m "assets: add hero, carousel, gallery images and og-image

- public/hero/ (4 WebP, 1920x1080)
- public/carousel/ (10 WebP, 1920x800)
- public/gallery/ (10 WebP, 1200x1200)
- public/og-image.jpg (1200x630)

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"

echo ""
echo "==> 2/3 Adding CTA improvements..."
git add \
  src/ui/components/HeroSection.tsx \
  src/ui/components/SolarisInfoSection.tsx \
  src/ui/components/EventosSection.tsx

git commit -m "style: large prominent ticket CTAs across hero, info and eventos sections

- Hero: white bg CTA with emoji, hover yellow, scale effect, shadow-2xl
- SolarisInfoSection: black bg CTA, hover yellow, same scale + shadow
- EventosSection: dual CTA (comprar entradas + ver programación)
- All CTAs: px-14 py-5, font-bold, tracking-widest, uppercase

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"

echo ""
echo "==> 3/3 Pushing..."
git push origin feat/events-dashboard

echo ""
echo "==> Done! Check Vercel for the build."

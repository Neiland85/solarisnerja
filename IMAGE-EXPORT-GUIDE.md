# Guía de Exportación de Imágenes — Solaris Nerja

## Estructura de carpetas

```
public/
├── solaris_logo.png          (existente)
├── og-image.jpg              ← OpenGraph / redes sociales
├── hero/
│   ├── hero-01.webp          ← Crossfade imágenes (3-5)
│   ├── hero-02.webp
│   ├── hero-03.webp
│   ├── hero-04.webp
│   └── hero-05.webp
├── carousel/
│   ├── carousel-01.webp      ← Slider horizontal
│   ├── carousel-02.webp
│   ├── carousel-03.webp
│   ├── carousel-04.webp
│   └── carousel-05.webp
└── gallery/
    ├── gallery-01.webp       ← Grid con reveal
    ├── gallery-02.webp
    ├── gallery-03.webp
    ├── gallery-04.webp
    ├── gallery-05.webp
    └── gallery-06.webp
```

---

## 1. Hero Crossfade (HeroSection)

Imágenes de fondo a pantalla completa con transición crossfade.

| Propiedad       | Valor                          |
|-----------------|--------------------------------|
| Formato         | **WebP**                       |
| Dimensiones     | **1920 × 1080 px**             |
| Aspect ratio    | 16:9                           |
| Calidad export  | 80-85%                         |
| Peso máximo     | **200 KB** por imagen          |
| Cantidad        | 3-5 imágenes                   |
| Nomenclatura    | `hero-01.webp` ... `hero-05.webp` |
| Carpeta         | `public/hero/`                 |

### Criterios de contenido
- Paisajes horizontales (mar, atardecer, playa, Nerja)
- Punto focal centrado (el texto se superpone en el centro)
- Evitar detalles importantes en bordes (se recortan en móvil)
- Tonos cálidos preferibles (coherencia con gradientes solaris)
- Sin texto en la imagen (el componente superpone tipografía)

### Recorte en móvil
En móvil el hero usa `object-cover` con `object-position: center`.
La zona segura para contenido relevante es el **60% central** de la imagen.

```
┌──────────────────────────────────┐
│  ZONA DE RECORTE   │  SAFE ZONE  │  ZONA DE RECORTE  │
│   (puede cortarse) │  (60% centro)│  (puede cortarse) │
└──────────────────────────────────┘
```

---

## 2. Carrusel Horizontal (nueva sección)

Slider entre EventosSection y MercadoSection.

| Propiedad       | Valor                          |
|-----------------|--------------------------------|
| Formato         | **WebP**                       |
| Dimensiones     | **1200 × 675 px**              |
| Aspect ratio    | 16:9                           |
| Calidad export  | 80-85%                         |
| Peso máximo     | **150 KB** por imagen          |
| Cantidad        | 3-5 imágenes                   |
| Nomenclatura    | `carousel-01.webp` ... `carousel-05.webp` |
| Carpeta         | `public/carousel/`             |

### Criterios de contenido
- Escenas del festival: conciertos, mercado, público, gastronomía
- Composiciones horizontales con espacio para respirar
- Alta saturación y contraste (se muestran sobre fondo blanco)
- Opcional: mix de ambientes día/noche para variedad

### ¿Por qué 1200×675?
El carrusel se renderiza dentro de `max-w-6xl` (1152px lógicos).
1200px cubre esa medida + un poco de margen. En retina, Next.js `<Image>`
genera automáticamente srcset con 2x si la fuente lo permite.

---

## 3. Grid con Reveal (nueva sección)

Cuadrícula de imágenes que aparecen con animación al hacer scroll.

| Propiedad       | Valor                          |
|-----------------|--------------------------------|
| Formato         | **WebP**                       |
| Dimensiones     | **800 × 800 px**               |
| Aspect ratio    | 1:1 (cuadrado)                 |
| Calidad export  | 80%                            |
| Peso máximo     | **120 KB** por imagen          |
| Cantidad        | 6 imágenes (grid 3×2)          |
| Nomenclatura    | `gallery-01.webp` ... `gallery-06.webp` |
| Carpeta         | `public/gallery/`              |

### Criterios de contenido
- Mix de encuadres: detalles, planos generales, close-ups
- Ejemplo de distribución recomendada:
  1. Vista panorámica del Playazo
  2. Detalle gastronómico (plato, copa, producto local)
  3. Artista/músico en acción
  4. Mercado creativo / stand
  5. Público disfrutando / ambiente
  6. Atardecer / golden hour

### Variante: Grid asimétrico (alternativa)
Si prefieres un grid editorial más dinámico:

| Posición    | Dimensiones      | Ratio |
|-------------|------------------|-------|
| Imagen 1-2  | 800 × 800 px     | 1:1   |
| Imagen 3    | 1200 × 675 px    | 16:9  |
| Imagen 4-5  | 800 × 800 px     | 1:1   |
| Imagen 6    | 1200 × 675 px    | 16:9  |

---

## 4. OpenGraph / Redes Sociales

Imagen única para compartir en redes.

| Propiedad       | Valor                          |
|-----------------|--------------------------------|
| Formato         | **JPG** (compatibilidad)       |
| Dimensiones     | **1200 × 630 px**              |
| Aspect ratio    | ~1.91:1                        |
| Calidad export  | 85%                            |
| Peso máximo     | **300 KB**                     |
| Cantidad        | 1                              |
| Nomenclatura    | `og-image.jpg`                 |
| Carpeta         | `public/`                      |

### Criterios de contenido
- Logo Solaris Nerja visible (esquina o centro)
- Texto mínimo: "Solaris Nerja" + "18-28 junio 2026"
- Imagen de fondo: la mejor foto de Nerja/festival
- Zona segura: el contenido importante en el **centro 80%**
  (algunas redes recortan bordes)

### Zona segura OG

```
┌─────────────────────────────┐ 1200px
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │    ZONA SEGURA (80%)    │ │ 630px
│ │    Logo + texto aquí    │ │
│ │                         │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

## Resumen rápido de exportación

| Componente       | Formato | Tamaño px      | Peso máx | Cantidad | Carpeta          |
|------------------|---------|----------------|----------|----------|------------------|
| Hero crossfade   | WebP    | 1920 × 1080    | 200 KB   | 3-5      | `public/hero/`   |
| Carrusel         | WebP    | 1200 × 675     | 150 KB   | 3-5      | `public/carousel/`|
| Grid gallery     | WebP    | 800 × 800      | 120 KB   | 6        | `public/gallery/` |
| OG / Social      | JPG     | 1200 × 630     | 300 KB   | 1        | `public/`         |

---

## Cómo exportar desde cada herramienta

### Photoshop
1. Archivo → Exportar → Exportar como...
2. Seleccionar WebP, calidad 82
3. Redimensionar al tamaño indicado
4. Marcar "Convertir a sRGB"

### Figma
1. Seleccionar frame → Export (panel derecho)
2. Suffix: vacío, formato: WebP (o PNG si no hay WebP)
3. Escala: fija al tamaño indicado
4. Si exportas PNG: convertir a WebP con `cwebp -q 82 input.png -o output.webp`

### Canva
1. Descargar → JPG o PNG (Canva no soporta WebP directo)
2. Convertir después:
   - macOS: `sips -s format jpeg input.png --out output.jpg`
   - Cualquier OS: `npx sharp-cli input.png -o output.webp --webp`
   - Online: squoosh.app (Google, gratuito)

### Lightroom / Camera Raw
1. Exportar con ajustes:
   - Formato: JPEG (luego convertir a WebP)
   - Espacio color: sRGB
   - Calidad: 85
   - Redimensionar al borde largo indicado
2. Convertir: `cwebp -q 82 foto.jpg -o foto.webp`

---

## Después de exportar

Cuando tengas las imágenes en las carpetas correctas, avísame y
implemento los 4 componentes:
1. `HeroSection` con crossfade automático
2. `ImageCarousel` con Embla (ligero, sin dependencias pesadas)
3. `GalleryGrid` con Reveal scroll animation
4. Metadata OG + Twitter Card en `layout.tsx`

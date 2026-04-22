# vladmarinovich.com

Sitio de presentación personal. Infraestructura digital, estrategia y ejecución.

## Stack

- **React 19** + **TypeScript**
- **Vite 8**
- **Tailwind CSS v3** — tokens de diseño personalizados
- **React Three Fiber** — escena 3D de fondo (corredor arquitectónico)
- **Framer Motion** — transiciones de UI
- **Zustand** — estado global (escena, casos, interfaz)
- **Lenis** — scroll suavizado

## Estructura

```
src/
├── components/
│   ├── layout/       # BaseLayout
│   ├── nav/          # Nav con frosted glass
│   ├── scene/        # SceneCanvas — corredor 3D
│   └── sections/     # Hero, Evidence, Capabilities, Thinking, About, Standards, Contact
├── content/          # Copy del sitio y casos de estudio
├── hooks/            # useLenis, useScrollProgress, useDeviceTier, useReducedMotion
├── lib/              # sectionRanges
├── store/            # sceneStore, caseStore, uiStore
└── types/            # SceneSection, ColorMode, DeviceTier, CaseStudy
```

## Fases

| Fase | Estado | Descripción |
|------|--------|-------------|
| 1 — Scaffold | ✅ | Configuración, tipos, stores, hooks, contenido, secciones base |
| 2 — Escena 3D | ✅ | Corredor arquitectónico oscuro con anillos reactivos al scroll |
| 3 — Scroll | 🔜 | Orquestación GSAP + ScrollTrigger |
| 4 — Evidence | 🔜 | Panel editorial de casos de estudio |
| 5 — About + Contact | 🔜 | Retrato y transición white burst |

## Desarrollo

```bash
npm install
npm run dev
```

## Estrategia de ramas

- `main` — producción estable
- `feat/fase-N-[nombre]` — una rama por fase

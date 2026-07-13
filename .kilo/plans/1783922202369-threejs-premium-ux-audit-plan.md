# Three.js Premium 3D Animation & UI/UX Audit Plan

## Project Overview
Transform TrivanceTech (AiTechWorlds) into a world-class premium tech services website with:
- Cutting-edge Three.js 3D animations (hero, backgrounds, interactive elements)
- Comprehensive UI/UX audit and elevation to premium standards
- Performance-optimized, accessible, and conversion-focused experience

---

## Phase 1: Three.js 3D Animation System

### 1.1 Hero Scene Upgrade (PremiumHero.tsx + HeroScene.tsx)
**Current**: Basic constellation particle field
**Target**: World-class interactive 3D hero

**New Three.js Scenes to Create:**
- `src/components/three/WordMarkScene.tsx` - Interactive 3D wordmark/logo with morphing geometry
- `src/components/three/ParticleFieldScene.tsx` - Advanced particle system with flow fields, noise, mouse interaction
- `src/components/three/GlobeScene.tsx` - Interactive 3D globe showing global presence (5+ countries)
- `src/components/three/NetworkScene.tsx` - Tech network visualization (nodes = services, edges = connections)

**HeroScene.tsx Refactor:**
- Replace ConstellationScene with lazy-loaded scene selector
- Add scene transition system (cross-fade between scenes on scroll/hover)
- Implement performance budgets: <16ms frame, <100MB GPU memory
- Add WebGL2 detection with Canvas 2D fallback

### 1.2 Section Background Scenes
Create reusable Three.js background components for key sections:
- `src/components/three/ServiceOrbitScene.tsx` - Orbiting service icons around central core (PremiumServices)
- `src/components/three/ProjectConstellationScene.tsx` - Project nodes connected by tech stack lines (FeaturedProjects)
- `src/components/three/TeamGalaxyScene.tsx` - Team members as stars in a galaxy (PremiumAbout)
- `src/components/three/TestimonialOrbitScene.tsx` - Rotating testimonial cards in 3D space (Testimonials)

### 1.3 Three.js Infrastructure
- `src/lib/three/` folder structure:
  - `core/Renderer.ts` - Shared WebGLRenderer with performance monitoring
  - `core/SceneManager.ts` - Scene lifecycle, resize, dispose
  - `core/PostProcessing.ts` - Bloom, FXAA, tone mapping (optional, perf-budgeted)
  - `shaders/` - Custom GLSL shaders (noise, flow, glow, displacement)
  - `utils/PerformanceMonitor.ts` - FPS, GPU memory, auto-quality scaling
  - `utils/ReducedMotion.ts` - Respects prefers-reduced-motion globally
- `src/hooks/useThreeScene.ts` - React hook for scene lifecycle
- `src/components/three/Canvas.tsx` - Wrapper with Suspense, error boundary, resize handling

---

## Phase 2: UI/UX Audit & Premium Elevation

### 2.1 Design System Overhaul
**Current Issues**: Inconsistent spacing, mixed color usage, basic shadows, no cohesive motion language

**Deliverables:**
- `src/styles/design-tokens.ts` - Centralized design tokens (colors, spacing, typography, shadows, radii, z-index, transitions, easings)
- `src/styles/motion-tokens.ts` - Framer Motion variants, durations, easings, stagger configs
- Update `tailwind.config.js` to use design tokens
- Update `src/index.css` with CSS custom properties from tokens

**Color System (Premium Tech Palette):**
```ts
// Primary: Deep indigo (#1e3a8a → #3b82f6)
// Accent: Vibrant orange (#f97316)
// Secondary: Teal (#0d9488)
// Neutral: Slate 50-950 (not gray)
// Success: Emerald, Warning: Amber, Error: Rose
// Dark mode: Slate 950 base, 800/700 surfaces
```

**Typography Scale:**
- Display: clamp(3rem, 8vw, 6rem) / 1.1
- H1: clamp(2.5rem, 5vw, 4rem) / 1.15
- H2: clamp(2rem, 4vw, 3rem) / 1.2
- H3: 1.5rem / 1.3
- Body: 1rem / 1.6 (1.125rem lg)
- Small: 0.875rem / 1.5

**Spacing System:** 4px base (0.25rem), 8-step scale (4, 8, 12, 16, 24, 32, 48, 64, 96)

**Shadow System:** 5 elevations (subtle → dramatic) with colored shadows for primary/accent

### 2.2 Component Library Standardization
**Audit all components for:**
- Consistent prop interfaces (className, children, asChild pattern)
- Proper TypeScript types with JSDoc
- Framer Motion variants using motion-tokens
- Accessibility (ARIA, keyboard, focus-visible)
- Dark mode support
- Responsive breakpoints (xs, sm, md, lg, xl, 2xl)

**Components to Refactor:**
- `Button` variants (primary, secondary, ghost, outline, 3D/magnetic)
- `Card` (elevated, outlined, filled, interactive, spotlight)
- `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`
- `Badge`, `Tag`, `Avatar`, `Divider`, `Tooltip`, `Modal`, `Dropdown`
- `SectionContainer` - consistent max-width, padding, background patterns

### 2.3 Page-by-Page UX Audit & Enhancement

#### Home Page (/)
- **Hero**: 3D wordmark + particle field + scroll indicator + trust badges
- **About Teaser**: Mission/Vision/Values with 3D team galaxy background
- **Services**: Interactive 3D orbit scene, hover reveals details
- **Projects**: 3D constellation, filter by category
- **Why Choose Us**: Animated stat counters, 3D icon hover effects
- **Testimonials**: 3D carousel, auto-rotate, keyboard nav
- **CTA**: Dual-action, floating stats, 3D background
- **Footer**: Newsletter, links, social, 3D aurora background

#### Services Page (/services)
- Category filters with animated transitions
- Service detail cards with 3D icon previews
- Process timeline (3D stepped visualization)
- Tech stack cloud (interactive 3D tags)
- FAQ accordion with smooth animations

#### Projects Page (/projects)
- Masonry grid with 3D tilt cards
- Category filter pills (animated)
- Project detail modal with 3D gallery
- Case study layout: Challenge → Solution → Results → Tech Stack

#### About Page (/about)
- Team 3D galaxy with hover profiles
- Values with animated icons
- Timeline with scroll-triggered 3D milestones
- Client logos marquee (infinite scroll, 3D perspective)

#### Contact Page (/contact)
- 3D floating form fields
- Interactive map (Mapbox GL or 3D globe)
- Contact methods with icons
- FAQ accordion

### 2.4 Motion & Interaction System
**Framer Motion Patterns:**
- Page transitions: fade + slide (300ms, ease-out-expo)
- Scroll reveals: `whileInView` with `once: true`, stagger children
- Hover/tap: `whileHover` scale 1.02, `whileTap` scale 0.98
- Magnetic buttons: `useMotionValue` + spring
- 3D tilt: `react-tilt` or custom with `useTransform`
- Stagger containers: 0.05-0.1s per child
- Micro-interactions: loading states, form validation, toast notifications

**Performance Rules:**
- `will-change` only on animating elements
- `transform`/`opacity` only for 60fps
- `layout` prop for FLIP animations
- Reduce motion: disable all non-essential animation

---

## Phase 3: Performance & Accessibility

### 3.1 Performance Budget
- **LCP**: <2.5s (targets: 1.8s)
- **FID**: <100ms
- **CLS**: <0.1
- **TTI**: <3.5s
- **Bundle**: <200KB gzipped (JS), <50KB CSS
- **Three.js**: <50KB gzipped (tree-shaken, lazy-loaded)
- **Images**: WebP/AVIF, responsive, lazy-loaded, LQIP

### 3.2 Three.js Performance
- InstancedMesh for particle systems
- GPU frustum culling
- Level-of-detail (LOD) for complex geometries
- Shader-based animations (avoid CPU→GPU per frame)
- `requestAnimationFrame` throttling on background tabs
- `IntersectionObserver` to pause off-screen scenes
- `prefers-reduced-motion`: static fallback images
- Mobile: reduce particle count 50%, disable post-processing

### 3.3 Accessibility (WCAG 2.1 AA)
- Semantic HTML5 landmarks
- Color contrast: 4.5:1 (text), 3:1 (UI)
- Focus indicators: 2px solid primary, offset 2px
- Keyboard navigation: all interactive elements
- ARIA labels, roles, live regions
- `prefers-reduced-motion`: disable animations
- `prefers-contrast`: high contrast mode
- Screen reader: skip links, heading hierarchy, alt text
- Form validation: `aria-invalid`, `aria-describedby`

---

## Phase 4: Implementation Sequence

### Sprint 1: Foundation (Week 1)
1. Design tokens & motion tokens
2. Tailwind config update
3. CSS custom properties
4. Base component library (Button, Card, Input, etc.)
5. Three.js infrastructure (Renderer, SceneManager, hooks)

### Sprint 2: Hero & Core 3D (Week 2)
1. WordMarkScene (3D logo)
2. ParticleFieldScene (hero background)
3. HeroScene refactor with scene transitions
4. PremiumHero integration
5. Performance monitoring

### Sprint 3: Section 3D Backgrounds (Week 3)
1. ServiceOrbitScene
2. ProjectConstellationScene
3. TeamGalaxyScene
4. TestimonialOrbitScene
6. Integrate into PremiumServices, FeaturedProjects, PremiumAbout, Testimonials

### Sprint 4: Pages & Polish (Week 4)
1. Home page full integration
2. Services page
3. Projects page
4. About page
5. Contact page
6. Global polish (micro-interactions, loading states, error boundaries)

### Sprint 5: QA & Launch (Week 5)
1. Performance audit (Lighthouse, WebPageTest)
2. Accessibility audit (axe, manual keyboard/test)
3. Cross-browser testing (Chrome, Firefox, Safari, Edge)
4. Mobile testing (iOS Safari, Chrome Android)
5. Bundle analysis, tree-shaking verification
6. Deploy to staging, stakeholder review
7. Production deploy

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Three.js bundle size | High | Tree-shake, lazy-load scenes, code-split by route |
| Mobile performance | High | Reduced particle counts, disable post-processing, static fallbacks |
| Accessibility regression | High | Automated CI checks (axe-core), manual testing checklist |
| Browser compatibility | Medium | WebGL2 detection, Canvas 2D fallback, polyfills |
| Animation jank | Medium | `will-change`, transform-only, FLIP, RAF throttling |
| Content flashing | Low | Skeleton loaders, Suspense boundaries, critical CSS |

---

## Success Metrics

- Lighthouse Performance: ≥95
- Lighthouse Accessibility: 100
- Lighthouse Best Practices: 100
- Lighthouse SEO: 100
- 3D scenes: 60fps desktop, 30fps mobile
- Bundle size: <200KB JS gzipped
- Zero console errors/warnings
- Zero accessibility violations (axe-core)

---

## Out of Scope
- Backend/API changes
- CMS integration
- E-commerce functionality
- Multi-language/i18n
- User authentication flows
- Admin panel redesign

---

## Next Steps
1. Review and approve this plan
2. Confirm design direction (provide Figma/design references if available)
3. Confirm Three.js scene priorities (which 3 scenes for MVP)
4. Begin Sprint 1 implementation
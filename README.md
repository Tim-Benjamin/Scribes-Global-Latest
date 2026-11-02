# Scribes Global — full frontend redesign (motion)

Every public page has been rebuilt with a new layout and motion system. All page copy, images, links, forms and data
loading are the same as before; only the presentation changed. The admin dashboard is untouched.

## How to apply (important)

1. **Replace your whole `src` folder** with the one in this zip (don't merge it over the old one). Many old design files
   were removed and new ones added, so merging would leave dead files behind. If you made your own edits inside `src`
   since the last zip, copy those somewhere first.
2. Replace `package.json`, `package-lock.json` and `vite.config.ts` with the ones here.
3. Run `npm install` (adds the self-hosted Raleway font package, `@fontsource-variable/raleway`).
4. Run `npm run dev`. If anything looks stale, stop the server, delete `node_modules/.vite`, and start it again.
   In the browser, a hard refresh (Ctrl+Shift+R) clears an old service worker.

## What changed

**Site-wide**
- Intro preloader (counts in, cycles Poetry / Worship / Spoken word / Music / Dance / Khoros), shown once per visit.
- Colour-shifting pages: the whole background tweens between paper, night, purple, magenta and cyan as you scroll.
- Smooth scrolling (Lenis + GSAP ScrollTrigger), route curtain between pages, custom cursor with labels on desktop.
- Full-screen menu with a live WebGL brand-colour field; new footer with a kinetic "Create. Connect. Impact." sign-off.
- Shared motion kit in `src/fx/`: split-text reveals, scroll-inked paragraphs, velocity marquees, pinned horizontal
  scroll, stacked cards, image wipes and parallax, expand-to-fullscreen media, hover-preview lists, draggable rails,
  image trails, spinning badges, magnetic buttons, count-ups.
- Each page's copy now lives in `src/content/<page>.ts`, so text edits don't mean touching layout code.

**Pages rebuilt:** Home, About, Ministries, Project H.E.A.L, Project M.O.V.E, Chapters + chapter pages, Events + event
pages, Media, Blog + posts, Invite Us, Volunteer, 404.

**Performance and accessibility**
- The old three.js background scene is gone; the bundle dropped from about 2.2 MB to 1.4 MB.
- `prefers-reduced-motion` is respected everywhere (content shows immediately, no scroll choreography).
- Checked at 1440px and 390px: no horizontal scrolling, one H1 per page, no runtime errors, designed empty states when
  Supabase returns no rows.

## Fixed while verifying
- The menu's WebGL background rendered at 60fps on every page even while the menu was closed. It now pauses.
- Stacked cards (Volunteer page) started pitch black because of how the brightness tween began; fixed.
- Big hero titles could break inside a word ("MINIS / TRIES", "SCR / IBES"); titles now size to their longest word.
- Chapters hero title ran off-screen; blog list rows misaligned on phones; a stray cursor ring showed on touch screens.

## Known, unchanged
- `npx eslint src` still reports the same `set-state-in-effect` pattern in seven older data hooks (`useHomeData`,
  `useChapter`, `useChapters`, `useEvent`, `useEvents`, `useMediaPage`, `useVolunteerOpportunities`) and the
  `router.tsx` export warning. They work correctly; I left them for the backend pass.

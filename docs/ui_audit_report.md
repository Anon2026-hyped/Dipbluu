# UI Audit Report — Dipbluu

## Overview
This audit focuses on cross-platform UI inconsistencies reported for the navigation bar and hero section, with a goal to identify alignment issues (Windows vs mobile), propose fixes, implement changes, and document results.

## Audit Methodology
- Reviewed frontend components: `components/layout/Navbar.tsx`, `components/sections/Hero.tsx`, `components/layout/MenuOverlay.tsx` and global styles `app/globals.css` and `tailwind.config.ts`.
- Reproduced a production build to ensure changes do not break compilation.
- Focused on CSS layout, Tailwind usage, and cross-platform behaviors (scrollbars, font metrics, cursors).

## Findings
- Navbar content was not wrapped in a centered container; it used `max-w-full` which can lead to misaligned, edge-stuck layouts when viewport scrollbars or platform differences change available width.
- Navbar used `z-90` which is not a standard Tailwind utility; unknown classes are ignored by Tailwind and may result in unexpected stacking context behavior across platforms.
- Global `html` cursor was set to a custom SVG cursor which applies site-wide. This can cause subtle layout/UX differences across platforms (particularly Windows), and may change expected pointer behavior and hit-testing.
- The Hero section uses large, clamp-based typography which is responsive but can look visually different across OS font-rendering and metrics. No functional bug found, but spacing can feel different on Windows due to font metrics.

## Issues Identified
- Navigation alignment: lack of centered container and non-standard z-class.
- Global cursor override: applied globally instead of only on interactive elements.
- Potential visual variance in Hero typography across platforms (font rendering differences).

## Proposed Fixes
- Wrap the navbar inner content with a centered container (`max-w-6xl mx-auto w-full`) so content is visually centered independent of scrollbar/platform differences.
- Replace `z-90` with a valid Tailwind utility (e.g., `z-50`) to ensure consistent stacking and avoid ignored classes.
- Remove global `html` cursor declaration; keep custom cursor only on interactive elements (`a`, `button`, `[role="button"]`) to avoid global pointer/hit-test differences.
- (Optional) For consistent typography across platforms, consider using `line-height`, `font-weights`, or font-display adjustments, or fallback metrics; test on Windows with installed fonts and consider using `font-synthesis: none` or tighter fallbacks.

## Implemented Changes
1. Centered Navbar content and fixed z-index utility
   - File: `components/layout/Navbar.tsx`
   - Change: inner wrapper `max-w-full` → `max-w-6xl mx-auto w-full`; `z-90` → `z-50`.
2. Scoped custom cursor to interactive elements only
   - File: `app/globals.css`
   - Change: removed global `html { cursor: ... }` declaration. Custom cursor remains applied to `a`, `button`, `[role="button"]`.

These edits were kept minimal and non-invasive to preserve existing functionality.

## Implemented Changes — Code References
- Centering and z-index fix: [components/layout/Navbar.tsx](components/layout/Navbar.tsx)
- Cursor scoping: [app/globals.css](app/globals.css)

## Conclusion
- The primary misalignment issue likely stemmed from an un-centered navbar layout combined with an ignored/non-standard Tailwind class. Centering the nav content and using a valid `z-50` utility standardizes layout across platforms.
- Scoping the custom cursor to interactive elements avoids global pointer peculiarities on Windows and other platforms.
- No TypeScript or build errors resulted from these changes; Next build remains green.

If you'd like, next steps I can take:
- Run visual snapshots on Windows/macOS (via Playwright or Percy) to confirm pixel parity.
- Tweak typography for platform parity (font fallbacks, explicit metrics).
- Add a small responsive test page and screenshots to `docs/` for visual evidence.

---
Audit completed and saved in this file.

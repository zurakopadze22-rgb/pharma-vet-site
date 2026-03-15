# Copilot instructions for `pharma-vet` (React + Vite)

Quick, focused guidance to help an AI contributor be productive in this repo.

**Project overview**
- Single-page React app scaffolded with Vite. Entry: `src/main.jsx` → `src/App.jsx`.
- Routing and navigation are handled with `react-router-dom` (see `src/App.jsx`).
- Styling: Tailwind CSS (config in `tailwind.config.js`, main stylesheet `src/index.css`).
- Static data lives in `src/data/` (notably `products.js`, `blogData.js`, `partners.js`).

**Key architectural patterns**
- Components are simple functional React components under `src/components/`.
- Translation pattern: `translations` exported from `src/translations.js`; components receive `t` or `lang` props and expect localized strings from this object.
- Parent (App) passes down click handlers like `onProductClick`, `onArticleClick`, and `onPartnerClick` which call `navigate(...)` using `react-router-dom`.
- Routes to note (defined in `src/App.jsx`):
  - `/` (home)
  - `/products` (catalog)
  - `/product/:slug` (product detail by slug)
  - `/blog` and `/blog/:slug` (blog list/detail by slug)
  - `/partners` and `/partner-detail` (partner-detail uses `navigate` state)
  - `/become-partner`, `/about`
  - fallback (`*`) renders `Hero` component

**Data & routing conventions**
- Product and blog detail pages use a `slug` param. When adding resources, ensure each entry in `src/data/*` includes a stable `slug` string.
- Partner detail currently uses `navigate('/partner-detail', { state: { partner } })`. Keep that pattern or migrate both sides to slug-based routes if converting.

**Developer workflow / commands**
- Install: `npm install`
- Run dev server: `npm run dev` (Vite with HMR)
- Build: `npm run build`
- Preview production build locally: `npm run preview`
- Lint: `npm run lint` (ESLint config: `eslint.config.js`)

If you change build/dev behavior, update `package.json` scripts and `vite.config.js` as needed.

**Integration points**
- Analytics: `@vercel/analytics` is used in `src/App.jsx`.
- Public static files: `public/` (images, robots, sitemap). Use absolute URLs for schema/SEO where appropriate.

**Codebase-specific conventions and tips for changes**
- Text/labels: use the translations object—update `src/translations.js` rather than hardcoding strings in components.
- Props: many components expect `t` (translation object) and `lang`. Preserve these prop names to avoid breaking callers.
- When adding a new component view, register the route in `src/App.jsx` and add the `setView`/`view` integration used by `Navbar` if the route should change the active nav state.
- When adding images, prefer `public/images/` for static assets referenced in markup and absolute URLs for external assets.
- Keep components small and prop-driven; follow existing style (no class components, hooks-based, function components).

**Examples**
- Add product: add object with `{ id, slug, title: { GE, EN }, description: {...}, price, image }` to `src/data/products.js`. The product list and `ProductDetail` already read from `productsData`.
- Add blog: add item with `slug` to `src/data/blogData.js` and the existing `Blog`/`BlogDetail` routes will pick it up.

**What not to change lightly**
- Routing structure in `src/App.jsx` (changes affect navigation and state passed to `PartnerDetail`).
- `translations` shape—many components expect `t.someSection` objects.
- `Navbar` props and how `view` is computed (it uses `location.pathname` logic in `App.jsx`).

If anything in these instructions seems incomplete or you want samples (e.g., how to add a slug-based partner route), tell me which area to expand and I will update this doc.

# Deploying kayomestiza.com (static, no backend)

The public site is a static build of `frontend/`. It no longer calls the FastAPI backend
in `backend/`; that code (admin page, AI concierge, database) is kept for reference only.

## Cloudflare Pages settings

| Setting | Value |
| --- | --- |
| Root directory | `frontend` |
| Build command | `yarn build` |
| Output directory | `dist` |
| Environment variable | `NODE_VERSION` = `22` |
| Environment variable | `VITE_WEB3FORMS_KEY` = your Web3Forms access key |

`yarn.lock` is committed on purpose: the npm installer fails on this dependency tree.

## Forms

Catering, contact and drop-alert forms post to Web3Forms, which emails each entry to the
inbox the access key belongs to. Without `VITE_WEB3FORMS_KEY` the forms show an error toast.

## Editing content

- Contact details and the launch countdown: `frontend/src/hooks/useSettings.ts` and `frontend/src/data/menu.ts`
- Pop-up schedule: `frontend/src/data/schedule.ts` (empty = "delivery only" note)
- Menu and photos: `frontend/src/data/menu.ts`, `frontend/public/images/`

Push to `main` and Cloudflare rebuilds the site.

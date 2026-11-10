# NRC Autonomous Cyber Research: website

Static website built with [Astro](https://astro.build) and published on GitHub Pages at
**https://nrc-acsl.github.io/**.

## Run locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # production build in dist/
```

## Publishing

Every push to `main` builds and deploys the site automatically (`.github/workflows/deploy.yml`).
One-time setup: in the repo go to **Settings → Pages → Source** and choose **GitHub Actions**.

The site expects a repo named `nrc-acsl.github.io` under the `nrc-acsl` account. For a different
repo name (e.g. `nrc-acsl/website`), set `base: '/website'` in `astro.config.mjs`.

## Editing content (no coding needed)

| What | Where | How |
|---|---|---|
| Site name, email, social links, contact form | `src/site.config.ts` | Edit the values |
| Menu | `src/site.config.ts` → `NAV` | Add/remove items |
| News, blog posts, events | `src/content/news/*.md` | Copy an existing file and edit it |
| People (current & past) | `src/content/people/*.md` | One file per person. Add an `alumni:` block to move someone to "Past members" |
| Projects (research portfolio) | `src/content/projects/*.md` | One file per project |
| Publications | `src/content/publications.yaml` | Copy a block. `people:` links it to team profiles |
| Research areas | `src/content/areas.yaml` | Edit the list |
| Tools & datasets | `src/content/tools.yaml` | Edit the list |
| Open positions | `src/pages/get-involved.astro` → `positions` | Edit the list |
| Photos | `public/images/people/` | Add the file, then set `photo: /images/people/name.jpg` |

File names become URLs: `src/content/people/jane-doe.md` → `/people/jane-doe/`.
If a field is wrong or missing, `npm run build` stops and says which file and field to fix.

### Contact form

The form uses [Formspree](https://formspree.io) (free tier: 50 messages/month). Create a form, then put its
ID in `formspreeId` in `src/site.config.ts`. Until then the form shows a "demo mode" message.

### Logo & colours

- Logo: `src/components/Logo.astro` (placeholder) and `public/favicon.svg`
- Colours and fonts: the variables at the top of `src/styles/global.css`

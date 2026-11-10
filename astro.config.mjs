import { defineConfig } from 'astro/config';

// For a repo named "nrc-acsl.github.io" the site lives at the root, so base is "/".
// If you deploy from a project repo instead (e.g. github.com/nrc-acsl/website),
// set base to '/website'.
export default defineConfig({
  site: 'https://nrc-acsl.github.io',
  base: '/',
  trailingSlash: 'ignore',
});

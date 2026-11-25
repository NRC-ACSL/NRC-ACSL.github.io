# Profile photos

Put each person's headshot in this folder, then reference it from their
Markdown file in `src/content/people/<id>.md` using a root-relative path:

```yaml
photo: /images/people/<id>.jpg
```

Guidelines:
- Name the file after the person's id, e.g. `shahrear-iqbal.jpg`.
- Use a square-ish headshot (e.g. 400×400); avatars are cropped to a circle/square.
- `.jpg`, `.png`, or `.webp` all work (`.webp` is smallest).
- The path in frontmatter must start with `/` and must NOT include `public`.

If a person has no `photo:` set, the site shows their initials instead.

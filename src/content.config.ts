import { defineCollection, z, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';

// Research areas: src/content/areas.yaml
const areas = defineCollection({
  loader: file('src/content/areas.yaml'),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    icon: z.enum(['shield', 'target', 'chart', 'person']),
    summary: z.string(),
    description: z.string(),
  }),
});

// People: one Markdown file per person in src/content/people/
const people = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/people' }),
  schema: z.object({
    name: z.string(),
    title: z.string(), // job title shown on cards
    group: z.enum(['leadership', 'researcher', 'engineer', 'postdoc', 'student', 'advisor']),
    order: z.number().default(100),
    photo: z.string().regex(/^\//, 'photo must be a root-relative path, e.g. /images/people/jane.jpg').optional(),
    email: z.string().email().optional(),
    website: z.string().url().optional(),
    github: z.string().url().optional(),
    scholar: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    interests: z.array(z.string()).default([]),
    // Set alumni to move someone to "Past members". "now" = where they went next.
    alumni: z.object({ years: z.string(), now: z.string().optional() }).optional(),
  }),
});

// Projects (research portfolio): one Markdown file per project in src/content/projects/
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    area: reference('areas'),
    status: z.enum(['Active', 'Completed', 'Planned']),
    summary: z.string(),
    start: z.number(),
    end: z.number().optional(),
    lead: reference('people').optional(),
    team: z.array(reference('people')).default([]),
    partners: z.array(z.string()).default([]),
    repo: z.string().url().optional(),
    featured: z.boolean().default(false),
  }),
});

// News, blog posts and events: one Markdown file per post in src/content/news/
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    type: z.enum(['News', 'Blog', 'Event', 'Report']),
    summary: z.string(),
    author: reference('people').optional(),
    area: reference('areas').optional(),
    cover: z.enum(['rings', 'bars', 'wave', 'grid', 'nodes']).default('nodes'),
    featured: z.boolean().default(false),
    eventDate: z.string().optional(),
    location: z.string().optional(),
  }),
});

// Publications: all in one file, src/content/publications.yaml
const publications = defineCollection({
  loader: file('src/content/publications.yaml'),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    // Team members who co-authored it (file names in src/content/people), so it shows on their profile
    people: z.array(reference('people')).default([]),
    venue: z.string(),
    year: z.number(),
    type: z.enum(['Conference', 'Journal', 'Preprint', 'Workshop', 'Report', 'Thesis']),
    area: reference('areas').optional(),
    pdf: z.string().url().optional(),
    doi: z.string().optional(), // bare DOI, e.g. 10.1000/xyz (rendered as https://doi.org/<doi>)
    code: z.string().url().optional(),
    award: z.string().optional(),
    bibtex: z.string().optional(),
  }),
});

// Open-source tools & datasets: src/content/tools.yaml
const tools = defineCollection({
  loader: file('src/content/tools.yaml'),
  schema: z.object({
    name: z.string(),
    kind: z.enum(['Tool', 'Dataset', 'Benchmark', 'Library']),
    summary: z.string(),
    repo: z.string().url().optional(),
    docs: z.string().url().optional(),
    license: z.string().optional(),
    area: reference('areas').optional(),
  }),
});

export const collections = { areas, people, projects, news, publications, tools };

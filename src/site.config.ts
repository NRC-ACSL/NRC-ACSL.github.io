// Global site settings. Change the name here and it updates everywhere.
export const SITE = {
  name: 'Shahrear Iqbal',
  shortName: 'Shahrear Iqbal',
  tagline: 'Autonomous Cyber Security Research',
  description:
    'Research scientist working on autonomous cyber defence: AI agents that detect, reason about and respond to threats, safely and accountably.',
  parentOrg: 'National Research Council Canada',
  email: 'AutonomousCyber-CybersecuriteAutonome@nrc-cnrc.gc.ca',
  location: 'Ottawa, Ontario, Canada',
  socials: {
    github: 'https://github.com/nrc-acsl',
    linkedin: 'https://www.linkedin.com/',
  },
};

// The person who owns this site. Kept in the people collection so existing
// author/lead/team/publication references resolve, but hidden from people listings.
export const OWNER = 'shahrear-iqbal';

// Google Scholar author id (the `user=` value in the profile URL).
// Used by scripts/fetch-publications.mjs to auto-populate publications.yaml.
export const SCHOLAR_AUTHOR_ID = 'cXS5b4sAAAAJ';

export const NAV = [
  { label: 'About', href: '/about/' },
  { label: 'Research', href: '/research/' },
  { label: 'Publications', href: '/publications/' },
  { label: 'Blog', href: '/news/' },
  { label: 'People', href: '/people/' },
  { label: 'Collaborate', href: '/get-involved/' },
];

import { execSync } from 'node:child_process';

const repo = process.argv[2] || 'tai';
process.env.VITE_BASE_PATH = `/${repo}/`;

execSync('tsc && vite build && node scripts/copy-404.mjs', {
  stdio: 'inherit',
  env: process.env,
});

console.log(`\nBuild ready for GitHub Pages at /${repo}/`);

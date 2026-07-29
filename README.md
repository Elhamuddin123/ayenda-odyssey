# Ayenda Odyssey

Production foundation for the Ayenda Odyssey interactive experience.

## Requirements

- Node.js 20.9 or newer
- npm 10 or newer

## Local development

```bash
npm install
copy .env.example .env.local
npm run dev
```

## Quality commands

```bash
npm run lint
npm run typecheck
npm run format:check
npm test
npm run build
```

## Test tooling

Install Playwright browsers before running browser tests:

```bash
npx playwright install chromium
npm run test:e2e
```

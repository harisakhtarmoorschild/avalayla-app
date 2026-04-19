# Ava & Layla Learn Together

Custom learning app for Ava and Layla — spelling, vocabulary, writing, and maths.

## Deploying

Deploy to Vercel. In Vercel project settings, add one environment variable:
- `ANTHROPIC_API_KEY` — the secret Anthropic API key (starts `sk-ant-api03-...`)

Firebase is already configured in `src/firebase.js` and does not need environment variables.

## How it works

- Scores sync in real time between both iPads via Firebase Firestore
- AI writing feedback is provided via a serverless Vercel function that calls Anthropic Claude
- The `ANTHROPIC_API_KEY` is never exposed to the browser — only used server-side

## Local development

```
npm install
npm run dev
```

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test framework is configured yet.

## Stack

- **Next.js 16** with App Router (`src/app/`)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (configured via `@tailwindcss/postcss`)
- Fonts: Geist Sans and Geist Mono via `next/font/google`

## Documentation

**IMPORTANT:** Before generating any code, always check the `/docs` directory for relevant documentation files. Read and follow any applicable docs before writing or modifying code. The `/docs` directory is the source of truth for implementation guidance, conventions, and feature specs in this project.

- /docs/ui.md
- /docs/data-fetching.md
- /docs/data-mutations.md

## Architecture

This is a fresh Next.js App Router project. The entry point is `src/app/page.tsx`. The root layout (`src/app/layout.tsx`) wraps all pages and sets up global fonts and metadata.

The app is intended to be built out as a lifting diary — currently at the initial scaffold stage.

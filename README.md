# SWAPI Explorer

A Next.js + TypeScript web application for browsing, searching, sorting, and paginating through Star Wars universe data, powered by the [SWAPI](https://swapi.dev) public API.

[Live Demo](https://fe-developer-task.vercel.app/) — to be updated with the deployed URL

---

## Tech Stack

- [Next.js](https://nextjs.org) (App Router)
- TypeScript
- CSS Modules
- Jest + React Testing Library
- [SWAPI](https://swapi.dev)

## Features

- Browse all 6 SWAPI categories: Films, People, Planets, Species, Starships, Vehicles
- Server-side search powered by the SWAPI `?search=` endpoint
- Client-side sorting (ascending/descending) applied to the current page's results
- Paginated results (10 per page) with Prev/Next navigation
- Full controls state (category, search, sort, order, page, recent category) persisted in the URL — shareable and bookmarkable
- Detail page for every item, with linked references to related resources
- WCAG 2.2 Level A/AA accessibility compliance
- Clear loading and error states throughout
- Use system light and dark mode (prefers-color-scheme)

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Landing page
│   └── [category]/[id]/  # Detail page (server component)
├── components/           # Reusable UI components (co-located with CSS Modules and tests)
├── hooks/                # Custom React hooks
├── lib/
│   ├── data.ts           # Constants and static config
│   ├── helper.ts         # Utility/helper functions
│   └── swapi.ts          # SWAPI fetch utilities
└── types/                # Shared TypeScript interfaces
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

## Running Tests

Tests are co-located next to the files they test and written with Jest + React Testing Library. The suite focuses on user behaviour — what the user sees and can do — rather than internal implementation details. Coverage includes hooks, components, page-level integration, and accessibility expectations.

```bash
pnpm test           # run all tests
pnpm test:watch     # watch mode
```

## Acceptance Criteria Coverage

| Requirement | Implementation |
|---|---|
| Search via all available categories | Category select with all 6 SWAPI endpoints |
| Full list of relevant data | Paginated fetch with total count displayed |
| Sort by name or title | Client-side sort applied per page, direction toggle |
| Error message for invalid requests | `role="alert"` error state in `DataTable` |
| Transportation fields (Name, Model, etc.) | Starships and Vehicles columns explicitly defined |
| Most recently searched category | `?recent=` URL param updated on category switch |
| Retain search and sort state between categories | URL params preserved on category change |
| WCAG 2.2 Level A/AA | Semantic HTML, labels, keyboard nav, focus styles, ARIA roles |
| Loading state | Spinner with `role="status"` shown during fetch |
| CSS Modules | All components styled exclusively with CSS Modules |

## AI Assistance

This project was built with the assistance of Claude (by Anthropic) across several stages of development:

- **Project scaffolding** — setting up the Next.js project structure, folder conventions, and base configuration
- **UI implementation** — generating the initial component structure, page layouts, and CSS Module styling
- **Feature prompting** — pagination, server-side search, and URL-based state persistence were implemented by passing structured prompts to Claude Code in VS Code
- **Unit tests** — the Jest + React Testing Library test suite was generated with AI assistance, covering hooks, components, and accessibility expectations
- **This README** — drafted with AI assistance

In all cases, the overall architecture, code structure decisions, and direction were led and reviewed by the developer. Claude operated as a pair-programming assistant rather than an autonomous agent.

The full prompt engineering conversation that guided this build can be viewed here: [View Claude conversation](https://claude.ai/share/8bda16bd-00b3-427b-8429-21583b5c6668)

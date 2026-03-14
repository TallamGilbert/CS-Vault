# DevVault

A curated vault of CS learning resources, parsed in real-time from 10 top GitHub repositories.

## Architecture

```
Next.js App Router
├── Frontend (React + Tailwind)
│   ├── Home: Hero → Stats → Source Grid
│   ├── Browse: Category accordion → Resource list
│   └── Search: Full-screen overlay with ranked results
│
└── Backend (API Routes)
    └── GET /api/resources
        ├── Fetches raw markdown from 10 GitHub repos
        ├── Parses into structured categories + resources
        ├── Caches in-memory (6h) + CDN edge (6h)
        └── Supports ?q= search, ?source= filter
```

## Data Sources

| Source                      | Owner           | Resources                |
| --------------------------- | --------------- | ------------------------ |
| CS Video Courses            | Developer-Y     | University CS lectures   |
| Scalable Architecture       | Developer-Y     | System design resources  |
| Technical Interviews        | Developer-Y     | Interview prep materials |
| Free Programming Books      | EbookFoundation | Free CS books            |
| Build Your Own X            | codecrafters-io | Hands-on project guides  |
| System Design Primer        | donnemartin     | System design concepts   |
| Coding Interview University | jwasham         | CS study plan            |
| Awesome Python              | vinta           | Python ecosystem         |
| Awesome React               | enaqx           | React ecosystem          |
| Public APIs                 | public-apis     | Free developer APIs      |

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Fonts:** General Sans (headings) + IBM Plex Sans/Mono (body)
- **Deploy:** Vercel (zero-config)

## Design System

| Token         | Dark Mode | Light Mode | Usage                           |
| ------------- | --------- | ---------- | ------------------------------- |
| Accent        | `#F49586` | `#F49586`  | Buttons, links, highlights      |
| Background    | `#0B0E11` | `#FDFDFD`  | Page background                 |
| Surface       | `#13161a` | `#F6F6F6`  | Cards, inputs                   |
| Elevated      | `#191d22` | `#F0F0F0`  | Hover states, elevated surfaces |
| Text          | `#E6E6E6` | `#1E1E1E`  | Primary text                    |
| Text muted    | `#8b9099` | `#646464`  | Secondary text                  |
| Text dim      | `#5c6370` | `#969696`  | Tertiary text                   |
| Border        | `#3A3F45` | `#DCDCDC`  | Active borders                  |
| Border subtle | `#262a2f` | `#E6E6E6`  | Default borders                 |

### UI Features

- **Dark/Light Mode Toggle** — Click the sun/moon icon in the navbar to switch themes. Your preference is saved to localStorage
- **Layout Toggle** — Switch between list and grid views when browsing resource categories
- **Accent Color Outlines** — Visual indicators like the ESC button use the accent color for better visibility

## Setup

```bash
# Install dependencies
npm install

# Copy environment file (optional — for higher GitHub rate limits)
cp .env.example .env.local

# Start dev server
npm run dev

# Open http://localhost:3000
```

## API

### `GET /api/resources`

Full data dump with stats.

### `GET /api/resources?q=algorithms`

Search mode — returns ranked results.

### `GET /api/resources?source=cs-courses`

Filter by source ID.

### `GET /api/resources?refresh=1`

Bust the in-memory cache.

## File Structure

```
devvault/
├── app/
│   ├── api/resources/route.ts    API endpoint
│   ├── globals.css               Global styles + theme CSS variables
│   ├── layout.tsx                Root layout with ThemeProvider
│   └── page.tsx                  Homepage (client component)
├── components/
│   ├── browse/
│   │   └── ResourceBrowser.tsx   Category accordion + list/grid toggle
│   ├── home/
│   │   ├── Hero.tsx              Hero section with stats
│   │   ├── SourceCard.tsx        Individual source card
│   │   └── SourceGrid.tsx        Source grid with sorting
│   └── shared/
│       ├── Footer.tsx            Site footer
│       ├── LoadingSkeleton.tsx    Loading + error states
│       ├── Navbar.tsx            Fixed navigation bar with theme toggle
│       └── SearchOverlay.tsx     Full-screen search modal
├── contexts/
│   └── ThemeContext.tsx          Theme state management (dark/light)
├── hooks/
│   ├── useResources.ts           Data fetching hook
│   └── useSearch.ts              Debounced search hook
├── lib/
│   ├── cache.ts                  In-memory TTL cache
│   ├── fetcher.ts                GitHub content fetcher
│   ├── parser.ts                 Markdown → JSON parser
│   ├── search.ts                 Search engine with scoring
│   └── sources.ts                Source definitions (10 repos)
├── types/
│   └── index.ts                  TypeScript interfaces
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## License

MIT

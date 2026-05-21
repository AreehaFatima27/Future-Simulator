#Future Simulator

 AI-powered decision simulation app that helps you see your possible futures before making important choices.

![Tech Stack](https://img.shields.io/badge/Next.js-15-black) ![Supabase](https://img.shields.io/badge/Supabase-Backend-green) ![AI](https://img.shields.io/badge/AI-Groq%20Llama%203.3-purple) ![License](https://img.shields.io/badge/License-MIT-blue)
# Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Setup & Run Guide](#setup--run-guide)
- [Environment Configuration](#environment-configuration)
- [Folder Structure](#folder-structure)
- [How It Works](#how-it-works)
- [Team](#team)

## Overview

**Future Simulator** is an AI-powered web application designed to help users navigate complex life decisions by providing three distinct future scenarios — Best Case, Average Case, and Worst Case. Built during a 6-hour AI hackathon, the app combines cutting-edge AI with elegant design to solve a universal human problem: **decision uncertainty**.

### Problem We Solve
Every day, people face difficult decisions: career changes, relationships, investments, education paths. Most decision-making tools provide only one answer. Future Simulator provides **three perspectives**, empowering users to make informed choices.

### Target Users
- Students considering career paths
- Professionals facing job changes
- Adults making life decisions (relocation, marriage, etc.)
- Entrepreneurs evaluating business opportunities
- Anyone experiencing decision paralysis


## Features
### Core Features
 **AI-Powered Predictions** — Get three detailed future scenarios for any decision
**Best, Average, Worst Cases** — Comprehensive outlook on possible outcomes
 **Google OAuth Authentication** — Secure, one-click login
 **Auto-Save History** — All predictions automatically saved
 **History Management** — View, expand, and delete past simulations

### Advanced Features
 **"What If?" Re-Simulation** — Explore alternate scenarios within each prediction
 **Community Polling System** — Vote on which future seems most likely
 **Share Simulations** — Copy and share predictions with friends
 **Futuristic Glassmorphism UI** — Modern, animated, mobile-responsive design
 **Animated Starfield Background** — Sci-fi inspired aesthetic
 **Row-Level Security** — Database-level data isolation per user
---

##  Tech Stack
### Frontend
**Next.js 15** — React framework with App Router
**TypeScript** — Type-safe development
**Tailwind CSS** — Utility-first styling
**ShadCN UI** — Beautiful pre-built components
**Formik + Yup** — Form management & validation
**Moment.js** — Date formatting
**Sonner** — Toast notifications

### Backend
**Supabase** — Database, authentication, real-time
**PostgreSQL** — Relational database (via Supabase)
**Row Level Security (RLS)** — Data security policies

### AI
**Groq API (Llama 3.3 70B)** — Fast, reliable AI inference
**Structured JSON responses** — Reliable parsing

### Auth
-**Google OAuth 2.0** — Via Supabase Auth
---

##  Requirements

### System Requirements
 Node.js 18.x or higher
 npm or yarn package manager
 Modern web browser (Chrome, Firefox, Edge, Safari)
 Internet connection

### API Keys Required
Supabase Project (URL + Anon Key)
Groq API Key (free tier available)
Google OAuth Client (configured in Supabase)

### Dependencies
json
{
  "next": "15.x",
  "react": "^19.0.0",
  "typescript": "^5",
  "@supabase/supabase-js": "^2.x",
  "tailwindcss": "^4",
  "formik": "^2.x",
  "yup": "^1.x",
  "moment": "^2.x",
  "use-debounce": "^10.x",
  "sonner": "^1.x",
  "lucide-react": "^0.x"
}


##  Setup & Run Guide

### 1. Clone the Repository
```bash
git clone https://github.com/AreehaFatima27/hackathon-base.git
cd hackathon-base
```
### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root folder:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```
### 4. Set Up Supabase Database
Run the SQL from `src/db/init.sql` in your Supabase SQL Editor to create:
- `simulations` table with RLS policies
- `votes` table with RLS policies
- Google OAuth provider configuration
### 5. Run Development Server
```bash
npm run dev
```
### 6. Open in Browser
Navigate to:
```
http://localhost:3000
```
---

## Environment Configuration

Create `.env.local` in the project root with these variables:

| Variable    | Description | Required |
|-------------|-------------|----------|
|`NEXT_PUBLIC_SUPABASE_URL`| Your Supabase project URL |  Yes |
|`NEXT_PUBLIC_SUPABASE_ANON_KEY`| Your Supabase anon/public key |  Yes |
| `GROQ_API_KEY` | Your Groq API key for AI |  Yes |

 **Never commit `.env.local` to GitHub!** It's already in `.gitignore`.

A `.env.example` is provided as a template.


## Folder Structure

```
future-simulator/
├── src/
│   ├── app/                       # Next.js App Router pages
│   │   ├── api/
│   │   │   └── gemini/
│   │   │       └── route.ts       # AI API endpoint
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts       # OAuth callback handler
│   │   ├── history/
│   │   │   └── page.tsx           # History page
│   │   ├── layout.tsx             # Root layout with sidebar
│   │   ├── page.tsx               # Homepage / Landing
│   │   └── globals.css            # Global styles
│   │
│   ├── components/                # Reusable components
│   │   ├── ui/                    # ShadCN UI components
│   │   ├── Header.tsx             # Top header
│   │   ├── Sidebar.tsx            # Navigation sidebar
│   │   ├── SimulationForm.tsx     # Main simulation form
│   │   └── OutcomeCard.tsx        # Prediction card with What If
│   │
│   ├── hooks/                     # Custom React hooks
│   │   └── useAuth.ts             # Authentication hook
│   │
│   ├── utils/                     # Utility functions
│   │   ├── supabase.ts            # Supabase client + functions
│   │   └── types.ts               # TypeScript types
│   │
│   ├── db/                        # Database files
│   │   └── init.sql               # Database schema + RLS
│   │
│   └── lib/
│       └── utils.ts               # Helper utilities
│
├── public/                        # Static assets
├── .env.local                     # Environment variables (gitignored)
├── .env.example                   # Environment template
├── .gitignore
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---
## How It Works

### User Flow
```
1. User opens app → Beautiful landing page
2. Click "Continue with Google" → OAuth login
3. Redirected to dashboard with sidebar
4. Type situation/decision in textarea (10-500 chars)
5. Click "Predict My Future" → AI processes request
6. View 3 outcome cards (Best, Average, Worst)
7. Use "What If?" on any card for deeper analysis
8. Vote on which future seems likely (community polling)
9. Share simulation via copy link
10. Access history anytime via sidebar
11. Click any past simulation to view full details
```
### AI Integration Flow
```
User Input
    ↓
POST /api/gemini (server-side)
    ↓
Groq API call with structured prompt
    ↓
Llama 3.3 70B generates JSON response
    ↓
Parse and validate 3 scenarios
    ↓
Return to frontend
    ↓
Auto-save to Supabase
    ↓
Display beautiful cards
```
### Database Schema

**simulations table:**
```sql
id              UUID PRIMARY KEY
situation       TEXT
best_case       TEXT
average_case    TEXT
worst_case      TEXT
user_id         UUID (references auth.users)
created_at      TIMESTAMP
```

**votes table:**
```sql
id              UUID PRIMARY KEY
simulation_id   UUID (references simulations)
user_id         UUID (references auth.users)
vote_type       TEXT ('best', 'average', 'worst')
created_at      TIMESTAMP
UNIQUE(simulation_id, user_id)
```

---
## Security Features

-  API keys hidden in environment variables
- Gemini/Groq calls made server-side only
-  Row Level Security (RLS) on all database tables
- Users can only access their own data
- Google OAuth (no password storage)
- TypeScript prevents runtime type errors
- Input validation with Yup schemas

---

##  Future Roadmap
- Mobile app version (React Native)
- Multiple AI model comparison
- Advanced analytics dashboard
- Multilingual support
- Voice input for situations
- Email notifications for saved predictions
- Decision tracking (was your prediction accurate?)

---
##  Team

Built with love during a 6-hour AI Hackathon by:

- **Areeha Fatima** — Database and Backend (supabase, API , AI integration 
- **ALIZA SUFIYAN** —Frontend (UI Components, pages, user interaction) 
- **SAHER ASHFAQ** — Authentication , AI Prompt Generation, Deployment

---

## Acknowledgments

- **Supabase** for the amazing BaaS platform
- **Groq** for fast AI inference
- **ShadCN** for beautiful components
- **Vercel/Next.js** for the framework
- Hackathon organizers for the opportunity!

---
##  Future Roadmap
 Mobile & Accessibility
 Enhanced AI Capabilities
 Analytics & Insights
 Engagement & Notifications
 Community & Collaboration
## Long-Term Vision
- API for Third Parties
- Personality-Based Predictions
- Educational Integration

**See your future. Make better decisions.**
```
---
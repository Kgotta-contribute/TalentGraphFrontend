# 🌐 TalentGraph Frontend

[![React](https://img.shields.io/badge/React-19.2+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com)
[![Vite](https://img.shields.io/badge/Vite-7.1+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Puter.js](https://img.shields.io/badge/Puter.js-Cloud_OS-0070F3?style=for-the-badge)](https://puter.com)

**TalentGraph Frontend** is a modern recruitment and career intelligence platform. Built with **React 19**, **React Router v7**, and **Tailwind CSS v4**, it provides an intuitive dual-mode interface: **ResumeIQ (Candidate Diagnostic Mode)** for deep ATS audits and resume optimization, and **Six Agents (Recruiter Mode)** for automated job mandate extraction, skill gap verification, GitHub MCP codebase audits, deterministic scoring, and executive dossier synthesis.

---

## 📑 Table of Contents
- [Core Modes & Capabilities](#-core-modes--capabilities)
- [Architecture & Workflow](#-architecture--workflow)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Quick Start (Local Development)](#-quick-start-local-development)
- [Environment Configuration](#-environment-configuration)
- [Deployment Guide (Vercel)](#-deployment-guide-vercel)
- [Connecting Frontend to Railway Backend](#-connecting-frontend-to-railway-backend)

---

## 🎯 Core Modes & Capabilities

### 1. ResumeIQ — Candidate Mode
* **ATS Compatibility Scoring**: Multi-dimensional scoring across Content, Structure, Tone & Style, and Technical Skills.
* **Recruiter 7-Second Read**: Instant simulation of a human recruiter's first impression, identifying detected seniority, shortlist probability, and core archetypes.
* **Career Arc & Timeline Scan**: Chronological trajectory visualization that detects career gaps, progression, and real tenure.
* **Quantified Impact Ratio**: Analyzes resume bullet points for measurable outcomes (%, $, latency, throughput, scale) and provides automated high-impact rewrites.
* **Buzzword & Cliché Elimination**: Flags overused corporate filler words and provides evidence-backed phrasing alternatives.
* **Action Verb Diversity**: Identifies repetitive verbs and suggests dynamic replacements.
* **Client-Side PDF Processing**: High-fidelity PDF rendering via `pdfjs-dist` with automatic thumbnail generation.
* **Storage Quota Enforcement**: Automatic 80-file FIFO storage quota with reactive deletion controls.

### 2. Six Agents — Recruiter Mode
* **Autonomous Mandate Intelligence**: Ingests raw Job Descriptions and automatically generates structured hiring mandates (mandatory skills, bonus criteria, experience tenure, and domain tags).
* **Candidate Pipeline Matrix**: Recruiter dashboard organizing candidates across mandates with real-time verification statuses.
* **Requirement Verification Matrix**: Side-by-side gap analysis categorizing every candidate skill into `MATCHED`, `PARTIAL`, `MISSING`, or `UNKNOWN`.
* **Agent 6 GitHub MCP Deep-Dive Workspace**:
  * **Architecture & Topology**: Multi-repo dependency trees, entry points, and structural patterns.
  * **Language & Tech Stack Audit**: Exact repository language distributions and frameworks.
  * **Code Quality & Security**: Static inspection detecting shallow forks, test coverage, and documentation depth.
  * **Interactive Codebase Chat**: Conversational AI assistant interrogating the candidate's actual repositories.
* **Deterministic Leaderboard & Scoring Engine**:
  * Pure mathematical candidate ranking based on configurable weights (Technical 40%, Experience 25%, JD Semantic Similarity 20%, Project Relevance 10%, Education 5%).
  * Real-time interactive weight sliders with dynamic re-ranking.
* **Executive Recruitment Dossiers**:
  * Verifiable hiring confidence scores, key strengths, risk factors, and ramp-up considerations.
  * Evidence-backed interview probes with rationales and keywords tailored to candidate gaps.

---

## 🏛 Architecture & Workflow

```
┌────────────────────────────────────────────────────────┐
│                  TalentGraph Frontend                  │
│               React 19 + React Router v7               │
└───────────────┬────────────────────────┬───────────────┘
                │                        │
       [Candidate Mode]          [Recruiter Mode]
                │                        │
                ▼                        ▼
        Puter.js Storage        TalentGraph REST API
      (KV Store / FS / Auth)    (FastAPI + LangGraph)
                │                        │
                ▼                        ▼
     Candidate ATS Audits       Supabase PostgreSQL
                                   + pgvector
                                       │
                                       ▼
                              Hugging Face BGE-M3
                              + GitHub MCP Client
```

---

## 🛠 Tech Stack

| Layer | Technology | Description |
|:---|:---|:---|
| **Framework** | React 19.2 + React Router v7 | Modern single-page / server-rendered application framework. |
| **Bundler & Tooling** | Vite 7.1 + TypeScript 5.9 | Instant hot module replacement and strict type-safety. |
| **Styling** | Tailwind CSS v4 + tw-animate-css | High-performance CSS framework with custom design tokens. |
| **State Management** | Zustand 5.0 | Lightweight, reactive state stores for user sessions and active mandates. |
| **Document Processing**| `pdfjs-dist` + `react-dropzone` | Client-side PDF parsing, page rendering, and canvas thumbnails. |
| **Storage & Auth** | Puter.js | Cloud OS integration providing serverless file storage and user authentication. |
| **API Integration** | Fetch API + EventSource (SSE) | Full integration with FastAPI backend and streaming agent updates. |

---

## 📂 Project Directory Structure

```
TalentGraphFrontend/
├── .env.example                # Example environment file
├── .gitignore                  # Production Git ignore rules
├── package.json                # Dependencies and npm scripts
├── package-lock.json           # Locked dependency tree
├── react-router.config.ts      # React Router v7 framework configuration
├── tsconfig.json               # TypeScript compiler settings
├── vite.config.ts              # Vite configuration with Tailwind CSS v4 plugin
├── README.md                   # Project documentation
│
├── public/                     # Static public assets
│   ├── favicon.ico
│   ├── images/
│   └── resumes/
│
├── constants/                  # Prompts, diagnostic schemas & presets
│   └── index.ts                # AI diagnostic instructions and default ATS schemas
│
├── types/                      # TypeScript declarations
│   ├── index.d.ts              # ResumeIQ domain types
│   └── talentAgent.d.ts        # Recruiter Mode & 6-Agent pipeline types
│
└── app/                        # Application source code
    ├── root.tsx                # App root layout, fonts, and meta tags
    ├── routes.ts               # Central route configuration table
    ├── app.css                 # Global CSS and Tailwind directives
    │
    ├── routes/                 # Route components
    │   ├── home.tsx            # Landing page with mode selection
    │   ├── auth.tsx            # Puter authentication view
    │   ├── upload.tsx          # Resume upload & analysis view
    │   ├── resume.tsx          # Detailed candidate ATS diagnostic report
    │   └── recruiter/          # Recruiter Mode route tree
    │       ├── dashboard.tsx   # Mandates dashboard & pipeline overview
    │       ├── job-description.tsx # Mandate JD editor & Agent 1 extraction
    │       ├── candidates.tsx  # Mandate candidate roster & verification
    │       ├── candidate-detail.tsx # Candidate profile & skill matrix
    │       ├── ranking.tsx     # Deterministic leaderboard & weight sliders
    │       ├── report.tsx      # Agent 5 Executive Dossier view
    │       └── github-mcp.tsx  # Agent 6 GitHub MCP Intelligence dashboard
    │
    ├── components/             # Reusable UI components
    │   ├── Navbar.tsx          # Main navigation bar with active mode pills
    │   ├── FileUploader.tsx    # Drag-and-drop PDF uploader
    │   ├── ATS.tsx             # ATS score gauges & diagnostic tips
    │   ├── CareerArcTimeline.tsx # Timeline visualization component
    │   ├── QuantifiedMetrics.tsx # Metric breakdown and rewrites
    │   ├── BuzzwordsSection.tsx # Buzzword analysis panel
    │   ├── VerbRepetition.tsx  # Action verb audit component
    │   ├── MarketSkillGaps.tsx # Market benchmark gap analysis
    │   ├── PassedChecks.tsx    # Structural resume validation checks
    │   ├── InterviewPrep.tsx   # Generated interview question list
    │   ├── ResumeCard.tsx      # Candidate card with reactive delete button
    │   └── github/             # GitHub MCP visualization widgets
    │       ├── ArchitectureTab.tsx
    │       ├── TechStackTab.tsx
    │       ├── FileTreeTab.tsx
    │       └── ChatPanel.tsx
    │
    └── lib/                    # Core libraries and clients
        ├── puter.ts            # Puter.js SDK client & state store
        ├── talentAgentApi.ts   # REST API client for FastAPI backend
        ├── talentAgentStore.ts # Recruiter state store (Zustand)
        ├── sampleCandidates.ts # Pre-seeded candidate profiles
        └── utils.ts            # Formatting and styling utilities
```

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- Node.js (version 20 or higher recommended)
- npm, pnpm, or yarn

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Kgotta-contribute/TalentGraphFrontend.git
cd TalentGraphFrontend

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file in the project root:
```bash
cp .env.example .env
```
Set the API URL to point to your local or deployed FastAPI backend:
```env
VITE_TALENT_AGENT_API_URL=http://localhost:8000
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Deployment Guide (Vercel)

Deploying `TalentGraphFrontend` to Vercel takes less than two minutes:

### Step 1: Push to GitHub
Ensure all code is committed and pushed to your repository:
```bash
git push origin main
```

### Step 2: Import into Vercel
1. Log in to [vercel.com](https://vercel.com).
2. Click **"Add New..."** ➔ **"Project"**.
3. Select your GitHub repository: `Kgotta-contribute/TalentGraphFrontend`.

### Step 3: Project Configuration
Vercel automatically detects the framework:
* **Framework Preset**: `Vite` (or `Other`)
* **Root Directory**: `./`
* **Build Command**: `npm run build`
* **Output Directory**: `build/client`

### Step 4: Add Environment Variables
In the **Environment Variables** section on Vercel, add:
* **Key**: `VITE_TALENT_AGENT_API_URL`
* **Value**: Your live Railway backend URL (e.g. `https://web-production-31042.up.railway.app`)

### Step 5: Deploy
Click **"Deploy"**. Vercel will run `npm install`, compile the Vite production bundle, and assign an SSL-enabled `.vercel.app` domain.

---

## 🔗 Connecting Frontend to Railway Backend

To ensure seamless communication between your Vercel frontend and Railway backend:

1. **Set Backend CORS**:
   In your Railway backend's environment variables, ensure `CORS_ORIGINS` includes your Vercel domain or `*`:
   ```env
   CORS_ORIGINS=["https://your-frontend.vercel.app","*"]
   ```

2. **Set Frontend API Target**:
   In your Vercel project settings under **Environment Variables**, verify:
   ```env
   VITE_TALENT_AGENT_API_URL=https://web-production-31042.up.railway.app
   ```

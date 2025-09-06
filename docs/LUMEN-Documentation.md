# LUMEN — Localized Unified Medical ENgine for Triage

Comprehensive documentation for the LUMEN project. This document covers the problem context, objectives, features, architecture, APIs, setup, deployment, security, testing, and roadmap.

> Disclaimer: LUMEN is a research prototype and does not replace professional medical advice.

## Table of Contents

- [1. Problem Statement](#1-problem-statement)
- [2. Objectives](#2-objectives)
- [3. Key Features](#3-key-features)
- [4. Non-Goals](#4-non-goals)
- [5. System Architecture](#5-system-architecture)
  - [5.1 Frontend (React)](#51-frontend-react)
  - [5.2 Node/Express API](#52-nodeexpress-api)
  - [5.3 Python FastAPI Services](#53-python-fastapi-services)
  - [5.4 Data Flow](#54-data-flow)
- [6. API Reference](#6-api-reference)
  - [6.1 Express Endpoints](#61-express-endpoints)
  - [6.2 FastAPI Endpoints](#62-fastapi-endpoints)
- [7. Frontend Modules](#7-frontend-modules)
- [8. Setup & Development](#8-setup--development)
- [9. Environment Variables](#9-environment-variables)
- [10. Deployment](#10-deployment)
- [11. Security & Privacy](#11-security--privacy)
- [12. Accessibility & Internationalization](#12-accessibility--internationalization)
- [13. Testing & Quality](#13-testing--quality)
- [14. Roadmap](#14-roadmap)
- [15. Glossary](#15-glossary)
- [16. References](#16-references)

---

## 1. Problem Statement

India faces uneven access to timely, quality healthcare, especially in rural and semi‑urban areas. Primary care facilities are understaffed and under‑equipped, specialist access is scarce, and preventable emergencies persist due to delayed triage and guidance. Doctor/nurse/midwife density (~20.6 per 10,000) trails the WHO’s recommended 44.5 per 10,000. Snakebites alone cause ~58,000 deaths annually, largely due to delayed first aid and treatment.

LUMEN addresses this with a unified assistant that triages symptoms, explains diagnostics, reconstructs low‑dose CT previews, interprets lab reports, and maps people to government schemes—in their language.

## 2. Objectives

- Provide accessible, multilingual healthcare guidance for preliminary triage.
- Reduce preventable morbidity/mortality with clear next steps (home care, clinic, emergency).
- Offer AI specialist modules that produce both layperson guidance and clinician‑grade summaries.
- Enable safer imaging follow‑ups via low‑dose reconstruction previews.
- Analyze lab reports to flag risks and suggest meaningful follow‑ups.
- Increase awareness of government health schemes and eligibility.
- Preserve privacy, minimize PII, and implement safety guardrails.

## 3. Key Features

- Symptoms‑based triage with severity bands (Green/Yellow/Red).
- AI specialist modules (dermatology, radiology, cardiology) designed for contextual guidance.
- PEARL‑inspired low‑dose CT reconstruction preview (3D viewer prototype under `/pearl`).
- Lab report analyzer that extracts values, compares to reference ranges, flags risks, and summarizes.
- Government schemes assistant that checks eligibility and steps.
- Emergency education tiles with audio guidance for first aid.
- Multilingual UX and foundations for voice input/output.

Code references:

- Client pages: `./client/pages/*.tsx` (e.g., `Index.tsx`, `Technical.tsx`, `Developers.tsx`).
- Lumen components: `./client/components/lumen/*`.
- Express API: `./server/*`.
- Python services (optional backend): `./backend/*`.

## 4. Non-Goals

- Replacing licensed clinicians or providing definitive diagnoses.
- Storing or processing protected health information without user consent and safeguards.
- Acting as an emergency service. LUMEN provides guidance but is not a substitute for professional help.

## 5. System Architecture

The repository ships a Vite + React SPA with an Express API. An optional Python FastAPI service implements a richer, modular AI backend. The SPA communicates primarily with the Node/Express endpoints. Selected features can be re‑pointed to the Python service if required.

### 5.1 Frontend (React)

- Stack: React 18, Vite, TailwindCSS, Radix UI, framer‑motion, @react-three/fiber (3D demo).
- Structure: `./client/` with pages, components, hooks, and UI primitives.
- Styling: TailwindCSS with a custom design system (`./tailwind.config.ts`, `./client/global.css`).
- Notable pages and sections:
  - Landing: `./client/pages/Index.tsx` (Hero, Problem, Features, Emergency, Contact, etc.)
  - Technical docs page: `./client/pages/Technical.tsx` (architecture, problem statement, workflows)
  - Developers page: `./client/pages/Developers.tsx`
  - Demo modules: `./client/components/lumen/Demo.tsx`
  - Embeddings tool: `./client/components/lumen/EmbeddingAnalyzer.tsx`

### 5.2 Node/Express API

- Location: `./server/`
- Entrypoint: `./server/index.ts` exposes `/api/*` routes.
- External models via Hugging Face Inference API. Requires `HF_API_KEY`.
- Endpoints implement chat (symptom guidance), vision analysis, lab OCR/QA, and embeddings.

### 5.3 Python FastAPI Services

- Location: `./backend/`
- Entrypoint: `./backend/main.py`
- Modular services in `./backend/lumen_services.py` and model manager in `./backend/lumen_models.py`.
- Implements richer flows: multilingual chat, voice (Whisper, TTS), lab analysis, dermatology, emergency guides, government scheme retrieval with FAISS vector search.
- This service is optional and can be deployed separately; the SPA currently uses Node/Express endpoints by default.

### 5.4 Data Flow

1. Input collection (text/audio/image + metadata such as locale and consent).
2. Gateway validation and safety checks (file size/type; see `lab-analyze.ts`).
3. AI routing via Hugging Face (chat, image captioning, embeddings, Donut OCR/QA).
4. Structured outputs (triage level, summaries, eligibility info) returned to the SPA.
5. Client renders urgency states, recommendations, and educational views.

## 6. API Reference

### 6.1 Express Endpoints

- GET `/api/ping`
  - Response: `{ message: string }` using `PING_MESSAGE` env or default "ping".

- GET `/api/demo`
  - Response: `{ message: "Hello from Express server" }` (see `./server/routes/demo.ts`).

- POST `/api/lab/analyze`
  - Multipart form field: `file` (PNG or JPEG; PDF returns 415 in prototype).
  - Returns parsed fields when possible, severity (green/yellow/red), and a human summary.
  - Logic: `./server/routes/lab-analyze.ts` (Donut + fallback; retries; basic range checks).

- POST `/api/chat/symptoms`
  - Body: `{ prompt: string, model?: string }`.
  - Uses text generation models via Hugging Face. Returns `{ output: string }`.

- POST `/api/vision/analyze`
  - Multipart field: `image` (PNG/JPEG). Optional query `model` (default BLIP captioning).
  - Returns `{ output: string }` (caption/analysis text).

- POST `/api/embed`
  - Body: `{ text: string, model?: string }` (default `sentence-transformers/all-MiniLM-L6-v2`).
  - Returns `{ embedding: number[], dim: number }`.

Notes:

- All Express endpoints require `HF_API_KEY`.
- Upload limits: 10MB (multer in-memory storage).

### 6.2 FastAPI Endpoints

- GET `/api/health` → health status.
- POST `/api/chat/symptoms` → structured triage `{ response, language, confidence, triage_level }`.
- POST `/api/chat/general` → general conversation.
- POST `/api/voice/speech-to-text` → `{ text, language }`.
- POST `/api/voice/text-to-speech` → `{ audio, language }`.
- POST `/api/lab/analyze` (file + metadata) → extracted text and analysis.
- POST `/api/dermatology/analyze` (image + symptoms) → description + analysis.
- POST `/api/emergency/guide` → localized first‑aid guidance.
- GET `/api/emergency/types` → supported scenarios.
- POST `/api/government/schemes` → vector search over schemes with relevance scores.
- GET `/api/government/states` → supported states.
- GET `/api/models/info` → available models and supported languages.

See:

- `./backend/main.py`
- `./backend/lumen_services.py`
- `./backend/lumen_models.py`

## 7. Frontend Modules

- LUMEN Technical: `./client/components/lumen/Technical.tsx` – problem statement, features, workflows, team.
- Demo hub: `./client/components/lumen/Demo.tsx` – CT viewer, Lab Analyzer, AI Chatbot demo blocks.
- Embedding Analyzer: `./client/components/lumen/EmbeddingAnalyzer.tsx` – calls `/api/embed` and compares cosine similarity across sample health texts.
- Emergency: `./client/components/lumen/Emergency.tsx` – first‑aid education UI (see landing page composition in `./client/pages/Index.tsx`).

## 8. Setup & Development

Requirements:

- Node.js 18+
- pnpm (see `package.json`)

Install and run:

```bash
pnpm install
pnpm dev          # Vite + Express in dev
pnpm build        # build client and server
pnpm start        # run built server (node dist/server/node-build.mjs)
pnpm test         # vitest --run
pnpm typecheck    # tsc
```

## 9. Environment Variables

- `HF_API_KEY` (required for Express endpoints using Hugging Face Inference API)
- `PING_MESSAGE` (optional; overrides `/api/ping` response)
- Python backend also reads:
  - `CHATBOT_MODEL`, `WHISPER_MODEL`, `XTTS_MODEL`, `DONUT_MODEL`, `BLIP_MODEL`, `EMBEDDING_MODEL`, `MULTILINGUAL_EMBEDDING_MODEL`

Never commit secrets. Configure them in your deployment platform or local `.env` (not committed).

## 10. Deployment

- Netlify: See `./netlify/functions/api.ts` for handler wiring. Configure env vars (e.g., `HF_API_KEY`) in Netlify dashboard. Netlify builds the repo and serves serverless functions.
- Vercel: Configure project and env vars in Vercel. Use the built output or serverless functions pattern.
- Static assets live under `./public/`.

## 11. Security & Privacy

- PII minimization: Only process user inputs necessary for the task; do not log sensitive data.
- File validation: Image uploads restricted to PNG/JPEG; size limit 10MB (see `multer` config).
- Error handling: Upstream errors from model APIs are sanitized and returned as 4xx/5xx with reasons.
- Rate limiting and audit logging are recommended for production (add gateway middleware).

## 12. Accessibility & Internationalization

- Tailwind design tokens support light/dark themes and high‑contrast colors.
- Multilingual support in backend prompts and services; the UI is structured to add locales.
- Use semantic HTML and keyboard‑accessible components (Radix primitives in `./client/components/ui`).

## 13. Testing & Quality

- Unit tests with Vitest: `pnpm test`. See `./client/lib/utils.spec.ts`.
- Type‑safety: Shared types under `./shared/` keep API contracts aligned.
- Formatting: `pnpm format.fix` with Prettier. Type checks with `pnpm typecheck`.

## 14. Roadmap

- Expand language coverage across UI and speech services.
- Integrate retrieval (vector DB) for government schemes and medical knowledge grounding in the Node API.
- Enrich CT module visuals and incorporate uncertainty maps.
- Add clinician dashboard and referral workflows.
- Add rate limiting, auth, and audit logs for production compliance.

## 15. Glossary

- Triage: Categorizing patient urgency into Green/Yellow/Red.
- Donut OCR/QA: Document understanding transformer used to parse lab reports.
- BLIP: Image captioning model used for dermatology prototype.
- Embeddings: Vector representations of text used for similarity and retrieval.

## 16. References

- LUMEN technical and feature content reflected from code in:
  - `./client/components/lumen/Technical.tsx`
  - `./server/routes/*` and `./server/index.ts`
  - `./backend/*` services and models
- Public health data sources reflected in the in‑app technical content page.

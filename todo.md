# NECLEX — Build Plan (todo.md)

> A free, calm, accurate NCLEX prep companion built for one specific person.
>
> **Learner profile:** still in nursing school, 8+ hr/day study capacity, high test
> anxiety, learns best through songs/mnemonics + visuals + practice questions, hardest
> subjects are pathophysiology and pharmacology, prefers detailed rationales with
> concept re-anchoring, studies on phone and laptop equally, wants to (1) feel calm
> walking in, (2) see weekly progress, (3) make hard topics click, (4) pass first try.
>
> **Out of scope (cut intentionally):** marketing pages, sign-up/sign-in, payments,
> sales copy, public landing page, growth funnel. This is not a product, it is her
> tool. The home page is the app.
>
> **In scope:** the actual study experience — practice questions, flashcards, drug
> and lab reference, mnemonics, mastery dashboard, content authoring pipeline.
>
> All content traceable to the **2026 NCSBN NCLEX-RN/PN Test Plans** (effective
> Apr 1, 2026 – Mar 31, 2029). Built on the **NCSBN Clinical Judgment Measurement
> Model (CJMM)**.

---

## 🚨 BUILD DIRECTIVE
> **This app MUST be built using the Claude Code skills below.** Every phase, every
> feature, every commit message, every UI component, every test — produced with
> the relevant skills invoked. The skills are how we hit the "no AI slop, polished
> consumer-grade" bar. **Building without the skills = build failure.**
>
> When starting work on any phase or task: open this file → match the work to the
> per-phase map → invoke each listed skill via the `Skill` tool → THEN write code.

## ⚙️ Skills Usage Protocol (MANDATORY on every prompt)

### Default-on for any coding work
- ⭐ **simplify** — review changed code for reuse, quality, efficiency
- ⭐ **verification-quality** — truth-score outputs (≥ 0.95), auto-rollback
- ⭐ **tdd-workflow** — mock-first, outside-in test development on any new logic
- ⭐ **pair-programming** — driver/navigator with continuous review
- ⭐ **webapp-testing** — Playwright UI verification on any frontend change

### When the work matches
- **frontend-design** — every UI surface (mandatory; anti AI-slop)
- **ui-ux-pro-max** + **ui-design-system** — design tokens, components, polish
- **deep-research** + **browser** — clinical-fact verification (NCSBN, FDA, AHA, CDC)
- **graphify** — content relationships (concept ↔ drug ↔ lab ↔ question) as a graph
- **content-humanizer** + **behuman** + **copywriting** + **copy-editing** — every line
  of UI copy and every rationale (anti AI-slop, sounds like a real person)
- **karpathy-coder** + **karpathy-check** + **adversarial-reviewer** + **code-reviewer** +
  **dependency-auditor** — code review pipeline
- **agentdb-vector-search** — semantic search across concepts/drugs/labs
- **agentdb-memory-patterns** + **reasoningbank-agentdb** — adaptive engine state
- **xlsx** + **pdf** — content authoring (question banks) and source extraction
  (NCSBN PDFs, drug labels)
- **a11y-audit** — accessibility verification

### Per-phase invocation map
| Phase | Required skills (in addition to default-on) |
|---|---|
| Foundations & tooling | deep-research, browser, session-start-hook, update-config |
| Design system | frontend-design (mandatory), ui-ux-pro-max, ui-design-system, ux-researcher-designer, apple-hig-expert, brand-guidelines, theme-factory, canvas-design |
| DB schema | graphify (ER + content graph), xlsx (seed sheets) |
| Quiz engine | frontend-design, tdd-workflow (heavy), pair-programming, agentdb-memory-patterns, webapp-testing |
| FSRS | tdd-workflow, agentdb-memory-patterns, reasoningbank-agentdb |
| Flashcards | frontend-design, agentdb-vector-search |
| Content | swarm-orchestration, deep-research, browser, graphify, xlsx, pdf |
| Reference UI (drugs/labs/mnemonics) | frontend-design, agentdb-vector-search |
| Progress dashboard | frontend-design, reasoningbank-intelligence, agentdb-vector-search |
| A11y | verification-quality, webapp-testing |
| Performance | agentdb-optimization (if vector search is in path), verification-quality |

### Per-prompt protocol
1. Identify the phase(s) the prompt touches.
2. List every applicable skill (default-on + per-phase).
3. Invoke each via the `Skill` tool — not just mention.
4. Close the loop with `simplify` + `verification-quality` for code,
   `frontend-design` + `webapp-testing` for UI.
5. If a needed skill is missing, flag it explicitly.

---

## Phase 0 — Foundations (DONE)

- [x] Init Next.js 15 (App Router) + TypeScript + Turbopack
- [x] Tailwind CSS v4 with `@theme` tokens
- [x] ESLint flat config + Prettier + prettier-plugin-tailwindcss
- [x] Vitest 2 with `@/*` alias
- [x] Path alias, `.gitignore`, `.env.example`
- [x] tsconfig strict
- [ ] Husky + commitlint + lint-staged (when content authoring begins, not before)
- [ ] GitHub Actions: typecheck, lint, test, build, Lighthouse
- [ ] Sentry for error tracking (deferred until app is live for her)

---

## Phase 1 — Design system (DONE)

Aesthetic direction locked: **Editorial Apothecary** — Aesop × Kinfolk × Cereal Magazine.
Soft paper, intelligent serif, dusty botanical accents. The opposite of generic SaaS pastel
gradient slop.

- [x] Color tokens: paper, ink-aubergine, lavender / sage / clay / indigo (full ramps)
- [x] Type: Fraunces (variable serif, opsz + SOFT axes) display + Instrument Sans body + JetBrains Mono
- [x] Spacing scale (4px base, generous)
- [x] Radius tokens (sm/md/lg/xl/2xl, rounded-everything)
- [x] Soft elevation tokens (paper-soft, never harsh)
- [x] Motion tokens: expo-out cubic, soft cubic; quick / base / slow / glide durations
- [x] Page-load staggered word reveal utility
- [x] Lift-on-hover utility for cards
- [x] Link-draw underline utility
- [x] `prefers-reduced-motion` honored
- [x] Paper-grain SVG noise overlay (faint, fixed, multiply)
- [x] Focus-visible ring on every interactive
- [x] Selection color (lavender)

### Primitives
- [x] Container (sm 720 / md 960 / lg 1280)
- [x] Eyebrow (uppercase mono kicker with optional rule)
- [x] Button (primary / outline / ghost; md / sm; href → Link or button)
- [x] Card (soft / outlined / raised; optional .lift)
- [ ] Input, Textarea, Select, Switch, Checkbox (when onboarding/settings need them)
- [ ] Dialog, Sheet, Tooltip, Toast (when interaction depth requires)

### Site shell
- [x] Wordmark with sage-dot accent
- [x] Botanical SVG ornament (laurel + bell flowers)
- [x] NavBar (Wordmark + Study / Reference / Progress)
- [x] SiteFooter (single-line disclaimer; no marketing groups)
- [x] PageFrame wrapper

### Page surfaces
- [x] Home — study hub (Today's mix / Weak areas / Reference cabinet)
- [x] /study — single-question session view with shuffle
- [x] /reference — cabinet landing (drugs / labs / mnemonics)
- [x] /progress — CJMM-step + Client-Needs mastery map (skeleton)

---

## Phase 2 — Standards taxonomy (DONE)

- [x] `cjmm_steps` — six steps with definitions and example prompts
- [x] `integrated_processes` — six processes
- [x] `client_needs_categories` — RN and PN, parent + sub, with 2026 % bands
      (PN bands and one RN pharm band flagged `verify_pdf` until NCSBN PDFs verified)
- [x] `exam_constants` — CAT rules + passing logits (RN 0.00, PN −0.18)
- [x] `item_type` enum — every NGN + classic type
- [x] `scoring_rule` enum — dichotomous, polytomous +/−, polytomous rationale
- [ ] Manually verify 2026 RN + PN PDFs and clear `verify_pdf` flags
- [ ] Generate TypeScript types from the schema (Supabase CLI)
- [ ] Apply migration locally (Supabase CLI) when content authoring begins

---

## Phase 3 — Quiz engine (IN PROGRESS)

### Done
- [x] `shuffleWithSeed` — deterministic mulberry32 + FNV-1a string hash
- [x] `seedFromString` for non-numeric attempt IDs
- [x] 8 unit tests including 5000-trial uniformity check
- [x] Multiple Choice renderer with mandatory shuffle
- [x] Gentle review panel: "Nicely held" / "Let's look at this together",
      no alarm-red, sage / clay only
- [x] Distractor breakdown for every option
- [x] Source citations panel
- [x] Working session at `/study` with one verified question

### Item-type renderers — to build
- [ ] Multiple Response (SATA) with **polytomous +/− scoring** (floor 0)
- [ ] Fill-in-the-Blank (calculation) with unit-aware grading + acceptable rounding
- [ ] Ordered Response (drag-to-sequence)
- [ ] Hot Spot (image click)
- [ ] Audio item player
- [ ] Graphic / Exhibit / Chart items
- [ ] Extended Multiple Response (longer option list, +/− scoring)
- [ ] Extended Drag and Drop (zones can have fewer/more slots than options)
- [ ] Cloze (Drop-Down) with rationale-scoring (linked all-or-nothing)
- [ ] Enhanced Hot Spot / Highlight (click words/phrases to toggle)
- [ ] Matrix Multiple Choice (one per row)
- [ ] Matrix Multiple Response (multi per row)
- [ ] Bow-Tie (Actions / Condition / Parameters) with rationale-linked scoring
- [ ] Trend item with multi-time-point chart + analysis prompt
- [ ] Stand-alone NGN wrapper
- [ ] Case-Study (unfolding 6-step) wrapper, no back-nav within case

### Mandatory shuffle per type
- [x] Multiple choice — option order shuffled per attempt
- [ ] SATA — list order shuffled
- [ ] Extended drag/drop & bow-tie — option bank shuffled (NOT zone meaning)
- [ ] Matrix — row order shuffled (column meaning preserved)
- [ ] Cloze — dropdown options shuffled within each blank
- [ ] Ordered response — starting positions shuffled, key preserves correct sequence

### Session UX
- [ ] Session container that pulls items from FSRS-due + weak-area scheduler
- [ ] Confidence rating (sure / unsure / guess) — never penalizing
- [ ] Pause-and-resume on every session
- [ ] "Hide score during session" toggle
- [ ] Optional 4-7-8 box-breath modal every 25 items
- [ ] Replay-on-review (same shuffle seed)

### Scoring engine
- [x] Dichotomous scorer (0/1)
- [ ] Polytomous +/− scorer with floor 0 per item
- [ ] Rationale (linked all-or-nothing) scorer for cloze/matrix/bow-tie pairs
- [ ] Time-spent capture per item
- [ ] Confidence-rating capture

---

## Phase 4 — State persistence (LOCAL-FIRST)

> Decision: no auth, no server account. Her state lives in the browser and
> optionally syncs across devices via a paired tokenless URL.

- [ ] IndexedDB schema (Dexie or idb-keyval) — attempts, mastery, FSRS cards, settings
- [ ] Single-source store in `/lib/store/` with typed selectors
- [ ] Daily-stats roll-up (computed on read, persisted on session end)
- [ ] Cross-device sync option (later — only if she wants phone↔laptop)

---

## Phase 5 — Spaced Repetition (FSRS)

- [ ] Implement FSRS-5 scheduler in TypeScript (`/lib/fsrs/`)
- [ ] Default w-vector + retention target 0.9 (raise to 0.95 within 30 days of test)
- [ ] Card auto-creation on first concept/drug/lab/mnemonic encounter
- [ ] Review UI: again/hard/good/easy with gentle copy
- [ ] Daily review queue capped at 100 to avoid burnout
- [ ] Optimizer pass once she's done ≥ 200 reviews
- [ ] Leech detection — auto-suggest concept re-anchor + new mnemonic
- [ ] Retention curve graph
- [ ] Tests vs published FSRS reference vectors

---

## Phase 6 — Flashcards

- [ ] Front/back basic card
- [ ] Cloze deletion card
- [ ] Image-occlusion card (cover anatomy/diagram regions)
- [ ] Audio (song-mnemonic) card with autoplay + replay
- [ ] Drug card auto-generated from `drugs` table
- [ ] Lab card auto-generated from `lab_values` table
- [ ] Anki .apkg import (preserve cloze, audio, images)
- [ ] Quick-add card from any rationale ("save concept")

---

## Phase 7 — Content (≥ 2,000 questions, ≥ 800 drugs, ≥ 250 labs)

> Goal: large enough to feel inexhaustible, small enough that every item is
> hand-verified.

### Coverage — 2026 RN Test Plan
- [ ] Management of Care (15–21%)
- [ ] Safety & Infection Control (10–16%)
- [ ] Health Promotion & Maintenance (6–12%)
- [ ] Psychosocial Integrity (6–12%)
- [ ] Basic Care & Comfort (6–12%)
- [ ] Pharmacological & Parenteral Therapies (verify exact 2026 band)
- [ ] Reduction of Risk Potential (9–15%)
- [ ] Physiological Adaptation (11–17%)

### Tagging axes (every item must carry)
- [ ] client_need + sub_category
- [ ] integrated_process
- [ ] cjmm_step
- [ ] body_system
- [ ] content_topic
- [ ] specialty

### Body-system + specialty depth (her hardest = patho + pharm)
- [ ] Cardiac · Respiratory · Neuro · GI · GU/Renal · Endocrine
- [ ] Hematologic · Immune · Integumentary · MSK
- [ ] Repro / OB · Peds · Mental health · Oncology
- [ ] Multisystem / shock states

### Pharmacology depth (paired with patho)
- [ ] All major drug classes with prototype + key examples + nursing implications
- [ ] High-alert medications
- [ ] Antidotes table
- [ ] Black box warnings list
- [ ] Pregnancy/lactation safety per current FDA labeling
- [ ] Dosage calc question bank

### Lab values depth
- [ ] Adult ranges with critical values and clinical meaning
- [ ] Peds + geriatric variations
- [ ] ABG interpretation drills (ROME / tic-tac-toe)
- [ ] CBC, CMP, coags, cardiac, lipid, LFTs, renal, thyroid, A1c, ABG, lactate, BNP, troponin

### Mnemonics & "song" library (her #1 modality)
- [ ] Build mnemonic taxonomy (acronym, song, image, story, rhyme)
- [ ] Audio player with replay, slow-mode, lyric scroll
- [ ] Tag mnemonics to concepts, drugs, labs
- [ ] At least 100 song mnemonics for top-tested topics

### Editorial workflow
- [ ] Every item authored by an SME; reviewed by a second RN
- [ ] Approval recorded with `last_reviewed_at`
- [ ] Public errata record + in-app "Report an issue" on every item

---

## Phase 8 — Reference UI

- [ ] Drug database UI (search, filter by class/system)
- [ ] Lab values reference (filter by system, ABG mini-tool, electrolyte tool)
- [ ] Equation/formula sheet (drug calc, IV calc, BMI, CrCl, MAP, pack-years)
- [ ] Mnemonic library UI (browse, search, favorite)
- [ ] Concept map browser

---

## Phase 9 — Progress dashboard

- [ ] Today card: minutes studied, items done, accuracy, "next best action"
- [ ] Weekly progress: mastery deltas per Client Needs category
- [ ] Mastery by domain: 8 categories with % bars and trend arrows
- [ ] Mastery by CJMM step: which of the 6 cognitive steps is strongest/weakest
- [ ] Mastery by body system: heatmap
- [ ] Predicted readiness (calibrated, never punitive)
- [ ] Time-on-task: weekly minutes by category
- [ ] Confidence calibration: how often "sure" answers were correct
- [ ] Question-type performance: accuracy + average time per item type
- [ ] Drill-down: click any tile → filtered review session

---

## Phase 10 — A11y & responsive

- [ ] WCAG 2.2 AA conformance audit (axe + manual)
- [ ] Keyboard nav for every item type (drag/drop has keyboard alt)
- [ ] Screen-reader labels for matrix, cloze, bow-tie, hot-spot, highlight
- [ ] Reduced-motion mode (already wired)
- [ ] High-contrast mode
- [ ] Font-size override (S / M / L / XL)
- [ ] Color-blind safe palette (no red/green-only signaling)
- [ ] Mobile-first layouts: flashcards, single-question, mnemonic player
- [ ] Desktop-rich layouts: dashboard, case studies, reference tables
- [ ] Tablet split-pane study
- [ ] Touch-target minimum 44×44 px
- [ ] iOS PWA install + offline flashcard pack

---

## Phase 11 — Performance

- [ ] Core Web Vitals targets: LCP < 2.0s, CLS < 0.05, INP < 150ms
- [ ] next/image, WebP/AVIF, lazy-load below fold
- [ ] Route-level code splitting; question renderers lazy-loaded by item-type
- [ ] React Query for client cache; SSR/RSC for first paint
- [ ] Lighthouse CI (perf ≥ 90, a11y = 100)

---

## Phase 12 — Privacy & legal disclaimers

> No accounts, no payments, so no GDPR data-sale concerns. Still need:
- [x] Disclaimer line: "Not affiliated with NCSBN or Pearson VUE · Educational use only · Not medical advice"
- [ ] Page-level disclaimer block linkable from footer (long-form)
- [ ] Trademark callout: NCLEX® is registered to NCSBN

---

## Phase 13 — Testing

- [x] Unit: shuffler (8 tests, 5000-trial uniformity)
- [ ] Unit: every scoring rule per item type
- [ ] Unit: FSRS scheduler vs reference vectors
- [ ] Component: every renderer with golden inputs
- [ ] Integration: full session flow (start → answer → score → review)
- [ ] E2E (Playwright): home → /study → answer → review → return next day
- [ ] E2E: case-study disables back-nav and progresses through 6 steps
- [ ] axe a11y in CI
- [ ] Visual regression (Storybook + Chromatic) — when component count justifies
- [ ] Beta with her: 1-on-1 feedback loop, weekly polish pass

---

## Cross-cutting Definition of Done

A feature is **done** when ALL are true:
- [ ] Typechecks (strict TS) and lints clean
- [ ] Unit + component tests written and passing
- [ ] Accessible (keyboard + screen reader + reduced motion verified)
- [ ] Mobile + desktop layouts tested in real devices
- [ ] No alarm-red, no shaming copy, no marketing-speak
- [ ] Content cited (if it touches clinical facts)
- [ ] Doc updated in `/docs` if behavior is non-obvious
- [ ] Skills protocol followed (relevant skills invoked)

---

*Built for one specific person, with care.*

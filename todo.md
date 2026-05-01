# NCLEX Study Website — Build Plan (todo.md)

> A calm, accurate, song-friendly NCLEX prep platform built around a specific learner profile:
> still in nursing school, 8+ hr/day study capacity, high test anxiety, learns best through
> songs/mnemonics + visuals + practice questions, hardest subjects are pathophysiology and
> pharmacology, prefers detailed rationales with concept re-anchoring, studies on phone and
> laptop equally, and wants to (1) feel calm walking in, (2) see weekly progress, (3) make
> hard topics click, (4) pass on the first try.
>
> All content traceable to the **2026 NCSBN NCLEX-RN/PN Test Plans** (effective Apr 1, 2026 – Mar 31, 2029).
> Built on the **NCSBN Clinical Judgment Measurement Model (CJMM)**.

---

## Phase 0 — Foundations & Source-of-Truth Verification

### 0.1 Standards & references (MUST DO BEFORE ANY CONTENT)
- [ ] Download the official **2026 NCLEX-RN Test Plan PDF** from `nclex.com/files/2026_RN_Test Plan_English-F.pdf`
- [ ] Download the official **2026 NCLEX-PN Test Plan PDF** from `nclex.com/files/2026_PN Test Plan-F.pdf`
- [ ] Cross-check Client Needs % bands (RN and PN) against the PDFs and lock exact numbers in `/content/standards/2026-test-plan.json`
- [ ] Verify "Pharmacological and Parenteral Therapies" range (12–18% vs 13–19% — confirm)
- [ ] Confirm 2026 list of NGN item types and any wording changes vs 2023
- [ ] Confirm 2026 Integrated Processes list (esp. inclusion of Clinical Judgment)
- [ ] Save NCSBN CJMM diagram + 6 cognitive step definitions verbatim into `/content/standards/cjmm.json`
- [ ] Save NCSBN CAT rules (85 min, 150 max, 5h, 15 unscored, 95% CI / max-length / ROOT) into `/content/standards/cat.json`
- [ ] Save passing standards: RN = 0.00 logits, PN = −0.18 logits → `/content/standards/passing.json`

### 0.2 Clinical reference sources (cite for every fact)
- [ ] Lock **lab value source-of-truth**: AACC standardized adult/pediatric ranges (cite source per row)
- [ ] Lock **drug source-of-truth**: current FDA labeling (DailyMed) + Lippincott Drug Guide for nursing implications
- [ ] Lock **clinical guideline sources**: AHA (cardiac/ACLS/BLS), CDC (infection control/vaccines), ADA (diabetes), GOLD (COPD), KDIGO (renal), NIH (oncology), Bright Futures (peds)
- [ ] Lock **OB source-of-truth**: ACOG + AWHONN
- [ ] Lock **mental health source-of-truth**: DSM-5-TR, APA guidelines
- [ ] Lock **drug calculation conventions**: dimensional analysis with mL/hr, mcg/kg/min, mEq/L
- [ ] Document a "no AI-generated facts" policy in `CONTENT_POLICY.md` — every rationale cites a source

### 0.3 Repo & tooling
- [ ] Initialize Next.js 15 (App Router) + TypeScript + Turbopack
- [ ] Configure Tailwind CSS v4 + CSS variables for theming
- [ ] Install shadcn/ui base components (Button, Card, Dialog, Sheet, Tabs, Toast, Tooltip, Progress, Toggle)
- [ ] Configure ESLint (next/core-web-vitals) + Prettier + lint-staged + Husky pre-commit
- [ ] Configure path aliases (`@/components`, `@/lib`, `@/content`, `@/db`)
- [ ] Set up `pnpm` workspace
- [ ] Add Vitest + React Testing Library for unit/component tests
- [ ] Add Playwright for E2E tests
- [ ] Add Storybook for component library + visual review
- [ ] Configure GitHub Actions: typecheck, lint, unit, E2E, build, Lighthouse
- [ ] Set up commitlint with Conventional Commits
- [ ] Add `.env.example` with all env vars documented
- [ ] Add `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`

### 0.4 Hosting & infra
- [ ] Provision Vercel project; connect to `main` branch
- [ ] Provision Supabase project (Postgres 15 + Auth + Storage + Edge Functions)
- [ ] Configure preview deploys per PR
- [ ] Configure custom domain + HTTPS (e.g., `studynurse.app`) — verify availability + price
- [ ] Configure Vercel Analytics + Speed Insights
- [ ] Configure Sentry for error tracking (browser + edge runtime)
- [ ] Configure log drain → Axiom or Logtail
- [ ] Set Vercel cron jobs for scheduled tasks (FSRS due-card precompute, weekly digest)

---

## Phase 1 — Design System (calm, modern, intentional)

### 1.1 Brand & aesthetic
- [ ] Define brand voice: warm, gentle, capable, never alarmist; second-person ("you've got this")
- [ ] Pick name + wordmark (lockup variants: full, compact, favicon)
- [ ] Approve color palette: **lavender 50–900**, **sage 50–900**, **warm sand 50–900**, ink (near-black), cream (page bg)
- [ ] Define semantic colors: success = sage-500, attention = warm amber-500 (NEVER alarm-red), info = lavender-500, focus = lavender-400 ring
- [ ] Define typography: display = Fraunces or Inter Display, body = Inter (variable), mono = JetBrains Mono
- [ ] Define type scale (4xl/3xl/2xl/xl/lg/base/sm/xs) + line-height tokens
- [ ] Define spacing scale (4px base, generous: 8/12/16/24/32/48/64/96)
- [ ] Define radius tokens (sm 8, md 12, lg 16, xl 24 — rounded cards everywhere)
- [ ] Define elevation tokens (soft shadows, never harsh)
- [ ] Define motion tokens (durations 150/250/400ms; easings: standard, gentle, spring)
- [ ] Document accessible contrast (≥ AA on every pair, AAA on body text)

### 1.2 Component library (shadcn/ui-based, themed)
- [ ] Button (primary, secondary, ghost, destructive — destructive used sparingly)
- [ ] Card (default, soft, outlined)
- [ ] Input, Textarea, Select, Combobox, Checkbox, Radio, Switch
- [ ] Dialog, Sheet, Popover, Tooltip, HoverCard
- [ ] Tabs, Accordion, Collapsible
- [ ] Toast (gentle copy, no red)
- [ ] Progress (linear + circular)
- [ ] Skeleton loaders (avoid jarring spinners)
- [ ] Avatar, Badge, Chip
- [ ] EmptyState component (encouraging copy)
- [ ] Confetti / micro-celebration (subtle, opt-out in settings)
- [ ] Question item primitives: OptionRow, MatrixGrid, BowTieBoard, ClozeDropdown, HighlightText, DragDropZone, TrendChart
- [ ] Result feedback: GentleResultCard ("Let's look at this together"), RationaleSheet, LinkedConceptCard
- [ ] BreathingBreak component (4-7-8 box breath, 1-min)

### 1.3 Page templates & layouts
- [ ] AppShell (sidebar nav, top bar, mobile bottom nav)
- [ ] FocusMode shell (used for question sessions — minimal chrome)
- [ ] StudyDashboard layout
- [ ] ContentBrowser layout (drug DB, lab values, mnemonic library)
- [ ] Marketing layout (landing, pricing, about, blog)

### 1.4 Storybook
- [ ] All components have stories
- [ ] Stories include light + dark mode previews (dark mode = warm-dark, not cold-black)
- [ ] Visual regression via Chromatic or Playwright screenshot tests

---

## Phase 2 — Database Schema (Supabase / Postgres)

### 2.1 Identity & profile
- [ ] `auth.users` (Supabase Auth: email magic-link + Google OAuth)
- [ ] `profiles`: id, display_name, avatar_url, timezone, locale, exam_target (`RN` | `PN`), exam_date, study_minutes_per_day_goal, anxiety_level (1–5), created_at, updated_at
- [ ] `learning_preferences`: profile_id, prefers_songs, prefers_visuals, prefers_practice, prefers_reading, prefers_audio, feedback_style ARRAY, hardest_topics ARRAY, last_updated
- [ ] `consents`: profile_id, terms_accepted_at, privacy_accepted_at, marketing_opt_in
- [ ] RLS policies: each user reads/writes only own rows

### 2.2 Standards taxonomy (immutable reference)
- [ ] `client_needs_categories` (RN/PN flag, name, % min, % max, parent)
- [ ] `integrated_processes` (Nursing Process, Caring, Communication & Documentation, Teaching/Learning, Culture & Spirituality, Clinical Judgment)
- [ ] `cjmm_steps` (1–6 with definitions)
- [ ] `body_systems` (cardiac, respiratory, neuro, GI, GU, endocrine, hematologic, immune, integumentary, MSK, repro, mental health, multisystem)
- [ ] `content_topics` (topic tree under body_systems)
- [ ] `nursing_specialties` (med-surg, peds, OB, mental health, community, leadership/management, fundamentals, pharmacology, dosage calc)

### 2.3 Question bank
- [ ] `questions`: id, exam_target, item_type ENUM (mc, sata, fill_blank, ordered_response, hot_spot, audio, graphic, chart, ext_multi_response, ext_drag_drop, cloze_dropdown, enhanced_hotspot_highlight, matrix_mc, matrix_mr, bow_tie, trend), stem (markdown+JSON for rich layout), media_refs, scoring_rule ENUM (dichotomous, polytomous_plus_minus, polytomous_rationale), difficulty_logit, status (draft/review/published/retired), version, created_by, reviewed_by, source_citation, last_reviewed_at
- [ ] `question_options` (for selectable items): id, question_id, label, is_correct, position_for_display (only used when not shuffled), feedback
- [ ] `question_blanks` (cloze/fill): id, question_id, blank_key, accepted_values JSONB, units
- [ ] `question_matrix_cells`: row_key, column_key, is_correct
- [ ] `question_drag_targets` (bow-tie etc.): zone_key, accepted_option_ids
- [ ] `question_trend_points`: time_index, payload JSONB
- [ ] `question_tags` (M:M): question_id × {client_need, sub_category, integrated_process, cjmm_step, body_system, content_topic, specialty}
- [ ] `question_rationales`: question_id, full_rationale_md, distractor_breakdown JSONB (per-option), linked_concept_ids ARRAY, sources JSONB
- [ ] `case_studies`: id, title, scenario_md, exam_target, status
- [ ] `case_study_items`: case_id, question_id, cjmm_step, sequence (1–6)

### 2.4 Practice / attempts
- [ ] `sessions`: id, user_id, mode (study/timed/cat_sim/case_study/flashcards/review), started_at, ended_at, ability_estimate, settings JSONB
- [ ] `attempts`: id, session_id, user_id, question_id, started_at, submitted_at, response JSONB, awarded_points, max_points, scoring_rule, was_correct, confidence_self_rating (sure/unsure/guess), shuffle_seed, time_spent_ms
- [ ] `flagged_questions`: user_id, question_id, reason, note
- [ ] `bookmarked_questions`: user_id, question_id

### 2.5 Spaced repetition (FSRS)
- [ ] `cards`: id, user_id, content_kind (concept/drug/lab/mnemonic/question), content_ref, fsrs_state JSONB (stability, difficulty, due, last_review, lapses, reps), tags
- [ ] `card_reviews`: card_id, user_id, reviewed_at, rating (again/hard/good/easy), elapsed_ms, scheduler_version
- [ ] `fsrs_parameters`: user_id, w[17] vector, retention_target, last_optimized_at
- [ ] Edge function: nightly FSRS optimizer per user (only after ≥ 200 reviews)

### 2.6 Reference content
- [ ] `drugs`: id, generic_name, brand_names ARRAY, drug_class, mechanism_md, indications_md, contraindications_md, nursing_considerations_md, adverse_effects_md, lab_monitoring ARRAY, peds_pearls_md, ob_pearls_md, geriatric_pearls_md, pregnancy_category, fda_label_url, last_verified_at, verified_by
- [ ] `lab_values`: id, name, abbreviation, system, ref_range_low, ref_range_high, units, critical_low, critical_high, panic_values, clinical_meaning_md, related_drugs ARRAY, source
- [ ] `mnemonics`: id, title, body_md, audio_url (song version), tags, body_system, source
- [ ] `concepts`: id, title, summary_md, body_md, body_system, related_drugs, related_labs, related_questions ARRAY, prereqs ARRAY

### 2.7 Analytics & gamification
- [ ] `daily_stats`: user_id, date, minutes_studied, questions_answered, correct, accuracy_by_category JSONB, mastery_delta JSONB
- [ ] `mastery`: user_id × tag (client_need, content_topic, cjmm_step) → score 0–1, last_updated, sample_size
- [ ] `streaks`: user_id, current_days, best_days, last_active_date, freeze_credits
- [ ] `achievements`: user_id × achievement_key, awarded_at
- [ ] `weekly_digest`: user_id, week_start, payload JSONB, sent_at

### 2.8 Billing
- [ ] `subscriptions`: user_id, stripe_customer_id, plan, status, current_period_end, trial_end
- [ ] `entitlements`: user_id, feature_key, granted_at, expires_at
- [ ] `coupons`, `referrals`

### 2.9 Operational
- [ ] `audit_log`: actor, action, resource, before, after, at
- [ ] `feature_flags` table (server-driven flags)
- [ ] All tables: `created_at`, `updated_at` triggers
- [ ] All user-data tables: RLS on by default; admin role bypass via service key only
- [ ] Indexes for hot paths (attempts by user+session, mastery by user+tag, cards by user+due)
- [ ] DB migrations under `/supabase/migrations`, applied via Supabase CLI

---

## Phase 3 — Quiz Engine (with mandatory answer randomization)

### 3.1 Item-type renderers (every NGN type, fully native)
- [ ] **Multiple Choice** renderer + scorer (dichotomous)
- [ ] **Multiple Response (SATA)** renderer + scorer (polytomous +/−, floor 0)
- [ ] **Fill-in-the-Blank (calculation)** with unit-aware grading + acceptable rounding
- [ ] **Ordered Response (drag-to-sequence)** renderer + scorer
- [ ] **Hot Spot (image click)** renderer + scorer
- [ ] **Audio** item player + scorer
- [ ] **Graphic / Exhibit / Chart** items renderer
- [ ] **Extended Multiple Response** renderer (longer option list) + +/− scorer
- [ ] **Extended Drag and Drop** renderer (zones can have fewer/more slots than options)
- [ ] **Cloze (Drop-Down)** renderer with multiple linked dropdowns + rationale-scoring (linked all-or-nothing)
- [ ] **Enhanced Hot Spot / Highlight** (click-to-toggle words/phrases) + scorer
- [ ] **Matrix Multiple Choice** (one per row) renderer + scorer
- [ ] **Matrix Multiple Response** (multi per row) renderer + scorer
- [ ] **Bow-Tie** (Actions to Take | Condition Most Likely | Parameters to Monitor) renderer + scorer with rationale-linked scoring
- [ ] **Trend** item with multi-time-point chart + analysis prompt + scorer
- [ ] **Stand-alone NGN** wrapper
- [ ] **Case-Study (unfolding 6-step)** wrapper that progresses through CJMM steps and disables back-nav within case

### 3.2 Mandatory answer randomization
- [ ] Per-attempt **shuffle seed** stored on `attempts.shuffle_seed`
- [ ] Multiple choice & SATA: shuffle option order using seed
- [ ] Extended drag/drop & bow-tie: shuffle option bank (NOT zone meaning)
- [ ] Matrix: shuffle row order; column meaning preserved
- [ ] Cloze: shuffle dropdown options within each blank
- [ ] Ordered response: shuffle starting positions; preserve correct sequence in answer key
- [ ] Highlight: shuffle is N/A (text fixed) — but shuffle distractor sentences if multi-paragraph
- [ ] Hot spot: shuffle is N/A
- [ ] Review mode: re-render with the same seed so she sees exactly what she saw
- [ ] Unit test: same question rendered 10× → option position is uniformly distributed

### 3.3 Scoring engine
- [ ] Implement dichotomous scorer (0/1)
- [ ] Implement polytomous +/− scorer with floor 0 per item
- [ ] Implement rationale (linked all-or-nothing) scorer for cloze/matrix-row/bow-tie pairs
- [ ] Time-spent capture per item
- [ ] Confidence-rating capture (sure / unsure / guess) — never penalizes
- [ ] Result computation: `awarded_points / max_points`, plus per-option correctness for review

### 3.4 Practice modes
- [ ] **Tutor mode** — untimed, immediate rationale, concept link, "drill similar" CTA (default for first 4 weeks per anxiety profile)
- [ ] **Quiz mode** — fixed N items, optional timer, results at end
- [ ] **Timed CAT-sim mode** — 85 min/150 max, 5h timer, simulated 95% CI termination via Rasch ability estimator
- [ ] **Case-Study mode** — full unfolding 6-item case, no back-nav within case
- [ ] **Weak-area mode** — sources items via mastery + FSRS due
- [ ] **Daily Mix** — 25-question warm-up auto-generated each morning
- [ ] **Review-mistakes mode** — only items where last attempt was incorrect or unsure

### 3.5 Adaptive selection (CAT-lite)
- [ ] Maintain ability estimate per user (Rasch / Elo hybrid)
- [ ] Item difficulty calibrated from aggregate response data (cold-start: SME-rated)
- [ ] Item selector: maximize information at current ability ± 0.3 logit
- [ ] Content blueprint enforcement: respect 2026 Test Plan % bands across a session
- [ ] CAT termination simulator: 95% CI rule, max-length, ROOT (for sim mode)

### 3.6 Anxiety-aware UX rules (hard requirements)
- [ ] No alarm-red anywhere; wrong = warm amber
- [ ] No "INCORRECT" banner — copy is "Let's look at this together"
- [ ] Optional break suggestion every 25 items (4-7-8 box breath modal)
- [ ] Pause-and-resume on every session
- [ ] Settings toggle: "hide score during session" (only revealed at end)
- [ ] Settings toggle: "untimed only" mode
- [ ] No streak-shaming copy ever ("Welcome back" instead of "Streak broken")

---

## Phase 4 — Spaced Repetition (FSRS)

- [ ] Implement FSRS-5 scheduler in TypeScript (`/lib/fsrs/`)
- [ ] Per-user weights with default w-vector + retention target 0.9 (raise to 0.95 within 30 days of test)
- [ ] Card generation: every concept, drug, lab, mnemonic auto-creates a card on first encounter
- [ ] Review UI: rating (again/hard/good/easy) with gentle copy
- [ ] Daily review queue — capped at 100/day to avoid burnout
- [ ] Optimizer edge function: re-fit weights nightly when reviews ≥ 200
- [ ] Leech detection — auto-suggest concept re-anchor + new mnemonic
- [ ] Stats: retention by deck, predicted retention curve graph
- [ ] Tests: scheduler unit tests vs published FSRS reference vectors

---

## Phase 5 — Flashcards

- [ ] Standard front/back card type
- [ ] **Cloze deletion** card type
- [ ] **Image-occlusion** card type (cover anatomy/diagram regions)
- [ ] **Audio (song-mnemonic)** card type with autoplay + replay (her #1 modality)
- [ ] **Drug card** auto-generated from `drugs` table (mechanism / nursing implications / adverse effects sides)
- [ ] **Lab card** auto-generated from `lab_values` table (range / clinical meaning / critical values)
- [ ] Deck import (Anki .apkg → preserves cloze, audio, images)
- [ ] Deck export
- [ ] Deck sharing (read-only links)
- [ ] Quick-add card from any rationale ("save concept to deck")

---

## Phase 6 — Content Coverage (mapped to 2026 Test Plan)

> Goal: ≥ 5,000 verified questions, ≥ 1,200 NGN items, ≥ 800 drugs, ≥ 250 labs, ≥ 300 concept cards.
> Every item tagged: client_need, sub_category, integrated_process, cjmm_step, body_system, content_topic, specialty.

### 6.1 Client Needs — RN
- [ ] **Management of Care** (15–21%): delegation, scope of practice, advocacy, advance directives, informed consent, case management, quality improvement, ethical/legal practice
- [ ] **Safety and Infection Control** (10–16%): standard/transmission precautions, hand hygiene, falls, restraints, error reporting, hazardous materials, ergonomics, surgical safety, security
- [ ] **Health Promotion and Maintenance** (6–12%): development through life span, antepartum/intrapartum/postpartum/newborn, health screening, lifestyle choices, immunizations, self-care
- [ ] **Psychosocial Integrity** (6–12%): abuse/neglect, behavioral interventions, chemical dependency, coping, cultural awareness, end of life, grief & loss, mental health, stress management, suicide ideation, therapeutic communication, therapeutic environment
- [ ] **Basic Care and Comfort** (6–12%): assistive devices, elimination, mobility/immobility, nonpharm comfort, nutrition/oral hydration, personal hygiene, rest/sleep
- [ ] **Pharmacological and Parenteral Therapies** (verify exact 2026 band): adverse effects, blood/blood products, central venous access, dosage calc, expected actions, med admin, parenteral/IV therapy, pharmacological pain, TPN
- [ ] **Reduction of Risk Potential** (9–15%): changes/abnormalities in vital signs, diagnostic tests, lab values, potential complications of procedures, system-specific assessments, therapeutic procedures
- [ ] **Physiological Adaptation** (11–17%): alterations in body systems, fluid/electrolyte imbalances, hemodynamics, illness management, medical emergencies, pathophysiology, unexpected response to therapies

### 6.2 Client Needs — PN (parallel coverage with Coordinated Care replacing Mgmt of Care)
- [ ] Coordinated Care, Safety & Infection Control
- [ ] Health Promotion & Maintenance
- [ ] Psychosocial Integrity
- [ ] Basic Care & Comfort, Pharmacological Therapies, Reduction of Risk, Physiological Adaptation
- [ ] PN-specific scope-of-practice questions

### 6.3 Integrated Processes — explicit coverage
- [ ] Nursing Process (ADPIE) — at least one item per topic touching each phase
- [ ] Caring — therapeutic presence, patient-centered care
- [ ] Communication & Documentation — SBAR, charting standards, hand-off
- [ ] Teaching/Learning — patient education at appropriate literacy level
- [ ] Culture & Spirituality — culturally competent care
- [ ] Clinical Judgment — every NGN case study tagged to one or more CJMM steps

### 6.4 CJMM step tagging
- [ ] Every NGN item tagged to at least one of: Recognize Cues, Analyze Cues, Prioritize Hypotheses, Generate Solutions, Take Actions, Evaluate Outcomes
- [ ] Every full case-study has all 6 steps represented in sequence

### 6.5 Body-system + specialty depth (her hardest = patho + pharm)
- [ ] Cardiac (incl. EKG basics, ACS, HF, HTN, dysrhythmias, cardiogenic shock)
- [ ] Respiratory (asthma, COPD, PNA, PE, ARDS, ventilator basics)
- [ ] Neuro (stroke, TBI, seizures, ICP, MS, Parkinson, GBS, MG)
- [ ] GI (GI bleed, IBD, cirrhosis, pancreatitis, bowel obstruction)
- [ ] GU/Renal (AKI, CKD, dialysis, electrolytes, fluid balance, UTIs)
- [ ] Endocrine (DM type 1/2, DKA/HHS, thyroid, adrenal, pituitary)
- [ ] Hematologic (anemias, sickle cell, leukemias, lymphoma, DIC, ITP)
- [ ] Immune (HIV, autoimmune, hypersensitivity)
- [ ] Integumentary (burns rule of 9s, pressure injuries, wound care)
- [ ] MSK (fractures, traction, joint replacement, compartment syndrome)
- [ ] Repro / OB (antepartum complications, labor stages, postpartum, newborn)
- [ ] Peds (growth/development, congenital, communicable diseases)
- [ ] Mental health (mood, anxiety, psychotic, personality, eating, substance, suicide risk)
- [ ] Oncology (chemo precautions, neutropenia, oncologic emergencies)
- [ ] Multisystem / shock states (sepsis, hypovolemic, cardiogenic, distributive, obstructive)

### 6.6 Pharmacology depth (paired with patho — her top need)
- [ ] All major drug classes with prototype + key examples + nursing implications
- [ ] High-alert medications (insulin, anticoagulants, opioids, electrolytes, chemo, sedatives)
- [ ] Antidotes table (heparin↔protamine, warfarin↔vit K, opioids↔naloxone, benzo↔flumazenil, acetaminophen↔NAC, mag↔Ca gluconate, etc.)
- [ ] Black box warnings list
- [ ] Pregnancy/lactation safety per current FDA labeling
- [ ] Dosage calc question bank (mL/hr, gtt/min, mcg/kg/min, mEq, peds weight-based, IV titration)

### 6.7 Lab values depth
- [ ] Adult ranges with critical values and clinical meaning
- [ ] Peds & geriatric variations called out
- [ ] ABG interpretation drills (ROME / tic-tac-toe)
- [ ] CBC, CMP, coags, cardiac, lipid, LFTs, renal, thyroid, A1c, ABG, lactate, BNP, troponin

### 6.8 Mnemonics & "song" library (her #1 modality)
- [ ] Build mnemonic taxonomy (acronym, song, image-association, story, rhyme)
- [ ] Source/license a curated set of public-domain or originally-composed song mnemonics
- [ ] Audio player UI with replay, slow-mode, lyric scroll
- [ ] Tag mnemonics to concepts, drugs, labs
- [ ] At minimum 100 song mnemonics for top-tested topics

### 6.9 Reference tools (always-accessible)
- [ ] Drug database UI (search, filter by class/system, "what nurses watch for" front-and-center)
- [ ] Lab values reference UI (filter by system, ABG mini-tool, electrolyte tool)
- [ ] Equation/formula sheet (drug calc, IV calc, BMI, CrCl, MAP, pack-years)
- [ ] Mnemonic library UI (browse, search, favorite)
- [ ] Concept map browser (nodes link to questions/drugs/labs)

### 6.10 Editorial workflow
- [ ] Every item authored by an SME; reviewed by a second RN; approved by clinical lead
- [ ] Approval recorded in `questions.reviewed_by` + `last_reviewed_at`
- [ ] Quarterly content audit
- [ ] Public errata page; in-app "Report an issue" on every item

---

## Phase 7 — Onboarding (shaped by her interview answers)

- [ ] Warm landing copy ("You don't have to do this alone")
- [ ] Account creation (magic link first; Google second)
- [ ] **Learning-style intake** (the same questions we asked, persisted to `learning_preferences`)
- [ ] Exam target selection (RN / PN)
- [ ] Test date selection (calendar — affects FSRS retention target + pacing)
- [ ] Daily-time-budget selection (defaults to 480 min for our learner; adjustable)
- [ ] Topic confidence self-rating (anchors initial mastery estimates)
- [ ] Diagnostic mini-assessment (25 items, untimed, no score shown — only used to calibrate initial ability + weak-area surfacing)
- [ ] Personalized first-week plan generated and shown
- [ ] Tour overlay (skippable; never auto-replays)
- [ ] Email: welcome + "what to do tomorrow" digest

---

## Phase 8 — Analytics Dashboard

- [ ] **Today** card: minutes studied, items done, accuracy, streak, "next best action"
- [ ] **Weekly progress** view (visible, gentle): mastery deltas per Client Needs category
- [ ] **Mastery by domain**: 8 RN Client Needs (or PN equivalents) with % bars and trend arrows
- [ ] **Mastery by CJMM step**: which of the 6 cognitive steps is strongest/weakest (unique to NGN)
- [ ] **Mastery by body system**: heatmap
- [ ] **Predicted readiness**: probability of passing on test date (calibrated, never punitive — capped lower bound at "keep going")
- [ ] **Time-on-task**: weekly minutes by category
- [ ] **Confidence calibration**: how often "sure" answers were correct vs "guess" answers (metacognition)
- [ ] **Question-type performance**: accuracy & average time per item type
- [ ] **Drill-down**: click any tile → filtered review session
- [ ] Export: weekly PDF report (encouraging tone; great for sharing with study partner)
- [ ] Email digest: weekly progress email Sunday morning

---

## Phase 9 — Gamification (encouraging, never punishing)

- [ ] Streaks with **freeze credits** (1/week auto-granted; no shame for missing)
- [ ] Achievement library (e.g., "First 100 questions", "Pharm Pro", "Cardiac Whisperer", "Patho Powerhouse")
- [ ] Daily Mix completion = small confetti + kind affirmation
- [ ] Weekly mastery levels (Sprout → Sapling → Tree → Forest — sage/lavender themed)
- [ ] Optional study buddy mode (invite a friend — shared accountability, not leaderboards)
- [ ] Mute toggle for all gamification (some learners hate it — must be 1 click off)

---

## Phase 10 — Marketing site & Auth

- [ ] Landing page (hero, learner-first copy, demo question, social proof, pricing teaser)
- [ ] Pricing page
- [ ] About / Story page
- [ ] Blog (study tips, NCLEX changelog, "what's on the test")
- [ ] Auth pages (sign-in, sign-up, forgot password, magic-link confirmation)
- [ ] Account settings (profile, notifications, accessibility, billing)
- [ ] Sitemap + robots.txt + OpenGraph images per page
- [ ] SEO: structured data (Course, FAQ), llms.txt for AI crawlers

---

## Phase 11 — Payments (Stripe)

- [ ] Stripe account + products: monthly, quarterly (best value), one-time crash-course
- [ ] Free tier (25 questions/day + flashcards + drug DB read-only)
- [ ] 7-day full-access trial; no credit card required
- [ ] Stripe Checkout integration
- [ ] Stripe Customer Portal for self-service
- [ ] Webhook → entitlements sync (signup, renewal, cancel, refund, dispute)
- [ ] Coupon support; student discount
- [ ] Refund policy: 14-day no-questions-asked
- [ ] Receipts + tax handling (Stripe Tax)
- [ ] Failed-payment dunning emails (gentle copy)

---

## Phase 12 — Accessibility & Responsive

- [ ] WCAG 2.2 AA conformance audit (axe + manual)
- [ ] Keyboard nav for every item type (incl. drag/drop has keyboard alt)
- [ ] Screen-reader labels for matrix, cloze, bow-tie, hot-spot, highlight items
- [ ] Reduced-motion mode (respects `prefers-reduced-motion`)
- [ ] High-contrast mode
- [ ] Font-size override (Small/Medium/Large/X-Large)
- [ ] Color-blind safe palette (no red/green-only signaling)
- [ ] Mobile-first layouts for: flashcards, single-question, mnemonic player, daily streak
- [ ] Desktop-rich layouts for: dashboard, case studies, full timed sims, drug/lab tables
- [ ] Tablet breakpoints (split-pane study)
- [ ] Touch-target minimum 44×44 px
- [ ] iOS PWA install + offline flashcard pack

---

## Phase 13 — Performance & Quality

- [ ] Core Web Vitals targets: LCP < 2.0s, CLS < 0.05, INP < 150ms (mid-tier mobile)
- [ ] Image strategy: next/image, WebP/AVIF, lazy-load below fold
- [ ] Route-level code splitting; question renderers lazy-loaded by item-type
- [ ] DB query budget per route (no N+1; use `.select` projections)
- [ ] React Query for client cache; SSR/RSC for first paint
- [ ] Edge-function for high-traffic reads (drug/lab lookups)
- [ ] Lighthouse CI in PRs (perf ≥ 90, a11y = 100, best-practices ≥ 95)

---

## Phase 14 — Security & Privacy

- [ ] Supabase RLS on every user-data table (review per migration)
- [ ] Server-only service-role key (never shipped to client)
- [ ] CSRF protection on mutations
- [ ] Rate limits (per-IP + per-user) on auth + question submission
- [ ] HIBP password check on signup
- [ ] 2FA (TOTP) optional in account settings
- [ ] Audit log for admin actions
- [ ] Data export (GDPR/CCPA): one-click ZIP of user data
- [ ] Account deletion: hard-delete with 30-day grace
- [ ] Cookie consent (GDPR) banner; categorized cookies
- [ ] Penetration test before public launch (OWASP Top 10)
- [ ] Sentry PII scrubbing rules
- [ ] Backups: daily PITR (Supabase), weekly off-site to S3-compatible

---

## Phase 15 — Legal & Compliance

- [ ] **Disclaimer**: "Not affiliated with NCSBN, Pearson VUE, or any state board of nursing"
- [ ] **Disclaimer**: "Educational content only — does not guarantee passing the NCLEX"
- [ ] **Disclaimer**: "Drug, lab, and clinical content is for exam study only and is not medical advice; always follow institutional protocols and current guidelines in clinical practice"
- [ ] Terms of Service (jurisdiction, refund policy, AUP, indemnity)
- [ ] Privacy Policy (data categories, lawful basis, retention, sub-processors, contact)
- [ ] Cookie Policy
- [ ] DMCA / copyright notice
- [ ] Accessibility statement
- [ ] Trademark + brand usage: NCLEX® is a registered NCSBN trademark — use ® and disclaim affiliation
- [ ] If marketing PH/Asia learners: confirm local consumer-protection compliance
- [ ] Children-of-test-takers safeguard: 16+ age gate

---

## Phase 16 — Testing

- [ ] Unit tests: scoring engine (every item type × every scoring rule)
- [ ] Unit tests: shuffler (statistical fairness across 10k samples)
- [ ] Unit tests: FSRS scheduler vs reference vectors
- [ ] Unit tests: ability estimator
- [ ] Component tests: every renderer with golden inputs
- [ ] Integration tests: full session flow (start → answer → score → review)
- [ ] E2E (Playwright): onboarding → diagnostic → first study session → review → return next day
- [ ] E2E: timed CAT-sim hits 95% CI termination correctly
- [ ] E2E: case-study disables back-nav and progresses through 6 steps
- [ ] Accessibility tests: axe on every route in CI
- [ ] Visual regression: Storybook + Chromatic
- [ ] Load test: 1k concurrent users on question fetch + submit
- [ ] Beta testing program: 20 nursing students, 4 weeks, structured feedback

---

## Phase 17 — Content QA

- [ ] Every published question reviewed by ≥ 2 RNs (one as author, one as reviewer)
- [ ] Clinical lead approves before publish
- [ ] Quarterly re-review of all content for currency vs latest guidelines
- [ ] User-reported errata triaged within 7 days
- [ ] Auto-flag items with anomalous performance (e.g., < 20% accuracy across all users) for SME review
- [ ] Content style guide enforced (sentence case, US English, gender-inclusive language, person-first language)

---

## Phase 18 — Pre-Launch

- [ ] Brand and copy review (full pass for warmth + accuracy + no AI slop)
- [ ] Accessibility certification (third-party WCAG audit)
- [ ] Legal review of ToS / Privacy / disclaimers
- [ ] Pricing decision finalized; coupon plan
- [ ] Customer support: Help Center articles, in-app chat (Crisp/Intercom), `support@` email
- [ ] Status page (Statuspage / Vercel)
- [ ] Backups verified by restore drill
- [ ] On-call playbook + Sentry alerts → PagerDuty (or email)
- [ ] Production secret review (rotate any test keys)
- [ ] Final Lighthouse + axe + Sentry quiet hours
- [ ] Soft-launch with 50 invited beta users
- [ ] Capture testimonials from beta users (with consent)

---

## Phase 19 — Launch

- [ ] Public launch announcement (landing site, ProductHunt-style if relevant)
- [ ] Email launch sequence to waitlist
- [ ] Social: short demo videos of bow-tie, case study, mnemonic-song flashcard
- [ ] Day-0 monitoring: Sentry, status page, support inbox
- [ ] Day-7 retro; ship hotfixes
- [ ] First user-success story write-up (with permission)

---

## Phase 20 — Post-Launch (continuous)

- [ ] Monthly content drop (≥ 100 new items)
- [ ] Quarterly: re-fit FSRS defaults from population data
- [ ] Quarterly: re-calibrate item difficulty from response data
- [ ] Annual: full Test Plan re-audit (next major NCSBN update is 2029)
- [ ] Iterate on dashboard insights based on user behavior
- [ ] Add affiliate / school partnership program
- [ ] Localization: Spanish UI (US/PR market) — content remains English (test is English)

---

## Cross-Cutting Definition of Done

A feature is **done** when ALL are true:
- [ ] Typechecks (strict TS) and lints clean
- [ ] Unit + component tests written and passing
- [ ] Accessible (keyboard + screen reader + reduced motion verified)
- [ ] Mobile and desktop layouts tested in real devices
- [ ] No alarm-red, no shaming copy
- [ ] Content cited (if it touches clinical facts)
- [ ] Telemetry hooked up (key events tracked)
- [ ] Doc updated in `/docs`
- [ ] Reviewed and approved on PR

---

*Built for one specific person, with care. Every checkbox here exists because of something she said in her interview.*

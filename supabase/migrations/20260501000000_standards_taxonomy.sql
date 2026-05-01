-- =====================================================================
-- 2026 NCSBN NCLEX Test Plan — standards taxonomy
-- Effective April 1, 2026 – March 31, 2029
--
-- Sources:
--  * 2026 NCLEX-RN Test Plan (NCSBN)
--  * 2026 NCLEX-PN Test Plan (NCSBN)
--  * NCSBN Clinical Judgment Measurement Model (CJMM / NCJMM)
--
-- All percentage bands flagged "verify_pdf" should be confirmed against
-- the official 2026 PDFs before content is published. The 2026 RN bands
-- mirror the 2023 plan per NCSBN public statements; the 2026 PN PDF
-- returned 403 to anonymous fetch in research and must be verified.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- exam_target: which exam a row applies to
-- ---------------------------------------------------------------------
create type exam_target as enum ('RN', 'PN');

-- ---------------------------------------------------------------------
-- cjmm_steps: the 6 cognitive operations (Layer 3 of NCJMM)
-- ---------------------------------------------------------------------
create table public.cjmm_steps (
  id smallint primary key,
  slug text not null unique,
  name text not null,
  definition text not null,
  example_prompt text not null
);

insert into public.cjmm_steps (id, slug, name, definition, example_prompt) values
  (1, 'recognize-cues',     'Recognize Cues',
     'Identify relevant and important information from sources of data (e.g., medical history, vital signs).',
     'What in this scenario stands out — directly stated or quietly implied?'),
  (2, 'analyze-cues',       'Analyze Cues',
     'Organize and link recognized cues to the client''s clinical presentation.',
     'Which cues belong together, and what story do they tell?'),
  (3, 'prioritize-hypotheses','Prioritize Hypotheses',
     'Evaluate and prioritize hypotheses based on urgency, likelihood, risk, difficulty, and time.',
     'If only one issue can be addressed first, which one?'),
  (4, 'generate-solutions', 'Generate Solutions',
     'Identify expected outcomes and use hypotheses to define a set of interventions.',
     'What could be done — and what should not be on the table?'),
  (5, 'take-actions',       'Take Actions',
     'Implement the highest-priority solutions that address those hypotheses.',
     'In what order do you act, within scope, with the least harm?'),
  (6, 'evaluate-outcomes',  'Evaluate Outcomes',
     'Compare observed outcomes to expected outcomes; reassess.',
     'Did the picture change — and if not, why not?');

-- ---------------------------------------------------------------------
-- integrated_processes: 2026 plan
-- ---------------------------------------------------------------------
create table public.integrated_processes (
  id smallint primary key,
  slug text not null unique,
  name text not null,
  definition text not null
);

insert into public.integrated_processes (id, slug, name, definition) values
  (1, 'nursing-process',          'Nursing Process',
     'Assessment, analysis, planning, implementation, and evaluation.'),
  (2, 'caring',                   'Caring',
     'Therapeutic presence and patient-centered support.'),
  (3, 'communication-documentation','Communication and Documentation',
     'Verbal and nonverbal communication and accurate charting.'),
  (4, 'teaching-learning',        'Teaching/Learning',
     'Patient education appropriate to literacy and developmental level.'),
  (5, 'culture-spirituality',     'Culture and Spirituality',
     'Culturally and spiritually competent care.'),
  (6, 'clinical-judgment',        'Clinical Judgment',
     'Observed thinking process across the six CJMM steps.');

-- ---------------------------------------------------------------------
-- client_needs_categories: top-level categories per exam target
-- 2026 RN bands (mirror 2023 plan per NCSBN public statements).
-- 2026 PN bands flagged verify_pdf.
-- ---------------------------------------------------------------------
create table public.client_needs_categories (
  id serial primary key,
  exam_target exam_target not null,
  parent_id integer references public.client_needs_categories(id) on delete cascade,
  slug text not null,
  name text not null,
  pct_min numeric(4,1) not null,
  pct_max numeric(4,1) not null,
  verify_pdf boolean not null default false,
  unique (exam_target, slug)
);

-- ===== NCLEX-RN (2026 plan) =================================
-- Top-level: Safe & Effective Care Environment, Health Promotion & Maintenance,
--            Psychosocial Integrity, Physiological Integrity
insert into public.client_needs_categories (exam_target, slug, name, pct_min, pct_max) values
  ('RN', 'safe-and-effective-care-environment', 'Safe and Effective Care Environment', 25, 37),
  ('RN', 'health-promotion-and-maintenance',    'Health Promotion and Maintenance',    6, 12),
  ('RN', 'psychosocial-integrity',              'Psychosocial Integrity',              6, 12),
  ('RN', 'physiological-integrity',             'Physiological Integrity',             39, 63);

-- RN sub-categories (resolve parents by slug)
with parents as (
  select id, slug from public.client_needs_categories where exam_target = 'RN'
)
insert into public.client_needs_categories (exam_target, parent_id, slug, name, pct_min, pct_max, verify_pdf)
select 'RN', p.id, sub.slug, sub.name, sub.pct_min, sub.pct_max, sub.verify_pdf
from (values
  ('safe-and-effective-care-environment', 'management-of-care',                      'Management of Care',                      15.0, 21.0, false),
  ('safe-and-effective-care-environment', 'safety-and-infection-control',            'Safety and Infection Control',            10.0, 16.0, false),
  ('physiological-integrity',             'basic-care-and-comfort',                  'Basic Care and Comfort',                   6.0, 12.0, false),
  ('physiological-integrity',             'pharmacological-and-parenteral-therapies','Pharmacological and Parenteral Therapies',13.0, 19.0, true),
  ('physiological-integrity',             'reduction-of-risk-potential',             'Reduction of Risk Potential',              9.0, 15.0, false),
  ('physiological-integrity',             'physiological-adaptation',                'Physiological Adaptation',                11.0, 17.0, false)
) as sub(parent_slug, slug, name, pct_min, pct_max, verify_pdf)
join parents p on p.slug = sub.parent_slug;

-- ===== NCLEX-PN (2026 plan) — verify_pdf=true on every band =================================
insert into public.client_needs_categories (exam_target, slug, name, pct_min, pct_max, verify_pdf) values
  ('PN', 'safe-and-effective-care-environment', 'Safe and Effective Care Environment', 28, 40, true),
  ('PN', 'health-promotion-and-maintenance',    'Health Promotion and Maintenance',     6, 12, true),
  ('PN', 'psychosocial-integrity',              'Psychosocial Integrity',               9, 15, true),
  ('PN', 'physiological-integrity',             'Physiological Integrity',             33, 57, true);

with parents as (
  select id, slug from public.client_needs_categories where exam_target = 'PN'
)
insert into public.client_needs_categories (exam_target, parent_id, slug, name, pct_min, pct_max, verify_pdf)
select 'PN', p.id, sub.slug, sub.name, sub.pct_min, sub.pct_max, true
from (values
  ('safe-and-effective-care-environment', 'coordinated-care',                'Coordinated Care',                18.0, 24.0),
  ('safe-and-effective-care-environment', 'safety-and-infection-control',    'Safety and Infection Control',    10.0, 16.0),
  ('physiological-integrity',             'basic-care-and-comfort',          'Basic Care and Comfort',           7.0, 13.0),
  ('physiological-integrity',             'pharmacological-therapies',       'Pharmacological Therapies',       10.0, 16.0),
  ('physiological-integrity',             'reduction-of-risk-potential',     'Reduction of Risk Potential',      9.0, 15.0),
  ('physiological-integrity',             'physiological-adaptation',        'Physiological Adaptation',         7.0, 13.0)
) as sub(parent_slug, slug, name, pct_min, pct_max)
join parents p on p.slug = sub.parent_slug;

-- ---------------------------------------------------------------------
-- exam_constants: CAT rules + passing standards (2026 cycle)
-- ---------------------------------------------------------------------
create table public.exam_constants (
  exam_target exam_target primary key,
  min_items smallint not null,
  max_items smallint not null,
  total_minutes smallint not null,
  unscored_items smallint not null,
  passing_logits numeric(4,2) not null,
  cycle_start date not null,
  cycle_end date not null,
  source_url text not null
);

insert into public.exam_constants values
  ('RN', 85, 150, 300, 15, 0.00,  '2026-04-01', '2029-03-31',
   'https://www.ncsbn.org/publications/2026-nclex-rn-test-plan'),
  ('PN', 85, 150, 300, 15, -0.18, '2026-04-01', '2029-03-31',
   'https://www.ncsbn.org/publications/2026-nclex-pn-test-plan');

-- ---------------------------------------------------------------------
-- nclex item types — supports all NGN + classic
-- ---------------------------------------------------------------------
create type item_type as enum (
  'multiple_choice',
  'multiple_response',
  'fill_in_the_blank',
  'ordered_response',
  'hot_spot',
  'audio',
  'graphic',
  'chart_exhibit',
  'extended_multi_response',
  'extended_drag_drop',
  'cloze_dropdown',
  'enhanced_hotspot_highlight',
  'matrix_multiple_choice',
  'matrix_multiple_response',
  'bow_tie',
  'trend'
);

create type scoring_rule as enum (
  'dichotomous',
  'polytomous_plus_minus',
  'polytomous_rationale'
);

comment on type item_type      is '2026 NGN + classic NCLEX item types.';
comment on type scoring_rule   is '0/1, +/-, or rationale (linked all-or-nothing).';
comment on table public.cjmm_steps               is 'NCSBN Clinical Judgment Measurement Model — Layer 3 (six cognitive operations).';
comment on table public.client_needs_categories  is '2026 NCLEX Test Plan — Client Needs categories and sub-categories with NCSBN percentage bands.';
comment on table public.integrated_processes     is '2026 NCLEX Test Plan — Integrated Processes (apply across all Client Needs).';
comment on table public.exam_constants           is 'CAT rules and passing standards for the 2026–2029 NCLEX cycle.';

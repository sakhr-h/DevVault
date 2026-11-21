# DevVault Cybersecurity Academy

The Academy is an English-first, LTR, static learning application. Arabic hints are enabled by default and can be disabled without changing the Arabic RTL behavior of the DevVault root site.

## Architecture

- `assets/curriculum.js` is the authoritative registry for all course, stage, and specialization metadata.
- `assets/state.js` owns the version 2 local-storage schema, migration, course progress, gate history, and weaknesses.
- `assets/assessments.js` owns stable question IDs, question banks, randomized attempts, and grading.
- `assets/academy.js` renders the hub, courses, gates, and mistakes page.
- `courses/catalog.js` and `courses/bettercap.js` contain Courses 01–17; `courses/expansion.js` contains Courses 18–27.

Do not hardcode course totals or lesson denominators in a page. Add or move courses in the registry and let the UI derive navigation, filters, prerequisites, counts, and progress.

## Progress and migration

Version 2 is stored under `devvault_academy_state_v2`. On first load, the migration reads `acad_progress_v1` and `acad_ar`, translates compatible values, and records completion metadata. The legacy keys are never removed. Re-running migration is idempotent.

A course is gate-ready after every registered activity is complete and its course quiz best score is at least 70%. A mastery gate passes at 90% or higher. For Stage 3 and later, current and retention sections must each reach 90%, and the combined score must reach 90%.

## Safety boundary

Exercises are restricted to fictional data, isolated local training environments, or systems with explicit written authorization. Course content must not include exploit payloads, credential collection, malware or trojanized artifacts, persistence, C2/hooking scripts, or instructions to attack real targets.

## Verification

Run the dependency-free checks with:

```text
node academy/tests/academy.test.cjs
```

Also run `node --check` on Academy JavaScript and verify the UI at 320, 375, 768, 1024, and 1440 CSS pixels.

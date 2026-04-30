// DEPRECATED — DO NOT USE.
// This file was introduced in PR #333 and reverted because resolvePhase
// computed phases with different logic from spotlight-engine.mjs, causing
// incorrect carousel dividers. The frontend now reads item.phase directly
// from the DB, which is kept up to date by the daily cron in
// cinemagoria-candidates-selections (recalculate-spotlight-phases.js).
//
// This file is intentionally left empty. It will be removed in a follow-up cleanup.
export {}

// The seeded demo dataset is anchored to Sept 2025 ("today" for Arcova
// Technologies' books). Agents/tools use this instead of the real wall-clock
// date so "overdue" / "due soon" logic lines up with the seed data.
export const REFERENCE_DATE = new Date("2025-09-05T00:00:00.000Z");

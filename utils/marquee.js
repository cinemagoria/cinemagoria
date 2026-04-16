// Shared speed for all homepage marquees (News, Production, Streaming)
// so they visually scroll in sync. Tune this single value to change them all.
export const MARQUEE_SPEED_PX_PER_SEC = 40;

// Returns the CSS animation-duration (in seconds) needed so that the marquee
// track moves at MARQUEE_SPEED_PX_PER_SEC, given the width of a single group
// (one copy of the items — the track contains two identical copies).
export function computeMarqueeDuration(trackEl) {
  if (!trackEl) return 60;
  const group = trackEl.firstElementChild;
  if (!group) return 60;
  const width = group.getBoundingClientRect().width;
  if (!width) return 60;
  return width / MARQUEE_SPEED_PX_PER_SEC;
}

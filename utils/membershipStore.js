// Session-wide membership cache.
//
// One /membership-bulk request resolves watchlist + custom-list membership
// for EVERY card on every page. Before this, each Card's QuickFav fetched
// /membership/{email}/{type}/{id} individually on mount — a festival page
// with 100+ cards burst 100+ requests, scaling cinemagoria-favorites hard
// enough to exhaust the project-wide Cloud Run CPU quota (the "Rate
// exceeded" 429s seen on other services were collateral from those bursts).
//
// Mutations (watchlist/list toggles) emit the existing bus events; every
// QuickFav listener calls invalidateMembershipCache() + refetch. Same-tick
// invalidations are coalesced so N cards reacting to one event share a
// single fresh request instead of issuing N.

let _bulkPromise = null;
let _bulkEmail = null;
let _invalidateCoalesced = false;

export function invalidateMembershipCache() {
    // mitt dispatches an event's handlers synchronously, so every card's
    // invalidate for the same bus event lands in the same tick — only the
    // first one clears the cache, and the following refetches share one
    // in-flight promise.
    if (_invalidateCoalesced) return;
    _invalidateCoalesced = true;
    if (typeof queueMicrotask === 'function') {
        queueMicrotask(() => { _invalidateCoalesced = false; });
    } else {
        Promise.resolve().then(() => { _invalidateCoalesced = false; });
    }
    _bulkPromise = null;
}

export async function getMembership(tursoBackendUrl, userEmail, favId) {
    if (!_bulkPromise || _bulkEmail !== userEmail) {
        _bulkEmail = userEmail;
        const promise = fetchBulk(tursoBackendUrl, userEmail).catch((e) => {
            // Don't cache failures — let the next caller retry.
            if (_bulkPromise === promise) _bulkPromise = null;
            throw e;
        });
        _bulkPromise = promise;
    }
    const map = await _bulkPromise;
    return map.get(favId) || { inWatchlist: false, lists: [] };
}

async function fetchBulk(tursoBackendUrl, userEmail) {
    const resp = await fetch(`${tursoBackendUrl}/membership-bulk/${encodeURIComponent(userEmail)}`);
    if (!resp.ok) throw new Error(`membership-bulk failed: ${resp.status}`);
    const data = await resp.json();

    const map = new Map();
    const entry = (favId) => {
        if (!map.has(favId)) map.set(favId, { inWatchlist: false, lists: [] });
        return map.get(favId);
    };

    for (const favId of data.watchlist || []) {
        entry(favId).inWatchlist = true;
    }
    for (const list of data.lists || []) {
        for (const favId of list.items || []) {
            entry(favId).lists.push({ id: list.id, name: list.name, slug: list.slug });
        }
    }
    return map;
}

type CacheEntry<T> = {
    value?: T
    storedAt: number
    pending?: Promise<T>
}

const MAX_ENTRIES = 8
const entries = new Map<string, CacheEntry<unknown>>()

function entryFor<T>(key: string): CacheEntry<T> {
    const existing = entries.get(key) as CacheEntry<T> | undefined
    if (existing) {
        entries.delete(key)
        entries.set(key, existing)
        return existing
    }
    const created: CacheEntry<T> = { storedAt: 0 }
    entries.set(key, created)
    while (entries.size > MAX_ENTRIES) {
        const oldestKey = entries.keys().next().value
        if (oldestKey === undefined) break
        entries.delete(oldestKey)
    }
    return created
}

function load<T>(entry: CacheEntry<T>, loader: () => Promise<T>, isComplete: (value: T) => boolean): Promise<T> {
    if (!entry.pending) {
        entry.pending = loader()
            .then((value) => {
                if (isComplete(value)) {
                    entry.value = value
                    entry.storedAt = Date.now()
                }
                return value
            })
            .finally(() => {
                entry.pending = undefined
            })
    }
    return entry.pending
}

export function cachedWithRefresh<T>(
    key: string,
    freshForMs: number,
    loader: () => Promise<T>,
    isComplete: (value: T) => boolean = () => true,
): Promise<T> {
    const entry = entryFor<T>(key)
    if (entry.storedAt === 0) {
        return load(entry, loader, isComplete)
    }
    if (Date.now() - entry.storedAt >= freshForMs) {
        load(entry, loader, isComplete).catch((error) => {
            console.error(`[staleCache] background refresh failed for ${key}:`, error)
        })
    }
    return Promise.resolve(entry.value as T)
}

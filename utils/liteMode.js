// <html data-lite> is set before first paint by the inline script in nuxt.config.ts (TV app or ≤2 GB RAM).
export const isLiteMode = () => typeof document !== 'undefined' && document.documentElement.hasAttribute('data-lite');

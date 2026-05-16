// Minimal ambient declaration for markdown-it (no @types package installed).
// Only the surface used by the server feed builder is typed.
declare module 'markdown-it' {
    interface MarkdownItOptions {
        html?: boolean
        breaks?: boolean
        linkify?: boolean
        typographer?: boolean
        xhtmlOut?: boolean
        langPrefix?: string
    }

    class MarkdownIt {
        constructor(options?: MarkdownItOptions)
        render(src: string, env?: unknown): string
        renderInline(src: string, env?: unknown): string
    }

    export default MarkdownIt
}

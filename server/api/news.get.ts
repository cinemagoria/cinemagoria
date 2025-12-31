
export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const page = query.page || 1
    const limit = query.limit || 100
    const lang = query.lang || config.public.apiLang || 'en'

    try {
        const aggregatorUrl = 'https://entercinema-rss-aggregator.vercel.app/news'

        const response: any = await $fetch(aggregatorUrl, {
            params: {
                lang: lang,
                limit: limit,
                page: page,
                source: query.source
            }
        })

        return response

    } catch (error: any) {
        console.error('RSS Aggregator Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch news from aggregator',
        })
    }
})

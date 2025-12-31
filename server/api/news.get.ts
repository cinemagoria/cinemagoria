
export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const page = query.page || 1
    const limit = query.limit || 100
    const lang = query.lang || config.public.apiLang || 'en'

    try {
        const aggregatorUrl = config.public.newsAggregatorUrl as string

        interface NewsApiResponse {
            results: any[];
            [key: string]: any;
        }

        const response = await $fetch<NewsApiResponse>(aggregatorUrl, {
            params: {
                lang: lang,
                limit: limit,
                page: page,
                source: query.source
            },
            headers: {
                // Security: Explicitly identify ourselves to pass backend strict origin check
                'Origin': config.public.frontendUrl
            }
        })

        return response

    } catch (error: unknown) {
        console.error('RSS Aggregator Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch news from aggregator',
        })
    }
})

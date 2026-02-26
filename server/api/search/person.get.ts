export default defineEventHandler(async (event) => {
    const { query } = getQuery(event) as { query?: string };

    if (!query) {
        throw createError({ statusCode: 400, statusMessage: 'query param is required' });
    }

    const config = useRuntimeConfig();
    const apiKey = config.public.apiKey;

    const data = await $fetch<{ results: Array<{ id: number }> }>(
        `https://api.themoviedb.org/3/search/person`,
        { params: { api_key: apiKey, query, language: 'en-US' } }
    );

    return { results: data.results ?? [] };
});

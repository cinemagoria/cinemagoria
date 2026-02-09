export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const { type, imdbId } = query;

    if (!type || !imdbId) {
        return { available: false, error: 'Missing parameters' };
    }

    const targetUrl = `https://vidsrcme.ru/embed/${type}/${imdbId}/`;

    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
            redirect: 'follow',
        });

        if (!response.ok) {
            return { available: false };
        }

        const html = await response.text();
        if (html.includes('<title>404 Not Found</title>')) {
            return { available: false };
        }
        if (html.includes('This media is unavailable at the moment.')) {
            return { available: false };
        }

        return { available: true };
    } catch (error) {
        console.error('Error checking VidSRC availability:', error);
        return { available: false };
    }
});

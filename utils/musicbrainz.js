import axios from 'axios';

const BASE_URL = 'https://musicbrainz.org/ws/2';
const USER_AGENT = 'EnterCinema/1.0 ( https://entercinema.com )';

export async function searchSoundtracks(query, year) {
    try {
        const escapedQuery = query.replace(/"/g, '\\"');
        const luceneQuery = `releasegroup:"${escapedQuery}" AND secondarytype:soundtrack`;

        const response = await axios.get(`${BASE_URL}/release-group`, {
            params: {
                query: luceneQuery,
                fmt: 'json',
                limit: 100,
            },
            headers: typeof window === 'undefined' ? { 'User-Agent': USER_AGENT } : {}
        });

        if (response.data && response.data['release-groups']) {
            let results = response.data['release-groups'];

            if (year) {
                const targetYear = parseInt(year);
                results = results.filter(item => {
                    const date = item['first-release-date'];
                    if (!date) return false;
                    const itemYear = parseInt(date.split('-')[0]);
                    return Math.abs(itemYear - targetYear) <= 2;
                });
            }

            return results;
        }
        return [];
    } catch (error) {
        console.error('MusicBrainz API Error:', error);
        return [];
    }
}

export async function getAlbumTracks(releaseGroupId) {
    try {
        const releasesResp = await axios.get(`${BASE_URL}/release-group/${releaseGroupId}`, {
            params: {
                inc: 'releases',
                fmt: 'json'
            },
            headers: { 'User-Agent': USER_AGENT }
        });

        if (!releasesResp.data || !releasesResp.data.releases || !releasesResp.data.releases.length) {
            return null;
        }

        const releases = releasesResp.data.releases;
        let bestRelease = releases.find(r => r.status === 'Official') || releases[0];

        const tracksResp = await axios.get(`${BASE_URL}/release/${bestRelease.id}`, {
            params: {
                inc: 'recordings+artist-credits',
                fmt: 'json'
            },
            headers: typeof window === 'undefined' ? { 'User-Agent': USER_AGENT } : {}
        });

        if (tracksResp.data && tracksResp.data.media && tracksResp.data.media.length) {
            return tracksResp.data.media.flatMap(m => m.tracks);
        }

        return [];

    } catch (error) {
        console.error('MusicBrainz Track Fetch Error:', error);
        return null;
    }
}

export function getMusicBrainzUrl(id, type = 'release-group') {
    return `https://musicbrainz.org/${type}/${id}`;
}

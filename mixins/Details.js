import { apiImgUrl, getHeroEnrichment, getNoirEnrichment, getCustomEnrichment } from '~/utils/api';

function getItemMediaType(item) {
  if (item.type) return item.type === 'movie' ? 'movie' : 'tv';
  if (item.media_type) return item.media_type;
  // title = movie, name = tv (TMDB convention)
  return item.title ? 'movie' : 'tv';
}

function getEnrichmentMatch(enrichment, item) {
  const mediaType = getItemMediaType(item);
  return enrichment.get(`${item.id}-${mediaType}`) || enrichment.get(item.id);
}

// Per-field overrides from title_overrides table (highest priority)
async function getCustomOverrideMatch(item) {
  const customEnrichment = await getCustomEnrichment();
  return getEnrichmentMatch(customEnrichment, item) || null;
}

// Hierarchy: hero_selections (highest) > noir_historical > TMDB (lowest)
async function getBestEnrichmentMatch(item) {
  const heroEnrichment = await getHeroEnrichment();
  const heroMatch = getEnrichmentMatch(heroEnrichment, item);
  if (heroMatch) return heroMatch;

  const noirEnrichment = await getNoirEnrichment();
  return getEnrichmentMatch(noirEnrichment, item) || null;
}

export const id = {
  computed: {
    id() {
      const item = this.item;
      return item.id;
    }
  }
}

export const type = {
  computed: {
    type() {
      const item = this.item;
      return item.type;
    }
  }
}

export const name = {
  computed: {
    name() {
      const item = this.item;
      return item.title ? item.title : item.name;
    },
  },
};

export const genres = {
  computed: {
    genres() {
      const item = this.item;
      if (item.genres) {
        return item.genres;
      }
    }
  }
}

export const stars = {
  computed: {
    stars() {
      const item = this.item;
      if (item.imdb_rating && item.rating_source === 'imdb') {
        return item.imdb_rating * 10;
      } else if (item.vote_average) {
        return item.vote_average * 10;
      }
    },
  },
};

export const yearStart = {
  computed: {
    yearStart() {
      const item = this.item;
      const date = item.release_date ? item.release_date : item.first_air_date;
      if (date) {
        return date.split('-')[0];
      }
    },
  },
};

export const yearEnd = {
  computed: {
    yearEnd() {
      const item = this.item;
      const date = item.last_air_date;
      if (date) {
        return date.split('-')[0];
      }
    },
  },
};

export const poster = {
  data() {
    return { _enrichedPoster: null, _forcePoster: false, _posterItemId: null };
  },
  async mounted() {
    await this._loadPosterEnrichment();
  },
  watch: {
    'item.id'(newId) {
      if (newId !== this._posterItemId) {
        this._enrichedPoster = null;
        this._forcePoster = false;
        this._loadPosterEnrichment();
      }
    }
  },
  methods: {
    async _loadPosterEnrichment() {
      const item = this.item;
      if (!item?.id) return;
      this._posterItemId = item.id;

      // title_overrides: per-field override, always wins if poster_path is set
      const custom = await getCustomOverrideMatch(item);
      if (custom?.poster_path) {
        this._enrichedPoster = custom.poster_path;
        this._forcePoster = true;
        return;
      }

      const match = await getBestEnrichmentMatch(item);
      if (!item.poster_path || match?.force_enrichment) {
        if (match?.poster_path) {
          this._enrichedPoster = match.poster_path;
          this._forcePoster = match.force_enrichment || false;
        }
      }
    }
  },
  computed: {
    poster_path() {
      const item = this.item;
      if (this._enrichedPoster && this._forcePoster) {
        if (this._enrichedPoster.startsWith('http')) return this._enrichedPoster;
        return `${apiImgUrl}/w500${this._enrichedPoster}`;
      }
      if (item.poster_path) {
        if (item.poster_path.startsWith('http')) return item.poster_path;
        return `${apiImgUrl}/w500${item.poster_path}`;
      }
      if (this._enrichedPoster) {
        if (this._enrichedPoster.startsWith('http')) return this._enrichedPoster;
        return `${apiImgUrl}/w500${this._enrichedPoster}`;
      }
    },
  },
};

export const backdrop = {
  data() {
    return { _enrichedBackdrop: null, _forceBackdrop: false, _backdropItemId: null };
  },
  async mounted() {
    await this._loadBackdropEnrichment();
  },
  watch: {
    'item.id'(newId) {
      if (newId !== this._backdropItemId) {
        this._enrichedBackdrop = null;
        this._forceBackdrop = false;
        this._loadBackdropEnrichment();
      }
    }
  },
  methods: {
    async _loadBackdropEnrichment() {
      const item = this.item;
      if (!item?.id) return;
      this._backdropItemId = item.id;

      // title_overrides: per-field override, always wins if backdrop_path is set
      const custom = await getCustomOverrideMatch(item);
      if (custom?.backdrop_path) {
        this._enrichedBackdrop = custom.backdrop_path;
        this._forceBackdrop = true;
        return;
      }

      const match = await getBestEnrichmentMatch(item);
      if (!item.backdrop_path || match?.force_enrichment) {
        if (match?.backdrop_path) {
          this._enrichedBackdrop = match.backdrop_path;
          this._forceBackdrop = match.force_enrichment || false;
        }
      }
    }
  },
  computed: {
    backdrop() {
      const item = this.item;
      if (this._enrichedBackdrop && this._forceBackdrop) {
        if (this._enrichedBackdrop.startsWith('http')) return this._enrichedBackdrop;
        return `${apiImgUrl}/original${this._enrichedBackdrop}`;
      }
      if (item.backdrop_path) {
        if (item.backdrop_path.startsWith('http')) return item.backdrop_path;
        return `${apiImgUrl}/original${item.backdrop_path}`;
      }
      if (this._enrichedBackdrop) {
        if (this._enrichedBackdrop.startsWith('http')) return this._enrichedBackdrop;
        return `${apiImgUrl}/original${this._enrichedBackdrop}`;
      }
    },
  },
};

export const cert = {
  computed: {
    cert() {
      const item = this.item;
      if (item.release_dates) {
        const releases = item.release_dates.results.find(release => release.iso_3166_1 === process.env.API_COUNTRY || release.iso_3166_1 === 'US');
        if (!releases) return null;
        const certItem = releases.release_dates.find(date => date.certification !== '');
        if (certItem) return certItem.certification;
      } else if (item.content_ratings) {
        const releases = item.content_ratings.results.find(release => release.iso_3166_1 === process.env.API_COUNTRY || release.iso_3166_1 === 'US');
        if (!releases) return null;
        return releases.rating;
      }
    },
  },
};

export const trailer = {
  data() {
    return { _enrichedTrailerKey: null, _forceTrailer: false, _trailerItemId: null };
  },
  async mounted() {
    await this._loadTrailerEnrichment();
  },
  watch: {
    'item.id'(newId) {
      if (newId !== this._trailerItemId) {
        this._enrichedTrailerKey = null;
        this._forceTrailer = false;
        this._loadTrailerEnrichment();
      }
    }
  },
  methods: {
    async _loadTrailerEnrichment() {
      const item = this.item;
      if (!item?.id) return;
      this._trailerItemId = item.id;

      // title_overrides: per-field override, always wins if trailer_key is set
      const custom = await getCustomOverrideMatch(item);
      if (custom?.trailer_key) {
        this._enrichedTrailerKey = custom.trailer_key;
        this._forceTrailer = true;
        return;
      }

      const videos = item?.videos?.results || [];
      const hasTrailer = videos.some(v => v.type === 'Trailer' || v.type === 'Teaser' || v.type === 'CustomPriority');
      const match = await getBestEnrichmentMatch(item);
      if (!hasTrailer || match?.force_enrichment) {
        if (match?.trailer_key) {
          this._enrichedTrailerKey = match.trailer_key;
          this._forceTrailer = match.force_enrichment || false;
        }
      }
    }
  },
  computed: {
    trailer() {
      const item = this.item;
      let videos = item.videos.results;

      if (this._enrichedTrailerKey && this._forceTrailer) {
        return [{
          name: 'Trailer',
          src: `https://www.youtube.com/embed/${this._enrichedTrailerKey}?rel=0&showinfo=0&autoplay=1`,
        }];
      }

      if (!videos.length && this._enrichedTrailerKey) {
        return [{
          name: 'Trailer',
          src: `https://www.youtube.com/embed/${this._enrichedTrailerKey}?rel=0&showinfo=0&autoplay=1`,
        }];
      }

      if (!videos.length) return null;

      let video = videos.find(v => v.type === 'CustomPriority');
      if (!video) video = videos.find(v => v.type === 'Trailer');
      if (!video) video = videos.find(v => v.type === 'Teaser');
      if (!video) video = videos.find(v => v.type !== 'Featurette' && v.type !== 'CustomPriority');

      if (!video) {
        if (this._enrichedTrailerKey) {
          return [{
            name: 'Trailer',
            src: `https://www.youtube.com/embed/${this._enrichedTrailerKey}?rel=0&showinfo=0&autoplay=1`,
          }];
        }
        return null;
      }

      return [{
        name: video.name,
        src: `https://www.youtube.com/embed/${video.key}?rel=0&showinfo=0&autoplay=1`,
      }];
    },
  },
};

export const directors = {
  computed: {
    directors() {
      const item = this.item;
      const people = item.credits.crew;
      if (people) {
        return people.filter(person => person.job === 'Director').map(person => `<a href="/person/${person.id}">${person.name}</a>`).join(', ');
      }
    },
  },
};

export const creators = {
  computed: {
    creators() {
      const item = this.item;
      const people = item.created_by;
      if (people) {
        return people.map(person => `<a href="/person/${person.id}">${person.name}</a>`).join(', ');
      }
    },
  },
};

export const runtime = {
  computed: {
    runtime() {
      const item = this.item;
      if (item.runtime) {
        return item.runtime;
      }
      if (item.episode_run_time && item.episode_run_time.length > 0) {
        return item.episode_run_time[0];
      }
      return null;
    }
  }
};
import { apiImgUrl, getHeroEnrichment } from '~/utils/api';

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
    return { _enrichedPoster: null };
  },
  async mounted() {
    if (!this.item?.poster_path) {
      const enrichment = await getHeroEnrichment();
      const match = enrichment.get(this.item?.id);
      if (match?.poster_path) this._enrichedPoster = match.poster_path;
    }
  },
  computed: {
    poster_path() {
      const item = this.item;
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
    return { _enrichedBackdrop: null };
  },
  async mounted() {
    if (!this.item?.backdrop_path) {
      const enrichment = await getHeroEnrichment();
      const match = enrichment.get(this.item?.id);
      if (match?.backdrop_path) this._enrichedBackdrop = match.backdrop_path;
    }
  },
  computed: {
    backdrop() {
      const item = this.item;
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
    return { _enrichedTrailerKey: null };
  },
  async mounted() {
    const videos = this.item?.videos?.results || [];
    const hasTrailer = videos.some(v => v.type === 'Trailer' || v.type === 'Teaser' || v.type === 'CustomPriority');
    if (!hasTrailer) {
      const enrichment = await getHeroEnrichment();
      const match = enrichment.get(this.item?.id);
      if (match?.trailer_key) this._enrichedTrailerKey = match.trailer_key;
    }
  },
  computed: {
    trailer() {
      const item = this.item;
      let videos = item.videos.results;

      if (!videos.length && this._enrichedTrailerKey) {
        return [{
          name: 'Trailer',
          src: `https://www.youtube.com/embed/${this._enrichedTrailerKey}?rel=0&showinfo=0&autoplay=1`,
        }];
      }

      if (!videos.length) return null;

      let video = videos.find(v => v.type === 'CustomPriority');

      if (!video) {
        video = videos.find(v => v.type === 'Trailer');
      }
      if (!video) {
        video = videos.find(v => v.type === 'Teaser');
      }

      if (!video) {
        video = videos.find(v => v.type !== 'Featurette' && v.type !== 'CustomPriority');
      }

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
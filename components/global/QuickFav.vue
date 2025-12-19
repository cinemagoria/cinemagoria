<template>
  <div class="quick-fav-container" @click.prevent.stop>
    <button
      v-if="hasAccessToken"
      class="quick-fav-btn"
      :class="{ 'is-favorite': isFavorite }"
      @click="toggleFavorite"
      type="button"
      :aria-label="isFavorite ? 'Eliminar de Mi Lista' : 'Agregar a Mi Lista'"
    >
      <transition name="list-fade" mode="out-in">
        <!-- Plus icon -->
        <svg
          v-if="!isFavorite"
          key="plus"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#8BE9FD"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>

        <!-- Check icon -->
        <svg
          v-else
          key="check"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000000"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </transition>
    </button>
  </div>
</template>

<script>
import { name, stars, yearStart, yearEnd, poster, id, type, runtime } from '~/mixins/Details';

export default {
  name: 'QuickFav',
  mixins: [
    name,
    stars,
    yearStart,
    yearEnd,
    poster,
    id,
    type,
    runtime,
  ],
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isFavorite: false,
      hasAccessToken: false,
      userEmail: '',
      tursoBackendUrl: process.env.TURSO_BACKEND_URL || 'https://entercinema-favorites.vercel.app/api',
      nameForDb: null,
      starsForDb: null,
      posterForDb: null,
      yearStartForDb: null,
      yearEndForDb: null,
      idForDb: null,
      genresForDb: null,
      typeForDb: null,
      runtimeForDb: null,
      addedAt: null,
    };
  },
  computed: {
    compType() {
      if (this.item.media_type) return this.item.media_type;
      if (this.item.title) return 'movie';
      return 'tv';
    },
    favId() {
      return `${this.compType}/${this.item.id}`;
    },
    calculatedGenres() {
      if (this.item.genres && Array.isArray(this.item.genres)) {
        return this.item.genres.map(g => g.name).join(', ');
      }
      return ''; 
    }
  },
  mounted() {
    const email = localStorage.getItem('email');
    const accessToken = localStorage.getItem('access_token');
    this.userEmail = email || '';
    this.hasAccessToken = !!accessToken;

    if (this.hasAccessToken) {
      this.checkIfFavorite();
    }

    this.posterForDb = this.poster_path;
    this.nameForDb = this.name;
    this.starsForDb = this.stars;
    this.yearStartForDb = this.yearStart;
    this.yearEndForDb = this.yearEnd;
    this.idForDb = this.id;
    this.genresForDb = this.calculatedGenres;
    this.typeForDb = this.compType;
    this.runtimeForDb = this.runtime;
    
    this.$root.$on('favorites-updated', this.checkIfFavorite);
  },
  beforeDestroy() {
    this.$root.$off('favorites-updated', this.checkIfFavorite);
  },
  methods: {
    async checkIfFavorite() {
       try {
        const response = await fetch(`${this.tursoBackendUrl}/favorites/${this.userEmail}`);
        if (!response.ok) return;

        const data = await response.json();
        const moviesFetched = [];
        const tvFetched = [];

        if (data.favorites_json.movies) {
          data.favorites_json.movies.forEach(movie => {
            moviesFetched.push(Object.keys(movie)[0]);
          });
        }
        if (data.favorites_json.tv) {
          data.favorites_json.tv.forEach(tvShow => {
            tvFetched.push(Object.keys(tvShow)[0]);
          });
        }

        if (moviesFetched.includes(this.favId) || tvFetched.includes(this.favId)) {
          this.isFavorite = true;
        } else {
          this.isFavorite = false;
        }
      } catch (error) {
        console.error('Error checking favorite:', error);
      }
    },

    toggleFavorite() {
      if (this.isFavorite) {
        this.removeFavorite();
      } else {
        this.addFavorite();
      }
    },

    async removeFavorite() {
      if (!this.favId || !this.userEmail) return;

      try {
        const [itemType, itemId] = this.favId.split('/');
        const response = await fetch(
          `${this.tursoBackendUrl}/favorites/${this.userEmail}/${itemType}/${itemId}`,
          { 
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
          }
        );

        if (!response.ok) throw new Error('Failed to remove favorite');

        this.isFavorite = false;
        this.$root.$emit('favorites-updated'); 
      } catch (e) {
        console.error('Error removing favorite:', e);
      }
    },

    async addFavorite() {
      this.addedAt = new Date();
      let genresForDb = this.genresForDb;
      let externalIds = this.item.external_ids;
      let imdbRating = this.item.imdb_rating;
      let imdbVotes = this.item.imdb_votes;
      let ratingSource = this.item.rating_source || 'tmdb';

      if ((!genresForDb || !externalIds || !this.runtimeForDb) && this.idForDb) {
        try {
           const { getMovie, getTvShow } = await import('~/api');
           let fullDetails = null;

           if (this.typeForDb === 'movie') {
             fullDetails = await getMovie(this.idForDb);
           } else if (this.typeForDb === 'tv') {
             fullDetails = await getTvShow(this.idForDb);
           }

           if (fullDetails) {
             if (fullDetails.genres && Array.isArray(fullDetails.genres)) {
               genresForDb = fullDetails.genres.map(g => g.name).join(', ');
               this.genresForDb = genresForDb;
             }
             
             if (fullDetails.external_ids) {
               externalIds = fullDetails.external_ids;
             }
             
             if (fullDetails.imdb_rating && !imdbRating) {
               imdbRating = fullDetails.imdb_rating;
             }
             if (fullDetails.imdb_votes && !imdbVotes) {
               imdbVotes = fullDetails.imdb_votes;
             }
             if (fullDetails.rating_source) {
                ratingSource = fullDetails.rating_source;
             }

             if (fullDetails.runtime) {
               this.runtimeForDb = fullDetails.runtime;
             } else if (fullDetails.episode_run_time && fullDetails.episode_run_time.length > 0) {
               this.runtimeForDb = fullDetails.episode_run_time[0];
             }
           }
        } catch (err) {
          console.error('Error fetching full details for QuickFav:', err);
        }
      }

      const payload = {
        userEmail: this.userEmail,
        item: {
            nameForDb: this.nameForDb,
            starsForDb: this.starsForDb,
            yearStartForDb: this.yearStartForDb,
            yearEndForDb: this.yearEndForDb,
            posterForDb: this.posterForDb,
            idForDb: this.idForDb,
            genresForDb: genresForDb,
            typeForDb: this.typeForDb,
            addedAt: this.addedAt,
            external_ids: externalIds,
            rating_source: ratingSource,
            imdb_rating: imdbRating,
            imdb_votes: imdbVotes,
            runtime: this.runtimeForDb,
        }
      };

      try {
        const response = await fetch(`${this.tursoBackendUrl}/favorites`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to add favorite');
        
        this.isFavorite = true;
        this.$root.$emit('favorites-updated'); 
      } catch (e) {
        console.error(e);
      }
    },
  }
};
</script>

<style scoped lang="scss">
.quick-fav-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 20;
}

.quick-fav-btn {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  padding: 0;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
    border-color: #8BE9FD;
  }

  &.is-favorite {
    background: #8BE9FD;
    border-color: #000000;
  }
}

.list-fade-enter-active, .list-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.list-fade-enter, .list-fade-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>

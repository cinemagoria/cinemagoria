<template>
  <div class="quick-fav-container" @click.prevent.stop>
    <button
      v-if="hasAccessToken"
      class="quick-fav-btn"
      :class="{ 'is-favorite': isFavorite }"
      @click="toggleFavorite"
      type="button"
      :aria-label="isFavorite ? 'Eliminar de Mi Lista' : 'Añadir a Mi Lista'"
    >
      <transition name="list-fade" mode="out-in">
        <!-- Plus icon -->
        <svg width="14" height="14" fill="none" stroke="#8be9fd" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" v-if="!isFavorite" key="plus" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"/></svg>

        <!-- Check icon -->
        <svg width="14" height="14" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" v-else key="check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
      </transition>
    </button>
  </div>
</template>

<script>
import { name, stars, yearStart, yearEnd, poster, id, type, runtime } from '~/mixins/Details';
import { mapItemToDbPayload } from '~/utils/itemMapper';

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
    tursoBackendUrl() {
        return this.$config.public.tursoBackendUrl;
    },
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
    
    this.$bus.$on('favorites-updated', this.checkIfFavorite);
  },
  beforeDestroy() {
    this.$bus.$off('favorites-updated', this.checkIfFavorite);
  },
  methods: {
    async checkIfFavorite() {
       try {
        const response = await fetch(`${this.tursoBackendUrl}/favorites/${this.userEmail}`);
        if (!response.ok) return;

        const data = await response.json();
        const moviesFetched = [];
        const tvFetched = [];

        if (data.favorites_json && data.favorites_json.movies) {
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
        this.$bus.$emit('favorites-updated'); 
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
           const { getMovie, getTvShow } = await import('~/utils/api');
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

      const enrichedItem = {
        ...this.item,
        genresForDb: genresForDb,
        runtime: this.runtimeForDb,
        external_ids: externalIds,
        imdb_rating: imdbRating,
        imdb_votes: imdbVotes,
        rating_source: ratingSource,
        idForDb: this.idForDb,
        typeForDb: this.typeForDb,
        nameForDb: this.nameForDb,
        posterForDb: this.posterForDb,
        yearStartForDb: this.yearStartForDb,
        yearEndForDb: this.yearEndForDb,
        starsForDb: this.starsForDb,
        addedAt: this.addedAt
      };

      const payload = {
        userEmail: this.userEmail,
        item: mapItemToDbPayload(enrichedItem)
      };

      try {
        const response = await fetch(`${this.tursoBackendUrl}/favorites`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to add favorite');
        
        this.isFavorite = true;
        this.$bus.$emit('favorites-updated'); 
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

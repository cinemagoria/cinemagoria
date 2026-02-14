<template>
  <div class="quick-fav-container" @click.prevent.stop>
    <div class="quick-fav-wrapper">
      <button
        v-if="hasAccessToken"
        class="quick-fav-btn"
        :class="{ 'is-favorite': isInAnyList }"
        @click="openManageListsModal"
        type="button"
        :aria-label="isInAnyList ? 'Manage Lists' : 'Add to List'"
      >
        <transition name="list-fade" mode="out-in">
          <svg
            v-if="!isInAnyList"
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
      membership: { inWatchlist: false, lists: [] }
    };
  },
  computed: {
    tursoBackendUrl() {
        return this.$config.public.tursoBackendUrl;
    },
    compType() {
      if (this.item.media_type === 'movies' || this.item.media_type === 'movie') return 'movie';
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
    },
    isInAnyList() {
        return this.membership.inWatchlist || (this.membership.lists && this.membership.lists.length > 0);
    }
  },
  mounted() {
    const email = localStorage.getItem('email');
    const accessToken = localStorage.getItem('access_token');
    this.userEmail = email ? email.replace(/['"]+/g, '') : '';
    this.hasAccessToken = !!accessToken;

    this.posterForDb = this.poster_path;
    this.nameForDb = this.name;
    this.starsForDb = this.stars;
    this.yearStartForDb = this.yearStart;
    this.yearEndForDb = this.yearEnd;
    this.idForDb = this.id;
    this.genresForDb = this.calculatedGenres;
    this.typeForDb = this.compType;
    this.runtimeForDb = this.runtime;

    if (this.hasAccessToken) {
      this.checkMembership();
    }
    
    this.$bus.$on('favorites-updated', this.checkMembership);
    this.$bus.$on('lists-updated', this.checkMembership);
    this.$bus.$on('new-list-created', this.checkMembership);
  },
  beforeUnmount() {
    this.$bus.$off('favorites-updated', this.checkMembership);
    this.$bus.$off('lists-updated', this.checkMembership);
    this.$bus.$off('new-list-created', this.checkMembership);
  },
  methods: {
    async checkMembership() {
      if (!this.userEmail || !this.id) return;
      try {
         const response = await fetch(`${this.tursoBackendUrl}/membership/${encodeURIComponent(this.userEmail)}/${this.typeForDb}/${this.id}`);
         if (response.ok) {
             const data = await response.json();
             this.membership = data;
         }
      } catch(e) { console.error(e); }
    },

    async prepareDbPayload() {
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
            addedAt: new Date()
        };
        
        return mapItemToDbPayload(enrichedItem);
    },

    async openManageListsModal() {
        try {
            const itemPayload = await this.prepareDbPayload();
            
            this.$bus.$emit('show-add-to-list-modal', {
                ...this.item,
                ...itemPayload,
                 idForDb: this.idForDb,
                 typeForDb: this.typeForDb,
            });
        } catch (e) {
            console.error('Error opening list modal', e);
        }
    }
  }
};
</script>

<style scoped lang="scss">
.quick-fav-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 20;
}

.quick-fav-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.quick-fav-btn {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 50%;
  width: 36px; 
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  padding: 0;
  position: absolute;
  top: 15px; 
  right: 15px;
  pointer-events: auto;
  z-index: 1001; 

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



.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.list-fade-enter-active, .list-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.list-fade-enter, .list-fade-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>

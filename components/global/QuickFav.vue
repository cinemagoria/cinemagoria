<template>
  <div class="quick-fav-container" @click.prevent.stop v-click-outside="closeAddListMenu">
    <div class="quick-fav-wrapper">
      <button
        v-if="hasAccessToken"
        class="quick-fav-btn"
        :class="{ 'is-favorite': isInAnyList || showAddListMenu }"
        @click="toggleAddListMenu"
        type="button"
        :aria-label="isInAnyList ? 'Manage Lists' : 'Add to List'"
      >
        <transition name="list-fade" mode="out-in">
          <!-- Plus icon -->
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

      <!-- Dropdown Menu -->
      <transition name="fade">
        <div v-if="showAddListMenu" class="add-list-menu">
          <div class="menu-header">Save to</div>
          
          <button class="menu-option" @click.stop.prevent="handleToggleWatchlist">
            <div class="checkbox">
              <svg v-if="membership.inWatchlist" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span>Watchlist</span>
          </button>

          <div class="divider"></div>
          
          <div v-if="userLists.length > 0" class="custom-lists-container">
              <button 
                v-for="list in userLists" 
                :key="list.id" 
                class="menu-option"
                @click.stop.prevent="toggleListMembership(list)">
                <div class="checkbox">
                  <svg v-if="membership.lists.some(l => l.id === list.id)" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <!-- Added title attribute for hover tooltip of full name -->
                <span class="list-name" :title="list.name">{{ list.name }}</span>
              </button>
              <div class="divider"></div>
          </div>

          <button class="menu-option create-new" @click.stop.prevent="openCreateListModal">
            <span class="plus">+</span> Create New List
          </button>
        </div>
      </transition>
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
  directives: {
    'click-outside': {
        mounted(el, binding) {
            el.clickOutsideEvent = function (event) {
                if (!(el == event.target || el.contains(event.target))) {
                    binding.value(event);
                }
            };
            document.body.addEventListener('click', el.clickOutsideEvent);
        },
        beforeUnmount(el) {
            document.body.removeEventListener('click', el.clickOutsideEvent);
        }
    }
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
      showAddListMenu: false,
      userLists: [],
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
    this.$bus.$on('new-list-created', this.handleNewList);
  },
  beforeUnmount() {
    this.$bus.$off('favorites-updated', this.checkMembership);
    this.$bus.$off('lists-updated', this.checkMembership);
    this.$bus.$off('new-list-created', this.handleNewList);
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

    async fetchUserLists() {
        if (!this.userEmail) return;
        try {
            const response = await fetch(`${this.tursoBackendUrl}/lists/user/${encodeURIComponent(this.userEmail)}`);
            if (response.ok) {
                const data = await response.json();
                this.userLists = data.lists || [];
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

    async toggleAddListMenu() {
        this.showAddListMenu = !this.showAddListMenu;
        if (this.showAddListMenu) {
            await this.fetchUserLists();
            await this.checkMembership();
        }
    },
    
    closeAddListMenu() {
        this.showAddListMenu = false;
    },

    async handleToggleWatchlist() {
        if (this.membership.inWatchlist) {
             try {
                const response = await fetch(
                  `${this.tursoBackendUrl}/favorites/${this.userEmail}/${this.typeForDb}/${this.idForDb}`,
                  { 
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                  }
                );

                if (!response.ok) throw new Error('Failed to remove favorite');
                this.$bus.$emit('favorites-updated'); 
            } catch (e) {
                console.error('Error removing favorite:', e);
            }
        } else {
            const itemPayload = await this.prepareDbPayload();
             const payload = {
                userEmail: this.userEmail,
                item: itemPayload
            };

            try {
                const response = await fetch(`${this.tursoBackendUrl}/favorites`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error('Failed to add favorite');
                this.$bus.$emit('favorites-updated'); 
            } catch (e) {
                console.error(e);
            }
        }
        await this.checkMembership();
    },

    async toggleListMembership(list) {
        const isInList = this.membership.lists.some(l => l.id === list.id);
        
        try {
            if (isInList) {
                await fetch(`${this.tursoBackendUrl}/lists/${list.id}/items?itemId=${this.idForDb}&itemType=${this.typeForDb}&userEmail=${encodeURIComponent(this.userEmail)}`, { method: 'DELETE' });
            } else {
                const itemPayload = await this.prepareDbPayload();
                await fetch(`${this.tursoBackendUrl}/lists/${list.id}/items`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ item: itemPayload, userEmail: this.userEmail })
                });
            }
            await this.checkMembership();
            this.$bus.$emit('lists-updated');
        } catch(e) {
            console.error(e);
        }
    },
    
    openCreateListModal() {
        this.showAddListMenu = false;
        this.$bus.$emit('show-create-list-modal', this.item);
    },
    
    async handleNewList() {
        if (this.showAddListMenu) {
             await this.fetchUserLists();
             await this.checkMembership();
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

.add-list-menu {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: rgba(26, 26, 26, 0.98);
    backdrop-filter: blur(12px);
    border-radius: inherit;
    z-index: 900;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    pointer-events: auto;
    display: flex;
    flex-direction: column;
    padding: 20px 0 10px 0;
  
  .menu-header {
    padding: 0 16px 12px 20px;
    font-size: 0.9rem;
    color: #aaa;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    height: 36px;
  }
  
  .divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin: 4px 0;
    flex-shrink: 0;
  }
  
  button, span, div, svg {
      position: static !important;
      width: auto;
      height: auto;
  }

  .menu-option {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px 20px;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    color: #fff;
    font-family: inherit;
    font-size: 1rem;
    position: relative !important;
    transition: background 0.2s;
    flex-shrink: 0;
    
    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }
    
    .checkbox {
      width: 20px !important;
      height: 20px !important;
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 5px;
      margin-right: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      
      svg {
        width: 14px !important;
        height: 14px !important;
      }
    }
    
    .list-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
      position: static !important;
    }
    
    &.create-new {
      color: #8BE9FD;
      font-weight: 600;
      font-size: 1rem;
      margin-top: auto;
      padding-top: 12px;
      text-transform: uppercase;
      padding-bottom: 12px;
      
      .plus {
        font-size: 1.3rem;
        margin-right: 10px;
        line-height: 1;
        position: static !important; 
      }
      
      &:hover {
        background: rgba(139, 233, 253, 0.15);
      }
    }
  }
}

.custom-lists-container {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    position: relative !important;
    
    &::-webkit-scrollbar {
        width: 3px;
    }
    &::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.2);
        border-radius: 2px;
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

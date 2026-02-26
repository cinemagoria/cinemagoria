<template>
  <nav :class="$style.nav">
    <ul class="nolist">
      <li>
        <nuxt-link
          exact
          :to="{ name: 'index' }"
          aria-label="Inicio"
          @click.native="clearSearchBeforeNavigate">
          <img src="/icons/icon-medium.png" alt="Inicio" style="width: 32px; height: 32px;" class="home-icon" />
        </nuxt-link>
      </li>
       <li>
        <nuxt-link
          :to="{ name: 'movie' }"
          aria-label="Descubre"
          @click.native="clearSearchBeforeNavigate">
          <svg xmlns="http://www.w3.org/2000/svg" :class="$style.navIcon" style="width: 28px; height: 28px;" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18.364 19.364a9 9 0 1 0 -12.728 0" /><path d="M15.536 16.536a5 5 0 1 0 -7.072 0" /><path d="M11 13a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></svg>
        </nuxt-link>
      </li>
      <li>
        <nuxt-link
          :to="{ name: 'news' }"
          aria-label="Noticias"
          @click.native="clearSearchBeforeNavigate">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :class="$style.navIcon" viewBox="0 0 24 24"><path d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" /></svg>
        </nuxt-link>
      </li>

      <li v-if="!isLoggedIn">
        <nuxt-link exact to="/login" aria-label="Iniciar Sesión" @click.native="clearSearchBeforeNavigate">
          <img src="/icons/icon-login.png" alt="Iniciar Sesión" :class="$style.navIcon" />
        </nuxt-link>
      </li>
      <li v-else>
        <a 
          href="/watchlist" 
          @click.prevent.stop="handleWatchlistClick"
          aria-label="Mi Lista"
          :class="{ 'nuxt-link-active': isWatchlistActive }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" :class="$style.navIcon" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" /><path d="M14 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" /><path d="M4 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" /><path d="M14 17h6m-3 -3v6" /></svg>
        </a>
      </li>
    </ul>

    <transition name="slide-fade">
      <div v-if="showListsMenu" :class="$style.listsMenu" v-click-outside="closeListsMenu">
        <div :class="$style.menuHeader">
            <button :class="$style.createListBtn" @click="openCreateListModal">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </button>
            <button :class="$style.menuTitle" @click="navigateFromMenu('/lists')">
                Mis Colecciones
            </button>
        </div>
        
        <div :class="$style.closeButtonContainer">
            <button @click="closeListsMenu" :class="$style.closeMenuBtn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>
        
        <div :class="$style.menuContent">
            <div v-if="listsPage === 1" :class="$style.menuItem" @click="navigateFromMenu('/watchlist')">
                <div :class="$style.itemIcon">
                   <img src="/placeholders/empty-list-placeholder.webp" :class="$style.placeholderImgNav" alt="Mi Lista" />
                </div>
                <span :class="$style.listName">Mi Lista</span>
            </div>

             <div 
                v-for="list in displayedLists" 
                :key="list.id" 
                :class="$style.menuItem"
                @click="navigateFromMenu(`/lists/${list.slug}`)"
                :title="list.name"
             >
                <div :class="$style.itemIcon">
                   <div v-if="list.cover_images && list.cover_images.length > 0" :class="$style.dynamicCoverGridNav">
                       <div v-for="i in 4" :key="i" :class="$style.gridCellNav">
                           <img 
                             v-if="list.cover_images[i-1]" 
                             :src="resolvePoster(list.cover_images[i-1])" 
                             @error="handleImgError"
                             :class="$style.coverImgNav" 
                             alt="Cover"
                           />
                           <img 
                             v-else 
                             src="/placeholders/plus_placeholder.webp" 
                             :class="$style.coverImgNav" 
                             alt="Plus"
                           />
                       </div>
                   </div>
                   <div v-else :class="$style.fallbackIconNav">
                       <img src="/placeholders/empty-list-placeholder.webp" :class="$style.placeholderImgNav" alt="List" />
                   </div>
                </div>
                <span :class="$style.listName">{{ list.name }}</span>
            </div>
        </div>

        <div v-if="totalPages > 1" :class="$style.pagination">
            <button :disabled="listsPage === 1" @click.stop="listsPage--" :class="$style.pageBtn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <span :class="$style.pageInfo">{{ listsPage }} / {{ totalPages }}</span>
            <button :disabled="listsPage === totalPages" @click.stop="listsPage++" :class="$style.pageBtn">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
        </div>
      </div>
    </transition>

  </nav>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useSearchStore } from '~/stores/search';

export default {
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
  components: {
  },
  data() {
    return {
      authToken: null,
      authInterval: null,
      userLists: [],
      showListsMenu: false,
      listsPage: 1,
      listsPerPage: 8,
      isDesktop: false
    };
  },

  computed: {
    ...mapState(useSearchStore, ['searchOpen']),
    isLoggedIn() {
      return this.authToken !== null;
    },
    tursoBackendUrl() {
        return this.$config.public.tursoBackendUrl;
    },
    sortedUserLists() {
        return [...this.userLists].sort((a, b) => {
            const dateA = new Date(a.updated_at || a.created_at || 0);
            const dateB = new Date(b.updated_at || b.created_at || 0);
            return dateB - dateA;
        });
    },
    paginatedLists() {
        const start = (this.listsPage - 1) * this.listsPerPage;
        return this.sortedUserLists.slice(start, start + this.listsPerPage);
    },
    displayedLists() {
        if (this.isDesktop) {
            return this.sortedUserLists;
        }
        return this.paginatedLists;
    },
    totalPages() {
        if (this.isDesktop) {
            return 1;
        }
        return Math.ceil(this.userLists.length / this.listsPerPage);
    },
    isWatchlistActive() {
        return this.$route.path === '/watchlist' || this.$route.path.startsWith('/lists/');
    }
  },

  watch: {
    showListsMenu(val) {
        if (val) this.listsPage = 1;
    }
  },

  mounted() {
    this.checkAuthStatus();

    this.authInterval = setInterval(this.checkAuthStatus, 500);
    
    if (typeof window !== 'undefined') {
      this.checkScreenSize();
      window.addEventListener('resize', this.checkScreenSize);
      
      window.addEventListener('storage', this.handleStorageChange);
      window.addEventListener('auth-changed', this.checkAuthStatus);
      window.addEventListener('notifications-updated', this.fetchUnreadCount);
      
      this.$bus.$on('lists-updated', this.fetchUserLists);
      this.$bus.$on('new-list-created', this.fetchUserLists);

      if (window.location.pathname.includes('auth-success')) {
        this.forceUpdateNavIcons();
      }
      
      if (this.isLoggedIn) {
          this.fetchUserLists();
      }
    }
  },

  beforeDestroy() {
    if (this.authInterval) {
      clearInterval(this.authInterval);
    }
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.checkScreenSize);
      window.removeEventListener('storage', this.handleStorageChange);
      window.removeEventListener('auth-changed', this.checkAuthStatus);
      window.removeEventListener('notifications-updated', this.fetchUnreadCount);
    }
    this.$bus.$off('lists-updated', this.fetchUserLists);
    this.$bus.$off('new-list-created', this.fetchUserLists);
  },

  methods: {
    checkAuthStatus() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (token !== this.authToken) {
        this.authToken = token;
        if (this.authToken) this.fetchUserLists();
        else {
            this.userLists = [];
            this.showListsMenu = false;
        }
      }
    },

    forceUpdateNavIcons() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      this.authToken = token;
      this.fetchUserLists();
      this.$forceUpdate(); 
    },

    handleStorageChange(event) {
      if (event.key === 'access_token') {
        this.authToken = event.newValue;
        if (this.authToken) this.fetchUserLists();
      }
    },
    
    async fetchUserLists() {
        const email = localStorage.getItem('email')?.replace(/['"]+/g, '');
        if (!email) return;

        try {
            const response = await fetch(`${this.tursoBackendUrl}/lists/user/${encodeURIComponent(email)}`);
            if (response.ok) {
                const data = await response.json();
                const rawLists = data.lists || [];
                
                const hydratedLists = await Promise.all(rawLists.map(async (list) => {
                     let validCovers = (list.cover_images || []).filter(url => url && typeof url === 'string' && url.trim().length > 0 && !url.includes('null') && !url.includes('undefined'));
                     
                     if ((validCovers.length < 4 && list.item_count > validCovers.length) || (list.item_count > 0 && validCovers.length === 0)) {
                         try {
                              let items = list.items;
                              
                              if (!items || items.length === 0) {
                                  const detailsRes = await fetch(`${this.tursoBackendUrl}/lists/${list.slug}?userEmail=${encodeURIComponent(email)}`);
                                  if (detailsRes.ok) {
                                      const detailsData = await detailsRes.json();
                                      items = detailsData.items;
                                  }
                              }

                              if (items && Array.isArray(items)) {
                                  validCovers = items
                                      .map(item => item.poster_url || item.poster_path)
                                      .filter(url => url && typeof url === 'string' && url.trim().length > 0 && !url.includes('null') && !url.includes('undefined'))
                                      .slice(0, 4); 
                              }
                         } catch (err) {
                             console.error("Failed to hydrate list covers in Nav", err);
                         }
                     }
     
                     return { ...list, cover_images: validCovers };
                }));

                this.userLists = hydratedLists;
            }
        } catch (e) {
            console.error("Error fetching lists for Nav", e);
        }
    },

    resolvePoster(path) {
        if (!path) return '/empty-list-placeholder.webp';
        if (path.startsWith('http') || path.startsWith('//')) return path;
        return `https://image.tmdb.org/t/p/w200${path.startsWith('/') ? '' : '/'}${path}`;
    },

    handleImgError(e) {
        e.target.src = '/plus_placeholder.webp';
    },
    
    checkScreenSize() {
        this.isDesktop = window.innerWidth >= 1024;
    },

    handleWatchlistClick() {
        this.clearSearchBeforeNavigate();
        if (this.userLists.length > 0) {
            this.showListsMenu = !this.showListsMenu;
        } else {
            this.$router.push('/watchlist');
        }
    },
    
    closeListsMenu(e) {
        if (this.showListsMenu) {
             this.showListsMenu = false;
        }
    },
    
    navigateFromMenu(path) {
        this.showListsMenu = false;
        this.$router.push(path);
    },

    openCreateListModal() {
        this.showListsMenu = false;
        this.$bus.$emit('show-create-list-modal');
    },

    clearSearchBeforeNavigate() {
      this.$bus.$emit('clear-search');
    },

    toggleSearch() {
      if (this.$route.name !== 'search') {
        this.toggleSearchAction();
      }
    },

    ...mapActions(useSearchStore, { toggleSearchAction: 'toggleSearch' })
  }
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.nav {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  height: 4.5rem;
  background-color: #000;
  border: 1.5px solid rgba(34, 98, 121, 0.782);
  border-radius:9px;

  @media (min-width: $breakpoint-large) { 
    top: 0;
    right: auto;
    width: 9rem;
    height: 100%;
    border-radius:10px;
    border: 1.5px solid rgba(34, 98, 121, 0.782);
    border-right: 1.5px solid rgba(34, 98, 121, 0.782);
    padding: 1.5rem 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  ul {
    display: flex;
    height: 100%;
    padding: 0;
    margin: 0;

    @media (min-width: $breakpoint-large) {
      flex-direction: column;
    }

    li {
      flex: 1 1 auto; 
      height: 100%;
      list-style-type: none;
      display: flex;
      align-items: center;
      justify-content: center;

      @media (min-width: $breakpoint-large) { 
        flex: 0 0 auto; 
        height: 8rem; 
        margin: 1rem 0;
      }
    }
  }

  button {
    padding: 0;
    margin: 0;
    background: none;
    border: none;
    cursor: pointer;
    color: inherit; 
  }

  .navIcon {
    width: 24px;
    height: 24px;
    color: white;
    transition: all 0.2s ease;
    display: block;

    @media (min-width: $breakpoint-large) {
      width: 28px;
      height: 28px;
      margin: 0 auto;
    }
  }
  
  .sparkIconWrapper {
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
    position: relative;
  }
  
  .conversationIndicator {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 12px;
    height: 12px;
    background: #ff4757;
    border-radius: 50%;
    border: 2px solid #000;
    z-index: 1;
    animation: pulse-indicator 2s infinite;
    
    @media (min-width: $breakpoint-large) {
      width: 14px;
      height: 14px;
      top: -3px;
      right: -3px;
    }
  }

  @keyframes pulse-indicator {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.1); }
  }
  
  .betaBadge {
    position: absolute;
    top: -6px;
    right: -10px;
    background-color: #FF5252;
    color: white;
    font-size: 7px;
    padding: 2px 4px;
    border-radius: 4px;
    font-weight: bold;
    z-index: 1;
    
    @media (min-width: $breakpoint-large) {
      top: -6px;
      right: -8px;
      font-size: 9px;
    }
  }

  a,
  button {
    display: flex;
    align-items: center; 
    justify-content: center;
    width: 100%; 
    height: 100%; 
    outline: 0; 
    transition: opacity 0.2s;

    &:hover,
    &:focus {
      opacity: 0.8; 
    }
  }
}
.listsMenu {
    position: fixed;
    background-color: #000;
    border: 1.5px solid rgba(139, 233, 253, 0.3);
    z-index: 998; 
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 30px rgba(0,0,0,0.8);
    overflow: hidden;

    bottom: 5rem;
    left: 10px;
    right: 10px;
    border-radius: 15px;
    height: 250px;

    @media (min-width: $breakpoint-large) {
        top: 0; 
        margin-top: 6.2rem; 
        bottom: 0;
        height: 93.4%;
        max-height: none;
        
        left: 9.9rem;
        width: 280px;
        right: auto;
        
        border-radius: 15px; 
    }
}

.menuHeader {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    gap: 10px;
    
    .createListBtn {
        flex: 0 0 auto;
        width: 32px;
        height: 32px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #8BE9FD;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        color: #000;
        transition: background 0.2s ease, transform 0.15s ease;

        &:hover {
            background: #73cde0;
            transform: scale(1.04);
        }
    }

    .menuTitle {
        margin: 0;
        width: fit-content;
        font-size: 1.2rem;
        color: #8BE9FD;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        line-height: 1;
        white-space: nowrap;
        background: rgba(139, 233, 253, 0.07);
        border: 1px solid rgba(139, 233, 253, 0.28);
        border-radius: 15px;
        padding: 7px 18px;
        cursor: pointer;
        font-family: inherit;
        font-weight: inherit;
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        transition: background 0.2s ease, border-color 0.2s ease;

        &:hover {
            background: rgba(139, 233, 253, 0.14);
            border-color: rgba(139, 233, 253, 0.5);
        }
    }
}

.closeButtonContainer {
    position: absolute;
    top: 1.8rem;
    right: 1.5rem;
    z-index: 10;
}

.closeMenuBtn {
    background: none;
    border: none;
    position: relative;
    top: -0.3rem;
    color: #8BE9FD; 
    cursor: pointer;
    display: flex;
    padding: 0;
    
    &:hover { opacity: 0.8; }
}


.menuContent {
    flex: 1;
    overflow-y: hidden;
    overflow-x: auto;
    padding: 1rem;
    padding-bottom: 2rem;
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
    
    -ms-overflow-style: none; 
    scrollbar-width: none;
    &::-webkit-scrollbar {
        display: none;
    }
    
    @media (min-width: $breakpoint-large) {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
        grid-template-columns: unset;
        padding-bottom: 1rem;
        gap: 0.5rem;
    }
}

.menuItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
    min-width: 140px;
    max-width: 140px;
    text-align: center;
    
    &:hover {
        background: transparent;
    }

    @media (min-width: $breakpoint-large) {
        flex-direction: row;
        align-items: center;
        padding: 0.8rem 1rem;
        min-width: 0;
        max-width: none;
        text-align: left;
        
        &:hover {
             background: rgba(139, 233, 253, 0.1);
        }
    }

    .itemIcon {
        width: 120px;
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.8rem;
        margin-right: 0;
        flex-shrink: 0;
        border-radius: 8px;
        overflow: hidden;
        background: #000;
        
        @media (min-width: $breakpoint-large) {
             width: 44px;
             height: 44px;
             margin-bottom: 0;
             margin-right: 1.2rem;
             border-radius: 6px;
        }

        svg {
            width: 40px;
            height: 40px;
            object-fit: contain;

            @media (min-width: $breakpoint-large) {
                 width: 24px;
                 height: 24px;
            }
        }
    }
    
    .dynamicCoverGridNav {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 0;
    }
    
    .gridCellNav {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    
    .coverImgNav {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
    
    .emptyCellNav {
        width: 100%;
        height: 100%;
        background: #111;
    }
    
    .fallbackIconNav {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #111;
    }
    
    .placeholderImgNav {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .listName {
        color: #fff;
        font-size: 1.1rem;
        white-space: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        min-width: 0;
        flex: unset;
        width: 100%;
        line-height: 1.3;
        padding: 0 5px;
        
        @media (min-width: $breakpoint-large) {
            font-size: 1.2rem;
            white-space: nowrap;
            flex: 1;
            width: auto;
            -webkit-line-clamp: unset;
            display: block;
            padding: 0;
        }
    }
}

.divider {
    height: 1px;
    background: rgba(255,255,255,0.1);
    margin: 0.5rem 0;
    width: 100%;
}

.pagination {
    padding: 1rem;
    border-top: 1px solid rgba(255,255,255,0.1);
    display: flex;
    flex-direction: row !important;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    color: #8BE9FD; 
    font-size: 1.1rem;
}

.pageInfo {
    font-weight: bold;
    white-space: nowrap;
}

.pageBtn {
    background: none;
    border: 1px solid rgba(139, 233, 253, 0.3);
    border-radius: 5px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8BE9FD;
    cursor: pointer;
    
    &:hover:not(:disabled) {
        background: rgba(139, 233, 253, 0.1);
        border-color: #8BE9FD;
    }
    
    &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
        border-color: rgba(255,255,255,0.1);
        color: #fff;
    }
}
</style>

<style lang="scss" scoped>
@use '~/assets/css/utilities/variables' as *;

a.nuxt-link-active {
  &:hover,
  &:focus {
    opacity: 1;
  }

  svg g { 
    stroke: #8BE9FD; 
  }

  svg {
    color: #8BE9FD;
    stroke: #8BE9FD;
  }

  img:not(.home-icon) { 
    filter: brightness(0) saturate(100%) invert(83%) sepia(76%) saturate(618%) hue-rotate(164deg) brightness(96%) contrast(108%);
  }
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
  
  @media (min-width: $breakpoint-large) {
      transform: translateX(-20px);
  }
}
</style>



<style lang="scss" scoped>
@use '~/assets/css/utilities/variables' as *;

a.nuxt-link-active {
  &:hover,
  &:focus {
    opacity: 1;
  }

  svg g { 
    stroke: #8BE9FD; 
  }

  svg {
    color: #8BE9FD;
    stroke: #8BE9FD;
  }

  img:not(.home-icon) { 
    filter: brightness(0) saturate(100%) invert(83%) sepia(76%) saturate(618%) hue-rotate(164deg) brightness(96%) contrast(108%);
  }
}
</style>
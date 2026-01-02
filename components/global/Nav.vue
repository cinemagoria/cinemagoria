<template>
  <nav :class="$style.nav">
    <ul class="nolist">
      <li>
        <nuxt-link
          exact
          :to="{ name: 'index' }"
          aria-label="Home"
          @click.native="clearSearchBeforeNavigate">
          <img src="/icon-medium.png" alt="Home" style="width: 32px; height: 32px;" class="home-icon" />
        </nuxt-link>
      </li>
      <li>
        <nuxt-link
          :to="{ name: 'movie' }"
          aria-label="Movies"
          @click.native="clearSearchBeforeNavigate">
          <svg xmlns="http://www.w3.org/2000/svg" :class="$style.navIcon" viewBox="0 0 24 24">
            <g fill="none" stroke="#fff" stroke-width="1.5" stroke-miterlimit="10" stroke-linejoin="round" stroke-linecap="round">
              <path d="M3.2 12.8h19.6v9.5c0 .5-.4.9-1 .9H4.1c-.5 0-1-.4-1-.9v-9.5"/>
              <path d="M3.3 13.1l-2-4.4c-.2-.5 0-1 .5-1.2L18 .8c.5-.2 1.1 0 1.3.5l1.8 4-17.5 7.3"/>
              <path d="M15 2.1l-.9 6M8 4.7l-1.2 6.6"/>
            </g>
          </svg>
        </nuxt-link>
      </li>
      <li>
        <nuxt-link
          :to="{ name: 'advancedsearch' }"
          aria-label="Advanced Search"
          @click.native="clearSearchBeforeNavigate">
          <img src="/icon-advancedsearch.png" alt="Advanced Search" :class="$style.navIcon" />
        </nuxt-link>
      </li>
      <li>
        <nuxt-link
          :to="{ name: 'news' }"
          aria-label="News"
          @click.native="clearSearchBeforeNavigate">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="$style.navIcon">
            <path d="M4 11a9 9 0 0 1 9 9"/>
            <path d="M4 4a16 16 0 0 1 16 16"/>
            <circle cx="5" cy="19" r="1"/>
          </svg>
        </nuxt-link>
      </li>

      <li v-if="!isLoggedIn">
        <nuxt-link exact to="/login" aria-label="Sign In" @click.native="clearSearchBeforeNavigate">
          <img src="/icon-login.png" alt="Login" :class="$style.navIcon" />
        </nuxt-link>
      </li>
      <li v-else>
        <nuxt-link exact to="/watchlist" aria-label="Watchlist" @click.native="clearSearchBeforeNavigate">
          <img src="/icon-watchlist.png" alt="Watchlist" :class="$style.navIcon" />
        </nuxt-link>
      </li>
    </ul>


  </nav>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useSearchStore } from '~/stores/search';

export default {
  components: {
  },
  data() {
    return {
      authToken: null,
      authInterval: null
    };
  },

  computed: {
    ...mapState(useSearchStore, ['searchOpen']),
    isLoggedIn() {
      return this.authToken !== null;
    }
  },

  mounted() {
    this.checkAuthStatus();

    this.authInterval = setInterval(this.checkAuthStatus, 500);
    
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleStorageChange);
      window.addEventListener('auth-changed', this.checkAuthStatus);
      window.addEventListener('notifications-updated', this.fetchUnreadCount);

      if (window.location.pathname.includes('auth-success')) {
        this.forceUpdateNavIcons();
      }
    }
  },

  beforeDestroy() {
    if (this.authInterval) {
      clearInterval(this.authInterval);
    }
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.handleStorageChange);
      window.removeEventListener('auth-changed', this.checkAuthStatus);
      window.removeEventListener('notifications-updated', this.fetchUnreadCount);
    }
  },

  methods: {
    checkAuthStatus() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (token !== this.authToken) {
        this.authToken = token;
      }
    },

    forceUpdateNavIcons() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      this.authToken = token;
      this.$forceUpdate(); 
    },

    handleStorageChange(event) {
      if (event.key === 'access_token') {
        this.authToken = event.newValue;
      }
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
<template>
  <nav :class="$style.nav">
    <ul class="nolist">
      <!-- Home Link -->
      <li>
        <nuxt-link
          exact
          :to="{ name: 'index' }"
          aria-label="Home"
          @click.native="clearSearchBeforeNavigate">
          <img src="~static/icon-medium.png" alt="Home" style="width: 32px; height: 32px;" />
        </nuxt-link>
      </li>
      <!-- Movies Link -->
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
      <!-- Advanced Search Link -->
      <li>
        <nuxt-link
          :to="{ name: 'advancedsearch' }"
          aria-label="Advanced Search"
          @click.native="clearSearchBeforeNavigate">
          <img :src="require('~/static/icon-advancedsearch.png')" alt="Advanced Search" :class="$style.navIcon" />
        </nuxt-link>
      </li>
      
      <!-- Upcoming Link -->
      <li>
        <nuxt-link
          :to="{ name: 'upcoming' }"
          aria-label="upcoming"
          @click.native="clearSearchBeforeNavigate">
          <img :src="require('~/static/icon-upcoming.png')" alt="Upcoming" :class="$style.navIcon" />
        </nuxt-link>
      </li>
      
      <!-- Ask AI Link -->
      <li>
        <button @click="openAiChat" aria-label="Ask AI" title="Ask AI Assistant">
          <span :class="$style.sparkIconWrapper">
            <div v-if="hasMinimizedConversations" :class="$style.conversationIndicator"></div>
            
            <!-- SVG Spark Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" :class="[$style.navIcon, 'size-6']">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
            </svg>
          </span>
        </button>
      </li>
      
      <!-- Login/Watchlist Links -->
      <li v-if="!isLoggedIn">
        <nuxt-link exact to="/login" aria-label="Sign In" @click.native="clearSearchBeforeNavigate">
          <img :src="require('~/static/icon-login.png')" alt="Login" :class="$style.navIcon" />
        </nuxt-link>
      </li>
      <li v-else>
        <nuxt-link exact to="/watchlist" aria-label="Watchlist" @click.native="clearSearchBeforeNavigate">
          <img :src="require('~/static/icon-watchlist.png')" alt="Watchlist" :class="$style.navIcon" />
        </nuxt-link>
      </li>
    </ul>

    <ChatbotModal ref="chatbotModalRef" />
  </nav>
</template>

<script>
import { mapState } from 'vuex';
import ChatbotModal from './ChatbotModal.vue';

export default {
  components: {
    ChatbotModal
  },
  data() {
    return {
      authToken: null,
      authInterval: null,
      hasMinimizedConversations: false
    };
  },

  computed: {
    ...mapState('search', ['searchOpen']),
    isLoggedIn() {
      return this.authToken !== null;
    }
  },

  mounted() {
    this.checkAuthStatus();
    this.checkMinimizedConversations();

    this.authInterval = setInterval(this.checkAuthStatus, 500);
    
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleStorageChange);
      window.addEventListener('auth-changed', this.checkAuthStatus); 

      if (window.location.pathname.includes('auth-success')) {
        this.forceUpdateNavIcons();
      }
    }

    this.$root.$on('chatbot-conversations-updated', (hasConversations) => {
      this.hasMinimizedConversations = hasConversations;
    });
  },

  beforeDestroy() {
    if (this.authInterval) {
      clearInterval(this.authInterval);
    }
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.handleStorageChange);
      window.removeEventListener('auth-changed', this.checkAuthStatus);
    }
  },

  methods: {
    checkAuthStatus() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (token !== this.authToken) {
        this.authToken = token;
      }
    },

    checkMinimizedConversations() {
      try {
        if (typeof localStorage !== 'undefined') {
          const conversations = JSON.parse(localStorage.getItem('entercinema_chat_conversations') || '{}');
          this.hasMinimizedConversations = Object.keys(conversations).length > 0 && 
            Object.values(conversations).some(conv => conv.messages && conv.messages.length > 0);
        }
      } catch (error) {
        console.warn('Error checking conversations:', error);
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
      } else if (event.key === 'entercinema_chat_conversations') {
        this.checkMinimizedConversations();
      }
    },

    clearSearchBeforeNavigate() {
      this.$root.$emit('clear-search');
      if (this.$refs.chatbotModalRef && this.$refs.chatbotModalRef.chatBotOpen) {
        this.$refs.chatbotModalRef.minimizeChatBot();
      }
    },

    toggleSearch() {
      if (this.$route.name !== 'search') {
        this.$store.commit('search/toggleSearch');
      }
    },

    openAiChat() {
      if (this.$refs.chatbotModalRef) {
        this.$refs.chatbotModalRef.open();
        this.hasMinimizedConversations = false;
      } else {
        console.error('ChatbotModal ref not found!');
      }
    }
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
  z-index: 5;
  height: 4.5rem;
  background-color: #000;

  @media (min-width: $breakpoint-large) { 
    top: 0;
    right: auto;
    width: 10rem;
    height: 100%;
    border-right: 1px solid $secondary-color;
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
    stroke: $primary-color; 
  }
}
</style>
<template>
  <div class="user-nav-container">
    <button 
      @click="openAiChat" 
      class="ask-ai-button" 
      :aria-label="currentLanguage === 'es' ? 'Preguntar a IA' : 'Ask AI'" 
      :title="currentLanguage === 'es' ? 'Preguntar a IA' : 'Ask AI'">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="spark-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    </button>

    <div v-if="isLoggedIn" class="user-nav-logged-in">
      <div class="avatar-container" @click="toggleMenu">
        <img :src="userAvatar" alt="User Avatar" class="avatar">
      </div>

      <div v-if="isMenuOpen" class="dropdown-menu">
        <div class="menu-item email-item">
          <span class="user-email">{{ truncatedEmail }}</span>
        </div>

        <div class="menu-divider"></div>

        <div class="menu-item" @click="goToHome">
          <svg class="menu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-miterlimit="10" stroke-linejoin="round">
              <path d="M8.5 23.2H1.3V9L12 .8 22.7 9v14.2h-7.2v-5c0-1.9-1.6-3.4-3.5-3.4s-3.5 1.5-3.5 3.4v5z"/>
            </g>
          </svg>
          <span class="menu-label">Home</span>
        </div>

        <div class="menu-item" @click="goToWatchlist">
          <img src="~/static/icon-watchlist.png" alt="Watchlist Icon" class="menu-icon">
          <span class="menu-label">Watchlist</span>
        </div>

        <div class="menu-item" @click="showRatedModal">
          <svg class="menu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
          </svg>
          <span class="menu-label">Rated</span>
        </div>

        <div class="menu-item" @click="goToSettings">
          <img src="~/static/icon-settings.png" alt="Settings Icon" class="menu-icon">
          <span class="menu-label">Settings</span>
        </div>

        <div class="menu-divider"></div>

        <div class="menu-item language-switch" @click="toggleLanguage">
          <img src="~static/langpicker-icon.png" alt="Language Icon" class="menu-icon">
          <span class="menu-label">{{ currentLanguage === 'en' ? 'English' : 'Español' }}</span>
          <div class="switch-container">
            <div class="switch" :class="{ active: currentLanguage === 'es' }">
              <div class="switch-handle"></div>
            </div>
          </div>
        </div>

        <div class="menu-divider"></div>

        <div class="menu-item" @click="signOut">
          <img src="~/static/icon-logout.png" alt="Logout Icon" class="menu-icon">
          <span class="menu-label menu-label-logout">Log out</span>
        </div>
      </div>
    </div>

    <div v-else class="user-nav-logged-out">
      <button class="sign-in-button" @click="goToLogin" aria-label="Sign In">
        <img src="~/static/icon-login.png" alt="Login Icon" class="sign-in-icon">
        <span class="sign-in-label">Sign In</span>
      </button>
    </div>

    <ChatbotModal ref="chatbotModalRef" />
  </div>
</template>

<script>
import supabase from '@/services/supabase';
import ChatbotModal from './ChatbotModal.vue';

export default {
  name: 'UserNav',
  
  components: {
    ChatbotModal
  },

  data() {
    return {
      isLoggedIn: false,
      userEmail: '',
      userAvatar: '/avatars/avatar-ss0.png',
      isMenuOpen: false,
      currentLanguage: 'en',
    };
  },

  computed: {
    truncatedEmail() {
      if (!this.userEmail) return '';
      if (this.userEmail.length <= 25) return this.userEmail;
      
      const [localPart, domain] = this.userEmail.split('@');
      if (localPart.length > 15) {
        return `${localPart.substring(0, 12)}...@${domain}`;
      }
      return this.userEmail;
    }
  },

  async mounted() {
    const email = localStorage.getItem('email');
    const accessToken = localStorage.getItem('access_token');
    
    this.isLoggedIn = !!accessToken;
    this.userEmail = email || '';

    const hostname = window.location.hostname;
    this.currentLanguage = hostname.startsWith('es.') ? 'es' : 'en';

    if (this.isLoggedIn && email) {
      await this.fetchUserAvatar(email);
    }
    this.$nextTick(() => {
      document.addEventListener('click', this.handleClickOutside);
    });
  },

  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },

  methods: {
    handleClickOutside(event) {
      const dropdownMenu = this.$el.querySelector('.dropdown-menu');
      const avatarContainer = this.$el.querySelector('.avatar-container');
      
      if (this.isMenuOpen && 
          dropdownMenu && 
          !dropdownMenu.contains(event.target) && 
          !avatarContainer.contains(event.target)) {
        this.isMenuOpen = false;
      }
    },
    async fetchUserAvatar(email) {
      try {
        const { data, error } = await supabase
          .from('user_data')
          .select('avatar')
          .eq('email', email);

        if (error) throw error;

        this.userAvatar = data[0]?.avatar || '/avatars/avatar-ss0.png';
      } catch (error) {
        console.error('Error fetching user avatar:', error);
        this.userAvatar = '/avatars/avatar-ss0.png';
      }
    },

    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },

    toggleLanguage() {
      const currentPath = this.$route.path;
      const currentOrigin = window.location.origin;
      
      if (this.currentLanguage === 'es') {
        const englishUrl = currentOrigin.replace('://es.', '://') + currentPath;
        window.location.href = englishUrl;
      } else {
        const spanishUrl = `${currentOrigin.replace('://', '://es.')}${currentPath}`;
        window.location.href = spanishUrl;
      }
    },

    goToHome() {
      this.$router.push('/');
      this.isMenuOpen = false;
    },

    goToWatchlist() {
      this.$router.push('/watchlist');
      this.isMenuOpen = false;
    },

    showRatedModal() {
      this.$root.$emit('show-rated-modal');
      this.isMenuOpen = false;
    },

    goToSettings() {
      this.$router.push('/settings');
      this.isMenuOpen = false;
    },

    goToLogin() {
      this.$router.push('/login');
    },

    signOut() {
      localStorage.removeItem('email');
      localStorage.removeItem('access_token');
      window.location.href = '/';
    },

    openAiChat() {
      if (this.$refs.chatbotModalRef) {
        const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('access_token');
        
        if (isAuthenticated) {
          this.$refs.chatbotModalRef.open();
        } else {
          this.$refs.chatbotModalRef.chatBotOpen = true;
          this.$refs.chatbotModalRef.chatBotMinimized = false;
          this.$refs.chatbotModalRef.clearMinimizedState();
          this.$refs.chatbotModalRef.checkMobileDevice();
        }
      }
    }
  },
};
</script>

<style scoped>
.user-nav-container {
  position: fixed;
  top: 7px;
  right: 3%;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 15px;
}

.ask-ai-button {
  background: linear-gradient(135deg, #000000 0%, #14232A 100%);
  border: 1px solid #d2d3d3b8;
  cursor: pointer;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 14px;
  transition: all 0.3s ease;
  height: 40px;
}

.ask-ai-button:hover {
  background: linear-gradient(135deg, #0a1419 0%, #1a2f3a 100%);
  border-color: #8BE9FD;
  box-shadow: 0 0 15px rgba(139, 233, 253, 0.3);
  transform: scale(1.05);
}

.ask-ai-button:hover .spark-icon,
.ask-ai-button:hover .ai-label {
  color: #8BE9FD;
  stroke: #8BE9FD;
  transform: scale(1.15);
}

.spark-icon {
  width: 18px;
  height: 18px;
  color: white;
  stroke: white;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.ai-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: white;
  text-transform: uppercase;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.user-nav-logged-in,
.user-nav-logged-out {
  display: flex;
  align-items: center;
}

.avatar-container {
  cursor: pointer;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  border: 1px solid #d2d3d3b8;
  box-shadow: 0 5px 32px 0 rgba(31, 97, 135, 0.37);
  object-fit: cover;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 40px 0 rgba(31, 97, 135, 0.5);
}

.sign-in-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 40px;
  height: 40px;
  border-radius: 14px;
  border: 1px solid #D2D3D3;
  box-shadow: 0 5px 32px 0 rgba(31, 97, 135, 0.37);
  background: transparent;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  padding: 0;
}

.sign-in-button:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 40px 0 rgba(31, 97, 135, 0.5);
}

.sign-in-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.sign-in-label {
  display: none;
  margin-top: 2px;
  color: #ffffff;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 500;
  white-space: nowrap;
}

@media screen and (min-width: 769px) {
  .sign-in-button {
    width: auto;
    padding: 0 15px;
  }

  .sign-in-label {
    display: inline-block;
  }
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 12px;
  width: 220px;
  background: rgba(0, 0, 0, 0.95);
  box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  z-index: 1001;
  overflow: hidden;
}

.email-item {
  padding: 12px 15px;
  justify-content: center;
  cursor: default;
}

.email-item:hover {
  background-color: transparent;
}

.user-email {
  font-size: 13px;
  color: #ffffff;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  text-align: center;
  word-break: break-all;
}

.menu-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 4px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.menu-icon {
  width: 16px;
  height: 16px;
  color: #94999d;
  flex-shrink: 0;
}

.menu-label {
  color: #94999d;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  transition: color 0.2s ease;
  flex-grow: 1;
}

.menu-item:hover .menu-label {
  color: #ffffff;
}

.menu-item:hover .menu-icon {
  color: #ffffff;
}

.menu-label-logout {
  color: #94999d;
}

.menu-item:hover .menu-label-logout {
  color: #ff6b6b;
}

.language-switch {
  position: relative;
}

.switch-container {
  margin-left: auto;
}

.switch {
  width: 42px;
  height: 22px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 11px;
  position: relative;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.switch.active {
  background: #8BE9FD;
}

.switch-handle {
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.3s ease;
}

.switch.active .switch-handle {
  transform: translateX(20px);
}

@media screen and (max-width: 768px) {
  .dropdown-menu {
    width: 200px;
  }

  .spark-icon {
    width: 16px;
    height: 16px;
  }

  .ai-label {
    font-size: 10px;
  }
}
</style>
<template>
  <div class="user-nav-container">
    <div v-if="isLoggedIn" class="user-nav-logged-in">
      <div class="avatar-container" @click="toggleMenu">
        <img :src="userAvatar" alt="User Avatar" class="avatar">
      </div>

      <div v-if="isMenuOpen" class="dropdown-menu">
        <!-- Email Section -->
        <div class="menu-item email-item">
          <span class="user-email">{{ truncatedEmail }}</span>
        </div>

        <div class="menu-divider"></div>

        <!-- Home -->
        <div class="menu-item" @click="goToHome">
          <svg class="menu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-miterlimit="10" stroke-linejoin="round">
              <path d="M8.5 23.2H1.3V9L12 .8 22.7 9v14.2h-7.2v-5c0-1.9-1.6-3.4-3.5-3.4s-3.5 1.5-3.5 3.4v5z"/>
            </g>
          </svg>
          <span class="menu-label">Inicio</span>
        </div>

        <!-- Watchlist -->
        <div class="menu-item" @click="goToWatchlist">
          <img src="~/static/icon-watchlist.png" alt="Watchlist Icon" class="menu-icon">
          <span class="menu-label">Mi Lista</span>
        </div>

        <!-- Rated -->
        <div class="menu-item" @click="showRatedModal">
          <svg class="menu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
          </svg>
          <span class="menu-label">Valoraciones</span>
        </div>

        <!-- Settings -->
        <div class="menu-item" @click="goToSettings">
          <img src="~/static/icon-settings.png" alt="Settings Icon" class="menu-icon">
          <span class="menu-label">Ajustes</span>
        </div>

        <div class="menu-divider"></div>

        <!-- Language Switcher -->
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

        <!-- Logout -->
        <div class="menu-item" @click="signOut">
          <img src="~/static/icon-logout.png" alt="Logout Icon" class="menu-icon">
          <span class="menu-label menu-label-logout">Cerrar Sesión</span>
        </div>
      </div>
    </div>

    <div v-else class="user-nav-logged-out">
      <div class="sign-in-container">
        <span class="menu-label sign-in-label" @click="goToLogin">Iniciar Sesión</span>
        <img src="~/static/icon-login.png" alt="Login Icon" class="sign-in-icon" @click="goToLogin">
      </div>
    </div>
  </div>
</template>

<script>
import supabase from '@/services/supabase';

export default {
  name: 'UserNav',
  
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

    // Detect current language from URL
    const hostname = window.location.hostname;
    this.currentLanguage = hostname.includes('es.') ? 'es' : 'en';

    if (this.isLoggedIn && email) {
      await this.fetchUserAvatar(email);
    }
  },

  methods: {
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
      
      if (this.currentLanguage === 'en') {
        // Switch to Spanish
        const spanishUrl = `${currentOrigin.replace('://', '://es.')}${currentPath}`;
        window.location.href = spanishUrl;
      } else {
        // Switch to English
        const englishUrl = currentOrigin.replace('://es.', '://') + currentPath;
        window.location.href = englishUrl;
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
      window.location.href = 'https://entercinema.com/';
    },
  },
};
</script>

<style scoped>
.user-nav-container {
  position: fixed;
  top: 7px;
  right: 3%;
  z-index: 1000;
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
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.654);
  box-shadow: 0 5px 32px 0 rgba(31, 97, 135, 0.37);
  object-fit: cover;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 40px 0 rgba(31, 97, 135, 0.5);
}

.sign-in-container {
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 5px;
  position: relative;
  top: 6px;
  transition: background-color 0.2s ease;
}

.sign-in-container:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

/* Sign In Label - visible on desktop */
.sign-in-label {
  display: inline-block;
}

/* Sign In Icon - hidden on desktop */
.sign-in-icon {
  display: none;
  width: 20px;
  height: 20px;
  position: relative;
  bottom: 2px;
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

/* Language Switch Styles */
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
  background: #4CAF50;
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

  /* Hide label on mobile */
  .sign-in-label {
    display: none;
  }

  /* Show icon on mobile */
  .sign-in-icon {
    display: inline-block;
  }
}
</style>
<template>
  <main class="main">
    <section class="notifications-section">
      <div v-if="isLoggedIn" class="user-profile">
        <div class="language-selector" style="position: relative; top: -55.4px; left: -56px;">
          <div class="selected-language" @click="toggleLanguageMenu">
            <img src="~static/langpicker-icon.png" alt="World icon" class="world-icon" style="margin-bottom: 3px; margin-right: 4px;">
            <span class="language">En</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#585858" class="arrow-icon" style="width: 24px; height: 24px; left: -70px;">
              <path d="M7 10l5 5 5-5z" style="transform: translate(-8px); z-index: 1000;" />
            </svg>
          </div>
          <div ref="languageMenu" class="language-menu" :style="{ display: showLanguageMenu ? 'block' : 'none' }">
            <label class="menu-label1" @click="changeLanguage('spanish')">
              <span>Español</span>
            </label>
          </div>
        </div>
        <div class="avatar-container" @click="toggleMenu">
          <span v-if="userEmail !== 'undefined'" class="user-email">{{ userEmail }}</span>
          <img :src="userAvatar" alt="User Avatar" class="avatar">
          <div v-if="isMenuOpen" class="dropdown-menu">
            <div class="menu-item" @click="goToHome">
              <svg class="settings-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-miterlimit="10" stroke-linejoin="round"><path d="M8.5 23.2H1.3V9L12 .8 22.7 9v14.2h-7.2v-5c0-1.9-1.6-3.4-3.5-3.4s-3.5 1.5-3.5 3.4v5z"/></g></svg>
              <span class="menu-label1">Home</span>
            </div>
            <div class="menu-item" @click="goToSettings">
              <img src="~/static/icon-settings.png" alt="Settings Icon" class="settings-icon">
              <span class="menu-label1">Settings</span>
            </div>
            <div class="menu-item" @click="signOut">
              <img src="~/static/icon-logout.png" alt="Logout Icon" class="logout-icon">
              <span class="menu-label2">Log out</span>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="auth-required">
      </div>

      <div v-if="isLoggedIn" class="notifications-container">
        <div class="notifications-header">
          <div class="header-top">
            <h1 class="title-primary">Notifications</h1>
            <p class="title-secondary">Stay informed about new content from the people and shows you follow.</p>
          </div>
          
          <div class="header-actions">
            <button 
              @click="openFollowingModal" 
              class="following-button-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <polyline points="16 11 18 13 22 9"/>
              </svg>
              <span>Following ({{ totalFollowingCount }})</span>
            </button>

            <div class="secondary-actions">
              <button 
                @click="toggleFilter" 
                :class="['filter-button', { active: showUnreadOnly }]">
                <svg v-if="!showUnreadOnly" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="8" y1="6" x2="21" y2="6"/>
                  <line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/>
                  <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
                <span>{{ showUnreadOnly ? 'Show All' : 'Unread Only' }}</span>
              </button>
              <button 
                v-if="unreadCount > 0"
                @click="markAllAsRead" 
                class="mark-all-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 11 12 14 22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                <span>Mark All Read</span>
              </button>
            </div>
          </div>
 

        <FollowingModal 
          v-if="showFollowingModal" 
          @close="showFollowingModal = false"
          @unfollow-updated="handleUnfollowUpdated" />
        </div>

        <div v-if="loading" class="loader">
          <div class="modern-spinner">
            <div></div><div></div><div></div><div></div>
          </div>
        </div>

        <div v-else-if="notifications.length === 0" class="no-notifications">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <p>{{ showUnreadOnly ? 'No unread notifications' : 'No notifications yet' }}</p>
          <p class="sub-text">Follow actors and directors to get notified about their new releases</p>
        </div>

        <div v-else class="notifications-list">
          <div 
            v-for="notification in notifications" 
            :key="notification.id"
            :class="['notification-item', { unread: !notification.read }]"
            @click="handleNotificationClick(notification)">
            
            <div class="notification-icon">
              <img 
                v-if="notification.person_id && notification.profile_path" 
                :src="`https://image.tmdb.org/t/p/w185${notification.profile_path}`" 
                :alt="notification.person_name"
                class="person-profile-image">
              <svg v-else-if="notification.media_type === 'movie'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 6h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3c-1.1 0-2 .89-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.11-.9-2-2-2zm0 14H3V8h18v12zM9 10v8l7-4z"/>
              </svg>
            </div>

            <div class="notification-content">
              <div class="notification-text">
                <div class="notification-title">
                  <strong>{{ notification.person_name }}</strong> <span class="has-release">has a new release</span>
                </div>
                <div class="notification-media">
                  {{ notification.media_title }}
                </div>
                
                <div v-if="notification.poster_path" class="notification-poster">
                  <img :src="`https://image.tmdb.org/t/p/w185${notification.poster_path}`" :alt="notification.media_title">
                </div>
                
                <div v-if="notification.character" class="notification-character">
                  <span style="color:#d0d0d0 !important;">as </span>{{ notification.character }}
                </div>
                 <div class="notification-meta">
                  <span class="media-badge">
                    {{ notification.media_type === 'movie' ? 'Movie' : notification.media_type === 'tv' ? 'TV Show' : 'Episode' }}
                  </span>
                  <div class="info-container">
                    <label class="release-date">Release: <span class="only-date">{{ formatDate(notification.release_date) }}</span></label>
                    <span class="time-ago">{{ getTimeAgo(notification.created_at) }}</span>
                  </div>
                </div>
                <div v-if="notification.overview && notification.overview.length > 0" class="notification-overview">
                  {{ notification.overview }}
                </div>
               
              </div>
            </div>

            <button 
              v-if="!notification.read"
              @click.stop="markAsRead(notification.id)"
              class="mark-read-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import supabase from '@/services/supabase';
import FollowingModal from '~/components/FollowingModal.vue';

export default {
  components: {
    FollowingModal
  },
  data() {
    return {
      isLoggedIn: false,
      userEmail: null,
      userAvatar: '/avatars/avatar-ss0.png',
      isMenuOpen: false,
      showLanguageMenu: false,
      notifications: [],
      loading: true,
      showUnreadOnly: false,
      followsApiUrl: 'https://entercinema-follows-rust.vercel.app',
      showFollowingModal: false,
      totalFollowingCount: 0
    };
  },

  computed: {
    unreadCount() {
      return this.notifications.filter(n => !n.read).length;
    }
  },

  async mounted() {
    this.userEmail = localStorage.getItem('email');
    const accessToken = localStorage.getItem('access_token');
    this.isLoggedIn = accessToken !== null;

   if (this.isLoggedIn) {
      this.userAvatar = await this.getUserAvatar();
      await this.fetchNotifications();
      await this.fetchFollowingCount();
    } else {
      this.loading = false;
      const hasAttemptedLogin = sessionStorage.getItem('notifications_login_attempted');
      
      if (hasAttemptedLogin) {
        sessionStorage.removeItem('notifications_login_attempted');
        this.$router.push('/');
      } else {
        sessionStorage.setItem('notifications_login_attempted', 'true');
        this.goToLogin();
      }
    }
  },

  methods: {
    async getUserAvatar() {
      try {
        const { data, error } = await supabase
          .from('user_data')
          .select('avatar')
          .eq('email', this.userEmail);

        if (error) throw error;
        return data[0]?.avatar || '/avatars/avatar-ss0.png';
      } catch (error) {
        console.error('Error fetching avatar:', error);
        return '/avatars/avatar-ss0.png';
      }
    },

    async fetchNotifications() {
      if (!this.userEmail) return;

      this.loading = true;
      try {
        const url = `${this.followsApiUrl}/notifications?user_email=${encodeURIComponent(this.userEmail)}${this.showUnreadOnly ? '&unread_only=true' : ''}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Failed to fetch notifications');
        
        const data = await response.json();
        if (data.success) {
          this.notifications = data.notifications;
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        this.loading = false;
      }
    },

    async markAsRead(notificationId) {
      try {
        const response = await fetch(`${this.followsApiUrl}/notifications/mark-read`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_email: this.userEmail,
            notification_id: notificationId
          })
        });

        if (response.ok) {
          const notification = this.notifications.find(n => n.id === notificationId);
          if (notification) notification.read = true;
        }
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    },

    async markAllAsRead() {
      try {
        const response = await fetch(`${this.followsApiUrl}/notifications/mark-read`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_email: this.userEmail,
            mark_all: true
          })
        });

        if (response.ok) {
          this.notifications.forEach(n => n.read = true);
        }
      } catch (error) {
        console.error('Error marking all as read:', error);
      }
    },

    toggleFilter() {
      this.showUnreadOnly = !this.showUnreadOnly;
      this.fetchNotifications();
    },

    handleNotificationClick(notification) {
      let url;
      if (notification.media_type === 'episode') {
        url = `/tv/${notification.person_id}`;
      } else {
        url = `/${notification.media_type}/${notification.media_id}`;
      }
      this.$router.push(url);
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    },

    getTimeAgo(timestamp) {
      const now = Date.now() / 1000;
      const diff = now - timestamp;

      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
      return `${Math.floor(diff / 604800)}w ago`;
    },

    toggleLanguageMenu() {
      this.showLanguageMenu = !this.showLanguageMenu;
    },

    changeLanguage(language) {
      const currentPath = this.$route.path;
      const currentOrigin = window.location.origin;
      const spanishUrl = `${currentOrigin.replace('://', '://es.')}${currentPath}`;
      window.location.href = spanishUrl;
    },

    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },

    goToHome() {
      this.$router.push('/');
    },

    goToSettings() {
      this.$router.push('/settings');
    },

    goToLogin() {
      this.$router.push('/login');
    },

    signOut() {
      localStorage.removeItem('email');
      localStorage.removeItem('access_token');
      this.$router.push('/login');
    },
    async fetchFollowingCount() {
        if (!this.userEmail) return;

        try {
          const [peopleResponse, tvResponse] = await Promise.all([
            fetch(`https://entercinema-follows-rust.vercel.app/follows/list?user_email=${encodeURIComponent(this.userEmail)}`),
            fetch(`https://entercinema-follows-rust.vercel.app/tv-follows/list?user_email=${encodeURIComponent(this.userEmail)}`)
          ]);

          let peopleCount = 0;
          let tvCount = 0;

          if (peopleResponse.ok) {
            const peopleData = await peopleResponse.json();
            peopleCount = peopleData.follows?.length || 0;
          }

          if (tvResponse.ok) {
            const tvData = await tvResponse.json();
            tvCount = tvData.tv_follows?.length || 0;
          }

          this.totalFollowingCount = peopleCount + tvCount;
        } catch (error) {
          console.error('Error fetching following count:', error);
        }
      },

      openFollowingModal() {
        this.showFollowingModal = true;
      },

      handleUnfollowUpdated() {
        this.fetchFollowingCount();
        this.fetchNotifications();
      },

      async markAsRead(notificationId) {
        try {
          const response = await fetch(`${this.followsApiUrl}/notifications/mark-read`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_email: this.userEmail,
              notification_id: notificationId
            })
          });

          if (response.ok) {
            const notification = this.notifications.find(n => n.id === notificationId);
            if (notification) notification.read = true;
            
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('notifications-updated'));
            }
          }
        } catch (error) {
          console.error('Error marking as read:', error);
        }
      },

      async markAllAsRead() {
        try {
          const response = await fetch(`${this.followsApiUrl}/notifications/mark-read`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_email: this.userEmail,
              mark_all: true
            })
          });

          if (response.ok) {
            this.notifications.forEach(n => n.read = true);
            
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('notifications-updated'));
            }
          }
        } catch (error) {
          console.error('Error marking all as read:', error);
        }
      }
  }
};
</script>

<style scoped>
.title-primary {
  margin-top: 20px;
}

.language-selector {
  position: relative;
  font-family: 'Roboto';
  text-transform: uppercase;
}

.container {
  display: flex;
  width: 100%;
}

.form {
  width: 50%;
  background-color: black;
}

.userMenu {
  width: 50%;
  background-color: black;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  border-bottom: 1.5px solid rgba(28, 79, 97, 0.782);
  border-right: 1.5px solid rgba(34, 98, 121, 0.782);
  border-top: 1.5px solid rgba(34, 98, 121, 0.782);
  border-bottom-right-radius: 9px;
  border-top-right-radius: 9px;
}
.field-wrapper {
  display: flex;
  flex-direction: column;
}

.field {
  display: flex;
  align-items: flex-start;
  background-color: black;
  border-bottom: 1.5px solid rgba(28, 79, 97, 0.782);
  border-left: 1.5px solid rgba(28, 79, 97, 0.782);
  border-top: 1.5px solid rgba(34, 98, 121, 0.782);
  border-bottom-left-radius: 9px;
  border-top-left-radius: 9px;
}

input[type='text'] {
  flex: 1;
  height: 5rem;
  padding: 2.1rem 1.5rem;
  margin-top: 2px;
  font-size: 1.6rem;
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #79cddf;
  background: none;
  border: 0;
  outline: 0;
}

button {
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  background: none;
}

.avatar-container {
    position: relative;
    top: -89.2px;
    cursor: pointer;
  }

  .language-selector,
  .avatar-container-else {
    width: 50%;
  }

  .world-icon {
    width: 13px;
    height: 13px;
    font-weight: 600;
    position: relative;
    top: 1px;
    left: 2px;
  }

  .language {
    margin-right: 0.5rem;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(220, 220, 220) 100%);
    -webkit-background-clip: text;
    color: transparent;
    text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
    font-family: 'Roboto', sans-serif;
    font-size: 11px; 
    text-transform: uppercase;
    border-radius: 15px;
    color: #94999d;
    position: relative;
    top: 1px;
  }

  .arrow-icon {
    width: 16px;
    height: 16px;
  }

  .language-menu {
    position: absolute;
    background: rgba(0, 0, 0, 0.8);
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur( 16px );
    -webkit-backdrop-filter: blur( 16px );
    border-radius: 5px;
    border: 1px solid rgba( 255, 255, 255, 0.18 );
    z-index: 1000;
    display: none;
  }

    .language-menu label {
      display: block;
      padding: 0.5rem;
      cursor: pointer;
    }

    .language-menu.active {
      display: block;
    }

  .user-email {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(220, 220, 220) 100%);
    -webkit-background-clip: text;
    color: transparent;
    text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
    font-family: 'Roboto', sans-serif;
    font-size: 13px; 
    border-radius: 15px;
    margin-top: 2rem;
    margin-left: 13px;
    color: #94999d;
    text-align: center;
  }

  .user-profile {
    position: absolute;
    right: 3%; 
    margin-left: 2rem;
  }

  .user-profile-else {
    width: 25%;
  }

  .profile-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .button-logout {
    background-color: #062F40;
    color: #fff;
    border: none;
    margin-left: 8px;
    padding: 1rem 1.5rem;
    border-radius: 5px;
    cursor: pointer;
    transition: color 0.3s, background-color 0.3s;
    font-weight: bold; 
    font-size: 13px; 
    border-radius: 15px;
  }

  .button-logout:hover {
    background-color: #B22727;
  }

  .logout-icon {
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }

  .settings-icon {
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }

  .login-icon {
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }

  .avatar {
    width: 40px;
    border: 1px solid rgba(255, 255, 255, 0.654);
    height: 40px;
    box-shadow: 0 5px 32px 0 rgba(31, 97, 135, 0.37);
    border-radius: 50%;
    margin-left: 8px;
    margin-bottom: 5px;
    cursor: pointer;
  }

  .avatar-else {
    width: 40px;
    border: 1px solid rgba(255, 255, 255, 0.654);
    height: 40px;
    box-shadow: 0 5px 32px 0 rgba(31, 97, 135, 0.37);
    border-radius: 50%;
    margin-left: 50px;
    margin-bottom: 5px;
    cursor: pointer;
  }

  .dropdown-menu {
    position: relative; 
    width: 113.574px;
    top: 100%;
    background: rgba(0, 0, 0, 0.8);
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur( 16px );
    -webkit-backdrop-filter: blur( 16px );
    border-radius: 5px;
    border: 1px solid rgba( 255, 255, 255, 0.18 );
    z-index: 100;
    display: none;
  }

  .dropdown-menu {
    display: block;
    margin-left: 6.5rem;
  }

  .dropdown-menu-else {
    position: relative; 
    top: 100%;
    height: 38px;
    background: rgba(0, 0, 0, 0.8);
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur( 16px );
    -webkit-backdrop-filter: blur( 16px );
    border-radius: 5px;
    border: 1px solid rgba( 255, 255, 255, 0.18 );
    z-index: 100;
    display: none;
  }

  .dropdown-menu-else.block + .avatar-else {
    margin-left: 20px;
  }

  .dropdown-menu-else {
    display: block;
    left: 5px;
    top: 2px;
  }

  .menu-item {
    padding: 8px 12px;
    cursor: pointer;
  }

  .menu-label1 {
    color: #94999d;
    letter-spacing: 2px;
    text-transform: uppercase;
    position: relative; 
    top: 1px;
  }

  .menu-label1:hover {
    color: #ffffff;
  }

  .menu-label2 {
    color: #94999d;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-top: 3px;
  }

  .menu-label2:hover {
    color: #ffffff;
  }

  @media screen and (max-width: 600px) {
  .navbar-title {
    font-size: 12px; 
  }

  .button-logout {
    align-items: flex-start;
    display: inline-block;
    line-height: 16.1px;
    right: 1;
    text-align: center;
  }

  .navbar-title {
    text-align: center;
  }
}

@media screen and (max-width: 767px) {
    .nav-button-container {
      margin-top: 30px; 
    }
  }

.following-button {
  padding: 0.8rem 1.6rem;
  border-radius: 8px;
  border: 2px solid #8F989E;
  background: rgba(80, 250, 123, 0.1);
  color: #8F989E;
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.following-button:hover {
  background: rgba(80, 250, 123, 0.2);
  transform: translateY(-2px);
}

/* New stiles >>>> */

.notifications-section {
  min-height: 100vh;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.notifications-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3rem;
  gap: 2rem;
}

.header-top {
  text-align: center;
  max-width: 700px;
}

.title-secondary {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 15px;
  line-height: 1.5;
}

.header-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px;
}

.following-button-primary {
  padding: 0.8rem 1.6rem;
  border-radius: 8px;
  background: #8BE9FD;
  color: #000;
  border: none;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(139, 233, 253, 0.3);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.following-button-primary:hover {
  background: #7DD4E8;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 233, 253, 0.4);
}

.secondary-actions {
  display: flex;
  gap: 1rem;
}

.filter-button,
.mark-all-button {
  padding: 0.8rem 1.6rem;
  border-radius: 8px;
  border: 2px solid #8BE9FD;
  background: transparent;
  color: #8BE9FD;
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}


.filter-button:hover,
.mark-all-button:hover {
  background: rgba(139, 233, 253, 0.1);
}

.filter-button.active {
  background: #8BE9FD;
  color: #000;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.notification-item {
  display: grid;
  grid-template-columns: 60px 1fr 250px;
  gap: 2rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border-left: 4px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  align-items: start;
  position: relative;
}

.notification-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
}

.notification-item.unread {
  border-left-color: #8BE9FD;
  background: rgba(139, 233, 253, 0.08);
}

.notification-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: solid 1px #8BE9FD;
  background: rgba(139, 233, 253, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8BE9FD;
  flex-shrink: 0;
}

.person-profile-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.notification-content {
  display: contents;
}

.notification-text {
  grid-column: 2;
  min-width: 0;
  padding-right: 4rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.notification-poster {
  width: 200px;
  min-width: 200px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  border-left: 3px solid #8BE9FD;
  box-shadow: -4px 0 12px rgba(139, 233, 253, 0.3), 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-poster + .notification-meta {
  margin-top: 5px;
}

.notification-item:hover .notification-poster {
  box-shadow: -6px 0 16px rgba(139, 233, 253, 0.5), 0 6px 16px rgba(0, 0, 0, 0.4);
  transform: translateX(-2px);
}

.notification-poster img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  max-height: 300px;
}

.notification-title {
  font-size: 1.6rem;
  color: #fff;
  margin-bottom: 0.5rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.notification-media {
  font-size: 1.5rem;
  color: #8BE9FD;
  margin-bottom: 0.8rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.notification-character {
  font-size: 1.4rem;
  position: relative;
  margin-bottom: 5px; 
  color: #8BE9FD;
  font-style: italic;
  margin-bottom: 0.5rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.notification-overview {
  font-size: 1.3rem;
  color: #d0d0d0;
  margin-top: 0.8rem;
  margin-bottom: 0.8rem;
  line-height: 1.4;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.notification-meta {
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.6);
}

.media-badge {
  padding: 0.2rem 0.8rem;
  background: rgba(139, 233, 253, 0.2);
  border-radius: 4px;
  color: #8BE9FD;
  font-size: 1.2rem;
  text-transform: uppercase;
}

.mark-read-button {
  padding: 0.8rem;
  background: rgba(139, 233, 253, 0.1);
  border: 1px solid #8BE9FD;
  border-radius: 50%;
  color: #8BE9FD;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 2rem;
  top: 2rem;
  width: 32px;
  height: 32px;
}

.mark-read-button:hover {
  background: #8BE9FD;
  color: #000;
}

.no-notifications {
  text-align: center;
  padding: 6rem 2rem;
  color: rgba(255, 255, 255, 0.6);
}

.no-notifications svg {
  margin-bottom: 2rem;
  opacity: 0.5;
}

.no-notifications p {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.sub-text {
  font-size: 1.4rem !important;
  color: rgba(255, 255, 255, 0.4);
}

.auth-required {
  text-align: center;
  padding: 6rem 2rem;
}

.sign-in-button {
  margin-top: 2rem;
  padding: 1.2rem 3rem;
  background: #8BE9FD;
  border: none;
  border-radius: 8px;
  color: #000;
  font-size: 1.6rem;
  font-weight: 500;
  cursor: pointer;
}

@media (max-width: 1024px) {
  .notification-item {
    grid-template-columns: 60px 1fr 200px;
  }
  
  .notification-poster {
    width: 200px;
    min-width: 200px;
  }
}

@media (max-width: 900px) {
  .notification-item {
    grid-template-columns: 48px 1fr;
    grid-template-rows: auto auto;
    gap: 1.5rem;
  }
  
  .notification-icon {
    grid-column: 1;
    grid-row: 1;
    width: 40px;
    height: 40px;
  }
  
  .notification-text {
    grid-column: 2;
    grid-row: 1;
    padding-right: 0;
  }
  
  .notification-poster {
    grid-column: 1 / -1;
    grid-row: 2;
    width: 100%;
    max-width: 200px;
    justify-self: left;
    border-left: none;
    border-top: 3px solid #8BE9FD;
    box-shadow: 0 -4px 12px rgba(139, 233, 253, 0.3), 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  .mark-read-button {
    right: 1.5rem;
    top: 1.5rem;
  }
}

@media (max-width: 768px) {  
  .title-secondary {
    font-size: 1.3rem;
    word-wrap: break-word;
  }
  

  .filter-button,
  .mark-all-button {
    padding: 0.7rem 1.4rem;
    font-size: 1.3rem;
  }
  
  .notification-item {
    padding: 1.5rem;
  }
  
  .notification-poster {
    max-width: 240px;
  }
  
  .notification-title {
    font-size: 1.5rem;
  }
  
  .notification-media {
    font-size: 1.4rem;
  }
  
  .notification-character {
    font-size: 1.3rem;
    margin-top: 8px;
  }
  
  .notification-overview {
    font-size: 1.2rem;
  }
}

@media (max-width: 576px) {
  .title-secondary {
    font-size: 1.1rem;
  }
    
  .notification-item {
    grid-template-columns: 40px 1fr;
    padding: 1.2rem;
    gap: 1rem;
  }
  
  .notification-icon {
    width: 36px;
    height: 36px;
  }
  
  .notification-icon svg {
    width: 20px;
    height: 20px;
  }
  
  .notification-title {
    font-size: 1.3rem;
  }
  
  .notification-media {
    font-size: 1.2rem;
  }
  
  .notification-character {
    font-size: 1.1rem;
  }
  
  .notification-overview {
    font-size: 1.1rem;
  }
  
  .notification-meta {
    font-size: 1.1rem;
    gap: 0.8rem;
  }
  
  .media-badge {
    font-size: 1rem;
  }
  
  .notification-poster {
    max-width: 200px;
  }
  
  .mark-read-button {
    right: 1rem;
    top: 1rem;
    width: 28px;
    height: 28px;
  }
  
  .mark-read-button svg {
    width: 14px;
    height: 14px;
  }
}

@media (max-width: 400px) {
  .title-secondary {
    font-size: 1rem;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .following-button-primary {
    width: 100%;
    max-width: 300px;
    text-align: center;
    justify-content: center;
  }
  
  .secondary-actions {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
  
  .filter-button,
  .mark-all-button {
    width: 100%;
  }
  
  .notification-item {
    padding: 1rem;
  }
  
  .notification-title {
    font-size: 1.2rem;
  }
  
  .notification-media {
    font-size: 1.1rem;
  }
  
  .notification-overview {
    font-size: 1rem;
  }
  
  .notification-poster {
    max-width: 180px;
  }
}

.info-container {
  position: relative;
  top: 2.6px;
}

.only-date {
 color: #8BE9FD;
}

.time-ago {
  color: #d0d0d0;
  top: 1px;
}

.has-release {
  color: rgba(255, 255, 255, 0.7);
}

@media (min-width: 768px) {
  .notification-text {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 0 2rem;
    grid-column: 2;
    padding-right: 4rem;
    align-items: start;
  }
  
  .notification-poster {
    grid-column: 1;
    grid-row: 1 / span 5;
    align-self: start;
  }
  
  .notification-title {
    grid-column: 2;
    grid-row: 1;
    margin-bottom: 0;
  }
  
  .notification-media {
    grid-column: 2;
    grid-row: 2;
    margin-bottom: 0;
  }
  
  .notification-character {
    grid-column: 2;
    grid-row: 3;
    margin-top: 0;
    margin-bottom: 0;
  }
  
  .notification-meta {
    grid-column: 2;
    grid-row: 4;
    margin-top: 0.5rem;
  }
  
  .notification-overview {
    grid-column: 2;
    grid-row: 5;
    margin-top: 0;
  }
  
  .media-badge {
    display: inline-block;
    align-self: start;
  }
}
</style>
<template>
  <main class="main">
    <section class="settings-section">
      <div class="settings-container">
        <div class="settings-header">
          <h1 class="title-primary">Account Settings</h1>
          <p class="title-secondary">Manage your profile and account preferences</p>
        </div>

        <div class="settings-content">
          <div class="avatar-section">
            <div class="avatar-wrapper" @click="openAvatarModal">
              <img :src="userAvatar" alt="User Avatar" class="avatar-image">
              <div class="avatar-overlay">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </div>
            </div>
            <button @click="openAvatarModal" class="change-avatar-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              <span>Change Avatar</span>
            </button>
          </div>

          <div class="user-details-card">
            <div class="detail-item">
              <div class="detail-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Name</span>
              </div>
              <div class="detail-value">{{ firstName }}</div>
            </div>

            <div class="detail-item">
              <div class="detail-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span>Email</span>
              </div>
              <div class="detail-value">{{ email }}</div>
            </div>

            <div class="detail-item">
              <div class="detail-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>Joined Date</span>
              </div>
              <div class="detail-value">{{ joinedDate }}</div>
            </div>

            <div class="detail-item">
              <div class="detail-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                <span>Last Login</span>
              </div>
              <div class="detail-value">{{ lastLoginDate }}</div>
            </div>

            <div class="detail-item">
              <div class="detail-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>Last Active</span>
              </div>
              <div class="detail-value">{{ lastActiveDate }}</div>
            </div>
          </div>

          <div class="actions-container">
            <div class="danger-zone">
              <div class="danger-header">
                <h3>Danger Zone</h3>
                <p>The following actions are irreversible.</p>
              </div>
              <button @click="deleteAccount" class="action-button danger">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeAvatarModal">
      <div class="avatar-modal">
        <div class="modal-header">
          <h3>Select Your Avatar</h3>
          <button class="close-btn" @click="closeAvatarModal" type="button">×</button>
        </div>
        <div class="avatar-grid">
          <div 
            v-for="avatar in avatars" 
            :key="avatar"
            @click="selectAvatar(avatar)"
            class="avatar-option"
            :class="{ selected: avatar === userAvatar }">
            <img :src="avatar" :alt="avatar">
            <div class="avatar-check" v-if="avatar === userAvatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isDeleteModalOpen" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="delete-modal">
        <div class="modal-header">
          <h3>Delete Account</h3>
          <button class="close-btn" @click="closeDeleteModal" type="button">×</button>
        </div>
        
        <div class="delete-modal-content">
          <div class="exclamation-svg">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" x2="12" y1="8" y2="12"/>
              <line x1="12" x2="12.01" y1="16" y2="16"/>
            </svg>
          </div>
          <p class="delete-message">CONFIRM PERMANENT DELETION OF YOUR ACCOUNT?</p>
          <p class="delete-warning">By confirming, your account will initiate the deletion process. Please be aware that closing the account associated with <strong>{{ userEmail }}</strong> is irreversible.</p>
          <p class="delete-info">You will have a 72-hour window to reverse this action by reaching out to <strong>hello@entercinema.com</strong>. If no reactivation request is made within this timeframe, your account will be permanently deleted.</p>
          
          <div class="delete-actions">
            <button @click="closeDeleteModal" class="cancel-btn" type="button">
              <span class="label-button-modal">Cancel</span>
            </button>
            <button @click="confirmDelete" class="confirm-delete-btn" type="button">
              <span class="label-button-modal">Confirm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>


async function getUserAvatar(userEmail) {
  try {
    const supabase = useSupabaseClient();
    const { data, error } = await supabase
      .from('user_data')
      .select('avatar')
      .eq('email', userEmail);
      
    if (error) {
      throw new Error('Error fetching user avatar:', error.message);
    }

    const userAvatar = data[0]?.avatar || '/avatars/avatar-ss0.png';
    return userAvatar;
  } catch (error) {
    console.error('Error fetching user avatar:', error);
    return '/avatars/avatar-ss0.png';
  }
}

export default {
  head () {
    return {
      title: 'EnterCinema - Account Settings.',
      meta: [
        { hid: 'og:title', property: 'og:title', content: 'Account Settings' },
        { hid: 'og:url', property: 'og:url', content: `${process.env.FRONTEND_URL}${this.$route.path}` },
      ],
    };
  },
  data() {
    return {
      userData: null,
      lastActiveDate: '',
      isModalOpen: false,
      userAvatar: '/avatars/avatar-ss0.png',
      isDeleteModalOpen: false,
      userEmail: '',
      avatars: [
        '/avatars/avatar-ss0.png',
        '/avatars/avatar-ss1.png',
        '/avatars/avatar-ss2.png',
        '/avatars/avatar-ss3.png',
        '/avatars/avatar-ss4.png',
        '/avatars/avatar-ss5.png',
        '/avatars/avatar-ss6.png',
        '/avatars/avatar-ss7.png',
        '/avatars/avatar-ss8.png',
        '/avatars/avatar-ss9.png',
        '/avatars/avatar-ss10.png',
        '/avatars/avatar-ss11.png',
        '/avatars/avatar-ss12.png',
        '/avatars/avatar-ss13.png',
        '/avatars/avatar-ss14.png',
        '/avatars/avatar-ss15.png',
        '/avatars/avatar-ss16.png',
        '/avatars/avatar-ss17.png',
        '/avatars/avatar-ss18.png',
        '/avatars/avatar-ss19.png',
        '/avatars/avatar-ss20.png',
        '/avatars/avatar-ss21.png',
        '/avatars/avatar-ss22.png',
        '/avatars/avatar-ss23.png',
        '/avatars/avatar-ss24.png',
        '/avatars/avatar-ss25.png',
        '/avatars/avatar-ss26.png',
        '/avatars/avatar-ss27.png',
        '/avatars/avatar-ss28.png'
      ]
    }
  },
  setup() {
    return { supabase: useSupabaseClient() }
  },
  computed: {
    firstName() {
      return this.userData ? this.userData.first_name : '';
    },
    email() {
      return this.userData ? this.userData.email : '';
    },
    joinedDate() {
      return this.userData ? this.formatDate(this.userData.date_joined) : '';
    },
    lastLoginDate() {
      return this.userData ? this.formatDate(this.userData.last_login) : '';
    }
  },
  methods: {


    openAvatarModal() {
      this.isModalOpen = true;
    },

    closeAvatarModal() {
      this.isModalOpen = false;
    },

    deleteAccount() {
      this.openDeleteModal();
    },

    async openDeleteModal() {
      this.isDeleteModalOpen = true;
    },

    closeDeleteModal() {
      this.isDeleteModalOpen = false;
    },

    cancelDelete() {
      this.closeDeleteModal();
    },

    async confirmDelete() {
      try {
        const { data: existingRequests, error: requestError } = await this.supabase
          .from('requests')
          .select('*')
          .eq('email', this.userEmail)
          .eq('is_executed', 'false');

        if (requestError) {
          throw new Error('Error fetching existing requests:', requestError.message);
        }

        const { data, error } = await this.supabase
          .from('requests')
          .insert([
            { email: this.userEmail, action: 'delete account', is_executed: 'false' }
          ]);

        if (error) {
          throw new Error('Error creating account deletion request:', error.message);
        }

        this.isDeleteModalOpen = false;
        this.showConfirmationMessage();
      } catch (error) {
        console.error('Error confirming account deletion:', error);
      }
    },

    showConfirmationMessage() {
      if (process.client) {
        const locOrigin = window.location.origin;
        localStorage.removeItem('access_token');
        localStorage.removeItem('email');
        window.location.href = `${locOrigin}/login`; 
      }
    },

    async selectAvatar(avatar) {
      try {
        this.userAvatar = avatar;
        await this.updateUserAvatar(avatar);
        this.closeAvatarModal();
      } catch (error) {
        console.error('Error selecting avatar:', error);
      }
    },

    async updateUserAvatar(avatar) {
      try {
        if (!this.userEmail) {
          throw new Error('User email is not defined.');
        }
        const { error } = await this.supabase
          .from('user_data')
          .update({ avatar })
          .eq('email', this.userEmail);
        if (error) {
          throw new Error('Error updating user avatar:', error.message);
        }
      } catch (error) {
        console.error('Error updating user avatar:', error);
      }
    },

    async fetchUserDb() {
      try {
        const { data, error } = await this.supabase
          .from('auth_user')
          .select('*')
          .eq('email', this.userEmail);
        
        if (error) {
          throw new Error('Error connecting to the database: ' + error.message);
        }
        
        this.userData = data[0];
        this.userAvatar = await getUserAvatar(this.userEmail);
        this.createOrUpdateUserData();
      } catch (error) {
        console.error('Error connecting to the database:', error);
      }
    },

    async createOrUpdateUserData() {
      try {
        const currentDate = new Date().toISOString(); 
        const formattedLastActive = this.formatDate(currentDate);
        const userDataToUpdate = {
          email: this.userEmail,
          first_name: this.firstName,
          date_joined: this.joinedDate,
          last_login: this.lastLoginDate,
          last_active: formattedLastActive
        };

        const { data: existingUserData, error } = await this.supabase
          .from('user_data')
          .select('*')
          .eq('email', this.userEmail);

        if (error) {
          throw new Error('Error checking for existing user data:', error);
        }

        if (existingUserData && existingUserData.length > 0) {
          await this.supabase
            .from('user_data')
            .update(userDataToUpdate)
            .eq('email', this.userEmail);
        } else {
          await this.supabase
            .from('user_data')
            .insert([userDataToUpdate]); 
        }
        this.lastActiveDate = formattedLastActive;
      } catch (error) {
        console.error('Error creating or updating user data:', error);
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      const formattedDate = date.getUTCFullYear() + '-' +
        ('0' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
        ('0' + date.getUTCDate()).slice(-2) + ' ' +
        ('0' + date.getUTCHours()).slice(-2) + ':' +
        ('0' + date.getUTCMinutes()).slice(-2) + ':' +
        ('0' + date.getUTCSeconds()).slice(-2);
      return formattedDate + ' (UTC)';
    }
  },
  mounted() {
    try {
      if (process.client) {
        const email = localStorage.getItem('email');
        const accessToken = localStorage.getItem('access_token');
        this.userEmail = email || '';
        this.isLoggedIn = accessToken !== null;
        this.fetchUserDb();
      }
    } catch (error) {
      console.error('Error on mount:', error);
    }
  }
}
</script>

<style scoped>
.main {
  min-height: 100vh;
  padding: 2rem;
}

.settings-section {
  max-width: 1200px;
  margin: 0 auto;
}

.settings-container {
  backdrop-filter: blur(3.5px);
  -webkit-backdrop-filter: blur(13.5px);
  border-radius: 16px;
  border: 1px solid rgba(139, 233, 253, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 97, 135, 0.37);
  overflow: hidden;
}

.settings-header {
  text-align: center;
  padding: 3rem 2rem 2rem;
  border-bottom: 1px solid rgba(139, 233, 253, 0.2);
}

.title-primary {
  font-size: 2.8rem;
  color: #8BE9FD;
  margin: 0 0 1rem 0;
  font-weight: 600;
}

.title-secondary {
  font-size: 1.6rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.settings-content {
  padding: 3rem 2rem;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-bottom: 4rem;
}

.avatar-wrapper {
  position: relative;
  width: 150px;
  height: 150px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.avatar-wrapper:hover {
  transform: scale(1.05);
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid #8BE9FD;
  object-fit: cover;
  box-shadow: 0 8px 24px rgba(139, 233, 253, 0.3);
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: #8BE9FD;
}

.change-avatar-button {
  padding: 1rem 2rem;
  background: #8BE9FD;
  color: #000;
  border: none;
  border-radius: 8px;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(139, 233, 253, 0.3);
}

.change-avatar-button:hover {
  background: #7DD4E8;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 233, 253, 0.4);
}

.user-details-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(139, 233, 253, 0.1);
  margin-bottom: 3rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.4rem;
}

.detail-label svg {
  color: #8BE9FD;
}

.detail-value {
  color: #fff;
  font-size: 1.5rem;
  font-weight: 500;
  text-align: right;
}

.actions-container {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.3s ease;
  min-width: 150px;
  justify-content: center;
}

.action-button.secondary {
  background: rgba(139, 233, 253, 0.1);
  color: #8BE9FD;
  border: 2px solid #8BE9FD;
}

.action-button.secondary:hover {
  background: rgba(139, 233, 253, 0.2);
  transform: translateY(-2px);
}

.action-button.danger {
  background: rgba(255, 107, 107, 0.1);
  color: #FF6B6B;
  border: 2px solid #FF6B6B;
}

.action-button.danger:hover {
  background: #FF6B6B;
  color: #fff;
  transform: translateY(-2px);
}

.danger-zone {
  width: 100%;
  border: 1px solid rgba(255, 107, 107, 0.4);
  border-radius: 12px;
  padding: 2rem;
  background: rgba(255, 107, 107, 0.05);
}

.danger-header {
  margin-bottom: 2rem;
  text-align: left;
}

.danger-header h3 {
  color: #FF6B6B;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.danger-header p {
  color: rgba(255, 107, 107, 0.8);
  font-size: 1.3rem;
  margin: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.avatar-modal {
  background: linear-gradient(135deg, rgba(6, 47, 64, 0.98) 0%, rgba(10, 30, 40, 0.99) 50%);
  border-radius: 16px;
  border: 1px solid rgba(139, 233, 253, 0.3);
  box-shadow: 0 12px 40px 0 rgba(31, 104, 135, 0.6);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid rgba(139, 233, 253, 0.2);
}

.modal-header h3 {
  font-size: 2.2rem;
  color: #fff;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 3rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #8BE9FD;
}

.avatar-grid {
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1.5rem;
  overflow-y: auto;
  max-height: calc(90vh - 100px);
}

.avatar-option {
  position: relative;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 3px solid transparent;
}

.avatar-option:hover {
  transform: scale(1.05);
  border-color: #8BE9FD;
}

.avatar-option.selected {
  border-color: #8BE9FD;
  box-shadow: 0 0 20px rgba(139, 233, 253, 0.5);
}

.avatar-option img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.avatar-check {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8BE9FD;
}

.delete-modal {
  width: 100%;
  max-width: 500px;
  background: linear-gradient(to bottom right, #092132, #020609);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(139, 233, 253, 0.3);
}

.delete-modal-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.exclamation-svg {
  margin-bottom: 2rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.delete-message {
  color: #FF6B6B;
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.delete-warning {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.4rem;
  margin: 0 0 1rem 0;
  line-height: 1.6;
}

.delete-info {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.3rem;
  margin: 0 0 2.5rem 0;
  line-height: 1.6;
}

.delete-actions {
  display: flex;
  gap: 1.2rem;
  width: 100%;
  justify-content: center;
}

.cancel-btn,
.confirm-delete-btn {
  flex: 1;
  max-width: 150px;
  padding: 1.2rem 0;
  border: none;
  border-radius: 8px;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.confirm-delete-btn {
  background: #FF6B6B;
  color: #fff;
}

.confirm-delete-btn:hover {
  background: #FF5252;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
}

@media (max-width: 768px) {
  .title-primary {
    font-size: 2.2rem;
  }

  .title-secondary {
    font-size: 1.4rem;
  }

  .settings-content {
    padding: 2rem 1.5rem;
  }

  .avatar-wrapper {
    width: 120px;
    height: 120px;
  }

  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .detail-value {
    text-align: left;
  }

  .avatar-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 1rem;
  }

  .actions-container {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .main {
    padding: 1rem;
  }

  .settings-header {
    padding: 2rem 1.5rem 1.5rem;
  }

  .title-primary {
    font-size: 2rem;
  }

  .title-secondary {
    font-size: 1.3rem;
  }

  .user-details-card {
    padding: 1.5rem;
  }

  .detail-label,
  .detail-value {
    font-size: 1.3rem;
  }

  .delete-modal {
    max-width: 90%;
  }

  .delete-message {
    font-size: 1.4rem;
  }

  .delete-warning,
  .delete-info {
    font-size: 1.2rem;
  }
}

.label-button-modal {
  margin: 0 auto;
}
</style>
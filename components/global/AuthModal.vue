<template>
  <div v-if="isOpen" class="auth-modal-overlay">
    <div class="auth-modal-container">
      <div class="auth-modal-header">
        <h2>Sign in to continue</h2>
        <button @click="closeModal" class="close-button">×</button>
      </div>
      
      <div class="auth-modal-content">
        <div class="tabs">
          <span 
            :class="['tab', { active: activeTab === 'login' }]"
            @click="activeTab = 'login'"
          >
            Sign In
          </span>
          <span 
            :class="['tab', { active: activeTab === 'register' }]"
            @click="activeTab = 'register'"
          >
            Register
          </span>
        </div>

        <div v-if="activeTab === 'login'" class="form-container">
          <p class="modal-description">Please sign in to access more features</p>
          
          <form @submit.prevent="handleLogin">
            <GoogleLogin 
              buttonText="Sign in with Google"
              @google-login-start="handleGoogleLoginStart"
              @google-login-error="handleGoogleLoginError"
            />
            
            <div class="divider">
              <span>or</span>
            </div>

            <div class="form-group">
              <label for="login-email">Email:</label>
              <input 
                type="email" 
                id="login-email"
                v-model="loginEmail" 
                placeholder="johndoe@email.com" 
                required
                :disabled="googleLoginInProgress"
              >
            </div>

            <div class="form-group">
              <label for="login-password">Password:</label>
              <input 
                type="password" 
                id="login-password"
                v-model="loginPassword" 
                placeholder="Enter your password" 
                required
                :disabled="googleLoginInProgress"
              >
            </div>

            <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>

            <div class="button-container">
              <button type="submit" class="submit-button" :disabled="loginLoading">
                <span v-if="loginLoading" class="spinner"></span>
                <span>{{ loginLoading ? 'Signing in...' : 'Sign In' }}</span>
              </button>
            </div>
          </form>

          <p class="switch-link">
            Don't have an account? 
            <a @click.prevent="activeTab = 'register'">Sign Up</a>
          </p>
        </div>

        <div v-if="activeTab === 'register'" class="form-container">
          <p class="modal-description">Create an account to access more features</p>
          
          <form @submit.prevent="handleRegister">
            <GoogleLogin 
              buttonText="Sign up with Google"
              @google-login-start="handleGoogleLoginStart"
              @google-login-error="handleGoogleLoginError"
            />
            
            <div class="divider">
              <span>or</span>
            </div>

            <div class="form-group">
              <label for="register-name">Name:</label>
              <input 
                type="text" 
                id="register-name"
                v-model="registerName" 
                placeholder="John Doe" 
                required
                :disabled="googleLoginInProgress"
              >
            </div>

            <div class="form-group">
              <label for="register-email">Email:</label>
              <input 
                type="email" 
                id="register-email"
                v-model="registerEmail" 
                placeholder="johndoe@email.com" 
                required
                :disabled="googleLoginInProgress"
              >
            </div>

            <div class="form-group">
                <label for="register-password">Password:</label>
                <input 
                    type="password" 
                    id="register-password"
                    v-model="registerPassword" 
                    placeholder="Enter your password" 
                    required
                    @input="checkPassword"
                    :disabled="googleLoginInProgress"
                >
                
                <div class="password-requirements">
                    <div class="requirements-grid">
                    <span :class="['req-item', { valid: hasMinLength }]">
                        <span class="check-icon">{{ hasMinLength ? '✓' : '○' }}</span>
                        8+ chars
                    </span>
                    <span :class="['req-item', { valid: hasUpperCase }]">
                        <span class="check-icon">{{ hasUpperCase ? '✓' : '○' }}</span>
                        1 Uppercase
                    </span>
                    <span :class="['req-item', { valid: hasLowerCase }]">
                        <span class="check-icon">{{ hasLowerCase ? '✓' : '○' }}</span>
                        1 Lowercase
                    </span>
                    <span :class="['req-item', { valid: hasNumber }]">
                        <span class="check-icon">{{ hasNumber ? '✓' : '○' }}</span>
                        1 Number
                    </span>
                    <span :class="['req-item', { valid: hasSymbol }]">
                        <span class="check-icon">{{ hasSymbol ? '✓' : '○' }}</span>
                        1 Symbol
                    </span>
                    </div>
                </div>
            </div>

            <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>

            <div class="button-container">
              <button 
                type="submit" 
                class="submit-button"
                :disabled="registerLoading || !isFormValid || !isPasswordValid"
              >
                <span v-if="registerLoading" class="spinner"></span>
                <span>{{ registerLoading ? 'Signing up...' : 'Sign Up' }}</span>
              </button>
            </div>
          </form>

          <p class="switch-link">
            Already have an account? 
            <a @click.prevent="activeTab = 'login'">Sign In</a>
          </p>
        </div>

        <div v-if="showSuccessMessage" class="success-container">
          <h3>Account created successfully!</h3>
          <p>Your account has been created. Please sign in to continue.</p>
          <button @click="handleSuccessClose" class="submit-button">Sign In</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import GoogleLogin from './GoogleLogin.vue';

export default {
  name: 'AuthModal',
  components: {
    GoogleLogin
  },
  props: {
  initialTab: {
    type: String,
    default: 'login',
    validator: (value) => ['login', 'register'].includes(value)
  }
  },
  data() {
    return {
      isOpen: false,
      activeTab: this.initialTab,
      loginEmail: '',
      loginPassword: '',
      registerName: '',
      registerEmail: '',
      registerPassword: '',
      errorMessage: '',
      loginLoading: false,
      registerLoading: false,
      googleLoginInProgress: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSymbol: false,
      hasMinLength: false,
      showSuccessMessage: false,
      pendingAction: null
    };
  },
  computed: {
    isFormValid() {
      return this.registerName !== '' && this.registerEmail !== '' && this.registerPassword !== '';
    },
    isPasswordValid() {
      return this.hasUpperCase && this.hasLowerCase && this.hasNumber && this.hasSymbol && this.hasMinLength;
    }
  },
  watch: {
    initialTab(newTab) {
      this.activeTab = newTab;
    }
  },
  methods: {
    open(action = null) {
    this.isOpen = true;
    this.pendingAction = action;
    this.resetForm();
    },
    
    close() {
      this.isOpen = false;
      this.pendingAction = null;
      this.resetForm();
      this.$emit('close'); 
    },
    
    closeModal() {
      const currentPath = this.$route?.path || window.location.pathname;
      
      if (currentPath === '/login' || currentPath === '/register') {
        window.location.href = '/';
      } else {
        this.close();
      }
    },

    resetForm() {
      this.loginEmail = '';
      this.loginPassword = '';
      this.registerName = '';
      this.registerEmail = '';
      this.registerPassword = '';
      this.errorMessage = '';
      this.showSuccessMessage = false;
      this.hasUpperCase = false;
      this.hasLowerCase = false;
      this.hasNumber = false;
      this.hasSymbol = false;
      this.hasMinLength = false;
      this.activeTab = this.initialTab;
    },
        
    handleGoogleLoginStart() {
      this.googleLoginInProgress = true;
    },
    
    handleGoogleLoginError() {
      this.googleLoginInProgress = false;
    },
    
    async handleLogin() {
      this.loginLoading = true;
      this.errorMessage = '';
      
      try {
        const config = useRuntimeConfig();
        const data = await $fetch(`${config.public.apiUrl}/login/`, {
          method: 'POST',
          body: {
            email: this.loginEmail,
            password: this.loginPassword
          }
        });

        const returnUrl = window.location.pathname + window.location.search;
        localStorage.setItem('auth_return_url', returnUrl);

        const successUrl = `/auth-success?token=${encodeURIComponent(data.access_token)}&email=${encodeURIComponent(data.email)}&name=${encodeURIComponent(data.name || data.email)}&auth_provider=native`;
        
        window.location.href = successUrl;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.errorMessage = 'Invalid login credentials.';
        } else {
          this.errorMessage = 'An error occurred. Please try again.';
        }
      } finally {
        this.loginLoading = false;
      }
    },
    
    async handleRegister() {
      this.registerLoading = true;
      this.errorMessage = '';
      
      try {
        await $fetch('https://entercinema-drf.vercel.app/api/register/', {
          method: 'POST',
          body: {
            name: this.registerName,
            email: this.registerEmail,
            password: this.registerPassword
          }
        });
        
        this.showSuccessMessage = true;
      } catch (error) {
        if (error.response && error.response.status === 500) {
          this.errorMessage = 'A user with this email already exists.';
        } else {
          this.errorMessage = 'An error occurred. Please try again.';
        }
      } finally {
        this.registerLoading = false;
      }
    },
    
    handleSuccessClose() {
      this.showSuccessMessage = false;
      this.activeTab = 'login';
      this.loginEmail = this.registerEmail;
      this.registerName = '';
      this.registerEmail = '';
      this.registerPassword = '';
    },
    
    checkPassword() {
      this.hasUpperCase = /[A-Z]/.test(this.registerPassword);
      this.hasLowerCase = /[a-z]+/.test(this.registerPassword);
      this.hasNumber = /\d/.test(this.registerPassword);
      this.hasSymbol = /[!@#$%^&*()_+]/.test(this.registerPassword);
      this.hasMinLength = this.registerPassword.length >= 8;
    }
  }
};
</script>

<style scoped>
.auth-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999999999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.auth-modal-container {
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  background: linear-gradient(135deg, rgba(6, 47, 64, 0.98) 0%, rgba(10, 30, 40, 0.99) 50%);
  box-shadow: 0 12px 40px 0 rgba(31, 104, 135, 0.6);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 16px;
  border: 1px solid rgba(127, 219, 241, 0.3);
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.auth-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid rgba(127, 219, 241, 0.2);
  background: rgba(0, 0, 0, 0.2);
}

.auth-modal-header h2 {
  color: #7FDBF1;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.close-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 32px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: all 0.2s ease;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-button:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.auth-modal-content {
  padding: 25px;
}

.modal-description {
  text-align: center;
  color: #a8d8e4;
  font-size: 14px;
  margin-bottom: 20px;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 25px;
}

.tab {
  padding: 10px 30px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(11, 75, 103, 0.15);
  backdrop-filter: blur(13.5px);
  -webkit-backdrop-filter: blur(13.5px);
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-size: 13px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.tab:hover {
  background: rgba(11, 75, 103, 0.25);
}

.tab.active {
  color: #ffffff;
  background: rgba(10, 77, 106, 0.729);
  border: 1px solid rgba(127, 219, 241, 0.3);
}

.form-container {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #fff;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(127, 219, 241, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  color: #fff;
  font-size: 15px;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: rgba(127, 219, 241, 0.7);
  box-shadow: 0 0 0 1px rgba(127, 219, 241, 0.3);
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.form-group input:disabled {
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0.6;
  cursor: not-allowed;
}

.password-requirements {
  margin-top: 10px;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  border: 1px solid rgba(127, 219, 241, 0.2);
}


.pass-req-label {
  display: block;
  color: #a8d8e4;
  font-size: 12px;
  margin-bottom: 8px;
  font-weight: 500;
}

.password-requirements ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.password-requirements li {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.password-requirements li.text-success {
  color: #7FDBF1;
}

.password-requirements li span:first-child {
  font-size: 14px;
  font-weight: bold;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.divider span {
  padding: 0 15px;
  color: #acafb5;
  font-size: 13px;
}

.error-message {
  color: #ff8c8c;
  text-align: center;
  margin: 15px 0;
  padding: 10px;
  background: rgba(255, 82, 82, 0.1);
  border-radius: 6px;
  font-size: 13px;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
}

.requirements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 8px;
}

.req-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
  transition: color 0.2s ease;
}

.req-item.valid {
  color: #7FDBF1;
}

.check-icon {
  font-size: 12px;
  font-weight: bold;
  min-width: 14px;
}


@media screen and (max-width: 576px) {
  .requirements-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }
  
  .req-item {
    font-size: 10px;
  }
  
  .check-icon {
    font-size: 11px;
    min-width: 12px;
  }
}

.submit-button {
  background: linear-gradient(
315deg, #0A1E26, #11323F, #1A4453);
  color: #fff;
  border: 1px solid rgba(127, 219, 241, 0.5);
  border-radius: 8px;
  padding: 12px 40px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 140px;
  margin: 0 auto;
}

.submit-button:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(127, 219, 241, 0.5) 0%, rgba(0, 136, 204, 0.5) 100%);
  transform: translateY(-1px);
  border-color: rgba(127, 219, 241, 0.8);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.switch-link {
  text-align: center;
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
}

.switch-link a {
  color: #7FDBF1;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.switch-link a:hover {
  color: #ffffff;
}

.success-container {
  text-align: center;
  padding: 20px;
}

.success-container h3 {
  color: #7FDBF1;
  margin: 0 0 15px 0;
  font-size: 20px;
}

.success-container p {
  color: #a8d8e4;
  margin-bottom: 25px;
  font-size: 14px;
}

@media screen and (max-width: 576px) {
  .auth-modal-container {
    width: 95%;
    max-height: 95vh;
  }
  
  .auth-modal-header {
    padding: 15px 20px;
  }
  
  .auth-modal-header h2 {
    font-size: 18px;
  }
  
  .auth-modal-content {
    padding: 20px;
  }
  
  .tab {
    padding: 8px 20px;
    font-size: 12px;
  }
  
  .form-group input {
    padding: 10px 14px;
    font-size: 14px;
  }
  
  .submit-button {
    padding: 10px 30px;
    font-size: 14px;
  }
}
</style>
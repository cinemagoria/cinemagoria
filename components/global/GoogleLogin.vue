<template>
  <div class="google-login-container">
    <button 
      type="button" 
      @click="handleGoogleLogin" 
      class="google-login-button"
      :class="{ 'loading': isLoading }"
      :disabled="isLoading"
    >
      <div v-if="isLoading" class="loading-spinner"></div>
      <img v-else src="/google-icon.svg" alt="Google" class="google-icon">
      <span>{{ isLoading ? 'Accessing...' : buttonText }}</span>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    buttonText: {
      type: String,
      default: 'Sign in with Google'
    }
  },
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    async handleGoogleLogin() {
      this.isLoading = true;
      let redirecting = false;
      
      this.$emit('google-login-start');
      
      try {
        const response = await fetch(`${process.env.API_URL}/auth/google/`);
        const data = await response.json();
        
        if (data && data.login_url) {
          redirecting = true;
          window.location.href = data.login_url;
        } else {
          this.$emit('google-login-error');
        }
      } catch (error) {
        console.error('Google login error:', error);
        this.$emit('google-login-error');
      } finally {
        if (!redirecting) {
          this.isLoading = false;
        }
      }
    }
  }
}
</script>

<style scoped>
.google-login-container {
  margin: 15px 0;
  text-align: center;
}

.google-login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background-color: #111;
  color: #fff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 60%;
  margin: 0 auto;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
  position: relative;
}

.google-login-button:hover:not(.loading) {
  background-color: #f8f9fa;
  color: #111;
  box-shadow: 0 2px 4px rgba(0,0,0,0.18);
}

.google-login-button.loading {
  cursor: not-allowed;
  opacity: 0.8;
}

.google-icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 600px) {
  .google-login-button {
    font-size: 12px;
    padding: 8px 15px;
  }
  
  .google-icon,
  .loading-spinner {
    width: 16px;
    height: 16px;
  }
}
</style>
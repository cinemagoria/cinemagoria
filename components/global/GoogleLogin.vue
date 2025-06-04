<template>
  <div class="google-login-container">
    <button type="button" @click="handleGoogleLogin" class="google-login-button">
      <img src="/google-icon.svg" alt="Google" class="google-icon">
      <span>{{ buttonText }}</span>
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
  width: 100%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
}

.google-login-button:hover {
  background-color: #f8f9fa;
  color: #111;
  box-shadow: 0 2px 4px rgba(0,0,0,0.18);
}

.google-icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
}

@media (max-width: 600px) {
  .google-login-button {
    font-size: 12px;
    padding: 8px 15px;
  }
  
  .google-icon {
    width: 16px;
    height: 16px;
  }
}
</style>
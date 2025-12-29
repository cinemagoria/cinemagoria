<template>
  <div class="auth-success">
    <div class="auth-success-card">
      <h1>Authentication Successful</h1>
      <p v-if="loading">Processing your information...</p>
      <div v-else>
        <p v-if="error" class="error">{{ error }}</p>
        <p class="welcome-label" v-else>Welcome, {{ name }}!</p>
        <img src="/auth-success.svg" alt="Authentication Success" class="success-icon">
        <div class="redirect-message">
          <p>You will be automatically redirected in {{ countdown }} seconds...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { syncUserToTurso } from '~/services/userSync';


export default {
  data() {
    return {
      loading: true,
      error: null,
      token: null,
      email: null,
      name: null,
      countdown: 3
    }
  },
  setup() {
    return { supabase: useSupabaseClient() }
  },
  async mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    this.token = urlParams.get('token') || this.$route.query.token;
    this.email = urlParams.get('email') || this.$route.query.email;
    this.name = urlParams.get('name') || this.$route.query.name;
    
    if (!this.token || !this.email) {
      this.error = 'Authentication incomplete';
      this.loading = false;
      return;
    }

    if (!this.name) {
        this.name = this.email.split('@')[0];
    }
    
    try {
      localStorage.setItem('access_token', this.token);
      localStorage.setItem('email', this.email);
      localStorage.setItem('name', this.name);
      localStorage.setItem('auth_provider', urlParams.get('auth_provider') || 'native');
      
      syncUserToTurso({
          email: this.email,
          name: this.name,
      });
      
      window.dispatchEvent(new Event('auth-changed'));
      
      this.forceNavUpdate();

      const { data, error } = await this.supabase
        .from('user_data')
        .select('*')
        .eq('email', this.email);
        
      if (error) {
        throw new Error('Error verifying user data');
      }
      
      this.loading = false;
      const countdownInterval = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(countdownInterval);
          this.redirect();
        }
      }, 1000);
      
    } catch (error) {
      console.error('Auth success error:', error);
      this.error = 'Error processing authentication information';
      this.loading = false;
    }
  },
  methods: {
   redirect() {
      this.forceNavUpdate();
      
      const returnUrl = localStorage.getItem('auth_return_url');
      
      if (returnUrl) {
        localStorage.removeItem('auth_return_url');
        
        if (returnUrl.includes('/login') || returnUrl.includes('/register')) {
          this.$router.push('/');
        } else {
          if (returnUrl.startsWith('http')) {
            window.location.href = returnUrl;
          } else {
            this.$router.push(returnUrl);
          }
        }
      } else {
        this.$router.push('/');
      }
    },
    
    forceNavUpdate() {
      const navElements = document.querySelectorAll('nav');
      const loginLinks = document.querySelectorAll('a[href="/login"]');
      const watchlistLinks = document.querySelectorAll('a[href="/watchlist"]');

      if (loginLinks.length > 0) {
        loginLinks.forEach(link => {
          const parentLi = link.closest('li');
          if (parentLi) {
            parentLi.style.display = 'none';
          }
        });
      }
      
      if (watchlistLinks.length > 0) {
        watchlistLinks.forEach(link => {
          const parentLi = link.closest('li');
          if (parentLi) {
            parentLi.style.display = 'block';
          }
        });
      }

      window.dispatchEvent(new Event('auth-changed'));
    }
  }
}
</script>

<style scoped>
.auth-success {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.auth-success-card {
  background: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  padding: 30px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  text-align: center;
}

h1 {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(220, 220, 220) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
  margin-bottom: 20px;
}

p {
  color: #acafb5;
  margin: 10px 0;
}

.error {
  color: #f76c6c;
}

.redirect-message {
  margin-top: 20px;
  font-size: 14px;
}

.welcome-label {
  font-size: 16px !important
}

.success-icon {
  width: 204px;
  height: 204px;
  opacity: 0.7;
}
</style>
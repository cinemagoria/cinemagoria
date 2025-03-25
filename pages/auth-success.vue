<template>
  <div class="auth-success">
    <div class="auth-success-card">
      <h1>Autenticación exitosa</h1>
      <p v-if="loading">Procesando tu información...</p>
      <div v-else>
        <p v-if="error" class="error">{{ error }}</p>
        <p class="welcome-label" v-else>Bienvenido, {{ name }}!</p>
        <div class="redirect-message">
          <p>Serás redirigido automáticamente en {{ countdown }} segundos...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import supabase from '@/services/supabase';

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
  async mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    this.token = urlParams.get('token');
    this.email = urlParams.get('email');
    this.name = urlParams.get('name');
    const authProvider = urlParams.get('auth_provider') || 'native';
    
    if (!this.token || !this.email) {
      this.error = 'Información de autenticación incompleta';
      this.loading = false;
      return;
    }
    
    try {
      localStorage.setItem('access_token', this.token);
      localStorage.setItem('email', this.email);
      localStorage.setItem('auth_provider', authProvider);
      window.dispatchEvent(new Event('auth-changed'));
    
      this.forceNavUpdate();

      const { data, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('email', this.email);
        
      if (error) {
        throw new Error('Error al verificar datos de usuario');
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
      this.error = 'Error al procesar la información de autenticación';
      this.loading = false;
    }
  },
  methods: {
    redirect() {
      this.forceNavUpdate();
      window.location.href = '/';
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
</style>
<template>
  <div class="auth-success-container">
    <div class="auth-success-card">
      <transition name="fade" mode="out-in">
        <div v-if="loading" key="loading" class="state-container loading-state">
          <div class="spinner-wrapper">
            <div class="spinner"></div>
          </div>
          <h2 class="glow-text">Autenticando</h2>
          <p class="subtitle">Procesando tu información de forma segura...</p>
        </div>

        <div v-else-if="error" key="error" class="state-container error-state">
          <div class="error-icon-wrapper">
            <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h2 class="error-text">Error de autenticación</h2>
          <p class="error-detail">{{ error }}</p>
        </div>

        <div v-else key="success" class="state-container success-state">
          <div class="success-icon-wrapper">
            <img src="/ui/auth-success.svg" alt="Autenticación exitosa" class="success-icon">
          </div>
          <h2 class="glow-text">¡Hola, <span class="highlight">{{ name }}</span>!</h2>
          <p class="subtitle">La cuenta ha sido verificada correctamente.</p>
          
          <div class="redirect-container">
            <div class="progress-bar-wrapper">
               <div class="progress-bar"></div>
            </div>
            <p class="redirect-message">Redirigiendo en {{ countdown }} segundos...</p>
          </div>
        </div>
      </transition>
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
      this.error = 'Autenticación incompleta';
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
        throw new Error('Error al verificar los datos del usuario');
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
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

.auth-success-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #030406;
  background-image: 
    radial-gradient(circle at 15% 50%, rgba(31, 84, 103, 0.15), transparent 25%),
    radial-gradient(circle at 85% 30%, rgba(139, 233, 253, 0.1), transparent 25%);
  padding: 20px;
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  margin: -8px;
}

.auth-success-card {
  position: relative;
  background: rgba(3, 4, 6, 0.6);
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 
              0 0 0 1px rgba(31, 84, 103, 0.5), 
              inset 0 0 20px rgba(139, 233, 253, 0.05);
  backdrop-filter: blur(20px);
  text-align: center;
  overflow: hidden;
  animation: floatIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.auth-success-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #8BE9FD, #1F5467, transparent);
  opacity: 0.8;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 420px;
}

.glow-text {
  font-size: 28px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
  text-shadow: 0 0 20px rgba(139, 233, 253, 0.3);
}

.highlight {
  color: #8BE9FD;
}

.subtitle {
  color: #a0aab2;
  font-size: 15px;
  font-weight: 300;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.spinner-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  height: 120px;
}

.spinner {
  width: 56px;
  height: 56px;
  border: 4px solid rgba(31, 84, 103, 0.3);
  border-radius: 50%;
  border-top-color: #8BE9FD;
  animation: spin 1s ease-in-out infinite;
  box-shadow: 0 0 15px rgba(139, 233, 253, 0.2);
}

.success-icon-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 32px auto;
  width: 180px;
  height: 180px;
}

.success-icon {
  width: 150px;
  height: 150px;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 0 12px rgba(139, 233, 253, 0.4));
  animation: popIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.error-icon-wrapper {
  display: flex;
  justify-content: center; 
  margin-bottom: 24px;
  height: 120px;
  align-items: center;
}

.error-icon {
  width: 72px; 
  height: 72px;
  color: #ff5f5f;
  filter: drop-shadow(0 0 12px rgba(255, 85, 85, 0.4));
}

.error-text {
  font-size: 24px;
  font-weight: 600;
  color: #ff5f5f;
  margin: 0 0 12px 0;
}

.error-detail {
  color: #e0e6ed;
  background: rgba(255, 85, 85, 0.1);
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 85, 85, 0.2);
  display: inline-block;
  margin: 0;
}

.redirect-container {
  width: 100%;
  margin-top: 32px;
  background: rgba(0,0,0,0.3);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.05);
  box-sizing: border-box;
}

.progress-bar-wrapper {
  width: 100%;
  height: 4px;
  background: rgba(31, 84, 103, 0.3);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #1F5467, #8BE9FD);
  border-radius: 4px;
  width: 100%;
  animation: shrink 3s linear forwards;
}

.redirect-message {
  font-size: 14px;
  color: #8BE9FD;
  font-weight: 400;
  margin: 0;
  opacity: 0.9;
}

@keyframes floatIn {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes popIn {
  0% { transform: scale(0.5); opacity: 0; }
  80% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes shrink {
  from { width: 100%; }
  to { width: 0%; }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-enter {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media screen and (max-width: 576px) {
  .auth-success-card {
    width: 95%;
    max-height: 95vh;
    padding: 30px 20px;
  }
}
</style>
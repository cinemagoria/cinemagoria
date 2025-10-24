<template>
  <main class="main">
    <section class="auth-section">
      <div class="tabs">
        <span class="tab active">Sign In</span>
        <span class="tab" @click="goToRegister">Register</span>
      </div>
      <div class="auth-container">
        <div class="container-section">
          <br>
          <h1 class="text-white text-center"><b>¡Welcome Back!
          </b></h1>
          <h3 class="text-white text-center"><b>Sign in to your account:</b></h3>
          <div class="form">
            <form @submit.prevent="login">
              <GoogleLogin 
                buttonText="Sign in with Google" 
                @google-login-start="handleGoogleLoginStart"
                @google-login-error="handleGoogleLoginError"
              />
              <div class="divider">
                <span>or</span>
              </div>
              <div class="form-group">
                <label for="email">Email:</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="email" 
                  placeholder="johndoe@email.com" 
                  required
                  :disabled="googleLoginInProgress"
                >
              </div>
              <br>
              <div class="form-group">
                <label for="password">Contraseña:</label>
                <input 
                  type="password" 
                  id="password" 
                  v-model="password" 
                  placeholder="Enter your password" 
                  required
                  :disabled="googleLoginInProgress"
                >
              </div>
              <br>
              <br>
              <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
              <div class="button-container">
                <button type="button" class="button button--icon" @click.prevent="goBack">
                  <span class="txt">Back</span>
                </button>
                <button 
                  type="submit" 
                  class="button button--icon" 
                >
                  <span v-if="loading" class="spinner"></span>
                  <span class="txt">{{ loading ? 'Signing' : 'Sign In' }}</span>
                </button>
                <br>
              </div>
            </form>
            <br>
            <br>
          </div>
          <h2 class="text-center custom-center" style="margin-top:20px;"><strong>Don't have an account? <router-link :to="{ name: 'register' }">Sign Up</router-link></strong></h2>
          <h2 class="text-center custom-center"><strong>Forgot your password? <router-link :to="{ name: 'recovery' }">Reset</router-link></strong></h2>
        </div>
    </div>
    </section>
  </main>
</template>

<script>
import axios from 'axios';
import GoogleLogin from '@/components/global/GoogleLogin.vue';

export default {
  components: {
    GoogleLogin
  },
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '', 
      loading: false,
      googleLoginInProgress: false
    };
  },
  mounted() {
    this.checkAuthStatus();
  },
  methods: {
    checkAuthStatus() {
      const token = localStorage.getItem('access_token');
      if (token) {
        this.redirectToHome();
      }
    },
    
    handleGoogleLoginStart() {
      this.googleLoginInProgress = true;
    },
    
    handleGoogleLoginError() {
      this.googleLoginInProgress = false;
    },
    
    async login() {
      this.loading = true;
      this.errorMessage = '';
      try {
        const response = await axios.post('https://entercinema-drf.vercel.app/login/', {
          email: this.email,
          password: this.password
        });

        localStorage.setItem('email', response.data.email);
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('auth_provider', 'native'); 

        window.dispatchEvent(new Event('auth-changed'));
        
        this.redirectToHome();
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.errorMessage = 'Invalid login credentials.';
        } else {
          this.errorMessage = '';
        }
      }
      this.loading = false;
    },
    
    goBack() {
      this.$router.go(-1);
    },
    
    redirectToHome() {
      window.location.href = 'https://entercinema.com';
    },
    
    goToRegister() {
      this.$router.push({ name: 'register' });
    }
  }
};
</script>

<style scoped>
.auth-section {
  background: rgba(6, 47, 64, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 97, 135, 0.37);
  backdrop-filter: blur(13.5px);
  -webkit-backdrop-filter: blur(13.5px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 20px;
  margin: 20px;
}

.container-section {
  background: rgba(6, 47, 64, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 97, 135, 0.37);
  backdrop-filter: blur(13.5px);
  -webkit-backdrop-filter: blur(13.5px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 20px;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.tab {
  padding: 10px 20px;
  cursor: pointer;
  color: #80868b;
  background-color: transparent;
  border: 1px solid transparent;
  border-bottom: none;
}

.tab.active {
  color: #ffffff;
  background: rgba(10, 77, 106, 0.729);
  backdrop-filter: blur(13.5px);
  -webkit-backdrop-filter: blur(13.5px);
  border-radius: 5px;
  margin-right: 5px;
  text-transform: uppercase;
  letter-spacing: 2px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-bottom: none;
}

.tab:not(.active) {
  color: #ffffff;
  background: rgba(11, 75, 103, 0.15);
  backdrop-filter: blur(13.5px);
  margin-left: 5px;
  text-transform: uppercase;
  letter-spacing: 2px;
  -webkit-backdrop-filter: blur(13.5px);
  border-radius: 5px;
}

.text-center {
  text-align: center;
}

.form {
  display: flex;
  justify-content: center;
  width: 100%;
}

.form form {
  width: 100%;
  max-width: 500px;
}

.form-group {
  width: 90%;
  max-width: 320px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group label {
  align-self: flex-start;
  margin-bottom: 5px;
  margin-left: 25px;
}

.form-group input {
  width: 240px;
  margin: 0 auto;
  border-radius: 10px;
  padding: 12px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  display: block;
}

.form-group input:disabled {
  background-color: #f5f5f5;
  opacity: 0.6;
  cursor: not-allowed;
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.button {
  border-radius: 10px;
  font-size: 1.3rem;
  margin: 3px;
  position: relative;
  width: 140px; 
  display: flex;
  align-items: center; 
  justify-content: center;
}

.spinner {
  display: inline-block;
  position: absolute;
  left: 17px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
}

.spinner::before {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #f3f3f3;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite, dots 1.5s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes dots {
  0%, 20% { border-top-color: #fff; }
  40% { border-top-color: #aaa; }
  60% { border-top-color: #fff; }
  80%, 100% { border-top-color: #aaa; }
}

.error-message {
  color: red;
  text-align: center;
  margin-bottom: 10px;
  transition: all 0.3s ease; 
}

.error-message p {
  max-width: 70%; 
  margin: 0 auto;
  word-wrap: break-word;
}

a {
  font-weight: 600;
  color: #80868b;
  text-decoration: none;
}

a:hover {
  color: #ffffff;
}

h1,
h3 {
  text-align: center;
  margin-bottom: 20px;
  letter-spacing: 2px;
}

h2 {
  text-align: center;
  letter-spacing: 2px;
  font-size: 11px;
  text-transform: uppercase;
  margin: 0 auto;
  max-width: 800px;
  margin-bottom: 20px;
}

.custom-center {
  text-align: center;
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
  padding: 0 10px;
  color: #acafb5;
  font-size: 12px;
}

@media (max-width: 768px) {
  .form-group input {
    width: 260px;
  }
  
  .button {
    width: 120px;
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .container-section {
    margin: 5px;
    padding: 10px;
  }
  
  .form-group input {
    width: 220px;
  }
  
  .form-group label {
    margin-left: 15px;
  }
  
  .button {
    width: 100px;
    height: 40px;
    font-size: 0.9rem;
  }

  .tabs {
    margin-left: 0;
    justify-content: center;
  }

  .tab {
    padding: 8px 15px;
    font-size: 0.9rem;
  }

  .spinner {
    left: 10px;
    width: 12px;
    height: 12px;
  }
}

@media (max-width: 320px) {
  .container-section {
    margin: 2px;
    padding: 8px;
  }
  
  .form-group input {
    width: 180px;
    padding: 10px;
  }
  
  .form-group label {
    margin-left: 5px;
    font-size: 0.9rem;
  }
  
  .button {
    width: 80px;
    height: 35px;
    font-size: 0.8rem;
  }
  
  .tab {
    padding: 6px 10px;
    font-size: 0.8rem;
  }
  
  h1 {
    font-size: 1.3rem;
  }
  
  h3 {
    font-size: 1rem;
  }
  
  h2 {
    font-size: 0.8rem;
  }
}

.form-group input[type="password"] {
  margin-left: auto;
  margin-right: auto;
}
</style>
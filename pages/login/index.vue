<template>
  <main class="main">
    <section class="auth-section">
      <div class="tabs">
        <span class="tab active">Iniciar sesión</span>
        <span class="tab" @click="goToRegister">Registrarse</span>
      </div>
      <div class="auth-container">
        <div class="container-section">
          <br>
          <h1 class="text-white text-center"><b>¡Bienvenid@ Nuevamente!</b></h1>
          <h3 class="text-white text-center"><b>Inicia sesión con tu cuenta:</b></h3>
          <br>
          <div class="form">
            <form @submit.prevent="login">
              <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="email" style="transform: translate(11.2765px, 0px);" placeholder="juanperez@email.com" required>
              </div>
              <br>
              <div class="form-group">
                <label for="password">Contraseña:</label>
                <input type="password" id="password" v-model="password" placeholder="Ingrese su contraseña" required>
              </div>
              <br>
              <br>
              <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
              <div class="button-container">
                <button class="button button--icon" @click.prevent="goBack">
                  <!-- eslint-disable-next-line -->
                  <span class="txt">Volver</span>
                </button>
                <button type="submit" class="button button--icon">
                  <span v-if="loading" class="spinner"></span>
                  <span id="submitText" style="margin-left:5px; padding-left:3px; "class="txt">{{ loading ? 'Iniciando sesión' : 'Iniciar sesión' }}</span>
                </button>
                <br>
              </div>
            </form>
            <br>
            <br>
          </div>
          <br>
          <h2 class="text-center custom-center" style="margin-top:20px;"><strong>¿Sin cuenta aún? <router-link :to="{ name: 'register' }">Registrarse</router-link></strong></h2>
          <h2 class="text-center custom-center"><strong>¿Olvidó su contraseña? <router-link :to="{ name: 'recovery' }">Restablecer</router-link></strong></h2>
        </div>
    </div>
    </section>
  </main>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '', 
      loading: false 
    };
  },
  methods: {
    async login() {
      this.loading = true;
      this.errorMessage = '';
      try {
        const response = await axios.post('https://cinemathe-drf.vercel.app/login/', {
          email: this.email,
          password: this.password
        });

        localStorage.setItem('email', response.data.email);
        localStorage.setItem('access_token', response.data.access_token);
        this.redirectToHome();
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 401) {
          this.errorMessage = 'Invalid login credentials.';
        } else {
          this.errorMessage = 'An error occurred. Please try again later.';
        }
      }
      this.loading = false;
    },
    goBack() {
      this.$router.go(-1);
    },
    redirectToHome() {
      window.location.href = 'https://es.cinemathe.space';
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
  font-size: 9px;
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
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.button {
  border-radius: 10px;
  font-size: 1rem;
  margin: 3px;
  position: relative;
  width: 130px; 
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
  text-align: justify;
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

.form-group {
  margin-left: 3rem;
}

.form-group input[type="email"],
.form-group input[type="password"] {
  border-radius: 10px;
  padding: 10px;
  border: 1px solid #ccc;
}

.form-group input[type="email"] {
  margin-left: 30px;
}

.form-group input[type="password"] {
  margin-left: 8px;
}

@media (max-width: 400px) {
  .button {
    width: 80px;
    height: 40px;
  }

  .form-group input[type="email"] {
  margin-left: -8px;
}
.form-group input[type="password"] {
  margin-left: -1px;
}

.tabs {
  width: 5%;
  height: 3%;
  justify-content: unset;
  left: 5%;
  margin-left: 3rem;
}

.tab.active {
  max-width: 105px;
}

.tab:not(.active) {
  flex-wrap: wrap;
  max-width: 105px;
  margin: 0 auto;
  text-align: center;
  display:flex; 
  justify-content: center;
  align-content: space-around;
}

.spinner {
  left: 3px;
  padding: 2px;
  margin-right: 3px;
}
}
</style>
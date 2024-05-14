<template>
  <main class="main">
    <section class="section">
      <br>
      <h1 class="text-white text-center"><b>Bienvenid@ Nuevamente!</b></h1>
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
            <button class="button button--icon" @click="redirectToHome">
              <!-- eslint-disable-next-line -->
              <span class="txt">Volver</span>
            </button>
            <button type="submit" class="button button--icon">
              <span class="txt">Iniciar sesión</span>
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
      errorMessage: '' 
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('https://sf-django.vercel.app/login/', {
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
    },
    redirectToHome() {
      window.location.href = 'https://es--sonarflix.netlify.app';
    }
  }
};
</script>

<style scoped>
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

  .form {
    display: flex;
    justify-content: center;
  }

  .button-container {
    display: flex;
    justify-content: center;
  }

  .section {
    padding: 10px;
  }

  .button {
    border-radius: 10px;
    margin: 3px;
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

  .form-group input[type="email"],
  .form-group input[type="password"] {
    border-radius: 10px;
    padding: 10px; 
    border: 1px solid #ccc;
  }

  .form-group input[type="email"]{
    margin-left: 30px;
  }

  .form-group input[type="password"] {
    margin-left: 8px;
  }

</style>
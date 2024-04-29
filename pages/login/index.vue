<template>
  <main class="main">
    <section class="section">
      <br>
      <h1 class="text-white text-center"><b>[ This Section is under maintenance. ]</b></h1>
      <h1 class="text-white text-center"><b>Welcome Back</b></h1>
      <h3 class="text-white text-center"><b>Sign in to your account:</b></h3>
      <br>
      <div class="form">
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="email" placeholder="johndoe@example.com" required>
          </div>
          <br>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password" placeholder="Enter your password" required>
          </div>
          <br>
          <br>
          <div class="button-container">
            <button class="button button--icon" @click="redirectToHome">
              <!-- eslint-disable-next-line -->
              <span class="txt">Back</span>
            </button>
            <button type="submit" class="button button--icon">
              <span class="txt">Sign In</span>
            </button>
            
            <br>
          </div>
        </form>
        <br>
        <br>
      </div>
      <br>
      <h2 class="text-center custom-center" style="margin-top:20px;"><strong>Don't have an account? <router-link :to="{ name: 'register' }">Sign Up</router-link></strong></h2>
      <h2 class="text-center custom-center"><strong>Forgot your password? <router-link :to="{ name: 'recovery' }">Reset</router-link></strong></h2>
    </section>
  </main>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:8000/login/', {
          email: this.email,
          password: this.password
        });
        console.log(response.data);
        console.log(response.data.name);
        console.log(response.data.email);
        // Guardar el token en localStorage
        localStorage.setItem('access_token', response.data.access_token);
        // Verificar si el token se guarda correctamente en localStorage
        console.log(localStorage.getItem('access_token'));
        // Imprimir el token en la consola
        console.log(response.data.access_token);
        this.redirectToHome();
      } catch (error) {
        console.error(error);
      }
    },
    redirectToHome() {
      window.location.href = 'http://localhost:3000';
    }

  }
};
</script>

<style scoped>
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
<template>
  <main class="main">
    <section class="section">
      <br>
      <h1 class="text-white text-center"><b>Get started</b></h1>
      <div v-if="!showVerificationModal">
        <h3 class="text-white text-center"><b>Create a new account:</b></h3>
        <div class="form">
          <form @submit.prevent="register">
            <div class="form-group">
              <label for="name">Name:</label>
              <input type="text" id="name" v-model="name" placeholder="John Doe" required>
            </div>
            <br>
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" v-model="email" placeholder="johndoe@example.com" required>
            </div>
            <br>
            <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" id="password" v-model="password" placeholder="Enter your password" required>
              <br>
              <small v-if="password !== ''" class="text-danger">
                <br>
                <div class="text-white text-center">
                  Password must contain 8 characters minimum,<br>
                  and at least one of the following: uppercase,<br>
                  lowercase letter, number and symbol.
                </div>
              </small>
            </div>
            <br>
            <div class="button-container">
              <button class="button button--icon" @click="redirectToHome">
                <span class="txt">Back</span>
              </button>
              <button type="submit" class="button button--icon" :disabled="!isFormValid">
                <span class="txt">Sign Up</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div v-if="showVerificationModal" class="text-center" style="max-width: 200px; margin: 0 auto;">
        <p>A verification email has been sent to {{ email }}. Please check your inbox and verify your account.</p>
      </div>
      <div v-if="showVerificationModal" class="button-container">
        <button class="button button--icon" @click="redirectToHome">
          <span class="txt">Back</span>
        </button>
      </div>
      <br>
      <h3 class="text-center custom-center"><strong>Have an account? <router-link :to="{ name: 'login' }">Sign In Now</router-link></strong></h3>
    </section>
  </main>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      showVerificationModal: false,
    };
  },
  computed: {
    isFormValid() {
      return this.name !== '' && this.email !== '' && this.password !== '';
    }
  },
  methods: {
    async register() {
      try {
        const response = await axios.post('http://localhost:8000/api/register/', {
          name: this.name,
          email: this.email,
          password: this.password
        });
        console.log(response.data);
        this.showVerificationModal = true; 
      } catch (error) {
        console.error(error);
      }
    },
    redirectToHome() {
      window.location.href = 'https://sonarflix.netlify.app';
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

.button-container-show {
  display: none;
}

.form {
  display: flex;
  justify-content: center;
}

.input {
  border-radius: 18px;
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

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="password"] {
  border-radius: 10px;
  padding: 10px; 
  border: 1px solid #ccc;
}

.form-group input[type="text"],
.form-group input[type="email"]{
  margin-left: 30px;
}

.form-group input[type="password"] {
  margin-left: 8px;
}

.text-danger {
  text-align: center;
}

.text-danger-span {
  margin-left: 20px;
  text-align: justify;
}

</style>
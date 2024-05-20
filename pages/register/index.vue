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
              <input type="password" id="password" v-model="password" placeholder="Enter your password" required @input="checkPassword">
              <br>
              <div class="password-requirements">
                <ul>
                  <label class="pass-req-label">Password requirements:</label>
                  <br>
                  <li :class="{ 'text-success': hasUpperCase }"><span v-if="hasUpperCase">&#10003;</span><span v-else>&#9898;</span> One uppercase letter</li>
                  <li :class="{ 'text-success': hasLowerCase }"><span v-if="hasLowerCase">&#10003;</span><span v-else>&#9898;</span> One lowercase letter</li>
                  <li :class="{ 'text-success': hasNumber }"><span v-if="hasNumber">&#10003;</span><span v-else>&#9898;</span> One number</li>
                  <li :class="{ 'text-success': hasSymbol }"><span v-if="hasSymbol">&#10003;</span><span v-else>&#9898;</span> One symbol</li>
                  <li :class="{ 'text-success': hasMinLength }"><span v-if="hasMinLength">&#10003;</span><span v-else>&#9898;</span> Minimum 8 characters</li>
                </ul>
              </div>
            </div>
            <div class="error-message" v-if="errorMessage" :style="{ height: errorMessage ? 'auto' : '0', margin: errorMessage ? '10px auto' : '0 auto', overflow: errorMessage ? 'visible' : 'hidden' }">
              <p>{{ errorMessage }}</p>
            </div>
            <div class="button-container">
              <button class="button button--icon" @click="redirectToHome">
                <span class="txt">Back</span>
              </button>
              <button type="submit" class="button button--icon" :disabled="!isFormValid || !isPasswordValid">
                <span class="txt">Sign Up</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div v-if="showVerificationModal" class="text-center" style="max-width: 200px; margin: 0 auto;">
        <p>Thank you, {{ name }}, for registering! Your account with the email {{ email }} has been created. Enjoy your Cinemathe experience!</p>
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
      errorMessage: '',
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSymbol: false,
      hasMinLength: false
    };
  },
  computed: {
    isFormValid() {
      return this.name !== '' && this.email !== '' && this.password !== '';
    },
    isPasswordValid() {
      return this.hasUpperCase && this.hasLowerCase && this.hasNumber && this.hasSymbol && this.hasMinLength;
    }
  },
  methods: {
    async register() {
      try {
        const response = await axios.post('https://cinemathe-drf.vercel.app/api/register/', {
          name: this.name,
          email: this.email,
          password: this.password
        });
        this.showVerificationModal = true; 
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 500) {
          this.errorMessage = 'Failed to sign up: A user with this email already exists.'; 
        } else {
          this.errorMessage = 'An error occurred. Please try again later.';
        }
      }
    },
    redirectToHome() {
      window.location.href = 'https://cinemathe.netlify.app';
    },
    checkPassword() {
      this.hasUpperCase = /[A-Z]/.test(this.password);
      this.hasLowerCase = /[a-z]+/.test(this.password); 
      this.hasNumber = /\d/.test(this.password);
      this.hasSymbol = /[!@#$%^&*()_+]/.test(this.password);
      this.hasMinLength = this.password.length >= 8;
    }
  }
};
</script>

<style scoped>
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

@media only screen and (max-width: 600px) {
    .error-message p {
        max-width: 80%; 
    }
}

@media only screen and (max-width: 768px) {
    .error-message {
        padding: 0 10px; 
    }
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

.form-group {
    width: 300px;
    margin: 0 auto; 
    margin-left: calc(50% - 150px + 30px); 
}

.password-requirements {
    width: 300px;
    margin: 0 auto; 
    margin-left: calc(50% - 150px + 90px); 
}

.pass-req-label {
  position: relative; 
  left: -14px; 
  top: -1px; 
  transition: none 0s ease 0s; 
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

.text-success {
    color: #58A3B2;
}

.password-requirements ul {
    list-style-type: none;
    padding-left: 0;
}

.password-requirements li::before {
    content: ''; 
}

.password-requirements li {
    margin-left: -20px; 
}

</style>

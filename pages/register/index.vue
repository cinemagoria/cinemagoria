<template>
  <main class="main">
    <section class="auth-section">
      <div class="tabs">
        <span class="tab" @click="goToSignIn">Sign In</span>
        <span class="tab active">Register</span>
      </div>
      <div class="auth-container">
        <div class="container-section">
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
                        <li :class="{ 'text-success': hasMinLength }"><span v-if="hasMinLength">&#10003;</span><span v-else>&#9898;</span> Minimum 8 characters</li>
                        <li :class="{ 'text-success': hasUpperCase }"><span v-if="hasUpperCase">&#10003;</span><span v-else>&#9898;</span> One uppercase letter</li>
                        <li :class="{ 'text-success': hasLowerCase }"><span v-if="hasLowerCase">&#10003;</span><span v-else>&#9898;</span> One lowercase letter</li>
                        <li :class="{ 'text-success': hasNumber }"><span v-if="hasNumber">&#10003;</span><span v-else>&#9898;</span> One number</li>
                        <li :class="{ 'text-success': hasSymbol }"><span v-if="hasSymbol">&#10003;</span><span v-else>&#9898;</span> One symbol</li>
                      </ul>
                    </div>
                  </div>
                  <div class="error-message" v-if="errorMessage" :style="{ height: errorMessage ? 'auto' : '0', margin: errorMessage ? '10px auto' : '0 auto', overflow: errorMessage ? 'visible' : 'hidden' }">
                    <p>{{ errorMessage }}</p>
                  </div>
                  <div class="button-container">
                    <button type="button" class="button button--icon" @click="redirectToHome">
                      <span class="txt">Back</span>
                    </button>
                    <button type="submit" class="button button--icon" :disabled="!isFormValid || !isPasswordValid">
                      <span v-if="loading" class="spinner"></span>
                      <span class="txt">{{ loading ? 'Signing Up' : 'Sign Up' }}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div v-if="showVerificationModal" class="text-center custom-center" style="max-width: 250px; text-align: center; margin: 0 auto;">
              <p class="text-center custom-center">Thank you, {{ name }}, for registering! Your account with the email {{ email }} has been created. Enjoy your Cinemathe experience!</p>
            </div>
            <div v-if="showVerificationModal" class="button-container">
              <button class="button button--icon" @click="redirectToHome">
                <span class="txt">Back</span>
              </button>
            </div>
            <br>
            <h3 class="text-center custom-center"><strong>Have an account? <router-link :to="{ name: 'login' }">Sign In Now</router-link></strong></h3>
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
      name: '',
      email: '',
      password: '',
      showVerificationModal: false,
      errorMessage: '',
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSymbol: false,
      hasMinLength: false,
      loading: false
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
      this.loading = true;
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
      this.loading = false;
    },
    redirectToHome() {
      window.location.href = 'https://cinemathe.space';
    },
    checkPassword() {
      this.hasUpperCase = /[A-Z]/.test(this.password);
      this.hasLowerCase = /[a-z]+/.test(this.password);
      this.hasNumber = /\d/.test(this.password);
      this.hasSymbol = /[!@#$%^&*()_+]/.test(this.password);
      this.hasMinLength = this.password.length >= 8;
    },
    goToSignIn() {
      this.$router.push({ name: 'login' });
    },
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
  margin-left: 5px;
  text-transform: uppercase;
  letter-spacing: 2px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-bottom: none;
}

.tab:not(.active) {
  color: #ffffff;
  background: rgba(11, 75, 103, 0.15);
  backdrop-filter: blur(13.5px);
  margin-right: 5px;
  text-transform: uppercase;
  letter-spacing: 2px;
  -webkit-backdrop-filter: blur(13.5px);
  border-radius: 5px;
}

.text-center {
  text-align: center;
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

@media (max-width: 400px) {
  .button {
    width: 80px;
    height: 40px;
    font-size: 9px;
  }

  .form-group {
    margin-left: 13rem;
  }

  .password-requirements {
    margin-left: 4rem;
  }

  .form-group input[type="email"] {
  margin-left: 20px;
  max-width: 100px;
}
.form-group input[type="password"] {
  margin-left: -1px;
  max-width: 100px;
}

.form-group input[type="text"] {
  margin-left: 20px;
  max-width: 100px;
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
  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
  flex-direction: column-reverse;      
}

.tab:not(.active) {
  flex-wrap: wrap;
  max-width: 105px;
  margin: 0 auto;
  text-align: center;
  display:flex; 
  justify-content: center;
}

.spinner {
  left: 3px;
  padding: 2px;
  margin-right: 3px;
}
}
</style>

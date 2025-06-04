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
              <div class="form">
                <form @submit.prevent="register">
                  <GoogleLogin 
                    buttonText="Access with Google" 
                    @google-login-start="handleGoogleLoginStart"
                    @google-login-error="handleGoogleLoginError"
                  />
                  <div class="divider">
                    <span>or</span>
                  </div>
                  <h3 class="text-white text-center"><b>Create a new account:</b></h3>
                  <div class="form-group">
                    <label for="name">Name:</label>
                    <input 
                      type="name" 
                      id="name" 
                      v-model="name" 
                      placeholder="John Doe" 
                      required
                      :disabled="googleLoginInProgress"
                    >
                  </div>
                  <br>
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
                    <label for="password">Password:</label>
                    <input 
                      type="password" 
                      id="password" 
                      v-model="password" 
                      placeholder="Enter your password" 
                      required 
                      @input="checkPassword"
                      :disabled="googleLoginInProgress"
                    >
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
              <p class="text-center custom-center">Thank you, {{ name }}, for registering! Your account with the email {{ email }} has been created. Enjoy your EnterCinema experience!</p>
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
import GoogleLogin from '@/components/global/GoogleLogin.vue';

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
      loading: false,
      googleLoginInProgress: false
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
    handleGoogleLoginStart() {
      this.googleLoginInProgress = true;
    },
    
    handleGoogleLoginError() {
      this.googleLoginInProgress = false;
    },
    
    async register() {
      this.loading = true;
      try {
        const response = await axios.post('https://entercinema-drf.vercel.app/api/register/', {
          name: this.name,
          email: this.email,
          password: this.password
        });
        this.showVerificationModal = true;
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 500) {
          this.errorMessage = 'Error al registrarse: Ya existe un usuario con este email.';
        } else {
          this.errorMessage = '';
        }
      }
      this.loading = false;
    },
    redirectToHome() {
      window.location.href = 'https://entercinema.com';
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
    width: 100%;
}

.form form {
    width: 100%;
    max-width: 500px;
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
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.form-group label {
    margin-bottom: 5px;
    margin-left: 15px;
}

.form-group input {
    width: 280px;
    margin: 0 auto;
    border-radius: 10px;
    padding: 12px;
    border: 1px solid #ccc;
    box-sizing: border-box;
}

.form-group input:disabled {
    background-color: #f5f5f5;
    opacity: 0.6;
    cursor: not-allowed;
}

.password-requirements {
    width: 280px;
    margin: 10px auto 0;
    text-align: center;
}

.pass-req-label {
    display: block;
    margin-bottom: 8px;
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
    margin-left: 0;
    text-align: center;
}

@media (max-width: 768px) {
  .form-group input {
    width: 260px;
  }
  
  .password-requirements {
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
  
  .password-requirements {
    width: 220px;
  }
  
  .form-group label {
    margin-left: 10px;
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
  
  .password-requirements {
    width: 180px;
    font-size: 0.9rem;
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
</style>
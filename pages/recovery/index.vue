<template>
  <main class="main">
    <div class="auth-container" style="padding-top:20px;">
      <div class="container-section">
        <br>
        <h1 class="text-white text-center"><b>Reset Your Password</b></h1>
        <h3 class="text-white text-center" v-if="!confirmationMessage"><b>Type in your email and we'll send you a link to reset your password:</b></h3>
        <h3 class="text-white text-center" v-else><b> </b></h3>
        <br>
        <div class="form">
          <div v-if="confirmationMessage" class="confirmation-message">
            <p style="text-align: center; width:200px">An email has been sent to {{ email }}. Please check your inbox and reset your password.</p>
            <p style="text-align: center; width:200px">If you encounter any issues or have any questions, please contact to <a href="mailto:contact@ivanluna.dev">contact@ivanluna.dev</a>.</p>
            <div class="button-container">
              <button class="button button--icon" @click="redirectToHome">
                  <span class="txt">Back</span>
              </button>
            </div>
          </div>
          <form v-else @submit.prevent="recoverPassword">
            <div v-if="!confirmationMessage" class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" v-model="email" placeholder="johndoe@example.com" required>
            </div>
            <br>
            <div class="button-container">
              <button class="button button--icon" @click="redirectToHome">
                <span class="txt">Back</span>
              </button>
              <button v-if="!confirmationMessage" type="submit" class="button button--icon">
                <span class="txt">Reset Password</span>
              </button>
            </div>
          </form>
        </div>
        <br>
        <h2 class="text-center custom-center"><strong>Already have an account? <router-link :to="{ name: 'login' }">Sign In</router-link></strong></h2>
      </div>
    </div>
  </main>
</template>


<script>
export default {
  data() {
    return {
      email: '',
      confirmationMessage: false 
    };
  },
  methods: {
    recoverPassword() {
      this.confirmationMessage = true;
    },
    redirectToHome() {
      window.location.href = 'https://cinemathe.space';
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

.form-group {
  margin-left: 20px;
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
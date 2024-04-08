<template>
    <main class="main">
      <section class="section">
        <br>
        <h1 class="text-white text-center"><b>Reset Your Password</b></h1>
        <h3 class="text-white text-center"><b>Type in your email and we'll send you a link to reset your password:</b></h3>
        <br>
        <div class="form">
          <form @submit.prevent="recoverPassword">
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" v-model="email" placeholder="Enter your email" required>
            </div>
            <br>
            <div class="button-container">
            <button class="button button--icon" @click="redirectToHome">
              <!-- eslint-disable-next-line -->
            <span class="txt">Back</span>
            </button>
              <button type="submit" class="button button--icon">
                <span class="txt">Reset Password</span>
              </button>
            </div>
          </form>
        </div>
        <br>
        <h2 class="text-center custom-center"><strong>Already have an account? <router-link :to="{ name: 'auth' }">Sign In</router-link></strong></h2>
      </section>
    </main>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: ''
      };
    },
    methods: {
      recoverPassword() {
        // Implement your password recovery logic here
      }
    }
  };
  </script>
  <script>
  export default {
  methods: {
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

.form {
  display: flex;
  justify-content: center;
}

.input {
  border-radius: 18px; /* Aplica el border-radius al input */
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
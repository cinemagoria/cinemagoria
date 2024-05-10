<template>
    <main class="main">
      <section class="section">
        <br>
        <h1 class="text-white text-center"><b>Reestablezca su contraseña</b></h1>
        <h3 class="text-white text-center"><b>Escriba su correo electrónico y le enviaremos un enlace para restablecer su contraseña:</b></h3>
        <br> 
        <div class="form">
          <form @submit.prevent="recoverPassword">
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" v-model="email" placeholder="juanperez@email.com" required>
            </div>
            <br>
            <div class="button-container">
            <button class="button button--icon" @click="redirectToHome">
              <!-- eslint-disable-next-line -->
            <span class="txt">Volver</span>
            </button>
              <button type="submit" class="button button--icon">
                <span class="txt">Restablecer contraseña</span>
              </button>
            </div>
          </form>
        </div>
        <br>
        <h2 class="text-center custom-center"><strong>Ya tiene una cuenta? <router-link :to="{ name: 'login' }">Iniciar sesión</router-link></strong></h2>
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
      }
    }
  };
  </script>
  <script>
  export default {
  methods: {
    redirectToHome() {
      window.location.href = 'https://es--sonarflix.netlify.app';
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
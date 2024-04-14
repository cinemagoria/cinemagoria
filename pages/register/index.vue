<template>
  <main class="main">
    <section class="section">
      <br>
      <h1 class="text-white text-center"><b>Registrarse en SonarFlix</b></h1>
      <h3 class="text-white text-center"><b>Crear una nueva cuenta:</b></h3>
      <br>
      <div class="form">
        <form @submit.prevent="register">
          <div class="form-group">
            <label for="name">Nombre:</label>
            <input type="text" id="name" v-model="name" placeholder="Juan Pérez" required>
          </div>
          <br>
          <div class="form-group">
            <label for="email" style="margin-left: 10px;">Email:</label>
            <input type="email" id="email" v-model="email" placeholder="juanperez@example.com" required>
          </div>
          <br>
          <div class="form-group">
            <label for="password">Contraseña:</label>
            <input type="password" id="password" v-model="password" placeholder="Ingrese su contraseña" required>
            <br>
            <small v-if="!isValidPassword && password !== ''" class="text-danger">
              <br>
              <div class="text-white text-center">
                  La contraseña debe contener al menos 8 caracteres,<br>
                  y al menos uno de los siguientes: mayúscula,<br>
                  minúscula, número y símbolo.
              </div>
            </small>
          </div>
          <br>
          <div class="button-container">
            <button class="button button--icon" @click="redirectToHome">
              <span class="txt">Volver</span>
            </button>
            <button type="submit" class="button button--icon" :disabled="!isValidPassword">
              <span class="txt">Registrarse</span>
            </button>
          </div>
        </form>
      </div>
      <br>
      <h3 class="text-center custom-center"><strong>¿Ya tiene una cuenta? <router-link :to="{ name: 'auth' }">Inicie sesión ahora</router-link></strong></h3>
    </section>
  </main>
</template>
  
  <script>
  export default {
    data() {
      return {
        name: '',
        email: '',
        password: ''
      };
    },
    computed: {
      isValidPassword() {
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
        return regex.test(this.password);
      }
    },
    methods: {
      register() {
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
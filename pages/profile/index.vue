<template>
    <main class="main">
        <section class="profile-section">
            <br>
            <h1 class="text-white text-center"><b>Welcome Back! {{ userName }}</b></h1>
            <br>
            <div>
            <p>Nombre: {{ userName }}</p>
            <p>Email: {{ userEmail }}</p>
            <p>Token de acceso: {{ accessToken }}</p>
            </div>
            <br>
            <div class="button-container">
            <button class="button button--icon" @click="signOut">
                <span class="txt">Sign out</span>
            </button>
            </div>
        </section>
    </main>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            userName: '',
            userEmail: '',
            accessToken: ''
        };
    },
    mounted() {
        this.loadProfile();
    },
    methods: {
        async loadProfile() {
            try {
                // Hacer una solicitud HTTP a la vista de perfil en Django
                const response = await axios.get('http://localhost:8000/profile/');
                console.log(response);
                // Verificar si la respuesta contiene datos
                if (response.data) {
                    // Actualizar los datos del usuario en esta componente
                    this.userName = response.data.name;
                    this.userEmail = response.data.email;
                    this.accessToken = response.data.access_token;
                    console.log(this.userName);
                    console.log(this.userEmail);
                    console.log(this.accessToken);
                } else {
                    console.error("No se recibieron datos del perfil del usuario.");
                }
            } catch (error) {
                console.error(error);
            }
        },
        async signOut() {
          try {
              // Hacer una solicitud HTTP a la vista de logout_user en Django
              await axios.post('/api/logout/');
              // Eliminar el token de acceso del localStorage
              localStorage.removeItem('access_token');
              // Redirigir al usuario a la página de inicio de sesión
              this.$router.push('/login');
          } catch (error) {
              console.error(error);
          }
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
    
    h1 {
      text-align: center;
      margin-bottom: 20px; 
      letter-spacing: 2px;
    }
  
    .button-container {
      display: flex;
      justify-content: center;
      
    }
  
    .profile-section {
      padding: 10px;
    }
  
    .button {
      border-radius: 10px;
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
  
  
  </style>
  
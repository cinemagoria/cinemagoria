<template>
  <main class="main">
      <section class="profile-section">
          <br>
          <h1 class="text-white text-center"><b>Welcome Back! {{ userEmail }}</b></h1>
          <br>
          <div>
              <p>Email: {{ userEmail  }}</p>
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
export default {
  data() {
    let email = localStorage.getItem('email');
    console.log('Email obtenido del localStorage:', email);
    let accessToken = localStorage.getItem('access_token');
    console.log('Token de acceso obtenido del localStorage:', accessToken);
      
    return {
      userEmail: email || '',
      accessToken: accessToken || '',
      isLoggedIn: accessToken !== null 
    };
  },
  watch: {
    'localStorage.access_token': {
      handler() {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          window.location.href = 'http://localhost:3000/login';
        }
        this.isLoggedIn = accessToken !== null;
      },
      deep: false,
      immediate: true, 
    },
  },
  methods: {
    signOut() {
      localStorage.removeItem('access_token');
      console.log('access_token eliminado del localStorage');
      localStorage.removeItem('email');
      console.log('email eliminado del localStorage');
      window.location.href = 'http://localhost:3000/login';
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
  
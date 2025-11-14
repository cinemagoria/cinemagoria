<template>
    <main class="main">
      <section class="wip-section">
        <div class="image-container">
          <img src="~static/wip.png" alt="Maintenance Image" class="maintenance-image">
        </div>
        <br>
        <br>
        <h1 class="text-white text-center"><b>This Section is Under Maintenance</b>.</h1>
        <div class="button-container">
          <button class="button button--icon" @click="redirectToHome">
            <span class="txt">Back</span>
          </button>
          <a href="https://github.com/imprvhub/entercinema/blob/main/README.md" target="_blank" class="info button button--icon">
            <span class="txt">More Information</span>
          </a>
        </div>
      </section>
    </main>  
  </template>
  
  <script>
  export default {
    head () {
      return {
        title: 'EnterCinema - Work in progress.',
        meta: [
          { hid: 'og:title', property: 'og:title', content: 'Work in progress' },
          { hid: 'og:url', property: 'og:url', content: `${process.env.FRONTEND_URL}${this.$route.path}` },
        ],
      };
    },
    methods: {
      redirectToHome() {
        this.$router.push('/');
      },
    }
  };
  </script>
  
  <style scoped>
    .wip-section {
      padding: 10px;
    }
  
    .button-container {
      display: flex;
      justify-content: center;
      margin-bottom: 10px;
    }
  
    .button {
      border-radius: 10px;
      margin-right: 10px; 
    }
  
    .maintenance-image {
      max-width: 50%;
      height: auto;
      display: block;
      margin: 0 auto;
    }
  
    h1 {
      text-align: center;
      margin-bottom: 20px;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-size: 14px;
    }
  </style>
  
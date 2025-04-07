<template>
  <div class="error-container">
    <div class="error-content">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>
      
      <h1 class="error-title">{{ message }}</h1>
      
      <div class="error-message">
        <p v-if="error.statusCode === 504">
          Parece que no podemos cargar los datos en este momento. Por favor, verifica tu conexión a internet o intenta de nuevo más tarde.
        </p>
        <p v-else-if="error.statusCode === 404">
          La página que estás buscando no existe o ha sido movida.
        </p>
        <p v-else>
          Parece que has seguido un enlace roto o ingresado una URL que no existe en este sitio. También puede ser que haya un problema con tu conexión a internet.
        </p>
      </div>
      
      <div class="error-actions">
        <nuxt-link to="/" class="home-button">Volver al Inicio</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'no-footer',

  props: {
    error: {
      type: Object,
      required: true,
    },
  },

  head() {
    return {
      title: this.message,
    };
  },

  computed: {
    message() {
      if (this.error.statusCode === 404) {
        return "Página No Encontrada";
      } else if (this.error.statusCode === 504) {
        return "Tiempo de Conexión Agotado";
      } else {
        return this.error.message || "Ha Ocurrido un Error";
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.error-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(to bottom right, #092739, #061720);
  color: #fff;
  overflow: auto;
  z-index: 1000;
}

.error-content {
  max-width: 600px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.error-icon {
  margin-bottom: 1.5rem;
  color: #8BE9FD;
  
  svg {
    width: 60px;
    height: 60px;
    
    @media (max-width: 480px) {
      width: 50px;
      height: 50px;
    }
  }
}

.error-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin: 0 0 1.5rem;
  letter-spacing: 0.5px;
  color: #fff;
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
}

.error-message {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.8);
  
  p {
    margin: 0 0 1rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
}

.error-actions {
  margin-top: 1rem;
}

.home-button {
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  background-color: #8BE9FD;
  color: #092739;
  border: none;
  
  &:hover {
    background-color: #7AD6E9;
    box-shadow: 0 5px 15px rgba(139, 233, 253, 0.3);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    padding: 0.9rem 1.8rem;
  }
}
</style>
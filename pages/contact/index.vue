  <template>
    <main class="main">
    <UserNav />
    <nav class="navbar navbar-welcome">
      <h1 class="title-primary" style="color: #8BE9FD !important; margin-top:30px; margin-bottom:10px; display:flex; justify-content: center;;">Contáctanos</h1>
      <h2 class="title-secondary" style="color: rgb(172, 175, 181); font-size: 14px; max-width: 600px; margin: 20px auto 0;">
        Nos encantaría saber de ti. Envíanos un mensaje y te responderemos lo antes posible.
      </h2>
    </nav>

    <div class="contact-section">
      <div class="contact-container">
        <form @submit.prevent="submitForm" class="contact-form">
          <div class="form-group">
            <label for="name">Nombre</label>
            <input 
              type="text" 
              id="name" 
              v-model="form.name" 
              required 
              placeholder="Tu Nombre"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="form.email" 
              required 
              placeholder="tu.email@ejemplo.com"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="subject">Asunto</label>
            <input 
              type="text" 
              id="subject" 
              v-model="form.subject" 
              required 
              placeholder="Motivo del contacto"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="message">Mensaje</label>
            <textarea 
              id="message" 
              v-model="form.message" 
              required 
              placeholder="¿En qué podemos ayudarte?" 
              rows="6"
              class="form-input form-textarea"
            ></textarea>
          </div>

          <div v-if="successMessage" class="feedback-message success">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="feedback-message error">
            {{ errorMessage }}
          </div>

          <div class="button-container">
            <button 
              type="submit" 
              class="button button--search" 
              :disabled="loading"
              :style="{ 'pointer-events': loading ? 'none' : 'auto', 'opacity': loading ? '0.5' : '1' }"
            >
              <div v-if="loading" class="spinner"></div>
              <span v-else class="txt">Enviar Mensaje</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
import UserNav from '@/components/global/UserNav';

export default {
  head() {
    return {
      title: 'EnterCinema - Contáctanos',
      meta: [
        { hid: 'og:title', property: 'og:title', content: 'Contáctanos' },
        { hid: 'og:url', property: 'og:url', content: `${process.env.FRONTEND_URL}${this.$route.path}` },
      ],
    };
  },
  components: {
    UserNav
  },
  data() {
    return {
      loading: false,
      successMessage: '',
      errorMessage: '',
      form: {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    };
  },
  methods: {
    async submitForm() {
      this.loading = true;
      this.successMessage = '';
      this.errorMessage = '';

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.form)
        });

        const data = await response.json();

        if (response.ok && data.success) {
          this.successMessage = '¡Tu mensaje ha sido enviado exitosamente!';
          this.form = { name: '', email: '', subject: '', message: '' };
        } else {
          throw new Error(data.error || 'Error al enviar el mensaje');
        }
      } catch (error) {
        console.error('Contact error:', error);
        this.errorMessage = 'Algo salió mal. Por favor, inténtalo de nuevo más tarde.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.contact-section {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  min-height: 60vh; /* Reduced height */
}

.contact-container {
  background: rgba(16, 26, 35, 0.85);
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(127, 219, 241, 0.1);
  height: fit-content; /* Ensure container fits content */
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;

  label {
    color: #e0e0e0;
    font-size: 15px;
    font-weight: 500;
    margin-left: 4px;
    letter-spacing: 0.5px;
  }
}

.form-input {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(127, 219, 241, 0.2);
  border-radius: 10px;
  padding: 14px 18px;
  color: #fff;
  font-size: 16px;
  width: 100%;
  transition: all 0.3s ease;
  outline: none;

  &:focus {
    border-color: #8BE9FD;
    background: rgba(30, 41, 59, 0.9);
    box-shadow: 0 0 15px rgba(139, 233, 253, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
}

.form-textarea {
  resize: vertical;
  min-height: 120px; /* Adjusted height */
}

.button-container {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

.button--search {
  width: 100%;
  padding: 16px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: 1px solid #8BE9FD;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(139, 233, 253, 0.1);
  transition: all 0.3s ease;
  
  .txt {
    color: #8BE9FD !important;
    text-transform: uppercase;
  }

  &:hover {
    background-color: rgba(139, 233, 253, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 233, 253, 0.2);
  }

  &:disabled {
    border-color: #5a6e75;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    .txt {
      color: #5a6e75 !important;
    }
  }
}

.feedback-message {
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  margin-top: 20px;
  margin-bottom: 10px;
  animation: fadeIn 0.5s ease-out;

  &.success {
    background: rgba(46, 204, 113, 0.15);
    color: #2ecc71;
    border: 1px solid rgba(46, 204, 113, 0.3);
  }

  &.error {
    background: rgba(231, 76, 60, 0.15);
    color: #e74c3c;
    border: 1px solid rgba(231, 76, 60, 0.3);
  }
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(139, 233, 253, 0.1);
  border-top-color: #8BE9FD;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .contact-section {
    padding: 20px;
    margin-top: 0;
    min-height: auto;
  }
  
  .contact-container {
    padding: 24px;
  }
}
</style>

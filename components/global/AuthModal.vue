<template>
  <div v-if="isOpen" class="auth-modal-overlay" @click.self="closeModal">
    <div class="auth-modal-container">
      <div class="auth-modal-header">
        <h2>Inicia sesión para continuar</h2>
        <button @click="closeModal" class="close-button">×</button>
      </div>
      
      <div class="auth-modal-content">
        <div class="tabs">
          <span 
            :class="['tab', { active: activeTab === 'login' }]"
            @click="activeTab = 'login'"
          >
            Iniciar Sesión
          </span>
          <span 
            :class="['tab', { active: activeTab === 'register' }]"
            @click="activeTab = 'register'"
          >
            Registrarse
          </span>
        </div>

        <div v-if="activeTab === 'login'" class="form-container">
          <p class="modal-description">Inicia sesión para usar el asistente de IA</p>
          
          <form @submit.prevent="handleLogin">
            <GoogleLogin 
              buttonText="Acceder con Google"
              @google-login-start="handleGoogleLoginStart"
              @google-login-error="handleGoogleLoginError"
            />
            
            <div class="divider">
              <span>o</span>
            </div>

            <div class="form-group">
              <label for="login-email">Correo electrónico:</label>
              <input 
                type="email" 
                id="login-email"
                v-model="loginEmail" 
                placeholder="johndoe@email.com" 
                required
                :disabled="googleLoginInProgress"
              >
            </div>

            <div class="form-group">
              <label for="login-password">Contraseña:</label>
              <input 
                type="password" 
                id="login-password"
                v-model="loginPassword" 
                placeholder="Ingresa tu contraseña" 
                required
                :disabled="googleLoginInProgress"
              >
            </div>

            <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>

            <div class="button-container">
              <button type="submit" class="submit-button" :disabled="loginLoading">
                <span v-if="loginLoading" class="spinner"></span>
                <span>{{ loginLoading ? 'Iniciando...' : 'Iniciar Sesión' }}</span>
              </button>
            </div>
          </form>

          <p class="switch-link">
            ¿No tienes cuenta? 
            <a @click.prevent="activeTab = 'register'">Regístrate</a>
          </p>
        </div>

        <div v-if="activeTab === 'register'" class="form-container">
          <p class="modal-description">Crea una cuenta para acceder a funciones de IA</p>
          
          <form @submit.prevent="handleRegister">
            <GoogleLogin 
              buttonText="Registrarse con Google"
              @google-login-start="handleGoogleLoginStart"
              @google-login-error="handleGoogleLoginError"
            />
            
            <div class="divider">
              <span>o</span>
            </div>

            <div class="form-group">
              <label for="register-name">Nombre:</label>
              <input 
                type="text" 
                id="register-name"
                v-model="registerName" 
                placeholder="John Doe" 
                required
                :disabled="googleLoginInProgress"
              >
            </div>

            <div class="form-group">
              <label for="register-email">Correo electrónico:</label>
              <input 
                type="email" 
                id="register-email"
                v-model="registerEmail" 
                placeholder="johndoe@email.com" 
                required
                :disabled="googleLoginInProgress"
              >
            </div>

            <div class="form-group">
                <label for="register-password">Contraseña:</label>
                <input 
                    type="password" 
                    id="register-password"
                    v-model="registerPassword" 
                    placeholder="Ingresa tu contraseña" 
                    required
                    @input="checkPassword"
                    :disabled="googleLoginInProgress"
                >
                
                <div class="password-requirements">
                    <div class="requirements-grid">
                    <span :class="['req-item', { valid: hasMinLength }]">
                        <span class="check-icon">{{ hasMinLength ? '✓' : '○' }}</span>
                        Mín. 8 carac.
                    </span>
                    <span :class="['req-item', { valid: hasUpperCase }]">
                        <span class="check-icon">{{ hasUpperCase ? '✓' : '○' }}</span>
                        1 Mayúscula
                    </span>
                    <span :class="['req-item', { valid: hasLowerCase }]">
                        <span class="check-icon">{{ hasLowerCase ? '✓' : '○' }}</span>
                        1 Minúscula
                    </span>
                    <span :class="['req-item', { valid: hasNumber }]">
                        <span class="check-icon">{{ hasNumber ? '✓' : '○' }}</span>
                        1 Número
                    </span>
                    <span :class="['req-item', { valid: hasSymbol }]">
                        <span class="check-icon">{{ hasSymbol ? '✓' : '○' }}</span>
                        1 Símbolo
                    </span>
                    </div>
                </div>
            </div>

            <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>

            <div class="button-container">
              <button 
                type="submit" 
                class="submit-button"
                :disabled="registerLoading || !isFormValid || !isPasswordValid"
              >
                <span v-if="registerLoading" class="spinner"></span>
                <span>{{ registerLoading ? 'Registrando...' : 'Registrarse' }}</span>
              </button>
            </div>
          </form>

          <p class="switch-link">
            ¿Ya tienes cuenta? 
            <a @click.prevent="activeTab = 'login'">Inicia Sesión</a>
          </p>
        </div>

        <div v-if="showSuccessMessage" class="success-container">
          <h3>¡Cuenta creada exitosamente!</h3>
          <p>Tu cuenta ha sido creada. Por favor inicia sesión para continuar.</p>
          <button @click="handleSuccessClose" class="submit-button">Iniciar Sesión</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import GoogleLogin from './GoogleLogin.vue';

export default {
  name: 'AuthModal',
  components: {
    GoogleLogin
  },
  data() {
    return {
      isOpen: false,
      activeTab: 'login',
      loginEmail: '',
      loginPassword: '',
      registerName: '',
      registerEmail: '',
      registerPassword: '',
      errorMessage: '',
      loginLoading: false,
      registerLoading: false,
      googleLoginInProgress: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSymbol: false,
      hasMinLength: false,
      showSuccessMessage: false,
      pendingAction: null
    };
  },
  computed: {
    isFormValid() {
      return this.registerName !== '' && this.registerEmail !== '' && this.registerPassword !== '';
    },
    isPasswordValid() {
      return this.hasUpperCase && this.hasLowerCase && this.hasNumber && this.hasSymbol && this.hasMinLength;
    }
  },
  methods: {
    open(action = null) {
      this.isOpen = true;
      this.pendingAction = action;
      this.resetForm();
    },
    
    close() {
      this.isOpen = false;
      this.pendingAction = null;
      this.resetForm();
    },
    
    closeModal() {
      this.close();
    },
    
    resetForm() {
      this.loginEmail = '';
      this.loginPassword = '';
      this.registerName = '';
      this.registerEmail = '';
      this.registerPassword = '';
      this.errorMessage = '';
      this.showSuccessMessage = false;
      this.hasUpperCase = false;
      this.hasLowerCase = false;
      this.hasNumber = false;
      this.hasSymbol = false;
      this.hasMinLength = false;
    },
    
    handleGoogleLoginStart() {
      this.googleLoginInProgress = true;
    },
    
    handleGoogleLoginError() {
      this.googleLoginInProgress = false;
    },
    
    async handleLogin() {
      this.loginLoading = true;
      this.errorMessage = '';
      
      try {
        const response = await axios.post('https://entercinema-drf.vercel.app/login/', {
          email: this.loginEmail,
          password: this.loginPassword
        });

        localStorage.setItem('email', response.data.email);
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('auth_provider', 'native');

        window.dispatchEvent(new Event('auth-changed'));
        
        this.close();
        
        if (this.pendingAction) {
          this.$nextTick(() => {
            this.pendingAction();
          });
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.errorMessage = 'Credenciales inválidas.';
        } else {
          this.errorMessage = 'Ocurrió un error. Por favor intenta de nuevo.';
        }
      } finally {
        this.loginLoading = false;
      }
    },
    
    async handleRegister() {
      this.registerLoading = true;
      this.errorMessage = '';
      
      try {
        await axios.post('https://entercinema-drf.vercel.app/api/register/', {
          name: this.registerName,
          email: this.registerEmail,
          password: this.registerPassword
        });
        
        this.showSuccessMessage = true;
      } catch (error) {
        if (error.response && error.response.status === 500) {
          this.errorMessage = 'Ya existe un usuario con este correo electrónico.';
        } else {
          this.errorMessage = 'Ocurrió un error. Por favor intenta de nuevo.';
        }
      } finally {
        this.registerLoading = false;
      }
    },
    
    handleSuccessClose() {
      this.showSuccessMessage = false;
      this.activeTab = 'login';
      this.loginEmail = this.registerEmail;
      this.registerName = '';
      this.registerEmail = '';
      this.registerPassword = '';
    },
    
    checkPassword() {
      this.hasUpperCase = /[A-Z]/.test(this.registerPassword);
      this.hasLowerCase = /[a-z]+/.test(this.registerPassword);
      this.hasNumber = /\d/.test(this.registerPassword);
      this.hasSymbol = /[!@#$%^&*()_+]/.test(this.registerPassword);
      this.hasMinLength = this.registerPassword.length >= 8;
    }
  }
};
</script>

<style scoped>
.auth-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999999999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.auth-modal-container {
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  background: linear-gradient(135deg, rgba(6, 47, 64, 0.98) 0%, rgba(10, 30, 40, 0.99) 100%);
  box-shadow: 0 12px 40px 0 rgba(31, 104, 135, 0.6);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 16px;
  border: 1px solid rgba(127, 219, 241, 0.3);
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.auth-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid rgba(127, 219, 241, 0.2);
  background: rgba(0, 0, 0, 0.2);
}

.auth-modal-header h2 {
  color: #7FDBF1;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.close-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 32px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: all 0.2s ease;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-button:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.auth-modal-content {
  padding: 25px;
}

.modal-description {
  text-align: center;
  color: #a8d8e4;
  font-size: 14px;
  margin-bottom: 20px;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 25px;
}

.tab {
  padding: 10px 24px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(11, 75, 103, 0.15);
  backdrop-filter: blur(13.5px);
  -webkit-backdrop-filter: blur(13.5px);
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-size: 12px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.tab:hover {
  background: rgba(11, 75, 103, 0.25);
}

.tab.active {
  color: #ffffff;
  background: rgba(10, 77, 106, 0.729);
  border: 1px solid rgba(127, 219, 241, 0.3);
}

.form-container {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #fff;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(127, 219, 241, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  color: #fff;
  font-size: 15px;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: rgba(127, 219, 241, 0.7);
  box-shadow: 0 0 0 1px rgba(127, 219, 241, 0.3);
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.form-group input:disabled {
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0.6;
  cursor: not-allowed;
}

.password-requirements {
  margin-top: 10px;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  border: 1px solid rgba(127, 219, 241, 0.2);
}

.requirements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(95px, 1fr));
  gap: 8px;
}

.req-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
  transition: color 0.2s ease;
}

.req-item.valid {
  color: #7FDBF1;
}

.check-icon {
  font-size: 12px;
  font-weight: bold;
  min-width: 14px;
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
  padding: 0 15px;
  color: #acafb5;
  font-size: 13px;
}

.error-message {
  color: #ff8c8c;
  text-align: center;
  margin: 15px 0;
  padding: 10px;
  background: rgba(255, 82, 82, 0.1);
  border-radius: 6px;
  font-size: 13px;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.submit-button {
  background: linear-gradient(135deg, rgba(127, 219, 241, 0.4) 0%, rgba(0, 136, 204, 0.4) 100%);
  color: #fff;
  border: 1px solid rgba(127, 219, 241, 0.5);
  border-radius: 8px;
  padding: 12px 40px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 140px;
}

.submit-button:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(127, 219, 241, 0.5) 0%, rgba(0, 136, 204, 0.5) 100%);
  transform: translateY(-1px);
  border-color: rgba(127, 219, 241, 0.8);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.switch-link {
  text-align: center;
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
}

.switch-link a {
  color: #7FDBF1;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.switch-link a:hover {
  color: #ffffff;
}

.success-container {
  text-align: center;
  padding: 20px;
}

.success-container h3 {
  color: #7FDBF1;
  margin: 0 0 15px 0;
  font-size: 20px;
}

.success-container p {
  color: #a8d8e4;
  margin-bottom: 25px;
  font-size: 14px;
}

@media screen and (max-width: 576px) {
  .auth-modal-container {
    width: 95%;
    max-height: 95vh;
  }
  
  .auth-modal-header {
    padding: 15px 20px;
  }
  
  .auth-modal-header h2 {
    font-size: 18px;
  }
  
  .auth-modal-content {
    padding: 20px;
  }
  
  .tab {
    padding: 8px 16px;
    font-size: 11px;
  }
  
  .form-group input {
    padding: 10px 14px;
    font-size: 14px;
  }
  
  .submit-button {
    padding: 10px 30px;
    font-size: 14px;
  }
  
  .requirements-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }
  
  .req-item {
    font-size: 10px;
  }
  
  .check-icon {
    font-size: 11px;
    min-width: 12px;
  }
}
</style>
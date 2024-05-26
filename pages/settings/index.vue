<template>
  <main class="main">
    <section class="section">
      <h1 class="text-white text-center"><b>Configuración de Cuenta</b></h1>
      <br>
      <div class="user-info">
        <div class="avatar-container">
          <div class="avatar-wrapper">
            <img :src="userAvatar"  @click="openAvatarModal" alt="Avatar del usuario" class="avatar">
          </div>
        </div>
        <button @click="openAvatarModal" class="change-avatar-button">Cambiar avatar</button>
        <!-- Modal -->
        <div class="modal" v-if="isModalOpen">
          <div class="modal-content">
            <span class="close" @click="closeAvatarModal">&times;</span>
            <h2 style="text-align: center;">Selecciona tu Avatar</h2>
            <div class="avatar-options">
              <img v-for="avatar in avatars" :src="avatar" alt="Avatar" @click="selectAvatar(avatar)">
            </div>
          </div>
        </div>
        <!-- Modal para eliminar cuenta -->
        <div class="modal-delete" v-if="isDeleteModalOpen">
          <div class="modal-delete-content">
            <span class="close" @click="closeDeleteModal">&times;</span>
            <h2 class="text-center">Eliminar Cuenta</h2>
            <p class="delete-warning" style="text-transform: uppercase; letter-spacing: 1px;">¿Confirma la eliminación permanente de su cuenta?</p>
            <p class="delete-warning" style="letter-spacing: 1px;">Su cuenta entrará en proceso de eliminación. Tenga en cuenta que el cierre de la cuenta asociada a {{ userEmail }} será irreversible. Tiene 72 horas para revertir la acción comunicándose a contact@ivanluna.dev.
              Si no hay solicitud de restablecimiento en ese plazo, la cuenta se eliminará definitivamente.</p> 
            <div class="button-container">
              <button @click="cancelDelete" class="button button-back">Cancelar</button>
              <button @click="confirmDelete" class="button button-delete-account">Confirmar</button>
            </div>
          </div>
        </div>
        
        <div class="user-details">
          <p><strong class="label">Nombre:</strong> <span class="value">{{ firstName }}</span></p>
          <p><strong class="label">Email:</strong> <span class="value">{{ email }}</span></p>
          <p><strong class="label">Fecha de Registro:</strong> <span class="value">{{ joinedDate }} (UTC)</span></p>
          <p><strong class="label">Último Login:</strong> <span class="value">{{ lastLoginDate }} (UTC)</span></p>
          <p><strong class="label">Última vez activo:</strong> <span class="value">{{ lastActiveDate }} (UTC)</span></p>
        </div>
      </div>
      <div class="button-container">
        <button @click="back" class="button button-back">Volver</button>
        <button @click="deleteAccount" class="button button-delete-account">Eliminar cuenta</button>
      </div>
    </section>
  </main>
</template>

<script>
import supabase from '@/services/supabase';
import { mapActions } from 'vuex';

async function getUserAvatar(userEmail) {
  try {
    const { data, error } = await supabase
      .from('user_data')
      .select('avatar')
      .eq('email', userEmail);
      
    if (error) {
      throw new Error('Error al obtener el avatar del usuario:', error.message);
    }

    const userAvatar = data[0]?.avatar || '/avatars/avatar-ss0.png';
    return userAvatar;
  } catch (error) {
    console.error('Error al obtener el avatar del usuario:', error);
    return '/avatars/avatar-ss0.png';
  }
}

export default {
  data() {
    return {
      userData: null,
      userAvatar: '/avatars/avatar-ss0.png',
      lastActiveDate: '',
      isModalOpen: false,
      isDeleteModalOpen: false,
      avatars: [
      '/avatars/avatar-ss0.png',
      '/avatars/avatar-ss1.png',
      '/avatars/avatar-ss10.png',
      '/avatars/avatar-ss11.png',
      '/avatars/avatar-ss12.png',
      '/avatars/avatar-ss13.png',
      '/avatars/avatar-ss14.png',
      '/avatars/avatar-ss15.png',
      '/avatars/avatar-ss16.png',
      '/avatars/avatar-ss17.png',
      '/avatars/avatar-ss18.png',
      '/avatars/avatar-ss19.png',
      '/avatars/avatar-ss2.png',
      '/avatars/avatar-ss20.png',
      '/avatars/avatar-ss21.png',
      '/avatars/avatar-ss22.png',
      '/avatars/avatar-ss23.png',
      '/avatars/avatar-ss24.png',
      '/avatars/avatar-ss25.png',
      '/avatars/avatar-ss26.png',
      '/avatars/avatar-ss27.png',
      '/avatars/avatar-ss28.png',
      '/avatars/avatar-ss3.png',
      '/avatars/avatar-ss4.png',
      '/avatars/avatar-ss5.png',
      '/avatars/avatar-ss6.png',
      '/avatars/avatar-ss7.png',
      '/avatars/avatar-ss8.png',
      '/avatars/avatar-ss9.png'
      ]
    }
  },
  computed: {
    firstName() {
      return this.userData ? this.userData.first_name : '';
    },
    email() {
      return this.userData ? this.userData.email : '';
    },
    joinedDate() {
      return this.userData ? this.formatDate(this.userData.date_joined) : '';
    },
    lastLoginDate() {
      return this.userData ? this.formatDate(this.userData.last_login) : '';
    }
  },
  methods: {
    ...mapActions(['selectAvatar', 'back', 'updateUserAvatar']),
    back() {
      this.$router.go(-1);
    },
    openAvatarModal() {
      this.isModalOpen = true;
    },

    closeAvatarModal() {
      this.isModalOpen = false;
    },

    deleteAccount() {
  this.openDeleteModal();
},

  async openDeleteModal() {
    this.isDeleteModalOpen = true;
  },

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  },

  cancelDelete() {
    this.closeDeleteModal();
  },

  async confirmDelete() {
  try {
    const { data: existingRequests, error: requestError } = await supabase
      .from('requests')
      .select('*')
      .eq('email', this.userEmail)
      .eq('is_executed', 'false');

    if (requestError) {
      throw new Error('Error al buscar solicitudes existentes:', requestError.message);
    }

    if (existingRequests.length > 0) {
      console.log('Ya existe una solicitud pendiente para este usuario.');
      return;
    }

    const { data, error } = await supabase
      .from('requests')
      .insert([
        { email: this.userEmail, action: 'delete account', is_executed: 'false' }
      ]);

    if (error) {
      throw new Error('Error al crear la solicitud de eliminación de cuenta:', error.message);
    }

    this.isDeleteModalOpen = false;
    this.showConfirmationMessage();
  } catch (error) {
    console.error('Error al confirmar eliminación de cuenta:', error);
  }
  },

  showConfirmationMessage() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('email');
    window.location.href = 'https://es.cinemathe.space/login'; 
  },

    async selectAvatar(avatar) {
      try {
        this.userAvatar = avatar;
        await this.updateUserAvatar(avatar);
        this.closeAvatarModal();
      } catch (error) {
        console.error('Error al seleccionar el avatar:', error);
      }
    },

    async updateUserAvatar(avatar) {
      try {
        if (!this.userEmail) {
          throw new Error('El email del usuario no está definido.');
        }
        const { error } = await supabase
          .from('user_data')
          .update({ avatar })
          .eq('email', this.userEmail);
        if (error) {
          throw new Error('Error al actualizar el avatar del usuario:', error.message);
        }
      } catch (error) {
        console.error('Error al actualizar el avatar del usuario:', error);
      }
    },
    async fetchUserDb() {
      try {
        const { data, error } = await supabase
          .from('auth_user')
          .select('*')
          .eq('email', this.userEmail);
        
        if (error) {
          throw new Error('Error al conectar con la base de datos: ' + error.message);
        }
        
        this.userData = data[0];
        this.userAvatar = await getUserAvatar(this.userEmail);
        this.createOrUpdateUserData();
      } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
      }
    },

    async createOrUpdateUserData() {
      try {
        const currentDate = new Date().toISOString(); 
        const formattedLastActive = this.formatDate(currentDate);
        const userDataToUpdate = {
          email: this.userEmail,
          first_name: this.firstName,
          date_joined: this.joinedDate,
          last_login: this.lastLoginDate,
          last_active: formattedLastActive
        };

        const { data: existingUserData, error } = await supabase
          .from('user_data')
          .select('*')
          .eq('email', this.userEmail);

        if (error) {
          throw new Error('Error al verificar la existencia de datos de usuario:', error);
        }

        if (existingUserData && existingUserData.length > 0) {
          await supabase
            .from('user_data')
            .update(userDataToUpdate)
            .eq('email', this.userEmail);
        } else {
          await supabase
            .from('user_data')
            .insert([userDataToUpdate]); 
        }
        this.lastActiveDate = formattedLastActive;
      } catch (error) {
        console.error('Error al crear o actualizar datos de usuario:', error);
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      const formattedDate = date.getUTCFullYear() + '-' +
        ('0' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
        ('0' + date.getUTCDate()).slice(-2) + ' ' +
        ('0' + date.getUTCHours()).slice(-2) + ':' +
        ('0' + date.getUTCMinutes()).slice(-2) + ':' +
        ('0' + date.getUTCSeconds()).slice(-2);
      return formattedDate;
    }
  },
  mounted() {
    try {
      const email = localStorage.getItem('email');
      const accessToken = localStorage.getItem('access_token');
      this.userEmail = email || '';
      this.hasAccessToken = accessToken !== null;
      this.isLoggedIn = accessToken !== null;
      this.fetchUserDb();
    } catch (error) {
      console.error('Error en el montaje:', error);
    }
  }
}
</script>

<style scoped>
.main {
  padding: 20px;
}

.section {
  background: rgba( 6, 47, 64, 0.15 );
  box-shadow: 0 8px 32px 0 rgba(31, 97, 135, 0.37);
  backdrop-filter: blur( 13.5px );
  -webkit-backdrop-filter: blur( 13.5px );
  border-radius: 10px;
  border: 1px solid rgba( 255, 255, 255, 0.18 );
  padding: 20px;
}

.text-center {
  text-align: center;
}

.title {
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-container {
  text-align: center;
  margin-bottom: 20px;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.avatar {
  width: 120px;
  border: 2px solid rgba( 255, 255, 255, 0.18 );
  height: 120px;
  box-shadow: 0 5px 32px 0 rgba(31, 97, 135, 0.37);
  border-radius: 50%;
  object-fit: cover;
}

.change-avatar-button {
  background-color: #062F40; 
  color: #fff;
  font-size: 12px; 
  box-shadow: 0 5px 32px 0 rgba(31, 97, 135, 0.37);
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
}

.change-avatar-button:hover {
  background-color: #084a66; 
}

.user-details {
  padding: 20px;
  background: rgba( 6, 47, 64, 0.15 );
  box-shadow: 0 8px 32px 0 rgba(31, 97, 135, 0.37);
  backdrop-filter: blur( 13.5px );
  -webkit-backdrop-filter: blur( 13.5px );
  border-radius: 10px;
  border: 1px solid rgba( 255, 255, 255, 0.18 );
  margin-top: 20px;
  width: 50%;
}

@media screen and (max-width: 600px) {
  .user-details {
    width: 80%;
  }
}

.user-details p {
  text-align: center;
}

.label {
  color: #808080;
  font-size: 12px; 
}

.value {
  color: #fff; 
  font-size: 12px;
}

@media screen and (max-width: 400px) {
  .label.value {
    font-size: 10px;
  }
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.button {
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.button-back {
  background-color: #062F40;
  font-size: 12px; 
  box-shadow: 0 5px 32px 0 rgba(31, 97, 135, 0.37); 
  padding: 8px 16px;
  border-radius: 5px;
  margin-right: 5px;
  color: #fff;
}

.button-back:hover {
  background-color: #084a66; 
}

.button-delete-account {
  background-color: #B22727;
  font-size: 12px; 
  box-shadow: 0 5px 32px 0 rgba(135, 55, 31, 0.37); 
  padding: 8px 16px;
  margin-left: 5px;
  border-radius: 5px;
  color: #fff;
}

.button-delete-account:hover {
  background-color: #e42626;
}

.delete-warning {
  text-align: center;
  color: red;
  font-weight: 600;
}

.modal.open {
  display: block;
}

.modal {
  position: fixed;
  z-index: 9999; 
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background: rgba( 82, 71, 71, 0 );
  box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
  backdrop-filter: blur( 16px );
  -webkit-backdrop-filter: blur( 16px );
  border-radius: 10px;
  border: 1px solid rgba( 255, 255, 255, 0.18 );
  margin: 0 auto;
  padding: 20px;
  width: 90%;
}

.modal-delete {
  position: fixed;
  z-index: 9999; 
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
}

.modal-delete-content {
  background-color: #041e2a;
  margin: 0 auto;
  margin-top: 20%;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  border-radius: 10px;
}

@media screen and (min-width: 1200px) {
  .modal-delete-content {
    margin-top: 10%;
  }
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #084a66;
  text-decoration: none;
  cursor: pointer;
}

.avatar-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.avatar-options img {
  width: 100px;
  height: 100px;
  margin: 10px;
  cursor: pointer;
}
</style>
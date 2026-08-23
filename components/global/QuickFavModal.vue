<template>
  <transition name="fade">
    <div v-if="visible" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <div class="modal-header">
          <h3>¿Eliminar de Mi Lista?</h3>
          <button class="close-btn" @click="close">×</button>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que deseas eliminar <strong>{{ itemName }}</strong> de tu lista?</p>
        </div>
        <div class="modal-actions">
          <button class="cancel-btn" @click="close">Cancelar</button>
          <button class="confirm-btn" @click="confirmRemove">Eliminar</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'QuickFavModal',
  data() {
    return {
      visible: false,
      item: null,
      tursoBackendUrl: process.env.TURSO_BACKEND_URL || 'https://cinemagoria-favorites-746175915741.us-east1.run.app/api',
      userEmail: '',
    };
  },
  computed: {
    itemName() {
      return this.item?.nameForDb || this.item?.title || this.item?.name || 'this item';
    },
    favId() {
        if (!this.item) return '';
        return this.item.favId; 
    }
  },
  mounted() {
    this.$bus.$on('open-quickfav-modal', this.open);
    const email = localStorage.getItem('email');
    this.userEmail = email || '';
  },
  beforeDestroy() {
    this.$bus.$off('open-quickfav-modal', this.open);
  },
  methods: {
    open(payload) {
      if (!payload) return;
      this.item = payload;
      this.visible = true;
      document.body.style.overflow = 'hidden';
    },
    close() {
      this.visible = false;
      this.item = null;
      document.body.style.overflow = '';
    },
    async confirmRemove() {
      if (!this.item || !this.item.favId || !this.userEmail) {
          this.close();
          return;
      }

      try {
          const [itemType, itemId] = this.item.favId.split('/');
          const response = await fetch(
            `${this.tursoBackendUrl}/favorites/${this.userEmail}/${itemType}/${itemId}`,
            { 
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' }
            }
          );

          if (!response.ok) throw new Error('Failed to remove favorite');

          this.$bus.$emit('favorites-updated');
          this.close();
      } catch (e) {
          console.error(e);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(1, 4, 6, 0.82);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(5px);
}

.modal-content {
  position: relative;
  background-color: #040E13;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 28' width='56' height='28'%3E%3Cpath fill='%237ed2e3' fill-opacity='0.1' d='M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0zm-5.43 2.71c1.13-.72 2.3-1.37 3.54-1.93a19.98 19.98 0 0 0-32.76 0c1.23.56 2.41 1.2 3.54 1.93a15.98 15.98 0 0 1 25.68 0zm-4.67 3.78c.94-.95 1.96-1.83 3.03-2.63a13.98 13.98 0 0 0-22.4 0c1.07.8 2.09 1.68 3.03 2.63a9.99 9.99 0 0 1 16.34 0z'%3E%3C/path%3E%3C/svg%3E"),
    radial-gradient(110% 80% at 8% 0%, rgba(31, 84, 103, 0.26), transparent 52%),
    linear-gradient(150deg, #071820 0%, #040D12 58%, #02080B 100%);
  border: 1px solid rgba(139, 233, 253, 0.18);
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  overflow: hidden;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(139, 233, 253, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  animation: modalPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes modalPop {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to bottom right,#092739,#061720);

  h3 {
    margin: 0;
    color: #8BE9FD;
    font-size: 1.2rem;
    font-weight: 600;
  }

  .close-btn {
    background: none;
    border: none;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    opacity: 0.7;
    transition: opacity 0.2s;
    
    &:hover { opacity: 1; color: #8BE9FD; }
  }
}

.modal-body {
  padding: 2rem 1.5rem;
  color: #e0e0e0;
  font-size: 1.05rem;
  line-height: 1.6;
  text-align: center;
  
  strong {
      color: #fff;
      font-weight: 600;
  }
}

.modal-actions {
  padding: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
  background: rgba(0,0,0,0.2);
  border-top: 1px solid rgba(255,255,255,0.05);
}

.cancel-btn, .confirm-btn {
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
}

.cancel-btn {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  color: #ccc;

  &:hover {
    border-color: #fff;
    color: #fff;
    background: rgba(255,255,255,0.05);
  }
}

.confirm-btn {
  background: #e94b4b;
  border: 1px solid #e94b4b;
  color: white;

  &:hover {
    background: #ff6b6b;
    border-color: #ff6b6b;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(233, 75, 75, 0.3);
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>

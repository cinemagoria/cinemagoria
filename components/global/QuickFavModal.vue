<template>
  <transition name="fade">
    <div v-if="visible" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Remove from Watchlist?</h3>
          <button class="close-btn" @click="close">×</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to remove <strong>{{ itemName }}</strong> from your watchlist?</p>
        </div>
        <div class="modal-actions">
          <button class="cancel-btn" @click="close">Cancel</button>
          <button class="confirm-btn" @click="confirmRemove">Remove</button>
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
      tursoBackendUrl: process.env.TURSO_BACKEND_URL || 'https://entercinema-favorites.vercel.app/api',
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
    this.$root.$on('open-quickfav-modal', this.open);
    const email = localStorage.getItem('email');
    this.userEmail = email || '';
  },
  beforeDestroy() {
    this.$root.$off('open-quickfav-modal', this.open);
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

          this.$root.$emit('favorites-updated');
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
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: linear-gradient(to bottom right,#092739,#061720);;
  border: 1px solid #8BE9FD;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.7);
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

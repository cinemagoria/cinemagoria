<template>
  <div v-if="visible" :class="$style.modalOverlay" @click.self="close">
    <div :class="$style.modalWrapper">
      <div :class="$style.modalContent">
        <div :class="$style.modalHeader">
          <h2>Crear Nueva Lista</h2>
          <button @click="close" :class="$style.closeButton">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div :class="$style.modalBody">
           <form @submit.prevent="createList">
               <div :class="$style.formGroup">
                   <label for="listName">Nombre</label>
                   <input type="text" id="listName" v-model="form.name" required placeholder="ej. Mejor Ciencia Ficción 2024" maxlength="90" />
                   <span :class="$style.charCount">{{ 90 - form.name.length }} restantes</span>
               </div>
               
               <div :class="$style.formGroup">
                   <label for="listDesc">Descripción (Opcional)</label>
                   <textarea id="listDesc" v-model="form.description" rows="3" placeholder="¿De qué trata esta lista?" maxlength="180"></textarea>
                   <span :class="$style.charCount">{{ 180 - form.description.length }} restantes</span>
               </div>

               <div :class="$style.formGroup">
                   <label :class="$style.checkboxLabel">
                       <input type="checkbox" v-model="form.isPublic" />
                       <span :class="$style.labelText">¿Hacer Pública?</span>
                   </label>
                   <p :class="$style.hint">Las listas públicas se pueden compartir mediante una URL única.</p>
               </div>

               <div :class="$style.actions">
                   <button type="button" @click="close" :class="$style.cancelBtn">Cancelar</button>
                   <button type="submit" :class="$style.createBtn" :disabled="loading">
                       {{ loading ? 'Creando...' : 'Crear Lista' }}
                   </button>
               </div>
           </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      loading: false,
      form: {
          name: '',
          description: '',
          isPublic: false
      }
    };
  },
  
  computed: {
    tursoBackendUrl() {
      return this.$config.public.tursoBackendUrl;
    }
  },

  mounted() {
    this.$bus.$on('show-create-list-modal', this.show);
  },

  beforeDestroy() {
    this.$bus.$off('show-create-list-modal');
  },

  methods: {
    show() {
      this.visible = true;
      this.resetForm();
    },

    close() {
      this.visible = false;
    },
    
    resetForm() {
        this.form = { name: '', description: '', isPublic: false };
    },

    async createList() {
      const userEmail = localStorage.getItem('email')?.replace(/['"]+/g, '');
      if (!userEmail) { 
          alert('Debes iniciar sesión.');
          return;
      }

      this.loading = true;
      try {
        const response = await fetch(`${this.tursoBackendUrl}/lists`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userEmail,
                name: this.form.name,
                description: this.form.description,
                isPublic: this.form.isPublic
            })
        });

        if (response.ok) {
            const data = await response.json();
            this.$bus.$emit('lists-updated');
            if (data && data.list) {
                this.$bus.$emit('new-list-created', data.list);
            } else if (data && data.id) {
               this.$bus.$emit('new-list-created', data);
            }
            this.close();
            this.$bus.$emit('show-my-lists-modal');
        } else {
            alert('Error al crear la lista');
        }
      } catch (error) {
        console.error('Error creating list:', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.modalOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1003;
  padding: 1rem;
}

.modalWrapper {
  width: 100%;
  max-width: 500px;
}

.modalContent {
  background: linear-gradient(135deg, rgba(6, 47, 64, 0.98) 0%, rgba(10, 30, 40, 0.99) 100%);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 28' width='56' height='28'%3E%3Cpath fill='%237ed2e3' fill-opacity='0.1' d='M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0zm-5.43 2.71c1.13-.72 2.3-1.37 3.54-1.93a19.98 19.98 0 0 0-32.76 0c1.23.56 2.41 1.2 3.54 1.93a15.98 15.98 0 0 1 25.68 0zm-4.67 3.78c.94-.95 1.96-1.83 3.03-2.63a13.98 13.98 0 0 0-22.4 0c1.07.8 2.09 1.68 3.03 2.63a9.99 9.99 0 0 1 16.34 0z'%3E%3C/path%3E%3C/svg%3E");
  box-shadow: 0 12px 40px 0 rgba(31, 104, 135, 0.6);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 16px;
  border: 1px solid rgba(127, 219, 241, 0.3);
  width: 100%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
}

.modalHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h2 {
    font-size: 2rem;
    color: #8BE9FD;
    margin: 0;
    flex: 1;
    text-align: center;
  }
}

.closeButton {
  background: none;
  border: none;
  font-size: 2.4rem;
  color: #fff;
  cursor: pointer;
  line-height: 1;
  &:hover { color: #8BE9FD; }
}

.modalBody {
  padding: 2rem;
}

.formGroup {
    margin-bottom: 2rem;
    
    label {
        display: block;
        color: #8F989E;
        margin-bottom: 0.8rem;
        font-size: 1.4rem;
    }
    
    input[type="text"], textarea {
        width: 100%;
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        padding: 1rem;
        color: #fff;
        font-size: 1.6rem;
        
        &:focus {
            border-color: #8BE9FD;
            outline: none;
        }
    }
}

.checkboxLabel {
    display: flex;
    align-items: center;
    cursor: pointer;
    
    input {
        margin-right: 1rem;
        transform: scale(1.5);
    }
    
    .labelText {
        color: #fff;
        font-size: 1.6rem;
    }
}

.hint {
    margin-top: 0.5rem;
    color: #5d666b;
    font-size: 1.2rem;
}

.charCount {
    display: block;
    text-align: right;
    font-size: 1.1rem;
    color: #5d666b;
    margin-top: 0.4rem;
    transition: color 0.3s;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
}

.cancelBtn {
    background: transparent;
    border: none;
    color: #aaa;
    font-size: 1.4rem;
    padding: 1rem 2rem;
    cursor: pointer;
    
    &:hover { color: #fff; }
}

.createBtn {
    background: #8BE9FD;
    color: #000;
    border: none;
    padding: 1rem 2.5rem;
    border-radius: 8px;
    font-size: 1.4rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover:not(:disabled) {
        background: #7bd3e5;
        transform: translateY(-1px);
    }
    
    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
}
</style>

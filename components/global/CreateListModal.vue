<template>
  <div v-if="visible" :class="$style.modalOverlay" @click.self="close">
    <div :class="$style.modalWrapper">
      <div :class="$style.modalContent">
        <div :class="$style.modalHeader">
          <h2>Create New List</h2>
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
                   <label for="listName">Name</label>
                   <input type="text" id="listName" v-model="form.name" required placeholder="e.g. Best Sci-Fi 2024" maxlength="90" />
                   <span :class="$style.charCount">{{ 90 - form.name.length }} remaining</span>
               </div>
               
               <div :class="$style.formGroup">
                   <label for="listDesc">Description (Optional)</label>
                   <textarea id="listDesc" v-model="form.description" rows="3" placeholder="What's this list about?" maxlength="180"></textarea>
                   <span :class="$style.charCount">{{ 180 - form.description.length }} remaining</span>
               </div>

               <div :class="$style.formGroup">
                   <label :class="$style.checkboxLabel">
                       <input type="checkbox" v-model="form.isPublic" />
                       <span :class="$style.labelText">Make Public?</span>
                   </label>
                   <p :class="$style.hint">Public lists can be shared via a unique URL.</p>
               </div>

               <div :class="$style.actions">
                   <button type="button" @click="close" :class="$style.cancelBtn">Cancel</button>
                   <button type="submit" :class="$style.createBtn" :disabled="loading">
                       {{ loading ? 'Creating...' : 'Create List' }}
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
      validationError: null,
      pendingItemToAdd: null,
      form: {
          name: '',
          description: '',
          isPublic: false
      },
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
    show(item = null) {
      this.visible = true;
      this.pendingItemToAdd = item;
      this.resetForm();
    },

    close() {
      this.visible = false;
      this.pendingItemToAdd = null;
    },
    
    resetForm() {
        this.form = { name: '', description: '', isPublic: false };
    },

    async createList() {
      const userEmail = localStorage.getItem('email')?.replace(/['"]+/g, '');
      if (!userEmail) { 
          alert('You must be logged in.');
          return;
      }

      this.loading = true;
      let ownerName = localStorage.getItem('name');
      
      if (!ownerName && userEmail) {
          try {
             const supabase = useSupabaseClient();
             
             const { data: authData } = await supabase
               .from('auth_user')
               .select('first_name')
               .eq('email', userEmail)
               .single();
               
             if (authData && authData.first_name) {
                 ownerName = authData.first_name;
             } else {
                 const { data: userData } = await supabase
                   .from('user_data')
                   .select('first_name')
                   .eq('email', userEmail)
                   .single();
                   
                 if (userData && userData.first_name) {
                     ownerName = userData.first_name;
                 }
             }
             
             if (ownerName) {
                 localStorage.setItem('name', ownerName);
             } else {
                 ownerName = userEmail.split('@')[0];
             }
          } catch (e) {
              console.error('Error fetching name from Supabase:', e);
              ownerName = userEmail.split('@')[0];
          }
      }

      try {
        const response = await fetch(`${this.tursoBackendUrl}/lists`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userEmail,
                name: this.form.name,
                description: this.form.description,
                isPublic: this.form.isPublic,
                ownerName
            })
        });

        if (response.ok) {
            const data = await response.json();
            this.$bus.$emit('lists-updated');
            
            const newList = data.list || data;
            this.$bus.$emit('new-list-created', newList);

            const itemToPass = this.pendingItemToAdd;
            this.close();
            if (itemToPass) {
                 this.$bus.$emit('show-add-to-list-modal', itemToPass, newList.id);
            } else {
                 this.$bus.$emit('show-my-lists-modal', { keepContext: true });
            }
        } else {
            alert('Failed to create list');
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
  background: rgba(3, 4, 6, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
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
  position: relative;
  background: rgba(3, 4, 6, 0.85);
  background-image:
    radial-gradient(circle at 15% 20%, rgba(31, 84, 103, 0.18), transparent 35%),
    radial-gradient(circle at 85% 80%, rgba(139, 233, 253, 0.08), transparent 30%);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(31, 84, 103, 0.5),
    inset 0 0 24px rgba(139, 233, 253, 0.04);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 20px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
}

.modalContent::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #8BE9FD, #1F5467, transparent);
  opacity: 0.8;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  pointer-events: none;
  z-index: 2;
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

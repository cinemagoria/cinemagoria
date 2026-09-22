<template>
  <div v-if="visible" :class="$style.overlay" @click.self="close">
    <div :class="$style.modal" role="dialog" aria-modal="true" aria-labelledby="create-list-title">
      <button type="button" @click="close" :class="$style.close" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 18 18 6M6 6l12 12"/></svg>
      </button>

      <h2 id="create-list-title" :class="$style.title">Create new list</h2>
      <p :class="$style.lead">Group movies and TV shows into a collection of your own.</p>

      <form @submit.prevent="createList" :class="$style.form">
        <div :class="$style.field">
          <label for="listName" :class="$style.label">
            <span>Name</span>
            <span :class="[$style.count, { [$style.countLow]: 90 - form.name.length < 10 }]">{{ 90 - form.name.length }}</span>
          </label>
          <input id="listName" type="text" v-model="form.name" :class="$style.input" required maxlength="90" autocomplete="off" placeholder="e.g. Best Sci-Fi 2024" />
        </div>

        <div :class="$style.field">
          <label for="listDesc" :class="$style.label">
            <span>Description <em :class="$style.optional">optional</em></span>
            <span :class="[$style.count, { [$style.countLow]: 180 - form.description.length < 10 }]">{{ 180 - form.description.length }}</span>
          </label>
          <textarea id="listDesc" v-model="form.description" rows="3" maxlength="180" :class="[$style.input, $style.textarea]" placeholder="What's this list about?"></textarea>
        </div>

        <label :class="$style.switchRow">
          <span :class="$style.switchText">
            <span :class="$style.switchTitle">Public list</span>
            <span :class="$style.switchHint">Anyone with the link can view it.</span>
          </span>
          <input type="checkbox" v-model="form.isPublic" :class="$style.switchInput" />
          <span :class="$style.switch" aria-hidden="true"></span>
        </label>

        <div :class="$style.actions">
          <button type="button" @click="close" :class="$style.btnGhost">Cancel</button>
          <button type="submit" :class="$style.btnPrimary" :disabled="loading || !form.name.trim()">
            {{ loading ? 'Creating…' : 'Create list' }}
          </button>
        </div>
      </form>
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
$cyan: #8BE9FD;
$teal: #1F5467;
$muted: #a0aab2;

.overlay {
  position: fixed;
  inset: 0;
  z-index: 1003;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(3, 4, 6, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.modal {
  position: relative;
  width: 100%;
  max-width: 440px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  padding: 30px 26px 24px;
  border-radius: 20px;
  background: rgba(3, 4, 6, 0.9);
  background-image:
    radial-gradient(circle at 15% 20%, rgba($teal, 0.2), transparent 35%),
    radial-gradient(circle at 85% 80%, rgba($cyan, 0.08), transparent 30%);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba($teal, 0.5),
    inset 0 0 24px rgba($cyan, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-sizing: border-box;
  color: rgba(255, 255, 255, 0.86);
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  animation: floatIn 0.45s cubic-bezier(0.16, 1, 0.3, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, $cyan, $teal, transparent);
    opacity: 0.8;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }
}

@keyframes floatIn {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.close {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #e6ebf0;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    width: 20px;
    height: 20px;
    display: block;
  }

  &:hover {
    background: rgba(255, 95, 95, 0.18);
    border-color: rgba(255, 95, 95, 0.5);
    color: #ff7e7e;
  }
}

.title {
  margin: 0 0 6px;
  padding-right: 40px;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.3px;
  color: #fff;
  text-shadow: 0 0 20px rgba($cyan, 0.25);
}

.lead {
  margin: 0 0 22px;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.5;
  color: $muted;
}

.form {
  display: block;
}

.field {
  margin-bottom: 16px;
}

.label {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: #e0e6ed;
}

.optional {
  margin-left: 4px;
  font-style: normal;
  font-weight: 400;
  color: rgba(160, 170, 178, 0.7);
}

.count {
  font-size: 11px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: rgba(160, 170, 178, 0.6);
  transition: color 0.2s ease;
}

.countLow {
  color: #ffb86c;
}

.input {
  width: 100%;
  padding: 10px 13px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba($cyan, 0.2);
  color: #fff;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &::placeholder {
    color: rgba(160, 170, 178, 0.45);
  }

  &:focus {
    border-color: rgba($cyan, 0.6);
    box-shadow: 0 0 0 3px rgba($cyan, 0.12);
    background: rgba(0, 0, 0, 0.4);
  }
}

.textarea {
  min-height: 80px;
  line-height: 1.5;
  resize: vertical;
}

.switchRow {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 4px 0 22px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba($cyan, 0.12);
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;

  &:hover {
    border-color: rgba($cyan, 0.3);
    background: rgba(0, 0, 0, 0.35);
  }
}

.switchText {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.switchTitle {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.switchHint {
  font-size: 12px;
  font-weight: 300;
  color: $muted;
}

.switchInput {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.switch {
  position: relative;
  flex-shrink: 0;
  width: 42px;
  height: 24px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: background 0.25s ease, border-color 0.25s ease;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background 0.25s ease;
  }
}

.switchInput:checked + .switch {
  background: linear-gradient(135deg, $teal, $cyan);
  border-color: rgba($cyan, 0.5);

  &::after {
    transform: translateX(18px);
    background: #03242C;
  }
}

.switchInput:focus-visible + .switch {
  box-shadow: 0 0 0 3px rgba($cyan, 0.25);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btnPrimary,
.btnGhost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 22px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btnPrimary {
  background: linear-gradient(135deg, $teal, $cyan);
  border: 1px solid rgba($cyan, 0.5);
  color: #03242C;
  box-shadow: 0 4px 16px rgba($cyan, 0.18);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba($cyan, 0.28);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}

.btnGhost {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: $muted;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }
}

@media (max-width: 480px) {
  .overlay {
    padding: 12px;
  }

  .modal {
    padding: 26px 18px 20px;
  }

  .actions {
    flex-direction: column-reverse;
  }

  .btnPrimary,
  .btnGhost {
    width: 100%;
  }
}
</style>

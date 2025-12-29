<template>
  <div class="lists-page">
    <UserNav />
    
    <main class="main-content">
      <h1 class="title-primary">Colecciones</h1>
      
      <div class="toolbar-section" :class="{ 'justify-center': !shouldShowFilter }">
        <button @click="openCreateModal" class="create-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Crear Nueva Colección
        </button>

        <div v-if="shouldShowFilter" class="filter-switch-container">
            <div class="segmented-control">
                <input type="radio" id="filter-all" value="all" v-model="filterMode">
                <label for="filter-all">Todos</label>
                
                <input type="radio" id="filter-private" value="private" v-model="filterMode">
                <label for="filter-private">Privadas</label>
                
                <input type="radio" id="filter-public" value="public" v-model="filterMode">
                <label for="filter-public">Públicas</label>
                
                <div class="glider" :class="filterMode"></div>
            </div>
        </div>
      </div>

      <div v-if="loading" class="loading-state">
        <Loader />
      </div>

      <div v-else-if="filteredLists.length === 0" class="empty-state">
        <div v-if="imageLoading" class="empty-icon placeholder-loader">
          <Loader :size="40" color="#8BE9FD" />
        </div>
        <img 
          v-show="!imageLoading"
          src="/empty-list-placeholder.webp" 
          alt="No lists" 
          class="empty-icon" 
          @load="imageLoading = false"
        />
        <h3 v-if="lists.length === 0">Aún no has creado ninguna lista</h3>
        <h3 v-else>No se encontraron listas {{ filterMode === 'private' ? 'privadas' : 'públicas' }}</h3>
        <p v-if="lists.length === 0">Crea tus propias colecciones de películas y series.</p>
      </div>

      <div v-else class="lists-grid">
        <div 
          v-for="list in filteredLists" 
          :key="list.id" 
          class="list-card"
          @click="editingListId !== list.id && $router.push(`/lists/${list.slug}`)"
          :class="{ 'is-editing': editingListId === list.id }"
        >
          <div class="card-cover">
             <div v-if="list.item_count > 0" class="dynamic-cover-grid">
                <div v-for="i in 4" :key="i" class="grid-cell">
                    <img 
                      v-if="list.cover_images && list.cover_images[i-1]" 
                      :src="resolvePoster(list.cover_images[i-1])" 
                      @error="handleImgError"
                      class="cover-img" 
                      alt="Cover"
                    />
                    <div v-else class="plus-placeholder">
                        <img src="/plus_placeholder.webp" class="plus-icon" alt="+" />
                    </div>
                </div>
             </div>
             <div v-else class="empty-cover">
               <img src="/empty-list-placeholder.webp" alt="Empty List" class="placeholder-img-match-modal" />
             </div>
             
             <div v-if="editingListId !== list.id" class="privacy-badge">
                <span v-if="list.is_public" title="Pública">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </span>
                <span v-else title="Privada">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
             </div>
          </div>
          
          <div class="card-info">
             <template v-if="editingListId === list.id">
                 <div class="edit-form-container" @click.stop>
                     <input 
                        v-model="editForm.name" 
                        class="edit-input"
                        placeholder="Nombre de la lista"
                        @keyup.enter="saveEdit" 
                        autoFocus
                    />
                     <div class="privacy-toggle" @click.stop="editForm.is_public = !editForm.is_public">
                         <div class="privacy-option">
                             <span :class="{ 'privacy-active': !editForm.is_public }">Privada</span>
                             <div class="toggle-switch">
                                 <div class="toggle-knob" :class="{ 'toggle-on': editForm.is_public }"></div>
                             </div>
                             <span :class="{ 'privacy-active': editForm.is_public }">Pública</span>
                         </div>
                     </div>
                     <div class="edit-actions">
                         <button @click.stop="cancelEdit" class="cancel-btn">Cancelar</button>
                         <button @click.stop="saveEdit" class="save-btn">Guardar</button>
                     </div>
                 </div>
             </template>
             <template v-else>
                <div class="info-row">
                    <h3 class="list-name">{{ list.name }}</h3>
                    <span class="item-count">{{ list.item_count || 0 }} elementos</span>
                </div>
                <div class="action-buttons">
                    <button @click.stop="startEdit(list)" class="action-btn edit-btn">Editar</button>
                    <button @click.stop="deleteList(list)" class="action-btn delete-btn">Borrar</button>
                </div>
             </template>
          </div>
        </div>
      </div>
      
      <!-- Undo Banner -->
      <transition name="slide-up">
        <div v-if="undoList" class="undo-banner">
          <div class="undo-content">
              <span>Colección "{{ undoList.name }}" borrada</span>
              <button @click="undoDelete" class="undo-btn">Deshacer</button>
          </div>
          <div class="timer-line"></div>
        </div>
      </transition>
    </main>
  </div>
</template>

<script>
import UserNav from '@/components/global/UserNav';
import Loader from '@/components/Loader';

export default {
  components: {
    UserNav,
    Loader
  },
  
  data() {
    return {
      lists: [],
      loading: true,
      imageLoading: true,
      userEmail: '',
      filterMode: 'all',
      editingListId: null,
      editForm: {
          name: '',
          is_public: false
      },
      undoList: null,
      undoTimer: null,
      deletedListIndex: -1
    };
  },

  computed: {
    tursoBackendUrl() {
      return this.$config.public.tursoBackendUrl;
    },
    filteredLists() {
        if (this.filterMode === 'all') return this.lists;
        if (this.filterMode === 'private') return this.lists.filter(l => !l.is_public);
        if (this.filterMode === 'public') return this.lists.filter(l => l.is_public);
        return this.lists;
    },
    shouldShowFilter() {
        if (!this.lists || this.lists.length === 0) return false;
        const hasPrivate = this.lists.some(l => !l.is_public);
        const hasPublic = this.lists.some(l => l.is_public);
        return hasPrivate && hasPublic;
    }
  },

  async mounted() {
    const email = localStorage.getItem('email')?.replace(/['"]+/g, '');
    if (!email) {
      this.$router.push('/');
      return;
    }
    this.userEmail = email;
    await this.fetchLists();

    this.$bus.$on('lists-updated', this.fetchLists);
    this.$bus.$on('new-list-created', this.handleNewList);
    this.$bus.$on('show-my-lists-modal', this.checkIfRedirectNeeded);
  },

  beforeDestroy() {
    this.$bus.$off('lists-updated', this.fetchLists);
    this.$bus.$off('new-list-created', this.handleNewList);
    this.$bus.$off('show-my-lists-modal');
    
    if (this.undoList) {
        this.finalizeDelete();
    }
  },

  methods: {
    openCreateModal() {
      this.$bus.$emit('show-create-list-modal');
    },
    
    checkIfRedirectNeeded() {
        // Optional safety check placeholder
    },

    async handleNewList() {
        await this.fetchLists();
    },

    async fetchLists() {
      this.loading = true;
      try {
        const response = await fetch(`${this.tursoBackendUrl}/lists/user/${encodeURIComponent(this.userEmail)}`);
        if (response.ok) {
           const data = await response.json();
           const rawLists = data.lists || [];
           
           const hydratedLists = await Promise.all(rawLists.map(async (list) => {
               let validCovers = (list.cover_images || []).filter(url => url && typeof url === 'string' && url.trim().length > 0);
               
               if (validCovers.length < 4 && list.item_count > validCovers.length && (!list.items || list.items.length === 0)) {
                   try {
                        const detailsRes = await fetch(`${this.tursoBackendUrl}/lists/${list.slug}?userEmail=${encodeURIComponent(this.userEmail)}`);
                        if (detailsRes.ok) {
                            const detailsData = await detailsRes.json();
                            if (detailsData.items && Array.isArray(detailsData.items)) {
                                validCovers = detailsData.items
                                    .map(item => item.poster_url || item.poster_path)
                                    .filter(url => url && typeof url === 'string' && url.trim().length > 0)
                                    .slice(0, 4);
                            }
                        }
                   } catch (err) {
                       console.error("Error al hidratar las portadas de la lista", err);
                   }
               } else if (list.items && Array.isArray(list.items)) {
                     validCovers = list.items
                        .map(item => item.poster_url || item.poster_path)
                        .filter(url => url && typeof url === 'string' && url.trim().length > 0)
                        .slice(0, 4);
               }

               return { ...list, cover_images: validCovers };
           }));

           this.lists = hydratedLists;
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },

    resolvePoster(path) {
        if (!path) return '/empty-list-placeholder.webp';
        if (path.startsWith('http') || path.startsWith('//')) return path;
        return `https://image.tmdb.org/t/p/w500${path.startsWith('/') ? '' : '/'}${path}`;
    },

    handleImgError(e) {
        e.target.src = '/plus_placeholder.webp';
    },

    startEdit(list) {
        if (this.undoList) this.finalizeDelete();
        this.editingListId = list.id;
        this.editForm = {
            name: list.name,
            is_public: !!list.is_public
        };
    },
    
    cancelEdit() {
        this.editingListId = null;
        this.editForm = { name: '', is_public: false };
    },
    
    async saveEdit() {
        if (!this.editForm.name.trim()) return;
        
        try {
            const listId = this.editingListId;
            const updatedData = {
                name: this.editForm.name,
                is_public: this.editForm.is_public
            };
            
            const response = await fetch(`${this.tursoBackendUrl}/lists/${listId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userEmail: this.userEmail,
                    ...updatedData
                })
            });
            
            if (response.ok) {
                const listIndex = this.lists.findIndex(l => l.id === listId);
                if (listIndex !== -1) {
                    this.lists[listIndex] = { ...this.lists[listIndex], ...updatedData };
                }
                this.cancelEdit();
            }
        } catch (e) {
            console.error('Error updating list:', e);
        }
    },
    
    deleteList(list) {
        if (this.undoList) {
            this.finalizeDelete();
        }
        
        this.deletedListIndex = this.lists.findIndex(l => l.id === list.id);
        this.undoList = list;
        this.lists = this.lists.filter(l => l.id !== list.id);
        
        this.undoTimer = setTimeout(() => {
            this.finalizeDelete();
        }, 4000);
    },
    
    undoDelete() {
        if (!this.undoList) return;
        
        if (this.undoTimer) {
            clearTimeout(this.undoTimer);
            this.undoTimer = null;
        }
        
        if (this.deletedListIndex !== -1) {
            this.lists.splice(this.deletedListIndex, 0, this.undoList);
        } else {
            this.lists.push(this.undoList);
        }
        
        this.undoList = null;
        this.deletedListIndex = -1;
    },
    
    async finalizeDelete() {
        if (!this.undoList) return;
        
        const listToDelete = this.undoList;
        this.undoList = null;
        this.deletedListIndex = -1;
        if (this.undoTimer) clearTimeout(this.undoTimer);
        
        try {
            await fetch(`${this.tursoBackendUrl}/lists/${listToDelete.id}?userEmail=${encodeURIComponent(this.userEmail)}`, {
                method: 'DELETE'
            });
        } catch (e) {
            console.error('Error finalizing delete:', e);
        }
    }
  }
};
</script>

<style scoped lang="scss">
@use '~/assets/css/utilities/variables' as *;

.lists-page {
  min-height: 100vh;
  padding-bottom: 5rem;
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 4rem;
  
  @media (max-width: 768px) {
    padding: 1rem 2rem;
  }
}

.title-primary {
  font-size: 3.2rem;
  color: #8BE9FD;
  font-weight: 700;
  margin: 2rem 0 5rem;
  text-align: center;
}

.toolbar-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
    flex-wrap: wrap;
    gap: 1.5rem;

    @media (max-width: 600px) {
        flex-direction: column;
        justify-content: center;
        gap: 2rem;

        .create-btn {
            order: 2;
        }

        .filter-switch-container {
            order: 1;
        }
    }

    &.justify-center {
        justify-content: center;
    }
}

.segmented-control {
    position: relative;
    display: flex;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px; 
    padding: 4px;
    height: 40px;
    align-items: center;
    min-width: 300px;
}

.segmented-control input[type="radio"] {
    display: none;
}

.segmented-control label {
    position: relative;
    z-index: 2;
    flex: 1;
    text-align: center;
    font-size: 1.4rem;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    transition: color 0.3s;
    font-weight: 500;
    line-height: 32px;
    white-space: nowrap;
}

.segmented-control input:checked + label {
    color: #000;
}

.segmented-control .glider {
    position: absolute;
    top: 4px;
    left: 4px;
    height: calc(100% - 8px);
    width: calc((100% - 8px) / 3);
    background: #8BE9FD;
    border-radius: 16px;
    z-index: 1;
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.segmented-control .glider.all { transform: translateX(0); }
.segmented-control .glider.private { transform: translateX(100%); }
.segmented-control .glider.public { transform: translateX(200%); }


.create-btn {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: #8BE9FD;
  color: #000;
  border: none;
  padding: 1rem 2rem;
  border-radius: 15px;
  font-weight: 600;
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #73cde0;
    transform: translateY(-2px);
  }
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0 5rem;
  text-align: center;
}

.empty-icon {
    height: 250px;
    border-radius: 15px;
    margin-bottom: 2rem;
    border: #8BE9FD solid 1px;
}

.placeholder-loader {
    width: 448px;
    max-width: 90vw;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: center;
    align-items: center;
}

.empty-state h3 {
  font-size: 2rem;
  color: #fff;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #888;
  font-size: 1.6rem;
  margin-bottom: 3rem;
}

.create-btn-large {
  @extend .create-btn;
  padding: 1.5rem 3rem;
  font-size: 1.6rem;
}

.lists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2.5rem;
}

.list-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(139, 233, 253, 0.5);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    
    .list-name {
        color: #8BE9FD;
    }
  }
  
  &.is-editing {
      transform: none !important;
      border-color: #8BE9FD;
      cursor: default;
  }
}

.card-cover {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background: #111;
}

.empty-cover {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0b0b0b; 
  
  .placeholder-img-match-modal {
    width: 60%;
    height: 60%;
    object-fit: contain;
    opacity: 1;
  }
}

.dynamic-cover-grid {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.grid-cell {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  
  .cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .plus-placeholder {
    width: 100%;
    height: 100%;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .plus-icon {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 1;
  }
}

.privacy-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    border: 1px solid rgba(255,255,255,0.1);
}

.card-info {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.info-row {
  margin-bottom: 1rem;
}

.list-name {
  font-size: 1.6rem;
  color: #fff;
  margin: 0 0 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s;
}

.item-count {
  font-size: 1.3rem;
  color: #888;
}

.action-buttons {
    display: flex;
    gap: 1rem;
    margin-top: auto;
}

.action-btn {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 15px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid transparent; 
}

.delete-btn {
  background: rgba(255, 0, 0, 0.15);
  color: #ff6b6b;
  border: 1px solid rgba(255, 0, 0, 0.3);

  &:hover {
    background: rgba(255, 0, 0, 0.3);
    border-color: rgba(255, 0, 0, 0.5);
    transform: translateY(-1px);
    color: #ff6b6b;
  }
}

.edit-btn {
  background: rgba(139, 233, 253, 0.15);
  color: #8BE9FD;
  border: 1px solid rgba(139, 233, 253, 0.3);

  &:hover {
    background: rgba(139, 233, 253, 0.3);
    border-color: #8BE9FD;
    transform: translateY(-1px);
    color: #8BE9FD;
  }
}

.edit-form-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.edit-input {
    width: 100%;
    background: rgba(0,0,0,0.3);
    border: 1px solid #8BE9FD;
    padding: 0.5rem;
    color: #fff;
    border-radius: 4px;
    font-size: 1.4rem;
    
    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(139, 233, 253, 0.2);
    }
}

.privacy-toggle {
    cursor: pointer;
}

.privacy-option {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.3rem;
    color: #888;
}

.privacy-active {
    color: #fff;
    font-weight: 600;
}

.toggle-switch {
    width: 36px;
    height: 20px;
    background: #333;
    border-radius: 20px;
    position: relative;
    transition: background 0.3s;
}

.toggle-knob {
    width: 16px;
    height: 16px;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: transform 0.3s;
}

.toggle-knob.toggle-on {
     transform: translateX(16px);
     background: #8BE9FD;
}

.edit-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.save-btn, .cancel-btn {
    flex: 1;
    font-size: 13px;
    font-weight: 600;
    padding: 8px 0;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 15px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid transparent;
}

.save-btn {
    background: rgba(139, 233, 253, 0.15);
    color: #8BE9FD;
    border: 1px solid rgba(139, 233, 253, 0.3);
    
    &:hover {
        background: rgba(139, 233, 253, 0.3);
        border-color: #8BE9FD;
        transform: translateY(-1px);
        color: #8BE9FD;
    }
}

.cancel-btn {
    background: rgba(255, 0, 0, 0.15);
    color: #ff6b6b;
    border: 1px solid rgba(255, 0, 0, 0.3);
    
    &:hover {
        background: rgba(255, 0, 0, 0.3);
        border-color: rgba(255, 0, 0, 0.5);
        transform: translateY(-1px);
        color: #ff6b6b;
    }
}

.undo-banner {
    position: fixed;
    bottom: 15vh;
    left: 50%;
    transform: translateX(-50%);
    background: #000;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 1rem 2rem;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    min-width: 300px;
}

.undo-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 1.4rem;
    gap: 1.5rem;
    
    span {
        flex: 1;
        min-width: 0;
        word-wrap: break-word;
        line-height: 1.4;
    }
}

.undo-btn {
    background: #8BE9FD;
    color: #000;
    border: none;
    padding: 0.5rem 1.6rem;
    border-radius: 15px;
    font-weight: 600;
    cursor: pointer;
    font-size: 1.2rem;
    flex-shrink: 0;
    
    &:hover {
        background: #73cde0;
    }
}

.timer-line {
    height: 3px;
    background: #8BE9FD;
    width: 100%;
    animation: undo-timer 4s linear forwards;
}

@keyframes undo-timer {
    from { width: 100%; }
    to { width: 0%; }
}

.slide-up-enter-active, .slide-up-leave-active {
    transition: all 0.3s ease;
}

.slide-up-enter, .slide-up-leave-to {
    transform: translate(-50%, 100%);
    opacity: 0;
}


</style>
<template>
  <div class="lists-page">
    <UserNav />

    <main class="main-content">
      <header class="page-hero">
        <h1 class="page-title">Colecciones</h1>
        <p class="page-subtitle">Organiza tus películas y series favoritas en colecciones personalizadas.</p>
      </header>

      <div v-if="loading" class="loader-container">
        <Loader :size="60" />
      </div>

      <div v-else-if="lists.length === 0" class="state-card">
        <div class="state-visual">
          <div v-if="imageLoading" class="state-visual-loader">
            <Loader :size="40" color="#8BE9FD" />
          </div>
          <img v-show="!imageLoading" src="/placeholders/empty-list-placeholder.webp" alt="" class="state-image" @load="imageLoading = false" />
        </div>
        <h3>Aún no has creado ninguna colección</h3>
        <p>Crea tus propias colecciones de películas y series.</p>
        <button type="button" @click="openCreateModal" class="primary-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          Crear mi primera colección
        </button>
      </div>

      <section v-else class="list-panel">
        <div class="panel-toolbar">
          <div v-if="shouldShowFilter" class="seg-control" role="radiogroup" aria-label="Filtrar colecciones">
            <input type="radio" id="filter-all" value="all" v-model="filterMode">
            <label for="filter-all">Todas</label>
            <input type="radio" id="filter-private" value="private" v-model="filterMode">
            <label for="filter-private">Privadas</label>
            <input type="radio" id="filter-public" value="public" v-model="filterMode">
            <label for="filter-public">Públicas</label>
            <span class="seg-glider" :class="filterMode" aria-hidden="true"></span>
          </div>
          <span v-else class="panel-count">{{ lists.length }} {{ lists.length === 1 ? 'colección' : 'colecciones' }}</span>

          <button type="button" @click="openCreateModal" class="primary-btn create-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            <span>Crear nueva colección</span>
          </button>
        </div>

        <div v-if="filteredLists.length === 0" class="state-card inset">
          <h3>No se encontraron colecciones {{ filterMode === 'private' ? 'privadas' : 'públicas' }}</h3>
          <p>Cambia el filtro para ver el resto de tus colecciones.</p>
        </div>

        <div v-else class="lists-grid">
          <article
            v-for="list in filteredLists"
            :key="list.id"
            class="list-card"
            :class="{ 'is-editing': editingListId === list.id }"
            @click="editingListId !== list.id && $router.push(`/lists/${list.slug}`)">
            <div class="card-cover">
              <div v-if="list.item_count > 0 && list.cover_images && list.cover_images.length > 0" class="cover-grid">
                <div v-for="i in 4" :key="i" class="cover-cell">
                  <img v-if="list.cover_images[i - 1]" :src="resolvePoster(list.cover_images[i - 1])" @error="handleImgError" class="cover-img" alt="" />
                  <img v-else src="/placeholders/plus_placeholder.webp" class="cover-plus" alt="" />
                </div>
              </div>
              <div v-else class="cover-empty">
                <img src="/placeholders/empty-list-placeholder.webp" class="cover-empty-img" alt="" />
              </div>

              <span class="privacy-badge" :class="{ 'is-public': list.is_public }">
                <svg v-if="list.is_public" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span class="privacy-label">{{ list.is_public ? 'Pública' : 'Privada' }}</span>
              </span>

              <div v-if="editingListId !== list.id" class="card-actions">
                <button type="button" @click.stop="startEdit(list)" class="icon-btn" aria-label="Editar colección" title="Editar">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                </button>
                <button type="button" @click.stop="deleteList(list)" class="icon-btn danger" aria-label="Eliminar colección" title="Eliminar">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                </button>
              </div>
            </div>

            <div class="card-body">
              <div v-if="editingListId === list.id" class="edit-form" @click.stop>
                <input v-model="editForm.name" class="field-input" placeholder="Nombre de la colección" @keyup.enter="saveEdit" @keyup.esc="cancelEdit" autoFocus />
                <textarea v-model="editForm.description" class="field-input field-textarea" placeholder="Descripción" rows="2"></textarea>
                <label class="seg-switch">
                  <input type="checkbox" v-model="editForm.is_public">
                  <span>Privada</span>
                  <span>Pública</span>
                </label>
                <div class="edit-actions">
                  <button type="button" @click.stop="cancelEdit" class="btn-ghost">Cancelar</button>
                  <button type="button" @click.stop="saveEdit" class="btn-primary" :disabled="!editForm.name || !editForm.name.trim()">Guardar</button>
                </div>
              </div>

              <template v-else>
                <h3 class="list-name">{{ list.name }}</h3>
                <p v-if="list.description" class="list-desc">{{ list.description }}</p>
                <span class="item-count">{{ list.item_count || 0 }} {{ list.item_count === 1 ? 'elemento' : 'elementos' }}</span>
              </template>
            </div>
          </article>
        </div>
      </section>

      <transition name="slide-up">
        <div v-if="undoList" class="undo-banner" role="status">
          <span class="undo-text">Colección &ldquo;{{ undoList.name }}&rdquo; borrada</span>
          <button type="button" @click="undoDelete" class="undo-btn">Deshacer</button>
          <span class="timer-line"></span>
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
          description: '',
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
                       console.error("Error al hidratar las portadas de la colección", err);
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
        e.target.src = '/placeholders/plus_placeholder.webp';
    },

    startEdit(list) {
        if (this.undoList) this.finalizeDelete();
        this.editingListId = list.id;
        this.editForm = {
            name: list.name,
            description: list.description || '',
            is_public: !!list.is_public
        };
    },
    
    cancelEdit() {
        this.editingListId = null;
        this.editForm = { name: '', description: '', is_public: false };
    },
    
    async saveEdit() {
        if (!this.editForm.name.trim()) return;
        
        try {
            const listId = this.editingListId;
            const updatedData = {
                name: this.editForm.name,
                description: this.editForm.description,
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
$cyan: #8BE9FD;
$teal: #1F5467;
$muted: #a0aab2;
$ease-out: cubic-bezier(0.16, 1, 0.3, 1);

.lists-page {
  min-height: 100vh;
  padding-bottom: 5rem;
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: rgba(255, 255, 255, 0.86);
}

.main-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--page-header-space-top) 32px 40px;

  @media (max-width: 600px) {
    padding: var(--page-header-space-top) 12px 32px;
  }
}

.page-hero {
  margin-bottom: var(--page-header-space-bottom);
}

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 360px;
  padding: 48px 24px;
  text-align: center;
  background: rgba(3, 4, 6, 0.6);
  border: 1px solid rgba($cyan, 0.16);
  border-radius: 18px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #fff;
  }

  p {
    margin: 4px 0 18px;
    font-size: 14px;
    font-weight: 300;
    color: $muted;
  }

  &.inset {
    min-height: 260px;
    background: transparent;
    border: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;

    p {
      margin-bottom: 0;
    }
  }
}

.state-visual {
  position: relative;
  width: 220px;
  max-width: 80vw;
  aspect-ratio: 16 / 9;
  margin-bottom: 18px;
  overflow: hidden;
  border-radius: 14px;
  background: #000;
  box-shadow: 0 0 0 1px rgba($cyan, 0.2);
}

.state-visual-loader {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.state-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.primary-btn,
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 10px;
  background: linear-gradient(135deg, $teal, $cyan);
  border: 1px solid rgba($cyan, 0.5);
  color: #03242C;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba($cyan, 0.18);
  transition: all 0.2s ease;

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba($cyan, 0.28);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 10px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: $muted;
  font-size: 13.5px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }
}

.list-panel {
  background: rgba(3, 4, 6, 0.6);
  background-image:
    radial-gradient(circle at 12% 0%, rgba($teal, 0.18), transparent 45%),
    radial-gradient(circle at 90% 100%, rgba($cyan, 0.05), transparent 40%);
  border: 1px solid rgba($cyan, 0.16);
  border-radius: 20px;
  padding: 16px 18px 22px;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);

  @media (max-width: 600px) {
    padding: 12px 10px 16px;
    border-radius: 16px;
  }
}

.panel-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  padding: 4px 4px 14px;
  margin-bottom: 18px;
  border-bottom: 1px solid rgba($cyan, 0.12);
}

.panel-count {
  font-size: 14px;
  font-weight: 600;
  color: #8F989E;
}

.create-btn {
  padding: 9px 18px;

  @media (max-width: 600px) {
    span {
      display: none;
    }

    padding: 9px 12px;
  }
}

.seg-control {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 4px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba($cyan, 0.18);
  user-select: none;

  input {
    display: none;
  }

  label {
    position: relative;
    z-index: 1;
    min-width: 72px;
    padding: 7px 16px;
    border-radius: 999px;
    text-align: center;
    font-size: 13.5px;
    font-weight: 600;
    color: #8F989E;
    cursor: pointer;
    white-space: nowrap;
    transition: color 0.25s ease;
  }

  input:checked + label {
    color: #03242C;
  }

  @media (max-width: 600px) {
    label {
      min-width: 0;
      padding: 7px 12px;
      font-size: 12.5px;
    }
  }
}

.seg-glider {
  position: absolute;
  top: 4px;
  left: 4px;
  height: calc(100% - 8px);
  width: calc((100% - 8px) / 3);
  border-radius: 999px;
  background: linear-gradient(135deg, $teal, $cyan);
  box-shadow: 0 2px 10px rgba($cyan, 0.25);
  transition: transform 0.3s $ease-out;

  &.all { transform: translateX(0); }
  &.private { transform: translateX(100%); }
  &.public { transform: translateX(200%); }
}

.lists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 16px;
  align-items: start;

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
}

.list-card {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  cursor: pointer;
  transition: transform 0.3s $ease-out, border-color 0.2s ease, box-shadow 0.3s ease, background 0.2s ease;

  &:hover {
    border-color: rgba($cyan, 0.4);
    background: rgba($cyan, 0.04);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);

    .list-name {
      color: $cyan;
    }
  }

  &.is-editing {
    cursor: default;
    border-color: rgba($cyan, 0.5);
    background: rgba($cyan, 0.04);
    box-shadow: 0 0 0 1px rgba($cyan, 0.2);

    .list-name {
      color: #fff;
    }
  }
}

@media (hover: hover) and (pointer: fine) {
  .list-card:hover {
    transform: translateY(-3px);
  }

  .list-card.is-editing:hover {
    transform: none;
  }
}

.card-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: #000;
}

.cover-grid {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1px;
}

.cover-cell {
  position: relative;
  overflow: hidden;
  background: #000;
}

.cover-img,
.cover-plus,
.cover-empty-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-plus {
  opacity: 0.85;
}

.cover-empty {
  position: absolute;
  inset: 0;
}

.privacy-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px 4px 7px;
  border-radius: 999px;
  background: rgba(3, 4, 6, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cfd6dc;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2px;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  svg {
    width: 11px;
    height: 11px;
  }

  &.is-public {
    color: $cyan;
    border-color: rgba($cyan, 0.35);
  }

  @media (max-width: 600px) {
    padding: 5px 6px;

    .privacy-label {
      display: none;
    }
  }
}

.card-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  display: flex;
  gap: 6px;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 9px;
  background: rgba(3, 4, 6, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #e6ebf0;
  cursor: pointer;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  transition: all 0.2s ease;

  svg {
    width: 15px;
    height: 15px;
  }

  &:hover {
    color: $cyan;
    border-color: rgba($cyan, 0.5);
    background: rgba($cyan, 0.14);
  }

  &.danger:hover {
    color: #ff7e7e;
    border-color: rgba(255, 95, 95, 0.55);
    background: rgba(255, 95, 95, 0.16);
  }
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px 14px;
}

.list-name {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.3;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
}

.list-desc {
  margin: 0;
  font-size: 12.5px;
  font-weight: 300;
  line-height: 1.45;
  color: $muted;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-count {
  margin-top: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #8F989E;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-input {
  width: 100%;
  padding: 8px 11px;
  border-radius: 9px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba($cyan, 0.2);
  color: #fff;
  font-size: 13.5px;
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

.field-textarea {
  min-height: 56px;
  line-height: 1.45;
  resize: vertical;
}

.seg-switch {
  position: relative;
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  padding: 3px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba($cyan, 0.18);
  cursor: pointer;
  user-select: none;
  font-size: 12px;

  input {
    display: none;
  }

  span {
    padding: 4px 12px;
    border-radius: 999px;
    color: #8F989E;
    font-weight: 600;
    transition: all 0.25s ease;
  }

  input:not(:checked) ~ span:first-of-type,
  input:checked ~ span:last-of-type {
    background: linear-gradient(135deg, $teal, $cyan);
    color: #03242C;
    box-shadow: 0 2px 10px rgba($cyan, 0.25);
  }
}

.edit-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;

  .btn-primary {
    padding: 8px 16px;
    font-size: 13.5px;
  }
}

@media (max-width: 600px) {
  .list-card.is-editing {
    grid-column: 1 / -1;
    flex-direction: row;
    align-items: stretch;

    .card-cover {
      flex: 0 0 96px;
      width: 96px;
      aspect-ratio: auto;
    }

    .card-body {
      flex: 1;
      min-width: 0;
    }
  }

  .seg-switch {
    align-self: stretch;

    span {
      flex: 1;
      text-align: center;
    }
  }

  .edit-actions {
    .btn-ghost,
    .btn-primary {
      flex: 1;
    }
  }
}

.undo-banner {
  position: fixed;
  bottom: 15vh;
  left: 50%;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: min(420px, calc(100vw - 32px));
  padding: 12px 12px 12px 18px;
  overflow: hidden;
  border-radius: 12px;
  background: rgba(3, 4, 6, 0.85);
  border: 1px solid rgba($cyan, 0.22);
  color: #cfd6dc;
  font-size: 14px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transform: translateX(-50%);
}

.undo-text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.undo-btn {
  flex-shrink: 0;
  padding: 5px 16px;
  border-radius: 999px;
  background: transparent;
  border: 1px solid rgba($cyan, 0.4);
  color: $cyan;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba($cyan, 0.12);
    border-color: $cyan;
  }
}

.timer-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, $teal, $cyan);
  transform-origin: left;
  animation: undo-countdown 4s linear forwards;
}

@keyframes undo-countdown {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-enter,
.slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 14px);
}
</style>

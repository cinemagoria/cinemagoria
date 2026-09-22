<template>
  <div v-if="visible" :class="$style.overlay" @click.self="close">
    <div :class="$style.modal" role="dialog" aria-modal="true" aria-labelledby="my-lists-title">
      <header :class="$style.head">
        <div :class="$style.headText">
          <h2 id="my-lists-title" :class="$style.title">{{ modalTitle }}</h2>
          <p v-if="modalSubtitle" :class="$style.subtitle">{{ modalSubtitle }}</p>
        </div>
        <button type="button" @click="close" :class="$style.close" aria-label="Cerrar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 18 18 6M6 6l12 12"/></svg>
        </button>
      </header>

      <div v-if="undoList" :class="$style.undo">
        <span :class="$style.undoText">Colección &ldquo;{{ undoList.name }}&rdquo; eliminada</span>
        <button type="button" @click="handleUndo" :class="$style.undoBtn">Deshacer</button>
        <span :class="$style.undoTimer"></span>
      </div>

      <div :class="$style.body">
        <div v-if="loading" :class="$style.loader">
          <Loader :size="44" color="#8BE9FD" />
        </div>

        <div v-else :class="$style.rows">
          <button type="button" :class="[$style.row, $style.createRow]" @click="openCreateModal">
            <span :class="[$style.cover, $style.coverCreate]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            </span>
            <span :class="$style.rowMain">
              <span :class="$style.rowName">Crear nueva colección</span>
              <span :class="$style.rowMeta">Empieza una colección desde cero</span>
            </span>
          </button>

          <div
            v-if="itemToAdd && !Array.isArray(itemsToAdd)"
            :class="[$style.row, $style.selectable, { [$style.selected]: watchlistSelected }]"
            role="checkbox"
            :aria-checked="watchlistSelected ? 'true' : 'false'"
            tabindex="0"
            @click="toggleWatchlist"
            @keydown.enter.prevent="toggleWatchlist"
            @keydown.space.prevent="toggleWatchlist">
            <span :class="[$style.cover, $style.coverIcon]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 21 12 16 6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/></svg>
            </span>
            <span :class="$style.rowMain">
              <span :class="$style.rowName">Mi Lista</span>
              <span :class="$style.rowMeta">Favoritos</span>
            </span>
            <span :class="$style.check" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>
            </span>
          </div>

          <div
            v-for="list in lists"
            :key="list.id"
            :class="[$style.row, { [$style.selectable]: itemToAdd || itemsToAdd, [$style.selected]: isListSelected(list.id), [$style.editing]: editingListId === list.id }]"
            :role="itemToAdd || itemsToAdd ? 'checkbox' : 'link'"
            :aria-checked="itemToAdd || itemsToAdd ? (isListSelected(list.id) ? 'true' : 'false') : null"
            tabindex="0"
            @click="goToList(list)"
            @keydown.enter.self.prevent="goToList(list)"
            @keydown.space.self.prevent="goToList(list)">
            <span :class="$style.cover">
              <template v-if="list.item_count > 0 && list.cover_images && list.cover_images.length > 0">
                <span v-for="i in 4" :key="i" :class="$style.cell">
                  <img v-if="list.cover_images[i - 1]" :src="resolvePoster(list.cover_images[i - 1])" @error="handleImgError" :class="$style.cellImg" alt="" />
                  <img v-else src="/placeholders/plus_placeholder.webp" :class="$style.cellPlus" alt="" />
                </span>
              </template>
              <img v-else src="/placeholders/empty-list-placeholder.webp" :class="$style.coverEmpty" alt="" />
            </span>

            <div v-if="editingListId === list.id" :class="$style.editForm" @click.stop>
              <input v-model="editForm.name" :class="$style.editInput" placeholder="Nombre de la colección" @keyup.enter="saveEdit" @keyup.esc="cancelEdit" autoFocus />
              <div :class="$style.editRow">
                <label :class="$style.privacySwitch">
                  <input type="checkbox" v-model="editForm.is_public" />
                  <span>Privada</span>
                  <span>Pública</span>
                </label>
                <div :class="$style.editActions">
                  <button type="button" @click.stop="cancelEdit" :class="$style.btnGhost">Cancelar</button>
                  <button type="button" @click.stop="saveEdit" :class="$style.btnPrimary" :disabled="!editForm.name || !editForm.name.trim()">Guardar</button>
                </div>
              </div>
            </div>

            <template v-else>
              <span :class="$style.rowMain">
                <span :class="$style.rowName">{{ list.name }}</span>
                <span :class="$style.rowMeta">
                  <span>{{ list.item_count || 0 }} {{ list.item_count === 1 ? 'elemento' : 'elementos' }}</span>
                  <span :class="$style.metaDot" aria-hidden="true">&middot;</span>
                  <span :class="$style.privacy">
                    <svg v-if="list.is_public" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <span :class="$style.privacyLabel">{{ list.is_public ? 'Pública' : 'Privada' }}</span>
                  </span>
                </span>
              </span>

              <span v-if="itemToAdd || itemsToAdd" :class="$style.check" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>
              </span>

              <span v-else :class="$style.rowActions">
                <button type="button" @click.stop="startEdit(list)" :class="$style.iconBtn" aria-label="Editar colección" title="Editar">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                </button>
                <button type="button" @click.stop="deleteList(list)" :class="[$style.iconBtn, $style.iconBtnDanger]" aria-label="Eliminar colección" title="Eliminar">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                </button>
                <svg :class="$style.chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>
              </span>
            </template>
          </div>
        </div>

        <p v-if="!loading && lists.length === 0 && !itemToAdd && !itemsToAdd" :class="$style.empty">Comienza creando tu primera colección.</p>
      </div>

      <footer v-if="itemToAdd || Array.isArray(itemsToAdd)" :class="$style.foot">
        <button type="button" @click="close" :class="$style.btnGhost">Cancelar</button>
        <button type="button" @click="confirmBulkAdd" :class="$style.btnPrimary" :disabled="Array.isArray(itemsToAdd) && selectedListIds.length === 0">
          Listo ({{ selectedCount }})
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
import Loader from '@/components/Loader';


import { mapItemToDbPayload } from '~/utils/itemMapper';

export default {
  components: {
    Loader
  },
  data() {
    return {
      visible: false,
      loading: false,
      lists: [],
      itemToAdd: null,
      itemsToAdd: null,
      addedLists: [],
      selectedListIds: [],
      inWatchlist: false,
      watchlistSelected: false,
      undoList: null,
      undoTimer: null,
      editingListId: null,
      editForm: {
        id: null,
        name: '',
        navState: 'lists',
        mode: 'add'
      }
    };
  },
  
  computed: {
    tursoBackendUrl() {
      return this.$config.public.tursoBackendUrl;
    },
    modalTitle() {
        if (Array.isArray(this.itemsToAdd)) return `Añadir Elementos`;
        return this.itemToAdd ? 'Gestionar Colecciones' : 'Mis Colecciones';
    },
    modalSubtitle() {
        if (this.itemToAdd) {
             const name = this.itemToAdd.nameForDb || this.itemToAdd.title || this.itemToAdd.name || 'Elemento';
             return `Añadir / Eliminar "${name}" de las colecciones`;
        }
        if (Array.isArray(this.itemsToAdd)) {
             const action = this.mode === 'move' ? 'mover' : 'añadir';
             return `Selecciona colecciones para ${action} ${this.itemsToAdd.length} elementos`;
        }
        return null;
    },
    selectedCount() {
      if (Array.isArray(this.itemsToAdd)) {
        return this.selectedListIds.length;
      }
      return this.selectedListIds.length + (this.watchlistSelected ? 1 : 0);
    }
  },

  mounted() {
    this.$bus.$on('show-my-lists-modal', this.show);
    this.$bus.$on('show-add-to-list-modal', this.showAddMode);
    this.$bus.$on('lists-updated', this.fetchLists);
    this.$bus.$on('new-list-created', this.handleNewList);
  },

  beforeDestroy() {
    this.$bus.$off('show-my-lists-modal');
    this.$bus.$off('show-add-to-list-modal');
    this.$bus.$off('lists-updated');
    this.$bus.$off('new-list-created');
    this.finalizeDelete(); 
  },

  methods: {
    async show(options = {}) {
      if (!options || !options.keepContext) {
          this.itemToAdd = null;
          this.itemsToAdd = null;
      }
      this.visible = true;
      await this.fetchLists();
    },

    async showAddMode(input, preSelectedListId = null, mode = 'add') {
        this.mode = mode;
        if (Array.isArray(input)) {
             this.itemsToAdd = input;
             this.itemToAdd = null;
             this.selectedListIds = [];
        } else {
             this.itemToAdd = input;
             this.itemsToAdd = null;
        }

        this.visible = true;
        this.loading = true;
        
        const promises = [this.fetchLists()];
        if (this.itemToAdd) promises.push(this.fetchMembership());
        
        await Promise.all(promises);
        
        if (this.itemToAdd) {
             this.selectedListIds = [...this.addedLists];
             if (preSelectedListId && !this.selectedListIds.includes(preSelectedListId)) {
                 this.selectedListIds.push(preSelectedListId);
             }
        } else if (preSelectedListId) {
             if (!this.selectedListIds.includes(preSelectedListId)) {
                 this.selectedListIds.push(preSelectedListId);
             }
        }

        this.loading = false;
    },

    close() {
      this.finalizeDelete(); 
      this.visible = false;
      this.itemToAdd = null;
      this.itemsToAdd = null;
      this.addedLists = [];
      this.selectedListIds = [];
      this.inWatchlist = false;
    },
    
    resolvePoster(path) {
        if (!path) return '/empty-list-placeholder.webp';
        if (path.startsWith('http') || path.startsWith('//')) return path;
        return `https://image.tmdb.org/t/p/w500${path.startsWith('/') ? '' : '/'}${path}`;
    },

    handleImgError(e) {
        e.target.src = '/placeholders/plus_placeholder.webp';
    },
    
    openCreateModal() {
        this.$bus.$emit('show-create-list-modal', this.itemToAdd);
    },

    isListSelected(listId) {
        return this.selectedListIds.includes(listId);
    },

    goToList(list) {
        if (this.itemToAdd || this.itemsToAdd) {
             if (this.selectedListIds.includes(list.id)) {
                 this.selectedListIds = this.selectedListIds.filter(id => id !== list.id);
             } else {
                 this.selectedListIds.push(list.id);
             }
        } else {
            this.$router.push(`/lists/${list.slug}`);
            this.close();
        }
    },

    async confirmBulkAdd() {
        if (this.itemsToAdd) {
             if (!this.selectedListIds.length) return;
             this.loading = true;
             const userEmail = localStorage.getItem('email')?.replace(/['"]+/g, '');
             
             try {
                 const mappedItems = this.itemsToAdd
                     .filter(raw => raw && (raw.idForDb || raw.id))
                     .map(raw => ({ ...raw, ...mapItemToDbPayload(raw), topLevel: true }));
                 
                 const promises = this.selectedListIds.map(listId => 
                     fetch(`${this.tursoBackendUrl}/lists/${listId}/items`, {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify({ items: mappedItems, userEmail })
                     })
                 );
     
                 await Promise.all(promises);
                 this.$bus.$emit('bulk-items-added', { 
                     elementCount: mappedItems.length, 
                     listCount: this.selectedListIds.length 
                 });
                 this.$bus.$emit('lists-updated');
                 this.close();
             } catch (e) {
                 console.error("Bulk add failed", e);
                 alert('Error al añadir elementos a las colecciones');
             } finally {
                 this.loading = false;
             }
        } else if (this.itemToAdd) {
             this.loading = true;
             const userEmail = localStorage.getItem('email')?.replace(/['"]+/g, '');
             const item = { ...mapItemToDbPayload(this.itemToAdd), topLevel: true };

             const listsToAdd = this.selectedListIds.filter(id => !this.addedLists.includes(id));
             const listsToRemove = this.addedLists.filter(id => !this.selectedListIds.includes(id));
             
             try {
                 const promises = [];
                 
                 if (this.watchlistSelected !== this.inWatchlist) {
                     if (this.watchlistSelected) {
                         promises.push(
                             fetch(`${this.tursoBackendUrl}/favorites`, {
                                 method: 'POST',
                                 headers: { 'Content-Type': 'application/json' },
                                 body: JSON.stringify({ item, userEmail })
                             })
                         );
                     } else {
                     const url = `${this.tursoBackendUrl}/favorites/${encodeURIComponent(userEmail)}/${item.typeForDb}/${item.idForDb}`;
                     promises.push(fetch(url, { method: 'DELETE' }));
                     }
                 }

                 listsToAdd.forEach(listId => {
                     promises.push(
                         fetch(`${this.tursoBackendUrl}/lists/${listId}/items`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ item, userEmail })
                        })
                     );
                 });
                 
                 listsToRemove.forEach(listId => {
                      let url = `${this.tursoBackendUrl}/lists/${listId}/items?itemId=${item.idForDb}&itemType=${item.typeForDb}`;
                      if (userEmail) url += `&userEmail=${encodeURIComponent(userEmail)}`;
                      promises.push(fetch(url, { method: 'DELETE' }));
                 });

                 await Promise.all(promises);
                 
                 this.$bus.$emit('lists-updated');
                 if (this.watchlistSelected !== this.inWatchlist) {
                     this.$bus.$emit('favorites-updated');
                 }
                 
                 if (listsToAdd.length > 0 || (this.watchlistSelected && !this.inWatchlist)) {
                      this.$bus.$emit('bulk-items-added', { 
                         elementCount: 1, 
                         listCount: listsToAdd.length + (this.watchlistSelected && !this.inWatchlist ? 1 : 0)
                     });
                 }
                 
                 this.close();
             } catch (e) {
                 console.error("Single item update failed", e);
                 alert('Error al actualizar colecciones');
             } finally {
                 this.loading = false;
             }
        }
    },

    async handleNewList(newList) {
        await this.fetchLists();
        if (this.itemToAdd || this.itemsToAdd) {
             if (!this.selectedListIds.includes(newList.id)) {
                 this.selectedListIds.push(newList.id);
             }
        }
    },
    
    async fetchMembership() {
         if (!this.itemToAdd) return;
         
         this.addedLists = [];
         this.inWatchlist = false;
         this.watchlistSelected = false;

         const userEmail = localStorage.getItem('email')?.replace(/['"]+/g, '');
         if (!userEmail) return;

         try {
             let type = 'movie';
             let id = null;

             if (this.itemToAdd.idForDb) {
                 id = this.itemToAdd.idForDb;
                 type = this.itemToAdd.typeForDb || 'movie';
             } else {
                 id = this.itemToAdd.id;
                 type = this.itemToAdd.title ? 'movie' : 'tv';
                 if (this.itemToAdd.media_type) type = this.itemToAdd.media_type;
             }
             
             if (!id) return;
             
             const normalizedType = (type === 'movie' || type === 'movies') ? 'movie' : 'tv';
             
             const url = `${this.tursoBackendUrl}/membership/${encodeURIComponent(userEmail)}/${normalizedType}/${id}`;
             const response = await fetch(url);
             if (response.ok) {
                 const data = await response.json();
                 if (data.lists) {
                     this.addedLists = data.lists.map(l => l.id);
                     this.selectedListIds = [...this.addedLists];
                 }
                 if (data.inWatchlist) {
                     this.inWatchlist = true;
                     this.watchlistSelected = true;
                 }
             }
         } catch (e) {
             console.error('Error fetching membership:', e);
         }
    },
    
    toggleWatchlist() {
        this.watchlistSelected = !this.watchlistSelected;
    },

    async fetchLists() {
      const userEmail = localStorage.getItem('email')?.replace(/['"]+/g, '');
      if (!userEmail) return;

      this.loading = true;
      try {
        const url = `${this.tursoBackendUrl}/lists/user/${encodeURIComponent(userEmail)}`;
        const response = await fetch(url);
        if (response.ok) {
           const data = await response.json();
           const rawLists = data.lists || [];
           
           const hydratedLists = await Promise.all(rawLists.map(async (list) => {
               let validCovers = (list.cover_images || []).filter(url => url && typeof url === 'string' && url.trim().length > 0);
               
               if (validCovers.length < 4 && list.item_count > validCovers.length && (!list.items || list.items.length === 0)) {
                   try {
                        const detailsRes = await fetch(`${this.tursoBackendUrl}/lists/${list.slug}?userEmail=${encodeURIComponent(userEmail)}`);
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
      } catch (error) {
        console.error('Error fetching lists:', error);
      } finally {
        this.loading = false;
      }
    },

    async deleteList(list) {
        if (this.undoList) await this.finalizeDelete(); 
        this.lists = this.lists.filter(l => l.id !== list.id);
        this.undoList = list;
        this.startUndoTimer();
    },

    startUndoTimer() {
        if (this.undoTimer) clearTimeout(this.undoTimer);
        this.undoTimer = setTimeout(() => {
            this.finalizeDelete();
        }, 7000);
    },

    async finalizeDelete() {
        if (!this.undoList) return;
        const listToDelete = this.undoList;
        this.undoList = null; 
        if (this.undoTimer) clearTimeout(this.undoTimer);
        const userEmail = import.meta.client ? localStorage.getItem('email')?.replace(/['"]+/g, '') : null;
        
        try {
            const url = new URL(`${this.tursoBackendUrl}/lists/${listToDelete.id}`);
            if (userEmail) url.searchParams.append('userEmail', userEmail);
            await fetch(url.toString(), { method: 'DELETE' });

            const currentSlug = this.$route.params.slug;
            if (currentSlug && listToDelete.slug && (currentSlug === listToDelete.slug || decodeURIComponent(currentSlug) === listToDelete.slug)) {
                 await this.$router.push('/lists');
            }
            
            this.$bus.$emit('lists-updated');
        } catch(e) { console.error(e); }
    },

    handleUndo() {
        if (this.undoTimer) clearTimeout(this.undoTimer);
        if (this.undoList) {
            this.lists.unshift(this.undoList);
            this.undoList = null;
        }
    },

    startEdit(list) {
        this.editingListId = list.id;
        this.editForm = {
            id: list.id,
            name: list.name,
            is_public: !!list.is_public
        };
    },

    cancelEdit() {
        this.editingListId = null;
    },

    async saveEdit() {
        if (!this.editForm.name || !this.editForm.name.trim()) return;

        const listIndex = this.lists.findIndex(l => l.id === this.editForm.id);
        if (listIndex === -1) return;

        const original = { ...this.lists[listIndex] };
        const updates = {
            name: this.editForm.name,
            is_public: this.editForm.is_public
        };

        this.lists[listIndex].name = updates.name;
        this.lists[listIndex].is_public = updates.is_public;

        this.editingListId = null;

        try {
            const userEmail = import.meta.client ? localStorage.getItem('email')?.replace(/['"]+/g, '') : null;
            await fetch(`${this.tursoBackendUrl}/lists/${this.editForm.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...updates, userEmail })
            });
            this.$bus.$emit('lists-updated');
        } catch(e) {
            console.error(e);
            this.lists[listIndex] = original;
        }
    }
  }
};
</script>

<style lang="scss" module>
$cyan: #8BE9FD;
$teal: #1F5467;
$muted: #a0aab2;
$ease-out: cubic-bezier(0.16, 1, 0.3, 1);

.overlay {
  position: fixed;
  inset: 0;
  z-index: 1002;
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
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 560px;
  max-height: calc(100vh - 40px);
  overflow: hidden;
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
  color: rgba(255, 255, 255, 0.86);
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  animation: floatIn 0.45s $ease-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    height: 3px;
    background: linear-gradient(90deg, transparent, $cyan, $teal, transparent);
    opacity: 0.8;
    pointer-events: none;
  }
}

@keyframes floatIn {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  padding: 26px 22px 16px;
}

.headText {
  min-width: 0;
}

.title {
  margin: 0;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.3px;
  color: #fff;
  text-shadow: 0 0 20px rgba($cyan, 0.25);
}

.subtitle {
  margin: 4px 0 0;
  font-size: 13.5px;
  font-weight: 300;
  line-height: 1.5;
  color: $muted;
}

.close {
  flex-shrink: 0;
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

.undo {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin: 0 22px 12px;
  padding: 10px 10px 10px 16px;
  overflow: hidden;
  border-radius: 12px;
  background: rgba(3, 4, 6, 0.75);
  border: 1px solid rgba($cyan, 0.22);
  font-size: 13.5px;
  color: #cfd6dc;
}

.undoText {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.undoBtn {
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

.undoTimer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, $teal, $cyan);
  transform-origin: left;
  animation: undoCountdown 7s linear forwards;
}

@keyframes undoCountdown {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

.body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 4px 22px 18px;
}

.loader {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  margin: 0;
  padding: 9px 12px 9px 9px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  color: inherit;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: rgba($cyan, 0.35);
    background: rgba($cyan, 0.05);
  }

  &:focus-visible {
    outline: 2px solid $cyan;
    outline-offset: 2px;
  }
}

.createRow {
  border-style: dashed;
  border-color: rgba($cyan, 0.3);
  background: transparent;

  .rowName {
    color: $cyan;
  }

  &:hover {
    border-color: $cyan;
    background: rgba($cyan, 0.06);
  }
}

.selected {
  border-color: rgba($cyan, 0.55);
  background: rgba($cyan, 0.08);
  box-shadow: 0 0 18px rgba($cyan, 0.08);

  &:hover {
    border-color: rgba($cyan, 0.7);
    background: rgba($cyan, 0.1);
  }
}

.editing {
  align-items: flex-start;
  cursor: default;
  border-color: rgba($cyan, 0.45);
  background: rgba($cyan, 0.04);

  &:hover {
    border-color: rgba($cyan, 0.45);
    background: rgba($cyan, 0.04);
  }
}

.cover {
  position: relative;
  flex-shrink: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1px;
  width: 64px;
  height: 64px;
  overflow: hidden;
  border-radius: 10px;
  background: #000;
  box-shadow: 0 0 0 1px rgba($cyan, 0.16);
}

.cell {
  position: relative;
  overflow: hidden;
  background: #000;
}

.cellImg,
.cellPlus,
.coverEmpty {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cellPlus {
  opacity: 0.85;
}

.coverEmpty {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
}

.coverCreate,
.coverIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: $cyan;
  background: rgba($cyan, 0.06);

  svg {
    width: 24px;
    height: 24px;
  }
}

.coverCreate {
  box-shadow: none;
  border: 1px dashed rgba($cyan, 0.4);
  background: transparent;
}

.rowMain {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.rowName {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rowMeta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 12.5px;
  color: #8F989E;
}

.metaDot {
  opacity: 0.5;
}

.privacy {
  display: inline-flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 12px;
    height: 12px;
  }
}

.check {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.22);
  color: transparent;
  transition: all 0.2s ease;

  svg {
    width: 14px;
    height: 14px;
  }
}

.selected .check {
  background: linear-gradient(135deg, $teal, $cyan);
  border-color: transparent;
  color: #03242C;
  box-shadow: 0 2px 10px rgba($cyan, 0.3);
}

.rowActions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.iconBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: $muted;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    color: $cyan;
    border-color: rgba($cyan, 0.45);
    background: rgba($cyan, 0.08);
  }
}

.iconBtnDanger:hover {
  color: #ff7e7e;
  border-color: rgba(255, 95, 95, 0.5);
  background: rgba(255, 95, 95, 0.12);
}

.chevron {
  width: 18px;
  height: 18px;
  margin-left: 2px;
  color: rgba(255, 255, 255, 0.3);
  transition: color 0.2s ease, transform 0.2s ease;
}

.row:hover .chevron {
  color: $cyan;
  transform: translateX(2px);
}

.editForm {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 2px;
}

.editInput {
  width: 100%;
  padding: 9px 12px;
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

.editRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.privacySwitch {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 3px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba($cyan, 0.18);
  cursor: pointer;
  user-select: none;
  font-size: 12.5px;

  input {
    display: none;
  }

  span {
    padding: 5px 13px;
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

.editActions {
  display: flex;
  gap: 8px;
}

.btnPrimary,
.btnGhost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 18px;
  border-radius: 10px;
  font-size: 13.5px;
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

.empty {
  margin: 0;
  padding: 26px 10px 10px;
  text-align: center;
  font-size: 14px;
  font-weight: 300;
  color: $muted;
}

.foot {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 22px 18px;
  border-top: 1px solid rgba($cyan, 0.12);
  background: rgba(0, 0, 0, 0.2);

  .btnPrimary,
  .btnGhost {
    padding: 10px 22px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .overlay {
    padding: 12px;
  }

  .modal {
    max-height: calc(100vh - 24px);
  }

  .head {
    padding: 22px 16px 14px;
  }

  .undo {
    margin: 0 16px 10px;
  }

  .body {
    padding: 4px 16px 16px;
  }

  .foot {
    padding: 12px 16px 16px;
  }

  .row {
    gap: 12px;
    padding: 8px 10px 8px 8px;
  }

  .cover {
    width: 56px;
    height: 56px;
  }

  .rowName {
    font-size: 14px;
  }

  .rowActions {
    gap: 4px;
  }

  .iconBtn {
    width: 30px;
    height: 30px;
  }

  .chevron {
    display: none;
  }

  .privacyLabel {
    display: none;
  }

  .editRow {
    flex-direction: column;
    align-items: stretch;
  }

  .editActions {
    justify-content: flex-end;
  }
}
</style>

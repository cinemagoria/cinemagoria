<template>
  <div v-if="visible" :class="$style.modalOverlay" @click.self="close">
    <div :class="$style.modalWrapper">
      <div :class="$style.modalContent">
        <div :class="$style.modalHeader">
          <div :class="$style.headerContent">
             <h2 class="title-primary">{{ modalTitle }}</h2>
             <p v-if="modalSubtitle" :class="$style.subtitle">{{ modalSubtitle }}</p>
          </div>
          <button @click="close" :class="$style.closeButton">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div v-if="loading" :class="$style.loader">
          <Loader :size="60" color="#8BE9FD" />
        </div>

        <div v-if="undoList" :class="$style.undoBarContainer">
           <div :class="$style.undoBar">
             <span>List "{{ undoList.name }}" deleted</span>
             <button @click="handleUndo" :class="$style.undoButton">UNDO</button>
           </div>
        </div>

        <div :class="$style.modalBody">
            <div :class="$style.grid">
              

                <div 
                  v-if="itemToAdd && !Array.isArray(itemsToAdd)"
                  :class="[$style.card, watchlistSelected ? $style.activeCard : '']"
                  @click="toggleWatchlist">
                  <div :class="$style.cardImage">
                     <div :class="$style.listIcon">
                       <img src="/empty-list-placeholder.webp" :class="$style.listPlaceholderImg" alt="Watchlist" style="object-fit: cover; opacity: 0.8;" />
                     </div>
                     <div v-if="watchlistSelected" :class="$style.addedIndicator">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                     </div>
                  </div>
                  <div :class="$style.cardContent">
                    <h4>Watchlist</h4>
                    <div :class="$style.meta">
                      <span>Favorites</span>
                    </div>
                  </div>
                </div>


                <div 
                  v-for="list in lists" 
                  :key="list.id"
                  :class="[$style.card, isListSelected(list.id) ? $style.activeCard : '']"
                  @click="goToList(list)">
                  <div :class="$style.cardImage">
                     <div v-if="list.item_count > 0" :class="$style.dynamicCoverGrid">
                        <div v-for="i in 4" :key="i" :class="$style.gridCell">
                            <img 
                              v-if="list.cover_images && list.cover_images[i-1]" 
                              :src="resolvePoster(list.cover_images[i-1])" 
                              @error="handleImgError"
                              :class="$style.coverImg" 
                              alt="Cover"
                            />
                            <div v-else :class="$style.plusPlaceholder">
                                <img src="/plus_placeholder.webp" :class="$style.plusIcon" alt="+" />
                            </div>
                        </div>
                     </div>
                     <div v-else :class="$style.listIcon">
                       <img src="/empty-list-placeholder.webp" :class="$style.listPlaceholderImg" alt="List placeholder" />
                     </div>
                     

                     <div v-if="isListSelected(list.id) && !Array.isArray(itemsToAdd)" :class="$style.addedIndicator">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                     </div>
                     <!-- Indicator for bulk mode -->
                     <div v-if="isListSelected(list.id) && Array.isArray(itemsToAdd)" :class="$style.addedIndicator">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                     </div>
                  </div>
                  <div :class="$style.cardContent">
                    <template v-if="editingListId === list.id">

                        <div :class="$style.editFormContainer">
                            <input 
                              v-model="editForm.name" 
                              :class="$style.editInput"
                              placeholder="List Name"
                              @keyup.enter="saveEdit" 
                              @click.stop
                              autoFocus
                            />
                            
                            <div :class="$style.privacyToggle" @click.stop="editForm.is_public = !editForm.is_public">
                               <div :class="$style.privacyOption">
                                   <span :class="!editForm.is_public ? $style.privacyActive : ''">Private</span>
                                   <div :class="$style.toggleSwitch">
                                       <div :class="[$style.toggleKnob, editForm.is_public ? $style.toggleOn : '']"></div>
                                   </div>
                                   <span :class="editForm.is_public ? $style.privacyActive : ''">Public</span>
                               </div>
                            </div>

                            <div :class="$style.editActions">
                                 <button @click.stop="cancelEdit" :class="$style.cancelBtn">Cancel</button>
                                 <button @click.stop="saveEdit" :class="$style.saveBtn">Save</button>
                            </div>
                        </div>
                    </template>
                    
                    <template v-else>
                        <h4>{{ list.name }}</h4>
                        <div :class="$style.meta">
                          <span>{{ list.item_count || 0 }} items</span>
                          <span v-if="list.is_public" title="Public">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                          </span>
                          <span v-else title="Private">
                               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                          </span>
                        </div>
                        <div v-if="!itemToAdd && !itemsToAdd" :class="$style.actionButtons">
                           <button @click.stop="startEdit(list)" :class="$style.editButton">Edit</button>
                           <button @click.stop="deleteList(list)" :class="$style.deleteButton">Delete</button>
                        </div>
                    </template>
                  </div>
                </div>
                

                 <div :class="[$style.card, $style.createCard]" @click="openCreateModal">
                    <div :class="$style.createContent">
                        <img src="/plus_placeholder.webp" :class="$style.createIcon" alt="+" />
                        <span :class="$style.createLabel">Create New List</span>
                    </div>
                 </div>
              </div>

              <div v-if="!loading && lists.length === 0 && !itemToAdd && !itemsToAdd" :class="$style.emptyState">
                 <p>Start curating by creating your first list.</p>
              </div>
          </div>
          
          <!-- Footer for Bulk & Single Mode -->
          <div v-if="itemToAdd || Array.isArray(itemsToAdd)" :class="$style.modalFooter">
              <button @click="close" :class="$style.footerCancelBtn">Cancel</button>
              <button @click="confirmBulkAdd" :class="$style.footerDoneBtn" :disabled="selectedListIds.length === 0">
                 Done ({{ selectedListIds.length }})
              </button>
          </div>
        </div>
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
        is_public: false
      }
    };
  },
  
  computed: {
    tursoBackendUrl() {
      return this.$config.public.tursoBackendUrl;
    },
    modalTitle() {
        if (Array.isArray(this.itemsToAdd)) return `Add Items`;
        return this.itemToAdd ? 'Manage Lists' : 'My Lists';
    },
    modalSubtitle() {
        if (this.itemToAdd) {
             const name = this.itemToAdd.nameForDb || this.itemToAdd.title || this.itemToAdd.name || 'Item';
             return `Add / Remove "${name}" from lists`;
        }
        if (Array.isArray(this.itemsToAdd)) {
             return `Select lists to add ${this.itemsToAdd.length} items to`;
        }
        return null;
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

    async showAddMode(input, preSelectedListId = null) {
        if (Array.isArray(input)) {
             this.itemsToAdd = input;
             this.itemToAdd = null;
             this.selectedListIds = [];
        } else {
             this.itemToAdd = input;
             this.itemsToAdd = null;
             this.selectedListIds = [];
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
        e.target.src = '/plus_placeholder.webp';
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
                 this.$bus.$emit('lists-updated');
                 this.$bus.$emit('bulk-items-added', { 
                     elementCount: mappedItems.length, 
                     listCount: this.selectedListIds.length 
                 });
                 this.close();
             } catch (e) {
                 console.error("Bulk add failed", e);
                 alert('Failed to add items to some lists');
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
                         let type = this.itemToAdd.title ? 'movie' : 'tv';
                         if (this.itemToAdd.media_type) type = this.itemToAdd.media_type;
                         type = (type === 'movie' || type === 'movies') ? 'movie' : 'tv';
                         
                         const url = `${this.tursoBackendUrl}/favorites/${encodeURIComponent(userEmail)}/${type}/${this.itemToAdd.id}`;
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
                 alert('Failed to update lists');
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
                       console.error("Failed to hydrate list covers", err);
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
  z-index: 1002;
  padding: 2rem;
}

.modalWrapper {
  width: 100%;
  max-width: 1200px;
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
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

  .modalHeader {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .headerContent {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-right: 2rem;
  }

  .modalHeader h2 {
    font-size: 2.4rem;
    color: #8BE9FD;
    margin: 0;
    text-align: center;
    line-height: 1.2;
  }
  
  .subtitle {
      font-size: 1.4rem;
      color: rgba(255, 255, 255, 0.7);
      margin-top: 0.5rem;
      text-align: center;
      font-weight: 300;
  }

.closeButton {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;

  &:hover {
    color: #8BE9FD;
  }
}

.modalBody {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 2rem;
}

.card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(139, 233, 253, 0.3);
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  }
}

.activeCard {
    border-color: #8BE9FD;
    box-shadow: 0 0 15px rgba(139, 233, 253, 0.2);
    background: rgba(139, 233, 253, 0.05);
}

.createCard {
    border: 2px dashed rgba(139, 233, 253, 0.3);
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 250px;
    
    &:hover {
        border-color: #8BE9FD;
        background: #000;
    }
}

.createContent {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #8BE9FD;
    font-weight: 600;
    
    .createIcon {
        width: 120px;
        height: 120px;
        object-fit: contain;
        margin-bottom: 1.5rem;
        opacity: 0.9;
        transition: transform 0.2s;
    }

    .createLabel {
        font-size: 1.8rem;
        text-align: center;
        line-height: 1.2;
    }

    &:hover .createIcon {
        transform: scale(1.1);
        opacity: 1;
    }
}

.cardImage {
  padding-top: 60%;
  position: relative;
  background: rgba(0,0,0,0.3);
}

.listIcon {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255,255,255,0.2);
    overflow: hidden;
}

.dynamicCoverGrid {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0; 
}

.gridCell {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #000; 
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0.5px solid rgba(139, 233, 253, 0.2); 
}

.coverImg {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.plusPlaceholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
}

.plusIcon {
    width: 50%; 
    height: 50%;
    object-fit: contain;
    opacity: 0.8;
}

.listPlaceholderImg {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.cardContent {
  padding: 1.5rem;
  
  h4 {
    color: #fff;
    margin: 0 0 0.5rem 0;
    font-size: 1.6rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #8F989E;
    font-size: 1.2rem;
    margin-bottom: 1rem;
}

.actionButtons {
    display: flex;
    gap: 0.8rem;
    margin-top: auto;
}

.editButton, .deleteButton {
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
}

.deleteButton {
  background: rgba(255, 0, 0, 0.15);
  color: #ff6b6b;
  border: 1px solid rgba(255, 0, 0, 0.3);

  &:hover {
    background: rgba(255, 0, 0, 0.3);
    border-color: rgba(255, 0, 0, 0.5);
    transform: translateY(-1px);
  }
}

.editButton {
  background: rgba(139, 233, 253, 0.15);
  color: #8BE9FD;
  border: 1px solid rgba(139, 233, 253, 0.3);

  &:hover {
    background: rgba(139, 233, 253, 0.3);
    border-color: #8BE9FD;
    transform: translateY(-1px);
  }
}

.editFormContainer {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 110px;
}

.editInput {
    background: rgba(0,0,0,0.4);
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 1.4rem;
    width: 100%;
    margin-bottom: 1rem;
    outline: none;
    
    &:focus {
        border-color: #8BE9FD;
    }
}

.privacyToggle {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    cursor: pointer;
}

.privacyOption {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.2rem;
    color: #666;
}

.privacyActive {
    color: #fff;
    font-weight: 600;
}

.toggleSwitch {
    width: 36px;
    height: 20px;
    background: rgba(255,255,255,0.1);
    border-radius: 20px;
    position: relative;
    transition: background 0.3s;
}

.toggleKnob {
    width: 16px;
    height: 16px;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: left 0.3s;
}

.toggleOn {
    left: 18px;
    background: #8BE9FD;
}

.editActions {
    display: flex;
    gap: 0.8rem;
    margin-top: auto;
}

.saveBtn, .cancelBtn {
    flex: 1;
    padding: 6px 0;
    border-radius: 6px;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: opacity 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
    
    &:hover { opacity: 0.9; }
}

.saveBtn {
    background: #8BE9FD;
    color: #000;
}

.cancelBtn {
    background: rgba(255,255,255,0.1);
    color: #aaa;
}

.emptyState {
  text-align: center;
  padding: 4rem;
  color: #aaa;
  font-size: 1.6rem;
}

.loader {
    display: flex;
    justify-content: center;
    padding: 4rem;
}

.undoBarContainer {
    padding: 0 2rem;
    margin-bottom: 1rem;
}

.undoBar {
  background: linear-gradient(90deg, rgba(139, 233, 253, 0.2) 0%, rgba(0, 136, 204, 0.2) 100%);
  border-bottom: 2px solid #8BE9FD;
  color: white;
  padding: 1.2rem 3rem;
  display: flex;
  position: relative;
  border-radius: 15px;
  justify-content: space-between;
  align-items: center;
  font-size: 1.4rem;
}

.undoButton {
  background: #8BE9FD;
  border: none;
  color: #000;
  padding: 0.6rem 1.6rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: #7DD4E8;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(139, 233, 253, 0.3);
  }
}

.addedIndicator {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    background: #8BE9FD;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    z-index: 2;
    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

.modalFooter {
    padding: 1.5rem 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    background: rgba(0, 0, 0, 0.2);
}

.footerCancelBtn {
    padding: 0.8rem 1.5rem;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: #fff;
    }
}

.footerDoneBtn {
    padding: 0.8rem 1.5rem;
    background: #8BE9FD;
    color: #000;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;

    &:hover {
        background: #A4F0FF;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(139, 233, 253, 0.3);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
}
</style>

<template>
  <div v-if="visible" :class="$style.modalOverlay" @click.self="close">
    <div :class="$style.modalWrapper">
      <div :class="$style.modalContent">
        <div :class="$style.modalHeader">
          <h2 class="title-primary">{{ modalTitle }}</h2>
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
              
              <!-- Watchlist Card (Only in Add/Manage Mode) -->
              <!-- Watchlist Card (Only in Add/Manage Mode - Single Item) -->
              <div 
                v-if="itemToAdd && !Array.isArray(itemsToAdd)"
                :class="[$style.card, inWatchlist ? $style.activeCard : '']"
                @click="toggleWatchlist">
                <div :class="$style.cardImage">
                   <div :class="$style.listIcon">
                     <img src="/empty-list-placeholder.webp" :class="$style.listPlaceholderImg" alt="Watchlist" style="object-fit: cover; opacity: 0.8;" />
                   </div>
                   <div v-if="inWatchlist" :class="$style.addedIndicator">
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

              <!-- Custom Lists -->
              <div 
                v-for="list in lists" 
                :key="list.id"
                :class="[$style.card, addedLists.includes(list.id) ? $style.activeCard : '']"
                @click="goToList(list)">
                <div :class="$style.cardImage">
                   <div v-if="list.item_count > 0" :class="$style.dynamicCoverGrid">
                      <div v-for="i in 4" :key="i" :class="$style.gridCell">
                          <img 
                            v-if="list.cover_images && list.cover_images[i-1]" 
                            :src="list.cover_images[i-1]" 
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
                   
                   <!-- Added Indicator -->
                   <div v-if="addedLists.includes(list.id) && !Array.isArray(itemsToAdd)" :class="$style.addedIndicator">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                   </div>
                </div>
                <div :class="$style.cardContent">
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
                  <button v-if="!itemToAdd" @click.stop="deleteList(list)" :class="$style.deleteButton">Delete</button>
                </div>
              </div>
              
              <!-- Create New Card -->
               <div :class="[$style.card, $style.createCard]" @click="openCreateModal">
                  <div :class="$style.createContent">
                      <img src="/plus_placeholder.webp" :class="$style.createIcon" alt="+" />
                      <span :class="$style.createLabel">Create New List</span>
                  </div>
               </div>
            </div>

            <div v-if="!loading && lists.length === 0 && !itemToAdd" :class="$style.emptyState">
               <p>Start curating by creating your first list.</p>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '@/components/Loader';

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
      itemsToAdd: null, // For bulk operations
      addedLists: [], // Track IDs of lists where item is present
      inWatchlist: false,
      undoList: null,
      undoTimer: null
    };
  },
  
  computed: {
    tursoBackendUrl() {
      return this.$config.public.tursoBackendUrl;
    },
    modalTitle() {
        if (Array.isArray(this.itemsToAdd)) return `Add ${this.itemsToAdd.length} Items to...`;
        return this.itemToAdd ? 'Manage Lists' : 'My Lists';
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
    async show() {
      this.itemToAdd = null;
      this.visible = true;
      await this.fetchLists();
    },

    async showAddMode(input) {
        if (Array.isArray(input)) {
             this.itemsToAdd = input;
             this.itemToAdd = null; // Ensure single mode is off
        } else {
             this.itemToAdd = input;
             this.itemsToAdd = null;
        }

        this.visible = true;
        this.loading = true;
        
        const promises = [this.fetchLists()];
        if (this.itemToAdd) promises.push(this.fetchMembership());
        
        await Promise.all(promises);
        this.loading = false;
    },

    close() {
      this.finalizeDelete(); 
      this.visible = false;
      this.itemToAdd = null;
      this.itemsToAdd = null;
      this.addedLists = [];
      this.inWatchlist = false;
    },
    
    openCreateModal() {
        this.$bus.$emit('show-create-list-modal');
    },

    goToList(list) {
        if (this.itemToAdd || this.itemsToAdd) {
            this.toggleListItem(list);
        } else {
            this.$router.push(`/lists/${list.slug}`);
            this.close();
        }
    },

    async fetchMembership() {
        if (!this.itemToAdd) return;
        const userEmail = localStorage.getItem('email')?.replace(/['"]+/g, '');
        if (!userEmail) return;

        const id = this.itemToAdd.idForDb || this.itemToAdd.id;
        const type = this.itemToAdd.typeForDb || (this.itemToAdd.title ? 'movie' : 'tv');

        try {
            const res = await fetch(`${this.tursoBackendUrl}/membership/${encodeURIComponent(userEmail)}/${type}/${id}`);
            if(res.ok) {
                const data = await res.json();
                this.inWatchlist = data.inWatchlist;
                this.addedLists = data.lists.map(l => l.id);
            }
        } catch(e) { console.error(e); }
    },

    async toggleWatchlist() {
        const userEmail = localStorage.getItem('email')?.replace(/['"]+/g, '');
        if (!userEmail || !this.itemToAdd) return;

        const wasIn = this.inWatchlist;
        // Optimistic
        this.inWatchlist = !wasIn;

        const item = {
           idForDb: this.itemToAdd.idForDb || this.itemToAdd.id,
           typeForDb: this.itemToAdd.typeForDb || (this.itemToAdd.title ? 'movie' : 'tv'),
           nameForDb: this.itemToAdd.nameForDb || this.itemToAdd.title || this.itemToAdd.name,
           posterForDb: this.itemToAdd.posterForDb || this.itemToAdd.poster_path,
           imdb_rating: this.itemToAdd.imdb_rating || this.itemToAdd.vote_average,
           imdb_votes: this.itemToAdd.imdb_votes || this.itemToAdd.vote_count,
           year_start: this.itemToAdd.yearStartForDb || (this.itemToAdd.release_date || this.itemToAdd.first_air_date || '').substr(0, 4),
           genres: this.itemToAdd.genresForDb || this.itemToAdd.genres
        };

        try {
            if (wasIn) {
                // Remove
                await fetch(`${this.tursoBackendUrl}/favorites/${encodeURIComponent(userEmail)}/${item.typeForDb}/${item.idForDb}`, { method: 'DELETE' });
            } else {
                // Add
                await fetch(`${this.tursoBackendUrl}/favorites`, {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ userEmail, item })
                });
            }
            this.$bus.$emit('favorites-updated');
            // If we are currently ON the watchlist page or list page, this might trigger refreshes, which is good.
        } catch(e) {
            console.error(e);
            this.inWatchlist = wasIn; // Revert
        }
    },

    async toggleListItem(list) {
         const listId = list.id;

         if (this.itemsToAdd && Array.isArray(this.itemsToAdd)) {
             // BULK ADD MODE
             try {
                // Prepare items for DB
                const mappedItems = this.itemsToAdd
                    .filter(raw => raw && (raw.idForDb || raw.id))
                    .map(raw => ({
                        ...raw, // Include all original props as fallback
                        idForDb: raw.idForDb || raw.id,
                        typeForDb: raw.typeForDb || (raw.title ? 'movie' : 'tv'),
                        nameForDb: raw.nameForDb || raw.title || raw.name,
                        posterForDb: raw.posterForDb || raw.poster_path,
                        imdb_votes: raw.imdb_votes || raw.vote_count,
                        imdb_rating: raw.imdb_rating || raw.vote_average,
                        starsForDb: raw.starsForDb || (raw.vote_average ? raw.vote_average * 10 : null),
                        yearStartForDb: raw.yearStartForDb || (raw.release_date || raw.first_air_date || '').substr(0, 4),
                        genres: raw.genresForDb || raw.genres,
                        topLevel: true 
                    }));

                await fetch(`${this.tursoBackendUrl}/lists/${listId}/items`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: mappedItems })
                });

                list.item_count = (list.item_count || 0) + mappedItems.length;
                this.$bus.$emit('lists-updated');
                this.close(); // Close after bulk add
             } catch(e) {
                 console.error(e);
                 alert('Failed to add items to list');
             }
             return;
         }

         // SINGLE ITEM MODE
         const isPresent = this.addedLists.includes(listId);

         // Optimistic Update
         if (isPresent) {
             this.addedLists = this.addedLists.filter(id => id !== listId);
             list.item_count = Math.max(0, (list.item_count || 0) - 1);
         } else {
             this.addedLists.push(listId);
             list.item_count = (list.item_count || 0) + 1;
         }

         const item = {
            idForDb: this.itemToAdd.idForDb || this.itemToAdd.id,
            typeForDb: this.itemToAdd.typeForDb || (this.itemToAdd.title ? 'movie' : 'tv'),
            nameForDb: this.itemToAdd.nameForDb || this.itemToAdd.title || this.itemToAdd.name,
            posterForDb: this.itemToAdd.posterForDb || this.itemToAdd.poster_path,
            imdb_votes: this.itemToAdd.imdb_votes || this.itemToAdd.imdbVotes || this.itemToAdd.vote_count,
            yearStartForDb: this.itemToAdd.yearStartForDb || (this.itemToAdd.release_date || this.itemToAdd.first_air_date || '').substr(0, 4),
            topLevel: true 
         };

         try {
             if (isPresent) {
                 // Remove
                 await fetch(`${this.tursoBackendUrl}/lists/${listId}/items?itemId=${item.idForDb}&itemType=${item.typeForDb}`, {
                     method: 'DELETE'
                 });
             } else {
                 // Add
                 const payload = { ...this.itemToAdd, ...item };
                 await fetch(`${this.tursoBackendUrl}/lists/${listId}/items`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ item: payload })
                });
             }
             this.$bus.$emit('lists-updated');
         } catch(e) {
             console.error(e);
             // Revert
             if (isPresent) this.addedLists.push(listId);
             else this.addedLists = this.addedLists.filter(id => id !== listId);
         }
    },

    async handleNewList(newList) {
        await this.fetchLists();
        if (this.itemToAdd) {
            // New lists are empty, add to it
            await this.toggleListItem(newList);
        }
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
           this.lists = data.lists || [];
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
        
        try {
            await fetch(`${this.tursoBackendUrl}/lists/${listToDelete.id}`, { method: 'DELETE' });
            this.$bus.$emit('lists-updated');
        } catch(e) { console.error(e); }
    },

    handleUndo() {
        if (this.undoTimer) clearTimeout(this.undoTimer);
        if (this.undoList) {
            this.lists.unshift(this.undoList);
            this.undoList = null;
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
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h2 {
    font-size: 2.4rem;
    color: #8BE9FD;
    margin: 0;
    flex: 1;
    text-align: center;
  }
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

.deleteButton {
  background: rgba(255, 0, 0, 0.2);
  color: #fff;
  border: 1px solid rgba(255, 0, 0, 0.4);
  font-size: 13px;
  font-weight: 600;
  padding: 10px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 30px;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: rgba(255, 0, 0, 0.4);
    border-color: rgba(255, 0, 0, 0.6);
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3);
  }
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
</style>

<template>
  <div class="card-actions" v-click-outside="close" @click.stop.prevent>
    <button class="trigger-btn" @click="toggle" :class="{ 'active': isOpen }">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>

    <transition name="fade">
      <div v-if="isOpen" class="dropdown-menu">
        
        <div v-if="view === 'main'" class="menu-view">
           <button class="menu-item" @click="openRate">
             <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
             </span> 
             Valorar
           </button>
           
           <button v-if="currentList" class="menu-item remove" @click="removeFromCurrent">
             <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
             </span> 
             Eliminar de {{ currentList.name }}
           </button>
           
           <div class="divider"></div>
           
           <button class="menu-item" @click="fetchListsAndSwitch">
             <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
             </span> 
             Gestionar Colecciones...
             <span class="arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
             </span>
           </button>
        </div>


        <div v-else-if="view === 'manage'" class="menu-view">
           <div class="menu-header">
              <button class="back-btn" @click="view = 'main'">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <span>Guardado en</span>
           </div>
           
           <div class="lists-container" v-if="!loadingLists">
              <label class="list-option">
                 <div class="checkbox">
                    <svg v-if="membership.inWatchlist" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                 </div>
                 <input type="checkbox" :checked="membership.inWatchlist" @change="toggleWatchlist" style="display:none;">
                 <span>Mi Lista</span>
              </label>
              
              <div class="divider"></div>
              
              <template v-if="userLists.length > 0">
                  <label v-for="list in userLists" :key="list.id" class="list-option">
                     <div class="checkbox">
                        <svg v-if="isInList(list.id)" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                     </div>
                     <input type="checkbox" :checked="isInList(list.id)" @change="toggleList(list)" style="display:none;">
                     <span>{{ list.name }}</span>
                  </label>
              </template>
              <div v-else class="empty-msg">Sin colecciones personalizadas</div>
           </div>
           <div v-else class="loader-mini">Cargando...</div>
        </div>

      </div>
    </transition>
  </div>
</template>

<script>
import { mapItemToDbPayload } from '~/utils/itemMapper';

export default {
  props: {
    item: { type: Object, required: true },
    currentList: { type: Object, default: null }
  },
  
  data() {
    return {
      isOpen: false,
      view: 'main',
      loadingLists: false,
      userLists: [],
      membership: { inWatchlist: false, lists: [] }
    };
  },
  
  directives: {
    'click-outside': {
      bind: function (el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
          if (!(el == event.target || el.contains(event.target))) {
            vnode.context[binding.expression](event);
          }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
      },
      unbind: function (el) {
        document.body.removeEventListener('click', el.clickOutsideEvent);
      }
    }
  },
  
  computed: {
    tursoBackendUrl() {
        return this.$config.public.tursoBackendUrl;
    },
    userEmail() {
        return localStorage.getItem('email');
    },
    itemType() { return this.item.media_type || (this.item.title ? 'movie' : 'tv'); },
    itemId() { return this.item.id; }
  },
  
  methods: {
    toggle() {
        this.isOpen = !this.isOpen;
        if (!this.isOpen) this.reset();
    },
    close() {
        this.isOpen = false;
        this.reset();
    },
    reset() {
        setTimeout(() => { this.view = 'main'; }, 200);
    },
    
    openRate() {
        this.$bus.$emit('show-rated-modal');
        this.$emit('rate', this.item);
        this.close();
    },
    
    async removeFromCurrent() {
        if (!this.currentList) return;
        this.$bus.$emit('remove-item-from-list', { list: this.currentList, item: this.item });
        this.close();
    },
    
    async fetchListsAndSwitch() {
        this.view = 'manage';
        this.loadingLists = true;
        await Promise.all([this.fetchUserLists(), this.fetchMembership()]);
        this.loadingLists = false;
    },
    
    async fetchUserLists() {
        if (!this.userEmail) return;
        try {
            const res = await fetch(`${this.tursoBackendUrl}/lists/user/${encodeURIComponent(this.userEmail)}`);
            if (res.ok) {
                const data = await res.json();
                this.userLists = data.lists || [];
            }
        } catch(e) { console.error(e); }
    },
    
    async fetchMembership() {
        if (!this.userEmail) return;
        try {
            const res = await fetch(`${this.tursoBackendUrl}/membership/${encodeURIComponent(this.userEmail)}/${this.itemType}/${this.itemId}`);
            if (res.ok) {
                this.membership = await res.json();
            }
        } catch(e) { console.error(e); }
    },
    
    isInList(listId) {
        return this.membership.lists.some(l => l.id === listId);
    },
    
    async toggleWatchlist() {
        const wasIn = this.membership.inWatchlist;
        this.membership.inWatchlist = !wasIn;
        
        try {
            if (wasIn) {
                await fetch(`${this.tursoBackendUrl}/favorites/${this.userEmail}/${this.itemType}/${this.itemId}`, { method: 'DELETE' });
            } else {
                this.$bus.$emit('toggle-favorite-request', this.item);
            }
            await this.fetchMembership();
        } catch(e) { console.error(e); }
    },
    
    async toggleList(list) {
        const isIn = this.isInList(list.id);
        
        try {
            if (isIn) {
                await fetch(`${this.tursoBackendUrl}/lists/${list.id}/items?itemId=${this.itemId}&itemType=${this.itemType}`, { method: 'DELETE' });
            } else {
                const payload = mapItemToDbPayload(this.item);
                await fetch(`${this.tursoBackendUrl}/lists/${list.id}/items`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ item: payload })
                });
            }
            await this.fetchMembership();
            this.$bus.$emit('lists-updated');
        } catch(e) { console.error(e); }
    }
  }
};
</script>

<style scoped lang="scss">
.card-actions {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 20;
}

.trigger-btn {
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    backdrop-filter: blur(4px);
    transition: all 0.2s;
    
    &:hover, &.active {
        background: rgba(139, 233, 253, 0.8);
        border-color: #8BE9FD;
        color: #000;
    }
}

.dropdown-menu {
    position: absolute;
    top: 40px;
    right: 0;
    width: 240px;
    background: #151f24;
    border: 1px solid rgba(139, 233, 253, 0.2);
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    overflow: hidden;
    padding: 0.5rem 0;
    z-index: 100;
}

.menu-view {
    display: flex;
    flex-direction: column;
}

.menu-item {
    background: transparent;
    border: none;
    color: #eee;
    padding: 0.8rem 1.2rem;
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 1.3rem;
    width: 100%;
    
    &:hover {
        background: rgba(139, 233, 253, 0.1);
        color: #8BE9FD;
    }
    
    .icon {
        width: 20px;
        display: flex;
        justify-content: center;
        margin-right: 8px;
    }
    
    .arrow {
        margin-left: auto;
        display: flex;
        align-items: center;
    }
    
    &.remove {
        color: #ff6b6b;
        &:hover { background: rgba(255, 107, 107, 0.1); }
    }
}
.empty-msg {
    padding: 0.8rem 1.2rem;
    color: #777;
    font-size: 1.2rem;
    text-align: center;
}
.checkbox {
    width: 18px;
    height: 18px;
    border: 1px solid #555;
    border-radius: 4px;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}
.list-option:hover .checkbox {
    border-color: #8BE9FD;
}

.divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin: 0.5rem 0;
}

.menu-header {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 0.5rem;
    
    .back-btn {
        background: none;
        border: none;
        color: #fff;
        font-size: 1.8rem;
        cursor: pointer;
        padding: 0 0.5rem 0 0;
        line-height: 1;
        &:hover { color: #8BE9FD; }
    }
    
    span {
        font-weight: 600;
        font-size: 1.3rem;
        color: #8BE9FD;
    }
}

.lists-container {
    max-height: 200px;
    overflow-y: auto;
}

.list-option {
    display: flex;
    align-items: center;
    padding: 0.6rem 1.2rem;
    cursor: pointer;
    font-size: 1.3rem;
    color: #ccc;
    
    &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #fff;
    }
    
    input {
        margin-right: 1rem;
        accent-color: #8BE9FD;
    }
}

.loader-mini {
    padding: 1rem;
    text-align: center;
    color: #777;
    font-size: 1.2rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

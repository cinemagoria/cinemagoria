<template>
  <main class="main">
    <UserNav />
    <TopNav title="N.O.I.R Archive" />

    <section class="noir-archive">
      <div class="header-container">
        <h1 class="title-primary" style="text-align: center; margin-bottom: 0.5rem;">N.O.I.R Archive</h1>
        <p class="title-secondary" style="text-align: center; margin-bottom: 2rem;">
          Historical Titles Selected For N.O.I.R
          <button @click="showNoirModal = true" class="help-icon-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
          </button>
        </p>
      </div>

      <div v-if="!loading && archiveItems && archiveItems.results && archiveItems.results.length" class="clone-bar">
        <button @click="cloneToList" class="clone-button" :disabled="cloning">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-download-icon lucide-cloud-download"><path d="M12 13v8l-4-4"/><path d="m12 21 4-4"/><path d="M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284"/></svg>
          {{ cloning ? 'Cloning...' : 'Clone to List' }}
        </button>
      </div>

      <transition name="fade">
        <div v-if="cloneSuccess" class="undoBarContainer">
          <div class="undoBar">
            <span>List created!</span>
            <nuxt-link v-if="newlyCreatedListSlug" :to="`/lists/${newlyCreatedListSlug}`" class="viewLinkButton">View</nuxt-link>
            <div class="timer-line"></div>
          </div>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="cloneError" class="undoBarContainer">
          <div class="undoBar undoBar--error">
            <span>{{ cloneError }}</span>
            <div class="timer-line timer-line--error"></div>
          </div>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="showReplaceConfirm" class="undoBarContainer">
          <div class="undoBar undoBar--confirm">
            <span>You already cloned N.O.I.R today. Replace?</span>
            <div class="confirm-actions">
              <button @click="confirmReplace" class="confirmButton confirmButton--yes">Replace</button>
              <button @click="cancelReplace" class="confirmButton confirmButton--no">Cancel</button>
            </div>
          </div>
        </div>
      </transition>

      <div v-if="loading" class="noir-archive-loader">
        <Loader :size="60" />
      </div>

      <div v-else-if="archiveItems && archiveItems.results && archiveItems.results.length">
        <Listing :items="archiveItems" />
      </div>

      <div v-else class="empty-state">
        <p>No archived titles yet.</p>
      </div>
    </section>

    <NoirModal v-if="showNoirModal" @close="showNoirModal = false" />
  </main>
</template>

<script>
import Listing from '~/components/Listing';
import Loader from '~/components/Loader.vue';
import NoirModal from '~/components/NoirModal.vue';
import { mapItemToDbPayload } from '~/utils/itemMapper';

export default {
  components: {
    Listing,
    Loader,
    NoirModal,
  },

  data() {
    return {
      archiveItems: null,
      loading: true,
      showNoirModal: false,
      cloning: false,
      cloneSuccess: false,
      cloneError: null,
      newlyCreatedListSlug: null,
      showReplaceConfirm: false,
      existingNoirListId: null,
    };
  },

  computed: {
    tursoBackendUrl() {
      return this.$config.public.tursoBackendUrl;
    },
  },

  async mounted() {
    try {
      const data = await $fetch('/api/noir-archive');
      
      if (data && data.results) {
        data.results = data.results.map(item => {
          item.vote_average = 0;
          item.imdb_rating = 0;

          if (item.id === 85552 || item.name === 'Euphoria' || item.title === 'Euphoria') {
            return {
              ...item,
              name: 'Euphoria S03',
              title: 'Euphoria S03',
              first_air_date: '2026-04-12',
              release_date: '2026-04-12'
            };
          }
          if (item.id === 112160 || item.name === 'Beef' || item.name === 'BEEF' || item.name === 'Bronca' || item.title === 'BEEF') {
            return {
              ...item,
              name: 'BEEF S02',
              title: 'BEEF S02',
              first_air_date: '2026-04-16',
              release_date: '2026-04-16'
            };
          }
          return item;
        });

        data.results.sort((a, b) => {
          const dateA = new Date(a.release_date || a.first_air_date || '1970-01-01');
          const dateB = new Date(b.release_date || b.first_air_date || '1970-01-01');
          return dateB - dateA;
        });
      }

      this.archiveItems = data;
    } catch (e) {
      console.error('Failed to fetch noir archive:', e);
      this.archiveItems = { results: [], page: 1, total_pages: 1, total_results: 0 };
    } finally {
      this.loading = false;
    }
  },

  methods: {
    async cloneToList() {
      const userEmail = localStorage.getItem('email')?.replace(/['"]+/g, '');
      if (!userEmail) {
        window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { action: 'login' } }));
        return;
      }

      this.cloning = true;
      this.cloneSuccess = false;
      this.showReplaceConfirm = false;

      try {
        const listsRes = await fetch(`${this.tursoBackendUrl}/lists/user/${encodeURIComponent(userEmail)}`);
        if (listsRes.ok) {
          const userLists = await listsRes.json();
          const todayStr = new Date().toISOString().slice(0, 10);
          const existingNoir = (userLists.lists || userLists || []).find(l => {
            if (l.name !== 'N.O.I.R Archive') return false;
            const createdDate = l.created_at ? new Date(typeof l.created_at === 'number' ? l.created_at * 1000 : l.created_at).toISOString().slice(0, 10) : null;
            return createdDate === todayStr;
          });

          if (existingNoir) {
            this.existingNoirListId = existingNoir.id;
            this.showReplaceConfirm = true;
            this.cloning = false;
            return;
          }
        }

        await this._createNoirList(userEmail);
      } catch (e) {
        console.error('Clone failed:', e);
        this.cloneError = 'Failed to clone archive to list.';
        setTimeout(() => { this.cloneError = null; }, 4000);
        this.cloning = false;
      }
    },

    async confirmReplace() {
      const userEmail = localStorage.getItem('email')?.replace(/['"]+/g, '');
      this.showReplaceConfirm = false;
      this.cloning = true;

      try {
        if (this.existingNoirListId) {
          await fetch(`${this.tursoBackendUrl}/lists/${this.existingNoirListId}?userEmail=${encodeURIComponent(userEmail)}`, {
            method: 'DELETE',
          });
        }
        await this._createNoirList(userEmail);
      } catch (e) {
        console.error('Replace failed:', e);
        this.cloneError = 'Failed to replace existing list.';
        setTimeout(() => { this.cloneError = null; }, 4000);
        this.cloning = false;
      }
    },

    cancelReplace() {
      this.showReplaceConfirm = false;
      this.existingNoirListId = null;
    },

    async _createNoirList(userEmail) {
      let createdListId = null;
      try {
        const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        let ownerName = localStorage.getItem('name') || userEmail.split('@')[0];

        const createRes = await fetch(`${this.tursoBackendUrl}/lists`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail,
            name: 'N.O.I.R Archive',
            description: `Historical Titles Selected For N.O.I.R till ${today}`,
            isPublic: false,
            ownerName,
          }),
        });

        if (!createRes.ok) throw new Error('Failed to create list');
        const listData = await createRes.json();
        const newList = listData.list || listData;
        createdListId = newList.id;

        const mappedItems = this.archiveItems.results
          .map(item => ({ ...mapItemToDbPayload(item), topLevel: true }))
          .filter(Boolean);

        this.newlyCreatedListSlug = newList.slug;

        const BATCH_SIZE = 30;
        for (let i = 0; i < mappedItems.length; i += BATCH_SIZE) {
          const batch = mappedItems.slice(i, i + BATCH_SIZE);
          const itemsRes = await fetch(`${this.tursoBackendUrl}/lists/${newList.id}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: batch, userEmail }),
          });

          if (!itemsRes.ok) {
            const errText = await itemsRes.text().catch(() => '');
            console.error(`Items batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, itemsRes.status, errText);
            throw new Error(`Failed to add items (${itemsRes.status})`);
          }
        }

        this.cloneSuccess = true;
        this.$bus.$emit('lists-updated');

        setTimeout(() => {
          this.cloneSuccess = false;
        }, 4000);
      } catch (e) {
        console.error('Clone failed:', e);
        if (createdListId) {
          try {
            await fetch(`${this.tursoBackendUrl}/lists/${createdListId}?userEmail=${encodeURIComponent(userEmail)}`, { method: 'DELETE' });
          } catch (_) {}
        }
        this.cloneError = 'Failed to clone archive to list.';
        setTimeout(() => { this.cloneError = null; }, 4000);
      } finally {
        this.cloning = false;
      }
    },
  },

  head() {
    return {
      title: 'N.O.I.R Archive - Cinemagoria',
      meta: [
        { hid: 'description', name: 'description', content: 'Historical titles curated for N.O.I.R — Cinemagoria\'s most exclusive selection of upcoming movies and TV shows.' }
      ]
    };
  },
};
</script>

<style scoped>
.noir-archive {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 2rem 4rem;
}

.help-icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  display: inline-flex;
  align-items: center;
  transition: opacity 0.3s ease;
  vertical-align: middle;
}

.help-icon-button:hover {
  opacity: 0.7;
}

.clone-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.clone-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid rgba(139, 233, 253, 0.4);
  color: #8BE9FD;
  padding: 0.6rem 1.4rem;
  border-radius: 8px;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clone-button:hover:not(:disabled) {
  background: rgba(139, 233, 253, 0.1);
  border-color: #8BE9FD;
}

.clone-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.undoBarContainer {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  padding: 0 2rem;
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
  width: 100%;
  max-width: 600px;
  overflow: hidden;
}

.viewLinkButton {
  background: transparent;
  border: 1px solid rgba(139, 233, 253, 0.4);
  color: #8BE9FD;
  padding: 0.5rem 1.4rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  margin-left: 2rem;
}

.viewLinkButton:hover {
  background: rgba(139, 233, 253, 0.1);
  border-color: #8BE9FD;
  transform: translateY(-1px);
}

.timer-line {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: #8BE9FD;
  animation: shrink 4s linear forwards;
}

.undoBar--error {
  background: linear-gradient(90deg, rgba(255, 85, 85, 0.2) 0%, rgba(204, 0, 0, 0.2) 100%);
  border-bottom-color: #ff5555;
}

.timer-line--error {
  background: #ff5555;
}

.undoBar--confirm {
  background: linear-gradient(90deg, rgba(255, 183, 77, 0.2) 0%, rgba(204, 136, 0, 0.2) 100%);
  border-bottom-color: #ffb74d;
}

.confirm-actions {
  display: flex;
  gap: 0.8rem;
  margin-left: 1.5rem;
  flex-shrink: 0;
}

.confirmButton {
  padding: 0.5rem 1.4rem;
  border-radius: 6px;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid;
}

.confirmButton--yes {
  background: rgba(139, 233, 253, 0.15);
  border-color: rgba(139, 233, 253, 0.4);
  color: #8BE9FD;
}

.confirmButton--yes:hover {
  background: rgba(139, 233, 253, 0.25);
  border-color: #8BE9FD;
}

.confirmButton--no {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.6);
}

.confirmButton--no:hover {
  border-color: rgba(255, 255, 255, 0.4);
  color: rgba(255, 255, 255, 0.8);
}

@keyframes shrink {
  from { width: 100%; }
  to { width: 0%; }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.noir-archive-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.4rem;
}

@media (max-width: 768px) {
  .noir-archive {
    padding: 1.5rem 1rem 3rem;
  }
}
</style>

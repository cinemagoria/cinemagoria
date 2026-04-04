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

      <div v-if="!loading && hasResults" class="toolbar">
        <label class="switch" @click.prevent="sortMode = sortMode === 'date' ? 'alpha' : 'date'">
          <input type="checkbox" :checked="sortMode === 'alpha'">
          <span>Date</span>
          <span>A-Z</span>
        </label>

        <button @click="cloneToList" class="clone-button" :disabled="cloning">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 13v8l-4-4"/><path d="m12 21 4-4"/><path d="M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284"/></svg>
          {{ cloning ? 'Cloning...' : 'Clone to List' }}
        </button>
      </div>

      <div v-if="loading" class="noir-archive-loader">
        <Loader :size="60" />
      </div>

      <div v-else-if="hasResults">
        <!-- Movies -->
        <div v-if="sortedMovies.length" class="noir-category">
          <div class="section-header" @click="collapsed.movies = !collapsed.movies">
            <h2 class="section-title">Movies <span class="section-count">({{ sortedMovies.length }})</span></h2>
            <button class="expand-btn" :aria-label="collapsed.movies ? 'Expand' : 'Collapse'">
              <svg v-if="collapsed.movies" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 6 5 5 5-5"/><path d="m7 13 5 5 5-5"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 11-5-5-5 5"/><path d="m17 18-5-5-5 5"/></svg>
            </button>
          </div>
          <div v-show="!collapsed.movies">
            <div class="listing__items">
              <Card v-for="item in moviesWithDate" :key="'movie-' + item.id" :item="item" />
            </div>
            <div v-if="moviesWithoutDate.length" class="no-date-separator">
              <span class="no-date-label">Date to be confirmed</span>
            </div>
            <div v-if="moviesWithoutDate.length" class="listing__items">
              <Card v-for="item in moviesWithoutDate" :key="'movie-nd-' + item.id" :item="item" />
            </div>
          </div>
        </div>

        <!-- TV Shows -->
        <div v-if="sortedTv.length" class="noir-category">
          <div class="section-header" @click="collapsed.tv = !collapsed.tv">
            <h2 class="section-title">TV Shows <span class="section-count">({{ sortedTv.length }})</span></h2>
            <button class="expand-btn" :aria-label="collapsed.tv ? 'Expand' : 'Collapse'">
              <svg v-if="collapsed.tv" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 6 5 5 5-5"/><path d="m7 13 5 5 5-5"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 11-5-5-5 5"/><path d="m17 18-5-5-5 5"/></svg>
            </button>
          </div>
          <div v-show="!collapsed.tv">
            <div class="listing__items">
              <Card v-for="item in tvWithDate" :key="'tv-' + item.id" :item="item" />
            </div>
            <div v-if="tvWithoutDate.length" class="no-date-separator">
              <span class="no-date-label">Date to be confirmed</span>
            </div>
            <div v-if="tvWithoutDate.length" class="listing__items">
              <Card v-for="item in tvWithoutDate" :key="'tv-nd-' + item.id" :item="item" />
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>No archived titles yet.</p>
      </div>
    </section>

    <NoirModal v-if="showNoirModal" @close="showNoirModal = false" />
  </main>
</template>

<script>
import Card from '~/components/Card';
import Loader from '~/components/Loader.vue';
import NoirModal from '~/components/NoirModal.vue';
import { mapItemToDbPayload } from '~/utils/itemMapper';

export default {
  components: {
    Card,
    Loader,
    NoirModal,
  },

  data() {
    return {
      archiveItems: null,
      loading: true,
      showNoirModal: false,
      sortMode: 'date',
      collapsed: { movies: false, tv: false },
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
    hasResults() {
      return this.archiveItems && this.archiveItems.results && this.archiveItems.results.length;
    },
    sortedMovies() {
      const mode = this.sortMode;
      return this._sortAndLabel(this._filterByType('movie'), mode);
    },
    sortedTv() {
      const mode = this.sortMode;
      return this._sortAndLabel(this._filterByType('tv'), mode);
    },
    moviesWithDate() {
      return this.sortedMovies.filter(i => i.release_date || i.first_air_date);
    },
    moviesWithoutDate() {
      return this.sortedMovies.filter(i => !i.release_date && !i.first_air_date);
    },
    tvWithDate() {
      return this.sortedTv.filter(i => i.release_date || i.first_air_date);
    },
    tvWithoutDate() {
      return this.sortedTv.filter(i => !i.release_date && !i.first_air_date);
    },
  },

  async mounted() {
    try {
      const data = await $fetch('/api/noir-archive');

      if (data && data.results) {
        data.results = data.results.map(item => {
          item.vote_average = 0;
          item.imdb_rating = 0;
          return item;
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
    _filterByType(type) {
      if (!this.hasResults) return [];
      return this.archiveItems.results.filter(item => {
        const mt = item.media_type || item.type || (item.name ? 'tv' : 'movie');
        return mt === type;
      });
    },
    _sortAndLabel(items, mode) {
      let sorted;
      if (mode === 'alpha') {
        sorted = [...items].sort((a, b) => {
          const nameA = (a.title || a.name || '').toLowerCase();
          const nameB = (b.title || b.name || '').toLowerCase();
          return nameA.localeCompare(nameB, 'en');
        });
      } else {
        const withDate = items.filter(i => i.release_date || i.first_air_date);
        const withoutDate = items.filter(i => !i.release_date && !i.first_air_date);
        withDate.sort((a, b) => {
          const da = new Date(a.release_date || a.first_air_date);
          const db = new Date(b.release_date || b.first_air_date);
          return db - da;
        });
        if (withoutDate.length && withDate.length) {
          withoutDate[0] = { ...withoutDate[0], _noDateLabel: true };
        } else if (withoutDate.length && !withDate.length) {
          withoutDate[0] = { ...withoutDate[0], _noDateLabel: true };
        }
        sorted = [...withDate, ...withoutDate];
      }
      return sorted;
    },
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
      title: 'Cinemagoria — N.O.I.R Archive',
      meta: [
        { hid: 'description', name: 'description', content: 'Historical titles curated for N.O.I.R \u2014 Cinemagoria\'s most exclusive selection of upcoming movies and TV shows.' }
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

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0;
}

.switch {
  --_switch-padding: 3px;
  --_slider-bg-clr-on: #8BE9FD;
  color: rgba(255, 255, 255, 0.7);
  width: fit-content;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  position: relative;
  isolation: isolate;
  border-radius: 25px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  font-size: 1.3rem;
  margin: 0;
}

.switch input[type="checkbox"] {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.switch > span {
  display: grid;
  place-content: center;
  transition: all 300ms ease-in-out;
  padding: 10px 20px;
  white-space: nowrap;
  z-index: 1;
}

.switch::before,
.switch::after {
  content: "";
  position: absolute;
  border-radius: inherit;
  transition: inset 150ms ease-in-out;
}

.switch::before {
  background-color: var(--_slider-bg-clr-on);
  inset: var(--_switch-padding) 50% var(--_switch-padding) var(--_switch-padding);
  transition: inset 500ms cubic-bezier(0.47, 1.64, 0.41, 0.8), background-color 500ms ease-in-out;
  z-index: 0;
  border-radius: 22px;
}

.switch::after {
  background-color: rgba(0, 0, 0, 0);
  inset: 0;
  z-index: -1;
}

.switch:hover {
  transform: translateY(-1px);
}

.switch:has(input:checked)::before {
  inset: var(--_switch-padding) var(--_switch-padding) var(--_switch-padding) 50%;
}

.switch > span:first-of-type {
  color: #000;
  font-weight: 600;
}

.switch:has(input:checked) > span:first-of-type {
  color: rgba(255, 255, 255, 0.85);
  font-weight: 400;
}

.switch:has(input:checked) > span:last-of-type {
  color: #000;
  font-weight: 600;
}

.switch > span:last-of-type {
  color: rgba(255, 255, 255, 0.85);
  font-weight: 400;
}

.noir-category {
  margin-bottom: 2.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  margin-bottom: 1rem;
}

.section-header:hover .section-title {
  opacity: 0.8;
}

.section-title {
  color: #8BE9FD;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0;
  padding-left: 5px;
  border-left: 3px solid #8BE9FD;
  line-height: 1.2;
}

.section-count {
  font-weight: 400;
  font-size: 1.2rem;
  opacity: 0.6;
}

.expand-btn {
  background: transparent;
  border: none;
  color: #8BE9FD;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.expand-btn:hover {
  transform: scale(1.1);
}

.no-date-separator {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0 0.5rem;
}

.no-date-separator::before,
.no-date-separator::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(139, 233, 253, 0.15);
}

.no-date-label {
  color: rgba(139, 233, 253, 0.85);
  font-size: 1.1rem;
  font-style: italic;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .noir-archive {
    padding: 1.5rem 1rem 3rem;
  }
}
</style>

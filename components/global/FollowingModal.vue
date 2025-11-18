<template>
  <div v-if="visible" :class="$style.modalOverlay" @click.self="close">
    <div :class="$style.modalWrapper">
      <div :class="$style.modalContent">
        <div :class="$style.modalHeader">
          <h2>Following</h2>
          <button @click="close" :class="$style.closeButton">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div :class="$style.tabs">
          <button 
            @click="activeTab = 'people'" 
            :class="[{ [$style.active]: activeTab === 'people' }]">
            People ({{ peopleCount }})
          </button>
          <button 
            @click="activeTab = 'tv'" 
            :class="[{ [$style.active]: activeTab === 'tv' }]">
            TV Series ({{ tvCount }})
          </button>
        </div>

        <div class="undo-bar-container">
          <div v-if="undoItem" :class="$style.undoBar" style="padding: 10px;">
            <span>{{ undoItem.type === 'person' ? undoItem.name : undoItem.tv_name }} unfollowed</span>
            <button @click="handleUndo" :class="$style.undoButton">UNDO</button>
          </div>
        </div>

        <div v-if="loading" :class="$style.loader">
          <div class="modern-spinner">
            <div></div><div></div><div></div><div></div>
          </div>
        </div>

        <div v-else :class="$style.modalBody">
          <div v-if="activeTab === 'people'" :class="$style.peopleTab">
            <div v-for="(items, department) in groupedPeople" :key="department" :class="$style.departmentGroup">
              <h3 :class="$style.departmentTitle">{{ formatDepartment(department) }}</h3>
              <div :class="$style.grid">
                <div 
                  v-for="person in items" 
                  :key="person.person_id"
                  :class="$style.card">
                  <div 
                    @click="openPerson(person.person_id)" 
                    :class="$style.cardImage">
                    <img 
                      v-if="person.profile_path" 
                      :src="`https://image.tmdb.org/t/p/w185${person.profile_path}`" 
                      :alt="person.person_name">
                    <div v-else :class="$style.noImage">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  </div>
                  <div :class="$style.cardContent">
                    <h4>{{ person.person_name }}</h4>
                    <button 
                      @click="unfollowPerson(person)" 
                      :class="$style.unfollowButton">
                      Unfollow
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="Object.keys(groupedPeople).length === 0" :class="$style.emptyState">
              <p>Not following anyone yet</p>
            </div>
          </div>

          <div v-else :class="$style.tvTab">
            <div :class="$style.grid">
              <div 
                v-for="show in tvShows" 
                :key="show.tv_id"
                :class="$style.card">
                <div 
                  @click="openTvShow(show.tv_id)" 
                  :class="$style.cardImage">
                  <img 
                    v-if="show.poster_path" 
                    :src="`https://image.tmdb.org/t/p/w185${show.poster_path}`" 
                    :alt="show.tv_name">
                  <div v-else :class="$style.noImage">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 6h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3c-1.1 0-2 .89-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.11-.9-2-2-2zm0 14H3V8h18v12zM9 10v8l7-4z"/>
                    </svg>
                  </div>
                </div>
                <div :class="$style.cardContent">
                  <h4>{{ show.tv_name }}</h4>
                  <p v-if="show.status" :class="$style.status">{{ show.status }}</p>
                  <button 
                    @click="unfollowTv(show)" 
                    :class="$style.unfollowButton">
                    Unfollow
                  </button>
                </div>
              </div>
            </div>

            <div v-if="tvShows.length === 0" :class="$style.emptyState">
              <p>Not following any TV shows yet</p>
            </div>
          </div>
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
      activeTab: 'people',
      people: [],
      tvShows: [],
      loading: true,
      undoItem: null,
      undoTimeout: null,
      followsApiUrl: 'https://entercinema-follows-rust.vercel.app'
    };
  },

  computed: {
    peopleCount() {
      return this.people.length;
    },
    tvCount() {
      return this.tvShows.length;
    },
    groupedPeople() {
      const groups = {};
      this.people.forEach(person => {
        const dept = person.person_type || 'other';
        if (!groups[dept]) {
          groups[dept] = [];
        }
        groups[dept].push(person);
      });
      return groups;
    }
  },

mounted() {
  this.$root.$on('show-following-modal', this.show);
},

beforeDestroy() {
  this.$root.$off('show-following-modal');
  
  if (this.undoTimeout) {
    clearTimeout(this.undoTimeout);
  }
},

methods: {
  async show() {
    this.visible = true;
    await this.fetchData();
  },

  close() {
    this.visible = false;
  },

  async fetchData() {
      const userEmail = localStorage.getItem('email');
      if (!userEmail) return;

      this.loading = true;
      try {
        const [peopleResponse, tvResponse] = await Promise.all([
          fetch(`${this.followsApiUrl}/follows/list?user_email=${encodeURIComponent(userEmail)}`),
          fetch(`${this.followsApiUrl}/tv-follows/list?user_email=${encodeURIComponent(userEmail)}`)
        ]);

        if (peopleResponse.ok) {
          const data = await peopleResponse.json();
          this.people = data.follows || [];
        }

        if (tvResponse.ok) {
          const data = await tvResponse.json();
          this.tvShows = data.tv_follows || [];
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        this.loading = false;
      }
    },

    formatDepartment(dept) {
      const map = {
        'actor': 'Actors',
        'director': 'Directors',
        'writer': 'Writers',
        'other': 'Other'
      };
      return map[dept] || dept.charAt(0).toUpperCase() + dept.slice(1);
    },

    async unfollowPerson(person) {
      const userEmail = localStorage.getItem('email');
      if (!userEmail) return;

      this.people = this.people.filter(p => p.person_id !== person.person_id);

      this.undoItem = { ...person, type: 'person', name: person.person_name };
      this.startUndoTimer();

      try {
        await fetch(`${this.followsApiUrl}/follows/remove?user_email=${encodeURIComponent(userEmail)}&person_id=${person.person_id}`, {
          method: 'DELETE'
        });
        this.$emit('unfollow-updated');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('following-updated'));
        }
      } catch (error) {
        console.error('Error unfollowing:', error);
        this.people.push(person);
      }
    },

    async unfollowTv(show) {
      const userEmail = localStorage.getItem('email');
      if (!userEmail) return;

      this.tvShows = this.tvShows.filter(s => s.tv_id !== show.tv_id);

      this.undoItem = { ...show, type: 'tv' };
      this.startUndoTimer();

      try {
        await fetch(`${this.followsApiUrl}/tv-follows/remove?user_email=${encodeURIComponent(userEmail)}&tv_id=${show.tv_id}`, {
          method: 'DELETE'
        });
        this.$emit('unfollow-updated');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('following-updated'));
        }
      } catch (error) {
        console.error('Error unfollowing TV:', error);
        this.tvShows.push(show);
      }
    },

    startUndoTimer() {
      if (this.undoTimeout) {
        clearTimeout(this.undoTimeout);
      }
      this.undoTimeout = setTimeout(() => {
        this.undoItem = null;
      }, 60000);
    },

    async handleUndo() {
      if (!this.undoItem) return;

      const userEmail = localStorage.getItem('email');
      if (!userEmail) return;

      try {
        if (this.undoItem.type === 'person') {
          const response = await fetch(`${this.followsApiUrl}/follows/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_email: userEmail,
              person_id: this.undoItem.person_id,
              person_name: this.undoItem.person_name,
              person_type: this.undoItem.person_type,
              profile_path: this.undoItem.profile_path || null
            })
          });
          if (response.ok) {
            this.people.push(this.undoItem);
          }
        } else {
          const response = await fetch(`${this.followsApiUrl}/tv-follows/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_email: userEmail,
              tv_id: this.undoItem.tv_id,
              tv_name: this.undoItem.tv_name,
              poster_path: this.undoItem.poster_path || null,
              overview: this.undoItem.overview || null,
              vote_average: this.undoItem.vote_average || null,
              status: this.undoItem.status || null
            })
          });
          if (response.ok) {
            this.tvShows.push(this.undoItem);
          }
        }

        this.$emit('unfollow-updated');
        if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('following-updated'));
      }
      } catch (error) {
        console.error('Error undoing:', error);
      }

      if (this.undoTimeout) {
        clearTimeout(this.undoTimeout);
      }
      this.undoItem = null;
    },

    openPerson(personId) {
      window.open(`/person/${personId}`, '_blank');
    },

    openTvShow(tvId) {
      window.open(`/tv/${tvId}`, '_blank');
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
  z-index: 1000;
  padding: 2rem;
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
  max-width: 1200px;
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
    color: #fff;
    margin: 0;
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

.tabs {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem 0;
  border-bottom: 1px solid rgba(127, 219, 241, 0.2);
  background: rgba(0, 0, 0, 0.2);

  button {
    padding: 1rem 2rem;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    font-size: 1.5rem;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all 0.3s ease;
    font-weight: 500;

    &.active {
      color: #8BE9FD;
      border-radius: 7px;
      border-bottom-color: #8BE9FD;
      background: rgba(139, 233, 253, 0.1);
    }

    &:hover:not(.active) {
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

.undoBar {
  background: linear-gradient(90deg, rgba(139, 233, 253, 0.2) 0%, rgba(0, 136, 204, 0.2) 100%);
  border-bottom: 2px solid #8BE9FD;
  color: white;
  padding: 1.2rem 3rem;
  display: flex;
  position: relative;
  top: 5px;
  border-radius: 10px;
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

.modalBody {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.departmentGroup {
  margin-bottom: 3rem;
}

.departmentTitle {
  font-size: 1.8rem;
  color: #8BE9FD;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 2rem;

  @media (min-width: $breakpoint-medium) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

.card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(139, 233, 253, 0.2);
  }
}

.cardImage {
  position: relative;
  padding-top: 150%;
  cursor: pointer;
  overflow: hidden;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.noImage {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.3);
}

.cardContent {
  padding: 1.2rem;

  h4 {
    font-size: 1.4rem;
    color: #fff;
    margin: 0 0 0.8rem 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.status {
  font-size: 1.2rem;
  color: #8F989E;
  margin: 0 0 0.8rem 0;
}

.unfollowButton {
  width: 100%;
  padding: 0.6rem;
  background: rgba(139, 233, 253, 0.1);
  border: 1px solid #db3939;
  border-radius: 6px;
  color: #d48282;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f03131;
    color: #fff;
    transform: translateY(-1px);
  }
}
.emptyState {
  text-align: center;
  padding: 4rem 2rem;
  color: #d0d0d0;
  font-size: 1.6rem;
}

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
}

.undo-bar-container {
padding: 1rem 2rem;
}

.modalWrapper {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modalHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h2 {
    font-size: 2.4rem;
    color: #fff;
    margin: 0;
    flex: 1;
    text-align: center;
  }
}
</style>
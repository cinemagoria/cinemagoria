<template>
  <div v-if="isVisible" :class="$style.modalOverlay" @click.self="close">
    <div :class="$style.modalWrapper">
      <div :class="$style.modalContent">
        <div :class="$style.modalHeader">
          <div :class="$style.headerContent">
            <h2 class="title-primary">Siguiendo</h2>
            <p :class="$style.modalSubtitle">
              Gestiona las personas, series, productoras y plataformas de streaming que sigues para recibir notificaciones.
            </p>
          </div>
          <button @click="close" :class="$style.closeButton" aria-label="Close">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div :class="$style.tabs">
          <button 
            @click="activeTab = 'people'" 
            :class="[{ [$style.active]: activeTab === 'people' }]">
            <span :class="$style.tabLabel">Personas ({{ peopleCount }})</span>
          </button>
          <button 
            @click="activeTab = 'tv'" 
            :class="[{ [$style.active]: activeTab === 'tv' }]">
            <span :class="$style.tabLabel">Series de TV ({{ tvCount }})</span>
          </button>
          <button 
            @click="activeTab = 'companies'" 
            :class="[{ [$style.active]: activeTab === 'companies' }]">
            <span :class="$style.tabLabel">Productoras ({{ companiesCount }})</span>
          </button>
          <button 
            @click="activeTab = 'streaming'" 
            :class="[{ [$style.active]: activeTab === 'streaming' }]">
            <span :class="$style.tabLabel">Plataformas de Streaming ({{ streamingCount }})</span>
          </button>
          <button 
            @click="activeTab = 'users'" 
            :class="[{ [$style.active]: activeTab === 'users' }]">
            <span :class="$style.tabLabel">Usuarios ({{ usersCount }} / {{ followersCount }})</span>
          </button>
        </div>

        <div v-if="undoItem" :class="$style.undoBarContainer">
          <div :class="$style.undoBar">
            <span>{{ getUndoText() }}</span>
            <button @click="handleUndo" :class="$style.undoButton">Deshacer</button>
          </div>
        </div>

        <div v-if="loading" :class="$style.loader">
          <Loader :size="60" color="#8BE9FD" />
        </div>

        <div v-else :class="$style.modalBody">
          <div v-if="activeTab === 'people'" :class="$style.peopleTab">
            <div v-for="(items, department) in groupedPeople" :key="department" :class="$style.departmentGroup">
              <div @click="toggleDepartment(department)" :class="$style.departmentHeader">
                <h3 :class="$style.departmentTitle">{{ formatDepartment(department) }}</h3>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                  :style="{ transform: collapsedDepartments[department] ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              <div v-show="!collapsedDepartments[department]" :class="$style.grid">
                <div
                  v-for="person in items"
                  :key="person.person_id"
                  :class="$style.card">
                  <div
                    @click="openPerson(person.person_id)"
                    :class="$style.cardImage">
                    <button
                      type="button"
                      :class="$style.externalLinkBtn"
                      title="Abrir en nueva pestaña"
                      @click.stop.prevent="openExternal(`/person/${person.person_id}`)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 3h7v7"/><path d="M10 14L21 3"/><path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6"/>
                      </svg>
                    </button>
                    <div v-show="person.profile_path && !imageLoadStates[`person-${person.person_id}`]" :class="$style.posterLoader">
                      <Loader :size="44" color="#000" />
                    </div>
                    <img
                      v-if="person.profile_path"
                      :src="`https://image.tmdb.org/t/p/w185${person.profile_path}`"
                      :alt="person.person_name"
                      loading="lazy"
                      decoding="async"
                      :class="{ [$style.loaded]: imageLoadStates[`person-${person.person_id}`] }"
                      @load="handleImageLoad(`person-${person.person_id}`)"
                      @error="onImageError($event, `person-${person.person_id}`)"
                    >
                    <div v-else :class="$style.noImage">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="black">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  </div>
                  <div :class="$style.cardContent">
                    <h4>{{ person.person_name }}</h4>
                    <button 
                      @click="unfollowPerson(person)" 
                      :class="$style.unfollowButton">
                      Dejar de seguir
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="Object.keys(groupedPeople).length === 0" :class="$style.emptyState">
              <p>Aún no sigues a nadie</p>
            </div>
          </div>

          <div v-else-if="activeTab === 'tv'" :class="$style.tvTab">
            <div :class="$style.grid">
              <div
                v-for="show in tvShows"
                :key="show.tv_id"
                :class="$style.card">
                <div
                  @click="openTvShow(show.tv_id)"
                  :class="$style.cardImage">
                  <button
                    type="button"
                    :class="$style.externalLinkBtn"
                    title="Abrir en nueva pestaña"
                    @click.stop.prevent="openExternal(`/tv/${show.tv_id}`)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 3h7v7"/><path d="M10 14L21 3"/><path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6"/>
                    </svg>
                  </button>
                  <div v-show="show.poster_path && !imageLoadStates[`tv-${show.tv_id}`]" :class="$style.posterLoader">
                    <Loader :size="44" color="#000" />
                  </div>
                  <img
                    v-if="show.poster_path"
                    :src="`https://image.tmdb.org/t/p/w185${show.poster_path}`"
                    :alt="show.tv_name"
                    loading="lazy"
                    decoding="async"
                    :class="{ [$style.loaded]: imageLoadStates[`tv-${show.tv_id}`] }"
                    @load="handleImageLoad(`tv-${show.tv_id}`)"
                    @error="onImageError($event, `tv-${show.tv_id}`)"
                  >
                  <div v-else :class="$style.noImage">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="black">
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
                    Dejar de seguir
                  </button>
                </div>
              </div>
            </div>

          <div v-if="tvShows.length === 0" :class="$style.emptyState">
              <p>Aún no sigues ninguna serie de TV</p>
            </div>
          </div>

          <div v-else-if="activeTab === 'companies'" :class="$style.companiesTab">
            <div :class="$style.grid">
              <div
                v-for="company in companies"
                :key="company.company_id"
                :class="$style.card">
                <div
                  @click="openCompany(company.company_id)"
                  :class="$style.cardImage">
                  <button
                    type="button"
                    :class="$style.externalLinkBtn"
                    title="Abrir en nueva pestaña"
                    @click.stop.prevent="openExternal(`/production/${company.company_id}`)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 3h7v7"/><path d="M10 14L21 3"/><path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6"/>
                    </svg>
                  </button>
                  <div v-show="company.logo_path && !imageLoadStates[`company-${company.company_id}`]" :class="$style.posterLoader">
                    <Loader :size="44" color="#000" />
                  </div>
                  <img
                    v-if="company.logo_path"
                    :src="`https://image.tmdb.org/t/p/w154${company.logo_path}`"
                    :alt="company.company_name"
                    loading="lazy"
                    decoding="async"
                    :class="[$style.companyLogo, { [$style.loaded]: imageLoadStates[`company-${company.company_id}`] }]"
                    @load="handleImageLoad(`company-${company.company_id}`)"
                    @error="onImageError($event, `company-${company.company_id}`)"
                  >
                  <div v-else :class="$style.noImage">
                    <span :class="$style.fallbackText">{{ company.company_name }}</span>
                  </div>
                </div>
                <div :class="$style.cardContent">
                  <h4>{{ company.company_name }}</h4>
                  <button 
                    @click="unfollowCompany(company)" 
                    :class="$style.unfollowButton">
                    Dejar de seguir
                  </button>
                </div>
              </div>
            </div>

            <div v-if="companies.length === 0" :class="$style.emptyState">
              <p>Aún no sigues ninguna productora</p>
            </div>
          </div>

          <div v-else-if="activeTab === 'streaming'" :class="$style.companiesTab">
            <div :class="$style.grid">
              <div
                v-for="service in streamingServices"
                :key="service.provider_id"
                :class="$style.card">
                <div
                  @click="openStreaming(service.provider_id)"
                  :class="$style.cardImage">
                  <button
                    type="button"
                    :class="$style.externalLinkBtn"
                    title="Abrir en nueva pestaña"
                    @click.stop.prevent="openExternal(streamingPath(service.provider_id))">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 3h7v7"/><path d="M10 14L21 3"/><path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6"/>
                    </svg>
                  </button>
                  <div v-show="streamingLogo(service) && !imageLoadStates[`streaming-${service.provider_id}`]" :class="$style.posterLoader">
                    <Loader :size="44" color="#000" />
                  </div>
                  <img
                    v-if="streamingLogo(service)"
                    :src="streamingLogo(service)"
                    :alt="service.provider_name"
                    loading="lazy"
                    decoding="async"
                    :class="[
                      isWordmarkLogo(service) ? $style.companyLogo : $style.providerIcon,
                      { [$style.loaded]: imageLoadStates[`streaming-${service.provider_id}`] }
                    ]"
                    @load="handleImageLoad(`streaming-${service.provider_id}`)"
                    @error="onImageError($event, `streaming-${service.provider_id}`)"
                  >
                  <div v-else :class="$style.noImage">
                    <span :class="$style.fallbackText">{{ service.provider_name }}</span>
                  </div>
                </div>
                <div :class="$style.cardContent">
                  <h4>{{ service.provider_name }}</h4>
                  <button 
                    @click="unfollowStreaming(service)" 
                    :class="$style.unfollowButton">
                    Dejar de seguir
                  </button>
                </div>
              </div>
            </div>

            <div v-if="streamingServices.length === 0" :class="$style.emptyState">
              <p>Aún no sigues ninguna plataforma de streaming</p>
            </div>
          </div>
          <div v-else-if="activeTab === 'users'" :class="$style.usersTab">
            <!-- Sub-tabs: Siguiendo / Seguidores -->
            <div :class="$style.subTabs">
              <button
                :class="[$style.subTabBtn, { [$style.subTabActive]: userSubTab === 'following' }]"
                @click="userSubTab = 'following'">
                Siguiendo ({{ usersCount }})
              </button>
              <button
                :class="[$style.subTabBtn, { [$style.subTabActive]: userSubTab === 'followers' }]"
                @click="switchToFollowers">
                Seguidores ({{ followersCount }})
              </button>
            </div>

            <!-- Lista de siguiendo -->
            <div v-if="userSubTab === 'following'" :class="$style.userList">
              <div 
                v-for="user in userFollows" 
                :key="user.email"
                :class="$style.userRow">
                <img 
                  :src="user.avatar || '/avatars/avatar-ss0.png'" 
                  :alt="user.alias || user.first_name"
                  :class="$style.userAvatar"
                />
                <div :class="$style.userInfo">
                  <NuxtLink :to="user.alias ? `/u/${user.alias}` : '#'" :class="$style.userAlias" @click="close">
                    {{ user.alias ? `@${user.alias}` : (user.first_name || user.email) }}
                  </NuxtLink>
                  <span v-if="user.first_name" :class="$style.userName">{{ user.first_name }}</span>
                </div>
                <button @click="unfollowUser(user)" :class="$style.unfollowButton">Dejar de seguir</button>
              </div>
            </div>
            <div v-if="userSubTab === 'following' && userFollows.length === 0" :class="$style.emptyState">
              <p>Aún no sigues a ningún usuario</p>
            </div>

            <!-- Lista de seguidores -->
            <div v-if="userSubTab === 'followers'">
              <div v-if="followersLoading" :class="$style.loader" style="padding:2rem 0;">
                <Loader :size="44" color="#8BE9FD" />
              </div>
              <div v-else :class="$style.userList">
                <div
                  v-for="follower in userFollowers"
                  :key="follower.email"
                  :class="$style.userRow">
                  <img
                    :src="follower.avatar || '/avatars/avatar-ss0.png'"
                    :alt="follower.alias || follower.first_name || follower.email"
                    :class="$style.userAvatar"
                  />
                  <div :class="$style.userInfo">
                    <NuxtLink
                      :to="follower.alias ? `/u/${follower.alias}` : '#'"
                      :class="$style.userAlias"
                      @click="close"
                    >
                      {{ follower.alias ? `@${follower.alias}` : (follower.first_name || follower.email) }}
                    </NuxtLink>
                    <span v-if="follower.first_name" :class="$style.userName">{{ follower.first_name }}</span>
                  </div>
                </div>
              </div>
              <div v-if="!followersLoading && userFollowers.length === 0" :class="$style.emptyState">
                <p>Aún no tenés seguidores</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  getFollowedProductionCompanies, 
  unfollowProductionCompany, 
  followProductionCompany 
} from '~/utils/api';
import { STREAMING_PROVIDERS, STREAMING_CUSTOM_LOGOS } from '~/utils/constants';
import Loader from '@/components/Loader';

export default {
  components: {
    Loader
  },
  props: {
    initialTab: {
      type: String,
      default: 'people'
    }
  },
  data() {
    return {
      isVisible: false,
      activeTab: 'people',
      userSubTab: 'following',
      people: [],
      tvShows: [],
      companies: [],
      streamingServices: [],
      userFollows: [],
      userFollowers: [],
      followersLoading: false,
      followersLoaded: false,
      loading: false,
      undoItem: null,
      undoTimeout: null,
      collapsedDepartments: {},
      imageLoadStates: {},
      fallbackImageUrl: "/placeholders/image_not_found_yet_es.webp"
    };
  },
  
  computed: {
    groupedPeople() {
      const groups = {};
      this.people.forEach(p => {
        const type = p.person_type || 'other';
        if (!groups[type]) groups[type] = [];
        groups[type].push(p);
      });
      return groups;
    },
    peopleCount() {
      return this.people.length;
    },
    tvCount() {
      return this.tvShows.length;
    },
    companiesCount() {
        return this.companies.length;
    },
    streamingCount() {
        return this.streamingServices.length;
    },
    usersCount() {
        return this.userFollows.length;
    },
    followersCount() {
        return this.userFollowers.length;
    },
    followsApiUrl() {
        return 'https://cinemagoria-follows-746175915741.us-east1.run.app';
    }
  },

  watch: {
    initialTab: {
      immediate: true,
      handler(val) {
        if (val) this.activeTab = val;
      }
    }
  },

  mounted() {
    this.$bus.$on('show-following-modal', this.show);
  },

  beforeDestroy() {
    this.$bus.$off('show-following-modal');
    if (this.undoTimeout) {
      clearTimeout(this.undoTimeout);
    }
  },

  methods: {
    toggleDepartment(department) {
      this.collapsedDepartments[department] = !this.collapsedDepartments[department];
    },
    
    getUndoText() {
      if (!this.undoItem) return '';
      if (this.undoItem.type === 'company') return `${this.undoItem.company_name} dejado de seguir`;
      if (this.undoItem.type === 'streaming') return `${this.undoItem.provider_name} dejado de seguir`;
      if (this.undoItem.type === 'tv') return `${this.undoItem.tv_name} dejado de seguir`;
      return `${this.undoItem.name} dejado de seguir`;
    },

    show() {
      this.isVisible = true;
      this.userSubTab = 'following';
      this.followersLoaded = false;
      this.fetchData();
      this.fetchFollowers();
    },

    close() {
      this.isVisible = false;
    },

    async fetchData() {
      const userEmail = localStorage.getItem('email');
      if (!userEmail) return;

      this.loading = true;
      this.followersLoaded = false;
      try {
        const [peopleResponse, tvResponse, streamingResponse] = await Promise.all([
          fetch(`${this.followsApiUrl}/follows/list?user_email=${encodeURIComponent(userEmail)}`),
          fetch(`${this.followsApiUrl}/tv-follows/list?user_email=${encodeURIComponent(userEmail)}`),
          fetch(`${this.followsApiUrl}/streaming-follows/list?user_email=${encodeURIComponent(userEmail)}`)
        ]);

        if (peopleResponse.ok) {
          const data = await peopleResponse.json();
          this.people = data.follows || [];
          this.people.forEach(p => {
             const dept = p.person_type || 'other';
             if (this.collapsedDepartments[dept] === undefined) {
               this.collapsedDepartments[dept] = false;
             }
          });
        }

        if (tvResponse.ok) {
          const data = await tvResponse.json();
          this.tvShows = data.tv_follows || [];
        }

        if (streamingResponse.ok) {
           const data = await streamingResponse.json();
           this.streamingServices = data.streaming_follows || [];
        }

        this.companies = await getFollowedProductionCompanies(userEmail);

        try {
          const uResp = await fetch(`${this.followsApiUrl}/user-follows/list?user_email=${encodeURIComponent(userEmail)}`);
          if (uResp.ok) {
            const d = await uResp.json();
            this.userFollows = d.following || [];
          }
        } catch(e) { console.error('Error fetching user follows:', e); }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        this.loading = false;
      }
    },

    async switchToFollowers() {
      this.userSubTab = 'followers';
      if (!this.followersLoaded) {
        await this.fetchFollowers();
      }
    },

    async fetchFollowers() {
      const userEmail = localStorage.getItem('email');
      if (!userEmail) return;
      this.followersLoading = true;
      try {
        const resp = await fetch(`${this.followsApiUrl}/user-follows/followers?user_email=${encodeURIComponent(userEmail)}`);
        if (resp.ok) {
          const d = await resp.json();
          this.userFollowers = d.followers || [];
          this.followersLoaded = true;
        }
      } catch(e) {
        console.error('Error al cargar seguidores:', e);
      } finally {
        this.followersLoading = false;
      }
    },

    formatDepartment(dept) {
      const map = {
        'actor': 'Intérpretes',
        'director': 'Dirección',
        'writer': 'Guion',
        'other': 'Otros'
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

    async unfollowCompany(company) {
      const userEmail = localStorage.getItem('email');
      if (!userEmail) return;

      this.companies = this.companies.filter(c => c.company_id !== company.company_id);

      this.undoItem = { ...company, type: 'company' };
      this.startUndoTimer();

      try {
        await unfollowProductionCompany(userEmail, company.company_id);
        this.$emit('unfollow-updated');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('following-updated'));
        }
      } catch (error) {
        console.error('Error unfollowing company:', error);
        this.companies.push(company);
      }
    },

    async unfollowStreaming(service) {
      const userEmail = localStorage.getItem('email');
      if (!userEmail) return;

      this.streamingServices = this.streamingServices.filter(s => s.provider_id !== service.provider_id);

      this.undoItem = { ...service, type: 'streaming' };
      this.startUndoTimer();

      try {
        await fetch(`${this.followsApiUrl}/streaming-follows/remove?user_email=${encodeURIComponent(userEmail)}&provider_id=${service.provider_id}`, {
          method: 'DELETE'
        });
        this.$emit('unfollow-updated');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('following-updated'));
        }
      } catch (error) {
        console.error('Error unfollowing streaming service:', error);
        this.streamingServices.push(service);
      }
    },

    async unfollowUser(user) {
      const userEmail = localStorage.getItem('email');
      if (!userEmail) return;
      this.userFollows = this.userFollows.filter(u => u.email !== user.email);
      try {
        await fetch(
          `${this.followsApiUrl}/user-follows/remove?follower_email=${encodeURIComponent(userEmail)}&followed_email=${encodeURIComponent(user.email)}`,
          { method: 'DELETE' }
        );
        this.$emit('unfollow-updated');
        if (typeof window !== 'undefined') window.dispatchEvent(new Event('following-updated'));
      } catch (error) {
        console.error('Error dejando de seguir usuario:', error);
        this.userFollows.push(user);
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
        } else if (this.undoItem.type === 'tv') {
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
        } else if (this.undoItem.type === 'company') {
          await followProductionCompany(
            userEmail,
            this.undoItem.company_id,
            this.undoItem.company_name,
            this.undoItem.logo_path || null,
            this.undoItem.origin_country || null
          );
          this.companies.push(this.undoItem);
        } else if (this.undoItem.type === 'streaming') {
          const response = await fetch(`${this.followsApiUrl}/streaming-follows/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_email: userEmail,
              provider_id: this.undoItem.provider_id,
              provider_name: this.undoItem.provider_name,
              logo_path: this.undoItem.logo_path || null
            })
          });
          if (response.ok) {
            this.streamingServices.push(this.undoItem);
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
      this.close();
      this.$router.push(`/person/${personId}`);
    },

    openCompany(companyId) {
      this.close();
      this.$router.push(`/production/${companyId}`);
    },

    openStreaming(providerId) {
      this.close();
      const providerConst = STREAMING_PROVIDERS.find(p => p.id === providerId);
      
      if (providerConst && providerConst.slug) {
        this.$router.push(`/streaming/${providerConst.slug}`);
      } else {
         console.error(`Could not find slug for provider with ID: ${providerId}`);
         this.$router.push(`/streaming/${providerId}`);
      }
    },

    openTvShow(tvId) {
      this.close();
      this.$router.push(`/tv/${tvId}`);
    },

    streamingLogo(service) {
      const custom = STREAMING_CUSTOM_LOGOS[service.provider_id];
      if (custom) return custom;
      return service.logo_path ? `https://image.tmdb.org/t/p/w300${service.logo_path}` : null;
    },

    isWordmarkLogo(service) {
      return Boolean(STREAMING_CUSTOM_LOGOS[service.provider_id]);
    },

    streamingPath(providerId) {
      const providerConst = STREAMING_PROVIDERS.find(p => p.id === providerId);
      const slug = (providerConst && providerConst.slug) ? providerConst.slug : providerId;
      return `/streaming/${slug}`;
    },

    openExternal(path) {
      if (typeof window === 'undefined') return;
      window.open(path, '_blank', 'noopener,noreferrer');
    },

    handleImageLoad(id) {
      this.imageLoadStates[id] = true;
    },

    onImageError(event, id) {
       this.imageLoadStates[id] = true;
       if (event.target.src !== this.fallbackImageUrl) {
         event.target.src = this.fallbackImageUrl;
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
  background: rgba(1, 4, 6, 0.82);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1002;
  padding: 2rem;
}

.modalContent {
  background-color: #040E13;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 28' width='56' height='28'%3E%3Cpath fill='%237ed2e3' fill-opacity='0.06' d='M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0zm-5.43 2.71c1.13-.72 2.3-1.37 3.54-1.93a19.98 19.98 0 0 0-32.76 0c1.23.56 2.41 1.2 3.54 1.93a15.98 15.98 0 0 1 25.68 0zm-4.67 3.78c.94-.95 1.96-1.83 3.03-2.63a13.98 13.98 0 0 0-22.4 0c1.07.8 2.09 1.68 3.03 2.63a9.99 9.99 0 0 1 16.34 0z'%3E%3C/path%3E%3C/svg%3E"),
    radial-gradient(110% 80% at 8% 0%, rgba(31, 84, 103, 0.26), transparent 52%),
    linear-gradient(150deg, #071820 0%, #040D12 58%, #02080B 100%);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(139, 233, 253, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(139, 233, 253, 0.18);
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modalHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex: 0 0 auto;
  padding: 2rem;
  border-bottom: 1px solid rgba(139, 233, 253, 0.12);

  h2 {
    font-size: 2.4rem;
    color: #8BE9FD;
    margin: 0 0 0.5rem 0;
    text-align: center;
  }
}

.headerContent {
  flex: 1;
  text-align: center;
}

.modalSubtitle {
  color: rgb(172, 175, 181);
  font-size: 13px;
  margin: 0.5rem auto 0;
  max-width: 500px;
  text-align: center;
}

.closeButton {
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(139, 233, 253, 0.08);
  border: 1px solid rgba(139, 233, 253, 0.22);
  color: #8BE9FD;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;

  &:hover {
    background: rgba(139, 233, 253, 0.18);
    border-color: rgba(139, 233, 253, 0.5);
    color: #fff;
  }
}

.tabs {
  display: flex;
  flex: 0 0 auto;
  gap: 0.4rem;
  padding: 0 1.6rem;
  border-bottom: 1px solid rgba(139, 233, 253, 0.12);
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;

  &::-webkit-scrollbar { display: none; }

  button {
    position: relative;
    flex: 1 0 auto;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    line-height: 1.2;
    padding: 1.5rem 1.2rem;
    white-space: nowrap;
    text-align: center;
    cursor: pointer;
    transition: color 0.2s ease;

    &.active { color: #8BE9FD; }

    &.active::after {
      content: '';
      position: absolute;
      left: 1.2rem;
      right: 1.2rem;
      bottom: -1px;
      height: 2px;
      border-radius: 2px;
      background: linear-gradient(90deg, #1F5467, #8BE9FD);
      box-shadow: 0 0 12px rgba(139, 233, 253, 0.5);
    }
  }
}

@media (hover: hover) and (pointer: fine) {
  .tabs button:not(.active):hover { color: #fff; }
}

.undoBarContainer {
  flex: 0 0 auto;
  padding: 1.4rem 2rem 0;
}

.undoBar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.2rem;
  padding: 1rem 1.2rem 1rem 1.8rem;
  border-radius: 14px;
  border: 1px solid rgba(139, 233, 253, 0.22);
  background: linear-gradient(90deg, rgba(31, 84, 103, 0.55), rgba(139, 233, 253, 0.08));
  color: #E8F6FA;
  font-size: 1.35rem;
}

.undoButton {
  flex: 0 0 auto;
  height: 3.2rem;
  padding: 0 1.8rem;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #1F5467, #8BE9FD);
  color: #03242C;
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}

@media (hover: hover) and (pointer: fine) {
  .undoButton:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px -8px rgba(139, 233, 253, 0.8);
  }
}

.modalBody {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 2rem;
}

.departmentHeader {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  color: #8BE9FD;
}

.departmentGroup {
  margin-bottom: 2rem;
}

.departmentTitle {
  font-size: 1.5rem;
  color: inherit;
  margin-bottom: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(105px, 1fr));
  gap: 12px;
  padding: 10px 0;

  @media (min-width: $breakpoint-medium) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}

.companyLogo {
  opacity: 0;
  transition: opacity 0.45s ease;
}

.companyLogo.loaded {
  opacity: 1;
}

.cardImage img.companyLogo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 14px;
  background: transparent;
  filter: brightness(0);
}

.providerIcon {
  opacity: 0;
  transition: opacity 0.45s ease;
}

.providerIcon.loaded {
  opacity: 1;
}

.cardImage img.providerIcon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 16px;
  background: transparent;
  filter: none;
}

.cardImage {
  position: relative;
  background: var(--logo-surface);
  border-radius: 10px;
  padding-top: 140%;
  cursor: pointer;
  overflow: hidden;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  img.loaded {
    opacity: 1;
  }
}

.externalLinkBtn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.65);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  z-index: 5;
  opacity: 0.85;
  transition: opacity 0.2s ease, background 0.2s ease, color 0.2s ease;

  &:hover {
    opacity: 1;
    background: #8BE9FD;
    color: #000;
  }

  svg {
    display: block;
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
  color: #03242C;
  padding: 1rem;
  text-align: center;
}

.fallbackText {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.2rem;
  line-height: 1.25;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  text-wrap: balance;
  word-break: break-word;
  color: #03242C;
}

.cardContent {
  padding: 0.8rem 0.2rem 0;

  h4 {
    font-family: var(--font-display);
    font-size: 1.15rem;
    font-weight: 600;
    color: #fff;
    margin: 0 0 0.7rem 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }
}

.status {
  font-size: 1rem;
  color: #80868b;
  margin: -0.4rem 0 0.7rem;
  text-align: center;
  letter-spacing: 0.03em;
}

.unfollowButton {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  height: 2.8rem;
  padding: 0 0.8rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  color: #ACAFB5;
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

  &::before {
    content: '';
    width: 1rem;
    height: 1rem;
    flex: 0 0 auto;
    background: currentColor;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='3' stroke-linecap='round'%3E%3Cpath d='M6 6l12 12M18 6L6 18'/%3E%3C/svg%3E") center / contain no-repeat;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='3' stroke-linecap='round'%3E%3Cpath d='M6 6l12 12M18 6L6 18'/%3E%3C/svg%3E") center / contain no-repeat;
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 122, 122, 0.7);
    outline-offset: 2px;
  }
}

@media (hover: hover) and (pointer: fine) {
  .unfollowButton:hover {
    color: #FF8A8A;
    background: rgba(255, 76, 76, 0.12);
    border-color: rgba(255, 76, 76, 0.45);
    box-shadow: 0 6px 18px -8px rgba(255, 76, 76, 0.6);
  }
}
.emptyState {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.4rem;
  padding: 6rem 2rem;
  text-align: center;
  color: #80868b;
  font-size: 1.45rem;

  p { margin: 0; }

  &::before {
    content: '';
    width: 4.8rem;
    height: 4.8rem;
    border-radius: 50%;
    border: 1px solid rgba(139, 233, 253, 0.24);
    background:
      rgba(139, 233, 253, 0.06)
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M12 5v14M5 12h14'/%3E%3C/svg%3E") center / 2rem 2rem no-repeat;
    box-shadow: 0 0 24px -8px rgba(139, 233, 253, 0.5);
  }
}

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  min-height: 50vh;
}

.posterLoader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.modalWrapper {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  max-height: 90vh;

  @media (max-width: 600px) {
    max-height: 80vh;
    max-height: 80dvh;
  }
}

@media (max-width: 600px) {
  .modalOverlay {
    padding: 10px;
  }

  .modalContent {
    max-height: 80vh;
    max-height: 80dvh;
    border-radius: 12px;
  }
}

.modalHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 0 0 auto;
  padding: 2rem;
  border-bottom: 1px solid rgba(139, 233, 253, 0.12);

  h2 {
    font-size: 2.4rem;
    margin: 0;
    flex: 1;
    text-align: center;
  }
}

.title-primary {
  font-size: 2.4rem;
  color: #8BE9FD;
}

.tabLabel {
  text-transform: uppercase;
  margin: 0 auto;
  position: relative;
}

/* ── Users tab ──────────────────────────────────────────────────────────── */
.usersTab {
  padding: 0.5rem 0;
}

.subTabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.2rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 0.8rem;
}

.subTabBtn {
  background: transparent;
  border: 1px solid rgba(139, 233, 253, 0.3);
  color: rgba(255,255,255,0.6);
  border-radius: 20px;
  padding: 0.4rem 1.2rem;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #8BE9FD;
    color: #8BE9FD;
  }
}

.subTabActive {
  background: rgba(139, 233, 253, 0.15);
  border-color: #8BE9FD;
  color: #8BE9FD;
}


.userList {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.userRow {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);

  &:last-child {
    border-bottom: none;
  }

  /* Fix for the unfollow button in this specific context */
  .unfollowButton {
    width: auto;
    min-width: 100px;
    padding: 8px 16px;
    margin-left: auto;
  }
}

.userAvatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid rgba(139, 233, 253, 0.3);
}

.userInfo {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.userAlias {
  font-size: 1.35rem;
  font-weight: 600;
  color: #8BE9FD;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover { text-decoration: underline; }
}

.userName {
  font-size: 1.15rem;
  color: rgba(255,255,255,0.55);
}
/* ──────────────────────────────────────────────────────────────────────── */
</style>
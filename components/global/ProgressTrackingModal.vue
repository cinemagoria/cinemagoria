<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <div class="header-content">
          <h2 class="title-primary">Tracking Progress</h2>
          <p class="modal-subtitle">
            Manage your watch progress for movies and series.
          </p>
        </div>
        <button class="close-btn" @click="closeModal" aria-label="Close modal"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>

      <div class="tab-controls">
        <button 
          :class="['tab-btn', { active: currentTab === 'movies' }]" 
          @click="switchToTab('movies')"
        >
          <span class="tab-labels">Movies</span>
        </button>
        <button 
          :class="['tab-btn', { active: currentTab === 'tv' }]" 
          @click="switchToTab('tv')"
        >
          <span class="tab-labels">TV Shows</span>
        </button>
      </div>

      <div class="modal-body-wrapper" ref="modalBodyWrapper" @scroll="handleScroll">
        <div class="modal-body">
          <div v-if="loading" class="loading-state">
            <Loader :size="60" color="#8BE9FD" />
          </div>
          
          <div v-else>
            <!-- MOVIES TAB -->
            <div v-if="currentTab === 'movies'">
              <div class="sub-tab-controls">
                <button :class="['sub-tab-btn', { active: movieSubTab === 'active' }]" @click="movieSubTab = 'active'">
                  Active <span class="sub-tab-count">{{ inProgressMovies.length }}</span>
                </button>
                <button :class="['sub-tab-btn', { active: movieSubTab === 'completed' }]" @click="movieSubTab = 'completed'">
                  Completed <span class="sub-tab-count">{{ completedMovies.length }}</span>
                </button>
              </div>

              <div v-if="!visibleMovies.length" class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                <h3 v-if="movieSubTab === 'completed'">No completed movies</h3>
                <h3 v-else>No movies in progress</h3>
                <p v-if="movieSubTab === 'completed'">Movies you finish at 100% will appear here.</p>
                <p v-else>Start tracking some movies to see them here.</p>
              </div>
              <div v-else class="rated-items-grid">
                <div v-for="item in visibleMovies" :key="`movie-${item.media_id}`"
                     class="rated-item-card"
                     :class="{ 'is-completed': movieSubTab === 'completed' }"
                     @click="openTrackingModal(item)"
                     :title="item.details && item.details.title ? item.details.title : ''">
                  <div v-if="!imageLoadingStates[item.media_id]" class="poster-skeleton"></div>
                  <img
                    :src="item.details && item.details.poster_path ? `https://image.tmdb.org/t/p/w200${item.details.poster_path}` : '/placeholders/image_not_found_yet.webp'"
                    :alt="item.details ? item.details.title : 'Movie'"
                    class="poster-image"
                    loading="lazy"
                    decoding="async"
                    @load="onImageLoad(item.media_id)"
                    @error="onImageLoad(item.media_id)"
                    :class="{ 'is-loaded': imageLoadingStates[item.media_id] }"
                  />
                  <span v-if="movieSubTab === 'completed'" class="completed-badge" aria-label="Completed">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <div class="overlay-actions">
                    <button v-if="movieSubTab === 'completed'" class="edit-btn-fixed move-btn" @click.stop="setMovieActive(item, true)" title="Move to Active" aria-label="Move to Active">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/></svg>
                    </button>
                    <button class="edit-btn-fixed" @click.stop="openTrackingModal(item)" title="Edit Progress" aria-label="Edit Progress">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                    </button>
                  </div>
                  <div class="item-info">
                    <span class="item-title item-title-link" @click.stop="navigateToMovie(item.media_id)" :title="item.details && item.details.title ? `Open ${item.details.title}` : ''">{{ item.details ? item.details.title : '' }}</span>
                    <span class="item-rating">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {{ item.progress_percentage }}%
                    </span>
                    <span class="item-progress" aria-hidden="true">
                      <span class="item-progress__fill" :style="{ width: `${Math.min(100, Math.max(0, item.progress_percentage || 0))}%` }"></span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- TV TAB -->
            <div v-if="currentTab === 'tv'">
              <div v-if="!activeTvShow" class="sub-tab-controls">
                <button :class="['sub-tab-btn', { active: tvSubTab === 'active' }]" @click="tvSubTab = 'active'">
                  Active <span class="sub-tab-count">{{ inProgressTvShows.length }}</span>
                </button>
                <button :class="['sub-tab-btn', { active: tvSubTab === 'completed' }]" @click="tvSubTab = 'completed'">
                  Completed <span class="sub-tab-count">{{ completedTvShows.length }}</span>
                </button>
              </div>

              <div v-if="!groupedTvShows.length" class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                <h3>No series in progress</h3>
                <p>Track your watched episodes and seasons to see them here.</p>
              </div>

              <div v-else-if="!activeTvShow && !visibleTvShows.length" class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                <h3 v-if="tvSubTab === 'completed'">No completed series</h3>
                <h3 v-else>No active series</h3>
                <p v-if="tvSubTab === 'completed'">Series will appear here when every aired episode is marked at 100%.</p>
                <p v-else>All your tracked series are fully complete. Nice.</p>
              </div>

              <!-- LEVEL 1: TV SHOWS LIST -->
              <div v-else-if="!activeTvShow" class="rated-items-grid">
                <div v-for="show in visibleTvShows" :key="`tv-${show.id}`"
                     class="rated-item-card tv-card"
                     :class="{ 'is-completed': tvSubTab === 'completed' }"
                     @click="openTvShow(show)"
                     :title="show.details && show.details.name ? show.details.name : ''">
                  <div v-if="!imageLoadingStates['tv-'+show.id]" class="poster-skeleton"></div>
                  <img
                    :src="show.details && show.details.poster_path ? `https://image.tmdb.org/t/p/w200${show.details.poster_path}` : '/placeholders/image_not_found_yet.webp'"
                    :alt="show.details ? show.details.name : 'TV Show'"
                    class="poster-image"
                    loading="lazy"
                    decoding="async"
                    @load="onImageLoad('tv-'+show.id)"
                    @error="onImageLoad('tv-'+show.id)"
                    :class="{ 'is-loaded': imageLoadingStates['tv-'+show.id] }"
                  />
                  <span v-if="tvSubTab === 'completed'" class="completed-badge" aria-label="Completed">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <div class="overlay-actions">
                    <button class="edit-btn-fixed" @click.stop="openTvShow(show)" title="View Episodes" aria-label="View Episodes">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                    </button>
                  </div>
                  <div class="item-info">
                    <span class="item-title item-title-link" @click.stop="navigateToTvShow(show.id)" :title="show.details && show.details.name ? `Open ${show.details.name}` : ''">{{ show.details ? show.details.name : '' }}</span>
                    <span class="item-rating">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <template v-if="tvSubTab === 'completed'">Completed</template>
                      <template v-else>{{ show.trackedCount }} tracked {{ show.trackedCount === 1 ? 'episode' : 'episodes' }}</template>
                    </span>
                  </div>
                </div>
              </div>

              <!-- LEVEL 2 & 3: TV SHOW DETAILS (SEASONS & EPISODES) -->
              <div v-else class="tv-details-view">
                <div class="breadcrumb-header">
                  <button class="back-btn" @click="activeTvShow = null">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    <span class="back-text">Back to Series</span>
                  </button>
                  <h3 class="active-title" @click="navigateToTvShow(activeTvShow.id)" title="Go to TV Show page">{{ activeTvShow.details?.name }}</h3>
                </div>

                <div v-for="season in activeTvShow.seasons" :key="season.seasonNumber" class="season-section">
                  <div class="season-header" @click="toggleSeason(season.seasonNumber)">
                    <div class="season-title-info">
                      <span class="season-name">Season {{ season.seasonNumber }}</span>
                      <span class="season-count">{{ season.episodes.length }} items tracked</span>
                    </div>
                    
                    <div class="season-progress">
                      <div class="season-progress-bar">
                        <div class="season-progress-fill" :style="{ width: `${season.averageProgress}%` }"></div>
                      </div>
                      <span class="season-progress-text">{{ Math.round(season.averageProgress) }}%</span>
                      <svg class="chevron" :class="{'open': openSeasons.includes(season.seasonNumber)}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>

                  <div v-show="openSeasons.includes(season.seasonNumber)" class="season-episodes-grid">
                    <div v-for="ep in season.episodes" :key="`ep-${ep.media_id}`"
                         class="rated-item-card episode-card"
                         @click="openTrackingModal(ep)"
                         :title="ep.details && ep.details.name ? ep.details.name : ''">
                      <div v-if="!imageLoadingStates[ep.media_id]" class="poster-skeleton"></div>
                      <img
                        :src="ep.details && ep.details.still_path ? `https://image.tmdb.org/t/p/w300${ep.details.still_path}` : '/placeholders/image_not_found_yet_horizontal.webp'"
                        :alt="ep.details ? ep.details.name : 'Episode'"
                        class="poster-image still-image"
                        loading="lazy"
                        decoding="async"
                        @load="onImageLoad(ep.media_id)"
                        @error="onImageLoad(ep.media_id)"
                        :class="{ 'is-loaded': imageLoadingStates[ep.media_id], 'is-placeholder-img': !(ep.details && ep.details.still_path) }"
                      />
                      <div class="overlay-actions">
                        <button class="edit-btn-fixed" @click.stop="openTrackingModal(ep)" title="Edit Progress" aria-label="Edit Progress">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                        </button>
                      </div>
                      <div class="item-info">
                        <span class="item-title item-title-link" @click.stop="navigateToTvShow(activeTvShow.id)" :title="activeTvShow && activeTvShow.details ? `Open ${activeTvShow.details.name}` : ''">{{ ep.details ? ep.details.name : '' }}</span>
                        <span class="item-subtitle">S{{ ep.season_number }} E{{ ep.episode_number }}</span>
                        <span class="item-rating">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {{ ep.progress_percentage }}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Inner modal for editing progress -->
    <div v-if="trackingModalVisible" class="rating-modal-overlay" @click.self.stop="closeTrackingModal">
      <div class="rating-modal-content rating-modal" @click.stop>
        <div class="modal-header sub-modal-header">
          <h3 v-if="currentTrackedItem?.media_type === 'episode'">
             Progress:
             <span class="highlight highlight-link" v-if="activeTvShow" @click="navigateToTvShow(activeTvShow.id)">{{ activeTvShow.details?.name }}</span>
             <span class="highlight" v-else>Episodes</span>
             <span style="opacity: 0.7; font-size: 0.85em; font-weight: 400; margin-left: 4px;"> - S{{ currentTrackedItem.season_number }} E{{ currentTrackedItem.episode_number }}</span>
          </h3>
          <h3 v-else>
             Progress: <span class="highlight highlight-link" @click="navigateToMovie(currentTrackedItem?.media_id)">{{ currentTrackedItem?.details?.title || currentTrackedItem?.details?.name }}</span>
          </h3>
          <button class="close-btn" @click="closeTrackingModal" aria-label="Close"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        
        <div class="rating-content">
          <div class="mpb-section" style="margin-top: 10px; margin-bottom:20px;">
            <div class="mpb-row">
              <div class="mpb-circle-wrap">
                <svg class="mpb-svg" viewBox="0 0 120 120">
                  <defs><linearGradient id="pgTM2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8AE8FC"/><stop offset="100%" stop-color="#50C8E8"/></linearGradient></defs>
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(138,232,252,0.1)" stroke-width="6"/>
                  <circle cx="60" cy="60" r="52" fill="none" stroke="url(#pgTM2)" stroke-width="6" stroke-linecap="round" :stroke-dasharray="2 * Math.PI * 52" :stroke-dashoffset="2 * Math.PI * 52 * (1 - tempProgressPercentage / 100)" style="transform:rotate(-90deg);transform-origin:center;transition:stroke-dashoffset .35s ease"/>
                </svg>
                <div class="mpb-pct"><span class="mpb-pct-num">{{ tempProgressPercentage }}</span><span class="mpb-pct-sign">%</span></div>
              </div>
              <div class="mpb-controls">
                <input
                    v-if="runtimeHelper"
                    type="range"
                    class="mpb-slider custom-slider"
                    min="0"
                    :max="runtimeHelper"
                    step="1"
                    :value="tempWatchedMinutes"
                    aria-label="Minutes watched"
                    @input="setWatchedMinutes($event.target.value)" />
                  <input v-else type="range" class="mpb-slider custom-slider" min="0" max="100" step="1" v-model.number="tempProgressPercentage" />
                <div v-if="currentTrackedItem?.total_duration_minutes || currentTrackedItem?.details?.runtime" class="mpb-times">
                  <div class="mpb-time">
                    <span class="mpb-time-label">Watched</span>
                    <span class="mpb-time-entry">
                      <input type="number" min="0" :max="Math.floor(runtimeHelper / 60)" v-model.number="watchedHours" aria-label="Hours watched">
                      <em>h</em>
                      <input type="number" min="0" max="59" v-model.number="watchedMins" aria-label="Minutes watched">
                      <em>m</em>
                    </span>
                  </div>
                  <div class="mpb-time"><span class="mpb-time-label">Remaining</span><span class="mpb-time-val">{{ remainingMinutes }}m</span></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="rating-modal-buttons" style="margin-top:30px;">
            <button 
              @click="removeTracking" 
              class="remove-rating-btn"
            >
              <span style="position:relative; margin:0 auto;">Delete</span>
            </button>
            
            <button 
              @click="saveTracking" 
              class="save-btn"
            >
              <span style="position:relative; margin:0 auto;">Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '@/components/Loader';

export default {
  name: 'ProgressTrackingModal',
  
  components: {
    Loader
  },

  data() {
    return {
      isOpen: false,
      userEmail: '',
      loading: false,
      isScrolled: false,
      currentTab: 'movies',
      movieSubTab: 'active',
      tvSubTab: 'active',

      groupedMovies: [],
      groupedTvShows: [],

      activeTvShow: null,
      openSeasons: [],

      imageLoadingStates: {},
      trackingModalVisible: false,
      currentTrackedItem: null,
      tempProgressPercentage: 0,
      tempWatchedMinutes: 0
    };
  },

  computed: {
    runtimeHelper() {
      return this.currentTrackedItem?.total_duration_minutes || this.currentTrackedItem?.details?.runtime || 0;
    },
    watchedHours: {
      get() { return Math.floor(this.tempWatchedMinutes / 60); },
      set(value) { this.setWatchedMinutes((Number(value) || 0) * 60 + (this.tempWatchedMinutes % 60)); },
    },
    watchedMins: {
      get() { return this.tempWatchedMinutes % 60; },
      set(value) { this.setWatchedMinutes(Math.floor(this.tempWatchedMinutes / 60) * 60 + (Number(value) || 0)); },
    },
    remainingMinutes() {
      return Math.max(0, this.runtimeHelper - this.tempWatchedMinutes);
    },
    inProgressMovies() {
      return this.groupedMovies.filter(m =>
        (m.progress_percentage || 0) < 100 || m.manually_active === 1
      );
    },
    completedMovies() {
      return this.groupedMovies.filter(m =>
        (m.progress_percentage || 0) >= 100 && m.manually_active !== 1
      );
    },
    visibleMovies() {
      return this.movieSubTab === 'completed' ? this.completedMovies : this.inProgressMovies;
    },
    inProgressTvShows() {
      return this.groupedTvShows.filter(s => !this.isShowFullyCompleted(s));
    },
    completedTvShows() {
      return this.groupedTvShows.filter(s => this.isShowFullyCompleted(s));
    },
    visibleTvShows() {
      return this.tvSubTab === 'completed' ? this.completedTvShows : this.inProgressTvShows;
    }
  },

  mounted() {
    if (import.meta.client) {
      this.userEmail = localStorage.getItem('email')?.replace(/['"]+/g, '') || '';
      
      this.$bus.$on('open-tracking-modal', () => {
        this.openModal();
      });
      
      document.addEventListener('keydown', this.handleEscKey);
    }
  },
  
  beforeUnmount() {
    if (import.meta.client) {
      this.$bus.$off('open-tracking-modal');
      document.removeEventListener('keydown', this.handleEscKey);
    }
    document.body.style.overflow = '';
  },
  
  methods: {
    handleEscKey(e) {
      if (e.key === 'Escape') {
        if (this.trackingModalVisible) {
          this.closeTrackingModal();
        } else if (this.isOpen) {
          this.closeModal();
        }
      }
    },
    
    switchToTab(tab) {
      this.currentTab = tab;
      this.activeTvShow = null;
    },

    isShowFullyCompleted(show) {
      const total = show?.details?.total_episodes;
      if (!total || total <= 0) return false;
      let trackedAt100 = 0;
      let allTrackedAt100 = true;
      for (const sea of (show.seasons || [])) {
        for (const ep of (sea.episodes || [])) {
          if ((ep.progress_percentage || 0) >= 100) trackedAt100++;
          else allTrackedAt100 = false;
        }
      }
      return allTrackedAt100 && trackedAt100 >= total;
    },

    async setMovieActive(item, flag) {
      if (!this.userEmail || !item) return;
      try {
        await fetch(`/api/progress/${encodeURIComponent(this.userEmail)}/active/${item.media_type}/${item.media_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ manually_active: flag ? 1 : 0 })
        });
        await this.fetchTrackedItems();
        window.dispatchEvent(new CustomEvent('progress-updated'));
      } catch (e) {
        console.error('Error updating active flag:', e);
      }
    },

    openTvShow(show) {
      this.activeTvShow = show;
      // Auto open first season
      if (show.seasons.length > 0 && this.openSeasons.length === 0) {
        this.openSeasons = [show.seasons[0].seasonNumber];
      }
      this.$nextTick(() => {
          this.handleScroll();
      });
    },

    navigateToTvShow(id) {
      if (!id) return;
      this.closeModal();
      this.$router.push(`/tv/${id}`);
    },

    navigateToMovie(id) {
      if (!id) return;
      this.closeModal();
      this.$router.push(`/movie/${id}`);
    },

    toggleSeason(number) {
        const index = this.openSeasons.indexOf(number);
        if (index > -1) {
            this.openSeasons.splice(index, 1);
        } else {
            this.openSeasons.push(number);
        }
    },

    openModal() {
      this.isOpen = true;
      document.body.style.overflow = 'hidden';
      
      this.fetchTrackedItems();
    },
    
    closeModal() {
      this.isOpen = false;
      document.body.style.overflow = '';
    },
    
    onImageLoad(itemId) {
      this.imageLoadingStates = { ...this.imageLoadingStates, [itemId]: true };
    },
    
    handleScroll() {
      const wrapper = this.$refs.modalBodyWrapper;
      if (!wrapper) return;
      
      if (!this.scrollTicking) {
        window.requestAnimationFrame(() => {
          const maxScroll = wrapper.scrollHeight - wrapper.clientHeight;
          this.isScrolled = maxScroll > 0 && wrapper.scrollTop < maxScroll - 5;
          this.scrollTicking = false;
        });
        this.scrollTicking = true;
      }
    },
    
    async fetchTrackedItems() {
      if (!this.userEmail) return;
      this.loading = true;
      try {
        const response = await fetch(`/api/progress/${encodeURIComponent(this.userEmail)}/hydrated`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const items = Array.isArray(payload?.items) ? payload.items : [];
        const shows = (payload && payload.shows) || {};

        // 1. Movies — already hydrated; drop ones missing details (TMDB unreachable)
        this.groupedMovies = items.filter(i => i.media_type === 'movie' && i.details);

        // 2. TV Shows — group by tv_id, build seasons
        const showMap = new Map();
        for (const i of items) {
          if (i.media_type !== 'episode' || !i.tv_id) continue;
          if (!showMap.has(i.tv_id)) {
            showMap.set(i.tv_id, {
              id: i.tv_id,
              details: shows[i.tv_id] || null,
              seasonMap: {},
              trackedCount: 0
            });
          }
          const show = showMap.get(i.tv_id);
          show.trackedCount += 1;
          if (!show.seasonMap[i.season_number]) {
            show.seasonMap[i.season_number] = {
              seasonNumber: i.season_number,
              episodes: [],
              averageProgress: 0
            };
          }
          show.seasonMap[i.season_number].episodes.push(i);
        }

        const tvShowsList = [];
        for (const show of showMap.values()) {
          if (!show.details) continue;
          const seasons = Object.values(show.seasonMap).sort((a, b) => a.seasonNumber - b.seasonNumber);
          for (const sea of seasons) {
            sea.episodes.sort((a, b) => a.episode_number - b.episode_number);
            const totalPct = sea.episodes.reduce((acc, curr) => acc + (curr.progress_percentage || 0), 0);
            sea.averageProgress = sea.episodes.length ? totalPct / sea.episodes.length : 0;
          }
          tvShowsList.push({
            id: show.id,
            details: show.details,
            seasons,
            trackedCount: show.trackedCount
          });
        }
        this.groupedTvShows = tvShowsList;

        // Re-link activeTvShow if we are currently viewing a show
        if (this.activeTvShow) {
          const stillHasShow = this.groupedTvShows.find(s => s.id === this.activeTvShow.id);
          this.activeTvShow = stillHasShow || null;
        }

        this.$nextTick(() => {
          this.handleScroll();
        });
      } catch (error) {
        console.error('Error fetching tracked items:', error);
      } finally {
        this.loading = false;
      }
    },
    
    setWatchedMinutes(value) {
      const runtime = this.runtimeHelper;
      const next = Math.max(0, Math.round(Number(value) || 0));
      this.tempWatchedMinutes = runtime ? Math.min(runtime, next) : next;
      this.tempProgressPercentage = runtime
        ? Math.min(100, Math.max(0, Math.round((this.tempWatchedMinutes / runtime) * 100)))
        : this.tempProgressPercentage;
    },

    openTrackingModal(item) {
      this.currentTrackedItem = item;
      const runtime = item.total_duration_minutes || item.details?.runtime || 0;
      const stored = Number(item.elapsed_minutes) || 0;
      if (runtime && stored > 0) {
        this.tempWatchedMinutes = Math.min(runtime, stored);
        this.tempProgressPercentage = Math.round((this.tempWatchedMinutes / runtime) * 100);
      } else {
        this.tempProgressPercentage = item.progress_percentage || 0;
        this.tempWatchedMinutes = runtime ? Math.round((runtime * this.tempProgressPercentage) / 100) : 0;
      }
      this.trackingModalVisible = true;
    },

    closeTrackingModal() {
      this.trackingModalVisible = false;
      this.currentTrackedItem = null;
      this.tempProgressPercentage = 0;
      this.tempWatchedMinutes = 0;
    },
    
    async saveTracking() {
      if (!this.currentTrackedItem) return;
      
      try {
        const item = this.currentTrackedItem;
        const durHelper = this.currentTrackedItem?.total_duration_minutes || this.currentTrackedItem?.details?.runtime || 0;
        
        const payload = { 
          progress_percentage: this.tempProgressPercentage, 
          elapsed_minutes: durHelper ? this.tempWatchedMinutes : 0,
          total_duration_minutes: durHelper
        };
        
        if (item.media_type === 'episode') {
          payload.tv_id = item.tv_id;
          payload.season_number = item.season_number;
          payload.episode_number = item.episode_number;
        }

        await fetch(`/api/progress/${encodeURIComponent(this.userEmail)}/${item.media_type}/${item.media_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        this.closeTrackingModal();
        await this.fetchTrackedItems();
        window.dispatchEvent(new CustomEvent('progress-updated'));
      } catch (error) {
        console.error('Error saving tracking:', error);
      }
    },
    
    async removeTracking() {
      if (!this.currentTrackedItem) return;
      
      try {
        const item = this.currentTrackedItem;
        await fetch(`/api/progress/${encodeURIComponent(this.userEmail)}/${item.media_type}/${item.media_id}`, { method: 'DELETE' }).catch(() => {});
        this.closeTrackingModal();
        await this.fetchTrackedItems();
        window.dispatchEvent(new CustomEvent('progress-updated'));
        
        // If it was the last episode of the show and we are still viewing it, go back
        if (this.activeTvShow && item.media_type === 'episode') {
           const stillHasShow = this.groupedTvShows.find(s => s.id === this.activeTvShow.id);
           if (!stillHasShow) this.activeTvShow = null;
        }
      } catch (error) {
        console.error('Error removing tracking:', error);
      }
    }
  }
};
</script>

<style scoped>
.modal-overlay {
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
  z-index: 1000;
  padding: 20px;
  font-family: var(--font-display);
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 900px;
  height: auto;
  max-height: 90vh;
  background-color: #040E13;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 28' width='56' height='28'%3E%3Cpath fill='%237ed2e3' fill-opacity='0.06' d='M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0zm-5.43 2.71c1.13-.72 2.3-1.37 3.54-1.93a19.98 19.98 0 0 0-32.76 0c1.23.56 2.41 1.2 3.54 1.93a15.98 15.98 0 0 1 25.68 0zm-4.67 3.78c.94-.95 1.96-1.83 3.03-2.63a13.98 13.98 0 0 0-22.4 0c1.07.8 2.09 1.68 3.03 2.63a9.99 9.99 0 0 1 16.34 0z'%3E%3C/path%3E%3C/svg%3E"),
    radial-gradient(110% 80% at 8% 0%, rgba(31, 84, 103, 0.26), transparent 52%),
    linear-gradient(150deg, #071820 0%, #040D12 58%, #02080B 100%);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(139, 233, 253, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(139, 233, 253, 0.18);
  
  border-radius: 20px;
  display: flex;
  flex-direction: column;
}

/* ── Header ─────────────────────────────────────────── */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.307);
}

.header-content {
  flex: 1;
  text-align: center;
}

.header-content h2 {
  margin: 0 0 0.5rem 0;
  font-size: 2.4rem;
  font-weight: 300;
  font-family: 'Ortica', 'Roboto', sans-serif;
  letter-spacing: 0.05em;
  line-height: 1.2;
  color: #8BE9FD;
  text-shadow:
      0 1px 2px rgba(255, 255, 255, 0.3),
      0 2px 8px rgba(255, 255, 255, 0.2),
      0 4px 16px rgba(139, 233, 253, 0.15);
  text-align: center;
}

.modal-subtitle {
  color: rgb(172, 175, 181);
  font-size: 13px;
  margin: 0 auto;
  max-width: 500px;
  text-align: center;
}

.close-btn {
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


/* ── Tabs ───────────────────────────────────────────── */
.tab-controls {
  display: flex;
  flex: 0 0 auto;
  gap: 0.4rem;
  padding: 0 1.6rem;
  border-bottom: 1px solid rgba(139, 233, 253, 0.12);
  text-align: center;
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
}

.tab-controls::-webkit-scrollbar { display: none; }

.tab-btn {
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
}

@media (hover: hover) and (pointer: fine) {
  .tab-btn:not(.active):hover { color: #fff; }
}

.tab-btn.active {
  color: #8BE9FD;
}

.tab-btn.active::after {
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

/* ── Body ───────────────────────────────────────────── */
.modal-body-wrapper {
  overflow-y: auto;
  flex-grow: 1;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.modal-body-wrapper::-webkit-scrollbar {
  width: 8px;
}

.modal-body-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.modal-body-wrapper::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
}

.modal-body {
  padding: 20px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
}

.empty-state svg {
  width: 50px;
  height: 50px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  color: #fff;
  font-size: 1.4rem;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.empty-state p {
  font-size: 1.4rem;
  margin: 0;
}

/* ── Grid ───────────────────────────────────────────── */
.rated-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 15px;
  padding: 10px 0;
}

.season-episodes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
  padding: 10px 15px 15px;
}

/* ── Cards ──────────────────────────────────────────── */
.rated-item-card {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  overflow: hidden;
  border: 0.5px solid #8AE8FC;
  transition: transform 0.2s ease;
  position: relative;
  aspect-ratio: 2 / 3;
  cursor: pointer;
}

.rated-item-card.episode-card {
  aspect-ratio: 16 / 9;
}

.rated-item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
}

.rated-item-card.tv-card:hover {
  border-color: #8AE8FC;
}

.poster-skeleton {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
    rgba(255,255,255,0.03) 25%,
    rgba(255,255,255,0.08) 50%,
    rgba(255,255,255,0.03) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.poster-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.poster-image.is-loaded {
  opacity: 1;
}

.poster-image.is-placeholder-img {
  padding: 18px;
  object-fit: contain;
}

/* ── Overlay action buttons (top-right corner) ──────── */
.overlay-actions {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.edit-btn-fixed {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  border: 1px solid rgba(138, 232, 252, 0.3);
  border-radius: 50%;
  width: 34px;
  height: 34px;
  padding: 0;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.edit-btn-fixed:hover {
  background-color: rgba(13, 18, 24, 0.95);
  border-color: #8AE8FC;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
}

.move-btn {
  background-color: rgba(0, 0, 0, 0.7);
  border-color: rgba(138, 232, 252, 0.3);
}
.move-btn:hover {
  background-color: rgba(13, 18, 24, 0.95);
  border-color: #8AE8FC;
}

/* ── Sub-tabs (Active / Completed) ──────────────────── */
.sub-tab-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(138, 232, 252, 0.1);
  border-radius: 10px;
  width: fit-content;
}

.sub-tab-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.sub-tab-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.04);
}

.sub-tab-btn.active {
  color: #0d1218;
  background: #8AE8FC;
}

.sub-tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  border-radius: 11px;
  font-size: 0.9rem;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.35);
  color: #8AE8FC;
}

.sub-tab-btn.active .sub-tab-count {
  background: rgba(13, 18, 24, 0.85);
  color: #8AE8FC;
}

.completed-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #8AE8FC;
  color: #0d1218;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.rated-item-card.is-completed {
  border-color: rgba(138, 232, 252, 0.65);
  box-shadow: inset 0 0 0 1px rgba(138, 232, 252, 0.15);
}

.item-info {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 2.5rem 0.6rem 0.6rem;
  background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%);
  display: flex;
  flex-direction: column;
  z-index: 2;
  pointer-events: none;
}

.item-title-link {
  pointer-events: auto;
  cursor: pointer;
  transition: color 0.2s ease, text-shadow 0.2s ease;
}

.item-title-link:hover {
  color: #8AE8FC;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-shadow: 0 1px 3px rgba(0,0,0,0.9), 0 0 12px rgba(138, 232, 252, 0.45);
}

.item-title {
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
  text-shadow: 0 1px 3px rgba(0,0,0,0.9);
}

.item-subtitle {
  font-size: 1rem;
  color: #8ae8fc;
  margin-bottom: 4px;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0,0,0,0.9);
}

.item-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #8ae8fc;
  font-size: 1.05rem;
  font-weight: 700;
  text-shadow: 0 1px 3px rgba(0,0,0,0.9);
}


/* ── TV SHOW DETAILS VIEW ───────────────────────────── */
.breadcrumb-header {
  display: grid;
  grid-template-columns: 1fr minmax(0, auto) 1fr;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  background: rgba(0,0,0,0.25);
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid rgba(138, 232, 252, 0.1);
}

.back-btn {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.15);
  color: #8BE9FD;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1.15rem;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
  justify-self: start;
}

.back-btn:hover {
  background: rgba(138, 232, 252, 0.12);
  border-color: rgba(138, 232, 252, 0.4);
  color: #8BE9FD;
}

.active-title {
  margin: 0;
  font-size: 1.5rem;
  font-family: 'Ortica', 'Roboto', sans-serif;
  font-weight: 300;
  color: #8BE9FD;
  letter-spacing: 0.03em;
  white-space: nowrap;
  min-width: 0;
  justify-self: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow:
      0 1px 2px rgba(255, 255, 255, 0.2),
      0 2px 8px rgba(255, 255, 255, 0.1),
      0 4px 16px rgba(139, 233, 253, 0.1);
}

.active-title:hover {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
  text-shadow:
      0 1px 4px rgba(255, 255, 255, 0.3),
      0 2px 10px rgba(139, 233, 253, 0.4),
      0 4px 20px rgba(139, 233, 253, 0.3);
}


/* ── Season sections ────────────────────────────────── */
.season-section {
  margin-bottom: 10px;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(138, 232, 252, 0.08);
  border-radius: 10px;
  overflow: hidden;
}

.season-header {
  padding: 14px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: rgba(255,255,255,0.02);
  transition: background 0.2s ease;
  gap: 14px;
}

.season-header:hover {
  background: rgba(255,255,255,0.06);
}

.season-title-info {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-shrink: 0;
}

.season-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
}

.season-count {
  font-size: 1rem;
  color: rgba(255,255,255,0.5);
  font-weight: 500;
}

.season-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  justify-content: flex-end;
  min-width: 0;
}

.season-progress-bar {
  width: 120px;
  height: 6px;
  background: rgba(255,255,255,0.08);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

@media (max-width: 500px) {
  .season-progress-bar {
    display: none;
  }
}

.season-progress-fill {
  position: absolute;
  top: 0; left: 0; bottom: 0;
  background: linear-gradient(90deg, #8AE8FC, #50C8E8);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.season-progress-text {
  font-size: 1.05rem;
  font-weight: 700;
  color: #8BE9FD;
  min-width: 40px;
  text-align: right;
}

.chevron {
  color: rgba(255,255,255,0.4);
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.chevron.open {
  transform: rotate(180deg);
}


/* ── Sub-modal (inner editing modal) ────────────────── */
.rating-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 20px;
  animation: fadeIn 0.15s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.rating-modal {
  width: 100%;
  max-width: 480px;
  background-color: #040E13;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 28' width='56' height='28'%3E%3Cpath fill='%237ed2e3' fill-opacity='0.06' d='M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0zm-5.43 2.71c1.13-.72 2.3-1.37 3.54-1.93a19.98 19.98 0 0 0-32.76 0c1.23.56 2.41 1.2 3.54 1.93a15.98 15.98 0 0 1 25.68 0zm-4.67 3.78c.94-.95 1.96-1.83 3.03-2.63a13.98 13.98 0 0 0-22.4 0c1.07.8 2.09 1.68 3.03 2.63a9.99 9.99 0 0 1 16.34 0z'%3E%3C/path%3E%3C/svg%3E"),
    radial-gradient(110% 80% at 8% 0%, rgba(31, 84, 103, 0.26), transparent 52%),
    linear-gradient(150deg, #071820 0%, #040D12 58%, #02080B 100%);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(139, 233, 253, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(139, 233, 253, 0.18);
  border-radius: 20px;
  overflow: hidden;
  
  display: flex;
  flex-direction: column;
}

.sub-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 22px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.307);
  background: rgba(0, 0, 0, 0.15);
}

.sub-modal-header h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #fff;
  font-weight: 500;
  font-family: 'Ortica', 'Roboto', sans-serif;
  letter-spacing: 0.03em;
  line-height: 1.3;
}

.sub-modal-header h3 .highlight {
  color: #8BE9FD;
}

.highlight-link {
  cursor: pointer;
  transition: text-decoration 0.2s ease;
}

.highlight-link:hover {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.rating-content {
  padding: 20px 28px 24px;
  display: flex;
  flex-direction: column;
}

.rating-modal-buttons {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 25px;
}

.remove-rating-btn {
  background-color: transparent;
  color: #ff6b6b;
  border: 1px solid rgba(255, 107, 107, 0.3);
  padding: 12px 0;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
}

.remove-rating-btn:hover {
  background-color: rgba(255, 107, 107, 0.1);
}

.save-btn {
  background-color: #8AE8FC;
  color: #000;
  border: none;
  padding: 12px 0;
  border-radius: 30px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
}

.save-btn:hover {
  background-color: #6edcf5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(138, 232, 252, 0.3);
}

.save-btn:disabled {
  background: #444;
  color: #888;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}


/* ── MPB (circular progress) section ────────────────── */
.mpb-section {
  width: 100%;
}

.mpb-row {
  display: flex;
  align-items: center;
  gap: 24px;
}

.mpb-circle-wrap {
  position: relative;
  width: 110px;
  height: 110px;
  flex-shrink: 0;
}

.mpb-svg {
  width: 100%;
  height: 100%;
}

.mpb-pct {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  line-height: 1;
}

.mpb-pct-num {
  font-size: 2.2rem;
  font-weight: 700;
  color: #fff;
}

.mpb-pct-sign {
  font-size: 1.1rem;
  color: rgba(138, 232, 252, 0.8);
  font-weight: 600;
  margin-left: 1px;
}

.mpb-controls {
  flex: 1;
  min-width: 0;
}

.custom-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  cursor: pointer;
  margin-bottom: 16px;
}

.custom-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #8AE8FC;
  border: 2px solid #000;
  cursor: pointer;
  transition: transform 0.1s;
}

.custom-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.custom-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #8AE8FC;
  border: 2px solid #000;
  cursor: pointer;
}

.mpb-times {
  display: flex;
  justify-content: space-between;
}

.mpb-time {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.mpb-time-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.mpb-time-val {
  font-size: 1.3rem;
  color: #fff;
  font-weight: 700;
}

.mpb-no-dur {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.4);
}


/* ── Responsive ─────────────────────────────────────── */
@media (max-width: 600px) {
  .modal-overlay {
    padding: 10px;
  }

  .modal-content {
    max-height: 80vh;
    max-height: 80dvh;
    border-radius: 12px;
  }

  .header-content h2 {
    font-size: 1.8rem;
  }

  .rated-items-grid {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 10px;
  }

  .season-episodes-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
    padding: 10px;
  }

  .breadcrumb-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .back-btn {
    padding: 8px;
  }

  .back-btn .back-text {
    display: none;
  }

  .active-title {
    font-size: 1.2rem;
    white-space: normal;
    flex: 1 1 auto;
    text-align: center;
  }

  .season-title-info {
    flex-direction: column;
    gap: 2px;
  }

  .mpb-row {
    flex-direction: column;
    gap: 16px;
  }

  .mpb-circle-wrap {
    width: 100px;
    height: 100px;
  }

  .mpb-pct-num {
    font-size: 1.8rem;
  }

  .rating-content {
    padding: 16px 20px 20px;
  }

  .sub-modal-header h3 {
    font-size: 1.15rem;
  }
}

.title-primary {
  margin: 0 auto;
  font-size: 2.4rem;
}

.tab-labels {
  text-transform: uppercase;
  margin: 0 auto;
  position: relative;
}



.mpb-time-entry {
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
  padding: 3px 8px;
  border-radius: 8px;
  background: rgba(139, 233, 253, 0.06);
  border: 1px solid rgba(139, 233, 253, 0.18);
  transition: border-color 0.2s ease, background 0.2s ease;
}

.mpb-time-entry:focus-within {
  border-color: rgba(139, 233, 253, 0.55);
  background: rgba(139, 233, 253, 0.12);
}

.mpb-time-entry input {
  width: 2.4em;
  padding: 0;
  border: none;
  background: none;
  color: #fff;
  font-size: 1.4rem;
  font-weight: 600;
  text-align: right;
  appearance: textfield;
  -moz-appearance: textfield;
}

.mpb-time-entry input::-webkit-outer-spin-button,
.mpb-time-entry input::-webkit-inner-spin-button {
  appearance: none;
  -webkit-appearance: none;
  margin: 0;
}

.mpb-time-entry input:focus {
  outline: none;
}

.mpb-time-entry em {
  font-style: normal;
  font-size: 1.1rem;
  color: #8BE9FD;
}

.item-progress {
  display: block;
  width: 100%;
  height: 3px;
  margin-top: 5px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(139, 233, 253, 0.16);
}

.item-progress__fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #8BE9FD;
  transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.is-completed .item-progress__fill {
  background: #4ade80;
}
</style>

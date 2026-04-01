<template>
  <div>
    <div class="spacing" :class="$style.info">
      <div :class="$style.left">
        <div :class="$style.poster">
          <div v-if="isPosterLoading" class="poster-loader">
            <Loader :size="40" />
          </div>
          <img
            v-if="poster"
            ref="posterImage"
            :src="poster"
            loading="lazy"
            :alt="name"
            :style="{ opacity: isPosterLoading ? 0 : 1, transition: 'opacity 0.5s ease' }"
            @load="onPosterLoaded"
            @error="handleImageError">
          <img
            v-else
            src="/placeholders/image_not_found_yet.webp"
            alt="Image not found"
            style="width: 100%; height: 100%; object-fit: cover;"
            @load="onPosterLoaded"
            @error="onPosterLoaded">
        </div>
      </div>
      
      <div :class="$style.right">
        <div v-if="item.overview" :class="$style.overview">
          <h2 :class="$style.title">Storyline</h2>
          <div v-html="item.overview" />
        </div>

        <div :class="$style.stats">
          <ul class="nolist">
            <li v-if="showOriginalTitle">
              <div :class="$style.label">Original Title</div>
              <div :class="$style.value">{{ item.original_title }}</div>
            </li>
            <li v-if="item.release_date">
              <div :class="$style.label">{{ releaseDateLabel(item.release_date) }}</div>
              <div :class="$style.value">{{ fullDate(item.release_date) }}</div>
            </li>
            <li v-if="item.runtime">
              <div :class="$style.label">Runtime</div>
              <div :class="$style.value">{{ formatRuntime(item.runtime) }}</div>
            </li>
            <li v-if="directors">
              <div :class="$style.label">Director</div>
              <div :class="$style.value" v-html="directors" />
            </li>
            <li v-if="item.budget">
              <div :class="$style.label">Budget</div>
              <div :class="$style.value">${{ numberWithCommas(item.budget) }}</div>
            </li>
            <li v-if="item.revenue">
              <div :class="$style.label">Revenue</div>
              <div :class="$style.value">${{ numberWithCommas(item.revenue) }}</div>
            </li>
            <li v-if="item.genres && item.genres.length">
              <div :class="$style.label">Genre</div>
              <div :class="$style.value" v-html="formatGenres(item.genres)" />
            </li>
            <li v-if="item.status">
              <div :class="$style.label">Status</div>
              <div :class="$style.value">
                {{ displayStatus.text }}
                <span
                  v-if="displayStatus.detail"
                  :class="$style.releaseLink"
                  @click="$emit('open-releases')"
                >
                  {{ displayStatus.detail }}
                </span>
              </div>
            </li>
            <li v-if="item.original_language">
              <div :class="$style.label">Language</div>
              <div :class="$style.value">{{ fullLang(item.original_language) }}</div>
            </li>
            <li v-if="hasWinnerAwards" :class="$style.awardsRow">
              <div :class="$style.label">Awards</div>
              <div :class="$style.value">
                <span :class="$style.awardsPreview">{{ awardsSummary }}</span>
                <button 
                  :class="$style.seeMoreBtn"
                  @click="$emit('show-awards')"
                >
                  See more
                </button>
              </div>
            </li>
            <li v-if="item.production_companies && item.production_companies.length">
              <div :class="$style.label">Production</div>
              <div :class="$style.value" v-html="formatProductionCompanies(item.production_companies)" />
            </li>
          </ul>
        </div>

         <div v-if="hasExternalLinks" :class="$style.external">
          <ExternalLinks :links="item.external_ids" />
        </div>

        <div v-if="shouldShowWatchOn" :class="$style.watchSection">
          <WatchOn 
            :providers="providersToDisplay"
            :imdb-id="item.external_ids.imdb_id"
            type="movie" 
          />
        </div>

        <div class="reviews-section" v-if="reviews && reviews.length">
          <br>
          <div :class="$style.reviewsHeader">
             <h4 :class="$style.sectionTitle">REVIEWS ({{ reviewCount }})</h4>
             <button @click="toggleFullReviews" :class="$style.spoilerBanner">
              <svg v-if="!showFullReviews" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              <span>{{ showFullReviews ? 'HIDE REVIEWS' : 'SHOW (WARNING: MAY CONTAIN SPOILERS)' }}</span>
             </button>
          </div>

          <ul class="nolist" style="padding-right: 1rem;" v-show="showFullReviews">
              <li v-for="(review, index) in reviews" :key="index" :class="$style.reviewCard">
                  <div :class="$style.reviewHeader">
                    <div :class="$style.reviewAuthor">
                      <component
                        :is="review.source === 'Cinemagoria' && review.url ? 'a' : 'strong'"
                        :href="review.source === 'Cinemagoria' && review.url ? review.url : undefined"
                        :class="review.source === 'Cinemagoria' ? $style.ecAuthorName : null"
                      >{{ review.authorName }}</component>
                      <div v-if="review.authorRating" :class="$style.reviewRatingContainer">
                        <div :class="$style.stars">
                          <div :style="{ width: `${review.authorRating * 10}%` }" />
                        </div>
                        <span :class="$style.ratingNumber">{{ review.authorRating }}</span>
                      </div>
                    </div>
                    <div :class="$style.reviewMeta">
                       <span v-if="review.source === 'User'" :class="$style.userBadge">YOU</span>
                       <img v-else-if="review.source === 'Trakt'" src="/logos/streaming/traktv-logo.svg" alt="Trakt" :class="$style.sourceLogo" />
                       <img v-else-if="review.source === 'Cinemagoria'" src="/icons/icon-medium.png" alt="Cinemagoria" :class="$style.ecIcon" />
                       <img v-else src="/logos/platforms/tmdb.svg" alt="TMDB" :class="$style.sourceLogoTMDB" />
                       <span :class="$style.reviewDate">{{ formatCreatedAt(review.createdAt) }}</span>
                    </div>
                  </div>
                  
                  <div :class="$style.reviewBody">
                    <span :class="$style.reviewContent" v-html="formatContent(review.content, index, review.showFullContent)"></span>
                    <span v-if="!review.showFullContent && review.content.split(' ').length > 200" :class="$style.readMore" @click="toggleReadMore(review)">..[Read More]</span>
                  </div>

                  <div v-if="review.source === 'User'" :class="$style.userReviewActions">
                    <button :class="$style.editReviewBtn" @click="openEditRatingModal(review)" title="Edit review" style="width: 32px !important; height: 32px !important; padding: 0 !important; display: inline-flex !important; align-items: center !important; justify-content: center !important;">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 18px !important; height: 18px !important; display: block !important; min-width: 18px !important; min-height: 18px !important; stroke: #8BE9FD !important; stroke-width: 2.5px !important; visibility: visible !important; opacity: 1 !important;"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                    </button>
                    <button :class="$style.deleteReviewBtn" @click="showDeleteReviewModal = true" title="Delete review" style="width: 32px !important; height: 32px !important; padding: 0 !important; display: inline-flex !important; align-items: center !important; justify-content: center !important;">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 18px !important; height: 18px !important; display: block !important; min-width: 18px !important; min-height: 18px !important; stroke: #FF6B6B !important; stroke-width: 2.5px !important; visibility: visible !important; opacity: 1 !important;"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                  <div v-else-if="review.url" :class="$style.reviewActions">
                    <a :href="review.url" target="_blank" rel="noopener noreferrer" :class="$style.viewReviewButton">
                      View Review
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                  </div>
              </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Delete review confirmation modal -->
    <div v-if="showDeleteReviewModal" class="movie-info-modal-overlay" @click.self="showDeleteReviewModal = false">
      <div class="movie-info-delete-modal">
        <div class="movie-info-modal-header">
          <h3>Delete Review</h3>
          <button class="movie-info-close-btn" @click="showDeleteReviewModal = false">×</button>
        </div>
        <div class="movie-info-delete-body">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" stroke="#ff6b6b" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
          <p class="movie-info-delete-warning">Are you sure you want to delete your review and rating for <strong>{{ item.title || item.name }}</strong>?</p>
          <p class="movie-info-delete-warning" style="font-size: 1.1rem; opacity: 0.8; margin-top: -5px;">This action cannot be undone.</p>
        </div>
        <div class="movie-info-delete-actions">
          <button class="movie-info-cancel-btn" @click="showDeleteReviewModal = false">Cancel</button>
          <button class="movie-info-confirm-delete-btn" @click="deleteReview">Delete</button>
        </div>
      </div>
    </div>

    <!-- Edit review / rate modal -->
    <div v-if="ratingModalVisible" class="movie-info-modal-overlay" @click.self="closeRatingModal">
      <div class="movie-info-rating-modal">
        <div class="movie-info-modal-header">
          <h3>Rate '{{ item.title || item.name }}'</h3>
          <button class="movie-info-close-btn" @click="closeRatingModal">×</button>
        </div>
        <div class="movie-info-rating-content">
          <div class="movie-info-rating-selector">
            <div class="movie-info-rating-numbers">
              <button
                v-for="n in 10"
                :key="n"
                @click="setRating(n)"
                @mouseover="previewRating(n)"
                @mouseout="resetPreview()"
                :class="['movie-info-rating-btn', { 'movie-info-rating-btn-active': n <= (hoverRating || selectedRating) }]"
              >{{ n }}</button>
            </div>
          </div>
          <div class="movie-info-review-section">
            <textarea
              v-model="editUserReview"
              placeholder="Write your review here…"
              class="movie-info-review-textarea"
              maxlength="2000"
              :disabled="selectedRating === 0"
            ></textarea>
            <div class="movie-info-char-count">{{ editUserReview.length }}/2000</div>
          </div>
          <div class="movie-info-modal-buttons">
            <button @click="removeRatingAndReview" class="movie-info-remove-btn">Remove</button>
            <button @click="saveEditedReview" class="movie-info-save-btn" :disabled="selectedRating === 0">Save</button>
          </div>
        </div>
      </div>
    </div>
    
    <slot name="before-recommendations"></slot>
    
    <div v-if="hasAnyRecommendations" class="recommendations-wrapper">
      <h2 :class="$style.title" style="padding-left: 2rem; padding-bottom: 1rem; top: 2rem !important; position:relative; background-image: transparent;">Recommendations</h2>
      
      <div v-if="isLoadingRecommendations" class="recommendations-loader">
        <Loader :size="44" />
      </div>
      
      <div v-else>
        <div class="tabs-container">
          <div class="tabs-desktop">
            <button 
              v-for="tab in availableTabs"
              :key="tab.key"
              class="tab-btn" 
              :class="{ active: activeTab === tab.key }" 
              @click="activeTab = tab.key">
              {{ tab.label }}
            </button>
          </div>

          <div class="tabs-mobile">
            <button class="nav-arrow" @click="prevTab" :disabled="availableTabs.length <= 1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            
            <span class="mobile-label">{{ currentTabLabel }}</span>
            
            <button class="nav-arrow" @click="nextTab" :disabled="availableTabs.length <= 1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>



         <div v-if="activeTab === 'awards'">
          <AwardsTab :tmdb-id="item.id" :title="item.title" type="movie" />
        </div>

         <ListingCarousel
          ref="recommendationCarousel"
          v-else-if="currentRecommendationList && currentRecommendationList.results && currentRecommendationList.results.length"
          :items="currentRecommendationList" />
      </div>
    </div>
  </div>
</template>

<script>
import { apiImgUrl, getMovieProviders, getMovieReviews, getTraktReviews, getECReviews, getMovieRecommended, getPerson, getMoviesByProductionCompany, getIMDbRatingFromDB, enrichMovieWithIMDbRating } from '~/utils/api'; 
import { getReleaseStatusContext } from '~/utils/helpers';
import DOMPurify from 'dompurify';
import { SUPPORTED_PRODUCTION_COMPANIES } from '~/utils/constants'; 
import { name, directors, poster as posterMixin } from '~/mixins/Details';
import Filters from '~/mixins/Filters';
import ExternalLinks from '~/components/ExternalLinks';
import WatchOn from '~/components/WatchOn';
import ListingCarousel from '~/components/ListingCarousel';

import { getProductionCompanySlug } from '~/utils/constants';

export default {
  components: {
    ExternalLinks,
    WatchOn,
    ListingCarousel,
    AwardsTab: () => import('~/components/common/AwardsTab'),
    Loader: () => import('~/components/Loader'),
  },

  mixins: [
    Filters,
    name,
    directors,
    posterMixin,
  ],

  props: {
    item: {
      type: Object,
      required: true,
    },
    reviewsProp: Array,
    providers: {
      type: Array,
      default: () => [],
    },
    oscars: { type: Array, default: () => [] },
    goldenGlobes: { type: Array, default: () => [] },
    palme: { type: Array, default: () => [] },
    goldenLion: { type: Array, default: () => [] },
    goldenBear: { type: Array, default: () => [] }
  },

  data() {
    return {
      isPosterLoading: true,
      showFullReviews: false,
      reviews: [],
      localProviders: null,
      
      recommended: null,
      directorItems: null,
      producerItems: null,
      activeTab: null,
      isLoadingRecommendations: true,

      // Review quick actions
      showDeleteReviewModal: false,
      ratingModalVisible: false,
      selectedRating: 0,
      hoverRating: 0,
      editUserReview: '',
    };
  },

  computed: {
    reviewCount() {
      return this.reviews.length;
    },
    poster () {
      if (this.poster_path) return this.poster_path;
      return false;
    },
    showOriginalTitle() {
      const localizedTitle = this.item.title;
      const originalTitle = this.item.original_title;
      return localizedTitle && originalTitle && localizedTitle !== originalTitle;
    },
    providersToDisplay() {
      return this.localProviders !== null ? this.localProviders : this.providers;
    },
    currentRecommendationList() {
      if (this.activeTab === 'similar') return this.recommended;
      if (this.activeTab === 'director') return this.directorItems;
      if (this.activeTab === 'producer') return this.producerItems;
      return null;
    },
    hasAnyRecommendations() {
      return (this.recommended?.results?.length > 0) || 
             (this.directorItems?.results?.length > 0) || 
             (this.producerItems?.results?.length > 0);
    },
    availableTabs() {
      const tabs = [];
      if (this.recommended?.results?.length) tabs.push({ key: 'similar', label: 'More Like This' });
      if (this.directorItems?.results?.length) tabs.push({ key: 'director', label: 'From the Same Director' });
      if (this.producerItems?.results?.length) tabs.push({ key: 'producer', label: 'From the Same Producers' });
      return tabs;
    },
    currentTabLabel() {
      const tab = this.availableTabs.find(t => t.key === this.activeTab);
      return tab ? tab.label : '';
    },
    activeTabIndex() {
      return this.availableTabs.findIndex(t => t.key === this.activeTab);
    },
    hasExternalLinks() {
       const links = this.item.external_ids;
       return links && (links.imdb_id || links.twitter_id || links.instagram_id || links.homepage || links.facebook_id);
    },
    isReleasedOrCloseToRelease() {
      if (!this.item.release_date) return true;
      const releaseDate = new Date(this.item.release_date);
      const now = new Date();
      const oneMonthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      return releaseDate <= oneMonthFromNow;
    },
    shouldShowWatchOn() {
       return true;
    },
    displayStatus() {
      const context = getReleaseStatusContext(this.item, process.env.API_COUNTRY || 'US');

      switch (context) {
        case 'THEATRICAL_TODAY_WITH_FESTIVALS':
          return { text: 'In Theaters Today', detail: '(Festival Premiere)' };
        case 'THEATRICAL_TODAY':
          return { text: 'In Theaters Today', detail: '' };
        case 'IN_THEATERS_WITH_FESTIVALS':
          return { text: 'In Theaters', detail: '(Festival Premiere)' };
        case 'IN_THEATERS':
          return { text: 'In Theaters', detail: '' };
        case 'PRE_RELEASE_FESTIVALS_THEATRICAL_SOON':
          return { text: 'Pre-Release', detail: '(Festivals)' };
        case 'THEATRICAL_UPCOMING':
          return { text: 'Coming to Theaters', detail: '' };
        case 'FESTIVALS_ONLY_PAST':
          return { text: 'Pre-Release', detail: '(Festivals)' };
        case 'FESTIVALS_ONLY_FUTURE':
          return { text: 'Pre-Release', detail: '(Festivals)' };
        default:
          return { text: this.item.status, detail: '' };
      }
    },
    winnerOscars() {
      return this.oscars.filter(award => award.won);
    },
    winnerGoldenGlobes() {
      return this.goldenGlobes.filter(award => award.won);
    },
    hasWinnerAwards() {
      return this.winnerOscars.length > 0 || 
             this.winnerGoldenGlobes.length > 0 || 
             this.palme.length > 0 || 
             this.goldenLion.length > 0 || 
             this.goldenBear.length > 0;
    },
    awardsSummary() {
      const oscarCount = this.winnerOscars.length;
      const ggCount = this.winnerGoldenGlobes.length;
      const palmeCount = this.palme.length;
      const lionCount = this.goldenLion.length;
      const bearCount = this.goldenBear.length;
      
      const parts = [];
      if (oscarCount > 0) parts.push(`${oscarCount} Oscar${oscarCount > 1 ? 's' : ''}`);
      if (ggCount > 0) parts.push(`${ggCount} Golden Globe${ggCount > 1 ? 's' : ''}`);
      if (palmeCount > 0) parts.push(`${palmeCount} Palme d'Or`);
      if (lionCount > 0) parts.push(`${lionCount} Golden Lion${lionCount > 1 ? 's' : ''}`);
      if (bearCount > 0) parts.push(`${bearCount} Golden Bear${bearCount > 1 ? 's' : ''}`);
      
      return parts.join(', ');
    },
  },

  watch: {
    item: {
      immediate: true,
      handler() {
        this.isPosterLoading = true;
        this.resetTabs();
        this.fetchSecondaryData();
        this.fetchProviders();
        this.fetchReviews();
      }
    },
    activeTab() {
      this.$nextTick(() => {
        const carouselComponent = this.$refs.recommendationCarousel;
        if (carouselComponent && carouselComponent.$refs.carouselElement) {
          carouselComponent.$refs.carouselElement.scrollLeft = 0;
          if (typeof carouselComponent.moveTo === 'function') {
             carouselComponent.moveTo(0);
          }
        }
      });
    }
  },

  created () {
    if (this.item.homepage) {
      this.item.external_ids.homepage = this.item.homepage;
    }
    this.reviews = this.reviewsProp || [];
  },

  mounted() {
    this.checkImageLoaded();
    this.$bus.$on('rated-items-updated', this.fetchReviews);
  },

  beforeDestroy() {
    this.$bus.$off('rated-items-updated', this.fetchReviews);
  },

  methods: {
    checkImageLoaded() {
      const img = this.$refs.posterImage;
      if (img && img.complete && img.naturalHeight !== 0) {
        this.onPosterLoaded();
      }
    },
    releaseDateLabel(date) {
      if (!date) return 'Released';
      const today = new Date(); today.setHours(0,0,0,0);
      const d = new Date(date + 'T00:00:00'); d.setHours(0,0,0,0);
      if (d.getTime() === today.getTime()) return 'Releases Today';
      return d > today ? 'Releases' : 'Released';
    },
    fullDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString(process.env.API_COUNTRY === 'BR' ? 'pt-BR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    fullLang(iso) {
      try {
        const languageNames = new Intl.DisplayNames(['en'], { type: 'language' });
        return languageNames.of(iso);
      } catch (e) {
        return iso;
      }
    },
    resetTabs() {
      this.recommended = null;
      this.directorItems = null;
      this.producerItems = null;
      this.activeTab = null;
      this.isLoadingRecommendations = true;
    },
    onPosterLoaded() {
      this.isPosterLoading = false;
    },
    handleImageError(e) {
      this.isPosterLoading = false;
      e.target.src = '/placeholders/image_not_found_yet.webp';
    },
    async fetchSecondaryData() {
      this.isLoadingRecommendations = true;
      const p1 = this.fetchRecommended();
      const p2 = this.fetchDirectorMovies();
      const p3 = this.fetchProducerMovies();

      await Promise.allSettled([p1, p2, p3]);
      this.setSmartDefaultTab();
      this.isLoadingRecommendations = false;
    },
    setSmartDefaultTab() {
      if (this.availableTabs.length > 0) {
        this.activeTab = this.availableTabs[0].key;
      } else {
        this.activeTab = null;
      }
    },
    nextTab() {
      if (this.availableTabs.length < 2) return;
      let nextIndex = this.activeTabIndex + 1;
      if (nextIndex >= this.availableTabs.length) nextIndex = 0;
      this.activeTab = this.availableTabs[nextIndex].key;
    },
    prevTab() {
      if (this.availableTabs.length < 2) return;
      let prevIndex = this.activeTabIndex - 1;
      if (prevIndex < 0) prevIndex = this.availableTabs.length - 1;
      this.activeTab = this.availableTabs[prevIndex].key;
    },
    async fetchRecommended() {
      try {
        const response = await getMovieRecommended(this.item.id);
        if (response?.results) {
          response.results = response.results.filter(m => m.id !== this.item.id);
          this.recommended = response;
        }
      } catch (e) {}
    },
    async fetchDirectorMovies() {
      if (!this.item.credits?.crew) return;
      const director = this.item.credits.crew.find(person => person.job === 'Director');
      if (!director) return;

      try {
        const personData = await getPerson(director.id);
        if (!personData?.combined_credits) return;

        let works = personData.combined_credits.crew
          .filter(work => work.job === 'Director' && work.media_type === 'movie');
        
        works = works.filter(work => work.id !== this.item.id); 
        works = this.removeDuplicates(works);
        works.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0)); 
        works = works.slice(0, 30);

        if (works.length > 0) {
           works = await this.enrichWithIMDbRatings(works);
           this.directorItems = { results: works };
        }
      } catch (e) { console.error(e); }
    },
    async fetchProducerMovies() {
      if (!this.item.production_companies?.length) return;

      const validCompanies = this.item.production_companies.filter(c => 
         Object.prototype.hasOwnProperty.call(SUPPORTED_PRODUCTION_COMPANIES, c.id)
      );

      if (validCompanies.length === 0) return; 

      try {
        const promises = validCompanies.map(company => 
          getMoviesByProductionCompany(company.id, 1)
        );

        const resultsArray = await Promise.allSettled(promises);
        let allMovies = [];
        
        resultsArray.forEach(result => {
            if (result.status === 'fulfilled' && result.value?.results) {
              allMovies = [...allMovies, ...result.value.results];
            }
        });

        allMovies = allMovies.filter(m => m.id !== this.item.id);
        allMovies = this.removeDuplicates(allMovies);
        allMovies.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        allMovies = allMovies.slice(0, 30);

        if (allMovies.length >= 2) {
           this.producerItems = { results: allMovies };
        }
      } catch (e) { console.error(e); }
    },
    removeDuplicates(arr) {
       const uniqueIds = new Set();
       return arr.filter(element => {
         const isDuplicate = uniqueIds.has(element.id);
         uniqueIds.add(element.id);
         return !isDuplicate;
       });
    },
    async enrichWithIMDbRatings(items) {
      if (!items?.length) return items;
      return await Promise.all(items.map(item => enrichMovieWithIMDbRating(item)));
    },
    //  ── Review quick-action methods ──────────────────────────────
    openEditRatingModal(review) {
      this.selectedRating = review.authorRating || 0;
      this.editUserReview = review.content || '';
      this.hoverRating = 0;
      this.ratingModalVisible = true;
    },
    closeRatingModal() {
      this.ratingModalVisible = false;
      this.selectedRating = 0;
      this.hoverRating = 0;
      this.editUserReview = '';
    },
    setRating(n) { this.selectedRating = n; },
    previewRating(n) { this.hoverRating = n; },
    resetPreview() { this.hoverRating = 0; },
    async saveEditedReview() {
      if (this.selectedRating === 0) return;
      const userEmail = import.meta.client ? localStorage.getItem('email')?.replace(/['"]+/g, '') : null;
      if (!userEmail) return;
      const tursoUrl = this.$config.public.tursoBackendUrl || 'https://cinemagoria-favorites.vercel.app/api';
      try {
        const resp = await fetch(`${tursoUrl}/favorites/rating/${userEmail}/movie/${this.item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rating: this.selectedRating, review: this.editUserReview.trim() })
        });
        if (!resp.ok) throw new Error('Error saving');
        this.closeRatingModal();
        this.$bus.$emit('rated-items-updated');
        await this.fetchReviews();
      } catch (e) { console.error(e); }
    },
    async removeRatingAndReview() {
      const userEmail = import.meta.client ? localStorage.getItem('email')?.replace(/['"]+/g, '') : null;
      if (!userEmail) return;
      const tursoUrl = this.$config.public.tursoBackendUrl || 'https://cinemagoria-favorites.vercel.app/api';
      try {
        const resp = await fetch(`${tursoUrl}/favorites/rating/${userEmail}/movie/${this.item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rating: null, review: '' })
        });
        if (!resp.ok) throw new Error('Error removing');
        this.closeRatingModal();
        this.$bus.$emit('rated-items-updated');
        await this.fetchReviews();
      } catch (e) { console.error(e); }
    },
    async deleteReview() {
      this.showDeleteReviewModal = false;
      await this.removeRatingAndReview();
    },
    //  ─────────────────────────────────────────────────────────────
    toggleFullReviews() { this.showFullReviews = !this.showFullReviews; },
    formatGenres(genres) { return genres.map(genre => `<a href="/genre/${genre.id}/movie">${genre.name}</a>`).join(', '); },
    formatProductionCompanies(companies) {
      return companies.map(company => {
        const slug = getProductionCompanySlug(company.id);
        if (slug) return`<a href="/production/${slug}">${company.name}</a>`;
        return company.name;
      }).join(', ');
    },
    toggleReadMore(review) { review.showFullContent = !review.showFullContent; },
    formatContent(content, index, showFullContent) {
      if (!content) return '';
      content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/_([^_]+)_/g, (match, p1) => p1.toUpperCase());
      if (showFullContent) return import.meta.client ? DOMPurify.sanitize(content) : content;
      const words = content.split(' ');
      if (words.length > 200) content = words.slice(0, 200).join(' ');
      return import.meta.client ? DOMPurify.sanitize(content) : content;
    },
    formatCreatedAt(createdAt) {
      if (!createdAt) return '';
      return new Date(createdAt).toLocaleString('es-ES', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    async fetchProviders() {
      try {
        const providers = await getMovieProviders(this.item.id);
        this.localProviders = providers;
      } catch (error) { this.localProviders = []; }
    },
    async fetchReviews() {
      try {
        const tmdbReviewsPromise = getMovieReviews(this.item.id);
        const traktReviewsPromise = this.item.external_ids?.imdb_id 
          ? getTraktReviews(this.item.external_ids.imdb_id, 'movie') 
          : Promise.resolve([]);
        const ecReviewsPromise = getECReviews('movie', this.item.id);

        let userReviewPromise = Promise.resolve(null);
        const userEmail = import.meta.client ? localStorage.getItem('email')?.replace(/['"]+/g, '') : null;
        
        if (userEmail) {
             const tursoUrl = this.$config.public.tursoBackendUrl || 'https://cinemagoria-favorites.vercel.app/api';
             userReviewPromise = fetch(`${tursoUrl}/membership/${userEmail}/movie/${this.item.id}`)
               .then(res => res.json())
               .then(data => data.userRating)
               .catch(() => null);
        }

        const [tmdbResult, traktResult, ecResult, userReviewResult] = await Promise.allSettled([tmdbReviewsPromise, traktReviewsPromise, ecReviewsPromise, userReviewPromise]);
        
        const tmdbReviews = tmdbResult.status === 'fulfilled' ? tmdbResult.value : [];
        const traktReviews = traktResult.status === 'fulfilled' ? traktResult.value : [];
        const ecReviews = ecResult.status === 'fulfilled' ? ecResult.value : [];
        const userRatingData = userReviewResult.status === 'fulfilled' ? userReviewResult.value : null;

        const otherReviews = [...tmdbReviews, ...traktReviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const ecSorted = [...ecReviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        let allReviews = [...ecSorted, ...otherReviews];
        
        if (userRatingData && userRatingData.review) {
            const userAlias = import.meta.client ? localStorage.getItem('alias') : null;
            const userReview = {
                authorName: 'Your Review',
                authorRating: userRatingData.score,
                source: 'User',
                createdAt: userRatingData.createdAt, 
                content: userRatingData.review,
                showFullContent: true,
                url: null
            };
            allReviews = allReviews.filter(r => {
                if (r.source === 'User') return false;
                if (r.source === 'Cinemagoria' && userAlias && r.authorAlias === userAlias) return false;
                return true;
            });
            allReviews.unshift(userReview);
        }

        this.reviews = allReviews;
      } catch (error) {
        console.error('Error fetching reviews:', error);
        this.reviews = [];
      }
    },
    redirectToUrl(url) { window.open(url, '_blank'); },
  },
};
</script>

<style lang="scss">
.poster-loader {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  z-index: 2;
}
</style>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.info { 
  background-color: rgba(0, 0, 0, 0.307);
  border-radius: 15px;;
  padding-bottom: 4rem;
  @media (min-width: $breakpoint-medium) { display: flex; }
}
.left {
  display: none;
  @media (min-width: $breakpoint-medium) {
    display: block;
    width: 25%;
    max-width: 400px;
    padding-right: 3rem;
  }
  @media (min-width: $breakpoint-large) { padding-right: 5rem; }
}
.right {
  padding-top: 1rem;
  @media (min-width: $breakpoint-medium) { 
    flex: 1; 
    padding-right: 2rem;
  }
}
.poster {
  position: relative;
  height: 0;
  padding-top: 150.27%;
  overflow: hidden;
  border-radius: 15px;;
  background-color: $secondary-color;
  img, span { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
  span { display: flex; align-items: center; justify-content: center; }
}
.overview {
  max-width: 1000px;
  margin-bottom: 3rem;
  font-size: 1.5rem;
  color: $text-color;
  @media (min-width: $breakpoint-large) { font-size: 1.6rem; }
}
.title {
  margin-bottom: 1rem;
  font-size: 1.8rem;
  color: #fff;
  letter-spacing: $letter-spacing;
  @media (min-width: $breakpoint-large) { font-size: 2.4rem; }
}
.stats {
  margin-bottom: 3rem;
  font-size: 1.5rem;
  color: $text-color;
  @media (min-width: $breakpoint-large) { font-size: 1.6rem; }
  ul { @media (min-width: $breakpoint-medium) { display: flex; flex-wrap: wrap; } }
  li {
    display: flex; padding: 0.2rem 0;
    @media (min-width: $breakpoint-medium) { width: 50%; }
    @media (min-width: $breakpoint-xlarge) { width: 100%; }
  }
  a { color: #8AE8FC; text-decoration: none; }
}
.label {
  flex: 1; max-width: 90px; margin-right: 1.5rem; color: #fff;
  @media (min-width: $breakpoint-xsmall) { max-width: 110px; }
}
.value { flex: 2; }
.watchSection { margin-bottom: 2rem; }
.external {
  ul { display: flex; margin-left: -0.5rem; }
  a {
    display: flex; align-items: center; justify-content: center; width: 4.4rem; height: 4.4rem;
    svg { transition: all 0.3s ease-in-out; }
    &:hover, &:focus { svg { fill: $fourth-color; } }
  }
}


.reviewCard {
  background-color: rgba(9, 25, 31, 0.6);
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  transition: transform 0.2s ease, background-color 0.2s;
  border: 1px solid rgba(138, 232, 252, 0.1); 

  &:hover {
    background-color: rgba(12, 33, 42, 0.8);
    transform: translateY(-2px);
    border-color: rgba(138, 232, 252, 0.3);
  }
}

.reviewHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 1rem;
}

.reviewAuthor {
  display: flex;
  flex-direction: column;
  strong {
    font-size: 1.6rem;
    color: #fff;
    margin-bottom: 0.5rem;
  }
}

.reviewRatingContainer {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.stars {
  width: 7.3rem;
  height: 1.2rem;
  background-image: url('@/assets/images/stars.png');
  background-repeat: no-repeat;
  background-size: auto 100%;
  margin-bottom: 0.2rem;

  > div {
    height: 100%;
    background-image: url('@/assets/images/stars-filled.png');
    background-repeat: no-repeat;
    background-size: auto 100%;
  }
}

.ratingNumber {
  font-size: 1.2rem;
  color: #999;
  font-weight: 600;
}

.reviewMeta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.sourceLogo {
  height: 15px;
  width: auto;
  display: block;
  margin-top: 5px;
  opacity: 0.8;
}

.sourceLogoTMDB {
  height: 10px;
  width: auto;
  display: block;
  margin-top: 5px;
  opacity: 0.8;
}

.reviewDate {
  font-size: 1.2rem;
  color: #999;
  font-style: italic;
}

.reviewBody {
  font-size: 1.5rem;
  line-height: 1.6;
  color: #ddd;
  margin-bottom: 1.5rem;
}

.readMore {
  cursor: pointer;
  color: #8AE8FC;
  font-size: 1.3rem;
  margin-left: 0.5rem;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
}

.reviewActions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.viewReviewButton {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: transparent;
  color: #8AE8FC;
  border: 1px solid #8AE8FC;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(138, 232, 252, 0.1);
    transform: translateY(-1px);
  }

  svg {
    width: 14px;
    height: 14px;
  }
}

.noReviews {
  text-align: center;
  font-size: 1.6rem;
  color: #999;
  padding: 4rem;
  font-style: italic;
}

.userReviewActions {
  display: flex;
  gap: 0.6rem;
  justify-content: flex-end;
  margin-top: 0.8rem;
}

.editReviewBtn,
.deleteReviewBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
  
  svg {
    stroke-width: 2px;
    width: 20px;
    height: 20px;
    fill: none;
    transition: all 0.2s ease;
  }
}

.editReviewBtn {
  color: rgba(139, 233, 253, 0.7);
  border-color: rgba(139, 233, 253, 0.25);
  &:hover {
    background: rgba(139, 233, 253, 0.12);
    color: #8BE9FD;
    border-color: rgba(139, 233, 253, 0.5);
    transform: translateY(-1px);
  }
}

.deleteReviewBtn {
  color: rgba(255, 107, 107, 0.7);
  border-color: rgba(255, 107, 107, 0.25);
  &:hover {
    background: rgba(255, 107, 107, 0.12);
    color: #FF6B6B;
    border-color: rgba(255, 107, 107, 0.5);
    transform: translateY(-1px);
  }
}

.reviewsHeader {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding: 0 1rem;
  gap: 1.5rem;
}

.sectionTitle {
  font-size: 1.6rem;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.spoilerBanner {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.2rem;
  color: #8AE8FC;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 1px solid rgba(138, 232, 252, 0.3);
  padding: 0.6rem 1.4rem;
  border-radius: 6px;
  background: rgba(138, 232, 252, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    margin-bottom: 2px;
  }

  &:hover {
    background: rgba(138, 232, 252, 0.1);
    box-shadow: 0 4px 12px rgba(138, 232, 252, 0.15);
    transform: translateY(-1px);
    border-color: rgba(138, 232, 252, 0.5);
  }

  &:active {
    transform: translateY(1px);
  }
}



.reviewCard {
  background-color: rgba(9, 25, 31, 0.6);
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  transition: transform 0.2s ease, background-color 0.2s;
  border: 1px solid rgba(138, 232, 252, 0.1); 

  &:hover {
    background-color: rgba(12, 33, 42, 0.8);
    transform: translateY(-2px);
    border-color: rgba(138, 232, 252, 0.3);
  }
}

.reviewHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 1rem;
}

.reviewAuthor {
  display: flex;
  flex-direction: column;
  strong {
    font-size: 1.6rem;
    color: #fff;
    margin-bottom: 0.5rem;
  }
}

.reviewMeta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.traktBadge {
  color: #ED1C24;
  font-weight: bold;
  font-size: 1.1rem;
  border: 1px solid #ED1C24;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 1px;
}

.userBadge {
  color: #8BE9FD;
  font-weight: bold;
  font-size: 1.1rem;
  border: 1px solid #8BE9FD;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 1px;
}

.ecIcon {
  width: 24px;
  height: 24px;
  display: block;
  border-radius: 4px;
  margin-top: -4px;
  opacity: 0.9;
}

.ecAuthorName {
  font-size: 1.6rem;
  color: #8BE9FD;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.reviewDate {
  font-size: 1.2rem;
  color: #999;
  font-style: italic;
}

.reviewBody {
  font-size: 1.5rem;
  line-height: 1.6;
  color: #ddd;
}

.readMore {
  cursor: pointer;
  color: #8AE8FC;
  font-size: 1.3rem;
  margin-left: 0.5rem;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
}

.noReviews {
  text-align: center;
  font-size: 1.6rem;
  color: #999;
  padding: 4rem;
  font-style: italic;
}
.releaseLink {
  color: #8AE8FC !important;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
}

.awardsRow {
  align-items: flex-start;
}

.awardsPreview {
  color: #8AE8FC;
  font-weight: 600;
  margin-right: 1rem;
}

.seeMoreBtn {
  background: transparent;
  border: 1px solid #8AE8FC;
  color: #8AE8FC;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(138, 232, 252, 0.1);
    transform: translateY(-1px);
  }
}
</style>

<style lang="scss" scoped>
.recommendations-wrapper {
  background-color: rgba(0, 0, 0, 0.307);
  margin: 2.5rem 1.5rem;
  border-radius: 15px;;

  @media (min-width: 768px) {
    margin: 2.5rem 4rem;
  }

  @media (min-width: 1200px) {
    margin: 2rem;
  }
}

.recommendations-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  width: 100%;
}

.tabs-container {
  width: 100%;
  top: 1.5rem;
  position:relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tabs-desktop {
  display: none; 
  gap: 4rem;
  
  @media (min-width: 768px) {
    display: flex;
    justify-content: center;
  }
}

.tab-btn {
  background: transparent;
  border: none;
  color: #80868b;
  font-family: inherit;
  font-size: 1.4rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.5rem 0;
  position: relative;
  
  &:hover {
    color: #fff;
  }

  &.active {
    color: #8BE9FD;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #8BE9FD;
      border-radius: 2px;
    }
  }
}

.tabs-mobile {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  width: 100%;
  padding: 0 1rem;
  
  @media (min-width: 768px) {
    display: none;
  }
}

.mobile-label {
  color: #8AE8FC;
  font-size: 1.4rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-align: center;
  flex: 1;
}

.nav-arrow {
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  
  &:active {
    transform: scale(0.9);
  }
  
  &:disabled {
    opacity: 0.3;
    pointer-events: none;
  }
}
</style>

<style>
/* ── Embedded review modals (MovieInfo) ─────────────────────── */
.movie-info-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.82);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  padding: 20px;
}

.movie-info-delete-modal,
.movie-info-rating-modal {
  width: 100%;
  max-width: 400px;
  background: linear-gradient(135deg, rgba(6, 47, 64, 0.98) 0%, rgba(10, 30, 40, 0.99) 100%);
  border: 1px solid rgba(127, 219, 241, 0.3);
  border-radius: 16px;
  box-shadow: 0 12px 40px 0 rgba(31, 104, 135, 0.6);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  overflow: hidden;
}

.movie-info-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.movie-info-modal-header h3 {
  color: #8BE9FD;
  font-size: 1.6rem;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.movie-info-close-btn {
  background: none;
  border: none;
  color: rgba(255,255,255,0.5);
  font-size: 3rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.movie-info-close-btn:hover { color: #fff; }

/* Delete modal body */
.movie-info-delete-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 20px 16px;
  gap: 12px;
}

.movie-info-delete-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  text-align: center;
  margin: 0;
}

.movie-info-delete-warning {
  font-size: 1.3rem;
  color: rgba(255,255,255,0.65);
  text-align: center;
  margin: 0;
}

.movie-info-delete-warning strong { color: #FF6B6B; }

.movie-info-delete-actions {
  display: flex;
  gap: 10px;
  padding: 12px 20px 20px;
  justify-content: center;
}

.movie-info-cancel-btn,
.movie-info-confirm-delete-btn {
  padding: 0.7rem 1.8rem;
  border-radius: 8px;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
}

.movie-info-cancel-btn {
  background: rgba(255,255,255,0.07);
  color: rgba(255,255,255,0.7);
  border-color: rgba(255,255,255,0.15);
}

.movie-info-cancel-btn:hover {
  background: rgba(255,255,255,0.12);
  color: #fff;
}

.movie-info-confirm-delete-btn {
  background: rgba(255, 107, 107, 0.12);
  color: #FF6B6B;
  border-color: rgba(255, 107, 107, 0.45);
}

.movie-info-confirm-delete-btn:hover {
  background: rgba(255, 107, 107, 0.25);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255,107,107,0.25);
}

/* Rating/edit modal body */
.movie-info-rating-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.movie-info-rating-selector { width: 100%; }

.movie-info-rating-numbers {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.movie-info-rating-numbers::before {
  content: '';
  position: absolute;
  left: 0; right: 0; top: 50%;
  height: 2px;
  background: rgba(255,255,255,0.07);
  transform: translateY(-50%);
  z-index: 0;
}

.movie-info-rating-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: #041019;
  color: rgba(255,255,255,0.6);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.movie-info-rating-btn-active {
  background: #8BE9FD;
  color: #000;
  transform: scale(1.15);
  box-shadow: 0 0 10px rgba(139,233,253,0.5);
}

.movie-info-rating-btn:hover { transform: scale(1.15); }

.movie-info-review-section {
  width: 100%;
  position: relative;
}

.movie-info-review-textarea {
  width: 100%;
  height: 160px;
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 12px;
  color: #fff;
  font-size: 1.3rem;
  resize: none;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.movie-info-review-textarea:focus {
  outline: none;
  border-color: rgba(139,233,253,0.5);
}

.movie-info-review-textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.movie-info-char-count {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 1.1rem;
  color: rgba(255,255,255,0.35);
}

.movie-info-modal-buttons {
  display: flex;
  gap: 10px;
  width: 100%;
}

.movie-info-save-btn,
.movie-info-remove-btn {
  flex: 1;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
}

.movie-info-save-btn {
  background: rgba(139, 233, 253, 0.12);
  color: #8BE9FD;
  border-color: rgba(139, 233, 253, 0.35);
}

.movie-info-save-btn:hover {
  background: rgba(139, 233, 253, 0.22);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139,233,253,0.2);
}

.movie-info-save-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.movie-info-remove-btn {
  background: rgba(255, 107, 107, 0.1);
  color: #FF6B6B;
  border-color: rgba(255, 107, 107, 0.35);
}

.movie-info-remove-btn:hover {
  background: rgba(255, 107, 107, 0.22);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255,107,107,0.2);
}
</style>
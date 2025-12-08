<template>
  <div>
    <div class="spacing" :class="$style.info">
      <div :class="$style.left">
        <div :class="$style.poster">
          <img
            v-if="poster"
            v-lazyload="poster"
            class="lazyload"
            :alt="name">
          <span v-else>
             <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd" fill="#999"><path d="M24 22h-24v-20h24v20zm-1-19h-22v18h22v-18zm-1 16h-19l4-7.492 3 3.048 5.013-7.556 6.987 12zm-11.848-2.865l-2.91-2.956-2.574 4.821h15.593l-5.303-9.108-4.806 7.243zm-4.652-11.135c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5zm0 1c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5z"/></svg>
          </span>
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
              <div :class="$style.label">Released</div>
              <div :class="$style.value">{{ item.release_date | fullDate }}</div>
            </li>
            <li v-if="item.runtime">
              <div :class="$style.label">Runtime</div>
              <div :class="$style.value">{{ item.runtime | runtime }}</div>
            </li>
            <li v-if="directors">
              <div :class="$style.label">Director</div>
              <div :class="$style.value" v-html="directors" />
            </li>
            <li v-if="item.budget">
              <div :class="$style.label">Budget</div>
              <div :class="$style.value">${{ item.budget | numberWithCommas }}</div>
            </li>
            <li v-if="item.revenue">
              <div :class="$style.label">Revenue</div>
              <div :class="$style.value">${{ item.revenue | numberWithCommas }}</div>
            </li>
            <li v-if="item.genres && item.genres.length">
              <div :class="$style.label">Genre</div>
              <div :class="$style.value" v-html="formatGenres(item.genres)" />
            </li>
            <li v-if="item.status">
              <div :class="$style.label">Status</div>
              <div :class="$style.value">{{ item.status }}</div>
            </li>
            <li v-if="item.original_language">
              <div :class="$style.label">Language</div>
              <div :class="$style.value">{{ item.original_language | fullLang }}</div>
            </li>
            <li v-if="item.production_companies && item.production_companies.length">
              <div :class="$style.label">Production</div>
              <div :class="$style.value" v-html="formatProductionCompanies(item.production_companies)" />
            </li>
          </ul>
        </div>

         <div :class="$style.external">
          <ExternalLinks :links="item.external_ids" />
        </div>

        <div :class="$style.watchSection">
          <WatchOn 
            :providers="providersToDisplay"
            :imdb-id="item.external_ids.imdb_id"
            type="movie" 
          />
        </div>

        <div class="reviews-section" v-if="reviews && reviews.length">
          <br>
          <div :class="$style.reviewsHeader">
            <div :class="$style.headerLeft">
               <h4 :class="$style.sectionTitle">REVIEWS ({{ reviewCount }})</h4>
               <span :class="$style.spoilerBanner">
                WARNING: MAY CONTAIN SPOILERS
               </span>
            </div>
            
            <button @click="toggleFullReviews" :class="$style.toggleReviewsBtn">
              {{ showFullReviews ? 'Hide Reviews' : 'Show Reviews' }}
            </button>
          </div>

          <ul class="nolist" v-show="showFullReviews">
              <li v-for="(review, index) in reviews" :key="index" :class="$style.reviewCard">
                  <div :class="$style.reviewHeader">
                    <div :class="$style.reviewAuthor">
                      <strong>{{ review.authorName }}</strong>
                      <div v-if="review.authorRating" :class="$style.reviewRatingContainer">
                        <div :class="$style.stars">
                          <div :style="{ width: `${review.authorRating * 10}%` }" />
                        </div>
                        <span :class="$style.ratingNumber">{{ review.authorRating }}</span>
                      </div>
                    </div>
                    <div :class="$style.reviewMeta">
                       <img v-if="review.source === 'Trakt'" src="/traktv-logo.svg" alt="Trakt" :class="$style.sourceLogo" />
                       <img v-else src="/tmdb.svg" alt="TMDB" :class="$style.sourceLogoTMDB" />
                       <span :class="$style.reviewDate">{{ formatCreatedAt(review.createdAt) }}</span>
                    </div>
                  </div>
                  
                  <div :class="$style.reviewBody">
                    <span :class="$style.reviewContent" v-html="formatContent(review.content, index, review.showFullContent)"></span>
                    <span v-if="!review.showFullContent && review.content.split(' ').length > 200" :class="$style.readMore" @click="toggleReadMore(review)">..[Read More]</span>
                  </div>

                  <div :class="$style.reviewActions" v-if="review.url">
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

        <ListingCarousel
          ref="recommendationCarousel"
          v-if="currentRecommendationList && currentRecommendationList.results && currentRecommendationList.results.length"
          :items="currentRecommendationList" />
      </div>
    </div>
  </div>
</template>

<script>
import { apiImgUrl, getMovieProviders, getMovieReviews, getTraktReviews, getMovieRecommended, getPerson, getMoviesByProductionCompany, getIMDbRatingFromDB, enrichMovieWithIMDbRating } from '~/api'; 
import { SUPPORTED_PRODUCTION_COMPANIES } from '~/utils/constants'; 
import { name, directors } from '~/mixins/Details';
import ExternalLinks from '~/components/ExternalLinks';
import WatchOn from '~/components/WatchOn';
import ListingCarousel from '~/components/ListingCarousel';

export default {
  components: {
    ExternalLinks,
    WatchOn,
    ListingCarousel,
    Loader: () => import('~/components/Loader'),
  },

  mixins: [
    name,
    directors,
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
    }
  },

  data() {
    return {
      showFullReviews: false,
      reviews: [],
      localProviders: null,
      
      recommended: null,
      directorItems: null,
      producerItems: null,
      producerItems: null,
      activeTab: null,
      isLoadingRecommendations: true,
    };
  },

  computed: {
    reviewCount() {
      return this.reviews.length;
    },
    poster () {
      if (this.item.poster_path) {
        return `${apiImgUrl}/w500${this.item.poster_path}`;
      } else {
        return false;
      }
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
    }
  },

  watch: {
    item: {
      immediate: true,
      handler() {
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

  methods: {
    resetTabs() {
      this.recommended = null;
      this.directorItems = null;
      this.producerItems = null;
      this.activeTab = null;
      this.isLoadingRecommendations = true;
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
    toggleFullReviews() { this.showFullReviews = !this.showFullReviews; },
    formatGenres(genres) { return genres.map(genre => `<a href="/genre/${genre.id}/movie">${genre.name}</a>`).join(', '); },
    formatProductionCompanies(companies) {
      const { getProductionCompanySlug } = require('~/utils/constants');
      return companies.map(company => {
        const slug = getProductionCompanySlug(company.id);
        if (slug) return `<a href="/production/${slug}">${company.name}</a>`;
        return company.name;
      }).join(', ');
    },
    toggleReadMore(review) { this.$set(review, 'showFullContent', !review.showFullContent); },
    formatContent(content, index, showFullContent) {
      if (!content) return '';
      content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/_([^_]+)_/g, (match, p1) => p1.toUpperCase());
      if (showFullContent) return content; 
      const words = content.split(' ');
      if (words.length > 200) content = words.slice(0, 200).join(' ');
      return content;
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

        const [tmdbResult, traktResult] = await Promise.allSettled([tmdbReviewsPromise, traktReviewsPromise]);
        
        const tmdbReviews = tmdbResult.status === 'fulfilled' ? tmdbResult.value : [];
        const traktReviews = traktResult.status === 'fulfilled' ? traktResult.value : [];

        this.reviews = [...tmdbReviews, ...traktReviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } catch (error) {
        console.error("Error fetching reviews", error);
        this.reviews = [];
      }
    },
    redirectToUrl(url) { window.open(url, '_blank'); },
  },
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.info { 
  background-color: rgba(0, 0, 0, 0.307);
  border-radius: 10px;
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
  @media (min-width: $breakpoint-medium) { flex: 1; }
}
.poster {
  position: relative;
  height: 0;
  padding-top: 150.27%;
  overflow: hidden;
  border-radius: 10px;
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
  background-color: rgba(12, 33, 42, 0.6);
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
  background-image: url('~assets/images/stars.png');
  background-repeat: no-repeat;
  background-size: auto 100%;
  margin-bottom: 0.2rem;

  > div {
    height: 100%;
    background-image: url('~assets/images/stars-filled.png');
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

.reviewsHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.headerLeft {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  
  @media (min-width: $breakpoint-medium) {
    flex-direction: row;
    align-items: center;
    gap: 2rem;
  }
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
  font-size: 1.2rem;
  color: #8AE8FC;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 1px solid rgba(138, 232, 252, 0.3);
  padding: 0.4rem 1rem;
  border-radius: 4px;
  background: rgba(138, 232, 252, 0.05);
  cursor: default;
  display: inline-block;
  text-align: center;
}

.toggleReviewsBtn {
  background: transparent;
  border: 1px solid #8AE8FC;
  color: #8AE8FC;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    background: rgba(138, 232, 252, 0.1);
    box-shadow: 0 0 15px rgba(138, 232, 252, 0.15);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(1px);
  }
}

.reviewCard {
  background-color: rgba(12, 33, 42, 0.6);
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
</style>

<style lang="scss" scoped>
.recommendations-wrapper {
  background-color: rgba(0, 0, 0, 0.307);
  margin: 2.5rem 1.5rem;
  border-radius: 10px;

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
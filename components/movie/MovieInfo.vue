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
          <h2 :class="$style.title">Sinopsis</h2>
          <div v-html="item.overview" />
        </div>

        <div :class="$style.stats">
          <ul class="nolist">
            <li v-if="showOriginalTitle">
              <div :class="$style.label">Título Original</div>
              <div :class="$style.value">{{ item.original_title }}</div>
            </li>
            <li v-if="item.release_date">
              <div :class="$style.label">Lanzamiento</div>
              <div :class="$style.value">{{ item.release_date | fullDate }}</div>
            </li>
            <li v-if="item.runtime">
              <div :class="$style.label">Duración</div>
              <div :class="$style.value">{{ item.runtime | runtime }}</div>
            </li>
            <li v-if="directors">
              <div :class="$style.label">Director</div>
              <div :class="$style.value" v-html="directors" />
            </li>
            <li v-if="item.budget">
              <div :class="$style.label">Presupuesto</div>
              <div :class="$style.value">${{ item.budget | numberWithCommas }}</div>
            </li>
            <li v-if="item.revenue">
              <div :class="$style.label">Recaudación</div>
              <div :class="$style.value">${{ item.revenue | numberWithCommas }}</div>
            </li>
            <li v-if="item.genres && item.genres.length">
              <div :class="$style.label">Género</div>
              <div :class="$style.value" v-html="formatGenres(item.genres)" />
            </li>
            <li v-if="item.status">
              <div :class="$style.label">Estado</div>
              <div :class="$style.value">{{ item.status }}</div>
            </li>
            <li v-if="item.original_language">
              <div :class="$style.label">Idioma Original</div>
              <div :class="$style.value">{{ item.original_language | fullLang }}</div>
            </li>
            <li v-if="item.production_companies && item.production_companies.length">
              <div :class="$style.label">Producción</div>
              <div :class="$style.value" v-html="formatProductionCompanies(item.production_companies)" />
            </li>
          </ul>
        </div>

        <div :class="$style.watchSection">
          <WatchOn 
            :providers="providersToDisplay"
            :imdb-id="item.external_ids.imdb_id"
            type="movie" 
          />
        </div>

        <div :class="$style.external">
          <ExternalLinks :links="item.external_ids" />
        </div>

        <div v-if="reviews && reviews.length" class="reviews-container">
          <br>
          <strong style="letter-spacing: 2px; font-size: 16px;" class="label">Reseñas ({{ reviewCount }})<br><span style="cursor: pointer; letter-spacing: 2px; font-size: 15px; color: #8AE8FC;" @click="toggleFullReviews"> ADVERTENCIA: PUEDE CONTENER SPOILERS</span></strong>
          <ul class="nolist" v-show="showFullReviews">
              <li v-for="(review, index) in reviews" :key="index" style="margin-top: 3rem;">
                  <p v-if="showFullReviews || (review.authorName && review.authorRating !== null)">
                      <strong style="letter-spacing: 2px; font-size: 14px;">Escrito por:</strong> <a style="cursor: pointer; letter-spacing: 2px; font-size: 14px;" @click="redirectToUrl(review.url)">{{ review.authorName }}</a><br>
                      <strong style="letter-spacing: 2px; font-size: 14px;">Fecha:</strong> <span style="letter-spacing: 2px; font-size: 14px;">{{ formatCreatedAt(review.createdAt) }}</span><br>
                      <strong style="letter-spacing: 2px; font-size: 14px;">Calificación:</strong> <span style="letter-spacing: 2px; font-size: 14px;">{{ review.authorRating }}</span><br>
                      <span style="font-size: 1.5rem; color: #B1BABF; font-style: italic;" v-html="formatContent(review.content, index, review.showFullContent)"></span><br>
                      <span v-if="!review.showFullContent && review.content.split(' ').length > 200" style="cursor: pointer; color: #8AE8FC; letter-spacing: 2px; font-size: 12px;" @click="toggleReadMore(review)">..[Leer Más].</span>
                  </p>
              </li>
          </ul>
        </div>
      </div>
    </div>
    
    <div v-if="hasAnyRecommendations" class="recommendations-wrapper">
      <h2 :class="$style.title" style="padding-left: 2rem; margin-top: 1rem; position:relative; background-image: transparent;">Recomendaciones</h2>
      
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
</template>

<script>
import axios from 'axios';
import { apiImgUrl, getMovieProviders, getMovieReviews, getMovieRecommended, getPerson, getMoviesByProductionCompany, getIMDbRatingFromDB } from '~/api'; 
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
      activeTab: null,
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
      if (this.recommended?.results?.length) tabs.push({ key: 'similar', label: 'Más Como Esto' });
      if (this.directorItems?.results?.length) tabs.push({ key: 'director', label: 'Del Mismo Director' });
      if (this.producerItems?.results?.length) tabs.push({ key: 'producer', label: 'De las Mismas Productoras' });
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
    },
    async fetchSecondaryData() {
      const p1 = this.fetchRecommended();
      const p2 = this.fetchDirectorMovies();
      const p3 = this.fetchProducerMovies();

      await Promise.allSettled([p1, p2, p3]);
      this.setSmartDefaultTab();
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
      return await Promise.all(items.map(async (item) => {
          if (item.imdb_rating) return item;
          try {
            const detailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${item.id}`, {
                params: { api_key: process.env.API_KEY, append_to_response: 'external_ids' }
            });
            const imdbId = detailsResponse.data.external_ids?.imdb_id;
            if (imdbId) {
                const imdbData = await getIMDbRatingFromDB(imdbId);
                if (imdbData.found) {
                    return { ...item, imdb_rating: imdbData.score, rating_source: 'imdb' };
                }
            }
          } catch (error) {}
          return { ...item, rating_source: 'tmdb' };
      }));
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
        const reviews = await getMovieReviews(this.item.id);
        this.reviews = reviews;
      } catch (error) {}
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

.tabs-container {
  width: 100%;
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
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
    color: #8AE8FC;
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
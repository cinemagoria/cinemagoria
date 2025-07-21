<template>
  <div class="tv-releases-carousel">
    <div class="carousel">
      <div v-if="title" class="listing__head" style="margin: 0 auto; letter-spacing: 1.5px;">
        <h3 class="listing__title">{{ title }}</h3>
      </div>
      <div style="top: 1rem; position:relative;">
        <button
          class="carousel__nav carousel__nav-left"
          aria-label="Previous"
          type="button"
          :disabled="disableLeftButton"
          @click="moveToClickEvent('left')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M17.9 23.2L6.1 12 17.9.8"/>
          </svg>
        </button>

        <div ref="carouselElement" class="carousel__items" @scroll="scrollEvent">
          <div 
            v-for="item in processedItems" 
            :key="`${item.id}-tv`" 
            class="tv-release-card"
            @click="redirectToRoute(item)"
          >
            <div class="tv-release-card__image">
              <img 
                :src="getEpisodeImageUrl(item)" 
                :alt="getEpisodeTitle(item)"
                @error="handleImageError"
              >
              <div v-if="item.nextEpisode" class="episode-badge">
                Next Episode
              </div>
            </div>

            <div class="tv-release-card__info">
              <h3 class="tv-release-card__title">{{ truncateTitle(getTitle(item)) }}</h3>
              <div v-if="item.nextEpisode" class="episode-info">
                <p class="episode-details">
                  S{{ item.nextEpisode.season_number }}E{{ item.nextEpisode.episode_number }}
                </p>
                <p class="episode-name">{{ truncateEpisodeName(item.nextEpisode.name) }}</p>
                <p class="episode-date">{{ formatDate(item.nextEpisode.air_date) }}</p>
                <div class="episode-plot">
                  <p 
                    v-if="item.nextEpisode.overview"
                    class="plot-text" 
                    :class="{ 'expanded': expandedPlots[item.id] }"
                  >
                    {{ item.nextEpisode.overview }}
                  </p>
                  <p v-else class="plot-text no-plot">
                    No plot available for next episode.
                  </p>
                  <button 
                    v-if="item.nextEpisode.overview && shouldShowToggle(item.nextEpisode.overview)"
                    class="plot-toggle"
                    @click.stop="togglePlot(item.id)"
                  >
                    {{ expandedPlots[item.id] ? 'SHOW LESS' : 'SHOW MORE' }}
                  </button>
                </div>
              </div>
              <div v-else class="no-episode-info">
                <p class="tv-release-card__year">{{ extractYear(getDate(item)) }}</p>
                <p class="tv-release-card__status">{{ item.status || 'Unknown Status' }}</p>
              </div>
            </div>
          </div>
        </div>

        <button
          class="carousel__nav carousel__nav-right"
          aria-label="Next"
          type="button"
          :disabled="disableRightButton"
          @click="moveToClickEvent('right')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M6.1 23.2L17.9 12 6.1.8"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import carousel from '~/mixins/Carousel';

export default {
  name: 'TvShowReleasesCarousel',

  mixins: [carousel],

  props: {
    title: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  data() {
    return {
      expandedPlots: {},
    };
  },

  computed: {
    processedItems() {
      const mapped = this.items.map(item => ({
        ...item,
        nextEpisode: item.nextEpisode,
        status: item.status || 'Unknown',
        // Convert the data structure to match what we expect
        id: item.id,
        name: item.name,
        poster_path: item.poster_path,
        vote_average: item.vote_average,
        first_air_date: item.firstAirDate,
      }));

      // Sort by next episode air date (closest first)
      return mapped.sort((a, b) => {
        if (!a.nextEpisode || !a.nextEpisode.air_date) return 1;
        if (!b.nextEpisode || !b.nextEpisode.air_date) return -1;
        
        const dateA = new Date(a.nextEpisode.air_date);
        const dateB = new Date(b.nextEpisode.air_date);
        
        return dateA - dateB; // Ascending order (closest dates first)
      });
    }
  },

  mounted() {
    if (this.items.length > 0) {
      this.$nextTick(() => {
        this.calculateState(this.items.length);
      });
    }
  },

  watch: {
    items: {
      handler() {
        if (this.items.length > 0) {
          this.$nextTick(() => {
            this.calculateState(this.items.length);
          });
        }
      },
      immediate: true,
    },
  },

  methods: {

    getEpisodeImageUrl(item) {
      // Priority: Episode still_path > Series poster_path > fallback
      if (item.nextEpisode && item.nextEpisode.still_path) {
        return `https://image.tmdb.org/t/p/w500${item.nextEpisode.still_path}`;
      }
      if (item.poster_path) {
        return `https://image.tmdb.org/t/p/w500${item.poster_path}`;
      }
      return '/static/image_not_found.png';
    },

    getEpisodeTitle(item) {
      if (item.nextEpisode && item.nextEpisode.name) {
        return `${item.name} - ${item.nextEpisode.name}`;
      }
      return item.name || 'Unknown Title';
    },

    togglePlot(itemId) {
      this.$set(this.expandedPlots, itemId, !this.expandedPlots[itemId]);
    },

    shouldShowToggle(text) {
      // Check if text would be truncated (roughly 2 lines at ~40 chars per line)
      return text && text.length > 120;
    },

    getTitle(item) {
      return item.title || item.name || 'Unknown Title';
    },

    getDate(item) {
      return item.release_date || item.first_air_date || '';
    },

    extractYear(date) {
      return date ? date.split('-')[0] : '';
    },

    truncateTitle(title) {
      return title.length > 18 ? title.slice(0, 18) + '...' : title;
    },

    truncateEpisodeName(name) {
      if (!name) return 'TBA';
      return name.length > 25 ? name.slice(0, 25) + '...' : name;
    },

    formatRating(rating) {
      return parseFloat(rating).toFixed(1);
    },

    formatDate(dateString) {
      if (!dateString) return 'TBA';
      
      const date = new Date(dateString);
      const now = new Date();
      
      if (date.toDateString() === now.toDateString()) {
        return 'Today';
      }
      
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
      }
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    },

    handleImageError(event) {
      event.target.src = '/static/image_not_found.png';
    },

    redirectToRoute(item) {
      const route = `/tv/${item.id}`;
      window.open(route, '_blank');
    },
  },
};
</script>

<style scoped>
.tv-releases-carousel {
  margin: 2rem 0;
  width: 100%;
}

.listing__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.listing__title {
  letter-spacing: 0.4px;
  color: #fff;
  margin: 0;
  font-size: 1.8rem;
}

@media (min-width: 300px) {
  .listing__title {
    margin-left: 1.5rem;
  }
}

@media (min-width: 800px) {
  .listing__title {
    margin-left: 3rem;
  }
}

@media (min-width: 767px) and (max-width: 1199px) {
  .listing__title {
    margin-left: 4rem;
  }
}

@media (min-width: 1200px) {
  .listing__title {
    margin-left: 5rem;
  }
}

.carousel {
  position: relative;
  display: flex;
  flex-direction: column;
}

.carousel__items {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  gap: 1.5rem;
  padding: 0 3rem;
}

.carousel__items::-webkit-scrollbar {
  display: none;
}

.carousel__nav {
  position: absolute;
  background: rgba(8, 45, 62, 0.8);
  border: 1px solid rgba(127, 219, 241, 0.3);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.carousel__nav:hover:not(:disabled) {
  background: rgba(127, 219, 241, 0.2);
  border-color: rgba(127, 219, 241, 0.6);
}

.carousel__nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.tv-releases-carousel .carousel__nav-left {
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.tv-releases-carousel .carousel__nav-right {
  right: 0;
  top: 58%;
  transform: translateY(-50%);
}

.tv-release-card {
  flex: 0 0 auto;
  width: 320px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tv-release-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(31, 97, 135, 0.4), 0 0 40px rgba(127, 219, 241, 0.3);
}

.tv-release-card__image {
  position: relative;
  border-radius: 15px 15px 0 0;
  overflow: hidden;
  box-shadow: 0 21px 10px 0 rgba(31, 104, 135, 0.37);
  backdrop-filter: blur(16px);
  margin-bottom: 0;
}

.tv-release-card__image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.episode-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #7FDBF1, #8BE9FD);
  color: #000;
  padding: 8px 16px;
  border-radius: 18px;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 12px rgba(127, 219, 241, 0.4);
}

.tv-release-card__info {
  background: rgba(0, 0, 0, 0.85);
  border-radius: 0 0 15px 15px;
  padding: 16px 12px;
  text-align: left;
  position: relative;
  top: -15px;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 6px;
  overflow: visible;
  word-wrap: break-word;
  transition: min-height 0.4s ease;
}

.tv-release-card__title {
  font-size: 1.4rem;
  margin: 0 0 8px 0;
  color: #8BE9FD;
  font-weight: 600;
  transition: color 0.3s ease;
  line-height: 1.3;
  word-wrap: break-word;
  overflow-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 3.4rem;
}

.tv-release-card:hover .tv-release-card__title {
  color: #ffffff;
}

.episode-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 4px 0;
}



.episode-details {
  font-size: 1.2rem;
  color: #7FDBF1;
  font-weight: 700;
  margin: 0;
}

.episode-date {
  font-size: 1rem;
  color: #acafb5;
  margin: 0;
  font-weight: 500;
}

.episode-name {
  font-size: 1.1rem;
  color: #ffffff;
  margin: 0;
  font-weight: 600;
  line-height: 1.3;
  word-wrap: break-word;
}

.no-episode-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 8px 0;
}

.tv-release-card__year {
  font-size: 1.1rem;
  color: #acafb5;
  margin: 0;
}

.tv-release-card__status {
  font-size: 1rem;
  color: #7FDBF1;
  margin: 0;
  font-weight: 500;
}

.tv-release-card__rating {
  font-size: 1.1rem;
  color: #7FDBF1;
  margin: 8px 0 0 0;
  font-weight: 500;
}

.episode-plot {
  margin-top: 6px;
  width: 100%;
  overflow: visible;
}

.plot-text {
  font-size: 1rem;
  color: #acafb5;
  margin: 0;
  line-height: 1.4;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  white-space: normal;
  transition: all 0.4s ease;
}

.plot-text:not(.expanded) {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.plot-text.expanded {
  display: block;
  -webkit-line-clamp: unset;
  overflow: visible;
  text-overflow: unset;
  max-height: none;
  white-space: normal;
}

.plot-toggle {
  background: linear-gradient(135deg, #7FDBF1, #8BE9FD);
  border: none;
  color: #000;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 8px 16px;
  margin-top: 8px;
  border-radius: 20px;
  transition: all 0.3s ease;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  width: auto;
  min-width: 100px;
  align-self: flex-start;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plot-toggle:hover {
  background: linear-gradient(135deg, #8BE9FD, #7FDBF1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(127, 219, 241, 0.3);
}

.no-plot {
  font-style: italic;
  opacity: 0.7;
}

@media screen and (max-width: 768px) {
  .tv-release-card {
    width: 280px;
  }

  .tv-release-card__image img {
    height: 160px;
  }

  .tv-release-card__title {
    font-size: 1.2rem;
    -webkit-line-clamp: 2;
    max-height: 3rem;
  }

  .tv-release-card__info {
    min-height: 170px;
    padding: 14px 10px;
  }

  .episode-details {
    font-size: 1.1rem;
  }

  .plot-text {
    font-size: 0.95rem;
  }

  .plot-toggle {
    font-size: 0.8rem;
    padding: 5px 10px;
  }

  .carousel__items {
    padding: 0 2rem;
    gap: 1rem;
  }

  .carousel__nav {
    width: 40px;
    height: 40px;
  }
}

@media screen and (max-width: 576px) {
  .tv-release-card {
    width: 200px;
  }

  .tv-release-card__image img {
    height: 140px;
  }

  .tv-release-card__title {
    font-size: 1.1rem;
    -webkit-line-clamp: 2;
    max-height: 2.8rem;
    line-height: 1.25;
  }

  .tv-release-card__info {
    min-height: 150px;
    padding: 12px 8px;
  }

  .episode-details,
  .tv-release-card__year,
  .tv-release-card__rating {
    font-size: 1rem;
  }

  .episode-name {
    font-size: 0.9rem;
  }

  .episode-date {
    font-size: 0.8rem;
  }

  .plot-text,
  .plot-toggle {
    font-size: 0.8rem;
  }

  .carousel__items {
    padding: 0 1.5rem;
  }
}

@media screen and (max-width: 400px) {
  .tv-release-card {
    width: 180px;
  }

  .tv-release-card__image img {
    height: 120px;
  }

  .tv-release-card__title {
    font-size: 1rem;
    max-height: 2.5rem;
  }

  .tv-release-card__info {
    min-height: 140px;
    padding: 10px 6px;
  }

  .episode-badge {
    font-size: 0.65rem;
    padding: 3px 6px;
  }

  .plot-text,
  .plot-toggle {
    font-size: 0.75rem;
  }
}
</style>
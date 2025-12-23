<template>
    <div class="search-carousel">
      <div class="carousel">
        <div v-if="title" class="listing__head">
          <h3 class="default-note" s>{{ title }}</h3>
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
                    v-for="item in items" 
                    :key="`${item.id}-${item.media_type || type}`" 
                    class="search-card"
                    @click="redirectToRoute(item)"
                >
                    <div class="search-card__image">
                    <QuickFav :item="item" />
                    <img 
                        :src="getPosterUrl(item)" 
                        :alt="getTitle(item)"
                        @error="handleImageError"
                    >
                    </div>
        
                    <div class="search-card__info">
                    <h3 class="search-card__title">{{ truncateTitle(getTitle(item)) }}</h3>
                    <p class="search-card__year">{{ extractYear(getDate(item)) }}</p>
                    <p v-if="item.rating_source === 'imdb' && item.imdb_rating" class="search-card__rating">
                       {{ formatRating(item.imdb_rating) }} IMDb
                    </p>
                    <p v-else-if="item.vote_average" class="search-card__rating">
                       {{ formatRating(item.vote_average) }} TMDB
                    </p>
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
  import QuickFav from '~/components/global/QuickFav';
  
  export default {
    name: 'DynamicSearchCarousel',
    components: {
        QuickFav,
    },
  
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
      type: {
        type: String,
        required: false,
        default: 'movie',
      },
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
      getPosterUrl(item) {
        if (item.poster_path) {
          return `https://image.tmdb.org/t/p/w500${item.poster_path}`;
        }
          return '/image_not_found.webp';
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
        return title.length > 20 ? title.slice(0, 20) + '...' : title;
      },
  
      formatRating(rating) {
        return parseFloat(rating).toFixed(1);
      },
  
      handleImageError(event) {
        event.target.src = '/image_not_found.webp';
      },
  
      redirectToRoute(item) {
        const mediaType = item.media_type || this.type;
        const route = mediaType === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;
        this.$router.push(route);
      },
    },
  };
  </script>
  
  <style scoped>
  .search-carousel {
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
    gap: 1rem;
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
  
  .carousel__nav-left {
    left: 0;
    top: 40% !important;
  }
  
  .carousel__nav-right {
    right: 0;
    top: 50% !important;
  }
  
  .search-card {
    flex: 0 0 auto;
    width: 200px;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .search-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(31, 97, 135, 0.5);
  }
  
  .search-card__image {
    position: relative;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 21px 10px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur(16px);
    margin-bottom: 10px;
  }
  
  .search-card__image img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    display: block;
  }
  
  .search-card__info {
    background: rgba(0, 0, 0, 0.8);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    padding: 15px 10px;
    text-align: center;
    position: relative;
    top: -15px;
    min-height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .search-card__title {
    font-size: 1.4rem;
    margin: 0 0 8px 0;
    color: #8BE9FD;
    font-weight: 600;
    transition: color 0.3s ease;
    line-height: 1.3;
  }
  
  .search-card:hover .search-card__title {
    color: #ffffff;
  }
  
  .search-card__year {
    font-size: 1.2rem;
    color: #acafb5;
    margin: 8px 0;
  }
  
  .search-card__rating {
    font-size: 1.2rem;
    color: #7FDBF1;
    margin: 8px 0 0 0;
  }
  
  .search-card__title {
  font-size: 1.4rem;
  margin: 0 0 8px 0;
  color: #8BE9FD;
  font-weight: 600;
  transition: color 0.3s ease;
  line-height: 1.3;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 3.4rem;
}

.search-card__info {
  background: rgba(0, 0, 0, 0.8);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 15px 10px;
  text-align: center;
  position: relative;
  top: -15px;
  min-height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 5px;
}

.default-note {
  text-align: center;
  font-size: 13px;
  color: #acafb5;
  margin-top: 20px;
  margin: 0 auto;
}

@media screen and (max-width: 768px) {
  .search-card {
    width: 150px;
  }

  .search-card__image img {
    height: 225px;
  }

  .search-card__title {
    font-size: 1.2rem;
    -webkit-line-clamp: 2;
  line-clamp: 2;
    max-height: 3rem;
  }

  .search-card__info {
    min-height: 100px;
    padding: 12px 8px;
  }

  .carousel__items {
    padding: 0 2rem;
  }

  .carousel__nav {
    width: 40px;
    height: 40px;
  }
}

@media screen and (max-width: 576px) {
  .search-card {
    width: 120px;
  }

  .search-card__image img {
    height: 180px;
  }

  .search-card__title {
    font-size: 1rem;
    -webkit-line-clamp: 2;
  line-clamp: 2;
    max-height: 2.5rem;
    line-height: 1.25;
  }

  .search-card__info {
    min-height: 90px;
    padding: 10px 6px;
  }

  .search-card__year,
  .search-card__rating {
    font-size: 1rem;
  }

  .carousel__items {
    padding: 0 1.5rem;
  }
}

@media screen and (max-width: 400px) {
  .search-card {
    width: 110px;
  }

  .search-card__title {
    font-size: 0.9rem;
    max-height: 2.25rem;
  }

  .search-card__info {
    min-height: 85px;
    padding: 8px 5px;
  }
}


  </style>
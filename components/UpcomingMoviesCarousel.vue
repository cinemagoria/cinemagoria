<template>
    <div class="upcoming-movies-carousel">
      <div class="carousel">
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
              v-for="movie in movies" 
              :key="movie.id" 
              class="movie-card-carousel"
              @click="$emit('movie-click', movie.id)"
            >
              <div class="movie-card-carousel__image">
                <img 
                  v-if="movie.poster_path" 
                  :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" 
                  :alt="movie.title"
                  @error="handleImageError"
                >
                <img 
                  v-else 
                  src="~/static/image_not_found_yet.png" 
                  alt="Image Not Found"
                >
              </div>
  
              <div class="movie-card-carousel__info">
                <h3 class="movie-card-carousel__title">{{ formatTitle(movie.title) }}</h3>
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
    name: 'UpcomingMoviesCarousel',
  
    mixins: [carousel],
  
    props: {
      movies: {
        type: Array,
        required: true,
        default: () => [],
      },
    },
  
    mounted() {
      if (this.movies.length > 0) {
        this.$nextTick(() => {
          this.calculateState(this.movies.length);
        });
      }
    },
  
    watch: {
      movies: {
        handler() {
          if (this.movies.length > 0) {
            this.$nextTick(() => {
              this.calculateState(this.movies.length);
            });
          }
        },
        immediate: true,
      },
    },
  
    methods: {
      formatTitle(title) {
        return title && title.length > 28 ? title.substring(0, 25) + '...' : title || 'Unknown Title';
      },
  
      handleImageError(event) {
        event.target.src = '~/static/image_not_found_yet.png';
      },
    },
  };
  </script>
  
  <style scoped>
  .upcoming-movies-carousel {
    width: 100%;
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
    padding: 0 1rem;
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
    left: 0.5rem;
    top: 45% !important;
    transform: translateY(-50%);
  }
  
  .carousel__nav-right {
    right: 0.5rem;
    top: 50% !important;
    transform: translateY(-50%);
  }
  
  .movie-card-carousel {
    flex: 0 0 auto;
    width: 280px;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    height: 450px;
    position: relative;
  }
  
  .movie-card-carousel:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(31, 97, 135, 0.5);
  }
  
  .movie-card-carousel__image {
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 21px 10px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur(16px);
    flex: 1;
    position: relative;
  }
  
  .movie-card-carousel__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  
  .movie-card-carousel__info {
    background: rgba(0, 0, 0, 0.8);
    border-radius: 0 0 15px 15px;
    padding: 12px 8px;
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 5;
    margin: 0;
    width: 100%;
    box-sizing: border-box;
  }
  
  .movie-card-carousel__title {
    font-size: 1.4rem;
    margin: 0;
    color: #8BE9FD;
    font-weight: 600;
    line-height: 1.3;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    text-align: center;
  }
  
  @media screen and (max-width: 768px) {
    .movie-card-carousel {
      width: 200px;
      height: 350px;
    }
  
    .movie-card-carousel__title {
      font-size: 1.2rem;
      -webkit-line-clamp: 2;
    }
  
    .movie-card-carousel__info {
      min-height: 40px;
      padding: 6px 4px;
    }
  
    .carousel__items {
      padding: 0 0.5rem;
    }
  
    .carousel__nav {
      width: 40px;
      height: 40px;
    }
  }
  
  @media screen and (max-width: 576px) {
    .movie-card-carousel {
      width: 160px;
      height: 280px;
    }
  
    .movie-card-carousel__title {
      font-size: 1rem;
      -webkit-line-clamp: 2;
      line-height: 1.25;
    }
  
    .movie-card-carousel__info {
      min-height: 50px;
      padding: 10px 6px;
    }
  
    .carousel__items {
      padding: 0 0.5rem;
    }
  }
  
  @media screen and (max-width: 400px) {
    .movie-card-carousel {
      width: 140px;
      height: 260px;
    }
  
    .movie-card-carousel__title {
      font-size: 0.9rem;
    }
  
    .movie-card-carousel__info {
      min-height: 45px;
      padding: 8px 5px;
    }
  }
  </style>
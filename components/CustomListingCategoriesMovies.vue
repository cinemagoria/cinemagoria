<template>
    <div class="listing-carousel-categories">
      <div class="carousel">
        <div v-if="title || viewAllUrl" class="listing__head">
        <h2 class="listing__title">Categories: Movies</h2>
        <nuxt-link v-if="viewAllUrl" :to="viewAllUrl" class="listing__explore">
          <strong>Explore All</strong>
        </nuxt-link>
      </div>
      <button
        class="carousel__nav carousel__nav-left"
        aria-label="Previous"
        type="button"
        :disabled="disableLeftButton"
        @click="moveToClickEvent('left')">
        <!-- eslint-disable-next-line -->
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M17.9 23.2L6.1 12 17.9.8"/></svg>
      </button>
  
        <div ref="carouselElement" class="carousel__items" @scroll="scrollEvent">
          <div v-for="(category, index) in categories" :key="`category-${index}`" class="card" @click="redirectToRoute(category.link)">
            <div class="card__image">
                <img :src="category.image" :alt="category.alt">
            </div>
  
            <div class="card__info">
            <h2 class="card__label">
                <a @click.prevent="redirectToRoute(category.link)" class="category-link">{{ category.alt }}</a>
            </h2>
          </div>
          </div>
        </div>
  
        <button
          class="carousel__nav carousel__nav-right"
          aria-label="Next"
          type="button"
          :disabled="disableRightButton"
          @click="moveToClickEvent('right')">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M6.1 23.2L17.9 12 6.1.8"/></svg>
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import carousel from '~/mixins/Carousel';
  
  export default {
    name: 'CustomListingCategoriesMovies',
  
    mixins: [carousel],
  
    props: {
      title: {
        type: String,
        required: false,
        default: '',
      },
  
      viewAllUrl: {
        type: Object,
        required: false,
        default: null,
      },
    },
  
    data() {
      return {
        categories: [
          { image: "/thumbnails/drama-tv-eng.png", link: "/genre/18/movie", alt: "Drama" },
          { image: "/thumbnails/comedy-movie-eng.png", link: "/genre/35/movie", alt: "Comedy" },
          { image: "/thumbnails/action-movie-eng.png", link: "/genre/28/movie", alt: "Action" },
          { image: "/thumbnails/horror-movie-eng.png", link: "/genre/27/movie", alt: "Horror" },
          { image: "/thumbnails/suspense-movie-eng.png", link: "/genre/53/movie", alt: "Thriller" },
          { image: "/thumbnails/sciencefiction-movie-eng.png", link: "/genre/878/movie", alt: "Science-Fiction" },
          { image: "/thumbnails/adventure-tv-eng.png", link: "/genre/12/movie", alt: "Adventure" },
          { image: "/thumbnails/crime-movie-eng.png", link: "/genre/80/movie", alt: "Crime" },
          { image: "/thumbnails/history-movie-eng.png", link: "/genre/36/movie", alt: "History" },
          { image: "/thumbnails/documentary-movie-eng.png", link: "/genre/99/movie", alt: "Documentary" },
          { image: "/thumbnails/animation-movie-eng.png", link: "/genre/16/movie", alt: "Animation" },
          { image: "/thumbnails/mistery-movie-eng.png", link: "/genre/9648/movie", alt: "Mistery" }
        ],
      };
    },
  
    methods: {
      redirectToRoute(route) {
        this.$router.push({ path: route });
      },
    },
  };
</script>
<style scoped>
    .listing__title {
      font-size: 1.8rem;
      letter-spacing: 0.4px;
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
        font-size: 2.4rem;
      }
    }
    
    .category-link {
        font-weight: 600;
        color: #80868b;
        text-decoration: none;
        cursor: pointer; 
    }

    .category-link:hover {
        color: #ffffff;
    }

    .card__info {
        margin-left: 1rem;
    }

    .card__image {
        border-radius: 15px;
        cursor: pointer;
    }
</style>

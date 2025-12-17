<template>
    <div class="listing-carousel-categories">
      <br>
        <div v-if="title || viewAllUrl" class="listing__head">
         <h2 class="listing__title">{{ title }}</h2>
         <nuxt-link v-if="viewAllUrl" :to="viewAllUrl" class="listing__explore">
           <strong>Explorar Más</strong>
         </nuxt-link>
       </div>
  
      <div class="carousel">
        <button
          class="carousel__nav carousel__nav---left"
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
            class="carousel__nav carousel__nav---right"
            aria-label="Next"
            type="button"
            :disabled="disableRightButton"
            @click="moveToClickEvent('right')"
          >
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
        default: function () {
          return null;
        },
      },
    },
  
    data() {
      return {
        categories: [
          { image: "/thumbnails/drama-tv-esp.webp", link: "/genre/18/movie", alt: "Drama" },
          { image: "/thumbnails/comedy-movie-esp.webp", link: "/genre/35/movie", alt: "Comedia" },
          { image: "/thumbnails/action-movie-esp.webp", link: "/genre/28/movie", alt: "Acción" },
          { image: "/thumbnails/horror-movie-esp.webp", link: "/genre/27/movie", alt: "Terror" },
          { image: "/thumbnails/suspense-movie-esp.webp", link: "/genre/53/movie", alt: "Suspenso" },
          { image: "/thumbnails/sciencefiction-movie-esp.webp", link: "/genre/878/movie", alt: "Ciencia Ficción" },
          { image: "/thumbnails/adventure-tv-esp.webp", link: "/genre/12/movie", alt: "Aventura" },
          { image: "/thumbnails/crime-movie-esp.webp", link: "/genre/80/movie", alt: "Crimen" },
          { image: "/thumbnails/history-movie-esp.webp", link: "/genre/36/movie", alt: "Historia" },
          { image: "/thumbnails/documentary-movie-esp.webp", link: "/genre/99/movie", alt: "Documentales" },
          { image: "/thumbnails/animation-movie-esp.webp", link: "/genre/16/movie", alt: "Animación" },
          { image: "/thumbnails/mistery-movie-esp.webp", link: "/genre/9648/movie", alt: "Misterio" }
        ],
      };
    },
  
    mounted() {
      this.calculateState(this.categories.length);
    },

    methods: {
      redirectToRoute(route) {
        this.$router.push({ path: route });
      },
    },
  };
</script>
<style scoped>  
    .listing__explore,
    .listing__explore strong {
        color: #8BE9FD !important;
        text-decoration: none;
        transition: color 0.3s;
    }

    .listing__explore:hover,
    .listing__explore:hover strong {
        color: #A2EDFD !important;
    }

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
        color: #ffffff;
        text-decoration: none;
        cursor: pointer; 
    }

    .category-link:hover {
        color: #e0e0e0; 
    }
    .carousel__nav {
        bottom: 0 !important;
        margin-top: 0 !important;
        height: 100%;
    }

    .card {
        position: relative;
        border-radius: 15px;
        overflow: hidden;
        cursor: pointer;
    }

    .card__label {
        font-size: 1.5rem;
        margin-bottom: 0;
        text-align: center;
        color: #ffffff;
        font-weight: bold; 
        text-shadow: 0 2px 8px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.9);
        text-transform: uppercase; 
    }
    
    .card__info {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      z-index: 10;
      padding: 0 10px;
    }

    .card__image {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 15px;
        overflow: hidden;
        transform: translateZ(0);
    }

    .card__image img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: grayscale(100%);
        opacity: 0.8; 
    }

    .card__image::after {
        content: '';
        position: absolute;
        top: 0; 
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #149AB1;
        mix-blend-mode: hard-light;
        opacity: 0.6;
        pointer-events: none;
    }
</style>

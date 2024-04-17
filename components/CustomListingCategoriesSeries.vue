<template>
    <div class="listing-carousel-categories">
      <br>
      <div v-if="title || viewAllUrl" class="listing__head">
        <h2 class="listing__title">Categorías: Series de TV</h2>
        <nuxt-link v-if="viewAllUrl" :to="viewAllUrl" class="listing__explore">
          <strong>Explorar Más</strong>
        </nuxt-link>
      </div>
  
      <div class="carousel">
        <button
          class="carousel__nav carousel__nav--left"
          aria-label="Previous"
          type="button"
          :disabled="disableLeftButton"
          @click="moveToClickEvent('left')">
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
          class="carousel__nav carousel__nav--right"
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
    name: 'CustomListingCategoriesSeries',
  
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
        { image: "/thumbnails/talkshow-tv-esp.png", link: "/genre/10767/tv", alt: "Programas de TV" },
        { image: "/thumbnails/comedy-tv-esp.png", link: "/genre/35/tv", alt: "Comedia" },
        { image: "/thumbnails/mistery-tv-esp.png", link: "/genre/9648/tv", alt: "Misterio" },
        { image: "/thumbnails/sciencefiction-movie-esp.png", link: "/genre/10765/tv", alt: "Ciencia Ficción y Fantasía" },
        { image: "/thumbnails/crime-tv-esp.png", link: "/genre/80/tv", alt: "Crimen" },
        { image: "/thumbnails/documentary-tv-esp.png", link: "/genre/99/tv", alt: "Documentales" },
        { image: "/thumbnails/action-movie-esp.png", link: "/genre/10759/tv", alt: "Acción y Aventuras" },
        { image: "/thumbnails/drama-tv-esp.png", link: "/genre/18/tv", alt: "Drama" }, 
        { image: "/thumbnails/animation-movie-esp.png", link: "/genre/16/tv", alt: "Animación" },
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
  
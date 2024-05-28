<template>
    <section id="carousel">
      <h2 class="title custom-center">
        Buscar por Géneros:
      </h2>
      <br>
      <br>
      <div class="container">
        <h2 class="custom-center" style="font-size: 20px;"><router-link to="/movie">Películas</router-link></h2>
      </div>
      <div class="container">
        
        <div class="swiper carousel-slider">
          <div class="swiper-wrapper">
                <!-- Slide-start -->
                <div class="swiper-slide carousel-slide" @click="redirectToActionMovie">
                  <div class="carousel-slide-img">
                    <img src="~static/thumbnails/action-movie-esp.png" alt="Carousel">
                  </div>
                  <div class="carousel-slide-content">
                    <div class="carousel-slide-content-bottom">
                    </div>
                  </div>
                </div>
                <!-- Slide-end -->
                <!-- Slide-start -->
                <div class="swiper-slide carousel-slide" @click="redirectToScienceFictionMovie">
                  <div class="carousel-slide-img">
                    <img src="~static/thumbnails/sciencefiction-movie-esp.png" alt="Carousel">
                  </div>
                  <div class="carousel-slide-content">
                    
                    <div class="carousel-slide-content-bottom">
                    </div>
                  </div>
                </div>
                <!-- Slide-end -->
                <!-- Slide-start -->
                <div class="swiper-slide carousel-slide" @click="redirectToMisteryMovie">
                  <div class="carousel-slide-img">
                    <img src="~static/thumbnails/mistery-movie-esp.png" alt="Carousel">
                  </div>
                  <div class="carousel-slide-content">
                    
                    <div class="carousel-slide-content-bottom">
                    </div>
                  </div>
                </div>
                <!-- Slide-end -->
                <!-- Slide-start -->
                <div class="swiper-slide carousel-slide" @click="redirectToHorrorMovie">
                  <div class="carousel-slide-img">
                    <img src="~static/thumbnails/horror-movie-esp.png" alt="Carousel">
                  </div>
                  <div class="carousel-slide-content">
                    
                    <div class="carousel-slide-content-bottom">
                    </div>
                  </div>
                </div>
                <!-- Slide-end -->
                <!-- Slide-start -->
                <div class="swiper-slide carousel-slide" @click="redirectToSuspenseMovie">
                  <div class="carousel-slide-img">
                    <img src="~static/thumbnails/suspense-movie-esp.png" alt="Carousel">
                  </div>
                  <div class="carousel-slide-content">
                    
                    <div class="carousel-slide-content-bottom">
                    </div>
                  </div>
                </div>
                <!-- Slide-end -->
                <!-- Slide-start -->
                <div class="swiper-slide carousel-slide" @click="redirectToComedyMovie">
                  <div class="carousel-slide-img">
                    <img src="~static/thumbnails/comedy-movie-esp.png" alt="Carousel">
                  </div>
                  <div class="carousel-slide-content">
                    
                    <div class="carousel-slide-content-bottom">
                    </div>
                  </div>
                </div>
                <!-- Slide-end -->
                <!-- Slide-start -->
                <div class="swiper-slide carousel-slide" @click="redirectToAdventureMovie">
                  <div class="carousel-slide-img">
                    <img src="~static/thumbnails/adventure-tv-esp.png" alt="Carousel">
                  </div>
                  <div class="carousel-slide-content">
                                    <div class="carousel-slide-content-bottom">
                    </div>
                  </div>
                </div>
                <!-- Slide-end -->
                <!-- Slide-start -->
              <div class="swiper-slide carousel-slide" @click="redirectToCrimeMovie">
                  <div class="carousel-slide-img">
                    <img src="~static/thumbnails/crime-movie-esp.png" alt="Carousel">
                  </div>
                  <div class="carousel-slide-content">
                                    <div class="carousel-slide-content-bottom">
                    </div>
                  </div>
                </div>
                <!-- Slide-end -->
              <!-- Slide-start -->
              <div class="swiper-slide carousel-slide" @click="redirectToHistoryMovie">
                  <div class="carousel-slide-img">
                    <img src="~static/thumbnails/history-movie-esp.png" alt="Carousel">
                  </div>
                  <div class="carousel-slide-content">
                                    <div class="carousel-slide-content-bottom">
                    </div>
                  </div>
                </div>
                <!-- Slide-end -->
              <!-- Slide-start -->
              <div class="swiper-slide carousel-slide" @click="redirectToDocumentaryMovie">
                  <div class="carousel-slide-img">
                    <img src="~static/thumbnails/documentary-movie-esp.png" alt="Carousel">
                  </div>
                  <div class="carousel-slide-content">
                                    <div class="carousel-slide-content-bottom">
                    </div>
                  </div>
                </div>
                <!-- Slide-end -->
                <!-- Slide-start -->
              <div class="swiper-slide carousel-slide" @click="redirectToAnimationMovie">
                  <div class="carousel-slide-img">
                    <img src="~static/thumbnails/animation-movie-esp.png" alt="Carousel">
                  </div>
                  <div class="carousel-slide-content">
                                    <div class="carousel-slide-content-bottom">
                    </div>
                  </div>
                </div>
                <!-- Slide-end -->
                <div class="swiper-slide carousel-slide" @click="redirectToDramaMovie">
                  <div class="carousel-slide-img">
                    <img src="~static/thumbnails/drama-tv-esp.png" alt="Carousel">
                  </div>
                  <div class="carousel-slide-content">
                                    <div class="carousel-slide-content-bottom">
                    </div>
                  </div>
                </div>
                <!-- Slide-end -->

          </div>
        </div>
        <!-- <div class="carousel-slider-control"> -->
        <!--   <div class="swiper-button-prev slider-arrow"> -->
        <!--     <img src="~static/previous.png" alt="Previous Arrow"> -->
        <!--   </div> -->
        <!--   <div class="swiper-button-next slider-arrow"> -->
        <!--     <img src="~static/next.png" alt="Next Arrow"> -->
        <!--   </div> -->
        <!--   <div class="swiper-pagination"></div> -->
        <!-- </div> -->
      </div>
      <div class="container">
        <h2 class="custom-center" style="font-size: 20px; margin-top: 30px;"><router-link to="/tv">Series de TV</router-link></h2>
      </div>
      <div class="container">
        <div class="swiper carousel-slider">
          <div class="swiper-wrapper">
                <!-- Slide-start -->
                <div class="swiper-slide carousel-slide" @click="redirectToComedyTv">
                  <div class="carousel-slide-img">
                    <img src="~static/thumbnails/comedy-tv-esp.png" alt="Carousel">
                  </div>
                  <div class="carousel-slide-content">
                    
                    <div class="carousel-slide-content-bottom">
                    </div>
                  </div>
                </div>
                <!-- Slide-end -->
                <!-- Slide-start -->
                <div class="swiper-slide carousel-slide" @click="redirectToDocumentaryTv">
                  <div class="carousel-slide-img">
                    <img src="~static/thumbnails/documentary-tv-esp.png" alt="Carousel">
                  </div>
                  <div class="carousel-slide-content">
                    
                    <div class="carousel-slide-content-bottom">
                    </div>
                  </div>
                </div>
                <!-- Slide-end -->
                <!-- Slide-start -->
                <div class="swiper-slide carousel-slide" @click="redirectToActionTv">
                  <div class="carousel-slide-img">
                    <img src="~static/thumbnails/action-movie-esp.png" alt="Carousel">
                  </div>
                  <div class="carousel-slide-content">
                    
                    <div class="carousel-slide-content-bottom">
                    </div>
                  </div>
                </div>
                <!-- Slide-end -->
                <!-- Slide-start -->
                <div class="swiper-slide carousel-slide" @click="redirectToScienceFictionTv">
                  <div class="carousel-slide-img">
                    <img src="~static/thumbnails/sciencefiction-movie-esp.png" alt="Carousel">
                  </div>
                  <div class="carousel-slide-content">
                    
                    <div class="carousel-slide-content-bottom">
                    </div>
                  </div>
                </div>
                <!-- Slide-end -->
                <!-- Slide-start -->
                <div class="swiper-slide carousel-slide" @click="redirectToCrimeTv">
                  <div class="carousel-slide-img">
                    <img src="~static/thumbnails/crime-tv-esp.png" alt="Carousel">
                  </div>
                  <div class="carousel-slide-content">
                    
                    <div class="carousel-slide-content-bottom">
                    </div>
                  </div>
                </div>
                <!-- Slide-end -->
                <!-- Slide-start -->
                <div class="swiper-slide carousel-slide" @click="redirectToDramaTv">
                  <div class="carousel-slide-img">
                    <img src="~static/thumbnails/drama-tv-esp.png" alt="Carousel">
                  </div>
                  <div class="carousel-slide-content">
                    
                    <div class="carousel-slide-content-bottom">
                    </div>
                  </div>
                </div>
                <!-- Slide-end -->
                <!-- Slide-start -->
                <div class="swiper-slide carousel-slide" @click="redirectToMisteryTv">
                  <div class="carousel-slide-img">
                    <img src="~static/thumbnails/mistery-tv-esp.png" alt="Carousel">
                  </div>
                  <div class="carousel-slide-content">
                                    <div class="carousel-slide-content-bottom">
                    </div>
                  </div>
                </div>
                <!-- Slide-end -->
                <!-- Slide-start -->
              <div class="swiper-slide carousel-slide" @click="redirectToAnimationTv">
                  <div class="carousel-slide-img">
                    <img src="~static/thumbnails/animation-movie-esp.png" alt="Carousel">
                  </div>
                  <div class="carousel-slide-content">
                                    <div class="carousel-slide-content-bottom">
                    </div>
                  </div>
                </div>
                <!-- Slide-end -->
              <!-- Slide-start -->
              <div class="swiper-slide carousel-slide" @click="redirectToTalkshowTv">
                  <div class="carousel-slide-img">
                    <img src="~static/thumbnails/talkshow-tv-esp.png" alt="Carousel">
                  </div>
                  <div class="carousel-slide-content">
                                    <div class="carousel-slide-content-bottom">
                    </div>
                  </div>
                </div>
                <!-- Slide-end -->  
          </div>
        
        <!-- <div class="carousel-slider-control"> -->
        <!--   <div class="swiper-button-prev slider-arrow"> -->
        <!--     <img src="~static/previous.png" alt="Previous Arrow"> -->
        <!--   </div> -->
        <!--   <div class="swiper-button-next slider-arrow"> -->
        <!--     <img src="~static/next.png" alt="Next Arrow"> -->
        <!--   </div> -->
        <!--   <div class="swiper-pagination"></div> -->
        <!-- </div> -->
  
        </div>
        
      </div>
    </section>
  </template>
  
  <script>
import Swiper from 'swiper';
import 'swiper/swiper-bundle.min.css';

export default {
  methods: {
    redirectToDramaMovie() {
    this.$router.push("/genre/18/movie");
    },
    redirectToComedyMovie() {
      this.$router.push("/genre/35/movie");
    },
    redirectToActionMovie() {
      this.$router.push("/genre/28/movie");
    },
    redirectToHorrorMovie() {
      this.$router.push("/genre/27/movie");
    },
    redirectToSuspenseMovie() {
      this.$router.push("/genre/53/movie");
    },
    redirectToScienceFictionMovie() {
      this.$router.push("/genre/878/movie");
    },
    redirectToAdventureMovie() {
      this.$router.push("/genre/12/movie");
    },
    redirectToCrimeMovie() {
      this.$router.push("/genre/80/movie");
    },
    redirectToHistoryMovie() {
      this.$router.push("/genre/36/movie");
    },
    redirectToDocumentaryMovie() {
      this.$router.push("/genre/99/movie");
    },
    redirectToAnimationMovie() {
      this.$router.push("/genre/16/movie");
    },
    redirectToMisteryMovie() {
      this.$router.push("/genre/9648/movie");
    },
    redirectToDramaTv() {
      this.$router.push("/genre/18/tv");
    },
    redirectToComedyTv() {
      this.$router.push("/genre/35/tv");
    },
    redirectToActionTv() {
      this.$router.push("/genre/10759/tv");
    },
    redirectToScienceFictionTv() {
      this.$router.push("/genre/10765/tv");
    },
    redirectToCrimeTv() {
      this.$router.push("/genre/80/tv");
    },
    redirectToDocumentaryTv() {
      this.$router.push("/genre/99/tv");
    },
    redirectToTalkshowTv() {
      this.$router.push("/genre/10767/tv");
    },
    redirectToAnimationTv() {
      this.$router.push("/genre/16/tv");
    },
    redirectToMisteryTv() {
      this.$router.push("/genre/9648/tv");
    }
  },
  mounted() {
    new Swiper('.carousel-slider', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      loop: true,
      slidesPerView: 'auto',
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2.5,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    });
  }
}
</script>

  
  <style scoped>
  /* Estilos CSS */
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap");
*,
*::before,
*::after {
  margin: 0;
  padding: 1px;;
  box-sizing: border-box;
  list-style-type: none;
  text-decoration: none;
}

:root {
  --primary: #ec994b;
  --white: #ffffff;
  --bg: #f5f5f5;
}

html {
  font-family: "Montserrat", sans-serif;
  scroll-behavior: smooth;
}

.title {
  font-size: 28px;
  max-width: 930px;
  padding-top: 20px;
  padding-bottom: 20px;
  margin: 0 auto;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(115, 115, 115) 100%);
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
  font-family: 'Roboto', sans-serif;
}


.custom-center {
  text-align: center;
}

@media (min-width: 1440px) {
  html {
    zoom: 1.5;
  }
}

@media (min-width: 2560px) {
  html {
    zoom: 1.7;
  }
}

@media (min-width: 3860px) {
  html {
    zoom: 2.5;
  }
}

::-webkit-scrollbar {
  width: 1.3rem;
}

::-webkit-scrollbar-thumb {
  border-radius: 1rem;
  background: #797979;
  transition: all 0.5s ease-in-out;
}

::-webkit-scrollbar-thumb:hover {
  background: #222224;
}

::-webkit-scrollbar-track {
  background: #f9f9f9;
}

body {
  font-size: 1.6rem;
  background: var(--bg);
}

.container {
  max-width: 124rem;
  padding: 0 1rem;
  margin: 0 auto;
}

.text-center {
  text-align: center;
}

.section-heading {
  font-size: 3rem;
  color: var(--primary);
  padding: 2rem 0;
}

#carousel {
  padding: 4rem 0;
}

#carousel .carousel-slider {
  height: 52rem;
  padding: 2rem 0;
  position: relative;
}

@media (max-width:500px) {
  #carousel .carousel-slider {
    height: 45rem;
  }
}

.carousel-slide {
  width: 37rem;
  height: 42rem;
  position: relative;
}

@media (max-width:500px) {
  .carousel-slide {
    width: 28rem !important;
    height: 36rem !important;
  }
  .carousel-slide .carousel-slide-img img {
    width: 28rem !important;
    height: 36rem !important;
  }
}

.carousel-slide .carousel-slide-img img {
  width: 37rem;
  height: 42rem;
  border-radius: 2rem;
  object-fit: cover;
}

.carousel-slide .carousel-slide-content {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.carousel-slide-content {
  position: absolute;
  top: 2rem;
  right: 2rem;
  color: var(--white);
}

.carousel-slide-content .carousel-slide-content-bottom {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  color: var(--white);
}

.rating ion-icon {
  color: var(--primary);
}

.swiper-slide-shadow-left,
.swiper-slide-shadow-right {
  display: none;
}

.carousel-slider-control {
  position: relative;
  bottom: 2.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-slider-control .swiper-button-next {
  left: 58% !important;
  transform: translateX(-58%) !important;
}

@media (max-width:990px) {
  .carousel-slider-control .swiper-button-next {
    left: 70% !important;
    transform: translateX(-70%) !important;
  }
}

@media (max-width:450px) {
  .carousel-slider-control .swiper-button-next {
    left: 80% !important;
    transform: translateX(-80%) !important;
  }
}

@media (max-width:990px) {
  .carousel-slider-control .swiper-button-prev {
    left: 30% !important;
    transform: translateX(-30%) !important;
  }
}

@media (max-width:450px) {
  .carousel-slider-control .swiper-button-prev {
    left: 20% !important;
    transform: translateX(-20%) !important;
  }
}

.carousel-slider-control .slider-arrow {
  background: var(--white);
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  left: 42%;
  transform: translateX(-42%);
  filter: drop-shadow(0px 8px 24px rgba(18, 28, 53, 0.1));
}

.carousel-slider-control .slider-arrow ion-icon {
  font-size: 2rem;
  color: #222224;
}

.carousel-slider-control .slider-arrow::after {
  content: '';
}

.carousel-slider-control .swiper-pagination {
  position: relative;
  width: 15rem;
  bottom: 1rem;
}

.carousel-slider-control .swiper-pagination .swiper-pagination-bullet {
  filter: drop-shadow(0px 8px 24px rgba(18, 28, 53, 0.1));
}

.carousel-slider-control .swiper-pagination .swiper-pagination-bullet-active {
  background: var(--primary);
}
  </style>
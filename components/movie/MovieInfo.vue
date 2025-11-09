<template>
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
      <div
        v-if="item.overview"
        :class="$style.overview">
        <h2 :class="$style.title">
          Sinopsis
        </h2>

        <div v-html="item.overview" />
      </div>

      <div :class="$style.stats">
        <ul class="nolist">
          <li v-if="showOriginalTitle">
            <div :class="$style.label">
              Título Original
            </div>

            <div :class="$style.value">
              {{ item.original_title }}
            </div>
          </li>
          <li v-if="item.release_date">
            <div :class="$style.label">
              Lanzamiento
            </div>

            <div :class="$style.value">
              {{ item.release_date | fullDate }}
            </div>
          </li>
          <li v-if="item.runtime">
            <div :class="$style.label">
              Duración
            </div>

            <div :class="$style.value">
              {{ item.runtime | runtime }}
            </div>
          </li>
          <li v-if="directors">
            <div :class="$style.label">
              Director
            </div>

            <div
              :class="$style.value"
              v-html="directors" />
          </li>
          <li v-if="item.budget">
            <div :class="$style.label">
              Presupuesto
            </div>

            <div :class="$style.value">
              ${{ item.budget | numberWithCommas }}
            </div>
          </li>
          <li v-if="item.revenue">
            <div :class="$style.label">
              Ingresos
            </div>

            <div :class="$style.value">
              ${{ item.revenue | numberWithCommas }}
            </div>
          </li>
          <li v-if="item.genres && item.genres.length">
            <div :class="$style.label">
              Género
            </div>

            <div
              :class="$style.value"
              v-html="formatGenres(item.genres)" />
          </li>
          <li v-if="item.status">
            <div :class="$style.label">
              Estado
            </div>

            <div :class="$style.value">
              {{ item.status }}
            </div>
          </li>
          <li v-if="item.original_language">
            <div :class="$style.label">
              Idioma
            </div>

            <div :class="$style.value">
              {{ item.original_language | fullLang }}
            </div>
          </li>
          <li v-if="item.production_companies && item.production_companies.length">
            <div :class="$style.label">
              Producción
            </div>

            <div :class="$style.value">
              {{ item.production_companies | arrayToList }}
            </div>
          </li>

          <li v-if="localProviders && localProviders.length">
            <div :class="$style.label">
              Ver en
            </div>
            <div :class="$style.value">
              {{ localProviders.join(', ') }}
            </div>
          </li>
          <br>
        </ul>
      </div>

      <div :class="$style.external">
        <ExternalLinks
          :links="item.external_ids" />
      </div>
      <div v-if="localReviews && localReviews.length" class="reviews-container">
        <br>
        <strong style="letter-spacing: 2px; font-size: 16px;" class="label">Reseñas ({{ reviewCount }})<br><span style="cursor: pointer; letter-spacing: 2px; font-size: 15px;  color: #8AE8FC;" @click="toggleFullReviews"> ADVERTENCIA: PUEDEN CONTENER SPOILERS</span></strong>
        <div v-if="showFullReviews" style="text-align: right; margin-top: 1rem;">
          <button @click="toggleLanguage" class="button" style="display: flex !important; position: relative !important; border-radius: 10px !important;">
            {{ showTranslations ? 'Ver en inglés original' : 'Ver en español' }}
          </button>
        </div>
        <ul class="nolist" v-show="showFullReviews">
            <li v-for="(review, index) in localReviews" :key="index" style="margin-top: 3rem;">
                <p v-if="showFullReviews || (review.authorName && review.authorRating !== null)">
                    <strong style="letter-spacing: 2px; font-size: 14px;">Autor:</strong> <a style="cursor: pointer; letter-spacing: 2px; font-size: 14px;" @click="redirectToUrl(review.url)">{{ review.authorName }}</a><br>
                    <strong style="letter-spacing: 2px; font-size: 14px;">Fecha:</strong> <span style="letter-spacing: 2px; font-size: 14px;">{{ formatCreatedAt(review.createdAt) }}</span><br>
                    <strong style="letter-spacing: 2px; font-size: 14px;">Puntuación:</strong> <span style="letter-spacing: 2px; font-size: 14px;">{{ review.authorRating }}</span><br>
                    <span v-if="!showTranslations" style="font-size: 1.5rem; color: #B1BABF; font-style: italic;" v-html="formatContent(review.content, index, review.showFullContent)"></span>
                    
                    <span v-else-if="review.translatedContent" style="font-size: 1.5rem; color: #B1BABF; font-style: italic;" v-html="formatContent(review.translatedContent, index, review.showFullContent)"></span>
                    
                    <span v-else-if="review.isTranslating" style="font-size: 1.5rem; color: #B1BABF; font-style: italic;">Traduciendo reseña a español...</span>
                    
                    <span v-else-if="review.translationError" style="font-size: 1.5rem; color: #B1BABF; font-style: italic;">
                      <span style="color: #e74c3c;">Error al traducir. Mostrando reseña en inglés original.</span>
                    </span>
                    
                    <span v-else style="font-size: 1.5rem; color: #B1BABF; font-style: italic;">
                      <span @click="translateReviewContent(review, index)" style="cursor: pointer; color: #8AE8FC;">Click para traducir esta reseña al español</span>
                    </span>
                    
                    <br>
                    <span v-if="!review.showFullContent && review.content && review.content.split(' ').length > 200" style="cursor: pointer; color: #8AE8FC; letter-spacing: 2px; font-size: 12px;" @click="toggleReadMore(review)">..[Leer más].</span>
                </p>
            </li>
        </ul>
    </div>
    </div>
  </div>
</template>

<script>
import { apiImgUrl } from '~/api';
import { getMovieProviders } from '~/api'; 
import { getMovieReviews } from '~/api'; 
import { name, directors } from '~/mixins/Details';
import ExternalLinks from '~/components/ExternalLinks';

export default {
  components: {
    ExternalLinks,
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
    reviewsProp: {
      type: Array,
      default: () => []
    },
    providers: {
      type: Array,
      default: () => [],
    }
  },

  data() {
    return {
      showFullReviews: false,
      localReviews: [], // Cambiado de reviews a localReviews
      localProviders: [], // Añadido para evitar mutación directa de props
      showTranslations: false
    };
  },

  computed: {
    reviewCount() {
      return this.localReviews.length;
    },
    poster () {
      if (this.item.poster_path) {
        return `${apiImgUrl}/w370_and_h556_bestv2${this.item.poster_path}`;
      } else {
        return false;
      }
    },
    showOriginalTitle() {
      const localizedTitle = this.item.title;
      const originalTitle = this.item.original_title;
      
      return localizedTitle && originalTitle && localizedTitle !== originalTitle;
    },
  },

  watch: {
    reviewsProp: {
      immediate: true,
      handler(newReviews) {
        // Hacer una copia local de reviewsProp
        this.localReviews = Array.isArray(newReviews) ? [...newReviews] : [];
      }
    },
    providers: {
      immediate: true,
      handler(newProviders) {
        // Hacer una copia local de providers
        this.localProviders = Array.isArray(newProviders) ? [...newProviders] : [];
      }
    }
  },

  created () {
    if (this.item.homepage) {
      this.item.external_ids.homepage = this.item.homepage;
    }
    // Solo llamar a estos métodos si la propiedad está vacía
    if (!this.providers || this.providers.length === 0) {
      this.fetchProviders();
    } else {
      this.localProviders = [...this.providers];
    }
    
    if (!this.reviewsProp || this.reviewsProp.length === 0) {
      this.fetchReviews();
    } else {
      this.localReviews = [...this.reviewsProp];
    }
  },

  methods: {
    toggleFullReviews() {
      this.showFullReviews = !this.showFullReviews;
      
      if (this.showFullReviews && this.localReviews.length > 0) {
        this.showTranslations = true;
        this.translateAllReviews();
      }
    },
    
    toggleLanguage() {
      this.showTranslations = !this.showTranslations;
      
      if (this.showTranslations && this.localReviews.length > 0) {
        this.translateAllReviews();
      }
    },
    
    async translateAllReviews() {
      for (let i = 0; i < this.localReviews.length; i++) {
        const review = this.localReviews[i];
        if (review && !review.translatedContent && !review.isTranslating) {
          await this.translateReviewContent(review, i);
        }
      }
    },
    
    async translateReviewContent(review, index) {
      if (!review || review.translatedContent || review.isTranslating) return;
      if (!review.content) return;
      
      this.$set(review, 'isTranslating', true);
      
      try {
        const { translateReview } = require('~/api');
        const translatedContent = await translateReview(review.content);
        this.$set(review, 'translatedContent', translatedContent);
        this.$set(review, 'isTranslating', false);
      } catch (error) {
        console.error('Error al traducir la reseña:', error);
        this.$set(review, 'isTranslating', false);
        this.showTranslations = false;

        if (index === 0) { 
          this.$set(review, 'translationError', true);
          setTimeout(() => {
            this.$set(review, 'translationError', false);
          }, 5000);
        }
      }
    },
    
    formatGenres(genres) {
      if (!genres || !Array.isArray(genres)) return '';
      return genres.map(genre => `<a href="/genre/${genre.id}/movie">${genre.name}</a>`).join(', ');
    },
    
    toggleReadMore(review) {
      if (!review) return;
      this.$set(review, 'showFullContent', !review.showFullContent);
    },

    formatContent(content, index, showFullContent) {
      if (!content) return '';

      content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      content = content.replace(/_([^_]+)_/g, (match, p1) => p1.toUpperCase());
      
      if (showFullContent) {
        return content; 
      } else {
        const words = content.split(' ');
        if (words.length > 200) {
          content = words.slice(0, 200).join(' ');
        }
        return content;
      }
    },

    formatCreatedAt(createdAt) {
      if (!createdAt) return '';
      return new Date(createdAt).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    async fetchProviders() {
      try {
        const providersList = await getMovieProviders(this.item.id);
        // Actualizar la copia local, no la prop directamente
        this.localProviders = Array.isArray(providersList) ? providersList : [];
      } catch (error) {
        console.error('Error al obtener proveedores:', error);
        this.localProviders = [];
      }
    },
    
    async fetchReviews() {
      try {
        const reviewsList = await getMovieReviews(this.item.id);
        // Actualizar la copia local, no la prop directamente
        this.localReviews = Array.isArray(reviewsList) ? reviewsList : [];
      } catch (error) {
        console.error('Error al obtener reseñas:', error);
        this.localReviews = [];
      }
    },
    
    redirectToUrl(url) {
      if (!url) return;
      window.open(url, '_blank');
    },
  }
};
</script>


<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.info { 
  background-color: rgba(0, 0, 0, 0.307);
  border-radius: 10px;
  padding-bottom: 4rem;
}

.info {
  @media (min-width: $breakpoint-medium) {
    display: flex;
  }
}

.left {
  display: none;

  @media (min-width: $breakpoint-medium) {
    display: block;
    width: 25%;
    max-width: 400px;
    padding-right: 3rem;
  }

  @media (min-width: $breakpoint-large) {
    padding-right: 5rem;
  }
}

.right {
  @media (min-width: $breakpoint-medium) {
    flex: 1;
  }
}

.poster {
  position: relative;
  height: 0;
  padding-top: 150.27%;
  overflow: hidden;
  border-radius: 10px;
  background-color: $secondary-color;

  img,
  span {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  span {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}


.overview {
  max-width: 1000px;
  margin-bottom: 3rem;
  font-size: 1.5rem;
  color: $text-color;

  @media (min-width: $breakpoint-large) {
    font-size: 1.6rem;
  }
}

.title {
  margin-bottom: 1rem;
  font-size: 1.8rem;
  color: #fff;
  letter-spacing: $letter-spacing;

  @media (min-width: $breakpoint-large) {
    font-size: 2.4rem;
  }
}

.stats {
  margin-bottom: 3rem;
  font-size: 1.5rem;
  color: $text-color;

  @media (min-width: $breakpoint-large) {
    font-size: 1.6rem;
  }

  ul {
    @media (min-width: $breakpoint-medium) {
      display: flex;
      flex-wrap: wrap;
    }
  }

  li {
    display: flex;
    padding: 0.2rem 0;

    @media (min-width: $breakpoint-medium) {
      width: 50%;
    }
    

    @media (min-width: $breakpoint-xlarge) {
      width: 100%;
    }
  }

  a {
    color: #8AE8FC;
    text-decoration: none;
  }
}

.label {
  flex: 1;
  max-width: 90px;
  margin-right: 1.5rem;
  color: #fff;

  @media (min-width: $breakpoint-xsmall) {
    max-width: 110px;
  }
}

.value {
  flex: 2;
}

.external {
  ul {
    display: flex;
    margin-left: -0.5rem;
  }

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4.4rem;
    height: 4.4rem;

    svg {
      transition: all 0.3s ease-in-out;
    }

    &:hover,
    &:focus {
      svg {
        fill: $fourth-color;
      }
    }
  }
}
.button {
  padding: 1.5rem 2.5rem;
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1;
  color: #fff;
  letter-spacing: 0.05em;
  cursor: pointer;
  background-color: #092C3D;
  transition: all 0.2s;
  border-radius: 10px !important;
  display: relative !important; 
}
.button-icon {
  display: relative !important;
}
</style>
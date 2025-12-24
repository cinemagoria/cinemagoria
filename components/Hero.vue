<template>
  <div>
    <div :class="$style.hero">
      <div v-if="isLoading" class="hero-loader">
        <Loader :size="60" />
      </div>
      <div :class="$style.backdrop">
        <div>
          <button
            v-if="trailer && !isLoading"
            :class="$style.play"
            type="button"
            aria-label="Play Trailer"
            @click="openModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 55 55"><circle cx="27.5" cy="27.5" r="26.75" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.97 40.81L40.64 27.5 20.97 14.19v26.62z"/></svg>
          </button>

          <img
            v-if="backdrop"
            ref="backdropRef"
            :src="backdrop"
            loading="eager"
            :class="$style.image"
            :alt="name"
            :style="{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease' }"
            @load="onBackdropLoaded"
            @error="onBackdropLoaded">
          <img
            v-else
            src="/no-data-es.webp"
            loading="eager"
            :class="$style.image"
            alt="No Hay Datos"
            :style="{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease' }"
            @load="onBackdropLoaded"
            @error="onBackdropLoaded">
        </div>
      </div>
      <div :class="$style.pane">
        <transition
          appear
          name="hero">
          <div>
            <h1 :class="$style.name">
              <template v-if="isSingle">
                {{ name }}
              </template>

              <template v-else>
                <nuxt-link :to="{ name: `${type}-id`, params: { id: item.id } }">
                  {{ name }}
                </nuxt-link>
              </template>
            </h1>

            <div :class="$style.meta">
              <div
                v-if="stars || item.vote_count"
                :class="$style.rating">
                <div
                  v-if="stars"
                  :class="$style.stars">
                  <div :style="{ width: `${stars}%` }" />
                </div>

                <div v-if="item.rating_source === 'imdb' && item.imdb_rating">
                  {{ item.imdb_rating.toFixed(1) }}/10 · {{ (item.imdb_votes || 0).toLocaleString('es-ES') }} votos (vía: IMDb)
                </div>
                <div v-else-if="item.vote_average">
                  {{ item.vote_average.toFixed(1) }}/10 · {{ (item.vote_count || 0).toLocaleString('es-ES') }} reseñas (vía: TMDB)
                </div>
              </div>

              <div :class="$style.info">
                <span v-if="item.number_of_seasons">Temporada {{ item.number_of_seasons }}</span>
                <span v-if="yearStart">{{ yearStart }}</span>
                <span v-if="item.runtime">{{ formatRuntime(item.runtime) }}</span>
                <span v-if="cert">Cert. {{ cert }}</span>
              </div>
            </div>

            <div :class="$style.desc">
              {{ truncate(item.overview, 200) }}
            </div>
            <br>
            <div :class="$style.buttonContainer">
              <button
                v-if="trailer"
                class="button button--icon"
                :class="$style.actionButton"
                type="button"
                @click="openModal">
                <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="#fff"><path d="M3 22v-20l18 10-18 10z"/></svg></span>
                <span class="txt">Ver Trailer</span>
              </button>

              <button
                v-if="hasAccessToken"
                class="button button--icon" 
                type="button"
                :class="{ [$style.actionButton]: true, [$style.favoritesFilled]: isFavorite }"
                @click="toggleFavorite">
                <span class="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none">
                    <path
                      v-if="!isFavorite"
                      d="M12 21l-1.42-1.34C5.4 15.34 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.84-8.58 11.16L12 21z"
                      stroke="#fff"
                      stroke-width="2"
                    />
                    <path
                      v-if="isFavorite"
                      d="M12 21l-1.42-1.34C5.4 15.34 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.84-8.58 11.16L12 21z"
                      fill="#fff"
                    />
                  </svg>
                </span>
                <span class="txt">{{ isFavorite ? 'Borrar de Mi Lista' : 'Añadir a Mi Lista' }}</span>
              </button>
              
              <button
                v-if="hasAccessToken"
                class="button button--icon"
                :class="$style.actionButton"
                type="button"
                @click="hasUserRating ? showRatingDetails() : openRatingModal()"
                style="overflow: hidden; position: relative;">
                <span class="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none">
                    <path
                      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                      :fill="hasUserRating ? '#8BE9FD' : '#fff'"
                    />
                  </svg>
                </span>
                <span class="txt" style="position:relative; top:1.3px;">{{ hasUserRating ? userRatingForDb : 'Valorar' }}</span>
                <span v-if="hasUserRating" style="position: absolute; bottom: -5px; left: 0; width: 100%; height: 3px; background-color: #8BE9FD;"></span>
              </button>


              <button
                class="button button--icon"
                :class="$style.shareButton"
                type="button"
                @click="openShareModal">
                <span class="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    style="position:relative; margin-left:9px;"
                    viewBox="0 0 24 24"
                    fill="none">
                    <path
                      d="M18 16.08c-.76 0-1.44.3-1.96.77l-7.12-4.21c.05-.25.08-.51.08-.78s-.03-.53-.08-.78l7.12-4.21c.53.48 1.22.77 1.96.77 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .27.03.53.08.78l-7.12 4.21c-.53-.48-1.22-.77-1.96-.77-1.66 0-3 1.34-3 3s1.34 3 3 3c.74 0 1.43-.29 1.96-.77l7.12 4.21c-.05.25-.08.51-.08.78 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"
                      fill="#fff"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>

       <div v-if="shareModalVisible" class="modal-overlay">
        <div class="share-modal-content">
          <div class="share-modal-header">
            <h2>Compartir</h2>
            <button class="close-button" @click="closeShareModal" type="button" aria-label="Cerrar">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="share-url-container">
            <label for="share-url" class="share-label">Enlace</label>
            <div class="share-url-field">
              <input id="share-url" type="text" :value="shareUrl" readonly class="share-url-input">
              <div class="copy-button-container">
                <button @click="copyToClipboard" type="button" class="copy-button" aria-label="Copiar al portapapeles">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                  </svg>
                </button>
                <span v-if="copySuccess" class="copy-success">Copiado!</span>
              </div>
            </div>
          </div>
          
          <div class="share-field-container">
            <label for="share-title" class="share-label">Título</label>
            <input id="share-title" type="text" v-model="customTitle" class="share-input">
          </div>
          
          <div class="share-field-container">
            <label for="share-message" class="share-label">Mensaje</label>
            <textarea id="share-message" v-model="customMessage" class="share-textarea"></textarea>
          </div>
          
          <div class="share-buttons-container">
            <label class="share-label">Compartir en</label>
            <div class="share-buttons">
              <button @click="shareTo('whatsapp')" class="share-icon-button" aria-label="Share on WhatsApp" title="WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </button>
              
              <button @click="shareTo('telegram')" class="share-icon-button" aria-label="Share on Telegram" title="Telegram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </button>
              
              <button @click="shareTo('twitter')" class="share-icon-button" aria-label="Share on Twitter" title="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
              
              <button @click="shareTo('email')" class="share-icon-button" aria-label="Share via Email" title="Email">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/>
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

    <div v-if="ratingModalVisible" class="modal-overlay">
      <div class="rating-modal">
        <div class="modal-header">
          <h3>Valorar '{{ nameForDb }}'</h3>
          <button class="close-btn" @click="closeRatingModal">×</button>
        </div>
        
        <div class="rating-content">
          <div class="rating-selector">
            <div class="rating-numbers">
              <button 
                v-for="n in 10" 
                :key="n" 
                @click="setRating(n)"
                @mouseover="previewRating(n)"
                @mouseout="resetPreview()"
                :class="[
                  'rating-btn', 
                  { 'rating-btn-active': n <= (hoverRating || selectedRating) }
                ]"
              >
                {{ n }}
              </button>
            </div>
          </div>
          
          <div class="review-section">
            <textarea
              v-model="userReview"
              :placeholder="selectedRating > 0 ? ratingDescriptions[selectedRating - 1] : 'Selecciona una valoración primero'"
              class="review-textarea"
              maxlength="500"
              :disabled="selectedRating === 0"
            ></textarea>
            <div class="char-count">{{ userReview.length }}/500</div>
          </div>
          
          <div class="rating-modal-buttons">
            <button 
              v-if="hasUserRating"
              @click="removeRating" 
              class="remove-rating-btn"
            >
              <span style="position:relative; margin:0 auto;">Remover</span>
            </button>
            
            <button 
              @click="saveRatingAndReview" 
              class="save-btn"
              :disabled="selectedRating === 0"
            >
              <span style="position:relative; margin:0 auto;">Guardar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { name, stars, yearStart, yearEnd, cert, backdrop, poster, trailer, id, genres, type, runtime } from '~/mixins/Details';
import Filters from '~/mixins/Filters';
import Modal from '~/components/Modal';
import Loader from '~/components/Loader.vue';

export default {
  components: {
    Modal,
    Loader,
  },

  mixins: [
    Filters,
    name,
    stars,
    yearStart,
    yearEnd,
    cert,
    poster,
    backdrop,
    trailer,
    id,
    genres,
    type,
    runtime,
  ],

  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      isLoading: true,
      isSingle: this.item.id === this.$route.params.id,
      copySuccess: false,
      ratingModalVisible: false,
      isFavorite: false,
      hasAccessToken: false,
      userRatingForDb: '-',
      hasUserRating: false,
      selectedRating: 0,
      hoverRating: 0,
      activeTab: 'rating',
      userReview: '',
      ratingDescriptions: [
        'Terrible, una completa pérdida de tiempo',
        'Muy mala, difícil de ver',
        'Mala, poco interesante',
        'Mediocre, apenas pasable',
        'Regular, tiene sus momentos',
        'Decente, entrenenida pero olvidable',
        'Buena, vale la pena mirar',
        'Muy buena, recomendable',
        'Excelente, una gran experiencia',
        'Impresionante, obligatorio ver'
      ],

      nameForDb: null,
      starsForDb: null,
      posterForDb: null,
      yearStartForDb: null,
      yearEndForDb: null,
      idForDb: null,
      genresForDb: null,
      typeForDb: null,
      addedAt: null,

      shareModalVisible: false,
      shareTitle: '',
      customTitle: '',
      customMessage: this.item.overview,
    };
  },

  computed: {
    tursoBackendUrl() {
      return this.$config.public.tursoBackendUrl;
    },
    type() {
      return this.item.title ? 'movie' : 'tv';
    },
    favId() {
      return `${this.type}/${this.item.id}`;
    },
    shareUrl() {
      return `${window.location.origin}/${this.favId}`;
    },
  },

  async mounted() {
    this.checkIfFavorite();
    this.checkUserRating();

    if (!this.backdrop) {
      this.isLoading = false;
    } else {
      this.$nextTick(() => {
        if (this.$refs.backdropRef && this.$refs.backdropRef.complete) {
          this.isLoading = false;
        }
      });
    }
    
    setTimeout(() => {
      this.isLoading = false;
    }, 10000);

    const email = localStorage.getItem('email');
    const accessToken = localStorage.getItem('access_token');
    this.userEmail = email || '';
    this.hasAccessToken = accessToken !== null;
    this.isLoggedIn = accessToken !== null;
    if (this.hasAccessToken) {
      this.checkIfFavorite();
      this.checkUserRating();
    }
    this.posterForDb = this.poster_path;
    this.nameForDb = this.name;
    this.starsForDb = this.stars;
    this.yearStartForDb = this.yearStart;
    this.yearEndForDb  = this.yearEnd;
    this.idForDb = this.id;
    this.genresForDb = this.item.genres.map(genre => genre.name).join(', ');
    this.typeForDb = this.type;
    this.addedAt = new Date();
    this.shareTitle = "¡Quisiera compartirte '" + this.nameForDb + "' desde EnterCinema!";
    this.customTitle = "¡Quisiera compartirte '" + this.nameForDb + "' desde EnterCinema!";
    this.customMessage = 'Sinopsis: ' + this.item.overview + '\n\nExplora opciones de streaming, trailer, ficha técnica y mucho más aquí: ';
    
    this.$bus.$on('favorites-updated', this.checkIfFavorite);
  },

  beforeDestroy() {
    this.$bus.$off('favorites-updated', this.checkIfFavorite);
  },

  methods: {
    onBackdropLoaded() {
      this.isLoading = false;
    },

    openModal() {
      if (this.trailer && this.trailer[0]) {
        const videoId = this.trailer[0].src.match(/embed\/([^?]+)/)[1];
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
      }
    },
    openShareModal() {
      this.shareModalVisible = true;
    },
    closeShareModal() {
      this.shareModalVisible = false;
    },
    
    openRatingModal() {
      this.ratingModalVisible = true;
    },
    
    closeRatingModal() {
      this.ratingModalVisible = false;
      this.activeTab = 'rating';
    },
    
    setRating(rating) {
      this.selectedRating = rating;
    },
    
    previewRating(rating) {
      this.hoverRating = rating;
    },
    
    resetPreview() {
      this.hoverRating = 0;
    },
    
    showRatingDetails() {
      if (this.hasUserRating) {
        this.selectedRating = parseInt(this.userRatingForDb);
        this.ratingModalVisible = true;
        if (this.userReview) {
          this.activeTab = 'review';
        }
      } else {
        this.ratingModalVisible = true;
        this.activeTab = 'rating';
      }
    },
    
    async saveRatingAndReview() {
      if (this.selectedRating === 0) {
        alert('Por favor, selecciona una valoración entre 1 y 10');
        return;
      }

      if (!this.userReview.trim()) {
        this.userReview = this.ratingDescriptions[this.selectedRating - 1];
      }
      
      try {
        await this.updateUserRatingAndReview(this.selectedRating, this.userReview);
        this.closeRatingModal();
      } catch (error) {
        console.error('Error saving rating and review:', error);
        alert('Hubo un error al guardar tu valoración y reseña. Por favor, inténtalo de nuevo.');
      }
    },
    
    async removeRating() {
      try {
        const response = await fetch(
          `${this.tursoBackendUrl}/favorites/rating/${this.userEmail}/${this.typeForDb}/${this.id}`,
          {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
              rating: null, 
              review: '' 
            })
          }
        );

        if (!response.ok) {
          throw new Error('Error removing rating');
        }

        this.userRatingForDb = '-';
        this.hasUserRating = false;
        this.selectedRating = 0;
        this.userReview = '';

        this.closeRatingModal();
        this.$bus.$emit('rated-items-updated');
      } catch (error) {
        console.error('Error removing rating:', error);
        alert('Hubo un error al eliminar tu valoración. Por favor intenta de nuevo.');
      }
    },
        
    async checkUserRating() {
      try {
        const response = await fetch(`${this.tursoBackendUrl}/favorites/${this.userEmail}`);
        
        if (!response.ok) {
          return;
        }

        const data = await response.json();

        const favoriteType = this.type === 'movie' ? 'movies' : 'tv';
        
        if (data.favorites_json[favoriteType]) {
          data.favorites_json[favoriteType].forEach(item => {
            const itemKey = Object.keys(item)[0];
            if (itemKey === this.favId) {
              if (item[itemKey].details.userRatingForDb) {
                this.userRatingForDb = item[itemKey].details.userRatingForDb;
                this.hasUserRating = this.userRatingForDb !== '-';
                this.selectedRating = this.hasUserRating ? parseInt(this.userRatingForDb) : 0;
              }

              if (item[itemKey].details.userReview) {
                this.userReview = item[itemKey].details.userReview;
              }
            }
          });
        }
      } catch (error) {
        console.error('Error checking user rating:', error);
      }
    },
    
    async updateUserRating(rating) {
      if (!this.userEmail) {
        alert('Por favor inicia sesión para valorar.');
        return;
      }
      
      try {
        if (!this.isFavorite) {
          await this.toggleFavorite();
        }

        const response = await fetch(
          `${this.tursoBackendUrl}/favorites/rating/${this.userEmail}/${this.typeForDb}/${this.id}`,
          {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
              rating: rating,
              review: this.userReview || ''
            })
          }
        );

        if (!response.ok) {
          throw new Error('Error updating rating');
        }

        this.userRatingForDb = rating.toString();
        this.hasUserRating = true;
      } catch (error) {
        console.error('Error updating rating:', error);
      }
    },
    
    async updateUserRatingAndReview(rating, review) {
       if (!this.userEmail) {
         alert('Por favor inicia sesión para valorar y reseñar.');
         return;
       }

      try {
        if (!this.isFavorite) {
          await this.toggleFavorite();
        }

        const response = await fetch(
          `${this.tursoBackendUrl}/favorites/rating/${this.userEmail}/${this.typeForDb}/${this.id}`,
          {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
              rating, 
              review 
            })
          }
        );

        if (!response.ok) {
          throw new Error('Error updating rating and review');
        }

        this.userRatingForDb = rating.toString();
        this.hasUserRating = true;

      } catch (error) {
        console.error('Error updating rating and review:', error);
        throw error;
      }
    },

    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.shareUrl);
        this.copySuccess = true;
        setTimeout(() => {
          this.copySuccess = false;
        }, 2000);
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
    },

    shareTo(platform) {
      const url = this.shareUrl;
      const title = this.customTitle;
      const message = this.customMessage;

      if (platform === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent(title + '. ' + message + ' ' + url)}`);
      } else if (platform === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title + '. ' + message + ' ' + url)}`);
      } else if (platform === 'telegram') {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + '. ' + message)}`);
      } else if (platform === 'email') {
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(message + ' ' + url)}`);
      }
    },

    async checkIfFavorite() {
      try {
        const response = await fetch(`${this.tursoBackendUrl}/favorites/${this.userEmail}`);
        
        if (!response.ok) {
          throw new Error('Error connecting to database: ' + response.statusText);
        }

        const data = await response.json();

        const moviesFetched = [];
        const tvFetched = [];

        if (data.favorites_json.movies) {
          data.favorites_json.movies.forEach(movie => {
            const movieKey = Object.keys(movie)[0];
            moviesFetched.push(movieKey);
          });
        }

        if (data.favorites_json.tv) {
          data.favorites_json.tv.forEach(tvShow => {
            const tvKey = Object.keys(tvShow)[0];
            tvFetched.push(tvKey);
          });
        }

        if (moviesFetched.includes(this.favId) || tvFetched.includes(this.favId)) {
          this.isFavorite = true;
        } else {
          this.isFavorite = false;
        }

      } catch (error) {
        console.error('Error checking if favorite:', error.message);
      }
    },

    async toggleFavorite() {
      try {
        if (this.isFavorite) {
          const [itemType, itemId] = this.favId.split('/');
          
          const response = await fetch(
            `${this.tursoBackendUrl}/favorites/${this.userEmail}/${itemType}/${itemId}`,
            { 
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );

          if (!response.ok) {
            throw new Error('Error removing favorite');
          }

          this.hasUserRating = false;
          this.userRatingForDb = '-';
          this.selectedRating = 0;
          this.userReview = '';
        } else {
          const response = await fetch(`${this.tursoBackendUrl}/favorites`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
              userEmail: this.userEmail,
              item: {
                nameForDb: this.nameForDb,
                starsForDb: this.starsForDb,
                yearStartForDb: this.yearStartForDb,
                yearEndForDb: this.yearEndForDb,
                posterForDb: this.posterForDb,
                idForDb: this.id,
                genresForDb: this.genresForDb,
                typeForDb: this.typeForDb,
                addedAt: this.addedAt,
                external_ids: this.item.external_ids,
                rating_source: this.item.rating_source || 'tmdb',
                imdb_rating: this.item.imdb_rating,
                imdb_votes: this.item.imdb_votes,
                runtime: this.runtime,
              }
            })
          });

          if (!response.ok) {
            throw new Error('Error adding favorite');
          }
        }

        this.isFavorite = !this.isFavorite;
      } catch (error) {
        console.error('Error toggling favorite:', error.message);
      }
    },


    removeFavorite(favoritesJson, favId) {
      const updatedFavorites = { ...favoritesJson };
      for (const key in updatedFavorites) {
        if (Array.isArray(updatedFavorites[key])) {
          updatedFavorites[key] = updatedFavorites[key].filter(item => {
            if (typeof item === 'object') {
              return Object.keys(item)[0] !== favId;
            } else {
              return item !== favId;
            }
          });
        }
      }
      return updatedFavorites;
    },

    addFavorite(favoritesJson, favId) {
      const { type, id } = this.parseFavId(favId);
      const category = type === 'movie' ? 'movies' : 'tv';

      if (!favoritesJson[category]) {
        favoritesJson[category] = [];
      }

      const fullId = `${type}/${id}`;
      if (!favoritesJson[category].includes(fullId)) {
        favoritesJson[category].push(fullId);

        this.updateFavoritesData(favoritesJson, fullId);
      }

      return favoritesJson;
    },

    updateFavoritesData(favoritesJson, fullId) {
      const { type, id } = this.parseFavId(fullId);
      const category = type === 'movie' ? 'movies' : 'tv';

      if (!favoritesJson[category]) {
        favoritesJson[category] = [];
      }

      const index = favoritesJson[category].findIndex(item => item === fullId);

      const favoriteDetails = {
        nameForDb: this.nameForDb,
        starsForDb: this.starsForDb,
        yearStartForDb: this.yearStartForDb,
        yearEndForDb: this.yearEndForDb,
        posterForDb: this.posterForDb,
        idForDb: this.id,
        genresForDb: this.genresForDb,
        typeForDb: this.typeForDb,
        addedAt: this.addedAt,
        external_ids: this.item.external_ids,
        rating_source: this.item.rating_source || 'tmdb',
        imdb_rating: this.item.imdb_rating,
        imdb_votes: this.item.imdb_votes,
        runtime: this.runtime,
      };

      if (index !== -1) {
        if (!Array.isArray(favoritesJson[category][index])) {
          favoritesJson[category][index] = {
            [fullId]: { details: favoriteDetails }
          };
        } else {
          const existingItem = favoritesJson[category][index].find(item => Object.keys(item)[0] === fullId);
          if (existingItem) {
            existingItem[fullId].details = favoriteDetails;
          } else {
            favoritesJson[category][index].push({
              [fullId]: { details: favoriteDetails }
            });
          }
        }
      } else {
        favoritesJson[category].push({
          [fullId]: { details: favoriteDetails }
        });
      }
    },

    parseFavId(favId) {
      const [type, id] = favId.split('/');
      return { type, id };
    },
  }
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.hero {
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  height: 52rem;
  color: #999;
  background-color: #000;

  @media (max-width: 397px) {
  height: 54rem;
}

  @media (min-width: $breakpoint-xsmall) and (max-width: 767px) {
    height: 56rem;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    height: 70rem;
  }

  @media (min-width: $breakpoint-medium) and (max-width: 1023px) {
    position: relative;
    display: block;
    height: 0;
    padding-bottom: 55%;
  }

  @media (min-width: 1024px) {
    position: relative;
    display: block;
    height: 0;
    padding-bottom: 40%;
  }
}

.backdrop {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  min-height: 0;

  @media (max-width: 639px) {
    min-height: 30rem;
  }

  @media (min-width: 640px) and (max-width: 767px) {
    min-height: 34rem;
  }

  @media (min-width: $breakpoint-medium) {
    position: absolute;
    top: 0;
    right: 0;
    display: block;
    width: 71.1%;
    height: 100%;
  }

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: block;
    content: '';
    background-image: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.1) 100%);

    @media (min-width: $breakpoint-medium) {
      background-image: linear-gradient(to right, #000 0, transparent 50%, transparent 100%);
    }
  }

  > div {
    width: 100%;

    @media (min-width: $breakpoint-medium) {
      display: inline;
    }
  }
}

.play {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  padding: 0;
  margin: 0;
  background: none;
  transform: translate(-50%, -50%);

  @media (min-width: $breakpoint-medium) {
    display: none;
  }
}

.buttonContainer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
  width: 100%;
  
  @media (max-width: #{$breakpoint-small - 1px}) {
    justify-content: center;
    margin-top: 1.5rem;
  }
  
  @media (min-width: $breakpoint-small) and (max-width: #{$breakpoint-medium - 1px}) {
    justify-content: flex-start;
  }
  
  @media (min-width: $breakpoint-medium) {
    flex-wrap: nowrap;
  }
}

.actionButton {
  border-radius: 1.0rem;
  margin-top: 0;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.2rem;
  line-height: 40px;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  :global(.icon) svg path {
    stroke: #fff;
  }
  
  :global(.txt) {
    color: #fff;
  }
  
  &:not(.favoritesFilled) {
    :global(.icon) svg path {
      fill: none;
      stroke: #fff;
    }
    
    &:hover {
      :global(.icon) svg path {
        stroke: #8BE9FD !important;
        fill: none !important;
      }
      
      :global(.txt) {
        color: #8BE9FD !important;
      }
    }
  }

  &.favoritesFilled {
    :global(.icon) svg path {
      fill: #fff;
      stroke: #fff;
    }
    
    &:hover {
      :global(.icon) svg path {
        fill: #8BE9FD !important;
        stroke: #8BE9FD !important;
      }
      
      :global(.txt) {
        color: #8BE9FD !important;
      }
    }
  }

  &:first-child,
  &:nth-child(3) {
    :global(.icon) svg path {
      fill: #fff !important;
      stroke: #fff !important;
    }
    
    &:hover {
      :global(.icon) svg path {
        fill: #8BE9FD !important;
        stroke: #8BE9FD !important;
      }
    }
  }
  
  @media (max-width: #{$breakpoint-small - 1px}) {
    flex: 0 1 auto;
    max-width: 45%;
    height: 36px;
    line-height: 36px;
    font-size: 1.3rem;
    padding: 0 1rem;
  }
  
  @media (min-width: $breakpoint-small) and (max-width: #{$breakpoint-medium - 1px}) {
    height: 38px;
    line-height: 38px;
    font-size: 1.4rem;
  }

  @media (min-width: 1650px) {
    font-size: 0.9vw;
    height: 50px;
    line-height: 50px;
  }
}

.shareButton {
  border-radius: 1.0rem;
  margin-top: 0;
  width: 40px;
  height: 40px;
  min-width: 40px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  
  @media (max-width: #{$breakpoint-small - 1px}) {
    width: 36px;
    height: 36px;
    min-width: 36px;
  }
  
  @media (min-width: $breakpoint-small) and (max-width: #{$breakpoint-medium - 1px}) {
    width: 38px;
    height: 38px;
    min-width: 38px;
  }
  
  @media (min-width: 1650px) {
    font-size: 0.9vw;
    width: 50px;
    height: 50px;
    min-width: 50px;
  }
}

.image {
  display: inline-block;
  max-width: none;
  height: 100%;

  @media (max-width: #{$breakpoint-medium - 1px}) {
    width: 100%;
    object-fit: cover;
  }
}

.pane {
  padding: 0 1.5rem 1.5rem;

  @media (min-width: $breakpoint-small) {
    padding: 0 4rem 4rem;
  }

  @media (min-width: $breakpoint-medium) {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    width: 55%;
    height: 100%;
    padding: 5rem 4rem;
  }

  @media (min-width: $breakpoint-large) {
    padding-right: 5rem;
    padding-left: 5rem;
  }

  @media (min-width: $breakpoint-xlarge) {
    width: 43%;
  }
}

.name {
  margin: 0 0 1.4rem;
  font-size: 2.8rem;
  line-height: 1.1;
  color: #fff;
  letter-spacing: $letter-spacing;

  @media (max-width: 397px) {
    font-size: 2.4rem;
    line-height: 1.05;
    margin-bottom: 1.2rem;
  }

  @media (min-width: $breakpoint-small) {
    margin-bottom: 1.8rem;
  }

  @media (min-width: $breakpoint-large) {
    font-size: 2.4vw;
  }
}

.meta {
  font-size: 1.4rem;
  @media (min-width: 1650px) {
    font-size: 0.9vw;
  }
}



.rating {
  display: flex;
  align-items: center;
  margin-bottom: 1.3rem;

  @media (min-width: $breakpoint-small) {
    margin: 0 1.2rem 0 0;
  }
}

.stars {
  width: 8.5rem;
  height: 1.4rem;
  margin-right: 1rem;
  background-image: url('@/assets/images/stars.png');
  background-repeat: no-repeat;
  background-size: auto 100%;

  @media (min-width: $breakpoint-small) {
    width: 10.3rem;
    height: 1.7rem;
  }

  > div {
    height: 100%;
    background-image: url('@/assets/images/stars-filled.png');
    background-repeat: no-repeat;
    background-size: auto 100%;
  }
}

.info {
  display: flex;
  align-items: center;

  span {
    margin-right: 0.9rem;
  }
}

.desc {
  display: block;
  margin-top: 2.5rem;
  font-size: 1.5rem;
  color: #fff;

  @media (max-width: #{$breakpoint-small - 1px}) {
    display: none;
  }

  @media (min-width: 1650px) {
    font-size: 0.9vw;
  }
}

.share {
  margin-top: 3rem;
  border-radius: 1.0rem;
}

@media (min-width: 2200px) {
  .name {
    font-size: 50px;
  }

  .meta,
  .desc {
    font-size: 0.8vw;
  }

  .button {
    font-size: 0.8vw;
    height: 45px;
    line-height: 45px;
  }

  .shareButton {
    width: 45px;
    height: 45px;
    min-width: 45px;
  }

  .stars {
    width: 9rem;
    height: 1.5rem;
  }
}
</style>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 20px;
}

.share-modal-content {
  width: 100%;
  max-width: 480px;
  background: linear-gradient(to bottom right, #092739, #061720);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  padding: 0;
}

.share-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.share-modal-header h2 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 500;
  color: #fff;
}

.close-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: all 0.2s ease;
  padding: 0;
  margin-top: -1px;
}

.close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.share-url-container,
.share-field-container,
.share-buttons-container {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.share-label {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
  font-size: 1.4rem;
  font-weight: 500;
}

.share-url-field {
  display: flex;
  align-items: stretch;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.share-url-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  padding: 10px 12px;
  font-size: 1.4rem;
  outline: none;
  height: 100%;
}

.copy-button-container {
  position: relative;
  display: flex;
  align-items: center;
}

.copy-button {
  border: none;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 0;
  width: 40px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: relative;
}

.copy-success {
  position: absolute;
  right: 50px;
  color: #8BE9FD;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  animation: fadeInOut 2s ease;
  white-space: nowrap;
  
}

@keyframes fadeInOut {
  0% { opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { opacity: 0; }
}

@media screen and (max-width: 480px) {
  .copy-success {
    right: auto;
    top: -30px;
  }
}

.copy-button:hover {
  color: #fff;
}

.share-input,
.share-textarea {
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  padding: 10px 12px;
  font-size: 1.4rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.share-input:focus,
.share-textarea:focus {
  border-color: rgba(139, 233, 253, 0.5);
}

.share-textarea {
  height: 120px;
  resize: none;
}

.share-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.share-icon-button {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  padding: 0;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.share-icon-button:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

@media screen and (max-width: 480px) {
  .share-modal-content {
    max-width: 100%;
  }
  
  .share-buttons {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .share-url-input, 
  .share-input, 
  .share-textarea {
    font-size: 1.3rem;
  }
  
  .share-icon-button {
    height: 44px;
  }
}

.rating-modal {
  width: 100%;
  max-width: 360px;
  background: linear-gradient(to bottom right, #092739, #061720);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.modal-header h3 {
  margin: 0;
  color: #8BE9FD;
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  flex: 1;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 3rem;
  cursor: pointer;
  line-height: 1;
  transition: all 0.2s ease;
  padding: 0;
  margin: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #fff;
}

.rating-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rating-selector {
  width: 100%;
  margin-bottom: 20px;
}

.rating-numbers {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.rating-numbers::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  background: rgba(255, 255, 255, 0.07);
  transform: translateY(-50%);
  z-index: 0;
}

.rating-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: #041019;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
  z-index: 2;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rating-btn-active {
  background: #8BE9FD;
  color: #000;
  transform: scale(1.15);
  box-shadow: 0 0 10px rgba(139, 233, 253, 0.5);
}

.rating-btn:hover {
  transform: scale(1.15);
}

.review-section {
  width: 100%;
  position: relative;
  margin-bottom: 20px;
}

.review-textarea {
  width: 100%;
  height: 100px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  color: #fff;
  font-size: 1.3rem;
  resize: none;
  transition: border-color 0.2s ease;
}

.review-textarea:focus {
  outline: none;
  border-color: rgba(139, 233, 253, 0.5);
}

.review-textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.char-count {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.4);
}

.save-btn {
  background: #8BE9FD;
  color: #000;
  border: none;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 30px;
  width: 120px;
  text-align: center;
}

.save-btn:hover {
  background: #7AD6E9;
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(139, 233, 253, 0.3);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.rating-modal-buttons {
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: center;
}

.save-btn {
  flex: 1;
  max-width: 120px;
}

.remove-rating-btn {
  background: rgba(255, 0, 0, 0.2);
  color: #fff;
  border: 1px solid rgba(255, 0, 0, 0.4);
  font-size: 13px;
  font-weight: 600;
  padding: 10px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 30px;
  flex: 1;
  max-width: 120px;
  text-align: center;
}

.remove-rating-btn:hover {
  background: rgba(255, 0, 0, 0.4);
  border-color: rgba(255, 0, 0, 0.6);
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3);
}

@media (max-width: 400px) {
  .rating-modal-buttons {
    flex-direction: column;
  }
  
  .rating-modal-buttons .save-btn,
  .remove-rating-btn {
    max-width: 100%;
  }
}

@media (max-width: 400px) {
  .rating-modal {
    max-width: 300px;
  }
  
  .rating-btn {
    width: 22px;
    height: 22px;
    font-size: 11px;
  }
  
  .modal-header h3 {
    font-size: 1.4rem;
  }
  
  .review-textarea {
    font-size: 1.2rem;
  }
}
</style>

<style scoped>
.hero-loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.307);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

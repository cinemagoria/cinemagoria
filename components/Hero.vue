<template>
  <div>
    <div :class="$style.hero">
      <div :class="$style.backdrop">
        <div>
          <button
            v-if="trailer"
            :class="$style.play"
            type="button"
            aria-label="Play Trailer"
            @click="openModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 55 55"><circle cx="27.5" cy="27.5" r="26.75" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.97 40.81L40.64 27.5 20.97 14.19v26.62z"/></svg>
          </button>
          <img
            v-if="backdrop"
            v-lazyload="backdrop"
            class="lazyload"
            :class="$style.image"
            :alt="name">
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

                <div v-if="item.vote_count > 0">
                  {{ item.vote_count | numberWithCommas }} Reviews
                </div>
              </div>

              <div :class="$style.info">
                <span v-if="item.number_of_seasons">Season {{ item.number_of_seasons }}</span>
                <span v-if="yearStart">{{ yearStart }}</span>
                <span v-if="item.runtime">{{ item.runtime | runtime }}</span>
                <span v-if="cert">Cert. {{ cert }}</span>
              </div>
            </div>

            <div :class="$style.desc">
              {{ item.overview | truncate(200) }}
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
    
    <!-- Share Modal -->
    <div v-if="shareModalVisible" class="modal-overlay">
      <div class="share-modal-content">
        <button class="close-button" @click="closeShareModal" type="button">X</button>
        <h2 style="position:relative; bottom:2rem;">Link:</h2>
        <div style="display: flex; position: relative; margin-bottom: 1rem; justify-content: center; align-items: center; flex-wrap: wrap;">
          <label :value="shareUrl" readonly ref="shareUrlInput" style="background-color: transparent; color: white; text-align: left; padding: 1rem; margin-top: 1rem; margin-bottom: 1rem; margin: 0; box-sizing: border-box; font-size: 1.4rem !important; line-height: 1.6; flex-shrink: 1; display: inline-block;">
            {{ shareUrl }}
          </label>
          <button @click="copyToClipboard" 
            type="button"
            style="background: rgb(8, 45, 62);
                  color: rgb(255, 255, 255);
                  border: medium;
                  padding: 0.5rem 1rem;
                  border-radius: 1rem;
                  cursor: pointer;
                  transition: background 0.3s;
                  font-size: 1.3rem;
                  margin-left: 0.5rem;
                  height: 4rem;
                  flex-shrink: 0;
                  bottom: 1rem;
                  position: relative;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
            </svg>
          </button>
        </div>
        <div style="margin-top: 1rem; margin-bottom: 1rem;">
          <h3>Título:</h3>
          <input type="text" v-model="customTitle" style="background-color: transparent; color:white; width: 100%; padding: 1rem; margin-top: 0.4rem; margin-bottom: 0.4rem; border: 1px solid #ccc; border-radius: 0.5rem; box-sizing: border-box; font-size: 1.6rem; line-height: 1.6;">
        </div>
        <div style="margin-top: 1rem; margin-bottom: 1rem;">
          <h3>Mensaje:</h3>
          <textarea v-model="customMessage" style="background-color: transparent; color:white; width: 100%; height: 20rem; padding: 1rem; margin-top: 0.4rem; margin-bottom: 0.4rem; border: 1px solid #ccc; border-radius: 0.5rem; box-sizing: border-box; font-size: 1.6rem; line-height: 1.6;"></textarea>
        </div>
        <div class="share-buttons" style="margin-top: 2rem;">
          <h3 style="margin-bottom: 0.4rem;">Compartir en:</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.8rem; width: 100%;">
            <button @click="shareTo('whatsapp')" style="background: #082D3E; color: #fff; border: none; padding: 0.5rem; border-radius: 0.5rem; cursor: pointer; transition: background 0.3s ease; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; height: 36px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
              </svg>
              <span style="margin-left: 0.4rem;">WhatsApp</span>
            </button>

            <button @click="shareTo('telegram')" style="background: #082D3E; color: #fff; border: none; padding: 0.5rem; border-radius: 0.5rem; cursor: pointer; transition: background 0.3s ease; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; height: 36px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
              </svg>
              <span style="margin-left: 0.4rem;">Telegram</span>
            </button>

            <button @click="shareTo('twitter')" style="background: #082D3E; color: #fff; border: none; padding: 0.5rem; border-radius: 0.5rem; cursor: pointer; transition: background 0.3s ease; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; height: 36px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitter-x" viewBox="0 0 16 16">
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
              </svg>
              <span style="margin-left: 0.4rem;">Twitter</span>
            </button>
            
            <button @click="shareTo('email')" style="background: #082D3E; color: #fff; border: none; padding: 0.5rem; border-radius: 0.5rem; cursor: pointer; transition: background 0.3s ease; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; height: 36px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
              </svg>
              <span style="margin-left: 0.4rem;">Email</span>
            </button>
          </div>
        </div>

      </div>
    </div>
    
    <!-- Trailer Modal -->
    <Modal
      v-if="modalVisible"
      :data="trailer"
      type="iframe"
      @close="closeModal" />
      
    <!-- Rating Modal -->
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
</template>

<script>
import supabase from '@/services/supabase';
import { name, stars, yearStart, yearEnd, cert, backdrop, poster, trailer, id, genres, type } from '~/mixins/Details';
import Modal from '~/components/Modal';

export default {
  components: {
    Modal,
  },

  mixins: [
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
  ],

  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      isSingle: this.item.id === this.$route.params.id,
      modalVisible: false,
      ratingModalVisible: false,
      shareModalVisible: false,
      isFavorite: false,
      hasAccessToken: false,
      userEmail: '',
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

      customTitle: '',
      customMessage: '',
    };
  },

  computed: {
    type() {
      return this.item.title ? 'movie' : 'tv';
    },
    favId() {
      return `${this.type}/${this.item.id}`;
    },
    shareUrl() {
      return `${window.location.origin}/${this.favId}`;
    }
  },

  async mounted() {
    const email = localStorage.getItem('email');
    const accessToken = localStorage.getItem('access_token');
    const authProvider = localStorage.getItem('auth_provider') || 'native';
    
    this.userEmail = email || '';
    this.hasAccessToken = accessToken !== null;
    this.isLoggedIn = accessToken !== null;
    this.authProvider = authProvider;
    
    if (this.hasAccessToken) {
      await this.checkIfFavorite();
      await this.checkUserRating();
    }
    
    this.posterForDb = this.poster;
    this.nameForDb = this.name;
    this.starsForDb = this.stars;
    this.yearStartForDb = this.yearStart;
    this.yearEndForDb = this.yearEnd;
    this.idForDb = this.id;
    this.genresForDb = this.item.genres && this.item.genres.length ? this.item.genres.map(genre => genre.name).join(', ') : '';
    this.typeForDb = this.type;
    this.addedAt = new Date();
    this.customTitle = `¡Quisiera compartirte '${this.nameForDb}' desde EnterCinema!`;
    this.customMessage = `Sinopsis: ${this.item.overview || ''}\n\nExplora opciones de streaming, trailer, ficha técnica y mucho más aquí: `;
  },

  methods: {
    openModal() {
      this.modalVisible = true;
    },
    
    closeModal() {
      this.modalVisible = false;
    },
    
    openShareModal() {
      this.shareModalVisible = true;
    },
    
    closeShareModal() {
      this.shareModalVisible = false;
    },

    openRatingModal() {
      this.ratingModalVisible = true;
      this.selectedRating = this.hasUserRating ? parseInt(this.userRatingForDb) : 0;
    },
    
    closeRatingModal() {
      this.ratingModalVisible = false;
      this.resetPreview();
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
      }
      this.openRatingModal();
    },
    
    async saveRatingAndReview() {
      if (this.selectedRating === 0) {
        alert('Por favor, selecciona una valoración entre 1 y 10');
        return;
      }
      
      try {
        await this.updateUserRatingAndReview(this.selectedRating, this.userReview);
        this.closeRatingModal();
      } catch (error) {
        console.error('Error guardando la valoración y la reseña:', error);
        alert('Hubo un error al guardar tu valoración y reseña. Por favor, inténtalo de nuevo.');
      }
    },
    
    async checkUserRating() {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_email', this.userEmail);
        
        if (error) {
          return;
        }

        if (!data || data.length === 0) {
          return;
        }

        data.forEach((row) => {
          const favoriteType = this.type === 'movie' ? 'movies' : 'tv';
          if (row.favorites_json && row.favorites_json[favoriteType]) {
            row.favorites_json[favoriteType].forEach((item) => {
              const itemKey = Object.keys(item)[0];
              if (itemKey === this.favId) {
                if (item[itemKey].details && item[itemKey].details.userRatingForDb) {
                  this.userRatingForDb = item[itemKey].details.userRatingForDb;
                  this.hasUserRating = this.userRatingForDb !== '-';
                  this.selectedRating = this.hasUserRating ? parseInt(this.userRatingForDb) : 0;
                }
                
                if (item[itemKey].details && item[itemKey].details.userReview) {
                  this.userReview = item[itemKey].details.userReview;
                }
              }
            });
          }
        });
      } catch (error) {
        console.error('Error obteniendo la valoración:', error);
      }
    },
    
    async updateUserRatingAndReview(rating, review) {
      if (!this.userEmail) {
        alert('Por favor, inicia sesión para valorar y comentar.');
        return;
      }
      
      try {
        if (!this.isFavorite) {
          await this.toggleFavorite();
        }

        const { data: favoritesData, error } = await supabase
          .from('favorites')
          .select('favorites_json')
          .eq('user_email', this.userEmail);

        if (error) {
          throw new Error('Error obteniendo los favoritos: ' + error.message);
        }

        if (!favoritesData || favoritesData.length === 0) {
          throw new Error('No hay favoritos encontrados para este usuario/a.');
        }

        const favoritesObject = favoritesData[0].favorites_json || {};
        const favoriteType = this.type === 'movie' ? 'movies' : 'tv';
        
        if (!favoritesObject[favoriteType]) {
          throw new Error(`No hay favoritos de tipo ${favoriteType} encontrados`);
        }
        
        const updatedFavorites = { ...favoritesObject };

        const itemIndex = updatedFavorites[favoriteType].findIndex(item => {
          const itemKey = Object.keys(item)[0];
          return itemKey === this.favId;
        });
        
        if (itemIndex !== -1) {
          const itemKey = Object.keys(updatedFavorites[favoriteType][itemIndex])[0];

          updatedFavorites[favoriteType][itemIndex][itemKey].details.userRatingForDb = rating.toString();
          updatedFavorites[favoriteType][itemIndex][itemKey].details.userReview = review;

          const { error: updateError } = await supabase
            .from('favorites')
            .update({ favorites_json: updatedFavorites })
            .eq('user_email', this.userEmail);

          if (updateError) {
            throw new Error('Error actualizando la valoración y la reseña: ' + updateError.message);
          }

          this.userRatingForDb = rating.toString();
          this.hasUserRating = true;
        }
      } catch (error) {
        console.error('Error actualizando la valoración y la reseña:', error);
        throw error;
      }
    },
    
    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.shareUrl);
        alert('¡URL copiada al portapapeles!');
      } catch (err) {
        console.error('Error al copiar al portapapeles:', err);
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
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_email', this.userEmail); 
        
        if (error) {
          throw new Error('Error al conectar con la base de datos: ' + error.message);
        }

        if (!data || data.length === 0) {
          this.isFavorite = false;
          return;
        }

        data.forEach((row) => {
          if (!row.favorites_json) return;
          
          const moviesFetched = [];
          if (row.favorites_json.movies) {
            row.favorites_json.movies.forEach((movie) => {
              const movieKey = Object.keys(movie)[0];
              moviesFetched.push(movieKey);
            });
          }

          const tvFetched = [];
          if (row.favorites_json.tv) {
            row.favorites_json.tv.forEach((tvShow) => {
              const tvKey = Object.keys(tvShow)[0];
              tvFetched.push(tvKey);
            });
          }
          
          if (moviesFetched.includes(this.favId) || tvFetched.includes(this.favId)) {
            this.isFavorite = true;
          } else {
            this.isFavorite = false;
          }
        });
        
      } catch (error) {
        console.error('Error al verificar si el elemento está agregado como favorito:', error.message);
      }
    },

    async toggleFavorite() {
      try {
        let favoritesData;
        const { data, error } = await supabase
          .from('favorites')
          .select('favorites_json')
          .eq('user_email', this.userEmail);

        if (error) {
          console.error('Error fetching favorites:', error);
          return;
        }

        if (!data || !data.length) {
          const { data: newData, error: newError } = await supabase
            .from('favorites')
            .insert([{ user_email: this.userEmail, favorites_json: {} }])
            .select(); 

          if (newError) {
            console.error('Error inserting new favorite record:', newError);
            return;
          }

          favoritesData = newData[0].favorites_json;
        } else {
          favoritesData = data[0].favorites_json;
        }

        favoritesData = favoritesData || {};

        if (this.isFavorite) {
          const updatedFavorites = this.removeFavorite(favoritesData, this.favId);
          const { error: updateError } = await supabase
            .from('favorites')
            .update({ favorites_json: updatedFavorites })
            .eq('user_email', this.userEmail);

          if (updateError) {
            console.error('Error updating favorite (removal):', updateError);
            return;
          }
          this.hasUserRating = false;
          this.userRatingForDb = '-';
          this.selectedRating = 0;
          this.userReview = '';
        } else {
          const updatedFavorites = this.addFavorite(favoritesData, this.favId);
          const { error: updateError } = await supabase
            .from('favorites')
            .update({ favorites_json: updatedFavorites })
            .eq('user_email', this.userEmail);

          if (updateError) {
            console.error('Error updating favorite (addition):', updateError);
            return;
          }
        }

        this.isFavorite = !this.isFavorite;
      } catch (error) {
        console.error('Error al cambiar el estado del favorito:', error.message);
      }
    },

    removeFavorite(favoritesJson, favId) {
      const updatedFavorites = { ...favoritesJson };
      const favoriteType = this.type === 'movie' ? 'movies' : 'tv';
      
      if (updatedFavorites[favoriteType]) {
        updatedFavorites[favoriteType] = updatedFavorites[favoriteType].filter(item => {
          const itemKey = Object.keys(item)[0];
          return itemKey !== favId;
        });
      }
      
      return updatedFavorites;
    },

    addFavorite(favoritesJson, favId) {
      const updatedFavorites = { ...favoritesJson };
      const favoriteType = this.type === 'movie' ? 'movies' : 'tv';

      if (!updatedFavorites[favoriteType]) {
        updatedFavorites[favoriteType] = [];
      }
      
      updatedFavorites[favoriteType].push({
        [favId]: {
          details: {
            nameForDb: this.nameForDb,
            starsForDb: this.starsForDb,
            yearStartForDb: this.yearStartForDb,
            yearEndForDb: this.yearEndForDb,
            posterForDb: this.posterForDb,
            idForDb: this.id,
            genresForDb: this.genresForDb,
            typeForDb: this.typeForDb,
            userRatingForDb: this.userRatingForDb || '-',
            addedAt: new Date().toISOString()
          }
        }
      });

      return updatedFavorites;
    },

    parseFavId(favId) {
      const [type, id] = favId.split('/');
      return { type, id };
    }
  }
};
</script>

<style lang="scss" module>
@import '~/assets/css/utilities/_variables.scss';

.hero {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 35rem;
  color: #999;
  background-color: #000;

  @media (min-width: $breakpoint-xsmall) {
    height: 50rem;
  }

  @media (min-width: $breakpoint-medium) {
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
  
  @media (max-width: $breakpoint-small - 1) {
    justify-content: center;
    margin-top: 1.5rem;
  }
  
  @media (min-width: $breakpoint-small) and (max-width: $breakpoint-medium - 1) {
    justify-content: flex-start;
  }
  
  @media (min-width: $breakpoint-medium) {
    flex-wrap: nowrap;
  }
}

.favoritesFilled {
  fill: white;
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
  
  @media (max-width: $breakpoint-small - 1) {
    flex: 0 1 auto;
    max-width: 45%;
    height: 36px;
    line-height: 36px;
    font-size: 1.3rem;
    padding: 0 1rem;
  }
  
  @media (min-width: $breakpoint-small) and (max-width: $breakpoint-medium - 1) {
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
  
  @media (max-width: $breakpoint-small - 1) {
    width: 36px;
    height: 36px;
    min-width: 36px;
  }
  
  @media (min-width: $breakpoint-small) and (max-width: $breakpoint-medium - 1) {
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

  @media (max-width: $breakpoint-medium - 1) {
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

  @media (min-width: $breakpoint-small) {
    margin-bottom: 1.8rem;
  }

  @media (min-width: $breakpoint-large) {
    font-size: 2.4vw;
  }
}

.meta {
  font-size: 1.4rem;

  @media (min-width: $breakpoint-small) {
    display: flex;
  }

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
  background-image: url('~assets/images/stars.png');
  background-repeat: no-repeat;
  background-size: auto 100%;

  @media (min-width: $breakpoint-small) {
    width: 10.3rem;
    height: 1.7rem;
  }

  > div {
    height: 100%;
    background-image: url('~assets/images/stars-filled.png');
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

  @media (max-width: $breakpoint-small - 1) {
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
  z-index: 1000;
  padding: 20px;
}

.share-modal-content {
  width: 100%;
  max-width: 600px;
  background: linear-gradient(to bottom right, #092739, #061720);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.close-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 2.4rem;
  font-weight: 300;
  cursor: pointer;
  line-height: 1;
  align-self: flex-end;
  z-index: 1010;
  position: relative;
  padding: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-button:hover {
  color: #fff;
  transform: rotate(360deg);
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
  transform: rotate(90deg);
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
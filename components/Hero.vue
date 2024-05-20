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
            <!-- eslint-disable-next-line -->
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
            <button
              v-if="trailer"
              class="button button--icon"
              :class="$style.trailer"
              type="button"
              @click="openModal">
              <!-- eslint-disable-next-line -->
              <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="#fff"><path d="M3 22v-20l18 10-18 10z"/></svg></span>
              <span class="txt">Ver Trailer</span>
            </button>

            <!-- Botón "Add to Favorites" -->
            <button
              v-if="hasAccessToken"
              class="button button--icon" 
              type="button"
              :class="{ [$style.favorites]: true, [$style.favoritesFilled]: isFavorite }"
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
              <span class="txt">{{ isFavorite ? 'Remover de Favoritos' : 'Agregar a Favoritos' }}</span>
            </button>
            <button
              class="button button--icon"
              :class="$style.share"
              type="button"
              @click="openShareModal"
              style="border-radius: 10px; text-align:center; width: 50.5275px;">
              <span class="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  transform="translate(-7,0)"
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
        </transition>
      </div>
    </div>
    <div v-if="shareModalVisible" style="font-family: 'Roboto', 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif; padding:20px;">
      <div class="share-modal-container" style="width:100%;">
          <div class="share-modal-content" style="font-size: 1.6rem; line-height: 1.6; background: linear-gradient(270deg, #092739, #000000); color: #fff; font-weight: 400; font-style: normal; padding: 2rem; border-radius: 1rem; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); display: flex; flex-direction: column; position: relative;">
              <button class="close-button" style="margin-left: auto; background: none; border: none; color: #fff; font-size: 1.6rem; cursor: pointer;" @click="closeShareModal">X</button>
              <h3>Link:</h3>
                  <div style="display: flex; align-items: center; margin-bottom: 1rem; padding: 0 5px;">
                      <label :value="shareUrl" readonly ref="shareUrlInput" style="background-color: transparent; color:white; text-align: center; flex-grow: 1; padding: 1rem; margin-top: 1rem; margin-bottom: 1rem; box-sizing: border-box; font-size: 1.4rem !important; line-height: 1.6; display: block;">
                          {{ shareUrl }}
                      </label>
                      <button @click="copyToClipboard" style="background: #082D3E; color: #fff; border: none; padding: 0.5rem 1rem; border-radius: 1rem; cursor: pointer; transition: background 0.3s ease; font-size: 1.3rem; margin: 0 auto; height: 4rem;">
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
                      <button @click="shareTo('whatsapp')" style="background: #082D3E; color: #fff; border: none; padding: 0.5rem 1rem; margin-right: 1rem; margin-bottom: 1rem; border-radius: 0.5rem; cursor: pointer; transition: background 0.3s ease; font-size: 1.1rem;">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
                            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                          </svg>
                          <span style="margin-left: 0.1rem;">WhatsApp</span>
                      </button>

                      <button @click="shareTo('telegram')" style="background: #082D3E; color: #fff; border: none; padding: 0.5rem 1rem; margin-right: 1rem; margin-bottom: 1rem; border-radius: 0.5rem; cursor: pointer; transition: background 0.3s ease; font-size: 1.1rem;">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
                              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
                          </svg>
                          <span style="margin-left: 0.1rem;">Telegram</span>
                      </button>

                      <button @click="shareTo('twitter')" style="background: #082D3E; color: #fff; border: none; padding: 0.5rem 1rem; margin-right: 1rem; margin-bottom: 1rem; border-radius: 0.5rem; cursor: pointer; transition: background 0.3s ease; font-size: 1.1rem;">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitter-x" viewBox="0 0 16 16">
                              <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                          </svg>
                          <span style="margin-left: 0.1rem;">Twitter</span>
                      </button>
                      <button @click="shareTo('email')" style="background: #082D3E; color: #fff; border: none; padding: 0.5rem 1rem; margin-bottom: 1rem; border-radius: 0.5rem; cursor: pointer; transition: background 0.3s ease; font-size: 1.1rem;">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
                              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
                          </svg>
                          <span style="margin-left: 0.1rem;">Email</span>
              </button>
              </div>
            </div>
          </div>
        </div>
    <Modal
      v-if="modalVisible"
      :data="trailer"
      type="iframe"
      @close="closeModal" />
</div>
</template>
<script>
import supabase from '@/services/supabase';
import { name, stars, yearStart, yearEnd, cert, backdrop, poster, trailer, id, genres  } from '~/mixins/Details';
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
      isFavorite: false,
      hasAccessToken: false,


      nameForDb: null,
      starsForDb: null,
      posterForDb: null,
      yearStartForDb: null,
      yearEndForDb: null,
      idForDb: null,
      genresForDb: null,

      shareModalVisible: false,
      shareTitle: '',
      customTitle: '',
      customMessage: this.item.overview,
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
    this.userEmail = email || '';
    this.hasAccessToken = accessToken !== null;
    this.isLoggedIn = accessToken !== null;
    this.checkIfFavorite();
    this.posterForDb = this.poster_path;
    this.nameForDb = this.name;
    this.starsForDb = this.stars;
    this.yearStartForDb = this.yearStart;
    this.yearEndForDb  = this.yearEnd;
    this.idForDb = this.id;
    this.genresForDb = this.item.genres.map(genre => genre.name).join(', ');

    this.shareTitle = "¡Quisiera compartirte '" + this.nameForDb + "' desde SonarFlix!";
    this.customTitle = "¡Quisiera compartirte '" + this.nameForDb + "' desde SonarFlix!";
    this.customMessage = 'Sinopsis: ' + this.item.overview + '\n\nExplora opciones de streaming, trailer, ficha técnica y mucho más aquí: ';
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
        const title = this.customTitle || this.shareTitle;
        const message = this.customMessage;

        if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(title + '. ' + message + ' ' + url)}`);
        } else if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title + '. ' + message + ' ' + url)}`);
        } else if (platform === 'telegram') {
            window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + '. ' + message + ' ' + url)}`);
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

        data.forEach((row) => {
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
          console.error(error);
          return;
        }

        if (!data.length) {
          const { data: newData, error: newError } = await supabase
            .from('favorites')
            .insert([{ user_email: this.userEmail, favorites_json: {} }]);

          if (newError) {
            console.error(newError);
            return;
          }

          favoritesData = newData[0].favorites_json;
        } else {
          favoritesData = data[0].favorites_json;
        }

        favoritesData = favoritesData || {};

        if (this.isFavorite) {
          const updatedFavorites = this.removeFavorite(favoritesData, this.favId);
          await supabase
            .from('favorites')
            .update({ favorites_json: updatedFavorites })
            .eq('user_email', this.userEmail);
        } else {
          const updatedFavorites = this.addFavorite(favoritesData, this.favId);
          await supabase
            .from('favorites')
            .update({ favorites_json: updatedFavorites })
            .eq('user_email', this.userEmail);
        }

        this.isFavorite = !this.isFavorite;
      } catch (error) {
        console.error('Error al cambiar el estado del favorito:', error.message);
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

      if (index !== -1) {
        if (!Array.isArray(favoritesJson[category][index])) {
          favoritesJson[category][index] = {
            [fullId]: {
              details: {
                nameForDb: this.nameForDb,
                starsForDb: this.starsForDb,
                yearStartForDb: this.yearStartForDb,
                yearEndForDb: this.yearEndForDb,
                posterForDb: this.posterForDb,
                idForDb: this.id,
                genresForDb: this.genresForDb,
              }
            }
          };
        } else {
          const existingItem = favoritesJson[category][index].find(item => Object.keys(item)[0] === fullId);
          if (existingItem) {
            existingItem[fullId].details = {
              nameForDb: this.nameForDb,
              starsForDb: this.starsForDb,
              yearStartForDb: this.yearStartForDb,
              yearEndForDb: this.yearEndForDb,
              posterForDb: this.posterForDb,
              idForDb: this.id,
              genresForDb: this.genresForDb,
            };
          } else {
            favoritesJson[category][index].push({
              [fullId]: {
                details: {
                  nameForDb: this.nameForDb,
                  starsForDb: this.starsForDb,
                  yearStartForDb: this.yearStartForDb,
                  yearEndForDb: this.yearEndForDb,
                  posterForDb: this.posterForDb,
                  idForDb: this.id,
                  genresForDb: this.genresForDb,
                }
              }
            });
          }
        }
      } else {
        favoritesJson[category].push({
          [fullId]: {
            details: {
              nameForDb: this.nameForDb,
              starsForDb: this.starsForDb,
              yearStartForDb: this.yearStartForDb,
              yearEndForDb: this.yearEndForDb,
              posterForDb: this.posterForDb,
              idForDb: this.id,
              genresForDb: this.genresForDb,
            }
          }
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
@import '~/assets/css/utilities/_variables.scss';

/* styles.css */

.share-modal {
    font-family: 'Roboto', 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.share-modal-container {
    max-width: 600px;
    z-index: 9999999;
}

.share-modal-content {
    font-size: 1.6rem;
    line-height: 1.6;
    background: linear-gradient(270deg, #092739, #000000);
    color: #fff;
    font-weight: 400;
    font-style: normal;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    position: relative;
    max-width: 600px;
    margin: 0 auto;
}

.close-button {
    margin-left: auto;
    background: none;
    border: none;
    color: #fff;
    font-size: 1.6rem;
    cursor: pointer;
}

.share-url-input {
    background-color: transparent;
    color: white;
    text-align: center;
    flex-grow: 1;
    padding: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    box-sizing: border-box;
    font-size: 1.3rem;
    line-height: 1.6;
    display: block;
}

.copy-button {
    background: #082D3E;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    cursor: pointer;
    transition: background 0.3s ease;
    font-size: 1.6rem;
    margin: 0 auto;
    width: 200px;
    height: 4rem;
}

.copy-button svg {
    margin-right: 0.5rem;
}

.input-container {
    margin-top: 1rem;
    margin-bottom: 1rem;
}

.input-container h3 {
    margin-bottom: 0.4rem;
}

.input-container input,
.input-container textarea {
    background-color: transparent;
    color: white;
    width: 100%;
    padding: 1rem;
    margin-top: 0.4rem;
    margin-bottom: 0.4rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    box-sizing: border-box;
    font-size: 1.6rem;
    line-height: 1.6;
}

.share-buttons {
    margin-top: 2rem;
}

.share-buttons h3 {
    margin-bottom: 0.4rem;
}

.share-buttons button {
    background: #082D3E;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    margin-right: 1rem;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background 0.3s ease;
    font-size: 1.1rem;
}

.share-buttons button svg {
    margin-right: 0.3rem;
}


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

.favoritesFilled {
  fill: white;
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

.favorites {
  margin-top: 3rem;
  border-radius: 1.0rem;

  @media (min-width: 1650px) {
    font-size: 0.9vw;
  }
}
.trailer {
  margin-top: 3rem;
  border-radius: 1.0rem;

  @media (max-width: $breakpoint-medium - 1) {
    display: none;
  }

  @media (min-width: 1650px) {
    font-size: 0.9vw;
  }
}

.share {
  margin-top: 3rem;
  border-radius: 1.0rem;



  @media (min-width: 1650px) {
    font-size: 0.9vw;
  }
}

</style>

<style lang="scss">
.hero-enter-active,
.hero-leave-active {
  transition: transform .75s cubic-bezier(.4, .25, .3, 1), opacity .3s cubic-bezier(.4, .25, .3, 1);
}

.hero-enter,
.hero-leave-to {
  opacity: 0;
  transform: translate3d(0, 2rem, 0);
}

.hero-enter-to,
.hero-leave {
  opacity: 1;
  transform: translateZ(0);
}
</style>
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
              <span class="txt">Watch Trailer</span>
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
              <span class="txt">Add To Favorites</span>
            </button>

          </div>
        </transition>
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
import { name, stars, yearStart, cert, backdrop, poster, trailer } from '~/mixins/Details';
import Modal from '~/components/Modal';

export default {
  components: {
    Modal,
  },

  mixins: [
    name,
    stars,
    yearStart,
    cert,
    poster,
    backdrop,
    trailer,
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
    };
  },

  computed: {
    type() {
      return this.item.title ? 'movie' : 'tv';
    },
    favId() {
      return `${this.type}/${this.item.id}`;
    }
  },

  async mounted() {
    console.log(`Enlace unificado: ${this.favId}`);
    const email = localStorage.getItem('email');
    console.log('Email obtenido del localStorage:', email);
    const accessToken = localStorage.getItem('access_token');
    console.log('Token de acceso obtenido del localStorage:', accessToken);
    this.userEmail = email || '';
    this.hasAccessToken = accessToken !== null;
    this.isLoggedIn = accessToken !== null;
    this.checkIfFavorite();
    this.posterForDb = this.poster_path;
    this.nameForDb = this.name;
    this.starsForDb = this.stars;
    this.yearStartForDb = this.yearStart;
  },

  methods: {
    async checkIfFavorite() {
      try {
        console.log('Iniciando conexión con la base de datos...');
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_email', this.userEmail); 
        
        if (error) {
          throw new Error('Error al conectar con la base de datos: ' + error.message);
        }

        console.log('Datos obtenidos de la base de datos para el usuario actual:', data);
        data.forEach((row) => {
          console.log('Usuario:', row.user_email);
          const moviesFetched = [];
          if (row.favorites_json.movies) {
            console.log('Películas favoritas:');
            row.favorites_json.movies.forEach((movie) => {
              const movieKey = Object.keys(movie)[0];
              moviesFetched.push(movieKey);
            });
            console.log(moviesFetched);
          }

          const tvFetched = [];
          if (row.favorites_json.tv) {
            console.log('Programas de TV favoritos:');
            row.favorites_json.tv.forEach((tvShow) => {
              const tvKey = Object.keys(tvShow)[0];
              tvFetched.push(tvKey);
            });
            console.log(tvFetched);
          }
          
          console.log(`Buscando si ${this.favId} se encuentra en alguna de las categorías de moviesFetched o tvFetched`);
          if (moviesFetched.includes(this.favId) || tvFetched.includes(this.favId)) {
            console.log('El elemento está marcado como favorito.');
            this.isFavorite = true;
          } else {
            console.log('El elemento no está marcado como favorito.');
            this.isFavorite = false;
          }
        });
        
      } catch (error) {
        console.error('Error al verificar si el elemento está agregado como favorito:', error.message);
      }
    },

    openModal() {
      this.modalVisible = true;
    },

    closeModal() {
      this.modalVisible = false;
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

          console.log(`${this.favId} eliminado de los favoritos.`);
        } else {
          const updatedFavorites = this.addFavorite(favoritesData, this.favId);
          await supabase
            .from('favorites')
            .update({ favorites_json: updatedFavorites })
            .eq('user_email', this.userEmail);

          console.log(`${this.favId} añadido a los favoritos.`);
        }

        this.isFavorite = !this.isFavorite;
      } catch (error) {
        console.error('Error al cambiar el estado del favorito:', error.message);
      }
    },


    removeFavorite(favoritesJson, favId) {
      const updatedFavorites = { ...favoritesJson };
      for (const key in updatedFavorites) {
        updatedFavorites[key] = updatedFavorites[key].filter(id => String(id) !== favId && !String(id).endsWith(favId));
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
                posterForDb: this.posterForDb,
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
              posterForDb: this.posterForDb,
            };
          } else {
            favoritesJson[category][index].push({
              [fullId]: {
                details: {
                  nameForDb: this.nameForDb,
                  starsForDb: this.starsForDb,
                  yearStartForDb: this.yearStartForDb,
                  posterForDb: this.posterForDb,
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
              posterForDb: this.posterForDb,
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
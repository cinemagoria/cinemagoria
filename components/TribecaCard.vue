<template>
  <div class="card">
    <nuxt-link
      class="card__link"
      :to="getRouteLink()">

      <CardActions v-if="context === 'list'" :item="item" :currentList="list" />

      <div class="card__img">
        <div v-if="isLoading" class="card-loader">
          <Loader :size="40" />
        </div>

        <QuickFav v-if="media !== 'production' && media !== 'person' && media !== 'streaming'" :item="item" />

        <img
          v-if="poster"
          ref="posterImage"
          :src="poster"
          loading="lazy"
          :class="{ 'card__img--logo': media === 'production' || media === 'streaming' }"
          :alt="name"
          :style="{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease' }"
          @load="onImageLoaded"
          @error="onPosterError">

        <img
          v-else
          ref="posterImage"
          src="/placeholders/image_not_found_yet.webp"
          alt="Image not found"
          class="card__img--poster"
          style="width: 100%; height: 100%; object-fit: cover;"
          @load="onImageLoaded"
          @error="onImageLoaded">

          <div v-if="media === 'streaming'" class="card__badge">Streaming Service</div>
          <div v-if="media === 'production'" class="card__badge">Production Company</div>
      </div>

      <h2 class="card__name">
        {{ name }}
      </h2>


      <div class="card__logo-container">
        <img
            src="/festivals/tribeca/tribeca_film_festival_2026_logo.png"
            alt="Tribeca Selection"
            class="card__tribeca-logo"
        />
      </div>
    </nuxt-link>
  </div>
</template>

<script>
import { apiImgUrl } from '~/utils/api';
import { name, stars, poster as posterMixin } from '~/mixins/Details';
import QuickFav from '~/components/global/QuickFav';
import CardActions from '~/components/global/CardActions.vue';
import Loader from '~/components/Loader.vue';

export default {
  components: {
    QuickFav,
    CardActions,
    Loader,
  },
  mixins: [
    name,
    stars,
    // posterMixin provides `poster_path` (computed) that respects title_overrides:
    //   - force_enrichment=true  → override siempre gana
    //   - force_enrichment=false → override solo gana si TMDB no tiene poster
    // Lo consumimos en el computed `poster` debajo y le agregamos el fallback Tribeca-only.
    posterMixin,
  ],

  props: {
    item: {
      type: Object,
      required: true,
    },
    context: {
      type: String,
      default: 'home'
    },
    list: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      isLoading: true,
      triedDbImage: false,
    };
  },

  mounted() {
    this.checkImageLoaded();
  },

  watch: {
    item: {
      immediate: true,
      handler() {
        this.isLoading = true;
        this.triedDbImage = false;
        this.$nextTick(() => {
           this.checkImageLoaded();
        });
      }
    }
  },

  methods: {
    checkImageLoaded() {
      const img = this.$refs.posterImage;
      if (img && img.complete && img.naturalHeight !== 0) {
        this.onImageLoaded();
      }
    },
    onImageLoaded() {
      this.isLoading = false;
    },
    onPosterError(event) {
      // Fallback chain: TMDB poster (failed) → DB image_url → placeholder
      if (!this.triedDbImage) {
        this.triedDbImage = true;
        const dbImage = this.item && this.item.image_url;
        if (dbImage) {
          event.target.src = dbImage;
          return;
        }
      }
      event.target.src = '/placeholders/image_not_found_yet.webp';
      this.onImageLoaded();
    },
    getRouteLink() {
        if (this.item.media_type === 'production') {
            return { name: 'production-slug', params: { slug: this.item.slug } };
        }
        if (this.item.media_type === 'streaming') {
            return { name: 'streaming-slug', params: { slug: this.item.slug } };
        }
        return { name: `${this.media}-id`, params: { id: this.item.id } };
    }
  },

  computed: {
    poster () {
      // posterMixin's `poster_path` already resolves the override hierarchy:
      //   1. title_overrides force-override (wins always)
      //   2. TMDB poster_path
      //   3. title_overrides fallback (wins when TMDB has none)
      // We add a Tribeca-only final fallback to festival_films.image_url.
      if (this.poster_path) return this.poster_path;

      // 4. Tribeca DB image_url (same image used in schedule tab)
      if (this.item.image_url) return this.item.image_url;

      // 5. No image available
      return false;
    },

    media () {
      if (this.item.media_type) {
        return this.item.media_type;
      } else if (this.item.name) {
        return 'tv';
      } else {
        return 'movie';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.card__link {
  display: block;
  position: relative;
}

.card__img {
  position: relative;
  overflow: hidden;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  transform: translateZ(0);
}
.card__img img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card__img--logo {
  object-fit: contain !important;
  padding: 20px;
  background-color: #8BE9FD;
  width: 100%;
  height: 100%;
}

.card-loader {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: #0000004e;
  z-index: 2;
}

.card__indicator {
  font-size: 0.8rem;
  color: #8BE9FD;
  margin-top: 0.2rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card__badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.75);
  color: #8BE9FD;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 5;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);

  @media (max-width: 500px) {
    font-size: 0.6rem;
    padding: 2px 4px;
    top: 5px;
    right: 5px;
  }
}

.card__logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background: black;
    box-shadow: 0 8px 10px 0 rgba(31, 104, 135, 0.37);
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    bottom: 10px;
    padding-bottom: 0.5rem;
    position: relative;
    top: -30px;
    height: 60px;
}

.card__tribeca-logo {
    height: 50px;
    width: auto;
    filter: invert(1);
    object-fit: contain;
}
</style>

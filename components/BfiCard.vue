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

        <div class="card__quick-actions">
          <button
            v-if="sourceUrl"
            type="button"
            class="card__ext-link"
            :aria-label="`Open official festival page for ${name}`"
            @click.prevent.stop="openSourceUrl"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <path d="M15 3h6v6" />
              <path d="M10 14 21 3" />
            </svg>
          </button>
          <QuickFav v-if="media !== 'production' && media !== 'person' && media !== 'streaming'" :item="item" grouped />
        </div>

        <img
          v-if="poster"
          ref="posterImage"
          :src="poster"
          loading="lazy"
          :class="{ 'card__img--logo': media === 'production' || media === 'streaming' }"
          :alt="name"
          :style="{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease' }"
          @load="onImageLoaded"
          @error="$event.target.src = '/placeholders/image_not_found_yet.webp'; onImageLoaded($event)">

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
            src="/festivals/bfi/bfi_film_festival_2026_logo.png"
            alt="BFI London Selection"
            class="card__bfi-logo"
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
    openSourceUrl() {
      window.open(this.sourceUrl, '_blank', 'noopener,noreferrer');
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
    // Official festival page for this film; empty unless it's a real http(s) URL.
    sourceUrl () {
      const url = typeof this.item?.source_url === 'string' ? this.item.source_url.trim() : '';
      return /^https?:\/\//i.test(url) ? url : '';
    },
    poster () {
      if (this.poster_path) return this.poster_path;
      if (this.item.profile_path) {
        return `${apiImgUrl}/w500${this.item.profile_path}`;
      } else if (this.item.logo_path) {
        return `${apiImgUrl}/w500${this.item.logo_path}`;
      } else {
        return false;
      }
    },

    // TIFF's Primetime strand is TV, not movie — item.media_type is forced
    // to 'tv' upstream (page-level, keyed off category) for those rows, so
    // this just needs to respect it before falling back to the name-based
    // guess every other card uses.
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

.card__bfi-logo {
    height: 50px;
    width: auto;
    filter: invert(1);
    object-fit: contain;
}

.card__quick-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 20;
}

.card__ext-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 50%;
  backdrop-filter: blur(4px);
  cursor: pointer;
  transition: all 0.3s ease;
  pointer-events: auto;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: #8BE9FD;
    transform: scale(1.1);
  }
}
</style>

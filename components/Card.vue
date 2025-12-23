<template>
  <div class="card">
    <nuxt-link
      class="card__link"
      :to="item.media_type === 'production' ? { name: 'production-slug', params: { slug: item.slug } } : { name: `${media}-id`, params: { id: item.id } }">
      <div class="card__img">
        <QuickFav v-if="media !== 'production' && media !== 'person'" :item="item" />
        
        <div v-if="isLoading" class="card-loader">
          <Loader :size="40" />
        </div>

        <img
          v-if="poster"
          ref="posterImage"
          :src="poster"
          loading="lazy"
          :class="{ 'card__img--logo': media === 'production' }"
          :alt="name"
          :style="{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease' }"
          @load="onImageLoaded"
          @error="onImageLoaded">

        <img
          v-else
          ref="posterImage"
          src="/image_not_found_yet.webp"
          alt="Image not found"
          class="card__img--poster"
          style="width: 100%; height: 100%; object-fit: cover;"
          @load="onImageLoaded"
          @error="onImageLoaded">
      </div>

      <h2 class="card__name">
        {{ name }}
      </h2>

      <div
        v-if="media !== 'person' && (stars || item.vote_average || item.imdb_rating)"
        class="card__rating">
        <div
          v-if="stars"
          class="card__stars">
          <div :style="{ width: `${stars}%` }" />
        </div>

        <div
          v-if="item.rating_source === 'imdb' && item.imdb_rating"
          class="card__vote">
          {{ item.imdb_rating.toFixed(1) }}
        </div>
        <div
          v-else-if="item.vote_average"
          class="card__vote">
          {{ parseFloat(item.vote_average).toFixed(1) }}
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
import { apiImgUrl } from '~/utils/api';
import { name, stars } from '~/mixins/Details';
import QuickFav from '~/components/global/QuickFav';
import Loader from '~/components/Loader.vue';

export default {
  components: {
    QuickFav,
    Loader,
  },
  mixins: [
    name,
    stars,
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
  },

  computed: {
    poster () {
      if (this.item.poster_path) {
        return `${apiImgUrl}/w500${this.item.poster_path}`;
      } else if (this.item.profile_path) {
        return `${apiImgUrl}/w500${this.item.profile_path}`;
      } else if (this.item.logo_path) {
        return `${apiImgUrl}/w500${this.item.logo_path}`;
      } else {
        return false;
      }
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
</style>

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

        <QuickFav v-if="media !== 'production' && media !== 'person' && media !== 'streaming' && media !== 'festival'" :item="item" />

        <img
          v-if="poster"
          ref="posterImage"
          :src="poster"
          loading="lazy"
          :class="{ 'card__img--logo': media === 'production' || media === 'streaming', 'card__img--festival': media === 'festival' }"
          :alt="name"
          :style="{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease' }"
          @load="onImageLoaded"
          @error="$event.target.src = '/placeholders/image_not_found_yet_es.webp'; onImageLoaded($event)">

        <img
          v-else
          ref="posterImage"
          src="/placeholders/image_not_found_yet_es.webp"
          alt="Imagen no encontrada"
          class="card__img--poster"
          style="width: 100%; height: 100%; object-fit: cover;"
          @load="onImageLoaded"
          @error="onImageLoaded">

          <div v-if="media === 'streaming'" class="card__badge">Plataforma de Streaming</div>
          <div v-if="media === 'production'" class="card__badge">Productora</div>
          <div v-if="media === 'festival'" class="card__badge">Festival</div>
      </div>

      <h2
        class="card__name"
        :class="{ 'card__name--rounded': !year && !hasRating }">
        {{ name }}
      </h2>

      <div
        v-if="year"
        class="card__release-year"
        :class="{ 'card__release-year--rounded': !hasRating }">
        {{ year }}
      </div>
      

      <div
        v-if="hasRating"
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
    getRouteLink() {
        if (this.item.media_type === 'production') {
            return { name: 'production-slug', params: { slug: this.item.slug } };
        }
        if (this.item.media_type === 'streaming') {
            return { name: 'streaming-slug', params: { slug: this.item.slug } };
        }
        if (this.item.media_type === 'festival') {
            return { name: `festival-${this.item.slug}` };
        }
        return { name: `${this.media}-id`, params: { id: this.item.id } };
    }
  },

  computed: {
    hasRating() {
      return !['person', 'streaming', 'production', 'festival'].includes(this.media) && (this.stars || this.item.vote_average || this.item.imdb_rating);
    },
    poster () {
      if (this.media === 'festival' && this.item.logo_path) {
          return this.item.logo_path;
      }
      if (this.item.poster_path) {
        if (this.item.poster_path.startsWith('http')) {
           return this.item.poster_path;
        }
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

    year () {
      const date = this.item.release_date || this.item.first_air_date;
      if (!date) return null;
      
      const startYear = new Date(date).getFullYear();
      
      if (this.media === 'tv') {
        const endYear = this.item.end_date ? new Date(this.item.end_date).getFullYear() : null;
        if (this.item.status === 'Ended' && endYear && endYear !== startYear) {
          return `${startYear}-${endYear}`;
        }
        if (this.item.status === 'Returning Series') {
           return `${startYear}-`;
        }
      }
      
      return startYear;
    },
  },
};
</script>

<style lang="scss" scoped>
.card__link {
  display: block;
  position: relative;
}

.card__name--rounded {
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
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

.card__img--festival {
  object-fit: contain !important;
  padding: 20px;
  background-color: #fff;
  filter: invert(1);
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

.card__release-year {
  font-size: 1.3rem;
  color: #fff !important;
  text-align: center;
  font-weight: 600;
  background-color: #000;
  position: relative;
  top: -29px;
  padding-bottom: 5px;
  display: block;
  z-index: 5;
}

.card__release-year--rounded {
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}

.card__rating {
  display: flex !important;
  align-items: center;
  justify-content: center;
  margin-top: 0;
}
</style>
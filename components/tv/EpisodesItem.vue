<template>
  <div :class="$style.item">
    <div :class="$style.image">
      <img
        v-if="poster"
        v-lazyload="poster"
        class="lazyload"
        :alt="episode.name">

      <img
        v-else
        src="https://raw.githubusercontent.com/imprvhub/entercinema/es/static/image_not_found_yet_es.webp"
        alt="Imagen no encontrada"
        style="width: 100%; height: 100%; object-fit: cover;">
    </div>

    <h2 :class="$style.name">
      <strong>E{{ episode.episode_number | numberWithDoubleDigits }}</strong> {{ episode.name }}
    </h2>

    <div :class="$style.overview">
      {{ episode.overview | truncate(300) }}
    </div>

    <div
      v-if="episode.air_date"
      :class="$style.aired">
      {{ episode.air_date | fullDate }}
    </div>
  </div>
</template>

<script>
import { apiImgUrl } from '~/api';

export default {
  props: {
    episode: {
      type: Object,
      required: true,
    },
  },

  computed: {
    poster () {
      if (this.episode.still_path) {
        return `${apiImgUrl}/w400${this.episode.still_path}`;
      } else {
        return null;
      }
    },
  },
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.item {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0.4rem;
  margin-bottom: 2rem;

  @media (min-width: $breakpoint-xsmall) {
    width: 50%;
  }

  @media (min-width: $breakpoint-medium) {
    width: 33.3333333%;
  }

  @media (min-width: 1450px) {
    width: 25%;
  }

  @media (min-width: 2000px) {
    width: 20%;
  }

  @media (min-width: 3000px) {
    width: 16.6666667%;
  }
}

.image {
  position: relative;
  height: 0;
  padding-top: 56.25%;
  margin-bottom: 1.5rem;
  overflow: hidden;
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

.name {
  margin-bottom: 1rem;
  font-size: 1.6rem;
  letter-spacing: $letter-spacing;

  strong {
    color: $primary-color;
  }
}

.overview {
  flex: 1 0 auto;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  color: $text-color;
}

.aired {
  font-size: 1.2rem;
  color: $text-color-grey;
  letter-spacing: $letter-spacing;

  @media (min-width: $breakpoint-large) {
    font-size: 1.4rem;
  }
}
</style>

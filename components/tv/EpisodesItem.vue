<template>
  <div :class="$style.item">
    <div :class="$style.image" style="border-radius:15px;">
      <img
        v-if="poster"
        :src="poster"
        loading="lazy"
        :alt="episode.name">

      <img
        v-else
        src="https://raw.githubusercontent.com/imprvhub/entercinema/main/static/image_not_found_yet_horizontal.webp"
        alt="Image not found"
        style="width: 100%; height: 100%; object-fit: cover; padding: 3rem;">
    </div>

    <h2 :class="$style.name">
      <strong>E{{ numberWithDoubleDigits(episode.episode_number) }}</strong> {{ episode.name }}
    </h2>

    <div :class="$style.overview">
      {{ truncate(episode.overview, 300) }}
    </div>

    <div
      v-if="episode.air_date"
      :class="$style.aired">
      {{ fullDate(episode.air_date) }}
    </div>
  </div>
</template>

<script>
import { apiImgUrl } from '~/utils/api';

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

  methods: {
    numberWithDoubleDigits(number) {
      if (number < 10) {
        return `0${number}`;
      }
      return number;
    },

    truncate(text, length, clamp) {
      text = text || '';
      clamp = clamp || '...';
      length = length || 30;

      if (text.length <= length) return text;

      let tcText = text.slice(0, length - clamp.length);
      let last = tcText.length - 1;

      while (last > 0 && tcText[last] !== ' ' && tcText[last] !== clamp[0]) last -= 1;

      last = last || length - clamp.length;

      tcText = tcText.slice(0, last);

      return tcText + clamp;
    },

    fullDate(string) {
      if (!string) return '';
      const dateArray = string.split('-');
      const date = dateArray[2].substr(0, 1) === '0' ? dateArray[2].substr(1, 1) : dateArray[2];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      return `${date} ${months[dateArray[1] - 1]} ${dateArray[0]}`;
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

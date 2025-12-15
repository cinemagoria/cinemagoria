<template>
  <div class="credits-item">
    <nuxt-link
      class="credits-item__link"
      :to="{ name: 'person-id', params: { id: person.id } }">
      <div class="credits-item__img">
        <img
          v-if="poster"
          v-lazyload="poster"
          class="lazyload"
          :alt="person.name">

        <img
          v-else
          src="https://raw.githubusercontent.com/imprvhub/entercinema/es/static/image_not_found_yet_es.webp"
          alt="Imagen no encontrada"
          style="width: 100%; height: 100%; object-fit: cover;">
      </div>

      
       <h2 class="credits-item__name">
            {{ person.name }}
      </h2>


      <div class="credits-item__character">
        {{ person.character }}
      </div>
    </nuxt-link>
  </div>
</template>

<script>
import { apiImgUrl } from '~/api';

export default {
  props: {
    person: {
      type: Object,
      required: true,
    },
  },

  computed: {
    poster () {
      if (this.person.profile_path) {
        return `${apiImgUrl}/w500${this.person.profile_path}`;
      } else {
        return null;
      }
    },
  },
};
</script>

<style lang="scss">
@use '~/assets/css/utilities/variables' as *;

.credits-item {
  margin-bottom: 2rem;
  line-height: $base-line-height;
  border-radius: 10px;
  padding-bottom: 0.5rem;
  position: relative;
}

.credits-item__img {
  position: relative;
  height: 0;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding-top: 150.27%;
  overflow: hidden;
  background-color: $secondary-color;
  transition: transform 0.3s ease-in-out;

  img,
  span {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: scale(0.97);
  }

  .card-background {
      border-bottom-left-radius: 15px;
      border-bottom-right-radius: 15px;
      background: black;
      position: relative;
      top: -10px;
    }

  span {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &.lazyloaded img {
    transform: scale(1);
  }
}

.credits-item__name {
    background: black;
    font-size: 1.3rem;
    letter-spacing: 0.4px;
    text-align: center;
  

  @media (min-width: $breakpoint-large) {
    font-size: 1.5rem;
  }
}

.credits-item__character {
    font-size: 1.2rem;
    /* margin: 0 auto; */
    position: relative;
    color: #80868b;
    letter-spacing: 0.4px;
    background: black;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    text-align: center;

  @media (min-width: $breakpoint-large) {
    font-size: 1.4rem;
  }
}
</style>

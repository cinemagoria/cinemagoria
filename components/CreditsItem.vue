<template>
  <div class="credits-item">
    <nuxt-link
      class="credits-item__link"
      :to="{ name: 'person-id', params: { id: person.id } }">
      <div class="credits-item__img">
        <div v-if="isLoading" class="credits-item-loader">
          <Loader :size="30" />
        </div>
        <img
          v-if="poster"
          :src="poster"
          loading="lazy"
          :alt="person.name"
          :style="{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease' }"
          @load="onImageLoaded"
          @error="onImageLoaded">

        <img
          v-else
          src="/placeholders/image_not_found_yet_es.webp"
          alt="Image not found"
          style="width: 100%; height: 100%; object-fit: cover;"
          @load="onImageLoaded"
          @error="onImageLoaded">
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
import { apiImgUrl } from '~/utils/api';
import Loader from '~/components/Loader.vue';

export default {
  components: {
    Loader,
  },
  props: {
    person: {
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
    setTimeout(() => {
      this.isLoading = false;
    }, 5000);
  },

  methods: {
    onImageLoaded() {
      this.isLoading = false;
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

  border-radius: 15px;;
  padding-bottom: 0.5rem;
  position: relative;
}

.credits-item__link {
  display: block;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(139, 233, 253, 0.14);
  text-decoration: none;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.credits-item__link:hover {
  transform: translateY(-4px);
  border-color: rgba(139, 233, 253, 0.5);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 233, 253, 0.22);
}

.credits-item__link:hover .credits-item__name {
  color: #8BE9FD;
}

.credits-item__img {
  position: relative;
  height: 0;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
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
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
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

.credits-item-loader {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: $secondary-color;
  z-index: 2;
}

.credits-item__name {
    background: rgba(3, 4, 6, 0.92);
    color: #fff;
    font-family: var(--font-display);
    font-size: 1.3rem;
    letter-spacing: 0.4px;
    text-align: center;
    padding: 0.7rem 0.5rem 0.2rem;
    transition: color 0.2s ease;

  @media (min-width: $breakpoint-large) {
    font-size: 1.5rem;
  }
}

.credits-item__character {
    font-family: var(--font-display);
    font-size: 1.2rem;
    position: relative;
    color: #80868b;
    letter-spacing: 0.4px;
    background: rgba(3, 4, 6, 0.92);
    border-bottom-left-radius: 14px;
    border-bottom-right-radius: 14px;
    text-align: center;
    padding: 0 0.5rem 0.8rem;

  @media (min-width: $breakpoint-large) {
    font-size: 1.4rem;
  }
}
</style>

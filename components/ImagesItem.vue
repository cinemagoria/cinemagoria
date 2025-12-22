<template>
  <div :class="[$style.item, $style[type]]">
    <a
      :href="image.thumb"
      @click.prevent="handleGallery(index)">
      <div :class="$style.image">
        <div v-if="isLoading" :class="$style.loaderContainer">
           <Loader :size="30" />
        </div>
        <img
          :src="image.thumb"
          loading="lazy"
          alt=""
          :style="{ opacity: isLoading ? 0 : 1 }"
          @load="onLoad">
      </div>
    </a>
  </div>
</template>

<script>
import Loader from '~/components/Loader.vue';

export default {
  components: {
    Loader
  },

  props: {
    image: {
      type: Object,
      required: true,
    },

    index: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isLoading: true
    };
  },

  methods: {
    handleGallery (index) {
      this.$emit('openModal', index);
    },
    onLoad() {
      this.isLoading = false;
    }
  },
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.item {
  padding: 0.4rem;
}

.image {
  position: relative;
  height: 0;
  overflow: hidden;
  background-color: $secondary-color;
  border-radius: 15px;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.3s ease-in;
  }
}

.loaderContainer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $secondary-color;
  z-index: 1;
}

.backdrop {
  width: 50%;

  @media (min-width: $breakpoint-xsmall) {
    width: 33.3333333%;
  }

  @media (min-width: $breakpoint-medium) {
    width: 25%;
  }

  @media (min-width: 1500px) {
    width: 20%;
  }

  @media (min-width: 1800px) {
    width: 16.6666667%;
  }

  @media (min-width: 2500px) {
    width: 14.2857143%;
  }

  .image {
    padding-top: 56.28%;
  }
}

.poster {
  width: 33.3333333%;

  @media (min-width: $breakpoint-xsmall) {
    width: 25%;
  }

  @media (min-width: $breakpoint-medium) {
    width: 20%;
  }

  @media (min-width: 1500px) {
    width: 16.6666667%;
  }

  @media (min-width: 1800px) {
    width: 14.2857143%;
  }

  @media (min-width: 2500px) {
    width: 12.5%;
  }

  .image {
    padding-top: 150.27%;
  }
}
</style>

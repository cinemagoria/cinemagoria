<template>
  <div :class="$style.container">
    <div :class="$style.card">
      <h2 v-if="title" :class="$style.title">{{ title }}</h2>
      <div v-if="logo" :class="$style.logoContainer">
        <img :src="logo" :alt="name" :class="$style.logo" />
      </div>
      <h1 v-else :class="$style.name">
        {{ name }}
      </h1>

      <div :class="$style.meta">
        <div :class="$style.info">
          <span v-if="country">{{ country }}</span>
          <span v-if="headquarters">{{ headquarters }}</span>
        </div>
      </div>

      <div v-if="description" :class="$style.desc">
        {{ description }}
      </div>
      
      <div :class="$style.buttonContainer">
        <a
          v-if="homepage"
          :href="homepage"
          target="_blank"
          rel="noopener noreferrer"
          class="button button--icon"
          :class="$style.actionButton">
          <span class="txt">Visitar Sitio Web</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { apiImgUrl } from '~/api';

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
  },

  computed: {
    name() {
      return this.item.name;
    },
    description() {
      return this.item.description || '';
    },
    headquarters() {
      return this.item.headquarters;
    },
    country() {
      return this.item.origin_country;
    },
    homepage() {
      return this.item.homepage;
    },
    logo() {
      if (this.item.logo_path) {
        return `${apiImgUrl}/w500${this.item.logo_path}`;
      }
      return null;
    },
  },
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.container {
  display: flex;
  justify-content: center;
  padding: 4rem 2rem;
  width: 100%;
}

.card {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 3rem;
  width: 100%;
  max-width: 800px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.logoContainer {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  height: 100px;
  align-items: center;
}

.logo {
  max-height: 100%;
  max-width: 80%;
  object-fit: contain;
  filter: drop-shadow(0 0 4px rgba(255,255,255,0.8));
}

.title {
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  margin-bottom: 2rem;
  font-weight: 500;
}

.name {
  margin-bottom: 1rem;
  font-size: 2.5rem;
  line-height: 1.1;
  letter-spacing: $letter-spacing;
  color: #fff;
}

.meta {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  font-size: 1.4rem;
  color: rgba(#fff, 0.8);
}

.info {
  span {
    margin: 0 0.5rem;

    &:not(:last-child)::after {
      content: '•';
      margin-left: 1rem;
    }
  }
}

.desc {
  max-width: 60rem;
  margin: 0 auto 2.5rem;
  font-size: 1.4rem;
  line-height: 1.6;
  color: rgba(#fff, 0.9);
}

.buttonContainer {
  display: flex;
  justify-content: center;
}

.actionButton {
  height: 4.4rem;
  padding: 0 2.5rem;
  border-radius: 5rem;
  background-color: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  font-size: 1.3rem;
  font-weight: 500;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    color: #fff;
    border-color: #fff;
    transform: translateY(-2px);

    :global(.icon) svg {
      stroke: #fff !important;
      fill: none !important;
      
      path {
        stroke: #fff !important;
        fill: none !important;
      }
    }
  }
}
</style>

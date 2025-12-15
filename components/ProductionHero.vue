<template>
  <div :class="$style.container">
    <div :class="$style.card">
      <h2 v-if="title" :class="$style.title">{{ title }}</h2>
      <div v-if="logo" :class="$style.logoContainer">
        <img :src="logo" :alt="name" :class="$style.logo" />
      </div>
      <h1 :class="$style.name">
        {{ name }}
      </h1>

      <div :class="$style.meta">
        <div :class="$style.info">
          <span v-if="countryName">{{ countryName }}</span>
          <span v-if="headquarters">{{ headquarters }}</span>
        </div>
      </div>

      <div v-if="description" :class="$style.desc">
        {{ description }}
      </div>

      <div :class="$style.buttonContainer" v-if="isSupported && isAuthenticated">
        <button 
          :class="[$style.actionButton, { [$style.active]: isFollowing }]" 
          @click="toggleFollow" 
          :disabled="isLoadingFollow">
          <span v-if="isLoadingFollow">Loading...</span>
          <span v-else>
            {{ isFollowing ? 'Following' : 'Follow' }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { apiImgUrl, followProductionCompany, unfollowProductionCompany, getFollowedProductionCompanies } from '~/api';
import { SUPPORTED_PRODUCTION_COMPANIES, ISO_TO_COUNTRY_NAME_MAP } from '~/utils/constants';

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

  data() {
    return {
      isFollowing: false,
      isLoadingFollow: false,
    };
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
    countryName() {
      const code = this.item.origin_country;
      return ISO_TO_COUNTRY_NAME_MAP[code] || code;
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
    isAuthenticated() {
      if (typeof window !== 'undefined') {
          return !!localStorage.getItem('email');
      }
      return false;
    },
    isSupported() {
      return !!SUPPORTED_PRODUCTION_COMPANIES[this.item.id];
    }
  },

  mounted() {
    this.checkFollowStatus();
    if (typeof window !== 'undefined') {
         window.addEventListener('following-updated', this.checkFollowStatus);
    }
  },

  beforeDestroy() {
    if (typeof window !== 'undefined') {
         window.removeEventListener('following-updated', this.checkFollowStatus);
    }
  },

  methods: {
    async checkFollowStatus() {
        if (!this.isAuthenticated || !this.isSupported) return;
        const userEmail = localStorage.getItem('email');
        this.isLoadingFollow = true;
        try {
            const follows = await getFollowedProductionCompanies(userEmail);
            this.isFollowing = follows.some(c => c.company_id === this.item.id);
        } catch (e) {
            console.error(e);
        } finally {
            this.isLoadingFollow = false;
        }
    },
    async toggleFollow() {
        if (!this.isAuthenticated) {
            console.warn("Please login to follow production companies.");
            return;
        }
        const userEmail = localStorage.getItem('email');
        this.isLoadingFollow = true;
        try {
            if (this.isFollowing) {
                await unfollowProductionCompany(userEmail, this.item.id);
                this.isFollowing = false;
            } else {
                await followProductionCompany(
                    userEmail,
                    this.item.id,
                    this.item.name,
                    this.item.logo_path,
                    this.item.origin_country
                );
                this.isFollowing = true;
            }
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('following-updated'));
            }
        } catch (e) {
            console.error(e);
        } finally {
            this.isLoadingFollow = false;
        }
    }
  }
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
  height: 120px;
  align-items: center;
  background-color: #8BE9FD;
  border-radius: 10px;
  padding: 1rem;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.logo {
  max-height: 100%;
  max-width: 80%;
  object-fit: contain;
  filter: none;
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

  &.active {
    background-color: #8BE9FD;
    border-color: #8BE9FD;
    color: #000000;
    
    &:hover {
      background-color: #8BE9FD;
      border-color: #8BE9FD;
    }
  }
}
</style>

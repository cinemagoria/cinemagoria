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

      <div :class="$style.buttonContainer">
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
import { apiImgUrl, followStreamingPlatform, unfollowStreamingPlatform, getFollowedStreamingPlatforms } from '~/utils/api';

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      default: 'Streaming Service',
    },
  },

  data() {
    return {
      isFollowing: false,
      isLoadingFollow: false,
      isAuthenticated: false,
    };
  },

  computed: {
    name() {
      return this.item.name;
    },
    logo() {
      if (this.item.logo_path) {
        return `${apiImgUrl}/w500${this.item.logo_path}`;
      }
      return null;
    }
  },

  mounted() {
    if (typeof window !== 'undefined') {
         this.isAuthenticated = !!localStorage.getItem('email');
    }
    this.checkFollowStatus();
    if (typeof window !== 'undefined') {
         window.addEventListener('streaming-follow-updated', this.checkFollowStatus);
    }
  },

  beforeDestroy() {
    if (typeof window !== 'undefined') {
         window.removeEventListener('streaming-follow-updated', this.checkFollowStatus);
    }
  },

  methods: {
    async checkFollowStatus() {
        if (!this.isAuthenticated) return;
        const userEmail = localStorage.getItem('email');
        this.isLoadingFollow = true;
        try {
            const follows = await getFollowedStreamingPlatforms(userEmail);
            this.isFollowing = follows.some(c => c.provider_id === this.item.id);
        } catch (e) {
            console.error(e);
        } finally {
            this.isLoadingFollow = false;
        }
    },
    async toggleFollow() {
        if (!this.isAuthenticated) {
            if (typeof window !== 'undefined') {
                const event = new CustomEvent('open-auth-modal', { detail: { action: 'register' } });
                window.dispatchEvent(event);
            }
            return;
        }
        const userEmail = localStorage.getItem('email');
        this.isLoadingFollow = true;
        try {
            if (this.isFollowing) {
                await unfollowStreamingPlatform(userEmail, this.item.id);
                this.isFollowing = false;
            } else {
                await followStreamingPlatform(
                    userEmail,
                    this.item.id,
                    this.item.name,
                    this.item.logo_path
                );
                this.isFollowing = true;
            }
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('streaming-follow-updated'));
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
  border-radius: 15px;;
  padding: 3rem;
  width: 100%;
  max-width: 600px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.307);
  backdrop-filter: blur(10px);
}

.logoContainer {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  height: 120px;
  align-items: center;
  background-color: #fff;
  border-radius: 15px;;
  padding: 1rem;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.logo {
  max-height: 100%;
  max-width: 100%;
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
  margin-bottom: 2.5rem;
  font-size: 2.5rem;
  line-height: 1.1;
  letter-spacing: $letter-spacing;
  color: #fff;
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

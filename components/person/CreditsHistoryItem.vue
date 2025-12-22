<template>
  <div :class="$style.item">
    <nuxt-link :to="{ name: `${media}-id`, params: { id: credit.id } }" :class="$style.link">
      <strong :class="$style.cyan">{{ name }}</strong>

      <span
        v-if="episodes"
        :class="$style.episodes">
        {{ episodes }}
      </span>

      <span
        v-if="role"
        :class="$style.role">
        {{ role.prefix }}<span :class="$style.character">{{ role.character }}</span>
      </span>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    credit: {
      type: Object,
      required: true,
    },
  },

  computed: {
    media () {
      if (this.credit.media_type) {
        return this.credit.media_type;
      } else if (this.credit.name) {
        return 'tv';
      } else {
        return 'movie';
      }
    },

    name () {
      return this.credit.title ? this.credit.title : this.credit.name;
    },

    role () {
      const character = this.credit.character;
      const job = this.credit.job;

      if (character) {
        return { prefix: ' as ', character };
      } else if (job) {
        return { prefix: ' as ', character: job };
      } else {
        return false;
      }
    },

    episodes () {
      const episodes = this.credit.episode_count;

      if (episodes) {
        if (episodes > 1) {
          return ` (${episodes} episodes)`;
        } else {
          return ` (${episodes} episode)`;
        }
      } else {
        return false;
      }
    },
  },
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.item {
  font-size: 1.5rem;
  line-height: 1.5;

  @media (min-width: $breakpoint-large) {
    font-size: 1.6rem;
  }
}

.link {
  display: block;
  text-decoration: none;
  
  &:hover {
    strong {
      text-decoration: underline;
    }
  }
}

.cyan {
  color: #8BE9FD;
}

.episodes {
  color: #999;
}

.role {
  color: #999;
}

.character {
  color: #fff;
}
</style>

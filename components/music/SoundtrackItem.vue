<template>
  <div :class="$style.item">
    <a :href="url" target="_blank" rel="noopener noreferrer" :class="$style.link">
      <strong :class="$style.cyan">{{ item.title }}</strong>
      <span
        v-if="item.disambiguation"
        :class="$style.episodes">
        ({{ item.disambiguation }})
      </span>

      <span
        v-if="artist"
        :class="$style.role">
        por <span :class="$style.character">{{ artist }}</span>
      </span>
    </a>
  </div>
</template>

<script>
import { getMusicBrainzUrl } from '~/utils/musicbrainz';

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  computed: {
    url() {
      return getMusicBrainzUrl(this.item.id);
    },

    artist() {
      if (this.item['artist-credit'] && this.item['artist-credit'].length) {
        return this.item['artist-credit'].map(c => c.name).join(', ');
      }
      return null;
    }
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
  color: $cyan-color;
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

<template>
  <div class="spacing">
    <div :class="$style.head">
      <select
        v-if="seasons.length > 1"
        v-model="activeSeason"
        @change="getEpisodes">
        <option
          v-for="season in seasons"
          :key="`season-${season.season}`"
          :value="season.season">
          Season {{ season.season }}
        </option>
      </select>

      <strong
        v-if="activeEpisodes"
        :class="$style.count">
        {{ episodeCount }}
      </strong>
      
      <button 
        v-if="userEmail && activeEpisodes && activeEpisodes.length > 0" 
        :class="[$style.markWatchedBtn, { [$style.loading]: isMarkingSeason }]"
        @click="markSeasonAsWatched"
        :disabled="isMarkingSeason"
      >
        <span v-if="isMarkingSeason">Marking...</span>
        <span v-else>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><polyline points="20 6 9 17 4 12"/></svg>
          Mark Season Watched
        </span>
      </button>
    </div>

    <div
      v-if="activeEpisodes"
      :class="$style.items">
      <EpisodesItem
        v-for="episode in activeEpisodes"
        :key="`episode-${episode.id}`"
        ref="episodeItems"
        :episode="episode"
        :user-email="userEmail" />
    </div>
  </div>
</template>

<script>
import { getTvShowEpisodes } from '~/utils/api';
import EpisodesItem from '~/components/tv/EpisodesItem';

export default {
  components: {
    EpisodesItem,
  },

  props: {
    numberOfSeasons: {
      type: Number,
      required: true,
    },
  },

  data () {
    return {
      activeSeason: this.numberOfSeasons,
      activeEpisodes: null,
      userEmail: '',
      isMarkingSeason: false,
    };
  },

  computed: {
    episodeCount () {
      return `${this.activeEpisodes.length} ${this.activeEpisodes.length > 1 ? 'Episodes' : 'Episode'}`;
    },

    seasons () {
      const seasons = [];

      for (let index = 0; index < this.numberOfSeasons; index++) {
        seasons.push({
          season: index + 1,
          episodes: null,
        });
      }

      seasons.sort((a, b) => a.season > b.season ? -1 : 1);

      return seasons;
    },
  },

  mounted () {
    this.userEmail = import.meta.client ? localStorage.getItem('email')?.replace(/['"]+/g, '') || '' : '';
    this.getEpisodes();
  },

  methods: {
    getEpisodes () {
      const season = this.seasons.find(season => season.season === this.activeSeason);

      if (season.episodes) {
        this.activeEpisodes = season.episodes;
      } else {
        getTvShowEpisodes(this.$route.params.id, this.activeSeason).then((response) => {
          season.episodes = response.episodes;
          this.activeEpisodes = season.episodes;
        });
      }
    },
    
    async markSeasonAsWatched() {
      if (!this.userEmail || !this.activeEpisodes) return;
      this.isMarkingSeason = true;
      try {
        if (this.$refs.episodeItems && this.$refs.episodeItems.length > 0) {
          for (const item of this.$refs.episodeItems) {
            await item.setProgressWithoutModal(100);
          }
        }
      } catch (err) {
        console.error('Failed to mark season as watched', err);
      } finally {
        this.isMarkingSeason = false;
      }
    }
  },
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.head {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (min-width: $breakpoint-large) {
    margin-bottom: 2rem;
  }

  select {
    margin-right: 1rem;
  }
}

.count {
  font-size: 1.2rem;
  color: $text-color-grey;
  letter-spacing: $letter-spacing;

  @media (min-width: $breakpoint-large) {
    font-size: 1.4rem;
  }
}

.items {
  display: flex;
  flex-wrap: wrap;
  margin-right: -0.4rem;
  margin-left: -0.4rem;
}

.markWatchedBtn {
  display: inline-flex;
  align-items: center;
  margin-left: auto;
  padding: 6px 14px;
  background: rgba(138, 232, 252, 0.1);
  color: #8AE8FC;
  border: 1px solid rgba(138, 232, 252, 0.3);
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(.loading) {
    background: rgba(138, 232, 252, 0.2);
    border-color: rgba(138, 232, 252, 0.5);
  }

  &.loading {
    opacity: 0.6;
    cursor: wait;
  }

  @media (min-width: $breakpoint-large) {
    font-size: 1.2rem;
    padding: 8px 16px;
  }
}
</style>

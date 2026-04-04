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
        v-if="userEmail && activeEpisodes && activeEpisodes.length"
        :class="$style.markSeasonBtn"
        :disabled="markingSeasonBusy"
        @click="markSeasonAsWatched">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        {{ markingSeasonBusy ? 'Saving...' : 'Mark season as watched' }}
      </button>

      <button
        v-if="userEmail && numberOfSeasons > 1"
        :class="$style.markSeriesBtn"
        :disabled="markingSeriesBusy"
        @click="markSeriesAsWatched">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        {{ markingSeriesBusy ? 'Saving...' : 'Mark entire series' }}
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
        :user-email="userEmail"
        :initial-progress="episodeProgressMap[episode.id] ?? -1"
        @progress-saved="onEpisodeProgressSaved" />
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
      episodeProgressMap: {},
      markingSeasonBusy: false,
      markingSeriesBusy: false,
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
    if (this.userEmail) { this.loadAllProgress(); }
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

    async loadAllProgress() {
      if (!this.userEmail) return;
      try {
        const resp = await fetch(`/api/progress/${encodeURIComponent(this.userEmail)}`);
        if (resp.ok) {
          const rows = await resp.json();
          const tvId = String(this.$route.params.id);
          const map = {};
          for (const row of rows) {
            if (row.media_type === 'episode' && String(row.tv_id) === tvId) {
              map[row.media_id] = row.progress_percentage || 0;
            }
          }
          this.episodeProgressMap = map;
        }
      } catch (e) {
        console.error('Failed to load episode progress:', e);
      }
    },

    onEpisodeProgressSaved({ id, percentage }) {
      this.episodeProgressMap = { ...this.episodeProgressMap, [id]: percentage };
    },

    async markSeasonAsWatched() {
      if (!this.userEmail || !this.activeEpisodes?.length) return;
      this.markingSeasonBusy = true;
      try {
        const tvId = this.$route.params.id;
        const episodes = this.activeEpisodes.map(ep => ({
          media_id: ep.id,
          tv_id: tvId,
          season_number: ep.season_number,
          episode_number: ep.episode_number,
          runtime: ep.runtime || 0,
        }));

        await fetch(`/api/progress/${encodeURIComponent(this.userEmail)}/batch`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ episodes, percentage: 100 }),
        });

        const updated = {};
        for (const ep of this.activeEpisodes) {
          updated[ep.id] = 100;
        }
        this.episodeProgressMap = { ...this.episodeProgressMap, ...updated };
        window.dispatchEvent(new CustomEvent('progress-updated'));
      } catch (e) {
        console.error('Error marking season as watched:', e);
      } finally {
        this.markingSeasonBusy = false;
      }
    },

    async markSeriesAsWatched() {
      if (!this.userEmail) return;
      this.markingSeriesBusy = true;
      try {
        const tvId = this.$route.params.id;
        const allEpisodes = [];

        for (let s = 1; s <= this.numberOfSeasons; s++) {
          const cached = this.seasons.find(se => se.season === s);
          let episodes;
          if (cached && cached.episodes) {
            episodes = cached.episodes;
          } else {
            const resp = await getTvShowEpisodes(tvId, s);
            episodes = resp.episodes || [];
            if (cached) cached.episodes = episodes;
          }
          for (const ep of episodes) {
            allEpisodes.push({
              media_id: ep.id,
              tv_id: tvId,
              season_number: ep.season_number,
              episode_number: ep.episode_number,
              runtime: ep.runtime || 0,
            });
          }
        }

        if (allEpisodes.length === 0) return;

        await fetch(`/api/progress/${encodeURIComponent(this.userEmail)}/batch`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ episodes: allEpisodes, percentage: 100 }),
        });

        const updated = {};
        for (const ep of allEpisodes) {
          updated[ep.media_id] = 100;
        }
        this.episodeProgressMap = { ...this.episodeProgressMap, ...updated };
        window.dispatchEvent(new CustomEvent('progress-updated'));
      } catch (e) {
        console.error('Error marking series as watched:', e);
      } finally {
        this.markingSeriesBusy = false;
      }
    },
  },
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 1.5rem;

  @media (min-width: $breakpoint-large) {
    margin-bottom: 2rem;
  }

  select {
    margin-right: 0.2rem;
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

.markSeasonBtn,
.markSeriesBtn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 6px 14px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #8AE8FC;
  background: rgba(138, 232, 252, 0.08);
  border: 1px solid rgba(138, 232, 252, 0.25);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: rgba(138, 232, 252, 0.18);
    border-color: rgba(138, 232, 252, 0.45);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.markSeriesBtn {
  color: #50C8E8;
  border-color: rgba(80, 200, 232, 0.25);
  background: rgba(80, 200, 232, 0.08);

  &:hover:not(:disabled) {
    background: rgba(80, 200, 232, 0.18);
    border-color: rgba(80, 200, 232, 0.45);
  }
}
</style>

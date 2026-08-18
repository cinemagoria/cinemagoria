<template>
  <div class="spacing">
    <div :class="$style.panel">
    <div :class="$style.head">
      <select
        v-if="seasons.length > 1"
        :class="$style.select"
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
        :class="[$style.markSeasonBtn, { [$style.unmarkBtn]: isSeasonFullyWatched }]"
        :disabled="markingSeasonBusy"
        @click="markSeasonAsWatched">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline v-if="!isSeasonFullyWatched" points="20 6 9 17 4 12"/>
          <template v-else>
             <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </template>
        </svg>
        {{ markingSeasonBusy ? 'Saving...' : (isSeasonFullyWatched ? 'Unmark season' : 'Mark season as watched') }}
      </button>

      <button
        v-if="userEmail && numberOfSeasons > 1"
        :class="[$style.markSeriesBtn, { [$style.unmarkBtn]: isSeriesFullyWatched }]"
        :disabled="markingSeriesBusy"
        @click="markSeriesAsWatched">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline v-if="!isSeriesFullyWatched" points="20 6 9 17 4 12"/>
          <template v-else>
             <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </template>
        </svg>
        {{ markingSeriesBusy ? 'Saving...' : (isSeriesFullyWatched ? 'Unmark entire series' : 'Mark entire series') }}
      </button>
    </div>

    <div
      v-if="activeEpisodes && activeEpisodes.length"
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

    <div v-else-if="activeEpisodes" :class="$style.emptyState">
      <div :class="$style.emptyIcon">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/><path d="M12 14v3l2 1"/></svg>
      </div>
      <h3 :class="$style.emptyTitle">No Episodes Yet</h3>
      <p :class="$style.emptyText">Season {{ activeSeason }} has been confirmed, but its episode details haven't been released yet. They'll appear here as soon as the official schedule is announced.</p>
    </div>
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
    totalEpisodes: {
      type: Number,
      default: 0,
    },
    initialSeason: {
      type: Number,
      default: null,
    },
  },

  data () {
    const requested = Number(this.initialSeason);
    const isSelectable = Number.isFinite(requested) && requested >= 1 && requested <= this.numberOfSeasons;

    return {
      activeSeason: isSelectable ? requested : this.numberOfSeasons,
      activeEpisodes: null,
      userEmail: '',
      episodeProgressMap: {},
      markingSeasonBusy: false,
      markingSeriesBusy: false,
    };
  },

  computed: {
    isSeasonFullyWatched() {
      if (!this.activeEpisodes || this.activeEpisodes.length === 0) return false;
      return this.activeEpisodes.every(ep => this.episodeProgressMap[ep.id] >= 100);
    },

    isSeriesFullyWatched() {
      if (!this.totalEpisodes) return false;
      const watchedCount = Object.values(this.episodeProgressMap).filter(p => p >= 100).length;
      return watchedCount > 0 && watchedCount >= this.totalEpisodes;
    },

    episodeCount () {
      const n = this.activeEpisodes?.length || 0;
      if (n === 0) return 'No Episodes Yet';
      return `${n} ${n > 1 ? 'Episodes' : 'Episode'}`;
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

  watch: {
    initialSeason (value) {
      const requested = Number(value);
      if (!Number.isFinite(requested) || requested < 1 || requested > this.numberOfSeasons) return;
      if (requested === this.activeSeason) return;
      this.activeSeason = requested;
      this.getEpisodes();
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
        const tvId = this.$route.params.id;
        const resp = await fetch(`/api/progress/${encodeURIComponent(this.userEmail)}?tv_id=${encodeURIComponent(tvId)}`);
        if (resp.ok) {
          const rows = await resp.json();
          const map = {};
          for (const row of rows) {
            map[row.media_id] = row.progress_percentage || 0;
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
      const isUnmarking = this.isSeasonFullyWatched;
      const targetPct = isUnmarking ? 0 : 100;
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
          body: JSON.stringify({ episodes, percentage: targetPct }),
        });

        const updated = {};
        for (const ep of this.activeEpisodes) {
          updated[ep.id] = targetPct;
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

        const isUnmarking = this.isSeriesFullyWatched;
        const targetPct = isUnmarking ? 0 : 100;

        await fetch(`/api/progress/${encodeURIComponent(this.userEmail)}/batch`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ episodes: allEpisodes, percentage: targetPct }),
        });

        const updated = {};
        for (const ep of allEpisodes) {
          updated[ep.media_id] = targetPct;
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

.panel {
  position: relative;
  background: rgba(3, 4, 6, 0.55);
  background-image:
    radial-gradient(circle at 12% 10%, rgba(31, 84, 103, 0.16), transparent 32%),
    radial-gradient(circle at 88% 90%, rgba(139, 233, 253, 0.06), transparent 30%);
  border-radius: 20px;
  padding: 2rem 1.5rem;
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(31, 84, 103, 0.5),
    inset 0 0 20px rgba(139, 233, 253, 0.04);
  overflow: hidden;

  @media (min-width: $breakpoint-large) { padding: 2.5rem; }
}
.panel::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #8BE9FD, #1F5467, transparent);
  opacity: 0.8;
  pointer-events: none;
}

.head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 2rem;
}

.select {
  font-family: inherit;
  font-size: 1.3rem;
  color: #8BE9FD;
  background: rgba(139, 233, 253, 0.07);
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  margin-right: 0.4rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover, &:focus {
    border-color: rgba(139, 233, 253, 0.55);
    background: rgba(139, 233, 253, 0.12);
    outline: none;
  }

  option { background: #03242C; color: #fff; }
}

.count {
  font-size: 1.2rem;
  font-weight: 600;
  color: #8BE9FD;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  opacity: 0.85;
  margin-right: auto;

  @media (min-width: $breakpoint-large) {
    font-size: 1.3rem;
  }
}

.items {
  display: flex;
  flex-wrap: wrap;
  margin-right: -0.4rem;
  margin-left: -0.4rem;
}

.emptyState {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 2rem;
  margin: 0.4rem;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(139, 233, 253, 0.12);
  border-radius: 14px;
}

.emptyIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  color: #8BE9FD;
  background: rgba(139, 233, 253, 0.08);
  border: 1px solid rgba(139, 233, 253, 0.25);
  margin-bottom: 1.6rem;
}

.emptyTitle {
  font-family: var(--font-display);
  font-size: var(--section-title-size);
  font-weight: var(--section-title-weight);
  letter-spacing: var(--section-title-tracking);
  line-height: var(--section-title-leading);
  color: #fff;
  margin: 0 0 0.8rem;
  text-shadow: 0 0 18px rgba(139, 233, 253, 0.18);
}

.emptyText {
  max-width: 520px;
  font-size: 1.4rem;
  line-height: 1.6;
  color: $text-color;
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

.unmarkBtn {
  color: #EB5757;
  border-color: rgba(235, 87, 87, 0.25);
  background: rgba(235, 87, 87, 0.08);

  &:hover:not(:disabled) {
    background: rgba(235, 87, 87, 0.18) !important;
    border-color: rgba(235, 87, 87, 0.45) !important;
  }
}
</style>

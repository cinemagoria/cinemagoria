<template>
  <div class="spacing">
    <div :class="$style.panel">
      <div :class="$style.head">
        <h2 :class="$style.title">Videos</h2>
        <select
          v-if="videoTypes.length > 1"
          :class="$style.select"
          v-model="activeType"
          @change="filterVideos">
          <option value="all">
            All
          </option>
          <option
            v-for="type in videoTypes"
            :key="`video-type-${type}`"
            :value="type">
            {{ type }}
          </option>
        </select>

        <strong :class="$style.count">
          {{ videoCount }}
        </strong>
      </div>

      <div :class="$style.items">
        <VideosItem
          v-for="(video, index) in activeVideos"
          :key="`video-${video.id}`"
          :video="video"
          :index="index"
          @openModal="openModal" />
      </div>
    </div>

    <Modal
      v-if="modalVisible"
      :data="videos"
      type="iframe"
      nav
      :start-at="modalStartAt"
      @close="closeModal" />
  </div>
</template>

<script>
import { getYouTubeVideo } from '~/utils/api';
import VideosItem from '~/components/VideosItem';
import Modal from '~/components/Modal';

export default {
  components: {
    VideosItem,
    Modal,
  },

  props: {
    videos: {
      type: Array,
      required: true,
    },
  },

  data () {
    return {
      activeType: 'all',
      activeVideos: this.videos,
      modalVisible: false,
      modalStartAt: 0,
    };
  },

  computed: {
    videoCount () {
      return `${this.activeVideos.length} ${this.activeVideos.length > 1 ? 'Videos' : 'Video'}`;
    },

    videoTypes () {
      return this.videos.map(video => video.type).filter((video, index, self) => self.indexOf(video) === index);
    },
  },

  created () {
    this.handleData();
  },

  methods: {
    handleData () {
      const ids = this.videos.map(video => video.key).join(',');

      this.videos.forEach((video) => {
        video.thumb = `https://img.youtube.com/vi/${video.key}/mqdefault.jpg`;
        video.src = `https://www.youtube.com/embed/${video.key}?rel=0&showinfo=0&autoplay=1`;
        video.url = `https://youtube.com/watch?v=${video.key}`;
      });

      getYouTubeVideo(ids).then((response) => {
        if (!response || !response.items || !Array.isArray(response.items)) {
          console.warn('YouTube API response invalid or empty');
          return;
        }
        
        for (let index = 0; index < this.videos.length; index++) {
          if (response.items[index] && response.items[index].contentDetails) {
            this.videos[index].duration = response.items[index].contentDetails.duration;
          }
        }
      }).catch((error) => {
        console.error('YouTube API error:', error);
      });
    },

    filterVideos () {
      this.activeVideos = this.videos.filter(video => this.activeType === 'all' ? true : video.type === this.activeType);
    },

    openModal (index) {
      this.modalStartAt = index;
      this.modalVisible = true;
    },

    closeModal () {
      this.modalVisible = false;
      this.modalStartAt = 0;
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
    radial-gradient(circle at 12% 12%, rgba(31, 84, 103, 0.16), transparent 34%),
    radial-gradient(circle at 88% 88%, rgba(139, 233, 253, 0.06), transparent 32%);
  border-radius: 20px;
  padding: 2rem;
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
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.title {
  font-family: var(--font-display);
  font-size: var(--section-title-size);
  font-weight: var(--section-title-weight);
  letter-spacing: var(--section-title-tracking);
  line-height: var(--section-title-leading);
  color: #fff;
  text-shadow: 0 0 18px rgba(139, 233, 253, 0.18);
  margin-right: auto;
}

.select {
  font-family: inherit;
  font-size: 1.3rem;
  color: #8BE9FD;
  background: rgba(139, 233, 253, 0.07);
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
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

  @media (min-width: $breakpoint-large) { font-size: 1.3rem; }
}

.items {
  display: flex;
  flex-wrap: wrap;
  margin-right: -1rem;
  margin-left: -1rem;
}
</style>

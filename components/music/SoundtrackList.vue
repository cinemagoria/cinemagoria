<template>
  <div :class="$style.container">
     <div v-if="loading" :class="[$style.loader, $style.albumCard]">
       <Loader />
     </div>
     
     <div v-else-if="selectedAlbum" :class="$style.albumCard">
       <div :class="$style.albumHeader">
         <h2 :class="$style.albumTitle">Banda Sonora Original</h2>
         <div :class="$style.meta">
            <span v-if="selectedAlbum['artist-credit']">por {{ formatArtist(selectedAlbum['artist-credit']) }}</span>
         </div>
       </div>

       <ul :class="$style.tracklist">
         <li v-for="(track, i) in tracks" :key="track.id" :class="$style.trackItem" @click="openYouTube(track)">
           <div :class="$style.playIcon">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" stroke="none" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
           </div>
           <span :class="$style.trackNumber">{{ i + 1 }}</span>
           <div :class="$style.trackInfo">
             <span :class="$style.trackTitle">{{ track.title }}</span>
             <span :class="$style.trackArtist" v-if="track['artist-credit']">{{ formatArtist(track['artist-credit']) }}</span>
           </div>
           <span :class="$style.trackDuration">{{ formatDuration(track.length) }}</span>
         </li>
       </ul>

       <div v-if="items.length > 1" :class="$style.otherReleases">
         <h4>Otros Lanzamientos</h4>
         <ul class="nolist">
            <li v-for="item in otherItems" :key="item.id">
               <a :href="musicBrainzUrl(item.id)" target="_blank" rel="noopener">{{ item.title }} ({{ getYear(item) }})</a>
            </li>
         </ul>
       </div>
     </div>
     
     <div v-else>
       <p>No se encontraron pistas.</p>
     </div>
  </div>
</template>

<script>
import { getAlbumTracks, getMusicBrainzUrl } from '~/utils/musicbrainz';
import Loader from '~/components/Loader';

export default {
  components: { Loader },
  props: {
    items: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      loading: false,
      tracks: [],
      selectedAlbum: null,
    };
  },
  computed: {
    otherItems() {
       return this.items.filter(i => i.id !== this.selectedAlbum?.id);
    },
    releaseYear() {
        if (!this.selectedAlbum || !this.selectedAlbum['first-release-date']) return '';
        return this.selectedAlbum['first-release-date'].split('-')[0];
    }
  },
  watch: {
    items: {
      immediate: true,
      handler(newItems) {
        if (newItems && newItems.length) {
          const bestRelease = newItems.find(item => item['primary-type'] === 'Album') || newItems[0];
          this.fetchTracks(bestRelease);
        }
      }
    }
  },
  methods: {
    async fetchTracks(album) {
      this.loading = true;
      this.selectedAlbum = album;
      try {
        const tracks = await getAlbumTracks(album.id);
        this.tracks = tracks || [];
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    formatArtist(credits) {
      if (!credits) return '';
      return credits.map(c => c.name).join(', ');
    },
    formatDuration(ms) {
      if (!ms) return '';
      const minutes = Math.floor(ms / 60000);
      const seconds = ((ms % 60000) / 1000).toFixed(0);
      return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    },
    getYear(item) {
        return item['first-release-date'] ? item['first-release-date'].split('-')[0] : '';
    },
    musicBrainzUrl(id) {
        return getMusicBrainzUrl(id);
    },
    openYouTube(track) {
      const artist = this.formatArtist(track['artist-credit']);
      const query = `${track.title} ${artist} audio`;
      const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
      window.open(url, '_blank');
    }
  }
}
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;
@use "sass:color";

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem 4rem;
  top: 2rem;
  position: relative;
  
  @media (min-width: $breakpoint-large) {
     padding: 0 5rem 4rem;
  }
}

.loader {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    min-height: 400px;
}

.albumCard {
    background: rgba(0, 0, 0, 0.307);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 15px;
    overflow: hidden;
    transition: all 0.3s ease;
    padding: 2rem;
}

.albumHeader {
    margin-bottom: 2rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 1rem;
}

.albumTitle {
    margin-bottom: 1rem;
    font-size: 1.8rem;
    color: #fff;
    letter-spacing: $letter-spacing;
    font-weight: 600;
    @media (min-width: $breakpoint-large) { font-size: 2.4rem; }
}

.year {
    font-weight: 400;
    color: var(--text-color-light);
    font-size: 0.6em;
    vertical-align: middle;
}

.meta {
    font-size: 1.5rem;
    color: var(--text-color);
}

.tracklist {
    list-style: none;
    padding: 0;
}

.trackItem {
    display: flex;
    align-items: center;
    padding: 1rem 0.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.1s ease;
    border-radius: 6px;
    
    &:hover {
        background-color: rgba(255, 255, 255, 0.08);
        
        .playIcon {
            opacity: 1;
            transform: scale(1);
        }
        
        .trackTitle {
            color: color.adjust($cyan-color, $lightness: 10%);
        }
    }

    &:last-child {
        border-bottom: none;
    }
}

.playIcon {
    width: 24px;
    height: 24px;
    margin-right: 1rem;
    color: $cyan-color;
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.trackNumber {
    width: 30px;
    color: var(--text-color-light);
    font-size: 1.2rem;
    font-variant-numeric: tabular-nums;
    opacity: 0.7;
}

.trackInfo {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-right: 1rem;
}

.trackTitle {
    font-weight: 600;
    color: $cyan-color;
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
    transition: color 0.2s ease;
}

.trackArtist {
    font-size: 1.2rem;
    color: var(--text-color-light);
}

.trackDuration {
    color: var(--text-color-light);
    font-size: 1.2rem;
    font-variant-numeric: tabular-nums;
}

.otherReleases {
    margin-top: 3rem;
    border-top: 1px solid rgba(255,255,255,0.1);
    padding-top: 2rem;
    
    h4 {
        margin-bottom: 1rem;
        color: #fff;
        font-weight: 500;
        font-size: 1.6rem;
    }
    
    ul {
        padding-left: 0;
    }

    li {
        margin-bottom: 0.5rem;
        font-size: 1.4rem;
    }
    
    a {
        color: var(--primary-color);
        transition: color 0.2s ease;
        &:hover {
            color: #fff;
            text-decoration: underline;
        }
    }
}

@media (max-width: 768px) {
    .albumCard {
        padding: 1rem;
    }
    
    .trackItem {
        padding: 0.75rem 0.25rem;
    }
    
    .trackNumber {
        width: 20px;
        font-size: 1rem;
    }
    
    .trackTitle {
        font-size: 1.2rem;
    }

    .playIcon {
        display: none;
    }
}
</style>

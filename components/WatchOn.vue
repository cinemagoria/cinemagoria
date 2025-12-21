<template>
  <div class="watch-on-container">
    <h4 class="section-title">Watch On</h4>
    <div class="links-grid">
      
      <div v-if="imdbId" class="link-item">
        <a
          :href="'https://***.to/embed/' + type + '/' + imdbId"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Watch on StreamingSourceA"
        >
          <div class="link-icon ***-logo"></div>
          <span class="label-style">StreamingSourceA</span>
        </a>
      </div>

      <div v-if="imdbId" class="link-item">
        <a
          :href="***Link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Watch on ***"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 192 192"
            class="link-icon ***-icon" 
          >
            <path d="M100.242 23.743a6 6 0 0 0-8.485 0L23.743 91.757a6 6 0 0 0 0 8.485l68.014 68.015a6 6 0 0 0 8.485 0l68.015-68.015a6 6 0 0 0 0-8.485l-68.015-68.014ZM80 71.83c0-2.44 2.758-3.86 4.744-2.442l33.838 24.17a3 3 0 0 1 0 4.883l-33.838 24.171C82.758 124.03 80 122.611 80 120.17V71.83Z"/>
          </svg>
          <span class="label-style">***</span>
        </a>
      </div>

      <div v-if="***Url && type === 'movie'" class="link-item">
        <a
          :href="***Url"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit ***"
        >
          <div class="link-icon ***-logo"></div>
          <span class="label-style">***</span>
        </a>
      </div>

      <div 
        v-for="(provider, index) in providers" 
        :key="`prov-${index}`" 
        class="link-item tmdb-provider"
      >
        <a 
          :href="provider.link"
          target="_blank"
          rel="noopener noreferrer"
          class="provider-content"
          :title="`Watch on ${provider.name}`"
        >
          <img 
            v-if="provider.logo_path"
            :src="`https://image.tmdb.org/t/p/original${provider.logo_path}`" 
            :alt="provider.name"
            class="provider-icon"
          />
          <span class="label-style">{{ provider.name }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { get***MovieByImdb } from '~/utils/api';

export default {
  name: 'WatchOn',
  props: {
    providers: {
      type: Array,
      default: () => []
    },
    imdbId: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      ***Url: null,
    };
  },

  computed: {
    ***Link() {
      const contentType = this.type === "tv" ? "series" : "movie";
      return `***://detail/${contentType}/${this.imdbId}`;
    },
  },

  mounted() {
    if (this.imdbId && this.type === 'movie') {
      this.fetch***Url();
    }
  },

  watch: {
    imdbId(newVal) {
      if (newVal && this.type === 'movie') {
        this.fetch***Url();
      }
    }
  },

  methods: {
    async fetch***Url() {
      if (!this.imdbId) return;
      
      this.***Url = null;
      
      const result = await get***MovieByImdb(this.imdbId);
      if (result.found) {
        this.***Url = result.url;
      }
    }
  }
};
</script>

<style scoped>
.watch-on-container {
  margin: 16px 0;
  width: 100%;
  max-width: 580px; 
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.link-item {
  width: 100%;
}

.link-item a {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 10px 12px;
  background-color: rgba(255, 255, 255, 0.027);
  border-radius: 8px;
  color: #ffffff;
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.1s ease;
  box-sizing: border-box;
  height: auto;
  min-height: 44px;
}

.link-item a:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateX(4px);
  color: #8AE8FC;
}

.link-icon, .provider-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin-right: 10px;
  border-radius: 4px;
  object-fit: cover;
}

.label-style {
  font-size: 14px;
  padding-left: 0.5rem;
  white-space: normal;
  line-height: 1.2;
  word-break: break-word;
}

.link-item a:hover .***-logo {
  transform: scale(1.1);
}

.***-logo {
  width: 23px !important;
  height: 23px !important;
  background-color: #F9CC71;
  -webkit-mask: url('/***.png') no-repeat center / contain;
  mask: url('/***.png') no-repeat center / contain;
  transition: background-color 0.3s ease;
}

.link-item a:hover .***-logo {
  background-color: #8AE8FC;
}

@media (max-width: 600px) {
  .links-grid {
    grid-template-columns: 1fr;
  }
  
  .label-style {
    font-size: 13px;
  }
}

.link-item.tmdb-provider .provider-content {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 10px 12px;
  background-color: rgba(255, 255, 255, 0.027);
  border-radius: 8px;
  color: #ffffff;
  box-sizing: border-box;
  height: auto;
  min-height: 44px;
  cursor: default;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.link-item.tmdb-provider .provider-content:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.05);
}

.***-logo {
  width: 23px !important;
  height: 23px !important;
  background-color: white;
  background: #69C145;
  -webkit-mask: url('/***-logo.svg') no-repeat center / contain;
  mask: url('/***-logo.svg') no-repeat center / contain;
  transition: background-color 0.3s ease;
}

.link-item a:hover .***-logo {
  background-color: #8AE8FC;
}

.***-icon {
  width: 28px !important;
  height: 28px !important;
  fill: #7B5BF5;
  transition: fill 0.3s ease;
}

.link-item a:hover .***-icon {
  fill: #8AE8FC;
  background-color: transparent !important;
  transform: none;
}
</style>
<template>
  <div class="external-links-container">
    <h4 class="section-title">Enlaces externos</h4>
    <div class="links-grid">

      <div v-if="links.imdb_id" class="link-item">
        <a
          :href="`https://www.imdb.com/${imdb}/${links.imdb_id}`"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit IMDb"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#f5c518" class="link-icon" viewBox="0 0 24 24"><path d="M14.31 9.588v.005c-.077-.048-.227-.07-.42-.07v4.815c.27 0 .44-.06.5-.165.062-.104.095-.405.095-.885v-2.866c0-.33-.004-.54-.033-.63a.3.3 0 0 0-.14-.204z"/><path d="M22.416 0H1.62C.742.06.06.744 0 1.596V22.38c.06.874.712 1.542 1.555 1.617q.022.004.045.003h20.845A1.727 1.727 0 0 0 24 22.29V1.71C24 .82 23.305.07 22.416 0M4.792 15.626H2.887V8.26h1.905zm6.54-.002H9.67v-4.97L9 15.623H7.812l-.698-4.86-.007 4.86H5.44V8.26h2.468q.125.785.23 1.574l.27 1.87.442-3.444h2.483zm4.977-2.18c0 .655-.044 1.094-.104 1.32-.062.22-.17.4-.326.52q-.225.195-.57.266c-.223.045-.57.075-1.02.075l-.004-.002H11.98V8.26h1.426c.914 0 1.45.047 1.77.128.325.09.575.225.745.42.165.18.273.404.313.645.05.235.076.705.076 1.402v2.588zm4.944.475c0 .45-.045.764-.09.99-.06.224-.195.404-.405.568-.226.166-.48.24-.78.24-.22 0-.5-.06-.68-.136a1.6 1.6 0 0 1-.515-.427l-.116.47H16.95V8.26l-.02-.003h1.8v2.4c.15-.175.315-.31.51-.4.196-.083.466-.127.69-.127.226-.003.45.036.66.115.17.07.32.185.436.33.09.125.15.27.18.42q.045.209.044.87v2.054z"/><path d="M19.08 11.205q-.18 0-.225.12c-.03.08-.06.29-.06.624v1.946c0 .324.03.533.06.623.04.086.13.14.226.134.12 0 .272-.047.3-.14q.046-.144.046-.674l.03-.002v-1.89c0-.303-.015-.508-.06-.603-.044-.1-.195-.14-.315-.14z"/></svg>
          <span class="label-style">IMDb</span>
        </a>
      </div>

      <div
        v-if="links.imdb_id && currentPageType === 'movie'"
        class="link-item"
      >
        <a
          :href="`https://letterboxd.com/imdb/${links.imdb_id}`"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Letterboxd"
        >
          <img 
            :src="lbIcon" 
            alt="Letterboxd" 
            class="link-icon lb-icon"
          />
          <span class="label-style">Letterboxd</span>
        </a>
      </div>

      <div v-if="tomatoMeter.found && (currentPageType === 'movie' || currentPageType === 'tv')" class="link-item">
        <a
          :href="tomatoMeter.url"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Rotten Tomatoes"
        >
          <img 
            :src="rtIcon" 
            alt="Rotten Tomatoes" 
            class="link-icon rt-icon"
          />
          <span class="label-style">{{ tomatoMeter.score }}% Tomatometer</span>
        </a>
      </div>
      
      <div v-if="links.imdb_id" class="link-item">
        <a
          :href="`https://trakt.tv/search/imdb?query=${links.imdb_id}`"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Trakt"
        >
          <img 
            :src="traktIcon" 
            alt="Trakt" 
            class="link-icon trakt-icon"
          />
          <span class="label-style">Trakt</span>
        </a>
      </div>

      <div v-if="links.twitter_id" class="link-item">
        <a
          :href="`https://twitter.com/${links.twitter_id}`"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Twitter"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#1da1f2" class="link-icon" viewBox="0 0 24 24"><path d="M24 4.557a9.8 9.8 0 0 1-2.828.775 4.93 4.93 0 0 0 2.165-2.724 9.9 9.9 0 0 1-3.127 1.195 4.92 4.92 0 0 0-3.594-1.555c-3.179 0-5.515 2.966-4.797 6.045A13.98 13.98 0 0 1 1.671 3.149a4.93 4.93 0 0 0 1.523 6.574 4.9 4.9 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.9 4.9 0 0 1-2.224.084 4.93 4.93 0 0 0 4.6 3.419A9.9 9.9 0 0 1 0 19.54a13.94 13.94 0 0 0 7.548 2.212c9.142 0 14.307-7.721 13.995-14.646A10 10 0 0 0 24 4.557"/></svg>
          <span class="label-style">Twitter</span>
        </a>
      </div>
      <div v-if="links.instagram_id" class="link-item">
        <a
          :href="`https://instagram.com/${links.instagram_id}`"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Instagram"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#e1306c" class="link-icon" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849s-.012 3.584-.069 4.849c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849s.013-3.583.07-4.849c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0m0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881"/></svg>
          <span class="label-style">Instagram</span>
        </a>
      </div>
      <div v-if="links.homepage" class="link-item">
        <a
          :href="links.homepage"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Official Website"
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="link-icon" viewBox="0 0 24 24"><path d="M6.188 8.719a6.5 6.5 0 0 1 1.444-1.087c2.887-1.591 6.589-.745 8.445 2.069l-2.246 2.245a3.385 3.385 0 0 0-3.834-1.949 3.33 3.33 0 0 0-1.633.898L4.06 15.201a3.355 3.355 0 0 0 0 4.74 3.355 3.355 0 0 0 4.74 0l1.327-1.327a8.5 8.5 0 0 0 3.779.575l-2.929 2.929a6.43 6.43 0 1 1-9.093-9.093zm6.836-6.836-2.929 2.929a8.5 8.5 0 0 1 3.779.574L15.2 4.06a3.355 3.355 0 0 1 4.74 0 3.355 3.355 0 0 1 0 4.74l-4.305 4.305a3.36 3.36 0 0 1-4.74 0 3.6 3.6 0 0 1-.727-1.051l-2.246 2.245c.236.358.481.667.796.982a6.4 6.4 0 0 0 3.036 1.704 6.44 6.44 0 0 0 4.613-.617 6.5 6.5 0 0 0 1.444-1.087l4.304-4.305a6.429 6.429 0 1 0-9.091-9.093"/></svg>
          <span class="label-style">Official Website</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { getMDBListRatings } from '~/utils/api';
const rtIcon = '/rotten-tomatoes.svg';
const lbIcon = '/letterboxd-mac-icon.png';
const traktIcon = '/trakt-logo-small.svg';

export default {
  props: {
    media: {
      type: String,
      required: false,
      default: "",
    },
    links: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      rtIcon,
      lbIcon,
      traktIcon,
      tomatoMeter: {
        found: false,
        score: null,
        url: ''
      }
    };
  },

  computed: {
    currentPageType() {
      const currentPath = this.$route ? this.$route.path : '';
      if (currentPath.includes("/movie/")) {
        return "movie";
      } else if (currentPath.includes("/tv/")) {
        return "tv";
      }
      return "";
    },
    imdb() {
      return this.media === "person" ? "name" : "title";
    },
  },

  mounted() {
    if (this.links.imdb_id && (this.currentPageType === 'movie' || this.currentPageType === 'tv')) {
      this.fetchTomatoMeter();
    }
  },

  methods: {
    async fetchTomatoMeter() {
      try {
        const result = await getMDBListRatings(this.links.imdb_id, this.currentPageType);
        if (result.found) {
          this.tomatoMeter = result;
        }
      } catch (error) {
        console.error(error);
      }
    }
  },

  watch: {
    'links.imdb_id': function(newVal) {
      if (newVal && (this.currentPageType === 'movie' || this.currentPageType === 'tv')) {
        this.fetchTomatoMeter();
      }
    }
  }
};
</script>

<style scoped>
.external-links-container {
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
  height: 100%;
}

.link-item a:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateX(4px);
  color: #8AE8FC;
}

.link-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.link-item a:hover .link-icon {
  transform: scale(1.1);
}

.label-style {
  font-size: 14px;
  padding-left: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 480px) {
  .links-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .label-style {
    font-size: 12px;
  }
}

.rt-icon, .lb-icon {
  width: 22px !important;
  height: 22px !important;
  transition: filter 0.3s ease, transform 0.3s ease;
  margin-right: 6px;
  object-fit: contain;
}

.link-item a:hover .rt-icon,
.link-item a:hover .lb-icon {
  filter: brightness(0) saturate(100%) invert(88%) sepia(21%) saturate(935%) hue-rotate(176deg) brightness(101%) contrast(101%);
  transform: scale(1.1);
}

.trakt-icon {
  width: 22px !important;
  height: 22px !important;
  transition: filter 0.3s ease, transform 0.3s ease;
  margin-right: 6px;
  object-fit: contain;
}

.link-item a:hover .trakt-icon {
  filter: brightness(0) saturate(100%) invert(88%) sepia(21%) saturate(935%) hue-rotate(176deg) brightness(101%) contrast(101%);
  transform: scale(1.1);
}
</style>
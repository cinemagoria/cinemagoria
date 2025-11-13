<template>
  <div class="listing">
    <div
      v-if="title"
      class="listing__head">
      <h2
        v-if="title"
        class="listing__title">
        {{ title }}
      </h2>
    </div>

    <div v-if="items.results && items.results.length === 0 && !loading" class="no-results">
      <h2 class="no-results__title">No results found for "{{ searchQuery }}"</h2>
      
      <div v-if="typoCheckInProgress" class="typo-checking">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 44 44" stroke="#2196f3">
          <g fill="none" fill-rule="evenodd" stroke-width="2">
            <circle cx="22" cy="22" r="1">
              <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/>
              <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/>
            </circle>
            <circle cx="22" cy="22" r="1">
              <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/>
              <animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/>
            </circle>
          </g>
        </svg>
        <p>Checking for typos...</p>
      </div>
      
      <div v-if="suggestedCorrection" class="suggestion">
        <p>Did you mean: <a href="#" @click.prevent="useCorrection">{{ suggestedCorrection }}</a>?</p>
        <p class="discover-more">Or <span class="highlight"><a href="#" @click.prevent="openAiChat" class="discovery-link">Ask AI</a></span> about movies, series, actors and more.</p>
      </div>
    </div>

    <div class="listing__items">
      <Card
        v-for="item in items.results"
        :key="`card-${item.id}`"
        :item="item" />
    </div>

    <div
      v-if="items.page < items.total_pages"
      class="listing__nav">
      <div v-if="loading">
        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" stroke="#2196f3"><g fill="none" fill-rule="evenodd" stroke-width="2"><circle cx="22" cy="22" r="1"><animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/><animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/></circle><circle cx="22" cy="22" r="1"><animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/><animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/></circle></g></svg>
      </div>
    </div>
    <ChatbotModal ref="chatbotModalRef" />
  </div>
</template>

<script>
import { debounce } from '~/mixins/Functions';
import Card from '~/components/Card';
import ChatbotModal from '../../components/global/ChatbotModal.vue';
import axios from 'axios';

export default {
  components: {
    Card,
    ChatbotModal
  },

  props: {
    title: {
      type: String,
      required: false,
      default: '',
    },

    items: {
      type: Object,
      required: true,
    },

    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    
    searchQuery: {
      type: String,
      required: false,
      default: '',
    }
  },

  data() {
    return {
      typoCheckInProgress: false,
      suggestedCorrection: null
    };
  },

  watch: {
    searchQuery: {
      handler(newQuery, oldQuery) {
        if (newQuery && newQuery !== oldQuery && 
            this.items.results && this.items.results.length === 0 && !this.loading) {
          this.checkForTypos();
        }
      },
      immediate: true
    },
    'items.results': {
      handler(newResults) {
        if (newResults && newResults.length === 0 && !this.loading && this.searchQuery) {
          this.checkForTypos();
        } else {
          this.suggestedCorrection = null;
        }
      }
    }
  },

  mounted() {
    window.addEventListener('scroll', this.getScrollPosition);
    
    if (this.items.results && this.items.results.length === 0 && !this.loading && this.searchQuery) {
      this.checkForTypos();
    }
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.getScrollPosition);
  },

  methods: {
    getScrollPosition: debounce(function() {
      if (this.items.page < this.items.total_pages) {
        const bottomOfWindow = (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 600;
        if (bottomOfWindow && !this.loading) this.loadMore();
      } else {
        window.removeEventListener('scroll', this.getScrollPosition);
      }
    }, 50),

    openAiChat() {
      if (this.$refs.chatbotModalRef) {
        const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('access_token');
        
        if (isAuthenticated) {
          this.$refs.chatbotModalRef.open();
        } else {
          this.$refs.chatbotModalRef.chatBotOpen = true;
          this.$refs.chatbotModalRef.chatBotMinimized = false;
          this.$refs.chatbotModalRef.clearMinimizedState();
          this.$refs.chatbotModalRef.checkMobileDevice();
        }
      } else {
        console.error('ChatbotModal ref not found!');
      }
    },

    loadMore() {
      this.$emit('loadMore');
    },
    
    async checkForTypos() {
      if (!this.searchQuery || this.searchQuery.trim().length < 2) return;
      
      try {
        this.typoCheckInProgress = true;
        this.suggestedCorrection = null;

        const response = await axios.post('https://entercinema-assistant-rust.vercel.app/api/typo', {
          query: this.searchQuery
        });
        
        if (response.data && response.data.success && response.data.correction) {
          this.suggestedCorrection = response.data.correction;
        }
      } catch (error) {
        console.error('Error al verificar errores tipográficos:', error);
      } finally {
        this.typoCheckInProgress = false;
      }
    },
    
    useCorrection() {
      if (this.suggestedCorrection) {
        this.$router.push({
          path: '/search',
          query: { q: this.suggestedCorrection }
        });
        
        this.$root.$emit('update-search-query', this.suggestedCorrection);
      }
    }
  },
};
</script>

<style scoped>
.no-results {
  text-align: center;
  padding: 3rem 1rem;
  color: #fff;
  margin: 2rem auto;
  max-width: 600px;
}

.no-results__title {
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 600;
}

.typo-checking {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1.5rem 0;
}

.typo-checking p {
  margin-top: 0.5rem;
  opacity: 0.7;
  font-size: 1rem;
}

.suggestion {
  margin: 1.5rem 0;
  padding: 1rem;
  border-radius: 8px;
  background: rgba(33, 150, 243, 0.15);
  font-size: 1.5rem;
}

.suggestion a {
  color: #7FDBF1;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}

.suggestion a:hover {
  color: #7FDBF1;
}

.discover-more {
  margin-top: 10px;
  font-size: 14px;
  color: #e0e0e0;
}

.highlight {
  color: #7FDBF1;
  font-weight: 500;
}

.discovery-link {
  color: #7FDBF1;
  text-decoration: none;
  transition: all 0.2s ease;
  border-bottom: 1px dotted rgba(127, 219, 241, 0.4);
}

.discovery-link:hover {
  color: #fff;
  border-bottom-color: #fff;
}
</style>

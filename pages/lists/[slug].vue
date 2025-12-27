<template>
  <div class="list-page">
    <div class="list-header">
      <div v-if="loading" class="loader-container">
         <Loader :size="60" />
      </div>
      <div v-else class="header-content">
          <h1 class="list-title">{{ list.name }}</h1>
          <p class="list-description" v-if="list.description">{{ list.description }}</p>
          <div class="list-meta">
              <span class="author">by You</span>
              <span class="dot">·</span>
              <span class="count">{{ items.length }} items</span>
              <span class="dot">·</span>
              <span class="privacy" v-if="list.is_public">Public</span>
              <span class="privacy" v-else>Private</span>
          </div>
          
          <button v-if="list.is_public" @click="copyShareLink" class="share-btn">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
             Share List
          </button>
      </div>
    </div>

    <!-- Filters / Tabs Section -->
    <div class="list-controls" v-if="!loading && items.length > 0">
        <div class="type-toggles">
          <button 
            :class="['toggle-btn', { active: filterType === 'movie' }]" 
            @click="filterType = 'movie'">
            Movies ({{ movieCount }})
          </button>
          <button 
            :class="['toggle-btn', { active: filterType === 'tv' }]" 
            @click="filterType = 'tv'">
            TV Shows ({{ tvCount }})
          </button>
        </div>
    </div>

    <div class="list-content">
        <div v-if="loading" class="grid-loader">
             <Loader :size="40" />
        </div>
        
        <div v-else-if="itemsToShow.length > 0" class="items-grid">
            <div v-for="item in itemsToShow" :key="item.item_id" class="grid-item">
                 <Card :item="formatItemForCard(item)" context="list" :list="list" />
            </div>
        </div>

        <div v-else class="empty-state">
            <template v-if="items.length > 0">
                <h3>No {{ filterType === 'movie' ? 'movies' : 'TV shows' }} found</h3>
                <p>Try switching tabs or adding some!</p>
            </template>
            <template v-else>
                <h3>This list is empty</h3>
                <p>Go explore and add some movies or TV shows!</p>
                <nuxt-link to="/" class="explore-btn">Explore Content</nuxt-link>
            </template>
        </div>
    </div>
  </div>
</template>

<script>
import Loader from '~/components/Loader.vue';
import Card from '~/components/Card.vue';

export default {
    components: {
        Loader,
        Card
    },
    
    data() {
        return {
            loading: true,
            list: {},
            items: [],
            filterType: 'movie' // 'movie' or 'tv'
        };
    },
    
    computed: {
        tursoBackendUrl() {
          return this.$config.public.tursoBackendUrl;
        },
        movieCount() {
            return this.items.filter(i => i.item_type === 'movie').length;
        },
        tvCount() {
            return this.items.filter(i => i.item_type === 'tv').length;
        },
        itemsToShow() {
            // Basic filtering for now, can be extended with sort/genre
            return this.items.filter(item => item.item_type === this.filterType);
        }
    },

    async mounted() {
        await this.fetchListDetails();
        this.$bus.$on('remove-item-from-list', this.handleRemoveItem);
        this.$bus.$on('lists-updated', this.fetchListDetails);
    },
    
    beforeDestroy() {
        this.$bus.$off('remove-item-from-list', this.handleRemoveItem);
        this.$bus.$off('lists-updated', this.fetchListDetails);
    },

    methods: {
        async fetchListDetails() {
            try {
                const slug = this.$route.params.slug;
                const response = await fetch(`${this.tursoBackendUrl}/lists/${slug}`);
                
                if (response.ok) {
                    const data = await response.json();
                    this.list = data.list;
                    this.items = data.items;
                    // Auto-select tab with content if current is empty
                    if (this.filterType === 'movie' && this.movieCount === 0 && this.tvCount > 0) {
                        this.filterType = 'tv';
                    }
                } else {
                    this.$nuxt.error({ statusCode: 404, message: 'List not found' });
                }
            } catch (e) {
                console.error(e);
            } finally {
                this.loading = false;
            }
        },
        
        async handleRemoveItem({ list, item }) {
            // Remove locally for instant feedback
            if (list.id === this.list.id) {
                this.items = this.items.filter(i => i.item_id !== item.id);
            }
            await this.fetchListDetails();
        },

        formatItemForCard(backendItem) {
            return {
                id: backendItem.item_id,
                media_type: backendItem.item_type,
                name: backendItem.name,
                title: backendItem.name,
                poster_path: backendItem.poster_url,
                vote_average: backendItem.tmdb_rating,
                imdb_rating: backendItem.imdb_rating,
                rating_source: backendItem.imdb_rating ? 'imdb' : 'tmdb',
                // Add any other props Card needs
                first_air_date: backendItem.year_start ? `${backendItem.year_start}-01-01` : null,
                release_date: backendItem.year_start ? `${backendItem.year_start}-01-01` : null
            };
        },

        async copyShareLink() {
            const url = window.location.href;
            try {
                await navigator.clipboard.writeText(url);
                alert('Link copied to clipboard!');
            } catch(e) { console.error(e); }
        }
    }
}
</script>

<style lang="scss" scoped>
@use '~/assets/css/utilities/variables' as *;

.list-page {
    padding-top: 100px;
    min-height: 100vh;
    padding-bottom: 4rem;
    padding-left: 2rem;
    padding-right: 2rem;
    max-width: 1400px;
    margin: 0 auto;
}

.list-header {
    text-align: center;
    margin-bottom: 3rem;
    
    .list-title {
        font-size: 3.5rem;
        color: #fff;
        margin-bottom: 1rem;
    }
    
    .list-description {
        font-size: 1.6rem;
        color: #ddd;
        max-width: 700px;
        margin: 0 auto 1.5rem;
        line-height: 1.5;
    }
    
    .list-meta {
        display: flex;
        justify-content: center;
        gap: 1rem;
        color: #8F989E;
        font-size: 1.4rem;
        align-items: center;
        margin-bottom: 2rem;
        
        .dot { font-weight: bold; }
        .author { color: #8BE9FD; font-weight: 500; }
    }
    
    .share-btn {
        background: rgba(139, 233, 253, 0.1);
        border: 1px solid #8BE9FD;
        color: #8BE9FD;
        padding: 0.8rem 1.5rem;
        border-radius: 30px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 1.4rem;
        transition: all 0.2s;
        &:hover { background: rgba(139, 233, 253, 0.2); }
    }
}

.list-controls {
    display: flex;
    justify-content: center;
    margin-bottom: 3rem;
}

.type-toggles {
    display: flex;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 30px;
    padding: 4px;
    
    .toggle-btn {
        background: transparent;
        border: none;
        color: #ccc;
        padding: 0.8rem 2rem;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 500;
        font-size: 1.4rem;
        transition: all 0.2s;
        
        &.active {
            background: #8BE9FD;
            color: #000;
        }
        
        &:hover:not(.active) {
            color: #fff;
        }
    }
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
}

.empty-state {
    text-align: center;
    padding: 6rem 0;
    
    h3 {
        font-size: 2.4rem;
        color: #fff;
        margin-bottom: 1rem;
    }
    
    p {
        font-size: 1.6rem;
        color: #8F989E;
        margin-bottom: 2rem;
    }
    
    .explore-btn {
        display: inline-block;
        background: #8BE9FD;
        color: #000;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-weight: 600;
        text-decoration: none;
        &:hover { background: #7bd3e5; }
    }
}
</style>

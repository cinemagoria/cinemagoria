<template>
  <main class="main">
    <div class="tab-controls">
      <button class="tab-btn active">
        <span class="title-primary" style="font-size:16px;">Películas</span>
      </button>
      <button class="tab-btn" @click="navigateToTvShows">
        <span class="title-primary" style="font-size:16px;">Series de TV</span>
      </button>
    </div>

    <Hero
      :item="featured" />
      <br>
    <CustomListingCategoriesMovies
      :title="'Explorar por Categorías'"
      :view-all-url="null"/>
    <ListingCarousel
      v-if="popular && popular.results.length"
      :title="popularTitle"
      :view-all-url="popularUrl"
      :items="popular" />
     
    <ListingCarousel
      v-if="topRated && topRated.results.length"
      :title="topRatedTitle"
      :view-all-url="topRatedUrl"
      :items="topRated" />
     
    <ListingCarousel
      v-if="upcoming && upcoming.results.length"
      :title="upcomingTitle"
      :view-all-url="upcomingUrl"
      :items="upcoming" />
     
    <ListingCarousel
      v-if="nowPlaying && nowPlaying.results.length"
      :title="nowPlayingTitle"
      :view-all-url="nowPlayingUrl"
      :items="nowPlaying" />
  </main>
</template>

<script>
import { getMovies, getMovie, getListItem } from '~/api';
import Hero from '~/components/Hero';
import ListingCarousel from '~/components/ListingCarousel';
import CustomListingCategoriesMovies from '~/components/CustomListingCategoriesMovies';

export default {
  components: {
    Hero,
    ListingCarousel,
    CustomListingCategoriesMovies,
  },

  head () {
    return {
      title: 'Movies',
      meta: [
        { hid: 'og:title', property: 'og:title', content: 'Movies' },
        { hid: 'og:url', property: 'og:url', content: `${process.env.FRONTEND_URL}${this.$route.path}` },
      ],
    };
  },

  methods: {
    navigateToTvShows() {
      this.$router.push({ name: 'tv' });
    }
  },

  computed: {
    popularTitle () {
      return getListItem('movie', 'popular').title;
    },

    popularUrl () {
      return { name: 'movie-category-name', params: { name: 'popular' } };
    },

    topRatedTitle () {
      return getListItem('movie', 'top_rated').title;
    },

    topRatedUrl () {
      return { name: 'movie-category-name', params: { name: 'top_rated' } };
    },

    upcomingTitle () {
      return getListItem('movie', 'upcoming').title;
    },

    upcomingUrl () {
      return { name: 'movie-category-name', params: { name: 'upcoming' } };
    },

    nowPlayingTitle () {
      return getListItem('movie', 'now_playing').title;
    },

    nowPlayingUrl () {
      return { name: 'movie-category-name', params: { name: 'now_playing' } };
    },
  },

  async asyncData ({ error }) {
    try {
      const popular = await getMovies('popular');
      const topRated = await getMovies('top_rated');
      const upcoming = await getMovies('upcoming');
      const nowPlaying = await getMovies('now_playing');
      const featured = await getMovie(upcoming.results[0].id);

      return { popular, topRated, upcoming, nowPlaying, featured };
    } catch {
      error({ statusCode: 504, message: 'Data not available' });
    }
  },
};
</script>
<style scoped>
.tab-controls {
  display: flex;
  background-color: #000;
  width: 100%;
  margin: 0;
  padding: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-btn {
  flex: 1;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.6rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 10px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tab-btn span {
  position: relative;
  display: inline-block;
}

.tab-btn.active {
  color: #8BE9FD;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #8BE9FD;
}

.tab-btn:hover:not(.active) {
  color: rgba(139, 233, 253, 0.8);
}

@media (max-width: 768px) {
  .tab-btn {
    font-size: 1.4rem;
    padding: 8px 0;
  }
}
</style>
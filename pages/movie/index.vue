<template>
  <main class="main">
    <UserNav @show-rated-modal="showRatedItems" />
    
    <div class="header-container">
      <h1 class="title-primary" style="text-align: center; margin-bottom: 0.5rem;">Movies</h1>
      <p class="title-secondary" style="text-align: center; margin-bottom: 2rem;">
        Discover the latest blockbusters, classics, and everything in between.
      </p>

      <div class="switcher-container">
        <label class="switch">
          <input type="checkbox" :checked="false" @change="navigateToTvShows">
          <span class="slider"></span>
          <span class="label-text">Movies</span>
          <span class="label-text">TV Shows</span>
        </label>
      </div>
    </div>
    <br>

    <CustomListingCategoriesMovies
      :title="'Browse By Category'"
      :view-all-url="null"/>

    <div v-if="followedMovies && followedMovies.results && followedMovies.results.length > 0" class="followed-section">
      <ListingCarousel
        :title="'From the Production companies you follow'"
        :items="followedMovies"
        :view-all-url="{ name: 'movie-followed' }" />
    </div>

    <ListingCarousel
      v-if="nowPlaying && nowPlaying.results.length"
      :title="nowPlayingTitle"
      :view-all-url="nowPlayingUrl"
      :items="nowPlaying" />

    <ListingCarousel
      v-if="upcoming && upcoming.results.length"
      :title="upcomingTitle"
      :view-all-url="upcomingUrl"
      :items="upcoming" />

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
  </main>
</template>

<script>
import UserNav from '@/components/global/UserNav';
import { getMovies, getListItem, getFollowedProductionCompanies, getMoviesByCompanies } from '~/api';
import ListingCarousel from '~/components/ListingCarousel';
import CustomListingCategoriesMovies from '~/components/CustomListingCategoriesMovies';

export default {
  components: {
    UserNav,
    ListingCarousel,
    CustomListingCategoriesMovies,
  },

  head () {
    return {
      title: 'EnterCinema - Movies',
      meta: [
        { hid: 'og:title', property: 'og:title', content: 'Movies' },
        { hid: 'og:url', property: 'og:url', content: `${process.env.FRONTEND_URL}${this.$route.path}` },
      ],
    };
  },

  data() {
    return {
      followedMovies: null,
    };
  },

  methods: {
    navigateToTvShows() {
      this.$router.push({ name: 'tv' });
    },
    showRatedItems() {
      this.ratedItemsModalVisible = true;
    },
    async fetchFollowedContent() {
      if (typeof window === 'undefined') return;
      
      const userEmail = localStorage.getItem('email');
      if (!userEmail) return;

      try {
        const followedCompanies = await getFollowedProductionCompanies(userEmail);
        if (followedCompanies && followedCompanies.length > 0) {
          const companyIds = followedCompanies.map(c => c.company_id).join('|');
          this.followedMovies = await getMoviesByCompanies(companyIds);
        }
      } catch (error) {
        console.error('Error fetching followed movies:', error);
      }
    }
  },

  mounted() {
    this.fetchFollowedContent();
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

      return { popular, topRated, upcoming, nowPlaying };
    } catch {
      error({ statusCode: 504, message: 'Data not available' });
    }
  },
};
</script>

<style scoped lang="scss">
.header-container {
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title-secondary {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 5px;
  line-height: 1.5;
  max-width: 600px;
}

.switcher-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.switch {
  position: relative;
  display: inline-flex;
  width: 240px;
  height: 44px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 22px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  user-select: none;
  padding: 4px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: #8BE9FD;
  border-radius: 18px;
  transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  border: none;
}

.switch input:checked ~ .slider {
  transform: translateX(100%);
}

.label-text {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  color: #80868b;
  font-size: 1.4rem;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
}

.switch input:not(:checked) ~ .label-text:nth-of-type(2) {
  color: #000;
}

.switch input:checked ~ .label-text:nth-of-type(3) {
  color: #000;
}
</style>
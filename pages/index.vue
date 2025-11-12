<template>
  <main class="main">
    <UserNav @show-rated-modal="showRatedItems" />
    <FeatureDescription />

    <Hero
      :item="featured" />

    <ListingCarousel
      v-if="trendingMovies && trendingMovies.results.length"
      :title="trendingMoviesTitle"
      :view-all-url="trendingMoviesUrl"
      :items="trendingMovies" />

    <ListingCarousel
      v-if="trendingTv && trendingTv.results.length"
      :title="trendingTvTitle"
      :view-all-url="trendingTvUrl"
      :items="trendingTv" />
  </main>
</template>

<script>
import UserNav from '@/components/global/UserNav';
import { getTrending, getMovie, getTvShow, getListItem } from '~/api';
import Hero from '~/components/Hero';
import ListingCarousel from '~/components/ListingCarousel';
import FeatureDescription from '~/components/FeatureDescription';
import supabase from '@/services/supabase';

async function getUserAvatar(userEmail) {
  try {
    const { data, error } = await supabase
      .from('user_data')
      .select('avatar')
      .eq('email', userEmail);
      
    if (error) {
      throw new Error('Error fetching user avatar:', error.message);
    }

    const userAvatar = data[0]?.avatar || '/avatars/avatar-ss0.png';
    return userAvatar;
    
  } catch (error) {
    console.error('Error fetching user avatar:', error);
    return '/avatars/avatar-ss0.png';
  }
}

async function getUserName(userEmail) {
  try {
    const { data, error } = await supabase
      .from('user_data')
      .select('first_name')
      .eq('email', userEmail);
      
    if (error) {
      throw new Error('Error fetching user first name:', error.message);
    }

    const userName = data[0]?.first_name|| 'undefined';
    return userName;
    
  } catch (error) {
    console.error('Error fetching user first_name:', error);
  }
}

export default {
  components: {
    UserNav,
  },
  data() {
    return {
      userEmail: '',
      accessToken: '',
      isLoggedIn: false,
      userName: '',
      isMenuOpen: false,
    }
  },

  async mounted() {
    const email = localStorage.getItem('email');
    const accessToken = localStorage.getItem('access_token');
    this.userEmail = email || '';
    this.hasAccessToken = accessToken !== null;
    this.isLoggedIn = accessToken !== null;
    this.userName = await getUserName(this.userEmail);

    if (this.isLoggedIn) {
      this.userName = await getUserName(this.userEmail);
    }
  },

  components: {
    FeatureDescription,
    Hero,
    ListingCarousel,
  },

  methods: {
    showRatedItems() {
      this.ratedItemsModalVisible = true;
    },
  },
  
  computed: {
    trendingMoviesTitle () {
      return getListItem('movie', 'trending').title;
    },

    trendingMoviesUrl () {
      return { name: 'movie-category-name', params: { name: 'trending' } };
    },

    trendingTvTitle () {
      return getListItem('tv', 'trending').title;
    },

    trendingTvUrl () {
      return { name: 'tv-category-name', params: { name: 'trending' } };
    },
  },

  async asyncData ({ error }) {
    try {
      const trendingMovies = await getTrending('movie');
      const trendingTv = await getTrending('tv');
      
      const filterRecentYears = (items) => {
        const currentYear = new Date().getFullYear();
        const previousYear = currentYear - 1;
        
        return items.filter(item => {
          const dateField = item.release_date || item.first_air_date;
          if (!dateField) return false;
          
          const year = new Date(dateField).getFullYear();
          return year === currentYear || year === previousYear;
        });
      };
      
      trendingMovies.results = filterRecentYears(trendingMovies.results);
      trendingTv.results = filterRecentYears(trendingTv.results);
      
      const recentItems = [...trendingMovies.results, ...trendingTv.results];
      
      let featured;
      if (recentItems.length > 0) {
        const randomItem = recentItems[Math.floor(Math.random() * recentItems.length)];
        const media = randomItem.title ? 'movie' : 'tv';
        
        if (media === 'movie') {
          featured = await getMovie(randomItem.id);
        } else {
          featured = await getTvShow(randomItem.id);
        }
      } else {
        error({ statusCode: 504, message: 'No recent content available' });
      }

      return { trendingMovies, trendingTv, featured };
    } catch {
      error({ statusCode: 504, message: 'Data not available' });
    }
  },
};
</script>
<style scoped>
  @media screen and (max-width: 600px) {
  .navbar-title {
    font-size: 12px; 
  }

  
  .button-logout {
    align-items: flex-start;
    display: inline-block;
    line-height: 16.1px;
    right: 1;
    text-align: center;
  }

  .navbar-title {
    text-align: center;
  }
}

@media screen and (max-width: 767px) {
    .nav-button-container {
      margin-top: 30px; 
    }
  }

</style>

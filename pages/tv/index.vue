<template>
  <main class="main">
    <UserNav @show-rated-modal="showRatedItems" />
    
    <div class="header-container">
      <h1 class="title-primary" style="text-align: center; margin-bottom: 0.5rem;">Series de TV</h1>
      <p class="title-secondary" style="text-align: center; margin-bottom: 2rem;">
        Encuentra tu próxima serie favorita, los últimos episodios y más.
      </p>

      <div class="switcher-container">
        <label class="switch">
          <input type="checkbox" :checked="true" @change="navigateToMovies">
          <span class="slider"></span>
          <span class="label-text">Películas</span>
          <span class="label-text">Series de TV</span>
        </label>
      </div>
    </div>
    <br>

    <CustomListingCategoriesSeries
      :title="'Explorar por Categorías'"
      :view-all-url="null"/>

    <div v-if="followedTvShows && followedTvShows.results && followedTvShows.results.length > 0" class="followed-section">
      <ListingCarousel
        :title="'De las productoras que sigues'"
        :items="followedTvShows"
        :view-all-url="{ name: 'tv-followed' }" />
    </div>

    <ListingCarousel
      v-if="onAir && onAir.results.length"
      :title="onAirTitle"
      :view-all-url="onAirUrl"
      :items="onAir" />

    <ListingCarousel
      v-if="popular && popular.results.length"
      :title="popularTitle"
      :view-all-url="popularUrl"
      :items="popular" />

    <ListingCarousel
      v-if="airingToday && airingToday.results.length"
      :title="airingTodayTitle"
      :view-all-url="airingTodayUrl"
      :items="airingToday" />

    <ListingCarousel
      v-if="topRated && topRated.results.length"
      :title="topRatedTitle"
      :view-all-url="topRatedUrl"
      :items="topRated" />
  </main>
</template>

<script>
import UserNav from '@/components/global/UserNav';
import { getTvShows, getListItem, getFollowedProductionCompanies, getTvShowsByCompanies } from '~/api';
import ListingCarousel from '~/components/ListingCarousel';
import CustomListingCategoriesSeries from '~/components/CustomListingCategoriesSeries';

export default {
  components: {
    UserNav,
    ListingCarousel,
    CustomListingCategoriesSeries,
  },

  head () {
    return {
      title: 'EnterCinema - Series de TV',
      meta: [
        { hid: 'og:title', property: 'og:title', content: 'Series de TV' },
        { hid: 'og:url', property: 'og:url', content: `${process.env.FRONTEND_URL}${this.$route.path}` },
      ],
    };
  },

  data() {
    return {
      followedTvShows: null,
    };
  },

  methods: {
    navigateToMovies() {
      this.$router.push({ name: 'movie' });
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
          this.followedTvShows = await getTvShowsByCompanies(companyIds);
        }
      } catch (error) {
        console.error('Error fetching followed TV shows:', error);
      }
    }
  },

  mounted() {
    this.fetchFollowedContent();
  },

  computed: {
    popularTitle () {
      return getListItem('tv', 'popular').title;
    },

    popularUrl () {
      return { name: 'tv-category-name', params: { name: 'popular' } };
    },

    topRatedTitle () {
      return getListItem('tv', 'top_rated').title;
    },

    topRatedUrl () {
      return { name: 'tv-category-name', params: { name: 'top_rated' } };
    },

    onAirTitle () {
      return getListItem('tv', 'on_the_air').title;
    },

    onAirUrl () {
      return { name: 'tv-category-name', params: { name: 'on_the_air' } };
    },

    airingTodayTitle () {
      return getListItem('tv', 'airing_today').title;
    },

    airingTodayUrl () {
      return { name: 'tv-category-name', params: { name: 'airing_today' } };
    },
  },

  async asyncData ({ error }) {
    try {
      const popular = await getTvShows('popular');
      const topRated = await getTvShows('top_rated');
      const onAir = await getTvShows('on_the_air');
      const airingToday = await getTvShows('airing_today');

      return { popular, topRated, onAir, airingToday };
    } catch {
      error({ statusCode: 504, message: 'Datos no disponibles' });
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
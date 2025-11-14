<template>
  <main class="main">
    <UserNav @show-rated-modal="showRatedItems" />
    <div class="tab-controls">
      <button class="tab-btn" @click="navigateToMovies">
        <span class="title-primary" style="font-size:16px;">Movies</span>
      </button>
      <button class="tab-btn active">
        <span class="title-primary" style="font-size:16px;">TV Shows</span>
      </button>
    </div>

    <Hero
      :item="featured" />
     
    <br>
    <CustomListingCategoriesSeries
      :title="'Browse By Category'"
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
      v-if="onAir && onAir.results.length"
      :title="onAirTitle"
      :view-all-url="onAirUrl"
      :items="onAir" />
     
    <ListingCarousel
      v-if="airingToday && airingToday.results.length"
      :title="airingTodayTitle"
      :view-all-url="airingTodayUrl"
      :items="airingToday" />
  </main>
</template>

<script>
import UserNav from '@/components/global/UserNav';
import { getTvShows, getTvShow, getListItem } from '~/api';
import Hero from '~/components/Hero';
import ListingCarousel from '~/components/ListingCarousel';
import CustomListingCategoriesSeries from '~/components/CustomListingCategoriesSeries';

export default {
  components: {
    UserNav,
    Hero,
    ListingCarousel,
    CustomListingCategoriesSeries,
  },

  head () {
    return {
      title: 'EnterCinema - TV Shows.',
      meta: [
        { hid: 'og:title', property: 'og:title', content: 'TV Shows' },
        { hid: 'og:url', property: 'og:url', content: `${process.env.FRONTEND_URL}${this.$route.path}` },
      ],
    };
  },

  methods: {
    navigateToMovies() {
      this.$router.push({ name: 'movie' });
    },
    showRatedItems() {
      this.ratedItemsModalVisible = true;
    },
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
      const featured = await getTvShow(popular.results[0].id);

      return { popular, topRated, onAir, airingToday, featured };
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
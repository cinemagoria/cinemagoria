<template>
  <main class="main">
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

      <CustomListingCategoriesMovies
    :title="'Categories Movies'"
    :view-all-url="null"/>

    <CustomListingCategoriesSeries
    :title="'Categories Series'"
    :view-all-url="null"/>

  </main>
</template>

<script>
import { getTrending, getMovie, getTvShow, getListItem } from '~/api';
import Hero from '~/components/Hero';
import ListingCarousel from '~/components/ListingCarousel';
import FeatureDescription from '~/components/FeatureDescription';
import CustomListingCategoriesMovies from '~/components/CustomListingCategoriesMovies ';
import CustomListingCategoriesSeries from '~/components/CustomListingCategoriesSeries';

export default {
  components: {
    FeatureDescription,
    Hero,
    ListingCarousel,
    CustomListingCategoriesMovies,
    CustomListingCategoriesSeries,
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
      let featured;

      const items = [...trendingMovies.results, ...trendingTv.results];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      const media = randomItem.title ? 'movie' : 'tv';

      if (media === 'movie') {
        featured = await getMovie(randomItem.id);
      } else {
        featured = await getTvShow(randomItem.id);
      }

      return { trendingMovies, trendingTv, featured };
    } catch {
      error({ statusCode: 504, message: 'Data not available' });
    }
  },
};
</script>

<template>
  <main class="main">
    <UserNav @show-rated-modal="showRatedItems" />
    <TopNav
      :title="metaTitle" />

    <Hero
      :item="item" />
    <MediaNav
      :menu="menu"
      @clicked="navClicked" />

    <template v-if="activeMenu === 'overview'">
      <MovieInfo :item="item" :reviews-prop="reviews" :providers="providers" />

      <Credits
        v-if="showCredits"
        :people="item.credits.cast" />
    </template>

    <template v-if="activeMenu === 'releases'">
      <MovieReleases :item="item" />
    </template>

    <template v-if="activeMenu === 'videos' && showVideos">
      <Videos
        :videos="item.videos.results" />
    </template>

    <template v-if="activeMenu === 'photos' && showImages">
      <Images
        v-if="item.images.backdrops.length"
        title="Backdrops"
        type="backdrop"
        :images="item.images.backdrops" />

      <Images
        v-if="item.images.posters.length"
        title="Posters"
        type="poster"
        :images="item.images.posters" />
    </template>

    <ListingCarousel
      v-if="recommended && recommended.results.length"
      title="Recomendaciones"
      :items="recommended" />
  </main>
</template>

<script>
import UserNav from '@/components/global/UserNav';
import { apiImgUrl, getMovie, getMovieRecommended, getMovieReviews } from '~/api';
import { name, yearStart } from '~/mixins/Details';
import TopNav from '~/components/global/TopNav';
import Hero from '~/components/Hero';
import MediaNav from '~/components/MediaNav';
import MovieInfo from '~/components/movie/MovieInfo';
import MovieReleases from '~/components/movie/MovieReleases';
import Videos from '~/components/Videos';
import Images from '~/components/Images';
import Credits from '~/components/Credits';
import ListingCarousel from '~/components/ListingCarousel';

export default {
  components: {
    UserNav,
    TopNav,
    Hero,
    MediaNav,
    MovieInfo,
    MovieReleases,
    Videos,
    Images,
    Credits,
    ListingCarousel,
  },

  mixins: [
    name,
    yearStart,
  ],

  head () {
    return {
      title: this.metaTitle,
      meta: [
        { hid: 'og:title', property: 'og:title', content: this.metaTitle },
        { hid: 'og:description', property: 'og:description', content: this.metaDescription },
        { hid: 'description', name: 'description', content: this.metaDescription },
        { hid: 'og:image', property: 'og:image', content: this.metaImage },
        { hid: 'og:url', property: 'og:url', content: `${process.env.FRONTEND_URL}${this.$route.path}` },
      ],
      bodyAttrs: {
        class: 'topnav-active',
      },
    };
  },

  data () {
    return {
      menu: [],
      activeMenu: 'overview',
      recommended: null,
      reviews: null,
      reviews: [],
      providers: [],
    };
  },

  computed: {
    metaTitle () {
      if (this.yearStart) {
        return `${this.name} (${this.yearStart})`;
      } else {
        return `${this.name}`;
      }
    },

    metaDescription () {
      if (this.item.overview) {
        return this.truncate(this.item.overview, 200);
      } else {
        return '';
      }
    },

    metaImage () {
      if (this.item.poster_path) {
        return `${apiImgUrl}/w500${this.item.poster_path}`;
      } else {
        return '';
      }
    },

    showCredits () {
      const credits = this.item.credits;
      return credits && credits.cast && credits.cast.length;
    },

    showVideos () {
      const videos = this.item.videos;
      return videos && videos.results && videos.results.length;
    },

    showImages () {
      const images = this.item.images;
      return images && ((images.backdrops && images.backdrops.length) || (images.posters && images.posters.length));
    },
  },

  async asyncData ({ params, error }) {
    try {
      const item = await getMovie(params.id);

      if (item.adult) {
        error({ message: 'This movie is not available' });
      } else {
        return { item };
      }
    } catch {
      error({ message: 'Page not found' });
    }
  },

  created () {
    this.createMenu();
    this.initRecommended();
    this.fetchReviews(); // Añadido método para obtener reseñas
  },

  methods: {
    showRatedItems() {
      this.ratedItemsModalVisible = true;
    },
    
    truncate (string, length) {
      return this.$options.filters.truncate(string, length);
    },

    createMenu () {
      const menu = [];

      menu.push('Overview');
      menu.push("Releases")

      if (this.showVideos) menu.push('Videos');

      if (this.showImages) menu.push('Photos');

      this.menu = menu;
    },

    navClicked (label) {
      this.activeMenu = label;
    },

    initRecommended () {
      if (this.recommended !== null) return;

      getMovieRecommended(this.$route.params.id).then((response) => {
        this.recommended = response;
      });
    },

    async fetchReviews() {
      try {
        const reviews = await getMovieReviews(this.$route.params.id);
        this.reviews = Array.isArray(reviews) ? reviews : [];
      } catch (error) {
        console.error('Error al obtener reseñas:', error);
        this.reviews = [];
      }
    },
  },
};
</script>
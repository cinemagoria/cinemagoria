<template>
  <main class="main">
    <UserNav @show-rated-modal="showRatedItems" />
    <TopNav
      :title="metaTitle" />

    <ProductionHero
      v-if="company"
      :item="company"
      :backdrop-path="heroBackdrop"
      title="Productora" />

    <div class="switcher-container">
      <label class="switch">
        <input type="checkbox" :checked="activeTab === 'tvShows'" @change="toggleTab">
        <span class="slider"></span>
        <span class="label-text">Películas</span>
        <span class="label-text">Series</span>
      </label>
    </div>

    <section class="spacing">
      <!-- Movies Section -->
      <div v-if="activeTab === 'movies'" class="content-section">
        <div v-if="movies && movies.results && movies.results.length">
          <Listing
            :items="movies"
            :loading="moviesLoading"
            @loadMore="loadMoreMovies" />
        </div>
        <div v-else-if="!moviesLoading" class="empty-state">
          <p>No se encontraron películas para esta productora.</p>
        </div>
      </div>

      <!-- TV Shows Section -->
      <div v-if="activeTab === 'tvShows'" class="content-section">
        <div v-if="tvShows && tvShows.results && tvShows.results.length">
          <Listing
            :items="tvShows"
            :loading="tvShowsLoading"
            @loadMore="loadMoreTVShows" />
        </div>
        <div v-else-if="!tvShowsLoading" class="empty-state">
          <p>No se encontraron series para esta productora.</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { getMoviesByProductionCompany, getTVShowsByProductionCompany, getProductionCompanyDetails } from '~/api';
import { getProductionCompanyBySlug } from '~/utils/constants';
import TopNav from '~/components/global/TopNav';
import Listing from '~/components/Listing';
import ProductionHero from '~/components/ProductionHero';
import UserNav from '@/components/global/UserNav';

export default {
  components: {
    UserNav,
    TopNav,
    Listing,
    ProductionHero,
  },

  data() {
    return {
      moviesLoading: false,
      tvShowsLoading: false,
      activeTab: 'movies',
      showRatedItems: false,
    };
  },

  head() {
    return {
      title: this.metaTitle,
      meta: [
        { hid: 'og:title', property: 'og:title', content: this.metaTitle },
        { hid: 'og:url', property: 'og:url', content: `${process.env.FRONTEND_URL}${this.$route.path}` },
      ],
      bodyAttrs: {
        class: 'topnav-active',
      },
    };
  },

  computed: {
    metaTitle() {
      return this.company && this.company.name ? `${this.company.name} - Productora` : 'Productora';
    },
    heroBackdrop() {
      if (this.movies && this.movies.results && this.movies.results.length > 0) {
        return this.movies.results[0].backdrop_path;
      }
      return null;
    },
  },

  async asyncData({ params, error }) {
    let companyId = null;
    const companyInfo = getProductionCompanyBySlug(params.slug);
    
    if (companyInfo) {
      companyId = companyInfo.id;
    } else {
      if (!isNaN(params.slug)) {
        companyId = params.slug;
      }
    }

    if (!companyId) {
      return error({ statusCode: 404, message: 'Production company not found' });
    }

    try {
      const [moviesData, tvShowsData, companyDetails] = await Promise.all([
        getMoviesByProductionCompany(companyId, 1),
        getTVShowsByProductionCompany(companyId, 1),
        getProductionCompanyDetails(companyId),
      ]);

      return {
        companyId: companyId,
        company: companyDetails,
        movies: moviesData,
        tvShows: tvShowsData,
      };
    } catch (err) {
      console.error('Error loading production company data:', err);
      return error({ statusCode: 500, message: 'Error loading production company data' });
    }
  },

  mounted() {
    this.$root.$on('show-rated-modal', this.handleShowRatedModal);
  },

  methods: {
    handleShowRatedModal() {
      this.showRatedItems = true;
    },
    toggleTab(event) {
      this.activeTab = event.target.checked ? 'tvShows' : 'movies';
    },

    loadMoreMovies() {
      if (this.movies.page >= this.movies.total_pages || this.moviesLoading) return;

      this.moviesLoading = true;
      const nextPage = this.movies.page + 1;

      getMoviesByProductionCompany(this.companyId, nextPage)
        .then((response) => {
          this.movies.results = this.movies.results.concat(response.results || []);
          this.movies.page = nextPage;
          this.moviesLoading = false;
        })
        .catch(() => {
          this.moviesLoading = false;
        });
    },

    loadMoreTVShows() {
      if (this.tvShows.page >= this.tvShows.total_pages || this.tvShowsLoading) return;

      this.tvShowsLoading = true;
      const nextPage = this.tvShows.page + 1;

      getTVShowsByProductionCompany(this.companyId, nextPage)
        .then((response) => {
          this.tvShows.results = this.tvShows.results.concat(response.results || []);
          this.tvShows.page = nextPage;
          this.tvShowsLoading = false;
        })
        .catch(() => {
          this.tvShowsLoading = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.switcher-container {
  display: flex;
  justify-content: center;
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

.section-title {
  font-size: 3rem;
  color: #8BE9FD;
  margin-bottom: 3rem;
  text-align: center;
  letter-spacing: 0.1em;
}

.content-section {
  margin-bottom: 4rem;
}

.subsection-title {
  font-size: 2rem;
  color: #fff;
  margin-bottom: 2rem;
  letter-spacing: 0.05em;
}

.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.6rem;
}
</style>

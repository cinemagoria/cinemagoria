<template>
  <main class="main">
    <TopNav
      :title="metaTitle" />

    <section class="spacing">
      <h2 v-if="companyName" class="section-title">{{ companyName }}</h2>
      
      <!-- Movies Section -->
      <div v-if="movies && movies.length" class="content-section">
        <h3 class="subsection-title">Movies</h3>
        <Listing
          :items="{ results: movies }"
          :loading="moviesLoading"
          @loadMore="loadMoreMovies" />
      </div>

      <!-- TV Shows Section -->
      <div v-if="tvShows && tvShows.length" class="content-section">
        <h3 class="subsection-title">TV Shows</h3>
        <Listing
          :items="{ results: tvShows }"
          :loading="tvShowsLoading"
          @loadMore="loadMoreTVShows" />
      </div>

      <!-- Empty State -->
      <div v-if="!movies.length && !tvShows.length && !moviesLoading && !tvShowsLoading" class="empty-state">
        <p>No content found for this production company.</p>
      </div>
    </section>
  </main>
</template>

<script>
import { getMoviesByProductionCompany, getTVShowsByProductionCompany } from '~/api';
import { getProductionCompanyBySlug } from '~/utils/constants';
import TopNav from '~/components/global/TopNav';
import Listing from '~/components/Listing';

export default {
  components: {
    TopNav,
    Listing,
  },

  data() {
    return {
      moviesLoading: false,
      tvShowsLoading: false,
      moviesPage: 1,
      tvShowsPage: 1,
      moviesTotalPages: 1,
      tvShowsTotalPages: 1,
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
      return this.companyName ? `${this.companyName} - Production Company` : 'Production Company';
    },
  },

  async asyncData({ params, error }) {
    const slug = params.slug;
    const company = getProductionCompanyBySlug(slug);

    if (!company) {
      return error({ statusCode: 404, message: 'Production company not found' });
    }

    try {
      const [moviesData, tvShowsData] = await Promise.all([
        getMoviesByProductionCompany(company.id, 1),
        getTVShowsByProductionCompany(company.id, 1),
      ]);

      return {
        companyId: company.id,
        companyName: company.name,
        movies: moviesData.results || [],
        tvShows: tvShowsData.results || [],
        moviesTotalPages: moviesData.total_pages || 1,
        tvShowsTotalPages: tvShowsData.total_pages || 1,
      };
    } catch (err) {
      console.error('Error loading production company data:', err);
      return error({ statusCode: 500, message: 'Error loading production company data' });
    }
  },

  methods: {
    loadMoreMovies() {
      if (this.moviesPage >= this.moviesTotalPages || this.moviesLoading) return;

      this.moviesLoading = true;
      const nextPage = this.moviesPage + 1;

      getMoviesByProductionCompany(this.companyId, nextPage)
        .then((response) => {
          this.movies = this.movies.concat(response.results || []);
          this.moviesPage = nextPage;
          this.moviesLoading = false;
        })
        .catch(() => {
          this.moviesLoading = false;
        });
    },

    loadMoreTVShows() {
      if (this.tvShowsPage >= this.tvShowsTotalPages || this.tvShowsLoading) return;

      this.tvShowsLoading = true;
      const nextPage = this.tvShowsPage + 1;

      getTVShowsByProductionCompany(this.companyId, nextPage)
        .then((response) => {
          this.tvShows = this.tvShows.concat(response.results || []);
          this.tvShowsPage = nextPage;
          this.tvShowsLoading = false;
        })
        .catch(() => {
          this.tvShowsLoading = false;
        });
    },
  },
};
</script>

<style scoped>
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

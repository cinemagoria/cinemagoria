<template>
  <main class="main">
    <SearchResults
      v-if="items && items.results.length"
      :title="title"
      :items="items"
      :loading="loading"
      :searchQuery="query"
      @loadMore="loadMore" />
    
    <div v-else-if="items && items.results && !items.results.length && !loading" class="no-results-container">
      <SearchResults
        :items="{results: [], page: 1, total_pages: 0}"
        :loading="loading"
        :searchQuery="query" />
    </div>
  </main>
</template>

<script>
import { search } from '~/api';
import SearchResults from '~/components/search/SearchResults';
let fromPage = '/';

export default {
  components: {
    SearchResults,
  },

  data () {
    return {
      loading: false,
    };
  },

  head () {
    return {
      title: 'Search',
      meta: [
        { hid: 'og:title', property: 'og:title', content: 'Search' },
        { hid: 'og:url', property: 'og:url', content: `${process.env.FRONTEND_URL}${this.$route.path}` },
      ],
      bodyAttrs: {
        class: 'page page-search',
      },
    };
  },

  computed: {
    query () {
      return this.$route.query.q ? this.$route.query.q : '';
    },

    title () {
      return this.query ? `Resultados para: ${this.query}` : '';
    },
  },

  async asyncData ({ query, error, redirect }) {
    try {
      if (query.q) {
        const items = await search(query.q, 1);
        return { items };
      } else {
        redirect('/');
      }
    } catch {
      error({ message: 'Page not found' });
    }
  },

  mounted () {
    this.$store.commit('search/openSearch');
    this.$store.commit('search/setFromPage', fromPage);
  },

  beforeRouteEnter (to, from, next) {
    fromPage = from.path;
    next();
  },

  beforeRouteUpdate (to, from, next) {
    next();
    this.getResults();
  },

  beforeRouteLeave (to, from, next) {
    const search = document.getElementById('search');

    next();

    if (search && search.value.length) {
      this.$store.commit('search/closeSearch');
    }
  },

  methods: {
    async getResults () {
      if (!this.query.length) {
        this.items = null;
        return;
      }

      const data = await search(this.query);

      if (!data.total_results) {
        this.items = {
          results: [],
          page: 1,
          total_pages: 0,
          total_results: 0
        };
        return;
      }

      this.items = data;
    },

    loadMore () {
      this.loading = true;

      search(this.query, this.items.page + 1).then((response) => {
        this.items.results = this.items.results.concat(response.results);
        this.items.page = response.page;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/css/utilities/_variables.scss';

.page-search .main {
  padding-top: 3rem;

  @media (min-width: $breakpoint-large) {
    padding-top: 8rem;
  }
}

.no-results-container {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>

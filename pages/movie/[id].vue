<template>
  <main class="main">
    <UserNav @show-rated-modal="showRatedItems" />
    <TopNav :title="metaTitle" />

    <Hero v-if="item && item.id" :item="item" />
    
    <MediaNav :menu="menu" @clicked="navClicked" />

    <template v-if="activeMenu === 'sinopsis'">
      <MovieInfo v-if="item && item.id" :item="item" :reviews-prop="reviews">
        <template #before-recommendations>
          <Credits v-if="showCredits" :people="item.credits.cast" />
        </template>
      </MovieInfo>
    </template>

    <template v-if="activeMenu === 'estrenos'">
      <MovieReleases v-if="item && item.release_dates" :item="item" />
    </template>

    <template v-if="activeMenu === 'videos' && showVideos">
      <Videos :videos="item.videos.results" />
    </template>

    <template v-if="activeMenu === 'fotos' && showImages">
      <Images v-if="item.images.backdrops.length" title="Fondos" type="backdrop" :images="item.images.backdrops" />
      <Images v-if="item.images.posters.length" title="Pósters" type="poster" :images="item.images.posters" />
    </template>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import UserNav from '@/components/global/UserNav.vue';
import { apiImgUrl, getMovie } from '~/utils/api';
import TopNav from '~/components/global/TopNav.vue';
import Hero from '~/components/Hero.vue';
import MediaNav from '~/components/MediaNav.vue';
import MovieInfo from '~/components/movie/MovieInfo.vue';
import MovieReleases from '~/components/movie/MovieReleases.vue';
import Videos from '~/components/Videos.vue';
import Images from '~/components/Images.vue';
import Credits from '~/components/Credits.vue';
import lodash from 'lodash';
const { truncate } = lodash;

const route = useRoute();
const router = useRouter();

// Methods (moved up for hoisting if needed, but in setup order matters less for declared functions)
const showRatedItems = () => {
  ratedItemsModalVisible.value = true;
};

const navClicked = (label) => {
  activeMenu.value = label;
};

// Data
const ratedItemsModalVisible = ref(false);
const activeMenu = ref('sinopsis');
const menu = ref([]);
const reviews = ref(null);

// Async Data
const { data: movieData, error } = await useAsyncData(`movie-${route.params.id}`, async () => {
  try {
    const item = await getMovie(route.params.id);
    if (item.adult) {
      throw new Error('Esta película no está disponible');
    }
    return { item };
  } catch (e) {
    throw e;
  }
});

const item = computed(() => movieData.value?.item || {});

// Mixin Re-implementation
const name = computed(() => item.value.title ? item.value.title : item.value.name);
const yearStart = computed(() => {
  const date = item.value.release_date ? item.value.release_date : item.value.first_air_date;
  if (date) {
    return date.split('-')[0];
  }
  return '';
});

// Computed
const metaTitle = computed(() => {
  if (!item.value || !name.value) return '';
  if (yearStart.value) {
    return `${name.value} (${yearStart.value})`;
  } else {
    return `${name.value}`;
  }
});

const metaDescription = computed(() => {
  if (item.value && item.value.overview) {
    return item.value.overview.length > 200 ? item.value.overview.substring(0, 200) + '...' : item.value.overview;
  } else {
    return '';
  }
});

const metaImage = computed(() => {
  if (item.value && item.value.poster_path) {
    return `${apiImgUrl}/w500${item.value.poster_path}`;
  } else {
    return '';
  }
});

const showCredits = computed(() => {
  const credits = item.value && item.value.credits;
  return credits && credits.cast && credits.cast.length;
});

const showVideos = computed(() => {
  const videos = item.value && item.value.videos;
  return videos && videos.results && videos.results.length;
});

const showImages = computed(() => {
  const images = item.value && item.value.images;
  return images && ((images.backdrops && images.backdrops.length) || (images.posters && images.posters.length));
});

// Watch & Menu Logic
const createMenu = () => {
  const m = [];
  m.push('Sinopsis');
  m.push('Estrenos');
  if (showVideos.value) m.push('Videos');
  if (showImages.value) m.push('Fotos');
  menu.value = m;
};

watch(item, () => {
  if (item.value && item.value.id) {
    createMenu();
  }
}, { immediate: true });

useHead({
  title: metaTitle,
  meta: [
    { property: 'og:title', content: metaTitle },
    { property: 'og:description', content: metaDescription },
    { name: 'description', content: metaDescription },
    { property: 'og:image', content: metaImage },
    { property: 'og:url', content: `https://entercinema.com${route.path}` },
  ],
  bodyAttrs: {
    class: 'topnav-active',
  },
});

</script>
<style>
@media (max-width: 1200px) {
  .user-nav-container { top: 7px !important; }
  .container { bottom: 10px !important; }
}
</style>
<template>
  <main class="main">
    <UserNav @show-rated-modal="showRatedItems" />
    <TopNav :title="metaTitle" />

    <Hero v-if="item && item.id" :item="item" />
    
    <MediaNav :menu="menu" @clicked="navClicked" />

    <template v-if="activeMenu === 'overview'">
      <MovieInfo v-if="item && item.id" :item="item" :reviews-prop="reviews">
        <template #before-recommendations>
          <Credits v-if="showCredits" :people="item.credits.cast" />
        </template>
      </MovieInfo>
    </template>

    <template v-if="activeMenu === 'releases'">
      <MovieReleases v-if="item && item.release_dates" :item="item" />
    </template>

    <template v-if="activeMenu === 'videos' && showVideos">
      <Videos :videos="item.videos.results" />
    </template>

    <template v-if="activeMenu === 'photos' && showImages">
      <Images v-if="item.images.backdrops.length" title="Backdrops" type="backdrop" :images="item.images.backdrops" />
      <Images v-if="item.images.posters.length" title="Posters" type="poster" :images="item.images.posters" />
      <Images v-if="item.images.posters.length" title="Posters" type="poster" :images="item.images.posters" />
    </template>

    <template v-if="activeMenu === 'ost' && showSoundtracks">
      <SoundtrackList :items="soundtrackItems" />
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
import SoundtrackList from '~/components/music/SoundtrackList.vue';
import { searchSoundtracks } from '~/utils/musicbrainz';
import lodash from 'lodash';
const { truncate } = lodash;

const route = useRoute();
const router = useRouter();

const showRatedItems = () => {
  ratedItemsModalVisible.value = true;
};

const navClicked = (label) => {
  activeMenu.value = label;
};

const ratedItemsModalVisible = ref(false);
const activeMenu = ref('overview');
const menu = ref([]);
const reviews = ref(null);
const soundtrackItems = ref([]);
const { data: movieData, error } = await useAsyncData(`movie-${route.params.id}`, async () => {
  try {
    const item = await getMovie(route.params.id);
    if (item.adult) {
      throw new Error('This movie is not available');
    }
    return { item };
  } catch (e) {
    throw e;
  }
});

const item = computed(() => movieData.value?.item || {});

const name = computed(() => item.value.title ? item.value.title : item.value.name);
const yearStart = computed(() => {
  const date = item.value.release_date ? item.value.release_date : item.value.first_air_date;
  if (date) {
    return date.split('-')[0];
  }
  return '';
});

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

const showSoundtracks = computed(() => {
  return soundtrackItems.value && soundtrackItems.value.length > 0;
});

const createMenu = () => {
  const m = [];
  m.push('Overview');
  m.push('Releases');
  if (showSoundtracks.value) m.push('OST');
  if (showVideos.value) m.push('Videos');
  if (showImages.value) m.push('Photos');
  menu.value = m;
};

watch(item, async () => {
  if (item.value && item.value.id) {
    createMenu();
    try {
      const query = item.value.original_title || item.value.title;
      if (query) {
        const results = await searchSoundtracks(query, yearStart.value);
        soundtrackItems.value = results;
        createMenu();
      }
    } catch (e) {
      console.error(e);
    }
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
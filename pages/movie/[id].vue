<template>
  <main class="main">
    <UserNav @show-rated-modal="showRatedItems" />
    <TopNav :title="metaTitle" />

    <div v-if="error" class="error-page-container">
      <div class="empty-state-container">
        <img src="/cinema-popcorn.svg" alt="Movie Not Found" class="empty-state-icon">
        <h3>Movie Not Found</h3>
        <p>Sorry, we couldn't find the movie you're looking for. It may have been removed or the link might be incorrect.</p>
        <button @click="router.push('/')" class="refine-filters-btn">Go Home</button>
      </div>
    </div>

    <template v-else>
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
      </template>

      <template v-if="activeMenu === 'ost' && showSoundtracks">
        <SoundtrackList :items="soundtrackItems" />
      </template>
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
    try {
      const query = item.value.original_title || item.value.title;
      if (query) {
        const results = await searchSoundtracks(query, yearStart.value);
        soundtrackItems.value = results;
      }
    } catch (e) {
      console.error(e);
    }
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

.error-page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
}

.empty-state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #8b9bb4;
  text-align: center;
  width: 100%;
  max-width: 800px;
  background: rgba(0, 0, 0, 0.307);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 15px;
}

.empty-state-icon {
  width: 200px;
  height: 200px;
  margin-bottom: 25px;
  opacity: 0.7;
}

.empty-state-container h3 {
  color: #8BE9FD;
  font-size: 2rem;
  margin: 0 auto 15px;
  letter-spacing: 1px;
}

.empty-state-container p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.4rem;
  margin: 8px auto 25px;
  line-height: 1.5;
}

.refine-filters-btn {
  padding: 12px 30px;
  background: rgba(139, 233, 253, 0.1);
  border: 1px solid #8BE9FD;
  border-radius: 25px;
  color: #8BE9FD;
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  display: block;
}

.refine-filters-btn:hover {
  background: rgba(139, 233, 253, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(139, 233, 253, 0.3);
}
</style>
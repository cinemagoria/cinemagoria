<template>
  <main class="main">
    <UserNav @show-rated-modal="showRatedItems" />
    <TopNav
      :title="metaTitle" />

    <PersonInfo
      :person="person" />

    <MediaNav
      :menu="menu"
      @clicked="navClicked" />

    <template v-if="activeMenu === 'known-for'">
      <Listing
        v-if="knownFor && knownFor.results.length"
        :items="knownFor" />
    </template>

    <template v-if="activeMenu === 'credits'">
      <CreditsHistory
        :credits="person.combined_credits" />
    </template>

    <template v-if="activeMenu === 'photos' && showImages">
      <Images
        v-if="person.images.profiles.length"
        title="Photos"
        type="poster"
        :images="person.images.profiles" />
    </template>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import UserNav from '@/components/global/UserNav.vue';
import { apiImgUrl, getPerson } from '~/utils/api';
import TopNav from '~/components/global/TopNav.vue';
import PersonInfo from '~/components/person/PersonInfo.vue';
import MediaNav from '~/components/MediaNav.vue';
import CreditsHistory from '~/components/person/CreditsHistory.vue';
import Images from '~/components/Images.vue';
import Listing from '~/components/Listing.vue';

const route = useRoute();
const router = useRouter();

// Methods
const showRatedItems = () => {
  ratedItemsModalVisible.value = true;
};

const navClicked = (label) => {
  activeMenu.value = label;
};

// Data
const ratedItemsModalVisible = ref(false);
const activeMenu = ref('known-for');
const menu = ref([]);
const knownFor = ref(null);

// Async Data
const { data: personData, error } = await useAsyncData(`person-${route.params.id}`, async () => {
  try {
    const person = await getPerson(route.params.id);
    if (person.adult) {
      throw new Error('This person is not available');
    }
    return { person };
  } catch (e) {
    throw e;
  }
});

const person = computed(() => personData.value?.person || {});

// Computed
const metaTitle = computed(() => person.value.name || '');

const metaDescription = computed(() => {
  if (person.value.biography) {
    return person.value.biography.length > 200 ? person.value.biography.substring(0, 200) + '...' : person.value.biography;
  } else {
    return '';
  }
});

const metaImage = computed(() => {
  if (person.value.profile_path) {
    return `${apiImgUrl}/w500${person.value.profile_path}`;
  } else {
    return '';
  }
});

const showImages = computed(() => {
  const images = person.value.images;
  return images && (images.profiles && images.profiles.length);
});

// Logic from methods
const removeDuplicates = (myArr) => {
  return myArr.filter((obj, pos, arr) => {
    const prop = obj.title ? 'title' : 'name';
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
};

const enrichWithIMDbRatings = async (items) => {
  if (!items || !items.length) return items;
  
  const enrichedItems = await Promise.all(
    items.map(async (item) => {
      try {
        const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
        
        // Note: Using process.env.API_KEY. Ensure it's available. 
        // In Nuxt 3/4 runtime config is preferred but process.env might work if decoupled.
        const config = useRuntimeConfig();
        const apiKey = config.public.apiKey;
        const detailsResponse = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${item.id}?api_key=${apiKey}&append_to_response=external_ids`
        );
        
        if (detailsResponse.ok) {
          const detailsData = await detailsResponse.json();
          const imdbId = detailsData.external_ids?.imdb_id;
          
          if (imdbId) {
            const imdbResponse = await fetch(`/api/imdb-rating/${imdbId}`);
            
            if (imdbResponse.ok) {
              const imdbData = await imdbResponse.json();
              if (imdbData.found && imdbData.score) {
                return {
                  ...item,
                  imdb_rating: imdbData.score,
                  imdb_votes: imdbData.votes,
                  rating_source: 'imdb'
                };
              }
            }
          }
        }
      } catch (error) {
        console.error(`Failed to fetch IMDb rating for ${item.id}`);
      }
      
      return {
        ...item,
        rating_source: 'tmdb'
      };
    })
  );
  
  return enrichedItems;
};

const initKnownFor = async () => {
  if (knownFor.value !== null) return;
  if (!person.value || !person.value.known_for_department) return;

  const department = person.value.known_for_department;
  let results;

  if (department === 'Acting') {
    results = person.value.combined_credits.cast;
  } else if (department === 'Directing') {
    results = person.value.combined_credits.crew.filter(item => item.department === 'Directing');
  } else if (department === 'Production') {
    results = person.value.combined_credits.crew.filter(item => item.department === 'Production');
  } else if (department === 'Writing' || department === 'Creator') {
    results = person.value.combined_credits.crew.filter(item => item.department === 'Writing');
  }

  if (!results) return;

  results = removeDuplicates(results);

  results = results.filter((item) => {
    if (item.adult) return false;
    return true;
  });

  results.sort((a, b) => a.vote_count > b.vote_count ? -1 : 1);
  results = await enrichWithIMDbRatings(results);
  knownFor.value = {
    page: 1,
    total_pages: 1,
    total_results: results.length,
    results,
  };
};

const createMenu = () => {
  const m = [];
  m.push('Known For');
  m.push('Credits');
  if (showImages.value) m.push('Photos');
  menu.value = m;
};

// Lifecycle
onMounted(() => {
    createMenu();
    initKnownFor();
});

// Watch person change if needed (usually handled by route key or asyncData re-run)
watch(person, () => {
    if (person.value && person.value.id) {
        createMenu();
        initKnownFor();
    }
});

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

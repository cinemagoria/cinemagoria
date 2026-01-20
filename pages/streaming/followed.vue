<template>
  <main class="main user-select-none">
    <UserNav />
    <TopNav title="Seguidos en Streaming" />
    
    <div class="content">
      <FollowedContent 
        v-if="activeType === 'movies'" 
        type="movie" 
        source="streaming_platform" 
        key="movies" 
      />
      <FollowedContent 
        v-if="activeType === 'tv'" 
        type="tv" 
        source="streaming_platform" 
        key="tv" 
      />
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from '#imports';
import UserNav from '~/components/global/UserNav';
import TopNav from '~/components/global/TopNav';
import FollowedContent from '~/components/FollowedContent';

const route = useRoute();
const activeType = computed(() => {
    return route.query.type === 'tv' ? 'tv' : 'movies';
});
</script>

<style scoped lang="scss">


.content {
  min-height: 500px;
}
</style>
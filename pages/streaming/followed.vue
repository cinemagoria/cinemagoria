<template>
  <main class="main user-select-none">
    <UserNav />
    <TopNav title="Followed Streaming" />
    
    <div class="tabs-container">
      <div class="tabs">
        <button 
          @click="activeTab = 'movies'" 
          :class="['tab-btn', { active: activeTab === 'movies' }]"
        >
          Movies
        </button>
        <button 
          @click="activeTab = 'tv'" 
          :class="['tab-btn', { active: activeTab === 'tv' }]"
        >
          TV Shows
        </button>
      </div>
    </div>

    <div class="content">
      <FollowedContent 
        v-if="activeTab === 'movies'" 
        type="movie" 
        source="streaming_platform" 
        key="movies" 
      />
      <FollowedContent 
        v-if="activeTab === 'tv'" 
        type="tv" 
        source="streaming_platform" 
        key="tv" 
      />
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import UserNav from '~/components/global/UserNav';
import TopNav from '~/components/global/TopNav';
import FollowedContent from '~/components/FollowedContent';

const activeTab = ref('movies');
</script>

<style scoped lang="scss">
.tabs-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.tabs {
  display: flex;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 30px;
  padding: 5px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-btn {
  padding: 10px 30px;
  border-radius: 25px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &.active {
    background: #8BE9FD;
    color: #000;
  }

  &:hover:not(.active) {
    background: rgba(255, 255, 255, 0.1);
  }
}

.content {
  min-height: 500px;
}
</style>

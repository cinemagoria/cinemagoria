<template>
  <div class="page-container">
    <div class="listing">
      
      <!-- Header matching pages/news/index.vue -->
      <nav class="navbar navbar-welcome">
        <h1 class="title-primary page-title">Production Companies</h1>
        <h2 class="title-secondary page-subtitle">
          Explore our complete collection of production companies
        </h2>
      </nav>

      <div class="production-grid">
        <NuxtLink 
          v-for="company in sortedCompanies" 
          :key="company.id" 
          :to="`/production/${company.slug}`"
          class="production-card"
        >
          <div class="logo-wrapper">
            <img 
              v-if="company.logo_path"
              :src="`${apiImgUrl}/w500${company.logo_path}`" 
              :alt="company.name" 
              class="company-logo"
              loading="lazy"
            >
            <span v-else class="company-name-fallback">{{ company.name }}</span>
          </div>
          <div class="card-footer">
            <span class="card-label">{{ company.name }}</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { SUPPORTED_PRODUCTION_COMPANIES } from '~/utils/constants';
import { apiImgUrl } from '~/utils/api';

const sortedCompanies = computed(() => {
  return Object.values(SUPPORTED_PRODUCTION_COMPANIES).sort((a, b) => 
    a.name.localeCompare(b.name)
  );
});

useHead({
  title: 'All Production Companies - EnterCinema',
  meta: [
    { name: 'description', content: 'Browse all production companies available on EnterCinema.' }
  ]
});
</script>

<style lang="scss" scoped>
@use '~/assets/css/utilities/variables' as *;

.page-container {
  padding-top: 3rem;
  padding-bottom: 4rem;
  min-height: 100vh;
}

.listing {
  margin: 0 1.5rem;

  @media (min-width: $breakpoint-large) {
    margin: 0 5rem;
  }
}

.page-title {
  color: #8BE9FD;
  margin-top: 10px;
  margin-bottom: 5px;
  display: flex;
  justify-content: center;
  font-size: 2.5rem; 
  font-weight: 700;
  text-align: center;
}

.page-subtitle {
  color: $color-text-subtle;
  font-size: 14px;
  max-width: 600px;
  margin: 0 auto 2rem; 
  text-align: center;
  font-weight: 400;
}

.production-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); 
  gap: 1.5rem;
  align-items: stretch; 

  @media (min-width: 600px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 900px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(5, 1fr);
     gap: 2rem;
  }
   @media (min-width: 1600px) {
    grid-template-columns: repeat(6, 1fr);
  }
}

.production-card {
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    border-color: #8BE9FD;
    box-shadow: 0 10px 20px rgba(0,0,0,0.4);

    .card-label {
      color: #8BE9FD;
    }
  }
}

.logo-wrapper {
  background: #8BE9FD;
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  flex-shrink: 0;
}

.company-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.company-name-fallback {
  color: #000;
  font-weight: 800;
  text-align: center;
  font-size: 1.5rem;
  line-height: 1.2;
}

.card-footer {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  background: rgba(0,0,0,0.2);
  min-height: 60px;
}

.card-label {
  color: #fff;
  font-weight: 600;
  font-size: 1.1rem;
  text-align: center;
  transition: color 0.3s ease;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

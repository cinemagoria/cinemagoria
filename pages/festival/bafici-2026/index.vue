<template>
  <main class="main">
    <div class="container header-container">
      <div class="festival-hero">
        <nuxt-link to="/festival" class="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Todos los Festivales
        </nuxt-link>
        <a href="https://bafici.org/" target="_blank" class="hero-backdrop">
            <img 
              src="/festivals/bafici/bafici_backdrop_2026_es.webp" 
              alt="BAFICI 2026 Backdrop"
            />
            <div class="hero-overlay"></div>
        </a>
      </div>

      <div class="switcher-container">
        <div class="segmented-control">
            <input type="radio" id="tab-films" value="films" v-model="activeTab">
            <label for="tab-films" @click="activeTab = 'films'">Estrenos</label>
            
            <input type="radio" id="tab-schedule" value="schedule" v-model="activeTab">
            <label for="tab-schedule" @click="activeTab = 'schedule'">Programación</label>
            
            <div class="glider" :class="activeTab"></div>
        </div>
      </div>
    </div>

    <div class="container">
      <div v-if="loading" class="loader-container">
        <Loader />
      </div>

      <div v-else>
        <div v-if="activeTab === 'films'" class="films-grid">
            <div v-if="features.length > 0" class="film-category">
                <div class="category-header" @click="featuresOpen = !featuresOpen">
                    <h2 class="listing__title category-title">
                        Largometrajes
                        <span class="category-count">({{ features.length }})</span>
                    </h2>
                    <button class="expand-btn" :aria-label="featuresOpen ? 'Colapsar' : 'Expandir'">
                        <svg v-if="featuresOpen" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h8"/><path d="M3 12h8"/><path d="M3 19h8"/><path d="m15 5 3 3 3-3"/><path d="m15 19 3-3 3 3"/></svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 5h11"/><path d="M10 12h11"/><path d="M10 19h11"/><path d="m3 10 3-3-3-3"/><path d="m3 20 3-3-3-3"/></svg>
                    </button>
                </div>
                <transition name="slide">
                    <div v-show="featuresOpen" class="listing__items">
                        <BaficiCard 
                            v-for="item in features"
                            :key="`feature-${item.id}`"
                            :item="item" 
                        />
                    </div>
                </transition>
            </div>

            <div v-if="shorts.length > 0" class="film-category">
                <div class="category-header" @click="shortsOpen = !shortsOpen">
                    <h2 class="listing__title category-title">
                        Cortometrajes
                        <span class="category-count">({{ shorts.length }})</span>
                    </h2>
                    <button class="expand-btn" :aria-label="shortsOpen ? 'Colapsar' : 'Expandir'">
                        <svg v-if="shortsOpen" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h8"/><path d="M3 12h8"/><path d="M3 19h8"/><path d="m15 5 3 3 3-3"/><path d="m15 19 3-3 3 3"/></svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 5h11"/><path d="M10 12h11"/><path d="M10 19h11"/><path d="m3 10 3-3-3-3"/><path d="m3 20 3-3-3-3"/></svg>
                    </button>
                </div>
                <transition name="slide">
                    <div v-show="shortsOpen" class="listing__items">
                        <BaficiCard 
                            v-for="item in shorts"
                            :key="`short-${item.id}`"
                            :item="item" 
                        />
                    </div>
                </transition>
            </div>
        </div>

        <div v-if="activeTab === 'schedule'" class="schedule-container">
          <div class="schedule-empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <h2 class="schedule-empty-title">Programación por confirmar</h2>
            <p class="schedule-empty-desc">La grilla oficial de BAFICI 27 estará disponible una vez publicada por el festival.</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Loader from '~/components/Loader.vue';
import BaficiCard from '~/components/BaficiCard.vue';

const activeTab = ref('films');
const loading = ref(true);
const films = ref({ results: [] });

const featuresOpen = ref(true);
const shortsOpen = ref(true);

const features = computed(() => {
    return films.value?.results?.filter(f => !f.runtime || f.runtime >= 40) || [];
});

const shorts = computed(() => {
    return films.value?.results?.filter(f => f.runtime > 0 && f.runtime < 40) || [];
});

onMounted(async () => {
    try {
        const filmsData = await $fetch('/api/festival/bafici/films?limit=500&sort=title');
        films.value = filmsData;
    } catch (e) {
        console.error('Error fetching BAFICI festival data', e);
    } finally {
        loading.value = false;
    }
});
</script>

<style lang="scss" scoped>
@use '~/assets/css/utilities/variables' as *;

.film-category {
    margin-bottom: 2.5rem;
}

.category-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    border-bottom: 1px solid rgba(139, 233, 253, 0.3);
    padding-bottom: 5px;
    margin-bottom: 15px;
    transition: border-color 0.2s;
    user-select: none;
    
    &:hover {
        border-color: rgba(139, 233, 253, 0.6);
    }
}

.category-title {
    margin: 0 !important;
}

.category-count {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.6);
    margin-left: 10px;
    font-weight: normal;
}

.expand-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
    
    &:hover {
        background: rgba(139, 233, 253, 0.15);
        color: #8BE9FD;
        border-color: rgba(139, 233, 253, 0.3);
    }

    svg {
        width: 20px;
        height: 20px;
        min-width: 20px;
        min-height: 20px;
        display: block;
    }
}

.header-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
}

.switcher-container {
    display: flex;
    top: 3.5rem;
    position: relative;
    justify-content: center;
    gap: 1.5rem;
    align-items: center;
}

.segmented-control {
    position: relative;
    display: flex;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px; 
    padding: 4px;
    height: 48px;
    align-items: center;
    min-width: 300px;
}

.segmented-control input[type="radio"] {
    display: none;
}

.segmented-control label {
    position: relative;
    z-index: 2;
    flex: 1;
    text-align: center;
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    transition: color 0.3s;
    font-weight: 600;
    line-height: 40px;
    white-space: nowrap;
    user-select: none;
}

.segmented-control input:checked + label {
    color: #000;
}

.segmented-control .glider {
    position: absolute;
    top: 4px;
    left: 4px;
    height: calc(100% - 8px);
    width: calc((100% - 8px) / 2);
    background: #8BE9FD; 
    border-radius: 16px;
    z-index: 1;
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.segmented-control .glider.films { transform: translateX(0); }
.segmented-control .glider.schedule { transform: translateX(100%); }


.festival-hero {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    position: relative;
    border-radius: 15px;
    overflow: hidden;
    background-color: transparent;
    display: flex;
    justify-content: center;
    border: 1px solid #8BE9FD;
}

.back-link {
    position: absolute;
    top: 30px;
    left: 30px;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    color: #fff;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.4rem;
    background: rgba(0, 0, 0, 0.6);
    padding: 12px 24px;
    border-radius: 30px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);

    &:hover {
        background: #fff;
        color: #000;
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 8px 25px rgba(0,0,0,0.4);
        border-color: #fff;
    }
    
    svg {
        width: 24px;
        height: 24px;
    }

    @media (max-width: 768px) {
        top: 20px;
        left: 20px;
        font-size: 0.9rem;
        padding: 8px 16px;
        
        svg {
            width: 18px;
            height: 18px;
        }
    }
}

.hero-backdrop {
    width: 100%;
    height: auto;
    position: relative;
    
    img {
        width: 100%;
        height: auto;
        display: block;
        object-fit: contain;
    }

    .hero-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgb(27 77 95 / 7%));
        pointer-events: none;
    }
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px 20px;
}

.loader-container {
    display: flex;
    justify-content: center;
    padding: 3rem;
}

.schedule-container {
    max-width: 1000px;
    margin: 0 auto;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}

.schedule-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 4rem 2rem;
    margin: 2rem auto;
    max-width: 500px;
    background: rgba(139, 233, 253, 0.03);
    border: 1px solid rgba(139, 233, 253, 0.15);
    border-radius: 16px;
}

.schedule-empty-title {
    font-size: 1.6rem;
    font-weight: 700;
    color: #8BE9FD;
    margin: 1.5rem 0 0.8rem;
}

.schedule-empty-desc {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
    margin: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
  max-height: 2000px;
  opacity: 1;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  margin-bottom: 0;
}

@media (max-width: 600px) {
    .schedule-empty-state {
        padding: 3rem 1.5rem;
    }
    .schedule-empty-title {
        font-size: 1.3rem;
    }
    .schedule-empty-desc {
        font-size: 1rem;
    }
}
</style>

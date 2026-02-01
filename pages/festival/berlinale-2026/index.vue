<template>
  <main class="main">
    <div class="container header-container">
      <div class="festival-hero">
        <nuxt-link to="/festival" class="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            All Festivals
        </nuxt-link>
        <a href="https://www.berlinale.de/en/home.html" target="_blank" class="hero-backdrop">
            <img 
              src="/berlinale_backdrop_2026_eng.webp" 
              alt="Berlinale Backdrop"
            />
            <div class="hero-overlay"></div>
        </a>
      </div>

      <div class="switcher-container">


        <div class="segmented-control">
            <input type="radio" id="tab-films" value="films" v-model="activeTab">
            <label for="tab-films" @click="activeTab = 'films'">Premieres</label>
            
            <input type="radio" id="tab-schedule" value="schedule" v-model="activeTab">
            <label for="tab-schedule" @click="activeTab = 'schedule'">Schedule</label>
            
            <div class="glider" :class="activeTab"></div>
        </div>
      </div>
    </div>

    <div class="container">
      <div v-if="loading" class="loader-container">
        <Loader />
      </div>

      <div v-else>
        <!-- Films Tab -->
        <div v-if="activeTab === 'films'" class="films-grid">
            <Listing 
                v-if="films && films.results.length"
                title="Premieres"
                :items="films"
                :show-view-all="false"
            />
        </div>

        <!-- Schedule Tab -->
        <div v-if="activeTab === 'schedule'" class="schedule-container">
            <!-- Coming Soon Message -->
            <div class="coming-soon-container">
                <div class="coming-soon-content">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#FBD378" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-clock"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h5"/><path d="M17.5 17.5 16 16.25V14"/><path d="M22 16a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"/></svg>
                    <h2>Schedule Coming Soon</h2>
                    <p>Specific screening dates and times will be announced starting February 4th, 2026.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Loader from '~/components/Loader.vue';
import Listing from '~/components/Listing.vue';

const activeTab = ref('films');
const loading = ref(true);
const films = ref({ results: [] });
// const schedule = ref([]); // Schedule not used yet

onMounted(async () => {
    try {
        const [filmsData] = await Promise.all([
            $fetch('/api/festival/berlinale/films?limit=200&sort=title'),
            // $fetch('/api/festival/berlinale/schedule') // Keep API ready but don't fail if empty
        ]);
        
        films.value = filmsData;
        // schedule.value = scheduleData.results || [];
        
    } catch (e) {
        console.error('Error fetching festival data', e);
    } finally {
        loading.value = false;
    }
});
</script>

<style lang="scss" scoped>
@use '~/assets/css/utilities/variables' as *;

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
    background: #FBD378;
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
    border: 1px solid #FBD378;
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
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.coming-soon-container {
    text-align: center;
    padding: 3rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    max-width: 600px;
    
    .coming-soon-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        
        h2 {
            font-size: 2rem;
            margin: 0;
            background: linear-gradient(to right, #FBD378, #fff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        p {
            font-size: 1.2rem;
            color: #aaa;
            line-height: 1.6;
            margin: 0;
        }
    }
}
</style>

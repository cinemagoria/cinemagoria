<template>
  <main class="main">
    <div class="container header-container">
      <div class="festival-hero">
        <nuxt-link to="/festival" class="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Festivales
        </nuxt-link>
        <a href="https://iffr.com/en/programme/2026" target="_blank" class="hero-backdrop">
            <img 
              src="/festivals/rotterdam/rotterdam_backdrop_2026_es.webp" 
              alt="Rotterdam Backdrop"
            />
            <div class="hero-overlay"></div>
        </a>
      </div>

      <div class="switcher-container">


        <div class="segmented-control">
            <input type="radio" id="tab-info" value="info" v-model="activeTab">
            <label for="tab-info" @click="activeTab = 'info'">Info</label>

            <input type="radio" id="tab-films" value="films" v-model="activeTab">
            <label for="tab-films" @click="activeTab = 'films'">Catálogo</label>
            
            <input type="radio" id="tab-schedule" value="schedule" v-model="activeTab">
            <label for="tab-schedule" @click="activeTab = 'schedule'">Calendario</label>
            
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
                    <button class="expand-btn" :aria-label="featuresOpen ? 'Ocultar' : 'Expandir'">
                        <svg v-if="featuresOpen" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-chevrons-down-up-icon lucide-list-chevrons-down-up"><path d="M3 5h8"/><path d="M3 12h8"/><path d="M3 19h8"/><path d="m15 5 3 3 3-3"/><path d="m15 19 3-3 3 3"/></svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-collapse-icon lucide-list-collapse"><path d="M10 5h11"/><path d="M10 12h11"/><path d="M10 19h11"/><path d="m3 10 3-3-3-3"/><path d="m3 20 3-3-3-3"/></svg>
                    </button>
                </div>
                <transition name="slide">
                    <div v-show="featuresOpen" class="listing__items">
                        <RotterdamCard 
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
                    <button class="expand-btn" :aria-label="shortsOpen ? 'Ocultar' : 'Expandir'">
                        <svg v-if="shortsOpen" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-chevrons-down-up-icon lucide-list-chevrons-down-up"><path d="M3 5h8"/><path d="M3 12h8"/><path d="M3 19h8"/><path d="m15 5 3 3 3-3"/><path d="m15 19 3-3 3 3"/></svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-collapse-icon lucide-list-collapse"><path d="M10 5h11"/><path d="M10 12h11"/><path d="M10 19h11"/><path d="m3 10 3-3-3-3"/><path d="m3 20 3-3-3-3"/></svg>
                    </button>
                </div>
                <transition name="slide">
                    <div v-show="shortsOpen" class="listing__items">
                        <RotterdamCard 
                            v-for="item in shorts"
                            :key="`short-${item.id}`"
                            :item="item" 
                        />
                    </div>
                </transition>
            </div>
        </div>

        <div v-if="activeTab === 'schedule'" class="schedule-container">
          <div v-for="(dayScreenings, date) in groupedScreenings" :key="date" class="schedule-day">
            <div class="day-header" @click="toggleDay(date)">
                <h2>{{ formatDate(date) }}</h2>
                <div class="chevron" :class="{ 'closed': !isOpen(date) }">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                </div>
            </div>
            
            <transition name="slide">
                <div v-show="isOpen(date)" class="screenings-list">
                  <div v-for="screening in dayScreenings" :key="screening.id" class="screening-card">
                     <div class="time-block">
                        <span class="time">{{ formatTime(screening.start_time) }}</span>
                        <span class="timezone">{{ screening.timezone }}</span>
                     </div>
                     
                      <div class="film-info">
                         <component 
                            :is="isSafeUrl(screening.film.source_url) ? 'a' : 'span'"
                            :href="isSafeUrl(screening.film.source_url) ? screening.film.source_url : ''"
                            :target="isSafeUrl(screening.film.source_url) ? '_blank' : ''"
                            class="film-title"
                            :class="{'no-link': !isSafeUrl(screening.film.source_url)}"
                         >
                            {{ screening.film.title }}
                         </component>
                         <div class="film-meta">
                             <span v-if="screening.film.director">Directed by {{ screening.film.director }}</span>
                             <span v-if="screening.film.director && screening.film.runtime"> • </span>
                             <span v-if="screening.film.runtime">{{ screening.film.runtime }} min</span>
                             <span v-if="screening.venue"> • {{ screening.venue }}</span>
                         </div>
                         <div class="tags">
                             <span v-if="screening.is_in_person" class="tag in-person">Presencial</span>
                             <span v-if="screening.is_online" class="tag online">Online</span>
                             <span v-if="screening.is_sold_out" class="tag sold-out">Agotado</span>
                         </div>
                      </div>
                      
                      <div class="poster-mini">
                          <img 
                            v-if="screening.film.poster_path" 
                            :src="screening.film.poster_path" 
                            alt="Poster" 
                            loading="lazy" 
                            @error="$event.target.src = '/placeholders/image_not_found_yet_es.webp'"
                          />
                          <img v-else src="/placeholders/image_not_found_yet_es.webp" alt="No Poster" />
                      </div>
                  </div>
                </div>
            </transition>
          </div>
        </div>

        <div v-if="activeTab === 'info'" class="info-container">
          <div class="carousel-wrapper">
            <button class="carousel-arrow left" @click="prevSlide" aria-label="Anterior">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>

            <div class="carousel-track">
              <transition :name="slideDirection" mode="out-in">
                <div class="carousel-card" :key="infoSlide">
                  <!-- Slide 0: Venta de Entradas -->
                  <template v-if="infoSlide === 0">
                    <div class="carousel-card-header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                      <h3>Venta de Entradas</h3>
                    </div>
                    <p class="carousel-desc">La venta de entradas para IFFR 2026 comienza el <strong>jueves 15 de enero a las 20:00</strong> a través de <a href="https://iffr.com" target="_blank" class="accent-link">IFFR.com</a>.</p>
                    <ul class="bullet-list">
                      <li>Iniciar sesión o crear una cuenta en IFFR.com</li>
                      <li>Seleccionar películas</li>
                      <li>Pagar con iDEAL o tarjeta de crédito</li>
                      <li>Recibir confirmación y entrada electrónica por email</li>
                    </ul>
                  </template>

                  <!-- Slide 1: Precios -->
                  <template v-if="infoSlide === 1">
                    <div class="carousel-card-header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                      <h3>Precios 2026</h3>
                    </div>
                    <ul class="price-list">
                      <li><span class="price-label">Entrada general</span><span class="price-value">€13,50</span></li>
                      <li><span class="price-label">Cortos y mediometrajes</span><span class="price-value">€9,50</span></li>
                      <li><span class="price-label">On Demand</span><span class="price-value">€8,50</span></li>
                      <li><span class="price-label">Big Talks</span><span class="price-value">€13,50</span></li>
                      <li><span class="price-label">Tiger Talks</span><span class="price-value">€5,00</span></li>
                      <li><span class="price-label">Art Directions (Instalaciones)</span><span class="price-value">€7,50</span></li>
                      <li><span class="price-label">Art Directions (Inmersiva)</span><span class="price-value">€12,50</span></li>
                      <li><span class="price-label">Noche de Apertura / Clausura</span><span class="price-value">€25,00</span></li>
                    </ul>
                  </template>

                  <!-- Slide 2: Cuenta y Programa -->
                  <template v-if="infoSlide === 2">
                    <div class="carousel-card-header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                      <h3>Cuenta y Programa</h3>
                    </div>
                    <p class="carousel-desc">Se recomienda crear una cuenta en IFFR.com antes de explorar el programa. Permite comprar entradas, guardar favoritas y crear una agenda personalizada.</p>
                    <ul class="bullet-list">
                      <li>Publicación del programa: <strong>9 de enero</strong></li>
                      <li>Revista del festival disponible desde: <strong>10 de enero</strong></li>
                      <li>Versión digital disponible: <strong>17 de enero</strong></li>
                      <li>PDF descargable en IFFR.com</li>
                    </ul>
                  </template>

                  <!-- Slide 3: Acceso y Soporte -->
                  <template v-if="infoSlide === 3">
                    <div class="carousel-card-header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      <h3>Acceso y Soporte</h3>
                    </div>
                    <ul class="bullet-list">
                      <li>Entradas se agregan a tu cuenta tras la compra</li>
                      <li>Email de confirmación con enlace al e-ticket</li>
                      <li>Acceso mediante código QR (no es necesario imprimir)</li>
                      <li>Entradas con descuento requieren acreditación válida</li>
                      <li>Los miembros Tiger pueden usar su pase digital</li>
                    </ul>
                    <div class="promo-box">
                      <span class="promo-tag">PRENSA</span>
                      <p>Reserva de entradas para prensa e industria abre el <strong>miércoles 14 de enero a las 10:00</strong>. Puntos de asistencia en <strong>de Doelen</strong> y <strong>LantarenVenster</strong>.</p>
                    </div>
                  </template>
                </div>
              </transition>
            </div>

            <button class="carousel-arrow right" @click="nextSlide" aria-label="Siguiente">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

          <div class="carousel-dots">
            <button v-for="i in 4" :key="i" class="dot" :class="{ active: infoSlide === i - 1 }" @click="goToSlide(i - 1)" :aria-label="`Diapositiva ${i}`"></button>
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
import RotterdamCard from '~/components/RotterdamCard.vue';

const API_FILM_LIMIT = 1000;

const isSafeUrl = (url) => {
    if (!url) return false;
    try {
        const parsed = new URL(url, window.location.origin);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
};

const activeTab = ref('films');
const infoSlide = ref(0);
const slideDirection = ref('carousel-next');
const prevSlide = () => { slideDirection.value = 'carousel-prev'; infoSlide.value = (infoSlide.value - 1 + 4) % 4; };
const nextSlide = () => { slideDirection.value = 'carousel-next'; infoSlide.value = (infoSlide.value + 1) % 4; };
const goToSlide = (i) => { slideDirection.value = i > infoSlide.value ? 'carousel-next' : 'carousel-prev'; infoSlide.value = i; };
const loading = ref(true);
const films = ref({ results: [] });
const schedule = ref([]);
const openDays = ref(new Set());

const featuresOpen = ref(true);
const shortsOpen = ref(true);

const features = computed(() => {
    return films.value?.results?.filter(f => !f.runtime || f.runtime >= 40) || [];
});

const shorts = computed(() => {
    return films.value?.results?.filter(f => f.runtime > 0 && f.runtime < 40) || [];
});

const formatDate = (dateStr) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
};

const formatTime = (timeStr) => {
    return new Date(timeStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const groupedScreenings = computed(() => {
    if (!schedule.value) return {};
    const groups = {};
    schedule.value.forEach(s => {
        const dateKey = s.start_time.split('T')[0];
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(s);
    });
    return Object.keys(groups).sort().reduce((obj, key) => {
        obj[key] = groups[key];
        return obj;
    }, {});
});

const toggleDay = (date) => {
    if (openDays.value.has(date)) {
        openDays.value.delete(date);
    } else {
        openDays.value.add(date);
    }
}

const isOpen = (date) => openDays.value.has(date);

onMounted(async () => {
    try {
        const [filmsData, scheduleData] = await Promise.all([
            $fetch(`/api/festival/rotterdam/films?limit=${API_FILM_LIMIT}&sort=title`),
            $fetch('/api/festival/rotterdam/schedule')
        ]);
        
        films.value = filmsData;
        schedule.value = scheduleData.results || [];
        
        if (schedule.value.length > 0) {
            const dates = new Set(schedule.value.map(s => s.start_time.split('T')[0]));
            dates.forEach(d => openDays.value.add(d));
        }
        
    } catch (e) {
        console.error('Error fetching festival data', e);
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

.buy-tickets-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #8BE9FD;
    color: #000;
    padding: 0 20px;
    height: 40px;
    border-radius: 16px;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.1rem;
    transition: transform 0.2s, opacity 0.2s;
    
    &:hover {
        transform: scale(1.05);
        opacity: 0.9;
    }
    
    span {
        white-space: nowrap;
    }
}

.segmented-control {
    position: relative;
    display: flex;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px; 
    padding: 4px;
    height: 48px;
    align-items: center;
    min-width: 420px;
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
    width: calc((100% - 8px) / 3);
    background: #8BE9FD;
    border-radius: 16px;
    z-index: 1;
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.segmented-control .glider.info { transform: translateX(0); }
.segmented-control .glider.films { transform: translateX(100%); }
.segmented-control .glider.schedule { transform: translateX(200%); }


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

.schedule-container, .info-container {
    max-width: 1000px;
    margin: 0 auto;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}

.day-header {
    font-size: 1.8rem;
    color: #fff;
    border-bottom: 1px solid #333;
    padding-bottom: 0.5rem;
    margin-top: 3rem;
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    user-select: none;
    
    h2 {
        font-size: 1.8rem;
        margin: 0;
    }
    
    .chevron {
        transition: transform 0.3s ease;
        
        &.closed {
            transform: rotate(-90deg);
        }
    }
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

.screening-card {
    display: flex;
    background: #0a161b;
    border: 1px solid #8BE9FD;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    gap: 1.5rem;
    transition: transform 0.2s;
}

.time-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 80px;
    border-right: 1px solid #333;
    padding-right: 1.5rem;
    
    .time {
        font-size: 1.2rem;
        font-weight: 700;
        color: #fff;
    }
    .timezone {
        font-size: 0.92rem;
        color: #888;
    }
}

.film-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    .film-title {
        font-size: 1.6rem;
        font-weight: 700;
        color: #fff;
        text-decoration: none;
        margin-bottom: 0.5rem;
        
        &:hover {
            color: #8BE9FD;
        }
    }
    
    .film-meta {
        font-size: 1.05rem;
        color: #aaa;
        margin-bottom: 0.8rem;
    }
}

.tags {
    display: flex;
    gap: 0.5rem;
    
    .tag {
        font-size: 0.75rem;
        padding: 4px 8px;
        border-radius: 4px;
        font-weight: 600;
        text-transform: uppercase;
        
        &.in-person { background: rgba(52, 152, 219, 0.2); }
        &.online { background: rgba(46, 204, 113, 0.2); color: #2ecc71; }
        &.sold-out { background: rgba(231, 76, 60, 0.2); color: #e74c3c; }
    }
}

.poster-mini {
    width: 60px;
    height: 90px;
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 4px;
    }
}

@media (max-width: 600px) {
    .screening-card {
        flex-direction: column; 
        gap: 1rem;
    }
    .time-block {
        border-right: none;
        border-bottom: 1px solid #333;
        padding-right: 0;
        padding-bottom: 1rem;
        flex-direction: row;
        gap: 1rem;
        width: 100%;
    }
    .poster-mini {
        display: none;
    }
}

/* ── Carousel ─────────────────────────────── */
.carousel-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.carousel-track {
  flex: 1;
  min-height: 340px;
  overflow: hidden;
  position: relative;
}

.carousel-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(139, 233, 253, 0.18);
  border-radius: 20px;
  padding: 2.2rem 2.5rem;
  backdrop-filter: blur(12px);
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.8;
  min-height: 300px;

  strong { color: #fff; }
}

.carousel-card-header {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 1.4rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(139, 233, 253, 0.14);

  h3 {
    font-size: 1.35rem;
    font-weight: 700;
    color: #8BE9FD;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

.carousel-desc {
  font-size: 1.08rem;
  margin-bottom: 1rem;
}

.carousel-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(139, 233, 253, 0.25);
  background: rgba(0, 0, 0, 0.4);
  color: #8BE9FD;
  cursor: pointer;
  transition: all 0.25s ease;
  flex-shrink: 0;
  backdrop-filter: blur(6px);

  &:hover {
    background: rgba(139, 233, 253, 0.15);
    border-color: #8BE9FD;
    transform: scale(1.1);
  }
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 1.4rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: rgba(139, 233, 253, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;

  &.active {
    background: #8BE9FD;
    box-shadow: 0 0 10px rgba(139, 233, 253, 0.5);
    transform: scale(1.25);
  }

  &:hover:not(.active) {
    background: rgba(139, 233, 253, 0.45);
  }
}

.carousel-next-enter-active,
.carousel-next-leave-active,
.carousel-prev-enter-active,
.carousel-prev-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-next-enter-from { opacity: 0; transform: translateX(60px); }
.carousel-next-leave-to   { opacity: 0; transform: translateX(-60px); }
.carousel-prev-enter-from { opacity: 0; transform: translateX(-60px); }
.carousel-prev-leave-to   { opacity: 0; transform: translateX(60px); }

@media (max-width: 600px) {
  .carousel-wrapper { gap: 0.5rem; }
  .carousel-card { padding: 1.5rem 1.2rem; min-height: 280px; }
  .carousel-card-header h3 { font-size: 1.15rem; }
  .carousel-arrow { width: 36px; height: 36px; }
  .carousel-arrow svg { width: 18px; height: 18px; }
}

/* ── Shared card content styles ───────────── */
.price-list {
  list-style: none; padding: 0; margin: 1rem 0;
  li { display: flex; justify-content: space-between; align-items: center; padding: 0.65rem 0; border-bottom: 1px dashed rgba(255,255,255,0.08); &:last-child { border: none; } }
  .price-label { color: rgba(255,255,255,0.7); font-size: 1.05rem; }
  .price-value { color: #8BE9FD; font-weight: 700; font-size: 1.1rem; }
}

.promo-box {
  background: rgba(139, 233, 253, 0.08);
  border-left: 3px solid #8BE9FD;
  border-radius: 8px;
  padding: 1rem 1.2rem;
  margin-top: 1rem;
  position: relative;
  .promo-tag { position: absolute; top: 0; right: 0; background: #8BE9FD; color: #000; font-size: 0.65rem; font-weight: 800; padding: 3px 10px; border-bottom-left-radius: 6px; }
  p { margin: 0; font-size: 1rem; }
}

.bullet-list {
  padding-left: 1.4rem; font-size: 1.02rem;
  li { margin-bottom: 1rem; line-height: 1.7; &::marker { color: #8BE9FD; } }
}

.accent-link {
  color: #8BE9FD; text-decoration: none; font-weight: 600; border-bottom: 1px solid transparent; transition: border-color 0.2s;
  &:hover { border-color: #8BE9FD; }
}
</style>

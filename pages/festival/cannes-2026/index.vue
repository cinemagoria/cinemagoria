<template>
  <main class="main">
    <div class="container header-container">
      <div class="festival-hero">
        <nuxt-link to="/festival" class="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Volver a Festivales
        </nuxt-link>
        <a href="https://www.festival-cannes.com" target="_blank" rel="noopener noreferrer" class="hero-backdrop">
            <img 
              src="/festivals/cannes/cannes_backdrop_2026_es.webp" 
              alt="Festival de Cannes 2026"
            />
            <div class="hero-overlay"></div>
        </a>
      </div>

      <div class="switcher-container">


        <div class="segmented-control">
            <input type="radio" id="tab-info" value="info" v-model="activeTab">
            <label for="tab-info" @click="activeTab = 'info'">Info</label>

            <input type="radio" id="tab-films" value="films" v-model="activeTab">
            <label for="tab-films" @click="activeTab = 'films'">Selección Oficial</label>

            <input type="radio" id="tab-critics" value="critics" v-model="activeTab">
            <label for="tab-critics" @click="activeTab = 'critics'">Secciones Paralelas</label>

            <input type="radio" id="tab-schedule" value="schedule" v-model="activeTab">
            <label for="tab-schedule" @click="activeTab = 'schedule'">Horarios</label>

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
            <div class="disclaimer-bar"><FestivalDataDisclaimer /></div>
            <div
              v-for="cat in orderedCategories"
              :key="cat"
              class="film-category"
            >
                <div class="category-header" @click="toggleCategoryOpen(cat)">
                    <h2 class="listing__title category-title">
                        {{ categoryLabel(cat) }}
                        <span class="category-count">({{ (filmsByCategory[cat] || []).length }})</span>
                    </h2>
                    <button class="expand-btn" :aria-label="isCategoryOpen(cat) ? 'Collapse' : 'Expand'">
                        <svg v-if="isCategoryOpen(cat)" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-chevrons-down-up-icon lucide-list-chevrons-down-up"><path d="M3 5h8"/><path d="M3 12h8"/><path d="M3 19h8"/><path d="m15 5 3 3 3-3"/><path d="m15 19 3-3 3 3"/></svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-collapse-icon lucide-list-collapse"><path d="M10 5h11"/><path d="M10 12h11"/><path d="M10 19h11"/><path d="m3 10 3-3-3-3"/><path d="m3 20 3-3-3-3"/></svg>
                    </button>
                </div>
                <transition name="slide">
                    <div v-show="isCategoryOpen(cat)" class="listing__items">
                        <CannesCard
                            v-for="item in (filmsByCategory[cat] || [])"
                            :key="`${cat}-${item.id}`"
                            :item="item"
                            :category="cat"
                        />
                    </div>
                </transition>
            </div>
        </div>

                        <div v-if="activeTab === 'critics'" class="films-grid">
            <div class="disclaimer-bar"><FestivalDataDisclaimer /></div>
            <div
              v-for="ps in parallelSections"
              :key="ps.key"
              class="film-category"
            >
                <div class="category-header" @click="toggleParallelOpen(ps.key)">
                    <h2 class="listing__title category-title">
                        {{ ps.label }}
                        <span class="category-count">({{ ps.films.length }})</span>
                    </h2>
                    <button class="expand-btn" :aria-label="isParallelOpen(ps.key) ? 'Colapsar' : 'Expandir'">
                        <svg v-if="isParallelOpen(ps.key)" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-chevrons-down-up-icon lucide-list-chevrons-down-up"><path d="M3 5h8"/><path d="M3 12h8"/><path d="M3 19h8"/><path d="m15 5 3 3 3-3"/><path d="m15 19 3-3 3 3"/></svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-collapse-icon lucide-list-collapse"><path d="M10 5h11"/><path d="M10 12h11"/><path d="M10 19h11"/><path d="m3 10 3-3-3-3"/><path d="m3 20 3-3-3-3"/></svg>
                    </button>
                </div>
                <transition name="slide">
                    <div v-show="isParallelOpen(ps.key)">
                        <div v-if="ps.films.length > 0" class="listing__items">
                            <CannesCard
                                v-for="item in ps.films"
                                :key="`${ps.key}-${item.id}`"
                                :item="item"
                                :category="ps.categoryProp"
                            />
                        </div>
                        <div v-else class="parallel-empty">{{ ps.emptyText }}</div>
                    </div>
                </transition>
            </div>
        </div>

        <div v-if="activeTab === 'schedule' && showSchedulePending" class="schedule-pending">
          <div class="schedule-pending-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="schedule-pending-icon" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
            <h2 class="schedule-pending-title">Horarios oficiales pendientes</h2>
            <p class="schedule-pending-text">
              El festival aún no ha publicado los horarios y sedes completos. Cuando el programa oficial esté disponible, las proyecciones aparecerán aquí automáticamente.
            </p>
          </div>
        </div>

        <div v-else-if="activeTab === 'schedule'" class="schedule-container">
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
                         <nuxt-link
                            v-if="screening.film.tmdb_id"
                            :to="{ name: 'movie-id', params: { id: screening.film.tmdb_id } }"
                            class="film-title"
                         >
                            {{ screening.film.title }}
                         </nuxt-link>
                         <span v-else class="film-title">{{ screening.film.title }}</span>
                         <div class="film-meta">
                             <span v-if="screening.film.director">Dirección: {{ screening.film.director }}</span>
                             <span v-if="screening.film.director && screening.film.runtime"> • </span>
                             <span v-if="screening.film.runtime">{{ screening.film.runtime }} min</span>
                         </div>
                         <div v-if="screening.venue" class="venue-info">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
                            {{ screening.venue }}
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
                            @error="$event.target.src = '/placeholders/image_not_found_yet.webp'"
                          />
                          <img v-else src="/placeholders/image_not_found_yet.webp" alt="No Poster" />
                      </div>
                  </div>
                </div>
            </transition>
          </div>
        </div>

        <div v-if="activeTab === 'info'" class="info-container">
          <div class="carousel-wrapper">
            <button class="carousel-arrow left" @click="prevSlide" aria-label="Previous">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>

            <div class="carousel-track">
              <transition :name="slideDirection" mode="out-in">
                <div class="carousel-card" :key="infoSlide">
                  <!-- Slide 0: Información general + YouTube -->
                  <template v-if="infoSlide === 0">
                    <div class="carousel-card-header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      <h3>Información general</h3>
                    </div>
                    <div class="youtube-embed">
                      <iframe src="https://www.youtube.com/embed/2B5Uh_8ixsE" title="Festival de Cannes 2026" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                    <p class="carousel-desc"><strong>Sitio web:</strong> <a href="https://www.festival-cannes.com" target="_blank" rel="noopener noreferrer" class="accent-link">festival-cannes.com</a></p>
                    <p class="carousel-desc"><strong>Fechas:</strong> 12–23 de mayo de 2026 (Festival) · 12–20 de mayo de 2026 (Marché du Film).</p>
                    <p class="carousel-desc">El <strong>Festival de Cannes</strong> es uno de los eventos cinematográficos más prestigiosos del mundo. Cinemagoria muestra los títulos de la selección oficial cuando hay datos disponibles.</p>
                  </template>

                  <!-- Slide 1: Acreditación y recogida de pase -->
                  <template v-if="infoSlide === 1">
                    <div class="carousel-card-header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                      <h3>Acreditación y recogida de pase</h3>
                    </div>
                    <p class="carousel-desc">Recoge tu pase en la <strong>Gare Maritime</strong> (a la derecha del Casino Croisette) o en los dispensadores automáticos de La Pantiero. Presenta tu confirmación de acreditación y tu identificación.</p>
                    <p class="carousel-desc"><strong>Horario de recogida:</strong> 11–12 de mayo de 8:00 a 20:00 · 13–23 de mayo de 9:00 a 18:00.</p>
                    <p class="carousel-desc">Desde principios de mayo de 2026, utiliza la sección <strong>"My Cannes"</strong> en la web del festival para acceder a entradas, admisiones, horarios y mapas.</p>
                    <p class="carousel-desc">Cinemagoria no vende acreditaciones; ofrecemos descubrimiento y contexto de programación.</p>
                  </template>

                  <!-- Slide 2: Horarios y accesos -->
                  <template v-if="infoSlide === 2">
                    <div class="carousel-card-header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      <h3>Horarios y accesos</h3>
                    </div>
                    <ul class="bullet-list">
                      <li><strong>Entrada principal:</strong> 9:00 – 0:30 (desde las 8:15 para proyecciones matutinas en el Palais)</li>
                      <li><strong>Entrada Mediterráneo:</strong> 8:30 – 0:30 · 8:00 – 20:00 para expositores</li>
                      <li><strong>Jetée Albert-Edouard:</strong> 9:00 – 18:30 (pases profesionales)</li>
                      <li><strong>Village International:</strong> 8:00 – 20:00 (expositores) · 9:00 – 18:30 (profesionales)</li>
                      <li><strong>Entrada Riviera (12–20 mayo):</strong> 9:00 – 19:00 (Festival y Prensa) · 9:00 – 22:45 (Marché)</li>
                    </ul>
                  </template>

                  <!-- Slide 3: Sedes y cómo llegar -->
                  <template v-if="infoSlide === 3">
                    <div class="carousel-card-header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
                      <h3>Sedes y cómo llegar</h3>
                    </div>
                    <div class="venue-list">
                      <div class="venue-item"><strong>Palais des Festivals</strong><span>Núcleo principal — Cannes, Francia</span></div>
                      <div class="venue-item"><strong>Village International</strong><span>Pabellones y zona de expositores</span></div>
                      <div class="venue-item"><strong>Cinéma de la Plage</strong><span>Proyecciones al aire libre en la playa</span></div>
                    </div>
                    <ul class="bullet-list">
                      <li><strong>En tren:</strong> ~5 h 30 min en TGV desde París</li>
                      <li><strong>En avión:</strong> Vía aeropuerto de Niza — Bus Express 81 hasta estación SNCF de Cannes (45 min, 19,50 €)</li>
                      <li><strong>En taxi:</strong> Aeropuerto de Niza → Cannes ~88 € · Taxi Cannes: +33 (0)4 93 99 27 27</li>
                      <li><strong>PalmBus gratuito:</strong> Muestra tu código QR de "My Cannes" para transporte público gratis</li>
                    </ul>
                  </template>

                  <!-- Slide 4: Seguridad e información útil -->
                  <template v-if="infoSlide === 4">
                    <div class="carousel-card-header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      <h3>Seguridad e información útil</h3>
                    </div>
                    <p class="carousel-desc">Las entradas están sujetas a <strong>controles de seguridad Vigipirate</strong>. Se prohíben armas, latas de aluminio, botellas de vidrio y mensajes políticos en la zona del Festival.</p>
                    <ul class="bullet-list">
                      <li><strong>WiFi:</strong> Gratis para pases Marché y Prensa; 15 €/día o 95 €/12 días para otros</li>
                      <li><strong>Consigna:</strong> Barrière Bistingo — 10–23 mayo, 7:30 – 0:30</li>
                      <li><strong>Objetos perdidos:</strong> Gare Maritime — +33 (0)4 92 98 72 24</li>
                      <li><strong>Emergencias:</strong> Ambulancia 15 · Bomberos 18 · Policía 17 · Seguridad festival: +33 (0)4 92 99 87 77</li>
                    </ul>
                  </template>
                </div>
              </transition>
            </div>

            <button class="carousel-arrow right" @click="nextSlide" aria-label="Next">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

          <div class="carousel-dots">
            <button v-for="i in totalSlides" :key="i" class="dot" :class="{ active: infoSlide === i - 1 }" @click="goToSlide(i - 1)" :aria-label="`Slide ${i}`"></button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import Loader from '~/components/Loader.vue';
import FestivalDataDisclaimer from '~/components/FestivalDataDisclaimer.vue';
import CannesCard from '~/components/CannesCard.vue';

const CATEGORY_ORDER = [
    'COMPETITION',
    'OUT OF COMPETITION',
    'UN CERTAIN REGARD',
    'SPECIAL SCREENINGS',
    'MIDNIGHT SCREENINGS',
    'CANNES PREMIERE',
];

const CATEGORY_LABELS_ES = {
    COMPETITION: 'Competición',
    'OUT OF COMPETITION': 'Fuera de competición',
    'UN CERTAIN REGARD': 'Un Certain Regard',
    'SPECIAL SCREENINGS': 'Proyecciones especiales',
    'MIDNIGHT SCREENINGS': 'Medianoche',
    'CANNES PREMIERE': 'Cannes Première',
    OTHER: 'Otros'
};

const activeTab = ref('films');
const infoSlide = ref(0);
const slideDirection = ref('carousel-next');
const totalSlides = 5;
const prevSlide = () => { slideDirection.value = 'carousel-prev'; infoSlide.value = (infoSlide.value - 1 + totalSlides) % totalSlides; };
const nextSlide = () => { slideDirection.value = 'carousel-next'; infoSlide.value = (infoSlide.value + 1) % totalSlides; };
const goToSlide = (i) => { slideDirection.value = i > infoSlide.value ? 'carousel-next' : 'carousel-prev'; infoSlide.value = i; };
const loading = ref(true);
const films = ref({ results: [] });
const scheduleResponse = ref(null);
const openDays = ref(new Set());
const categoryOpen = ref({});
const criticsOpen = ref(true);
const toggleCriticsOpen = () => { criticsOpen.value = !criticsOpen.value; };

const filmsByCategory = computed(() => {
    const map = Object.fromEntries(CATEGORY_ORDER.map((c) => [c, []]));
    map.OTHER = [];
    for (const f of films.value?.results || []) {
        const key = String(f.section || f.category || '').toUpperCase().trim();
        if (key.includes('CRITICS')) continue;
        if (key.includes('QUINZAINE') || key.includes('DIRECTORS') || key.includes('FORTNIGHT')) continue;
        if (key.includes('ACID')) continue;
        if (key && map[key]) map[key].push(f);
        else map.OTHER.push(f);
    }
    return map;
});

const criticsWeekFilms = computed(() => {
    return (films.value?.results || []).filter((f) => {
        const key = String(f.section || f.category || '').toUpperCase().trim();
        return key.includes('CRITICS');
    });
});

const quinzaineFilms = computed(() => {
    return (films.value?.results || []).filter((f) => {
        const key = String(f.section || f.category || '').toUpperCase().trim();
        return key.includes('QUINZAINE') || key.includes('DIRECTORS') || key.includes('FORTNIGHT');
    });
});

const acidFilms = computed(() => {
    return (films.value?.results || []).filter((f) => {
        const key = String(f.section || f.category || '').toUpperCase().trim();
        return key.includes('ACID');
    });
});

const parallelOpen = ref({ critics: true, quinzaine: true, acid: true });
const isParallelOpen = (k) => parallelOpen.value[k] !== false;
const toggleParallelOpen = (k) => { parallelOpen.value = { ...parallelOpen.value, [k]: !isParallelOpen(k) }; };
const parallelSections = computed(() => [
    { key: 'critics', label: "Semana de la Crítica", films: criticsWeekFilms.value, categoryProp: "CRITICS' CHOICE", emptyText: "Aún no hay selecciones de la Semana de la Crítica." },
    { key: 'quinzaine', label: "Quincena de Cineastas", films: quinzaineFilms.value, categoryProp: 'QUINZAINE', emptyText: "Aún no hay selecciones de la Quincena de Cineastas." },
    { key: 'acid', label: "ACID", films: acidFilms.value, categoryProp: 'ACID', emptyText: "Aún no hay selecciones de ACID." },
]);

const orderedCategories = computed(() => {
    const out = CATEGORY_ORDER.filter((c) => (filmsByCategory.value[c] || []).length > 0);
    if ((filmsByCategory.value.OTHER || []).length > 0) out.push('OTHER');
    return out;
});

function categoryLabel (cat) {
    return CATEGORY_LABELS_ES[cat] || cat;
}

function isCategoryOpen (cat) {
    return categoryOpen.value[cat] !== false;
}

function toggleCategoryOpen (cat) {
    categoryOpen.value = { ...categoryOpen.value, [cat]: !isCategoryOpen(cat) };
}

const schedule = computed(() => scheduleResponse.value?.results || []);
const showSchedulePending = computed(() => schedule.value.length === 0);

const formatDate = (dateStr) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-ES', options);
};

const formatTime = (timeStr) => {
    return new Date(timeStr).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

const groupedScreenings = computed(() => {
    if (!schedule.value?.length) return {};
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
};

const isOpen = (date) => openDays.value.has(date);

onMounted(async () => {
    try {
        const [filmsData, sched] = await Promise.all([
            $fetch('/api/festival/cannes/films?limit=500'),
            $fetch('/api/festival/cannes/schedule')
        ]);

        films.value = filmsData;
        scheduleResponse.value = sched;

        if (schedule.value.length > 0) {
            const dates = new Set(schedule.value.map(s => s.start_time.split('T')[0]));
            dates.forEach(d => openDays.value.add(d));
        }

        await nextTick();
        const open = {};
        orderedCategories.value.forEach((c) => { open[c] = true; });
        categoryOpen.value = open;
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
    width: 100%;
    padding: 0 1rem;
    box-sizing: border-box;
}

.segmented-control {
    position: relative;
    display: flex;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px; 
    padding: 4px;
    height: 48px;
    align-items: center;
    width: 650px;
    max-width: calc(100vw - 40px);
}

@media (max-width: 768px) {
    .segmented-control {
        border-radius: 12px;
        height: 44px;
        width: calc(100vw - 40px);
    }
    .segmented-control label {
        font-size: 0.85rem !important;
        line-height: 36px !important;
        padding: 0 2px;
        white-space: nowrap;
    }
    .segmented-control label[for="tab-critics"] {
        font-size: 0 !important;
    }
    .segmented-control label[for="tab-critics"]::after {
        content: "Crítica";
        font-size: 0.85rem;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .segmented-control .glider {
        border-radius: 10px !important;
    }
}

.segmented-control input[type="radio"] {
    display: none;
}

.segmented-control label {
    position: relative;
    z-index: 2;
    flex: 1;
    text-align: center;
    font-size: 1.05rem;
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
    width: calc((100% - 8px) / 4);
    background: #8BE9FD; 
    border-radius: 16px;
    z-index: 1;
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.segmented-control .glider.info { transform: translateX(0); }
.segmented-control .glider.films { transform: translateX(100%); }
.segmented-control .glider.critics { transform: translateX(200%); }
.segmented-control .glider.schedule { transform: translateX(300%); }


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

.buy-tickets-btn {
    position: absolute;
    top: 30px;
    right: 30px;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #8BE9FD;
    color: #000;
    padding: 12px 24px;
    border-radius: 30px;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.1rem;
    transition: transform 0.2s, opacity 0.2s;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    
    &:hover {
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 8px 25px rgba(0,0,0,0.4);
        background: #fff;
    }

    &.sold-out {
        background: rgba(100, 100, 100, 0.6);
        color: #ddd;
        border-color: #666;
        cursor: not-allowed;
        
        &:hover {
            transform: none;
            background: rgba(100, 100, 100, 0.6);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
    }
    
    @media (max-width: 768px) {
        top: 20px;
        right: 20px;
        font-size: 0.9rem;
        padding: 8px 16px;
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

.schedule-pending {
    max-width: 640px;
    margin: 2rem auto 3rem;
    padding: 0 1rem;
}

.schedule-pending-inner {
    text-align: center;
    padding: 2.5rem 2rem;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(139, 233, 253, 0.25);
    border-radius: 16px;
    backdrop-filter: blur(10px);
}

.schedule-pending-icon {
    display: block;
    margin: 0 auto 1.25rem;
}

.schedule-pending-title {
    font-size: 1.45rem;
    font-weight: 700;
    color: #8BE9FD;
    margin: 0 0 1rem;
}

.schedule-pending-text {
    font-size: 1.05rem;
    line-height: 1.65;
    color: rgba(255, 255, 255, 0.78);
    margin: 0;
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
    
    .venue-info {
        font-size: 1.25rem;
        color: #ccc;
        margin-bottom: 0.8rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        
        svg {
            min-width: 18px;
        }
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

.venue-list {
  display: flex; flex-direction: column; gap: 0.5rem; margin: 0.5rem 0;
  .venue-item { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); span { color: rgba(255,255,255,0.5); font-size: 0.95rem; } strong { color: #fff; } }
}

.bullet-list {
  padding-left: 1.4rem; font-size: 1.02rem;
  li { margin-bottom: 1rem; line-height: 1.7; &::marker { color: #8BE9FD; } }
}

.accent-link {
  color: #8BE9FD; text-decoration: none; font-weight: 600; border-bottom: 1px solid transparent; transition: border-color 0.2s;
  &:hover { border-color: #8BE9FD; }
}

.youtube-embed {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  margin-bottom: 1.2rem;
  border-radius: 12px;
  overflow: hidden;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 12px;
  }
}




.parallel-empty {
    padding: 1.5rem 1rem;
    color: rgba(255, 255, 255, 0.6);
    font-style: italic;
    text-align: center;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
}

</style>

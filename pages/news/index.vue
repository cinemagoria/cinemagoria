<template>
  <main class="main">
    <UserNav />
    <nav class="navbar navbar-welcome">
      <h1 class="title-primary" style="color: #8BE9FD !important; margin-top:30px; margin-bottom:10px; display:flex; justify-content: center;">Últimas Noticias</h1>
      <h2 class="title-secondary" style="color: rgb(172, 175, 181); font-size: 14px; max-width: 600px; margin: 20px auto 0;">
        Tu resumen diario sobre cine, televisión y la industria del entretenimiento.
      </h2>
    </nav>

    <div class="news-section">
      <div class="content-wrapper">
        
        <!-- Sidebar -->
        <aside class="news-sidebar">
          <div class="sidebar-card">
            <h3 class="sidebar-title">Fuentes</h3>
            <div class="sources-container-mobile">
              <button class="scroll-arrow left" @click="scrollSources('left')" aria-label="Scroll Left">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              
              <div class="sources-list" ref="sourcesListRef">
                 <button 
                  class="source-btn" 
                  :class="{ active: !selectedSource }"
                  @click="setSource(null)"
                >
                  Todas las Fuentes
                </button>
                <button 
                  v-for="source in currentSources" 
                  :key="source"
                  class="source-btn"
                  :class="{ active: selectedSource === source }"
                  @click="setSource(source)"
                >
                  {{ source }}
                </button>
              </div>

              <button class="scroll-arrow right" @click="scrollSources('right')" aria-label="Scroll Right">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <div class="news-main">
          
          <div class="header-status">
            <h2 class="status-title" v-if="selectedSource">
              Último de 
              <a 
                :href="getSourceUrl(selectedSource)" 
                target="_blank" 
                style="color: #8BE9FD; text-decoration: none; cursor: pointer;"
                class="source-link-header"
              >
                {{ selectedSource }}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 2px; position:relative; top: 1px;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            </h2>
            <h2 class="status-title" v-else>Todas las Novedades</h2>
            <span class="count-badge" v-if="!pending">{{ newsItems.length }} artículos</span>
          </div>

          <!-- Loading State -->
          <div v-if="pending" class="loading-grid">
             <div class="loader-container">
                <Loader />
             </div>
          </div>

          <!-- Error State -->
           <div v-else-if="error" class="error-container">
            <p>Error al cargar noticias.</p>
            <button @click="refresh" class="retry-btn">Reintentar</button>
          </div>

          <!-- News Grid (Success State) -->
            <div v-else>
               <div v-if="newsItems.length > 0">
                  <div class="news-grid">
                    <div 
                      v-for="item in displayedItems" 
                      :key="item.id" 
                      class="news-card"
                    >
                      <!-- Image / Video Area -->
                      <a :href="item.href" target="_blank" class="card-image" :class="{ 'has-video': item.video_id }">
                          <img 
                              :src="item.image || '/placeholder_news.webp'" 
                              :alt="item.title" 
                              loading="lazy"
                              @error="onImageError($event, item)"
                              class="img-lazy"
                          />
                          
                          <div class="card-source">{{ item.source.name }}</div>
                      </a>

                      <div class="card-content">
                        <div class="meta-row">
                          <span class="card-date">{{ formatDate(item.published_at) }}</span>
                        </div>
                        
                        <h3>
                            <a :href="item.href" target="_blank" class="card-title-link">{{ item.title }}</a>
                        </h3>
                        
                        <p class="card-desc">
                          {{ item.description ? item.description.replace(/<[^>]*>?/gm, '') : '' }}
                        </p>
                        <div class="card-footer">
                          <a :href="item.href" target="_blank" class="read-link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rss-icon lucide-rss"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
                            Leer Artículo
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Infinite Scroll Trigger -->
                  <div ref="sentinel" class="sentinel" style="height: 20px; margin-top: 20px;"></div>
               </div>
               
               <div v-else class="no-results">
                  <p>No se encontraron noticias.</p>
               </div>
            </div>

        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import UserNav from '@/components/global/UserNav';
import Loader from '@/components/Loader';

const config = useRuntimeConfig();
const currentLang = ref(config.public.apiLang || 'es');

const SOURCES = {
  es: [
    'Espinof', 
    'SensaCine',
    'TerrorWeekend',
    'Almas Oscuras',
    'EscribiendoCine',
    'Uruloki',
    'CineyTele',
    'Mundiario',
    'OtrosCines',
    "Cine O'culto"
  ]
};

const SOURCE_URLS = {
  'Espinof': 'https://www.espinof.com/',
  'SensaCine': 'https://www.sensacine.com/',
  'TerrorWeekend': 'https://www.terrorweekend.com/',
  'Almas Oscuras': 'https://www.almasoscuras.com/',
  'EscribiendoCine': 'https://www.escribiendocine.com/',
  'Uruloki': 'https://www.uruloki.org/',
  'CineyTele': 'https://www.cineytele.com/',
  'Mundiario': 'https://www.mundiario.com/cineseries/',
  'OtrosCines': 'https://www.otroscines.com/',
  "Cine O'culto": 'https://cineoculto.com/'
};

const currentSources = computed(() => SOURCES[currentLang.value] || SOURCES['es']);
const selectedSource = ref(null);

const { data, pending, refresh, error } = await useFetch('/api/news', {
  query: computed(() => ({
    limit: 100,
    source: selectedSource.value,
    lang: currentLang.value
  })),
  key: computed(() => `news-${currentLang.value}-${selectedSource.value || 'all'}`),
  watch: [selectedSource],
  lazy: true,
  server: false,
  dedupe: 'defer',
});

const newsItems = computed(() => {
  if (!data.value) return [];
  return data.value.results || data.value || [];
});

const visibleLimit = ref(20);
const sentinel = ref(null);

const displayedItems = computed(() => {
  return newsItems.value.slice(0, visibleLimit.value);
});

watch(selectedSource, () => {
  visibleLimit.value = 20;
});
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      if (visibleLimit.value < newsItems.value.length) {
        visibleLimit.value += 20;
      }
    }
  }, { rootMargin: '200px' });

  if (sentinel.value) observer.observe(sentinel.value);
  
  watch(sentinel, (el) => {
    if (el) observer.observe(el);
  });
});

function onImageError(event, item) {
  event.target.src = '/placeholder_news.webp';
  
  if (item.image && item.image.includes('maxresdefault.jpg')) {
      item.image = item.image.replace('maxresdefault.jpg', 'hqdefault.jpg');
      event.target.src = item.image;
  } else {
      item.image = null;
  }
}

function setSource(source) {
  selectedSource.value = source;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function formatDate(isoString) {
  if (!isoString) return '';
  const locale = 'es-ES';
  return new Date(isoString).toLocaleDateString(locale, { 
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
}

const sourcesListRef = ref(null);

function scrollSources(direction) {
  if (!sourcesListRef.value) return;
  const scrollAmount = 200;
  if (direction === 'left') {
    sourcesListRef.value.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  } else {
    sourcesListRef.value.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}

function getSourceUrl(source) {
  return SOURCE_URLS[source] || '#';
}
</script>

<style scoped>
.news-section {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  min-height: 80vh;
}

.content-wrapper {
  width: 100%;
  max-width: 1400px;
  display: flex;
  gap: 30px;
}

.news-sidebar {
  width: 250px;
  flex-shrink: 0;
}

.sidebar-card {
  background: rgba(16, 26, 35, 0.85);
  border: 1px solid hsla(0, 0%, 100%, .18);
  border-radius: 15px;
  padding: 20px 15px;
  position: sticky;
  top: 100px;
  backdrop-filter: blur(10px);
  max-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}

.sidebar-title {
  color: #8BE9FD;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(139, 233, 253, 0.3);
  padding-bottom: 10px;
  flex-shrink: 0;
}

.sources-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  padding-right: 5px;
}
.sources-list::-webkit-scrollbar {
  width: 4px;
}
.sources-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
.sources-list::-webkit-scrollbar-thumb {
  background: rgba(139, 233, 253, 0.3);
  border-radius: 4px;
}

.source-btn {
  background: transparent;
  border: 1px solid transparent;
  color: #a0a0a0;
  padding: 8px 10px;
  text-align: left;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.source-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.source-btn.active {
  background: rgba(139, 233, 253, 0.15);
  color: #8BE9FD;
  border-color: rgba(139, 233, 253, 0.3);
  font-weight: 600;
}

.news-main {
  flex-grow: 1;
}

.header-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  background: rgba(16, 26, 35, 0.85);
  border: 1px solid hsla(0, 0%, 100%, .18);
  border-radius: 15px;
  padding: 15px 25px;
}

.status-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 5px;
}

.source-link-header:hover {
  text-decoration: underline !important;
  opacity: 0.9;
}

.count-badge {
  background: rgba(255,255,255,0.1);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  color: #aaa;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.news-card {
  background: rgba(16, 26, 35, 0.85);
  border: 1px solid hsla(0, 0%, 100%, .18);
  border-radius: 15px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.news-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px 0 rgba(139, 233, 253, 0.15);
  border-color: rgba(139, 233, 253, 0.5);
}

.card-image {
  position: relative;
  height: 180px;
  overflow: hidden;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  background: #1a1e23;
}

.news-card:hover .card-image img {
  transform: scale(1.05);
}

.card-source {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(4px);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  color: #8BE9FD;
  border: 1px solid rgba(139, 233, 253, 0.3);
  text-transform: uppercase;
}

.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.meta-row {
  margin-bottom: 10px;
  font-size: 12px;
  color: #888;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
  line-height: 1.4;
  color: #fff;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-desc {
  font-size: 14px;
  color: #b0b0b0;
  line-height: 1.6;
  margin-bottom: 20px;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  margin-top: auto;
  font-size: 13px;
  color: #8BE9FD;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: gap 0.2s ease;
}

.news-card:hover .card-footer {
  gap: 8px;
}

.loading-grid, .error-container, .no-results {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 600px;
  width: 100%;
  background: rgba(16, 26, 35, 0.85);
  border: 1px solid hsla(0, 0%, 100%, .18);
  border-radius: 15px;
  padding: 4rem;
  backdrop-filter: blur(10px);
}

.loader-container {
   width:100%;
   display:flex;
   justify-content:center;
}

.retry-btn {
  background: transparent;
  border: 1px solid #8BE9FD;
  color: #8BE9FD;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

@media (max-width: 900px) {
  .content-wrapper {
    flex-direction: column;
  }
  
  .news-sidebar {
    width: 100%;
  }

  .sidebar-card {
    position: static;
    background: transparent;
    border: none;
    padding: 0 0 15px 0;
    backdrop-filter: none;
    box-shadow: none;
  }
  
  .sidebar-title {
    display: none;
  }

  .sources-list {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 5px;
    gap: 10px;
    -ms-overflow-style: none;  
    scrollbar-width: none;  
  }
  
  .sources-list::-webkit-scrollbar {
    display: none;
  }
  
  .source-btn {
    white-space: nowrap;
    background: rgba(16, 26, 35, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 6px 16px;
    font-size: 13px;
    justify-content: center;
  }

  .source-btn.active {
    background: rgba(139, 233, 253, 0.2);
    border-color: #8BE9FD;
    color: #8BE9FD;
  }
}

.sources-container-mobile {
  display: flex;
  flex-direction: column; 
}

.scroll-arrow {
  display: none; 
}

@media (max-width: 900px) {
  .sources-container-mobile {
    flex-direction: row;
    align-items: center;
    gap: 5px;
    background: rgba(16, 26, 35, 0.85); 
    border: 1px solid hsla(0, 0%, 100%, .18);
    border-radius: 15px;
    padding: 10px;
  }

  .scroll-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05); 
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    width: 36px; 
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    flex-shrink: 0;
    padding: 0; 
  }

  .sources-list {
    display: flex;
    flex-direction: row; 
    overflow-x: auto;
    gap: 10px;
    padding: 0 10px; 
    flex-grow: 1;
    -ms-overflow-style: none;  
    scrollbar-width: none;  
  }
  
  .sources-list::-webkit-scrollbar {
    display: none;
  }
}

@media (max-width: 600px) {
  .header-status {
    flex-direction: column;
    gap: 15px;
    text-align: center;
    padding: 20px;
  }

  .status-title {
    flex-direction: column;
    gap: 5px;
    font-size: 16px;
  }
  
  .count-badge {
    align-self: center;
  }
}

.card-image {
  cursor: pointer;
}

.card-loader {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: #0000004e;
  z-index: 5;
}

.card-title-link {
  font-size: 18px; 
  font-weight: 700;
  margin-bottom: 10px;
  line-height: 1.4;
  color: #fff;
  text-decoration: none;
  
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s ease;
}

.card-title-link:hover {
  color: #8BE9FD;
}

.read-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #8BE9FD;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid #8BE9FD;
  background: transparent;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.read-link:hover {
  background: rgba(139, 233, 253, 0.1);
}

.loading-grid {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  width: 100%;
}

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>

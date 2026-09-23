<template>
  <div>
  <main class="main">
    <UserNav v-if="isMounted" />
    <nav class="page-header">
      <h1 class="page-title">Últimas Noticias</h1>
      <h2 class="page-subtitle">
        Tu resumen diario sobre cine, televisión y la industria del entretenimiento.
      </h2>
    </nav>

    <div class="news-section">
      <div class="content-wrapper">
        <div class="news-main">
          <div class="news-toolbar" :class="{ 'search-active': isSearchActive }">
            <div class="toolbar-left">
              <NuxtLink v-if="topicFromArticle" :to="topicFromArticle" class="back-to-article-btn" aria-label="Volver al artículo">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                <span class="action-label">Volver al Artículo</span>
              </NuxtLink>
              <button v-if="showBackButton" class="back-btn" @click="goHome" aria-label="Volver a todas las noticias">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                <span class="action-label">Volver</span>
              </button>

              <NuxtLink v-if="userEmail" :to="{ path: '/news', query: { view: 'saved', group: 'source' } }" class="saved-articles-link" :class="{ 'active': isSavedView }" aria-label="Artículos Guardados">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" /></svg>
                <span class="action-label">Artículos Guardados</span>
              </NuxtLink>
            </div>

            <div class="toolbar-right" :class="{ 'active': isSearchActive }">
              <div class="search-wrapper" :class="{ 'active': isSearchActive }">
                <button class="search-toggle-btn" @click="toggleSearch" :class="{ 'active': isSearchActive }" aria-label="Alternar búsqueda">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-icon lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  <span class="action-label">Buscar</span>
                </button>

                <div class="search-input-container" :class="{ 'show': isSearchActive }">
                  <input
                    type="text"
                    class="search-input"
                    placeholder="Buscar noticias..."
                    v-model="searchQuery"
                  >
                  <button class="clear-search-btn" @click="clearSearch" v-if="searchQuery">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <section class="news-controls" aria-label="Filtros de noticias">
            <div class="controls-head">
              <div class="controls-head__left">
                <h2 class="status-title" v-if="isSavedView">Artículos Guardados</h2>
                <h2 class="status-title" v-else-if="selectedPublisher">
                  Último de
                  <a
                    :href="getSourceUrl(selectedPublisher)"
                    target="_blank" rel="noopener noreferrer"
                    class="source-link-header"
                  >
                    {{ selectedPublisher }}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="external-link-icon"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </a>
                </h2>
                <h2 class="status-title" v-else-if="scope === 'first-party'">Editorial</h2>
                <h2 class="status-title" v-else-if="scope === 'third-party'">Otras Fuentes</h2>
                <h2 class="status-title" v-else>Todas las Novedades</h2>

                <button
                  v-if="categoryFilter && !isSavedView"
                  type="button"
                  class="active-category"
                  @click="pickCategory(null)"
                  title="Quitar filtro de categoría"
                >
                  <span class="active-category__dot"></span>
                  {{ categoryLabelES(categoryFilter) }}
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              <div class="controls-head__right">
                <ClientOnly>
                  <span v-if="!isLoading" class="count-badge">
                    {{ filteredItems.length }} {{ filteredItems.length === 1 ? 'artículo' : 'artículos' }}
                  </span>
                </ClientOnly>
                <div class="view-switch" role="group" aria-label="Vista">
                  <button
                    type="button"
                    class="view-switch__btn"
                    :class="{ 'view-switch__btn--active': viewMode === 'grid' }"
                    :aria-pressed="viewMode === 'grid'"
                    title="Tarjetas"
                    @click="setViewMode('grid')"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                  </button>
                  <button
                    type="button"
                    class="view-switch__btn"
                    :class="{ 'view-switch__btn--active': viewMode === 'list' }"
                    :aria-pressed="viewMode === 'list'"
                    title="Lista"
                    @click="setViewMode('list')"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
                  </button>
                </div>
              </div>
            </div>

            <div v-if="showSourceFacet" class="facet" role="tablist" aria-label="Filtrar por fuente">
              <span class="facet__label">Fuente</span>
              <div class="facet__chips">
                <button
                  v-for="option in SCOPE_OPTIONS"
                  :key="option.value"
                  type="button"
                  class="facet-chip"
                  :class="{ 'facet-chip--active': scope === option.value }"
                  role="tab"
                  :aria-selected="scope === option.value"
                  @click="pickScope(option.value)"
                >{{ option.label }}</button>
              </div>
            </div>

            <div v-if="showPublisherFacet" class="facet" role="tablist" aria-label="Filtrar por medio">
              <span class="facet__label">Medio</span>
              <div class="facet__chips">
                <button
                  type="button"
                  class="facet-chip"
                  :class="{ 'facet-chip--active': !selectedPublisher }"
                  role="tab"
                  :aria-selected="!selectedPublisher"
                  @click="pickSource(THIRD_PARTY_SOURCE)"
                >Todos los medios</button>
                <button
                  v-for="publisher in knownPublishers"
                  :key="publisher"
                  type="button"
                  class="facet-chip"
                  :class="{ 'facet-chip--active': selectedPublisher === publisher }"
                  role="tab"
                  :aria-selected="selectedPublisher === publisher"
                  @click="pickSource(publisher)"
                >{{ publisher }}</button>
              </div>
            </div>

            <div v-if="showCategoryFacet" class="facet" role="tablist" aria-label="Filtrar por categoría editorial">
              <span class="facet__label">Categoría</span>
              <div class="facet__chips">
                <button
                  type="button"
                  class="facet-chip"
                  :class="{ 'facet-chip--active': !categoryFilter }"
                  role="tab"
                  :aria-selected="!categoryFilter"
                  @click="pickCategory(null)"
                >Todas</button>
                <button
                  v-for="cat in visibleCategories"
                  :key="cat"
                  type="button"
                  class="facet-chip"
                  :class="{ 'facet-chip--active': categoryFilter === cat }"
                  role="tab"
                  :aria-selected="categoryFilter === cat"
                  @click="pickCategory(cat)"
                >{{ categoryLabelES(cat) }}</button>
              </div>
            </div>

            <div class="facet" role="tablist" aria-label="Agrupar resultados">
              <span class="facet__label">Agrupar por</span>
              <div class="facet__chips">
                <button
                  v-for="option in GROUP_OPTIONS"
                  :key="option.value"
                  type="button"
                  class="facet-chip"
                  :class="{ 'facet-chip--active': groupBy === option.value }"
                  role="tab"
                  :aria-selected="groupBy === option.value"
                  @click="pickGroup(option.value)"
                >{{ option.label }}</button>
              </div>
            </div>
          </section>

          <div v-if="isLoading" class="loading-grid">
             <div class="loader-container">
                <Loader />
             </div>
          </div>
          <div v-else-if="error" class="error-container">
            <p>Error al cargar noticias.</p>
            <button @click="refresh" class="retry-btn">Reintentar</button>
          </div>
          <div v-else-if="sections.length">
            <div v-for="section in sections" :key="section.key" class="news-group">
              <h3 v-if="section.label" class="news-group__title">{{ section.label }}</h3>

              <div v-if="viewMode === 'grid'" class="news-grid">
                <article
                  v-for="item in section.items"
                  :key="item.id"
                  :id="'news-item-' + item.id"
                  class="news-card"
                >
                  <component :is="linkTag(item)" v-bind="linkAttrs(item)" class="card-image">
                    <img
                      :src="item.image || PLACEHOLDER_IMAGE"
                      :alt="item.title"
                      loading="lazy"
                      @error="onImageError($event, item)"
                    />
                    <button
                      v-if="userEmail"
                      class="bookmark-btn"
                      :class="{ 'is-saved': isSaved(item) }"
                      @click.prevent="toggleSave(item)"
                      :title="isSaved(item) ? 'Eliminar de guardados' : 'Leer más tarde'"
                    >
                      <svg v-if="!isSaved(item)" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/><line x1="12" x2="12" y1="7" y2="13"/><line x1="15" x2="9" y1="10" y2="10"/></svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="is-saved-icon"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/><path d="m9 10 2 2 4-4"/></svg>
                    </button>
                  </component>

                  <div v-if="relatedTitle(item)" class="related-title" :class="{ 'related-title--beside-save': userEmail }" :data-related-root="item.id">
                    <button
                      type="button"
                      class="related-title__toggle"
                      :class="{ 'related-title__toggle--open': openRelated === item.id }"
                      :aria-expanded="openRelated === item.id ? 'true' : 'false'"
                      :aria-label="relatedLabel(item)"
                      :title="relatedLabel(item)"
                      @click.stop.prevent="toggleRelated(item)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
                    </button>
                    <div v-if="openRelated === item.id" class="related-title__panel">
                      <span class="related-title__label">{{ relatedLabel(item) }}</span>
                      <NuxtLink :to="relatedHref(item)" no-prefetch class="related-title__name" @click="closeRelated">{{ relatedTitle(item).name }}</NuxtLink>
                    </div>
                  </div>

                  <div class="card-content">
                    <div class="meta-row">
                      <span
                        v-if="item.source?.name"
                        class="publisher-badge"
                        :class="{ 'publisher-badge--external': item.is_internal === false }"
                      >
                        {{ item.source.name }}
                        <svg v-if="item.is_internal === false" class="publisher-badge__out" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <path d="M14 4h6v6" />
                          <path d="M20 4 10 14" />
                          <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
                        </svg>
                      </span>
                      <div v-if="categoryChips(item).length" class="card-cats-row">
                        <button v-for="chip in categoryChips(item)" :key="chip.label" type="button" class="card-cat-tag" @click="filterByCategory(chip.token)">{{ chip.label }}</button>
                      </div>
                      <span class="card-date">{{ formatDate(item.published_at) }}</span>
                    </div>

                    <h3>
                      <component :is="linkTag(item)" v-bind="linkAttrs(item)" class="card-title-link">{{ item.title }}</component>
                    </h3>

                    <p v-if="item.description" class="card-desc">
                      {{ sanitizeDescription(item.description) }}
                    </p>

                    <div v-if="item.topics?.length" class="card-tags-section">
                      <span class="card-tags-label">Temas:</span>
                      <div class="card-tags-row">
                        <button v-for="topic in item.topics" :key="topic" class="card-topic-tag" @click.prevent="searchByTopic(topic)">{{ topic }}</button>
                      </div>
                    </div>

                    <div class="card-footer">
                      <component :is="linkTag(item)" v-bind="linkAttrs(item)" class="read-link">
                        <svg v-if="item.is_internal === false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rss-icon lucide-rss"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
                        Leer Artículo
                      </component>
                    </div>
                  </div>
                </article>
              </div>

              <div v-else class="news-list">
                <article
                  v-for="item in section.items"
                  :key="item.id"
                  :id="'news-item-' + item.id"
                  class="news-row"
                >
                  <component :is="linkTag(item)" v-bind="linkAttrs(item)" class="news-row__thumb">
                    <img
                      :src="item.image || PLACEHOLDER_IMAGE"
                      :alt="item.title"
                      loading="lazy"
                      @error="onImageError($event, item)"
                    />
                  </component>

                  <div class="news-row__body">
                    <component :is="linkTag(item)" v-bind="linkAttrs(item)" class="news-row__title">{{ item.title }}</component>
                    <div class="news-row__meta">
                      <span
                        v-if="item.source?.name"
                        class="news-row__source"
                        :class="{ 'news-row__source--external': item.is_internal === false }"
                      >
                        {{ item.source.name }}
                        <svg v-if="item.is_internal === false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <path d="M14 4h6v6" />
                          <path d="M20 4 10 14" />
                          <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
                        </svg>
                      </span>
                      <span v-if="item.published_at" class="news-row__sep" aria-hidden="true">·</span>
                      <span v-if="item.published_at" class="news-row__date">{{ formatDate(item.published_at) }}</span>
                      <template v-if="primaryCategory(item)">
                        <span class="news-row__sep" aria-hidden="true">·</span>
                        <button type="button" class="news-row__cat" @click="filterByCategory(primaryCategory(item).token)">{{ primaryCategory(item).label }}</button>
                      </template>
                    </div>
                  </div>

                  <div v-if="userEmail || relatedTitle(item)" class="news-row__actions">
                    <div v-if="relatedTitle(item)" class="related-title related-title--row" :data-related-root="item.id">
                      <button
                        type="button"
                        class="related-title__toggle"
                        :class="{ 'related-title__toggle--open': openRelated === item.id }"
                        :aria-expanded="openRelated === item.id ? 'true' : 'false'"
                        :aria-label="relatedLabel(item)"
                        :title="relatedLabel(item)"
                        @click.stop.prevent="toggleRelated(item)"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
                      </button>
                      <div v-if="openRelated === item.id" class="related-title__panel related-title__panel--row">
                        <span class="related-title__label">{{ relatedLabel(item) }}</span>
                        <NuxtLink :to="relatedHref(item)" no-prefetch class="related-title__name" @click="closeRelated">{{ relatedTitle(item).name }}</NuxtLink>
                      </div>
                    </div>
                    <button
                      v-if="userEmail"
                      class="news-row__save"
                      :class="{ 'is-saved': isSaved(item) }"
                      @click.prevent="toggleSave(item)"
                      :title="isSaved(item) ? 'Eliminar de guardados' : 'Leer más tarde'"
                    >
                      <svg v-if="!isSaved(item)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/><line x1="12" x2="12" y1="7" y2="13"/><line x1="15" x2="9" y1="10" y2="10"/></svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/><path d="m9 10 2 2 4-4"/></svg>
                    </button>
                  </div>
                </article>
              </div>
            </div>

            <div v-if="hasMore" ref="sentinel" class="sentinel"></div>
          </div>
          <div v-else-if="isSavedView" class="no-results">
            <div class="no-results-content">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="no-results-icon"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/><line x1="12" x2="12" y1="7" y2="13"/><line x1="15" x2="9" y1="10" y2="10"/></svg>
              <h3 class="no-results-title">Aún no hay artículos guardados</h3>
              <p class="no-results-text">Los artículos que guardes aparecerán aquí.</p>
            </div>
          </div>
          <div v-else class="no-results">
            <p>No se encontraron noticias.</p>
          </div>
        </div>
      </div>
    </div>
  </main>
  </div>
</template>

<script setup>
import UserNav from '@/components/global/UserNav';
import Loader from '@/components/Loader';
import striptags from 'striptags';
import { FIRST_PARTY_SOURCE, THIRD_PARTY_SOURCE, SOURCE_URLS } from '~/utils/newsSources';
import { categoryLabelES } from '~/utils/categoryLabels';
import { relatedTitleLabel, relatedTitleOf, relatedTitleHref } from '~/utils/relatedTitleLabels';
import { formatDate as formatDateHelper, handleImageError as handleImageErrorHelper } from '~/utils/helpers';

useHead({
  title: 'Cinemagoria — Últimas Noticias de Cine y TV',
  meta: [
    { name: 'description', content: 'Mantente al día con las últimas noticias de cine, televisión y la industria del entretenimiento. Resumen diario agregado por Cinemagoria.' },
    { property: 'og:title', content: 'Cinemagoria — Últimas Noticias de Cine y TV' },
    { property: 'og:description', content: 'Tu resumen diario sobre cine, televisión y la industria del entretenimiento.' },
  ],
})

const PLACEHOLDER_IMAGE = '/placeholders/placeholder_news.webp';
const VIEW_STORAGE_KEY = 'news-view-mode';
const PAGE_SIZE = 20;
const DATE_LOCALE = 'es-ES';

const CATEGORY_PRIMARIES = [
  'review', 'interview', 'opinion',
  'production', 'cast', 'trailer', 'premiere', 'release', 'streaming', 'awards', 'classic',
  'acquisition', 'boxoffice', 'lineup', 'industry',
];

const CATEGORY_TAGS = ['festival', 'market', 'documentary', 'series', 'animation', 'short'];

const CATEGORY_OPTIONS = [...CATEGORY_PRIMARIES, ...CATEGORY_TAGS];

const SCOPE_OPTIONS = [
  { value: 'all', label: 'Todas' },
  { value: 'first-party', label: 'Editorial' },
  { value: 'third-party', label: 'Otras fuentes' },
];

const GROUP_OPTIONS = [
  { value: 'none', label: 'Ninguno' },
  { value: 'month', label: 'Mes' },
  { value: 'year', label: 'Año' },
  { value: 'source', label: 'Fuente' },
];
const GROUP_VALUES = GROUP_OPTIONS.map((option) => option.value);

const config = useRuntimeConfig();
const { $bus } = useNuxtApp();
const currentLang = ref(config.public.apiLang || 'es');
const NuxtLink = resolveComponent('NuxtLink');

const route = useRoute();
const router = useRouter();
const searchQuery = ref('');
const isSearchActive = ref(false);
const debouncedSearchQuery = refDebounced(searchQuery, 500);
const topicFromArticle = ref(null);
const topicFilter = ref(null);

const queryString = (key) => (typeof route.query[key] === 'string' && route.query[key] ? route.query[key] : null);

const selectedSource = computed(() => queryString('source'));
const scope = computed(() => {
  if (!selectedSource.value) return 'all';
  return selectedSource.value === FIRST_PARTY_SOURCE ? 'first-party' : 'third-party';
});
const selectedPublisher = computed(() => {
  const source = selectedSource.value;
  return source && source !== FIRST_PARTY_SOURCE && source !== THIRD_PARTY_SOURCE ? source : null;
});
const categoryFilter = computed(() => {
  const value = queryString('category');
  return value && CATEGORY_OPTIONS.includes(value) ? value : null;
});
const groupBy = computed(() => {
  const value = queryString('group');
  return value && GROUP_VALUES.includes(value) ? value : 'none';
});
const isSavedView = computed(() => route.query.view === 'saved');
const isTopicMode = computed(() => isSearchActive.value && !!topicFilter.value);
const isSearching = computed(() => isTopicMode.value || (isSearchActive.value && !!debouncedSearchQuery.value));

const showSourceFacet = computed(() => !isSavedView.value && !isSearching.value);
const showPublisherFacet = computed(() => showSourceFacet.value && scope.value === 'third-party' && knownPublishers.value.length > 0);

function updateQuery(patch, { replace = false } = {}) {
  const query = { ...route.query };
  Object.entries(patch).forEach(([key, value]) => {
    if (value === null || value === undefined) delete query[key];
    else query[key] = value;
  });
  const navigate = replace ? router.replace : router.push;
  return navigate.call(router, { query: Object.keys(query).length ? query : undefined });
}

function pickSource(source) {
  updateQuery({ source, view: null });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function pickScope(value) {
  if (value === 'all') return pickSource(null);
  if (value === 'first-party') return pickSource(FIRST_PARTY_SOURCE);
  return pickSource(THIRD_PARTY_SOURCE);
}

function pickCategory(cat) {
  updateQuery({ category: cat }, { replace: true });
}

function pickGroup(value) {
  updateQuery({ group: value === 'none' ? null : value }, { replace: true });
}

function filterByCategory(token) {
  const normalized = String(token || '').trim().toLowerCase();
  if (!CATEGORY_OPTIONS.includes(normalized)) return;
  pickCategory(normalized);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function categoryChips(item) {
  const out = [];
  const seen = new Set();
  const add = (raw) => {
    const token = String(raw || '').trim().toLowerCase();
    if (!token || !CATEGORY_OPTIONS.includes(token)) return;
    categoryLabelES(token)
      .split('/')
      .map((segment) => segment.trim())
      .filter(Boolean)
      .forEach((label) => {
        const key = label.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        out.push({ label, token });
      });
  };
  add(item?.editorial_category);
  (Array.isArray(item?.secondary_categories) ? item.secondary_categories : []).forEach(add);
  return out;
}

function primaryCategory(item) {
  return categoryChips(item)[0] || null;
}

const viewMode = ref('grid');

function setViewMode(mode) {
  viewMode.value = mode;
  try {
    localStorage.setItem(VIEW_STORAGE_KEY, mode);
  } catch {}
}

function restoreViewMode() {
  try {
    const stored = localStorage.getItem(VIEW_STORAGE_KEY);
    if (stored === 'grid' || stored === 'list') viewMode.value = stored;
  } catch {}
}

function linkTag(item) {
  return item.is_internal ? NuxtLink : 'a';
}

const openRelated = ref(null);

function relatedTitle(item) {
  return relatedTitleOf(item);
}

function relatedLabel(item) {
  const related = relatedTitleOf(item);
  return related ? relatedTitleLabel(related.type) : '';
}

function relatedHref(item) {
  return relatedTitleHref(relatedTitleOf(item));
}

function onRelatedPointer(event) {
  const root = event.target?.closest?.('[data-related-root]');
  if (!root || root.dataset.relatedRoot !== String(openRelated.value)) closeRelated();
}

function onRelatedKey(event) {
  if (event.key === 'Escape') closeRelated();
}

function toggleRelated(item) {
  if (openRelated.value === item.id) {
    closeRelated();
    return;
  }
  openRelated.value = item.id;
  document.addEventListener('pointerdown', onRelatedPointer, true);
  document.addEventListener('keydown', onRelatedKey);
}

function closeRelated() {
  openRelated.value = null;
  if (typeof document === 'undefined') return;
  document.removeEventListener('pointerdown', onRelatedPointer, true);
  document.removeEventListener('keydown', onRelatedKey);
}

function linkAttrs(item) {
  if (item.is_internal) return { to: item.href };
  return { href: item.href, target: '_blank', rel: 'noopener noreferrer' };
}

onMounted(() => {
  const topic = queryString('topic');
  const text = topic || queryString('q');
  if (!text) return;
  topicFilter.value = topic;
  searchQuery.value = text;
  isSearchActive.value = true;
  if (route.query.from) {
    topicFromArticle.value = route.query.from;
  }
  const consumed = { q: null, topic: null, from: null };
  nextTick(() => updateQuery(topic ? { ...consumed, category: null, view: null } : consumed, { replace: true }));
});

const toggleSearch = () => {
  isSearchActive.value = !isSearchActive.value;
  if (!isSearchActive.value) {
    topicFilter.value = null;
    clearSearch();
  } else {
    nextTick(() => {
      document.querySelector('.search-input')?.focus();
    });
  }
};

const showBackButton = computed(() => {
  if (topicFromArticle.value) return false;
  return isSavedView.value || isSearching.value || scope.value !== 'all';
});

function goHome() {
  if (isSearchActive.value) {
    isSearchActive.value = false;
    searchQuery.value = '';
    topicFilter.value = null;
  }
  updateQuery({ view: null, source: null, group: null });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const clearSearch = () => {
  searchQuery.value = '';
  topicFromArticle.value = null;
};

const { data, pending, refresh, error } = await useFetch('/api/news', {
  query: computed(() => ({
    limit: isSearching.value ? 200 : (selectedPublisher.value ? 100 : 200),
    source: isSearching.value ? FIRST_PARTY_SOURCE : (selectedSource.value || undefined),
    lang: currentLang.value,
    q: isSearching.value && !isTopicMode.value ? debouncedSearchQuery.value : undefined,
    topic: isTopicMode.value ? topicFilter.value : undefined,
  })),
  key: computed(() => `news-${currentLang.value}-${isTopicMode.value ? 'topic' : (isSearching.value ? 'search' : (selectedSource.value || 'all'))}-${isTopicMode.value ? topicFilter.value : (isSearching.value ? debouncedSearchQuery.value : '')}`),
  watch: [selectedSource, topicFilter, isSearchActive],
  lazy: true,
  server: false,
  dedupe: 'defer',
});

const newsItems = computed(() => {
  if (!data.value) return [];
  const items = data.value.results || data.value || [];
  return [...items].sort((a, b) => {
    if (isSearching.value) {
      const aFirst = a.source?.name === FIRST_PARTY_SOURCE ? 0 : 1;
      const bFirst = b.source?.name === FIRST_PARTY_SOURCE ? 0 : 1;
      if (aFirst !== bFirst) return aFirst - bFirst;
    }
    return new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime();
  });
});

const knownPublishers = ref([]);

watch(newsItems, (items) => {
  const names = new Set(knownPublishers.value);
  items.forEach((item) => {
    if (item.is_internal === false && item.source?.name) names.add(item.source.name);
  });
  knownPublishers.value = [...names].sort((a, b) => a.localeCompare(b));
}, { immediate: true });

const savedArticles = ref(new Set());
const localSavedArticlesList = ref([]);
const savedPending = ref(false);
const userEmail = ref(null);
const isLoading = computed(() => pending.value || savedPending.value);

const relatedByHref = computed(() => {
  const map = new Map();
  for (const item of newsItems.value) {
    if (item.href && item.related_title) map.set(item.href, item.related_title);
  }
  return map;
});

const savedItems = computed(() => localSavedArticlesList.value.map((article) => {
  const link = article.link || article.href || '';
  return {
    id: link,
    title: article.title,
    href: link,
    link,
    image: article.image,
    published_at: article.published_at,
    source: { name: article.source || 'Fuente Desconocida' },
    is_internal: !/^https?:\/\//i.test(link),
    related_title: relatedByHref.value.get(link) || null,
  };
}));

const sourceItems = computed(() => (isSavedView.value ? savedItems.value : newsItems.value));

const visibleCategories = computed(() => {
  const present = new Set();
  for (const item of sourceItems.value) {
    if (item?.editorial_category) present.add(item.editorial_category);
    const secondaries = Array.isArray(item?.secondary_categories) ? item.secondary_categories : [];
    for (const token of secondaries) if (token) present.add(token);
  }
  return CATEGORY_OPTIONS.filter((cat) => present.has(cat));
});

const showCategoryFacet = computed(() => !isSavedView.value && !isSearching.value && visibleCategories.value.length > 0);

const filteredItems = computed(() => {
  const cat = categoryFilter.value;
  if (!cat || isSavedView.value) return sourceItems.value;
  return sourceItems.value.filter((item) => {
    if (item.editorial_category === cat) return true;
    const secondaries = Array.isArray(item.secondary_categories) ? item.secondary_categories : [];
    return secondaries.includes(cat);
  });
});

const visibleLimit = ref(PAGE_SIZE);
const sentinel = ref(null);
let observer = null;

const displayedItems = computed(() => filteredItems.value.slice(0, visibleLimit.value));
const hasMore = computed(() => visibleLimit.value < filteredItems.value.length);

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function groupKey(item, mode) {
  if (mode === 'source') {
    const name = item.source?.name || 'Fuente Desconocida';
    return { key: `source:${name}`, label: name };
  }
  const date = item.published_at ? new Date(item.published_at) : null;
  if (!date || Number.isNaN(date.getTime())) return { key: 'undated', label: 'Sin fecha' };
  if (mode === 'year') {
    return { key: `year:${date.getFullYear()}`, label: String(date.getFullYear()) };
  }
  return {
    key: `month:${date.getFullYear()}-${date.getMonth()}`,
    label: capitalize(date.toLocaleDateString(DATE_LOCALE, { month: 'long', year: 'numeric' })),
  };
}

const sections = computed(() => {
  const items = displayedItems.value;
  if (!items.length) return [];
  if (groupBy.value === 'none') return [{ key: 'all', label: '', items }];
  const groups = new Map();
  items.forEach((item) => {
    const { key, label } = groupKey(item, groupBy.value);
    if (!groups.has(key)) groups.set(key, { key, label, items: [] });
    groups.get(key).items.push(item);
  });
  return [...groups.values()];
});

watch([selectedSource, categoryFilter, groupBy, isSavedView, debouncedSearchQuery, topicFilter], () => {
  visibleLimit.value = PAGE_SIZE;
});

const isMounted = ref(false);
onMounted(() => {
  isMounted.value = true;
  restoreViewMode();
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasMore.value) {
      visibleLimit.value += PAGE_SIZE;
    }
  }, { rootMargin: '200px' });

  if (sentinel.value) observer.observe(sentinel.value);

  watch(sentinel, (el, previous) => {
    if (previous) observer.unobserve(previous);
    if (el) observer.observe(el);
  });
});

onUnmounted(() => {
  closeRelated();
  if (observer) {
    observer.disconnect();
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('auth-changed', handleAuthChange);
  }
});

watch([filteredItems, () => route.query.highlight], ([items, highlightId]) => {
  if (items.length && highlightId) {
    nextTick(() => {
      const index = items.findIndex((item) => String(item.id) === highlightId);
      if (index !== -1) {
        if (index >= visibleLimit.value) {
          visibleLimit.value = index + 5;
        }
        nextTick(() => {
          const el = document.getElementById(`news-item-${highlightId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('highlight-news');
          }
        });
      }
    });
  }
}, { immediate: true });

function onImageError(event, item) {
  handleImageErrorHelper(item, event);
}

function formatDate(isoString) {
  return formatDateHelper(isoString, DATE_LOCALE);
}

function getSourceUrl(source) {
  const fromFeed = newsItems.value.find((item) => item?.source?.name === source && item?.source?.url);
  return fromFeed?.source?.url || SOURCE_URLS[source] || '#';
}

function sanitizeDescription(desc) {
  if (!desc) return '';
  return striptags(desc);
}

function searchByTopic(topic) {
  topicFilter.value = topic;
  searchQuery.value = topic;
  isSearchActive.value = true;
  topicFromArticle.value = null;
  updateQuery({ category: null, view: null }, { replace: true });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  nextTick(() => {
    document.querySelector('.search-input')?.focus();
  });
}

watch(debouncedSearchQuery, (value) => {
  if (topicFilter.value && value !== topicFilter.value) topicFilter.value = null;
});

watch(isSavedView, (saved) => {
  if (saved) {
    fetchSavedArticlesList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

async function fetchSavedArticlesList() {
  if (!userEmail.value) {
    return;
  }
  savedPending.value = true;
  try {
    const response = await fetch(`${config.public.tursoBackendUrl}/news/saved/${userEmail.value}`);
    const payload = await response.json();
    if (payload.success && payload.articles) {
      localSavedArticlesList.value = payload.articles;
      savedArticles.value = new Set(payload.articles.map((article) => article.link));
    } else {
      localSavedArticlesList.value = [];
    }
  } catch (e) {
    console.error('Error fetching saved articles list:', e);
  } finally {
    savedPending.value = false;
  }
}

const handleAuthChange = () => {
  const email = localStorage.getItem('email');
  userEmail.value = email || null;
  if (isSavedView.value) fetchSavedArticlesList();
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    handleAuthChange();

    if (isSavedView.value && userEmail.value) {
      fetchSavedArticlesList();
    }

    window.addEventListener('auth-changed', handleAuthChange);
  }
});

async function fetchSavedNews() {
  if (!userEmail.value) return;
  try {
    const response = await fetch(`${config.public.tursoBackendUrl}/news/saved/${userEmail.value}`);
    const payload = await response.json();
    if (payload.success && payload.articles) {
      savedArticles.value = new Set(payload.articles.map((article) => article.link));
    }
  } catch (e) {
    console.error('Error fetching saved news:', e);
  }
}

function isSaved(article) {
  return savedArticles.value.has(article.link || article.href);
}

async function toggleSave(article) {
  if (!userEmail.value) {
    $bus.$emit('show-auth-modal');
    return;
  }

  const link = article.href || article.link;
  const isArticleSaved = savedArticles.value.has(link);

  if (isArticleSaved) {
    savedArticles.value.delete(link);
    localSavedArticlesList.value = localSavedArticlesList.value.filter((saved) => (saved.link || saved.href) !== link);
  } else {
    savedArticles.value.add(link);
  }
  savedArticles.value = new Set(savedArticles.value);

  try {
    const url = `${config.public.tursoBackendUrl}/news/saved`;
    const method = isArticleSaved ? 'DELETE' : 'POST';

    const articleToSave = {
      title: article.title,
      link,
      image: article.image,
      source: article.source?.name,
      published_at: article.published_at,
    };

    const body = isArticleSaved
      ? { userEmail: userEmail.value, link }
      : { userEmail: userEmail.value, article: articleToSave };

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error('Failed to update');
  } catch (e) {
    console.error('Error toggling save:', e);
    if (isArticleSaved) {
      savedArticles.value.add(link);
      if (isSavedView.value) {
        localSavedArticlesList.value.push({ ...article, link, source: article.source?.name });
      }
    } else {
      savedArticles.value.delete(link);
    }
    savedArticles.value = new Set(savedArticles.value);
  }
}

watch(userEmail, (val) => {
  if (val) {
    fetchSavedNews();
  } else {
    savedArticles.value = new Set();
  }
}, { immediate: true });
</script>

<style scoped>
.news-section {
  display: flex;
  justify-content: center;
  padding: 0 20px 40px;
  min-height: 80vh;
}

.content-wrapper {
  width: 100%;
  max-width: 1400px;
  display: flex;
  gap: 30px;
}

.news-main {
  flex-grow: 1;
  min-width: 0;
}

.news-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding: 12px 18px;
  background: rgba(3, 4, 6, 0.7);
  background-image:
    radial-gradient(circle at 15% 50%, rgba(31, 84, 103, 0.2), transparent 55%);
  border: 1px solid rgba(139, 233, 253, 0.18);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: relative;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.back-btn,
.saved-articles-link,
.search-toggle-btn,
.back-to-article-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  padding: 0 18px;
  background: rgba(139, 233, 253, 0.1);
  color: #8BE9FD;
  border: 1px solid rgba(139, 233, 253, 0.2);
  border-radius: 10px;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.back-btn:hover,
.saved-articles-link:hover,
.search-toggle-btn:hover,
.back-to-article-btn:hover {
  background: rgba(139, 233, 253, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 233, 253, 0.1);
}

.saved-articles-link.active,
.search-toggle-btn.active {
  background: rgba(139, 233, 253, 0.25);
  border-color: #8BE9FD;
}

.saved-articles-link.active {
  box-shadow: 0 0 10px rgba(139, 233, 253, 0.2);
}

.back-to-article-btn {
  gap: 6px;
  padding: 0 16px;
  background: rgba(139, 233, 253, 0.12);
  border-color: rgba(139, 233, 253, 0.3);
}

.action-label {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.search-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  transition: width 0.3s ease;
}

.search-input-container {
  position: relative;
  width: 0;
  overflow: hidden;
  opacity: 0;
  margin-left: 0;
  transition: width 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease, margin-left 0.3s ease;
}

.search-input-container.show {
  width: 280px;
  opacity: 1;
  margin-left: 10px;
}

.search-input {
  width: 100%;
  background: rgba(16, 26, 35, 0.6);
  border: 1px solid rgba(139, 233, 253, 0.3);
  color: #fff;
  padding: 10px 35px 10px 15px;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #8BE9FD;
  box-shadow: 0 0 0 2px rgba(139, 233, 253, 0.2);
  background: rgba(16, 26, 35, 0.8);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.clear-search-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.clear-search-btn:hover {
  color: #fff;
}

.news-controls {
  margin-bottom: 25px;
  background: rgba(3, 4, 6, 0.7);
  background-image:
    radial-gradient(circle at 15% 0%, rgba(31, 84, 103, 0.2), transparent 55%);
  border: 1px solid rgba(139, 233, 253, 0.18);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  overflow: hidden;
}

.controls-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 15px 25px;
}

.controls-head__left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  min-width: 0;
}

.controls-head__right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.status-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 5px;
}

.source-link-header {
  color: #8BE9FD;
  text-decoration: none;
  cursor: pointer;
}

.source-link-header:hover {
  text-decoration: underline !important;
  opacity: 0.9;
}

.external-link-icon {
  margin-left: 2px;
  position: relative;
  top: 1px;
}

.active-category {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 4px 10px 4px 11px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  color: #8BE9FD;
  background: rgba(139, 233, 253, 0.08);
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 999px;
  cursor: pointer;
  letter-spacing: 0.2px;
  transition: all 0.2s ease;
}

.active-category__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #8BE9FD;
  box-shadow: 0 0 8px rgba(139, 233, 253, 0.7);
  flex-shrink: 0;
}

.active-category svg { opacity: 0.7; transition: opacity 0.2s ease; }

.active-category:hover {
  background: rgba(139, 233, 253, 0.16);
  border-color: rgba(139, 233, 253, 0.55);
}
.active-category:hover svg { opacity: 1; }

.count-badge {
  background: rgba(139, 233, 253, 0.08);
  border: 1px solid rgba(139, 233, 253, 0.3);
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #8BE9FD;
  white-space: nowrap;
}

.view-switch {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border-radius: 10px;
  border: 1px solid rgba(139, 233, 253, 0.2);
  background: rgba(139, 233, 253, 0.05);
}

.view-switch__btn {
  width: 32px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: rgba(207, 216, 223, 0.55);
  cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease;
}

.view-switch__btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.view-switch__btn:hover {
  color: #8BE9FD;
}

.view-switch__btn--active {
  background: rgba(139, 233, 253, 0.15);
  color: #8BE9FD;
}

.facet {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 7px 25px;
  border-top: 1px solid rgba(139, 233, 253, 0.1);
}

.facet__label {
  flex-shrink: 0;
  width: 72px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: rgba(207, 216, 223, 0.45);
}

.facet__chips {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 32px), transparent);
  mask-image: linear-gradient(to right, #000 calc(100% - 32px), transparent);
}

.facet__chips::-webkit-scrollbar {
  display: none;
}

.facet-chip {
  flex-shrink: 0;
  padding: 6px 12px;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: rgba(207, 216, 223, 0.55);
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease;
  white-space: nowrap;
}

.facet-chip:hover {
  color: #8BE9FD;
}

.facet-chip--active {
  background: rgba(139, 233, 253, 0.12);
  color: #8BE9FD;
}

.facet-chip--active:hover {
  background: rgba(139, 233, 253, 0.18);
}

.news-group {
  margin-bottom: 40px;
}

.news-group:last-of-type {
  margin-bottom: 0;
}

.news-group__title {
  position: relative;
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.3px;
  margin: 0 0 20px;
  padding: 0 0 12px 22px;
}

.news-group__title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #8BE9FD;
  box-shadow: 0 0 12px rgba(139, 233, 253, 0.7);
}

.news-group__title::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: linear-gradient(90deg, rgba(139, 233, 253, 0.4) 0%, rgba(139, 233, 253, 0.1) 30%, transparent 100%);
}

.sentinel {
  height: 20px;
  margin-top: 20px;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 25px;
}

.news-card {
  position: relative;
  background: rgba(3, 4, 6, 0.7);
  background-image:
    radial-gradient(circle at 15% 0%, rgba(31, 84, 103, 0.2), transparent 55%);
  border: 1px solid rgba(139, 233, 253, 0.18);
  border-radius: 15px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.news-card:hover {
  transform: translateY(-4px);
  border-color: rgba(139, 233, 253, 0.5);
  background: rgba(3, 4, 6, 0.85);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.5), 0 0 24px rgba(139, 233, 253, 0.15);
}

.news-card.highlight-news {
  border-color: #8BE9FD;
  box-shadow: 0 0 0 2px rgba(139, 233, 253, 0.3), 0 12px 40px 0 rgba(139, 233, 253, 0.15);
  animation: pulse-highlight 2s infinite;
}

@keyframes pulse-highlight {
  0% { box-shadow: 0 0 0 2px rgba(139, 233, 253, 0.3); }
  50% { box-shadow: 0 0 0 4px rgba(139, 233, 253, 0.5); }
  100% { box-shadow: 0 0 0 2px rgba(139, 233, 253, 0.3); }
}

.card-image {
  position: relative;
  display: block;
  height: 220px;
  overflow: hidden;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  cursor: pointer;
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

.publisher-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(139, 233, 253, 0.16);
  border: 1px solid rgba(139, 233, 253, 0.55);
  color: #B8F4FF;
  padding: 4px 11px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  line-height: 1.2;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.publisher-badge--external {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.34);
  color: #E6E8EC;
}
.publisher-badge__out {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  opacity: 0.85;
}

.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.meta-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 12px;
  color: #888;
}

.card-cats-row {
  display: flex;
  gap: 5px;
  width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.card-cats-row::-webkit-scrollbar { display: none; }

.card-cat-tag {
  flex-shrink: 0;
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  color: #8BE9FD;
  background: rgba(139, 233, 253, 0.08);
  border: 1px solid rgba(139, 233, 253, 0.3);
  padding: 3px 10px;
  border-radius: 12px;
  cursor: pointer;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
}

.card-cat-tag:hover {
  color: #aef2ff;
  background: rgba(139, 233, 253, 0.16);
  border-color: rgba(139, 233, 253, 0.5);
}

.card-title-link {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 10px;
  line-height: 1.4;
  color: #fff;
  text-decoration: none;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s ease;
}

.card-title-link:hover {
  color: #8BE9FD;
}

.card-desc {
  font-family: var(--font-display);
  font-size: 14px;
  color: #b0b0b0;
  line-height: 1.6;
  margin-bottom: 20px;
  flex-grow: 1;
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags-section {
  margin-top: auto;
  padding-top: 8px;
  margin-bottom: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.card-tags-label {
  font-size: 10px;
  font-weight: 700;
  color: #80868b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 6px;
}

.card-tags-row {
  display: flex;
  gap: 5px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 2px;
}

.card-tags-row::-webkit-scrollbar {
  display: none;
}

.card-topic-tag {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  color: #80868b;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 3px 10px;
  border-radius: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.card-topic-tag:hover {
  color: #8BE9FD;
  background: rgba(139, 233, 253, 0.1);
  border-color: rgba(139, 233, 253, 0.3);
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

.read-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #8BE9FD;
  font-family: var(--font-display);
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

.bookmark-btn,
.news-row__save {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(139, 233, 253, 0.35);
  color: #8BE9FD;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  flex-shrink: 0;
}

.bookmark-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.bookmark-btn:hover,
.news-row__save:hover {
  background: rgba(3, 4, 6, 0.88);
  border-color: #8BE9FD;
  color: #B8F4FF;
  box-shadow: 0 0 0 1px rgba(139, 233, 253, 0.35), 0 0 14px rgba(139, 233, 253, 0.35);
  transform: scale(1.08);
}

.bookmark-btn.is-saved,
.news-row__save.is-saved {
  background: #8BE9FD;
  border-color: #8BE9FD;
  color: #000;
}

.bookmark-btn svg,
.news-row__save svg {
  flex-shrink: 0;
}

.related-title {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  z-index: 11;
  display: flex;
  justify-content: flex-end;
  pointer-events: none;
}

.related-title--beside-save {
  right: 50px;
}

.related-title--row {
  position: relative;
  top: auto;
  left: auto;
  right: auto;
  flex-shrink: 0;
}

.related-title__toggle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(139, 233, 253, 0.35);
  color: #8BE9FD;
  cursor: pointer;
  pointer-events: auto;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.related-title__toggle::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
}

.related-title__toggle:hover {
  background: rgba(3, 4, 6, 0.88);
  border-color: #8BE9FD;
  color: #B8F4FF;
  box-shadow: 0 0 0 1px rgba(139, 233, 253, 0.35), 0 0 14px rgba(139, 233, 253, 0.35);
  transform: scale(1.08);
}

.related-title__toggle:focus-visible {
  outline: 2px solid #8BE9FD;
  outline-offset: 2px;
}

.related-title__toggle--open {
  background: rgba(3, 4, 6, 0.88);
  border-color: #8BE9FD;
  color: #B8F4FF;
  box-shadow: 0 0 0 1px rgba(139, 233, 253, 0.35), 0 0 14px rgba(139, 233, 253, 0.35);
}

.related-title__toggle svg {
  flex-shrink: 0;
  transition: transform 0.25s ease;
}

.related-title__toggle--open svg {
  transform: rotate(180deg);
}

.related-title__panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  max-width: 100%;
  padding: 8px 12px 10px;
  background: rgba(4, 6, 10, 0.86);
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 14px;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.55), inset 0 0 20px rgba(139, 233, 253, 0.05);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  pointer-events: auto;
  animation: related-title-in 0.18s ease-out;
}

.related-title__panel--row {
  top: 50%;
  right: calc(100% + 8px);
  width: max-content;
  max-width: min(320px, 60vw);
  transform: translateY(-50%);
  animation-name: related-title-row-in;
}

.related-title__label {
  flex-shrink: 0;
  padding: 3px 8px;
  border: 1px solid rgba(139, 233, 253, 0.55);
  border-radius: 999px;
  background: rgba(139, 233, 253, 0.16);
  color: #B8F4FF;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  line-height: 1.2;
  text-transform: uppercase;
  white-space: nowrap;
}

.related-title__name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: break-word;
  color: #fff;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  text-decoration: none;
  transition: color 0.2s ease;
}

.related-title__name:hover {
  color: #8BE9FD;
}

@keyframes related-title-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes related-title-row-in {
  from {
    opacity: 0;
    transform: translate(4px, -50%);
  }
  to {
    opacity: 1;
    transform: translateY(-50%);
  }
}

.news-row__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.news-list {
  display: flex;
  flex-direction: column;
  background: rgba(3, 4, 6, 0.6);
  background-image:
    radial-gradient(circle at 15% 0%, rgba(31, 84, 103, 0.16), transparent 55%);
  border: 1px solid rgba(139, 233, 253, 0.16);
  border-radius: 15px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.news-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  transition: background 0.2s ease;
}

.news-row:last-child {
  border-bottom: none;
}

.news-row:hover {
  background: rgba(139, 233, 253, 0.05);
}

.news-row.highlight-news {
  background: rgba(139, 233, 253, 0.1);
  box-shadow: inset 3px 0 0 #8BE9FD;
}

.news-row__thumb {
  flex-shrink: 0;
  display: block;
  width: 96px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  background: #1a1e23;
}

.news-row__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.news-row:hover .news-row__thumb img {
  transform: scale(1.05);
}

.news-row__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.news-row__title {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  line-height: 1.35;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s ease;
}

.news-row__title:hover {
  color: #8BE9FD;
}

.news-row__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 11px;
  color: #888;
  letter-spacing: 0.2px;
}

.news-row__source {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #B8F4FF;
}

.news-row__source--external {
  color: #E6E8EC;
}

.news-row__source svg {
  width: 9px;
  height: 9px;
  opacity: 0.8;
}

.news-row__sep {
  color: rgba(255, 255, 255, 0.35);
}

.news-row__cat {
  border: none;
  background: transparent;
  padding: 0;
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: #8BE9FD;
  cursor: pointer;
}

.news-row__cat:hover {
  text-decoration: underline;
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
  width: 100%;
  display: flex;
  justify-content: center;
}

.no-results-content {
  text-align: center;
}

.no-results-icon {
  opacity: 0.5;
  margin-bottom: 20px;
}

.no-results-title {
  color: #8BE9FD;
  font-size: 16px;
  margin-bottom: 10px;
}

.no-results-text {
  font-size: 14px;
  color: #aaa;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1F5467, #8BE9FD);
  border: 1px solid rgba(139, 233, 253, 0.5);
  color: #03242C;
  padding: 10px 26px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(139, 233, 253, 0.18);
}
.retry-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(139, 233, 253, 0.28);
}

@media (max-width: 1024px) {
  .news-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .content-wrapper {
    flex-direction: column;
  }
}

@media (max-width: 600px) {
  .news-toolbar {
    padding: 10px 12px;
  }

  .back-btn,
  .saved-articles-link,
  .search-toggle-btn,
  .back-to-article-btn {
    width: 44px;
    padding: 0;
    gap: 0;
  }

  .action-label {
    display: none;
  }

  .news-toolbar.search-active .toolbar-right,
  .news-toolbar.search-active .search-wrapper {
    flex-grow: 1;
  }

  .search-input-container.show {
    width: 100%;
    flex-grow: 1;
  }

  .search-input {
    padding: 8px 30px 8px 12px;
    height: 40px;
  }

  .controls-head {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 15px 16px;
  }

  .controls-head__left {
    justify-content: center;
    text-align: center;
  }

  .controls-head__right {
    justify-content: space-between;
  }

  .status-title {
    flex-direction: column;
    gap: 5px;
    font-size: 16px;
  }

  .facet {
    padding: 7px 16px;
    gap: 10px;
  }

  .facet__label {
    width: 58px;
  }

  .news-grid {
    grid-template-columns: 1fr;
  }

  .news-row {
    gap: 12px;
    padding: 10px 12px;
  }

  .news-row__thumb {
    width: 72px;
    height: 48px;
  }

  .news-row__title {
    font-size: 14px;
  }
}
</style>

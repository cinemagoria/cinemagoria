<template>
  <div>
    <main class="main">
      <section class="watchlist-section">
        <UserNav @show-rated-modal="showRatedItems" />
        <br>
        <nav class="navbar">
          <div class="list-nav-wrapper" v-click-outside="closeListSelector" style="justify-content: center;">
            <div class="title-with-selector">
              <h1 class="title-primary">Mi Lista</h1>
              <button v-if="userCustomLists.length > 0" @click="toggleListSelector" class="list-selector-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
            </div>
            <transition name="fade">
              <div v-if="listSelectorOpen" class="list-selector-dropdown" @click.stop>
                <div class="dropdown-header">
                  <a v-if="selectorTotalPages > 1" href="#" @click.prevent.stop="goToPrevPage" class="dropdown-nav-btn" :class="{ 'disabled': listSelectorPage <= 1 }" style="z-index: 101; position: relative; display: flex; align-items: center; justify-content: center; text-decoration: none; width: 32px; height: 32px; background: rgba(255,255,255,0.05); border-radius: 4px; pointer-events: auto;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </a>
                  <span>IR A</span>
                  <a v-if="selectorTotalPages > 1" href="#" @click.prevent.stop="goToNextPage" class="dropdown-nav-btn" :class="{ 'disabled': listSelectorPage >= selectorTotalPages }" style="z-index: 101; position: relative; display: flex; align-items: center; justify-content: center; text-decoration: none; width: 32px; height: 32px; background: rgba(255,255,255,0.05); border-radius: 4px; pointer-events: auto;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </a>
                </div>
                <div v-for="list in visibleCustomLists" :key="list.id + '_' + listSelectorPage">
                  <nuxt-link :to="`/lists/${list.slug}`" class="dropdown-list-item">{{ list.name }}</nuxt-link>
                </div>
              </div>
            </transition>
          </div>
        </nav>
        
        <div v-if="isLoadingFavorites" class="loading-state">
          <Loader />
        </div>

        <div v-else-if="showEmptyState" class="empty-state-container">
          <img src="/cinema-popcorn.svg" alt="No favorites" class="empty-state-icon">
          <h3>Aún no has agregado favoritos</h3>
          <p>
            Comienza a construir tu lista agregando 
            <nuxt-link to="/movie" class="empty-state-link">Películas</nuxt-link> 
            y 
            <nuxt-link to="/tv" class="empty-state-link">Series</nuxt-link> 
            que quieras ver!
          </p>
        </div>

        <div v-else>
          <div class="column">
            <h2 class="title-secondary" style="color: #acafb5; font-size: 16px;">{{ filterText }}</h2>
            
             <div class="new-controls-container">
              <label class="switch">
                <input type="checkbox" :checked="filter === 'tvShows'" @change="toggleFilterType">
                <span>Películas</span>
                <span>Series</span>
              </label>
              
              
              <div class="action-buttons">
                <button class="control-btn" @click="openFiltersModal">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17v2h6v-2zM3 5v2h10V5zm10 16v-2h8v-2h-8v-2h-2v6zM7 9v2H3v2h4v2h2V9zm14 4v-2H11v2zm-6-4h2V7h4V5h-4V3h-2z"/></svg>
                </button>



                <button class="control-btn ai-analysis-btn" @click="toggleAiSelectionMode" :class="{ 'active': aiSelectionMode }">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="m9 11 3 3L22 4"/></svg>
                  <span class="btn-label">Seleccionar</span>
                </button>
              </div>
            </div>

            <div v-if="hasActiveFilters" class="active-filters-indicator">
              <div class="filter-chips">
                <div 
                  v-for="(chip, index) in activeFilterChips" 
                  :key="index" 
                  class="filter-chip"
                >
                  <span>{{ chip.label }}</span>
                  <button @click="removeFilter(chip.value)" class="chip-remove">×</button>
                </div>
              </div>
              <button @click="clearAllFilters" class="clear-all-inline">Limpiar Todo</button>
            </div>
          </div>

          <div v-if="showTabEmptyState" class="empty-state-container">
            <img src="/cinema-popcorn.svg" alt="No content" class="empty-state-icon">
            <h3>{{ emptyStateMessage }}</h3>
            <p>¡Cambia de pestaña para ver tus {{ filter === 'movies' ? 'series' : 'películas' }}!</p>
          </div>
          
          <div v-else-if="(filteredItems.length === 0 || itemsToShow.length === 0) && hasActiveFilters" class="no-results-state">
            <img src="/cinema-popcorn.svg" alt="No results" class="no-results-icon">
            <h3>No se encontraron resultados</h3>
            <p>No pudimos encontrar contenido que coincida con tus filtros actuales.</p>
            <p class="suggestion">Intenta ajustar o limpiar algunos filtros para ver más resultados.</p>
            <button @click="clearAllFilters" class="refine-filters-btn">Limpiar Todos los Filtros</button>
          </div>
          
          <div v-else>
            <div v-if="aiSelectionMode" class="ai-selection-banner">
              <div class="banner-content">
                <div class="selection-info">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09 3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"/></svg>
                  <span>
                    Selección: {{ selectedMoviesCount }} {{ selectedMoviesCount === 1 ? 'película' : 'películas' }}, {{ selectedTvShowsCount }} {{ selectedTvShowsCount === 1 ? 'serie' : 'series' }}
                    <span class="limit-text">(máx 50 cada uno)</span>
                  </span>

                </div>
                <div class="banner-actions">
                  <button @click="cancelSelection" class="banner-btn cancel-btn">
                    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    Cancelar
                  </button>
                  <button 
                    @click="openBulkAddModal" 
                    class="banner-btn add-to-btn" 
                    :disabled="selectedItems.length === 0"
                    style="background: #2D3748; color: white; margin-right: 10px;"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" style="margin-right:4px" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"/></svg>
                    Añadir a...
                  </button>

                </div>
              </div>
            </div>

            <transition name="slide-up">
              <div v-if="undoBannerVisible" class="undo-banner">
                <div class="undo-content">
                   <span>Eliminado "{{ undoItem?.details?.nameForDb }}"</span>
                   <button @click="restoreFavorite" class="undo-btn">Deshacer</button>
                </div>
                <div class="timer-line"></div>
              </div>
            </transition>

            <div class="pagination" v-if="filteredItems.length > itemsPerPage">
              <button @click="goToFirst" :disabled="currentPage === 1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#8be9fd" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="lucide lucide-skip-back-icon lucide-skip-back" viewBox="0 0 24 24"><path d="M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432zM3 20V4"/></svg>
              </button>
              <button @click="prevPage" :disabled="currentPage === 1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#8be9fd" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="lucide lucide-step-back-icon lucide-step-back" viewBox="0 0 24 24"><path d="M13.971 4.285A2 2 0 0 1 17 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432zM21 20V4"/></svg>
              </button>
              <span class="pagination-text-container">
                <label for="page" class="pagination-label">Página</label>
                <input type="number" id="page" class="pagination-input" v-model.number="currentPage" min="1" :max="totalPages" @change="validatePageInput">
              </span>
              <span class="pagination-text">de <span class="pagination-number">{{ totalPages }}</span></span>
              <button @click="nextPage" :disabled="currentPage === totalPages">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#8be9fd" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="lucide lucide-step-forward-icon lucide-step-forward" viewBox="0 0 24 24"><path d="M10.029 4.285A2 2 0 0 0 7 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432zM3 4v16"/></svg>
              </button>
              <button @click="goToLast" :disabled="currentPage === totalPages">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#8be9fd" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="lucide lucide-skip-forward-icon lucide-skip-forward" viewBox="0 0 24 24"><path d="M21 4v16M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z"/></svg>
              </button>
            </div>
            
            <div class="movie-grid">
              <div v-for="(item, index) in itemsToShow" :key="'item-' + index" class="movie-card" :class="{ 'selection-mode': aiSelectionMode, 'selected': aiSelectionMode && isItemSelected(item), 'disabled': aiSelectionMode && !canSelectItem(item) && !isItemSelected(item) }">
                <div v-if="aiSelectionMode" class="selection-checkbox" @click.stop="toggleItemSelection(item)">
                  <div class="checkbox-wrapper">
                    <input type="checkbox" :checked="isItemSelected(item)" :disabled="!canSelectItem(item)" @click.prevent>
                    <span class="checkmark"></span>
                  </div>
                </div>

                <div class="card-background">
                  <div class="user-rating-badge" v-if="!aiSelectionMode && item.details.userRatingForDb && item.details.userRatingForDb !== '-'" 
                    @click.stop="openRatingModal(item)"
                    :class="{ 'has-review': item.details.userReview }" 
                    :title="item.details.userReview ? 'Tiene Reseña' : ''">
                    {{ item.details.userRatingForDb }}
                    <span v-if="item.details.userReview" class="review-indicator"></span>
                  </div>

                  
                  <div v-if="aiSelectionMode" class="item-link" @click="toggleItemSelection(item)" style="cursor: pointer;">
                    <div class="poster-container">
                      <div v-show="!imageLoadStates[item.details.idForDb]" class="poster-loader">
                        <Loader :size="44" />
                      </div>
                      <img 
                        :ref="'poster-' + item.details.idForDb"
                        :src="item.details.posterForDb || fallbackImageUrl" 
                        alt="Poster" 
                        class="poster" 
                        :class="{ 'loaded': imageLoadStates[item.details.idForDb] }"
                        @load="handleImageLoad(item.details.idForDb)"
                        @error="onImageError($event, item.details.idForDb)"
                      />
                    </div>
                  </div>
                  <nuxt-link v-else :to="getLink(item)" class="item-link">
                    <div class="poster-container">
                      <div v-show="!imageLoadStates[item.details.idForDb]" class="poster-loader">
                        <Loader :size="44" />
                      </div>
                      <img 
                        :ref="'poster-' + item.details.idForDb"
                        :src="item.details.posterForDb || fallbackImageUrl" 
                        alt="Poster" 
                        class="poster" 
                        :class="{ 'loaded': imageLoadStates[item.details.idForDb] }"
                        @load="handleImageLoad(item.details.idForDb)"
                        @error="onImageError($event, item.details.idForDb)"
                      />

                      <div class="card-actions-menu">
                        <div class="dropdown-trigger" @click.prevent.stop="toggleCardMenu(item.details.idForDb)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#8be9fd" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                      </div>
                    </div>
                  </nuxt-link>

                  <div class="movie-info-container">
                    <div class="item-link" @click="handleItemClick(item)" style="text-decoration: none; cursor: pointer;">
                      <h3>{{ item.details.nameForDb }}</h3>
                    </div>
                    <p class="year-text">
                      {{
                        item.details.yearStartForDb === item.details.yearEndForDb
                        ? item.details.yearEndForDb
                        : (item.details.yearStartForDb + (item.details.yearEndForDb ? `-${item.details.yearEndForDb}` : ''))
                      }}
                    </p>

                    <div class="card__content">
                      <div class="card___rating">
                        <div v-if="item.details.rating_source === 'imdb' && item.details.imdb_rating" class="rating-item">
                          <svg xmlns="http://www.w3.org/2000/svg" class="rating-logo imdb" viewBox="0 0 48 48"><path fill="#ffc107" d="M44 13H4c-2.2 0-4 1.8-4 4v16c0 2.2 1.8 4 4 4h40c2.2 0 4-1.8 4-4V17c0-2.2-1.8-4-4-4"/><path fill="#263238" d="M28.1 18h-3.7v13.1h3.7c2 0 2.8-.4 3.3-.7.6-.4.9-1.1.9-1.8v-7.9c0-.9-.4-1.7-.9-2-.8-.5-1.1-.7-3.3-.7m.7 10.3c0 .6-.7.6-1.3.6V20c.6 0 1.3 0 1.3.6zm5-10.3v13.3h2.8s.2-.9.4-.7c.4 0 1.5.6 2.2.6s1.1 0 1.5-.2c.6-.4.7-.7.7-1.3v-7.8c0-1.1-1.1-1.8-2-1.8s-1.8.6-2.2.9v-3zm3.6 4.2c0-.4 0-.6.4-.6.2 0 .4.2.4.6v6.6c0 .4 0 .6-.4.6-.2 0-.4-.2-.4-.6zm-14.7 9.1V18h-4.4l-.8 6.3-1.1-6.3h-4v13.3h2.9v-7.4l1.3 7.4h2l1.3-7.4v7.4zM7.6 18h3.1v13.3H7.6z"/></svg>
                          <span class="rating-score">{{ item.details.imdb_rating.toFixed(1) }}</span>
                          <span class="vote-count" v-if="item.details.imdb_votes">({{ formatVoteCount(item.details.imdb_votes) }})</span>
                        </div>
                        <div v-else-if="item.details.starsForDb" class="rating-item">
                          <img src="/tmdb.svg" alt="TMDB" class="rating-logo tmdb">
                          <span class="rating-score">{{ formatRating(item.details.starsForDb) }}</span>
                           <span class="vote-count" v-if="item.details.vote_count">({{ formatVoteCount(item.details.vote_count) }})</span>
                        </div>
                        <p v-else style="font-size: 11px; opacity: 0.7;">No especificado</p>
                      </div>
                    </div>
                  </div>

                  <div v-if="!aiSelectionMode" class="card-actions-menu" :class="{ 'menu-open': activeCardMenuId === item.details.idForDb }">
                    <div class="dropdown-trigger" @click.prevent.stop="toggleCardMenu(item.details.idForDb)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#8be9fd" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                    
                    <transition name="fade">
                      <div v-if="activeCardMenuId === item.details.idForDb" class="action-dropdown" @click.stop>
                        <div v-if="!item.details.userRatingForDb || item.details.userRatingForDb === '-'" class="dropdown-item" @click="openRatingModal(item); activeCardMenuId = null">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" style="margin-right:6px" viewBox="0 0 24 24"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
                          Valorar
                        </div>
                        <div class="dropdown-item" @click="openAddToListModal(item); activeCardMenuId = null">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" style="margin-right:6px" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"/></svg>
                          Añadir a...
                        </div>
                        <div class="dropdown-item remove-action" @click="removeFavorite(item); activeCardMenuId = null">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" style="margin-right:6px" viewBox="0 0 24 24"><path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          Eliminar
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>
              </div>
            </div>
            <br>
            <div class="pagination-footer" v-if="filteredItems.length > itemsPerPage">
              <button @click="goToFirst" :disabled="currentPage === 1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#8be9fd" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="lucide lucide-skip-back-icon lucide-skip-back" viewBox="0 0 24 24"><path d="M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432zM3 20V4"/></svg>
              </button>
              <button @click="prevPage" :disabled="currentPage === 1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#8be9fd" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="lucide lucide-step-back-icon lucide-step-back" viewBox="0 0 24 24"><path d="M13.971 4.285A2 2 0 0 1 17 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432zM21 20V4"/></svg>
              </button>
              <span class="pagination-text-container">
                <label for="page" class="pagination-label">Page</label>
                <input type="number" id="page" class="pagination-input" v-model.number="currentPage" min="1" :max="totalPages" @change="validatePageInput">
              </span>
              <span class="pagination-text">of <span class="pagination-number">{{ totalPages }}</span></span>
              <button @click="nextPage" :disabled="currentPage === totalPages">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#8be9fd" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="lucide lucide-step-forward-icon lucide-step-forward" viewBox="0 0 24 24"><path d="M10.029 4.285A2 2 0 0 0 7 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432zM3 4v16"/></svg>
              </button>
              <button @click="goToLast" :disabled="currentPage === totalPages">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#8be9fd" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="lucide lucide-skip-forward-icon lucide-skip-forward" viewBox="0 0 24 24"><path d="M21 4v16M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z"/></svg>
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="ratingModalVisible" class="modal-overlay">
          <div class="rating-modal">
            <div class="modal-header">
              <h3>Valorar '{{ currentRatingItem?.details?.nameForDb }}'</h3>
              <button class="close-btn" @click="closeRatingModal">×</button>
            </div>

            <div class="rating-content">
              <div class="rating-selector">
                <div class="rating-numbers">
                  <button
                    v-for="n in 10"
                    :key="n"
                    @click="setRating(n)"
                    @mouseover="previewRating(n)"
                    @mouseout="resetPreview()"
                    :class="[
                      'rating-btn',
                      { 'rating-btn-active': n <= (hoverRating || selectedRating) }
                    ]"
                  >
                    {{ n }}
                  </button>
                </div>
              </div>

              <div class="review-section">
                <textarea
                  v-model="userReview"
                  :placeholder="selectedRating > 0 ? 
                    ratingDescriptions[selectedRating - 1] : 'Selecciona una calificación primero'"
                  class="review-textarea"
                  maxlength="500"
                  :disabled="selectedRating === 0"
                ></textarea>
                <div class="char-count">{{ userReview.length }}/500</div>
              </div>

              <div class="rating-modal-buttons">
                <button 
                  v-if="currentRatingItem && currentRatingItem.details.userRatingForDb && currentRatingItem.details.userRatingForDb !== '-'"
                  @click="removeRating" 
                  class="remove-rating-btn"
                >
                  <span style="position:relative; margin:0 auto;">Eliminar</span>
                </button>
                
                <button 
                  @click="saveRatingAndReview" 
                  class="save-btn"
                  :disabled="selectedRating === 0"
                >
                  <span style="position:relative; margin:0 auto;">Guardar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filtersModalVisible" class="modal-overlay" @click="closeFiltersModal">
          <div class="filters-modal" @click.stop>
            <div class="modal-header">
              <h3>Filtros y Ordenamiento</h3>
              <button class="close-btn" @click="closeFiltersModal">×</button>
            </div>
            
            <div class="filters-content">
              <div class="filter-group">
                <label class="filter-label">Género</label>
                <div class="custom-select" @click="toggleGenreDropdown">
                  <div class="select-display">
                    <span>{{ selectedGenre || 'Todos los géneros' }}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" :class="{ 'rotate-180': genreDropdownOpen }">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </div>
                  <div v-if="genreDropdownOpen" class="dropdown-options">
                    <div 
                      class="dropdown-option" 
                      :class="{ selected: selectedGenre === '' }"
                      @click.stop="selectGenre('')"
                    >
                      Todos los géneros
                    </div>
                    
                    <div 
                      v-for="genre in uniqueSortedGenres" 
                      :key="genre" 
                      class="dropdown-option"
                      :class="{ selected: selectedGenre === genre }"
                      @click.stop="selectGenre(genre)"
                    >
                      {{ genre }}
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="filter-group">
                <label class="filter-label">Años</label>
                <div class="year-inputs">
                  <input 
                    type="number" 
                    v-model.number="customYearStart" 
                    :min="1880" 
                    :max="currentYear"
                    placeholder="Desde"
                    class="year-input"
                  >
                  <span class="year-separator">-</span>
                  <input 
                    type="number" 
                    v-model.number="customYearEnd" 
                    :min="1880" 
                    :max="currentYear"
                    placeholder="Hasta"
                    class="year-input"
                  >
                </div>
                <div class="quick-year-options">
                  <button 
                    v-for="range in yearRanges" 
                    :key="range" 
                    @click="setYearRange(range)"
                    class="year-quick-btn"
                  >
                    {{ range }}
                  </button>
                </div>
              </div>
              
                
              <div class="filter-group">
                <label class="filter-label">Rango de Calificación IMDB</label>
                <div class="year-inputs">
                  <input 
                    type="number" 
                    v-model.number="minImdbRating" 
                    min="0" 
                    max="10"
                    placeholder="Mín" 
                    class="year-input"
                  >
                  <span class="year-separator">-</span>
                  <input 
                    type="number" 
                    v-model.number="maxImdbRating" 
                    min="0" 
                    max="10"
                    placeholder="Máx"
                    class="year-input"
                  >
                </div>
              </div>

              <div class="filter-group">
                <label class="filter-label">Rango de Votos IMDB</label>
                <div class="year-inputs">
                  <input 
                    type="number" 
                    v-model.number="minImdbVotes" 
                    min="0"
                    placeholder="Min"
                    class="year-input"
                  >
                  <span class="year-separator">-</span>
                  <input 
                    type="number" 
                    v-model.number="maxImdbVotes" 
                    min="0"
                    placeholder="Max"
                    class="year-input"
                  >
                </div>
              </div>

              <div class="filter-group">
                <label class="filter-label">Ordenar por</label>
                <select v-model="orderMode" class="filter-input">
                  <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              
              <div class="filter-group">
                <label class="filter-label">Mi Calificación</label>
                <select v-model="selectedUserRating" class="filter-input">
                  <option value="">Todas mis calificaciones</option>
                  <option value="not-rated">Sin Valorar</option>
                  <option value="10">Mi Calificación: 10</option>
                  <option value="9">Mi Calificación: 9</option>
                  <option value="8">Mi Calificación: 8</option>
                  <option value="7">Mi Calificación: 7</option>
                  <option value="6">Mi Calificación: 6</option>
                  <option value="5">Mi Calificación: 5</option>
                  <option value="1-4">Mi Calificación: < 5</option>
                </select>
              </div>
              
              <div class="filter-actions">
                <button @click="clearAllFilters" class="clear-btn">Limpiar</button>
                <button @click="closeFiltersModal" class="apply-btn">Aplicar</button>
              </div>
            </div>
          </div>
        </div>



        <div v-if="notificationModalVisible" class="modal-overlay" @click="closeNotificationModal">
          <div class="rating-modal" @click.stop style="max-width: 400px;">
            <div class="modal-header">
              <h3>{{ notificationTitle || 'Notificación' }}</h3>
              <button class="close-btn" @click="closeNotificationModal">×</button>
            </div>
            <div class="rating-content" style="text-align: center; padding: 20px; display: flex; flex-direction: column; align-items: center;">
              <p style="font-size: 1.2rem; margin-bottom: 20px; color: #fff;">{{ notificationMessage }}</p>
              <button @click="closeNotificationModal" class="save-btn" style="padding: 10px 30px; width: auto;">OK</button>
            </div>
          </div>
        </div>



      </section>
      <!-- Added Banner -->
      <transition name="fade">
        <div v-if="addedBannerVisible" class="added-banner">
          <div class="added-content">
             <div class="selection-info">
               <span>{{ addedBannerMessage }}</span>
             </div>
          </div>
          <div class="timer-line"></div>
        </div>
      </transition>
    </main>
  </div>
</template>

<script>

import UserNav from '@/components/global/UserNav';


async function getUserName(userEmail) {
  try {
    const supabase = useSupabaseClient();
    const { data, error } = await supabase
      .from('user_data')
      .select('first_name')
      .eq('email', userEmail);
      
    if (error) {
      throw new Error('Error fetching user first name:', error.message);
    }

    const userName = data[0]?.first_name|| '';
    return userName;
    
  } catch (error) {
    console.error('Error fetching user first_name:', error);
  }
}

export default {
  components: {
    UserNav,
    Loader: () => import('@/components/Loader'),
  },

  head () {
    return {
      title: 'EnterCinema - Mi Lista.',
      meta: [
        { hid: 'og:title', property: 'og:title', content: 'Mi Lista' },
        { hid: 'og:url', property: 'og:url', content: `${process.env.FRONTEND_URL}${this.$route.path}` },
      ],
    };
  },
  props: {
    item: Object,
  },
  data() {
    return {
      tursoBackendUrl: process.env.TURSO_BACKEND_URL || 'https://entercinema-favorites.vercel.app/api',
      isLoadingFavorites: false, 
      orderMode: 'latest-added',
      genreDropdownOpen: false,
      filteredSeriesDetails: [],
      filtersModalVisible: false,
      customYearStart: null,
      customYearEnd: null,
      currentYear: new Date().getFullYear(),
      selectedLanguage: 'english',
      fallbackImageUrl: "/image_not_found_yet_es.webp",
      handleImageError: "this.src='/image_not_found_yet_es.webp'",
      userEmail: '',
      accessToken: '',
      isLoggedIn: false,
      favorites: [],
      moviesFetched: [],
      notificationModalVisible: false,
      notificationTitle: '',
      notificationMessage: '',
      tvFetched: [],
      currentPage: 1,
      itemsPerPage: 20,
      itemsPerRow: 4,
      userFirstName: '', 
      isMenuOpen: false,
      
      listSelectorOpen: false,
      listSelectorPage: 1,
      userCustomLists: [],
      
      filter: 'movies',
      selectedGenre: '',
      selectedYearRange: '',
      selectedYearRange: '',
      genres: [],
      movieGenres: [],
      tvGenres: [],
      years: [],
      resizeObserver: null,
      ratingModalVisible: false,
      currentRatingItem: null,
      userReview: '',
      selectedRating: 0,
      hoverRating: 0,
      ratingDescriptions: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      ],
      minImdbRating: null,
      maxImdbRating: null,
      minImdbVotes: null,
      maxImdbVotes: null,
      selectedUserRating: '',
      tmdbRatingRanges: [
        '9-10', '8-8.9', '7-7.9', '6-6.9', '5-5.9', '0-4.9'
      ],
      userRatingRanges: [
        '10', '9', '8', '7', '6', '5', '1-4'
      ],
      aiSelectionMode: false,
      selectedItems: [],

      imageLoadStates: {},
      activeCardMenuId: null,
      undoBannerVisible: false,
      undoItem: null,
      undoTimer: null,
      addedBannerVisible: false,
      addedBannerMessage: '', 
      addedBannerTimer: null,
    };
  },
  setup() {
    return { supabase: useSupabaseClient() }
  },
  async mounted() {
    const email = localStorage.getItem('email');
    const accessToken = localStorage.getItem('access_token');
    this.userEmail = email || '';
    if (this.userEmail) {
        this.fetchUserCustomLists();
    }
    this.hasAccessToken = accessToken !== null;
    this.isLoggedIn = accessToken !== null;
    this.restoreState(); 
    this.checkData();
    await this.fetchUserFirstName();
    
    this.$nextTick(() => {
      this.calculateItemsPerRow();

      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(this.handleResize);
        const gridElement = document.querySelector('.movie-grid');
        if (gridElement) {
          this.resizeObserver.observe(gridElement);
        }
      } else {
        window.addEventListener('resize', this.handleResize);
      }
      document.addEventListener('click', this.closeCardMenu);
    });

    const detailsArray = this.tvFetched.map(({ details }) => details);
    const currentYear = new Date().getFullYear();
    const pastYearsLimit = currentYear - 5;

    const filteredArray = detailsArray.filter(item => item.yearEndForDb >= pastYearsLimit);

    const additionalSeries = detailsArray.filter(item => item.nextEpisode !== null && item.nextEpisode !== undefined);

    const uniqueSeries = [...new Set([...filteredArray, ...additionalSeries])];

    const seriesIds = uniqueSeries.map(item => item.idForDb);

    const config = this.$config.public;

    async function fetchSeriesDetails(seriesId) {
        const apiKey = config.apiKey;
        const apiLang = config.apiLang;
        const url = `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}&language=${apiLang}`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json'
            }
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener detalles de la serie:', error);
            return null;
        }
    }

    async function fetchSeriesDetailsForIds(seriesIds) {
        const seriesPromises = seriesIds.map(async id => await fetchSeriesDetails(id));
        const seriesDetails = await Promise.all(seriesPromises);

        function filterSeriesDetails(seriesDetails) {
            return seriesDetails
                .map(series => ({
                    name: series.name,
                    genres: series.genres.map(genre => ({ id: genre.id, name: genre.name })),
                    nextEpisode: series.next_episode_to_air,
                    stillPath: series.still_path,
                    numberOfEpisodes: series.number_of_episodes,
                    numberOfSeasons: series.number_of_seasons,
                    firstAirDate: series.first_air_date,
                    lastEpisode: series.last_episode_to_air
                }))
                .filter(series => series.nextEpisode !== undefined && series.nextEpisode !== null);
        }

        return filterSeriesDetails(seriesDetails);
    }

    const filteredSeriesDetails = await fetchSeriesDetailsForIds(seriesIds).catch(err => {
        console.error('Error al obtener y filtrar detalles de las series:', err);
        return [];
    });

    this.filteredSeriesDetails = filteredSeriesDetails;
    
    try {
      const { data, error } = await this.supabase
        .from('notifications') 
        .upsert([{
          user_email: this.userEmail,
          series_releases_details: this.filteredSeriesDetails, 
        }], { 
          onConflict: ['user_email'], 
        });

      if (error) {
        throw new Error('Error al guardar en la base de datos: ' + error.message);
      }
    } catch (error) {
      console.error('Error al guardar en la base de datos:', error.message);
    }
    this.$bus.$on('rated-items-updated', this.checkData);
    this.$bus.$on('favorites-updated', this.checkData);
    this.$bus.$on('lists-updated', this.onListsUpdated);
    this.$bus.$on('open-add-to-list-modal', this.openAddToListModal);
    this.$bus.$on('bulk-items-added', this.showAddedBanner);
  },

  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    } else {
      window.removeEventListener('resize', this.handleResize);
    }
    this.$bus.$off('rated-items-updated', this.checkData);
    this.$bus.$off('favorites-updated', this.checkData);
    this.$bus.$off('lists-updated', this.onListsUpdated);
    this.$bus.$off('open-add-to-list-modal', this.openAddToListModal);
    this.$bus.$off('bulk-items-added', this.showAddedBanner);
    document.removeEventListener('click', this.closeCardMenu);
  },
  
  watch: {
    selectedGenre() {
      this.currentPage = 1;
      this.saveState();
    },
    filter() {
      this.saveState();
    },
    minImdbRating(newVal) {
      if (newVal !== null && this.maxImdbRating !== null && newVal > this.maxImdbRating) {
        const temp = this.maxImdbRating;
        this.maxImdbRating = newVal;
        this.minImdbRating = temp;
      }
      this.currentPage = 1;
      this.saveState();
    },
    maxImdbRating(newVal) {
      if (newVal !== null && this.minImdbRating !== null && newVal < this.minImdbRating) {
        const temp = this.minImdbRating;
        this.minImdbRating = newVal;
        this.maxImdbRating = temp;
      }
      this.currentPage = 1;
      this.saveState();
    },
    selectedUserRating() {
      this.currentPage = 1;
      this.saveState();
    },
    minImdbVotes() {
      this.currentPage = 1;
      this.saveState();
    },
    maxImdbVotes() {
      this.currentPage = 1;
      this.saveState();
    },

    customYearStart() {
      this.currentPage = 1;
      this.saveState();
    },
    customYearEnd() {
      this.currentPage = 1;
      this.saveState();
    },
    orderMode() {
      this.currentPage = 1;
      this.saveState();
    },
    totalPages(newTotal) {
      if (newTotal === 0) {
        this.currentPage = 1;
      } else if (this.currentPage > newTotal) {
        this.currentPage = newTotal;
      }
    },
    currentPage(newPage) {
      if (this.totalPages === 0) {
        this.currentPage = 1;
      } else if (newPage > this.totalPages) {
        this.$nextTick(() => {
          this.currentPage = this.totalPages;
        });
      }
    },
    itemsToShow: {
      immediate: true,
      handler(newItems) {
        if (newItems && newItems.length) {
          newItems.forEach(item => {
            if (item.details && item.details.idForDb) {
              this.imageLoadStates[item.details.idForDb] = false;
            }
          });
          
          this.$nextTick(() => {
            this.checkAlreadyLoadedImages();
          });
        }
      }
    }
  },
  
  methods: {
    async fetchUserCustomLists() {
      if (!this.userEmail) return;
      try {
        const response = await fetch(`${this.tursoBackendUrl}/lists/user/${encodeURIComponent(this.userEmail)}`);
        if (response.ok) {
          const data = await response.json();
          this.userCustomLists = data.lists || [];
        }
      } catch (error) {
        console.error('Error fetching user custom lists:', error);
      }
    },
    toggleListSelector() {
      this.listSelectorOpen = !this.listSelectorOpen;
    },
    closeListSelector() {
      this.listSelectorOpen = false;
      this.listSelectorPage = 1;
    },
    goToPrevPage() {
      if (this.listSelectorPage > 1) {
        this.listSelectorPage--;
      }
    },
    goToNextPage() {
      if (this.listSelectorPage < this.selectorTotalPages) {
        this.listSelectorPage++;
      }
    },
    showAddedBanner({ elementCount, listCount }) {
        this.addedBannerMessage = `${elementCount} elementos añadidos a ${listCount} lista${listCount !== 1 ? 's' : ''}`;
        this.addedBannerVisible = true;
        
        this.aiSelectionMode = false;
        this.selectedItems = [];
        
        if (this.addedBannerTimer) clearTimeout(this.addedBannerTimer);
        this.addedBannerTimer = setTimeout(() => {
            this.addedBannerVisible = false;
        }, 4000);
    },

    toggleCardMenu(id) {
      if (this.activeCardMenuId === id) {
        this.activeCardMenuId = null;
      } else {
        this.activeCardMenuId = id;
      }
    },
    closeCardMenu(e) {
      if (this.activeCardMenuId) {
        this.activeCardMenuId = null;
      }
    },
    handleImageLoad(itemId) {
      this.imageLoadStates[itemId] = true;
    },

    onImageError(event, itemId) {
      if (event.target.src !== this.fallbackImageUrl) {
        event.target.src = this.fallbackImageUrl;
      } else {
        this.imageLoadStates[itemId] = true;
      }
    },

    checkAlreadyLoadedImages() {
      this.itemsToShow.forEach(item => {
        if (item.details && item.details.idForDb) {
          const imgRef = this.$refs['poster-' + item.details.idForDb];
          if (imgRef && imgRef[0] && imgRef[0].complete) {
            this.imageLoadStates[item.details.idForDb] = true;
          }
        }
      });
    },



    toggleFilterType(event) {
      this.filter = event.target.checked ? 'tvShows' : 'movies';
      this.currentPage = 1;
      this.saveState();
    },
    toggleGenreDropdown() {
      this.genreDropdownOpen = !this.genreDropdownOpen;
    },

    selectGenre(genre) {
      this.selectedGenre = genre;
      this.genreDropdownOpen = false;
    },
    openFiltersModal() {
      this.filtersModalVisible = true;
    },

    closeFiltersModal() {
      this.filtersModalVisible = false;
    },

    removeFilter(filterValue) {
      if (filterValue === 'orderMode') {
        this.orderMode = 'latest-added';
      } else if (filterValue === 'imdbRating') {
        this.minImdbRating = null;
        this.maxImdbRating = null;
      } else if (filterValue === 'imdbVotes') {
        this.minImdbVotes = null;
        this.maxImdbVotes = null;
      } else {
        this[filterValue] = filterValue.includes('Year') ? null : '';
      }
      this.saveState();
    },

    setYearRange(range) {
      const [start, end] = range.split('-').map(Number);
      this.customYearStart = start;
      this.customYearEnd = end;
      this.saveState();
    },

    clearAllFilters() {
      this.selectedGenre = '';
      this.minImdbRating = null;
      this.maxImdbRating = null;
      this.minImdbVotes = null;
      this.maxImdbVotes = null;
      this.selectedUserRating = '';
      this.customYearStart = null;
      this.customYearEnd = null;
      this.orderMode = 'latest-added';
      this.saveState();
    },
    
    toggleAiSelectionMode() {
      this.aiSelectionMode = !this.aiSelectionMode;
      if (!this.aiSelectionMode) {
        this.selectedItems = [];
      }
    },
    
    isItemSelected(item) {
      return this.selectedItems.some(
        selected => selected.tmdb_id === item.details.idForDb && selected.media_type === item.details.typeForDb
      );
    },
    
    canSelectItem(item) {
      if (!this.aiSelectionMode) return true;
      
      if (this.isItemSelected(item)) return true;
      
      const mediaType = item.details.typeForDb;
      if (mediaType === 'movie') {
        return this.selectedMoviesCount < 50;
      } else if (mediaType === 'tv') {
        return this.selectedTvShowsCount < 50;
      }
      return false;
    },
    
    toggleItemSelection(item) {
      if (!this.canSelectItem(item) && !this.isItemSelected(item)) {
        return;
      }
      
      const itemIndex = this.selectedItems.findIndex(
        selected => selected.tmdb_id === item.details.idForDb && selected.media_type === item.details.typeForDb
      );
      
      if (itemIndex > -1) {
        this.selectedItems.splice(itemIndex, 1);
      } else {
        this.selectedItems.push({
          tmdb_id: item.details.idForDb,
          media_type: item.details.typeForDb,
          imdb_score: item.details.imdb_rating || null,
          title: item.details.nameForDb,
          year: item.details.yearStartForDb,
          poster_path: item.details.posterForDb,
          rating_source: item.details.rating_source,
          tmdb_rating: item.details.starsForDb || null,
          imdb_votes: item.details.imdb_votes || null,
          user_rating: item.details.userRatingForDb && item.details.userRatingForDb !== '-' ? parseFloat(item.details.userRatingForDb) : null
        });
      }
    },
    
    cancelSelection() {
      this.aiSelectionMode = false;
      this.selectedItems = [];
    },
    
    closeNotificationModal() {
      this.notificationModalVisible = false;
      this.notificationTitle = '';
      this.notificationMessage = '';
    },



    onListsUpdated() {
      if (this.selectedItems.length > 0) {
          this.selectedItems = [];
          this.aiSelectionMode = false;
          this.$bus.$emit('show-toast', 'Items added correctly');
      }
    },

    async openBulkAddModal() {
        if (this.selectedItems.length === 0) return;
        
        const items = this.selectedItems.map(sel => {
             let original = null;
             if (sel.media_type === 'movie') {
                 original = this.moviesFetched.find(m => m.details.idForDb === sel.tmdb_id);
             } else {
                 original = this.tvFetched.find(t => t.details.idForDb === sel.tmdb_id);
             }

             if (original && original.details) {
                 return { ...original.details };
             }
             
             return {
                idForDb: sel.tmdb_id,
                typeForDb: sel.media_type,
                nameForDb: sel.title,
                posterForDb: sel.poster_path,
                imdb_votes: sel.imdb_votes,
                imdb_rating: sel.imdb_score,
                starsForDb: sel.tmdb_rating,
                yearStartForDb: sel.year,
             };
        });
            
        this.$bus.$emit('show-add-to-list-modal', items);
    },

    async openAddToListModal(item) {
      if (!this.hasAccessToken) {
         this.$bus.$emit('show-auth-modal');
         return;
      }
      this.$bus.$emit('show-add-to-list-modal', item.details);
    },
    
    openRatingModal(item) {
      this.currentRatingItem = item;
      
      if (item.details.userRatingForDb && item.details.userRatingForDb !== '-') {
        this.selectedRating = parseInt(item.details.userRatingForDb);
        this.userReview = item.details.userReview || '';
      } else {
        this.selectedRating = 0;
        this.userReview = '';
      }
      
      this.hoverRating = 0;
      this.ratingModalVisible = true;
    },

    closeRatingModal() {
      this.ratingModalVisible = false;
      this.currentRatingItem = null;
      this.selectedRating = 0;
      this.hoverRating = 0;
      this.userReview = '';
    },

    setRating(rating) {
      this.selectedRating = rating;
    },

    previewRating(rating) {
      this.hoverRating = rating;
    },

    filterByTmdbRating(event) {
      this.selectedTmdbRating = event.target.value;
    },
    
    filterByUserRating(event) {
      this.selectedUserRating = event.target.value;
    },

    resetPreview() {
      this.hoverRating = 0;
    },


    async saveRatingAndReview() {
    if (this.selectedRating === 0) {
        alert('Please select a rating between 1 and 10');
        return;
      }



      try {
        const item = this.currentRatingItem;
        const { typeForDb, idForDb } = item.details;

        const response = await fetch(
          `${this.tursoBackendUrl}/favorites/rating/${this.userEmail}/${typeForDb}/${idForDb}`,
          {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
              rating: this.selectedRating,
              review: this.userReview.trim()
            })
          }
        );

        if (!response.ok) {
          throw new Error('Error updating rating');
        }

        item.details.userRatingForDb = this.selectedRating.toString();
        item.details.userReview = this.userReview.trim();

        this.closeRatingModal();
        await this.checkData();

      } catch (error) {
        console.error('Error saving rating and review:', error);
        alert('There was an error saving your rating. Please try again.');
      }
    },

    async removeRating() {
      try {
        const item = this.currentRatingItem;
        const { typeForDb, idForDb } = item.details;

        const response = await fetch(
          `${this.tursoBackendUrl}/favorites/rating/${this.userEmail}/${typeForDb}/${idForDb}`,
          {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
              rating: null, 
              review: '' 
            })
          }
        );

        if (!response.ok) {
          throw new Error('Error removing rating');
        }

        item.details.userRatingForDb = '-';
        item.details.userReview = '';

        this.closeRatingModal();
        await this.checkData();

      } catch (error) {
        console.error('Error removing rating:', error);
        alert('There was an error removing your rating. Please try again.');
      }
    },

    showRatedItems() {
      this.$bus.$emit('show-rated-modal');
    },

    handleResize() {
      this.calculateItemsPerRow();
      this.adjustItemsPerPage();
    },

    calculateItemsPerRow() {
      const gridElement = document.querySelector('.movie-grid');
      if (!gridElement) return;
      
      const gridWidth = gridElement.offsetWidth;
      const isMobile = window.innerWidth <= 600;
      const cardWidth = isMobile ? 105 : 200;
      const gap = 20;
      
      const calculatedItemsPerRow = Math.floor(gridWidth / (cardWidth + gap));
      
      this.itemsPerRow = Math.max(1, calculatedItemsPerRow);
      
      this.adjustItemsPerPage();
    },

    adjustItemsPerPage() {
      const minItems = 30;
      const rowsNeeded = Math.ceil(minItems / this.itemsPerRow);
      const newItemsPerPage = rowsNeeded * this.itemsPerRow;

      if (this.itemsPerPage !== newItemsPerPage) {
        this.itemsPerPage = newItemsPerPage;
        
        if (this.currentPage > this.totalPages && this.totalPages > 0) {
          this.currentPage = this.totalPages;
        }
      }
    },
    
    async checkData() {
      this.isLoadingFavorites = true;
      try {
        const response = await fetch(`${this.tursoBackendUrl}/favorites/${this.userEmail}`);
        
        if (!response.ok) {
          throw new Error('Error connecting to database: ' + response.statusText);
        }

        const data = await response.json();

        const moviesFetched = [];
        const tvFetched = [];
        const genres = new Set();
        const movieGenresSet = new Set();
        const tvGenresSet = new Set();
        const years = new Set();
        
        const fetchImdbPromises = [];

        if (data.favorites_json.movies) {
          for (const movie of data.favorites_json.movies) {
            const movieKey = Object.keys(movie)[0];
            const movieData = movie[movieKey];
            
            if (!movieData || !movieData.details) {
              console.warn('Skipping invalid movie entry:', movie);
              continue;
            }
            
            moviesFetched.push(movieData);
            
            if (movieData.details.external_ids?.imdb_id && !movieData.details.rating_source) {
              const fetchPromise = fetch(`/api/imdb-rating/${movieData.details.external_ids.imdb_id}`)
                .then(res => res.json())
                .then(imdbData => {
                  if (imdbData.found) {
                    movieData.details.imdb_rating = imdbData.score;
                    movieData.details.imdb_votes = imdbData.votes;
                    movieData.details.rating_source = 'imdb';
                  } else {
                    movieData.details.rating_source = 'tmdb';
                  }
                })
                .catch(err => {
                  console.error('Error fetching IMDb rating:', err);
                  movieData.details.rating_source = 'tmdb';
                });
                
              fetchImdbPromises.push(fetchPromise);
            } else if (!movieData.details.rating_source) {
              movieData.details.rating_source = movieData.details.imdb_rating ? 'imdb' : 'tmdb';
            }
            
            if (movieData.details.genresForDb) {
              const genresList = movieData.details.genresForDb.split(', ');
              genresList.forEach(g => {
                genres.add(g);
                movieGenresSet.add(g);
              });
            }
            
            if (movieData.details.yearStartForDb) {
              years.add(movieData.details.yearStartForDb);
            }
          }
        }

        if (data.favorites_json.tv) {
          for (const tvShow of data.favorites_json.tv) {
            const tvKey = Object.keys(tvShow)[0];
            const tvData = tvShow[tvKey];
            
            if (!tvData || !tvData.details) {
              console.warn('Skipping invalid TV entry:', tvShow);
              continue;
            }
            
            tvFetched.push(tvData);
            
            if (tvData.details.external_ids?.imdb_id && !tvData.details.rating_source) {
              const fetchPromise = fetch(`/api/imdb-rating/${tvData.details.external_ids.imdb_id}`)
                .then(res => res.json())
                .then(imdbData => {
                  if (imdbData.found) {
                    tvData.details.imdb_rating = imdbData.score;
                    tvData.details.imdb_votes = imdbData.votes;
                    tvData.details.rating_source = 'imdb';
                  } else {
                    tvData.details.rating_source = 'tmdb';
                  }
                })
                .catch(err => {
                  console.error('Error fetching IMDb rating:', err);
                  tvData.details.rating_source = 'tmdb';
                });

              fetchImdbPromises.push(fetchPromise);
            } else if (!tvData.details.rating_source) {
              tvData.details.rating_source = tvData.details.imdb_rating ? 'imdb' : 'tmdb';
            }
            
            if (tvData.details.genresForDb) {
              const genresList = tvData.details.genresForDb.split(', ');
              genresList.forEach(g => {
                genres.add(g);
                tvGenresSet.add(g);
              });
            }
            
            if (tvData.details.yearStartForDb) {
              years.add(tvData.details.yearStartForDb);
            }
          }
        }

        if (fetchImdbPromises.length > 0) {
          await Promise.all(fetchImdbPromises);
        }

        this.moviesFetched = moviesFetched;
        this.tvFetched = tvFetched;
        this.genres = Array.from(genres);
        this.movieGenres = Array.from(movieGenresSet);
        this.tvGenres = Array.from(tvGenresSet);
        this.years = Array.from(years).sort();

      } catch (error) {
        console.error(error.message);
      } finally {
        this.isLoadingFavorites = false;
      }
    },

    removeFavorite(item) {
      if (!item || !item.details) {
        console.error('Item or item details are undefined:', item);
        return;
      }
      
      this.undoItem = JSON.parse(JSON.stringify(item));
      this.undoBannerVisible = true;
      
      if (this.undoTimer) clearTimeout(this.undoTimer);
      
      this.undoTimer = setTimeout(() => {
        this.undoBannerVisible = false;
        this.undoItem = null;
      }, 10000);

      try {
        const { typeForDb, idForDb } = item.details;
        const keyToDelete = `${typeForDb}/${idForDb}`;
        this.deleteFavorite(keyToDelete);
      } catch (error) {
        console.error('Error removing favorite:', error.message);
      }
    },
    
    async restoreFavorite() {
      if (!this.undoItem || !this.undoItem.details) return;
      
      const itemToRestore = this.undoItem;
      const { 
        nameForDb, starsForDb, yearStartForDb, yearEndForDb, 
        posterForDb, idForDb, genresForDb, typeForDb, 
        external_ids, rating_source, imdb_rating, imdb_votes, runtime,
        userRatingForDb, userReview
      } = itemToRestore.details;
      
      const payload = {
        userEmail: this.userEmail,
        item: {
            nameForDb: nameForDb || null,
            starsForDb: starsForDb || null,
            yearStartForDb: yearStartForDb || null,
            yearEndForDb: yearEndForDb || null,
            posterForDb: posterForDb || null,
            idForDb: idForDb,
            genresForDb: genresForDb || null,
            typeForDb: typeForDb,
            addedAt: new Date(), 
            external_ids: external_ids || null,
            rating_source: rating_source || null,
            imdb_rating: imdb_rating || null,
            imdb_votes: imdb_votes || null,
            runtime: runtime || null,
        }
      };
      
      try {
        const response = await fetch(`${this.tursoBackendUrl}/favorites`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
             const errText = await response.text();
             throw new Error(`Failed to restore favorite: ${errText}`);
        }
        
        if (userRatingForDb && userRatingForDb !== '-') {
           await fetch(
            `${this.tursoBackendUrl}/favorites/rating/${this.userEmail}/${typeForDb}/${idForDb}`,
            {
              method: 'PUT',
              headers: { 
                'Content-Type': 'application/json' 
              },
              body: JSON.stringify({
                rating: parseInt(userRatingForDb),
                review: userReview || ''
              })
            }
          );
        }
        
        this.undoBannerVisible = false;
        if (this.undoTimer) clearTimeout(this.undoTimer);
        this.undoItem = null;
        
        await this.checkData();
        
      } catch (e) {
        console.error('Error restoring favorite:', e);
        alert(`Failed to restore item: ${e.message}`);
      }
    },

    async deleteFavorite(keyToDelete) {
      try {
        const [itemType, itemId] = keyToDelete.split('/');
        
        const response = await fetch(
          `${this.tursoBackendUrl}/favorites/${this.userEmail}/${itemType}/${itemId}`,
          { 
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Error deleting favorite');
        }

        await this.checkData();

        return Promise.resolve();
      } catch (error) {
        console.error('Error deleting favorite:', error.message);
        return Promise.reject(error);
      }
    },

    toggleOrder(event) {
      this.orderText = event.target.value === 'asc' ? 'Order Asc' : 'Order Desc';
      if (this.orderText === 'Order Asc') {
        this.moviesFetched.reverse();
        this.tvFetched.reverse();
      } else {
        this.moviesFetched.reverse();
        this.tvFetched.reverse();
      }
    },

    filterByGenre(event) {
      this.selectedGenre = event.target.value;
    },
    filterByYear(event) {
      this.selectedYearRange = event.target.value;
    },

    toggleFilter(event) {
      this.filter = event.target.value;
      this.currentPage = 1;
    },

    formatRating(stars) {
      if (!stars) return '0.0';
      return (parseFloat(stars) / 10).toFixed(1);
    },
    formatVoteCount(count) {
      if (!count) return '0 votos';
      if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M votos';
      }
      if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K votos';
      }
      return count + ' votos';
    },
    calculateStarsWidth(rating) {
      const maxRating = 10;
      const starWidth = 100 / maxRating;
      const ratingInteger = Math.floor(rating);
      const ratingDecimal = rating - ratingInteger;
      let width = ratingInteger * starWidth;
      if (ratingDecimal > 0) {
        width += starWidth * ratingDecimal;
      }
      return width;
    },

    goToFirst() {
      this.currentPage = 1;
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    goToLast() {
      this.currentPage = this.totalPages;
    },

    goToLogin() {
        this.$router.push('/login');
      },

    getLink(item) {
      if (item.details.typeForDb === 'movie') {
        return `/movie/${item.details.idForDb}`;
      } else if (item.details.typeForDb === 'tv') {
        return `/tv/${item.details.idForDb}`;
      } else {
        return '#'; 
      }
    },

    handleItemClick(item) {
      if (this.aiSelectionMode) {
        this.toggleItemSelection(item);
        return;
      }
      const link = this.getLink(item);
      if (link && link !== '#') {
        this.$router.push(link);
      }
    },
    async fetchUserFirstName() {
      try {
        const { data, error } = await this.supabase
          .from('auth_user')
          .select('first_name')
          .eq('email', this.userEmail);
        
        if (error) {
          throw new Error('Error connecting to the database: ' + error.message);
        }
        
        this.userFirstName = data.length > 0 ? data[0].first_name : null;
      } catch (error) {
        console.error('Error fetching user first name:', error);
      }
    },
    
    saveState() {
      const state = {
        filter: this.filter,
        orderMode: this.orderMode,
        selectedGenre: this.selectedGenre,
        minImdbRating: this.minImdbRating,
        maxImdbRating: this.maxImdbRating,
        minImdbVotes: this.minImdbVotes,
        maxImdbVotes: this.maxImdbVotes,
        selectedUserRating: this.selectedUserRating,
        customYearStart: this.customYearStart,
        customYearEnd: this.customYearEnd
      };
      localStorage.setItem('watchlistState', JSON.stringify(state));
    },

    restoreState() {
      const savedState = localStorage.getItem('watchlistState');
      if (savedState) {
        try {
          const state = JSON.parse(savedState);
          if (state.filter) this.filter = state.filter;
          if (state.orderMode) this.orderMode = state.orderMode;
          if (state.selectedGenre) this.selectedGenre = state.selectedGenre;
          if (state.minImdbRating) this.minImdbRating = state.minImdbRating;
          if (state.maxImdbRating) this.maxImdbRating = state.maxImdbRating;
          if (state.minImdbVotes) this.minImdbVotes = state.minImdbVotes;
          if (state.maxImdbVotes) this.maxImdbVotes = state.maxImdbVotes;
          if (state.selectedUserRating) this.selectedUserRating = state.selectedUserRating;
          if (state.customYearStart) this.customYearStart = state.customYearStart;
          if (state.customYearEnd) this.customYearEnd = state.customYearEnd;
        } catch (e) {
          console.error('Error restoring watchlist state:', e);
        }
      }
    },
    
    
    validatePageInput() {
      if (!this.currentPage || this.currentPage < 1) {
        this.currentPage = 1;
      } else if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
    },
    
  },

  directives: {
    'click-outside': {
      mounted(el, binding) {
        el.clickOutsideEvent = function(event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event);
          }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
      },
      unmounted(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent);
      },
    }
  },
  computed: {
    visibleCustomLists() {
      if (!this.userCustomLists) return [];
      const start = (this.listSelectorPage - 1) * 5;
      const end = start + 5;
      return this.userCustomLists.slice(start, end);
    },
    selectorTotalPages() {
      if (!this.userCustomLists) return 0;
      return Math.ceil(this.userCustomLists.length / 5);
    },
    selectedMoviesCount() {
      return this.selectedItems.filter(item => item.media_type === 'movie').length;
    },
    selectedTvShowsCount() {
      return this.selectedItems.filter(item => item.media_type === 'tv').length;
    },
    showEmptyState() {
      return !this.isLoadingFavorites && 
            this.moviesFetched.length === 0 && 
            this.tvFetched.length === 0;
    },
    
    showTabEmptyState() {
      if (this.isLoadingFavorites) return false;
      
      const currentItems = this.filter === 'movies' ? this.moviesFetched : this.tvFetched;
      
      return currentItems.length === 0 && (this.moviesFetched.length > 0 || this.tvFetched.length > 0);
    },
    
    emptyStateMessage() {
      if (this.showEmptyState) {
        return 'No favoritos agregados todavía';
      }
      if (this.showTabEmptyState) {
        return this.filter === 'movies' 
          ? 'No películas agregadas todavía' 
          : 'No series agregadas todavía';
      }
      return '';
    },
    hasActiveFilters() {
      return this.selectedGenre !== '' || 
            this.minImdbRating !== null ||
            this.maxImdbRating !== null ||
            this.minImdbVotes !== null ||
            this.maxImdbVotes !== null ||
            this.selectedUserRating !== '' || 
            this.customYearStart !== null || 
            this.customYearEnd !== null ||
            this.orderMode !== 'latest-added';
    },
    
    activeFilterChips() {
      const chips = [];
      
      if (this.selectedGenre) {
        chips.push({ type: 'genre', label: this.selectedGenre, value: 'selectedGenre' });
      }
      
      if (this.customYearStart) {
        chips.push({ type: 'year', label: `Desde ${this.customYearStart}`, value: 'customYearStart' });
      }
      
      if (this.customYearEnd) {
        chips.push({ type: 'year', label: `Hasta ${this.customYearEnd}`, value: 'customYearEnd' });
      }
      
      if (this.minImdbRating !== null || this.maxImdbRating !== null) {
        let label = '';
        if (this.minImdbRating !== null && this.maxImdbRating !== null) {
           if (this.minImdbRating === this.maxImdbRating) {
             label = `IMDB: ${this.minImdbRating}`;
           } else {
             label = `IMDB: ${this.minImdbRating}-${this.maxImdbRating}`;
           }
        } else if (this.minImdbRating !== null) {
          label = `IMDB: ≥ ${this.minImdbRating}`;
        } else if (this.maxImdbRating !== null) {
          label = `IMDB: ≤ ${this.maxImdbRating}`;
        }

        chips.push({ 
          type: 'imdbRating', 
          label: label, 
          value: 'imdbRating' 
        });
      }

      if (this.minImdbVotes !== null || this.maxImdbVotes !== null) {
        let label = '';
        if (this.minImdbVotes !== null && this.maxImdbVotes !== null) {
           label = `Votos: ${this.minImdbVotes}-${this.maxImdbVotes}`;
        } else if (this.minImdbVotes !== null) {
          label = `Votos: ≥ ${this.minImdbVotes}`;
        } else if (this.maxImdbVotes !== null) {
          label = `Votos: ≤ ${this.maxImdbVotes}`;
        }

        chips.push({ 
          type: 'imdbVotes', 
          label: label, 
          value: 'imdbVotes' 
        });
      }
      
      if (this.selectedUserRating) {
        const label = this.selectedUserRating === 'not-rated' 
          ? 'Sin Valorar' 
          : `Mi Cal: ${this.selectedUserRating}`;
        chips.push({ type: 'user', label, value: 'selectedUserRating' });
      }
      
      if (this.orderMode !== 'latest-added') {
        chips.push({ 
          type: 'sort', 
          label: `Ordenado por: ${this.currentSortLabel}`, 
          value: 'orderMode' 
        });
      }
      
      return chips;
    },
    sortOptions() {
      return [
        { value: 'latest-added', label: 'Últimos Añadidos' },
        { value: 'earliest-added', label: 'Primeros Añadidos' },
        { value: 'newer-releases', label: 'Estrenos Recientes' },
        { value: 'older-releases', label: 'Estrenos Antiguos' },
        { value: 'imdb-high', label: 'Mejor Calificados (IMDB)' },
        { value: 'imdb-low', label: 'Peor Calificados (IMDB)' },
        { value: 'votes-high', label: 'Más Votados' },
        { value: 'votes-low', label: 'Menos Votados' },
        { value: 'shortest-first', label: 'Más Cortos' },
        { value: 'longest-first', label: 'Más Largos' }
      ];
    },
    
    currentSortLabel() {
      const option = this.sortOptions.find(opt => opt.value === this.orderMode);
      return option ? option.label : 'Últimos Añadidos';
    },
    filteredRatedItems() {
      const items = this.ratedItemsTab === 'movies' ? this.moviesFetched : this.tvFetched;
      if (!items) return [];
      return items.filter(item => 
        item && item.details && 
        item.details.userRatingForDb && 
        item.details.userRatingForDb !== '-' && 
        parseInt(item.details.userRatingForDb) > 0
      );
    },
    
  filteredItems() {
    const items = this.filter === 'movies' ? this.moviesFetched : this.tvFetched;
    if (!items) return [];
    return items.filter(item => {
      if (!item || !item.details) return false;

      const matchesGenre = this.selectedGenre === '' || 
        (item.details.genresForDb && item.details.genresForDb.includes(this.selectedGenre));
      
      const matchesYear = (!this.customYearStart && !this.customYearEnd) || 
        (item.details.yearStartForDb && 
        item.details.yearStartForDb >= (this.customYearStart || 1880) && 
        item.details.yearStartForDb <= (this.customYearEnd || this.currentYear));

      let matchesTmdbRating = true;
      if (this.minImdbRating !== null || this.maxImdbRating !== null) {
        let rating;
        if (item.details.rating_source === 'imdb' && item.details.imdb_rating) {
          rating = item.details.imdb_rating;
        } else if (item.details.starsForDb) {
          rating = parseFloat(this.formatRating(item.details.starsForDb));
        }
        
        if (rating === undefined || rating === null) {
          matchesTmdbRating = false;
        } else {
          const min = this.minImdbRating !== null ? this.minImdbRating : 0;
          const max = this.maxImdbRating !== null ? this.maxImdbRating : 10;
          
          matchesTmdbRating = rating >= min && rating <= max;
        }
      }
      
      let matchesUserRating = true;
      if (this.selectedUserRating !== '') {
        if (this.selectedUserRating === 'not-rated') {
          matchesUserRating = !item.details.userRatingForDb || 
                            item.details.userRatingForDb === '-' ||
                            item.details.userRatingForDb === undefined;
        } else {
          if (!item.details.userRatingForDb || 
              item.details.userRatingForDb === '-' || 
              item.details.userRatingForDb === undefined) {
            matchesUserRating = false;
          } else {
            const userRating = parseInt(item.details.userRatingForDb);
            if (isNaN(userRating)) {
              matchesUserRating = false;
            } else if (this.selectedUserRating.includes('-')) {
              const [min, max] = this.selectedUserRating.split('-').map(Number);
              matchesUserRating = userRating >= min && userRating <= max;
            } else {
              matchesUserRating = userRating === parseInt(this.selectedUserRating);
            }
          }
        }
      }

      let matchesVotes = true;
      if (this.minImdbVotes !== null || this.maxImdbVotes !== null) {
        let votes = 0;
        if (item.details.imdb_votes) {
          if (typeof item.details.imdb_votes === 'number') {
            votes = item.details.imdb_votes;
          } else if (typeof item.details.imdb_votes === 'string') {
            votes = parseInt(item.details.imdb_votes.replace(/,/g, ''), 10);
          }
        }
        
        if (this.minImdbVotes !== null && votes < this.minImdbVotes) {
          matchesVotes = false;
        }
        if (this.maxImdbVotes !== null && votes > this.maxImdbVotes) {
          matchesVotes = false;
        }
      }
      
      return matchesGenre && matchesYear && matchesTmdbRating && matchesUserRating && matchesVotes;
      }).sort((a, b) => {
        const getAddedDate = (item) => {
          const dateStr = item.details.added_at || item.addedAt || item.details.addedAt;
          return dateStr ? new Date(dateStr) : new Date(0);
        };
        
        const getYear = (item) => {
          const year = item.details.yearEndForDb || item.details.yearStartForDb;
          return year || 9999;
        };

        const getWeightedRating = (item) => {
          let R = 0;
          let v = 0;

          if (item.details.rating_source === 'imdb' && item.details.imdb_rating) {
            R = parseFloat(item.details.imdb_rating);
            
            const votes = item.details.imdb_votes;
            if (typeof votes === 'number') {
              v = votes;
            } else if (typeof votes === 'string') {
              v = parseInt(votes.replace(/,/g, ''), 10);
            } else {
              v = 0;
            }
          } else if (item.details.starsForDb) {
            R = parseFloat(this.formatRating(item.details.starsForDb));
            v = 0;
          } else {
            return -1;
          }

          const m = 1000;
          const C = 7.0;

          const WR = (v / (v + m)) * R + (m / (v + m)) * C;

          return WR;
        };

        const getVotes = (item) => {
          if (item.details.imdb_votes) {
            if (typeof item.details.imdb_votes === 'number') {
              return item.details.imdb_votes;
            } else if (typeof item.details.imdb_votes === 'string') {
              return parseInt(item.details.imdb_votes.replace(/,/g, ''), 10);
            }
          }
          return 0;
        };

        const getRuntime = (item) => {
           if (item.details.runtime) return item.details.runtime;
           return 0;
        };

        switch(this.orderMode) {
          case 'latest-added':
            return getAddedDate(b) - getAddedDate(a);
          case 'earliest-added':
            return getAddedDate(a) - getAddedDate(b);
          case 'newer-releases':
            return getYear(b) - getYear(a);
          case 'older-releases':
            return getYear(a) - getYear(b);
          case 'imdb-high':
            const ratingBHigh = getWeightedRating(b);
            const ratingAHigh = getWeightedRating(a);
            if (ratingAHigh === -1 && ratingBHigh === -1) return 0;
            if (ratingAHigh === -1) return 1;
            if (ratingBHigh === -1) return -1;
            return ratingBHigh - ratingAHigh;
          case 'imdb-low':
            const ratingBLow = getWeightedRating(b);
            const ratingALow = getWeightedRating(a);
            if (ratingALow === -1 && ratingBLow === -1) return 0;
            if (ratingALow === -1) return 1;
            if (ratingBLow === -1) return -1;
            return ratingALow - ratingBLow;
          case 'votes-high':
            return getVotes(b) - getVotes(a);
          case 'votes-low':
             return getVotes(a) - getVotes(b);
          case 'shortest-first':
             return getRuntime(a) - getRuntime(b);
          case 'longest-first':
             return getRuntime(b) - getRuntime(a);
          default:
            return 0;
        }
      });
  },


    yearRanges() {
      const currentYear = new Date().getFullYear();
      return [
        '1888-1960',
        '1960-1980',
        '1980-2000',
        '2000-2010',
        '2010-2020',
        `2020-${currentYear}`,
      ];
    },
    uniqueGenres() {
      return Array.from(new Set(this.genres));
    },
    sortedMovieGenres() {
      return this.movieGenres.sort();
    },
    sortedTvGenres() {
      return this.tvGenres.sort();
    },
    uniqueSortedGenres() {
      const allGenres = new Set([...this.movieGenres, ...this.tvGenres]);
      return Array.from(allGenres).sort();
    },
    
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage);
    },

    itemsToShow() {
      let page = this.currentPage;
      if (!page || page < 1) page = 1;
      if (page > this.totalPages) page = this.totalPages;
      const start = (page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredItems.slice(start, end);
    },

    filterText() {
      return this.filter === 'tvShows' ? 'Series de TV Favoritas' : 'Películas Favoritas';
    }
  },
};
</script>

<style scoped>
.card__content {
  display: flex;
  justify-content: center; 
  align-items: center; 
  margin: -5px;
  position: relative;
  min-height: 30px;
  top: -3px;
}

.card__stars {
  width: 7.3rem;
  height: 1.2rem;
  background-image: url('@/assets/images/stars.png');
  background-repeat: no-repeat;
  background-size: auto 100%;
  position: relative;
  margin-right: 0.5rem; 
}

.card__stars > div {
  height: 100%;
  background-image: url('@/assets/images/stars-filled.png');
  background-repeat: no-repeat;
  background-size: auto 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.card__rating {
  margin-top: 0.30rem;
}

.card___rating {
  position: relative;
  top: 1px;
}

.movie-card {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.delete-icon {
    display: block;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
}

@media screen and (min-width: 724px) {
  .delete-icon:hover,
  .delete-icon:hover .cls-1 {
    fill: #ff0000;
  }
}



.navbar-welcome {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(220, 220, 220) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-top: 20px;
  text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
  font-family: 'Roboto', sans-serif;
}

.text-center {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(220, 220, 220) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
  font-family: 'Roboto', sans-serif;
}

.welcome-text {
    text-align: center;
}

.h1 {
  text-align: center;
}

.order-word {
    color: #fff;
}

.order-option {
    color: #94999d;
}

.navbar {
    background-color: transparent;
    margin-top: 4rem;
    top: 1rem;
    position: relative;
    text-align: center;
    max-width: 800px; 
    margin: 0 auto; 
    top: 8px;
    transition: none 0s ease 0s;
  } 

  .navbar-title {
    color: #fff;
    margin: 0 auto;
    font-weight: bold;
    font-size: 1.5rem;
  }

  .nav-button-container {
    position: absolute; 
    top: 50%;
    transform: translateY(-50%);
    right: 20px; 
  }

  .button-container {
    top: 50%;
    right: 20px; 
  }

.button-container select {
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}

@media screen and (max-width: 1024px) {
  .button-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .button-container select {
    width: 40%;
    margin: 0.5rem;
  }
}
  .button-logout {
    background-color: #062F40;
    color: #fff;
    border: none;
    margin-left: 8px;
    padding: 1rem 1.5rem;
    border-radius: 5px;
    cursor: pointer;
    transition: color 0.3s, background-color 0.3s;
    font-weight: bold; 
    font-size: 13px; 
    border-radius: 15px;
  }

  .button-logout:hover {
    background-color: #B22727;
  }

  .order-select {
    cursor: pointer;
    width: 170.626px;
    height: 34.6172px;
    text-align: center;
    padding: 0.8rem 3.5rem 0.8rem 1.5rem;
    font-size: 1.3rem;
    color: #fff;
    margin-right: 15px;
    background: rgba( 82, 71, 71, 0 );
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur( 16px );
    -webkit-backdrop-filter: blur( 16px );
    border: 1px solid rgba( 255, 255, 255, 0.18 );
  }

  .order-select:hover{
    background: linear-gradient(
315deg, #0A1E26, #11323F, #1A4453); 
  }

  .filter-select {
    background: rgba( 82, 71, 71, 0 );
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur( 16px );
    -webkit-backdrop-filter: blur( 16px );
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-bottom-left-radius: none !important;
    border-bottom-right-radius: none !important; 
    width: 165.626px;
    text-align: center;
    margin-right: 15px;
    border: 1px solid rgba( 255, 255, 255, 0.18 );
  }

  .filter-select:hover{
    background: linear-gradient(
315deg, #0A1E26, #11323F, #1A4453); 
  }

  .genre-select {
    background: rgba( 82, 71, 71, 0 );
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur( 16px );
    -webkit-backdrop-filter: blur( 16px );
    text-align: center;
    width: 165.626px;
    margin-right: 15px;
    border: 1px solid rgba( 255, 255, 255, 0.18 );
  }

  .genre-select:hover{
    background: linear-gradient(
315deg, #0A1E26, #11323F, #1A4453); 
  }

  .dropdown-header {
    padding: 8px 12px;
    font-size: 11px;
    font-weight: bold;
    color: #8BE9FD;
    background-color: rgba(0, 0, 0, 0.4);
    letter-spacing: 1px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    pointer-events: none;
  }

  .year-select {
    width: 165.626px;
    background: rgba( 82, 71, 71, 0 );
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur( 16px );
    -webkit-backdrop-filter: blur( 16px );
    border-radius: 5px;
    margin-right: 5px;
    text-align: center;

    border: 1px solid rgba( 255, 255, 255, 0.18 );
  }

  .year-select:hover{
    background: linear-gradient(
315deg, #0A1E26, #11323F, #1A4453); 
  }

  .button:hover{
    background: linear-gradient(
315deg, #0A1E26, #11323F, #1A4453); 
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    width: 97% !important;
    margin: 0 auto;
    background: rgba(0, 0, 0, 0.307);
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur(16px);
    padding: 8px;
    gap: 0.5rem;
    border: 0.5px #31414C solid;
    top: 2px;
    margin-top: 3rem;
    position: relative;
    padding-top: 1rem;
    margin-bottom: 0.5rem;
}

.pagination-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    width: 97% !important;
    margin: 0 auto;
    background: rgba(0, 0, 0, 0.307);
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur(16px);
    padding: 8px;
    gap: 0.5rem;
    border: 0.5px #31414C solid;
    top: -15px;
    position: relative;
}


.pagination button {
  padding: 0.5rem 1rem;
  background: rgba( 82, 71, 71, 0 );
  box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
  backdrop-filter: blur( 16px );
  -webkit-backdrop-filter: blur( 16px );
  border-radius: 25px;
  color: #fff;
  margin: 5px;
  cursor: pointer;
}

.pagination-footer button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-footer button {
  padding: 0.5rem 1rem;
  background: rgba( 82, 71, 71, 0 );
  box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
  backdrop-filter: blur( 16px );
  -webkit-backdrop-filter: blur( 16px );
  border-radius: 25px;
  border: 1px solid rgba( 255, 255, 255, 0.18 );
  color: #fff;
  margin: 5px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

  .button,
  a.button {
    display: inline-block;
    padding: 1.5rem 1.5rem;
    font-size: 1.5rem;
    font-weight: 500;
    line-height: 1;
  color: #fff;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination button:active,
.pagination-footer button:active {
  transform: scale(1.1);
}

.pagination-text-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.pagination-label,
.pagination-text {
  font-family: 'Ortica', 'Roboto', sans-serif;
  color: #8BE9FD;
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.pagination-input {
  background-color: #0C181F;
  color: #8BE9FD;
  font-family: 'Roboto', sans-serif;
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 7px;
  text-align: center;
  padding: 4px 2px;
  height: 28px;
  width: 50px;
  font-size: 1.1rem;
  outline: none;
  transition: border-color 0.2s;
  -moz-appearance: textfield;
  appearance: textfield;
}

.pagination-input::-webkit-outer-spin-button,
.pagination-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

.pagination-input:focus {
  border-color: #8BE9FD;
}

.pagination-number {
  font-family: 'Roboto', sans-serif;
}




  .order-button {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    background-color: transparent;
    border: none;
    color: white;
    font-size: 14px;
    font-weight: bold;
  }

  .order-button svg {
    width: 20px;
    height: 14px;
    margin-left: 5px;
    transition: transform 0.3s ease;
  }

  .order-button span {
    transition: color 0.3s ease;
  }

  .rotate-180 {
    transform: rotate(180deg);
  }
  
  a {
    font-weight: 600;
    color: #80868b;
    text-decoration: none;
  }

  p {
    margin-block-start: 0.3em;
    margin-block-end: 0.3em;
  }

  a:hover {
    color: #ffffff;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px; 
    letter-spacing: 2px;
  }

  h3 {
    margin-top: 5px;
    text-align: center;
    letter-spacing: 1.5px;
  }

  .button-container {
    display: flex;
    justify-content: center;
  }

  .button {
    margin: 0 10px; 
    font-size: 14px; 
  }

  @media screen and (max-width: 800px) {
  .navbar {
    top: 8px;
    transition: none 0s ease 0s;
  } 
}

@media screen and (max-width: 600px) {
  .button .navbar-title {
    font-size: 12px; 
  }

  
  .button-logout {
    align-items: flex-start;
    display: inline-block;
    line-height: 16.1px;
    right: 1;
    text-align: center;
  }

  .navbar-title {
    text-align: center;
  }
}

@media screen and (max-width: 375px) {
  .button {
    font-size: 12px; 
  }
}

@media screen and (max-width: 767px) {
    .nav-button-container {
      position: static;
      margin-top: 30px; 
    }
  }


  .watchlist-section {
    padding: 10px;
    
  }

  .movie-card h3,
  .tv-show-card h3 {
    margin-top: 5px;
    color: #8BE9FD;
    font-size: 14px; 
    margin-top: 10px; 
    text-align: center; 
    overflow: hidden; 
    display: -webkit-box;
    -webkit-line-clamp: 2;
  line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
    text-overflow: ellipsis; 
    height: 2.4em; 
    line-height: 1.2em;
  }
  .movie-card h3:hover,
  .tv-show-card h3:hover {
    color: #ffffff; 
    cursor: pointer; 
  }

  .movie-card p,
  .tv-show-card p {
    font-size: 12px;
    margin: 5px auto; 
    text-align: center;
  }

  .column {
    margin-top: 3rem;
    margin: 0 auto;
    text-align: center;
    max-width: 800px; 
  }

  h2 {
    text-align: center;
    letter-spacing: 2px;
    font-size: 13px;
    text-transform: uppercase;
    margin: 0 auto; 
    max-width: 800px; 
  }

  .custom-center {
    text-align: center;
  }

  .movie-grid,
  .tv-show-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
    gap: 20px;
    background-color: rgba(0, 0, 0, 0.307);
    border-radius: 15px;
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur(16px);
    justify-content: center;
    padding-left: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-right: 1rem;
  }

  .card-background {
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    background: black;
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .movie-info-container {
    padding: 10px;
    text-align: center;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  .user-rating-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: #000;
    color: #88E9FD;
    border: 3px solid;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
    z-index: 4;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .user-rating-badge:hover {
    transform: scale(1.1);
    box-shadow: 0 0 10px rgba(139, 233, 253, 0.5);
  }
  
  .user-rating-badge.has-review {
    overflow: visible;
  }
  
  .review-indicator {
    position: absolute;
    top: -3px;
    right: -3px;
    width: 10px;
    height: 10px;
    background-color: #fff;
    border-radius: 50%;
    border: 2px solid #041019;
  }
  
  .user-rating-badge.empty {
    background-color: #000;
    color: #88E9FD;
    border: 2px solid;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 9px;
    text-transform: uppercase;
  }

  .movie-card img,
  .tv-show-card img {
    width: 60%; 
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    text-align: center;
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur( 16px );
    -webkit-backdrop-filter: blur( 16px );
    border: 1px solid rgba( 255, 255, 255, 0.18 );
  }
  
  .item-link {
    display: block;
    text-decoration: none;
    color: inherit;
    text-align: center;
    transition: transform 0.2s ease;
  }
  
  .item-link:hover {
    transform: translateY(-5px);
  }

  .rated-items-btn {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    border-radius: 30px;
    padding: 8px 15px;
    font-size: 1.3rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    position: absolute;
    bottom: -65px;
    right: 40%;
    transition: all 0.2s ease;
  }
  
  .rated-items-btn:hover {
    background: rgba(139, 233, 253, 0.2);
    border-color: #8BE9FD;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  .rated-items-btn svg {
    fill: #8BE9FD;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
    padding: 20px;
    font-family: 'Roboto', 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;
  }
  
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.307);
  }
  
  .modal-header h3 {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 500;
    text-align: center;
    font-family: 'Ortica', 'Roboto', sans-serif;
    font-weight: 300;
    letter-spacing: 0.05em;
    line-height: 1.2;
    color: #8BE9FD;
    text-shadow: 
        0 1px 2px rgba(255, 255, 255, 0.3),
        0 2px 8px rgba(255, 255, 255, 0.2),
        0 4px 16px rgba(139, 233, 253, 0.15);
    flex: 1;
  }
  
  .close-btn {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    font-size: 4rem;
    cursor: pointer;
    line-height: 1;
    transition: all 0.2s ease;
    padding: 0;
    margin: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .close-btn:hover {
    color: #fff;
  }
  
  .tab-btn {
    flex: 1;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    font-size: 1.4rem;
    padding: 12px 0;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    text-align: center;
    font-family: 'Ortica', 'Roboto', sans-serif;
    font-weight: 300;
    letter-spacing: 0.05em;
    line-height: 1.2;
    text-shadow: 
        0 1px 2px rgba(255, 255, 255, 0.3),
        0 2px 8px rgba(255, 255, 255, 0.2),
        0 4px 16px rgba(139, 233, 253, 0.15);
    }
  
  .tab-btn.active {
    color: #8BE9FD;
  }
  
  .tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: #8BE9FD;
  }

  .rating-badge {
    background: #8BE9FD;
    color: #000;
    font-size: 12px;
    font-weight: bold;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .rating-badge.editable {
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .rating-badge.editable:hover {
    background: #66deff;
    transform: scale(1.1);
  }
  
  .rating-edit-controls {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .rating-select {
    background: #041019;
    color: white;
    border: 1px solid #8BE9FD;
    border-radius: 4px;
    padding: 3px;
    width: 40px;
  }
  
  .edit-btn {
    background: transparent;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    position: relative;
  }

  .edit-btn-rvw {
    background: transparent;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 15 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 20px;
    border-radius: 15px;
    gap: 20px;
    position: relative;
  }
  
  .save-btn {
    background: #8BE9FD;
    color: #000;
  }
  
  .save-btn:hover {
    background: #518692

  }
  
  .cancel-btn {
    background: rgba(255, 0, 0, 0.2);
  }
  
  .cancel-btn:hover {
    background: rgba(255, 0, 0, 0.4);
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 20px;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
  }
  
  .empty-state svg {
    width: 50px;
    height: 50px;
    margin-bottom: 20px;
    opacity: 0.5;
  }
  
  .empty-state p {
    font-size: 1.4rem;
    margin: 0;
  }
  
  @media (max-width: 768px) {
    .rated-items-btn {
      right: 30%;
    }
  }
  
  @media (max-width: 480px) {
    .rated-items-btn {
      right: 15%;
      font-size: 1.1rem;
      padding: 6px 12px;
    }
    
    .modal-header h3 {
      font-size: 1.4rem;
    }
    
    .tab-btn {
      font-size: 1.3rem;
    }
  }
  

  @media screen and (max-width: 600px) {
  .movie-grid,
  .tv-show-grid {
    grid-template-columns: repeat(auto-fill, minmax(105px, 1fr)); 
  }

  .movie-card,
  .tv-show-card {
    width: 100%;
    max-width: none; 
  }

  .movie-card img,
  .tv-show-card img {
    width: 100%; 
    max-width: none; 
  }
}

@media screen and (min-width: 601px) {
  .movie-grid,
  .tv-show-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
  }

  .movie-card,
  .tv-show-card {
    width: 100%; 
    max-width: none;
  }

  .movie-card img,
  .tv-show-card img {
    width: 100%; 
    max-width: none; 
  }
}

@media (max-width: 600px) {
  .card__stars {
    transform: scale(0.8);
    transform-origin: left;
  }
  
  .card___rating p {
    font-size: 10px !important;
  }
  
  .user-rating-badge {
    width: 24px !important;
    height: 24px !important;
    font-size: 11px !important;
  }
  
  .poster-container h3 {
     font-size: 11px !important;
  }
}

.rating-modal {
  width: 100%;
  max-width: 360px;
  background: linear-gradient(to bottom right, #092739, #061720);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.307);
}

.modal-header h3 {
  margin: 0;
  color: #8BE9FD;
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  flex: 1;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 3rem;
  cursor: pointer;
  line-height: 1;
  transition: all 0.2s ease;
  padding: 0;
  margin: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #fff;
}

.rating-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rating-selector {
  width: 100%;
  margin-bottom: 20px;
}

.rating-numbers {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.rating-numbers::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  background: rgba(255, 255, 255, 0.07);
  transform: translateY(-50%);
  z-index: 0;
}

.rating-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: #041019;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
  z-index: 2;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rating-btn-active {
  background: #8BE9FD;
  color: #000;
  transform: scale(1.15);
  box-shadow: 0 0 10px rgba(139, 233, 253, 0.5);
}

.rating-btn:hover {
  transform: scale(1.15);
}

.review-section {
  width: 100%;
  position: relative;
  margin-bottom: 20px;
}

.review-textarea {
  width: 100%;
  height: 100px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  color: #fff;
  font-size: 1.3rem;
  resize: none;
  transition: border-color 0.2s ease;
}

.review-textarea:focus {
  outline: none;
  border-color: rgba(139, 233, 253, 0.5);
}

.review-textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.char-count {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.4);
}

.save-btn {
  background: #8BE9FD;
  color: #000;
  border: none;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 30px;
  text-align: center;
}

.save-btn:hover {
  background: #7AD6E9;
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(139, 233, 253, 0.3);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 400px) {
  .rating-modal {
    max-width: 300px;
  }

  .rating-btn {
    width: 22px;
    height: 22px;
    font-size: 11px;
  }

  .modal-header h3 {
    font-size: 1.4rem;
  }

  .review-textarea {
    font-size: 1.2rem;
  }
}

.poster-container {
  position: relative;
  aspect-ratio: 2 / 3;
  background: #000;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  overflow: hidden;
  width: 100%;
}

.poster-loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.poster {
  width: 100%; 
  height: 100%;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  text-align: center;
  box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  position: absolute;
  top: 0;
  left: 0;
}

.poster.loaded {
  opacity: 1;
}

.tmdb-rating-select,
.user-rating-select {
  width: 165.626px;
  background: rgba(82, 71, 71, 0);
  box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 5px;
  text-align: center;
  margin-right: 15px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #fff;
  padding: 0.8rem 1.5rem; 
  cursor: pointer;
  font-size: 1.3rem;
}

.tmdb-rating-select:hover,
.user-rating-select:hover {
  background: linear-gradient(
315deg, #0A1E26, #11323F, #1A4453);
}

select.tmdb-rating-select,
select.user-rating-select {
  appearance: none;
  -webkit-appearance: none;
  appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7rem top 50%;
  background-size: 0.65rem auto;
  padding-right: 2.5rem;
}

@media screen and (max-width: 1024px) {
  .tmdb-rating-select,
  .user-rating-select {
    width: 40%;
    margin: 0.5rem;
    font-size: 1.1rem;
    padding: 0.7rem 1.2rem;
  }
}


.new-controls-container {
 display: flex;
 justify-content: center;
 align-items: center;
 gap: 20px;
 flex-wrap: wrap;
 margin-top: 3rem;
 min-height: 50px;
}

.content-type-switch {
 display: flex;
 background: rgba(0, 0, 0, 0.2);
 border-radius: 25px;
 padding: 2px;
 border: 1px solid rgba(255, 255, 255, 0.18);
}

.switch {
  --_switch-bg-clr: rgba(0, 0, 0, 0);
  --_switch-padding: 3px;
  --_slider-bg-clr: rgba(31, 104, 135, 0.4);
  --_slider-bg-clr-on: #8BE9FD;
  --_slider-txt-clr: #ffffff;
  --_label-padding: 10px 20px;
  --_switch-easing: cubic-bezier(0.47, 1.64, 0.41, 0.8);
  
  color: rgba(255, 255, 255, 0.7);
  width: fit-content;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  position: relative;
  isolation: isolate;
  border-radius: 25px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  font-size: 1.3rem;
  align-self: center;
  margin: 0;
}

.switch input[type="checkbox"] {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.switch > span {
  display: grid;
  place-content: center;
  transition: all 300ms ease-in-out;
  padding: var(--_label-padding);
  white-space: nowrap;
  z-index: 1;
}

.switch::before,
.switch::after {
  content: "";
  position: absolute;
  border-radius: inherit;
  transition: inset 150ms ease-in-out;
}

.switch::before {
  background-color: var(--_slider-bg-clr-on);
  inset: var(--_switch-padding) 50% var(--_switch-padding) var(--_switch-padding);
  transition: inset 500ms var(--_switch-easing), background-color 500ms ease-in-out;
  z-index: 0;
  border-radius: 22px;
}

.switch::after {
  background-color: var(--_switch-bg-clr);
  inset: 0;
  z-index: -1;
}

.switch:hover {
  transform: translateY(-1px);
}

.switch:has(input:checked)::before {
  background-color: var(--_slider-bg-clr-on);
  inset: var(--_switch-padding) var(--_switch-padding) var(--_switch-padding) 50%;
}

.switch > span:first-of-type {
  opacity: 1;
  color: #000;
  font-weight: 500;
}

.switch > span:last-of-type {
  opacity: 0.7;
  color: rgba(255, 255, 255, 0.7);
}

.switch:has(input:checked) > span:first-of-type {
  opacity: 0.7;
  color: rgba(255, 255, 255, 0.7);
  font-weight: normal;
}

.switch:has(input:checked) > span:last-of-type {
  color: #000;
  opacity: 1;
  font-weight: 500;
}

.switch-btn {
 background: transparent;
 border: none;
 color: rgba(255, 255, 255, 0.7);
 border-radius: 23px;
 cursor: pointer;
 transition: all 0.3s ease;
 font-size: 1.3rem;
 display: flex;
 align-items: center;
 justify-content: center;
 white-space: nowrap;
 flex: 1;
 padding: 8px 16px;
}

.switch-btn.active {
  background: #8BE9FD;
  color: #000;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: rgba(82, 71, 71, 0);
  box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 25px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.3rem;
  align-self: center;
  margin: 0;
}

.control-btn:hover {
  background: linear-gradient(
315deg, #0A1E26, #11323F, #1A4453);
}

.filters-modal {
  width: 100%;
  max-width: 500px;
  background: linear-gradient(to bottom right, #092739, #061720);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.filters-content {
  padding: 20px;
}

.filter-group {
  margin-bottom: 20px;
}

.filter-label {
  display: block;
  color: #8BE9FD;
  font-size: 1.4rem;
  margin-bottom: 8px;
  font-weight: 500;
}

.filter-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px;
  color: #fff;
  font-size: 1.3rem;
}

.year-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.year-input {
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px;
  color: #fff;
  font-size: 1.3rem;
}

.year-separator {
  color: rgba(255, 255, 255, 0.7);
  font-weight: bold;
}

.quick-year-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.year-quick-btn {
  padding: 5px 10px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s ease;
}

.year-quick-btn:hover {
  background: rgba(139, 233, 253, 0.2);
  border-color: #8BE9FD;
}

.filter-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.clear-btn, .apply-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1.3rem;
  transition: all 0.2s ease;
}

.clear-btn {
  background: rgba(255, 0, 0, 0.2);
  color: #fff;
}

.apply-btn {
  background: #8BE9FD;
  color: #000;
}

@media (max-width: 768px) {
  .new-controls-container {
    flex-direction: column;
    gap: 15px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .control-btn {
    justify-content: center;
  }
}
.custom-select {
  position: relative;
  width: 100%;
  cursor: pointer;
}

.select-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px;
  color: #fff;
  font-size: 1.3rem;
  transition: all 0.2s ease;
}

.select-display:hover {
  border-color: rgba(139, 233, 253, 0.5);
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #092739;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  margin-top: 2px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.dropdown-item {
  padding: 8px 12px;
  color: #e0e0e0;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  font-size: 13px;
  white-space: nowrap;
}

.menu-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 15;
  background: transparent;
  cursor: default;
}

.dropdown-option {
  padding: 10px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 1.3rem;
}

.dropdown-option:hover {
  background: rgba(139, 233, 253, 0.1);
}

.dropdown-option.selected {
  background: rgba(139, 233, 253, 0.2);
  color: #8BE9FD;
}

.year-input {
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px;
  color: #fff;
  font-size: 1.3rem;
  transition: border-color 0.2s ease;
}

.year-input:focus {
  outline: none;
  border-color: rgba(139, 233, 253, 0.5);
}

.year-input::-webkit-outer-spin-button,
.year-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

.year-input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.dropdown-options::-webkit-scrollbar {
  width: 6px;
}

.dropdown-options::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.307);
}

.dropdown-options::-webkit-scrollbar-thumb {
  background: rgba(139, 233, 253, 0.3);
  border-radius: 3px;
}

.dropdown-options::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 233, 253, 0.5);
}

.new-controls-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: nowrap;
  flex-direction: row;
  margin: 3rem auto 0 auto;
  min-height: 50px;
  width: fit-content;
}

@media (max-width: 800px) {
  .new-controls-container {
    flex-direction: row;
    flex-wrap: nowrap;
    margin: 3rem auto 0 auto;
    width: fit-content;
    gap: 15px;
  }
  
  .action-buttons {
    flex-direction: row;
    gap: 15px;
  }
  
  .control-btn span {
    display: none;
  }
  
  .control-btn {
    padding: 12px;
    min-width: 44px;
    height: 44px;
    justify-content: center;
    align-items: center;
  }
  
  .control-btn svg {
    margin: 0;
    width: 18px;
    height: 18px;
  }
  .btn-label {
    display: none;
  }
}

.rating-modal-buttons {
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: center;
}

.rating-modal-buttons .save-btn {
  flex: 1;
  max-width: 120px;
}

.remove-rating-btn {
  background: rgba(255, 0, 0, 0.2);
  color: #fff;
  border: 1px solid rgba(255, 0, 0, 0.4);
  font-size: 13px;
  font-weight: 600;
  padding: 10px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 30px;
  flex: 1;
  max-width: 120px;
  text-align: center;
}

.remove-rating-btn:hover {
  background: rgba(255, 0, 0, 0.4);
  border-color: rgba(255, 0, 0, 0.6);
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3);
}

@media (max-width: 400px) {
  .rating-modal-buttons {
    flex-direction: column;
  }
  
  .rating-modal-buttons .save-btn,
  .remove-rating-btn {
    max-width: 100%;
  }
}

.no-results-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  min-height: 400px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  margin: 20px auto;
  max-width: 600px;
}

.no-results-icon {
  width: 240px;
  height: 240px;
  margin-bottom: 25px;
  opacity: 0.7;
}

.no-results-state h3 {
  color: #8BE9FD;
  font-size: 2rem;
  margin: 0 auto 15px;
  letter-spacing: 1px;
  text-align: center;
}

.no-results-state p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.4rem;
  margin: 8px auto;
  line-height: 1.5;
  text-align: center;
}

.no-results-state .suggestion {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.3rem;
  margin: 15px auto 0;
  font-style: italic;
  text-align: center;
}

.refine-filters-btn {
  margin: 25px auto 0;
  padding: 12px 30px;
  background: rgba(139, 233, 253, 0.1);
  border: 1px solid #8BE9FD;
  border-radius: 25px;
  color: #8BE9FD;
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  display: block;
}

.refine-filters-btn:hover {
  background: rgba(139, 233, 253, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(139, 233, 253, 0.3);
}

@media (max-width: 768px) {
  .no-results-state {
    padding: 40px 15px;
    min-height: 300px;
  }
  
  .no-results-icon {
    width: 192px;
    height: 192px;
  }
  
  .no-results-state h3 {
    font-size: 1.6rem;
  }
  
  .no-results-state p {
    font-size: 1.2rem;
  }
}



.empty-state-icon {
  width: 200px;
  height: 200px;
  margin-bottom: 25px;
  opacity: 0.7;
}

.empty-state-container h3 {
  color: #8BE9FD;
  font-size: 2rem;
  margin: 0 auto 15px;
  letter-spacing: 1px;
}

.empty-state-container p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.4rem;
  margin: 8px auto;
  line-height: 1.5;
}

.active-filters-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  flex-wrap: nowrap;
  margin: 20px auto;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  max-width: 1200px;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(139, 233, 253, 0.15);
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 20px;
  padding: 6px 12px;
  color: #8BE9FD;
  font-size: 1.3rem;
}

.chip-remove {
  background: none;
  border: none;
  color: #8BE9FD;
  font-size: 1.8rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.chip-remove:hover {
  color: #fff;
}

.clear-all-inline {
  background: rgba(255, 0, 0, 0.2);
  border: 1px solid rgba(255, 0, 0, 0.4);
  color: #fff;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
  align-self: flex-start;
}

.clear-all-inline:hover {
  background: rgba(255, 0, 0, 0.4);
}

.sort-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}



.empty-state-container {
  display: flex !important;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #8b9bb4;
  text-align: center;
  margin-top: 4rem;
  position: relative;
  min-height: 400px;
  width: 100%;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.307);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 15px;
}

.loading-state svg {
  margin-bottom: 1rem;
}

.loading-state p {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.749);
}

.sort-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px 20px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.4rem;
  text-align: left;
  width: 100%;
}

.sort-option:hover {
  background: rgba(139, 233, 253, 0.1);
  border-color: rgba(139, 233, 253, 0.3);
}

.sort-option.active {
  background: rgba(139, 233, 253, 0.2);
  border-color: #8BE9FD;
  color: #8BE9FD;
}



@media (max-width: 768px) {
  .active-filters-indicator {
    flex-direction: column;
    align-items: stretch;
    flex-wrap: wrap;
  }
  
  .filter-chips {
    justify-content: flex-start;
  }
  
  .clear-all-inline {
    align-self: center;
    justify-content: center;
    width: auto;
    min-width: 120px;
  }
}
.empty-state-link {
  color: #8BE9FD;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  border-bottom: 1px solid transparent;
}

.empty-state-link:hover {
  color: #fff;
  border-bottom-color: #8BE9FD;
}

.ai-analysis-btn {
  position: relative;
}

.ai-analysis-btn.active {
  background: rgba(139, 233, 253, 0.2);
  border: 1px solid #8BE9FD;
  color: #8BE9FD;
}

.ai-selection-banner {
  background: rgba(139, 233, 253, 0.15);
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 8px;
  padding: 1rem 1.5rem;
  width: 97% !important;
  margin: 1rem auto;
}

.undo-banner {
  background: rgba(139, 233, 253, 0.15);
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 8px;
  padding: 1rem 1.5rem;
  width: 100%;
  max-width: 350px;
  margin: 1rem auto;
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.selection-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #8BE9FD;
  font-size: 14px;
  font-weight: 500;
}

.selection-info svg {
  flex-shrink: 0;
  color: #8BE9FD;
}

.limit-text {
  opacity: 0.7;
  font-size: 12px;
  margin-left: 0.5rem;
  color: #acafb5;
}

.banner-actions {
  display: flex;
  gap: 0.75rem;
}

.banner-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
}

.send-btn {
  background: #8BE9FD;
  color: #000;
  border-color: #8BE9FD;
}

.send-btn:hover:not(:disabled) {
  background: #a0ecfd;
  border-color: #a0ecfd;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.movie-card.selection-mode {
  cursor: pointer;
  transition: all 0.3s ease;
}

.movie-card.selection-mode:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 233, 253, 0.3);
}

.movie-card.selected {
  box-shadow: 0 0 15px rgba(139, 233, 253, 0.4);
}

.movie-card.disabled {
  opacity: 0.6;
}

.movie-card.disabled .card-background {
  pointer-events: none;
}

.movie-card.disabled .selection-checkbox {
  cursor: not-allowed;
}

.selection-checkbox {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 6px;
  padding: 4px;
  cursor: pointer;
}

.checkbox-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-wrapper input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.movie-card.selection-mode {
  cursor: pointer;
}

.movie-card.selection-mode .item-link:hover {
  transform: translateY(-2px); 
}

.movie-card.selection-mode.selected .card-background {
  box-shadow: 0 0 0 3px #8BE9FD; 
  overflow: hidden; 
}

.movie-card.selection-mode.selected img {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.selection-checkbox {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
}

.checkbox-wrapper {
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid #8BE9FD;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
}

.checkbox-wrapper input {
  display: none;
}

.movie-card.selected .checkbox-wrapper {
  background: #8BE9FD;
}

.checkmark {
  display: none;
  width: 14px;
  height: 14px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.movie-card.selected .checkmark {
  display: block;
}

.movie-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .banner-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .selection-info {
    justify-content: center;
  }
  
  .banner-actions {
    justify-content: center;
  }
  
  .selection-checkbox {
    top: 8px;
    left: 8px;
  }
  
  .checkbox-wrapper {
    width: 28px; 
    height: 28px;
  }
}

.info-icon-wrapper {
  cursor: pointer;
  margin-left: 8px;
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
  color: #8BE9FD;
  opacity: 0.8;
}

.info-icon-wrapper:hover {
  transform: scale(1.1);
  opacity: 1;
}

.info-modal {
  width: 90%;
  max-width: 500px;
  background: linear-gradient(to bottom right, #092739, #061720);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(139, 233, 253, 0.1);
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.info-modal-content {
  padding: 25px;
  color: #e0e0e0;
}

.info-intro {
  text-align: center;
  font-size: 1.1rem; 
  margin-bottom: 25px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
}

.info-options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 25px;
}

.info-card {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(139, 233, 253, 0.15);
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  transition: background 0.3s ease;
}

.info-card:hover {
  background: rgba(139, 233, 253, 0.05);
}

.info-icon {
  background: rgba(139, 233, 253, 0.1);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px auto;
}

.info-card h4 {
  color: #8BE9FD;
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  font-weight: 500;
}

.info-card p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
  margin: 0;
}

.info-footer {
  display: flex;
  justify-content: center;
}

.got-it-btn {
  background: linear-gradient(135deg, #8BE9FD 0%, #00a8cc 100%);
  color: #000;
  border: none;
  padding: 10px 30px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.got-it-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(139, 233, 253, 0.4);
}

.card___rating {
  display: flex !important;
  align-items: center;
  margin-top: 8px;
}

.rating-item {
  display: flex;
  align-items: center;
}

.year-text {
  font-size: 15px;
  color: #ddd;
  margin: 4px 0;
  font-weight: 500;
}

.rating-score {
  font-size: 13px;
  color: #fff;
  font-weight: 700;
  margin-left: 8px;
}

.rating-logo {
  display: block;
  object-fit: contain;
  border-radius: 0 !important;
}

.rating-logo.imdb {
  width: 52px;
  height: 26px;
  position: relative;
  top: -1px;
}

.rating-logo.imdb + .rating-score {
  margin-left: 5px;
}

.rating-logo.tmdb {
  width: 55px;
  height: auto;
}

svg.rating-logo.imdb {
   width: 52px;
   height: 26px;
   position: relative;
   top: -1px;
}

.vote-count {
  font-size: 11px;
  color: #acafb5;
  margin-left: 4px;
  white-space: nowrap;
}

@media (max-width: 600px) {
  .info-options-grid {
    grid-template-columns: 1fr;
  }
  
  .info-modal {
    max-width: 95%;
  }

  .year-text {
    font-size: 13px;
  }

  .rating-score {
    font-size: 12px;
    margin-left: 6px;
  }
  
  .rating-logo.imdb + .rating-score {
      margin-left: 4px;
  }

  .rating-logo.imdb {
    width: 44px;
    height: 22px;
  }
  
  svg.rating-logo.imdb {
     width: 44px;
     height: 22px;
  }
  
  .rating-logo.tmdb {
    width: 50px;
  }

  .vote-count {
    font-size: 10px;
  }
  
  .movie-info-container {
    padding: 6px 8px;
  }
}

.movie-info-container {
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-top: none; 
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.5); 
  position: relative;
  margin-top: -1px; 
}

.card___rating {
  width: 100%;
  display: flex !important;
  justify-content: center;
}

.rating-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap; 
  max-width: 100%;
  text-align: center;
  gap: 4px; 
}

.rating-score {
  margin-left: 0 !important; 
}

.rating-logo.imdb + .rating-score {
  margin-left: 0 !important; 
}

.vote-count {
  margin-left: 0 !important; 
}

.card-actions-menu {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 20;
}

@media (max-width: 600px) {
  .card-actions-menu.menu-open {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 50;
  }
  
  .card-actions-menu.menu-open .dropdown-trigger {
    position: absolute;
    top: 10px; 
    right: 10px;
    z-index: 51;
  }
  
  .card-actions-menu.menu-open .action-dropdown {
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    margin: 0;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: none;
    background: #000;
    border: 1px solid rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(10px);
  }

  .card-actions-menu.menu-open .dropdown-item {
    font-size: 16px;
    padding: 5px 20px;
    width: 100%;
    justify-content: center;
    color: #8BE9FD;
    border-radius: 6px;
    border: 0.5px solid rgba(255, 255, 255, 0.2);
  }

  .card-actions-menu.menu-open .dropdown-item:hover {
    color: #000;
    background: #8BE9FD;;
  }

  .card-actions-menu.menu-open .dropdown-item.remove-action:hover {
    color: #ff6b6b;
    background: #8BE9FD;;
  }
}

.dropdown-trigger {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 5px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
}

.dropdown-trigger svg {
  stroke: #8BE9FD;
  width: 20px;
  height: 20px;
}

.dropdown-trigger:hover {
  background: rgba(0, 0, 0, 0.8);
  border-color: #8BE9FD;
  transform: scale(1.05);
}

.action-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  border-radius: 15px;
  background: #000;
  border: 1px solid rgba(139, 233, 253, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  z-index: 30;
}

@media screen and (min-width: 601px) {
  .action-dropdown {
    min-width: 180px;
  }
}

.dropdown-item {
  padding: 8px 12px;
  color: #8BE9FD;;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  font-size: 13px;
  white-space: nowrap;
}

.dropdown-item svg {
  flex-shrink: 0;
}

.menu-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  z-index: 15;
  background: transparent;
  cursor: default;
}

.dropdown-item:hover {
  background: #8BE9FD;
  color: #000;
}

.dropdown-item.remove-action {
  color: #ff6b6b;
}

.dropdown-item.remove-action:hover {
  background: #8BE9FD;
  color: #ff6b6b;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;
  color: #fff;
  background: rgba(0, 0, 0, 0.307);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-top: 4rem;
  min-height: 400px;
  width: 100%;
}

.added-banner {
    position: fixed;
    bottom: 15vh;
    left: 50%;
    transform: translateX(-50%);
    background: #000;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 1rem 2rem;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    min-width: 300px;
}

.added-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 1.4rem;
    gap: 1.5rem;
    
    span {
        flex: 1;
        min-width: 0;
        word-wrap: break-word;
        line-height: 1.4;
    }
}

.timer-line {
    height: 3px;
    background: #8BE9FD;
    width: 100%;
    animation: timer-line-countdown 4s linear forwards;
}

@keyframes timer-line-countdown {
    from { width: 100%; }
    to { width: 0%; }
}

.undo-banner {
    position: fixed;
    bottom: 15vh;
    left: 50%;
    transform: translateX(-50%);
    background: #000;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 1rem 2rem;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    min-width: 300px;
    max-width: 500px;
    width: fit-content;
}

.undo-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 1.4rem;
    gap: 1.5rem;
}

.undo-content span {
    flex: 1;
    min-width: 0;
    word-wrap: break-word;
    line-height: 1.4;
}

.undo-btn {
    background: #8BE9FD;
    color: #000;
    border: none;
    padding: 0.5rem 1.6rem;
    border-radius: 15px;
    font-weight: 600;
    cursor: pointer;
    font-size: 1.2rem;
    flex-shrink: 0;
}

.undo-btn:hover {
    background: #73cde0;
}

.slide-up-enter-active, .slide-up-leave-active {
    transition: all 0.3s ease;
}

.slide-up-enter, .slide-up-leave-to {
    transform: translate(-50%, 100%);
    opacity: 0;
}

/* List Selector Styles */
.list-nav-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 50;
    margin-bottom: 0;
}

.title-with-selector {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
}

.list-selector-btn {
    background: rgba(139, 233, 253, 0.1);
    border: 1px solid rgba(139, 233, 253, 0.3);
    border-radius: 8px;
    padding: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8BE9FD;
    backdrop-filter: blur(4px);
    position: relative;
    top: -6px;
}

.list-selector-btn:hover {
    background: rgba(139, 233, 253, 0.2);
    border-color: #8BE9FD;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 233, 253, 0.15);
}

.list-selector-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%);
    background: #151f24;
    border: 1px solid rgba(139, 233, 253, 0.3);
    border-radius: 12px;
    width: 260px;
    z-index: 100;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
    overflow: hidden;
    backdrop-filter: blur(10px);
}

.list-selector-dropdown .dropdown-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    font-size: 1.1rem;
    font-weight: 600;
    color: #8F989E;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    position: relative;
    height: 50px;
}

.dropdown-header span {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
}

.dropdown-nav-btn {
    color: #8BE9FD;
    cursor: pointer;
    transition: all 0.2s ease;
}

.dropdown-nav-btn:hover:not(.disabled) {
    background: rgba(139, 233, 253, 0.25) !important;
    border-color: #8BE9FD;
}

.dropdown-nav-btn.disabled {
    opacity: 0.3;
    cursor: not-allowed;
    pointer-events: none;
}

.dropdown-list-item {
    display: block;
    padding: 14px 16px;
    color: #fff;
    text-decoration: none;
    font-size: 1.4rem;
    transition: all 0.2s ease;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
}

.dropdown-list-item:last-child {
    border-bottom: none;
}

.dropdown-list-item:hover {
    background: rgba(139, 233, 253, 0.1);
    color: #8BE9FD;
    padding-left: 20px;
}
</style>

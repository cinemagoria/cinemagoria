<template>
  <div>
    <main class="main">
      <section class="watchlist-section">
        <UserNav @show-rated-modal="showRatedItems" />
        <br>
        <nav class="navbar">
          <h1 class="title-primary">Watchlist</h1>
        </nav>
        
        <div v-if="isLoadingFavorites" class="loading-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" stroke="#2196f3">
            <g fill="none" fill-rule="evenodd" stroke-width="2">
              <circle cx="22" cy="22" r="1">
                <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/>
                <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/>
              </circle>
              <circle cx="22" cy="22" r="1">
                <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/>
                <animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/>
              </circle>
            </g>
          </svg>
          <p>Loading your favorites...</p>
        </div>

        <div v-else-if="showEmptyState" class="empty-state-container">
          <img src="~/static/cinema-popcorn.svg" alt="No favorites" class="empty-state-icon">
          <h3>No favorites added yet</h3>
          <p>
            Start building your watchlist by adding 
            <nuxt-link to="/movie" class="empty-state-link">Movies</nuxt-link> 
            and 
            <nuxt-link to="/tv" class="empty-state-link">TV shows</nuxt-link> 
            you want to watch!
          </p>
        </div>

        <div v-else>
          <div class="column">
            <h2 class="title-secondary" style="color: #acafb5; font-size: 16px;">Favorite {{ filterText }}</h2>
            
            <div class="new-controls-container" style="margin-top: 3rem;">
              <label class="switch">
                <input type="checkbox" :checked="filter === 'tvShows'" @change="toggleFilterType">
                <span>Movies</span>
                <span>TV Shows</span>
              </label>
              
              <div class="action-buttons">
                <button class="control-btn" @click="openFiltersModal">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
                  </svg>
                  <span class="btn-label">Filters</span>
                </button>

                <button class="control-btn" @click="openSortModal">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="m3 16 4 4 4-4"/>
                    <path d="M7 20V4"/>
                    <path d="M17 10V4h-2"/>
                    <path d="M15 10h4"/>
                    <rect x="15" y="14" width="4" height="6" ry="2"/>
                  </svg>
                  <span class="btn-label">Sort</span>
                </button>

                <button class="control-btn ai-analysis-btn" @click="toggleAiSelectionMode" :class="{ 'active': aiSelectionMode }">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09 3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423 1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0-1.423 1.423Z"/>
                  </svg>
                  <span class="btn-label">AI</span>
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
              <button @click="clearAllFilters" class="clear-all-inline">Clear All</button>
            </div>
          </div>

          <div v-if="showTabEmptyState" class="empty-state-container">
            <img src="~/static/cinema-popcorn.svg" alt="No content" class="empty-state-icon">
            <h3>{{ emptyStateMessage }}</h3>
            <p>Switch tabs to see your {{ filter === 'movies' ? 'TV shows' : 'movies' }}!</p>
          </div>
          
          <div v-else-if="(filteredItems.length === 0 || itemsToShow.length === 0) && hasActiveFilters" class="no-results-state">
            <img src="~/static/cinema-popcorn.svg" alt="No results" class="no-results-icon">
            <h3>No Results Found</h3>
            <p>We couldn't find any content matching your current filters.</p>
            <p class="suggestion">Try adjusting or clearing some filters to see more results.</p>
            <button @click="clearAllFilters" class="refine-filters-btn">Clear All Filters</button>
          </div>
          
          <div v-else>
            <div v-if="aiSelectionMode" class="ai-selection-banner" style="margin-bottom: 0.8rem; margin-top: 0.8rem; border-radius: 15px;">
              <div class="banner-content">
                <div class="selection-info">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09 3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"/>
                  </svg>
                  <span>
                    Selected: {{ selectedMoviesCount }} {{ selectedMoviesCount === 1 ? 'movie' : 'movies' }}, {{ selectedTvShowsCount }} {{ selectedTvShowsCount === 1 ? 'TV show' : 'TV shows' }}
                    <span class="limit-text">(max 10 each)</span>
                  </span>
                  
                  <div class="info-icon-wrapper" @click.stop="toggleSelectionInfo" title="Learn about AI Analysis">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </div>
                  </div>
                <div class="banner-actions">
                  <button @click="cancelSelection" class="banner-btn cancel-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                    Cancel
                  </button>
                  <button 
                    @click="sendToAI" 
                    class="banner-btn send-btn" 
                    :disabled="selectedItems.length === 0 || aiAnalysisLoading"
                  >
                    <svg v-if="!aiAnalysisLoading" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 44 44" stroke="currentColor">
                      <g fill="none" fill-rule="evenodd" stroke-width="2">
                        <circle cx="22" cy="22" r="1">
                          <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/>
                          <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/>
                        </circle>
                      </g>
                    </svg>
                    {{ aiAnalysisLoading ? 'Analyzing...' : 'Send to AI' }}
                  </button>
                </div>
              </div>
            </div>

            <div class="pagination" v-if="filteredItems.length > itemsPerPage">
              <button @click="goToFirst" :disabled="currentPage === 1">|<</button>
              <button @click="prevPage" :disabled="currentPage === 1"><<</button>
              <span>
                <label for="page" style="font-size:13px;">Page</label>
                <input type="number" id="page" style="border-radius: 7px; text-align: center; padding: 1px 2px 1px 4px; height: 20.9462px; transform: translate(2.83728px, -0.0009155px); width: 43.9908px;" v-model.number="currentPage" min="1" :max="totalPages">
              </span>
              <span style="font-size: 13px; text-align: left; transform: translate(0px, 0px); position: relative; left: 4px; top: 0px; transition: none 0s ease 0s;">of {{ totalPages }}</span>
              <button @click="nextPage" :disabled="currentPage === totalPages">>></button>
              <button @click="goToLast" :disabled="currentPage === totalPages">>|</button>
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
                  <div v-if="!aiSelectionMode" class="user-rating-badge" v-show="item.details.userRatingForDb && item.details.userRatingForDb !== '-'" 
                    @click.stop="openRatingModal(item)"
                    :class="{ 'has-review': item.details.userReview }" 
                    :title="item.details.userReview ? 'Has Review' : ''">
                    {{ item.details.userRatingForDb }}
                    <span v-if="item.details.userReview" class="review-indicator"></span>
                  </div>
                  <div v-if="!aiSelectionMode" class="user-rating-badge empty" @click.stop="openRatingModal(item)" v-show="!item.details.userRatingForDb || item.details.userRatingForDb === '-'"> 
                    <span style="font-size: 7px;">Rate</span>
                  </div>
                  <a :href="getLink(item)" class="item-link">
                    <img 
                      :src="item.details.posterForDb || fallbackImageUrl" 
                      :onerror="handleImageError" 
                      alt="Poster" 
                      class="poster" 
                    />
                    <h3>{{ item.details.nameForDb }}</h3>
                  </a>
                  <p>
                    {{
                      item.details.yearStartForDb === item.details.yearEndForDb
                      ? item.details.yearEndForDb
                      : (item.details.yearStartForDb + (item.details.yearEndForDb ? `-${item.details.yearEndForDb}` : ''))
                    }}
                  </p>

                  <div class="card__content">
                    <div v-if="item.details.imdb_rating || item.details.starsForDb" class="card__stars">
                      <div :style="{ width: `${calculateStarsWidth(item.details.imdb_rating ? item.details.imdb_rating : formatRating(item.details.starsForDb))}%` }"></div>
                    </div>
                    <div class="card___rating">
                      <p v-if="item.details.rating_source === 'imdb' && item.details.imdb_rating">
                        {{ item.details.imdb_rating.toFixed(1) }} IMDb
                      </p>
                      <p v-else-if="item.details.starsForDb">
                        {{ formatRating(item.details.starsForDb) }} TMDB
                      </p>
                      <p v-else>Not specified.</p>
                    </div>
                  </div>

                  <svg v-if="!aiSelectionMode" fill="84E1F6" height="26px" width="26px" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 446.04" @click="removeFavorite(item)" class="delete-icon">
                    <defs>
                      <style>
                        .cls-1 {
                          fill: #84E1F6;
                          stroke: black;
                          stroke-width: 4px;
                        }
                      </style>
                    </defs>
                    <title>Remove from Watchlist.</title>
                    <path class="cls-1" d="M252.63 71.41C285.88 36.72 309.17 6.75 360.44.86c96.22-11.07 184.7 87.44 136.11 184.43-.43.85-.88 1.71-1.33 2.58-27.38-23.8-63.15-38.22-102.25-38.22-43.06 0-82.07 17.47-110.29 45.7-28.23 28.23-45.7 67.23-45.7 110.29s17.47 82.06 45.7 110.29l.15.15-30.2 29.96-59.71-57.51C121.09 319.33 3.95 232.26.09 124.36-2.62 48.79 57.02.37 125.62 1.27c61.31.8 87.08 31.31 127.01 70.14zm187.32 214.31c5.88-.05 10.08-.59 9.97 6.7l-.28 23.61c.04 7.62-2.37 9.65-9.51 9.56h-94.32c-7.14.09-9.56-1.94-9.51-9.56l-.29-23.61c-.1-7.29 4.1-6.75 9.97-6.7h93.97zm-46.98-99.11c32.87 0 62.63 13.32 84.17 34.86S512 272.77 512 305.64c0 32.88-13.33 62.64-34.86 84.17-21.54 21.54-51.31 34.86-84.17 34.86-32.88 0-62.64-13.32-84.17-34.86-21.54-21.54-34.87-51.3-34.87-84.17 0-32.88 13.33-62.63 34.86-84.17 21.54-21.54 51.31-34.86 84.18-34.86zm71.79 47.23c-18.37-18.37-43.75-29.74-71.79-29.74-28.04 0-53.43 11.37-71.81 29.74-18.37 18.37-29.73 43.76-29.73 71.8s11.36 53.43 29.74 71.8c18.37 18.37 43.75 29.74 71.8 29.74 28.03 0 53.42-11.37 71.8-29.74 18.37-18.37 29.73-43.76 29.73-71.8s-11.36-53.43-29.74-71.8z"/>
                  </svg>
                </div>
              </div>
            </div>
            <br>
            <div class="pagination-footer" v-if="filteredItems.length > itemsPerPage">
              <button @click="goToFirst" :disabled="currentPage === 1">|<</button>
              <button @click="prevPage" :disabled="currentPage === 1"><<</button>
              <span>
                <label for="page" style="font-size:13px;">Page</label>
                <input type="number" id="page" style="border-radius: 7px; text-align: center; padding: 1px 2px 1px 4px; height: 20.9462px; transform: translate(2.83728px, -0.0009155px); width: 43.9908px;" v-model.number="currentPage" min="1" :max="totalPages">
              </span>
              <span style="font-size: 13px; text-align: left; transform: translate(0px, 0px); position: relative; left: 4px; top: 0px; transition: none 0s ease 0s;">of {{ totalPages }}</span>
              <button @click="nextPage" :disabled="currentPage === totalPages">>></button>
              <button @click="goToLast" :disabled="currentPage === totalPages">>|</button>
            </div>
          </div>
        </div>
        
        <div v-if="ratingModalVisible" class="modal-overlay">
          <div class="rating-modal">
            <div class="modal-header">
              <h3>Rate '{{ currentRatingItem?.details?.nameForDb }}'</h3>
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
                    ratingDescriptions[selectedRating - 1] : 'Select a rating first'"
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
                  <span style="position:relative; margin:0 auto;">Remove Rating</span>
                </button>
                
                <button 
                  @click="saveRatingAndReview" 
                  class="save-btn"
                  :disabled="selectedRating === 0"
                >
                  <span style="position:relative; margin:0 auto;">Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filtersModalVisible" class="modal-overlay" @click="closeFiltersModal">
          <div class="filters-modal" @click.stop>
            <div class="modal-header">
              <h3>Filters</h3>
              <button class="close-btn" @click="closeFiltersModal">×</button>
            </div>
            
            <div class="filters-content">
              <div class="filter-group">
                <label class="filter-label">Genre</label>
                <div class="custom-select" @click="toggleGenreDropdown">
                  <div class="select-display">
                    <span>{{ selectedGenre || 'All genres' }}</span>
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
                      All genres
                    </div>
                    <div 
                      v-for="genre in uniqueGenres" 
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
                <label class="filter-label">Years</label>
                <div class="year-inputs">
                  <input 
                    type="number" 
                    v-model.number="customYearStart" 
                    :min="1880" 
                    :max="currentYear"
                    placeholder="From"
                    class="year-input"
                  >
                  <span class="year-separator">-</span>
                  <input 
                    type="number" 
                    v-model.number="customYearEnd" 
                    :min="1880" 
                    :max="currentYear"
                    placeholder="To"
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
                <label class="filter-label">IMDB Rating</label>
                <select v-model="selectedTmdbRating" class="filter-input">
                  <option value="">All ratings</option>
                  <option value="9-10">9+</option>
                  <option value="8-8.9">8+</option>
                  <option value="7-7.9">7+</option>
                  <option value="6-6.9">6+</option>
                  <option value="5-5.9">5+</option>
                  <option value="0-4.9">< 5</option>
                </select>
              </div>
              
              <div class="filter-group">
                <label class="filter-label">My Rating</label>
                <select v-model="selectedUserRating" class="filter-input">
                  <option value="">All my ratings</option>
                  <option value="not-rated">Not Rated</option>
                  <option value="10">My Rating: 10</option>
                  <option value="9">My Rating: 9</option>
                  <option value="8">My Rating: 8</option>
                  <option value="7">My Rating: 7</option>
                  <option value="6">My Rating: 6</option>
                  <option value="5">My Rating: 5</option>
                  <option value="1-4">My Rating: < 5</option>
                </select>
              </div>
              
              <div class="filter-actions">
                <button @click="clearAllFilters" class="clear-btn">Clear</button>
                <button @click="closeFiltersModal" class="apply-btn">Apply</button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="sortModalVisible" class="modal-overlay" @click="closeSortModal">
          <div class="filters-modal" @click.stop>
            <div class="modal-header">
              <h3>Sort By</h3>
              <button class="close-btn" @click="closeSortModal">×</button>
            </div>
            
            <div class="filters-content">
              <div class="sort-options">
                <button
                  v-for="option in sortOptions"
                  :key="option.value"
                  @click="selectSort(option.value)"
                  :class="['sort-option', { active: orderMode === option.value }]"
                >
                  <span>{{ option.label }}</span>
                  <svg v-if="orderMode === option.value" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="notificationModalVisible" class="modal-overlay" @click="closeNotificationModal">
          <div class="rating-modal" @click.stop style="max-width: 400px;">
            <div class="modal-header">
              <h3>{{ notificationTitle || 'Notification' }}</h3>
              <button class="close-btn" @click="closeNotificationModal">×</button>
            </div>
            <div class="rating-content" style="text-align: center; padding: 20px; display: flex; flex-direction: column; align-items: center;">
              <p style="font-size: 1.2rem; margin-bottom: 20px; color: #fff;">{{ notificationMessage }}</p>
              <button @click="closeNotificationModal" class="save-btn" style="padding: 10px 30px; width: auto;">OK</button>
            </div>
          </div>
        </div>

        <div v-if="showSelectionInfo" class="modal-overlay" @click="toggleSelectionInfo">
          <div class="info-modal" @click.stop>
            <div class="modal-header">
              <h3>AI Analysis Guide</h3>
              <button class="close-btn" @click="toggleSelectionInfo">×</button>
            </div>
            
            <div class="info-modal-content">
              <p class="info-intro">You've selected items for analysis. Once you click "Send to AI", you'll have two powerful options:</p>
              
              <div class="info-options-grid">
                <div class="info-card">
                  <div class="info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <h4>General Analysis</h4>
                  <p>Get a comprehensive breakdown of themes, viewing priorities, and pros/cons of your selection.</p>
                </div>

                <div class="info-card">
                  <div class="info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                  </div>
                  <h4>Custom Question</h4>
                  <p>Ask specific things like <em>"Recommend similar movies"</em> or <em>"Compare these styles"</em>.</p>
                </div>
              </div>

              <div class="info-footer">
                <button @click="toggleSelectionInfo" class="got-it-btn">Got it</button>
              </div>
            </div>
          </div>
        </div>

      </section>
    </main>
  </div>
</template>

<script>
import supabase from '@/services/supabase';
import UserNav from '@/components/global/UserNav';


async function getUserName(userEmail) {
  try {
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
  },

  head () {
    return {
      title: 'EnterCinema - Watchlist.',
      meta: [
        { hid: 'og:title', property: 'og:title', content: 'Watchlist' },
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
      sortModalVisible: false,
      genreDropdownOpen: false,
      filteredSeriesDetails: [],
      filtersModalVisible: false,
      customYearStart: null,
      customYearEnd: null,
      currentYear: new Date().getFullYear(),
      selectedLanguage: 'english',
      fallbackImageUrl: "https://github.com/imprvhub/entercinema/blob/main/static/image_not_found_yet.png?raw=true",
      handleImageError: "this.src='https://github.com/imprvhub/entercinema/blob/main/static/image_not_found_yet.png?raw=true'",
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
      filter: 'movies',
      selectedGenre: '',
      selectedYearRange: '',
      genres: [],
      years: [],
      resizeObserver: null,
      ratingModalVisible: false,
      currentRatingItem: null,
      userReview: '',
      selectedRating: 0,
      hoverRating: 0,
      ratingDescriptions: [
        'Terrible, a complete waste of time',
        'Very bad, hard to finish',
        'Bad, few redeeming qualities',
        'Mediocre, barely passable',
        'Average, has its moments',
        'Decent, entertaining but forgettable',
        'Good, worth watching',
        'Very good, recommended',
        'Excellent, a great experience',
        'Masterpiece, must-see'
      ],
      selectedTmdbRating: '',
      selectedUserRating: '',
      tmdbRatingRanges: [
        '9-10', '8-8.9', '7-7.9', '6-6.9', '5-5.9', '0-4.9'
      ],
      userRatingRanges: [
        '10', '9', '8', '7', '6', '5', '1-4'
      ],
      aiSelectionMode: false,
      selectedItems: [],
      aiAnalysisLoading: false,
      showSelectionInfo: false,
    };
  },
  async mounted() {
    const email = localStorage.getItem('email');
    const accessToken = localStorage.getItem('access_token');
    this.userEmail = email || '';
    this.hasAccessToken = accessToken !== null;
    this.isLoggedIn = accessToken !== null;
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
    });

    const detailsArray = this.tvFetched.map(({ details }) => details);
    const currentYear = new Date().getFullYear();
    const pastYearsLimit = currentYear - 5;

    const filteredArray = detailsArray.filter(item => item.yearEndForDb >= pastYearsLimit);

    const additionalSeries = detailsArray.filter(item => item.nextEpisode !== null && item.nextEpisode !== undefined);

    const uniqueSeries = [...new Set([...filteredArray, ...additionalSeries])];

    const seriesIds = uniqueSeries.map(item => item.idForDb);

    async function fetchSeriesDetails(seriesId) {
        const apiKey = process.env.API_KEY;
        const apiLang = process.env.API_LANG;
        const url = `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}&language=${apiLang}`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
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
      const { data, error } = await supabase
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
    this.$root.$on('rated-items-updated', this.checkData);
  },

  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    } else {
      window.removeEventListener('resize', this.handleResize);
    }
    this.$root.$off('rated-items-updated', this.checkData);
  },
  
  watch: {
    selectedGenre() {
      this.currentPage = 1;
    },
    selectedTmdbRating() {
      this.currentPage = 1;
    },
    selectedUserRating() {
      this.currentPage = 1;
    },
    customYearStart() {
      this.currentPage = 1;
    },
    customYearEnd() {
      this.currentPage = 1;
    },
    orderMode() {
      this.currentPage = 1;
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
      } else if (newPage < 1) {
        this.$nextTick(() => {
          this.currentPage = 1;
        });
      }
    }
  },
  
  methods: {
    toggleSelectionInfo() {
      this.showSelectionInfo = !this.showSelectionInfo;
    },
    removeFilter(filterValue) {
      if (filterValue === 'orderMode') {
        this.orderMode = 'latest-added';
      } else {
        this[filterValue] = filterValue.includes('Year') ? null : '';
      }
    },
    openSortModal() {
      this.sortModalVisible = true;
    },
    
    closeSortModal() {
      this.sortModalVisible = false;
    },
    
    selectSort(value) {
      this.orderMode = value;
      this.closeSortModal();
    },
    toggleFilterType(event) {
      this.filter = event.target.checked ? 'tvShows' : 'movies';
      this.currentPage = 1;
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

    setYearRange(range) {
      const [start, end] = range.split('-').map(Number);
      this.customYearStart = start;
      this.customYearEnd = end;
    },

    clearAllFilters() {
      this.selectedGenre = '';
      this.selectedTmdbRating = '';
      this.selectedUserRating = '';
      this.customYearStart = null;
      this.customYearEnd = null;
      this.orderMode = 'latest-added';
    },
    
    toggleAiSelectionMode() {
      this.aiSelectionMode = !this.aiSelectionMode;
      if (!this.aiSelectionMode) {
        this.selectedItems = [];
        this.showSelectionInfo = false;
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
        return this.selectedMoviesCount < 10;
      } else if (mediaType === 'tv') {
        return this.selectedTvShowsCount < 10;
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
      this.showSelectionInfo = false;
    },
    
    closeNotificationModal() {
      this.notificationModalVisible = false;
      this.notificationTitle = '';
      this.notificationMessage = '';
    },

    async sendToAI() {
      if (this.selectedItems.length === 0) {
        this.notificationTitle = 'Selection Required';
        this.notificationMessage = 'Please select at least one item';
        this.notificationModalVisible = true;
        return;
      }
      

      const preparedItems = this.selectedItems.map(item => ({
        ...item,
        user_rating: item.user_rating || null
      }));

      this.$root.$emit('open-chatbot-with-selection', {
        selectedItems: preparedItems
      });

      this.aiSelectionMode = false;
      this.selectedItems = [];
      this.showSelectionInfo = false;
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

      if (!this.userReview.trim()) {
        this.userReview = this.ratingDescriptions[this.selectedRating - 1];
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
      this.$root.$emit('show-rated-modal');
    },

    handleResize() {
      this.calculateItemsPerRow();
      this.adjustItemsPerPage();
    },

    calculateItemsPerRow() {
      const gridElement = document.querySelector('.movie-grid');
      if (!gridElement) return;
      
      const gridWidth = gridElement.offsetWidth;
      const cardWidth = 200;
      const gap = 20;
      
      const calculatedItemsPerRow = Math.floor(gridWidth / (cardWidth + gap));
      
      this.itemsPerRow = Math.max(1, calculatedItemsPerRow);
      
      this.adjustItemsPerPage();
    },

    adjustItemsPerPage() {
      const rowsToShow = 5;

      const newItemsPerPage = this.itemsPerRow * rowsToShow;

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
        const years = new Set();

        if (data.favorites_json.movies) {
          for (const movie of data.favorites_json.movies) {
            const movieKey = Object.keys(movie)[0];
            const movieData = movie[movieKey];
            
            if (!movieData || !movieData.details) {
              console.warn('Skipping invalid movie entry:', movie);
              continue;
            }
            
            if (movieData.details.external_ids?.imdb_id && !movieData.details.rating_source) {
              try {
                const imdbResponse = await fetch(`/api/imdb-rating/${movieData.details.external_ids.imdb_id}`);
                const imdbData = await imdbResponse.json();
                
                if (imdbData.found) {
                  movieData.details.imdb_rating = imdbData.score;
                  movieData.details.imdb_votes = imdbData.votes;
                  movieData.details.rating_source = 'imdb';
                } else {
                  movieData.details.rating_source = 'tmdb';
                }
              } catch (err) {
                console.error('Error fetching IMDb rating:', err);
                movieData.details.rating_source = 'tmdb';
              }
            } else if (!movieData.details.rating_source) {
              movieData.details.rating_source = movieData.details.imdb_rating ? 'imdb' : 'tmdb';
            }
            
            moviesFetched.push(movieData);
            
            if (movieData.details.genresForDb) {
              const genresList = movieData.details.genresForDb.split(', ');
              genresList.forEach(g => genres.add(g));
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
            
            if (tvData.details.external_ids?.imdb_id && !tvData.details.rating_source) {
              try {
                const imdbResponse = await fetch(`/api/imdb-rating/${tvData.details.external_ids.imdb_id}`);
                const imdbData = await imdbResponse.json();
                
                if (imdbData.found) {
                  tvData.details.imdb_rating = imdbData.score;
                  tvData.details.imdb_votes = imdbData.votes;
                  tvData.details.rating_source = 'imdb';
                } else {
                  tvData.details.rating_source = 'tmdb';
                }
              } catch (err) {
                console.error('Error fetching IMDb rating:', err);
                tvData.details.rating_source = 'tmdb';
              }
            } else if (!tvData.details.rating_source) {
              tvData.details.rating_source = tvData.details.imdb_rating ? 'imdb' : 'tmdb';
            }
            
            tvFetched.push(tvData);
            
            if (tvData.details.genresForDb) {
              const genresList = tvData.details.genresForDb.split(', ');
              genresList.forEach(g => genres.add(g));
            }
            
            if (tvData.details.yearStartForDb) {
              years.add(tvData.details.yearStartForDb);
            }
          }
        }

        this.moviesFetched = moviesFetched;
        this.tvFetched = tvFetched;
        this.genres = Array.from(genres);
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

      try {
        const { typeForDb, idForDb } = item.details;
        const keyToDelete = `${typeForDb}/${idForDb}`;
        this.deleteFavorite(keyToDelete);
      } catch (error) {
        console.error('Error removing favorite:', error.message);
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
      return (stars / 10).toFixed(1);
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
      const locOrigin = window.location.origin;
      if (item.details.typeForDb === 'movie') {
        return `${locOrigin}/movie/${item.details.idForDb}`;
      } else if (item.details.typeForDb === 'tv') {
        return `${locOrigin}/tv/${item.details.idForDb}`;
      } else {
        return '#'; 
      }
    },
    async fetchUserFirstName() {
      try {
        const { data, error } = await supabase
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
    
    
  },

  computed: {
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
        return 'No favorites added yet';
      }
      if (this.showTabEmptyState) {
        return this.filter === 'movies' 
          ? 'No movies added yet' 
          : 'No TV shows added yet';
      }
      return '';
    },
    hasActiveFilters() {
      return this.selectedGenre !== '' || 
            this.selectedTmdbRating !== '' || 
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
        chips.push({ type: 'year', label: `From ${this.customYearStart}`, value: 'customYearStart' });
      }
      
      if (this.customYearEnd) {
        chips.push({ type: 'year', label: `To ${this.customYearEnd}`, value: 'customYearEnd' });
      }
      
      if (this.selectedTmdbRating) {
        const ratingLabels = {
          '9-10': '9+',
          '8-8.9': '8+',
          '7-7.9': '7+',
          '6-6.9': '6+',
          '5-5.9': '5+',
          '0-4.9': '< 5'
        };
        chips.push({ 
          type: 'tmdb', 
          label: `Rating: ${ratingLabels[this.selectedTmdbRating]}`, 
          value: 'selectedTmdbRating' 
        });
      }
      
      if (this.selectedUserRating) {
        const label = this.selectedUserRating === 'not-rated' 
          ? 'Not Rated' 
          : `My Rating: ${this.selectedUserRating}`;
        chips.push({ type: 'user', label, value: 'selectedUserRating' });
      }
      
      if (this.orderMode !== 'latest-added') {
        chips.push({ 
          type: 'sort', 
          label: `Sorted by: ${this.currentSortLabel}`, 
          value: 'orderMode' 
        });
      }
      
      return chips;
    },
    sortOptions() {
      return [
        { value: 'latest-added', label: 'Latest Added' },
        { value: 'earliest-added', label: 'Earliest Added' },
        { value: 'newer-releases', label: 'Newer Releases' },
        { value: 'older-releases', label: 'Older Releases' },
        { value: 'imdb-high', label: 'Highest Rated (IMDB)' },
        { value: 'imdb-low', label: 'Lowest Rated (IMDB)' }
      ];
    },
    
    currentSortLabel() {
      const option = this.sortOptions.find(opt => opt.value === this.orderMode);
      return option ? option.label : 'Latest Added';
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
      if (this.selectedTmdbRating !== '') {
        let rating;
        if (item.details.rating_source === 'imdb' && item.details.imdb_rating) {
          rating = item.details.imdb_rating;
        } else if (item.details.starsForDb) {
          rating = this.formatRating(item.details.starsForDb);
        }
        
        if (!rating) {
          matchesTmdbRating = false;
        } else {
          const [min, max] = this.selectedTmdbRating.split('-').map(Number);
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
      
      return matchesGenre && matchesYear && matchesTmdbRating && matchesUserRating;
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
          default:
            return 0;
        }
      });
  },


    yearRanges() {
      return [
        '1888-1960',
        '1960-1980',
        '1980-2000',
        '2000-2010',
        '2010-2020',
        '2020-2025',
      ];
    },
    uniqueGenres() {
      return Array.from(new Set(this.genres));
    },
    
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage);
    },

    itemsToShow() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredItems.slice(start, end);
    },

    filterText() {
      return this.filter === 'tvShows' ? 'TV Shows' : 'Movies';
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
  top: -3px;
}

.card__stars {
  width: 7.3rem;
  height: 1.2rem;
  background-image: url('~assets/images/stars.png');
  background-repeat: no-repeat;
  background-size: auto 100%;
  position: relative;
  margin-right: 0.5rem; 
}

.card__stars > div {
  height: 100%;
  background-image: url('~assets/images/stars-filled.png');
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
  color: transparent;
  margin-top: 20px;
  text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
  font-family: 'Roboto', sans-serif;
}

.text-center {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(220, 220, 220) 100%);
  -webkit-background-clip: text;
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
    background: rgba(82, 71, 71, 0);
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur(16px);
    padding: 8px;
    gap: 0.5rem;
    border: 0.5px #31414C solid;
    top: 2px;
    position: relative;
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
    background: rgba(16, 20, 33, 0.3);
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur(16px);
    padding: 8px;
    gap: 0.5rem;
    border: 0.5px #31414C solid;
    top: -10px;
    position: relative;
}


.pagination button {
  padding: 0.5rem 1rem;
  background: rgba( 82, 71, 71, 0 );
  box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
  backdrop-filter: blur( 16px );
  -webkit-backdrop-filter: blur( 16px );
  border-radius: 5px;
  border: 1px solid rgba( 255, 255, 255, 0.18 );
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
  border-radius: 5px;
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
    white-space: nowrap; 
    text-overflow: ellipsis; 
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
    background-color: black;
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
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .modal-header h3 {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 500;
    text-align: center;
    font-family: 'GrandCru', 'Roboto', sans-serif;
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
    font-family: 'GrandCru', 'Roboto', sans-serif;
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
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); 
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
.poster {
  width: 60%; 
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  text-align: center;
  box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  min-height: 200px;
  object-fit: cover;
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
  margin: 0;
}

.year-input[type=number] {
  -moz-appearance: textfield;
}

.dropdown-options::-webkit-scrollbar {
  width: 6px;
}

.dropdown-options::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
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

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  min-height: 400px;
}

.loading-state p {
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.4rem;
}

.empty-state-container {
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
  margin: 0 auto;
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

@media (max-width: 600px) {
  .info-options-grid {
    grid-template-columns: 1fr;
  }
  
  .info-modal {
    max-width: 95%;
  }
}
</style>
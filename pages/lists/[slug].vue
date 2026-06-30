<template>
  <div class="list-page">
    <div v-if="loading" class="loader-container">
      <Loader :size="60" />
    </div>

    <template v-else>
      <!-- ── Hero header ──────────────────────────────────────────── -->
      <header class="list-hero">
        <div class="title-row">
          <h1 class="list-title">{{ list.name }}</h1>
          <button v-if="isOwner" @click="openRenameModal" class="title-edit-btn" aria-label="Rename list" title="Rename">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
          </button>
        </div>
        <p v-if="list.description" class="list-description">{{ list.description }}</p>

        <div class="list-meta">
          <span class="meta-author">{{ isOwner ? 'by You' : 'by ' + (list.owner_name || 'Unknown') }}</span>
          <span class="meta-dot">·</span>
          <span class="meta-count">{{ items.length }} {{ items.length === 1 ? 'item' : 'items' }}</span>
        </div>

        <!-- Empty-list fallback: once the list has items these controls live in the toolbar -->
        <div v-if="items.length === 0" class="list-actions">
          <div v-if="isOwner" class="privacy-wrapper">
            <button @click.stop="togglePrivacyDropdown" class="privacy-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <template v-if="list.is_public"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></template>
                <template v-else><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></template>
              </svg>
              {{ list.is_public ? 'Public' : 'Private' }}
              <svg class="caret" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
            </button>
            <transition name="fade">
              <div v-if="privacyDropdownOpen" class="privacy-dropdown">
                <div class="dropdown-item" @click="setPrivacy(true)" :class="{ active: list.is_public }">Public</div>
                <div class="dropdown-item" @click="setPrivacy(false)" :class="{ active: !list.is_public }">Private</div>
              </div>
            </transition>
          </div>
          <button v-if="!isOwner && list.is_public" @click="handleCloneList" class="action-pill" aria-label="Clone list" title="Clone to my profile">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 13v8l-4-4"/><path d="m12 21 4-4"/><path d="M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284"/></svg>
            <span>Clone</span>
          </button>
          <button v-if="list.is_public" @click="openShareModal" class="action-pill" aria-label="Share list">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v13"/></svg>
            <span>Share</span>
          </button>
        </div>
      </header>

      <!-- ── Undo banner ──────────────────────────────────────────── -->
      <transition name="slide-up">
        <div v-if="undoItem" class="undo-banner">
          <span>Removed &ldquo;{{ undoItem.details.nameForDb }}&rdquo;</span>
          <button @click="handleUndo" class="undo-btn">Undo</button>
          <div class="timer-line"></div>
        </div>
      </transition>

      <!-- ── Empty list ───────────────────────────────────────────── -->
      <div v-if="items.length === 0 && !undoItem" class="state-card">
        <img src="/ui/cinema-popcorn.svg" alt="" class="state-icon">
        <h3>This list is empty</h3>
        <p>Go explore and add some movies or TV shows.</p>
        <nuxt-link to="/" class="primary-btn">Explore content</nuxt-link>
      </div>

      <!-- ── Content panel ────────────────────────────────────────── -->
      <section v-else class="list-panel">
        <!-- Toolbar -->
        <div class="panel-toolbar">
          <label class="seg-switch">
            <input type="checkbox" :checked="filter === 'tvShows'" @change="toggleFilterType">
            <span>Movies</span>
            <span>TV Shows</span>
          </label>

          <div class="toolbar-right">
            <div v-if="isOwner" class="privacy-wrapper">
              <button @click.stop="togglePrivacyDropdown" class="privacy-btn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <template v-if="list.is_public"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></template>
                  <template v-else><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></template>
                </svg>
                {{ list.is_public ? 'Public' : 'Private' }}
                <svg class="caret" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
              </button>
              <transition name="fade">
                <div v-if="privacyDropdownOpen" class="privacy-dropdown">
                  <div class="dropdown-item" @click="setPrivacy(true)" :class="{ active: list.is_public }">Public</div>
                  <div class="dropdown-item" @click="setPrivacy(false)" :class="{ active: !list.is_public }">Private</div>
                </div>
              </transition>
            </div>

            <button v-if="!isOwner && list.is_public" @click="handleCloneList" class="action-pill" aria-label="Clone list" title="Clone to my profile">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 13v8l-4-4"/><path d="m12 21 4-4"/><path d="M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284"/></svg>
              <span>Clone</span>
            </button>
            <button v-if="list.is_public" @click="openShareModal" class="action-pill" aria-label="Share list">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v13"/></svg>
              <span>Share</span>
            </button>

            <button class="filter-btn" :class="{ active: hasActiveFilters }" @click="openFiltersModal" aria-label="Filters &amp; sorting">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>
              <span class="filter-btn-label">Filters</span>
              <span v-if="hasActiveFilters" class="filter-dot"></span>
            </button>
          </div>
        </div>

        <!-- Active filter chips -->
        <div v-if="hasActiveFilters" class="filter-bar">
          <div class="filter-chips">
            <div v-for="(chip, index) in activeFilterChips" :key="index" class="filter-chip">
              <span>{{ chip.label }}</span>
              <button @click="removeFilter(chip.value)" class="chip-remove" aria-label="Remove filter">×</button>
            </div>
          </div>
          <button @click="clearAllFilters" class="clear-all-inline">Clear all</button>
        </div>

        <!-- No results / empty tab -->
        <div v-if="displayItems.length === 0" class="state-card inset">
          <template v-if="filteredItems.length === 0 && hasActiveFilters">
            <img src="/ui/cinema-popcorn.svg" alt="" class="state-icon">
            <h3>No results found</h3>
            <p>Nothing matches the current filters.</p>
            <button @click="clearAllFilters" class="primary-btn">Clear all filters</button>
          </template>
          <template v-else>
            <img src="/ui/cinema-popcorn.svg" alt="" class="state-icon">
            <h3>No {{ filter === 'movies' ? 'movies' : 'TV shows' }}</h3>
            <p>Switch tabs or add some content.</p>
          </template>
        </div>

        <template v-else>
          <!-- Pager (top) -->
          <div v-if="filteredItems.length > itemsPerPage" class="list-pager">
            <button @click="goToFirst" :disabled="currentPage === 1" aria-label="First page">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z"/><path d="M3 20V4"/></svg>
            </button>
            <button @click="prevPage" :disabled="currentPage === 1" aria-label="Previous page">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.971 4.285A2 2 0 0 1 17 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z"/><path d="M21 20V4"/></svg>
            </button>
            <span class="pager-info">
              <label for="pageTop" class="pager-label">Page</label>
              <input type="number" id="pageTop" class="pager-input" v-model.number="currentPage" min="1" :max="totalPages" @change="validatePageInput">
              <span class="pager-of">of {{ totalPages }}</span>
            </span>
            <button @click="nextPage" :disabled="currentPage === totalPages" aria-label="Next page">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.029 4.285A2 2 0 0 0 7 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z"/><path d="M3 4v16"/></svg>
            </button>
            <button @click="goToLast" :disabled="currentPage === totalPages" aria-label="Last page">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 4v16"/><path d="M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z"/></svg>
            </button>
          </div>

          <!-- Grid -->
          <div class="movie-grid">
            <div v-for="vm in displayItems" :key="vm.type + '-' + vm.id" class="movie-card" :id="'list-item-' + vm.id">
              <div class="poster-container">
                <nuxt-link :to="vm.link" class="poster-link">
                  <img
                    :src="vm.poster"
                    :alt="vm.name"
                    class="poster"
                    :class="{ loaded: imageLoadStates[vm.id] }"
                    loading="lazy"
                    @load="handleImageLoad(vm.id)"
                    @error="handleImageError"
                  />
                </nuxt-link>

                <div v-if="isOwner && vm.userRating" class="user-rating-badge"
                  :class="{ 'has-review': vm.hasReview }"
                  @click.stop="openRatingModal(vm.raw)"
                  :title="vm.hasReview ? 'Has review' : 'Your rating'">
                  {{ vm.userRating }}
                  <span v-if="vm.hasReview" class="review-indicator"></span>
                </div>

                <div v-if="isOwner" class="card-actions-menu" :class="{ 'menu-open': activeCardMenuId === vm.id }">
                  <button class="dropdown-trigger" @click.prevent.stop="toggleCardMenu(vm.id)" aria-label="Card actions">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m19.5 8.25-7.5 7.5-7.5-7.5"/></svg>
                  </button>
                  <transition name="fade">
                    <div v-if="activeCardMenuId === vm.id" class="action-dropdown" @click.stop>
                      <div v-if="!vm.userRating" class="dropdown-item" @click="openRatingModal(vm.raw); activeCardMenuId = null">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        Rate
                      </div>
                      <div class="dropdown-item" @click="openAddModal(vm.raw); activeCardMenuId = null">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                        Edit…
                      </div>
                      <div class="dropdown-item remove-action" @click="removeListItem(vm.raw); activeCardMenuId = null">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        Remove
                      </div>
                    </div>
                  </transition>
                </div>
              </div>

              <div class="card-info">
                <nuxt-link :to="vm.link" class="card-title">{{ vm.name }}</nuxt-link>
                <p class="card-year">{{ vm.yearLabel }}</p>
                <div class="card-rating">
                  <template v-if="vm.ratingType === 'imdb'">
                    <svg class="rating-logo" viewBox="0 0 48 48"><g><path fill="#FFC107" d="M44,13H4c-2.2,0-4,1.8-4,4v16c0,2.2,1.8,4,4,4h40c2.2,0,4-1.8,4-4V17C48,14.8,46.2,13,44,13z"/></g><g><path fill="#263238" d="M28.1,18h-3.7v13.1h3.7c2,0,2.8-0.4,3.3-0.7c0.6-0.4,0.9-1.1,0.9-1.8v-7.9c0-0.9-0.4-1.7-0.9-2C30.6,18.2,30.3,18,28.1,18z M28.8,28.3c0,0.6-0.7,0.6-1.3,0.6V20c0.6,0,1.3,0,1.3,0.6V28.3z"/><path fill="#263238" d="M33.8,18v13.3h2.8c0,0,0.2-0.9,0.4-0.7c0.4,0,1.5,0.6,2.2,0.6s1.1,0,1.5-0.2c0.6-0.4,0.7-0.7,0.7-1.3v-7.8c0-1.1-1.1-1.8-2-1.8s-1.8,0.6-2.2,0.9v-3H33.8z M37.4,22.2c0-0.4,0-0.6,0.4-0.6c0.2,0,0.4,0.2,0.4,0.6v6.6c0,0.4,0,0.6-0.4,0.6c-0.2,0-0.4-0.2-0.4-0.6V22.2z"/><polygon fill="#263238" points="22.7,31.3 22.7,18 18.3,18 17.5,24.3 16.4,18 12.4,18 12.4,31.3 15.3,31.3 15.3,23.9 16.6,31.3 18.6,31.3 19.9,23.9 19.9,31.3"/><rect x="7.6" y="18" fill="#263238" width="3.1" height="13.3"/></g></svg>
                    <span class="rating-score">{{ vm.ratingScore }}</span>
                    <span v-if="vm.voteLabel" class="vote-count">({{ vm.voteLabel }})</span>
                  </template>
                  <template v-else-if="vm.ratingType === 'tmdb'">
                    <img src="/logos/platforms/tmdb.svg" alt="TMDB" class="rating-logo tmdb">
                    <span class="rating-score">{{ vm.ratingScore }}</span>
                    <span v-if="vm.voteLabel" class="vote-count">({{ vm.voteLabel }})</span>
                  </template>
                  <span v-else class="rating-empty">Not rated</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Pager (bottom) -->
          <div v-if="filteredItems.length > itemsPerPage" class="list-pager">
            <button @click="goToFirst" :disabled="currentPage === 1" aria-label="First page">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z"/><path d="M3 20V4"/></svg>
            </button>
            <button @click="prevPage" :disabled="currentPage === 1" aria-label="Previous page">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.971 4.285A2 2 0 0 1 17 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z"/><path d="M21 20V4"/></svg>
            </button>
            <span class="pager-info">
              <label for="pageBottom" class="pager-label">Page</label>
              <input type="number" id="pageBottom" class="pager-input" v-model.number="currentPage" min="1" :max="totalPages" @change="validatePageInput">
              <span class="pager-of">of {{ totalPages }}</span>
            </span>
            <button @click="nextPage" :disabled="currentPage === totalPages" aria-label="Next page">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.029 4.285A2 2 0 0 0 7 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z"/><path d="M3 4v16"/></svg>
            </button>
            <button @click="goToLast" :disabled="currentPage === totalPages" aria-label="Last page">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 4v16"/><path d="M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z"/></svg>
            </button>
          </div>
        </template>
      </section>
    </template>

    <!-- ── Rating modal ───────────────────────────────────────────── -->
    <div v-if="ratingModalVisible" class="modal-overlay" @click.self="closeRatingModal">
      <div class="glass-modal rating-modal">
        <button class="modal-close" @click="closeRatingModal" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18 18 6M6 6l12 12"/></svg>
        </button>
        <h3 class="modal-title">Rate &lsquo;{{ currentRatingItem?.details?.nameForDb }}&rsquo;</h3>

        <div class="rating-numbers">
          <button v-for="n in 10" :key="n"
            @click="setRating(n)" @mouseover="previewRating(n)" @mouseout="resetPreview()"
            :class="['rating-btn', { 'rating-btn-active': n <= (hoverRating || selectedRating) }]">
            {{ n }}
          </button>
        </div>

        <div class="review-section">
          <textarea v-model="userReview"
            :placeholder="selectedRating > 0 ? 'Add an optional review…' : 'Select a rating first'"
            class="field-textarea" maxlength="500" :disabled="selectedRating === 0"></textarea>
          <div class="char-count">{{ userReview.length }}/500</div>
        </div>

        <div class="modal-actions">
          <button v-if="currentRatingItem && currentRatingItem.details.userRatingForDb && currentRatingItem.details.userRatingForDb !== '-'"
            @click="removeRating" class="btn-ghost danger">Remove rating</button>
          <button @click="saveRatingAndReview" class="btn-primary" :disabled="selectedRating === 0">Save</button>
        </div>
      </div>
    </div>

    <!-- ── Filters modal ──────────────────────────────────────────── -->
    <div v-if="filtersModalVisible" class="modal-overlay" @click.self="closeFiltersModal">
      <div class="glass-modal filters-modal">
        <button class="modal-close" @click="closeFiltersModal" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18 18 6M6 6l12 12"/></svg>
        </button>
        <h3 class="modal-title">Filters &amp; sorting</h3>

        <div class="filters-content">
          <div class="filter-group">
            <label class="filter-label">Genre</label>
            <div class="custom-select" @click="toggleGenreDropdown">
              <div class="select-display">
                <span>{{ selectedGenre || 'All genres' }}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" :class="{ 'rotate-180': genreDropdownOpen }"><path d="M7 10l5 5 5-5z"/></svg>
              </div>
              <div v-if="genreDropdownOpen" class="dropdown-options">
                <div class="dropdown-option" :class="{ selected: selectedGenre === '' }" @click.stop="selectGenre('')">All genres</div>
                <div v-for="genre in uniqueSortedGenres" :key="genre" class="dropdown-option" :class="{ selected: selectedGenre === genre }" @click.stop="selectGenre(genre)">{{ genre }}</div>
              </div>
            </div>
          </div>

          <div class="filter-group">
            <label class="filter-label">Years</label>
            <div class="range-inputs">
              <input type="number" v-model.number="customYearStart" :min="1880" :max="currentYear" placeholder="From" class="field-input">
              <span class="range-sep">–</span>
              <input type="number" v-model.number="customYearEnd" :min="1880" :max="currentYear" placeholder="To" class="field-input">
            </div>
            <div class="quick-options">
              <button v-for="range in yearRanges" :key="range" @click="setYearRange(range)" class="quick-btn">{{ range }}</button>
            </div>
          </div>

          <div class="filter-group">
            <label class="filter-label">IMDb rating range</label>
            <div class="range-inputs">
              <input type="number" v-model.number="minImdbRating" min="0" max="10" placeholder="Min" class="field-input">
              <span class="range-sep">–</span>
              <input type="number" v-model.number="maxImdbRating" min="0" max="10" placeholder="Max" class="field-input">
            </div>
          </div>

          <div class="filter-group">
            <label class="filter-label">IMDb votes range</label>
            <div class="range-inputs">
              <input type="number" v-model.number="minImdbVotes" min="0" placeholder="Min" class="field-input">
              <span class="range-sep">–</span>
              <input type="number" v-model.number="maxImdbVotes" min="0" placeholder="Max" class="field-input">
            </div>
          </div>

          <div class="filter-group">
            <label class="filter-label">Sort by</label>
            <div class="custom-select" @click="toggleSortDropdown">
              <div class="select-display">
                <span>{{ currentSortLabel }}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" :class="{ 'rotate-180': sortDropdownOpen }"><path d="M7 10l5 5 5-5z"/></svg>
              </div>
              <div v-if="sortDropdownOpen" class="dropdown-options">
                <div v-for="option in sortOptions" :key="option.value" class="dropdown-option" :class="{ selected: orderMode === option.value }" @click.stop="selectSort(option.value)">{{ option.label }}</div>
              </div>
            </div>
          </div>

          <div class="filter-group" v-if="isOwner">
            <label class="filter-label">My rating</label>
            <select v-model="selectedUserRating" class="field-input native-select">
              <option value="">All my ratings</option>
              <option value="not-rated">Not rated</option>
              <option value="10">My rating: 10</option>
              <option value="9">My rating: 9</option>
              <option value="8">My rating: 8</option>
              <option value="7">My rating: 7</option>
              <option value="6">My rating: 6</option>
              <option value="5">My rating: 5</option>
              <option value="1-4">My rating: &lt; 5</option>
            </select>
          </div>

          <div class="modal-actions">
            <button @click="clearAllFilters" class="btn-ghost">Clear</button>
            <button @click="closeFiltersModal" class="btn-primary">Apply</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Share modal ────────────────────────────────────────────── -->
    <div v-if="shareModalVisible" class="modal-overlay" @click.self="closeShareModal">
      <div class="glass-modal share-modal">
        <button class="modal-close" @click="closeShareModal" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18 18 6M6 6l12 12"/></svg>
        </button>
        <h3 class="modal-title">Share this list</h3>

        <div class="field-group">
          <label class="filter-label">Link</label>
          <div class="link-row">
            <input type="text" :value="shareUrl" readonly class="field-input link-input">
            <button @click="copyToClipboard" class="copy-btn" :class="{ 'is-success': copySuccess }">
              <svg v-if="!copySuccess" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
              <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span>{{ copySuccess ? 'Copied' : 'Copy' }}</span>
            </button>
          </div>
        </div>

        <div class="field-group">
          <label class="filter-label">Title</label>
          <input type="text" v-model="customTitle" class="field-input">
        </div>

        <div class="field-group">
          <label class="filter-label">Message</label>
          <textarea v-model="customMessage" class="field-textarea"></textarea>
        </div>

        <div class="field-group">
          <label class="filter-label">Share on</label>
          <div class="social-row">
            <button @click="shareTo('whatsapp')" class="social-btn social-wa" aria-label="Share on WhatsApp" title="WhatsApp">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </button>
            <button @click="shareTo('telegram')" class="social-btn social-tg" aria-label="Share on Telegram" title="Telegram">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </button>
            <button @click="shareTo('twitter')" class="social-btn social-x" aria-label="Share on X" title="X">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </button>
            <button @click="shareTo('email')" class="social-btn social-em" aria-label="Share via Email" title="Email">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Clone modal ────────────────────────────────────────────── -->
    <div v-if="cloneModalVisible" class="modal-overlay" @click.self="closeCloneModal">
      <div class="glass-modal confirm-modal">
        <button class="modal-close" @click="closeCloneModal" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18 18 6M6 6l12 12"/></svg>
        </button>
        <h3 class="modal-title">Clone list</h3>
        <p class="modal-text">Create a copy of &ldquo;<strong>{{ list.name }}</strong>&rdquo; as a custom list?</p>
        <div class="modal-actions">
          <button @click="closeCloneModal" class="btn-ghost">Cancel</button>
          <button @click="confirmCloneList" class="btn-primary">Confirm</button>
        </div>
      </div>
    </div>

    <!-- ── Rename modal ───────────────────────────────────────────── -->
    <div v-if="renameListModalVisible" class="modal-overlay" @click.self="closeRenameModal">
      <div class="glass-modal rename-modal">
        <button class="modal-close" @click="closeRenameModal" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18 18 6M6 6l12 12"/></svg>
        </button>
        <h3 class="modal-title">Rename list</h3>
        <div class="field-group">
          <label class="filter-label">New name</label>
          <input type="text" v-model="newListName" class="field-input" @keyup.enter="updateListName" autofocus placeholder="e.g. Best Movies">
        </div>
        <div class="field-group">
          <label class="filter-label">Description (optional)</label>
          <textarea v-model="newListDescription" class="field-textarea" placeholder="Add a description…"></textarea>
        </div>
        <div class="modal-actions">
          <button @click="closeRenameModal" class="btn-ghost">Cancel</button>
          <button @click="updateListName" class="btn-primary" :disabled="!newListName || !newListName.trim()">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '~/components/Loader.vue';
import { apiImgUrl, resolveItemPoster } from '~/utils/api';

export default {
    components: {
        Loader
    },

    setup() {
        const route = useRoute();
        const config = useRuntimeConfig();
        const { data: seoData } = useFetch(`${config.public.tursoBackendUrl}/lists/${route.params.slug}`, {
            key: `list-seo-${route.params.slug}`,
            server: true,
            lazy: true
        });

        const listTitle = () => seoData.value?.list?.name ? `${seoData.value.list.name} | Cinemagoria` : 'Cinemagoria List';
        const listDescription = () => seoData.value?.list?.description || 'Check out this curated list on Cinemagoria.';

        useSeoMeta({
            title: listTitle,
            description: listDescription,
            ogTitle: listTitle,
            ogDescription: listDescription,
            ogImage: () => {
                if (seoData.value?.items?.length > 0) {
                     const poster = seoData.value.items[0].poster_url;
                     if (poster) {
                         return poster.startsWith('http') ? poster : `https://image.tmdb.org/t/p/w500${poster}`;
                     }
                }
                return 'https://cinemagoria.com/cinema-popcorn.svg';
            },
            twitterCard: 'summary_large_image',
        });

        return {};
    },

    data() {
        return {
            loading: true,
            list: {},
            items: [],
            moviesFetched: [],
            tvFetched: [],
            filter: 'movies',
            itemsPerRow: 4,
            resizeObserver: null,
            userEmail: null,
            userCustomLists: [],
            currentPage: 1,
            itemsPerPage: 20,
            orderMode: 'latest-added',
            filtersModalVisible: false,
            genreDropdownOpen: false,
            sortDropdownOpen: false,
            selectedGenre: '',
            customYearStart: null,
            customYearEnd: null,
            minImdbRating: null,
            maxImdbRating: null,
            minImdbVotes: null,
            maxImdbVotes: null,
            selectedUserRating: '',
            currentYear: new Date().getFullYear(),
            activeCardMenuId: null,
            imageLoadStates: {},
            // Resolved poster per item (title_overrides force/fallback + hero/noir + snapshot).
            // Keyed by item.details.idForDb. Populated by loadPosterOverrides() after hydrateItems.
            posterOverrideMap: {},
            movieGenres: [],
            tvGenres: [],
            undoItem: null,
            undoTimer: null,
            shareModalVisible: false,
            cloneModalVisible: false,
            customTitle: '',
            customMessage: '',
            copySuccess: false,
            privacyDropdownOpen: false,
            renameListModalVisible: false,
            newListName: '',
            newListDescription: '',
            ratingModalVisible: false,
            currentRatingItem: null,
            selectedRating: 0,
            hoverRating: 0,
            userReview: '',
        };
    },

    computed: {
        shareUrl() {
            if (import.meta.client) {
                return window.location.href;
            }
            return '';
        },
        tursoBackendUrl() { return this.$config.public.tursoBackendUrl; },

        hasActiveFilters() {
          return this.selectedGenre !== '' ||
                this.customYearStart !== null ||
                this.customYearEnd !== null ||
                this.minImdbRating !== null ||
                this.maxImdbRating !== null ||
                this.minImdbVotes !== null ||
                this.maxImdbVotes !== null ||
                this.selectedUserRating !== '' ||
                this.orderMode !== 'latest-added';
        },
        uniqueSortedGenres() {
          const allGenres = new Set([...this.movieGenres, ...this.tvGenres]);
          return Array.from(allGenres).sort();
        },
        sortOptions() {
           return [
             { value: 'latest-added', label: 'Latest Added' },
             { value: 'earliest-added', label: 'Earliest Added' },
             { value: 'newer-releases', label: 'Newer Releases' },
             { value: 'older-releases', label: 'Older Releases' },
             { value: 'imdb-high', label: 'Highest Rated (IMDB/TMDB)' },
             { value: 'imdb-low', label: 'Lowest Rated (IMDB/TMDB)' },
             { value: 'votes-high', label: 'Highest Vote Count' },
             { value: 'votes-low', label: 'Lowest Vote Count' },
             { value: 'shortest-first', label: 'Shortest first' },
             { value: 'longest-first', label: 'Longest first' }
           ];
        },
        yearRanges() {
          return [ '1960-1980', '1980-2000', '2000-2010', '2010-2020', `2020-${this.currentYear}` ];
        },
        currentSortLabel() {
           const option = this.sortOptions.find(opt => opt.value === this.orderMode);
           return option ? option.label : 'Latest Added';
        },
        activeFilterChips() {
           const chips = [];
           if (this.selectedGenre) chips.push({ label: this.selectedGenre, value: 'selectedGenre' });
           if (this.customYearStart) chips.push({ label: `From ${this.customYearStart}`, value: 'customYearStart' });
           if (this.customYearEnd) chips.push({ label: `To ${this.customYearEnd}`, value: 'customYearEnd' });

           if (this.minImdbRating !== null || this.maxImdbRating !== null) {
              let label = '';
              if (this.minImdbRating !== null && this.maxImdbRating !== null) {
                 label = this.minImdbRating === this.maxImdbRating ? `IMDB: ${this.minImdbRating}` : `IMDB: ${this.minImdbRating}-${this.maxImdbRating}`;
              } else if (this.minImdbRating !== null) {
                 label = `IMDB: ≥ ${this.minImdbRating}`;
              } else {
                 label = `IMDB: ≤ ${this.maxImdbRating}`;
              }
              chips.push({ label, value: 'imdbRating' });
           }

           if (this.minImdbVotes !== null || this.maxImdbVotes !== null) {
              let label = '';
              if (this.minImdbVotes !== null && this.maxImdbVotes !== null) {
                 label = `Votes: ${this.minImdbVotes}-${this.maxImdbVotes}`;
              } else if (this.minImdbVotes !== null) {
                 label = `Votes: ≥ ${this.minImdbVotes}`;
              } else {
                 label = `Votes: ≤ ${this.maxImdbVotes}`;
              }
              chips.push({ label, value: 'imdbVotes' });
           }

           if (this.selectedUserRating) {
               const label = this.selectedUserRating === 'not-rated' ? 'Not Rated' : `My Rating: ${this.selectedUserRating}`;
               chips.push({ label, value: 'selectedUserRating' });
           }

           if (this.orderMode !== 'latest-added') chips.push({ label: `Sort: ${this.currentSortLabel}`, value: 'orderMode' });
           return chips;
        },

        // Filter pass only — depends on the active source list + filter params.
        // Numeric keys are precomputed in hydrateItems so no parsing happens here.
        filteredItems() {
           const items = this.filter === 'movies' ? this.moviesFetched : this.tvFetched;
           if (!items) return [];

           const yearMin = this.customYearStart || 1880;
           const yearMax = this.customYearEnd || this.currentYear;
           const hasYear = this.customYearStart !== null || this.customYearEnd !== null;
           const hasRating = this.minImdbRating !== null || this.maxImdbRating !== null;
           const ratingMin = this.minImdbRating !== null ? this.minImdbRating : 0;
           const ratingMax = this.maxImdbRating !== null ? this.maxImdbRating : 10;
           const hasVotes = this.minImdbVotes !== null || this.maxImdbVotes !== null;

           return items.filter(item => {
               const d = item && item.details;
               if (!d) return false;

               if (this.selectedGenre !== '' && !(d.genresForDb && d.genresForDb.includes(this.selectedGenre))) return false;

               if (hasYear && !(d.yearStartForDb && d.yearStartForDb >= yearMin && d.yearStartForDb <= yearMax)) return false;

               if (hasRating) {
                   if (d.ratingNum === null) return false;
                   if (d.ratingNum < ratingMin || d.ratingNum > ratingMax) return false;
               }

               if (hasVotes) {
                   if (this.minImdbVotes !== null && d.votesNum < this.minImdbVotes) return false;
                   if (this.maxImdbVotes !== null && d.votesNum > this.maxImdbVotes) return false;
               }

               if (this.selectedUserRating !== '') {
                   const rated = d.userRatingForDb && d.userRatingForDb !== '-';
                   if (this.selectedUserRating === 'not-rated') {
                       if (rated) return false;
                   } else if (!rated) {
                       return false;
                   } else {
                       const userRating = parseInt(d.userRatingForDb);
                       if (this.selectedUserRating.includes('-')) {
                           const [min, max] = this.selectedUserRating.split('-').map(Number);
                           if (userRating < min || userRating > max) return false;
                       } else if (userRating !== parseInt(this.selectedUserRating)) {
                           return false;
                       }
                   }
               }

               return true;
           });
        },

        // Sort pass — operates on the filtered set using precomputed numeric keys.
        // Kept separate from filteredItems so changing sort never re-runs filtering.
        sortedItems() {
           const mode = this.orderMode;
           const arr = this.filteredItems.slice();
           arr.sort((a, b) => {
               const x = a.details, y = b.details;
               switch (mode) {
                   case 'latest-added': return y.addedTime - x.addedTime;
                   case 'earliest-added': return x.addedTime - y.addedTime;
                   case 'newer-releases': return y.yearSort - x.yearSort;
                   case 'older-releases': return x.yearSort - y.yearSort;
                   case 'imdb-high': {
                       if (x.weightedRating === -1 && y.weightedRating === -1) return 0;
                       if (x.weightedRating === -1) return 1;
                       if (y.weightedRating === -1) return -1;
                       return y.weightedRating - x.weightedRating;
                   }
                   case 'imdb-low': {
                       if (x.weightedRating === -1 && y.weightedRating === -1) return 0;
                       if (x.weightedRating === -1) return 1;
                       if (y.weightedRating === -1) return -1;
                       return x.weightedRating - y.weightedRating;
                   }
                   case 'votes-high': return y.votesNum - x.votesNum;
                   case 'votes-low': return x.votesNum - y.votesNum;
                   case 'shortest-first': return x.runtimeNum - y.runtimeNum;
                   case 'longest-first': return y.runtimeNum - x.runtimeNum;
                   default: return 0;
               }
           });
           return arr;
        },

        totalPages() { return Math.ceil(this.filteredItems.length / this.itemsPerPage); },

        // Current page slice of the sorted set.
        pagedItems() {
           let page = this.currentPage;
           if (!page || page < 1) page = 1;
           if (page > this.totalPages && this.totalPages > 0) page = this.totalPages;
           const start = (page - 1) * this.itemsPerPage;
           return this.sortedItems.slice(start, start + this.itemsPerPage);
        },

        // Flat view-model for the visible page — all display strings precomputed once
        // instead of calling methods per card on every render.
        displayItems() {
           return this.pagedItems.map(item => {
               const d = item.details;
               const yearLabel = d.yearStartForDb === d.yearEndForDb
                   ? d.yearEndForDb
                   : (d.yearStartForDb + (d.yearEndForDb ? `-${d.yearEndForDb}` : ''));

               let ratingType = null, ratingScore = '', voteLabel = '';
               if (d.rating_source === 'imdb' && d.imdb_rating) {
                   ratingType = 'imdb';
                   ratingScore = this.formatRatingValue(d.imdb_rating);
                   voteLabel = d.imdb_votes ? this.formatVoteCount(d.imdb_votes) : '';
               } else if (d.starsForDb) {
                   ratingType = 'tmdb';
                   ratingScore = this.formatRatingValue(d.starsForDb / 10);
                   voteLabel = d.vote_count ? this.formatVoteCount(d.vote_count) : '';
               }

               return {
                   raw: item,
                   id: d.idForDb,
                   type: d.typeForDb,
                   name: d.nameForDb,
                   link: this.getLink(item),
                   poster: this.resolvedPoster(item),
                   yearLabel,
                   ratingType,
                   ratingScore,
                   voteLabel,
                   userRating: d.userRatingForDb && d.userRatingForDb !== '-' ? d.userRatingForDb : null,
                   hasReview: !!d.userReview,
               };
           });
        },

        isOwner() {
            if (!this.list) return false;
            const dbEmail = this.list.user_email ? this.list.user_email.toLowerCase() : '';
            const localEmail = this.userEmail ? this.userEmail.toLowerCase() : '';
            return dbEmail === localEmail && localEmail !== '';
        }
    },

    async mounted() {
        this.userEmail = localStorage.getItem('email')?.replace(/['"]+/g, '') || null;
        this.fetchUserCustomLists();
        await this.fetchListDetails();
        document.addEventListener('click', this.closeDropdowns);
        document.addEventListener('click', this.closeCardMenu);

        this.$nextTick(() => {
            this.calculateItemsPerRow();
            if (typeof ResizeObserver !== 'undefined') {
                this.resizeObserver = new ResizeObserver(this.handleResize);
                const gridElement = document.querySelector('.movie-grid');
                if (gridElement) this.resizeObserver.observe(gridElement);
            } else {
                window.addEventListener('resize', this.handleResize);
            }
        });
        this.$bus.$on('lists-updated', this.handleListUpdate);
    },

    beforeDestroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('click', this.closeDropdowns);
        document.removeEventListener('click', this.closeCardMenu);
        this.$bus.$off('lists-updated', this.handleListUpdate);
        this.finalizeDelete();
    },

    methods: {
        _getUserEmail() {
            return this.userEmail;
        },

        async fetchUserCustomLists() {
            const userEmail = this.userEmail;
            if (!userEmail) return;
            try {
                const response = await fetch(`${this.tursoBackendUrl}/lists/user/${encodeURIComponent(userEmail)}`);
                if (response.ok) {
                    const data = await response.json();
                    this.userCustomLists = data.lists || [];
                }
            } catch (error) {
                console.error('Error fetching user custom lists:', error);
            }
        },

        calculateItemsPerRow() {
            const gridElement = document.querySelector('.movie-grid');
            if (!gridElement) return;

            const gridWidth = gridElement.offsetWidth;
            const isMobile = window.innerWidth <= 600;
            const cardWidth = isMobile ? 115 : 158;
            const gap = 16;

            const calculatedItemsPerRow = Math.floor(gridWidth / (cardWidth + gap));
            this.itemsPerRow = Math.max(1, calculatedItemsPerRow);

            this.adjustItemsPerPage();
        },

        adjustItemsPerPage() {
            const minItems = 24;
            const rowsNeeded = Math.ceil(minItems / this.itemsPerRow);
            const newItemsPerPage = rowsNeeded * this.itemsPerRow;

            if (this.itemsPerPage !== newItemsPerPage) {
                this.itemsPerPage = newItemsPerPage;
                if (this.currentPage > this.totalPages && this.totalPages > 0) {
                    this.currentPage = this.totalPages;
                }
            }
        },

        handleResize() {
             if (window.requestAnimationFrame) {
                window.requestAnimationFrame(() => this.calculateItemsPerRow());
             } else {
                setTimeout(() => this.calculateItemsPerRow(), 66);
             }
        },

        handleListUpdate() {
            this.fetchListDetails(true);
        },

        async fetchListDetails(redirectOnMissing = false) {
            try {
                this.loading = true;
                const slug = this.$route.params.slug;
                const userEmail = this.userEmail;

                let url = `${this.tursoBackendUrl}/lists/${slug}`;
                if (userEmail) {
                    url += `?userEmail=${encodeURIComponent(userEmail)}`;
                }

                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    this.list = data.list;
                    this.items = data.items;
                    this.hydrateItems();
                    if (this.filter === 'movies' && this.moviesFetched.length === 0 && this.tvFetched.length > 0) {
                        this.filter = 'tvShows';
                    }
                } else {
                    if (redirectOnMissing) {
                         this.$router.push('/lists');
                    } else {
                         showError({ statusCode: 404, statusMessage: 'List not found' });
                    }
                }
            } catch (e) { console.error(e); } finally { this.loading = false; }
        },

        // Compute numeric sort/filter keys once per item so the filter and sort
        // computeds stay pure-numeric (no parseInt/parseFloat/replace per compare).
        _computeNumericKeys(d) {
            const rawVotes = d.imdb_votes != null ? d.imdb_votes : d.vote_count;
            const votesNum = rawVotes == null ? 0
                : (typeof rawVotes === 'number' ? rawVotes : (parseInt(String(rawVotes).replace(/,/g, ''), 10) || 0));

            let ratingNum = null;
            if (d.rating_source === 'imdb' && d.imdb_rating) ratingNum = parseFloat(d.imdb_rating);
            else if (d.starsForDb) ratingNum = d.starsForDb / 10;

            let weightedRating = -1;
            if (d.rating_source === 'imdb' && d.imdb_rating) {
                const R = parseFloat(d.imdb_rating);
                const v = votesNum;
                weightedRating = (v / (v + 1000)) * R + (1000 / (v + 1000)) * 7.0;
            } else if (d.starsForDb) {
                const R = d.starsForDb / 10;
                const v = 0;
                weightedRating = (v / (v + 1000)) * R + (1000 / (v + 1000)) * 7.0;
            }

            d.votesNum = votesNum;
            d.ratingNum = ratingNum;
            d.weightedRating = weightedRating;
            d.runtimeNum = d.runtime || 0;
            d.addedTime = d.added_at ? new Date(d.added_at).getTime() : 0;
            d.yearSort = d.yearEndForDb || d.yearStartForDb || 9999;
        },

        hydrateItems() {
             this.moviesFetched = [];
             this.tvFetched = [];
             this.movieGenres = [];
             this.tvGenres = [];

             if (!this.items) return;

             this.items.forEach(raw => {
                 let genres = [];
                 if (raw.genres) {
                     try {
                         if (Array.isArray(raw.genres)) {
                             genres = raw.genres;
                         } else if (typeof raw.genres === 'string') {
                             const trimmed = raw.genres.trim();
                             if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
                                 genres = JSON.parse(raw.genres);
                             } else {
                                 genres = trimmed.split(',').map(s => s.trim());
                             }
                         } else {
                             genres = JSON.parse(raw.genres);
                         }

                         genres = genres.map(g => {
                           if (typeof g === 'string') return g;
                           if (g && g.name) return g.name;
                           return null;
                         }).filter(Boolean);
                     } catch(e) {
                         if (typeof raw.genres === 'string') {
                             genres = raw.genres.split(',').map(s => s.trim());
                         }
                     }
                 }

                 const details = {
                     idForDb: raw.item_id,
                     typeForDb: raw.item_type,
                     nameForDb: raw.name,
                     posterForDb: raw.poster_url,
                     yearStartForDb: raw.year_start ? parseInt(raw.year_start) : null,
                     yearEndForDb: raw.year_end ? parseInt(raw.year_end) : null,
                     genresForDb: genres,
                     starsForDb: raw.tmdb_rating ? raw.tmdb_rating * 10 : null,
                     imdb_rating: raw.imdb_rating,
                     imdb_votes: raw.imdb_rating ? raw.imdb_votes : null,
                     vote_count: !raw.imdb_rating ? raw.imdb_votes : null,
                     rating_source: raw.imdb_rating ? 'imdb' : 'tmdb',
                     userRatingForDb: raw.viewer_rating ? raw.viewer_rating.toString() : '-',
                     userReview: raw.viewer_review || '',
                     added_at: raw.added_at,
                     runtime: raw.runtime || 0
                 };
                 this._computeNumericKeys(details);

                 const hydrated = { details };

                 if (raw.item_type === 'movie') {
                     this.moviesFetched.push(hydrated);
                     this.movieGenres.push(...genres);
                 } else {
                     this.tvFetched.push(hydrated);
                     this.tvGenres.push(...genres);
                 }
             });

             // Resolve overrides in background — first render uses posterForDb (snapshot)
             // and updates reactively when this Promise resolves.
             this.loadPosterOverrides([...this.moviesFetched, ...this.tvFetched]);
        },

        async loadPosterOverrides(items) {
            const newMap = {};
            await Promise.all(items.map(async (item) => {
                const d = item?.details;
                if (!d?.idForDb) return;
                try {
                    const url = await resolveItemPoster({
                        id: Number(d.idForDb),
                        media_type: d.typeForDb,
                        posterSnapshot: d.posterForDb || null,
                    });
                    if (url) newMap[d.idForDb] = url;
                } catch {}
            }));
            this.posterOverrideMap = newMap;
        },

        resolvedPoster(item) {
            const id = item?.details?.idForDb;
            if (id && this.posterOverrideMap[id]) return this.posterOverrideMap[id];
            return this.getImageUrl(item?.details?.posterForDb);
        },

        toggleFilterType() { this.filter = this.filter === 'movies' ? 'tvShows' : 'movies'; this.currentPage = 1; },

        openRenameModal() {
            this.newListName = this.list.name;
            this.newListDescription = this.list.description || '';
            this.renameListModalVisible = true;
        },
        closeRenameModal() {
            this.renameListModalVisible = false;
        },
        async updateListName() {
            if (!this.newListName || !this.newListName.trim()) return;

            const userEmail = this.userEmail;

            try {
                const response = await fetch(`${this.tursoBackendUrl}/lists/${this.list.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: this.newListName,
                        description: this.newListDescription,
                        userEmail
                    })
                });

                if (response.ok) {
                    this.list.name = this.newListName;
                    this.list.description = this.newListDescription;
                    this.closeRenameModal();
                } else {
                    console.error('Failed to update list details');
                }
            } catch (error) {
                console.error('Error updating list details:', error);
            }
        },

        openFiltersModal() { this.filtersModalVisible = true; },
        closeFiltersModal() { this.filtersModalVisible = false; },
        toggleGenreDropdown() { this.genreDropdownOpen = !this.genreDropdownOpen; },
        selectGenre(g) { this.selectedGenre = g; this.genreDropdownOpen = false; },
        toggleSortDropdown() { this.sortDropdownOpen = !this.sortDropdownOpen; },
        selectSort(o) { this.orderMode = o; this.sortDropdownOpen = false; },
        setYearRange(range) {
            const [start, end] = range.split('-').map(Number);
            this.customYearStart = start;
            this.customYearEnd = end;
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
            this.filtersModalVisible = false;
        },
        removeFilter(key) {
             if (key === 'orderMode') this.orderMode = 'latest-added';
             else if (key === 'selectedGenre') this.selectedGenre = '';
             else if (key === 'imdbRating') { this.minImdbRating = null; this.maxImdbRating = null; }
             else if (key === 'imdbVotes') { this.minImdbVotes = null; this.maxImdbVotes = null; }
             else if (key === 'selectedUserRating') this.selectedUserRating = '';
             else if (key.includes('Year')) this[key] = null;
             else this[key] = null;
        },
        closeDropdowns(e) {
             if (this.genreDropdownOpen && !e.target.closest('.custom-select')) {
                 this.genreDropdownOpen = false;
             }
             if (this.sortDropdownOpen && !e.target.closest('.custom-select')) {
                 this.sortDropdownOpen = false;
             }
             if (this.privacyDropdownOpen && !e.target.closest('.privacy-wrapper')) {
                 this.privacyDropdownOpen = false;
             }
        },
        toggleCardMenu(id) {
           this.activeCardMenuId = this.activeCardMenuId === id ? null : id;
        },
        closeCardMenu(e) {
            if (this.activeCardMenuId && !e.target.closest('.card-actions-menu')) {
                this.activeCardMenuId = null;
            }
        },

        nextPage() { if(this.currentPage < this.totalPages) this.currentPage++; },
        prevPage() { if(this.currentPage > 1) this.currentPage--; },
        goToFirst() { this.currentPage = 1; },
        goToLast() { this.currentPage = this.totalPages; },
        validatePageInput() {
             if(this.currentPage < 1) this.currentPage = 1;
             if(this.currentPage > this.totalPages) this.currentPage = this.totalPages;
        },

        openAddModal(item) {
             this.$bus.$emit('show-add-to-list-modal', item.details);
        },

        async removeListItem(item) {
            if (this.undoItem) {
                this.finalizeDelete();
            }

            if (item.details.typeForDb === 'movie') {
                this.moviesFetched = this.moviesFetched.filter(i => i.details.idForDb !== item.details.idForDb);
            } else {
                this.tvFetched = this.tvFetched.filter(i => i.details.idForDb !== item.details.idForDb);
            }
            this.items = this.items.filter(i => !(i.item_id == item.details.idForDb && i.item_type == item.details.typeForDb));

            this.undoItem = item;
            this.startUndoTimer();
        },

        startUndoTimer() {
            if (this.undoTimer) clearTimeout(this.undoTimer);
            this.undoTimer = setTimeout(() => {
                this.finalizeDelete();
            }, 10000);
        },

        async finalizeDelete() {
            if (!this.undoItem) return;
            const item = this.undoItem;
            this.undoItem = null;
            if (this.undoTimer) clearTimeout(this.undoTimer);

            const listId = this.list.id;
            const itemId = item.details.idForDb;
            const itemType = item.details.typeForDb;
            const userEmail = this.userEmail;

            try {
                let url = `${this.tursoBackendUrl}/lists/${listId}/items?itemId=${itemId}&itemType=${itemType}`;
                if (userEmail) {
                    url += `&userEmail=${encodeURIComponent(userEmail)}`;
                }
                await fetch(url, {
                    method: 'DELETE'
                });
                this.$bus.$emit('lists-updated');
            } catch(e) { console.error(e); }
        },

        handleUndo() {
            if (this.undoTimer) clearTimeout(this.undoTimer);
            if (this.undoItem) {
                if (this.undoItem.details.typeForDb === 'movie') {
                    this.moviesFetched.unshift(this.undoItem);
                } else {
                    this.tvFetched.unshift(this.undoItem);
                }

                this.undoItem = null;
            }
        },

        formatVoteCount(count) {
          if (!count) return '';
          let num = typeof count === 'string' ? parseInt(count.replace(/,/g, ''), 10) : count;
          if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M votes';
          if (num >= 1000) return (num / 1000).toFixed(1) + 'K votes';
          return num + ' votes';
        },
        formatRating(stars) {
          if (!stars) return '0.0';
          return (parseFloat(stars) / 10).toFixed(1);
        },
        formatRatingValue(val) {
           return val ? parseFloat(val).toFixed(1) : '0.0';
        },

        getLink(item) {
          if (item.details.typeForDb === 'movie') return `/movie/${item.details.idForDb}`;
          if (item.details.typeForDb === 'tv') return `/tv/${item.details.idForDb}`;
          return '#';
        },
        getImageUrl(path) {
           if (!path) return '/placeholders/image_not_found_yet.webp';
           if (path.startsWith('http')) return path;
           return `${apiImgUrl}/w500${path}`;
        },
        handleImageLoad(id) {
            this.imageLoadStates[id] = true;
        },
        handleImageError(e) {
            e.target.src = '/placeholders/image_not_found_yet.webp';
        },

        async handleCloneList() {
             const userEmail = this._getUserEmail();
             if (!userEmail) {
                 if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { action: 'login' } }));
                 } else {
                     alert('You must be logged in to clone lists.');
                 }
                 return;
             }

             this.cloneModalVisible = true;
         },

         closeCloneModal() {
             this.cloneModalVisible = false;
         },

         async confirmCloneList() {
             const userEmail = this._getUserEmail();
             this.closeCloneModal();

             try {
                this.loading = true;
                const response = await fetch(`${this.tursoBackendUrl}/lists/clone`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sourceListId: this.list.id,
                        userEmail
                    })
                });

                if (response.ok) {
                    let data;
                    try {
                        data = await response.json();
                    } catch (jsonErr) {
                         console.error("Error parsing success JSON", jsonErr);
                         data = { list: { slug: 'watchlist' } };
                    }

                    if (data && data.list && data.list.slug) {
                        setTimeout(() => {
                            this.$router.push(`/lists/${data.list.slug}`);
                        }, 1000);
                    }
                } else {
                    let errorMessage = 'Unknown error';
                    try {
                        const data = await response.json();
                        errorMessage = data.error || errorMessage;
                    } catch (jsonErr) {
                        console.error("Error parsing error response JSON", jsonErr);
                    }
                    alert(`Failed to clone list: ${errorMessage}`);
                }
             } catch (e) {
                 console.error(e);
                 alert('An error occurred while cloning the list.');
             } finally {
                 this.loading = false;
             }
        },

        openShareModal() {
            this.shareModalVisible = true;
            this.customTitle = "Check out this list '" + this.list.name + "' on Cinemagoria!";
            this.customMessage = "I found this list '" + this.list.name + "' with " + this.items.length + " items on Cinemagoria. Take a look!";
        },
        closeShareModal() { this.shareModalVisible = false; },

        async copyToClipboard() {
            try {
                await navigator.clipboard.writeText(this.shareUrl);
                this.copySuccess = true;
                setTimeout(() => this.copySuccess = false, 2000);
            } catch (err) {
                console.error('Failed to copy!', err);
            }
        },

        shareTo(platform) {
            const url = encodeURIComponent(this.shareUrl);
            const text = encodeURIComponent(this.customTitle + '\n\n' + this.customMessage);
            let shareUrl = '';

            switch(platform) {
                case 'whatsapp': shareUrl = `https://wa.me/?text=${text}%20${url}`; break;
                case 'telegram': shareUrl = `https://t.me/share/url?url=${url}&text=${text}`; break;
                case 'twitter': shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`; break;
                case 'email': shareUrl = `mailto:?subject=${this.customTitle}&body=${this.customMessage}%0A%0A${url}`; break;
            }
            if(shareUrl) window.open(shareUrl, '_blank');
            this.closeShareModal();
        },

        async setPrivacy(isPublic) {
            if (this.list.is_public === isPublic) {
                this.privacyDropdownOpen = false;
                return;
            }

            const userEmail = this.userEmail;

            try {
                const response = await fetch(`${this.tursoBackendUrl}/lists/${this.list.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ is_public: isPublic, userEmail })
                });

                if (response.ok) {
                    this.list.is_public = isPublic;
                } else {
                    console.error("Failed to update privacy");
                }
            } catch(e) { console.error(e); }

            this.privacyDropdownOpen = false;
        },

        togglePrivacyDropdown() {
            this.privacyDropdownOpen = !this.privacyDropdownOpen;
        },

        openRatingModal(item) {
            this.currentRatingItem = item;
            this.selectedRating = item.details.userRatingForDb && item.details.userRatingForDb !== '-' ? parseInt(item.details.userRatingForDb) : 0;
            this.userReview = item.details.userReview || '';
            this.ratingModalVisible = true;
        },

        closeRatingModal() {
            this.ratingModalVisible = false;
            this.currentRatingItem = null;
            this.selectedRating = 0;
            this.hoverRating = 0;
            this.userReview = '';
        },

        setRating(rating) { this.selectedRating = rating; },
        previewRating(rating) { this.hoverRating = rating; },
        resetPreview() { this.hoverRating = 0; },

        async saveRatingAndReview() {
          if (this.selectedRating === 0) {
            alert('Please select a rating between 1 and 10');
            return;
          }

          const userEmail = this.userEmail;
          if (!userEmail) return;

          const item = this.currentRatingItem;
          const { typeForDb, idForDb } = item.details;

          const updateRatingCall = async () => {
              return await fetch(
                `${this.tursoBackendUrl}/favorites/rating/${userEmail}/${typeForDb}/${idForDb}`,
                {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    rating: this.selectedRating,
                    review: this.userReview.trim()
                  })
                }
              );
          };

          try {
            let response = await updateRatingCall();

            if (response.status === 404) {
                const addResponse = await fetch(`${this.tursoBackendUrl}/favorites`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userEmail, item: item.details })
                });

                if (!addResponse.ok) throw new Error('Failed to add item to watchlist before rating');
                response = await updateRatingCall();
            }

            if (!response.ok) {
                 throw new Error('Error updating rating.');
            }

            item.details.userRatingForDb = this.selectedRating.toString();
            item.details.userReview = this.userReview.trim();

            this.closeRatingModal();
            this.$bus.$emit('lists-updated');

          } catch (error) {
            console.error('Error saving rating:', error);
            alert('Could not save rating. Please try again.');
          }
        },

        async removeRating() {
          const userEmail = this.userEmail;
          if (!userEmail) return;

          try {
            const item = this.currentRatingItem;
            const { typeForDb, idForDb } = item.details;

            const response = await fetch(
              `${this.tursoBackendUrl}/favorites/rating/${userEmail}/${typeForDb}/${idForDb}`,
              {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating: null, review: '' })
              }
            );

            if (!response.ok) throw new Error('Error removing rating');

            item.details.userRatingForDb = '-';
            item.details.userReview = '';

            this.closeRatingModal();
            this.$bus.$emit('lists-updated');

          } catch (error) {
            console.error('Error removing rating:', error);
          }
        }
  }
}
</script>

<style lang="scss" scoped>
@use '~/assets/css/utilities/variables' as *;

/* ── Page shell ─────────────────────────────────────────────────── */
.list-page {
  position: relative;
  min-height: 100vh;
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 32px 80px;
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: rgba(255, 255, 255, 0.86);

  @media (max-width: 600px) {
    padding: 32px 12px 64px;
  }
}

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

/* ── Hero header ────────────────────────────────────────────────── */
.list-hero {
  text-align: center;
  margin-bottom: 28px;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.list-title {
  font-size: clamp(30px, 4.5vw, 45px);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: #8BE9FD;
  margin: 0;
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  text-shadow: 0 0 28px rgba(139, 233, 253, 0.25);
}

/* Tiny inline pencil — reveals on title hover (desktop), always visible on touch */
.title-edit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background: transparent;
  border: none;
  color: #9099a1;
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
  top: clamp(4px, 0.9vw, 9px);
  transition: color 0.2s ease, opacity 0.2s ease;

  &:hover { color: #8BE9FD; }
}

@media (hover: hover) and (pointer: fine) {
  .title-edit-btn { opacity: 0; }
  .title-row:hover .title-edit-btn { opacity: 1; }
}

.list-description {
  font-size: 15px;
  font-weight: 300;
  line-height: 1.6;
  color: #a0aab2;
  max-width: 620px;
  margin: 14px auto 0;
}

.list-meta {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
  font-size: 14px;
  color: #8F989E;

  .meta-author { color: #fff; font-weight: 600; }
  .meta-dot { opacity: 0.4; }
}

.privacy-wrapper { position: relative; display: inline-flex; }

.privacy-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(139, 233, 253, 0.08);
  border: 1px solid rgba(139, 233, 253, 0.28);
  color: #8BE9FD;
  border-radius: 999px;
  padding: 4px 10px 4px 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;

  .caret { margin-left: -2px; opacity: 0.8; }
  &:hover { background: rgba(139, 233, 253, 0.16); border-color: #8BE9FD; }
}

.privacy-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 30;
  min-width: 130px;
  background: rgba(3, 4, 6, 0.92);
  border: 1px solid rgba(139, 233, 253, 0.25);
  border-radius: 12px;
  padding: 5px;
  backdrop-filter: blur(16px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);

  .dropdown-item {
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 14px;
    color: #cfd6dc;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover { background: rgba(139, 233, 253, 0.1); color: #fff; }
    &.active { color: #8BE9FD; font-weight: 600; }
  }
}

.list-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.action-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(3, 4, 6, 0.5);
  border: 1px solid rgba(139, 233, 253, 0.22);
  color: #8BE9FD;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;

  &:hover {
    background: rgba(139, 233, 253, 0.12);
    border-color: #8BE9FD;
    transform: translateY(-1px);
  }
}

/* ── Undo banner ────────────────────────────────────────────────── */
.undo-banner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  max-width: 560px;
  margin: 0 auto 20px;
  padding: 12px 20px;
  background: rgba(3, 4, 6, 0.75);
  border: 1px solid rgba(139, 233, 253, 0.22);
  border-radius: 12px;
  overflow: hidden;
  font-size: 14px;
  color: #cfd6dc;
  backdrop-filter: blur(10px);

  .undo-btn {
    background: transparent;
    border: 1px solid rgba(139, 233, 253, 0.4);
    color: #8BE9FD;
    border-radius: 999px;
    padding: 5px 16px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s ease;
    &:hover { background: rgba(139, 233, 253, 0.12); border-color: #8BE9FD; }
  }

  .timer-line {
    position: absolute;
    bottom: 0; left: 0;
    height: 2px;
    width: 100%;
    background: linear-gradient(90deg, #1F5467, #8BE9FD);
    transform-origin: left;
    animation: undo-countdown 10s linear forwards;
  }
}

@keyframes undo-countdown { from { transform: scaleX(1); } to { transform: scaleX(0); } }

/* ── State cards (empty / no results) ───────────────────────────── */
.state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 6px;
  min-height: 360px;
  padding: 48px 24px;
  background: rgba(3, 4, 6, 0.6);
  border: 1px solid rgba(139, 233, 253, 0.16);
  border-radius: 18px;
  backdrop-filter: blur(12px);

  &.inset { min-height: 320px; border-radius: 14px; background: transparent; border: none; backdrop-filter: none; }

  .state-icon { width: 72px; height: 72px; opacity: 0.5; margin-bottom: 14px; }
  h3 { color: #fff; font-size: 18px; font-weight: 700; margin: 0; }
  p { color: #a0aab2; font-size: 14px; font-weight: 300; margin: 4px 0 18px; }
}

.primary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1F5467, #8BE9FD);
  border: 1px solid rgba(139, 233, 253, 0.5);
  color: #03242C;
  padding: 11px 28px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  box-shadow: 0 4px 16px rgba(139, 233, 253, 0.18);

  &:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(139, 233, 253, 0.28); }
}

/* ── Content panel ──────────────────────────────────────────────── */
.list-panel {
  background: rgba(3, 4, 6, 0.6);
  background-image:
    radial-gradient(circle at 12% 0%, rgba(31, 84, 103, 0.18), transparent 45%),
    radial-gradient(circle at 90% 100%, rgba(139, 233, 253, 0.05), transparent 40%);
  border: 1px solid rgba(139, 233, 253, 0.16);
  border-radius: 20px;
  padding: 16px 18px 22px;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);

  @media (max-width: 600px) { padding: 12px 10px 16px; border-radius: 16px; }
}

/* Toolbar */
.panel-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  padding: 4px 4px 14px;
  border-bottom: 1px solid rgba(139, 233, 253, 0.12);
  margin-bottom: 16px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;

  /* Unify the privacy / action pills into one cohesive control row beside Filters */
  .privacy-wrapper { position: relative; }
  .privacy-btn,
  .action-pill {
    border-radius: 10px;
    padding: 8px 14px;
    background: rgba(0, 0, 0, 0.3);
  }
  .privacy-btn:hover,
  .action-pill:hover { background: rgba(139, 233, 253, 0.12); }
}

.seg-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(139, 233, 253, 0.18);
  border-radius: 999px;
  padding: 4px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;

  input { display: none; }
  span {
    padding: 7px 18px;
    border-radius: 999px;
    transition: all 0.25s ease;
    color: #8F989E;
    font-weight: 600;
    z-index: 1;
  }
  input:not(:checked) ~ span:first-of-type,
  input:checked ~ span:last-of-type {
    background: linear-gradient(135deg, #1F5467, #8BE9FD);
    color: #03242C;
    box-shadow: 0 2px 10px rgba(139, 233, 253, 0.25);
  }
}

.filter-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(139, 233, 253, 0.18);
  color: #cfd6dc;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;

  &:hover { background: rgba(139, 233, 253, 0.1); border-color: rgba(139, 233, 253, 0.4); color: #fff; }
  &.active { border-color: #8BE9FD; color: #8BE9FD; }

  .filter-dot {
    position: absolute;
    top: -3px; right: -3px;
    width: 9px; height: 9px;
    border-radius: 50%;
    background: #8BE9FD;
    box-shadow: 0 0 8px rgba(139, 233, 253, 0.7);
  }
}

/* Active filter chips */
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  padding: 12px 14px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(139, 233, 253, 0.14);
  border-radius: 12px;
}

.filter-chips { display: flex; flex-wrap: wrap; gap: 8px; flex: 1; min-width: 0; }

.filter-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(139, 233, 253, 0.1);
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 999px;
  padding: 4px 6px 4px 12px;
  color: #8BE9FD;
  font-size: 12px;
  font-weight: 500;

  .chip-remove {
    background: rgba(139, 233, 253, 0.12);
    border: none;
    color: inherit;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    width: 18px; height: 18px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s ease;
    &:hover { background: rgba(255, 95, 95, 0.25); color: #ff9999; }
  }
}

.clear-all-inline {
  flex-shrink: 0;
  background: transparent;
  border: 1px solid rgba(255, 95, 95, 0.35);
  color: #ff9999;
  border-radius: 999px;
  padding: 5px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  &:hover { background: rgba(255, 95, 95, 0.12); border-color: rgba(255, 95, 95, 0.6); }
}

/* ── Pager ──────────────────────────────────────────────────────── */
.list-pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 6px 0 18px;

  &:last-child { margin: 18px 0 4px; }

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px; height: 44px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(139, 233, 253, 0.2);
    color: #8BE9FD;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) { background: rgba(139, 233, 253, 0.12); border-color: #8BE9FD; }
    &:disabled { opacity: 0.35; cursor: not-allowed; }
    &:active:not(:disabled) { transform: scale(0.94); }

    svg { width: 25px; height: 25px; }
  }
}

.pager-info { display: inline-flex; align-items: center; gap: 8px; padding: 0 6px; }

.pager-label, .pager-of {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8F989E;
  font-weight: 600;
}

.pager-input {
  width: 52px;
  height: 34px;
  background: rgba(0, 0, 0, 0.4);
  color: #8BE9FD;
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  outline: none;
  transition: all 0.2s ease;
  -moz-appearance: textfield;
  appearance: textfield;
  font-family: inherit;

  &:focus { border-color: #8BE9FD; box-shadow: 0 0 0 3px rgba(139, 233, 253, 0.12); }
}

/* ── Grid + cards ───────────────────────────────────────────────── */
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(158px, 1fr));
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, minmax(115px, 1fr));
    gap: 12px;
  }
}

.movie-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(139, 233, 253, 0.12);
  overflow: hidden;
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(139, 233, 253, 0.45);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 233, 253, 0.12);
    .poster.loaded { transform: scale(1.05); }
  }
}

.poster-container {
  position: relative;
  aspect-ratio: 2 / 3;
  background: #0a0e12;
  overflow: hidden;
}

.poster-link { display: block; width: 100%; height: 100%; }

.poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease, opacity 0.4s ease;
  opacity: 0;
  &.loaded { opacity: 1; }
}

.user-rating-badge {
  position: absolute;
  top: 8px; left: 8px;
  z-index: 5;
  width: 28px; height: 28px;
  background: rgba(3, 4, 6, 0.85);
  color: #8BE9FD;
  border: 2px solid #8BE9FD;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover { transform: scale(1.12); box-shadow: 0 0 12px rgba(139, 233, 253, 0.6); }
  &.has-review { overflow: visible; }

  .review-indicator {
    position: absolute;
    top: -3px; right: -3px;
    width: 9px; height: 9px;
    background: #fff;
    border-radius: 50%;
    border: 2px solid #03242C;
  }
}

.card-actions-menu {
  position: absolute;
  top: 8px; right: 8px;
  z-index: 6;

  .dropdown-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px; height: 28px;
    background: rgba(3, 4, 6, 0.7);
    border: 1px solid rgba(139, 233, 253, 0.25);
    color: #8BE9FD;
    border-radius: 8px;
    cursor: pointer;
    backdrop-filter: blur(4px);
    opacity: 1;
    transition: opacity 0.2s ease, background 0.2s ease;
    svg { width: 20px; height: 20px; display: block; flex-shrink: 0; }
    &:hover { background: rgba(139, 233, 253, 0.18); }
  }
}

/* Touch devices always show the menu trigger; true-mouse devices reveal it on hover */
@media (hover: hover) and (pointer: fine) {
  .card-actions-menu .dropdown-trigger { opacity: 0; }
  .card-actions-menu.menu-open .dropdown-trigger,
  .movie-card:hover .card-actions-menu .dropdown-trigger { opacity: 1; }
}

.action-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 20;
  min-width: 150px;
  background: rgba(3, 4, 6, 0.95);
  border: 1px solid rgba(139, 233, 253, 0.25);
  border-radius: 12px;
  padding: 5px;
  backdrop-filter: blur(16px);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.55);

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 11px;
    border-radius: 8px;
    font-size: 13px;
    color: #cfd6dc;
    cursor: pointer;
    transition: all 0.15s ease;
    svg { flex-shrink: 0; }

    &:hover { background: rgba(139, 233, 253, 0.1); color: #fff; }
    &.remove-action:hover { background: rgba(255, 95, 95, 0.12); color: #ff9999; }
  }
}

.card-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 3px;
  padding: 10px 8px 12px;
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: #8BE9FD;
  text-decoration: none;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.1em;
  transition: color 0.2s ease;
  &:hover { color: #fff; }
}

.card-year { font-size: 12px; color: #8F989E; margin: 0; font-weight: 500; }

.card-rating {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 2px;
  min-height: 18px;

  .rating-logo { width: 26px; height: auto; flex-shrink: 0; &.tmdb { width: 22px; } }
  .rating-score { font-size: 13px; color: #fff; font-weight: 700; }
  .vote-count { font-size: 11px; color: #8F989E; }
  .rating-empty { font-size: 11px; color: #6b7480; }
}

/* ── Modals (glassmorphism cyan) ────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(3, 4, 6, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.glass-modal {
  position: relative;
  width: 100%;
  max-width: 480px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  background: rgba(3, 4, 6, 0.9);
  background-image:
    radial-gradient(circle at 15% 20%, rgba(31, 84, 103, 0.2), transparent 35%),
    radial-gradient(circle at 85% 80%, rgba(139, 233, 253, 0.08), transparent 30%);
  border-radius: 20px;
  padding: 30px 26px 24px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(31, 84, 103, 0.5),
    inset 0 0 24px rgba(139, 233, 253, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  animation: modal-float-in 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #8BE9FD, #1F5467, transparent);
    opacity: 0.8;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }

  &.rating-modal, &.confirm-modal, &.rename-modal { max-width: 420px; }
}

@keyframes modal-float-in {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-close {
  position: absolute;
  top: 14px; right: 14px;
  width: 36px; height: 36px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #e6ebf0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 5;
  &:hover { background: rgba(255, 95, 95, 0.18); border-color: rgba(255, 95, 95, 0.5); color: #ff7e7e; }
  svg { width: 20px; height: 20px; display: block; flex-shrink: 0; }
}

.modal-title {
  font-size: 21px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 18px;
  letter-spacing: -0.3px;
  text-shadow: 0 0 20px rgba(139, 233, 253, 0.25);
  padding-right: 30px;
}

.modal-text {
  font-size: 15px;
  color: #cfd6dc;
  line-height: 1.6;
  margin: 0 0 22px;
  strong { color: #fff; }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1F5467, #8BE9FD);
  border: 1px solid rgba(139, 233, 253, 0.5);
  color: #03242C;
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  box-shadow: 0 4px 16px rgba(139, 233, 253, 0.18);
  &:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(139, 233, 253, 0.28); }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #a0aab2;
  padding: 10px 22px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  &:hover { background: rgba(255, 255, 255, 0.05); color: #fff; }
  &.danger { border-color: rgba(255, 95, 95, 0.35); color: #ff9999; &:hover { background: rgba(255, 95, 95, 0.1); border-color: rgba(255, 95, 95, 0.55); } }
}

/* Shared field styles */
.field-group { margin-bottom: 16px; }

.filter-label {
  display: block;
  color: #e0e6ed;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: 0.2px;
}

.field-input, .field-textarea {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(139, 233, 253, 0.2);
  border-radius: 10px;
  padding: 10px 13px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
  font-family: inherit;

  &:focus { border-color: rgba(139, 233, 253, 0.6); box-shadow: 0 0 0 3px rgba(139, 233, 253, 0.12); background: rgba(0, 0, 0, 0.4); }
  &::placeholder { color: rgba(160, 170, 178, 0.45); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.field-textarea { resize: vertical; min-height: 80px; line-height: 1.5; }

.native-select { appearance: auto; cursor: pointer; option { background: #03242C; color: #fff; } }

/* Filters modal */
.filters-content { display: block; }
.filter-group { margin-bottom: 16px; }

.custom-select { position: relative; cursor: pointer; user-select: none; }

.select-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(139, 233, 253, 0.2);
  border-radius: 10px;
  padding: 10px 13px;
  color: #fff;
  font-size: 14px;
  transition: all 0.2s ease;
  svg { transition: transform 0.2s ease; flex-shrink: 0; color: #8BE9FD; &.rotate-180 { transform: rotate(180deg); } }
  &:hover { border-color: rgba(139, 233, 253, 0.4); }
}

.dropdown-options {
  position: absolute;
  top: calc(100% + 5px);
  left: 0; right: 0;
  z-index: 30;
  max-height: 240px;
  overflow-y: auto;
  background: rgba(3, 4, 6, 0.96);
  border: 1px solid rgba(139, 233, 253, 0.25);
  border-radius: 12px;
  padding: 5px;
  backdrop-filter: blur(16px);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.55);

  .dropdown-option {
    padding: 9px 12px;
    border-radius: 8px;
    font-size: 14px;
    color: #cfd6dc;
    cursor: pointer;
    transition: all 0.15s ease;
    &:hover { background: rgba(139, 233, 253, 0.1); color: #fff; }
    &.selected { background: rgba(139, 233, 253, 0.14); color: #8BE9FD; font-weight: 600; }
  }
}

.range-inputs { display: flex; align-items: center; gap: 10px; }
.range-sep { color: #8F989E; font-weight: 600; }

.quick-options { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.quick-btn {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(139, 233, 253, 0.18);
  color: #cfd6dc;
  border-radius: 999px;
  padding: 5px 13px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  &:hover { background: rgba(139, 233, 253, 0.12); border-color: #8BE9FD; color: #8BE9FD; }
}

/* Rating modal */
.rating-numbers {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 6px;
  margin-bottom: 16px;
}

.rating-btn {
  aspect-ratio: 1;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(139, 233, 253, 0.2);
  color: #cfd6dc;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.12s ease;
  font-family: inherit;
  &:hover { border-color: #8BE9FD; }
  &.rating-btn-active { background: linear-gradient(135deg, #1F5467, #8BE9FD); color: #03242C; border-color: #8BE9FD; }
}

.review-section { position: relative; margin-bottom: 16px; }
.char-count { text-align: right; font-size: 11px; color: #6b7480; margin-top: 5px; }

/* Share modal */
.link-row { display: flex; gap: 8px; align-items: stretch; }
.link-input { flex: 1; min-width: 0; color: #8BE9FD; font-family: 'JetBrains Mono', 'SF Mono', Menlo, monospace; font-size: 12px; }

.copy-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(139, 233, 253, 0.08);
  border: 1px solid rgba(139, 233, 253, 0.35);
  color: #8BE9FD;
  border-radius: 10px;
  padding: 0 14px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  &:hover { background: rgba(139, 233, 253, 0.15); border-color: #8BE9FD; }
  &.is-success { background: rgba(76, 217, 100, 0.12); border-color: rgba(76, 217, 100, 0.55); color: #6ee07d; }
}

.social-row { display: flex; gap: 10px; flex-wrap: wrap; }

.social-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px; height: 46px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(139, 233, 253, 0.18);
  color: #e0e6ed;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { transform: translateY(-2px); border-color: #8BE9FD; background: rgba(139, 233, 253, 0.1); color: #8BE9FD; box-shadow: 0 4px 14px rgba(139, 233, 253, 0.18); }
}
.social-wa:hover { color: #25D366; border-color: rgba(37, 211, 102, 0.6); }
.social-tg:hover { color: #29A9EB; border-color: rgba(41, 169, 235, 0.6); }
.social-x:hover { color: #fff; border-color: rgba(255, 255, 255, 0.55); }
.social-em:hover { color: #ffb74d; border-color: rgba(255, 183, 77, 0.55); }

/* ── Transitions ────────────────────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-6px); }

.slide-up-enter-active, .slide-up-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(14px); }

/* ── Responsive ─────────────────────────────────────────────────── */
@media (max-width: 600px) {
  .panel-toolbar { gap: 10px; }
  .seg-switch span { padding: 6px 14px; font-size: 13px; }
  .filter-btn-label { display: none; }
  .filter-btn { padding: 8px 12px; }
  .toolbar-right { gap: 6px; }
  .toolbar-right .action-pill span { display: none; }
  .toolbar-right .action-pill { padding: 8px 11px; }
  .list-actions { flex-wrap: wrap; }
  .glass-modal { padding: 26px 18px 20px; }
  .rating-numbers { gap: 5px; }
  .rating-btn { font-size: 12px; }
}
</style>

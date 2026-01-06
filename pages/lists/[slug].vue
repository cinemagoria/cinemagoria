<template>
  <div class="list-page">
    <div class="list-header">
      <div v-if="loading" class="loader-container">
         <Loader :size="60" />
      </div>
      <div v-else class="header-content">
          <div class="list-nav-wrapper" v-click-outside="closeListSelector" style="justify-content: center;">
              <div class="title-with-selector">
                  <h1 class="list-title title-primary" style="margin: 0; display: inline-block;">{{ list.name }}</h1>
                  <button v-if="allAvailableLists.length > 0" @click="toggleListSelector" class="list-selector-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </button>
              </div>
              <transition name="fade">
                  <div v-if="listSelectorOpen" class="list-selector-dropdown" @click.stop>
                      <div class="dropdown-header">
                          <a v-if="selectorTotalPages > 1" href="#" @click.prevent.stop="goToPrevPage" class="dropdown-nav-btn" :class="{ 'disabled': listSelectorPage <= 1 }" style="z-index: 101; position: relative; display: flex; align-items: center; justify-content: center; text-decoration: none; width: 32px; height: 32px; background: rgba(255,255,255,0.05); border-radius: 4px; pointer-events: auto;">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;"><polyline points="15 18 9 12 15 6"></polyline></svg>
                          </a>
                          <span>Switch to</span>
                          <a v-if="selectorTotalPages > 1" href="#" @click.prevent.stop="goToNextPage" class="dropdown-nav-btn" :class="{ 'disabled': listSelectorPage >= selectorTotalPages }" style="z-index: 101; position: relative; display: flex; align-items: center; justify-content: center; text-decoration: none; width: 32px; height: 32px; background: rgba(255,255,255,0.05); border-radius: 4px; pointer-events: auto;">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;"><polyline points="9 18 15 12 9 6"></polyline></svg>
                          </a>
                      </div>
                      <div v-for="l in visibleCustomLists" :key="l.id + '_' + listSelectorPage">
                          <nuxt-link :to="l.link" class="dropdown-list-item">{{ l.name }}</nuxt-link>
                      </div>
                  </div>
              </transition>
          </div>
          <p class="list-description" v-if="list.description">{{ list.description }}</p>
          <div class="list-meta">
              <span class="author">{{ isOwner ? 'by You' : 'by ' + (list.owner_name || 'Unknown') }}</span>
              <span class="dot">·</span>
              <span class="count">{{ items.length }} items</span>
              <span class="dot">·</span>
              <div v-if="isOwner" class="privacy-wrapper" style="position: relative;">
                  <button @click.stop="togglePrivacyDropdown" class="privacy-btn">
                      {{ list.is_public ? 'Public' : 'Private' }}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 2px;">
                        <path d="M7 10l5 5 5-5z"/>
                      </svg>
                  </button>
                  
                  <transition name="fade">
                    <div v-if="privacyDropdownOpen" class="privacy-dropdown">
                        <div class="dropdown-item" @click="setPrivacy(true)" :class="{ active: list.is_public }">Public</div>
                        <div class="dropdown-item" @click="setPrivacy(false)" :class="{ active: !list.is_public }">Private</div>
                    </div>
                  </transition>
              </div>
              
               <button v-if="isOwner" @click="openRenameModal" class="share-btn-icon" aria-label="Rename List" style="margin-right: 5px;">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block; min-width: 20px;"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
              </button>
              
               <button v-if="list.is_public" @click="openShareModal" class="share-btn-icon" aria-label="Share">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block; min-width: 20px;">
                    <circle cx="18" cy="5" r="3"/>
                    <circle cx="6" cy="12" r="3"/>
                    <circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                 </svg>
              </button>
          </div>
      </div>
    </div>

    <div v-if="!loading" class="watchlist-section" style="padding-top: 0;">
        <transition name="slide-up">
           <div v-if="undoItem" class="undo-banner">
             <div class="undo-content">
                 <span>Removed "{{ undoItem.details.nameForDb }}"</span>
                 <button @click="handleUndo" class="undo-btn">Undo</button>
             </div>
             <div class="timer-line"></div>
           </div>
        </transition>

        <div v-if="items.length === 0 && !undoItem" class="empty-state">
             <img src="/cinema-popcorn.svg" alt="Empty list" class="empty-state-icon">
             <h3>This list is empty</h3>
             <p>Go explore and add some movies or TV shows!</p>
             <nuxt-link to="/" class="explore-btn">Explore Content</nuxt-link>
        </div>

        <div v-else>
          <div class="column">

            
             <div class="new-controls-container">
              <label class="switch">
                <input type="checkbox" :checked="filter === 'tvShows'" @change="toggleFilterType">
                <span>Movies</span>
                <span>TV Shows</span>
              </label>
              
              <div class="action-buttons">
                <button class="control-btn" @click="openFiltersModal">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
                  </svg>
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

          <div v-if="itemsToShow.length === 0" class="no-results-state">
             <template v-if="filteredItems.length === 0 && hasActiveFilters">
                <img src="/cinema-popcorn.svg" alt="No results" class="no-results-icon">
                <h3>No Results Found</h3>
                <p>We couldn't find any content matching your current filters.</p>
                <button @click="clearAllFilters" class="refine-filters-btn">Clear All Filters</button>
             </template>
             <template v-else>
                <img src="/cinema-popcorn.svg" alt="No content" class="empty-state-icon">
                <h3>No {{ filter === 'movies' ? 'Movies' : 'TV Shows' }}</h3>
                <p>Switch tabs or add some content!</p>
             </template>
          </div>
          
          <div v-else>
            <div class="pagination" v-if="filteredItems.length > itemsPerPage">
              <button @click="goToFirst" :disabled="currentPage === 1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-skip-back-icon lucide-skip-back"><path d="M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z"/><path d="M3 20V4"/></svg>
              </button>
              <button @click="prevPage" :disabled="currentPage === 1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-step-back-icon lucide-step-back"><path d="M13.971 4.285A2 2 0 0 1 17 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z"/><path d="M21 20V4"/></svg>
              </button>
              <span class="pagination-text-container">
                <label for="pageTop" class="pagination-label">Page</label>
                <input type="number" id="pageTop" class="pagination-input" v-model.number="currentPage" min="1" :max="totalPages" @change="validatePageInput">
              </span>
              <span class="pagination-text">of <span class="pagination-number">{{ totalPages }}</span></span>
              <button @click="nextPage" :disabled="currentPage === totalPages">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-step-forward-icon lucide-step-forward"><path d="M10.029 4.285A2 2 0 0 0 7 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z"/><path d="M3 4v16"/></svg>
              </button>
              <button @click="goToLast" :disabled="currentPage === totalPages">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-skip-forward-icon lucide-skip-forward"><path d="M21 4v16"/><path d="M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z"/></svg>
              </button>
            </div>
            
            <div class="movie-grid">
              <div v-for="(item, index) in itemsToShow" :key="'item-' + index" class="movie-card">
                 <div class="card-background">
                   <div class="user-rating-badge" v-if="isOwner && item.details.userRatingForDb && item.details.userRatingForDb !== '-'" 
                     @click.stop="openRatingModal(item)"
                     :class="{ 'has-review': item.details.userReview }" 
                     :title="item.details.userReview ? 'Tiene Reseña' : ''">
                     {{ item.details.userRatingForDb }}
                     <span v-if="item.details.userReview" class="review-indicator"></span>
                   </div>
                   
                   <div class="poster-container">
                     <nuxt-link :to="getLink(item)" class="item-link-overlay">
                        <img 
                          :src="getImageUrl(item.details.posterForDb)" 
                          alt="Poster" 
                          class="poster" 
                          :class="{ 'loaded': imageLoadStates[item.details.idForDb] }"
                          loading="lazy"
                          @load="handleImageLoad(item.details.idForDb)"
                          @error="handleImageError"
                        />
                     </nuxt-link>
                     
                     <div v-if="isOwner" class="card-actions-menu">
                        <div class="dropdown-trigger" @click.prevent.stop="toggleCardMenu(item.details.idForDb)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </div>
                     </div>
                   </div>

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
                             <svg class="rating-logo imdb" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" enable-background="new 0 0 48 48">
                               <g><path fill="#FFC107" d="M44,13H4c-2.2,0-4,1.8-4,4v16c0,2.2,1.8,4,4,4h40c2.2,0,4-1.8,4-4V17C48,14.8,46.2,13,44,13z"/></g>
                               <g>
                                 <path fill="#263238" d="M28.1,18h-3.7v13.1h3.7c2,0,2.8-0.4,3.3-0.7c0.6-0.4,0.9-1.1,0.9-1.8v-7.9c0-0.9-0.4-1.7-0.9-2   C30.6,18.2,30.3,18,28.1,18z M28.8,28.3c0,0.6-0.7,0.6-1.3,0.6V20c0.6,0,1.3,0,1.3,0.6V28.3z"/>
                                 <path fill="#263238" d="M33.8,18v13.3h2.8c0,0,0.2-0.9,0.4-0.7c0.4,0,1.5,0.6,2.2,0.6s1.1,0,1.5-0.2c0.6-0.4,0.7-0.7,0.7-1.3v-7.8   c0-1.1-1.1-1.8-2-1.8s-1.8,0.6-2.2,0.9v-3H33.8z M37.4,22.2c0-0.4,0-0.6,0.4-0.6c0.2,0,0.4,0.2,0.4,0.6v6.6c0,0.4,0,0.6-0.4,0.6   c-0.2,0-0.4-0.2-0.4-0.6V22.2z"/>
                                 <polygon fill="#263238" points="22.7,31.3 22.7,18 18.3,18 17.5,24.3 16.4,18 12.4,18 12.4,31.3 15.3,31.3 15.3,23.9 16.6,31.3    18.6,31.3 19.9,23.9 19.9,31.3  "/>
                                 <rect x="7.6" y="18" fill="#263238" width="3.1" height="13.3"/>
                               </g>
                             </svg>
                             <span class="rating-score">{{ formatRatingValue(item.details.imdb_rating) }}</span>
                             <span class="vote-count" v-if="item.details.imdb_votes">({{ formatVoteCount(item.details.imdb_votes) }})</span>
                          </div>
                          <div v-else-if="item.details.starsForDb" class="rating-item">
                             <img src="/tmdb.svg" alt="TMDB" class="rating-logo tmdb">
                             <span class="rating-score">{{ formatRating(item.details.starsForDb / 10) }}</span>
                             <span class="vote-count" v-if="item.details.vote_count">({{ formatVoteCount(item.details.vote_count) }})</span>
                          </div>
                          <p v-else style="font-size: 11px; opacity: 0.7;">Not specified</p>
                        </div>
                     </div>
                   </div>

                   <div v-if="isOwner" class="card-actions-menu" :class="{ 'menu-open': activeCardMenuId === item.details.idForDb }">
                      <div class="dropdown-trigger" @click.prevent.stop="toggleCardMenu(item.details.idForDb)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                      
                      <transition name="fade">
                         <div v-if="activeCardMenuId === item.details.idForDb" class="action-dropdown" @click.stop>
                             <div v-if="isOwner && (!item.details.userRatingForDb || item.details.userRatingForDb === '-')" class="dropdown-item" @click="openRatingModal(item); activeCardMenuId = null">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                                Rate
                             </div>
                             <div class="dropdown-item" @click="openAddModal(item); activeCardMenuId = null">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                                  <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
                                </svg>
                                Edit...
                             </div>
                             <div class="dropdown-item remove-action" @click="removeListItem(item); activeCardMenuId = null">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                                Remove
                             </div>
                         </div>
                      </transition>
                   </div>
                 </div>
              </div>
            </div>

             <div class="pagination-footer" v-if="filteredItems.length > itemsPerPage">
               <button @click="goToFirst" :disabled="currentPage === 1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-skip-back-icon lucide-skip-back"><path d="M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z"/><path d="M3 20V4"/></svg>
              </button>
              <button @click="prevPage" :disabled="currentPage === 1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-step-back-icon lucide-step-back"><path d="M13.971 4.285A2 2 0 0 1 17 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z"/><path d="M21 20V4"/></svg>
              </button>
              <span class="pagination-text-container">
                <label for="pageBottom" class="pagination-label">Page</label>
                <input type="number" id="pageBottom" class="pagination-input" v-model.number="currentPage" min="1" :max="totalPages" @change="validatePageInput">
              </span>
              <span class="pagination-text">of <span class="pagination-number">{{ totalPages }}</span></span>
              <button @click="nextPage" :disabled="currentPage === totalPages">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-step-forward-icon lucide-step-forward"><path d="M10.029 4.285A2 2 0 0 0 7 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z"/><path d="M3 4v16"/></svg>
              </button>
              <button @click="goToLast" :disabled="currentPage === totalPages">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-skip-forward-icon lucide-skip-forward"><path d="M21 4v16"/><path d="M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z"/></svg>
              </button>
            </div>
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
              :placeholder="selectedRating > 0 ? ratingDescriptions[selectedRating - 1] : 'Select a rating first'"
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
          <h3>Filters & Sorting</h3>
          <button class="close-btn" @click="closeFiltersModal">×</button>
        </div>
        
        <div class="filters-content">
          <div class="filter-group">
            <label class="filter-label">Genre</label>
            <div class="custom-select" @click="toggleGenreDropdown">
              <div class="select-display">
                <span class="selected-value">{{ selectedGenre || 'All genres' }}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" :class="{ 'rotate-180': genreDropdownOpen }">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </div>
              <div v-if="genreDropdownOpen" class="dropdown-options">
                <div class="dropdown-option" :class="{ selected: selectedGenre === '' }" @click.stop="selectGenre('')">
                  All genres
                </div>
                <!-- Using slice to prevent huge lists in case of many genres -->
                <div v-for="genre in uniqueSortedGenres" :key="genre" class="dropdown-option" :class="{ selected: selectedGenre === genre }" @click.stop="selectGenre(genre)">
                  {{ genre }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="filter-group">
            <label class="filter-label">Years</label>
            <div class="year-inputs">
              <input type="number" v-model.number="customYearStart" :min="1880" :max="currentYear" placeholder="From" class="year-input">
              <span class="year-separator">-</span>
              <input type="number" v-model.number="customYearEnd" :min="1880" :max="currentYear" placeholder="To" class="year-input">
            </div>
            <div class="quick-year-options">
              <button v-for="range in yearRanges" :key="range" @click="setYearRange(range)" class="year-quick-btn">
                {{ range }}
              </button>
            </div>
          </div>

          <div class="filter-group">
            <label class="filter-label">IMDB Rating Range</label>
            <div class="year-inputs">
              <input 
                type="number" 
                v-model.number="minImdbRating" 
                min="0" 
                max="10"
                placeholder="Min"
                class="year-input"
              >
              <span class="year-separator">-</span>
              <input 
                type="number" 
                v-model.number="maxImdbRating" 
                min="0" 
                max="10"
                placeholder="Max"
                class="year-input"
              >
            </div>
          </div>

          <div class="filter-group">
            <label class="filter-label">IMDB Votes Range</label>
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
            <label class="filter-label">Sort By</label>
            <div class="custom-select" @click="toggleSortDropdown">
              <div class="select-display">
                <span class="selected-value">{{ currentSortLabel }}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" :class="{ 'rotate-180': sortDropdownOpen }">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </div>
              <div v-if="sortDropdownOpen" class="dropdown-options">
                <div 
                  v-for="option in sortOptions" 
                   :key="option.value" 
                   class="dropdown-option"
                   :class="{ selected: orderMode === option.value }"
                   @click.stop="selectSort(option.value)"
                >
                  {{ option.label }}
                </div>
              </div>
            </div>
          </div>

          <div class="filter-group" v-if="isOwner">
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
    
    <div v-if="shareModalVisible" class="modal-overlay">
        <div class="share-modal-content">
          <div class="share-modal-header">
            <h2>Share This List</h2>
            <button class="close-button" @click="closeShareModal" type="button" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="share-url-container">
            <label for="share-url" class="share-label">Link</label>
            <div class="share-url-field">
              <input id="share-url" type="text" :value="shareUrl" readonly class="share-url-input">
              <div class="copy-button-container">
                <button @click="copyToClipboard" type="button" class="copy-button" aria-label="Copy to clipboard">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                  </svg>
                </button>
                <span v-if="copySuccess" class="copy-success">Copied!</span>
              </div>
            </div>
          </div>
          
          <div class="share-field-container">
            <label for="share-title" class="share-label">Title</label>
            <input id="share-title" type="text" v-model="customTitle" class="share-input">
          </div>
          
          <div class="share-field-container">
            <label for="share-message" class="share-label">Message</label>
            <textarea id="share-message" v-model="customMessage" class="share-textarea"></textarea>
          </div>
          
          <div class="share-buttons-container">
            <label class="share-label">Share On</label>
            <div class="share-buttons">
              <button @click="shareTo('whatsapp')" class="share-icon-button" aria-label="Share on WhatsApp" title="WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </button>
              
              <button @click="shareTo('telegram')" class="share-icon-button" aria-label="Share on Telegram" title="Telegram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </button>
              
              <button @click="shareTo('twitter')" class="share-icon-button" aria-label="Share on Twitter" title="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
              
              <button @click="shareTo('email')" class="share-icon-button" aria-label="Share via Email" title="Email">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/>
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
    </div>

    <div v-if="renameListModalVisible" class="modal-overlay" @click="closeRenameModal">
        <div class="create-list-modal-content" @click.stop>
             <div class="modal-header-cl">
                <h2>Rename List</h2>
                <button class="close-btn-cl" @click="closeRenameModal">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                </button>
             </div>
             <div class="modal-body-cl">
                 <div class="form-group-cl">
                    <label>New Name</label>
                    <input type="text" v-model="newListName" class="input-cl" @keyup.enter="updateListName" autofocus placeholder="e.g. Best Movies">
                 </div>
                 <div class="actions-cl">
                      <button @click="closeRenameModal" class="cancel-btn-cl">Cancel</button>
                      <button @click="updateListName" class="create-btn-cl" :disabled="!newListName || !newListName.trim()">Save</button>
                 </div>
             </div>
        </div>
    </div>
  </div>
</template>

<script>
import Loader from '~/components/Loader.vue';
import { apiImgUrl } from '~/utils/api';

export default {
    components: {
        Loader
    },
    
    data() {
        return {
            loading: true,
            list: {},
            items: [], 
            moviesFetched: [],
            tvFetched: [],
            moviesFetched: [],
            tvFetched: [],
            filter: 'movies',
            itemsPerRow: 4,
            resizeObserver: null,
            
            listSelectorOpen: false,
            listSelectorPage: 1,
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
            movieGenres: [],
            tvGenres: [],
            undoItem: null,
            undoTimer: null,
            shareModalVisible: false,
            customTitle: '',
            customMessage: '',
            copySuccess: false,
            privacyDropdownOpen: false,
            renameListModalVisible: false,
            newListName: '',
            ratingModalVisible: false,
            currentRatingItem: null,
            selectedRating: 0,
            hoverRating: 0,
            userReview: '',
            ratingDescriptions: ['', '', '', '', '', '', '', '', '', ''],
        };
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
        allAvailableLists() {
            const currentSlug = this.$route.params.slug;
            const lists = [];

            lists.push({ id: 'watchlist', name: 'Watchlist', link: '/watchlist', isWatchlist: true });

            if (this.userCustomLists) {
                this.userCustomLists.forEach(l => {
                    if (l.slug !== currentSlug) {
                        lists.push({ ...l, link: `/lists/${l.slug}`, isWatchlist: false });
                    }
                });
            }
            return lists;
        },
        selectorTotalPages() {
            return Math.ceil(this.allAvailableLists.length / 5);
        },
        visibleCustomLists() {
            const start = (this.listSelectorPage - 1) * 5;
            const end = start + 5;
            return this.allAvailableLists.slice(start, end);
        },
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
        
        filteredItems() {
           const items = this.filter === 'movies' ? this.moviesFetched : this.tvFetched;
           if (!items) return [];
           
           return items.filter(item => {
               if(!item || !item.details) return false;
               
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
                       rating = item.details.starsForDb / 10;
                   }
                   
                   if (rating === undefined || rating === null) {
                       matchesTmdbRating = false;
                   } else {
                       const min = this.minImdbRating !== null ? this.minImdbRating : 0;
                       const max = this.maxImdbRating !== null ? this.maxImdbRating : 10;
                       matchesTmdbRating = rating >= min && rating <= max;
                   }
               }

               let matchesVotes = true;
               if (this.minImdbVotes !== null || this.maxImdbVotes !== null) {
                  let votes = 0;
                  if (item.details.imdb_votes) {
                      votes = typeof item.details.imdb_votes === 'number' ? item.details.imdb_votes : parseInt(item.details.imdb_votes.replace(/,/g, ''), 10);
                  } else if (item.details.vote_count) {
                      votes = item.details.vote_count;
                  }
                  
                  if (this.minImdbVotes !== null && votes < this.minImdbVotes) matchesVotes = false;
                  if (this.maxImdbVotes !== null && votes > this.maxImdbVotes) matchesVotes = false;
               }

               let matchesUserRating = true;
               if (this.selectedUserRating !== '') {
                   if (this.selectedUserRating === 'not-rated') {
                      matchesUserRating = !item.details.userRatingForDb || item.details.userRatingForDb === '-';
                   } else {
                      if (!item.details.userRatingForDb || item.details.userRatingForDb === '-') {
                          matchesUserRating = false;
                      } else {
                          const userRating = parseInt(item.details.userRatingForDb);
                          if (this.selectedUserRating.includes('-')) {
                              const [min, max] = this.selectedUserRating.split('-').map(Number);
                              matchesUserRating = userRating >= min && userRating <= max;
                          } else {
                              matchesUserRating = userRating === parseInt(this.selectedUserRating);
                          }
                      }
                   }
               }

               return matchesGenre && matchesYear && matchesTmdbRating && matchesVotes && matchesUserRating;
           }).sort((a, b) => {
               const getAddedDate = (i) => new Date(i.details.added_at || 0);
               const getYear = (i) => i.details.yearEndForDb || i.details.yearStartForDb || 9999;
               
               const getVotes = (i) => {
                   if (i.details.imdb_votes) return typeof i.details.imdb_votes === 'number' ? i.details.imdb_votes : parseInt(i.details.imdb_votes.replace(/,/g, ''), 10);
                   return i.details.vote_count || 0;
               };
               
               const getRuntime = (i) => i.details.runtime || 0;

               const getWeightedRating = (i) => {
                   let R = 0; 
                   let v = 0;
                   if (i.details.rating_source === 'imdb' && i.details.imdb_rating) {
                       R = parseFloat(i.details.imdb_rating);
                       v = getVotes(i);
                   } else if (i.details.starsForDb) {
                       R = i.details.starsForDb / 10;
                       v = 0;
                   } else {
                       return -1;
                   }
                   const m = 1000;
                   const C = 7.0;
                   return (v / (v + m)) * R + (m / (v + m)) * C;
               };

               switch(this.orderMode) {
                   case 'latest-added': return getAddedDate(b) - getAddedDate(a);
                   case 'earliest-added': return getAddedDate(a) - getAddedDate(b);
                   case 'newer-releases': return getYear(b) - getYear(a);
                   case 'older-releases': return getYear(a) - getYear(b);
                   case 'imdb-high': 
                       const rB = getWeightedRating(b);
                       const rA = getWeightedRating(a);
                       if (rA === -1 && rB === -1) return 0;
                       if (rA === -1) return 1;
                       if (rB === -1) return -1;
                       return rB - rA;
                   case 'imdb-low': 
                       const rB_low = getWeightedRating(b);
                       const rA_low = getWeightedRating(a);
                       if (rA_low === -1 && rB_low === -1) return 0;
                       if (rA_low === -1) return 1;
                       if (rB_low === -1) return -1;
                       return rA_low - rB_low;
                   case 'votes-high': return getVotes(b) - getVotes(a);
                   case 'votes-low': return getVotes(a) - getVotes(b);
                   case 'shortest-first': return getRuntime(a) - getRuntime(b);
                   case 'longest-first': return getRuntime(b) - getRuntime(a);
                   default: return 0;
               }
           });
        },
        
        totalPages() { return Math.ceil(this.filteredItems.length / this.itemsPerPage); },
        
        itemsToShow() {
           let page = this.currentPage;
           if (!page || page < 1) page = 1;
           if (page > this.totalPages && this.totalPages > 0) page = this.totalPages;
           const start = (page - 1) * this.itemsPerPage;
           return this.filteredItems.slice(start, start + this.itemsPerPage);  
        },
        
        isOwner() {
            if (!this.list) return false;
            const dbEmail = this.list.user_email ? this.list.user_email.toLowerCase() : '';
            const localEmail = import.meta.client ? (localStorage.getItem('email')?.replace(/['"]+/g, '').toLowerCase() || '') : '';
            return dbEmail === localEmail && localEmail !== '';
        }
    },

    async mounted() {
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
            const minItems = 20;
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
        async fetchUserCustomLists() {
            const userEmail = import.meta.client ? localStorage.getItem('email')?.replace(/['"]+/g, '') : null;
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

        handleListUpdate() {
            this.fetchListDetails(true);
        },

        async fetchListDetails(redirectOnMissing = false) {
            try {
                this.loading = true;
                const slug = this.$route.params.slug;
                const userEmail = import.meta.client ? localStorage.getItem('email')?.replace(/['"]+/g, '') : null;
                
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
                 
                 const hydrated = {
                     details: {
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
                         added_at: raw.added_at
                     }
                 };
                 
                 if (raw.item_type === 'movie') {
                     this.moviesFetched.push(hydrated);
                     this.movieGenres.push(...genres);
                 } else {
                     this.tvFetched.push(hydrated);
                     this.tvGenres.push(...genres);
                 }
             });
        },
        
        toggleFilterType() { this.filter = this.filter === 'movies' ? 'tvShows' : 'movies'; this.currentPage = 1; },
        
        openRenameModal() {
            this.newListName = this.list.name;
            this.renameListModalVisible = true;
        },
        closeRenameModal() {
            this.renameListModalVisible = false;
        },
        async updateListName() {
            if (!this.newListName || !this.newListName.trim()) return;

            const userEmail = import.meta.client ? localStorage.getItem('email')?.replace(/['"]+/g, '') : null;

            try {
                const response = await fetch(`${this.tursoBackendUrl}/lists/${this.list.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: this.newListName, userEmail })
                });

                if (response.ok) {
                    this.list.name = this.newListName;
                    this.closeRenameModal();
                } else {
                    console.error('Failed to update list name');
                }
            } catch (error) {
                console.error('Error updating list name:', error);
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
            const userEmail = import.meta.client ? localStorage.getItem('email')?.replace(/['"]+/g, '') : null;

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
        
        async copyShareLink() {
            try { await navigator.clipboard.writeText(window.location.href); alert('Link copied!'); } catch(e){}
        },
        getLink(item) {
          if (item.details.typeForDb === 'movie') return `/movie/${item.details.idForDb}`;
          if (item.details.typeForDb === 'tv') return `/tv/${item.details.idForDb}`;
          return '#';
        },
        handleItemClick(item) {
           this.$router.push(this.getLink(item));
        },
        getImageUrl(path) {
           if (!path) return '/image_not_found_yet.webp';
           if (path.startsWith('http')) return path; 
           return `${apiImgUrl}/w500${path}`;
        },
        handleImageLoad(id) {
            this.imageLoadStates[id] = true;
        },
        handleImageError(e) {
            e.target.src = '/image_not_found_yet.webp';
        },
        
        openShareModal() {
            this.shareModalVisible = true;
            this.customTitle = "Check out this list '" + this.list.name + "' on EnterCinema!";
            this.customMessage = "I found this list '" + this.list.name + "' with " + this.items.length + " items on EnterCinema. Take a look!";
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

        const userEmail = import.meta.client ? localStorage.getItem('email')?.replace(/['"]+/g, '') : null;

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

      const userEmail = import.meta.client ? localStorage.getItem('email')?.replace(/['"]+/g, '') : null;
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
      const userEmail = import.meta.client ? localStorage.getItem('email')?.replace(/['"]+/g, '') : null;
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

.list-page {
    padding-top: 50px;
    min-height: 100vh;
    padding-bottom: 4rem;
    padding-left: 2rem;
    padding-right: 2rem;
    max-width: 1400px;
    margin: 0 auto;

    @media screen and (max-width: 600px) {
        padding-left: 10px;
        padding-right: 10px;
    }
}

.list-header {
    text-align: center;
    margin-bottom: 3rem;
    
    .list-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #8BE9FD;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: normal;
    max-width: 95%;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    line-height: 1.2;
  }
  
  .list-description {
     font-size: 1.6rem;
     color: #ccc;
     margin-bottom: 2rem;
     max-width: 90%;
     margin-left: auto;
     margin-right: auto;
     line-height: 1.6;
     word-wrap: break-word;
     overflow-wrap: break-word;
     white-space: normal;
     text-align: center;
  }  }
    .list-meta {
        display: flex;
        justify-content: center;
        gap: 1.2rem;
        color: #8F989E;
        font-size: 1.4rem;
        align-items: center;
        margin-top: 2rem;
        flex-wrap: wrap;
        
        .dot { font-weight: bold; opacity: 0.5; }
        .author { color: #fff; font-weight: 600; }
        
        .privacy-wrapper {
            display: flex; align-items: center;
        }
    }
    
    .privacy-btn {
        background: transparent;
        border: 1px solid rgba(139, 233, 253, 0.3);
        color: #8BE9FD;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.2s;
        font-weight: 500;
        
        &:hover {
             background: rgba(139, 233, 253, 0.1); 
             border-color: #8BE9FD;
             transform: scale(1.05);
        }
    }
    
    .share-btn-icon {
        background: transparent;
        border: 1px solid rgba(139, 233, 253, 0.3);
        color: #8BE9FD;
        width: 32px; height: 32px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        margin-left: 0.5rem;
        
        &:hover { 
            background: rgba(139, 233, 253, 0.1); 
            border-color: #8BE9FD;
            transform: scale(1.05);
        }
        
        svg { width: 16px; height: 16px; }
    }
    
    .privacy-dropdown {
        position: absolute;
        top: 100%; left: 0;
        margin-top: 5px;
        background: #0B1622;
        border: 1px solid rgba(139, 233, 253, 0.3);
        border-radius: 8px;
        z-index: 20;
        min-width: 100%;
        width: max-content;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    }
    
    .privacy-dropdown .dropdown-item {
        padding: 6px 12px;
        color: #fff;
        font-size: 1.2rem;
        cursor: pointer;
        transition: background 0.2s;
        text-align: center;
        
        &:hover { background: rgba(139, 233, 253, 0.1); color: #8BE9FD; }
        &.active { color: #8BE9FD; font-weight: 600; background: rgba(139, 233, 253, 0.05); }
    }

.loader-container {
    margin-top: 4rem;
    position: relative;
    min-height: 400px;
    width: 100%;
    background: rgba(0, 0, 0, 0.307);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.watchlist-section {
  width: 100%;
}

.movie-grid {
  backdrop-filter: blur(16px);
  background-color: rgba(0, 0, 0, 0.307);
  border-radius: 15px;
  box-shadow: 0 8px 32px #1f68875e;
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  justify-content: center;
  padding: .5rem 1rem;
}

@media screen and (max-width: 600px) {
  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(105px, 1fr)); 
    gap: 15px;
  }
}

@media screen and (min-width: 601px) {
  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
  }
}

.movie-card {
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  background: transparent;
  
  &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.5);
      .poster {
          transform: scale(1.05);
      }
  }
}

.card-background {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.poster-container {
    position: relative;
    padding-top: 150%; 
    background: #000;
    overflow: hidden;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
}

.poster {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.3s ease;
    opacity: 0; 
    &.loaded { opacity: 1; }
}

.poster-loader {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    background: rgba(20,20,20,0.8);
    z-index: 2;
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
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;

  h3 {
      font-size: 1.4rem; 
      color: #8BE9FD; 
      margin: 10px 0 5px;
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
      cursor: pointer;

      &:hover { color: #ffffff; }
  }
}

.year-text {
  font-size: 15px;
  color: #ddd;
  margin: 4px 0;
  font-weight: 500;
}

.card__content { margin-top: auto; }

.card___rating {
  width: 100%;
  display: flex !important;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
}

.rating-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  column-gap: 6px;
  row-gap: 2px;
  max-width: 100%;
}

.rating-score {
  font-size: 13px;
  color: #fff;
  font-weight: 700;
  margin-left: 0;
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
    z-index: 5;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.user-rating-badge:hover {
    transform: scale(1.1);
    box-shadow: 0 0 10px rgba(139, 233, 253, 0.5);
}

.user-rating-badge.has-review {
    overflow: visible;
    border: 3px solid #8BE9FD;
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
  width: 100%;
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

.rating-modal-buttons {
    display: flex; 
    gap: 10px; 
    width: 100%;
}

.remove-rating-btn {
    background: rgba(255, 85, 85, 0.2);
    color: #ff5555;
    border: 1px solid rgba(255, 85, 85, 0.3);
    border-radius: 30px;
    padding: 10px 0;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    transition: all 0.2s;
}

.remove-rating-btn:hover {
    background: rgba(255, 85, 85, 0.3);
    border-color: #ff5555;
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
svg.rating-logo.imdb { width: 52px; height: 26px; position: relative; top: -1px; }

.rating-logo.tmdb {
  width: 55px;
  height: auto;
}

.vote-count {
  font-size: 11px;
  color: #acafb5;
  margin-left: 0;
  white-space: nowrap;
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
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: #8BE9FD;
    transform: scale(1.05);
  }
}

.action-dropdown {
    position: absolute; top: 100%; right: 0;
    margin-top: 8px;
    min-width: 140px;
    background: #000;
    border: 1px solid rgba(139, 233, 253, 0.3);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    z-index: 30;
    overflow: hidden;
    padding: 5px 0;
    
    @media (max-width: 480px) {
        min-width: 120px;
        right: -5px;
    }
}

.dropdown-item {
    padding: 8px 12px;
    font-size: 1.3rem;
    color: #8BE9FD;
    cursor: pointer;
    display: flex; align-items: center;
    transition: all 0.2s ease;
    white-space: nowrap;
    
    &:hover { background: #8BE9FD; color: #000; }
    
    &.remove-action {
        color: #ff6b6b;
        &:hover { background: #8BE9FD; color: #ff6b6b; }
        svg { flex-shrink: 0; }
    }
}


.title-secondary {
    text-align: center;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
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
    background: rgba(0, 0, 0, 0.307);
    padding: 10px 20px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 20px;
}

.switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 25px;
  padding: 4px;
  cursor: pointer;
  user-select: none;
  font-size: 1.4rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.switch input { display: none; }
.switch span {
  padding: 8px 20px;
  border-radius: 20px;
  transition: all 0.3s ease;
  color: #8F989E;
  font-weight: 500;
}
.switch input:not(:checked) ~ span:first-of-type,
.switch input:checked ~ span:last-of-type {
  background-color: #8BE9FD;
  color: #000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.action-buttons { display: flex; gap: 1rem; }
.control-btn {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    width: 44px; height: 44px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    &:hover { 
        background: rgba(139, 233, 253, 0.1);
        border-color: rgba(139, 233, 253, 0.3);
    }
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
  display: flex; align-items: center; gap: 8px;
  background: rgba(139, 233, 253, 0.15);
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 20px; padding: 6px 12px;
  color: #8BE9FD; font-size: 1.3rem;
}
.chip-remove { background: none; border: none; color: inherit; cursor: pointer; font-size: 1.5rem; line-height: 0.8; }
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
    &:hover { background: rgba(255, 0, 0, 0.4); }
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
    top: -7px;
    position: relative;
}

.pagination button, .pagination-footer button {
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.pagination button:disabled, .pagination-footer button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button:active, .pagination-footer button:active {
  transform: scale(1.1);
}

.pagination-text-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.pagination-label, .pagination-text {
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

.pagination-input:focus {
  border-color: #8BE9FD;
}

.pagination-number {
  font-family: 'Roboto', sans-serif;
}


.movie-grid {
    width: 97% !important;
    margin: 0 auto;
}



.filters-modal {
  width: 100%;
  max-width: 500px;
  background: linear-gradient(to bottom right, #092739, #061720);
  border-radius: 12px;
  /* overflow: hidden; */
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
  transition: border-color 0.2s ease;
}

.year-input:focus {
  outline: none;
  border-color: rgba(139, 233, 253, 0.5);
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

.empty-state, .no-results-state {
    text-align: center; padding: 4rem 2rem;
    background: rgba(0, 0, 0, 0.307);
    border-radius: 12px;
    margin: 2rem 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    
    img { width: 150px; opacity: 0.5; margin-bottom: 1rem; }
    h3 { color: #8BE9FD; font-size: 2rem; margin-bottom: 0.5rem; }
    p { color: #aaa; margin-bottom: 1.5rem; font-size: 1.4rem; }
    .explore-btn, .refine-filters-btn {
        background: #8BE9FD; color: #000; padding: 10px 20px; border-radius: 20px; text-decoration: none; font-weight: bold; border: none; cursor: pointer;
        display: inline-block;
        margin: 0 auto; 
    }
}



.share-modal-content {
  width: 100%;
  max-width: 480px;
  background: linear-gradient(to bottom right, #092739, #061720);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  padding: 0;
}

.share-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.share-modal-header h2 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 500;
  color: #fff;
}

.close-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: all 0.2s ease;
  padding: 0;
  margin-top: -1px;
}

.close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.share-url-container,
.share-field-container,
.share-buttons-container {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.share-label {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
  font-size: 1.4rem;
  font-weight: 500;
}

.share-url-field {
  display: flex;
  align-items: stretch;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.share-url-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  padding: 10px 12px;
  font-size: 1.4rem;
  outline: none;
  height: 100%;
}

.copy-button-container {
  position: relative;
  display: flex;
  align-items: center;
}

.copy-button {
  border: none;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 0;
  width: 40px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: relative;
}

.copy-success {
  position: absolute;
  right: 50px;
  color: #8BE9FD;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  animation: fadeInOut 2s ease;
  white-space: nowrap;
}

@keyframes fadeInOut {
  0% { opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { opacity: 0; }
}

.copy-button:hover {
  color: #fff;
}

.share-input,
.share-textarea {
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  padding: 10px 12px;
  font-size: 1.4rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.share-input:focus,
.share-textarea:focus {
  border-color: rgba(139, 233, 253, 0.5);
}

.share-textarea {
  height: 120px;
  resize: none;
}

.share-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.share-icon-button {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  padding: 0;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.share-icon-button:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

@media screen and (max-width: 480px) {
  .share-modal-content {
    max-width: 100%;
  }
  
  .share-buttons {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}

.create-list-modal-content {
  width: 100%;
  max-width: 500px;
  background: linear-gradient(135deg, rgba(6, 47, 64, 0.98) 0%, rgba(10, 30, 40, 0.99) 100%);
  box-shadow: 0 12px 40px 0 rgba(31, 104, 135, 0.6);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 16px;
  border: 1px solid rgba(127, 219, 241, 0.3);
  display: flex;
  flex-direction: column;
}

.modal-header-cl {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h2 {
    font-size: 2rem;
    color: #8BE9FD;
    margin: 0;
    flex: 1;
    text-align: center;
  }
}

.close-btn-cl {
  background: none;
  border: none;
  font-size: 2.4rem;
  color: #fff;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  display: flex;
  align-items: center;
}
.close-btn-cl:hover { color: #8BE9FD; }

.modal-body-cl {
  padding: 2rem;
}

.form-group-cl {
    margin-bottom: 2rem;
    
    label {
        display: block;
        color: #8F989E;
        margin-bottom: 0.8rem;
        font-size: 1.4rem;
    }
}

.input-cl {
    width: 100%;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 1rem;
    color: #fff;
    font-size: 1.6rem;
}
.input-cl:focus {
    border-color: #8BE9FD;
    outline: none;
}

.actions-cl {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
}

.cancel-btn-cl {
    background: transparent;
    border: none;
    color: #aaa;
    font-size: 1.4rem;
    padding: 1rem 2rem;
    cursor: pointer;
}
.cancel-btn-cl:hover { color: #fff; }

.create-btn-cl {
    background: #8BE9FD;
    color: #000;
    border: none;
    padding: 1rem 2.5rem;
    border-radius: 8px;
    font-size: 1.4rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}
.create-btn-cl:hover:not(:disabled) {
    background: #7bd3e5;
    transform: translateY(-1px);
}
.create-btn-cl:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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
}

.undo-content {
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
    
    &:hover {
        background: #73cde0;
    }
}

.timer-line {
    height: 3px;
    background: #8BE9FD;
    width: 100%;
    animation: undo-timer 4s linear forwards;
}

@keyframes undo-timer {
    from { width: 100%; }
    to { width: 0%; }
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
    max-width: 100%;
    justify-content: center;
}

.list-title.title-primary {
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    max-width: calc(100vw - 120px);
    line-height: 1.2;
    text-align: center;
}

@media (max-width: 768px) {
    .list-title.title-primary {
        max-width: calc(100vw - 80px);
    }
}

.list-selector-btn {
    flex-shrink: 0;
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
    bottom: -3px;
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
    display: flex;
    align-items: center;
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
    display: block;
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

<template>
  <div
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    @wheel="handleWheel">
    <div
      v-if="isHomepage && autoAdvanceEnabled && items && items.length > 1"
      :class="$style.autoAdvanceBar">
      <div :class="$style.autoAdvanceBarTrack">
        <div
          v-if="isHomepageContentReady"
          :key="`auto-advance-fill-${currentIndex}`"
          :class="[$style.autoAdvanceBarFill, { [$style.autoAdvanceBarFillPaused]: autoAdvancePaused }]"></div>
      </div>
      <button
        type="button"
        :class="$style.autoAdvanceToggle"
        :aria-label="autoAdvancePaused ? 'Resume auto-advance' : 'Pause auto-advance'"
        :title="autoAdvancePaused ? 'Resume' : 'Pause'"
        @click="toggleAutoAdvance">
        <!-- Pause icon -->
        <svg v-if="!autoAdvancePaused" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="12" height="12"><rect x="4" y="3" width="4" height="14" rx="1" fill="#fff" /><rect x="12" y="3" width="4" height="14" rx="1" fill="#fff" /></svg>
        <!-- Play icon -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="12" height="12"><polygon points="5,3 17,10 5,17" fill="#fff" /></svg>
      </button>
    </div>
    <div :class="[$style.hero, { [$style.heroHomepage]: isHomepage }]">

      <div v-if="isHomepage && !isHomepageContentReady" class="unified-homepage-loader">
        <Loader :size="70" />
      </div>
      
      <div v-else-if="!isHomepage && isLoading" class="hero-loader">
        <Loader :size="60" />
      </div>
      
      <div :class="$style.backdrop" @click="handleBackdropClick">
        <div>
          <div v-if="isHomepage || isNoirTitle" :class="$style.noirBadgeGroup">
            <nuxt-link to="/noir" :class="$style.noirBadgeImg" title="N.O.I.R">
              <img src="/ui/noir-selection-500x500-v2.webp" alt="N.O.I.R" :class="$style.noirBadgeImgEl" />
            </nuxt-link>
          </div>
          <NoirModal v-if="showNoirModal" @close="showNoirModal = false" />
          <button
            v-if="trailer && !isLoading"
            :class="$style.play"
            type="button"
            aria-label="Play Trailer"
            @click="openModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 55 55"><circle cx="27.5" cy="27.5" r="26.75" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.97 40.81L40.64 27.5 20.97 14.19v26.62z"/></svg>
          </button>

          <img
            v-if="backdrop"
            :key="heroItem.id"
            ref="backdropRef"
            :src="backdrop"
            loading="eager"
            fetchpriority="high"
            decoding="async"
            :class="$style.image"
            :alt="name"
            :style="{ 
              opacity: isHomepage ? (isHomepageContentReady ? 1 : 0) : (isLoading ? 0 : 1), 
              transition: 'opacity 0.4s ease' 
            }"
            @load="onBackdropLoaded"
            @error="onBackdropLoaded">
          <img
            v-else
            :key="'no-backdrop-' + heroItem.id"
            src="/placeholders/no-data.webp"
            loading="eager"
            :class="$style.image"
            alt="No Data"
            :style="{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease' }"
            @load="onBackdropLoaded"
            @error="onBackdropLoaded">



            <div v-if="items && items.length > 1" class="nav-arrows">
                <button
                class="arrow-nav left"
                aria-label="Previous"
                type="button"
                @click.stop="prevItem">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M17.9 23.2L6.1 12 17.9.8"/></svg>
                </button>
                <button
                class="arrow-nav right"
                aria-label="Next"
                type="button"
                @click.stop="nextItem">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M6.1 23.2L17.9 12 6.1.8"/></svg>
                </button>
            </div>
        </div>
      </div>

      <div :class="$style.pane" :style="{ 
        opacity: isHomepage && !isHomepageContentReady ? 0 : 1,
        visibility: isHomepage && !isHomepageContentReady ? 'hidden' : 'visible',
        transition: 'opacity 0.4s ease, visibility 0s linear' + (isHomepage && !isHomepageContentReady ? ' 0s' : ' 0.4s')
      }">
        <transition
          appear
          name="hero">
          <div>
            <h1 :class="[$style.name, { [$style.nameHomepage]: isHomepage }, $style.hoverableName]">
              <template v-if="isSingle">
                {{ name }}
              </template>

              <template v-else>
                <nuxt-link :to="{ name: `${type}-id`, params: { id: heroItem.id } }">
                  {{ name }}
                </nuxt-link>
              </template>
            </h1>

            <div :class="$style.meta">
              <div
                v-if="stars || item.vote_count"
                :class="$style.rating">
                <div
                  v-if="stars"
                  :class="$style.stars">
                  <div :style="{ width: `${stars}%` }" />
                </div>

                <div v-if="heroItem.rating_source === 'imdb' && heroItem.imdb_rating">
                  {{ heroItem.imdb_rating.toFixed(1) }}/10 · {{ (heroItem.imdb_votes || 0).toLocaleString('en-US') }} votes (source: IMDb)
                </div>
                <div v-else-if="heroItem.vote_average">
                  {{ heroItem.vote_average.toFixed(1) }}/10 · {{ (heroItem.vote_count || 0).toLocaleString('en-US') }} reviews (source: TMDB)
                </div>
              </div>

              <div :class="$style.info">

                <span v-if="heroItem.number_of_seasons">Season {{ heroItem.number_of_seasons }}</span>
                <span v-if="yearStart">{{ yearStart }}</span>
                <span v-if="heroItem.runtime">{{ formatRuntime(heroItem.runtime) }}</span>
                <span v-if="cert">Cert. {{ cert }}</span>
              </div>
            </div>

            <button v-if="hasTrackedProgress" :class="$style.trackInfoPill" @click="handleTrackingPillClick">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle" style="margin-right: 6px;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
               <span>{{ trackingInfoText }}</span>
            </button>

            <div :class="$style.desc">
              {{ truncate(heroItem.overview || MANUAL_OVERVIEWS[heroItem.id] || '', 200) }}
            </div>

            <div v-if="activeFestivals.length > 0" :class="$style.festivalBadgeContainer">
                <template v-for="festival in activeFestivals" :key="festival.name">
                    <nuxt-link v-if="festival.isSimple" :to="festival.link" style="text-decoration: none; display: inline-block;">
                        <component :is="festival.component" />
                    </nuxt-link>
                </template>
            </div>
            
            <div :class="[$style.buttonContainer, { 'no-transition': isHomepage && !isHomepageContentReady }]">
              <transition-group name="fade">

              
              <button
                v-if="trailer"
                class="button button--icon"
                :class="$style.actionButton"
                type="button"
                @click="openModal"
                key="watch-trailer-btn">
                <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M3 22v-20l18 10-18 10z" fill="currentColor" stroke="none"/></svg></span>
                <span class="txt">Watch Trailer</span>
              </button>
              </transition-group>

              <div class="add-to-list-wrapper" v-click-outside="closeAddListMenu" style="position: relative;">
                <button
                  v-if="hasAccessToken"
                  class="button button--icon" 
                  type="button"
                  :class="{ [$style.actionButton]: true, [$style.favoritesFilled]: isInAnyList || showAddListMenu }"
                  @click.stop="toggleAddListMenu">
                  <span class="icon">
                    <svg v-if="!isInAnyList" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </span>
                  <span class="txt">{{ isInAnyList ? 'Saved' : 'Add to...' }}</span>
                </button>

                <transition name="fade">
                  <div v-if="showAddListMenu" class="add-list-menu" @wheel.stop>
                    <div class="menu-header">Save to</div>
                    
                    <button class="menu-option" @click.stop.prevent="handleToggleFavorite">
                      <div class="checkbox">
                        <svg v-if="membership.inWatchlist || isFavorite" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span>Watchlist</span>
                    </button>

                    <div class="divider"></div>
                    
                    <div v-if="userLists.length > 0" class="list-scroll-area">
                       <div v-for="list in userLists" :key="list.id">
                           <button 
                              class="menu-option"
                              @click="toggleListMembership(list)">
                              <div class="checkbox">
                                <svg v-if="membership.lists.some(l => l.id === list.id)" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </div>
                              <span class="list-name">{{ list.name }}</span>
                           </button>
                       </div>
                       <div class="divider"></div>
                    </div>

                    <button class="menu-option create-new" @click="openCreateListModal">
                      <span class="plus">+</span> Create New List
                    </button>
                  </div>
                </transition>
              </div>
              
              <button
                v-if="hasAccessToken"
                class="button button--icon"
                :class="$style.actionButton"
                type="button"
                @click="hasUserRating ? showRatingDetails() : openRatingModal()"
                style="overflow: hidden; position: relative;">
                <span class="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none">
                    <path
                      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                      :fill="hasUserRating ? '#8BE9FD' : 'currentColor'"
                    />
                  </svg>
                </span>
                <span class="txt" style="position:relative; top:1.3px;">{{ hasUserRating ? userRatingForDb : 'Rate' }}</span>
                <span v-if="hasUserRating" style="position: absolute; bottom: -5px; left: 0; width: 100%; height: 3px; background-color: #8BE9FD;"></span>
              </button>


              <button
                class="button button--icon"
                :class="$style.shareButton"
                type="button"
                @click="openShareModal">
                <span class="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    style="position:relative;"
                    viewBox="0 0 24 24"
                    fill="none">
                    <path
                      d="M18 16.08c-.76 0-1.44.3-1.96.77l-7.12-4.21c.05-.25.08-.51.08-.78s-.03-.53-.08-.78l7.12-4.21c.53.48 1.22.77 1.96.77 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .27.03.53.08.78l-7.12 4.21c-.53-.48-1.22-.77-1.96-.77-1.66 0-3 1.34-3 3s1.34 3 3 3c.74 0 1.43-.29 1.96-.77l7.12 4.21c-.05.25-.08.51-.08.78 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>

      <div v-if="shareModalVisible" class="modal-overlay">
        <div class="share-modal-content">
          <div class="share-modal-header">
            <h2>Share This Content</h2>
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

    <div v-if="ratingModalVisible" class="modal-overlay">
      <div class="rating-modal">
        <div class="modal-header">
          <h3>Rate '{{ nameForDb }}'</h3>
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
          
          <!-- Progress tracking -->
          <div v-if="type === 'movie'" class="mpb-section">
            <div class="mpb-section-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              VIEWING PROGRESS
            </div>
            <div class="mpb-row">
              <div class="mpb-circle-wrap">
                <svg class="mpb-svg" viewBox="0 0 120 120">
                  <defs><linearGradient id="pgH" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8AE8FC"/><stop offset="100%" stop-color="#50C8E8"/></linearGradient></defs>
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(138,232,252,0.1)" stroke-width="6"/>
                  <circle cx="60" cy="60" r="52" fill="none" stroke="url(#pgH)" stroke-width="6" stroke-linecap="round" :stroke-dasharray="2 * Math.PI * 52" :stroke-dashoffset="2 * Math.PI * 52 * (1 - progressPercentage / 100)" style="transform:rotate(-90deg);transform-origin:center;transition:stroke-dashoffset .35s ease"/>
                </svg>
                <div class="mpb-pct"><span class="mpb-pct-num">{{ progressPercentage }}</span><span class="mpb-pct-sign">%</span></div>
              </div>
              <div class="mpb-controls">
                <input type="range" class="mpb-slider" min="0" max="100" step="1" v-model.number="progressPercentage" />
                <div v-if="heroItem.runtime" class="mpb-times">
                  <div class="mpb-time"><span class="mpb-time-label">Watched</span><span class="mpb-time-val">{{ progressElapsed }}</span></div>
                  <div class="mpb-time"><span class="mpb-time-label">Remaining</span><span class="mpb-time-val">{{ progressRemaining }}</span></div>
                </div>
                <div v-else class="mpb-times"><span class="mpb-no-dur">Duration not available</span></div>
              </div>
            </div>
          </div>

          <div class="review-section">
            <textarea
              v-model="userReview"
              :placeholder="selectedRating > 0 ? ratingDescriptions[selectedRating - 1] : 'Select a rating first'"
              class="review-textarea"
              maxlength="2000"
            ></textarea>
            <div class="char-count">{{ userReview.length }}/2000</div>
          </div>
          
          <div class="rating-modal-buttons">
            <button 
              v-if="hasUserRating"
              @click="removeRating" 
              class="remove-rating-btn"
            >
              <span style="position:relative; margin:0 auto;">Remove Rating</span>
            </button>
            
            <button 
              @click="saveRatingAndReview" 
              class="save-btn"
            >
              <span style="position:relative; margin:0 auto;">Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>









  </div>
</template>

<script>
import { name, stars, yearStart, yearEnd, cert, backdrop, poster, trailer, id, genres, type, runtime } from '~/mixins/Details';
import { mapItemToDbPayload } from '~/utils/itemMapper';
import Filters from '~/mixins/Filters';
import Modal from '~/components/Modal';
import Loader from '~/components/Loader.vue';
import SundanceBadge from '~/components/festival/SundanceBadge.vue';
import SlamdanceBadge from '~/components/festival/SlamdanceBadge.vue';
import TribecaBadge from '~/components/festival/TribecaBadge.vue';
import BerlinaleBadge from '~/components/festival/BerlinaleBadge.vue';
import RotterdamBadge from '~/components/festival/RotterdamBadge.vue';
import SxswBadge from '~/components/festival/SxswBadge.vue';
import RomfordBadge from '~/components/festival/RomfordBadge.vue';
import BifffBadge from '~/components/festival/BifffBadge.vue';
import BaficiBadge from '~/components/festival/BaficiBadge.vue';
import CuffBadge from '~/components/festival/CuffBadge.vue';
import CannesBadge from '~/components/festival/CannesBadge.vue';
import CannesCriticsChoiceBadge from '~/components/festival/CannesCriticsChoiceBadge.vue';
import CannesQuinzaineBadge from '~/components/festival/CannesQuinzaineBadge.vue';
import CannesAcidBadge from '~/components/festival/CannesAcidBadge.vue';
import KviffBadge from '~/components/festival/KviffBadge.vue';
import FantasiaBadge from '~/components/festival/FantasiaBadge.vue';
import { MANUAL_FESTIVAL_BADGES, MANUAL_OVERVIEWS } from '~/utils/constants';
import { getHeroEnrichment, getNoirEnrichment } from '~/utils/api';
import NoirModal from '~/components/NoirModal.vue';

// Festival membership per tmdb_id, shared across every Hero instance for the
// session. Badges don't change mid-visit, so cycling the homepage carousel
// (or revisiting a title) never refetches.
const FESTIVAL_STATUS_CACHE = new Map();

export default {
  components: {
    Modal,
    Loader,
    SundanceBadge,
    SlamdanceBadge,
    TribecaBadge,
    BerlinaleBadge,
    RotterdamBadge,
    SxswBadge,
    RomfordBadge,
    BifffBadge,
    CannesBadge,
    CannesCriticsChoiceBadge,
    CannesQuinzaineBadge,
    CannesAcidBadge,
    BaficiBadge,
    CuffBadge,
    KviffBadge,
    FantasiaBadge,
    NoirModal,
  },

  mixins: [
    Filters,
    name,
    stars,
    yearStart,
    yearEnd,
    cert,
    poster,
    backdrop,
    trailer,
    id,
    genres,
    type,
    runtime,
  ],

  props: {
    initialItem: {
      type: Object,
      required: true,
    },
    isHomepage: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      isLoading: true,
      isSingle: this.initialItem.id === this.$route.params.id,
      copySuccess: false,
      ratingModalVisible: false,
      isFavorite: false,
      hasAccessToken: false,
      userRatingForDb: '-',
      hasUserRating: false,
      selectedRating: 0,
      hoverRating: 0,
      activeTab: 'rating',
      userReview: '',
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

      nameForDb: null,
      starsForDb: null,
      posterForDb: null,
      yearStartForDb: null,
      yearEndForDb: null,
      idForDb: null,
      genresForDb: null,
      typeForDb: null,
      addedAt: null,

      shareModalVisible: false,
      shareTitle: '',
      

      showAddListMenu: false,
      userLists: [],
      membership: { inWatchlist: false, lists: [] },
      sundanceFilm: null,
      slamdanceFilm: null,
      tribecaFilm: null,
      berlinaleFilm: null,
      rotterdamFilm: null,
      sxswFilm: null,
      romfordFilm: null,
      bifffFilm: null,
      cannesFilm: null,
      cannesCriticsChoiceFilm: null,
      cannesQuinzaineFilm: null,
      cannesAcidFilm: null,
      baficiFilm: null,
      cuffFilm: null,
      kviffFilm: null,
      fantasiaFilm: null,
      isFestivalLoading: false,

      showNoirModal: false,
      isNoirTitle: false,
      currentIndex: 0,
      autoAdvanceEnabled: true,
      autoAdvanceTimer: null,
      autoAdvancePaused: false,
      autoAdvanceStartTime: null,
      autoAdvanceRemainingTime: 20000,
      touchStartX: 0,
      touchEndX: 0,
      lastWheelTime: 0,
      isHomepageContentReady: !this.isHomepage,
      loadingStates: {
        backdrop: true,
        festivalBadge: false,
        
        metadata: true
      },

      // Progress tracking
      progressPercentage: 0,
      trackedEpisodesCount: 0,
      trackedSeasonData: [],  // [{season_number, tracked, total}]
    };
  },

  directives: {
    'click-outside': {
        mounted(el, binding) {
            el.clickOutsideEvent = function (event) {
                if (!(el == event.target || el.contains(event.target))) {
                    binding.value(event);
                }
            };
            document.body.addEventListener('click', el.clickOutsideEvent);
        },
        beforeUnmount(el) {
            document.body.removeEventListener('click', el.clickOutsideEvent);
        }
    }
  },

  computed: {
    MANUAL_OVERVIEWS() { return MANUAL_OVERVIEWS; },
    heroItem() {
      if (this.items && this.items.length > 0) {
        return this.items[this.currentIndex];
      }
      return this.initialItem;
    },
    tursoBackendUrl() {
      return this.$config.public.tursoBackendUrl;
    },
    item() {
      return this.heroItem;
    },
    type() {
      const t = this.heroItem.type || (this.heroItem.title ? 'movie' : 'tv');
      return t === 'movie' ? 'movie' : 'tv';
    },
    favId() {
      return `${this.type}/${this.id}`;
    },
    shareUrl() {
      return `${window.location.origin}/${this.favId}`;
    },
    isInAnyList() {
        return this.isFavorite || (this.membership.lists && this.membership.lists.length > 0);
    },
    activeFestivals() {
      const festivalConfig = [
        { name: 'sundance', film: this.sundanceFilm, component: 'SundanceBadge', link: '/festival/sundance-2026', isSimple: true },
        { name: 'slamdance', film: this.slamdanceFilm, component: 'SlamdanceBadge', link: '/festival/slamdance-2026', isSimple: true },
        { name: 'tribeca', film: this.tribecaFilm, component: 'TribecaBadge', link: '/festival/tribeca-2026', isSimple: true },
        { name: 'berlinale', film: this.berlinaleFilm, component: 'BerlinaleBadge', link: '/festival/berlinale-2026', isSimple: true },
        { name: 'rotterdam', film: this.rotterdamFilm, component: 'RotterdamBadge', link: '/festival/rotterdam-2026', isSimple: true },
        { name: 'sxsw', film: this.sxswFilm, component: 'SxswBadge', link: '/festival/sxsw-2026', isSimple: true },
        { name: 'romford', film: this.romfordFilm, component: 'RomfordBadge', link: '/festival/romford-2026', isSimple: true },
        { name: 'bifff', film: this.bifffFilm, component: 'BifffBadge', link: '/festival/bifff-2026', isSimple: true },
        // Critics' Choice badge takes precedence over regular Cannes badge
        { name: 'cannes-critics-choice', film: this.cannesCriticsChoiceFilm, component: 'CannesCriticsChoiceBadge', link: '/festival/cannes-2026', isSimple: true },
        { name: 'cannes-quinzaine', film: this.cannesQuinzaineFilm && !this.cannesCriticsChoiceFilm ? this.cannesQuinzaineFilm : null, component: 'CannesQuinzaineBadge', link: '/festival/cannes-2026', isSimple: true },
        { name: 'cannes-acid', film: this.cannesAcidFilm && !this.cannesCriticsChoiceFilm && !this.cannesQuinzaineFilm ? this.cannesAcidFilm : null, component: 'CannesAcidBadge', link: '/festival/cannes-2026', isSimple: true },
        { name: 'cannes', film: this.cannesFilm && !this.cannesCriticsChoiceFilm && !this.cannesQuinzaineFilm && !this.cannesAcidFilm ? this.cannesFilm : null, component: 'CannesBadge', link: '/festival/cannes-2026', isSimple: true },
        { name: 'bafici', film: this.baficiFilm, component: 'BaficiBadge', link: '/festival/bafici-2026', isSimple: true },
        { name: 'cuff', film: this.cuffFilm, component: 'CuffBadge', link: '/festival/cuff-2026', isSimple: true },
        { name: 'kviff', film: this.kviffFilm, component: 'KviffBadge', link: '/festival/kviff-2026', isSimple: true },
        { name: 'fantasia', film: this.fantasiaFilm, component: 'FantasiaBadge', link: '/festival/fantasia-2026', isSimple: true },
      ];
      return festivalConfig.filter(f => f.film);
    },
    hasTrackedProgress() {
       return (this.type === 'movie' && this.progressPercentage > 0) || (this.type === 'tv' && this.trackedEpisodesCount > 0);
    },
    trackingInfoText() {
       if (this.type === 'movie') {
          return `Progress: ${this.progressPercentage}%`;
       }
       // TV show — build an informative label
       const seasons = this.trackedSeasonData;
       if (!seasons || seasons.length === 0) {
          return `${this.trackedEpisodesCount} episode${this.trackedEpisodesCount !== 1 ? 's' : ''} tracked`;
       }
       // If only 1 season tracked, show detail for that season
       if (seasons.length === 1) {
          const s = seasons[0];
          if (s.allComplete) {
             return `Season ${s.season_number} completed`;
          }
          return `${s.tracked} of ${s.total || '?'} episodes tracked (S${s.season_number})`;
       }
       // Multiple seasons
       const completedSeasons = seasons.filter(s => s.allComplete);
       if (completedSeasons.length === seasons.length) {
          return `${completedSeasons.length} seasons completed`;
       }
       const seasonLabels = seasons.map(s => `S${s.season_number}: ${s.tracked}`).join(', ');
       return `${this.trackedEpisodesCount} episodes tracked (${seasonLabels})`;
    },
    progressElapsed() {
      const rt = this.heroItem.runtime;
      if (!rt) return '0m';
      return this.fmtMin(rt * this.progressPercentage / 100);
    },
    progressRemaining() {
      const rt = this.heroItem.runtime;
      if (!rt) return '0m';
      return this.fmtMin(rt - (rt * this.progressPercentage / 100));
    },
  },

  created() {
    // Non-reactive: session cache of per-item user state (see loadUserItemState).
    this._userStateCache = new Map();
  },

  async mounted() {
    this.$bus.$on('new-list-created', this.handleNewList);

    const email = localStorage.getItem('email');
    const accessToken = localStorage.getItem('access_token');
    this.userEmail = email ? email.replace(/['"]+/g, '') : '';
    this.hasAccessToken = accessToken !== null;

    this.updateHeroState();
    this.checkNoirStatus();

    this.$bus.$on('favorites-updated', this.handleExternalUserStateChange);
    this.$bus.$on('lists-updated', this.handleExternalUserStateChange);
  },

  watch: {
    heroItem(val) {
      if (val) {
        this.updateHeroState();
        this.checkNoirStatus();
        this.resetAutoAdvance();
      }
    },
    isHomepageContentReady(val) {
      if (val && this.isHomepage) {
        this.startAutoAdvance();
      }
    }
  },

  beforeDestroy() {
    this.$bus.$off('favorites-updated', this.handleExternalUserStateChange);
    this.$bus.$off('lists-updated', this.handleExternalUserStateChange);
    this.$bus.$off('new-list-created', this.handleNewList);
    this.stopAutoAdvance();
  },

  beforeUnmount() {
    this.stopAutoAdvance();
  },

  methods: {
    fmtMin(m) {
      const r = Math.round(m || 0);
      if (r < 0) return '0m';
      if (r < 60) return `${r}m`;
      const h = Math.floor(r / 60);
      const rm = r % 60;
      return rm > 0 ? `${h}h ${rm}m` : `${h}h`;
    },
    async checkNoirStatus() {
      if (this.isHomepage) return;
      const tmdbId = this.heroItem?.id;
      if (!tmdbId) { this.isNoirTitle = false; return; }
      const mediaType = this.type;
      const key = `${tmdbId}-${mediaType}`;
      const [heroMap, noirMap] = await Promise.all([getHeroEnrichment(), getNoirEnrichment()]);
      this.isNoirTitle = heroMap.has(key) || heroMap.has(tmdbId) || noirMap.has(key) || noirMap.has(tmdbId);
    },
    handleTouchStart(e) {
      if (!this.isHomepage || this.items.length <= 1) return;
      this.touchStartX = e.changedTouches[0].screenX;
    },
    handleTouchEnd(e) {
      if (!this.isHomepage || this.items.length <= 1) return;
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    },
    handleWheel(e) {
      if (!this.isHomepage || this.items.length <= 1) return;

      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        // Only hijack horizontal wheel gestures (carousel navigation).
        // Vertical scrolling over the hero must keep scrolling the page.
        e.preventDefault();
        const now = Date.now();
        if (now - this.lastWheelTime < 600) return;
        
        if (Math.abs(e.deltaX) < 20) return;
        
        this.lastWheelTime = now;
        
        if (e.deltaX > 0) {
          this.nextItem();
        } else {
          this.prevItem();
        }
      }
    },
    handleSwipe() {
      const diff = this.touchStartX - this.touchEndX;
      const threshold = 50; 
      
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          this.nextItem();
        } else {
          this.prevItem();
        }
      }
    },
    nextItem() {
      if (this.items.length > 1) {
        this.isLoading = true;
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
      }
    },
    prevItem() {
      if (this.items.length > 1) {
        this.isLoading = true;
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
      }
    },
    startAutoAdvance() {
      if (!this.isHomepage) return;
      if (!this.items || this.items.length <= 1) return;
      if (!this.autoAdvanceEnabled) return;
      if (this.autoAdvancePaused) return;
      if (!this.isHomepageContentReady) return;

      this.stopAutoAdvance();
      this.autoAdvanceStartTime = Date.now();
      this.autoAdvanceTimer = setTimeout(() => {
        this.autoAdvanceRemainingTime = 20000;
        this.nextItem();
      }, this.autoAdvanceRemainingTime);
    },
    stopAutoAdvance() {
      if (this.autoAdvanceTimer) {
        clearTimeout(this.autoAdvanceTimer);
        this.autoAdvanceTimer = null;
      }
    },
    resetAutoAdvance() {
      this.autoAdvanceRemainingTime = 20000;
      this.autoAdvancePaused = false;
      this.startAutoAdvance();
    },
    toggleAutoAdvance() {
      if (this.autoAdvancePaused) {
        // Resume
        this.autoAdvancePaused = false;
        this.startAutoAdvance();
      } else {
        // Pause — calculate remaining time
        if (this.autoAdvanceStartTime) {
          const elapsed = Date.now() - this.autoAdvanceStartTime;
          this.autoAdvanceRemainingTime = Math.max(0, this.autoAdvanceRemainingTime - elapsed);
        }
        this.autoAdvancePaused = true;
        this.stopAutoAdvance();
      }
    },
    handleBackdropClick() {
      if (!this.isHomepage || !this.autoAdvanceEnabled || !this.items || this.items.length <= 1) return;
      this.toggleAutoAdvance();
    },
    async updateHeroState() {
        // Only the very first homepage paint hides the hero behind the
        // unified loader — and only until the backdrop is decoded. Badges,
        // membership and ratings load in the background and pop in when
        // ready (same behavior as the movie/tv info pages, which is why
        // those always felt faster). Once revealed, carousel advances keep
        // the pane visible and just crossfade the backdrop.
        if (this.isHomepage && !this.isHomepageContentReady) {
          this.loadingStates = {
            backdrop: true,
            festivalBadge: false,
            metadata: false
          };
        }

        this.isLoading = true;

        this.posterForDb = this.poster_path;
        this.nameForDb = this.name;
        this.idForDb = this.id;
        this.typeForDb = this.type;
        this.starsForDb = this.stars;
        this.yearStartForDb = this.yearStart;
        this.yearEndForDb = this.yearEnd;

        const currentItem = this.heroItem || this.item;
        this.genresForDb = currentItem.genres ? currentItem.genres.map(genre => genre.name).join(', ') : '';
        this.addedAt = new Date();

        this.shareTitle = "I'd like to share '" + this.nameForDb + "' from Cinemagoria!";
        this.customTitle = "I'd like to share '" + this.nameForDb + "' from Cinemagoria!";
        this.customMessage = 'Synopsis: ' + currentItem.overview + '\n\nExplore streaming options...';

        if (this.hasAccessToken) {
            this.loadUserItemState();
        }

        this.checkFestivalStatus();

        if (!this.backdrop) {
          this.isLoading = false;
        } else {
           this.$nextTick(() => {
            if (this.$refs.backdropRef && this.$refs.backdropRef.complete) this.onBackdropLoaded();
           });
        }

        if (typeof window !== 'undefined') {
            const prevent = localStorage.getItem('prevent_optimization_modal');
            if (prevent === 'true') {
                this.preventOptimizationModal = true;
            }
        }

        setTimeout(() => this.isLoading = false, 2000);

        this.preloadAdjacentBackdrops();

        if (this.isHomepage && !this.isHomepageContentReady) {
          this.checkHomepageContentReady();

          // Failsafe: never hold the loader longer than 2.5s even if the
          // backdrop request stalls.
          setTimeout(() => {
            if (!this.isHomepageContentReady) {
              this.loadingStates.backdrop = false;
              this.loadingStates.festivalBadge = false;
              this.loadingStates.metadata = false;
              this.isHomepageContentReady = true;
            }
          }, 2500);
        }
    },

    // ── Per-item user state (membership / rating / progress) ─────────
    // Fetched in parallel and snapshotted per favId so cycling the hero
    // carousel restores state instantly instead of re-issuing 4+ backend
    // requests every 20 seconds. Any mutation invalidates the cache.
    loadUserItemState() {
        const favId = this.favId;
        const cached = this._userStateCache && this._userStateCache.get(favId);
        if (cached) {
            Object.assign(this, cached);
            return;
        }

        // Reset so the previous item's state never bleeds into this one
        // while the fetches are in flight.
        this.membership = { inWatchlist: false, lists: [] };
        this.isFavorite = false;
        this.userRatingForDb = '-';
        this.hasUserRating = false;
        this.selectedRating = 0;
        this.userReview = '';
        this.progressPercentage = 0;
        this.trackedEpisodesCount = 0;
        this.trackedSeasonData = [];

        Promise.all([
            this.checkMembership(),
            this.loadRatingFromRatingsEndpoint(),
            this.loadProgress()
        ]).then(() => {
            if (this.favId !== favId || !this._userStateCache) return;
            this._userStateCache.set(favId, {
                membership: this.membership,
                isFavorite: this.isFavorite,
                userRatingForDb: this.userRatingForDb,
                hasUserRating: this.hasUserRating,
                selectedRating: this.selectedRating,
                userReview: this.userReview,
                progressPercentage: this.progressPercentage,
                trackedEpisodesCount: this.trackedEpisodesCount,
                trackedSeasonData: this.trackedSeasonData,
            });
        }).catch(() => {});
    },

    invalidateUserState() {
        if (this._userStateCache) this._userStateCache.clear();
    },
    


    onBackdropLoaded() {
      this.isLoading = false;
      if (this.isHomepage) {
        this.loadingStates.backdrop = false;
        this.checkHomepageContentReady();
      }
    },

    preloadAdjacentBackdrops() {
      if (!this.isHomepage || !this.items || this.items.length <= 1) return;
      const apiImg = 'https://image.tmdb.org/t/p';
      const indicesToPreload = [
        (this.currentIndex + 1) % this.items.length,
        (this.currentIndex - 1 + this.items.length) % this.items.length
      ];
      indicesToPreload.forEach(idx => {
        const item = this.items[idx];
        if (item && item.backdrop_path) {
          const img = new Image();
          img.src = item.backdrop_path.startsWith('http')
            ? item.backdrop_path
            : `${apiImg}/original${item.backdrop_path}`;
        }
      });
    },

    async checkMembership() {
      if (!this.userEmail || !this.id) return;
      try {
         const response = await fetch(`${this.tursoBackendUrl}/membership/${encodeURIComponent(this.userEmail)}/${this.typeForDb}/${this.id}`);
         if (response.ok) {
             const data = await response.json();
             this.membership = data;
             this.isFavorite = data.inWatchlist; 
         }
      } catch(e) { console.error(e); }
    },

    async checkFestivalStatus() {
    this.sundanceFilm = null;
    this.slamdanceFilm = null;
    this.tribecaFilm = null;
    this.berlinaleFilm = null;
    this.rotterdamFilm = null;
    this.sxswFilm = null;
    this.romfordFilm = null;
    this.bifffFilm = null;
    this.cannesFilm = null;
    this.cannesCriticsChoiceFilm = null;
    this.cannesQuinzaineFilm = null;
    this.cannesAcidFilm = null;
    this.baficiFilm = null;
    this.cuffFilm = null;
    this.kviffFilm = null;
    this.fantasiaFilm = null;

    if (this.type !== 'movie' && this.type !== 'tv') return;

    const requestedId = this.id;

    try {
        // One request + one indexed Turso query resolves every festival at
        // once (was: 13 sequential /api/festival/{slug}/films round trips
        // with artificial 500ms delays, which kept the homepage hero behind
        // its loader for ~5s on every load and every carousel advance).
        let festivals = FESTIVAL_STATUS_CACHE.get(requestedId);
        if (!festivals) {
            this.isFestivalLoading = true;
            const data = await $fetch(`/api/festival/status?tmdb_id=${requestedId}`, { timeout: 9000 });
            festivals = data?.festivals || {};
            FESTIVAL_STATUS_CACHE.set(requestedId, festivals);
        }

        // The hero may have advanced while the request was in flight —
        // don't paint another item's badges onto the current one.
        if (this.id !== requestedId) return;

        this.sundanceFilm = festivals.sundance || null;
        this.slamdanceFilm = festivals.slamdance || null;
        this.tribecaFilm = festivals.tribeca || null;
        this.berlinaleFilm = festivals.berlinale || null;
        this.rotterdamFilm = festivals.rotterdam || null;
        this.sxswFilm = festivals.sxsw || null;
        this.romfordFilm = festivals.romford || null;
        this.bifffFilm = festivals.bifff || null;
        this.baficiFilm = festivals.bafici || null;
        this.cuffFilm = festivals.cuff || null;
        this.kviffFilm = festivals.kviff || null;
        this.fantasiaFilm = festivals.fantasia || null;

        if (festivals.cannes) {
            const film = festivals.cannes;
            const sectionUp = String(film.section || '').toUpperCase();
            if (sectionUp.includes('CRITICS')) {
                this.cannesCriticsChoiceFilm = film;
            } else if (sectionUp.includes('QUINZAINE') || sectionUp.includes('DIRECTORS') || sectionUp.includes('FORTNIGHT')) {
                this.cannesQuinzaineFilm = film;
            } else if (sectionUp.includes('ACID')) {
                this.cannesAcidFilm = film;
            } else {
                this.cannesFilm = film;
            }
        }

        if (MANUAL_FESTIVAL_BADGES[this.id]) {
            const manualFestivals = MANUAL_FESTIVAL_BADGES[this.id];
            if (manualFestivals.includes('sundance') && !this.sundanceFilm) this.sundanceFilm = { title: this.name };
            if (manualFestivals.includes('slamdance') && !this.slamdanceFilm) this.slamdanceFilm = { title: this.name };
            if (manualFestivals.includes('tribeca') && !this.tribecaFilm) this.tribecaFilm = { title: this.name };
            if (manualFestivals.includes('berlinale') && !this.berlinaleFilm) this.berlinaleFilm = { title: this.name };
            if (manualFestivals.includes('rotterdam') && !this.rotterdamFilm) this.rotterdamFilm = { title: this.name };
            if (manualFestivals.includes('sxsw') && !this.sxswFilm) this.sxswFilm = { title: this.name };
            if (manualFestivals.includes('romford') && !this.romfordFilm) this.romfordFilm = { title: this.name };
            if (manualFestivals.includes('bifff') && !this.bifffFilm) this.bifffFilm = { title: this.name };
            if (manualFestivals.includes('cannes-critics-choice') && !this.cannesCriticsChoiceFilm) this.cannesCriticsChoiceFilm = { title: this.name };
            if (manualFestivals.includes('cannes-quinzaine') && !this.cannesQuinzaineFilm) this.cannesQuinzaineFilm = { title: this.name };
            if (manualFestivals.includes('cannes-acid') && !this.cannesAcidFilm) this.cannesAcidFilm = { title: this.name };
            if (manualFestivals.includes('cannes') && !this.cannesFilm) this.cannesFilm = { title: this.name };
            if (manualFestivals.includes('bafici') && !this.baficiFilm) this.baficiFilm = { title: this.name };
            if (manualFestivals.includes('cuff') && !this.cuffFilm) this.cuffFilm = { title: this.name };
            if (manualFestivals.includes('kviff') && !this.kviffFilm) this.kviffFilm = { title: this.name };
            if (manualFestivals.includes('fantasia') && !this.fantasiaFilm) this.fantasiaFilm = { title: this.name };
        }

    } catch (e) {
        console.error('Error checking festival status:', e);
    } finally {
        this.isFestivalLoading = false;
        if (this.isHomepage) {
            this.loadingStates.festivalBadge = false;
            this.checkHomepageContentReady();
        }
    }
},

    
    checkHomepageContentReady() {
      if (!this.isHomepage) return;
      
      const allReady = !this.loadingStates.backdrop && 
                       !this.loadingStates.festivalBadge && 
                       !this.loadingStates.metadata;
      
      if (allReady) {
        this.isHomepageContentReady = true;
      }
    },

    async fetchUserLists() {
        if (!this.userEmail) return;
        try {
            const response = await fetch(`${this.tursoBackendUrl}/lists/user/${encodeURIComponent(this.userEmail)}`);
            if (response.ok) {
                const data = await response.json();
                this.userLists = data.lists || [];
            }
        } catch(e) { console.error(e); }
    },

    async toggleListMembership(list) {
        this.invalidateUserState();
        const isInList = this.membership.lists.some(l => l.id === list.id);
        const { typeForDb, idForDb, nameForDb, posterForDb, yearStartForDb, yearEndForDb, genresForDb, starsForDb } = this;
        
        try {
            if (isInList) {
                await fetch(`${this.tursoBackendUrl}/lists/${list.id}/items?itemId=${this.id}&itemType=${this.typeForDb}&userEmail=${encodeURIComponent(this.userEmail)}`, { method: 'DELETE' });
            } else {
                const payload = mapItemToDbPayload(this.heroItem);
                await fetch(`${this.tursoBackendUrl}/lists/${list.id}/items`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ item: payload, userEmail: this.userEmail })
                });
            }
            await this.checkMembership();
            this.$bus.$emit('lists-updated');
        } catch(e) {
            console.error(e);
        }
    },

    async handleNewList() {
        this.invalidateUserState();
        await this.checkMembership();
        await this.fetchUserLists();
    },

    handleExternalUserStateChange() {
        this.invalidateUserState();
        this.checkMembership();
    },

    async toggleAddListMenu() {
        this.showAddListMenu = !this.showAddListMenu;
        if (this.showAddListMenu) {
            await this.fetchUserLists();
            await this.checkMembership();
        }
    },
    
    closeAddListMenu() {
        this.showAddListMenu = false;
    },
    
    openCreateListModal() {
        this.showAddListMenu = false;
        this.$bus.$emit('show-create-list-modal', this.heroItem);
    },

    handleTrackingPillClick() {
      if (this.type === 'movie') {
        // Movies: open the rate modal (which includes progress tracking)
        this.hasUserRating ? this.showRatingDetails() : this.openRatingModal();
      } else {
        // TV shows: navigate to the Episodes tab
        this.$bus.$emit('navigate-to-episodes');
      }
    },

    openModal() {
      if (this.trailer && this.trailer[0]) {
        const videoId = this.trailer[0].src.match(/embed\/([^?]+)/)[1];
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
      }
    },
    openShareModal() {
      this.shareModalVisible = true;
    },
    closeShareModal() {
      this.shareModalVisible = false;
    },
    
    openRatingModal() {
      this.ratingModalVisible = true;
      this.loadProgress();
    },
    
    closeRatingModal() {
      this.ratingModalVisible = false;
      this.activeTab = 'rating';
    },
    
    setRating(rating) {
      this.selectedRating = rating;
    },
    
    previewRating(rating) {
      this.hoverRating = rating;
    },
    
    resetPreview() {
      this.hoverRating = 0;
    },
    
    showRatingDetails() {
      if (this.hasUserRating) {
        this.selectedRating = parseInt(this.userRatingForDb);
        this.ratingModalVisible = true;
        this.loadProgress();
        if (this.userReview) {
          this.activeTab = 'review';
        }
      } else {
        this.ratingModalVisible = true;
        this.loadProgress();
        this.activeTab = 'rating';
      }
    },
    
    async saveRatingAndReview() {
      try {
        this.invalidateUserState();
        if (this.type === 'movie' && this.selectedRating > 0) {
          if (this.progressPercentage === 0 || this.progressPercentage >= 80) {
            this.progressPercentage = 100;
          }
        }
        if (this.selectedRating > 0) {
          await this.updateUserRatingAndReview(this.selectedRating, this.userReview);
        }
        await this.saveProgress();
        this.closeRatingModal();
        this.$bus.$emit('rated-items-updated');
      } catch (error) {
        console.error('Error saving rating and review:', error);
        alert('There was an error saving your rating. Please try again.');
      }
    },
    
    async removeRating() {
      try {
        this.invalidateUserState();
        const response = await fetch(
          `${this.tursoBackendUrl}/favorites/rating/${this.userEmail}/${this.typeForDb}/${this.id}`,
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

        this.userRatingForDb = '-';
        this.hasUserRating = false;
        this.selectedRating = 0;
        this.userReview = '';

        this.closeRatingModal();
        this.$bus.$emit('rated-items-updated');
        
        const mediaType = this.type === 'movie' ? 'movie' : 'episode';
        await fetch(`/api/progress/${encodeURIComponent(this.userEmail)}/${mediaType}/${this.id}`, { method: 'DELETE' }).catch(() => {});
        
      } catch (error) {
        console.error('Error removing rating:', error);
        alert('There was an error removing your rating. Please try again.');
      }
    },
        
    async loadRatingFromRatingsEndpoint() {
      if (!this.userEmail) return;
      try {
        const response = await fetch(
          `${this.tursoBackendUrl}/ratings/${encodeURIComponent(this.userEmail)}`
        );
        if (!response.ok) return;

        const data = await response.json(); 
        
        const typeKey = this.type === 'movie' ? 'movies' : 'tv';
        const list = data.favorites_json && data.favorites_json[typeKey] ? data.favorites_json[typeKey] : [];
        
        let found = false;
        for (const itemWrapper of list) {
             const key = Object.keys(itemWrapper)[0]; 
             if (key === this.favId) { 
                 const details = itemWrapper[key].details;
                 this.userRatingForDb = details.userRatingForDb || '-';
                 this.userReview = details.userReview || '';
                 this.hasUserRating = this.userRatingForDb !== '-';
                 this.selectedRating = this.hasUserRating ? parseInt(this.userRatingForDb) : 0;
                 found = true;
                 break;
             }
        }
        
        if (!found) {
           this.userRatingForDb = '-';
           this.hasUserRating = false;
           this.selectedRating = 0;
           this.userReview = '';
        }
      } catch (e) {
        console.error('Error loading rating from ratings endpoint:', e);
      }
    },

    async checkUserRating() {
      try {
        const response = await fetch(`${this.tursoBackendUrl}/favorites/${this.userEmail}`);
        
        if (!response.ok) {
          return;
        }

        const data = await response.json();

        const favoriteType = this.type === 'movie' ? 'movies' : 'tv';
        
        if (data.favorites_json[favoriteType]) {
          data.favorites_json[favoriteType].forEach(item => {
            const itemKey = Object.keys(item)[0];
            if (itemKey === this.favId) {
              if (item[itemKey].details.userRatingForDb) {
                this.userRatingForDb = item[itemKey].details.userRatingForDb;
                this.hasUserRating = this.userRatingForDb !== '-';
                this.selectedRating = this.hasUserRating ? parseInt(this.userRatingForDb) : 0;
              }

              if (item[itemKey].details.userReview) {
                this.userReview = item[itemKey].details.userReview;
              }
            }
          });
        }
      } catch (error) {
        console.error('Error checking user rating:', error);
      }
    },
    
    async updateUserRating(rating) {
      if (!this.userEmail) {
        alert('Please login to rate.');
        return;
      }
      
      try {
        const response = await fetch(
          `${this.tursoBackendUrl}/favorites/rating/${this.userEmail}/${this.typeForDb}/${this.id}`,
          {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
              rating: rating,
              review: this.userReview || '',
              item: mapItemToDbPayload(this.heroItem)
            })
          }
        );

        if (!response.ok) {
          throw new Error('Error updating rating');
        }

        this.userRatingForDb = rating.toString();
        this.hasUserRating = true;
      } catch (error) {
        console.error('Error updating rating:', error);
      }
    },
    
    async updateUserRatingAndReview(rating, review) {
      if (!this.userEmail) {
        alert('Please login to rate and review.');
        return;
      }

      try {
        await this.loadRatingFromRatingsEndpoint();

        const response = await fetch(
          `${this.tursoBackendUrl}/favorites/rating/${this.userEmail}/${this.typeForDb}/${this.id}`,
          {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
              rating, 
              review,
              item: mapItemToDbPayload(this.heroItem)
            })
          }
        );

        if (!response.ok) {
          throw new Error('Error updating rating and review');
        }

        this.userRatingForDb = rating.toString();
        this.hasUserRating = true;

      } catch (error) {
        console.error('Error updating rating and review:', error);
        throw error;
      }
    },

    //  ── Progress tracking persistence ────────────────────────────
    async loadProgress() {
      if (!this.userEmail) return;
      
      try {
        if (this.type === 'movie') {
          const resp = await fetch(`/api/progress/${encodeURIComponent(this.userEmail)}/movie/${this.id}?_t=${Date.now()}`);
          if (resp.ok) {
            const data = await resp.json();
            if (data.found) {
              this.progressPercentage = data.progress_percentage || 0;
            } else {
              this.progressPercentage = 0;
            }
          }
        } else {
          // For TV show, get total tracked episodes for this show
          const resp = await fetch(`/api/progress/${encodeURIComponent(this.userEmail)}?_t=${Date.now()}`);
          if (resp.ok) {
            const rows = await resp.json();
            // The API returns rows[] directly (array)
            const arr = Array.isArray(rows) ? rows : (rows.items || []);
            const eps = arr.filter(i => i.media_type === 'episode' && String(i.tv_id) === String(this.id));
            this.trackedEpisodesCount = eps.length;

            // Build per-season breakdown
            const seasonMap = {};
            for (const ep of eps) {
              const sn = ep.season_number || 0;
              if (!seasonMap[sn]) seasonMap[sn] = { season_number: sn, tracked: 0, complete: 0 };
              seasonMap[sn].tracked++;
              if (Number(ep.progress_percentage) >= 100) seasonMap[sn].complete++;
            }
            // Try to get total episodes per season from the heroItem
            const totalSeasons = this.heroItem?.number_of_seasons || 0;
            const seasonDetails = Object.values(seasonMap).sort((a, b) => a.season_number - b.season_number);
            for (const s of seasonDetails) {
               const seasonObj = (this.heroItem?.seasons || []).find(x => x.season_number === s.season_number);
               s.total = seasonObj ? seasonObj.episode_count : null;
               s.allComplete = s.complete === s.total && s.total > 0;
            }
            this.trackedSeasonData = seasonDetails;
          }
        }
      } catch (e) { /* silent */ }
    },
    async saveProgress() {
      if (!this.userEmail) return;
      const mediaType = this.type === 'movie' ? 'movie' : 'episode';
      const rt = this.heroItem.runtime || 0;
      const elapsed = rt ? Math.round(rt * this.progressPercentage / 100) : 0;
      try {
        await fetch(`/api/progress/${encodeURIComponent(this.userEmail)}/${mediaType}/${this.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ progress_percentage: this.progressPercentage, elapsed_minutes: elapsed, total_duration_minutes: rt })
        });
        window.dispatchEvent(new Event('progress-updated'));
      } catch (e) { /* silent */ }
    },
    //  ─────────────────────────────────────────────────────────────

    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.shareUrl);
        this.copySuccess = true;
        setTimeout(() => {
          this.copySuccess = false;
        }, 2000);
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
    },

    shareTo(platform) {
      const url = this.shareUrl;
      const title = this.customTitle;
      const message = this.customMessage;

      if (platform === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent(title + '. ' + message + ' ' + url)}`);
      } else if (platform === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title + '. ' + message + ' ' + url)}`);
      } else if (platform === 'telegram') {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + '. ' + message)}`);
      } else if (platform === 'email') {
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(message + ' ' + url)}`);
      }
    },

    async checkIfFavorite() {
      try {
        const response = await fetch(`${this.tursoBackendUrl}/favorites/${this.userEmail}`);
        
        if (!response.ok) {
          throw new Error('Error connecting to database: ' + response.statusText);
        }

        const data = await response.json();

        const moviesFetched = [];
        const tvFetched = [];

        if (data.favorites_json.movies) {
          data.favorites_json.movies.forEach(movie => {
            const movieKey = Object.keys(movie)[0];
            moviesFetched.push(movieKey);
          });
        }

        if (data.favorites_json.tv) {
          data.favorites_json.tv.forEach(tvShow => {
            const tvKey = Object.keys(tvShow)[0];
            tvFetched.push(tvKey);
          });
        }

        if (moviesFetched.includes(this.favId) || tvFetched.includes(this.favId)) {
          this.isFavorite = true;
        } else {
          this.isFavorite = false;
        }

      } catch (error) {
        console.error('Error checking if favorite:', error.message);
      }
    },

    async handleToggleFavorite() {
        this.invalidateUserState();
        await this.toggleFavorite();
        await this.checkMembership();
    },

    async toggleFavorite() {
      try {
        if (this.isFavorite) {
          const [itemType, itemId] = this.favId.split('/');
          
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
            throw new Error('Error removing favorite');
          }

          await this.loadRatingFromRatingsEndpoint();
          
          const mediaType = this.type === 'movie' ? 'movie' : 'episode';
          await fetch(`/api/progress/${encodeURIComponent(this.userEmail)}/${mediaType}/${this.id}`, { method: 'DELETE' }).catch(() => {});
          
        } else {
          const response = await fetch(`${this.tursoBackendUrl}/favorites`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
              userEmail: this.userEmail,
              item: {
                nameForDb: this.nameForDb,
                starsForDb: this.starsForDb,
                yearStartForDb: this.yearStartForDb,
                yearEndForDb: this.yearEndForDb,
                posterForDb: this.posterForDb,
                idForDb: this.id,
                genresForDb: this.genresForDb,
                typeForDb: this.typeForDb,
                addedAt: this.addedAt,
                external_ids: this.heroItem.external_ids,
                rating_source: this.heroItem.rating_source || 'tmdb',
                imdb_rating: this.heroItem.imdb_rating,
                imdb_votes: this.heroItem.imdb_votes,
                runtime: this.runtime,
              }
            })
          });

          if (!response.ok) {
            throw new Error('Error adding favorite');
          }
        }

        this.isFavorite = !this.isFavorite;
      } catch (error) {
        console.error('Error toggling favorite:', error.message);
      }
    },


    toggleAddListMenu() {
        if (!this.showAddListMenu) {
            this.fetchUserLists();
        }
        this.showAddListMenu = !this.showAddListMenu;
    },
    
    closeAddListMenu() {
        this.showAddListMenu = false;
    },
    


    async fetchUserLists() {
        if (!this.userEmail) return;
        try {
            const response = await fetch(`${this.tursoBackendUrl}/lists/user/${encodeURIComponent(this.userEmail)}`);
            if (response.ok) {
                const data = await response.json();
                this.userLists = data.lists || [];
            }
        } catch (e) {
            console.error(e);
        }
    },


    async addToList(list) {
         try {
            const item = mapItemToDbPayload(this.item);
             
            const response = await fetch(`${this.tursoBackendUrl}/lists/${list.id}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ item, userEmail: this.userEmail })
            });
            
            if (response.ok) {
                this.closeAddListMenu();
            } else {
                console.error('Failed to add to list');
            }
         } catch(e) {
             console.error(e);
             alert('Error adding to list');
         }
    },

    removeFavorite(favoritesJson, favId) {
      const updatedFavorites = { ...favoritesJson };
      for (const key in updatedFavorites) {
        if (Array.isArray(updatedFavorites[key])) {
          updatedFavorites[key] = updatedFavorites[key].filter(item => {
            if (typeof item === 'object') {
              return Object.keys(item)[0] !== favId;
            } else {
              return item !== favId;
            }
          });
        }
      }
      return updatedFavorites;
    },

    addFavorite(favoritesJson, favId) {
      const { type, id } = this.parseFavId(favId);
      const category = type === 'movie' ? 'movies' : 'tv';

      if (!favoritesJson[category]) {
        favoritesJson[category] = [];
      }

      const fullId = `${type}/${id}`;
      if (!favoritesJson[category].includes(fullId)) {
        favoritesJson[category].push(fullId);

        this.updateFavoritesData(favoritesJson, fullId);
      }

      return favoritesJson;
    },

    updateFavoritesData(favoritesJson, fullId) {
      const { type, id } = this.parseFavId(fullId);
      const category = type === 'movie' ? 'movies' : 'tv';

      if (!favoritesJson[category]) {
        favoritesJson[category] = [];
      }

      const index = favoritesJson[category].findIndex(item => item === fullId);

      const favoriteDetails = {
        nameForDb: this.nameForDb,
        starsForDb: this.starsForDb,
        yearStartForDb: this.yearStartForDb,
        yearEndForDb: this.yearEndForDb,
        posterForDb: this.posterForDb,
        idForDb: this.id,
        genresForDb: this.genresForDb,
        typeForDb: this.typeForDb,
        addedAt: this.addedAt,
        external_ids: this.heroItem.external_ids,
        rating_source: this.heroItem.rating_source || 'tmdb',
        imdb_rating: this.heroItem.imdb_rating,
        imdb_votes: this.heroItem.imdb_votes,
        runtime: this.runtime,
      };

      if (index !== -1) {
        if (!Array.isArray(favoritesJson[category][index])) {
          favoritesJson[category][index] = {
            [fullId]: { details: favoriteDetails }
          };
        } else {
          const existingItem = favoritesJson[category][index].find(item => Object.keys(item)[0] === fullId);
          if (existingItem) {
            existingItem[fullId].details = favoriteDetails;
          } else {
            favoritesJson[category][index].push({
              [fullId]: { details: favoriteDetails }
            });
          }
        }
      } else {
        favoritesJson[category].push({
          [fullId]: { details: favoriteDetails }
        });
      }
    },

    parseFavId(favId) {
      const [type, id] = favId.split('/');
      return { type, id };
    },
  }
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.hero {
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  min-height: 52rem;
  height: auto;
  color: #999;
  background-color: #000;

  @media (max-width: 397px) {
    min-height: 64rem;
    height: auto;
  }


.festivalBadgeContainer {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 1.5rem;
    margin-bottom: 15px;

    @media (max-width: 1023px) {
      gap: 8px;
      margin-bottom: 8px;
    }
}

.festivalLink {
  color: #fff;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #FBD378;
  padding: 0 24px;
  height: 78px;
  border-radius: 8px;
  background: rgba(0,0,0,0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-sizing: border-box;

  &:hover {
    background: rgba(251, 211, 120, 0.15);
    transform: translateY(-2px);
    text-decoration: none;
  }

  @media (max-width: 1023px) {
    height: 45px;
    padding: 0 10px;
    font-size: 0.75rem;
    gap: 6px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
}

.buttonText {
    text-align: left;
    line-height: 1.2;
    font-size: 0.9rem;

    @media (max-width: 1023px) {
      font-size: 0.75rem;
    }
}

  @media (min-width: $breakpoint-xsmall) and (max-width: 767px) {
    min-height: 64rem;
    height: auto;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    min-height: 70rem;
    height: auto;
  }

  @media (min-width: $breakpoint-medium) and (max-width: 1023px) {
    position: relative;
    display: block;
    height: 0;
    padding-bottom: 55%;
  }

  @media (min-width: 1024px) {
    position: relative;
    display: block;
    height: 0;
    padding-bottom: 40%;
  }
}

.heroHomepage {
  border-radius: 15px;
  border: 1px solid transparent;
  background: linear-gradient(#000, #000) padding-box,
              linear-gradient(to right, #1E5164, #8AE8FC) border-box;
  margin-top: 10px;
  touch-action: pan-y;
}

.backdrop {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  overflow: hidden;

  @media (max-width: 639px) {
    min-height: 30rem;
    border-radius: 15px 15px 0 0;
  }

  @media (min-width: 640px) and (max-width: 767px) {
    min-height: 34rem;
    border-radius: 15px 15px 0 0;
  }

  @media (min-width: $breakpoint-medium) {
    position: absolute;
    top: 0;
    right: 0;
    display: block;
    width: 71.1%;
    height: 100%;
    border-radius: 0 15px 15px 0;
  }

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: block;
    content: '';
    background-image: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.1) 100%);

    @media (min-width: $breakpoint-medium) {
      background-image: linear-gradient(to right, #000 0, transparent 50%, transparent 100%);
    }
  }

  > div {
    width: 100%;

    @media (min-width: $breakpoint-medium) {
      display: inline;
    }
  }
}

.play {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  padding: 0;
  margin: 0;
  background: none;
  transform: translate(-50%, -50%);

  @media (min-width: $breakpoint-medium) {
    display: none;
  }
}

.buttonContainer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
  width: 100%;
  position: relative;
  right: 0.5rem;
  
  @media (max-width: #{$breakpoint-small - 1px}) {
    justify-content: flex-start;
    margin-top: 1rem;
    gap: 0.8rem 0.6rem;
    flex-wrap: wrap;
  }
  
  @media (min-width: $breakpoint-small) and (max-width: #{$breakpoint-medium - 1px}) {
    justify-content: flex-start;
    gap: 0.6rem;
    flex-wrap: nowrap;
  }
  
  @media (min-width: $breakpoint-medium) {
    flex-wrap: nowrap;
  }
}

.actionButton {
  border-radius: 1.0rem;
  margin-top: 0;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.2rem;
  line-height: 40px;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: #000;
  border: 1px solid #8BE9FD;
  color: #8BE9FD;
  
  :global(.icon) svg {
    display: block; 
  }

  :global(.icon) svg path {
    stroke: currentColor; 
    transition: stroke 0.3s ease, fill 0.3s ease;
  }
  
  :global(.txt) {
    color: currentColor;
  }
  
  &:hover {
      background: radial-gradient(circle at center, rgba(139, 233, 253, 0.3) 0%, #000 100%);
  }

  &.favoritesFilled {
    :global(.icon) svg path {
      fill: #fff;
      stroke: #fff;
    }
    
    &:hover {
      :global(.icon) svg path {
        fill: #8BE9FD !important;
        stroke: #8BE9FD !important;
      }
      
      :global(.txt) {
        color: #8BE9FD !important;
      }
    }
  }

  &:first-child,
  &:nth-child(3) {
    :global(.icon) svg path {
      stroke: currentColor !important;
    }
    
    &:hover {
      :global(.icon) svg path {
        stroke: currentColor !important;
      }
    }

    @media (max-width: 390px) {
       :global(.txt) {
         display: none;
       }
       :global(.icon) {
         margin: 0 0 0 3px;
       }
       padding: 0;
       width: 36px;
       flex: 0 0 36px;
    }
  }
  
  @media (max-width: #{$breakpoint-small - 1px}) {
    flex: 0 0 auto;
    width: auto;
    max-width: 250px;
    height: 36px;
    line-height: 36px;
    font-size: 1.3rem;
    padding: 0 0.8rem;
  }
  
  @media (min-width: $breakpoint-small) and (max-width: #{$breakpoint-medium - 1px}) {
    height: 38px;
    line-height: 38px;
    font-size: 1.4rem;
  }

  @media (min-width: 1650px) {
    font-size: 0.9vw;
    height: 50px;
    line-height: 50px;
  }
}

@keyframes shiningPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(139, 233, 253, 0.7);
    border-color: #8BE9FD;
  }
  70% {
    box-shadow: 0 0 0 10px rgba(139, 233, 253, 0);
    border-color: #fff;
  }
  100% {
    box-shadow: 0 0 0 0 rgba(139, 233, 253, 0);
    border-color: #8BE9FD;
  }
}

.shiningButton {
  animation: shiningPulse 2s infinite;
  
  &:hover {
    animation: none;
  }
}



.shareButton {
  border-radius: 1.0rem;
  margin-top: 0;
  width: 40px;
  height: 40px;
  min-width: 40px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: #000;
  border: 1px solid #8BE9FD;
  color: #8BE9FD;
  
  &:hover {
      background: radial-gradient(circle at center, rgba(139, 233, 253, 0.3) 0%, #000 100%);
  }
  
  :global(.icon) {
    margin-left: 6px;
  }
  
  @media (max-width: #{$breakpoint-small - 1px}) {
    width: 36px;
    height: 36px;
    min-width: 36px;
  }
  
  @media (min-width: $breakpoint-small) and (max-width: #{$breakpoint-medium - 1px}) {
    width: 38px;
    height: 38px;
    min-width: 38px;
  }
  
  @media (min-width: 1650px) {
    font-size: 0.9vw;
    width: 50px;
    height: 50px;
    min-width: 50px;
  }
}

.image {
  display: inline-block;
  max-width: none;
  height: 100%;

  @media (max-width: #{$breakpoint-medium - 1px}) {
    width: 100%;
    object-fit: cover;
  }
}

.pane {
  padding: 0 1.5rem 1.5rem;

  @media (min-width: $breakpoint-small) {
    padding: 0 4rem 4rem;
  }

  @media (min-width: $breakpoint-medium) {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    width: 55%;
    height: 100%;
    padding: 5rem 4rem;
  }

  @media (min-width: $breakpoint-large) {
    padding-right: 5rem;
    padding-left: 5rem;
  }

  @media (min-width: $breakpoint-xlarge) {
    width: 43%;
  }
}

.name {
  margin: 0 0 1.4rem;
  font-size: 2.8rem;
  line-height: 1.1;
  color: #fff;
  letter-spacing: $letter-spacing;

  @media (max-width: 397px) {
    font-size: 2.4rem;
    line-height: 1.05;
    margin-bottom: 1.2rem;
  }

  @media (min-width: $breakpoint-small) {
    margin-bottom: 1.8rem;
  }

  @media (min-width: $breakpoint-large) {
    font-size: 2.4vw;
  }
}

.nameHomepage {
  font-size: 2.52rem;

  @media (max-width: 397px) {
    font-size: 2.16rem;
  }

  @media (min-width: $breakpoint-large) {
    font-size: 2.16vw;
  }
}

.meta {
  font-size: 1.4rem;
  @media (min-width: 1650px) {
    font-size: 0.9vw;
  }
}



.rating {
  display: flex;
  align-items: center;
  margin-bottom: 1.3rem;

  @media (min-width: $breakpoint-small) {
    margin: 0 1.2rem 0 0;
  }
}

.stars {
  width: 8.5rem;
  height: 1.4rem;
  margin-right: 1rem;
  background-image: url('@/assets/images/stars.png');
  background-repeat: no-repeat;
  background-size: auto 100%;

  @media (min-width: $breakpoint-small) {
    width: 10.3rem;
    height: 1.7rem;
  }

  > div {
    height: 100%;
    background-image: url('@/assets/images/stars-filled.png');
    background-repeat: no-repeat;
    background-size: auto 100%;
  }
}

.info {
  display: flex;
  align-items: center;

  span {
    margin-right: 0.9rem;
  }
}

.autoAdvanceBar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 3px 14px;
  margin: 10px 0 0px 0;
  background: #000;
  pointer-events: none;
}

.autoAdvanceBarTrack {
  flex: 1 1 auto;
  height: 2px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 2px;
  overflow: hidden;
}

.autoAdvanceBarFill {
  height: 100%;
  width: 0;
  background: linear-gradient(to right, #1E5164, #8AE8FC);
  animation: hero-auto-advance 15s linear forwards;
  transform-origin: left center;
}

.autoAdvanceBarFillPaused {
  animation-play-state: paused;
}

.autoAdvanceToggle {
  pointer-events: auto;
  flex: 0 0 auto;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(0, 0, 0, 0.45);
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  opacity: 0.75;
  transition: opacity 0.2s ease, transform 0.2s ease, background 0.2s ease;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
    background: rgba(0, 0, 0, 0.7);
  }
}

@keyframes hero-auto-advance {
  from { width: 0; }
  to { width: 100%; }
}

.desc {
  display: block;
  margin-top: 2.5rem;
  font-size: 1.5rem;
  color: #fff;

  @media (max-width: #{$breakpoint-small - 1px}) {
    display: none;
  }

  @media (min-width: 1650px) {
    font-size: 0.9vw;
  }
}

.share {
  margin-top: 3rem;
  border-radius: 1.0rem;
}

@media (min-width: 2200px) {
  .name {
    font-size: 50px;
  }

  .meta,
  .desc {
    font-size: 0.8vw;
  }

  .button {
    font-size: 0.8vw;
    height: 45px;
    line-height: 45px;
  }

  .shareButton {
    width: 45px;
    height: 45px;
    min-width: 45px;
  }

  .stars {
    width: 9rem;
    height: 1.5rem;
  }
}

.noirBadgeGroup {
    position: absolute;
    top: -0.5rem;
    right: 2rem;
    z-index: 20;

    @media (max-width: 600px) {
        top: -0.55rem;
        right: 1.5rem;
    }
}

.noirBadgeImg {
    display: block;
    text-decoration: none;
    cursor: pointer;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
        transform: scale(1.05);
    }
}

.noirBadgeImgEl {
    width: 88px;
    height: 88px;
    border-radius: 14px;
    object-fit: cover;
    transition: filter 0.4s ease;

    @media (max-width: 768px) {
        width: 96px;
        height: 96px;
    }

    @media (max-width: 600px) {
        width: 72px;
        height: 72px;
    }

    @media (max-width: 400px) {
        width: 62px;
        height: 62px;
    }
}

.hoverableName {
    transition: color 0.3s ease;
    cursor: pointer;
    
    a {
         transition: color 0.3s ease;
         cursor: pointer;
    }

    &:hover, a:hover {
        color: #8BE9FD;
    }
}

.trackInfoPill {
  display: inline-flex;
  align-items: center;
  margin-top: 1.8rem;
  padding: 8px 16px;
  background: rgba(138, 232, 252, 0.08);
  border: 1px solid rgba(138, 232, 252, 0.25);
  border-radius: 20px;
  color: #8AE8FC;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  letter-spacing: 0.02em;

  &:hover {
    background: rgba(138, 232, 252, 0.18);
    border-color: rgba(138, 232, 252, 0.5);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(138, 232, 252, 0.15);
  }

  svg {
    flex-shrink: 0;
  }

  @media (max-width: #{$breakpoint-small - 1px}) {
    font-size: 1.15rem;
    padding: 6px 12px;
    margin-top: 1.2rem;
  }

  @media (min-width: 1650px) {
    font-size: 0.85vw;
  }
}
</style>

<style>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 4, 6, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 20px;
}

.share-modal-content {
  position: relative;
  background: rgba(3, 4, 6, 0.85);
  background-image:
    radial-gradient(circle at 15% 20%, rgba(31, 84, 103, 0.18), transparent 35%),
    radial-gradient(circle at 85% 80%, rgba(139, 233, 253, 0.08), transparent 30%);
  border-radius: 20px;
  padding: 0;
  width: 100%;
  max-width: 540px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(31, 84, 103, 0.5),
    inset 0 0 24px rgba(139, 233, 253, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  animation: shareFloatIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  display: block;
}

.share-modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #8BE9FD, #1F5467, transparent);
  opacity: 0.8;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  pointer-events: none;
}

.share-modal-header {
  display: block;
  padding: 26px 28px 6px;
  border-bottom: none;
}

.share-modal-header h2 {
  font-size: 24px;
  font-weight: 800;
  color: #fff;
  margin: 0;
  letter-spacing: -0.5px;
  text-shadow: 0 0 20px rgba(139, 233, 253, 0.25);
}

.close-button {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #a0aab2;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;
  margin: 0;
  z-index: 2;
}

.close-button:hover {
  background-color: rgba(255, 95, 95, 0.1);
  border-color: rgba(255, 95, 95, 0.3);
  color: #ff7e7e;
}

.share-url-container,
.share-field-container,
.share-buttons-container {
  padding: 12px 28px;
  border-bottom: none;
}

.share-buttons-container {
  padding-bottom: 24px;
}

.share-label {
  display: block;
  color: #e0e6ed;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: 0.2px;
}

.share-url-field {
  display: flex;
  align-items: stretch;
  gap: 8px;
  background: transparent;
  border: none;
  border-radius: 0;
  overflow: visible;
}

.share-url-input {
  flex: 1;
  min-width: 0;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(139, 233, 253, 0.2);
  border-radius: 10px;
  color: #8BE9FD;
  font-family: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
  font-size: 13px;
  padding: 11px 14px;
  outline: none;
  transition: all 0.2s ease;
  height: auto;
  box-sizing: border-box;
}

.share-url-input:focus {
  border-color: rgba(139, 233, 253, 0.6);
  box-shadow: 0 0 0 3px rgba(139, 233, 253, 0.12);
  background: rgba(0, 0, 0, 0.4);
}

.copy-button-container {
  position: relative;
  display: flex;
  align-items: stretch;
}

.copy-button {
  flex-shrink: 0;
  background: rgba(139, 233, 253, 0.08);
  border: 1px solid rgba(139, 233, 253, 0.35);
  color: #8BE9FD;
  border-radius: 10px;
  padding: 0 14px;
  width: auto;
  height: auto;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.copy-button:hover {
  background: rgba(139, 233, 253, 0.15);
  border-color: #8BE9FD;
  color: #8BE9FD;
}

.copy-success {
  position: absolute;
  right: 56px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(76, 217, 100, 0.12);
  border: 1px solid rgba(76, 217, 100, 0.55);
  color: #6ee07d;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  animation: fadeInOut 2s ease;
  white-space: nowrap;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(-50%) scale(0.9); }
  15% { opacity: 1; transform: translateY(-50%) scale(1); }
  85% { opacity: 1; transform: translateY(-50%) scale(1); }
  100% { opacity: 0; transform: translateY(-50%) scale(0.9); }
}

@keyframes fadeInOutMobile {
  0% { opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { opacity: 0; }
}

.share-input,
.share-textarea {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(139, 233, 253, 0.2);
  border-radius: 10px;
  color: #fff;
  padding: 11px 14px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
  font-family: inherit;
}

.share-input:focus,
.share-textarea:focus {
  border-color: rgba(139, 233, 253, 0.6);
  box-shadow: 0 0 0 3px rgba(139, 233, 253, 0.12);
  background: rgba(0, 0, 0, 0.4);
}

.share-textarea {
  min-height: 90px;
  height: auto;
  resize: vertical;
  line-height: 1.5;
}

.share-buttons {
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-wrap: wrap;
}

.share-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(139, 233, 253, 0.18);
  color: #e0e6ed;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.share-icon-button:hover {
  color: #8BE9FD;
  background: rgba(139, 233, 253, 0.1);
  border-color: #8BE9FD;
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(139, 233, 253, 0.18);
}

@keyframes shareFloatIn {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@media screen and (max-width: 480px) {
  .share-modal-content {
    max-width: 100%;
    border-radius: 16px;
  }

  .share-modal-header {
    padding: 22px 20px 4px;
  }

  .share-modal-header h2 {
    font-size: 20px;
  }

  .share-url-container,
  .share-field-container,
  .share-buttons-container {
    padding: 10px 20px;
  }

  .share-buttons-container {
    padding-bottom: 22px;
  }

  .share-buttons {
    gap: 8px;
  }

  .share-icon-button {
    width: 42px;
    height: 42px;
    border-radius: 11px;
  }

  .share-url-input,
  .share-input,
  .share-textarea {
    font-size: 13px;
  }

  .copy-success {
    right: auto;
    top: -34px;
    transform: none;
    animation: fadeInOutMobile 2s ease;
  }
}

.rating-modal {
  width: 100%;
  max-width: 400px;
  background: linear-gradient(135deg, rgba(6, 47, 64, 0.98) 0%, rgba(10, 30, 40, 0.99) 100%);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 28' width='56' height='28'%3E%3Cpath fill='%237ed2e3' fill-opacity='0.1' d='M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0zm-5.43 2.71c1.13-.72 2.3-1.37 3.54-1.93a19.98 19.98 0 0 0-32.76 0c1.23.56 2.41 1.2 3.54 1.93a15.98 15.98 0 0 1 25.68 0zm-4.67 3.78c.94-.95 1.96-1.83 3.03-2.63a13.98 13.98 0 0 0-22.4 0c1.07.8 2.09 1.68 3.03 2.63a9.99 9.99 0 0 1 16.34 0z'%3E%3C/path%3E%3C/svg%3E");
  border: 1px solid rgba(127, 219, 241, 0.3);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 40px 0 rgba(31, 104, 135, 0.6);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
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
  height: 160px;
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
  background: rgba(139, 233, 253, 0.12);
  color: #8BE9FD;
  border: 1px solid rgba(139, 233, 253, 0.35);
  font-size: 1.3rem;
  font-weight: 600;
  padding: 0.8rem 0;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  width: 120px;
  text-align: center;
}

.save-btn:hover {
  background: rgba(139, 233, 253, 0.22);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 233, 253, 0.2);
}

.save-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.rating-modal-buttons {
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: center;
}

.save-btn {
  flex: 1;
}

.remove-rating-btn {
  background: rgba(255, 107, 107, 0.1);
  color: #FF6B6B;
  border: 1px solid rgba(255, 107, 107, 0.35);
  font-size: 1.3rem;
  font-weight: 600;
  padding: 0.8rem 0;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  flex: 1;
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

.optimization-modal {
  width: 100%;
  max-width: 500px;
  background: linear-gradient(to bottom right, #092739, #061720);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}












</style>

<style scoped>
.hero-loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.307);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hide-on-mobile-homepage {
  @media (max-width: 1023px) {
    display: none;
  }
}

.mobile-homepage-loader {
  display: none;
  
  @media (max-width: 1023px) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.307);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.unified-homepage-loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.4s ease;
  border-radius: 15px;
}

.add-list-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 10px;
  border: 1px solid #8AE8FC;
  background: #000000;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  border-radius: 8px;
  width: 220px;
  z-index: 100;
  overflow: hidden;
  text-align: left; 
}

.menu-header {
  padding: 10px 15px;
  font-size: 1.2rem;
  font-weight: 600;
  color: #8F989E;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.menu-option {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 15px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.4rem;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;
}

.menu-option:hover {
  background: rgba(255,255,255,0.05);
}

.list-scroll-area {
  max-height: 240px;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(139, 233, 253, 0.3);
    border-radius: 2px;
  }
}

.checkbox {
  width: 20px;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

.list-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.divider {
    height: 1px;
    background: rgba(255,255,255,0.1);
    margin: 5px 0;
}

.create-new {
    color: #8BE9FD;
    font-weight: 500;
}

.plus {
    margin-right: 10px;
    font-weight: bold;
    font-size: 1.6rem;
}

@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.upcomingBadge span {
  display: inline-block;
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; 
}

.actionButton {
   animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
   transform-origin: center center;
   backface-visibility: hidden;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.no-transition * {
  transition: none !important;
}

.nav-arrows {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    z-index: 20;
    pointer-events: none;
    left: 0;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    
    @media (min-width: 1025px) {
        justify-content: flex-end;
    }
}

.arrow-nav {
    background: rgba(0,0,0,0.3);
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.3s, opacity 0.3s, transform 0.2s;
    pointer-events: auto;
    
    @media (min-width: 768px) {
        width: 60px;
        height: 60px;
    }

    @media (min-width: 1200px) {
        width: 80px;
        height: 80px;
        background: rgba(0,0,0,0.2); 
    }
}

.arrow-nav svg {
    width: 24px;
    height: 24px;
    
    @media (min-width: 768px) {
        width: 32px;
        height: 32px;
    }
    
    @media (min-width: 1200px) {
        width: 40px;
        height: 40px;
    }
}

.arrow-nav:hover {
    background: rgba(0,0,0,0.6);
    transform: scale(1.05);
}

.arrow-nav.left {
    @media (min-width: 1025px) {
        display: none;
    }
}


/* ── Progress tracking in modal ──────────────────────────── */
.mpb-section { width:100%; background:rgba(0,0,0,0.15); border:1px solid rgba(138,232,252,0.1); border-radius:10px; padding:14px 16px; }
.mpb-section-label { display:flex; align-items:center; gap:6px; font-size:1.05rem; font-weight:700; letter-spacing:0.08em; color:rgba(255,255,255,0.55); text-transform:uppercase; margin-bottom:12px; }
.mpb-row { display:flex; align-items:center; gap:16px; }
.mpb-circle-wrap { position:relative; width:80px; height:80px; flex-shrink:0; }
.mpb-svg { width:100%; height:100%; }
.mpb-pct { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); text-align:center; line-height:1; }
.mpb-pct-num { font-size:1.8rem; font-weight:700; color:#fff; }
.mpb-pct-sign { font-size:1rem; color:rgba(138,232,252,0.8); font-weight:600; }
.mpb-controls { flex:1; min-width:0; }
.mpb-slider { -webkit-appearance:none; appearance:none; width:100%; height:5px; border-radius:3px; background:rgba(138,232,252,0.12); outline:none; cursor:pointer; margin-bottom:10px; }
.mpb-slider::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:#8AE8FC; border:2px solid rgba(10,30,38,0.9); cursor:pointer; box-shadow:0 0 6px rgba(138,232,252,0.4); }
.mpb-slider::-moz-range-thumb { width:16px; height:16px; border-radius:50%; background:#8AE8FC; border:2px solid rgba(10,30,38,0.9); cursor:pointer; }
.mpb-times { display:flex; justify-content:space-between; }
.mpb-time { display:flex; flex-direction:column; gap:1px; }
.mpb-time-label { font-size:1rem; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.05em; font-weight:600; }
.mpb-time-val { font-size:1.3rem; color:#fff; font-weight:600; }
.mpb-no-dur { font-size:1.1rem; color:rgba(255,255,255,0.3); font-style:italic; }
</style>

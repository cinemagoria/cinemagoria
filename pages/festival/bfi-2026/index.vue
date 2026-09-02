<template>
  <main class="main">
    <div class="container header-container">
      <div class="festival-hero">
        <nuxt-link to="/festival" class="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            All Festivals
        </nuxt-link>
        <div v-if="!backdropLoaded" class="backdrop-loader"><Loader :size="50" /></div>
        <a href="https://whatson.bfi.org.uk/lff/Online/default.asp" target="_blank" class="hero-backdrop">
            <img
              ref="backdropImgRef"
              src="/festivals/bfi/bfi_backdrop_2026_en.webp"
              alt="BFI London Film Festival 2026 Backdrop"
              :style="{ opacity: backdropLoaded ? 1 : 0, transition: 'opacity 0.4s ease' }"
              @load="backdropLoaded = true"
              @error="backdropLoaded = true"
            />
            <div class="hero-overlay"></div>
        </a>
      </div><div class="switcher-container">


        <div class="segmented-control">
            <input type="radio" id="tab-info" value="info" v-model="activeTab">
            <label for="tab-info" @click="activeTab = 'info'">Info</label>

            <input type="radio" id="tab-films" value="films" v-model="activeTab">
            <label for="tab-films" @click="activeTab = 'films'">Catalog</label>

            <input type="radio" id="tab-schedule" value="schedule" v-model="activeTab">
            <label for="tab-schedule" @click="activeTab = 'schedule'">Schedule</label>

            <div class="glider" :class="activeTab"></div>
        </div>
      </div>
      <div class="disclaimer-bar disclaimer-bar--top" style="max-width: 1200px; width: 100%; margin: 6px auto 0;">
        <FestivalDataDisclaimer />
      </div>


      <div v-if="awardsLoading" class="winners-loader">
        <Loader />
      </div>
      <WinnersCarousel
        v-else-if="awards.length > 0 && activeTab !== 'info'"
        :awards="awards"
        :year="2026"
      />


    </div>

    <div class="container">
      <div v-if="loading" class="loader-container">
        <Loader />
      </div>

      <div v-else>
        <div v-if="activeTab === 'films'" class="selection">
          <div v-if="catalogTotal" class="catalog-total">
            <span class="catalog-total__chip">
              <strong>{{ catalogTotal }}</strong> {{ catalogTotal === 1 ? 'title' : 'titles' }}
              <span class="catalog-total__sep" aria-hidden="true">·</span>
              {{ catalogSectionCount }} {{ catalogSectionCount === 1 ? 'section' : 'sections' }}
            </span>
          </div>
          <div v-if="orderedCategories.length === 0" class="rollout-banner">
            <div class="rollout-banner__icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div class="rollout-banner__copy">
              <h3>Lineup updates in progress</h3>
              <p>This festival lineup is currently being updated. New films, sections, and official selections will be added progressively as they are announced and verified.</p>
            </div>
          </div>
          <div v-else class="selection-layout">
            <aside class="selection-nav" aria-label="Jump to section">
              <template v-if="officialNav.length">
                <div class="nav-group-header">
                  <div class="nav-group-label">Catalog</div>
                  <span v-if="catalogTotal" class="catalog-total__chip catalog-total__chip--nav">
                    <strong>{{ catalogTotal }}</strong> {{ catalogTotal === 1 ? 'title' : 'titles' }}
                    <span class="catalog-total__sep" aria-hidden="true">·</span>
                    {{ catalogSectionCount }} {{ catalogSectionCount === 1 ? 'section' : 'sections' }}
                  </span>
                </div>
                <button
                  v-for="sec in officialNav"
                  :key="sec.key"
                  class="nav-item"
                  :class="{ active: activeSection === sec.key }"
                  @click="scrollToSection(sec.key)"
                >
                  <span class="nav-item-label">{{ sec.label }}</span>
                  <span class="nav-item-count">{{ sec.count }}</span>
                </button>
              </template>
            </aside>

            <div ref="selectionContentRef" class="selection-content">
              <section
                v-for="sec in selectionSections"
                :key="sec.key"
                :data-key="sec.key"
                class="sel-section"
              >
                <div class="sel-section-header" @click="onSectionHeaderClick(sec.key)">
                  <h2 class="sel-section-title">{{ sec.label }}</h2>
                  <div class="sel-section-meta">
                    <span class="sel-section-count">{{ sec.count }} {{ sec.count === 1 ? 'film' : 'films' }}</span>
                    <button v-if="isMobile" class="expand-btn" :aria-label="isSectionOpen(sec.key) ? 'Collapse' : 'Expand'">
                      <svg v-if="isSectionOpen(sec.key)" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-chevrons-down-up-icon lucide-list-chevrons-down-up"><path d="M3 5h8"/><path d="M3 12h8"/><path d="M3 19h8"/><path d="m15 5 3 3 3-3"/><path d="m15 19 3-3 3 3"/></svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-collapse-icon lucide-list-collapse"><path d="M10 5h11"/><path d="M10 12h11"/><path d="M10 19h11"/><path d="m3 10 3-3-3-3"/><path d="m3 20 3-3-3-3"/></svg>
                    </button>
                  </div>
                </div>
                <transition name="slide">
                  <div v-show="!isMobile || isSectionOpen(sec.key)" class="sel-section-body">
                    <div class="listing__items">
                      <BfiCard
                        v-for="item in sec.films"
                        :key="`${sec.key}-${item.id}`"
                        :item="item"
                      />
                    </div>
                  </div>
                </transition>
              </section>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'schedule'" class="schedule-container">
          <!-- Initial rollout banner: schedule pending official publication -->
          <div v-if="schedule.length === 0" class="rollout-banner">
            <div class="rollout-banner__icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div class="rollout-banner__copy">
              <h3>Schedule pending</h3>
              <p>Official screening schedules have not yet been published by the festival. Screening information will appear here as soon as it becomes available.</p>
            </div>
          </div>

          <div v-if="schedule.length > 0" class="schedule-toolbar" :class="{ 'search-active': isScheduleSearchActive }">
            <div class="schedule-toolbar-info">
              <span class="schedule-count" v-if="!loading">
                <template v-if="scheduleSearchActiveQuery">
                  {{ filteredSchedule.length }} {{ filteredSchedule.length === 1 ? 'result' : 'results' }}
                </template>
                <template v-else>
                  {{ schedule.length }} {{ schedule.length === 1 ? 'screening' : 'screenings' }}
                </template>
              </span>
            </div>
            <div class="search-wrapper" :class="{ 'active': isScheduleSearchActive }">
              <button class="search-toggle-btn" @click="toggleScheduleSearch" :class="{ 'active': isScheduleSearchActive }" aria-label="Search schedule">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </button>
              <div class="search-input-container" :class="{ 'show': isScheduleSearchActive }">
                <input
                  ref="scheduleSearchInput"
                  type="text"
                  class="search-input"
                  placeholder="Search films or directors…"
                  v-model="scheduleSearch"
                  @keydown.esc="closeScheduleSearch"
                >
                <button class="clear-search-btn" @click="clearScheduleSearch" v-if="scheduleSearch" aria-label="Clear search">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div v-if="scheduleSearchActiveQuery && filteredSchedule.length === 0" class="schedule-empty">
            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.6; margin-bottom: 12px;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <p>No screenings match "<strong>{{ scheduleSearch }}</strong>"</p>
          </div>

          <div v-if="scheduleDays.length" class="schedule-layout">
            <aside class="schedule-nav" aria-label="Jump to day">
              <div class="nav-group-label">Days</div>
              <button
                v-for="day in scheduleDays"
                :key="day.date"
                class="nav-item"
                :class="{ active: activeDay === day.date }"
                @click="scrollToDay(day.date)"
              >
                <span class="nav-item-label">{{ day.label }}</span>
                <span class="nav-item-count">{{ day.count }}</span>
              </button>
            </aside>

            <div ref="scheduleContentRef" class="schedule-content">
              <div v-for="(dayScreenings, date) in groupedScreenings" :key="date" :data-day="date" class="schedule-day">
            <div class="day-header" @click="onDayHeaderClick(date)">
                <h2>{{ formatDate(date) }}</h2>
                <div v-if="isMobile" class="chevron" :class="{ 'closed': !isOpen(date) }">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                </div>
            </div>

            <transition name="slide">
                <div v-show="!isMobile || isOpen(date)" class="screenings-list">
                  <div v-for="screening in dayScreenings" :key="screening.id" class="screening-card">
                     <div class="time-block">
                        <span class="time">{{ formatTime(screening.start_time, screening.timezone) }}</span>
                        <span class="timezone">{{ screening.timezone }}</span>
                     </div>

                      <div class="film-info">
                         <component
                            :is="screening.film.source_url ? 'a' : 'span'"
                            :href="screening.film.source_url || ''"
                            :target="screening.film.source_url ? '_blank' : ''"
                            class="film-title"
                            :class="{'no-link': !screening.film.source_url}"
                         >
                            {{ screening.film.title }}
                         </component>
                         <div class="film-meta">
                             <span v-if="screening.film.director">Directed by {{ screening.film.director }}</span>
                             <span v-if="screening.film.director && screening.film.runtime"> • </span>
                             <span v-if="screening.film.runtime">{{ screening.film.runtime }} min</span>
                         </div>
                         <div v-if="screening.venue" class="venue-info">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
                            {{ screening.venue }}
                         </div>
                         <div class="tags">
                             <span v-if="screening.is_in_person" class="tag in-person">In Person</span>
                             <span v-if="screening.is_online" class="tag online">Online</span>
                             <span v-if="screening.is_sold_out" class="tag sold-out">Sold Out</span>
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
<!-- Slide 0: General Information -->
                  <template v-if="infoSlide === 0">
                    <div class="carousel-card-header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      <h3>General Information</h3>
                    </div>
                    <div class="youtube-embed">
                      <iframe src="https://www.youtube.com/embed/yE0xGvfOuuQ" title="BFI London Film Festival 2026" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                    <p class="carousel-desc"><strong>Edition:</strong> 70th BFI London Film Festival</p>
                    <p class="carousel-desc"><strong>Dates:</strong> October 7 – 18, 2026</p>
                    <p class="carousel-desc"><strong>Location:</strong> London, United Kingdom</p>
                    <p class="carousel-desc"><strong>Website:</strong> <a href="https://whatson.bfi.org.uk/lff/Online/default.asp" target="_blank" class="accent-link">whatson.bfi.org.uk</a></p>
                    <p class="carousel-desc">The UK's largest public film event, run by the British Film Institute and centred on BFI Southbank. Its programme is classified twice over: a set of competitive strands and gala presentations on one axis, and a set of thematic strands — Love, Debate, Laugh, Dare, Thrill, Cult, Journey, Create — on the other, so a single title routinely belongs to several at once. Alongside the features it runs one of the circuit's largest short-film and artists' moving-image selections.</p>
                  </template>

                  <!-- Slide 1: Access & Tickets -->
                  <template v-if="infoSlide === 1">
                    <div class="carousel-card-header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                      <h3>Access &amp; Tickets</h3>
                    </div>
                    <ul class="price-list">
                      <li><span class="price-label">Standard ticket, from</span><span class="price-value">£10</span></li>
                      <li><span class="price-label">Booking fee per ticket</span><span class="price-value">£1</span></li>
                      <li><span class="price-label">25 &amp; Under, any screening</span><span class="price-value">£6</span></li>
                      <li><span class="price-label">Annual membership</span><span class="price-value">£44</span></li>
                    </ul>
                    <p class="carousel-desc"><strong>25 &amp; Under:</strong> registration is free and brings every festival ticket down to £6, galas included.</p>
                    <p class="carousel-desc"><strong>Booking:</strong> members open a week ahead of the general sale and pay no booking fee.</p>
                    <p class="carousel-desc"><strong>Audience Awards:</strong> voting runs from the first day of the festival.</p>
                  </template>

                  <!-- Slide 2: Venues -->
                  <template v-if="infoSlide === 2">
                    <div class="carousel-card-header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
                      <h3>Venues</h3>
                    </div>
                    <div class="venue-list">
                      <div class="venue-item"><strong>BFI Southbank</strong><span>Screens NFT1 – NFT4 · festival headquarters</span></div>
                      <div class="venue-item"><strong>Southbank Centre</strong><span>Royal Festival Hall · galas</span></div>
                      <div class="venue-item"><strong>BFI IMAX</strong><span>Waterloo</span></div>
                      <div class="venue-item"><strong>Vue West End</strong><span>EPIC 1 &amp; 2 · Leicester Square</span></div>
                      <div class="venue-item"><strong>Curzon Soho</strong><span>Screens 1 – 3</span></div>
                      <div class="venue-item"><strong>Prince Charles Cinema</strong><span>Downstairs Screen</span></div>
                      <div class="venue-item"><strong>ICA</strong><span>Screen 1 · The Mall</span></div>
                    </div>
                    <p class="carousel-desc">Thirteen screens across seven sites. The Schedule tab lists every showtime by day, with its exact screen.</p>
                  </template>

                  <!-- Slide 3: Sections -->
                  <template v-if="infoSlide === 3">
                    <div class="carousel-card-header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                      <h3>What each section means</h3>
                    </div>
                    <div class="section-glossary">
                      <div class="section-glossary-item"><strong>Galas</strong><span>The headline presentations, including the opening and closing nights.</span></div>
                      <div class="section-glossary-item"><strong>Special Presentations</strong><span>One-off events, restorations and live performances outside the competitions.</span></div>
                      <div class="section-glossary-item"><strong>Official Competition</strong><span>The main competitive strand, judged for the festival's top award.</span></div>
                      <div class="section-glossary-item"><strong>First Feature Competition</strong><span>Debut features competing for the Sutherland Award.</span></div>
                      <div class="section-glossary-item"><strong>Documentary Competition</strong><span>Non-fiction features in competition.</span></div>
                      <div class="section-glossary-item"><strong>Short Film Competition</strong><span>Shorts nominated for the festival's Short Film Award.</span></div>
                      <div class="section-glossary-item"><strong>Love</strong><span>Romance and intimacy, in all its glory.</span></div>
                      <div class="section-glossary-item"><strong>Debate</strong><span>Stories that spark conversations.</span></div>
                      <div class="section-glossary-item"><strong>Laugh</strong><span>From riotous romcoms to skewering satires.</span></div>
                      <div class="section-glossary-item"><strong>Dare</strong><span>Work that pushes formal and political boundaries.</span></div>
                      <div class="section-glossary-item"><strong>Thrill</strong><span>Genre cinema, from the wildest ride to the slowest burn.</span></div>
                      <div class="section-glossary-item"><strong>Cult</strong><span>The mind-altering and unclassifiable, plus fantasy, sci-fi and horror.</span></div>
                      <div class="section-glossary-item"><strong>Journey</strong><span>Stories that shift our perspectives.</span></div>
                      <div class="section-glossary-item"><strong>Create</strong><span>The electricity of the creative process.</span></div>
                      <div class="section-glossary-item"><strong>Experimenta</strong><span>Artists and the moving image, features and curated shorts alike.</span></div>
                      <div class="section-glossary-item"><strong>Short Film Programmes</strong><span>Curated groupings of shorts, each screened together as one session.</span></div>
                      <div class="section-glossary-item"><strong>Family</strong><span>Films for the young, and the young at heart.</span></div>
                      <div class="section-glossary-item"><strong>Archive</strong><span>Restorations and rediscoveries from the history of cinema.</span></div>
                      <div class="section-glossary-item"><strong>Expanded</strong><span>XR, immersive installations and games.</span></div>
                    </div>
                  </template>
                </div>
              </transition>
            </div>

            <button class="carousel-arrow right" @click="nextSlide" aria-label="Next">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

          <div class="carousel-dots">
            <button v-for="i in 4" :key="i" class="dot" :class="{ active: infoSlide === i - 1 }" @click="goToSlide(i - 1)" :aria-label="`Slide ${i}`"></button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import Loader from '~/components/Loader.vue';
import WinnersCarousel from '~/components/festival/WinnersCarousel.vue';
import FestivalDataDisclaimer from '~/components/FestivalDataDisclaimer.vue';
import BfiCard from '~/components/BfiCard.vue';

const activeTab = ref('films');
const scheduleSearch = ref('');
const isScheduleSearchActive = ref(false);
const scheduleSearchInput = ref(null);

const normalizeText = (str) => {
    if (!str) return '';
    return String(str).toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
};

const scheduleSearchActiveQuery = computed(() => {
    if (!isScheduleSearchActive.value) return '';
    return scheduleSearch.value.trim();
});

const toggleScheduleSearch = () => {
    isScheduleSearchActive.value = !isScheduleSearchActive.value;
    if (!isScheduleSearchActive.value) {
        scheduleSearch.value = '';
    } else {
        nextTick(() => scheduleSearchInput.value?.focus());
    }
};

const closeScheduleSearch = () => {
    isScheduleSearchActive.value = false;
    scheduleSearch.value = '';
};

const clearScheduleSearch = () => {
    scheduleSearch.value = '';
    nextTick(() => scheduleSearchInput.value?.focus());
};
const infoSlide = ref(0);
const slideDirection = ref('carousel-next');
const prevSlide = () => { slideDirection.value = 'carousel-prev'; infoSlide.value = (infoSlide.value - 1 + 4) % 4; };
const nextSlide = () => { slideDirection.value = 'carousel-next'; infoSlide.value = (infoSlide.value + 1) % 4; };
const goToSlide = (i) => { slideDirection.value = i > infoSlide.value ? 'carousel-next' : 'carousel-prev'; infoSlide.value = i; };
const loading = ref(true);
const backdropLoaded = ref(false);
const backdropImgRef = ref(null);
// Hydration race: if the backdrop <img> already finished loading (or
// failed) before Vue attached the listeners below, its 'load'/'error'
// event already fired and never will again — check .complete on mount.
onMounted(() => {
    if (backdropImgRef.value?.complete) backdropLoaded.value = true;
});
const films = ref({ results: [] });
const awards = ref([]);
const awardsLoading = ref(true);
const schedule = ref([]);
const openDays = ref(new Set());

const CATEGORY_ORDER = [
    "Galas",
    "Special Presentations",
    "Official Competition",
    "First Feature Competition",
    "Documentary Competition",
    "Short Film Competition",
    "Love",
    "Debate",
    "Laugh",
    "Dare",
    "Thrill",
    "Cult",
    "Journey",
    "Create",
    "Experimenta",
    "Short Film Programme",
    "Family",
    "Archive",
    "Expanded",
];

const CATEGORY_LABELS = {
    ["Galas"]: "Galas",
    ["Special Presentations"]: "Special Presentations",
    ["Official Competition"]: "Official Competition",
    ["First Feature Competition"]: "First Feature Competition",
    ["Documentary Competition"]: "Documentary Competition",
    ["Short Film Competition"]: "Short Film Competition",
    ["Love"]: "Love",
    ["Debate"]: "Debate",
    ["Laugh"]: "Laugh",
    ["Dare"]: "Dare",
    ["Thrill"]: "Thrill",
    ["Cult"]: "Cult",
    ["Journey"]: "Journey",
    ["Create"]: "Create",
    ["Experimenta"]: "Experimenta",
    ["Short Film Programme"]: "Short Film Programmes",
    ["Family"]: "Family",
    ["Archive"]: "Archive",
    ["Expanded"]: "Expanded",
    OTHER: "Other",
};

const activeSection = ref('');
const selectionContentRef = ref(null);
let sectionObserver = null;
const isMobile = ref(false);
let mobileMql = null;
const sectionOpen = ref({});
const isSectionOpen = (key) => sectionOpen.value[key] !== false;
const toggleSection = (key) => { sectionOpen.value = { ...sectionOpen.value, [key]: !isSectionOpen(key) }; };
const onSectionHeaderClick = (key) => { if (!isMobile.value) return; toggleSection(key); };
const activeDay = ref('');
const scheduleContentRef = ref(null);
let dayObserver = null;

const filmsByCategory = computed(() => {
    const map = Object.fromEntries(CATEGORY_ORDER.map((c) => [c, []]));
    map.OTHER = [];
    for (const f of films.value?.results || []) {
        const key = String(f.category || f.section || '').trim();
        if (key && map[key] !== undefined) map[key].push(f);
        else map.OTHER.push(f);
    }
    return map;
});

const orderedCategories = computed(() => {
    const out = CATEGORY_ORDER.filter((c) => (filmsByCategory.value[c] || []).length > 0);
    if ((filmsByCategory.value.OTHER || []).length > 0) out.push('OTHER');
    return out;
});

function categoryLabel (cat) {
    return CATEGORY_LABELS[cat] || cat;
}

const selectionSections = computed(() => orderedCategories.value.map((cat) => {
    const items = filmsByCategory.value[cat] || [];
    return { key: cat, label: categoryLabel(cat), films: items, count: items.length };
}));
const officialNav = computed(() => selectionSections.value);

// Festival-wide catalog size. Every other count on the page is per-section,
// so without this the reader can only add the sidebar numbers up by hand.
const catalogTotal = computed(() => selectionSections.value.reduce((n, s) => n + (s.count || 0), 0));
const catalogSectionCount = computed(() => selectionSections.value.filter((s) => (s.count || 0) > 0).length);

const scrollToSection = (key) => {
    activeSection.value = key;
    const root = selectionContentRef.value;
    if (!root) return;
    const els = root.querySelectorAll('[data-key]');
    for (const el of els) { if (el.getAttribute('data-key') === key) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); break; } }
};

const setupSectionObserver = () => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;
    if (sectionObserver) sectionObserver.disconnect();
    const root = selectionContentRef.value;
    if (!root) return;
    const els = root.querySelectorAll('[data-key]');
    if (!els.length) return;
    sectionObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) { if (entry.isIntersecting) activeSection.value = entry.target.getAttribute('data-key'); }
    }, { rootMargin: '-110px 0px -70% 0px', threshold: 0 });
    els.forEach((el) => sectionObserver.observe(el));
};

watch(selectionSections, (sections) => {
    if (!sections.length) return;
    if (!sections.some((sec) => sec.key === activeSection.value)) activeSection.value = sections[0].key;
}, { immediate: true });

watch([loading, activeTab, selectionSections], () => {
    if (!loading.value && activeTab.value === 'films') nextTick(() => setupSectionObserver());
    else if (sectionObserver) sectionObserver.disconnect();
}, { flush: 'post' });

const FESTIVAL_TZ = 'Europe/Zurich';

const formatDate = (dateStr) => {
    // dateStr is the festival-local day key (YYYY-MM-DD). Anchor to UTC so it
    // renders the same calendar day regardless of the viewer's timezone.
    const options = { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' };
    return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString('en-US', options);
};

const formatTime = (timeStr, tz) => {
    return new Date(timeStr).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: FESTIVAL_TZ
    });
};

const filteredSchedule = computed(() => {
    const q = scheduleSearchActiveQuery.value;
    if (!q) return schedule.value;
    const needle = normalizeText(q);
    return schedule.value.filter(s => {
        const title = normalizeText(s.film?.title);
        const director = normalizeText(s.film?.director);
        return title.includes(needle) || director.includes(needle);
    });
});

const groupedScreenings = computed(() => {
    const source = filteredSchedule.value;
    if (!source) return {};
    const groups = {};
    source.forEach(s => {
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

const isOpen = (date) => {
    if (scheduleSearchActiveQuery.value) return true;
    return openDays.value.has(date);
};

const scheduleDays = computed(() => Object.entries(groupedScreenings.value).map(([date, arr]) => ({ date, label: formatDate(date), count: arr.length })));
const onDayHeaderClick = (date) => { if (!isMobile.value) return; toggleDay(date); };
const scrollToDay = (date) => {
    activeDay.value = date;
    const root = scheduleContentRef.value;
    if (!root) return;
    const els = root.querySelectorAll('[data-day]');
    for (const el of els) { if (el.getAttribute('data-day') === date) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); break; } }
};
const setupDayObserver = () => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;
    if (dayObserver) dayObserver.disconnect();
    const root = scheduleContentRef.value;
    if (!root) return;
    const els = root.querySelectorAll('[data-day]');
    if (!els.length) return;
    dayObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) { if (entry.isIntersecting) activeDay.value = entry.target.getAttribute('data-day'); }
    }, { rootMargin: '-110px 0px -70% 0px', threshold: 0 });
    els.forEach((el) => dayObserver.observe(el));
};
watch(scheduleDays, (days) => {
    if (!days.length) return;
    if (!days.some((d) => d.date === activeDay.value)) activeDay.value = days[0]?.date || '';
}, { immediate: true });
watch([loading, activeTab, scheduleDays], () => {
    if (!loading.value && activeTab.value === 'schedule') nextTick(() => setupDayObserver());
    else if (dayObserver) dayObserver.disconnect();
}, { flush: 'post' });
const updateIsMobile = (e) => { isMobile.value = e.matches; };
onMounted(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
        mobileMql = window.matchMedia('(max-width: 900px)');
        isMobile.value = mobileMql.matches;
        mobileMql.addEventListener('change', updateIsMobile);
    }
});
onBeforeUnmount(() => {
    if (sectionObserver) sectionObserver.disconnect();
    if (dayObserver) dayObserver.disconnect();
    if (mobileMql) mobileMql.removeEventListener('change', updateIsMobile);
});

onMounted(async () => {
    try {
        const [filmsData, scheduleData, awardsData] = await Promise.all([
            $fetch('/api/festival/bfi/films?limit=400&sort=title'),
            $fetch('/api/festival/bfi/schedule'),
            $fetch('/api/festival/bfi/awards').catch(() => ({ results: [] })),
        ]);

        films.value = filmsData;
        awards.value = awardsData.results || [];
        schedule.value = scheduleData.results || [];

        if (schedule.value.length > 0) {
            const dates = new Set(schedule.value.map(s => s.start_time.split('T')[0]));
            dates.forEach(d => openDays.value.add(d));
        }

    } catch (e) {
        console.error('Error fetching festival data', e);
    } finally {
        loading.value = false;
        awardsLoading.value = false;
    }
});
</script>

<style lang="scss" scoped>
@use '~/assets/css/utilities/variables' as *;

:deep(.card__name) {
    font-size: 1.2rem;
}

// Poster sizing inside the Selection content column. The column is narrower than
// the old full-bleed grid, so we use fewer columns / slightly larger posters.
.selection :deep(.listing__items > .card) {
    width: 33.3333%;

    @media (min-width: 640px) {
        width: 25%;
    }
    @media (min-width: 1024px) {
        width: 20%;
    }
    @media (min-width: 1500px) {
        width: 16.6666%;
    }
    @media (min-width: 1800px) {
        width: 14.2857%;
    }
}



/* ── Selection: sidebar scroll-spy + sections ───────────── */
.selection-layout,
.schedule-layout {
    display: grid;
    grid-template-columns: 330px minmax(0, 1fr);
    gap: 2.5rem;
    align-items: start;
}

/* Breathing room between the screenings search bar and the day list below it. */
.schedule-layout {
    margin-top: 1.75rem;
}

.selection-nav,
.schedule-nav {
    position: sticky;
    top: 5.5rem;
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-height: calc(100vh - 7rem);
    overflow-y: auto;
    padding: 1rem;
    border: 1px solid transparent;
    background:
        linear-gradient(rgba(3, 6, 10, 0.85), rgba(3, 6, 10, 0.85)) padding-box,
        linear-gradient(160deg, rgba(139, 233, 253, 0.55), rgba(31, 84, 103, 0.45) 60%, rgba(139, 233, 253, 0.16)) border-box;
    border-radius: 14px;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
}

.nav-group-label {
    font-size: 1rem;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: rgba(139, 233, 253, 0.9);
    font-weight: 700;
    margin: 1.2rem 0.4rem 0.55rem;

    &:first-child {
        margin-top: 0.2rem;
    }
}

.nav-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    background: none;
    border: none;
    border-left: 3px solid transparent;
    border-radius: 0 8px 8px 0;
    color: rgba(255, 255, 255, 0.88);
    padding: 0.82rem 1rem;
    font-size: 1.32rem;
    font-family: inherit;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease;

    &:hover {
        background: rgba(139, 233, 253, 0.08);
        color: #eafbff;
    }

    &.active {
        background: rgba(139, 233, 253, 0.12);
        color: #8BE9FD;
        border-left-color: #8BE9FD;
        font-weight: 600;
    }
}

.nav-item-label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.nav-item-count {
    font-size: 1.12rem;
    color: rgba(255, 255, 255, 0.62);
    flex-shrink: 0;
}

.nav-item.active .nav-item-count {
    color: rgba(139, 233, 253, 0.85);
}

.sel-section {
    scroll-margin-top: 6.5rem;
    margin-bottom: 3rem;
}

.sel-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    border-bottom: 1px solid rgba(139, 233, 253, 0.3);
    padding-bottom: 6px;
    margin-bottom: 1.25rem;
}

.sel-section-title {
    margin: 0;
    font-family: var(--font-display);
    font-size: var(--section-title-size);
    font-weight: var(--section-title-weight);
    letter-spacing: var(--section-title-tracking);
    line-height: var(--section-title-leading);
    color: #fff;
}

.sel-section-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
}

.sel-section-count {
    font-size: 1.05rem;
    color: rgba(255, 255, 255, 0.5);
    white-space: nowrap;
    flex-shrink: 0;
}

/* Catalog total — the sidebar and the section headers only ever state
   per-section counts, so this chip is the one place the whole lineup is sized. */
.catalog-total {
    display: flex;
    justify-content: center;
    margin-bottom: 1.6rem;
}

.catalog-total__chip {
    font-size: 12px;
    color: #aab1b8;
    background: rgba(255, 255, 255, 0.04);
    padding: 4px 10px;
    border-radius: 20px;
    letter-spacing: 0.3px;
}

.catalog-total__chip strong {
    color: #8BE9FD;
    font-weight: 700;
}

.catalog-total__sep {
    color: rgba(139, 233, 253, 0.4);
    margin: 0 3px;
}

.nav-group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
}

.catalog-total__chip--nav {
    font-size: 10px;
    padding: 3px 8px;
    white-space: nowrap;
}

@media (min-width: 901px) {
    .catalog-total {
        display: none;
    }
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

.parallel-band {
    font-size: 0.85rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #8BE9FD;
    border-top: 1px solid rgba(139, 233, 253, 0.25);
    padding-top: 1.4rem;
    margin: 0.5rem 0 1.5rem;
}

@media (max-width: 900px) {
    .selection-layout,
    .schedule-layout {
        display: block;
    }

    .selection-nav,
    .schedule-nav {
        display: none;
    }

    .sel-section-header {
        cursor: pointer;
        user-select: none;
        transition: border-color 0.2s;
    }

    .sel-section-header:hover {
        border-color: rgba(139, 233, 253, 0.6);
    }

    .day-header {
        cursor: pointer;
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

.segmented-control {
    position: relative;
    display: flex;
    background: rgba(3, 4, 6, 0.6);
    border: 1px solid rgba(139, 233, 253, 0.18);
    border-radius: 16px;
    padding: 4px;
    height: 48px;
    align-items: center;
    min-width: 420px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
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
    color: #02080d;
}

.segmented-control .glider {
    position: absolute;
    top: 4px;
    left: 4px;
    height: calc(100% - 8px);
    width: calc((100% - 8px) / 3);
    background: linear-gradient(135deg, #8BE9FD, #5cc4d8);
    border-radius: 12px;
    z-index: 1;
    box-shadow: 0 4px 14px rgba(139, 233, 253, 0.3);
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.segmented-control .glider.info { transform: translateX(0); }
.segmented-control .glider.films { transform: translateX(100%); }
.segmented-control .glider.schedule { transform: translateX(200%); }

@media (max-width: 600px) {
    .switcher-container {
        width: 100%;
    }

    .segmented-control {
        min-width: 0;
        width: 100%;
        height: 36px;
    }

    .segmented-control label {
        font-size: clamp(1.1rem, 3.2vw, 1.3rem);
        line-height: 28px;
        padding: 0 0.4rem;
        min-width: 0;
    }
}


.festival-hero {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    border: 2px solid transparent;
    background:
        linear-gradient(#02080d, #02080d) padding-box,
        linear-gradient(140deg, #8BE9FD 0%, #1F5467 45%, rgba(31, 84, 103, 0.35) 100%) border-box;
    box-shadow: 0 14px 36px rgba(0, 0, 0, 0.5), 0 0 30px rgba(139, 233, 253, 0.12);
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
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 20px;
}

.backdrop-loader {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}

.loader-container {
    display: flex;
    justify-content: center;
    padding: 3rem;
}

.schedule-container, .info-container {
    max-width: 1200px;
    margin: 0 auto;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}



:deep(.winners-carousel) {
    max-width: 1200px;
}

.winners-loader {
    width: 100%;
    max-width: 1200px;
    margin: 10px auto 8px;
    min-height: 175px;
    display: flex;
    align-items: center;
    justify-content: center;
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
    cursor: default;
    user-select: none;

    h2 {
        font-family: var(--font-display);
        font-size: var(--section-title-size);
        font-weight: var(--section-title-weight);
        letter-spacing: var(--section-title-tracking);
        line-height: var(--section-title-leading);
        margin: 0;
    }

    .chevron {
        transition: transform 0.3s ease;

        &.closed {
            transform: rotate(-90deg);
        }
    }
}

.schedule-day {
    scroll-margin-top: 6.5rem;
}

.schedule-content > .schedule-day:first-child .day-header {
    margin-top: 0;
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
    border: 1px solid transparent;
    background:
        linear-gradient(#0a161b, #0a161b) padding-box,
        linear-gradient(140deg, #8BE9FD, #1F5467 60%, rgba(31, 84, 103, 0.3)) border-box;
    border-radius: 10px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    gap: 1.5rem;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.screening-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4), 0 0 20px rgba(139, 233, 253, 0.1);
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
  position: relative;
  background: rgba(3, 4, 6, 0.85);
  background-image:
    radial-gradient(circle at 15% 20%, rgba(31, 84, 103, 0.18), transparent 35%),
    radial-gradient(circle at 85% 80%, rgba(139, 233, 253, 0.08), transparent 30%);
  border: 1px solid rgba(31, 84, 103, 0.5);
  border-radius: 20px;
  padding: 2.2rem 2.5rem;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.8;
  min-height: 300px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), inset 0 0 24px rgba(139, 233, 253, 0.04);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #8BE9FD, #1F5467, transparent);
    opacity: 0.85;
    pointer-events: none;
  }

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
  border-radius: 12px;
  border: 1px solid rgba(139, 233, 253, 0.4);
  background: rgba(3, 4, 6, 0.75);
  color: #8BE9FD;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  &:hover {
    background: #ffffff;
    border-color: #ffffff;
    color: #000;
    transform: scale(1.05);
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

/* ── Featured YouTube embed ──────────────── */
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

/* ── Initial-rollout banner (catalog/schedule placeholders) ─ */
.rollout-banner {
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;
    max-width: 720px;
    margin: 2rem auto;
    padding: 1.5rem 1.75rem;
    background: rgba(16, 26, 35, 0.7);
    border: 1px solid rgba(139, 233, 253, 0.22);
    border-radius: 14px;
    backdrop-filter: blur(8px);
}

.rollout-banner__icon {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(139, 233, 253, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
}

.rollout-banner__copy {
    flex: 1;
    color: rgba(255, 255, 255, 0.85);

    h3 {
        margin: 0 0 0.4rem;
        font-size: 1.15rem;
        font-weight: 700;
        color: #8BE9FD;
        letter-spacing: 0.3px;
    }
    p {
        margin: 0;
        font-size: 1rem;
        line-height: 1.6;
        color: rgba(255, 255, 255, 0.7);
    }
}

@media (max-width: 600px) {
    .rollout-banner {
        flex-direction: column;
        gap: 0.75rem;
        padding: 1.25rem;
    }
}

/* ── Schedule search toolbar ─────────────── */
.schedule-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin: 0.5rem 0 0.25rem;
    padding: 8px 14px;
    background: rgba(16, 26, 35, 0.6);
    border: 1px solid rgba(139, 233, 253, 0.12);
    border-radius: 12px;
    backdrop-filter: blur(8px);
    transition: border-color 0.25s ease;
    min-height: 48px;
}

.schedule-toolbar.search-active {
    border-color: rgba(139, 233, 253, 0.28);
}

.schedule-toolbar-info {
    display: flex;
    align-items: center;
}

.schedule-count {
    font-size: 12px;
    color: #aab1b8;
    background: rgba(255, 255, 255, 0.04);
    padding: 4px 10px;
    border-radius: 20px;
    letter-spacing: 0.3px;
}

.schedule-toolbar .search-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    transition: width 0.3s ease;
}

.schedule-toolbar .search-toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(139, 233, 253, 0.08);
    color: #8BE9FD;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid rgba(139, 233, 253, 0.2);
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
    padding: 0;
}

.schedule-toolbar .search-toggle-btn:hover {
    background: rgba(139, 233, 253, 0.18);
    box-shadow: 0 4px 12px rgba(139, 233, 253, 0.1);
}

.schedule-toolbar .search-toggle-btn.active {
    background: rgba(139, 233, 253, 0.22);
    border-color: #8BE9FD;
}

.schedule-toolbar .search-input-container {
    position: relative;
    width: 0;
    overflow: hidden;
    opacity: 0;
    margin-left: 0;
    transition: width 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease, margin-left 0.3s ease;
}

.schedule-toolbar .search-input-container.show {
    width: 280px;
    opacity: 1;
    margin-left: 8px;
}

.schedule-toolbar .search-input {
    width: 100%;
    background: rgba(16, 26, 35, 0.7);
    border: 1px solid rgba(139, 233, 253, 0.25);
    color: #fff;
    padding: 8px 32px 8px 14px;
    border-radius: 10px;
    font-size: 13px;
    height: 36px;
    transition: all 0.2s ease;
}

.schedule-toolbar .search-input:focus {
    outline: none;
    border-color: #8BE9FD;
    box-shadow: 0 0 0 2px rgba(139, 233, 253, 0.2);
    background: rgba(16, 26, 35, 0.85);
}

.schedule-toolbar .search-input::placeholder {
    color: rgba(255, 255, 255, 0.35);
}

.schedule-toolbar .clear-search-btn {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.45);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    border-radius: 4px;
}

.schedule-toolbar .clear-search-btn:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
}

.schedule-empty {
    text-align: center;
    padding: 3rem 1rem 1rem;
    color: #aab1b8;
    font-size: 0.95rem;

    strong {
        color: #8BE9FD;
        font-weight: 600;
    }
}

@media (max-width: 600px) {
    .schedule-toolbar .search-input-container.show {
        width: calc(100vw - 140px);
        max-width: 240px;
    }
}

.section-glossary {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
}

.section-glossary-item strong {
    display: block;
    color: #8BE9FD;
    font-size: 1.02rem;
    margin-bottom: 0.15rem;
}

.section-glossary-item span {
    display: block;
    font-size: 0.98rem;
    line-height: 1.55;
    color: rgba(255, 255, 255, 0.74);
}

</style>

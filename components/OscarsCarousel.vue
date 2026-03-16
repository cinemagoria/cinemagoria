<template>
  <div class="listing listing--carousel oscars-carousel-section">

    <!-- Section header — uses standard listing__head for consistent alignment -->
    <div class="listing__head oscars-carousel-section__head">
      <div class="oscars-carousel-section__title-group">
        <h2 class="listing__title oscars-carousel-section__title">98th Academy Awards</h2>
        <nuxt-link to="/awards" class="listing__explore oscars-section__explore">
          <strong>Full Awards Coverage</strong>
        </nuxt-link>
      </div>
    </div>

    <!-- Scrollable carousel -->
    <div class="carousel oscars-carousel-wrap">

      <button
        class="carousel__nav carousel__nav--left"
        :disabled="atStart"
        aria-label="Previous"
        type="button"
        @click="scrollLeft"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M17.9 23.2L6.1 12 17.9.8"/>
        </svg>
      </button>

      <div ref="scrollEl" class="carousel__items oscars-carousel" @scroll="updateNavState" style="align-items: stretch;">

        <div
          v-for="category in mainCategories"
          :key="category.name"
          class="oscars-card"
        >
          <div class="oscars-card__header">
            <span class="oscars-card__category-label">{{ category.name }}</span>
          </div>

          <ul class="oscars-card__nominees" role="list">
            <li
              v-for="(nom, i) in sortedNominees(category.nominees)"
              :key="i"
              class="oscars-card__nominee-row"
              :class="{ 'oscars-card__nominee-row--winner': nom.won }"
            >
              <!-- Winner Oscar badge -->
              <span v-if="nom.won" class="oscars-card__winner-badge">
                <img src="/ui/oscars98th.png" alt="Oscar" class="oscars-card__winner-icon" aria-hidden="true" />
                WON
              </span>

              <!-- Person name (director/actor) → person page; film title only → movie page -->
              <nuxt-link
                v-if="nom.person_id"
                :to="`/person/${nom.person_id}`"
                class="oscars-card__nominee-name"
                :class="{ 'oscars-card__nominee-name--winner': nom.won }"
              >{{ nom.name }}</nuxt-link>
              <nuxt-link
                v-else
                :to="`/movie/${nom.film_id}`"
                class="oscars-card__nominee-name"
                :class="{ 'oscars-card__nominee-name--winner': nom.won }"
              >{{ nom.name }}</nuxt-link>

              <!-- Film link in cyan (or gold if winner) -->
              <nuxt-link
                v-if="nom.person_id && nom.film"
                :to="`/movie/${nom.film_id}`"
                class="oscars-card__nominee-film"
                :class="{ 'oscars-card__nominee-film--winner': nom.won }"
              >{{ nom.film }}</nuxt-link>
            </li>
          </ul>

          <div class="oscars-card__footer">
            <nuxt-link to="/awards" class="oscars-card__footer-link">View all nominees</nuxt-link>
          </div>
        </div>

        <!-- Explore All card -->
        <nuxt-link to="/awards" class="oscars-card oscars-card--explore">
          <img
            src="/ui/oscars98th.png"
            alt="Oscar Statuette"
            class="oscars-card--explore__statuette"
            aria-hidden="true"
          />
          <span class="oscars-card--explore__label">View All<br>Categories</span>
        </nuxt-link>

      </div>

      <button
        class="carousel__nav carousel__nav--right"
        :disabled="atEnd"
        aria-label="Next"
        type="button"
        @click="scrollRight"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M6.1 23.2L17.9 12 6.1.8"/>
        </svg>
      </button>

    </div>
  </div>
</template>

<script>
export default {
  name: 'OscarsCarousel',

  data() {
    return {
      atStart: true,
      atEnd: false,

      mainCategories: [
        {
          name: 'Best Picture',
          nominees: [
            { name: 'One Battle after Another', film: null, film_id: 1054867, person_id: null, won: true },
            { name: 'Sinners',                 film: null, film_id: 1233413, person_id: null },
            { name: 'Marty Supreme',            film: null, film_id: 1317288, person_id: null },
            { name: 'Hamnet',                   film: null, film_id: 858024,  person_id: null },
            { name: 'Train Dreams',             film: null, film_id: 1241983, person_id: null },
            { name: 'Sentimental Value',        film: null, film_id: 1124566, person_id: null },
          ],
        },
        {
          name: 'Best Director',
          nominees: [
            { name: 'Paul Thomas Anderson', film: 'One Battle after Another',film_id: 1054867, person_id: 4762,    won: true },
            { name: 'Ryan Coogler',         film: 'Sinners',                 film_id: 1233413, person_id: 1056121 },
            { name: 'Josh Safdie',          film: 'Marty Supreme',           film_id: 1317288, person_id: 129561  },
            { name: 'Chloé Zhao',           film: 'Hamnet',                  film_id: 858024,  person_id: 1395183 },
            { name: 'Joachim Trier',        film: 'Sentimental Value',       film_id: 1124566, person_id: 71609   },
          ],
        },
        {
          name: 'Actor in a Leading Role',
          nominees: [
            { name: 'Michael B. Jordan', film: 'Sinners',                   film_id: 1233413, person_id: 135651,  won: true },
            { name: 'Timothée Chalamet', film: 'Marty Supreme',             film_id: 1317288, person_id: 1190668 },
            { name: 'Leonardo DiCaprio', film: 'One Battle after Another',  film_id: 1054867, person_id: 6193    },
            { name: 'Ethan Hawke',       film: 'Blue Moon',                 film_id: 1299655, person_id: 569     },
            { name: 'Wagner Moura',      film: 'The Secret Agent',          film_id: 1220564, person_id: 52583   },
          ],
        },
        {
          name: 'Actress in a Leading Role',
          nominees: [
            { name: 'Jessie Buckley', film: 'Hamnet',                      film_id: 858024,  person_id: 1498158, won: true },
            { name: 'Renate Reinsve', film: 'Sentimental Value',          film_id: 1124566, person_id: 1576786 },
            { name: 'Emma Stone',     film: 'Bugonia',                     film_id: 701387,  person_id: 54693   },
            { name: 'Kate Hudson',    film: 'Song Sung Blue',              film_id: 1114777, person_id: 11661   },
            { name: 'Rose Byrne',     film: "If I Had Legs I'd Kick You",  film_id: 1160360, person_id: 9827    },
          ],
        },
        {
          name: 'Actor in a Supporting Role',
          nominees: [
            { name: 'Sean Penn',          film: 'One Battle after Another',  film_id: 1054867, person_id: 2228,   won: true  },
            { name: 'Benicio Del Toro',   film: 'One Battle after Another', film_id: 1054867, person_id: 1121   },
            { name: 'Jacob Elordi',       film: 'Frankenstein',              film_id: 1062722, person_id: 2034418},
            { name: 'Delroy Lindo',       film: 'Sinners',                   film_id: 1233413, person_id: 18792  },
            { name: 'Stellan Skarsgård',  film: 'Sentimental Value',         film_id: 1124566, person_id: 1640  },
          ],
        },
        {
          name: 'Actress in a Supporting Role',
          nominees: [
            { name: 'Amy Madigan',             film: 'Weapons',                  film_id: 1078605, person_id: null,   won: true },
            { name: 'Elle Fanning',            film: 'Sentimental Value',        film_id: 1124566, person_id: 18050  },
            { name: 'Wunmi Mosaku',            film: 'Sinners',                  film_id: 1233413, person_id: 134774 },
            { name: 'Teyana Taylor',           film: 'One Battle after Another', film_id: 1054867, person_id: 964679 },
            { name: 'Inga Ibsdotter Lilleaas', film: 'Sentimental Value',        film_id: 1124566, person_id: null   },
          ],
        },
      ],
    };
  },

  mounted() {
    this.$nextTick(this.updateNavState);
  },

  methods: {
    sortedNominees(nominees) {
      // winners float to top
      return [...nominees].sort((a, b) => (b.won ? 1 : 0) - (a.won ? 1 : 0));
    },
    scrollLeft() {
      const el = this.$refs.scrollEl;
      if (el) el.scrollBy({ left: -300, behavior: 'smooth' });
    },
    scrollRight() {
      const el = this.$refs.scrollEl;
      if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
    },
    updateNavState() {
      const el = this.$refs.scrollEl;
      if (!el) return;
      this.atStart = el.scrollLeft <= 4;
      this.atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    },
  },
};
</script>

<style scoped>
/* ─── Section overrides on top of listing--carousel ───────────────── */
.oscars-carousel-section {
  margin-top: 3rem !important;
}

/* ─── Header ───────────────────────────────────────────────────────── */
.oscars-carousel-section__head {
  align-items: center !important;
}

/* Title group: icon + title + explore-link all inline, like Festival Selections */
.oscars-carousel-section__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}


.oscars-carousel-section__title {
  margin: 0 !important;
  line-height: 1.1 !important;
}

.oscars-section__explore strong {
  color: #8BE9FD !important;
}

/* ─── Carousel scroll container — flex so children stretch to equal height ── */
.oscars-carousel {
  display: flex !important;
  flex-direction: row;
  align-items: stretch;
  gap: 14px;
  white-space: nowrap;
  line-height: 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.oscars-carousel::-webkit-scrollbar { display: none; }

/* ─── Cards ─────────────────────────────────────────────────────────  */
.oscars-card {
  display: inline-flex;
  flex-shrink: 0;
  white-space: normal;
  line-height: 1.4;
  width: 220px;
  scroll-snap-align: start;
  box-sizing: border-box;
}

/* First card — match existing carousel margin */
.oscars-card:first-child {
  margin-left: 15px;
}
@media (min-width: 600px) {
  .oscars-card:first-child { margin-left: 40px; }
}
@media (min-width: 1200px) {
  .oscars-card:first-child { margin-left: 50px; }
}

/* Last card */
.oscars-card:last-child {
  margin-right: 7px;
}
@media (min-width: 600px) {
  .oscars-card:last-child { margin-right: 32px; }
}
@media (min-width: 1200px) {
  .oscars-card:last-child { margin-right: 42px; }
}

/* actual inner styling goes on the card itself */
.oscars-card {
  background: #0d0d0d;
  border: 1px solid #8BE9FD;
  border-radius: 10px;
  padding: 14px 12px 12px;
  display: flex;
  flex-direction: column;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}

.oscars-card:hover {
  border-color: #a2edfd;
  box-shadow: 0 6px 24px rgba(139, 233, 253, 0.15);
}

/* Category label */
.oscars-card__header {
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.oscars-card__category-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #C9A84C;
}

/* Nominee row — winner state */
.oscars-card__nominee-row--winner {
  padding-bottom: 8px;
  margin-bottom: 2px;
  border-bottom: 1px solid rgba(201, 168, 76, 0.2);
}

.oscars-card__winner-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.2px;
  color: #C9A84C;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.oscars-card__winner-icon {
  height: 14px;
  width: auto;
  object-fit: contain;
  flex-shrink: 0;
  filter: drop-shadow(0 0 3px rgba(201, 168, 76, 0.6));
}

.oscars-card__nominee-name--winner {
  color: #C9A84C !important;
}

.oscars-card__nominee-name--winner:hover {
  color: #e0c16a !important;
}

.oscars-card__nominee-film--winner {
  color: rgba(201, 168, 76, 0.8) !important;
}

/* Nominees list */
.oscars-card__nominees {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.oscars-card__nominee-row {
  display: flex;
  flex-direction: column;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.oscars-card__nominee-row:last-child {
  border-bottom: none;
}

/* Person / film name link */
.oscars-card__nominee-name {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  line-height: 1.3;
  transition: color 0.18s ease;
}

.oscars-card__nominee-name:hover {
  color: #8BE9FD;
}

/* Film title link — cyan */
.oscars-card__nominee-film {
  font-size: 11px;
  color: #8BE9FD;
  font-weight: 400;
  text-decoration: none;
  line-height: 1.3;
  margin-top: 1px;
  transition: color 0.18s ease;
  opacity: 0.85;
}

.oscars-card__nominee-film:hover {
  opacity: 1;
  color: #A2EDFD;
}

/* Footer */
.oscars-card__footer {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.oscars-card__footer-link {
  font-size: 11px;
  color: #8BE9FD;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.18s ease;
}

.oscars-card__footer-link:hover {
  color: #A2EDFD;
}

/* ─── View All Categories card — same height as sibling cards ── */
.oscars-card--explore {
  background: #0a0a0a;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-decoration: none;
  cursor: pointer;
}

.oscars-card--explore::before {
  display: none;
}

.oscars-card--explore:hover {
  border-color: #a2edfd;
}

.oscars-card--explore__statuette {
  height: 64px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 0 8px rgba(201, 168, 76, 0.4));
}

.oscars-card--explore__label {
  font-size: 13px;
  font-weight: 700;
  color: #8BE9FD;
  text-align: center;
  line-height: 1.5;
}
</style>

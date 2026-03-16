<template>
  <div class="listing listing--carousel oscars-carousel-section">

    <!-- Cabecera -->
    <div class="listing__head oscars-carousel-section__head">
      <div class="oscars-carousel-section__title-group">
        <h2 class="listing__title oscars-carousel-section__title">98ª Premios Óscar</h2>
        <nuxt-link to="/awards" class="listing__explore oscars-section__explore">
          <strong>Cobertura Completa</strong>
        </nuxt-link>
      </div>
    </div>

    <!-- Carousel scrollable -->
    <div class="carousel oscars-carousel-wrap">

      <button
        class="carousel__nav carousel__nav--left"
        :disabled="atStart"
        aria-label="Anterior"
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
              <!-- Badge ganador con icono Óscar -->
              <span v-if="nom.won" class="oscars-card__winner-badge">
                <img src="/ui/oscars98th.png" alt="Óscar" class="oscars-card__winner-icon" aria-hidden="true" />
                GANÓ
              </span>

              <!-- Nombre → página de persona o película -->
              <nuxt-link
                v-if="nom.person_id"
                :to="`/persona/${nom.person_id}`"
                class="oscars-card__nominee-name"
                :class="{ 'oscars-card__nominee-name--winner': nom.won }"
              >{{ nom.name }}</nuxt-link>
              <nuxt-link
                v-else
                :to="`/pelicula/${nom.film_id}`"
                class="oscars-card__nominee-name"
                :class="{ 'oscars-card__nominee-name--winner': nom.won }"
              >{{ nom.name }}</nuxt-link>

              <!-- Título de la película -->
              <nuxt-link
                v-if="nom.person_id && nom.film"
                :to="`/pelicula/${nom.film_id}`"
                class="oscars-card__nominee-film"
                :class="{ 'oscars-card__nominee-film--winner': nom.won }"
              >{{ nom.film }}</nuxt-link>
            </li>
          </ul>

          <div class="oscars-card__footer">
            <nuxt-link to="/awards" class="oscars-card__footer-link">Ver todos los nominados</nuxt-link>
          </div>
        </div>

        <!-- Card: Ver todas las categorías -->
        <nuxt-link to="/awards" class="oscars-card oscars-card--explore">
          <img
            src="/ui/oscars98th.png"
            alt="Statuette de Óscar"
            class="oscars-card--explore__statuette"
            aria-hidden="true"
          />
          <span class="oscars-card--explore__label">Ver Todas<br>las Categorías</span>
        </nuxt-link>

      </div>

      <button
        class="carousel__nav carousel__nav--right"
        :disabled="atEnd"
        aria-label="Siguiente"
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
      atEnd:   false,

      mainCategories: [
        {
          name: 'Mejor Película',
          nominees: [
            { name: 'Una Batalla Tras Otra', film: null, film_id: 1054867, person_id: null, won: true },
            { name: 'Sinners',               film: null, film_id: 1233413, person_id: null },
            { name: 'Marty Supreme',         film: null, film_id: 1317288, person_id: null },
            { name: 'Hamnet',                film: null, film_id: 858024,  person_id: null },
            { name: 'Sueños de Tren',        film: null, film_id: 1241983, person_id: null },
            { name: 'Valor Sentimental',      film: null, film_id: 1124566, person_id: null },
          ],
        },
        {
          name: 'Mejor Director',
          nominees: [
            { name: 'Paul Thomas Anderson', film: 'Una Batalla Tras Otra', film_id: 1054867, person_id: 4762,    won: true },
            { name: 'Ryan Coogler',         film: 'Sinners',               film_id: 1233413, person_id: 1056121 },
            { name: 'Josh Safdie',          film: 'Marty Supreme',         film_id: 1317288, person_id: 129561  },
            { name: 'Chloé Zhao',           film: 'Hamnet',                film_id: 858024,  person_id: 1395183 },
            { name: 'Joachim Trier',        film: 'Valor Sentimental',     film_id: 1124566, person_id: 71609   },
          ],
        },
        {
          name: 'Mejor Actor',
          nominees: [
            { name: 'Michael B. Jordan', film: 'Sinners',               film_id: 1233413, person_id: 135651,  won: true },
            { name: 'Timothée Chalamet', film: 'Marty Supreme',         film_id: 1317288, person_id: 1190668 },
            { name: 'Leonardo DiCaprio', film: 'Una Batalla Tras Otra', film_id: 1054867, person_id: 6193    },
            { name: 'Ethan Hawke',       film: 'Luna Azul',             film_id: 1299655, person_id: 569     },
            { name: 'Wagner Moura',      film: 'El Agente Secreto',     film_id: 1220564, person_id: 52583   },
          ],
        },
        {
          name: 'Mejor Actriz',
          nominees: [
            { name: 'Jessie Buckley',  film: 'Hamnet',            film_id: 858024,  person_id: 1498158, won: true },
            { name: 'Renate Reinsve',  film: 'Valor Sentimental', film_id: 1124566, person_id: 1576786 },
            { name: 'Emma Stone',      film: 'Bugonia',           film_id: 701387,  person_id: 54693   },
            { name: 'Kate Hudson',     film: 'Song Sung Blue',    film_id: 1114777, person_id: 11661   },
            { name: 'Rose Byrne',      film: 'Si Tuviera Piernas, Te Patearía', film_id: 1160360, person_id: 9827 },
          ],
        },
        {
          name: 'Actor de Reparto',
          nominees: [
            { name: 'Sean Penn',         film: 'Una Batalla Tras Otra', film_id: 1054867, person_id: 2228,    won: true },
            { name: 'Benicio Del Toro',  film: 'Una Batalla Tras Otra', film_id: 1054867, person_id: 1121    },
            { name: 'Jacob Elordi',      film: 'Frankenstein',          film_id: 1062722, person_id: 2034418 },
            { name: 'Delroy Lindo',      film: 'Sinners',               film_id: 1233413, person_id: 18792   },
            { name: 'Stellan Skarsgård', film: 'Valor Sentimental',     film_id: 1124566, person_id: 1640    },
          ],
        },
        {
          name: 'Actriz de Reparto',
          nominees: [
            { name: 'Amy Madigan',            film: 'Weapons',           film_id: 1078605, person_id: null,    won: true },
            { name: 'Elle Fanning',            film: 'Valor Sentimental', film_id: 1124566, person_id: 18050   },
            { name: 'Wunmi Mosaku',            film: 'Sinners',           film_id: 1233413, person_id: 134774  },
            { name: 'Teyana Taylor',           film: 'Una Batalla Tras Otra', film_id: 1054867, person_id: 964679 },
            { name: 'Inga Ibsdotter Lilleaas', film: 'Valor Sentimental', film_id: 1124566, person_id: null    },
          ],
        },
        {
          name: 'Guion Original',
          nominees: [
            { name: 'Ryan Coogler',         film: 'Sinners',               film_id: 1233413, person_id: 1056121, won: true },
            { name: 'Ari Aster',            film: 'Weapons',               film_id: 1078605, person_id: 1337680 },
            { name: 'Sean Baker',           film: 'Anora',                 film_id: 1064213, person_id: 99329   },
            { name: 'Coralie Fargeat',      film: 'The Substance',         film_id: 933260,  person_id: 1271566 },
            { name: 'Brady Corbet',         film: 'The Brutalist',         film_id: 912649,  person_id: 55011   },
          ],
        },
        {
          name: 'Guion Adaptado',
          nominees: [
            { name: 'Paul Thomas Anderson', film: 'Una Batalla Tras Otra', film_id: 1054867, person_id: 4762,   won: true },
            { name: 'Chloé Zhao',           film: 'Hamnet',                film_id: 858024,  person_id: 1395183 },
            { name: 'Joachim Trier',        film: 'Valor Sentimental',     film_id: 1124566, person_id: 71609   },
            { name: 'James Mangold',        film: 'Un Hombre Completo',    film_id: 1064978, person_id: 24009   },
          ],
        },
        {
          name: 'Fotografía',
          nominees: [
            { name: 'Autumn Durald Arkapaw', film: 'Sinners',           film_id: 1233413, person_id: null, won: true },
            { name: 'Lol Crawley',           film: 'The Brutalist',     film_id: 912649,  person_id: null },
            { name: 'Greig Fraser',          film: 'Hamnet',            film_id: 858024,  person_id: null },
            { name: 'Robbie Ryan',           film: 'Valor Sentimental', film_id: 1124566, person_id: null },
          ],
        },
        {
          name: 'Banda Sonora Original',
          nominees: [
            { name: 'Ludwig Göransson', film: 'Sinners',           film_id: 1233413, person_id: 1218729, won: true },
            { name: 'Jonny Greenwood',  film: 'The Brutalist',     film_id: 912649,  person_id: null     },
            { name: 'Daniel Blumberg',  film: 'The Substance',     film_id: 933260,  person_id: null     },
            { name: 'Bryce Dessner',    film: 'Hamnet',            film_id: 858024,  person_id: null     },
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
      this.atStart = el.scrollLeft <= 2;
      this.atEnd   = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    },
  },
};
</script>

<style scoped>
/* ─── Header ───────────────────────────────────────────────────────── */
.oscars-carousel-section__head {
  align-items: center !important;
}

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

/* ─── Carousel scroll ──────────────────────────────────────────────── */
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

.oscars-card:first-child { margin-left: 1.5rem; }
@media (min-width: 640px)  { .oscars-card:first-child { margin-left: 4rem; } }
@media (min-width: 1024px) { .oscars-card:first-child { margin-left: 5rem; } }

.oscars-card:last-child { margin-right: 1.5rem; }
@media (min-width: 640px)  { .oscars-card:last-child { margin-right: 4rem; } }
@media (min-width: 1024px) { .oscars-card:last-child { margin-right: 5rem; } }

.oscars-card {
  flex-direction: column;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid #8BE9FD;
  border-radius: 10px;
  padding: 14px;
  gap: 10px;
}

.oscars-card:hover {
  border-color: rgba(139, 233, 253, 0.6);
  background: rgba(139, 233, 253, 0.05);
}

/* ─── Card header ───────────────────────────────────────────────────── */
.oscars-card__header { flex-shrink: 0; }

.oscars-card__category-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #C9A84C;
}

/* ─── Nominee row — winner state ─────────────────────────────────────── */
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

.oscars-card__nominee-name--winner { color: #C9A84C !important; }
.oscars-card__nominee-name--winner:hover { color: #e0c16a !important; }
.oscars-card__nominee-film--winner { color: rgba(201, 168, 76, 0.8) !important; }

/* ─── Nominees list ──────────────────────────────────────────────────── */
.oscars-card__nominees {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.oscars-card__nominee-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.oscars-card__nominee-name {
  font-size: 12px;
  font-weight: 500;
  color: #e0e0e0;
  line-height: 1.3;
  display: block;
}
.oscars-card__nominee-name:hover { color: #fff; }

.oscars-card__nominee-film {
  font-size: 11px;
  color: #8BE9FD;
  opacity: 0.75;
  display: block;
  line-height: 1.2;
}
.oscars-card__nominee-film:hover { opacity: 1; }

/* ─── Card footer ───────────────────────────────────────────────────── */
.oscars-card__footer {
  flex-shrink: 0;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.oscars-card__footer-link {
  font-size: 10px;
  color: #8BE9FD;
  opacity: 0.6;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-weight: 600;
}
.oscars-card__footer-link:hover { opacity: 1; }

/* ─── Explore card ───────────────────────────────────────────────────── */
.oscars-card--explore {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 180px;
  border: 1px solid #8BE9FD;
  border-radius: 10px;
  padding: 14px;
  text-decoration: none;
  transition: all 0.2s ease;
}
.oscars-card--explore:hover {
  border-color: rgba(139, 233, 253, 0.7);
  background: rgba(139, 233, 253, 0.06);
}

.oscars-card--explore__statuette {
  height: 64px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(201, 168, 76, 0.5));
}

.oscars-card--explore__label {
  font-size: 12px;
  font-weight: 700;
  color: #8BE9FD;
  text-align: center;
  letter-spacing: 0.5px;
  line-height: 1.4;
}

/* ─── Nav buttons ─────────────────────────────────────────────────────── */
.carousel__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: rgba(0, 0, 0, 0.55);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease;
}
.carousel__nav:hover  { background: rgba(0, 0, 0, 0.8); }
.carousel__nav:disabled { opacity: 0; pointer-events: none; }
.carousel__nav--left  { left: 6px; }
.carousel__nav--right { right: 6px; }
</style>

<template>
  <main :class="$style.page">
    <UserNav />

    <header :class="$style.hero">
      <div :class="$style.heroInner">
        <span :class="$style.eyebrow">Referencia</span>
        <h1 :class="$style.heroTitle">Preguntas Frecuentes</h1>
        <p :class="$style.heroLead">
          Marco editorial, infraestructura de descubrimiento y los componentes que sostienen la plataforma &mdash; explicados en un solo lugar.
        </p>
      </div>
    </header>

    <div :class="$style.layout">
      <aside :class="$style.toc" aria-label="Tabla de contenido">
        <span :class="$style.tocLabel">Temas</span>
        <ul>
          <li v-for="s in sections" :key="s.id">
            <a :href="`#${s.id}`" @click="scrollTo($event, s.id)" :class="[$style.tocLink, activeId === s.id ? $style.tocLinkActive : '']">
              {{ s.title }}
            </a>
          </li>
        </ul>
      </aside>

      <div :class="$style.content">
        <section
          v-for="s in sections"
          :key="s.id"
          :id="s.id"
          :class="$style.section"
          ref="sectionRefs"
        >
          <header :class="$style.sectionHead">
            <span :class="$style.sectionMarker"></span>
            <h2>{{ s.title }}</h2>
            <button
              v-if="s.id === 'notifications'"
              type="button"
              :class="$style.howItWorksBtn"
              @click="showHowItWorksModal = true"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
              <span>Cómo funciona</span>
            </button>
          </header>

          <div :class="$style.items">
            <article
              v-for="(item, idx) in s.items"
              :key="idx"
              :class="[$style.item, isOpen(s.id, idx) ? $style.itemOpen : '']"
            >
              <button
                type="button"
                :class="$style.qButton"
                :aria-expanded="isOpen(s.id, idx)"
                @click="toggle(s.id, idx)"
              >
                <span :class="$style.qText">{{ item.q }}</span>
                <span :class="$style.chevWrap">
                  <svg :class="$style.chev" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </span>
              </button>
              <div :class="$style.answerWrap">
                <div :class="$style.answer" v-html="item.a"></div>
              </div>
            </article>
          </div>
        </section>

        <footer :class="$style.bottom">
          <p>¿Más dudas? <nuxt-link to="/contact">Escribinos por el formulario de contacto</nuxt-link>.</p>
        </footer>
      </div>
    </div>

    <HowItWorksModal v-if="showHowItWorksModal" @close="showHowItWorksModal = false" />
  </main>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import HowItWorksModal from '~/components/HowItWorksModal.vue';

const showHowItWorksModal = ref(false);

useHead({
  title: 'Preguntas Frecuentes — Base de Conocimiento',
  meta: [
    { name: 'description', content: 'Marco editorial, N.O.I.R., Spotlight, descubrimiento centrado en festivales, cuentas, fuentes de metadatos y los cimientos técnicos detrás de la plataforma.' }
  ]
});

const sections = [
  {
    id: 'general',
    title: 'General',
    items: [
      {
        q: '¿De qué se trata esta plataforma?',
        a: `<p>Una plataforma de descubrimiento centrada en cine y televisión, construida sobre agregación de datos, curaduría editorial y seguimiento activo de festivales. Metadatos, calificaciones, críticas, bandas sonoras, historial de premios y disponibilidad en streaming se integran desde múltiples fuentes de la industria en una experiencia pensada para la cultura cinematográfica contemporánea.</p>`
      },
      {
        q: '¿Se transmite o aloja contenido aquí?',
        a: `<p>No. La disponibilidad se indexa desde proveedores externos y las opciones legales de visualización aparecen únicamente cuando están verificadas. No existe un catálogo propio de streaming: los datos estructurados provienen de <strong>IMDb</strong>, <strong>TMDB</strong>, <strong>Rotten Tomatoes</strong>, <strong>Trakt.tv</strong>, <strong>MusicBrainz</strong>, <strong>JustWatch</strong> y <strong>MDBList</strong>.</p>`
      }
    ]
  },
  {
    id: 'noir',
    title: 'N.O.I.R.',
    items: [
      {
        q: '¿Qué es N.O.I.R.?',
        a: `<p class="lead-line"><strong>N.O.I.R. &mdash; <em>Nothing Out Is Ready</em>.</strong></p>
<p>La capa curatorial más importante de la plataforma y su herramienta editorial más activa. Desde premieres tempranas hasta histórico permanente, N.O.I.R. reúne títulos emergentes desde <strong>2024 en adelante</strong> considerados culturales o relevantes dentro del marco editorial.</p>
<p>El histórico dedicado en <a href="/noir" class="inline-link">/noir</a> se puede consultar sin cuenta. Solo hace falta una para clonarlo a una colección propia.</p>`
      },
      {
        q: '¿Cómo entra un título a N.O.I.R. y cómo se mueve dentro de la plataforma?',
        a: `<p>La mayoría de los títulos surge desde festivales, premieres, adquisiciones, seguimiento crítico y una infraestructura interna de procesos editoriales, bases de datos, automatizaciones y análisis curatorial. Los festivales funcionan como el principal sistema de detección editorial: <strong>Sundance, Róterdam, Berlinale, Romford Horror, Slamdance, SXSW, BIFFF, BAFICI, CUFF, Cannes, Tribeca, BIFAN, KVIFF, Fantasia, Locarno, FrightFest, Venecia</strong> y <strong>TIFF</strong> alimentan activamente el sistema de selección, con nuevos festivales incorporándose progresivamente durante 2026.</p>
<p>Cuando un proyecto gana relevancia editorial, pasa a la rotación principal de la página principal: una selección destacada de títulos N.O.I.R. próximos a estrenarse o recientemente lanzados. El sello aparece en cada tarjeta y conecta directamente con el histórico completo.</p>
<p>Una vez que el título se encuentra ampliamente disponible, abandona esa rotación principal e ingresa al <strong>histórico permanente de N.O.I.R.</strong> en <a href="/noir" class="inline-link">/noir</a>, organizado por año y formato. Con frecuencia continúa también en <strong>Spotlight</strong>, el segundo espacio editorial de la página principal &mdash; cerca del setenta por ciento de los títulos destacados allí pasaron antes por la rotación principal.</p>
<p>Salir de la rotación nunca implica desaparecer del histórico. El histórico es acumulativo.</p>`
      },
      {
        q: '¿Qué tipo de cine predomina y qué representa el sello N.O.I.R.?',
        a: `<p>La selección se inclina hacia el cine de autor, el género contemporáneo, los descubrimientos de festivales internacionales, las producciones independientes y las obras con identidad cultural marcada &mdash; predominantemente <strong>horror contemporáneo, thrillers psicológicos, ciencia ficción</strong> y <strong>drama</strong>, con fuerte presencia de cine europeo y latinoamericano de festivales. Las grandes producciones aparecen únicamente cuando realmente encajan dentro del criterio editorial.</p>
<p>El sello marca la incorporación formal a esa selección &mdash; se otorga por relevancia editorial, identidad artística, recorrido en festivales, innovación de género o potencial cultural a largo plazo, no por escala comercial. Una vez asignado, permanece asociado al título de forma permanente.</p>`
      }
    ]
  },
  {
    id: 'spotlight',
    title: 'Spotlight & Descubrimiento',
    items: [
      {
        q: '¿Qué es Spotlight?',
        a: `<p>El espacio principal de descubrimiento editorial dentro de la página principal para títulos emergentes y obras consideradas relevantes por la curaduría de la plataforma. Spotlight es curado, no algorítmico: conviven descubrimientos de festivales, proyectos de autor, horror contemporáneo, thrillers psicológicos, ciencia ficción, drama y estrenos independientes con identidad marcada.</p>
<p>Muchos títulos llegan después de pasar por la rotación principal y continúan visibles mucho tiempo después de finalizado su período inicial de exposición, antes de asentarse de forma permanente dentro del histórico.</p>`
      },
      {
        q: '¿Qué significa “descubrimiento centrado en festivales”?',
        a: `<p>Los festivales funcionan como motores activos de descubrimiento, no como simples categorías de metadatos. Las premieres, selecciones oficiales y recorridos críticos alimentan directamente los sistemas editoriales y el seguimiento de títulos emergentes.</p>`
      },
      {
        q: '¿Qué festivales se cubren actualmente?',
        a: `<p>Cobertura activa desde <strong>2026 en adelante</strong>, incorporando cada edición año tras año:</p>
<ul class="festival-list">
  <li><a href="/festival/sundance-2026" class="inline-link">Sundance</a> &middot; Park City</li>
  <li><a href="/festival/rotterdam-2026" class="inline-link">Rotterdam</a> &middot; Róterdam</li>
  <li><a href="/festival/berlinale-2026" class="inline-link">Berlinale</a> &middot; Berlín</li>
  <li><a href="/festival/romford-2026" class="inline-link">Romford Horror</a> &middot; Romford</li>
  <li><a href="/festival/slamdance-2026" class="inline-link">Slamdance</a> &middot; Park City</li>
  <li><a href="/festival/sxsw-2026" class="inline-link">SXSW</a> &middot; Austin</li>
  <li><a href="/festival/bifff-2026" class="inline-link">BIFFF</a> &middot; Bruselas</li>
  <li><a href="/festival/bafici-2026" class="inline-link">BAFICI</a> &middot; Buenos Aires</li>
  <li><a href="/festival/cuff-2026" class="inline-link">CUFF</a> &middot; Calgary</li>
  <li><a href="/festival/cannes-2026" class="inline-link">Cannes</a> &middot; Cannes</li>
  <li><a href="/festival/tribeca-2026" class="inline-link">Tribeca</a> &middot; Nueva York</li>
  <li><a href="/festival/bifan-2026" class="inline-link">BIFAN</a> &middot; Bucheon</li>
  <li><a href="/festival/kviff-2026" class="inline-link">KVIFF</a> &middot; Karlovy Vary</li>
  <li><a href="/festival/fantasia-2026" class="inline-link">Fantasia</a> &middot; Montréal</li>
  <li><a href="/festival/locarno-2026" class="inline-link">Locarno</a> &middot; Locarno</li>
  <li><a href="/festival/frightfest-2026" class="inline-link">FrightFest</a> &middot; Londres</li>
  <li><a href="/festival/venice-2026" class="inline-link">Venecia</a> &middot; Venecia</li>
  <li><a href="/festival/tiff-2026" class="inline-link">TIFF</a> &middot; Toronto</li>
</ul>
<p>El hub completo se encuentra en <a href="/festival" class="inline-link">/festival</a>.</p>`
      },
      {
        q: '¿Qué festivales se incorporan próximamente?',
        a: `<p>Pendientes de incorporarse durante 2026, en orden de calendario:</p>
<ul>
  <li><strong>BIFF</strong> &middot; Festival Internacional de Cine de Busan</li>
  <li><strong>BFI London</strong> &middot; BFI London Film Festival</li>
  <li><strong>Sitges</strong> &middot; Festival Internacional de Cine Fantástico de Cataluña</li>
  <li><strong>El Cairo</strong> &middot; Festival Internacional de Cine de El Cairo</li>
  <li><strong>Mar del Plata</strong> &middot; Festival Internacional de Cine</li>
  <li><strong>BARS</strong> &middot; Buenos Aires Rojo Sangre</li>
  <li><strong>Marrakech</strong> &middot; Festival Internacional de Cine de Marrakech</li>
  <li><strong>Mar Rojo</strong> &middot; Festival Internacional de Cine del Mar Rojo</li>
</ul>
<p>Cada edición se retoma al año siguiente. La lista es orientativa y puede ajustarse a medida que evolucionan el alcance editorial y los recursos disponibles.</p>`
      },
      {
        q: '¿Por qué algunos festivales muestran menos títulos que la programación oficial?',
        a: `<p>La cobertura de festivales depende de metadatos públicos y fuentes externas, que no siempre incluyen todos los títulos &mdash; especialmente <strong>cortometrajes, obras experimentales y producciones regionales</strong>.</p>
<p>Se trata de una limitación técnica, no editorial. Ninguna película es omitida o censurada intencionalmente. La mayoría de los largometrajes sí está presente; las ausencias suelen concentrarse en cortos y secciones periféricas. La cobertura mejora progresivamente a medida que las fuentes se actualizan.</p>`
      }
    ]
  },
  {
    id: 'accounts',
    title: 'Cuentas & Perfiles',
    items: [
      {
        q: '¿Hace falta una cuenta?',
        a: `<p>La mayor parte del descubrimiento no requiere una cuenta. Sin embargo, una cuenta habilita watchlists, calificaciones, seguimiento de repartos, equipos, proyectos, notificaciones, listas personalizadas, artículos guardados, seguimiento de episodios y participación plena en N.O.I.R.</p>`
      },
      {
        q: '¿Los perfiles son públicos? ¿Las listas pueden ser privadas o clonadas?',
        a: `<p>Los perfiles pueden mostrar actividad pública, listas curadas y conexiones sociales, con controles de privacidad configurables. Las listas personalizadas admiten ambos niveles de visibilidad; cualquier lista pública puede duplicarse dentro de una biblioteca personal y editarse de manera independiente.</p>`
      },
      {
        q: '¿Se pueden eliminar las cuentas?',
        a: `<p>Sí. La eliminación es completamente autogestionada y elimina permanentemente los datos del perfil.</p>`
      }
    ]
  },
  {
    id: 'search',
    title: 'Búsqueda & Metadatos',
    items: [
      {
        q: '¿Se puede buscar directamente por IMDb o TMDB?',
        a: `<p>Sí. El sistema de búsqueda resuelve ambos identificadores de forma directa.</p>`
      },
      {
        q: '¿Por qué algunas calificaciones muestran fuentes distintas?',
        a: `<p>IMDb funciona como fuente principal cuando los datos están disponibles. Cuando no lo están, TMDB ocupa su lugar, manteniendo atribución explícita para preservar transparencia sobre el origen.</p>`
      }
    ]
  },
  {
    id: 'notifications',
    title: 'Notificaciones y Seguimiento',
    items: [
      {
        q: '¿A quién y a qué se puede seguir?',
        a: `<ul>
  <li>Actores</li>
  <li>Directores</li>
  <li>Guionistas</li>
  <li>Series</li>
  <li>Productoras</li>
  <li>Plataformas de streaming</li>
</ul>`
      },
      {
        q: '¿Cómo se generan las alertas de estreno?',
        a: `<p>Mediante procesos en segundo plano se monitorean continuamente estrenos, lanzamientos de episodios y proyectos asociados a entidades seguidas. Las alertas luego se sincronizan entre dispositivos.</p>`
      },
      {
        q: '¿Se puede seguir el progreso por episodio?',
        a: `<p>Sí &mdash; con seguimiento granular hasta nivel de episodio.</p>`
      }
    ]
  },
  {
    id: 'editorial',
    title: 'Noticias y Editorial',
    items: [
      {
        q: '¿El sistema editorial está generado por IA?',
        a: `<p>Asistido por IA, no autónomo. La automatización aporta enriquecimiento, ranking y clasificación; la dirección editorial y la curaduría continúan bajo control humano. Los artículos se estructuran y contextualizan internamente, no se reciclan desde feeds sin procesar.</p>`
      }
    ]
  },
  {
    id: 'technical',
    title: 'Tecnologías',
    items: [
      {
        q: '¿Qué tecnologías impulsan la plataforma?',
        a: `<ul>
  <li>Nuxt</li>
  <li>Vue.js</li>
  <li>Pinia</li>
  <li>Turso</li>
  <li>Django REST Framework</li>
  <li>Rust</li>
  <li>GCP</li>
</ul>`
      },
      {
        q: '¿Por qué el rendimiento se considera una característica del producto?',
        a: `<p>La carga concurrente de datos, el enriquecimiento precomputado, la caché por capas, el procesamiento en segundo plano y la selección editorial del lado del servidor forman parte central de la arquitectura &mdash; minimizan latencia y mantienen el descubrimiento inmediato.</p>`
      },
      {
        q: '¿Hay soporte para varios idiomas?',
        a: `<p>Inglés y español.</p>`
      }
    ]
  },
  {
    id: 'philosophy',
    title: 'Filosofía',
    items: [
      {
        q: '¿Por qué no apoyarse únicamente en algoritmos?',
        a: `<p>La cultura cinematográfica se entiende como un ecosistema en evolución, no como un flujo diseñado para maximizar interacción. El modelo es híbrido: descubrimiento algorítmico combinado con perspectiva editorial y curaduría contextual.</p>`
      },
      {
        q: '¿Qué significa “agregación por encima de exclusividad”?',
        a: `<p>Un principio central del proyecto: integrar y contextualizar fuentes externas confiables en lugar de reemplazarlas con una base de datos cerrada y propietaria. La plataforma funciona como una capa de descubrimiento e inteligencia editorial para la cultura cinematográfica contemporánea.</p>`
      }
    ]
  }
];

const open = reactive({});
const activeId = ref(sections[0].id);
const sectionRefs = ref([]);

const key = (sid, idx) => `${sid}-${idx}`;
const isOpen = (sid, idx) => !!open[key(sid, idx)];
const toggle = (sid, idx) => { open[key(sid, idx)] = !open[key(sid, idx)]; };

const scrollTo = (e, id) => {
  e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
  window.scrollTo({ top, behavior: 'smooth' });
  history.replaceState(null, '', `#${id}`);
};

let observer = null;
onMounted(() => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) activeId.value = visible[0].target.id;
    },
    { rootMargin: '-30% 0px -55% 0px', threshold: 0 }
  );
  sections.forEach((s) => {
    const el = document.getElementById(s.id);
    if (el) observer.observe(el);
  });
});
onBeforeUnmount(() => { observer && observer.disconnect(); });
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

/* ── Page shell ─────────────────────────────────────────────────── */
.page {
  position: relative;
  min-height: 100vh;
  background:
    radial-gradient(ellipse 80% 60% at 15% -10%, rgba(31, 84, 103, 0.22) 0%, transparent 55%),
    radial-gradient(ellipse 60% 40% at 90% 5%, rgba(139, 233, 253, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse 60% 60% at 50% 95%, rgba(31, 84, 103, 0.12) 0%, transparent 60%),
    linear-gradient(180deg, #02080d 0%, #010406 100%);
  color: rgba(255, 255, 255, 0.86);
  padding-bottom: 6rem;
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* ── Hero ───────────────────────────────────────────────────────── */
.hero {
  padding: var(--page-header-space-top) 1.5rem var(--page-header-space-bottom);
  text-align: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 240px;
    max-width: 60%;
    height: 1px;
    transform: translateX(-50%);
    background: linear-gradient(90deg, transparent, rgba(139, 233, 253, 0.45), transparent);
  }
}

.heroInner {
  max-width: 720px;
  margin: 0 auto;
}

.eyebrow {
  display: inline-block;
  font-size: var(--page-eyebrow-size);
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #8BE9FD;
  font-weight: 700;
  padding: 6px 14px;
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 999px;
  background: rgba(139, 233, 253, 0.08);
  margin-bottom: 1.4rem;
}

.heroTitle {
  font-family: var(--font-display);
  font-size: var(--page-title-size);
  font-weight: var(--page-title-weight);
  color: var(--page-title-color);
  margin: 0 0 var(--page-header-space-title);
  letter-spacing: var(--page-title-tracking);
  line-height: var(--page-title-leading);
  text-shadow: var(--page-title-glow);
  text-wrap: balance;
}

.heroLead {
  font-family: var(--font-display);
  font-size: var(--page-subtitle-size);
  line-height: var(--page-subtitle-leading);
  letter-spacing: var(--page-subtitle-tracking);
  color: var(--page-subtitle-color);
  margin: 0 auto;
  max-width: var(--page-subtitle-measure);
  font-weight: var(--page-subtitle-weight);
  text-wrap: pretty;
}

/* ── Layout: TOC + Content ─────────────────────────────────────── */
.layout {
  max-width: 1180px;
  margin: 3rem auto 0;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
    margin-top: 2rem;
  }
}

/* ── Table of contents ─────────────────────────────────────────── */
.toc {
  align-self: start;
  position: sticky;
  top: 100px;
  background: rgba(3, 4, 6, 0.6);
  background-image:
    radial-gradient(circle at 20% 10%, rgba(31, 84, 103, 0.15), transparent 45%);
  border: 1px solid rgba(31, 84, 103, 0.45);
  border-radius: 16px;
  padding: 1.1rem 0.7rem 1rem;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.4),
    inset 0 0 24px rgba(139, 233, 253, 0.03);

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  @media (max-width: 1024px) {
    position: relative;
    top: auto;
    padding: 0.8rem 0;
    background: transparent;
    border: none;
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    overflow-x: auto;
    overflow-y: hidden;
    margin: 0 -1rem;
    padding-left: 1rem;
    padding-right: 1rem;
    scrollbar-width: none;

    &::-webkit-scrollbar { display: none; }

    ul {
      flex-direction: row;
      gap: 8px;
      flex-wrap: nowrap;
      min-width: max-content;
    }
  }
}

.tocLabel {
  display: block;
  font-size: 10px;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 700;
  margin: 0 0 10px;
  padding: 0 12px;

  @media (max-width: 1024px) { display: none; }
}

.tocLink {
  display: block;
  padding: 9px 14px;
  font-size: 13.5px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.62);
  text-decoration: none;
  border-radius: 10px;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
  letter-spacing: 0.1px;

  &:hover {
    color: #fff;
    background: rgba(139, 233, 253, 0.06);
    border-color: rgba(139, 233, 253, 0.15);
  }

  @media (max-width: 1024px) {
    padding: 7px 14px;
    border: 1px solid rgba(139, 233, 253, 0.18);
    font-size: 13px;
    background: rgba(3, 4, 6, 0.5);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
  }
}

.tocLinkActive {
  color: #03242C;
  background: linear-gradient(135deg, #1F5467, #8BE9FD);
  border-color: rgba(139, 233, 253, 0.55);
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(139, 233, 253, 0.22);

  &:hover {
    color: #03242C;
    background: linear-gradient(135deg, #1F5467, #8BE9FD);
    border-color: rgba(139, 233, 253, 0.55);
  }

  @media (max-width: 1024px) {
    border-color: rgba(139, 233, 253, 0.6);
  }
}

/* ── Content column ────────────────────────────────────────────── */
.content {
  min-width: 0;
}

.section {
  scroll-margin-top: 90px;
  margin-bottom: 4rem;

  &:last-of-type { margin-bottom: 2rem; }
}

.sectionHead {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 1.4rem;
  padding-bottom: 0.9rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: linear-gradient(90deg, rgba(139, 233, 253, 0.4) 0%, rgba(139, 233, 253, 0.1) 30%, transparent 100%);
  }

  h2 {
    font-family: var(--font-display);
    font-size: var(--section-title-size);
    font-weight: var(--section-title-weight);
    letter-spacing: var(--section-title-tracking);
    line-height: var(--section-title-leading);
    color: #fff;
    margin: 0;
  }
}

.sectionMarker {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #8BE9FD;
  box-shadow: 0 0 12px rgba(139, 233, 253, 0.7);
  flex-shrink: 0;
}

.howItWorksBtn {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid rgba(139, 233, 253, 0.5);
  background: linear-gradient(135deg, #1F5467, #8BE9FD);
  color: #03242C;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  box-shadow: 0 4px 14px rgba(139, 233, 253, 0.22);

  svg { flex-shrink: 0; }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(139, 233, 253, 0.32);
  }
}

/* ── FAQ items ─────────────────────────────────────────────────── */
.items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item {
  position: relative;
  background: rgba(3, 4, 6, 0.55);
  background-image:
    radial-gradient(circle at 15% 0%, rgba(31, 84, 103, 0.1), transparent 50%);
  border: 1px solid rgba(139, 233, 253, 0.14);
  border-radius: 14px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: border-color 0.25s ease, background 0.25s ease, transform 0.2s ease, box-shadow 0.25s ease;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);

  &:hover {
    border-color: rgba(139, 233, 253, 0.28);
    background: rgba(3, 4, 6, 0.7);
  }
}

.itemOpen {
  border-color: rgba(139, 233, 253, 0.45);
  background: rgba(3, 4, 6, 0.78);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(31, 84, 103, 0.4),
    inset 0 0 28px rgba(139, 233, 253, 0.04);

  .chevWrap {
    background: rgba(139, 233, 253, 0.18);
    border-color: rgba(139, 233, 253, 0.55);
    color: #8BE9FD;
  }

  .chev { transform: rotate(180deg); }
}

.qButton {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.05rem 1.25rem;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 15.5px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;
  font-family: inherit;
  letter-spacing: -0.1px;
  line-height: 1.4;

  &:hover {
    background: rgba(139, 233, 253, 0.03);
  }
}

.qText {
  flex: 1;
  line-height: 1.4;
}

.chevWrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(139, 233, 253, 0.06);
  border: 1px solid rgba(139, 233, 253, 0.22);
  color: rgba(139, 233, 253, 0.7);
  transition: all 0.25s ease;
  flex-shrink: 0;
}

.chev {
  transition: transform 0.3s ease;
}

.answerWrap {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.itemOpen .answerWrap {
  max-height: 2600px;
}

.answer {
  font-size: 14.5px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.78);
  padding: 0 1.25rem 1.25rem;
  font-weight: 300;

  > * { margin: 0; }
  > * + * { margin-top: 0.85rem; }

  :global(strong) { color: #fff; font-weight: 600; }
  :global(em) { color: #8BE9FD; font-style: normal; letter-spacing: 0.4px; }

  :global(.lead-line) {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.95);
    em { color: #8BE9FD; font-style: normal; letter-spacing: 0.5px; }
  }

  :global(ul) {
    list-style: none;
    padding-left: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 0.5rem 1rem;
  }

  :global(.festival-list) {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  :global(li) {
    position: relative;
    padding-left: 18px;
    color: rgba(255, 255, 255, 0.82);
    line-height: 1.5;
    font-size: 14px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.6rem;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #8BE9FD;
      box-shadow: 0 0 6px rgba(139, 233, 253, 0.6);
    }
  }

  :global(.inline-link) {
    color: #8BE9FD;
    text-decoration: none;
    border-bottom: 1px dashed rgba(139, 233, 253, 0.4);
    transition: border-color 0.2s ease;
    &:hover { border-bottom-color: #8BE9FD; }
  }

  :global(.manifesto) {
    margin: 1rem 0;
    padding: 1rem 1.2rem;
    border-left: 2px solid #8BE9FD;
    background: linear-gradient(90deg, rgba(139, 233, 253, 0.07), rgba(139, 233, 253, 0.02));
    border-radius: 0 10px 10px 0;
    color: rgba(255, 255, 255, 0.9);
    font-style: italic;

    p { margin: 0; line-height: 1.6; font-size: 14.5px; }
    p + p { margin-top: 0.4rem; }
  }

  :global(.manifesto-mark) {
    display: block;
    font-style: normal;
    font-size: 10px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #8BE9FD;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
}

/* ── Footer ────────────────────────────────────────────────────── */
.bottom {
  margin-top: 3.5rem;
  padding: 1.6rem 1rem;
  text-align: center;
  border-top: 1px solid rgba(139, 233, 253, 0.12);
  color: rgba(255, 255, 255, 0.55);
  font-size: 14px;

  a {
    color: #8BE9FD;
    text-decoration: none;
    border-bottom: 1px dashed rgba(139, 233, 253, 0.4);
    transition: border-color 0.2s ease;
    &:hover { border-bottom-color: #8BE9FD; }
  }
}

/* ── Responsive: tablet + mobile ───────────────────────────────── */
@media (max-width: 768px) {
  .hero { padding-right: 1rem; padding-left: 1rem; }
  .layout { padding: 0 1rem; }
  .qButton { padding: 0.95rem 1rem; font-size: 14.5px; gap: 0.7rem; }
  .answer { padding: 0 1rem 1.05rem; font-size: 14px; }
  .answer :global(ul) { grid-template-columns: 1fr; gap: 0.4rem; }
  .answer :global(.lead-line) { font-size: 15px; }
  .answer :global(.manifesto) { padding: 0.85rem 1rem; }
  .answer :global(.manifesto) p { font-size: 14px; }
  .sectionHead { gap: 0.7rem; margin-bottom: 1.1rem; padding-bottom: 0.8rem; }
  .howItWorksBtn { font-size: 11.5px; padding: 7px 14px; }
  .section { margin-bottom: 2.6rem; }
  .items { gap: 10px; }
  .bottom { font-size: 13.5px; padding: 1.3rem 1rem; margin-top: 2.5rem; }
}

@media (max-width: 480px) {
  .eyebrow { padding: 5px 12px; margin-bottom: 1.1rem; }
  .qButton { padding: 0.9rem; font-size: 14px; }
  .chevWrap { width: 26px; height: 26px; }
  .answer { padding: 0 0.95rem 1rem; font-size: 13.5px; }
  .answer :global(.lead-line) { font-size: 14.5px; }
  .answer :global(.manifesto) { padding: 0.8rem 0.9rem; }
  .answer :global(.manifesto) p { font-size: 13.5px; }
  .howItWorksBtn { margin-left: 0; }
}
</style>

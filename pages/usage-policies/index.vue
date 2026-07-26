<template>
  <main class="page">
    <UserNav />

    <header class="hero">
      <div class="heroInner">
        <span class="eyebrow">Legal y Privacidad</span>
        <h1 class="heroTitle">Acuerdo de Uso y Políticas de Privacidad</h1>
        <p class="heroLead">
          Los términos que cubren el uso de la plataforma, contenido de terceros, datos, cookies e información de cuenta &mdash; en un solo lugar.
        </p>
        <p class="heroDates">
          <span><strong>Vigencia desde:</strong> 27 de marzo de 2024</span>
          <span class="heroDot">&middot;</span>
          <span><strong>Última actualización:</strong> 15 de junio de 2026</span>
        </p>
      </div>
    </header>

    <div class="layout">
      <aside class="toc" aria-label="Tabla de contenido">
        <span class="tocLabel">Secciones</span>
        <ul>
          <li v-for="s in sections" :key="s.id">
            <a
              :href="`#${s.id}`"
              @click="scrollTo($event, s.id)"
              :class="['tocLink', activeId === s.id ? 'tocLinkActive' : '']"
            >
              {{ s.title }}
            </a>
          </li>
        </ul>
      </aside>

      <div class="content">
        <section
          v-for="s in sections"
          :key="s.id"
          :id="s.id"
          class="section"
        >
          <header class="sectionHead">
            <span class="sectionMarker"></span>
            <h2>{{ s.title }}</h2>
          </header>
          <div class="prose" v-html="s.body"></div>
        </section>

      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import UserNav from '@/components/global/UserNav';

useHead({
  title: 'Políticas de Uso y Acuerdo de Privacidad',
  meta: [
    { name: 'description', content: 'Políticas de uso, términos de servicio y acuerdo de privacidad de la plataforma. Conocé cómo se manejan los datos y qué cubren estos términos.' },
    { property: 'og:title', content: 'Políticas de Uso y Acuerdo de Privacidad' },
  ],
});

const sections = [
  {
    id: 'introduction',
    title: '1. Introducción',
    body: `<p class="intro-clause">Esta plataforma técnica demostrativa se proporciona sin garantías de ningún tipo y está destinada exclusivamente a uso personal en línea, con fines no comerciales y sin ánimo de lucro. Lea detenidamente este acuerdo antes de utilizar la plataforma. Al acceder o utilizar este sitio &mdash; incluyendo su dominio, contenido o cualquier interacción &mdash; usted declara que acepta este acuerdo de usuario y que tiene 18 años de edad o más. El uso de la plataforma implica la aceptación plena y sin reservas de los presentes términos y condiciones, que entran en vigor de forma inmediata.</p>
<p>El usuario se compromete a utilizar la plataforma conforme a la legislación aplicable y a los términos aquí establecidos. Queda prohibido: intentar vulnerar o interferir con los sistemas de seguridad; utilizar la plataforma de forma que afecte su funcionamiento o rendimiento; desensamblar, descompilar o realizar ingeniería inversa sobre cualquier componente de la misma.</p>
<p>Si no está de acuerdo con estos términos, deberá abstenerse de utilizar la plataforma y cerrar todas sus ventanas.</p>`,
  },
  {
    id: 'disclaimer',
    title: '2. Exención de Responsabilidad',
    body: `<p>La plataforma recopila y presenta información de entretenimiento disponible públicamente con el objetivo de ofrecer resultados de búsqueda, recomendaciones y metadatos sobre películas y series. Aunque se procura mantener la exactitud y relevancia de los datos, pueden existir errores, omisiones o referencias a contenido sensible o para adultos.</p>
<p>El uso e interpretación de cualquier resultado, metadato o información de terceros es responsabilidad exclusiva del usuario. <strong>En ningún caso la plataforma, sus colaboradores o afiliados serán responsables por daños indirectos, incidentales, especiales, consecuenciales o punitivos derivados del uso de la plataforma o de los datos procesados a través de ella.</strong></p>`,
  },
  {
    id: 'external-links',
    title: '3. Enlaces y Contenido Externo',
    body: `<p>Algunas secciones pueden incluir enlaces generados automáticamente hacia dominios o aplicaciones de terceros donde podría encontrarse contenido audiovisual o metadatos relacionados. Estos enlaces se generan de forma programática mediante APIs abiertas o protocolos estándar, basados en identificadores públicos (como IMDb ID), y se ofrecen <strong>exclusivamente con fines informativos y de indexación</strong>.</p>
<p>La plataforma no aloja, almacena, transmite ni reproduce contenido audiovisual. Funciona únicamente como un <strong>indexador sin fines de lucro de información de acceso público</strong>. Las URL externas o enlaces de protocolo se muestran automáticamente como parte de metadatos obtenidos de fuentes públicas, sin intervención editorial.</p>
<p>El acceso a servicios o plataformas externas es opcional y bajo exclusiva responsabilidad del usuario. La plataforma no ejerce control sobre la legalidad, contenido o funcionamiento de dichos servicios y <strong>no promueve ni respalda la infracción de derechos de autor ni la distribución no autorizada de contenido protegido</strong>.</p>
<p>Cualquier acción realizada en sitios de terceros se rige por sus propios términos y políticas. La plataforma no asume responsabilidad por el contenido externo ni por las consecuencias derivadas de su acceso.</p>
<p>Estas referencias se incluyen <em>de buena fe</em> con el objetivo de enriquecer la experiencia del usuario. La plataforma está orientada al descubrimiento, no a la distribución.</p>`,
  },
  {
    id: 'privacy',
    title: '4. Política de Privacidad',
    body: `<p>La plataforma no vende ni comparte datos personales con fines comerciales. La información proporcionada voluntariamente se utiliza exclusivamente para funcionalidades como listas, preferencias o sincronización de cuenta.</p>
<p>La autenticación se gestiona mediante <strong>Google OAuth</strong> y sistemas propios. No se comparten datos sensibles con terceros.</p>
<p>Pueden recopilarse datos analíticos anónimos con fines de mejora del servicio.</p>`,
  },
  {
    id: 'data-sources',
    title: '5. Fuentes de Datos y Atribuciones',
    body: `<p>La plataforma integra datos provenientes de APIs públicas y proveedores de metadatos. Todas las marcas y activos pertenecen a sus respectivos titulares. La información se presenta bajo criterios de uso legítimo y sin fines comerciales. Los titulares de derechos o editores que deseen solicitar la exclusión de su contenido (<em>opt-out</em>) pueden ponerse en contacto según lo indicado en la <strong>Sección 8</strong>.</p>
<p><strong>Cobertura de datos de festivales:</strong> se recopilan programaciones a partir de fuentes públicas. La disponibilidad de datos puede ser incompleta, especialmente en el caso de cortometrajes. Como resultado, la cantidad de títulos mostrados para un festival puede diferir de su programación oficial. Estas diferencias responden a limitaciones técnicas y no a decisiones editoriales.</p>
<p><strong>Agregación de noticias:</strong> los contenidos se obtienen de fuentes RSS públicas con fines de indexación. No se modifican las noticias de origen y se muestra únicamente la información proporcionada por dichas fuentes (como título, descripción y metadatos), en el formato en que estas son distribuidas. No es posible leer artículos completos dentro de la plataforma: toda interacción redirige al sitio original, siendo este el único entorno donde puede accederse al contenido íntegro, garantizando que el tráfico, las impresiones y la monetización correspondan exclusivamente al medio editorial. Adicionalmente, la plataforma puede publicar contenidos editoriales propios generados de forma automatizada o asistida a partir de múltiples fuentes públicas. Dichos contenidos pueden implicar procesos de síntesis, reformulación o estructuración automática de la información original, sin que ello implique una reproducción literal ni una correspondencia exacta con las fuentes de origen, y se ofrecen exclusivamente con fines informativos, pudiendo contener errores, omisiones, imprecisiones, inconsistencias o interpretaciones no intencionales respecto de las fuentes de origen. Las imágenes se utilizan únicamente con fines de identificación bajo principios de uso legítimo.</p>
<p><strong>Artículos editoriales exclusivos para la comunidad (vigente desde el 1 de julio de 2026):</strong> algunas piezas editoriales publicadas a partir de esa fecha pueden marcarse como exclusivas para la comunidad. Estos artículos siguen presentes íntegramente en el feed RSS público en cuanto a título, descripción, categoría editorial, imagen de portada y metadatos de temas; sin embargo, el cuerpo completo del artículo solo se entrega a quienes hayan iniciado sesión con una cuenta gratuita en la plataforma. El ítem del feed invita explícitamente al lector a iniciar sesión o crear una cuenta gratuita para leer el artículo completo. <strong>La plataforma no cobra ninguna suscripción ni tarifa, no exige tarjeta de crédito ni de débito, y se mantiene como un servicio de código abierto y gratuito para todos los lectores.</strong> Todos los artículos publicados antes del 1 de julio de 2026, así como cualquier artículo que no lleve esta marca, permanecen completamente públicos tanto en la web como en el RSS.</p>
<p>Iconos y recursos gráficos bajo licencia Creative Commons Attribution 4.0. Datos proporcionados por TMDB, JustWatch, MDBList y Trakt.</p>`,
  },
  {
    id: 'general',
    title: '6. Condiciones Generales',
    body: `<p>Este es un proyecto en desarrollo continuo y se reserva el derecho de modificar estos términos en cualquier momento. El uso continuado implica la aceptación de la versión vigente.</p>`,
  },
  {
    id: 'cookies',
    title: '7. Uso de Cookies',
    body: `<p>Esta plataforma utiliza cookies y tecnologías similares de almacenamiento local. Se pueden gestionar las preferencias en cualquier momento desde el enlace de configuración de cookies en el pie de página o el banner de consentimiento mostrado en la primera visita.</p>
<div class="cookie-table-wrapper">
  <table class="cookie-table">
    <thead>
      <tr>
        <th>Categoría</th>
        <th>Propósito</th>
        <th>Ejemplos</th>
        <th>Duración</th>
        <th>Obligatoria</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Esenciales</strong></td>
        <td>Autenticación, gestión de sesión, seguridad y funcionalidad básica del sitio</td>
        <td>Tokens de inicio de sesión, protección CSRF, preferencias de consentimiento</td>
        <td>Sesión &ndash; 1 año</td>
        <td>Sí</td>
      </tr>
      <tr>
        <td><strong>Analíticas</strong></td>
        <td>Estadísticas de uso para entender cómo se utiliza la plataforma e identificar áreas de mejora</td>
        <td>Páginas visitadas, patrones de navegación, uso de funciones</td>
        <td>Hasta 2 años</td>
        <td>No &mdash; opt-in</td>
      </tr>
      <tr>
        <td><strong>Personalización</strong></td>
        <td>Recuerda preferencias y contexto de navegación para una experiencia adaptada</td>
        <td>Secciones visitadas recientemente</td>
        <td>Hasta 1 año</td>
        <td>No &mdash; opt-in</td>
      </tr>
    </tbody>
  </table>
</div>
<p><strong>Terceros:</strong> esta plataforma no vende ni comparte datos de cookies con terceros con fines publicitarios. Si se activan servicios de analítica, los datos anonimizados podrán ser procesados por proveedores externos de analítica bajo sus respectivas políticas de privacidad.</p>
<p><strong>Gestión de preferencias:</strong> las preferencias de cookies se pueden cambiar en cualquier momento haciendo clic en &ldquo;Preferencias de Cookies&rdquo; en el pie de página del sitio. También se pueden gestionar desde la configuración del navegador &mdash; tener en cuenta que desactivar las cookies esenciales puede afectar el funcionamiento del sitio.</p>`,
  },
  {
    id: 'contact',
    title: '8. Contacto',
    body: `<p>Para consultas sobre estos términos o políticas, escribir a <a href="mailto:hello@cinemagoria.com">hello@cinemagoria.com</a>.</p>`,
  },
];

const activeId = ref(sections[0].id);

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
    { rootMargin: '-30% 0px -55% 0px', threshold: 0 },
  );
  sections.forEach((s) => {
    const el = document.getElementById(s.id);
    if (el) observer.observe(el);
  });
});
onBeforeUnmount(() => { observer && observer.disconnect(); });
</script>

<style scoped lang="scss">
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
  margin: 0 auto 1.2rem;
  max-width: var(--page-subtitle-measure);
  font-weight: var(--page-subtitle-weight);
  text-wrap: pretty;
}

.heroDates {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
  justify-content: center;
  font-size: 12px;
  color: #a0aab2;
  margin: 0;

  strong {
    color: #e0e6ed;
    font-weight: 600;
  }
}

.heroDot {
  color: rgba(139, 233, 253, 0.5);
}

/* ── Layout ─────────────────────────────────────────────────────── */
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

/* ── TOC ────────────────────────────────────────────────────────── */
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
  margin-bottom: 3.5rem;

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

/* ── Prose body ────────────────────────────────────────────────── */
.prose {
  font-size: 15px;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.78);
  font-weight: 300;

  :deep(> * + *) { margin-top: 1.1rem; }
  :deep(p) { margin: 0; }
  :deep(strong) { color: #fff; font-weight: 600; }
  :deep(a) {
    color: #8BE9FD;
    text-decoration: none;
    border-bottom: 1px dashed rgba(139, 233, 253, 0.4);
    transition: border-color 0.2s ease;
    &:hover { border-bottom-color: #8BE9FD; }
  }

}

/* ── Cookie table ──────────────────────────────────────────────── */
.prose :deep(.cookie-table-wrapper) {
  margin: 1.6rem 0;
  background: rgba(3, 4, 6, 0.55);
  background-image:
    radial-gradient(circle at 15% 0%, rgba(31, 84, 103, 0.18), transparent 50%);
  border: 1px solid rgba(139, 233, 253, 0.18);
  border-radius: 14px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
}

.prose :deep(.cookie-table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0;
  text-transform: none;
  line-height: 1.6;
}

.prose :deep(.cookie-table th),
.prose :deep(.cookie-table td) {
  padding: 12px 14px;
  text-align: left;
  border-bottom: 1px solid rgba(139, 233, 253, 0.08);
  vertical-align: top;
}

.prose :deep(.cookie-table th) {
  background: rgba(139, 233, 253, 0.06);
  color: #8BE9FD;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  white-space: nowrap;
  border-bottom: 1px solid rgba(139, 233, 253, 0.22);
}

.prose :deep(.cookie-table td) {
  color: rgba(255, 255, 255, 0.75);
}

.prose :deep(.cookie-table td strong) {
  color: #fff;
  font-weight: 600;
}

.prose :deep(.cookie-table tbody tr:last-child td) {
  border-bottom: none;
}

.prose :deep(.cookie-table tbody tr:hover) {
  background: rgba(139, 233, 253, 0.03);
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

/* ── Responsive ────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .hero { padding-right: 1rem; padding-left: 1rem; }
  .heroDates { font-size: 11.5px; }
  .layout { padding: 0 1rem; }
  .prose { font-size: 14px; line-height: 1.7; }
  .prose :deep(.intro-clause) { font-size: 13.5px; padding: 1rem 1.1rem; }
  .prose :deep(.cookie-table th),
  .prose :deep(.cookie-table td) { padding: 10px 12px; }
  .prose :deep(.cookie-table th) { font-size: 10px; }
  .prose :deep(.cookie-table) { font-size: 12.5px; }
  .sectionHead { gap: 0.7rem; margin-bottom: 1.1rem; padding-bottom: 0.8rem; }
  .section { margin-bottom: 2.6rem; }
  .bottom { font-size: 13.5px; padding: 1.3rem 1rem; margin-top: 2.5rem; }
}

@media (max-width: 600px) {
  .prose :deep(.cookie-table-wrapper) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .prose :deep(.cookie-table) {
    min-width: 560px;
  }
}
</style>

<template>
  <main :class="$style.page">
    <UserNav />

    <header :class="$style.hero">
      <div :class="$style.heroInner">
        <span :class="$style.eyebrow">Reference</span>
        <h1 :class="$style.heroTitle">FAQ</h1>
        <p :class="$style.heroLead">
          Editorial framework, discovery infrastructure and the moving parts behind the platform &mdash; explained in one place.
        </p>
      </div>
    </header>

    <div :class="$style.layout">
      <aside :class="$style.toc" aria-label="Table of contents">
        <span :class="$style.tocLabel">Topics</span>
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
              <span>How it works</span>
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
          <p>Still curious? <nuxt-link to="/contact">Reach out through the contact form</nuxt-link>.</p>
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
  title: 'FAQ — Knowledge Base',
  meta: [
    { name: 'description', content: 'Editorial framework, N.O.I.R., Spotlight, festival-first discovery, accounts, metadata sources and the technical foundations behind the platform.' }
  ]
});

const sections = [
  {
    id: 'general',
    title: 'General',
    items: [
      {
        q: 'What is this platform about?',
        a: `<p>A discovery layer for film and television built on aggregation, editorial curation and festival-driven attention. Metadata, ratings, reviews, soundtrack data, awards history and streaming availability arrive from multiple industry sources, integrated into a single experience designed for contemporary film culture.</p>`
      },
      {
        q: 'Is content streamed or hosted here?',
        a: `<p>No. Availability is indexed from third-party providers and legal viewing options are surfaced when verified. There is no proprietary catalog &mdash; structured data flows in from <strong>IMDb</strong>, <strong>TMDB</strong>, <strong>Rotten Tomatoes</strong>, <strong>Trakt.tv</strong>, <strong>MusicBrainz</strong>, <strong>JustWatch</strong> and <strong>MDBList</strong>.</p>`
      }
    ]
  },
  {
    id: 'noir',
    title: 'N.O.I.R.',
    items: [
      {
        q: 'What is N.O.I.R.?',
        a: `<p class="lead-line"><strong>N.O.I.R. &mdash; <em>Nothing Out Is Ready</em>.</strong></p>
<p>The highest curatorial layer on the platform and its most actively developed feature. From early premieres to a permanent archive, N.O.I.R. catalogs emerging titles from <strong>2024 onward</strong> considered culturally, aesthetically or creatively significant within the editorial framework.</p>
<p>The dedicated archive at <a href="/noir" class="inline-link">/noir</a> is open to read. An account is only needed to clone it into a personal list.</p>`
      },
      {
        q: 'How does a title enter N.O.I.R., and how does it move through the platform?',
        a: `<p>Most candidates originate from festival ecosystems, premiere reactions, acquisition tracking and an internal pipeline of workflows, datasets, enrichment scripts and editorial analysis. Festivals are the upstream signal layer &mdash; <strong>Sundance, Rotterdam, Berlinale, Romford Horror, Slamdance, SXSW, BIFFF, BAFICI, CUFF, Cannes, Tribeca, BIFAN, KVIFF, Fantasia, Locarno, FrightFest, Venice</strong> and <strong>TIFF</strong> all feed the selection, with more festivals joining the rotation throughout 2026.</p>
<p>Once recognized, a title is promoted to the primary editorial slot at the top of the homepage &mdash; a rotating showcase of N.O.I.R.-certified works near or just before release. The seal appears on each card and links directly to the full archive.</p>
<p>Roughly a week after a title becomes broadly available, it leaves that primary rotation and enters the <strong>permanent N.O.I.R. archive</strong> at <a href="/noir" class="inline-link">/noir</a>, organized by year and form. Many titles continue inside <strong>Spotlight</strong>, the homepage&rsquo;s secondary editorial surface &mdash; roughly seventy percent of Spotlight entries passed through the primary rotation first.</p>
<p>Removal from the rotation never means removal from the archive. The archive is additive.</p>`
      },
      {
        q: 'What kind of titles are included, and what does the N.O.I.R. seal represent?',
        a: `<p>Selection skews toward auteur cinema, elevated genre, international festival discoveries, independent productions and culturally distinctive works &mdash; primarily <strong>contemporary horror, psychological thrillers, science fiction</strong> and <strong>mature drama</strong>, with European and Latin American festival cinema occupying a meaningful share. Large-scale productions appear only when they align with the editorial framework.</p>
<p>The seal marks formal induction into that selection &mdash; awarded for editorial relevance, artistic identity, festival trajectory, genre innovation or long-term cultural potential rather than commercial scale. Once awarded, it stays with the title in perpetuity.</p>`
      }
    ]
  },
  {
    id: 'spotlight',
    title: 'Spotlight & Discovery',
    items: [
      {
        q: 'What is Spotlight?',
        a: `<p>The homepage&rsquo;s long-form discovery surface for emerging and editorially relevant titles. Spotlight is curated rather than algorithmic: festival discoveries, auteur projects, elevated genre, psychological thrillers, contemporary horror, mature drama and significant independent releases all live here.</p>
<p>Many entries arrive after a stint in the primary editorial rotation and continue to surface long after their initial promotion period concludes &mdash; before settling permanently into the archive.</p>`
      },
      {
        q: 'What does “festival-first discovery” mean?',
        a: `<p>Festivals are treated as active engines, not metadata categories. Major festivals receive dedicated infrastructure, premiere tracking, contextual navigation and continuously updated coverage. Their programming directly feeds the editorial selection systems.</p>`
      },
      {
        q: 'Which festivals are currently covered?',
        a: `<p>Active coverage from <strong>2026 onwards</strong>, with each edition picked up year over year:</p>
<ul class="festival-list">
  <li><a href="/festival/sundance-2026" class="inline-link">Sundance</a> &middot; Park City</li>
  <li><a href="/festival/rotterdam-2026" class="inline-link">Rotterdam</a> &middot; Rotterdam</li>
  <li><a href="/festival/berlinale-2026" class="inline-link">Berlinale</a> &middot; Berlin</li>
  <li><a href="/festival/romford-2026" class="inline-link">Romford Horror</a> &middot; Romford</li>
  <li><a href="/festival/slamdance-2026" class="inline-link">Slamdance</a> &middot; Park City</li>
  <li><a href="/festival/sxsw-2026" class="inline-link">SXSW</a> &middot; Austin</li>
  <li><a href="/festival/bifff-2026" class="inline-link">BIFFF</a> &middot; Brussels</li>
  <li><a href="/festival/bafici-2026" class="inline-link">BAFICI</a> &middot; Buenos Aires</li>
  <li><a href="/festival/cuff-2026" class="inline-link">CUFF</a> &middot; Calgary</li>
  <li><a href="/festival/cannes-2026" class="inline-link">Cannes</a> &middot; Cannes</li>
  <li><a href="/festival/tribeca-2026" class="inline-link">Tribeca</a> &middot; New York</li>
  <li><a href="/festival/bifan-2026" class="inline-link">BIFAN</a> &middot; Bucheon</li>
  <li><a href="/festival/kviff-2026" class="inline-link">KVIFF</a> &middot; Karlovy Vary</li>
  <li><a href="/festival/fantasia-2026" class="inline-link">Fantasia</a> &middot; Montr&eacute;al</li>
  <li><a href="/festival/locarno-2026" class="inline-link">Locarno</a> &middot; Locarno</li>
  <li><a href="/festival/frightfest-2026" class="inline-link">FrightFest</a> &middot; London</li>
  <li><a href="/festival/venice-2026" class="inline-link">Venice</a> &middot; Venice</li>
  <li><a href="/festival/tiff-2026" class="inline-link">TIFF</a> &middot; Toronto</li>
</ul>
<p>The full hub lives at <a href="/festival" class="inline-link">/festival</a>.</p>`
      },
      {
        q: 'Which festivals are scheduled to join the coverage?',
        a: `<p>Still to join during 2026, in calendar order:</p>
<ul>
  <li><strong>BIFF</strong> &middot; Busan International Film Festival</li>
  <li><strong>BFI London</strong> &middot; BFI London Film Festival</li>
  <li><strong>Sitges</strong> &middot; International Fantastic Film Festival of Catalonia</li>
  <li><strong>Cairo</strong> &middot; Cairo International Film Festival</li>
  <li><strong>Mar del Plata</strong> &middot; International Film Festival</li>
  <li><strong>BARS</strong> &middot; Buenos Aires Rojo Sangre</li>
  <li><strong>Marrakech</strong> &middot; Marrakech International Film Festival</li>
  <li><strong>Red Sea</strong> &middot; Red Sea International Film Festival</li>
</ul>
<p>Each edition is picked up again the following year. The list is indicative &mdash; additions and adjustments happen as scope and resources evolve.</p>`
      },
      {
        q: 'Why do some festivals show fewer titles than the official lineup?',
        a: `<p>Festival catalogs are built from public metadata and third-party sources, which don&rsquo;t always cover every title &mdash; particularly <strong>short films, experimental works and regional productions</strong>.</p>
<p>This is a technical limitation, not an editorial decision. No film is intentionally omitted or censored. Most feature-length works are present; gaps tend to concentrate in shorts and outlier programmes. Coverage improves as upstream metadata catches up.</p>`
      }
    ]
  },
  {
    id: 'accounts',
    title: 'Accounts & Profiles',
    items: [
      {
        q: 'Is an account required?',
        a: `<p>Most discovery is open. An account enables watchlists, ratings, follows, notifications, custom lists, saved articles, episode progress tracking and full N.O.I.R. participation.</p>`
      },
      {
        q: 'Are profiles public? Can lists be private or cloned?',
        a: `<p>Profiles can expose public activity, curated lists and social connections, with configurable privacy controls. Custom lists support both visibility states; any public list can be duplicated into a personal library and edited independently.</p>`
      },
      {
        q: 'Can accounts be deleted?',
        a: `<p>Yes. Deletion is fully self-managed and permanently removes profile data.</p>`
      }
    ]
  },
  {
    id: 'search',
    title: 'Search & Metadata',
    items: [
      {
        q: 'Are direct IMDb / TMDB lookups supported?',
        a: `<p>Yes. The search system resolves both identifiers directly.</p>`
      },
      {
        q: 'Why do ratings sometimes show different sources?',
        a: `<p>IMDb is the primary rating source when available. When it isn&rsquo;t, TMDB takes its place, with explicit attribution to keep the source transparent.</p>`
      }
    ]
  },
  {
    id: 'notifications',
    title: 'Notifications & Tracking',
    items: [
      {
        q: 'Who and what can be followed?',
        a: `<ul>
  <li>Actors</li>
  <li>Directors</li>
  <li>Writers</li>
  <li>Television series</li>
  <li>Production companies</li>
  <li>Streaming platforms</li>
</ul>`
      },
      {
        q: 'How are release alerts produced?',
        a: `<p>Background workers continuously monitor release activity, episode rollouts and projects associated with followed entities. Alerts then sync across devices.</p>`
      },
      {
        q: 'Can episode-level progress be tracked?',
        a: `<p>Yes &mdash; granular tracking down to the episode.</p>`
      }
    ]
  },
  {
    id: 'editorial',
    title: 'News & Editorial',
    items: [
      {
        q: 'Is the editorial system AI-generated?',
        a: `<p>AI-assisted, not AI-autonomous. Automation supports enrichment, ranking and classification; direction and curation remain platform-controlled. Articles are structured and contextualized internally rather than relayed from raw feeds.</p>`
      }
    ]
  },
  {
    id: 'technical',
    title: 'Technical',
    items: [
      {
        q: 'What powers the platform?',
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
        q: 'Why is performance treated as a product feature?',
        a: `<p>Concurrent fetching, pre-computed enrichment, layered caching, background processing and server-side editorial selection are core to the architecture &mdash; they minimize request-time overhead and keep discovery feeling immediate.</p>`
      },
      {
        q: 'Are multiple languages supported?',
        a: `<p>English and Spanish, served through subdomain-based internationalization.</p>`
      }
    ]
  },
  {
    id: 'philosophy',
    title: 'Philosophy',
    items: [
      {
        q: 'Why isn’t this purely algorithmic?',
        a: `<p>Film culture is treated as an evolving ecosystem, not an engagement-driven feed. The model is hybrid: algorithmic discovery layered with editorial perspective and contextual curation.</p>`
      },
      {
        q: 'What does “aggregation over exclusivity” mean?',
        a: `<p>A core operating principle &mdash; integrating and contextualizing trusted external sources rather than replacing them with a closed proprietary database. The platform operates as a discovery and editorial-intelligence layer for contemporary cinema culture.</p>`
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

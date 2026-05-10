<template>
  <main :class="$style.page">
    <UserNav />

    <header :class="$style.hero">
      <div :class="$style.heroInner">
        <span :class="$style.eyebrow">Knowledge Base</span>
        <h1 :class="$style.title">FAQ</h1>
        <p :class="$style.lead">
          Editorial framework, discovery infrastructure and the moving parts behind
          the platform &mdash; explained in one place.
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
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
              <span>How It Works?</span>
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
                <svg :class="$style.chev" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
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
  title: 'FAQ — Cinemagoria',
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
        a: `<p>Cinemagoria is a discovery layer for film and television built on aggregation, editorial curation and festival-driven attention. Metadata, ratings, reviews, soundtrack data, awards history and streaming availability arrive from multiple industry sources, integrated into a single experience designed for contemporary film culture.</p>`
      },
      {
        q: 'What sets it apart from IMDb or Letterboxd?',
        a: `<p>Editorial intelligence rather than passive cataloging. Discovery is biased toward emerging cinema, international auteurs, genre filmmaking and culturally significant releases &mdash; not raw popularity.</p>
<p>The model layers cross-provider metadata, hand-curated selections, AI-assisted news, follow-based release tracking and a permanent archival layer (N.O.I.R.) on top of a unified search.</p>`
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
<blockquote class="manifesto">
  <span class="manifesto-mark">N.O.I.R.</span>
  <p>N.O.I.R. dwells in the undefined; it exists before it.</p>
  <p>The work matters in its state prior to assimilation.</p>
</blockquote>
<p>Aesthetic identity leans into contemporary horror, psychological thrillers, science fiction, mature drama, festival cinema and auteur-driven filmmaking.</p>
<p>Access to the dedicated archive at <a href="/noir" class="inline-link">/noir</a> requires an authenticated account.</p>`
      },
      {
        q: 'How does a title enter N.O.I.R., and how does it move through the platform?',
        a: `<p>Most candidates originate from festival ecosystems, premiere reactions, acquisition tracking and an internal pipeline of workflows, datasets, enrichment scripts and editorial analysis. Festivals are the upstream signal layer &mdash; <strong>Sundance, Berlinale, Rotterdam, BIFFF, SXSW, BAFICI, Cannes, CUFF, Tribeca, Slamdance</strong> and <strong>Romford Horror</strong> all feed the selection, with more festivals joining the rotation throughout 2026.</p>
<p>Once recognized, a title is promoted to the primary editorial slot at the top of the homepage &mdash; a rotating showcase of N.O.I.R.-certified works near or just before release. The N.O.I.R. seal appears on each card and links directly to the full archive.</p>
<p>Roughly a week after a title becomes broadly available, it leaves that primary rotation. From that moment two things happen:</p>
<ul>
  <li>It enters the <strong>permanent N.O.I.R. archive</strong> at <a href="/noir" class="inline-link">/noir</a>, organized by year and form (film or series).</li>
  <li>It frequently transitions into <strong>Spotlight</strong>, the homepage&rsquo;s secondary editorial surface &mdash; roughly seventy percent of Spotlight titles passed through the primary rotation first.</li>
</ul>
<p>Removal from the rotation never means removal from the archive. The archive is additive.</p>
<blockquote class="manifesto">
  <span class="manifesto-mark">II. Selection Criteria</span>
  <p>Not a catalog, but a recognition of signals. Only what disrupts and transcends remains.</p>
  <p>The selection is never static; it evolves and shifts. Nothing disappears, everything becomes part of the archive.</p>
</blockquote>`
      },
      {
        q: 'What does the N.O.I.R. seal represent?',
        a: `<p>Formal induction into the editorial selection. The seal is awarded for editorial relevance, artistic identity, festival trajectory, genre innovation or long-term cultural potential &mdash; not commercial scale. Once awarded, the seal stays with the title in perpetuity.</p>`
      },
      {
        q: 'What kind of titles are included in N.O.I.R.?',
        a: `<p>Primarily auteur cinema, elevated genre, international festival discoveries, independent productions and culturally distinctive works. Large-scale productions appear only when they align with the editorial framework.</p>
<p>A snapshot of the active rotation skews heavily toward <strong>horror, thriller, science fiction</strong> and <strong>mature drama</strong> &mdash; with European and Latin American festival cinema occupying a meaningful share.</p>`
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
  <li><a href="/festival/berlinale-2026" class="inline-link">Berlinale</a> &middot; Berlin</li>
  <li><a href="/festival/rotterdam-2026" class="inline-link">Rotterdam</a> &middot; Rotterdam</li>
  <li><a href="/festival/bifff-2026" class="inline-link">BIFFF</a> &middot; Brussels</li>
  <li><a href="/festival/sxsw-2026" class="inline-link">SXSW</a> &middot; Austin</li>
  <li><a href="/festival/bafici-2026" class="inline-link">BAFICI</a> &middot; Buenos Aires</li>
  <li><a href="/festival/cannes-2026" class="inline-link">Cannes</a> &middot; Cannes</li>
  <li><a href="/festival/cuff-2026" class="inline-link">CUFF</a> &middot; Calgary</li>
  <li><a href="/festival/tribeca-2026" class="inline-link">Tribeca</a> &middot; New York</li>
  <li><a href="/festival/slamdance-2026" class="inline-link">Slamdance</a> &middot; Park City</li>
  <li><a href="/festival/romford-2026" class="inline-link">Romford Horror</a> &middot; Romford</li>
</ul>
<p>The full hub lives at <a href="/festival" class="inline-link">/festival</a>.</p>`
      },
      {
        q: 'Which festivals are scheduled to join the coverage?',
        a: `<p>Planned 2026 additions, with continuing coverage in 2027, 2028 and beyond:</p>
<ul>
  <li><strong>KVIFF</strong> &middot; Karlovy Vary International Film Festival</li>
  <li><strong>Venezia</strong> &middot; La Biennale di Venezia</li>
  <li><strong>TIFF</strong> &middot; Toronto International Film Festival</li>
  <li><strong>NYFF</strong> &middot; New York Film Festival</li>
  <li><strong>Sitges</strong> &middot; International Fantastic Film Festival of Catalonia</li>
  <li><strong>BFI London</strong> &middot; BFI London Film Festival</li>
  <li><strong>Mar del Plata</strong> &middot; International Film Festival</li>
  <li><strong>BARS</strong> &middot; Buenos Aires Rojo Sangre</li>
  <li><strong>Fantasia</strong> &middot; Montr&eacute;al</li>
</ul>
<p>The list is indicative &mdash; additions and adjustments happen as scope and resources evolve.</p>`
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
  <li>Railway</li>
  <li>Vercel</li>
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
        a: `<p>A core operating principle &mdash; integrating and contextualizing trusted external sources rather than replacing them with a closed proprietary database. Cinemagoria operates as a discovery and editorial-intelligence layer for contemporary cinema culture.</p>`
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

.page {
  position: relative;
  min-height: 100vh;
  background:
    radial-gradient(ellipse at 20% -10%, rgba(139, 233, 253, 0.08) 0%, transparent 55%),
    radial-gradient(ellipse at 90% 0%, rgba(139, 233, 253, 0.05) 0%, transparent 50%),
    linear-gradient(180deg, #02080d 0%, #010406 100%);
  color: rgba(255, 255, 255, 0.86);
  padding-bottom: 6rem;
}

.hero {
  padding: 5rem 1.5rem 3rem;
  text-align: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 60%;
    height: 1px;
    transform: translateX(-50%);
    background: linear-gradient(90deg, transparent, rgba(139, 233, 253, 0.3), transparent);
  }
}

.heroInner {
  max-width: 760px;
  margin: 0 auto;
}

.eyebrow {
  display: inline-block;
  font-size: 0.95rem;
  letter-spacing: 3.5px;
  text-transform: uppercase;
  color: #8BE9FD;
  font-weight: 700;
  padding: 0.45rem 1.1rem;
  border: 1px solid rgba(139, 233, 253, 0.35);
  border-radius: 999px;
  background: rgba(139, 233, 253, 0.06);
  box-shadow: 0 0 14px rgba(139, 233, 253, 0.15);
}

.title {
  font-size: clamp(4rem, 9vw, 6.4rem);
  font-weight: 800;
  margin: 1.6rem 0 1.1rem;
  letter-spacing: -2px;
  line-height: 1;
  background: linear-gradient(180deg, #ffffff 0%, #8BE9FD 95%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 40px rgba(139, 233, 253, 0.18);
}

.lead {
  font-size: 1.45rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.7);
  max-width: 640px;
  margin: 0 auto;
}

.layout {
  max-width: 1180px;
  margin: 3rem auto 0;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 3.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.toc {
  align-self: start;
  position: sticky;
  top: 100px;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  @media (max-width: 1024px) {
    position: relative;
    top: auto;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    margin: 0 -1.5rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;

    ul {
      flex-direction: row;
      gap: 0.5rem;
      flex-wrap: nowrap;
      min-width: max-content;
    }
  }
}

.tocLabel {
  display: block;
  font-size: 0.85rem;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 700;
  margin-bottom: 0.9rem;
  padding: 0 0.9rem;

  @media (max-width: 1024px) { display: none; }
}

.tocLink {
  display: block;
  padding: 0.7rem 1rem;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  border-radius: 8px;
  border-left: 2px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: #fff;
    background: rgba(139, 233, 253, 0.05);
  }

  @media (max-width: 1024px) {
    padding: 0.6rem 1rem;
    border: 1px solid rgba(139, 233, 253, 0.14);
    border-left: 1px solid rgba(139, 233, 253, 0.14);
    font-size: 1rem;
  }
}

.tocLinkActive {
  color: #8BE9FD;
  background: rgba(139, 233, 253, 0.08);
  border-left-color: #8BE9FD;
  box-shadow: inset 0 0 12px rgba(139, 233, 253, 0.06);

  @media (max-width: 1024px) {
    border-color: #8BE9FD;
    border-left-color: #8BE9FD;
  }
}

.content {
  min-width: 0;
}

.section {
  scroll-margin-top: 90px;
  margin-bottom: 4.5rem;

  &:last-of-type { margin-bottom: 2rem; }
}

.sectionHead {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.6rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(139, 233, 253, 0.14);

  h2 {
    font-size: clamp(1.9rem, 3.4vw, 2.4rem);
    font-weight: 700;
    color: #fff;
    margin: 0;
    letter-spacing: -0.3px;
  }
}

.howItWorksBtn {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.55rem 1.1rem;
  border-radius: 999px;
  border: 1.5px solid #8BE9FD;
  background: rgba(139, 233, 253, 0.1);
  color: #8BE9FD;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 0 14px rgba(139, 233, 253, 0.2), 0 4px 12px rgba(0, 0, 0, 0.45);

  svg { flex-shrink: 0; }

  &:hover {
    background: rgba(139, 233, 253, 0.22);
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 0 22px rgba(139, 233, 253, 0.5), 0 6px 16px rgba(0, 0, 0, 0.55);
  }
}

.sectionMarker {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #8BE9FD;
  box-shadow: 0 0 14px rgba(139, 233, 253, 0.75);
  flex-shrink: 0;
}

.items {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.item {
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(139, 233, 253, 0.12);
  border-radius: 14px;
  overflow: hidden;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  box-shadow:
    inset 0 0 24px rgba(0, 0, 0, 0.4),
    0 6px 18px rgba(0, 0, 0, 0.45);

  &:hover {
    border-color: rgba(139, 233, 253, 0.25);
  }
}

.itemOpen {
  border-color: rgba(139, 233, 253, 0.4);
  box-shadow:
    inset 0 0 24px rgba(0, 0, 0, 0.5),
    0 8px 26px rgba(0, 0, 0, 0.6),
    0 0 22px rgba(139, 233, 253, 0.08);

  .chev { transform: rotate(180deg); color: #8BE9FD; }
}

.qButton {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.2rem;
  padding: 1.4rem 1.6rem;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover { background: rgba(139, 233, 253, 0.04); }
}

.qText {
  flex: 1;
  line-height: 1.4;
}

.chev {
  color: rgba(139, 233, 253, 0.55);
  flex-shrink: 0;
  transition: transform 0.3s ease, color 0.3s ease;
}

.answerWrap {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.itemOpen .answerWrap {
  max-height: 2400px;
}

.answer {
  font-size: 1.18rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.82);
  padding: 0.4rem 1.6rem 1.6rem;

  > * { margin: 0; }

  > * + * { margin-top: 1rem; }

  :global(strong) { color: #fff; font-weight: 600; }

  :global(.lead-line) {
    font-size: 1.35rem;
    color: rgba(255, 255, 255, 0.95);
    em { color: #8BE9FD; font-style: normal; letter-spacing: 0.5px; }
  }

  :global(ul) {
    list-style: none;
    padding-left: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.5rem 1.2rem;
  }

  :global(.festival-list) {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }

  :global(li) {
    position: relative;
    padding-left: 1.3rem;
    color: rgba(255, 255, 255, 0.82);
    line-height: 1.5;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.65rem;
      width: 7px;
      height: 7px;
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
    margin: 1.3rem 0;
    padding: 1.2rem 1.4rem 1.2rem 1.6rem;
    border-left: 3px solid #8BE9FD;
    background: rgba(139, 233, 253, 0.04);
    border-radius: 0 10px 10px 0;
    color: rgba(255, 255, 255, 0.9);
    font-style: italic;
    box-shadow: inset 0 0 28px rgba(0, 0, 0, 0.3);

    p { margin: 0; line-height: 1.6; font-size: 1.12rem; }
    p + p { margin-top: 0.5rem; }
  }

  :global(.manifesto-mark) {
    display: block;
    font-style: normal;
    font-size: 0.78rem;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #8BE9FD;
    font-weight: 700;
    margin-bottom: 0.55rem;
  }
}

.bottom {
  margin-top: 3.5rem;
  padding: 1.8rem;
  text-align: center;
  border-top: 1px solid rgba(139, 233, 253, 0.1);
  color: rgba(255, 255, 255, 0.55);
  font-size: 1.1rem;

  a {
    color: #8BE9FD;
    text-decoration: none;
    border-bottom: 1px dashed rgba(139, 233, 253, 0.4);
    transition: border-color 0.2s ease;
    &:hover { border-bottom-color: #8BE9FD; }
  }
}

@media (max-width: 768px) {
  .hero { padding: 3.5rem 1rem 2.4rem; }
  .lead { font-size: 1.2rem; }
  .layout { padding: 0 1rem; margin-top: 2rem; }
  .qButton { padding: 1.1rem 1.2rem; font-size: 1.1rem; gap: 0.8rem; }
  .answer { padding: 0.4rem 1.2rem 1.3rem; font-size: 1.08rem; line-height: 1.65; }
  .answer :global(ul) { grid-template-columns: 1fr; }
  .answer :global(.lead-line) { font-size: 1.18rem; }
  .answer :global(.manifesto) { padding: 1rem 1.1rem 1rem 1.3rem; }
  .answer :global(.manifesto) p { font-size: 1.02rem; }
  .sectionHead { gap: 0.8rem; margin-bottom: 1.2rem; padding-bottom: 0.85rem; }
  .howItWorksBtn { font-size: 0.9rem; padding: 0.45rem 0.9rem; gap: 0.4rem; }
  .section { margin-bottom: 3rem; }
  .items { gap: 0.7rem; }
  .bottom { font-size: 1rem; padding: 1.4rem; }
}

@media (max-width: 480px) {
  .qButton { padding: 1rem; font-size: 1.02rem; }
  .answer { padding: 0.3rem 1rem 1.1rem; font-size: 1rem; }
  .answer :global(.lead-line) { font-size: 1.1rem; }
  .answer :global(.manifesto) { padding: 0.9rem 1rem 0.9rem 1.1rem; }
  .answer :global(.manifesto) p { font-size: 0.96rem; }
}
</style>

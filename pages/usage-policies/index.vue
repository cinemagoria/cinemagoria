<template>
  <main class="page">
    <UserNav />

    <header class="hero">
      <div class="heroInner">
        <span class="eyebrow">Legal &amp; Privacy</span>
        <h1 class="heroTitle">Usage Policies &amp; Privacy Agreement</h1>
        <p class="heroLead">
          The terms covering use of the platform, third-party content, data, cookies and account information &mdash; in one place.
        </p>
        <p class="heroDates">
          <span><strong>Effective:</strong> March 27, 2024</span>
          <span class="heroDot">&middot;</span>
          <span><strong>Last updated:</strong> June 13, 2026</span>
        </p>
      </div>
    </header>

    <div class="layout">
      <aside class="toc" aria-label="Table of contents">
        <span class="tocLabel">Sections</span>
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
  title: 'Usage Policies & Privacy Agreement',
  meta: [
    { name: 'description', content: 'Usage policies, terms of service, and privacy agreement for the platform. Learn how data is handled and what these terms cover.' },
    { property: 'og:title', content: 'Usage Policies & Privacy Agreement' },
  ],
});

const sections = [
  {
    id: 'introduction',
    title: '1. Introduction',
    body: `<p class="intro-clause">This demonstrative technical platform is provided without warranties of any kind and is intended solely for personal, non-commercial use. Please read this agreement carefully before using the platform. By accessing or using this site &mdash; including its domain, content, or any interaction &mdash; you acknowledge that you accept this user agreement and that you are at least 18 years of age. Use of the platform constitutes full and unreserved acceptance of these terms and conditions, which take effect immediately.</p>
<p>Users agree to use the platform in accordance with applicable laws and these terms. The following is prohibited: attempting to breach or interfere with security systems; using the platform in a way that may impair its performance; disassembling, decompiling, or reverse engineering any part of the platform.</p>
<p>If you do not agree with these terms, refrain from using the platform and close all related windows.</p>`,
  },
  {
    id: 'disclaimer',
    title: '2. Disclaimer of Use',
    body: `<p>The platform collects and presents publicly available entertainment information in order to provide search results, recommendations, and metadata for films and series. While accuracy and relevance are prioritized, errors, omissions, or references to sensitive or mature content may occur.</p>
<p>The use and interpretation of any results, metadata, or third-party information is the sole responsibility of the user. <strong>In no event shall the platform, its contributors, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising from the use of the platform or any data processed through it.</strong></p>`,
  },
  {
    id: 'external-links',
    title: '3. External Links & Third Parties',
    body: `<p>Certain sections may include automatically generated links to third-party domains or applications where audiovisual content or related metadata may be available. These links are generated programmatically through public APIs or standard protocols, based on public identifiers (such as IMDb ID, TMDB ID, etc.), and are provided <strong>strictly for informational and indexing purposes</strong>.</p>
<p>The platform does not host, store, transmit, or reproduce audiovisual content. It operates solely as a <strong>non-profit indexer of publicly available information</strong>. External URLs and protocol links are displayed automatically as part of metadata obtained from public sources, without editorial intervention.</p>
<p>Access to external services or platforms is optional and at the user&rsquo;s sole discretion. The platform does not control the legality, content, or operation of such services and <strong>does not promote or support copyright infringement or unauthorized distribution of protected content</strong>.</p>
<p>Any actions taken on third-party sites are governed by their respective terms and policies. The platform assumes no responsibility for external content or for any consequences arising from access to such sites.</p>
<p>These references are provided <em>in good faith</em> to enhance the user experience. The platform is designed for discovery, not distribution.</p>`,
  },
  {
    id: 'privacy',
    title: '4. Privacy Policy',
    body: `<p>The platform does not sell or share personal data for commercial purposes. Information provided voluntarily is used exclusively for features such as lists, preferences, and account synchronization.</p>
<p>Authentication is handled through <strong>Google OAuth</strong> and internal systems. No sensitive data is shared with third parties.</p>
<p>Anonymous analytical data may be collected to improve the service.</p>`,
  },
  {
    id: 'data-sources',
    title: '5. Data Sources and Attributions',
    body: `<p>The platform integrates data from public APIs and metadata providers. All trademarks and assets belong to their respective owners. Information is presented under fair use principles and for non-commercial purposes. Rights holders or publishers who wish to request content removal (<em>opt-out</em>) may contact the team as indicated in <strong>Section 8</strong>.</p>
<p><strong>Festival data coverage:</strong> festival lineups are collected from public sources. Data availability may be incomplete, particularly for short films or works with limited presence in public sources. As a result, the number of titles displayed for a given festival may differ from its official program. These differences reflect technical limitations of external data sources and not editorial decisions.</p>
<p><strong>News aggregation:</strong> content is obtained from publicly available RSS feeds for indexing purposes. Original news content is not modified, and only the information provided by such sources (such as title, description, and metadata) is displayed, in the format in which it is distributed. Full articles cannot be read within the platform: all interactions redirect to the original site, which is the sole environment where the complete content can be accessed, ensuring that traffic, impressions, and monetization remain exclusively with the original publisher. Additionally, the platform may publish its own editorial content generated in an automated or assisted manner from multiple public sources. Such content may involve processes of synthesis, reformulation, or automated structuring of the original information, without implying literal reproduction or exact correspondence with the source material, and is provided exclusively for informational purposes, and may contain errors, omissions, inaccuracies, inconsistencies, or unintentional interpretations relative to the original sources. Images are used solely for identification purposes under fair use principles.</p>
<p>Icons and visual assets are licensed under Creative Commons Attribution 4.0. Data provided by TMDB, JustWatch, MDBList, and Trakt.</p>`,
  },
  {
    id: 'general',
    title: '6. General Conditions',
    body: `<p>This is an ongoing project under continuous development, and these terms may be modified at any time. Continued use implies acceptance of the current version.</p>`,
  },
  {
    id: 'cookies',
    title: '7. Cookie Policy',
    body: `<p>The platform uses cookies and similar client-side storage technologies. Preferences can be managed at any time through the cookie settings available in the site footer or the consent banner shown on the first visit.</p>
<div class="cookie-table-wrapper">
  <table class="cookie-table">
    <thead>
      <tr>
        <th>Category</th>
        <th>Purpose</th>
        <th>Examples</th>
        <th>Duration</th>
        <th>Required</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Essential</strong></td>
        <td>Authentication, session management, security, and core site functionality</td>
        <td>Login tokens, CSRF protection, consent preferences</td>
        <td>Session &ndash; 1 year</td>
        <td>Yes</td>
      </tr>
      <tr>
        <td><strong>Analytics</strong></td>
        <td>Usage statistics to understand how the platform is used and identify areas for improvement</td>
        <td>Page views, navigation patterns, feature usage</td>
        <td>Up to 2 years</td>
        <td>No &mdash; opt-in</td>
      </tr>
      <tr>
        <td><strong>Personalization</strong></td>
        <td>Remembers browsing context for a tailored experience</td>
        <td>Recently visited sections</td>
        <td>Up to 1 year</td>
        <td>No &mdash; opt-in</td>
      </tr>
    </tbody>
  </table>
</div>
<p><strong>Third parties:</strong> the platform does not sell or share cookie data with third parties for advertising purposes. If analytics services are enabled, anonymized data may be processed by third-party analytics providers under their respective privacy policies.</p>
<p><strong>Managing choices:</strong> cookie preferences can be changed at any time by clicking &ldquo;Cookie Preferences&rdquo; in the site footer. Cookies can also be managed through browser settings &mdash; note that disabling essential cookies may affect site functionality.</p>`,
  },
  {
    id: 'contact',
    title: '8. Contact',
    body: `<p>For inquiries regarding these terms or policies, write to <a href="mailto:hello@cinemagoria.com">hello@cinemagoria.com</a>.</p>`,
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
  padding: 4.5rem 1.5rem 3rem;
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
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #8BE9FD;
  font-weight: 700;
  padding: 6px 14px;
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 999px;
  background: rgba(139, 233, 253, 0.08);
  margin-bottom: 1.5rem;
}

.heroTitle {
  font-size: clamp(2.1rem, 5vw, 2.9rem);
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.85rem;
  letter-spacing: -1px;
  line-height: 1.1;
  text-shadow: 0 0 28px rgba(139, 233, 253, 0.22);
}

.heroLead {
  font-size: 15px;
  line-height: 1.6;
  color: #a0aab2;
  margin: 0 auto 1.2rem;
  max-width: 560px;
  font-weight: 300;
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
    font-size: clamp(1.4rem, 2.5vw, 1.75rem);
    font-weight: 700;
    color: #fff;
    margin: 0;
    letter-spacing: -0.4px;
    line-height: 1.2;
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
  .hero { padding: 3rem 1rem 2.2rem; }
  .heroLead { font-size: 14px; }
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

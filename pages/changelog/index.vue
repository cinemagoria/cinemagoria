<template>
  <main class="page">
    <UserNav />

    <header class="hero">
      <div class="heroInner">
        <span class="eyebrow">Release Notes</span>
        <h1 class="heroTitle">Changelog</h1>
        <p class="heroLead">
          A running log of releases, new features, fixes and platform improvements &mdash; pulled directly from the source repository.
        </p>
      </div>
    </header>

    <div class="layout">
      <div v-if="loading" class="loadingCard">
        <Loader />
      </div>

      <div v-else-if="error" class="errorCard">
        <p>{{ error }}</p>
        <button @click="fetchReleases" class="primaryBtn">Retry</button>
      </div>

      <div v-else class="releaseList">
        <article v-for="release in releases" :key="release.id" class="releaseCard">
          <header class="releaseHead">
            <div class="releaseHeadLeft">
              <a :href="release.html_url" target="_blank" class="releaseTitle">{{ release.name || release.tag_name }}</a>
              <span class="releaseDate">{{ formatDate(release.published_at) }}</span>
            </div>
            <a :href="release.html_url" target="_blank" class="githubBtn" rel="noopener noreferrer">
              View on GitHub
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </header>

          <div class="releaseMeta">
            <span class="tagBadge">{{ release.tag_name }}</span>
          </div>

          <div class="releaseContent" :class="{ 'is-collapsed': !expanded[release.id] }">
            <div class="releaseBody" v-html="release.compiledBody"></div>
            <div v-if="!expanded[release.id]" class="fadeOverlay"></div>
          </div>

          <button @click="toggleExpand(release.id)" class="expandBtn">
            {{ expanded[release.id] ? 'Show less' : 'Read more' }}
          </button>
        </article>

        <div v-if="releases.length === 0" class="emptyCard">
          <p>No releases found.</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import UserNav from '@/components/global/UserNav';
import MarkdownIt from 'markdown-it';

export default {
  head() {
    return {
      title: 'Changelog — Release Notes & Updates',
      meta: [
        { hid: 'description', name: 'description', content: 'Changelog — latest releases, new features, bug fixes, and platform improvements.' },
        { hid: 'og:title', property: 'og:title', content: 'Changelog' },
        { hid: 'og:url', property: 'og:url', content: `${process.env.FRONTEND_URL}${this.$route.path}` },
      ],
    };
  },
  components: {
    UserNav,
    Loader: () => import('@/components/Loader')
  },
  data() {
    return {
      releases: [],
      loading: true,
      error: null,
      expanded: {}
    };
  },
  async mounted() {
    this.initMarkdown();
    await this.fetchReleases();
  },
  methods: {
    initMarkdown() {
      this.md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true
      });
      if (this.releases.length > 0) {
        this.processReleasesMarkdown();
      }
    },
    async fetchReleases() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch('https://api.github.com/repos/cinemagoria/cinemagoria/releases');
        if (!response.ok) {
          throw new Error('Failed to fetch releases');
        }
        const data = await response.json();
        const releases = data.filter(r => !r.draft);

        const expandedState = {};
        releases.forEach(r => {
          expandedState[r.id] = false;
        });
        this.expanded = expandedState;
        this.releases = releases;

        this.processReleasesMarkdown();

      } catch (err) {
        console.error('Error fetching changelog:', err);
        this.error = 'Failed to load the changelog. Please try again in a moment.';
      } finally {
        this.loading = false;
      }
    },
    processReleasesMarkdown() {
      if (this.releases.length === 0) return;

      this.releases = this.releases.map(release => {
        let compiledBody = release.body || '';
        if (this.md) {
            compiledBody = this.md.render(release.body || '');
        }
        return {
            ...release,
            compiledBody
        };
      });
    },
    toggleExpand(id) {
      this.expanded[id] = !this.expanded[id];
    },
    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
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
  max-width: 640px;
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

/* ── Layout ─────────────────────────────────────────────────────── */
.layout {
  max-width: 820px;
  margin: 2.5rem auto 0;
  padding: 0 1.5rem;
}

.releaseList {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ── Release card ──────────────────────────────────────────────── */
.releaseCard {
  position: relative;
  background: rgba(3, 4, 6, 0.7);
  background-image:
    radial-gradient(circle at 15% 0%, rgba(31, 84, 103, 0.18), transparent 50%);
  border: 1px solid rgba(139, 233, 253, 0.18);
  border-radius: 16px;
  padding: 1.6rem 1.8rem 1.4rem;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #8BE9FD, #1F5467, transparent);
    opacity: 0.85;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(139, 233, 253, 0.32);
    background: rgba(3, 4, 6, 0.82);
    box-shadow: 0 14px 32px rgba(0, 0, 0, 0.5), 0 0 22px rgba(139, 233, 253, 0.1);
  }
}

.releaseHead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.releaseHeadLeft {
  display: flex;
  align-items: baseline;
  gap: 14px;
  flex-wrap: wrap;
  min-width: 0;
}

.releaseTitle {
  color: #fff;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.3px;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover { color: #8BE9FD; }
}

.releaseDate {
  color: #a0aab2;
  font-size: 13px;
  font-weight: 300;
}

.githubBtn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(139, 233, 253, 0.06);
  border: 1px solid rgba(139, 233, 253, 0.28);
  color: #8BE9FD;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.2px;
  text-decoration: none;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(139, 233, 253, 0.14);
    border-color: #8BE9FD;
    transform: translateY(-1px);
  }
}

.releaseMeta {
  margin-bottom: 14px;
}

.tagBadge {
  display: inline-block;
  background: rgba(139, 233, 253, 0.08);
  color: #8BE9FD;
  border: 1px solid rgba(139, 233, 253, 0.32);
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  font-family: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
  letter-spacing: 0.5px;
}

/* ── Release content ───────────────────────────────────────────── */
.releaseContent {
  position: relative;
  overflow: hidden;
  transition: max-height 0.3s ease;

  &.is-collapsed { max-height: 280px; }
}

.fadeOverlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90px;
  background: linear-gradient(to bottom, rgba(3, 4, 6, 0), rgba(3, 4, 6, 0.95));
  pointer-events: none;
}

.releaseBody {
  font-size: 14.5px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.78);
  font-weight: 300;

  :deep(h1), :deep(h2), :deep(h3) {
    color: #fff;
    margin: 1.2rem 0 0.5rem;
    font-weight: 700;
    letter-spacing: -0.3px;
  }

  :deep(h1) {
    font-size: 1.25em;
    border-bottom: 1px solid rgba(139, 233, 253, 0.18);
    padding-bottom: 6px;
  }
  :deep(h2) { font-size: 1.12em; }
  :deep(h3) { font-size: 1.04em; color: #8BE9FD; }

  :deep(p) { margin: 0.6rem 0; }

  :deep(ul), :deep(ol) {
    padding-left: 22px;
    margin: 0.6rem 0;
  }

  :deep(li) {
    margin-bottom: 4px;
  }

  :deep(strong) { color: #fff; font-weight: 600; }

  :deep(a) {
    color: #8BE9FD;
    text-decoration: none;
    border-bottom: 1px dashed rgba(139, 233, 253, 0.4);
    transition: border-color 0.2s ease;
    &:hover { border-bottom-color: #8BE9FD; }
  }

  :deep(code) {
    background: rgba(139, 233, 253, 0.08);
    color: #8BE9FD;
    padding: 1px 6px;
    border-radius: 5px;
    font-family: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
    font-size: 0.88em;
    border: 1px solid rgba(139, 233, 253, 0.12);
  }

  :deep(pre) {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(139, 233, 253, 0.14);
    padding: 0.85rem 1rem;
    border-radius: 10px;
    overflow-x: auto;
    margin: 0.8rem 0;

    code {
      background: transparent;
      border: none;
      padding: 0;
      color: #e0e6ed;
    }
  }

  :deep(blockquote) {
    border-left: 2px solid #8BE9FD;
    margin: 0.6rem 0;
    padding: 0.4rem 1rem;
    background: linear-gradient(90deg, rgba(139, 233, 253, 0.05), transparent);
    color: rgba(255, 255, 255, 0.72);
    border-radius: 0 8px 8px 0;
  }

  :deep(hr) {
    border: none;
    height: 1px;
    background: linear-gradient(90deg, rgba(139, 233, 253, 0.3), transparent);
    margin: 1rem 0;
  }
}

/* ── Expand button ─────────────────────────────────────────────── */
.expandBtn {
  display: block;
  margin: 14px auto 0;
  background: transparent;
  border: none;
  color: #8BE9FD;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 6px 14px;
  cursor: pointer;
  transition: color 0.2s ease;
  font-family: inherit;

  &:hover { color: #fff; }
}

/* ── Loading / error / empty ───────────────────────────────────── */
.loadingCard,
.errorCard,
.emptyCard {
  position: relative;
  background: rgba(3, 4, 6, 0.6);
  border: 1px solid rgba(139, 233, 253, 0.16);
  border-radius: 16px;
  padding: 3rem 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  min-height: 220px;
  color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);

  p { margin: 0; font-size: 14px; font-weight: 300; }
}

.primaryBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1F5467, #8BE9FD);
  border: 1px solid rgba(139, 233, 253, 0.5);
  color: #03242C;
  padding: 10px 26px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  box-shadow: 0 4px 14px rgba(139, 233, 253, 0.18);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(139, 233, 253, 0.28);
  }
}

/* ── Responsive ────────────────────────────────────────────────── */
@media (max-width: 600px) {
  .hero { padding-right: 1rem; padding-left: 1rem; }
  .layout { padding: 0 1rem; }
  .releaseCard { padding: 1.3rem 1.2rem 1.1rem; border-radius: 14px; }
  .releaseTitle { font-size: 1.25rem; }
  .githubBtn { font-size: 11.5px; padding: 5px 10px; }
}
</style>

<template>
  <main class="main">
    <UserNav />
    <nav class="navbar navbar-welcome">
      <h1 class="title-primary" style="color: #8BE9FD !important; margin-top:30px; margin-bottom:10px; display:flex; justify-content: center;">Changelog</h1>
      <h2 class="title-secondary" style="color: rgb(172, 175, 181); font-size: 14px; max-width: 600px; margin: 20px auto 0;">
        Latest updates and improvements from Entercinema.
      </h2>
    </nav>

    <div class="changelog-section">
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading releases...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
        <button @click="fetchReleases" class="retry-btn">Retry</button>
      </div>

      <div v-else class="changelog-container">
        <div v-for="release in releases" :key="release.id" class="release-card">
          <div class="release-header">
            <div class="header-left">
              <a :href="release.html_url" target="_blank" class="release-title">{{ release.name || release.tag_name }}</a>
              <span class="release-date">{{ formatDate(release.published_at) }}</span>
            </div>
            <a :href="release.html_url" target="_blank" class="github-btn">
              View on GitHub
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>
          <div class="release-meta">
            <span class="tag-badge">{{ release.tag_name }}</span>
          </div>
          
          <div class="release-content" :class="{ 'collapsed': !expanded[release.id] }">
            <div class="release-body" v-html="release.compiledBody"></div>
            <div v-if="!expanded[release.id]" class="fade-overlay"></div>
          </div>

          <button @click="toggleExpand(release.id)" class="expand-btn">
            {{ expanded[release.id] ? 'Show Less' : 'Read More' }}
          </button>
        </div>
        
        <div v-if="releases.length === 0" class="no-releases">
          No releases found.
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import UserNav from '@/components/global/UserNav';

export default {
  head() {
    return {
      title: 'EnterCinema - Changelog',
      meta: [
        { hid: 'og:title', property: 'og:title', content: 'Changelog' },
        { hid: 'og:url', property: 'og:url', content: `${process.env.FRONTEND_URL}${this.$route.path}` },
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js',
          callback: () => { this.initMarkdown(); }
        }
      ]
    };
  },
  components: {
    UserNav
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
    this.md = null;
    if (window.markdownit) {
      this.initMarkdown();
    }
    await this.fetchReleases();
  },
  methods: {
    initMarkdown() {
      if (!this.md && window.markdownit) {
        this.md = window.markdownit({
          html: true,
          linkify: true,
          typographer: true
        });
        if (this.releases.length > 0) {
          this.processReleasesMarkdown();
        }
      }
    },
    async fetchReleases() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch('https://api.github.com/repos/imprvhub/entercinema/releases');
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
        this.error = 'Failed to load changelog. Please try again later.';
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
      this.$set(this.expanded, id, !this.expanded[id]);
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
.changelog-section {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  min-height: 80vh;
}

.changelog-container {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.release-card {
  background: rgba(16, 26, 35, 0.85);
  border: 1px solid hsla(0, 0%, 100%, .18);
  border-radius: 10px;
  box-shadow: 0 8px 32px 0 rgba(31, 97, 135, .37);
  backdrop-filter: blur(10px);
  padding: 30px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.release-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 10px;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 15px;
  flex-wrap: wrap;
}

.release-title {
  color: #8BE9FD;
  font-size: 24px;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #a4f0ff;
  }
}

.release-date {
  color: #a0a0a0;
  font-size: 14px;
}

.github-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(139, 233, 253, 0.1);
  border: 1px solid rgba(139, 233, 253, 0.3);
  color: #8BE9FD;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(139, 233, 253, 0.2);
    transform: translateY(-1px);
  }
}

.release-meta {
  margin-bottom: 20px;
}

.tag-badge {
  background: rgba(139, 233, 253, 0.1);
  color: #8BE9FD;
  border: 1px solid rgba(139, 233, 253, 0.3);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
}

.release-content {
  position: relative;
  overflow: hidden;
  transition: max-height 0.3s ease;
  
  &.collapsed {
    max-height: 300px;
  }
}

.fade-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to bottom, rgba(16, 26, 35, 0), rgba(16, 26, 35, 1));
  pointer-events: none;
}

.expand-btn {
  background: transparent;
  border: none;
  color: #8BE9FD;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 0;
  margin-top: 10px;
  cursor: pointer;
  width: 100%;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: color 0.2s;

  &:hover {
    color: #fff;
    text-decoration: underline;
  }
}

.release-body {
  color: #e0e0e0;
  line-height: 1.6;
  font-size: 16px;

  ::v-deep h1, ::v-deep h2, ::v-deep h3 {
    color: #fff;
    margin-top: 20px;
    margin-bottom: 10px;
    font-weight: 600;
  }
  
  ::v-deep h1 { font-size: 1.5em; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px; }
  ::v-deep h2 { font-size: 1.3em; }
  ::v-deep h3 { font-size: 1.1em; }

  ::v-deep ul, ::v-deep ol {
    padding-left: 20px;
    margin-bottom: 15px;
  }

  ::v-deep li {
    margin-bottom: 5px;
  }

  ::v-deep a {
    color: #8BE9FD;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }

  ::v-deep code {
    background: rgba(0,0,0,0.3);
    padding: 2px 5px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9em;
  }

  ::v-deep pre {
    background: rgba(0,0,0,0.3);
    padding: 15px;
    border-radius: 8px;
    overflow-x: auto;
    margin-bottom: 15px;
    
    code {
      background: transparent;
      padding: 0;
    }
  }
  
  ::v-deep blockquote {
    border-left: 4px solid #8BE9FD;
    margin: 0 0 15px;
    padding-left: 15px;
    color: #a0a0a0;
  }
}

.loading-container, .error-container, .no-releases {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  text-align: center;
  color: #ccc;
  width: 100%;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(139, 233, 253, 0.1);
  border-top-color: #8BE9FD;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

.retry-btn {
  background: transparent;
  border: 1px solid #8BE9FD;
  color: #8BE9FD;
  padding: 8px 16px;
  border-radius: 6px;
  margin-top: 10px;
  cursor: pointer;
  
  &:hover {
    background: rgba(139, 233, 253, 0.1);
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 600px) {
  .changelog-section {
    padding: 20px 15px;
  }
  
  .release-card {
    padding: 20px;
  }
  
  .release-title {
    font-size: 20px;
  }
}
</style>

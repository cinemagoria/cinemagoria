<template>
  <footer :class="$style.footer">
    <div :class="$style.panel">
      <div :class="$style.top">
        <div :class="$style.brand">
          <nuxt-link to="/" :class="$style.lockup" aria-label="Home">
            <img src="/icons/icon-medium.png" alt="" width="36" height="36" loading="lazy" />
            <span :class="$style.wordmark">Cinemagoria</span>
          </nuxt-link>
          <p :class="$style.tagline">Movies, series, festivals, awards and streaming availability &mdash; in one place.</p>
          <div :class="$style.socials">
            <a href="https://github.com/cinemagoria/cinemagoria" target="_blank" rel="noopener" :class="$style.socialBtn" aria-label="GitHub" title="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="mailto:hello@cinemagoria.com" :class="$style.socialBtn" aria-label="Email" title="Email">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="m3 7 9 6 9-6"/></svg>
            </a>
            <a href="/feed" target="_blank" rel="noopener" :class="$style.socialBtn" aria-label="RSS feed" title="RSS feed">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><path d="M5 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"/></svg>
            </a>
          </div>
        </div>

        <nav :class="$style.columns" aria-label="Footer">
          <div :class="$style.column">
            <h4 :class="$style.heading">Explore</h4>
            <ul :class="$style.links">
              <li><nuxt-link to="/movie">Movies</nuxt-link></li>
              <li><nuxt-link to="/tv">TV Shows</nuxt-link></li>
              <li><nuxt-link to="/festival">Festivals</nuxt-link></li>
              <li><nuxt-link to="/news">News</nuxt-link></li>
            </ul>
          </div>

          <div :class="$style.column">
            <h4 :class="$style.heading">Resources</h4>
            <ul :class="$style.links">
              <li><nuxt-link to="/changelog">Latest Updates</nuxt-link></li>
              <li><nuxt-link to="/faq">FAQ</nuxt-link></li>
              <li><nuxt-link to="/contact">Contact</nuxt-link></li>
            </ul>
          </div>
        </nav>
      </div>

      <div :class="$style.bottom">
        <div :class="$style.legal">
          <span>&copy; {{ new Date().getFullYear() }} Cinemagoria</span>
          <nuxt-link to="/usage-policies">Privacy &amp; Terms</nuxt-link>
          <button type="button" @click="openCookiePreferences">Cookies</button>
        </div>

        <div :class="$style.meta">
          <span :class="$style.attribution">
            <span>Data by</span>
            <a target="_blank" href="https://www.themoviedb.org/" rel="noopener" :class="$style.tmdbLink" aria-label="TMDB">
              <img src="/logos/platforms/tmdb-footer.svg" alt="TMDB" :class="$style.tmdbLogo" loading="lazy" />
            </a>
            <a target="_blank" href="https://www.justwatch.com/" rel="noopener" :class="$style.partnerLink">JustWatch</a>
          </span>

          <div v-if="!isLoggedIn" :class="$style.langSwitch" role="group" aria-label="Language">
            <a :href="getEnglishLink()" :class="[$style.langLink, { [$style.activeLang]: !isSpanish }]" :aria-current="!isSpanish ? 'true' : null" lang="en">EN</a>
            <a :href="getSpanishLink()" :class="[$style.langLink, { [$style.activeLang]: isSpanish }]" :aria-current="isSpanish ? 'true' : null" lang="es">ES</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { useConsentStore } from '~/stores/consent'

export default {
  data() {
    return {
      authToken: null,
    };
  },

  computed: {
    isLoggedIn() {
      return this.authToken !== null;
    },
    isSpanish() {
      if (typeof window === 'undefined') return false;
      const host = window.location.host;
      return host.includes('es.') || host.includes(':3001');
    }
  },

  mounted() {
    this.checkAuthStatus();
    if (typeof window !== 'undefined') {
      window.addEventListener('auth-changed', this.checkAuthStatus);
    }
  },

  beforeUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('auth-changed', this.checkAuthStatus);
    }
  },

  methods: {
    checkAuthStatus() {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token !== this.authToken) {
          this.authToken = token;
        }
      }
    },
    getEnglishLink() {
      if (typeof window === 'undefined') return 'https://cinemagoria.com';
      const { protocol, host } = window.location;
      const newHost = host.replace('es.', '').replace(':3001', ':3000');
      return `${protocol}//${newHost}`;
    },
    openCookiePreferences() {
      const consent = useConsentStore()
      consent.openPreferences()
    },
    getSpanishLink() {
      if (typeof window === 'undefined') return 'https://es.cinemagoria.com';
      const { protocol, host } = window.location;
      let newHostStyle = host;
      if (host.includes(':3000')) {
        newHostStyle = host.replace(':3000', ':3001');
      } else if (!host.includes('es.') && !host.includes('localhost')) {
        newHostStyle = 'es.' + host;
      }
      return `${protocol}//${newHostStyle}`;
    }
  }
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

$cyan: #8BE9FD;
$teal: #1F5467;
$ink: #02080d;
$muted: #a0aab2;
$ease-out: cubic-bezier(0.16, 1, 0.3, 1);

.footer {
  margin-top: 4rem;
  padding: 0 1.6rem calc(2.4rem + env(safe-area-inset-bottom, 0px));
  color: rgba(255, 255, 255, 0.72);
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;

  @media (min-width: $breakpoint-small) {
    padding: 0 2.4rem 3.2rem;
  }

  @media (min-width: $breakpoint-large) {
    margin-top: 5rem;
    padding: 0 2.4rem 2.8rem;
  }
}

.panel {
  position: relative;
  overflow: hidden;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2.8rem 2rem 2rem;
  border: 1px solid rgba($cyan, 0.14);
  border-radius: 20px;
  background: rgba(3, 6, 10, 0.84);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, $cyan, $teal, transparent);
    opacity: 0.85;
    pointer-events: none;
  }

  @media (min-width: $breakpoint-small) {
    padding: 3.4rem 3.2rem 2.4rem;
  }

  @media (min-width: $breakpoint-large) {
    padding: 4rem 4.4rem 2.6rem;
    border-radius: 24px;
  }
}

.top {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 3.2rem;

  @media (min-width: $breakpoint-small) {
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
    gap: 4rem;
  }

  @media (min-width: $breakpoint-large) {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    gap: 6rem;
  }
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.4rem;
  min-width: 0;
}

.lockup {
  display: inline-flex;
  align-items: center;
  gap: 1.1rem;
  text-decoration: none;
  color: #fff;

  img {
    width: 3.6rem;
    height: 3.6rem;
    display: block;
    border-radius: 10px;
    box-shadow: 0 0 0 1px rgba($cyan, 0.22);
    transition: box-shadow 0.3s ease;
  }
}

.wordmark {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1;
  color: #fff;
  transition: color 0.2s ease;
}

.tagline {
  margin: 0;
  max-width: 36ch;
  font-size: 1.35rem;
  font-weight: 300;
  line-height: 1.6;
  color: $muted;
  text-wrap: pretty;
}

.socials {
  display: flex;
  gap: 0.8rem;
  margin-top: 0.4rem;
}

.socialBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  color: $muted;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease, transform 0.3s $ease-out;

  svg {
    width: 1.6rem;
    height: 1.6rem;
  }
}

.columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem;
  align-content: start;

  @media (min-width: $breakpoint-small) {
    gap: 2rem 3rem;
  }
}

.column {
  min-width: 0;
}

.heading {
  margin: 0 0 1.1rem;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba($cyan, 0.9);
}

.links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  a {
    display: inline-block;
    padding: 0.3rem 0;
    font-size: 1.4rem;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.74);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:global(.router-link-active),
  a:global(.nuxt-link-active) {
    color: $cyan;
  }
}

.bottom {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.2rem;
  margin-top: 3rem;
  padding-top: 1.8rem;
  font-size: 1.2rem;
  color: $text-color-grey;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, rgba($cyan, 0.28), rgba($cyan, 0.06));
  }

  @media (min-width: $breakpoint-small) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1.2rem 2.4rem;
  }
}

.legal {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 1.6rem;

  a,
  button {
    padding: 0;
    margin: 0;
    border: none;
    background: none;
    font: inherit;
    color: $text-color-grey;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s ease;
  }
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.2rem 2rem;
}

.attribution {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  white-space: nowrap;
}

.tmdbLink {
  display: inline-flex;
  align-items: center;
  transition: filter 0.2s ease;
}

.tmdbLogo {
  display: block;
  height: 1.1rem;
  width: auto;
}

.partnerLink {
  color: $muted;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.langSwitch {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.25rem;
  border-radius: 999px;
  background: rgba(3, 4, 6, 0.55);
  border: 1px solid rgba($cyan, 0.16);
}

.langLink {
  display: inline-flex;
  align-items: center;
  height: 2.4rem;
  padding: 0 0.9rem;
  border-radius: 999px;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  transition: color 0.2s ease, background 0.2s ease;

  &.activeLang {
    color: $ink;
    background: linear-gradient(135deg, $cyan, #5cc4d8);
    box-shadow: 0 3px 10px rgba($cyan, 0.25);
  }
}

.lockup,
.socialBtn,
.links a,
.legal a,
.legal button,
.langLink,
.partnerLink,
.tmdbLink {
  &:focus-visible {
    outline: 2px solid $cyan;
    outline-offset: 3px;
    border-radius: 6px;
  }
}

@media (hover: hover) and (pointer: fine) {
  .lockup:hover {
    img {
      box-shadow: 0 0 0 1px rgba($cyan, 0.55), 0 6px 18px rgba($cyan, 0.18);
    }

    .wordmark {
      color: $cyan;
    }
  }

  .socialBtn:hover {
    color: $cyan;
    border-color: rgba($cyan, 0.45);
    background: rgba($cyan, 0.08);
    transform: translateY(-2px);
  }

  .links a:hover,
  .legal a:hover,
  .legal button:hover,
  .partnerLink:hover {
    color: #fff;
  }

  .langLink:hover:not(.activeLang) {
    color: #fff;
    background: rgba($cyan, 0.1);
  }

  .tmdbLink:hover {
    filter: brightness(1.2);
  }
}

@media (prefers-reduced-motion: reduce) {
  .socialBtn {
    transition: none;
  }
}
</style>

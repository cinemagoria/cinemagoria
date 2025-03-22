<template>
  <footer :class="$style.footer">
    <div class="language-selector" style="position: relative; margin: 0 auto;">
          <div class="selected-language" @click="toggleLanguageMenu">
            <img src="~static/langpicker-icon.png" alt="World icon" class="world-icon" style="width: 16px; height: 16px; margin-bottom: 3px; margin-right: 4px;">
            <span class="language">Español</span>  
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#585858" class="arrow-icon" style="width: 24px; height: 24px; left: -70px;">
              <path d="M7 10l5 5 5-5z" style="transform: translate(-8px); z-index: 1000;" />
            </svg>
          </div>
          <div ref="languageMenu" class="language-menu" :style="{ display: showLanguageMenu ? 'block' : 'none' }">
            <label class="menu-label1" @click="changeLanguage('english')">
              <span>English</span>
            </label>
          </div>
    </div>
    <br>
    <p>Todos los datos son proporcionados por
        <a target="_blank" href="https://www.themoviedb.org/" rel="noopener">
            <img src="~static/tmdb.svg" alt="TMDB Attribution" class="tmdb-attribution" style="width: 60px; height: 35px; display: inline-block; margin-bottom: 2px;">
        </a>
        y
        <a target="_blank" href="https://www.justwatch.com/" rel="noopener" style="margin-top: 2px;">JustWatch</a>.
    </p>
    <p> Al usar este sitio, usted acepta los <strong><a href="/terms">Acuerdos de Usuario, Términos y Condiciones</a></strong>.</p>
    <p>&copy; {{ new Date().getFullYear() }}<a target="_blank" href="https://ivanluna.dev/" rel="noopener"> Ivanluna.dev</a> </p>

    <ul class="nolist">
      <li>
        <a
          href="https://github.com/imprvhub"
          target="_blank"
          aria-label="Link to GitHub account"
          rel="noopener">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#585858"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
        </a>
      </li>
      <li>
        <a
          href="https://www.linkedin.com/in/ivanluna-dev"
          target="_blank"
          aria-label="Link to LinkedIn account"
          rel="noopener">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#585858"><path d="M19 0H5a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5V5a5 5 0 0 0-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z"/></svg>
        </a>
      </li>
      <li>
        <a
          href="mailto:hello@entercinema.com"
          aria-label="Link to Email"
          rel="noopener">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#585858"><path d="M0 3v18h24V3H0zm21.518 2L12 12.713 2.482 5h19.036zM2 19V7.183l10 8.104 10-8.104V19H2z"/></svg>
        </a>
      </li>
    </ul>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      showLanguageMenu: false,
      selectedLanguage: 'español',
    };
  },
  methods: {
    toggleLanguageMenu() {
      this.showLanguageMenu = !this.showLanguageMenu;
    },
    changeLanguage() {
      const currentPath = this.$route.path;
      const currentOrigin = window.location.origin;
      const isSpanish = currentOrigin.includes('es.');

      if (isSpanish) {
        const newOrigin = currentOrigin.replace('es.', '');
        const newUrl = `${newOrigin}${currentPath}`;
        window.location.href = newUrl;
      } else {
        console.log("La URL no tiene el prefijo 'es.', no se necesita ninguna acción.");
      }
    }
  },
};
</script>

<style lang="scss" module>
@import '~/assets/css/utilities/_variables.scss';

.footer {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
  padding: 2rem 1.5rem 6.5rem;
  color: $text-color-grey;
  text-decoration: none;

  @media (min-width: $breakpoint-small) {
    padding-right: 4rem;
    padding-left: 4rem;
  }

  @media (min-width: $breakpoint-large) {
    padding: 2rem 5rem;
  }

  p {
    margin: 0.3rem 0;
  }

  a {
    font-weight: 600;
    color: $text-color-grey;
    text-decoration: none;
  }

  a:hover {
    color: #ffffff;
    }

  ul {
    display: flex;
    justify-content: center;
    margin: 2rem 0 0 -0.5rem;

    a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 4.4rem;
      height: 4.4rem;

      svg {
        transition: all 0.3s ease-in-out;
      }

      &:hover,
      &:focus {
        svg {
          fill: #fff;
        }
      }
    }
  }
}
.language-selector {
  position: relative;
  cursor: pointer;
}


.selected-language {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.world-icon {
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
}

.language {
  margin-right: 0.5rem;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  margin-left: 0.5rem;
}

.language-menu {
  left: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 5px 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: none;
}

.language-menu label {
  display: block;
  padding: 0.5rem;
  cursor: pointer;
}

.language-menu label:hover {
  background-color: #f5f5f5;
}

.language-menu.active {
  display: block;
}
</style>


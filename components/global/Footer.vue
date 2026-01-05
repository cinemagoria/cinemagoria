<template>
  <footer :class="$style.footer">
    <div :class="$style.container">
      <div :class="$style.grid">
        <div :class="$style.column">
          <h4 :class="$style.heading">Recursos</h4>
          <ul :class="$style.links">
            <li><nuxt-link to="/contact">Contacto</nuxt-link></li>
            <li><nuxt-link to="/changelog">Últimas Novedades</nuxt-link></li>
            <li><nuxt-link to="/usage-policies">Privacidad y Términos</nuxt-link></li>
          </ul>
        </div>

        <div :class="$style.column">
           <div :class="$style.socials">
              <a href="https://github.com/imprvhub/entercinema" target="_blank" rel="noopener" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12"/></svg>
              </a>
              <a href="mailto:hello@entercinema.com" aria-label="Email">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M0 3v18h24V3zm21.518 2L12 12.713 2.482 5zM2 19V7.183l10 8.104 10-8.104V19z"/></svg>
              </a>
           </div>
        </div>
      </div>

      <div :class="$style.divider"></div>

      <div :class="$style.bottomBar">
         <div :class="$style.attribution">
            Todos los datos son proporcionados por 
            <a target="_blank" href="https://www.themoviedb.org/" rel="noopener" style="margin: 0 4px;">
                <img src="/tmdb.svg" alt="TMDB Attribution" style="margin-bottom: 0.5px; width: 60px; height: 35px; display: inline-block; vertical-align: middle;">
            </a>
            y 
            <a target="_blank" href="https://www.justwatch.com/" rel="noopener" style="margin: 0 4px; font-size: 11px;">JustWatch.</a>
         </div>
         <div :class="$style.copyright">
             &copy; {{ new Date().getFullYear() }} ENTERCINEMA.COM
         </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.footer {
  background-color: transparent;
  padding: 1.5rem 1rem 5rem;
  color: $text-color-grey;
  margin-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.307);

  @media (min-width: $breakpoint-large) {
     padding: 1.5rem 1rem 0.5rem;
  }
}

.container {
  margin: 0 auto;
  width: 98%;
  max-width: 1350px;
  padding: 0 2rem;

  @media (min-width: 1500px) {
    max-width: 96%;
  }
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  text-align: center;
  justify-items: center;

  @media (min-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: flex-end; 
    text-align: left;
    gap: 0;
  }
}

.column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center; 
  
  @media (min-width: 768px) {
    justify-content: center;
  }

  &:first-child {
    @media (min-width: 768px) {
      align-items: flex-start;
    }
  }

  &:last-child {
    @media (min-width: 768px) {
      align-items: flex-end;
    }
  }
}

.heading {
  font-size: 1.4rem;
  font-weight: 600;
  color: #80868b;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 0.25rem;
}

.links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;

  @media (min-width: 768px) {
    align-items: flex-start;
  }

  li a {
    color: $text-color-grey;
    text-decoration: none;
    font-size: 1.4rem;
    transition: color 0.3s ease;

    &:hover, :global(.nuxt-link-active) {
      color: #8BE9FD;
    }
  }
}

.socials {
  display: flex;
  gap: 3rem;
  justify-content: center;
  margin-top: 1rem;
  
  @media (min-width: 768px) {
    justify-content: flex-end;
    margin-top: 0;
  }

  a {
    color: $text-color-grey;
    transition: all 0.3s ease;
    
    &:hover {
      color: #8BE9FD;
      transform: translateY(-2px);
    }
    
    svg {
      width: 21.5px;
      height: 21.5px;
    }
  }
}

.divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.307);
  margin: 1.5rem 0;
}

.bottomBar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
  color: $text-color-grey;
  text-align: center;
}

.attribution {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  line-height: 1.6;
  text-transform: uppercase;
  letter-spacing: 1.5px;

  a {
    color: #fff;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.copyright {
  font-size: 1.2rem;
  color: #80868b;
  margin-top: 0.5rem;
}
</style>
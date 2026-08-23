<template>
  <div :class="$style.modalOverlay" @click.self="$emit('close')">
    <div :class="$style.modalContent">
      <div :class="$style.modalHeader">
        <button @click="$emit('close')" :class="$style.closeButton" aria-label="Close"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>

      <div :class="$style.modalBody">
        <div :class="$style.intro">
          <h3>Search Guide</h3>
          <p>Cinemagoria offers multiple ways to search for movies, series, people and more.</p>
        </div>

        <div :class="$style.guideSection">
          <div :class="$style.guideCard">
            <div :class="$style.guideCardHeader">
              <div :class="$style.guideIcon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M11 15a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M18.5 18.5l2.5 2.5" /><path d="M4 6h16" /><path d="M4 12h4" /><path d="M4 18h4" /></svg>
              </div>
              <h4>Direct Search</h4>
            </div>
            <p>Type the name of a movie, series, person, festival, production company or streaming service . Results are organized by category.</p>
            <div :class="$style.exampleBlock">
              <span :class="$style.exampleLabel">Example</span>
              <code>The Godfather</code>
            </div>
          </div>

          <div :class="$style.guideCard">
            <div :class="$style.guideCardHeader">
              <div :class="$style.guideIcon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M11.36 20.213l-2.36 .787v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414" /><path d="M15 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M20.2 20.2l1.8 1.8" /></svg>
              </div>
              <h4>Contextual Search</h4>
            </div>
            <p>Add a release year to prioritize a specific entry. Use <code>+</code> followed by a person's name to prioritize titles featuring that person.</p>
            <div :class="$style.exampleBlock">
              <span :class="$style.exampleLabel">By Year</span>
              <code>The Godfather 1990</code>
              <span :class="$style.exampleHint">Prioritizes The Godfather Part III (1990)</span>
            </div>
            <div :class="$style.exampleBlock">
              <span :class="$style.exampleLabel">By Person</span>
              <code>The Godfather + Robert De Niro</code>
              <span :class="$style.exampleHint">Prioritizes The Godfather Part II where De Niro stars</span>
            </div>
          </div>

          <div :class="$style.guideCard">
            <div :class="$style.guideCardHeader">
              <div :class="$style.guideIcon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18.9 7a8 8 0 0 1 1.1 5v1a6 6 0 0 0 .8 3" /><path d="M8 11a4 4 0 0 1 8 0v1a10 10 0 0 0 2 6" /><path d="M12 11v2a14 14 0 0 0 2.5 8" /><path d="M8 15a18 18 0 0 0 1.8 6" /><path d="M4.9 19a22 22 0 0 1 -.9 -7v-1a8 8 0 0 1 12 -6.95" /></svg>
              </div>
              <h4>Search by ID</h4>
            </div>
            <p>Enter an IMDb ID (starting with <code>tt</code>) or a numeric TMDB ID to go directly to a specific title.</p>
            <div :class="$style.exampleBlock">
              <span :class="$style.exampleLabel">IMDb ID</span>
              <code>tt0068646</code>
              <span :class="$style.exampleHint">Finds The Godfather via its IMDb identifier</span>
            </div>
            <div :class="$style.exampleBlock">
              <span :class="$style.exampleLabel">TMDB ID</span>
              <code>238</code>
              <span :class="$style.exampleHint">Goes directly to The Godfather (TMDB ID: 238)</span>
            </div>
          </div>
        </div>

        <div :class="$style.footer">
          <button @click="$emit('close')" :class="$style.gotItButton">Got It</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchGuideModal'
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.modalOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(1, 4, 6, 0.82);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modalContent {
  position: relative;
  background-color: #040E13;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 28' width='56' height='28'%3E%3Cpath fill='%237ed2e3' fill-opacity='0.06' d='M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0zm-5.43 2.71c1.13-.72 2.3-1.37 3.54-1.93a19.98 19.98 0 0 0-32.76 0c1.23.56 2.41 1.2 3.54 1.93a15.98 15.98 0 0 1 25.68 0zm-4.67 3.78c.94-.95 1.96-1.83 3.03-2.63a13.98 13.98 0 0 0-22.4 0c1.07.8 2.09 1.68 3.03 2.63a9.99 9.99 0 0 1 16.34 0z'%3E%3C/path%3E%3C/svg%3E"),
    radial-gradient(110% 80% at 8% 0%, rgba(31, 84, 103, 0.26), transparent 52%),
    linear-gradient(150deg, #071820 0%, #040D12 58%, #02080B 100%);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(139, 233, 253, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(139, 233, 253, 0.18);
  
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 20px;
  width: 100%;
  max-width: 680px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}

.modalHeader {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0.6rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.closeButton {
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(139, 233, 253, 0.08);
  border: 1px solid rgba(139, 233, 253, 0.22);
  color: #8BE9FD;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;

  &:hover {
  background: rgba(139, 233, 253, 0.18);
    border-color: rgba(139, 233, 253, 0.5);
    color: #fff;
  }
}

.modalBody {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 2rem;
}

.intro {
  text-align: center;
  margin-bottom: 1.5rem;

  h3 {
    font-size: 1.8rem;
    color: #8BE9FD;
    margin: 0 0 0.5rem 0;
  }

  p {
    font-size: 1.3rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.5;
    margin: 0 auto;
    max-width: 480px;
  }
}

.guideSection {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.2rem;
}

.guideCard {
  background: rgba(0, 0, 0, 0.307);
  border-radius: 12px;
  padding: 1.4rem;
  border: 1px solid rgba(139, 233, 253, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(139, 233, 253, 0.12);
    border-color: rgba(139, 233, 253, 0.35);
  }

  p {
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.5;
    margin: 0.6rem 0 0.8rem 0;
  }

  code {
    background: rgba(139, 233, 253, 0.12);
    color: #8BE9FD;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 1.15rem;
  }
}

.guideCardHeader {
  display: flex;
  align-items: center;
  gap: 0.8rem;

  h4 {
    font-size: 1.4rem;
    color: #fff;
    margin: 0;
  }
}

.guideIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(139, 233, 253, 0.1);
  border: 1.5px solid rgba(139, 233, 253, 0.3);
  color: #8BE9FD;
  flex-shrink: 0;

  svg { width: 16px; height: 16px; }
}

.exampleBlock {
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(139, 233, 253, 0.12);
  border-radius: 8px;
  padding: 0.6rem 1rem;
  margin-top: 0.6rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;

  code {
    font-size: 1.2rem;
    font-weight: 600;
  }
}

.exampleLabel {
  font-size: 1rem;
  font-weight: 700;
  color: rgba(139, 233, 253, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.exampleHint {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  width: 100%;
  margin-top: 0.1rem;
}

.footer {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.gotItButton {
  padding: 0.8rem 2.2rem;
  background: #8BE9FD;
  border: none;
  border-radius: 8px;
  color: #000;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #7DD4E8;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(139, 233, 253, 0.4);
  }
}

@media (max-width: 768px) {
  .modalOverlay {
    padding: 0.8rem;
    align-items: flex-start;
    padding-top: 4rem;
  }

  .modalContent {
    max-width: 100%;
    max-height: 90vh;
  }

  .modalBody {
    padding: 1rem;
  }

  .intro {
    margin-bottom: 1rem;
    h3 { font-size: 1.5rem; }
    p { font-size: 1.2rem; }
  }

  .guideCard {
    padding: 1rem;
    p { font-size: 1.15rem; }
  }

  .guideCardHeader h4 { font-size: 1.3rem; }
}
</style>

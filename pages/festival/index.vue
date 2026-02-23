<template>
  <main class="main">
    <div class="container">
      <h1 class="title-primary">Film Festivals</h1>
      <p class="title-secondary">Explore our curated selections from the world's leading film festivals.</p>

      <div class="festivals-grid">
        <nuxt-link to="/festival/sxsw-2026" class="festival-card">
          <div class="card-image-wrapper">
             <img src="/festivals/sxsw/sxsw_backdrop_2026_eng.webp" alt="SXSW 2026" />
             <div class="overlay"></div>
             <div class="card-content">
               <h2>SXSW 2026</h2>
               <span class="festival-dates">Mar 12–18, 2026</span>
               <span class="explore-btn">Explore</span>
             </div>
          </div>
        </nuxt-link>

        <nuxt-link to="/festival/slamdance-2026" class="festival-card">
          <div class="card-image-wrapper">
             <img src="/festivals/slamdance/slamdance_backdrop_2026_eng.webp" alt="Slamdance 2026" />
             <div class="overlay"></div>
             <div class="card-content">
               <h2>Slamdance 2026</h2>
               <span class="festival-dates">Feb 19–26, 2026</span>
               <span class="explore-btn">Explore</span>
             </div>
          </div>
        </nuxt-link>

        <nuxt-link to="/festival/romford-2026" class="festival-card">
          <div class="card-image-wrapper">
             <img src="/festivals/romford/romford_backdrop_2026_eng.webp" alt="Romford Horror Film Festival 2026" />
             <div class="overlay"></div>
             <div class="card-content">
               <h2>Romford Horror 2026</h2>
               <span class="festival-dates">Feb 19–22, 2026</span>
               <span class="explore-btn">Explore</span>
             </div>
          </div>
        </nuxt-link>

        <nuxt-link to="/festival/berlinale-2026" class="festival-card">
          <div class="card-image-wrapper">
             <img src="/festivals/berlinale/berlinale_backdrop_2026_eng.webp" alt="Berlinale 2026" />
             <div class="overlay"></div>
             <div class="card-content">
               <h2>Berlinale 2026</h2>
               <span class="festival-dates">Feb 12–22, 2026</span>
               <span class="explore-btn">Explore</span>
             </div>
          </div>
        </nuxt-link>

        <nuxt-link to="/festival/rotterdam-2026" class="festival-card">
          <div class="card-image-wrapper">
             <img src="/festivals/rotterdam/rotterdam_backdrop_2026_eng.webp" alt="Rotterdam 2026" />
             <div class="overlay"></div>
             <div class="card-content">
               <h2>Rotterdam 2026</h2>
               <span class="festival-dates">Jan 29 – Feb 8, 2026</span>
               <span class="explore-btn">Explore</span>
             </div>
          </div>
        </nuxt-link>

        <nuxt-link to="/festival/sundance-2026" class="festival-card">
          <div class="card-image-wrapper">
             <img src="/festivals/sundance/sundance_backdrop_2026_eng.webp" alt="Sundance 2026" />
             <div class="overlay"></div>
             <div class="card-content">
               <h2>Sundance 2026</h2>
               <span class="festival-dates">Jan 22 – Feb 1, 2026</span>
               <span class="explore-btn">Explore</span>
             </div>
          </div>
        </nuxt-link>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.main {
    padding-top: 2.5rem;
    padding-bottom: 4rem;
    min-height: 80vh;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.title-primary {
    font-family: 'Ortica', 'Roboto', sans-serif;
    font-weight: 300;
    font-size: clamp(2.4rem, 3.5vw, 3.6rem);
    letter-spacing: 0.05em;
    line-height: 1.2;
    color: #8BE9FD;
    text-shadow:
        0 1px 2px rgba(255, 255, 255, 0.3),
        0 2px 8px rgba(255, 255, 255, 0.2),
        0 4px 16px rgba(139, 233, 253, 0.15);
    text-align: center;
    margin-top: 0;
    margin-bottom: 1rem;
}

.title-secondary {
    font-family: 'Ortica', 'Roboto', sans-serif;
    font-weight: 300;
    font-size: 16px;
    letter-spacing: 0.08em;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
    margin-bottom: 4rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.festivals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    justify-content: center;
}

.festival-card {
    display: block;
    text-decoration: none;
    border-radius: 16px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        border-color: rgba(255, 255, 255, 0.2);
        
        .explore-btn {
            background: #8BE9FD;
            color: #000;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(139, 233, 253, 0.4);
        }
    }
}

.card-image-wrapper {
    position: relative;
    padding-top: 56.25%;
    background: #000;
    
    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    }
    
    .festival-card:hover img {
        opacity: 0.6;
    }
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
    pointer-events: none;
}

.card-content {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    
    h2 {
        font-size: 2rem;
        font-weight: 700;
        color: #8BE9FD;
        margin: 0 0 0.3rem;
        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }
}

.festival-dates {
    display: block;
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: #8BE9FD;
    text-transform: uppercase;
    margin-bottom: 0.9rem;
    text-shadow: 0 1px 4px rgba(139, 233, 253, 0.3);
}

.explore-btn {
    padding: 0.8rem 1.6rem;
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    border: 1px solid #8BE9FD;
    color: #8BE9FD;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    white-space: nowrap;
}

@media (max-width: 600px) {
    .festivals-grid {
        grid-template-columns: 1fr;
    }
    
    .page-title {
        font-size: 2rem;
    }
}
</style>

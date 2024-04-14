<template>
  <div class="genres-section">
    <p class="title custom-center">
      Buscar por Géneros:
    </p>
    <br>
    <br>
        <h2 class="custom-center" style="font-size: 16px;"><router-link to="/movie">Películas</router-link></h2>
          <ul class="custom-ul">
            <router-link to="/genre/18/movie"><img src="~static/thumbnails/drama-tv-esp.png" width="172" height="180" alt="Drama"></router-link>
            <router-link to="/genre/35/movie"><img src="~static/thumbnails/comedy-movie-esp.png" width="192" height="200" alt="Comedia"></router-link>
            <router-link to="/genre/28/movie"><img src="~static/thumbnails/action-movie-esp.png" width="192" height="200" alt="Acción"></router-link>
            <router-link to="/genre/27/movie"><img src="~static/thumbnails/horror-movie-esp.png" width="192" height="200" alt="Terror"></router-link>
            <router-link to="/genre/53/movie"><img src="~static/thumbnails/suspense-movie-esp.png" width="192" height="200" alt="Suspenso"></router-link>
            <router-link to="/genre/878/movie"><img src="~static/thumbnails/sciencefiction-movie-esp.png" width="192" height="200" alt="Ciencia Ficción"></router-link>
            <router-link to="/genre/12/movie"><img src="~static/thumbnails/adventure-tv-esp.png" width="192" height="200" alt="Aventura"></router-link>
            <router-link to="/genre/80/movie"><img src="~static/thumbnails/crime-movie-esp.png" width="192" height="200" alt="Crimen"></router-link>
            <router-link to="/genre/36/movie"><img src="~static/thumbnails/history-movie-esp.png" width="192" height="200" alt="Historia"></router-link>
            <router-link to="/genre/99/movie"><img src="~static/thumbnails/documentary-movie-esp.png" width="192" height="200" alt="Documental"></router-link>
            <router-link to="/genre/16/movie"><img src="~static/thumbnails/animation-movie-esp.png" width="192" height="200" alt="Animación"></router-link>
            <router-link to="/genre/9648/movie"><img src="~static/thumbnails/mistery-movie-esp.png" width="192" height="200" alt="Misterio"></router-link>
          </ul>
          <h2 class="custom-center" style="font-size: 16px; margin-top: 30px;"><router-link to="/tv">Series de TV</router-link></h2>
          <ul class="custom-ul">
            <router-link to="/genre/18/tv"><img src="~static/thumbnails/drama-tv-esp.png" width="192" height="200" alt="Drama TV"></router-link>
            <router-link to="/genre/35/tv"><img src="~static/thumbnails/comedy-tv-esp.png" width="192" height="200" alt="Comedia TV"></router-link>
            <router-link to="/genre/10759/tv"><img src="~static/thumbnails/action-movie-esp.png" width="192" height="200" alt="Acción y Aventura TV"></router-link>
            <router-link to="/genre/10765/tv"><img src="~static/thumbnails/sciencefiction-movie-esp.png" width="192" height="200" alt="Ciencia Ficción y Fantasía TV"></router-link>
            <router-link to="/genre/80/tv"><img src="~static/thumbnails/crime-tv-esp.png" width="192" height="200" alt="Crimen TV"></router-link>
            <router-link to="/genre/99/tv"><img src="~static/thumbnails/documentary-tv-esp.png" width="192" height="200" alt="Documental TV"></router-link>
            <router-link to="/genre/10767/tv"><img src="~static/thumbnails/talkshow-tv-esp.png" width="192" height="200" alt="Programa de Entrevistas TV"></router-link>
            <router-link to="/genre/16/tv"><img src="~static/thumbnails/animation-movie-esp.png" width="192" height="200" alt="Animación TV"></router-link>
            <router-link to="/genre/9648/tv"><img src="~static/thumbnails/mistery-tv-esp.png" width="192" height="200" alt="Misterio TV"></router-link>
          </ul>
    </div>
</template>

<script>
export default {
  name: "SearchByGenre",
};
</script>

<style scoped>
:root {
  --shadow-color: 200deg 40% 10%;
  --shadow-elevation-medium:
    0.1px 0.2px 0.3px hsl(var(--shadow-color) / 0),
    0.4px 0.8px 1.3px hsl(var(--shadow-color) / 0.1),
    0.7px 1.4px 2.3px hsl(var(--shadow-color) / 0.21),
    1.2px 2.4px 4px hsl(var(--shadow-color) / 0.31),
    2.1px 4.1px 6.9px hsl(var(--shadow-color) / 0.41);
  --shadow-elevation-high:
    0.1px 0.2px 0.3px hsl(var(--shadow-color) / 0),
    0.9px 1.7px 2.9px hsl(var(--shadow-color) / 0.05),
    1.5px 2.9px 4.9px hsl(var(--shadow-color) / 0.1),
    2.1px 4.1px 6.9px hsl(var(--shadow-color) / 0.14),
    2.8px 5.4px 9.1px hsl(var(--shadow-color) / 0.19),
    3.6px 7.1px 11.9px hsl(var(--shadow-color) / 0.24),
    4.7px 9.1px 15.4px hsl(var(--shadow-color) / 0.29),
    6px 11.7px 19.7px hsl(var(--shadow-color) / 0.34),
    7.7px 15.1px 25.4px hsl(var(--shadow-color) / 0.38),
    9.9px 19.4px 32.7px hsl(var(--shadow-color) / 0.43);
}

.title {
  font-size: 22px;
  max-width: 930px;
  padding-top: 20px;
  padding-bottom: 20px;
  margin: 0 auto;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(115, 115, 115) 100%);
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
  font-family: 'Tahoma', sans-serif;
}


a {
  font-weight: 600;
  color: #80868b;
  text-decoration: none;
  margin-top: 8px;
}

a:hover {
  color: #ffffff;
}

h1 {
  text-align: center;
  margin-bottom: 20px; 
  letter-spacing: 2px;
}

.genres-section {
  padding: 10px;
}

h2 {
  text-align: justify;
  letter-spacing: 2px;
  font-size: 11px;
  text-transform: uppercase;
  margin-bottom: 20px; 
}

.carousel {
  width: 100%;
}

.slide {
  display: flex;
  justify-content: center;
  align-items: center;
}

.column ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.column ul router-link {
  flex: 0 0 calc(33.33% - 20px); 
  margin: 10px;
  text-align: center;
}



.column ul img {
  width: 100%; 
  height: auto; 
  
}

.custom-ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.custom-ul router-link {
  flex: 0 0 calc(33.33% - 20px); 
  margin: 10px;
  text-align: center;
  margin-bottom: 0.5rem; 
}

.custom-ul img {
  width: 80%; 
  max-width: 192px; 
  height: 96%; 
  margin-top:10px;
}
.custom-center {
  text-align: center;
}
</style>

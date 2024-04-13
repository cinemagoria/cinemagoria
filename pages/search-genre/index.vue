<template>
    <div class="genres-section">
      
      <h1 class="text-white text-center"><br><b>Buscar por Géneros:</b></h1>
      <br>
      <div class="columns-container">
        <div class="column">
          <h2><router-link to="/movie">Películas</router-link></h2>
          <ul>
            <router-link to="/genre/18/movie"><img src="~static/thumbnails/drama-tv-esp.png" width="192" height="200" alt="Drama"></router-link>
            <router-link to="/genre/35/movie"><img src="~static/thumbnails/comedy-movie-esp.png" width="192" height="200" alt="Comedia"></router-link>
            <router-link to="/genre/28/movie"><img src="~static/thumbnails/action-movie-esp.png" width="192" height="200" alt="Acción"></router-link>
            <router-link to="/genre/27/movie"><img src="~static/thumbnails/horror-movie-esp.png" width="192" height="200" alt="Terror"></router-link>
            <router-link to="/genre/53/movie"><img src="~static/thumbnails/suspense-movie-esp.png" width="192" height="200" alt="Suspenso"></router-link>
            <router-link to="/genre/878/movie"><img src="~static/thumbnails/sciencefiction-movie-esp.png" width="192" height="200" alt="Ciencia Ficción"></router-link>
            <router-link to="/genre/12/movie"><img src="~static/thumbnails/adventure-tv-esp.png" width="192" height="200" alt="Aventura"></router-link>
            <router-link to="/genre/80/movie"><img src="~static/thumbnails/crime-movie-esp.png" width="192" height="200" alt="Crimen"></router-link>
            <router-link to="/genre/36/movie"><img src="~static/thumbnails/history-movie-esp.png" width="192" height="200" alt="Historia"></router-link>
            <router-link to="/genre/10752/movie"><img src="~static/thumbnails/war-movie-esp.png" width="192" height="200" alt="Guerra"></router-link>
            <router-link to="/genre/99/movie"><img src="~static/thumbnails/documentary-movie-esp.png" width="192" height="200" alt="Documental"></router-link>
            <router-link to="/genre/16/movie"><img src="~static/thumbnails/animation-movie-esp.png" width="192" height="200" alt="Animación"></router-link>
            <router-link to="/genre/9648/movie"><img src="~static/thumbnails/mistery-movie-esp.png" width="192" height="200" alt="Misterio"></router-link>
          </ul>
        </div>
        <div class="column">
          <h2><router-link to="/tv">Programas de TV</router-link></h2>
          <ul>
            <router-link to="/genre/18/tv"><img src="~static/thumbnails/drama-tv-esp.png" width="192" height="200" alt="Drama TV"></router-link>
            <router-link to="/genre/35/tv"><img src="~static/thumbnails/comedy-tv-esp.png" width="192" height="200" alt="Comedia TV"></router-link>
            <router-link to="/genre/10759/tv"><img src="~static/thumbnails/action-movie-esp.png" width="192" height="200" alt="Acción y Aventura TV"></router-link>
            <router-link to="/genre/10765/tv"><img src="~static/thumbnails/sciencefiction-movie-esp.png" width="192" height="200" alt="Ciencia Ficción y Fantasía TV"></router-link>
            <router-link to="/genre/80/tv"><img src="~static/thumbnails/crime-tv-esp.png" width="192" height="200" alt="Crimen TV"></router-link>
            <router-link to="/genre/10768/tv"><img src="~static/thumbnails/war-movie-esp.png" width="192" height="200" alt="Guerra y Política TV"></router-link>
            <router-link to="/genre/99/tv"><img src="~static/thumbnails/documentary-tv-esp.png" width="192" height="200" alt="Documental TV"></router-link>
            <router-link to="/genre/10767/tv"><img src="~static/thumbnails/talkshow-tv-esp.png" width="192" height="200" alt="Programa de Entrevistas TV"></router-link>
            <router-link to="/genre/16/tv"><img src="~static/thumbnails/animation-movie-esp.png" width="192" height="200" alt="Animación TV"></router-link>
            <router-link to="/genre/9648/tv"><img src="~static/thumbnails/mistery-tv-esp.png" width="192" height="200" alt="Misterio TV"></router-link>
          </ul>
        </div>
      </div>
    </div>
</template>
  
<script>
  export default {
    name: "SearchByGenre",
  };
</script>

<style scoped>
a {
  font-weight: 600;
  color: #80868b;
  text-decoration: none;
}

a:hover {
  color: #ffffff;
}

h1 {
  text-align: center;
  margin-bottom: 20px; 
  letter-spacing: 2px;
}

.columns-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.column {
  width: calc(50% - 20px);
  margin: 0 10px;
}

.button-container {
  display: flex;
  justify-content: center;
  
}

.li {
  font-size: 12px;
}

.genres-section {
  padding: 10px;
}

.button {
  border-radius: 10px;
}

h2 {
  text-align: justify;
  letter-spacing: 2px;
  font-size: 11px;
  text-transform: uppercase;
  margin-bottom: 20px; 
}

.custom-center {
  text-align: center;
}


</style>

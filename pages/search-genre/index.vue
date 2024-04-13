<template>
    <div class="genres-section">
      
      <h1 class="text-white text-center"><br><b>Buscar por Géneros:</b></h1>
      <br>
      <div class="columns-container">
        <div class="column">
          <h2><router-link to="/movie">Películas</router-link></h2>
          <ul>
            <li><router-link to="/genre/18/movie">Drama</router-link></li>
            <li><router-link to="/genre/35/movie">Comedia</router-link></li>
            <li><router-link to="/genre/28/movie">Acción</router-link></li>
            <li><router-link to="/genre/27/movie">Terror</router-link></li>
            <li><router-link to="/genre/53/movie">Suspenso</router-link></li>
            <li><router-link to="/genre/878/movie">Ciencia Ficción</router-link></li>
            <li><router-link to="/genre/12/movie">Aventura</router-link></li>
            <li><router-link to="/genre/80/movie">Crimen</router-link></li>
            <li><router-link to="/genre/36/movie">Historia</router-link></li>
            <li><router-link to="/genre/10752/movie">Guerra</router-link></li>
            <li><router-link to="/genre/99/movie">Documental</router-link></li>
            <li><router-link to="/genre/16/movie">Animación</router-link></li>
            <li><router-link to="/genre/9648/movie">Misterio</router-link></li>
          </ul>
        </div>
        <div class="column">
          <h2><router-link to="/tv">Programas de TV</router-link></h2>
          <ul>
            <li><router-link to="/genre/18/tv">Drama</router-link></li>
            <li><router-link to="/genre/35/tv">Comedia</router-link></li>
            <li><router-link to="/genre/10759/tv">Acción & Aventura</router-link></li>
            <li><router-link to="/genre/10765/tv">Ciencia Ficción & Fantasía</router-link></li>
            <li><router-link to="/genre/80/tv">Crimen</router-link></li>
            <li><router-link to="/genre/10768/tv">Guerra & Política</router-link></li>
            <li><router-link to="/genre/99/tv">Documental</router-link></li>
            <li><router-link to="/genre/10767/tv">Programa de Entrevistas</router-link></li>
            <li><router-link to="/genre/16/tv">Animación</router-link></li>
            <li><router-link to="/genre/9648/tv">Misterio</router-link></li>
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

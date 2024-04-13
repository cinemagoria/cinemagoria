<template>
    <div class="genres-section">
      
      <h1 class="text-white text-center"><br><b>Search by Genres:</b></h1>
      <br>
      <div class="columns-container">
        <div class="column">
          <h2><router-link to="/movie">Movies</router-link></h2>
          <ul>
            <li><router-link to="/genre/18/movie">Drama</router-link></li>
            <li><router-link to="/genre/35/movie">Comedy</router-link></li>
            <li><router-link to="/genre/28/movie">Action</router-link></li>
            <li><router-link to="/genre/27/movie">Horror</router-link></li>
            <li><router-link to="/genre/53/movie">Suspense</router-link></li>
            <li><router-link to="/genre/878/movie">Science Fiction</router-link></li>
            <li><router-link to="/genre/12/movie">Adventure</router-link></li>
            <li><router-link to="/genre/80/movie">Crime</router-link></li>
            <li><router-link to="/genre/36/movie">History</router-link></li>
            <li><router-link to="/genre/10752/movie">War</router-link></li>
            <li><router-link to="/genre/99/movie">Documentary</router-link></li>
            <li><router-link to="/genre/16/movie">Animation</router-link></li>
            <li><router-link to="/genre/9648/movie">Mystery</router-link></li>
          </ul>
        </div>
        <div class="column">
          <h2><router-link to="/tv">TV Shows</router-link></h2>
          <ul>
            <li><router-link to="/genre/18/tv">Drama</router-link></li>
            <li><router-link to="/genre/35/tv">Comedy</router-link></li>
            <li><router-link to="/genre/10759/tv">Action & Adventure</router-link></li>
            <li><router-link to="/genre/10765/tv">Sci-Fi & Fantasy</router-link></li>
            <li><router-link to="/genre/80/tv">Crime</router-link></li>
            <li><router-link to="/genre/10768/tv">War & Politics</router-link></li>
            <li><router-link to="/genre/99/tv">Documentary</router-link></li>
            <li><router-link to="/genre/10767/tv">Talk Show</router-link></li>
            <li><router-link to="/genre/16/tv">Animation</router-link></li>
            <li><router-link to="/genre/9648/tv">Mystery</router-link></li>
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

  
<template>
  <div class="feature-description">
    <h1 class="metal-gradient">Your Portal to Entertainment Discovery.</h1>
    <p class="feature-description">
      Step in and discover exactly what to watch in seconds, not hours. Browse streaming options, reviews, trailers and cast details, then save your favorites for later. All in one place.
    </p>
  </div>
</template>

<script>
export default {
  name: 'FeatureDescription',
};
</script>

<style scoped>
.feature-description {
  text-align: center;
  margin-top: 22px;
  padding-bottom: 20px;
}

.metal-gradient {
  padding: 30px;
  font-size: 52px;
  font-family: 'Tahoma', sans-serif;
  font-weight: 800;
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(115, 115, 115) 100%);
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
}

.feature-description p {
  font-size: 22px;
  width: 90%;
  padding-bottom: 40px;
  margin: 0 auto;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(115, 115, 115) 100%);
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
  font-family: 'Tahoma', sans-serif;
}


@media screen and (min-width: 200px) and (max-width: 460px) {
  .metal-gradient {
    font-size: 18px;
  }

  .feature-description p {
    font-size: 14px;
  }
}

@media screen and (max-width: 799px) {
  .metal-gradient {
    font-size: 32px; 
  }
  .feature-description p {
    font-size: 16px;
  }
}
</style>

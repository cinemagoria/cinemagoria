<template>
  <div class="watch-on-container" v-if="providers && providers.length">
    <h4 class="section-title">Ver en</h4>
    <div class="links-grid">
      


      <div 
        v-for="(provider, index) in providers" 
        :key="`prov-${index}`" 
        class="link-item tmdb-provider"
      >
        <a 
          :href="provider.link"
          target="_blank"
          rel="noopener noreferrer"
          class="provider-content"
          :title="`Ver en ${provider.name}`"
        >
          <img 
            v-if="provider.logo_path"
            :src="`https://image.tmdb.org/t/p/original${provider.logo_path}`" 
            :alt="provider.name"
            class="provider-icon"
          />
          <span class="label-style">{{ provider.name }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  name: 'WatchOn',
  props: {
    providers: {
      type: Array,
      default: () => []
    },
    imdbId: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      required: true
    }
  },

  data() {
    return {
    };
  },



  mounted() {
  },

  watch: {
    imdbId(newVal) {
    }
  },


};
</script>

<style scoped>
.watch-on-container {
  margin: 16px 0;
  width: 100%;
  max-width: 580px; 
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.link-item {
  width: 100%;
}

.link-item a {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 10px 12px;
  background-color: rgba(255, 255, 255, 0.027);
  border-radius: 8px;
  color: #ffffff;
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.1s ease;
  box-sizing: border-box;
  height: auto;
  min-height: 44px;
}

.link-item a:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateX(4px);
  color: #8AE8FC;
}

.link-icon, .provider-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin-right: 10px;
  border-radius: 4px;
  object-fit: cover;
}

.label-style {
  font-size: 14px;
  padding-left: 0.5rem;
  white-space: normal;
  line-height: 1.2;
  word-break: break-word;
}



@media (max-width: 600px) {
  .links-grid {
    grid-template-columns: 1fr;
  }
  
  .label-style {
    font-size: 13px;
  }
}

.link-item.tmdb-provider .provider-content {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 10px 12px;
  background-color: rgba(255, 255, 255, 0.027);
  border-radius: 8px;
  color: #ffffff;
  box-sizing: border-box;
  height: auto;
  min-height: 44px;
  cursor: default;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.link-item.tmdb-provider .provider-content:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.307);
}


</style>
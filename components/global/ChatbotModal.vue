<template>
  <div v-if="chatBotOpen" class="chatbot-modal" @click.self="closeChatBot">
    <div class="chatbot-container" style="z-index: 6 !important;">
      <div class="chatbot-header">
        <h3>Preguntar a IA</h3>
        <button @click="closeChatBot" class="close-button">×</button>
      </div>

      <div class="chatbot-messages" ref="chatbotMessagesContainer">
        <div v-if="!chatBotResponse && chatBotResults.length === 0 && !chatBotLoading" class="chatbot-welcome">
          <div class="examples-section">
            <h5>Prueba preguntar:</h5>
            <div class="example-item">"¿Quién dirigió The Matrix?"</div>
            <div class="example-item">"¿Quiénes actuaron en la película Pulp Fiction?"</div>
            <div class="example-item">"¿Quién fue la actriz de Gambito de Dama?"</div>
          </div>
          
          <div class="modern-divider">
            <span class="divider-line"></span>
            <span class="divider-text">O</span>
            <span class="divider-line"></span>
          </div>

          <div v-if="currentDailyPrompt" class="daily-prompt-section">
            <div class="daily-badge">PROMPT DIARIO</div>
              <div class="daily-prompt-content">
              <p>{{ currentDailyPrompt }}</p>
              <button @click="sendDailyPrompt" class="daily-prompt-button">Preguntar</button>
            </div>
          </div>
        </div>

        <div v-if="chatBotLoading && !chatBotResponse && chatBotResults.length === 0" class="reasoning-container">
          <div class="reasoning-indicator">
            Razonando
            <div class="dots-container">
              <span class="dot" :class="{ active: dotIndex === 0 }"></span>
              <span class="dot" :class="{ active: dotIndex === 1 }"></span>
              <span class="dot" :class="{ active: dotIndex === 2 }"></span>
            </div>
          </div>
        </div>

        <div v-if="chatBotResponse" class="chatbot-response">
          <p v-html="chatBotResponse"></p>
        </div>

        <div v-if="chatBotResults.length > 0" class="media-carousel">
          <h3 class="carousel-title">Resultados Relacionados</h3>
          <div class="carousel-container">
            <button @click="scrollCarousel('left')" class="carousel-nav carousel-prev">❮</button>
            <div class="carousel-content" ref="mediaCarousel">
              <div v-for="item in chatBotResults" :key="item.id + '-' + item.media_type" class="carousel-item">

                <a v-if="item.media_type === 'movie'"
                   :href="item.url"
                   class="media-link"
                   target="_blank">
                  <div class="poster-wrapper">
                    <img v-if="item.poster_path" :src="'https://image.tmdb.org/t/p/w342' + item.poster_path" :alt="item.title || 'Póster de Película'">
                    <img v-else src="/static/image_not_found.png" :alt="item.title || 'Póster de Película No Encontrado'">
                    <div class="media-type">Película</div>
                    <div class="movie-rating" v-if="item.vote_average > 0">
                      {{ (item.vote_average).toFixed(1) }}
                      <span class="star">★</span>
                    </div>
                  </div>
                  <div class="media-info">
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.release_date ? item.release_date.substring(0, 4) : 'N/D' }}</p>
                  </div>
                </a>

                <a v-else-if="item.media_type === 'tv'"
                   :href="item.url"
                   class="media-link"
                   target="_blank">
                  <div class="poster-wrapper">
                    <img v-if="item.poster_path" :src="'https://image.tmdb.org/t/p/w342' + item.poster_path" :alt="item.name || 'Póster de Serie'">
                    <img v-else src="/static/image_not_found.png" :alt="item.name || 'Póster de Serie No Encontrado'">
                    <div class="media-type">Serie</div>

                    <div class="movie-rating" v-if="item.vote_average > 0">
                      {{ (item.vote_average).toFixed(1) }}
                      <span class="star">★</span>
                    </div>
                  </div>
                  <div class="media-info">
                    <h4>{{ item.name }}</h4>
                    <p>{{ item.first_air_date ? item.first_air_date.substring(0, 4) : 'N/D' }}</p>
                  </div>
                </a>

                <a v-else-if="item.media_type === 'person'"
                   :href="item.url"
                   class="media-link"
                   target="_blank">
                  <div class="profile-wrapper">
                    <img v-if="item.profile_path" :src="'https://image.tmdb.org/t/p/w342' + item.profile_path" :alt="item.name || 'Perfil de Persona'">
                    <img v-else src="/static/image_not_found.png" :alt="item.name || 'Perfil de Persona No Encontrado'">
                    <div class="media-type">Persona</div>
                  </div>
                  <div class="media-info">
                    <h4>{{ item.name }}</h4>
                    <p>{{ item.known_for_department || '' }}</p>
                  </div>
                </a>
              </div>
            </div>
            <button @click="scrollCarousel('right')" class="carousel-nav carousel-next">❯</button>
          </div>
        </div>
      </div>

      <div class="chatbot-input">
        <div class="input-wrapper">
         <!-- Input real automáticamente visible en desktop, o cuando se activa en móvil -->
        <input
          v-if="inputEnabled || !isMobileDevice"
          v-model="chatBotQuery"
          placeholder="Pregunta sobre películas, series, actores..."
          @keyup.enter="sendChatBotQuery"
          ref="chatInput"
        >
        
        <!-- Input falso (visual) que solo aparece en móviles cuando inputEnabled es false -->
          <div 
            v-else-if="isMobileDevice && !inputEnabled"
            class="fake-input"
            @click="enableInput"
          >
            Pregunta sobre películas, series, actores...
          </div>
          <div class="input-backdrop" :style="{ width: inputWidth + '%' }"></div>
        </div>
        <button @click="sendChatBotQuery" :disabled="chatBotLoading || !chatBotQuery.trim()" class="send-button">
          <span v-if="chatBotLoading" class="loading-indicator">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          </span>
          <span v-else>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </span>
        </button>
      </div>
    </div>
    <div v-if="spoilerModalOpen" class="spoiler-modal">
          <div class="spoiler-content">
            <h3>Alerta de Spoiler</h3>
            <p>La respuesta podría contener spoilers sobre el plot, twists, finales o otros elementos narrativos.</p>
            <div class="spoiler-actions">
              <button @click="showSpoilerContent" class="spoiler-button accept">Puedo con la verdad</button>
              <button @click="cancelSpoilerContent" class="spoiler-button cancel">Cancelar</button>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ChatbotModal',
  data() {
    return {
      inputEnabled: false, 
      isMobileDevice: false,
      spoilerModalOpen: false,
      spoilerResponse: '',
      pendingSpoilerResponse: null,
      pendingSpoilerMediaReferences: null,
      dotIndex: 0,
      chatBotOpen: false,
      chatBotQuery: '',
      chatBotResponse: '',
      chatBotLoading: false,
      chatBotResults: [],
      inputWidth: 0,
      chatId: null,
      tmdbApiKey: process.env.API_KEY,
      baseUrl: typeof window !== 'undefined'
               ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000' : 'https://es.entercinema.com')
               : 'https://es.entercinema.com',
      apiUrl: typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
              ? 'https://entercinema-assistant-es.vercel.app/chat' 
              : 'https://entercinema-assistant-es.vercel.app/chat', 
      predefinedApiUrl: typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
              ? 'http://localhost:8000/api' 
              : 'https://entercinema-predefined-es.vercel.app/api',
      currentDailyPrompt: '',
      dailyPrompts: [
        "¿Cuáles fueron las contribuciones más innovadoras de Stanley Kubrick a la cinematografía?",
        "¿Cómo desafió el movimiento Dogme 95 al cine convencional?",
        "¿Cuáles son las características definitorias del Neorrealismo Italiano y su contexto histórico?",
        "¿Qué actor rechazó el papel de Neo en 'Matrix' antes de que se le ofreciera a Keanu Reeves?",
        "¿Quiénes fueron las directoras pioneras en la era del Nuevo Hollywood de los años 70 y qué obstáculos enfrentaron en comparación con sus homólogos masculinos?",
        "¿Qué actriz interpretó dos personajes diferentes en la misma película y fue nominada al Oscar por ambas interpretaciones?",
        "¿Cómo utilizó Tarkovsky la técnica del plano secuencia en 'Stalker' para crear una sensación de inmersión temporal, y qué significado filosófico tiene esta elección estética?",
        "¿Qué nominada al Oscar a Mejor Película fue filmada completamente usando solo luz natural?",
        "¿Podrías identificar a la actriz de cabello oscuro que interpretó a una chef en una serie dramática de restaurante donde todos gritan y también apareció en un episodio reciente de Black Mirror?",
        "¿Cuál fue la primera película en utilizar un sistema de imágenes generadas por computadora en 3D?",
        "¿Cuál es la película más cara jamás realizada?",
        "¿Cómo reconcilia la representación visual de Gargantúa en Interestelar la compleja física de los agujeros negros giratorios con la accesibilidad cinematográfica?"
      ],
      currentPromptIndex: -1
    };
  },
  watch: {
    chatBotOpen(isOpen) {
      if (isOpen) {
        this.$nextTick(() => {
          if (this.$refs.chatInput) {
            this.$refs.chatInput.focus();
          }
          this.resetChatState();
          this.loadDailyPrompt();
        });
      }
    }
  },
  created() {
    this.loadDailyPrompt();
  },
  mounted() {
    window.addEventListener('resize', this.checkMobileDevice);
    this.$nextTick(() => {
      if (this.$refs.chatbotMessagesContainer) {
        this.$refs.chatbotMessagesContainer.addEventListener('click', (event) => {
          if (event.target === this.$refs.chatbotMessagesContainer) {
            if (this.isMobileDevice && this.inputEnabled) {
              this.inputEnabled = false;
            }
          }
        });
      }
    });
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobileDevice);
    if (this.dotAnimationInterval) {
      clearInterval(this.dotAnimationInterval);
      this.dotAnimationInterval = null;
    }
  },
  methods: {
    checkMobileDevice() {
      this.isMobileDevice = window.innerWidth <= 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    enableInput() {
    this.inputEnabled = true;
    this.$nextTick(() => {
      if (this.$refs.chatInput) {
        this.$refs.chatInput.focus();
      }
    });
  },
  open() {
    this.chatBotOpen = true;
    this.checkMobileDevice();
    this.inputEnabled = !this.isMobileDevice;
  },
    close() {
      this.chatBotOpen = false;
    },
    startDotAnimation() {
      if (this.dotAnimationInterval) {
        clearInterval(this.dotAnimationInterval);
      }
      
      this.dotIndex = 0;
      this.dotAnimationInterval = setInterval(() => {
        this.dotIndex = (this.dotIndex + 1) % 3;
      }, 500);
    },
    resetChatState() {
        this.chatBotQuery = '';
        this.chatBotResponse = '';
        this.chatBotResults = [];
        this.chatBotLoading = false;
        this.inputWidth = 0;
    },

    closeChatBot() {
       this.close();
    },

    showSpoilerContent() {
      this.chatBotResponse = this.pendingSpoilerResponse;
      
      if (this.pendingSpoilerMediaReferences && this.pendingSpoilerMediaReferences.length > 0) {
        this.fetchMediaDetailsFromBackendReferences(this.pendingSpoilerMediaReferences);
      } else {
        this.chatBotResults = [];
      }
      
      this.pendingSpoilerResponse = null;
      this.pendingSpoilerMediaReferences = null;
      this.spoilerModalOpen = false;
      
      this.$nextTick(() => {
        this.scrollToBottom();
      });
      
      if (this.isMobileDevice) {
        this.inputEnabled = false;
      }
    },

    cancelSpoilerContent() {
      this.pendingSpoilerResponse = null;
      this.pendingSpoilerMediaReferences = null;
      this.spoilerModalOpen = false;
      this.chatBotQuery = '';
      this.chatBotLoading = false;
      
      if (this.$refs.chatInput) {
        this.$refs.chatInput.focus();
      }
    },

    loadDailyPrompt() {
      if (this.dailyPrompts.length > 0) {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));

        const promptIndex = dayOfYear % this.dailyPrompts.length;
        this.currentPromptIndex = promptIndex;
        this.currentDailyPrompt = this.dailyPrompts[promptIndex];
      }
    },
    
    sendDailyPrompt() {
      if (this.currentPromptIndex !== -1 && !this.chatBotLoading) {
        this.chatBotQuery = this.currentDailyPrompt;
        this.sendDailyPromptRequest();
      }
    },

async sendDailyPromptRequest() {
  if (!this.currentDailyPrompt || this.chatBotLoading) return;
  
  this.inputWidth = 100;
  this.chatBotLoading = true;
  this.startDotAnimation();
  this.chatBotResponse = '';
  this.chatBotResults = [];
  
  try {
    const promptIndex = this.currentPromptIndex;
 
    const payload = {
      query: this.currentDailyPrompt,
      chat_id: this.chatId,
      prompt_id: `daily_prompt_${promptIndex}`
    };
        
    let response;
    let usedFallback = false;
    
    try {
      response = await axios({
        method: 'post',
        url: this.predefinedApiUrl,
        data: payload,
        timeout: 45000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
    } catch (primaryError) {
      console.error('Error with predefined API, attempting fallback:', primaryError);
      
      try {
        const fallbackPayload = {
          query: this.currentDailyPrompt,
          chat_id: this.chatId
        };
        
        response = await axios({
          method: 'post',
          url: this.apiUrl,
          data: fallbackPayload,
          timeout: 45000,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        usedFallback = true;
      } catch (fallbackError) {
        console.error('Both APIs failed for daily prompt:', fallbackError);
        throw primaryError;
      }
    }
    
    this.chatId = response.data.chat_id || this.chatId || "session";
    
    let cleanResponse = response.data.result || '';
    cleanResponse = cleanResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    cleanResponse = cleanResponse.replace(/\*(.*?)\*/g, '<em>$1</em>');
    cleanResponse = cleanResponse.replace(/^\s*[\*\-]\s+(.*)/gm, '$1<br>');
    cleanResponse = cleanResponse.replace(/\n/g, '<br>');
    cleanResponse = cleanResponse.replace(/_{3}(.*?)_{3}/g, '<strong>$1</strong>');
    cleanResponse = cleanResponse.replace(/_{2}(.*?)_{2}/g, '<strong>$1</strong>');
    cleanResponse = cleanResponse.replace(/_{1}([^_]+)_{1}/g, '<em>$1</em>');
    cleanResponse = cleanResponse.replace(/\n/g, '<br>');
    this.chatBotResponse = cleanResponse;
      
    if (response.data.spoilerStatus === "spoiler") {
        this.pendingSpoilerResponse = cleanResponse;
        this.pendingSpoilerMediaReferences = response.data.media_references || [];
        this.spoilerModalOpen = true;
      } else {
        this.chatBotResponse = cleanResponse;
        
        if (response.data.media_references && response.data.media_references.length > 0) {
          await this.fetchMediaDetailsFromBackendReferences(response.data.media_references);
        } else {
          this.chatBotResults = [];
        }
        if (this.isMobileDevice) {
          this.inputEnabled = false;
        }
        this.chatBotQuery = '';
        
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
  } catch (error) {
    console.error('Error fetching from APIs:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    let errorMessage = 'An error occurred. Please try again.';
    if (axios.isCancel(error) || (error.code === 'ECONNABORTED' || (error.message && error.message.includes('timeout')))) {
        errorMessage = 'The request timed out. The AI might be taking too long to respond. Please try again later or rephrase your query.';
    } else if (error.response) {
        console.error('Response error data:', error.response.data);
        errorMessage = `Error ${error.response.status}: ${error.response.data?.detail || 'Failed to process request.'}`;
        if (error.response.status === 504) {
            errorMessage = 'The AI service seems to be unavailable or timed out. Please try again later.';
        } else if (error.response.status === 404) {
            errorMessage = 'The AI service is currently unavailable. Our team has been notified.';
        }
    } else if (error.request) {
        console.error('Request error:', error.request);
        errorMessage = 'Network Error: Could not reach the AI service. Please check your connection.';
    } else {
        errorMessage = 'An unexpected error occurred while processing your request.';
    }
    this.chatBotResponse = `<span style="color: #ff8c8c;">${errorMessage}</span>`;
    this.chatBotResults = [];
    
    this.chatBotQuery = '';
    
    this.$nextTick(() => {
      this.scrollToBottom();
    });
    if (this.isMobileDevice) {
      this.inputEnabled = false;
    }
  } finally {
    if (this.dotAnimationInterval) {
        clearInterval(this.dotAnimationInterval);
        this.dotAnimationInterval = null;
      }
    this.chatBotLoading = false;
    setTimeout(() => {
      this.inputWidth = 0;
    }, 300);
    this.$nextTick(() => {
      if (this.$refs.chatInput) {
          this.$refs.chatInput.focus();
      }
    });
  }
},

    scrollCarousel(direction) {
      const carousel = this.$refs.mediaCarousel;
      if (!carousel) return;

      const scrollAmount = carousel.offsetWidth * 0.8;

      if (direction === 'left') {
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    },

    async sendChatBotQuery() {
    const queryToSend = this.chatBotQuery.trim();
    if (!queryToSend || this.chatBotLoading) return;

    this.inputWidth = 100;
    this.chatBotLoading = true;
    this.startDotAnimation();
    this.chatBotResponse = '';
    this.chatBotResults = [];
    const currentQuery = this.chatBotQuery;
    this.chatBotQuery = '';

    try {
      const response = await axios.post(this.apiUrl, {
        query: queryToSend,
        chat_id: this.chatId
      }, { timeout: 45000 });

      this.chatId = response.data.chat_id;

      let cleanResponse = response.data.result || '';
      cleanResponse = cleanResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      cleanResponse = cleanResponse.replace(/\*(.*?)\*/g, '<em>$1</em>');
      cleanResponse = cleanResponse.replace(/^\s*[\*\-]\s+(.*)/gm, '$1<br>');
      cleanResponse = cleanResponse.replace(/\n/g, '<br>');
      cleanResponse = cleanResponse.replace(/_{3}(.*?)_{3}/g, '<strong>$1</strong>');
      cleanResponse = cleanResponse.replace(/_{2}(.*?)_{2}/g, '<strong>$1</strong>');
      cleanResponse = cleanResponse.replace(/_{1}([^_]+)_{1}/g, '<em>$1</em>');
      cleanResponse = cleanResponse.replace(/\n/g, '<br>');
      if (response.data.spoilerStatus === "spoiler") {
        this.pendingSpoilerResponse = cleanResponse;
        this.pendingSpoilerMediaReferences = response.data.media_references || [];
        this.spoilerModalOpen = true;
      } else {
        this.chatBotResponse = cleanResponse;
        const mediaReferences = response.data.media_references;
        if (mediaReferences && mediaReferences.length > 0) {
        await this.fetchMediaDetailsFromBackendReferences(mediaReferences);
        } else {
        this.chatBotResults = [];
        }
                          
        this.$nextTick(() => {
        this.scrollToBottom();
        });
        if (this.isMobileDevice) {
        this.inputEnabled = false;
      }
    }
                

    } catch (error) {
      console.error('Error al obtener respuesta de la API del chatbot:', error);
      let errorMessage = 'Ocurrió un error. Por favor, inténtalo de nuevo.';
      if (axios.isCancel(error) || (error.code === 'ECONNABORTED' || (error.message && error.message.includes('timeout')))) {
        errorMessage = 'La solicitud agotó el tiempo de espera. La IA podría estar tardando demasiado en responder. Por favor, inténtalo más tarde o reformula tu consulta.';
      } else if (error.response) {
        errorMessage = `Error ${error.response.status}: ${error.response.data?.detail || 'No se pudo procesar la solicitud.'}`;
        if (error.response.status === 504) {
          errorMessage = 'El servicio de IA parece no estar disponible o agotó el tiempo de espera. Por favor, inténtalo más tarde.';
        }
      } else if (error.request) {
        errorMessage = 'Error de red: No se pudo contactar con el servicio de IA. Por favor, verifica tu conexión.';
      } else {
        errorMessage = 'Ocurrió un error inesperado al procesar tu solicitud.';
      }
      this.chatBotResponse = `<span style="color: #ff8c8c;">${errorMessage}</span>`;
      this.chatBotResults = [];
      this.$nextTick(() => {
        this.scrollToBottom();
      });
      if (this.isMobileDevice) {
      this.inputEnabled = false;
    }
    } finally {
      if (this.dotAnimationInterval) {
        clearInterval(this.dotAnimationInterval);
        this.dotAnimationInterval = null;
      }
      this.chatBotLoading = false;
      setTimeout(() => {
        this.inputWidth = 0;
      }, 300);
      this.$nextTick(() => {
        if (this.$refs.chatInput) {
          this.$refs.chatInput.focus();
        }
      });
    }
  },

  async fetchMediaDetailsFromBackendReferences(references) {
    if (!this.tmdbApiKey) {
      console.error("¡Clave API de TMDB (API_KEY) no configurada!");
      this.chatBotResponse += "<br><small style='color: orange;'>No se pudieron obtener resultados relacionados (falta la clave API).</small>";
      this.chatBotResults = [];
      return;
    }

    const results = [];
    const promises = [];
    const seenIds = new Set();

    for (const ref of references) {
      if (!ref || typeof ref !== 'object' || !ref.name || !ref.type) {
        console.warn('Omitiendo referencia de medio inválida:', ref);
        continue;
      }

      let searchUrl = '';
      const params = {
        api_key: this.tmdbApiKey,
        query: ref.name,
        language: 'es-ES',
        page: 1,
        include_adult: false
      };

      switch (ref.type.toLowerCase()) {
        case 'movie':
          searchUrl = 'https://api.themoviedb.org/3/search/movie';
          break;
        case 'tv':
        case 'tv_show':
        case 'series':
          searchUrl = 'https://api.themoviedb.org/3/search/tv';
          params.first_air_date_year = ref.year || undefined;
          break;
        case 'person':
        case 'actor':
        case 'director':
          searchUrl = 'https://api.themoviedb.org/3/search/person';
          break;
        default:
          console.warn(`Tipo de medio no soportado "${ref.type}" para la referencia:`, ref);
          continue;
      }

      promises.push(
        axios.get(searchUrl, { params, timeout: 8000 })
          .then(response => {
            if (response.data?.results?.length > 0) {
              const item = response.data.results[0];
              const uniqueId = `${ref.type}-${item.id}`;

              if (item.id && !seenIds.has(uniqueId)) {
                seenIds.add(uniqueId);
                const formattedItem = {
                  ...item,
                  id: item.id,
                  media_type: ref.type,
                  url: `${this.baseUrl}/${ref.type}/${item.id}`,
                  title: ref.type === 'movie' ? item.title : undefined,
                  name: ref.type !== 'movie' ? item.name : undefined,
                  poster_path: item.poster_path || (ref.type === 'person' ? item.profile_path : undefined),
                  profile_path: ref.type === 'person' ? item.profile_path : undefined,
                  release_date: item.release_date,
                  first_air_date: item.first_air_date,
                  vote_average: item.vote_average || 0,
                  known_for_department: item.known_for_department
                };
                results.push(formattedItem);
              }
            } else {
              console.warn(`No se encontraron resultados en TMDB para: ${ref.name} (Tipo: ${ref.type})`);
            }
          })
          .catch(error => {
            if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
              console.error(`Tiempo de espera agotado al obtener datos de TMDB para ${ref.name} (${ref.type})`);
            } else {
              console.error(`Error al obtener datos de TMDB para ${ref.name} (${ref.type}):`, error.message || error);
            }
          })
      );
    }

    try {
      await Promise.all(promises);
    } catch (e) {
      console.error("Ocurrió un error durante Promise.all para las consultas a TMDB:", e);
    }

    this.chatBotResults = results.slice(0, 10);

    if (results.length === 0 && references.some(ref => ref.name && ref.type)) {
      this.chatBotResponse += "<br><small style='color: orange;'>No se pudieron obtener detalles para los resultados relacionados.</small>";
    }
    this.$nextTick(() => {
      this.scrollToBottom();
    });
  },

  scrollToBottom() {
      const container = this.$refs.chatbotMessagesContainer;
              if (container) {
                  container.scrollTop = container.scrollHeight;
                  if (this.isMobileDevice) {
                  if (document.activeElement === this.$refs.chatInput) {
                    this.$refs.chatInput.blur();
                  }
                }
              }
           }
        }
      }
</script>

<style scoped>
.chatbot-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.chatbot-container {
  width: 90%;
  max-width: 800px;
  height: 85vh;
  max-height: 700px;
  background: linear-gradient(135deg, rgba(6, 47, 64, 0.98) 0%, rgba(10, 30, 40, 0.99) 100%);
  box-shadow: 0 12px 40px 0 rgba(31, 104, 135, 0.6);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 16px;
  border: 1px solid rgba(127, 219, 241, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: translateY(0);
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.chatbot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 25px;
  border-bottom: 1px solid rgba(127, 219, 241, 0.2);
  background: rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.chatbot-header h3 {
  color: #7FDBF1;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
}

.spark-logo {
  font-size: 20px;
  margin-right: 8px;
  animation: sparkle 2s infinite;
}

@keyframes sparkle {
 0%, 100% { opacity: 1; transform: scale(1);}
 50% { opacity: 0.7; transform: scale(1.1);}
}

.close-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 30px;
  cursor: pointer;
  padding: 0;
  line-height: 0.8;
  transition: all 0.2s ease;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-button:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.chatbot-messages {
  flex: 1;
  padding: 25px;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.chatbot-welcome {
    text-align: center;
    padding: 30px 20px;
    color: #a8d8e4;
    font-size: 15px;
    line-height: 1.6;
}

.chatbot-welcome p {
    margin-bottom: 15px;
}

.chatbot-welcome p:last-child {
    margin-bottom: 0;
    font-size: 13px;
    color: #7fdbf1;
    opacity: 0.8;
}

.reasoning-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}



.reasoning-indicator {
  display: flex;
  align-items: center;
  background: rgba(13, 27, 42, 0.7);
  border: 1px solid rgba(127, 219, 241, 0.4);
  border-radius: 30px;
  padding: 12px 25px;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  color: #7FDBF1;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
}

.dots-container {
  display: flex;
  align-items: center;
  margin-left: 8px;
  height: 20px;
  position: relative;
  top: 4px;
}

.dot {
  width: 2px;
  height: 2px;
  margin: 0 1.5px;
  border-radius: 50%;
  background-color: rgba(127, 219, 241, 0.3);
  display: inline-block;
}

.dot.active {
  background-color: #7FDBF1;
  animation: pulse 1.4s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.8; }
}

@media screen and (max-width: 768px) {
  .reasoning-indicator {
    padding: 10px 20px;
    font-size: 15px;
  }
  
  .dot {
    width: 5px;
    height: 5px;
  }
}

@media screen and (max-width: 576px) {
  .reasoning-container {
    padding: 30px 0;
  }
  
  .reasoning-indicator {
    padding: 8px 18px;
    font-size: 14px;
  }
  
  .dot {
    width: 4px;
    height: 4px;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 0.9; }
  50% { opacity: 0.6; }
}

.chatbot-response {
  background: rgba(127, 219, 241, 0.06);
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 20px;
  border-left: 3px solid rgba(127, 219, 241, 0.4);
  animation: fadeInUp 0.5s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.chatbot-response p {
  margin: 0;
  color: #e0e0e0;
  line-height: 1.65;
  font-size: 15px;
  white-space: normal;
  word-wrap: break-word;
}
.chatbot-response p ::v-deep(strong) {
    color: #7FDBF1;
    font-weight: 600;
}
.chatbot-response p ::v-deep(em) {
    font-style: italic;
    color: #a8d8e4;
}
.chatbot-response p ::v-deep(ul) {
    margin: 10px 0 10px 20px;
    padding-left: 0;
}
.chatbot-response p ::v-deep(li) {
    margin-bottom: 5px;
}
.chatbot-response p ::v-deep(small) {
    font-size: 0.9em;
    opacity: 0.8;
}
.chatbot-response p ::v-deep(br) {
    content: "";
    display: block;
    margin-bottom: 0.5em;
}


.media-carousel {
  margin-top: 25px;
  animation: fadeInUp 0.6s ease;
}

.carousel-title {
  color: #7FDBF1;
  font-size: 16px;
  margin: 0 0 15px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.carousel-container {
  position: relative;
  display: flex;
  align-items: center;
}

.carousel-content {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 10px 5px;
  -ms-overflow-style: none;
  scrollbar-width: none;
  scroll-snap-type: x mandatory;
  gap: 15px;
  margin: 0 35px;
}
.carousel-content::-webkit-scrollbar {
  display: none;
}

.carousel-item {
  flex: 0 0 auto;
  width: 160px;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  scroll-snap-align: start;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  background-color: #0f2133;
}
.carousel-item:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
}

.poster-wrapper {
  position: relative;
  height: 240px;
  overflow: hidden;
  background-color: #222;
}
.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}
.carousel-item:hover img {
    transform: scale(1.05);
}

.media-link {
  display: block;
  text-decoration: none;
  color: inherit;
  height: 100%;
  transition: all 0.3s ease;
}
.poster-wrapper img[src$="image_not_found.png"],
.profile-wrapper img[src$="image_not_found.png"] {
    object-fit: contain;
    padding: 20px;
    background-color: #333;
}


.media-type {
    position: absolute;
    top: 8px;
    left: 8px;
    background: rgba(0, 0, 0, 0.75);
    color: #7FDBF1;
    border-radius: 5px;
    padding: 3px 8px;
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 0.5px;
    text-transform: uppercase;
}

.movie-rating {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.75);
    color: #fff;
    border-radius: 5px;
    padding: 3px 6px;
    font-size: 11px;
    display: flex;
    align-items: center;
}
.star {
    color: #FFC107;
    margin-left: 3px;
    font-size: 12px;
}

.profile-wrapper {
  position: relative;
  height: 240px;
  overflow: hidden;
  background: linear-gradient(to bottom, #15232d 0%, #0c161d 100%);
  background-color: #222;
}
.profile-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
  transition: transform 0.5s ease;
}


.media-info {
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.8);
  min-height: 65px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.media-info h4 {
  margin: 0 0 4px;
  font-size: 13px;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}
.media-info p {
  margin: 0;
  font-size: 11px;
  color: #7FDBF1;
}

.carousel-nav {
  background: rgba(20, 20, 20, 0.7);
  color: white;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  top: calc(50% - 18px);
  z-index: 10;
  transition: all 0.3s ease;
  font-size: 18px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
.carousel-prev { left: 0px; }
.carousel-next { right: 0px; }
.carousel-nav:hover {
    background: rgba(127, 219, 241, 0.3);
    border-color: rgba(127, 219, 241, 0.5);
}

.chatbot-input {
  display: flex;
  padding: 15px 25px;
  border-top: 1px solid rgba(127, 219, 241, 0.2);
  background: rgba(0, 0, 0, 0.3);
  position: relative;
  flex-shrink: 0;
}

.input-wrapper {
  position: relative;
  flex: 1;
}


  .input-backdrop {
    position: absolute;
    height: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(90deg, rgba(127, 219, 241, 0.05) 0%, rgba(127, 219, 241, 0.01) 100%);
    z-index: 0;
    border-radius: 8px;
    transition: width 0.3s ease;
    pointer-events: none;
  }
  
  .chatbot-input input {
    flex: 1;
    width: 100%;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(127, 219, 241, 0.3);
    border-radius: 8px;
    padding: 14px 20px;
    color: #fff;
    font-size: 15px;
    outline: none;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
    height: 48px;
    box-sizing: border-box;
  }
  .chatbot-input input:focus {
    border-color: rgba(127, 219, 241, 0.7);
    box-shadow: 0 0 0 1px rgba(127, 219, 241, 0.3);
  }
  .chatbot-input input::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  .send-button {
    background: linear-gradient(135deg, rgba(127, 219, 241, 0.3) 0%, rgba(0, 136, 204, 0.3) 100%);
    color: #fff;
    border: 1px solid rgba(127, 219, 241, 0.5);
    border-radius: 8px;
    width: 48px;
    height: 48px;
    margin-left: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  .send-button:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(127, 219, 241, 0.5) 0%, rgba(0, 136, 204, 0.5) 100%);
    transform: translateY(-1px);
    border-color: rgba(127, 219, 241, 0.8);
  }
  .send-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
    background: rgba(127, 219, 241, 0.1);
    border-color: rgba(127, 219, 241, 0.3);
  }
  .send-button svg {
    width: 20px;
    height: 20px;
    stroke: white;
  }
  
  .loading-indicator {
      display: flex;
      gap: 4px;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
  }
  .dot {
      width: 6px;
      height: 6px;
      background: white;
      border-radius: 50%;
      display: inline-block;
      animation: bounce 1.4s infinite ease-in-out both;
  }
  .dot:nth-child(1) { animation-delay: -0.32s; }
  .dot:nth-child(2) { animation-delay: -0.16s; }
  .dot:nth-child(3) { animation-delay: 0s; }
  
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1.0); }
  }
  
  @media screen and (max-width: 768px) {
      .chatbot-container {
          width: 95%;
          height: 90vh;
          max-height: 90vh;
      }
      .chatbot-messages {
        padding: 15px;
        min-height: 200px;
        padding-bottom: 15px; 
      }
      .chatbot-input {
          padding: 15px;
      }
      .carousel-content {
          margin: 0 5px;
      }
      .carousel-nav {
          width: 30px;
          height: 30px;
          font-size: 16px;
          top: calc(50% - 15px);
      }
      .carousel-prev { left: -5px; }
      .carousel-next { right: -5px; }
  }
  
  @media screen and (max-width: 576px) {
      .chatbot-header { padding: 12px 18px; }
      .chatbot-header h3 { font-size: 16px; }
      .spark-logo { font-size: 18px; }
      .close-button { font-size: 26px; }
      .chatbot-input { padding: 10px 15px; }
      .chatbot-input input {
          padding: 12px 15px;
          font-size: 14px;
          height: 42px;
      }
      .send-button {
          width: 42px;
          height: 42px;
          margin-left: 8px;
      }
      .send-button svg {
          width: 18px;
          height: 18px;
      }
      .carousel-item {
          width: 130px;
      }
      .poster-wrapper, .profile-wrapper {
          height: 195px;
      }
      .media-info {
          min-height: 55px;
      }
      .media-info h4 { font-size: 11px; }
      .media-info p { font-size: 9px; }
      .movie-rating { padding: 1px 4px; font-size: 9px;}
      .star { font-size: 10px;}
      .media-type { padding: 1px 5px; font-size: 8px;}
      .chatbot-welcome p { font-size: 14px; }
      .chatbot-welcome p:last-child { font-size: 12px; }
      
      .daily-prompt-section {
        padding: 15px;
      }
      
      .daily-prompt-section h5 {
        font-size: 14px;
      }
      
      .daily-prompt-content p {
        font-size: 13px;
      }
      
      .daily-prompt-button {
        font-size: 12px;
        padding: 6px 12px;
      }
  }
  .chatbot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 25px;
  border-bottom: 1px solid rgba(127, 219, 241, 0.2);
  background: rgba(13, 27, 42, 0.9);
  flex-shrink: 0;
}

.chatbot-header h3 {
  color: #fff;
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.chatbot-welcome {
  display: flex;
  flex-direction: column;
  padding: 25px;
  gap: 24px;
  color: #e0e0e0;
}

.welcome-main {
  text-align: left;
  margin-bottom: 5px;
}

.welcome-main h4 {
  color: #fff;
  font-size: 18px;
  margin: 0 0 12px 0;
  font-weight: 500;
}

.welcome-main p {
  font-size: 15px;
  margin: 0;
  color: #a8d8e4;
}

.examples-section {
  background: rgba(13, 27, 42, 0.3);
  border-radius: 8px;
  padding: 15px 20px;
}

.examples-section h5 {
  color: #fff;
  font-size: 14px;
  margin: 0 0 10px 0;
  font-weight: 500;
}

.examples-section ul {
  margin: 0;
  padding: 0 0 0 18px;
  list-style-type: none;
}

.examples-section li {
  position: relative;
  padding: 4px 0;
  font-size: 14px;
  color: #a8d8e4;
}

.examples-section li:before {
  content: "•";
  position: absolute;
  left: -15px;
  color: #7FDBF1;
}


.beta-notice {
  position: relative;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 16px 20px 16px 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  text-align: left;
  border-left: 3px solid #FF5252;
}

.beta-badge {
  background-color: #FF5252;
  color: white;
  font-weight: bold;
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 10px;
  text-transform: uppercase;
  display: inline-block;
  flex-shrink: 0;
  margin-top: 2px;
}

.daily-notice {
  position: relative;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 16px 20px 16px 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  text-align: left;
  border-left: 3px solid #7FDBF1;
}

.daily-badge {
  background-color: #295668;
  color: white;
  font-weight: bold;
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 10px;
  text-transform: uppercase;
  display: inline-block;
  flex-shrink: 0;
  margin-top: 2px;
}

.beta-notice p {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
  white-space: normal;
  word-wrap: break-word;
  display: inline;
}

.beta-notice a {
  color: #7FDBF1;
  text-decoration: underline;
  transition: color 0.2s ease;
  display: inline;
}

.beta-notice a:hover {
  color: #ffffff;
}

.daily-prompt-section {
  background: rgba(13, 27, 42, 0.5);
  border-radius: 10px;
  padding: 18px;
  border-left: 3px solid #7FDBF1;
  border-bottom: 1px solid rgba(127, 219, 241, 0.2);
  animation: fadeIn 0.5s ease;
}

.daily-prompt-section h5 {
  display: flex;
  align-items: center;
  margin: 0 0 12px 0;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
}

.new-badge {
  background-color: #7FDBF1;
  color: #0D1B2A;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
  font-weight: bold;
  text-transform: uppercase;
}

.daily-prompt-content {
  display: flex;
  flex-direction: column;
}

.daily-prompt-content p {
  color: #e0e0e0;
  margin-bottom: 15px;
  font-size: 14px;
  line-height: 1.5;
}

.daily-prompt-button {
  align-self: flex-start;
  background: linear-gradient(135deg, rgba(127, 219, 241, 0.3) 0%, rgba(0, 136, 204, 0.3) 100%);
  color: #fff;
  border: 1px solid rgba(127, 219, 241, 0.5);
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  max-width: 200px;
  margin: 0 auto;
  position: relative;
}

.daily-prompt-button:hover {
  background: linear-gradient(135deg, rgba(127, 219, 241, 0.5) 0%, rgba(0, 136, 204, 0.5) 100%);
  transform: translateY(-1px);
}

@media screen and (max-width: 768px) {
  .chatbot-modal {
    align-items: center;
    padding-top: 0;
    padding-bottom: 0;
    position: fixed;
    overflow-y: auto;
  }

  .chatbot-container {
    width: 95%;
    height: auto;
    max-height: 80vh;
    margin: 10px 0;
    display: flex;
    flex-direction: column;
  }

  .chatbot-messages {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 15px; 
  }

  .chatbot-input {
    position: sticky;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 10;
  }
}
.modern-divider {
  display: flex;
  align-items: center;
  margin: 15px 0;
  width: 100%;
  text-align: center;
}

.divider-line {
  flex-grow: 1;
  height: 1px;
  background-color: #a8d8f0;
}

.divider-text {
  padding: 0 15px;
  font-size: 14px;
  color: #7FDBF1;
}
.fake-input {
  flex: 1;
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(127, 219, 241, 0.3);
  border-radius: 8px;
  padding: 14px 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 15px;
  outline: none;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  height: 48px;
  box-sizing: border-box;
  cursor: text;
  display: flex;
  align-items: center;
}

.fake-input:hover {
  border-color: rgba(127, 219, 241, 0.7);
  box-shadow: 0 0 0 1px rgba(127, 219, 241, 0.3);
}

@media screen and (max-width: 768px) {
  .chatbot-modal {
    align-items: center;
    padding-top: 0;
    padding-bottom: 0;
    position: fixed;
    overflow-y: auto;
  }

  .chatbot-container {
    width: 95%;
    height: auto;
    max-height: 80vh;
    margin: 10px 0;
    display: flex;
    flex-direction: column;
  }

  .chatbot-messages {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 15px; 
  }

  .chatbot-input {
    position: sticky;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 10;
  }
}

@media screen and (max-width: 576px) {
  .fake-input {
    padding: 12px 15px;
    font-size: 14px;
    height: 42px;
  }
}
@media screen and (max-width: 576px) {
  .chatbot-messages {
    min-height: 150px;
  }
}
.spoiler-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  animation: fadeIn 0.3s ease;
}

.spoiler-content {
  width: 90%;
  max-width: 500px;
  background: linear-gradient(135deg, rgba(6, 45, 61, 0.9) 0%, rgba(80, 0, 0, 0.95) 100%);
  box-shadow: 0 12px 40px 0 rgba(255, 0, 0, 0.3);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 16px;
  border: 1px solid rgba(255, 102, 102, 0.5);
  padding: 25px;
  text-align: center;
  transform: translateY(0);
  animation: slideUp 0.4s ease;
}

.spoiler-content h3 {
  color: #fff;
  margin: 0 0 15px 0;
  font-size: 22px;
  font-weight: 600;
}

.spoiler-content p {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 25px;
  font-size: 16px;
  line-height: 1.5;
}

.spoiler-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  align-items: stretch;
}

.spoiler-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px; /* Altura mínima para ambos botones */
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  flex: 1; /* Hace que ambos botones ocupen el mismo espacio */
  max-width: 45%; /* Evita que los botones se expandan demasiado */
  white-space: normal; /* Permite que el texto se envuelva en múltiples líneas */
}

.spoiler-button.accept {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.spoiler-button.accept:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.spoiler-button.cancel {
  background: rgba(0, 0, 0, 0.6);
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.spoiler-button.cancel:hover {
  background: rgba(0, 0, 0, 0.8);
}

@media screen and (max-width: 768px) {
  .spoiler-content {
    width: 85%;
    padding: 20px;
  }
  
  .spoiler-content h3 {
    font-size: 18px;
  }
  
  .spoiler-content p {
    font-size: 14px;
    margin-bottom: 20px;
  }
  
  .spoiler-button {
    padding: 10px 16px;
    font-size: 13px;
  }
}
</style>


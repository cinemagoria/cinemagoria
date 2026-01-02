<template>
  <Teleport to="body">
    <div>
    <div v-if="chatBotOpen" class="chatbot-modal" @click.self="closeChatBot">
      <div class="chatbot-container">
        <div class="chatbot-main">
          <transition name="fade">
            <div v-if="sidebarOpen && isMobileDevice" class="sidebar-backdrop" @click="toggleSidebar"></div>
          </transition>

          <div class="conversations-sidebar" :class="{ 'open': sidebarOpen }">
            <div class="sidebar-header">
              <div v-if="!selectionMode" class="default-header-actions">
                <button @click="createNewConversation" class="new-conversation-btn" title="Nuevo chat">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  <span>Nuevo chat</span>
                </button>
                <div class="header-right-actions">
                   <button @click="toggleArchiveView" class="icon-action-btn" :class="{ 'active': showArchived }" :title="showArchived ? 'Ver Chats Activos' : 'Ver Chats Archivados'">
                    <svg v-if="!showArchived" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  </button>
                  <button @click="toggleSelectionMode" class="icon-action-btn" title="Seleccionar conversaciones">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                  </button>
                </div>
              </div>
              <div v-else class="selection-header-actions">
                <button @click="toggleSelectionMode" class="cancel-selection-btn">Cancelar</button>
                <div class="selection-tools">
                  <button @click="archiveSelectedConversations" class="tool-btn archive" :disabled="selectedConversations.length === 0" :title="showArchived ? 'Desarchivar Seleccionados' : 'Archivar Seleccionados'">
                    <svg v-if="!showArchived" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                  </button>
                  <button @click="deleteSelectedConversations" class="tool-btn delete" :disabled="selectedConversations.length === 0" title="Eliminar Seleccionados">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="conversations-list">
              <div 
                v-for="conv in conversations" 
                :key="conv.id"
                :class="['conversation-item', { active: activeConversationId === conv.id, selected: selectedConversations.includes(conv.id) }]"
                @click="handleConversationClick(conv)"
                :title="conv.title">
                
                <div v-if="selectionMode" class="checkbox-wrapper">
                  <div class="custom-checkbox" :class="{ checked: selectedConversations.includes(conv.id) }"></div>
                </div>

                <div class="conversation-content">
                  <span class="conversation-title">{{ conv.title }}</span>
                  <span class="conversation-time">{{ formatConversationTime(conv.createdAt) }}</span>
                </div>

              </div>
              <div v-if="conversations.length === 0" class="empty-state">
                  <span v-if="showArchived">No hay conversaciones archivadas</span>
                  <span v-else>No hay conversaciones anteriores</span>
              </div>
            </div>
          </div>

          <div class="chat-content">
            <div class="chatbot-header">
              <div class="header-left">
                <button @click="toggleSidebar" class="sidebar-toggle" title="Toggle conversations">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2"/>
                    <path d="M9 3v18"/>
                  </svg>
                </button>
                <h3>Preguntar a IA</h3>
              </div>
              
              <div class="header-buttons">
                <button @click="minimizeChatBot" class="minimize-button">−</button>
                <button @click="closeChatBot" class="close-button">×</button>
              </div>
            </div>

            <div class="chatbot-messages" ref="chatbotMessagesContainer">
              <div v-if="chatMessages.length === 0 && !chatBotLoading" class="chatbot-welcome" style="top: 5px; position:relative;">
                <h5 style="text-align: center; font-size:16px; padding:1rem; color:white;">Prueba preguntando:</h5>
                <div class="examples-section">
                  <div class="example-item" @click="handleExampleClick('¿Quién dirigió The Matrix?')">"¿Quién dirigió The Matrix?"</div>
                  <div class="example-item" @click="handleExampleClick('¿Quiénes actuaron en la película Pulp Fiction?')">"¿Quiénes actuaron en la película Pulp Fiction?"</div>
                  <div class="example-item" @click="handleExampleClick('¿Quién fue la actriz de Gambito de Dama?')">"¿Quién fue la actriz de Gambito de Dama?"</div>
                </div>

                <div class="modern-divider">
                  <span class="divider-line"></span>
                  <span class="divider-text">O</span>
                  <span class="divider-line"></span>
                </div>

                <div v-if="currentDailyPrompt" class="daily-prompt-card">
                  <div class="card-glow"></div>
                  <div class="card-header">
                    <span class="label">PROMPT DIARIO</span>
                  </div>
                  <div class="card-content">
                    <p>{{ currentDailyPrompt }}</p>
                  </div>
                  <button @click="sendDailyPrompt" class="action-btn">
                    <svg style="width: 18px; height: 18px;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot-message-square-icon lucide-bot-message-square"><path d="M12 6V2H8"/><path d="M15 11v2"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M20 16a2 2 0 0 1-2 2H8.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 4 20.286V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/><path d="M9 11v2"/></svg>
                    <span style="font-weight: 500; font-size: 16px;">Preguntar</span>
                  </button>
                </div>
              </div>

              <div v-if="chatMessages.length > 0" class="conversation-container">
                <div v-for="(message, index) in chatMessages" :key="index" class="message-wrapper">
                  <div v-if="message.role === 'user'" class="user-message">
                    <div class="message-content">
                      <p>{{ message.content }}</p>
                      <button @click="copyMessage(message.content, index)" class="copy-button" :title="copiedMessageIndex === index ? '¡Copiado!' : 'Copiar mensaje'">
                        <svg v-if="copiedMessageIndex === index" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div v-else-if="message.role === 'assistant'" class="assistant-message">
                    <div class="message-content">
                      <p v-html="message.content"></p>
                      <button @click="copyMessage(getPlainTextContent(message.content), index)" class="copy-button" :title="copiedMessageIndex === index ? '¡Copiado!' : 'Copiar mensaje'">
                        <svg v-if="copiedMessageIndex === index" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div v-else-if="message.role === 'system' && awaitingSelectionAction" class="system-selection-ui">
                    <div class="selection-message-content">
                      <p>{{ message.content }}</p>
                      <div class="selection-actions">
                        <button @click="triggerDefaultAnalysis" class="selection-btn primary">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                          Obtener Análisis de IA
                        </button>
                        <button @click="triggerCustomQuestion" class="selection-btn secondary">
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                           Hacer Pregunta Personalizada
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                
                <div v-if="chatBotLoading && messageWaitingForResponse" class="message-wrapper">
                  <div class="assistant-message">
                    <div class="message-content reasoning-content">
                      <div class="modern-loader">
                        <div class="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <span class="loader-text">Razonando...</span>
                      </div>
                    </div>
                  </div>
                </div>
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
                          <img v-if="item.poster_path" 
                               :src="'https://image.tmdb.org/t/p/w342' + item.poster_path" 
                               :alt="item.title || 'Movie Poster'"
                               @error="handleImageError">
                          <img v-else src="/image_not_found_yet_es.webp" :alt="item.title || 'Movie Poster Not Found'">
                          <div class="media-type">Movie</div>
                          <div class="movie-rating" v-if="item.imdb_rating || item.vote_average > 0">
                            <template v-if="item.rating_source === 'imdb' && item.imdb_rating">
                              {{ item.imdb_rating.toFixed(1) }}
                              <span class="star">★</span>
                            </template>
                            <template v-else-if="item.vote_average">
                              {{ item.vote_average.toFixed(1) }}
                              <span class="star">★</span>
                            </template>
                          </div>
                        </div>
                        <div class="media-info">
                          <h4>{{ item.title }}</h4>
                          <p>{{ item.release_date ? item.release_date.substring(0, 4) : 'N/A' }}</p>
                        </div>
                      </a>

                      <a v-else-if="item.media_type === 'tv'"
                         :href="item.url"
                         class="media-link"
                         target="_blank">
                        <div class="poster-wrapper">
                          <img v-if="item.poster_path" 
                               :src="'https://image.tmdb.org/t/p/w342' + item.poster_path" 
                               :alt="item.name || 'TV Show Poster'"
                               @error="handleImageError">
                          <img v-else src="/image_not_found_yet_es.webp" :alt="item.name || 'TV Show Poster Not Found'">
                          <div class="media-type">TV Show</div>

                          <div class="movie-rating" v-if="item.imdb_rating || item.vote_average > 0">
                            <template v-if="item.rating_source === 'imdb' && item.imdb_rating">
                              {{ item.imdb_rating.toFixed(1) }}
                              <span class="star">★</span>
                            </template>
                            <template v-else-if="item.vote_average">
                              {{ item.vote_average.toFixed(1) }}
                              <span class="star">★</span>
                            </template>
                          </div>
                        </div>
                        <div class="media-info">
                          <h4>{{ item.name }}</h4>
                          <p>{{ item.first_air_date ? item.first_air_date.substring(0, 4) : 'N/A' }}</p>
                        </div>
                      </a>

                      <a v-else-if="item.media_type === 'person'"
                         :href="item.url"
                         class="media-link"
                         target="_blank">
                        <div class="profile-wrapper">
                          <img v-if="item.profile_path" 
                               :src="'https://image.tmdb.org/t/p/w342' + item.profile_path" 
                               :alt="item.name || 'Person Profile'"
                               @error="handleImageError">
                          <img v-else src="/image_not_found_yet_es.webp" :alt="item.name || 'Person Profile Not Found'">
                          <div class="media-type">Person</div>
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
                <textarea
                  v-model="chatBotQuery"
                  placeholder="Buscar películas, series y perfiles..."
                  @keydown.enter.exact.prevent="handleSendAction"
                  @input="adjustTextareaHeight"
                  ref="chatInput"
                  rows="1"
                  class="modern-textarea"
                ></textarea>
              </div>
              <button @click="handleSendAction" :disabled="!chatBotQuery.trim() && !chatBotLoading" class="send-button" :class="{ 'stop-button': chatBotLoading }">
                <span v-if="chatBotLoading" class="stop-indicator">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <rect x="6" y="6" width="12" height="12" rx="2"></rect>
                  </svg>
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
        </div>
      </div>
      
      <div v-if="spoilerModalOpen" class="spoiler-modal">
        <div class="spoiler-content">
          <h3>Spoiler Detectado</h3>
          <p>La respuesta puede contener spoilers sobre tramas, finales u otros elementos narrativos.</p>
          <div class="spoiler-actions">
            <button @click="showSpoilerContent" class="spoiler-button accept">Puedo con la verdad</button>
            <button @click="cancelSpoilerContent" class="spoiler-button cancel">Cancelar</button>
          </div>
        </div>
      </div>

      <div v-if="confirmDeleteModalOpen" class="spoiler-modal delete-modal">
        <div class="spoiler-content">
            <h3>Eliminar Conversación</h3>
          <p style="font-size: 16px; color: #ccc; margin-bottom: 25px;">{{deleteConfirmationText}}</p>
          <div class="spoiler-actions">
            <button @click="confirmDelete" class="spoiler-button accept" style="background: #ff5252; color: white; border: none;">Eliminar</button>
            <button @click="closeDeleteModal" class="spoiler-button cancel">Cancelar</button>
          </div>
        </div>
      </div>
      
      <transition name="slide-down">
        <div v-if="showCopyNotification" class="copy-notification">
          <span style="font-size: 16px;">Copiado!</span>
        </div>
      </transition>
    </div>
    
    <div v-if="chatBotMinimized" class="minimized-chatbot" @click="maximizeChatBot">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>
        <div v-if="hasConversation" class="notification-dot"></div>
    </div>
    <AuthModal ref="authModal" />
  </div>
  </Teleport>
</template>
<script>
import axios from 'axios';
import DOMPurify from 'dompurify';

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
      chatMessages: [],
      messageWaitingForResponse: false,
      inputWidth: 0,
      chatId: null,
      sessionKey: 'entercinema_chat_session',
      tmdbApiKey: null,
      baseUrl: typeof window !== 'undefined'
               ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000' : 'https://es.entercinema.com')
               : 'https://es.entercinema.com',
      apiUrl: '',
      watchlistAnalysisUrl: '',
      titleGenerationUrl: '',
      predefinedApiUrl: typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
              ? 'http://localhost:8000/api' 
              : 'https://entercinema-predefined.vercel.app/api',
      currentDailyPrompt: '',
      dailyPrompts: [
        "¿Cuáles fueron las contribuciones más innovadoras de Stanley Kubrick a la cinematografía?",
        "¿Cómo desafió el movimiento Dogme 95 al cine convencional?",
        "¿Cuáles son las características definitorias del Neorrealismo Italiano y su contexto histórico?",
        "¿Qué actor rechazó el papel de Neo en 'Matrix' antes de que se le ofreciera a Keanu Reeves?",
        "¿Quiénes fueron las directoras pioneras en la era del Nuevo Hollywood de los años 70 y qué obstáculos enfrentaron en comparación con sus homólogos masculinos?",
        "¿Cómo utilizó Tarkovsky la técnica del plano secuencia en 'Stalker' para crear una sensación de inmersión temporal, y qué significado filosófico tiene esta elección estética?",
        "¿Qué nominada al Oscar a Mejor Película fue filmada completamente usando solo luz natural?",
        "¿Podrías identificar a la actriz de cabello oscuro que interpretó a una chef en una serie dramática de restaurante donde todos gritan y también apareció en un episodio reciente de Black Mirror?",
        "¿Cuál fue la primera película en utilizar un sistema de imágenes generadas por computadora en 3D?",
        "¿Cuál es la película más cara jamás realizada?",
        "¿Qué actriz tiene más premios Oscar en la historia del cine?",
        "¿Qué película de terror y crítica social sobre racismo dirigió Jordan Peele en 2017?",
        "¿En qué película de terror de 2018 un grupo de youtubers transmite en vivo desde uno de los lugares más embrujados de Corea?",
        "¿Cuántos actores diferentes han interpretado a Batman en películas de acción real desde 1943?",
        "¿Qué película de 1941 es considerada por muchos críticos como la mejor de todos los tiempos?",
        "¿Qué director legendario del suspenso aparecía en cameos en todas sus películas? ¿Cuáles son sus apariciones más icónicas?",
        "¿Qué director de Hong Kong revolucionó las películas de acción con coreografías de tiroteos estilizados y el uso de dos pistolas?",
        "¿Qué película de Christopher Nolan manipula el tiempo en tres líneas narrativas simultáneas durante la Segunda Guerra Mundial?",
        "¿Qué actor ganó el Oscar tras perder 30 kilos para interpretar a un enfermo de SIDA en 'Dallas Buyers Club'?",
        "¿Qué método de actuación, desarrollado en Rusia y popularizado en Hollywood, requiere que los actores vivan como sus personajes incluso fuera del set?"
      ],
      currentPromptIndex: -1,
      chatBotMinimized: false,
      sessionMinimizedKey: 'entercinema_chat_minimized',
      conversations: [],
      activeConversationId: null,
      conversationsStorageKey: 'entercinema_chat_conversations',
      sidebarOpen: false,
      titleGenerationInterval: null,
      conversationIndex: 0,
      copiedMessageIndex: null,
      showCopyNotification: false,
      pendingSelectionItems: [],
      awaitingSelectionAction: false,
      selectionMode: false,
      selectedConversations: [],
      selectedConversations: [],
      showArchived: false,
      confirmDeleteModalOpen: false,
      deleteConfirmationText: 'Esta conversación se eliminará permanentemente.'
    };
  },
  computed: {
    hasConversation() {
      return this.chatMessages.length > 0;
    }
  },
  watch: {
    chatBotOpen(isOpen) {
      if (isOpen) {
        this.$nextTick(() => {
          if (this.$refs.chatInput) {
            this.$refs.chatInput.focus();
          }
          this.loadDailyPrompt();
        });
      }
    }
  },
  created() {
    if (this.$config && this.$config.public) {
        this.tmdbApiKey = this.$config.public.apiKey;
    } else {
        try {
            const config = useRuntimeConfig();
            this.tmdbApiKey = config.public.apiKey;
        } catch (e) {
            console.error("Could not load runtime config", e);
        }
    }
    this.apiUrl = this.$config.public.assistantBackendUrl + '/gemini';
    this.watchlistAnalysisUrl = this.$config.public.assistantBackendUrl + '/watchlist-analysis';
    this.titleGenerationUrl = this.$config.public.assistantBackendUrl + '/gemini';
    this.loadDailyPrompt();
  },
  async mounted() {
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
    
    this.loadMinimizedState();
    
    const userEmail = this.getUserEmail();
    if (userEmail) {
      await this.initializeFirstConversation();
    } else {
      this.initializeFirstConversation();
    }
    
    this.$bus.$on('chatbot-maximized', () => {
      this.chatBotMinimized = false;
    });
    
    this.$bus.$on('open-chatbot-with-selection', this.handleSelectionInit);

    this.$bus.$on('open-chatbot-with-analysis', async (payload) => {
      try {
        this.createNewConversation();
        
        const unsafeFormattedResponse = payload.aiResponse
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\n/g, '<br>');
        
        const formattedResponse = DOMPurify.sanitize(unsafeFormattedResponse);
        
        this.chatMessages.push({
          role: 'user',
          content: payload.userQuery,
        });
        
        this.chatMessages.push({
          role: 'assistant',
          content: formattedResponse,
        });
        
        if (payload.mediaReferences && payload.mediaReferences.length > 0) {
          this.chatBotResults = [];
          await this.fetchMediaDetailsFromBackendReferences(payload.mediaReferences);
        } else {
          this.chatBotResults = [];
        }
        
        this.chatBotOpen = true;
        this.chatBotMinimized = false;
        this.clearMinimizedState();
        
        const activeConv = this.conversations.find(conv => conv.id === this.activeConversationId);
        if (activeConv) {
          activeConv.messages = [...this.chatMessages];
          activeConv.results = [...this.chatBotResults];
          activeConv.chatId = payload.chatId;
          activeConv.persistedInBackend = true;
        }
      
        this.$nextTick(() => {
          this.scrollToBottom();
        });
        
      } catch (error) {
        console.error('[ChatbotModal] Error opening modal with analysis:', error);
      }
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobileDevice);
    if (this.dotAnimationInterval) {
      clearInterval(this.dotAnimationInterval);
      this.dotAnimationInterval = null;
    }
    if (this.titleGenerationInterval) {
      clearInterval(this.titleGenerationInterval);
      this.titleGenerationInterval = null;
    }
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.clearMinimizedState();
    this.$bus.$off('rated-items-updated', this.checkData);
    this.$bus.$off('chatbot-maximized');
    this.$bus.$off('open-chatbot-with-analysis');
    this.$bus.$off('open-chatbot-with-selection', this.handleSelectionInit);
  },
  methods: {
    handleExampleClick(text) {
      this.chatBotQuery = text;
      this.handleSendAction();
    },
    handleImageError(event) {
      const fallbackUrl = '/image_not_found_yet_es.webp';
      if (event.target.src !== fallbackUrl) {
        event.target.src = fallbackUrl;
      }
    },
    handleSelectionInit(payload) {
      this.chatBotOpen = true;
      this.chatBotMinimized = false;
      this.clearMinimizedState();

      this.createNewConversation();

      this.pendingSelectionItems = payload.selectedItems;
      this.awaitingSelectionAction = true;
      
      const movieCount = this.pendingSelectionItems.filter(i => i.media_type === 'movie').length;
      const tvCount = this.pendingSelectionItems.filter(i => i.media_type === 'tv').length;

      this.chatMessages.push({
        role: 'system',
        content: `You've selected ${movieCount} movie${movieCount !== 1 ? 's' : ''} and ${tvCount} TV show${tvCount !== 1 ? 's' : ''}. How would you like the AI to analyze them?`
      });
      
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },

    triggerDefaultAnalysis() {
      this.awaitingSelectionAction = false;
      this.chatBotQuery = ""; 
      this.sendWatchlistAnalysis(null); 
    },

    triggerCustomQuestion() {
      this.awaitingSelectionAction = false;
      this.chatBotQuery = "@selection ";
      
      this.$nextTick(() => {
        if (this.$refs.chatInput) {
          this.$refs.chatInput.focus();
        }
      });
    },

    async sendWatchlistAnalysis(customQuery) {
      this.inputWidth = 100;
      this.chatBotLoading = true;
      this.messageWaitingForResponse = true;
      this.startDotAnimation();

      const hasUnratedItems = this.pendingSelectionItems.some(item => item.user_rating == null);

      const movieCount = this.pendingSelectionItems.filter(i => i.media_type === 'movie').length;
      const tvCount = this.pendingSelectionItems.filter(i => i.media_type === 'tv').length;

      const displayQuery = customQuery 
        ? customQuery 
        : `Analiza mi lista de seguimiento: ${movieCount} películas, ${tvCount} series.`;

      this.chatMessages.push({
        role: 'user',
        content: displayQuery
      });
      
      this.chatBotQuery = '';
      this.$nextTick(() => {
        this.scrollToBottom();
      });
      
      try {
        const userEmail = this.getUserEmail();
        const response = await axios.post(this.watchlistAnalysisUrl, {
          user_email: userEmail,
          user_language: this.getUserLanguage(), 
          selected_items: this.pendingSelectionItems,
          custom_query: customQuery 
        });

        this.pendingSelectionItems = [];

        const data = response.data;
        this.chatId = data.chat_id;

        const activeConv = this.conversations.find(conv => conv.id === this.activeConversationId);
        if (activeConv) {
          activeConv.chatId = data.chat_id;
          activeConv.persistedInBackend = true;
        }

        let cleanResponse = data.result || '';
        cleanResponse = cleanResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                     .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                     .replace(/\n/g, '<br>');

        if (data.spoilerStatus === "spoiler" && hasUnratedItems) {
          this.pendingSpoilerResponse = cleanResponse;
          this.pendingSpoilerMediaReferences = data.media_references || [];
          this.spoilerModalOpen = true;
        } else {
          this.chatMessages.push({ role: 'assistant', content: cleanResponse });
          
          if (data.media_references && data.media_references.length > 0) {
            await this.fetchPredefinedMediaReferences(data.media_references);
          } else {
            this.chatBotResults = [];
          }
        }

      } catch (error) {
        console.error('Error analyzing watchlist:', error);
        this.chatMessages.push({ 
          role: 'assistant', 
          content: "<span style='color: #ff8c8c;'>Lo siento, no pude analizar tu lista de seguimiento en este momento. Por favor inténtalo de nuevo.</span>" 
        });
      } finally {
        this.chatBotLoading = false;
        this.messageWaitingForResponse = false;
        if (this.dotAnimationInterval) {
          clearInterval(this.dotAnimationInterval);
        }
        this.inputWidth = 0;
        this.$nextTick(() => {
          this.scrollToBottom();
          if (this.$refs.chatInput) this.$refs.chatInput.focus();
        });
      }
    },

    getUserLanguage() {
      if (typeof navigator !== 'undefined' && navigator.language) {
        return navigator.language.startsWith('es') ? 'Spanish' : 'English';
      }
      return 'Spanish';
    },

    getUserEmail() {
      const email = localStorage.getItem('email');
      return email;
    },
    async getIMDbRatingFromDB(imdbId) {
      try {
        const response = await axios.get(`/api/imdb-rating/${imdbId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching IMDb rating:', error);
        return { found: false };
      }
    },

    async copyMessage(content, index) {
      try {
        await navigator.clipboard.writeText(content);
        this.copiedMessageIndex = index;
        this.showCopyNotification = true;
        
        setTimeout(() => {
          this.copiedMessageIndex = null;
        }, 2000);
        
        setTimeout(() => {
          this.showCopyNotification = false;
        }, 2000);
      } catch (error) {
        console.error('Failed to copy message:', error);
      }
    },

    getPlainTextContent(htmlContent) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      return tempDiv.textContent || tempDiv.innerText || '';
    },

    async initializeFirstConversation() {
      const userEmail = this.getUserEmail();
      
      if (userEmail) {
        await this.loadConversationsFromBackend();
      } else {
        this.createNewConversation();
      }
      
      this.startTitleGenerationInterval();
    },

    async loadConversationsFromBackend() {
      const userEmail = this.getUserEmail();

      try {
        const url = `${this.apiUrl}?user_email=${encodeURIComponent(userEmail)}&show_archived=${this.showArchived}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        this.conversations = data.conversations.map(conv => ({
          id: conv.chat_id,
          title: conv.title,
          messages: [],
          results: [],
          chatId: conv.chat_id,
          createdAt: new Date(conv.created_at * 1000).toISOString(),
          updatedAt: new Date(conv.updated_at * 1000).toISOString(),
          titleGenerated: true,
          persistedInBackend: true
        }));

        if (this.conversations.length > 0) {
          this.activeConversationId = this.conversations[0].id;
          this.chatId = this.conversations[0].chatId;
        } else {
          this.createNewConversation();
        }

        const storedConversations = this.conversations.map(conv => ({
          id: conv.id,
          chatId: conv.chatId,
          title: conv.title,
          createdAt: conv.createdAt
        }));
        try {
          localStorage.setItem('entercinema_cached_conversations', JSON.stringify(storedConversations));
        } catch (e) {
          console.warn('Failed to cache conversations:', e);
        }

      } catch (error) {
        console.error('[ChatbotModal] Error loading conversations:', error);
        this.createNewConversation();
      }
    },

    async loadConversationMessages(chatId) {
      const userEmail = this.getUserEmail();
      if (!userEmail || !chatId) {
        return { messages: [], mediaReferences: [] };
      }

      try {
        const response = await fetch(`${this.apiUrl}?user_email=${encodeURIComponent(userEmail)}&chat_id=${encodeURIComponent(chatId)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const messages = data.messages || [];
        const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop();
        const mediaReferences = lastAssistantMessage?.media_references || [];

        return { messages, mediaReferences };

      } catch (error) {
        console.error('[ChatbotModal] Error loading messages:', error);
        return { messages: [], mediaReferences: [] };
      }
    },
    
    createNewConversation() {
      const newId = Date.now().toString();
      this.conversationIndex++;
      const currentActiveConv = this.conversations.find(conv => conv.id === this.activeConversationId);
      if (currentActiveConv) {
        currentActiveConv.messages = [...this.chatMessages];
        currentActiveConv.results = [...this.chatBotResults];
      }
      
      const now = new Date();
      const utcTime = now.toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
      
      const newConversation = {
        id: newId,
        title: `${this.conversationIndex} - ${utcTime}`,
        messages: [],
        results: [],
        chatId: null,
        createdAt: now.toISOString(),
        titleGenerated: false,
        persistedInBackend: false
      };
      
      this.conversations.unshift(newConversation);
      this.activeConversationId = newId;
      
      this.chatBotResults = [];
      this.chatMessages = [];
      this.chatBotResponse = '';
      
      this.loadActiveConversation();
      
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
      
    async switchConversation(conversationId) {
      if (this.isMobileDevice && this.sidebarOpen) {
        this.sidebarOpen = false;
      }

      if (conversationId !== this.activeConversationId) {
        const previousConv = this.conversations.find(conv => conv.id === this.activeConversationId);
        if (previousConv) {
          previousConv.messages = [...this.chatMessages];
          previousConv.results = [...this.chatBotResults];
        }
        
        this.chatBotResults = [];
        this.chatMessages = [];
        
        this.activeConversationId = conversationId;
        const activeConv = this.conversations.find(conv => conv.id === conversationId);
        
        if (activeConv) {
          this.chatId = activeConv.chatId;
          
          if (activeConv.chatId && (!activeConv.messages || activeConv.messages.length === 0)) {
            const { messages, mediaReferences } = await this.loadConversationMessages(activeConv.chatId);
            
            if (messages && messages.length > 0) {
              activeConv.messages = messages.map(msg => {
                let content = msg.content;
                if (msg.role === 'assistant') {
                  const unsafeContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                  .replace(/\n/g, '<br>');
                  content = DOMPurify.sanitize(unsafeContent);
                }
                return {
                  role: msg.role,
                  content: content
                };
              });
              
              if (mediaReferences && mediaReferences.length > 0) {
                await this.fetchMediaDetailsFromBackendReferences(mediaReferences);
                activeConv.results = [...this.chatBotResults];
              } else {
                activeConv.results = [];
              }
            }
          }

          this.chatMessages = activeConv.messages ? [...activeConv.messages] : [];
          this.chatBotResults = activeConv.results ? [...activeConv.results] : [];
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        }
      }
    },
    
    closeConversation(conversationId) {
      const convToDelete = this.conversations.find(conv => conv.id === conversationId);
      
      const index = this.conversations.findIndex(conv => conv.id === conversationId);
      if (index !== -1) {
        this.conversations.splice(index, 1);
        
        if (this.activeConversationId === conversationId) {
          if (this.conversations.length > 0) {
            this.activeConversationId = this.conversations[0].id;
            this.loadActiveConversation();
          } else {
            this.createNewConversation();
          }
        }
      }
    },
    
    async loadActiveConversation() {
      const activeConv = this.conversations.find(conv => conv.id === this.activeConversationId);
      if (activeConv) {
        if (activeConv.chatId && (!activeConv.messages || activeConv.messages.length === 0)) {
          const { messages, mediaReferences } = await this.loadConversationMessages(activeConv.chatId);
          
          if (messages && messages.length > 0) {
            activeConv.messages = messages.map(msg => {
              let content = msg.content;
              if (msg.role === 'assistant') {
                const unsafeContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                .replace(/\n/g, '<br>');
                content = DOMPurify.sanitize(unsafeContent);
              }
              return {
                role: msg.role,
                content: content
              };
            });
            
            if (mediaReferences && mediaReferences.length > 0) {
              await this.fetchMediaDetailsFromBackendReferences(mediaReferences);
              activeConv.results = [...this.chatBotResults];
            } else {
              activeConv.results = [];
            }
          }
        }
        
        this.chatMessages = activeConv.messages ? [...activeConv.messages] : [];
        this.chatBotResults = activeConv.results ? [...activeConv.results] : [];
        this.chatId = activeConv.chatId;
      } else {
        this.chatMessages = [];
        this.chatId = null;
        this.chatBotResults = [];
      }
    },

    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },

    formatConversationTime(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m`;
      if (diffHours < 24) return `${diffHours}h`;
      if (diffDays < 7) return `${diffDays}d`;
      return date.toLocaleDateString();
    },

    toggleSelectionMode() {
      this.selectionMode = !this.selectionMode;
      this.selectedConversations = [];
    },

    toggleArchiveView() {
      this.showArchived = !this.showArchived;
      this.selectionMode = false;
      this.selectedConversations = [];
      this.loadConversationsFromBackend();
    },

    handleConversationClick(conv) {
      if (this.selectionMode) {
        this.toggleSelectConversation(conv.id);
      } else {
        this.switchConversation(conv.id);
      }
    },

    toggleSelectConversation(id) {
      const index = this.selectedConversations.indexOf(id);
      if (index === -1) {
        this.selectedConversations.push(id);
      } else {
        this.selectedConversations.splice(index, 1);
      }
    },

    async archiveSelectedConversations() {
      if (this.selectedConversations.length === 0) return;
      
      const userEmail = this.getUserEmail();
      const endpoint = this.showArchived 
          ? 'https://entercinema-assistant-rust.vercel.app/api/unarchive-conversations'
          : 'https://entercinema-assistant-rust.vercel.app/api/archive-conversations';

      try {
        await axios.post(endpoint, {
          chat_ids: this.selectedConversations,
          user_email: userEmail
        });
        
        await this.loadConversationsFromBackend();
        this.selectionMode = false;
        this.selectedConversations = [];
        
        if (!this.conversations.find(c => c.id === this.activeConversationId)) {
            if (this.conversations.length > 0) {
               this.switchConversation(this.conversations[0].id);
            } else {
               this.createNewConversation();
            }
        }
      } catch (e) {
        console.error("Failed to archive/unarchive", e);
      }
    },

    async deleteSelectedConversations() {
        if (this.selectedConversations.length === 0) return;
        this.deleteConfirmationText = 'La/s conversación/es seleccionada/s será permanentemente eliminada/s.';
        this.confirmDeleteModalOpen = true;
    },

    closeDeleteModal() {
        this.confirmDeleteModalOpen = false;
    },

    async confirmDelete() {
        const userEmail = this.getUserEmail();
        const ids = this.selectedConversations;
        
        try {
            await axios.post('https://entercinema-assistant-rust.vercel.app/api/delete-conversations', {
                chat_ids: ids,
                user_email: userEmail
            });
            
            this.conversations = this.conversations.filter(c => !ids.includes(c.id));
            
            if (this.activeConversationId && ids.includes(this.activeConversationId)) {
                if (this.conversations.length > 0) {
                    this.switchConversation(this.conversations[0].id);
                } else {
                    this.createNewConversation();
                }
            }
            
            this.selectionMode = false;
            this.selectedConversations = [];
            
            this.loadConversationsFromBackend();

        } catch (e) {
            console.error("Failed to delete", e);
        } finally {
            this.closeDeleteModal();
        }
    },

    startTitleGenerationInterval() {
    },

    async generateConversationTitles() {
    },

    async generateTitleWithAI(conversationText) {
      try {
        const response = await fetch(this.titleGenerationUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: conversationText,
            chat_id: null,
            is_title_generation: true
          })
        });

        if (response.ok) {
          const data = await response.json();
          const aiTitle = data.result ? data.result.substring(0, 40) : null;
          if (aiTitle && aiTitle.trim()) {
            return aiTitle;
          }
        } else {
            console.error('Title generation failed:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error calling title generation API:', error);
      }

      const firstAssistantMessage = conversationText.split('\n').find(line => line.startsWith('assistant:'));
      if (firstAssistantMessage) {
          const content = firstAssistantMessage.replace('assistant:', '').trim();
          const sentenceEnd = content.indexOf('.');
          let title = sentenceEnd > -1 ? content.substring(0, sentenceEnd) : content;
          if (title.length > 40) title = title.substring(0, 37) + '...';
          return title;
      }

      const firstUserMessage = conversationText.split('\n').find(line => line.startsWith('user:'));
      if (firstUserMessage) {
        let content = firstUserMessage.replace('user:', '').trim();
        if (this.getUserLanguage() === 'Spanish') {
          content = content.replace(/^(cuentame|dime|hablame|decime) (sobre|de|el|la|los|las) /i, '');
        } else {
          content = content.replace(/^(tell me about|what is|what's|who is|who's|give me info on) /i, '');
        }
        return content.length > 40 ? content.substring(0, 37) + '...' : content;
      }

      return null;
    },
    
    minimizeChatBot() {
      this.chatBotOpen = false;
      this.chatBotMinimized = true;
      this.saveMinimizedState();
    },

    maximizeChatBot() {
      this.chatBotOpen = true;
      this.clearMinimizedState();

      this.$root.$emit('chatbot-maximized');
      
      this.$nextTick(() => {
        if (this.$refs.chatInput) {
          this.$refs.chatInput.focus();
        }
      });
    },

    saveMinimizedState() {
      try {
        if (typeof localStorage !== 'undefined') {
          const minimizedData = {
            minimized: true,
            timestamp: Date.now()
          };
          localStorage.setItem(this.sessionMinimizedKey, JSON.stringify(minimizedData));
        }
      } catch (error) {
        console.warn('Error saving minimized state:', error);
      }
    },

    clearMinimizedState() {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(this.sessionMinimizedKey);
        }
      } catch (error) {
        console.warn('Error clearing minimized state:', error);
      }
    },

    loadMinimizedState() {
      try {
        if (typeof localStorage !== 'undefined') {
          const minimizedData = localStorage.getItem(this.sessionMinimizedKey);
          if (minimizedData) {
            const parsed = JSON.parse(minimizedData);
            if (parsed.minimized) {
              this.chatBotMinimized = true;
              this.chatBotOpen = false;
            }
          }
        }
      } catch (error) {
        console.warn('Error loading minimized state:', error);
      }
    },
        
    checkMobileDevice() {
      this.isMobileDevice = window.innerWidth <= 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    handleSendAction() {
      if (!this.checkAuth()) {
        this.$refs.authModal.open(() => {
          this.sendChatBotQueryStream();
        });
        return;
      }
      
      this.$nextTick(() => {
         if (this.$refs.chatInput) this.$refs.chatInput.focus();
      });

      if (this.pendingSelectionItems.length > 0 && this.chatBotQuery.includes("@selection")) {
        const customQuery = this.chatBotQuery.replace("@selection", "").trim();
        if (!customQuery) return; 
        
        this.sendWatchlistAnalysis(customQuery);
        return;
      }
      
      if (this.chatBotLoading) {
        this.stopStreaming();
      } else {
        this.sendChatBotQueryStream();
      }
    },

    stopStreaming() {
      this.chatBotLoading = false;
      this.messageWaitingForResponse = false;
      this.chatBotQuery = '';
      this.$nextTick(() => {
        if (this.$refs.chatInput) {
          this.$refs.chatInput.style.height = 'auto';
        }
      });
      this.inputWidth = 0;
      
      if (this.dotAnimationInterval) {
        clearInterval(this.dotAnimationInterval);
        this.dotAnimationInterval = null;
      }
      
      if (this.isMobileDevice) {
        this.inputEnabled = false;
      } else if (this.$refs.chatInput) {
        this.$refs.chatInput.focus();
      }
    },

    enableInput() {
      this.inputEnabled = true;
      this.$nextTick(() => {
        if (this.$refs.chatInput) {
          this.$refs.chatInput.focus();
        }
      });
    },

    adjustTextareaHeight() {
      const textarea = this.$refs.chatInput;
      if (!textarea) return;
      
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 120);
      textarea.style.height = newHeight + 'px';
    },

    checkAuth() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      return token !== null;
    },

    open() {
      const isAuthenticated = this.checkAuth();
      if (!isAuthenticated) {
        return;
      }
      
      this.chatBotOpen = true;
      this.chatBotMinimized = false;
      this.clearMinimizedState();
      this.checkMobileDevice();
      this.inputEnabled = !this.isMobileDevice;
      
      this.chatBotResults = [];
      this.chatMessages = [];
      this.chatBotResponse = '';
      
      const firstConv = this.conversations[0];
      if (firstConv && firstConv.messages.length === 0 && !firstConv.persistedInBackend) {
        this.activeConversationId = firstConv.id;
        this.loadActiveConversation();
      } else {
        this.createNewConversation();
      }
    },

    close() {
      this.chatBotOpen = false;
      this.clearMinimizedState();
      this.$root.$emit('chatbot-closed');
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
      this.chatBotMinimized = false;
      this.clearMinimizedState();
      this.close();
    },

    showSpoilerContent() {
      this.chatBotResponse = this.pendingSpoilerResponse;

      const messageExists = this.chatMessages.some(
        msg => msg.role === 'assistant' && msg.content === this.pendingSpoilerResponse
      );
      
      if (!messageExists) {
        this.chatMessages.push({
          role: 'assistant',
          content: this.pendingSpoilerResponse
        });
      }

      const isDailyPrompt = this.pendingSpoilerMediaReferences && 
                            this.pendingSpoilerMediaReferences.length > 0 &&
                            this.pendingSpoilerMediaReferences.every(ref => ref.tmdb_id);
      
      if (this.pendingSpoilerMediaReferences && this.pendingSpoilerMediaReferences.length > 0) {
        if (isDailyPrompt) {
          this.fetchPredefinedMediaReferences(this.pendingSpoilerMediaReferences);
        } else {
          this.fetchMediaDetailsFromBackendReferences(this.pendingSpoilerMediaReferences);
        }
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
      this.messageWaitingForResponse = false;
      this.isStreaming = false;
      this.streamingText = '';
      
      if (this.abortController) {
        this.abortController.abort();
        this.abortController = null;
      }
      
      if (this.dotAnimationInterval) {
        clearInterval(this.dotAnimationInterval);
        this.dotAnimationInterval = null;
      }
      
      setTimeout(() => {
        this.inputWidth = 0;
      }, 300);
      if (this.isMobileDevice) {
        this.inputEnabled = false;
      } else if (this.$refs.chatInput) {
        this.$refs.chatInput.focus();
      }
    },

    async sendChatBotQueryStream() {
      const queryToSend = this.chatBotQuery.trim();
      if (!queryToSend || this.chatBotLoading) return;

      this.inputWidth = 100;
      this.chatBotLoading = true;
      this.messageWaitingForResponse = true;
      this.startDotAnimation();
      this.chatBotResponse = '';
      this.chatBotResults = [];

      this.chatMessages.push({
        role: 'user',
        content: queryToSend
      });
      
      this.chatBotQuery = '';
      
      this.$nextTick(() => {
        if (this.$refs.chatInput) {
          this.$refs.chatInput.style.height = 'auto';
        }
        this.scrollToBottom();
      });

      try {
        const userEmail = this.getUserEmail();
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: queryToSend,
            chat_id: this.chatId,
            user_email: userEmail
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        this.chatId = data.chat_id;
        
        const activeConv = this.conversations.find(conv => conv.id === this.activeConversationId);
        if (activeConv && !activeConv.chatId) {
          activeConv.chatId = data.chat_id;
          activeConv.persistedInBackend = true;
        }

        if (data.conversation_history && data.conversation_history.length > 0) {
          this.chatMessages = [];
          data.conversation_history.forEach(message => {
            let formattedContent = message.content || '';
            if (message.role === 'assistant') {
              formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
              formattedContent = formattedContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
              formattedContent = formattedContent.replace(/^\s*[\*\-]\s+(.*)/gm, '$1<br>');
              formattedContent = formattedContent.replace(/\n/g, '<br>');
              formattedContent = formattedContent.replace(/_{3}(.*?)_{3}/g, '<strong>$1</strong>');
              formattedContent = formattedContent.replace(/_{2}(.*?)_{2}/g, '<strong>$1</strong>');
              formattedContent = formattedContent.replace(/_{1}([^_]+)_{1}/g, '<em>$1</em>');
            }
            
            this.chatMessages.push({
              role: message.role,
              content: formattedContent
            });
          });
        }

        let cleanResponse = data.result || '';
        cleanResponse = cleanResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        cleanResponse = cleanResponse.replace(/\*(.*?)\*/g, '<em>$1</em>');
        cleanResponse = cleanResponse.replace(/^\s*[\*\-]\s+(.*)/gm, '$1<br>');
        cleanResponse = cleanResponse.replace(/\n/g, '<br>');
        cleanResponse = cleanResponse.replace(/_{3}(.*?)_{3}/g, '<strong>$1</strong>');
        cleanResponse = cleanResponse.replace(/_{2}(.*?)_{2}/g, '<strong>$1</strong>');
        cleanResponse = cleanResponse.replace(/_{1}([^_]+)_{1}/g, '<em>$1</em>');

        if (data.spoilerStatus === "spoiler") {
          this.pendingSpoilerResponse = cleanResponse;
          this.pendingSpoilerMediaReferences = data.media_references || [];
          this.spoilerModalOpen = true;
          
          this.chatMessages.pop();
          
          if (this.isMobileDevice) {
            this.inputEnabled = false;
          }
        } else {
          if (data.media_references && data.media_references.length > 0) {
            await this.fetchMediaDetailsFromBackendReferences(data.media_references);
            const activeConv = this.conversations.find(conv => conv.id === this.activeConversationId);
            if (activeConv) {
              activeConv.results = [...this.chatBotResults];
              activeConv.messages = [...this.chatMessages];
            }
          } else {
            this.chatBotResults = [];
            const activeConv = this.conversations.find(conv => conv.id === this.activeConversationId);
            if (activeConv) {
              activeConv.messages = [...this.chatMessages];
            }
          }
          
          this.$nextTick(() => {
            this.scrollToBottom();
          });
          if (this.isMobileDevice) {
            this.inputEnabled = false;
          }
        }

        this.chatBotLoading = false;
        this.messageWaitingForResponse = false;

      } catch (error) {
        console.error('Error in API call:', error);
        
        let errorMessage = 'An error occurred. Please try again.';
        if (error.message && error.message.includes('timeout')) {
          errorMessage = 'The request timed out. Please try again later.';
        } else if (error.message && error.message.includes('HTTP')) {
          errorMessage = `Server error: ${error.message}`;
        } else if (error.message && error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection.';
        }
        
        const formattedErrorMessage = `<span style="color: #ff8c8c;">${errorMessage}</span>`;
        
        this.chatMessages.push({
          role: 'assistant',
          content: formattedErrorMessage
        });
        
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
        this.messageWaitingForResponse = false;
        
        setTimeout(() => {
          this.inputWidth = 0;
        }, 300);
        
        this.$nextTick(() => {
          if (this.$refs.chatInput) {
            this.$refs.chatInput.focus();
          }
        });
      }
      
      this.updateConversationTitle();
      
      if (this.chatMessages.length === 2) {
        const activeConv = this.conversations.find(conv => conv.id === this.activeConversationId);
        if (activeConv && !activeConv.titleGenerated) {
             const conversationText = this.chatMessages
            .map(msg => {
              const content = msg.role === 'assistant' ? this.getPlainTextContent(msg.content) : msg.content;
              return `${msg.role}: ${content}`;
            })
            .join('\n');
            
            this.generateTitleWithAI(conversationText).then(title => {
                if (title && title.trim()) {
                    activeConv.title = title.trim();
                    activeConv.titleGenerated = true;
                }
            });
        }
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

    updateConversationTitle() {
      const activeConv = this.conversations.find(conv => conv.id === this.activeConversationId);
      if (activeConv && activeConv.title.startsWith('Chat ') && this.chatMessages.length > 0) {
        const firstUserMessage = this.chatMessages.find(msg => msg.role === 'user');
        if (firstUserMessage) {
          activeConv.title = firstUserMessage.content.substring(0, 20) + '...';
        }
      }
    },

    sendDailyPrompt() {
      if (!this.checkAuth()) {
        this.$refs.authModal.open(() => {
          if (this.currentPromptIndex !== -1 && !this.chatBotLoading) {
            this.sendDailyPromptRequest();
          }
        });
        return;
      }
      
      if (this.currentPromptIndex !== -1 && !this.chatBotLoading) {
        this.sendDailyPromptRequest();
      }
    },

    async sendDailyPromptRequest() {
      if (!this.currentDailyPrompt || this.chatBotLoading) return;
      
      this.inputWidth = 100;
      this.chatBotLoading = true;
      this.messageWaitingForResponse = true;
      this.startDotAnimation();
      this.chatBotResponse = '';
      this.chatBotResults = [];

      this.chatMessages.push({
        role: 'user',
        content: this.currentDailyPrompt
      });
        
      this.$nextTick(() => {
        this.scrollToBottom();
      });
      
      try {
        const promptIndex = this.currentPromptIndex;
     
        const userEmail = this.getUserEmail();
        const payload = {
          query: this.currentDailyPrompt,
          chat_id: this.chatId,
          prompt_id: `daily_prompt_${promptIndex}`,
          user_email: userEmail
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
              chat_id: this.chatId,
              user_email: userEmail
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
        
        const activeConv = this.conversations.find(conv => conv.id === this.activeConversationId);
        if (activeConv && !activeConv.chatId) {
          activeConv.chatId = response.data.chat_id;
          activeConv.persistedInBackend = true;
        }

        if (response.data.conversation_history && response.data.conversation_history.length > 0) {
          this.chatMessages = [];
          response.data.conversation_history.forEach(message => {
            let formattedContent = message.content || '';
            if (message.role === 'assistant') {
              formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
              formattedContent = formattedContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
              formattedContent = formattedContent.replace(/^\s*[\*\-]\s+(.*)/gm, '$1<br>');
              formattedContent = formattedContent.replace(/\n/g, '<br>');
              formattedContent = formattedContent.replace(/_{3}(.*?)_{3}/g, '<strong>$1</strong>');
              formattedContent = formattedContent.replace(/_{2}(.*?)_{2}/g, '<strong>$1</strong>');
              formattedContent = formattedContent.replace(/_{1}([^_]+)_{1}/g, '<em>$1</em>');
              formattedContent = formattedContent.replace(/\n/g, '<br>');
            }
            
            this.chatMessages.push({
              role: message.role,
              content: formattedContent
            });
          });
        }
        
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
          
          if (this.isMobileDevice) {
            this.inputEnabled = false;
            if (this.$refs.chatInput && document.activeElement === this.$refs.chatInput) {
              this.$refs.chatInput.blur();
            }
          }
        } else {
          this.chatBotResponse = cleanResponse;

          if (!response.data.conversation_history || response.data.conversation_history.length === 0) {
            this.chatMessages.push({
              role: 'assistant',
              content: cleanResponse
            });
          }
          
          if (response.data.media_references && response.data.media_references.length > 0) {
            await this.fetchPredefinedMediaReferences(response.data.media_references);
            const activeConv = this.conversations.find(conv => conv.id === this.activeConversationId);
            if (activeConv) {
              activeConv.results = [...this.chatBotResults];
              activeConv.messages = [...this.chatMessages];
            }
          } else {
            this.chatBotResults = [];
            const activeConv = this.conversations.find(conv => conv.id === this.activeConversationId);
            if (activeConv) {
              activeConv.messages = [...this.chatMessages];
            }
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

        const formattedErrorMessage = `<span style="color: #ff8c8c;">${errorMessage}</span>`;
        this.chatBotResponse = formattedErrorMessage;
        
        if (this.chatMessages.length === 0 || this.chatMessages[this.chatMessages.length - 1].role !== 'user') {
          const userQuery = typeof queryToSend !== 'undefined' ? queryToSend : this.currentDailyPrompt;
          
          this.chatMessages.push({
            role: 'user',
            content: userQuery
          });
        }
        
        this.chatMessages.push({
          role: 'assistant',
          content: formattedErrorMessage
        });
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
        this.messageWaitingForResponse = false;
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
      this.messageWaitingForResponse = true;
      this.startDotAnimation();
      this.chatBotResponse = '';
      this.chatBotResults = [];
      const currentQuery = this.chatBotQuery;
      this.chatBotQuery = '';

      this.chatMessages.push({
        role: 'user',
        content: queryToSend
      });
              
      this.chatBotQuery = '';
      this.$nextTick(() => {
        this.scrollToBottom();
      });

      try {
        const response = await axios.post(this.apiUrl, {
          query: queryToSend,
          chat_id: this.chatId
        }, { timeout: 45000 });

        this.chatId = response.data.chat_id;
        
        const activeConv = this.conversations.find(conv => conv.id === this.activeConversationId);
        if (activeConv && !activeConv.chatId) {
          activeConv.chatId = response.data.chat_id;
          activeConv.persistedInBackend = true;
        }

        if (response.data.conversation_history && response.data.conversation_history.length > 0) {
          this.chatMessages = [];
          
          response.data.conversation_history.forEach(message => {
            let formattedContent = message.content || '';
            if (message.role === 'assistant') {
              formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
              formattedContent = formattedContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
              formattedContent = formattedContent.replace(/^\s*[\*\-]\s+(.*)/gm, '$1<br>');
              formattedContent = formattedContent.replace(/\n/g, '<br>');
              formattedContent = formattedContent.replace(/_{3}(.*?)_{3}/g, '<strong>$1</strong>');
              formattedContent = formattedContent.replace(/_{2}(.*?)_{2}/g, '<strong>$1</strong>');
              formattedContent = formattedContent.replace(/_{1}([^_]+)_{1}/g, '<em>$1</em>');
              formattedContent = formattedContent.replace(/\n/g, '<br>');
            }
            
            this.chatMessages.push({
              role: message.role,
              content: formattedContent
            });
          });
        }

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
          if (this.isMobileDevice) {
            this.inputEnabled = false;
            if (this.$refs.chatInput && document.activeElement === this.$refs.chatInput) {
              this.$refs.chatInput.blur();
            }
          }
        } else {
          this.chatBotResponse = cleanResponse;
          if (!response.data.conversation_history || response.data.conversation_history.length === 0) {
            this.chatMessages.push({
              role: 'assistant',
              content: cleanResponse
            });
          }
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
        console.error('Error fetching from chatbot API:', error);
        let errorMessage = 'An error occurred. Please try again.';
        if (axios.isCancel(error) || (error.code === 'ECONNABORTED' || (error.message && error.message.includes('timeout')))) {
          errorMessage = 'The request timed out. The AI might be taking too long to respond. Please try again later or rephrase your query.';
        } else if (error.response) {
          errorMessage = `Error ${error.response.status}: ${error.response.data?.detail || 'Failed to process request.'}`;
          if (error.response.status === 504) {
            errorMessage = 'The AI service seems to be unavailable or timed out. Please try again later.';
          }
        } else if (error.request) {
          errorMessage = 'Network Error: Could not reach the AI service. Please check your connection.';
        } else {
          errorMessage = 'An unexpected error occurred while processing your request.';
        }
        const formattedErrorMessage = `<span style="color: #ff8c8c;">${errorMessage}</span>`;
        this.chatBotResponse = formattedErrorMessage;

        this.chatMessages.push({
          role: 'assistant',
          content: formattedErrorMessage
        });
        
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
        this.messageWaitingForResponse = false;
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
      
    async fetchMediaDetailsFromBackendReferences(references, mainObject = null) {
          if (!this.tmdbApiKey) {
              console.error("TMDB API Key (API_KEY) not configured!");
              this.chatBotResponse += "<br><small style='color: orange;'>Could not fetch related results (API key missing).</small>";
              this.chatBotResults = [];
              return;
          }

          const results = [];
          const mainObjectResult = [];
          const promises = [];
          const seenIds = new Set();
          const priorityTypes = {
              'person': 1,
              'movie': 2,
              'tv': 3
          };

          const enrichWithIMDb = async (item, mediaType) => {
            if (mediaType === 'person') return item;
            
            const imdbId = item.external_ids?.imdb_id || item.imdb_id;
            if (imdbId) {
              try {
                const imdbData = await this.getIMDbRatingFromDB(imdbId);
                if (imdbData.found) {
                  item.imdb_rating = imdbData.score;
                  item.imdb_votes = imdbData.votes;
                  item.rating_source = 'imdb';
                } else {
                  item.rating_source = 'tmdb';
                }
              } catch (error) {
                item.rating_source = 'tmdb';
              }
            } else {
              item.rating_source = 'tmdb';
            }
            return item;
          };

          let effectiveMainObject = null;

            if (mainObject && mainObject.name && mainObject.type) {
                effectiveMainObject = mainObject;
            } 
            else {
                if (references && references.length > 0) {
                    const firstRef = references[0];
                    if (firstRef && firstRef.name && firstRef.type) {
                        effectiveMainObject = {
                            name: firstRef.name,
                            type: firstRef.type
                        };
                    }
                }
            }

            let mainObjectMediaItem = null;

            if (effectiveMainObject) {
                try {
                    let searchUrl = '';
                    let mediaType = effectiveMainObject.type.toLowerCase();

                    if (mediaType === 'tv_show' || mediaType === 'series') {
                        mediaType = 'tv';
                    } else if (mediaType === 'actor' || mediaType === 'director') {
                        mediaType = 'person';
                    }
                    
                    switch (mediaType) {
                        case 'movie':
                            searchUrl = 'https://api.themoviedb.org/3/search/movie';
                            break;
                        case 'tv':
                            searchUrl = 'https://api.themoviedb.org/3/search/tv';
                            break;
                        case 'person':
                            searchUrl = 'https://api.themoviedb.org/3/search/person';
                            break;
                        default:
                            searchUrl = '';
                    }
                    
                    if (searchUrl) {
                        const mainObjectResponse = await axios.get(searchUrl, {
                            params: {
                                api_key: this.tmdbApiKey,
                                query: effectiveMainObject.name,
                                language: 'es-ES',
                                page: 1,
                                include_adult: false
                            },
                            timeout: 8000
                        });

                        if (mainObjectResponse.data?.results?.length > 0 && (mediaType === 'movie' || mediaType === 'tv')) {
                            mainObjectResponse.data.results.sort((a, b) => {
                                const titleA = mediaType === 'movie' ? (a.title || "").toLowerCase() : (a.name || "").toLowerCase();
                                const titleB = mediaType === 'movie' ? (b.title || "").toLowerCase() : (b.name || "").toLowerCase();
                                const queryName = effectiveMainObject.name.toLowerCase();
                                
                                const exactA = titleA === queryName;
                                const exactB = titleB === queryName;
                                
                                if (exactA && !exactB) return -1;
                                if (!exactA && exactB) return 1;
                                
                                return (b.vote_count || 0) - (a.vote_count || 0);
                            });
                            const mainItemId = mainObjectResponse.data.results[0].id;
                            try {
                                const detailsResponse = await axios.get(`https://api.themoviedb.org/3/${mediaType}/${mainItemId}`, {
                                    params: {
                                        api_key: this.tmdbApiKey,
                                        append_to_response: 'external_ids'
                                    },
                                    timeout: 5000
                                });
                                mainObjectResponse.data.results[0].external_ids = detailsResponse.data.external_ids;
                            } catch (error) {
                                console.error(`Error fetching external_ids for main object:`, error);
                            }
                        }
                        if (mainObjectResponse.data?.results?.length > 0) {
                          const mainItem = mainObjectResponse.data.results[0];
                          const mainUniqueId = `${mediaType}-${mainItem.id}`;
                          
                          seenIds.add(mainUniqueId);
                          
                          const formattedMainItem = {
                              ...mainItem,
                              id: mainItem.id,
                              media_type: mediaType,
                              url: `${this.baseUrl}/${mediaType}/${mainItem.id}`,
                              title: mediaType === 'movie' ? mainItem.title : undefined,
                              name: mediaType !== 'movie' ? mainItem.name : undefined,
                              poster_path: mainItem.poster_path || (mediaType === 'person' ? mainItem.profile_path : undefined),
                              profile_path: mediaType === 'person' ? mainItem.profile_path : undefined,
                              release_date: mainItem.release_date,
                              first_air_date: mainItem.first_air_date,
                              vote_average: mainItem.vote_average || 0,
                              known_for_department: mainItem.known_for_department,
                              priority: 0,
                              popularity: 10000,
                              originalName: effectiveMainObject.name,
                              isMainObject: true
                          };
                          
                          if (mediaType === 'movie' || mediaType === 'tv') {
                              await enrichWithIMDb(formattedMainItem, mediaType);
                              mainObjectMediaItem = formattedMainItem;
                          }
                          
                          mainObjectResult.push(formattedMainItem);
                        } else {
                            console.warn(`No TMDB results found for main object: ${effectiveMainObject.name}`);

                            if (effectiveMainObject.name) {
                                const placeholderItem = {
                                    id: 0,
                                    media_type: mediaType,
                                    url: `${this.baseUrl}/search?query=${encodeURIComponent(effectiveMainObject.name)}`,
                                    title: mediaType === 'movie' ? effectiveMainObject.name : undefined,
                                    name: mediaType !== 'movie' ? effectiveMainObject.name : undefined,
                                    poster_path: null,
                                    profile_path: null,
                                    release_date: null,
                                    first_air_date: null,
                                    vote_average: 0,
                                    priority: 0,
                                    popularity: 10000,
                                    originalName: effectiveMainObject.name,
                                    isMainObject: true,
                                    noResult: true
                                };
                                mainObjectResult.push(placeholderItem);
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Error fetching main object: ${error}`);
                }
            }

            const seenNames = new Set(mainObjectResult.map(item => item.originalName?.toLowerCase()));

            const filteredReferences = references.filter(ref => {
                if (!ref || typeof ref !== 'object' || !ref.name || !ref.type) {
                    return false;
                }
                const refNameLowercase = ref.name.toLowerCase();

                if (seenNames.has(refNameLowercase)) {
                    return false;
                }
                
                seenNames.add(refNameLowercase);
                return true;
            });

            for (const ref of filteredReferences) {
                if (ref.tmdb_id) {
                    let mediaType = ref.type.toLowerCase();
                    if (mediaType === 'tv_show' || mediaType === 'series') mediaType = 'tv';
                    else if (mediaType === 'actor' || mediaType === 'director') mediaType = 'person';

                    const detailsUrl = `https://api.themoviedb.org/3/${mediaType}/${ref.tmdb_id}`;
                    
                    promises.push(
                        axios.get(detailsUrl, {
                            params: {
                                api_key: this.tmdbApiKey,
                                language: 'es-ES',
                                append_to_response: 'external_ids'
                            },
                            timeout: 8000
                        })
                        .then(async response => {
                            const item = response.data;
                            const uniqueId = `${mediaType}-${item.id}`;

                            if (!seenIds.has(uniqueId)) {
                                seenIds.add(uniqueId);
                                
                                const formattedItem = {
                                    ...item,
                                    id: item.id,
                                    media_type: mediaType,
                                    url: `${this.baseUrl}/${mediaType}/${item.id}`,
                                    title: mediaType === 'movie' ? item.title : undefined,
                                    name: mediaType !== 'movie' ? item.name : undefined,
                                    poster_path: item.poster_path || (mediaType === 'person' ? item.profile_path : undefined),
                                    profile_path: mediaType === 'person' ? item.profile_path : undefined,
                                    release_date: item.release_date,
                                    first_air_date: item.first_air_date,
                                    vote_average: item.vote_average || 0,
                                    known_for_department: item.known_for_department,
                                    priority: priorityTypes[mediaType] || 99,
                                    popularity: item.popularity || 0,
                                    originalName: ref.name,
                                    external_ids: item.external_ids
                                };
                                
                                await enrichWithIMDb(formattedItem, mediaType);
                                results.push(formattedItem);
                            }
                        })
                        .catch(error => {
                            console.error(`Error fetching specific media for ${ref.name} (ID: ${ref.tmdb_id}):`, error);
                        })
                    );
                    continue;
                }

                let searchUrl = '';
                let mediaType = ref.type.toLowerCase();
                
                const params = {
                    api_key: this.tmdbApiKey,
                    query: ref.name,
                    language: 'es-ES',
                    page: 1,
                    include_adult: false,
                    sort_by: 'popularity.desc'
                };

                switch (mediaType) {
                    case 'movie':
                        searchUrl = 'https://api.themoviedb.org/3/search/movie';
                        break;
                    case 'tv':
                    case 'tv_show':
                    case 'series':
                        searchUrl = 'https://api.themoviedb.org/3/search/tv';
                        mediaType = 'tv';
                        params.first_air_date_year = ref.year || undefined;
                        break;
                    case 'person':
                    case 'actor':
                    case 'director':
                        searchUrl = 'https://api.themoviedb.org/3/search/person';
                        mediaType = 'person';
                        break;
                    default:
                        console.warn(`Unsupported media type "${ref.type}" for reference:`, ref);
                        continue;
                }

                promises.push(
                  axios.get(searchUrl, { params, timeout: 8000 })
                  .then(async response => {
                      if (response.data?.results?.length > 0) {
                          const sortedResults = response.data.results.sort((a, b) => {
                                const titleA = mediaType === 'movie' ? (a.title || "").toLowerCase() : (a.name || "").toLowerCase();
                                const titleB = mediaType === 'movie' ? (b.title || "").toLowerCase() : (b.name || "").toLowerCase();
                                const queryName = ref.name.toLowerCase();
                                
                                const exactA = titleA === queryName;
                                const exactB = titleB === queryName;
                                
                                if (exactA && !exactB) return -1;
                                if (!exactA && exactB) return 1;

                                return (b.vote_count || 0) - (a.vote_count || 0);
                          });
                          
                          const item = sortedResults[0];
                          const uniqueId = `${mediaType}-${item.id}`;

                          if (item.id && !seenIds.has(uniqueId)) {
                              seenIds.add(uniqueId);
                              
                              let detailsResponse;
                              try {
                                  detailsResponse = await axios.get(`https://api.themoviedb.org/3/${mediaType}/${item.id}`, {
                                      params: {
                                          api_key: this.tmdbApiKey,
                                          append_to_response: 'external_ids'
                                      },
                                      timeout: 5000
                                  });
                                  item.external_ids = detailsResponse.data.external_ids;
                              } catch (error) {
                                  console.error(`Error fetching external_ids for ${item.id}:`, error);
                              }
                              
                              const formattedItem = {
                                  ...item,
                                  id: item.id,
                                  media_type: mediaType,
                                  url: `${this.baseUrl}/${mediaType}/${item.id}`,
                                  title: mediaType === 'movie' ? item.title : undefined,
                                  name: mediaType !== 'movie' ? item.name : undefined,
                                  poster_path: item.poster_path || (mediaType === 'person' ? item.profile_path : undefined),
                                  profile_path: mediaType === 'person' ? item.profile_path : undefined,
                                  release_date: item.release_date,
                                  first_air_date: item.first_air_date,
                                  vote_average: item.vote_average || 0,
                                  known_for_department: item.known_for_department,
                                  priority: priorityTypes[mediaType] || 99,
                                  popularity: item.popularity || 0,
                                  originalName: ref.name,
                                  external_ids: item.external_ids
                              };
                              
                              await enrichWithIMDb(formattedItem, mediaType);
                              results.push(formattedItem);
                          }
                      } else {
                            console.warn(`No TMDB results found for: ${ref.name} (Type: ${ref.type})`);
                        }
                    })
                    .catch(error => {
                        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                            console.error(`Timeout fetching TMDB data for ${ref.name} (${ref.type})`);
                        } else {
                            console.error(`Error fetching TMDB data for ${ref.name} (${ref.type}):`, error.message || error);
                        }
                    })
                );
            }

            try {
                await Promise.all(promises);
            } catch (e) {
                console.error("Error occurred during Promise.all for TMDB fetches:", e);
            }

            const personResults = results
                .filter(item => item.media_type.toLowerCase() === 'person')
                .sort((a, b) => b.popularity - a.popularity);
            
            const mediaResults = results
                .filter(item => item.media_type.toLowerCase() !== 'person')
                .sort((a, b) => b.popularity - a.popularity);

            const limitedPersonResults = personResults.slice(0, 5);

            if (limitedPersonResults.length > 0) {
                if (mainObjectMediaItem && mainObjectMediaItem.id && (mainObjectMediaItem.media_type === 'movie' || mainObjectMediaItem.media_type === 'tv')) {
                    try {
                        const isRelated = await this.verifyMediaPersonRelationship(
                            mainObjectMediaItem.media_type,
                            mainObjectMediaItem.id,
                            limitedPersonResults,
                            this.tmdbApiKey
                        );

                        if (!isRelated) {
                            try {
                                const betterMatchResponse = await axios.get(`https://api.themoviedb.org/3/search/${mainObjectMediaItem.media_type}`, {
                                    params: {
                                        api_key: this.tmdbApiKey,
                                        query: effectiveMainObject.name,
                                        language: 'es-ES',
                                        page: 1,
                                        include_adult: false
                                    },
                                    timeout: 8000
                                });
                                
                                if (betterMatchResponse.data?.results?.length > 1) { 
                                    for (let i = 1; i < Math.min(5, betterMatchResponse.data.results.length); i++) {
                                      const alternativeItem = betterMatchResponse.data.results[i];
                                      
                                      try {
                                          const altDetailsResponse = await axios.get(`https://api.themoviedb.org/3/${mainObjectMediaItem.media_type}/${alternativeItem.id}`, {
                                              params: {
                                                  api_key: this.tmdbApiKey,
                                                  append_to_response: 'external_ids'
                                              },
                                              timeout: 5000
                                          });
                                          alternativeItem.external_ids = altDetailsResponse.data.external_ids;
                                      } catch (error) {
                                          console.error(`Error fetching external_ids for alternative:`, error);
                                      }
                                      
                                      const isAlternativeRelated = await this.verifyMediaPersonRelationship(
                                          mainObjectMediaItem.media_type,
                                          alternativeItem.id,
                                          limitedPersonResults,
                                          this.tmdbApiKey
                                      );
                                      
                                      if (isAlternativeRelated) {
                                          const mediaType = mainObjectMediaItem.media_type;
                                          const alternativeMainItem = {
                                              ...alternativeItem,
                                              id: alternativeItem.id,
                                              media_type: mediaType,
                                              url: `${this.baseUrl}/${mediaType}/${alternativeItem.id}`,
                                              title: mediaType === 'movie' ? alternativeItem.title : undefined,
                                              name: mediaType !== 'movie' ? alternativeItem.name : undefined,
                                              poster_path: alternativeItem.poster_path,
                                              release_date: alternativeItem.release_date,
                                              first_air_date: alternativeItem.first_air_date,
                                              vote_average: alternativeItem.vote_average || 0,
                                              priority: 0,
                                              popularity: 10000,
                                              originalName: effectiveMainObject.name,
                                              isMainObject: true,
                                              alternativeFound: true,
                                              external_ids: alternativeItem.external_ids
                                          };

                                          await enrichWithIMDb(alternativeMainItem, mediaType);
                                          mainObjectResult.splice(0, 1, alternativeMainItem);
                                          break;
                                      }
                                  }
                                }
                            } catch (error) {
                                console.error(`Error buscando alternativas para el objeto principal: ${error}`);
                            }
                        }
                    } catch (error) {
                        console.error(`Error verificando si el objeto principal está relacionado con las personas: ${error}`);
                    }
                }

                const verifiedMediaPromises = [];
                const verifiedMediaResults = [];

                for (const mediaItem of mediaResults) {
                    let mediaType = mediaItem.media_type.toLowerCase();
                    let mediaId = mediaItem.id;
                  
                    const creditsPromise = this.verifyMediaPersonRelationship(mediaType, mediaId, limitedPersonResults, this.tmdbApiKey)
                    .then(isRelated => {
                        if (isRelated) {
                            verifiedMediaResults.push(mediaItem);
                        }
                    })
                    .catch(error => {
                        verifiedMediaResults.push(mediaItem);
                    });
                    
                    verifiedMediaPromises.push(creditsPromise);
                }
                
                try {
                    await Promise.all(verifiedMediaPromises);
                } catch (e) {
                    console.error("Error verificando relaciones entre medios y personas:", e);
                }

                const finalResults = [...mainObjectResult, ...limitedPersonResults, ...verifiedMediaResults];

                const sortedResults = finalResults.sort((a, b) => {
                    if (a.isMainObject && !b.isMainObject) return -1;
                    if (!a.isMainObject && b.isMainObject) return 1;
                    if (a.priority !== b.priority) {
                        return a.priority - b.priority;
                    }
                    
                    return b.popularity - a.popularity;
                }).slice(0, 20);
                this.chatBotResults = sortedResults;
                this.chatBotResults = sortedResults;
                const activeConv = this.conversations.find(conv => conv.id === this.activeConversationId);
                if (activeConv) {
                  activeConv.results = [...this.chatBotResults];
                }
                
            } else {
                const finalResults = [...mainObjectResult, ...mediaResults];
                
                const sortedResults = finalResults.sort((a, b) => {
                    if (a.isMainObject && !b.isMainObject) return -1;
                    if (!a.isMainObject && b.isMainObject) return 1;
                    if (a.priority !== b.priority) {
                        return a.priority - b.priority;
                    }
                    
                    return b.popularity - a.popularity;
                }).slice(0, 20);

                this.chatBotResults = sortedResults;
                const activeConv = this.conversations.find(conv => conv.id === this.activeConversationId);
                if (activeConv) {
                  activeConv.results = [...this.chatBotResults];
                }
            }

            if (results.length === 0 && filteredReferences.some(ref => ref.name && ref.type) && mainObjectResult.length === 0) {
                this.chatBotResponse += "<br><small style='color: orange;'>Could not fetch details for the related results.</small>";
            }
            this.$nextTick(() => {
                this.scrollToBottom();
            });
      },

      async fetchPredefinedMediaReferences(references) {
        if (!this.tmdbApiKey) {
          console.error("TMDB API Key (API_KEY) not configured!");
          this.chatBotResults = [];
          return;
        }

        const results = [];
        const promises = [];
        const seenIds = new Set();

        for (const ref of references) {
          if (!ref || !ref.name || !ref.type || !ref.tmdb_id) {
            console.warn("Skipping invalid reference:", ref);
            continue;
          }

          let mediaType = ref.type.toLowerCase();
          
          if (mediaType === 'tv_show' || mediaType === 'series') {
            mediaType = 'tv';
          } else if (mediaType === 'actor' || mediaType === 'director') {
            mediaType = 'person';
          }

          const uniqueId = `${mediaType}-${ref.tmdb_id}`;
          
          if (seenIds.has(uniqueId)) {
            continue;
          }
          
          seenIds.add(uniqueId);

          const detailsUrl = `https://api.themoviedb.org/3/${mediaType}/${ref.tmdb_id}`;
          
          promises.push(
            axios.get(detailsUrl, {
              params: {
                api_key: this.tmdbApiKey,
                language: 'es-ES',
                append_to_response: 'external_ids'
              },
              timeout: 8000
            })
            .then(async response => {
              const item = response.data;
              
              const formattedItem = {
                ...item,
                id: item.id,
                media_type: mediaType,
                url: `${this.baseUrl}/${mediaType}/${item.id}`,
                title: mediaType === 'movie' ? item.title : undefined,
                name: mediaType !== 'movie' ? item.name : undefined,
                poster_path: item.poster_path || (mediaType === 'person' ? item.profile_path : undefined),
                profile_path: mediaType === 'person' ? item.profile_path : undefined,
                release_date: item.release_date,
                first_air_date: item.first_air_date,
                vote_average: item.vote_average || 0,
                known_for_department: item.known_for_department,
                popularity: item.popularity || 0,
                originalName: ref.name,
                external_ids: item.external_ids
              };
              
              const imdbId = item.external_ids?.imdb_id;
              if (imdbId && mediaType !== 'person') {
                try {
                  const imdbData = await this.getIMDbRatingFromDB(imdbId);
                  if (imdbData.found) {
                    formattedItem.imdb_rating = imdbData.score;
                    formattedItem.imdb_votes = imdbData.votes;
                    formattedItem.rating_source = 'imdb';
                  } else {
                    formattedItem.rating_source = 'tmdb';
                  }
                } catch (error) {
                  formattedItem.rating_source = 'tmdb';
                }
              } else {
                formattedItem.rating_source = 'tmdb';
              }
              
              results.push(formattedItem);
            })
            .catch(error => {
              console.error(`Error fetching predefined media for ${ref.name} (ID: ${ref.tmdb_id}):`, error.message || error);
            })
          );
        }

        try {
          await Promise.all(promises);
        } catch (e) {
          console.error("Error fetching predefined media references:", e);
        }

        this.chatBotResults = results;
        const activeConv = this.conversations.find(conv => conv.id === this.activeConversationId);
        if (activeConv) {
          activeConv.results = [...this.chatBotResults];
        }
        
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },

      async verifyMediaPersonRelationship(mediaType, mediaId, persons, apiKey) {
          if (!persons || persons.length === 0) {
              return true;
          }
          
          try {
              const creditsUrl = `https://api.themoviedb.org/3/${mediaType}/${mediaId}/credits`;
              const response = await axios.get(creditsUrl, {
                  params: { api_key: apiKey },
                  timeout: 5000
              });
              
              if (!response.data || (!response.data.cast && !response.data.crew)) {
                  return false;
              }
              const castIds = (response.data.cast || []).map(person => person.id);
              const crewIds = (response.data.crew || []).map(person => person.id);
              const allIds = [...new Set([...castIds, ...crewIds])];
              
              return persons.some(person => allIds.includes(person.id));
          } catch (error) {
              console.error(`Error obteniendo créditos para ${mediaType} ${mediaId}:`, error);
              return true;
          }
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
/* =========================================
   1. MODAL & LAYOUT
   ========================================= */
.chatbot-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.chatbot-container {
  width: 90%;
  max-width: 1200px;
  height: 85vh;
  max-height: 800px;
  background: linear-gradient(135deg, #010102 0%, #0e2026 90%, #000000 100%);
  border-radius: 16px;
  border: 1px solid rgba(127, 219, 241, 0.15);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.chatbot-main {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
}

/* =========================================
   2. SIDEBAR
   ========================================= */
.conversations-sidebar {
  width: 0;
  opacity: 0;
  background: rgb(13 33 42 / 95%);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  z-index: 20;
  overflow: hidden; 
}

.conversations-sidebar.open {
  width: 280px;
  opacity: 1;
}

.sidebar-header, .conversations-list {
  min-width: 280px;
  box-sizing: border-box;
}

.sidebar-header {
  padding: 20px;
}

.new-conversation-btn {
  width: 100%;
  padding: 14px 16px;
  background: rgba(127, 219, 241, 0.1);
  border: 1px solid rgba(127, 219, 241, 0.2);
  color: #7FDBF1;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-weight: 700;
  font-size: 16px;
  transition: all 0.2s ease;
}

.new-conversation-btn:hover {
  background: rgba(127, 219, 241, 0.2);
  transform: translateY(-1px);
}

.new-conversation-btn svg { width: 20px; height: 20px; }

.conversations-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 10px 10px 10px;
}

.conversation-item {
  width: 100%;
  padding: 12px 14px;
  margin-bottom: 6px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid transparent;
  transition: background 0.2s;
  box-sizing: border-box;
  position: relative;
}

.conversation-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.conversation-item.active {
  background: rgba(127, 219, 241, 0.15);
  border-color: rgba(127, 219, 241, 0.3);
}

.conversation-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  margin-right: 12px;
}

.conversation-title {
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.conversation-time {
  font-size: 11px;
  color: #a8d8e4;
  margin-top: 4px;
  display: block;
  opacity: 0.8;
}

.delete-conversation {
  opacity: 0;
  color: #ff5252;
  background: rgba(0,0,0,0.2);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
}

.conversation-item:hover .delete-conversation { opacity: 1; }
.delete-conversation:hover { background: rgba(255, 82, 82, 0.2); }


/* =========================================
   3. CHAT AREA & MESSAGES
   ========================================= */
.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, rgba(6, 47, 64, 0.98) 0%, rgba(10, 30, 40, 0.99) 100%);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 28' width='56' height='28'%3E%3Cpath fill='%237ed2e3' fill-opacity='0.1' d='M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0zm-5.43 2.71c1.13-.72 2.3-1.37 3.54-1.93a19.98 19.98 0 0 0-32.76 0c1.23.56 2.41 1.2 3.54 1.93a15.98 15.98 0 0 1 25.68 0zm-4.67 3.78c.94-.95 1.96-1.83 3.03-2.63a13.98 13.98 0 0 0-22.4 0c1.07.8 2.09 1.68 3.03 2.63a9.99 9.99 0 0 1 16.34 0z'%3E%3C/path%3E%3C/svg%3E");
  box-shadow: 0 12px 40px 0 rgba(31, 104, 135, 0.6);
  backdrop-filter: blur(15px);
  position: relative;
  min-width: 0;
}

.chatbot-header {
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(13, 27, 42, 0.4);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0; 
}

.chatbot-header h3 {
  color: #fff;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
  white-space: nowrap;
  flex-shrink: 0; 
}

.header-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sidebar-toggle {
  background: transparent;
  border: none;
  color: #7FDBF1;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
}
.sidebar-toggle:hover { background: rgba(127, 219, 241, 0.1); }

.close-button, .minimize-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  transition: color 0.2s;
}
.close-button:hover, .minimize-button:hover { color: #fff; }

.chatbot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  scroll-behavior: smooth;
}

.message-wrapper { margin-bottom: 16px; display: flex; flex-direction: column; }
.user-message { align-self: flex-end; max-width: 85%; }
.assistant-message { align-self: flex-start; max-width: 90%; }

.message-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 14px 18px; 
  border-radius: 12px;
  line-height: 1.5;
  gap: 1.5rem;
  font-size: 15px;
  word-break: break-word;
}

.message-content p {
  margin: 0;
  flex: 1;
  margin-right: 0;
}

.user-message .message-content {
  background: #8AE8FC; 
  color: #0b1622;
  border: none;
  font-weight: 500;
  border-bottom-right-radius: 2px;
  box-shadow: 0 4px 10px rgba(138, 232, 252, 0.2);
}

.assistant-message .message-content {
  background: rgb(0 0 0 / 50%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom-left-radius: 2px;
  color: #fff;
  font-weight: 500;
}

.copy-button {
  position: static;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
}

.user-message .copy-button { color: rgba(11, 22, 34, 0.6); }
.user-message .copy-button:hover { background: rgba(0,0,0,0.1); color: #000; opacity: 1; }

.assistant-message .copy-button { color: rgba(255,255,255,0.6); }
.assistant-message .copy-button:hover { background: rgba(255,255,255,0.1); color: #fff; opacity: 1; }

/* =========================================
   4. WELCOME SECTION
   ========================================= */
.chatbot-welcome { text-align: center; padding: 20px; color: #a8d8e4; }

.examples-section {
  text-align: left;
  max-width: 500px;
  margin: 0 auto;
}

.examples-section h5 {
  color: #ffffff;
  font-size: 16px; 
  margin: 0 0 20px 0;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
}

.example-item {
  background: rgba(255,255,255,0.05);
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: #e0e0e0;
}
.example-item:hover { background: rgba(127,219,241,0.1); color: #7FDBF1; }

.modern-divider { display: flex; align-items: center; margin: 30px auto; max-width: 500px; }
.divider-line { flex: 1; height: 1px; background: rgba(127,219,241,0.3); }
.divider-text { padding: 0 10px; color: #7FDBF1; font-size: 14px; font-weight: bold; }

/* =========================================
   5. SPOILER MODAL
   ========================================= */
.spoiler-modal {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  z-index: 100000;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(8px);
  display: flex; justify-content: center; align-items: center;
}

.spoiler-content {
  background: linear-gradient(135deg, rgba(6, 45, 61, 0.60) 0%, rgba(80, 0, 0, 0.60) 120%);
  border: 1px solid rgba(255, 102, 102, 0.5);
  border-radius: 20px; 
  padding: 50px;
  text-align: center;
  box-shadow: 0 30px 80px rgba(0,0,0,0.8); 
  width: 90%; 
  max-width: 700px;
}

.spoiler-content h3 { color: #fff; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; }

.spoiler-content p { 
  color: rgba(255,255,255,0.95); 
  margin-bottom: 40px; 
  font-size: 16px;
  line-height: 1.6;
}

.spoiler-actions { display: flex; gap: 20px; }

.spoiler-button { 
  flex: 1; 
  padding: 18px; 
  border-radius: 12px; 
  border: none; 
  cursor: pointer; 
  font-weight: 500; 
  font-size: 16px; 
  display: flex;
  align-items: center;
  justify-content: center; 
  text-align: center;
}

.spoiler-button.accept { background: rgba(255,255,255,0.15); color: white; border: 1px solid rgba(255,255,255,0.3); }
.spoiler-button.accept:hover { background: rgba(255,255,255,0.25); }
.spoiler-button.cancel { background: rgba(0,0,0,0.6); color: #ddd; }
.spoiler-button.cancel:hover { background: rgba(0,0,0,0.8); }

/* =========================================
   6. SYSTEM SELECTION UI
   ========================================= */
.system-selection-ui { display: flex; justify-content: center; margin: 15px 0; }

.selection-message-content { 
  background: rgb(0 0 0 / 50%);
  border: 1px solid #7FDBF1; 
  border-radius: 12px; 
  padding: 25px; 
  text-align: center; 
  max-width: 80%;
}

.selection-message-content p {
  font-size: 14px;
  margin-bottom: 20px;
  color: #fff;
  line-height: 1.5;
}

.selection-actions { margin-top: 15px; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;}
.selection-btn { 
  padding: 12px 20px; 
  border-radius: 30px; 
  cursor: pointer; 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  font-size: 15px; 
  font-weight: 500;
}
.selection-btn.primary { background: #7FDBF1; color: #000; border: none; }
.selection-btn.secondary { background: transparent; color: #7FDBF1; border: 1px solid #7FDBF1; }

/* =========================================
   7. DAILY PROMPT & CAROUSEL
   ========================================= */
.daily-prompt-card {
  background: rgba(0, 0, 0, 0.307);
  border: 1px solid rgba(127, 219, 241, 0.2);
  border-radius: 16px; padding: 24px; margin: 20px auto; max-width: 500px;
  position: relative; overflow: hidden; text-align: center;
}
.card-glow {
  position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
  background: radial-gradient(circle, rgba(127,219,241,0.1) 0%, transparent 70%); pointer-events: none;
}
.card-header { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 16px; }
.card-header .label { color: #7FDBF1; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
.card-content p { color: #fff; font-size: 16px; font-weight: 500; line-height: 1.5; margin-bottom: 20px; }
.action-btn {
  background: #7FDBF1; color: #0b1622; border: none; padding: 10px 24px; border-radius: 20px; font-weight: 600;
  cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: transform 0.2s;
}
.action-btn:hover { transform: scale(1.05); box-shadow: 0 0 15px rgba(127, 219, 241, 0.4); }

.media-carousel { margin-top: 25px; animation: fadeIn 0.6s ease; }
.carousel-title { color: #7FDBF1; font-size: 16px; margin: 0 0 15px; font-weight: 500; letter-spacing: 0.5px; }
.carousel-container { position: relative; display: flex; align-items: center; }
.carousel-content { display: flex; overflow-x: auto; scroll-behavior: smooth; padding: 10px 5px; -ms-overflow-style: none; scrollbar-width: none; scroll-snap-type: x mandatory; gap: 15px; margin: 0 35px; }
.carousel-content::-webkit-scrollbar { display: none; }
.carousel-item { flex: 0 0 auto; width: 160px; border-radius: 15px;; overflow: hidden; transition: all 0.3s ease; scroll-snap-align: start; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); background-color: #0f2133; }
.carousel-item:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5); }
.poster-wrapper { position: relative; height: 240px; overflow: hidden; background-color: #222; }
.carousel-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; }
.carousel-item:hover img { transform: scale(1.05); }
.media-link { display: block; text-decoration: none; color: inherit; height: 100%; }
.media-type { position: absolute; top: 8px; left: 8px; background: rgba(0, 0, 0, 0.75); color: #7FDBF1; border-radius: 5px; padding: 3px 8px; font-size: 10px; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase; }
.movie-rating { position: absolute; top: 8px; right: 8px; background: rgba(0, 0, 0, 0.75); color: #fff; border-radius: 5px; padding: 3px 6px; font-size: 11px; display: flex; align-items: center; }
.star { color: #7FDBF1; margin-left: 3px; font-size: 12px; }
.profile-wrapper { position: relative; height: 240px; overflow: hidden; background-color: #222; }
.profile-wrapper img { width: 100%; height: 100%; object-fit: cover; object-position: top center; }
.media-info { padding: 10px 12px; background: rgba(0, 0, 0, 0.8); min-height: 65px; display: flex; flex-direction: column; justify-content: center; }
.media-info h4 { margin: 0 0 4px; font-size: 13px; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
.media-info p { margin: 0; font-size: 11px; color: #7FDBF1; }
.carousel-nav { background: rgba(20, 20, 20, 0.7); color: white; border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; position: absolute; top: calc(50% - 18px); z-index: 10; transition: all 0.3s ease; font-size: 18px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); }
.carousel-prev { left: 0px; }
.carousel-next { right: 0px; }
.carousel-nav:hover { background: rgba(127, 219, 241, 0.3); border-color: rgba(127, 219, 241, 0.5); }

/* =========================================
   8. INPUT & LOADER
   ========================================= */
.chatbot-input {
  padding: 20px;
  background: rgb(13 34 42 / 95%);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: flex-end;
  gap: 12px;
}
.input-wrapper {
  flex: 1;
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: border-color 0.3s;
}
.input-wrapper:focus-within { border-color: rgba(127, 219, 241, 0.5); box-shadow: 0 0 0 2px rgba(127, 219, 241, 0.1); }
.modern-textarea {
  width: 100%;
  background: transparent;
  border: none;
  color: #fff;
  padding: 14px;
  font-size: 16px;
  line-height: 1.5;
  resize: none;
  outline: none;
  max-height: 150px;
  display: block;
  font-family: inherit;
}
.modern-textarea::placeholder { color: rgba(255, 255, 255, 0.4); }
.send-button {
  width: 48px; height: 48px; border-radius: 12px; border: none; background: linear-gradient(135deg, #7FDBF1 0%, #8AE8FC 100%); color: black;
  display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; flex-shrink: 0;
}
.send-button:disabled { opacity: 0.5; cursor: not-allowed; background: #2c3e50; color: #d0d0d0; }
.send-button:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(127, 219, 241, 0.3); }
.send-button.stop-button { background: #ff5252; }

.modern-loader { display: flex; align-items: center; gap: 12px; padding: 8px 12px; }
.typing-indicator { display: flex; gap: 4px; }
.typing-indicator span { width: 6px; height: 6px; background: #7FDBF1; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; }
.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
.loader-text { color: #7FDBF1; font-size: 13px; font-weight: 500; opacity: 0.8; }

/* =========================================
   9. RESPONSIVE
   ========================================= */
@media screen and (max-width: 768px) {
  .chatbot-container { width: 95%; height: 75vh; max-height: none; border-radius: 16px; margin: 0 auto; }
  .conversations-sidebar { position: absolute; top: 0; left: 0; height: 100%; width: 0; max-width: 300px; background: #0d1b2a; box-shadow: none; }
  .conversations-sidebar.open { width: 85%; box-shadow: 2px 0 20px rgba(0,0,0,0.5); }
  .sidebar-backdrop { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(2px); z-index: 15; }
  .chatbot-messages { padding: 16px; }
  .daily-prompt-card { margin: 10px; padding: 16px; }
  .carousel-content { margin: 0 5px; } .carousel-item { width: 130px; } .poster-wrapper, .profile-wrapper { height: 195px; }
  .media-info { min-height: 55px; } .media-info h4 { font-size: 11px; } .media-info p { font-size: 9px; }
  .carousel-nav { width: 30px; height: 30px; font-size: 16px; top: calc(50% - 15px); } .carousel-prev { left: -5px; } .carousel-next { right: -5px; }
  .spoiler-content { width: 95%; padding: 30px; }
  .spoiler-content p { font-size: 18px; }
  .selection-message-content p { font-size: 18px; }
}

.copy-notification { position: fixed; top: 140px; left: 50%; transform: translateX(-50%); background: #7FDBF1; color: #000; padding: 16px 32px; border-radius: 20px; font-weight: 600; z-index: 10000; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.minimized-chatbot { font-size: 16px; position: fixed; bottom: 25px; right: 25px; width: 60px; height: 60px; background: linear-gradient(135deg, #0088cc 0%, #7FDBF1 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 9999; cursor: pointer; box-shadow: 0 5px 20px rgba(0,0,0,0.3); }
.notification-dot { position: absolute; top: 0; right: 0; width: 14px; height: 14px; background: #ff4757; border-radius: 50%; border: 2px solid #fff; }

/* =========================================
   10. SELECTION MODE & ACTIONS
   ========================================= */
.default-header-actions { display: flex; align-items: center; justify-content: space-between; width: 100%; transition: all 0.3s; gap: 12px; }
.header-right-actions { display: flex; gap: 8px; flex-shrink: 0; }
.icon-action-btn { background: transparent; border: 1px solid transparent; color: #7FDBF1; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
.icon-action-btn:hover { background: rgba(127, 219, 241, 0.1); }
.icon-action-btn.active { background: rgba(127, 219, 241, 0.15); color: #7FDBF1; border-color: rgba(127, 219, 241, 0.3); }

.selection-header-actions { display: flex; align-items: center; justify-content: space-between; width: 100%; animation: fadeIn 0.3s ease; }
.cancel-selection-btn { background: transparent; border: none; color: #8899a6; font-size: 13px; font-weight: 500; cursor: pointer; padding: 5px 10px; }
.cancel-selection-btn:hover { color: #fff; text-decoration: underline; }

.selection-tools { display: flex; gap: 8px; }
.tool-btn { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1px solid transparent; transition: all 0.2s; }
.tool-btn.archive { background: transparent; color: #7FDBF1; }
.tool-btn.archive:hover { background: rgba(127, 219, 241, 0.1); }
.tool-btn.delete { background: transparent; color: #ff5252; }
.tool-btn.delete:hover { background: rgba(255, 82, 82, 0.1); }
.tool-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }

.checkbox-wrapper { margin-right: 12px; display: flex; align-items: center; }
.custom-checkbox { width: 18px; height: 18px; border: 2px solid #555; border-radius: 4px; transition: all 0.2s; position: relative; }
.custom-checkbox.checked { background: #7FDBF1; border-color: #7FDBF1; }
.custom-checkbox.checked::after { content: ''; position: absolute; top: 45%; left: 50%; width: 5px; height: 9px; border: solid black; border-width: 0 2px 2px 0; transform: translate(-50%, -60%) rotate(45deg); }
.conversation-item.selected { background: rgba(127, 219, 241, 0.08); border: 1px solid rgba(127, 219, 241, 0.2); }

.empty-state { padding: 30px 20px; text-align: center; color: #666; font-size: 14px; font-style: italic; }

.delete-modal .spoiler-content { border-color: #ff5252; box-shadow: 0 0 30px rgba(255, 82, 82, 0.1); }
</style>
<template>
  <div>
    <div v-if="chatBotOpen" class="chatbot-modal" @click.self="closeChatBot">
      <div class="chatbot-container" style="z-index: 6 !important;">
        <div class="chatbot-header">
          <div class="header-left">
            <button @click="toggleSidebar" class="sidebar-toggle" title="Toggle conversations">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-left-icon lucide-panel-left">
                <rect width="18" height="18" x="3" y="3" rx="2"/>
                <path d="M9 3v18"/>
              </svg>
            </button>
            <h3>Ask AI</h3>
          </div>
          
          <div class="header-buttons">
            <button @click="closeChatBot" class="close-button">×</button>
          </div>
        </div>
        <div class="chatbot-main" :class="{ 'sidebar-open': sidebarOpen }">
          <div v-if="sidebarOpen" class="conversations-sidebar">
            <div class="sidebar-header">
              <button @click="createNewConversation" class="new-conversation-btn" title="New chat">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                New chat
              </button>
            </div>
            
            <div class="conversations-list">
              <div 
                v-for="conv in conversations" 
                :key="conv.id"
                :class="['conversation-item', { active: activeConversationId === conv.id }]"
                @click="switchConversation(conv.id)"
                :title="conv.title">
                
                <div class="conversation-content">
                  <span class="conversation-title">{{ conv.title }}</span>
                  <span class="conversation-time">{{ formatConversationTime(conv.createdAt) }}</span>
                </div>

                <button 
                  v-if="conversations.length > 1"
                  @click.stop="closeConversation(conv.id)"
                  class="delete-conversation"
                  title="Delete conversation">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="chat-content">
            <div class="chatbot-messages" ref="chatbotMessagesContainer">
              <div v-if="!chatBotResponse && chatBotResults.length === 0 && !chatBotLoading" class="chatbot-welcome" style="top: 5px; position:relative;">
                <div class="examples-section">
                  <h5>Try asking:</h5>
                  <div class="example-item">"Who directed The Matrix?"</div>
                  <div class="example-item">"Who starred in the movie Pulp Fiction?"</div>
                  <div class="example-item">"What was the name of the actress of Queen's Gambit?"</div>
                </div>

                <div class="modern-divider">
                  <span class="divider-line"></span>
                  <span class="divider-text">OR</span>
                  <span class="divider-line"></span>
                </div>

                <div v-if="currentDailyPrompt" class="daily-prompt-section">
                  <div class="daily-badge">DAILY PROMPT</div>
                  <div class="daily-prompt-content">
                    <p>{{ currentDailyPrompt }}</p>
                    <button @click="sendDailyPrompt" class="daily-prompt-button">Learn More</button>
                  </div>
                </div>
              </div>

              <div v-if="chatMessages.length > 0" class="conversation-container">
                <div v-for="(message, index) in chatMessages" :key="index" class="message-wrapper">
                  <div v-if="message.role === 'user'" class="user-message">
                    <div class="message-content">
                      <p>{{ message.content }}</p>
                    </div>
                  </div>
                  <div v-else-if="message.role === 'assistant'" class="assistant-message">
                    <div class="message-content">
                      <p v-html="message.content"></p>
                    </div>
                  </div>
                </div>
                
                <div v-if="chatBotLoading && messageWaitingForResponse" class="message-wrapper">
                  <div class="assistant-message">
                    <div class="message-content reasoning-content">
                      <div class="reasoning-indicator">
                        Reasoning
                        <div class="dots-container">
                          <span class="dot" :class="{ active: dotIndex === 0 }"></span>
                          <span class="dot" :class="{ active: dotIndex === 1 }"></span>
                          <span class="dot" :class="{ active: dotIndex === 2 }"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="chatBotResults.length > 0" class="media-carousel">
                <h3 class="carousel-title">Related Results</h3>
                <div class="carousel-container">
                  <button @click="scrollCarousel('left')" class="carousel-nav carousel-prev">❮</button>
                  <div class="carousel-content" ref="mediaCarousel">
                    <div v-for="item in chatBotResults" :key="item.id + '-' + item.media_type" class="carousel-item">

                      <a v-if="item.media_type === 'movie'"
                         :href="item.url"
                         class="media-link"
                         target="_blank">
                        <div class="poster-wrapper">
                          <img v-if="item.poster_path" :src="'https://image.tmdb.org/t/p/w342' + item.poster_path" :alt="item.title || 'Movie Poster'">
                          <img v-else src="/static/image_not_found.png" :alt="item.title || 'Movie Poster Not Found'">
                          <div class="media-type">Movie</div>
                          <div class="movie-rating" v-if="item.vote_average > 0">
                            {{ (item.vote_average).toFixed(1) }}
                            <span class="star">★</span>
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
                          <img v-if="item.poster_path" :src="'https://image.tmdb.org/t/p/w342' + item.poster_path" :alt="item.name || 'TV Show Poster'">
                          <img v-else src="/static/image_not_found.png" :alt="item.name || 'TV Show Poster Not Found'">
                          <div class="media-type">TV Show</div>

                          <div class="movie-rating" v-if="item.vote_average > 0">
                            {{ (item.vote_average).toFixed(1) }}
                            <span class="star">★</span>
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
                          <img v-if="item.profile_path" :src="'https://image.tmdb.org/t/p/w342' + item.profile_path" :alt="item.name || 'Person Profile'">
                          <img v-else src="/static/image_not_found.png" :alt="item.name || 'Person Profile Not Found'">
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
                <input
                  v-if="inputEnabled || !isMobileDevice"
                  v-model="chatBotQuery"
                  placeholder="Ask about movies, series, actors..."
                  @keyup.enter="handleSendAction"
                  ref="chatInput"
                >
                
                <div 
                  v-else-if="isMobileDevice && !inputEnabled"
                  class="fake-input"
                  @click="enableInput"
                >
                  Ask about movies, series, actors...
                </div>
                <div class="input-backdrop" :style="{ width: inputWidth + '%' }"></div>
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
          <h3>Spoiler Detected</h3>
          <p>The answer may contain spoilers about plot twists, endings, or other narrative elements.</p>
          <div class="spoiler-actions">
            <button @click="showSpoilerContent" class="spoiler-button accept">I can handle the truth</button>
            <button @click="cancelSpoilerContent" class="spoiler-button cancel">Cancel</button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="chatBotMinimized" class="minimized-chatbot" @click="maximizeChatBot">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>
        <div v-if="hasConversation" class="notification-dot"></div>
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
      chatMessages: [],
      messageWaitingForResponse: false,
      inputWidth: 0,
      chatId: null,
      sessionKey: 'entercinema_chat_session',
      tmdbApiKey: process.env.API_KEY,
      baseUrl: typeof window !== 'undefined'
               ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000' : 'https://entercinema.com')
               : 'https://entercinema.com',
      apiUrl: typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'https://entercinema-assistant-rust.vercel.app/api/gemini' 
        : 'https://entercinema-assistant-rust.vercel.app/api/gemini',
      titleGenerationUrl: typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'https://entercinema-assistant-rust.vercel.app/api/gemini' 
        : 'https://entercinema-assistant-rust.vercel.app/api/gemini',
      predefinedApiUrl: typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
              ? 'http://localhost:8000/api' 
              : 'https://entercinema-predefined.vercel.app/api',
      currentDailyPrompt: '',
      dailyPrompts: [
        "What were Stanley Kubrick's most innovative contributions to cinematography?",
        "How did the Dogme 95 movement challenge conventional filmmaking?",
        "What are the defining characteristics of Italian Neorealism and its historical context?",
        "Which actor turned down the role of Neo in 'The Matrix' before it was offered to Keanu Reeves?",
        "Who were the pioneering female directors in the New Hollywood era of the 1970s and what obstacles did they face compared to their male counterparts?",
        "How did Tarkovsky use the long-take technique in 'Stalker' to create a sense of temporal immersion, and what philosophical significance does this aesthetic choice hold?",
        "Which Best Picture Oscar nominee was filmed entirely using only natural light?",
        "Could you identify the dark-haired actress who portrayed a chef in a restaurant drama series where everyone yells and also appeared in a recent episode of Black Mirror?",
        "What was the first film to use a 3D computer-generated imagery system?",
        "What is the most expensive film ever made?",
        "Which actress has the most Oscar awards in film history?",
        "Which horror film with social commentary on racism did Jordan Peele direct in 2017?",
        "In which 2018 horror film does a group of YouTubers livestream from one of Korea's most haunted locations?",
        "How many different actors have portrayed Batman in live-action films since 1943?",
        "Which 1941 film is considered by many critics to be the greatest of all time?",
        "Which legendary suspense director appeared in cameos in all his films? What are his most iconic appearances?",
        "Which Hong Kong director revolutionized action films with stylized gunfight choreography and the use of two pistols?",
        "Which Christopher Nolan film manipulates time in three simultaneous narrative lines during World War II?",
        "Which actor won the Oscar after losing 30 kilos to play an AIDS patient in 'Dallas Buyers Club'?",
        "Which acting method, developed in Russia and popularized in Hollywood, requires actors to live as their characters even off set?"
      ],
      currentPromptIndex: -1,
      chatBotMinimized: false,
      sessionMinimizedKey: 'entercinema_chat_minimized',
      conversations: [],
      activeConversationId: null,
      conversationsStorageKey: 'entercinema_chat_conversations',
      sidebarOpen: false,
      titleGenerationInterval: null,
      conversationIndex: 0
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
    this.loadDailyPrompt();
  },
  mounted() {
    window.addEventListener('resize', this.checkMobileDevice);
    this.loadChatSession();
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
    this.loadConversations();
    this.initializeFirstConversation();
    this.$root.$on('chatbot-maximized', () => {
      this.chatBotMinimized = false;
    });
  },

  beforeDestroy() {
    this.saveCurrentConversation();
    this.saveConversations();
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
  },
  methods: {
    loadConversations() {
      try {
        if (typeof localStorage !== 'undefined') {
          const saved = localStorage.getItem(this.conversationsStorageKey);
          if (saved) {
            this.conversations = JSON.parse(saved);
          }
        }
      } catch (error) {
        console.warn('Error loading conversations:', error);
      }
    },
    
    saveConversations() {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(this.conversationsStorageKey, JSON.stringify(this.conversations));
          const hasConversations = this.conversations.some(conv => conv.messages.length > 0);
          this.$root.$emit('chatbot-conversations-updated', hasConversations);
        }
      } catch (error) {
        console.warn('Error saving conversations:', error);
      }
    },
    
    initializeFirstConversation() {
      if (this.conversations.length === 0) {
        this.createNewConversation();
      } else {
        this.activeConversationId = this.conversations[0].id;
        this.loadActiveConversation();
      }
      this.startTitleGenerationInterval();
    },
    
    createNewConversation() {
      this.saveCurrentConversation();
      this.saveConversations();
      
      const newId = Date.now().toString();
      this.conversationIndex++;
      const now = new Date();
      const utcTime = now.toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
      
      const newConversation = {
        id: newId,
        title: `${this.conversationIndex} - ${utcTime}`,
        messages: [],
        results: [],
        chatId: null,
        createdAt: now.toISOString(),
        titleGenerated: false
      };
      
      this.conversations.unshift(newConversation);
      this.activeConversationId = newId;
      this.loadActiveConversation();
      this.saveConversations();
      
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
      
    switchConversation(conversationId) {
      if (conversationId !== this.activeConversationId) {
        this.saveCurrentConversation();
        this.saveConversations();
        this.activeConversationId = conversationId;
        this.loadActiveConversation();
      }
    },
    
    closeConversation(conversationId) {
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
        
        this.saveConversations();
      }
    },
    
    loadActiveConversation() {
      const activeConv = this.conversations.find(conv => conv.id === this.activeConversationId);
      if (activeConv) {
        this.chatMessages = [...activeConv.messages];
        this.chatId = activeConv.chatId;
        this.chatBotResults = activeConv.results ? [...activeConv.results] : [];
      } else {
        this.chatMessages = [];
        this.chatId = null;
        this.chatBotResults = [];
      }
    },

    saveCurrentConversation() {
      const activeConv = this.conversations.find(conv => conv.id === this.activeConversationId);
      if (activeConv) {
        activeConv.messages = [...this.chatMessages];
        activeConv.chatId = this.chatId;
        activeConv.results = [...this.chatBotResults];
        activeConv.updatedAt = new Date().toISOString();
      }
    },

    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },

    formatConversationTime(createdAt) {
      if (!createdAt) return '';
      const date = new Date(createdAt);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Now';
      if (diffMins < 60) return `${diffMins}m`;
      if (diffHours < 24) return `${diffHours}h`;
      if (diffDays < 7) return `${diffDays}d`;
      return date.toLocaleDateString();
    },

    startTitleGenerationInterval() {
      if (this.titleGenerationInterval) {
        clearInterval(this.titleGenerationInterval);
      }

      this.titleGenerationInterval = setInterval(() => {
        this.generateConversationTitles();
      }, 10000);

      setTimeout(() => {
        this.generateConversationTitles();
      }, 5000);
    },

    async generateConversationTitles() {
      for (const conversation of this.conversations) {
        if (conversation.titleGenerated || conversation.messages.length === 0) {
          continue;
        }

        const placeholderPattern = /^\d+ - \d{4}-\d{2}-\d{2} \d{2}:\d{2} UTC$/;
        if (!placeholderPattern.test(conversation.title)) {
          continue;
        }

        try {
          const conversationText = conversation.messages
            .map(msg => `${msg.role}: ${msg.content}`)
            .join('\n');

          const language = this.detectLanguage(conversationText);
          
          const response = await this.generateTitleWithAI(conversationText, language);
          
          if (response && response.trim()) {
            conversation.title = response.trim();
            conversation.titleGenerated = true;
            this.saveConversations();
          }
        } catch (error) {
          console.warn('Error generating title for conversation:', error);
        }
      }
    },

    detectLanguage(text) {
      const spanishWords = ['el', 'la', 'de', 'que', 'y', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'los', 'las', 'una', 'como', 'pero', 'sus', 'han', 'había', 'película', 'serie', 'actor', 'actriz', 'director', 'cine'];
      const englishWords = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'movie', 'film', 'series', 'actor', 'actress', 'director', 'cinema'];
      
      const words = text.toLowerCase().split(/\s+/);
      let spanishCount = 0;
      let englishCount = 0;
      
      words.forEach(word => {
        if (spanishWords.includes(word)) spanishCount++;
        if (englishWords.includes(word)) englishCount++;
      });
      
      return spanishCount > englishCount ? 'es' : 'en';
    },

    async generateTitleWithAI(conversationText, language) {
      const prompt = language === 'en' 
        ? `Generate a short and descriptive title (maximum 40 characters) for this conversation about movies/TV shows. Respond only with the title, no quotes or explanations:\n\n${conversationText}`
        : `Generate a short and descriptive title (maximum 40 characters) for this conversation about movies/TV shows. Respond only with the title, no quotes or explanations:\n\n${conversationText}`
      ;


      try {
        const response = await fetch(this.titleGenerationUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: prompt,
            chat_id: null
          })
        });

        if (response.ok) {
          const data = await response.json();
          return data.result ? data.result.substring(0, 40) : null;
        }
      } catch (error) {
        console.warn('Error calling title generation API:', error);
      }

      const firstUserMessage = conversationText.split('\n').find(line => line.startsWith('user:'));
      if (firstUserMessage) {
        const content = firstUserMessage.replace('user:', '').trim();
        return content.length > 40 ? content.substring(0, 37) + '...' : content;
      }

      return null;
    },
    
    minimizeChatBot() {
      this.saveCurrentConversation();
      this.saveConversations();
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

    loadChatSession() {
      try {
        if (typeof localStorage !== 'undefined') {
          const sessionData = localStorage.getItem(this.sessionKey);
          if (sessionData) {
            const parsed = JSON.parse(sessionData);
            this.chatId = parsed.chatId;
          }
        }
      } catch (error) {
        console.warn('Error loading chat session:', error);
      }
    },
    
    saveChatSession() {
      try {
        if (typeof localStorage !== 'undefined' && this.chatId) {
          const sessionData = {
            chatId: this.chatId,
            timestamp: Date.now()
          };
          localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
        }
      } catch (error) {
        console.warn('Error saving chat session:', error);
      }
    },
    
    clearChatSession() {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(this.sessionKey);
        }
      } catch (error) {
        console.warn('Error clearing chat session:', error);
      }
    },

    checkMobileDevice() {
      this.isMobileDevice = window.innerWidth <= 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    handleSendAction() {
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

    open() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (!token) {
        this.$router.push('/login');
        return;
      }
      this.chatBotOpen = true;
      this.chatBotMinimized = false;
      this.clearMinimizedState();
      this.checkMobileDevice();
      this.inputEnabled = !this.isMobileDevice;
      
      this.createNewConversation();
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
      this.saveCurrentConversation();
      this.saveConversations();
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
        this.scrollToBottom();
      });

      try {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: queryToSend,
            chat_id: this.chatId
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        this.chatId = data.chat_id;
        this.saveChatSession();

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
      this.saveCurrentConversation();
      this.saveConversations();
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
          this.saveConversations();
        }
      }
      this.saveCurrentConversation();
      this.saveConversations();
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
        this.saveChatSession();

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
        this.saveChatSession();
      
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
                              language: 'en-US',
                              page: 1,
                              include_adult: false
                          },
                          timeout: 8000
                      });
                      
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
              let searchUrl = '';
              let mediaType = ref.type.toLowerCase();
              
              const params = {
                  api_key: this.tmdbApiKey,
                  query: ref.name,
                  language: 'en-US',
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
                  .then(response => {
                      if (response.data?.results?.length > 0) {
                          const sortedResults = response.data.results.sort((a, b) => 
                              (b.popularity || 0) - (a.popularity || 0)
                          );
                          
                          const item = sortedResults[0];
                          const uniqueId = `${mediaType}-${item.id}`;

                          if (item.id && !seenIds.has(uniqueId)) {
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
                                  originalName: ref.name
                              };
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
                                      language: 'en-US',
                                      page: 1,
                                      include_adult: false
                                  },
                                  timeout: 8000
                              });
                              
                              if (betterMatchResponse.data?.results?.length > 1) { 
                                  for (let i = 1; i < Math.min(5, betterMatchResponse.data.results.length); i++) {
                                      const alternativeItem = betterMatchResponse.data.results[i];
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
                                              alternativeFound: true
                                          };

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
                          } else {
                              console.log(`Media "${mediaItem.title || mediaItem.name}" descartado por no tener relación con las personas`);
                          }
                      })
                      .catch(error => {
                          console.error(`Error verificando relación para ${mediaItem.title || mediaItem.name}:`, error);
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
              language: 'en-US'
            },
            timeout: 8000
          })
          .then(response => {
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
              originalName: ref.name
            };
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
  z-index: 999999999999;
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
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 28' width='56' height='28'%3E%3Cpath fill='%237ed2e3' fill-opacity='0.1' d='M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0zm-5.43 2.71c1.13-.72 2.3-1.37 3.54-1.93a19.98 19.98 0 0 0-32.76 0c1.23.56 2.41 1.2 3.54 1.93a15.98 15.98 0 0 1 25.68 0zm-4.67 3.78c.94-.95 1.96-1.83 3.03-2.63a13.98 13.98 0 0 0-22.4 0c1.07.8 2.09 1.68 3.03 2.63a9.99 9.99 0 0 1 16.34 0z'%3E%3C/path%3E%3C/svg%3E");
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
  white-space: nowrap;
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
    font-size: 12px;
    line-height: 1.6;
}

.chatbot-welcome p {
    margin-bottom: 12px;
}

.chatbot-welcome p:last-child {
    margin-bottom: 0;
    font-size: 12px;
    color: #7fdbf1;
    opacity: 0.8;
}

.reasoning-content {
  /*
   background: rgba(13, 27, 42, 0.7) !important;
  */
  border-left: 3px solid rgba(127, 219, 241, 0.4) !important;
  padding: 0 !important;
  min-height: auto !important;
}

.streaming-content {
  background: rgba(13, 27, 42, 0.5) !important;
  border: 1px solid rgba(127, 219, 241, 0.2) !important;
  border-left: 3px solid rgba(127, 219, 241, 0.4) !important;
  color: #e0e0e0 !important;
  border-top-left-radius: 4px !important;
  padding: 12px 16px !important;
  min-height: auto !important;
}

.streaming-response {
  position: relative;
  line-height: 1.5;
}

.streaming-response p {
  margin: 0;
  color: #e0e0e0;
  font-size: 15px;
  word-wrap: break-word;
}

.cursor-indicator {
  display: inline-block;
  animation: blink 1s infinite;
  color: #7FDBF1;
  font-size: 19px;
  font-weight: bold;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.reasoning-indicator {
  display: flex;
  align-items: center;
  background: transparent;
  border-radius: 12px;
  padding: 12px 25px;
  position: relative;
  color: #7FDBF1;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  justify-content: center;
}

.dots-container {
  display: flex;
  align-items: center;
  margin-left: 8px;
  height: 20px;
  position: relative;
  top: 5px;
}

.dot {
  width: 1px;
  height: 1px;
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
    width: 4px;
    height: 4px;
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
    width: 3px;
    height: 3px;
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
  background: rgba(0, 0, 0, 0.4);
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
    font-size: 16px;
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
    background: linear-gradient(135deg, rgba(127, 219, 241, 0.4) 0%, rgba(0, 136, 204, 0.4) 100%);
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
  
  .send-button.stop-button {
    background: linear-gradient(135deg, rgba(255, 82, 82, 0.4) 0%, rgba(139, 0, 0, 0.4) 100%);
    border-color: rgba(255, 82, 82, 0.5);
  }
  
  .send-button.stop-button:hover {
    background: linear-gradient(135deg, rgba(255, 82, 82, 0.6) 0%, rgba(139, 0, 0, 0.6) 100%);
    border-color: rgba(255, 82, 82, 0.8);
  }
  
  .stop-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  
  .stop-indicator svg {
    width: 16px;
    height: 16px;
    fill: white;
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
      width: 4px;
      height: 4px;
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
      .chatbot-welcome p { font-size: 12px; }
      .chatbot-welcome p:last-child { font-size: 12px; }
      
      .daily-prompt-section {
        padding: 12px;
      }
      
      .daily-prompt-section h5 {
        font-size: 12px;
      }
      
      .daily-prompt-content p {
        font-size: 12px;
      }
      
      .daily-prompt-button {
        font-size: 12px;
        padding: 6px 12px;
      }
  }

  @media screen and (max-width: 768px) {
  .daily-prompt-button {
    font-size: 12px;
    padding: 6px 14px;
    background: rgba(127, 219, 241, 0.1);
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
  background: rgba(13, 27, 42, 0.75);
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
  background:rgba(13, 27, 42, 0.75);
  border-radius: 10px;
  padding: 18px;
  border-left: 3px solid rgba(127, 219, 241, 0.5);
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
  background: rgba(127, 219, 241, 0.15);
  color: #e0e0e0;
  border: 1px solid rgba(127, 219, 241, 0.3);
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
  background: rgba(127, 219, 241, 0.25);
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
  font-size: 16px;
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
  min-height: 54px;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  flex: 1; 
  max-width: 45%;
  white-space: normal;
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
.conversation-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
  animation: fadeInMessage 0.3s ease;
}

@keyframes fadeInMessage {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.user-message {
  align-self: flex-end;
}

.assistant-message {
  align-self: flex-start;
}

.message-content {
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-message .message-content {
  background: linear-gradient(135deg, rgba(0, 136, 204, 0.499) 0%, rgba(127, 218, 241, 0.561) 100%);
  border: 1px solid rgba(127, 219, 241, 0.4);
  color: #fff;
  border-top-right-radius: 4px;
}

.assistant-message .message-content {
  background: rgba(13, 27, 42, 0.5);
  border: 1px solid rgba(127, 219, 241, 0.2);
  border-left: 3px solid rgba(127, 219, 241, 0.4);
  color: #e0e0e0;
  border-top-left-radius: 4px;
}

.message-content p {
  margin: 0;
  line-height: 1.5;
  font-size: 15px;
  word-wrap: break-word;
}

.assistant-message .message-content p ::v-deep(strong) {
  color: #7FDBF1;
  font-weight: 600;
}

.assistant-message .message-content p ::v-deep(em) {
  font-style: italic;
  color: #a8d8e4;
}

.assistant-message .message-content p ::v-deep(br) {
  content: "";
  display: block;
  margin-bottom: 0.5em;
}

@media screen and (max-width: 768px) {
  .user-message, .assistant-message {
    max-width: 85%;
  }
  
  .message-content {
    padding: 10px 14px;
  }
  
  .message-content p {
    font-size: 14px;
  }
}

@media screen and (max-width: 576px) {
  .user-message, .assistant-message {
    max-width: 90%;
  }
  
  .message-content {
    padding: 8px 12px;
  }
  
  .message-content p {
    font-size: 13px;
  }
}

@media screen and (max-width: 768px) {
  .chatbot-input input, .fake-input {
    font-size: 16px;
    padding: 12px 15px;
    height: 46px;
  }
}

@media screen and (max-width: 576px) {
  .chatbot-input input, .fake-input {
    font-size: 12px;
    height: 46px;
  }
}

@media screen and (max-width: 768px) {
  .send-button {
    width: 46px;
    height: 46px;
  }
  
  .daily-prompt-section {
    padding: 15px;
    background: rgba(13, 27, 42, 0.3);
  }
}

@media screen and (max-width: 576px) {
  .daily-prompt-content p {
    font-size: 14px;
    margin-bottom: 12px;
  }
}

.header-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.minimize-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 28px;
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
  font-weight: 300;
}

.minimize-button:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.minimized-chatbot {
  position: fixed !important;
  bottom: 25px !important;
  right: 25px !important;
  width: 65px !important;
  height: 65px !important;
  background: linear-gradient(135deg, rgba(0, 136, 204, 0.9) 0%, rgba(127, 219, 241, 0.9) 100%) !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 999999999999 !important;
  color: white !important;
  cursor: pointer !important;
  visibility: visible !important;
  opacity: 1 !important;
  box-shadow: 0 4px 20px rgba(0, 122, 204, 0.4), 0 2px 10px rgba(0, 0, 0, 0.2) !important;
  animation: float 3s ease-in-out infinite !important;
}

.minimized-chatbot {
  display: block !important;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px);
    box-shadow: 0 4px 20px rgba(0, 122, 204, 0.4), 0 2px 10px rgba(0, 0, 0, 0.2);
  }
  50% { 
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 122, 204, 0.6), 0 4px 15px rgba(0, 0, 0, 0.3);
  }
}

.minimized-chatbot:hover {
  transform: translateY(-8px) scale(1.1) !important;
  box-shadow: 0 12px 30px rgba(0, 122, 204, 0.6), 0 6px 20px rgba(0, 0, 0, 0.3) !important;
  animation: none !important;
}

.minimized-chatbot svg {
  width: 28px !important;
  height: 28px !important;
  stroke: white !important;
  fill: none !important;
}

.notification-dot {
  position: absolute !important;
  top: 5px !important;
  right: 5px !important;
  width: 16px !important;
  height: 16px !important;
  background: #ff4757 !important;
  border-radius: 50% !important;
  border: 3px solid white !important;
  animation: pulse-notification 2s infinite !important;
}

@keyframes pulse-notification {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

@media screen and (max-width: 768px) {
  .minimized-chatbot {
    bottom: 20px !important;
    right: 20px !important;
    width: 60px !important;
    height: 60px !important;
  }
  
  .minimized-chatbot svg {
    width: 24px !important;
    height: 24px !important;
  }
  
  .notification-dot {
    width: 14px !important;
    height: 14px !important;
    top: 4px !important;
    right: 4px !important;
    border: 2px solid white !important;
  }
}
.conversation-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 70%;
  overflow-x: auto;
}

.tab {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: 80px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.tab.active {
  background: rgba(127, 219, 241, 0.3);
  color: #7FDBF1;
}

.tab-title {
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.close-tab {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  margin-left: 4px;
}

.close-tab:hover {
  color: #fff;
}

.new-tab-button {
  background: rgba(127, 219, 241, 0.2);
  border: 1px solid rgba(127, 219, 241, 0.5);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #7FDBF1;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.2s ease;
}

.new-tab-button:hover {
  background: rgba(127, 219, 241, 0.4);
  transform: scale(1.05);
}




.chatbot-main {
  display: flex;
  flex: 1; 
  overflow: hidden;
}


.chat-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}


.conversations-sidebar {
  width: 260px; 
  background: rgba(0, 0, 0, 0.2);
  border-right: 1px solid rgba(127, 219, 241, 0.2); 
  display: flex;
  flex-direction: column;
  flex-shrink: 0; 
  transition: width 0.3s ease; 
}


.sidebar-toggle {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 5px;
  margin-right: 15px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.sidebar-toggle:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
}


.sidebar-header {
  padding: 18px 15px;
  border-bottom: 1px solid rgba(127, 219, 241, 0.2);
}


.new-conversation-btn {
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px solid rgba(127, 219, 241, 0.4);
  color: #cceef7;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.new-conversation-btn:hover {
  background: rgba(127, 219, 241, 0.15);
  border-color: rgba(127, 219, 241, 0.7);
  color: #fff;
}


.conversations-list {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
}

.conversations-list::-webkit-scrollbar {
  width: 6px;
}
.conversations-list::-webkit-scrollbar-thumb {
  background-color: rgba(127, 219, 241, 0.3);
  border-radius: 3px;
}
.conversations-list::-webkit-scrollbar-track {
  background: transparent;
}


.conversation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  margin-bottom: 5px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}


.conversation-item:hover {
  background-color: rgba(127, 219, 241, 0.1);
}


.conversation-item.active {
  background-color: rgba(127, 219, 241, 0.25);
}


.conversation-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-grow: 1;
  min-width: 0;
  margin-right: 8px;
}

.conversation-title {
  color: #e0e0e0;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; 
}

.conversation-time {
  font-size: 11px;
  color: #a8d8e4;
  opacity: 0.8;
}


.delete-conversation {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 2px;
  border-radius: 3px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
}

.conversation-item:hover .delete-conversation {
  opacity: 1;
  visibility: visible;
}

.delete-conversation:hover {
  color: #ff4757;
}


@media screen and (max-width: 768px) {
  .conversations-sidebar {
    width: 160px !important;
  }
  
  .sidebar-header {
    padding: 12px 10px;
  }
  
  .new-conversation-btn {
    padding: 8px 6px;
    font-size: 11px;
    gap: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
    height: auto;
    min-height: 32px;
  }
  
  .new-conversation-btn svg {
    flex-shrink: 0;
    width: 14px;
    height: 14px;
  }
  
  .conversation-item {
    padding: 10px 8px;
    margin-bottom: 4px;
  }
  
  .conversation-title {
    font-size: 12px;
    max-width: 120px;
    line-height: 1.3;
  }
  
  .conversation-time {
    font-size: 10px;
  }
  
  .conversation-content {
    margin-right: 6px;
  }
  
  .delete-conversation {
    width: 16px;
    height: 16px;
    margin-left: 6px;
  }
}

@media screen and (max-width: 576px) {
  .conversations-sidebar {
    width: 120px !important;
  }
  
  .sidebar-header {
    padding: 8px 6px;
  }
  
  .new-conversation-btn {
    padding: 14px 4px;
    font-size: 10px;
    gap: 2px;
    word-wrap: break-word;
    white-space: normal;
    text-align: center;
    line-height: 1.1;
    height: auto;
    min-height: 28px;
  }
  
  .new-conversation-btn svg {
    width: 12px;
    height: 12px;
  }
  
  .conversation-item {
    padding: 8px 6px;
    margin-bottom: 3px;
  }
  
  .conversation-title {
    font-size: 11px;
    max-width: 80px;
    line-height: 1.2;
  }
  
  .conversation-time {
    font-size: 9px;
  }
  
  .conversation-content {
    margin-right: 4px;
  }
}


@media screen and (max-width: 480px) {
  .conversations-sidebar {
    width: 100px !important;
  }
  
  .new-conversation-btn {
    font-size: 10px;
    padding: 14px 2px;
    word-wrap: break-word;
    white-space: normal;
    line-height: 1;
    height: auto;
    min-height: 24px;
  }
  
  .conversation-title {
    max-width: 70px;
    font-size: 10px;
  }
  
  .conversation-time {
    display: none;
  }
}

.conversations-sidebar {
  transform: translateX(0);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chatbot-main.sidebar-open .conversations-sidebar {
  transform: translateX(0);
}

.chatbot-main:not(.sidebar-open) .conversations-sidebar {
  transform: translateX(-100%);
}

.sidebar-toggle {
  transition: transform 0.2s ease;
}

.chatbot-main.sidebar-open .sidebar-toggle {
  transform: rotate(180deg);
}

.chatbot-main:not(.sidebar-open) .sidebar-toggle {
  transform: rotate(0deg);
}

.chat-content {
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chatbot-main.sidebar-open .chat-content {
  margin-left: 0;
}

.chatbot-main:not(.sidebar-open) .chat-content {
  margin-left: 0;
}
</style>

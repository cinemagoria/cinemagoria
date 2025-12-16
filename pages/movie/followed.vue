<template>
  <div>
    <main class="main">
      <div class="header-container">
        <h1 class="title-primary" style="text-align: center; margin-bottom: 0.5rem; color: #8BE9FD; font-family: 'Ortica', sans-serif;">De las productoras que sigues</h1>
        
        <p v-if="companyNames" class="title-secondary" style="text-align: center; margin-bottom: 2rem;">
          Mostrando títulos de: {{ companyNames }}
        </p>

        <div class="filter-actions-container">
          <button class="filter-btn" @click="openFiltersModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
            </svg>
            <span>Filtros y Orden</span>
          </button>
        </div>

         <div v-if="hasActiveFilters" class="active-filters-indicator">
            <div class="filter-chips">
              <div v-for="(chip, index) in activeFilterChips" :key="index" class="filter-chip">
                <span>{{ chip.label }}</span>
                <button @click="removeFilter(chip.value)" class="chip-remove">×</button>
              </div>
            </div>
            <button @click="clearAllFilters" class="clear-all-inline">Borrar todo</button>
        </div>
      </div>

      <div v-if="loading" class="loading-container" style="width: 100%; display: flex; justify-content: center; padding: 2rem;">
           <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" stroke="#2196f3">
            <g fill="none" fill-rule="evenodd" stroke-width="2">
              <circle cx="22" cy="22" r="1">
                <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/>
                <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/>
              </circle>
            </g>
          </svg>
      </div>

      <div v-else-if="companySections.length > 0" class="content-container">
        <div v-for="company in companySections" :key="company.id" class="company-section">
           
           <div class="company-header" @click="toggleSection(company.id)">
             <div class="company-title-wrapper">
               <h2 class="company-title">{{ company.name }}</h2>
               <span class="item-count">({{ getFilteredItems(company.items).length }})</span>
             </div>
             <svg 
              class="chevron-icon" 
              :class="{ 'rotated': !company.expanded }"
              width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
           </div>

           <div v-show="company.expanded" class="company-content">
             
              <div v-if="getFilteredItems(company.items).length > 0" class="movie-grid">
                <Card 
                  v-for="item in getFilteredItems(company.items)" 
                  :key="item.id" 
                  :item="item" 
                />
              </div>
              <div v-else class="no-results-in-section">
                <p>No hay títulos que coincidan con tus filtros.</p>
              </div>

               <!-- Load More Button -->
              <div v-if="company.page < company.totalPages && !company.loadingMore" class="load-more-container">
                <button @click="loadMore(company.id)" class="load-more-btn">
                   Cargar más
                </button>
              </div>
              <div v-if="company.loadingMore" class="load-more-container">
                 <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 44 44" stroke="#8BE9FD">
                    <g fill="none" fill-rule="evenodd" stroke-width="2">
                        <circle cx="22" cy="22" r="1">
                            <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/>
                            <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/>
                        </circle>
                    </g>
                </svg>
              </div>

           </div>
        </div>
      </div>

      <div v-else-if="!loading" class="no-results">
        <p style="text-align: center; color: white; margin-top: 2rem;">No se encontró contenido de las productoras que sigues.</p>
      </div>

      <!-- Filter Modal -->
      <div v-if="filtersModalVisible" class="modal-overlay" @click="closeFiltersModal">
          <div class="filters-modal" @click.stop>
            <div class="modal-header">
              <h3>Filtros y Orden</h3>
              <button class="close-btn" @click="closeFiltersModal">×</button>
            </div>
            
            <div class="filters-content">
              
              <div class="filter-group">
                <label class="filter-label">Rango Calificación IMDb</label>
                 <div class="year-inputs">
                  <input type="number" v-model.number="minImdbRating" min="0" max="10" placeholder="Min" class="year-input">
                  <span class="year-separator">-</span>
                  <input type="number" v-model.number="maxImdbRating" min="0" max="10" placeholder="Max" class="year-input">
                </div>
              </div>

              <div class="filter-group">
                <label class="filter-label">Ordenar Por</label>
                <select v-model="orderMode" class="filter-input">
                  <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div class="filter-actions">
                <button @click="clearAllFilters" class="clear-btn">Borrar</button>
                <button @click="closeFiltersModal" class="apply-btn">Aplicar</button>
              </div>
            </div>
          </div>
        </div>

    </main>
  </div>
</template>

<script>
import { getMoviesByCompanies, getFollowedProductionCompanies } from '~/api';
import Card from '~/components/Card';

export default {
  components: {
    Card,
  },

  data() {
    return {
      loading: false,
      companySections: [],
      companyNames: '',
      
      filtersModalVisible: false,
      orderMode: 'newest-releases',
      minImdbRating: null,
      maxImdbRating: null,
      
      sortOptions: [
        { value: 'newest-releases', label: 'Lanzamientos más recientes' },
        { value: 'oldest-releases', label: 'Lanzamientos más antiguos' },
        { value: 'imdb-high', label: 'IMDb: Mayor a menor' },
        { value: 'imdb-low', label: 'IMDb: Menor a mayor' },
        { value: 'imdb-votes-high', label: 'Votos IMDb: Mayor a menor' },
        { value: 'imdb-votes-low', label: 'Votos IMDb: Menor a mayor' },
      ],
    };
  },

  head() {
    return {
      title: 'EnterCinema - Productoras Seguidas',
    };
  },

  computed: {
     hasActiveFilters() {
      return this.minImdbRating || this.maxImdbRating;
    },
    activeFilterChips() {
      const chips = [];
      if (this.minImdbRating || this.maxImdbRating) {
          let label = 'IMDb: ';
          if (this.minImdbRating && this.maxImdbRating) label += `${this.minImdbRating}-${this.maxImdbRating}`;
          else if (this.minImdbRating) label += `> ${this.minImdbRating}`;
          else label += `< ${this.maxImdbRating}`;
          chips.push({ label, value: 'imdb' });
      }
      return chips;
    }
  },

  mounted() {
    this.asyncInit();
  },

  methods: {
    async asyncInit() {
         this.fetchFollowedContent();
    },

    async fetchFollowedContent() {
      if (typeof window === 'undefined') return;
      
      const userEmail = localStorage.getItem('email');
      if (!userEmail) return;

      this.loading = true;
      try {
        const followedCompanies = await getFollowedProductionCompanies(userEmail);
        
        if (followedCompanies && followedCompanies.length > 0) {
          followedCompanies.sort((a, b) => a.company_name.localeCompare(b.company_name));
          
          const distinctNames = followedCompanies.map(c => c.company_name);
          if (distinctNames.length > 10) {
            this.companyNames = distinctNames.slice(0, 10).join(', ') + ' y más';
          } else {
            this.companyNames = distinctNames.join(', ');
          }
          
          const sections = [];

          for (const company of followedCompanies) {
             const response = await getMoviesByCompanies(company.company_id, 1);
             if (response && response.results) {
               sections.push({
                 id: company.company_id,
                 name: company.company_name,
                 items: response.results,
                 expanded: true,
                 page: 1,
                 totalPages: response.total_pages,
                 loadingMore: false
               });
             }
          }
           this.companySections = sections;
        }
      } catch (error) {
        console.error('Error fetching followed movies:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async loadMore(companyId) {
        const section = this.companySections.find(s => s.id === companyId);
        if (!section || section.page >= section.totalPages || section.loadingMore) return;

        section.loadingMore = true;
        try {
            const nextPage = section.page + 1;
            const response = await getMoviesByCompanies(companyId, nextPage);
            
            if (response && response.results) {
                const existingIds = new Set(section.items.map(i => i.id));
                const newItems = response.results.filter(item => !existingIds.has(item.id));
                
                if (newItems.length > 0) {
                    section.items = [...section.items, ...newItems];
                }
                section.page = nextPage;
            }
        } catch (error) {
            console.error(`Error loading more for company ${companyId}:`, error);
        } finally {
            section.loadingMore = false;
        }
    },
    
    toggleSection(id) {
      const section = this.companySections.find(s => s.id === id);
      if (section) section.expanded = !section.expanded;
    },

    getFilteredItems(items) {
      if (!items) return [];
      
      let result = items.filter(item => {
        const rating = item.vote_average;
        if (this.minImdbRating && rating < this.minImdbRating) return false;
        if (this.maxImdbRating && rating > this.maxImdbRating) return false;

        return true;
      });

      result.sort((a, b) => {
         const dateA = new Date(a.release_date || a.first_air_date || 0);
         const dateB = new Date(b.release_date || b.first_air_date || 0);
         const getRating = (item) => {
            let val = 0;
            if (item.rating_source === 'imdb' && item.imdb_rating) {
                val = item.imdb_rating;
            } else {
                val = item.vote_average;
            }
            if (typeof val === 'string') val = val.replace(',', '.');
            return Number(val) || 0;
         };
         
         const getVotes = (item) => {
             if (item.rating_source === 'imdb' && item.imdb_votes) {
                 return Number(item.imdb_votes) || 0;
             }
             return Number(item.vote_count) || 0;
         };
         
         const ratingA = getRating(a);
         const ratingB = getRating(b);
         const votesA = getVotes(a);
         const votesB = getVotes(b);

         switch(this.orderMode) {
             case 'newest-releases': return dateB - dateA;
             case 'oldest-releases': return dateA - dateB;
             case 'imdb-high': 
                 if (ratingB !== ratingA) return ratingB - ratingA;
                 return votesB - votesA;
             case 'imdb-low': 
                if (ratingA === 0 && ratingB > 0) return 1;
                if (ratingB === 0 && ratingA > 0) return -1;
                if (ratingA !== ratingB) return ratingA - ratingB;
                return votesB - votesA; 
             case 'imdb-votes-high': return votesB - votesA;
             case 'imdb-votes-low': 
                if (votesA === 0 && votesB > 0) return 1;
                if (votesB === 0 && votesA > 0) return -1;
                return votesA - votesB;
             default: return 0;
         }
      });

      return result;
    },
    
    openFiltersModal() { this.filtersModalVisible = true; },
    closeFiltersModal() { this.filtersModalVisible = false; },
    removeFilter(type) {
        if (type === 'imdb') { this.minImdbRating = null; this.maxImdbRating = null; }
    },
    clearAllFilters() {
        this.minImdbRating = null;
        this.maxImdbRating = null;
        this.orderMode = 'newest-releases';
    },
  },
};
</script>

<style scoped lang="scss">
/* Reuse same styles as Main project */
.header-container {
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 6rem;
}

.title-secondary {
  font-size: 1.6rem;
  color: rgba(255, 255, 255, 0.7);
}

.filter-actions-container {
    margin-top: 1rem;
    display: flex;
    gap: 1rem;
}

.filter-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
    padding: 0.8rem 1.5rem;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1.4rem;
    
    &:hover {
        border-color: #8BE9FD;
        background: rgba(139, 233, 253, 0.1);
    }
}

.content-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
}

.company-section {
    margin-bottom: 3rem;
}

.company-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    cursor: pointer;
    margin-bottom: 1.5rem;
    
    &:hover .company-title {
        color: #8BE9FD;
    }
}

.company-title-wrapper {
    display: flex;
    align-items: baseline;
    gap: 1rem;
}

.company-title {
    font-size: 2rem;
    font-weight: 700;
    color: white;
    transition: color 0.2s;
}

.item-count {
    color: rgba(255,255,255,0.5);
    font-size: 1.4rem;
}

.chevron-icon {
    transition: transform 0.3s ease;
    &.rotated {
        transform: rotate(-90deg);
    }
}

.movie-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 2rem;
}

.no-results-in-section {
    padding: 2rem;
    text-align: center;
    color: rgba(255,255,255,0.5);
    font-style: italic;
}

.load-more-container {
    display: flex;
    justify-content: center;
    padding: 2rem 0;
}

.load-more-btn {
    background: transparent;
    border: 1px solid #8BE9FD;
    color: #8BE9FD;
    padding: 0.8rem 2rem;
    border-radius: 30px;
    font-size: 1.4rem;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
        background: rgba(139, 233, 253, 0.1);
        transform: translateY(-2px);
    }
}

.modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.85);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}
.filters-modal {
    background: #000;
    width: 90%;
    max-width: 500px;
    border-radius: 10px;
    overflow: hidden;
     border: 1px solid rgba(255,255,255,0.1);
}
.modal-header {
    display: flex;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    
    h3 { margin: 0; color: #8BE9FD; font-size: 1.8rem; }
}
.close-btn {
    background: none; border: none; color: white; font-size: 2rem; cursor: pointer;
}
.filters-content {
    padding: 2rem;
}
.filter-group { margin-bottom: 2rem; }
.filter-label { display: block; margin-bottom: 0.5rem; color: #ccc; font-size: 1.4rem; }
.custom-select {
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 5px;
    padding: 1rem;
    cursor: pointer;
    position: relative;
    color: white; 
    font-size: 1.4rem;
}
.select-display { display: flex; justify-content: space-between; align-items: center; }
.dropdown-options {
    position: absolute; top: 100%; left: 0; right: 0;
    background: #1a1a1a;
    border: 1px solid rgba(255,255,255,0.2);
    z-index: 10;
    max-height: 200px; overflow-y: auto;
}
.dropdown-option {
    padding: 1rem;
    &:hover { background: #333; }
    &.selected { color: #8BE9FD; }
}
.year-inputs { display: flex; align-items: center; gap: 1rem; }
.year-input {
    background: transparent; border: 1px solid rgba(255,255,255,0.2);
    color: white; padding: 0.8rem; border-radius: 5px; width: 100px;
    font-size: 1.4rem;
}
.filter-input {
    width: 100%; padding: 1rem; background: transparent;
    border: 1px solid rgba(255,255,255,0.2); border-radius: 5px;
    color: white; font-size: 1.4rem;
}
.filter-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
.clear-btn { background: transparent; color: #ff5555; border: none; font-size: 1.4rem; cursor: pointer; }
.apply-btn { background: #8BE9FD; color: black; border: none; padding: 0.8rem 2rem; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 1.4rem;}

.active-filters-indicator {
    margin-top: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
}
.filter-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.filter-chip {
    background: rgba(139, 233, 253, 0.2);
    border: 1px solid #8BE9FD;
    padding: 0.4rem 1rem;
    border-radius: 15px;
    color: #8BE9FD;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.2rem;
}
.chip-remove { background: none; border: none; color: #8BE9FD; cursor: pointer; font-size: 1.4rem; }
.clear-all-inline { background: none; border: none; text-decoration: underline; color: #ccc; cursor: pointer; font-size: 1.2rem; }

@media (max-width: 600px) {
    .movie-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
}
</style>

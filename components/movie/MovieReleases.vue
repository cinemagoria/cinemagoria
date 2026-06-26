<template>
  <div class="spacing" :class="$style.releases">
    <div :class="$style.container">
      <h2 :class="$style.title">Información de Estreno</h2>

      <div v-if="loading" :class="$style.loading">
        <Loader />
      </div>

      <div v-else-if="groupedReleases.length === 0" :class="$style.noData">
        <p>No hay información de estreno disponible para esta película.</p>
      </div>

      <div v-else :class="$style.releaseList">
        <div 
          v-for="(release, index) in groupedReleases" 
          :key="index"
          :class="$style.releaseCard">

          <div :class="$style.countryHeader">
            <img 
              :src="getCountryFlag(release.country)" 
              :alt="release.country" 
              :class="$style.flagIcon"
              loading="lazy"
            >
            <span :class="$style.countryName">{{ getCountryName(release.country) }}</span>
          </div>

          <div :class="$style.releaseDetails">
            <div 
              v-for="(date, dateIndex) in release.dates" 
              :key="dateIndex"
              :class="$style.releaseItem">

              <div :class="$style.releaseType">
                <span :class="$style.typeBadge">{{ getReleaseTypeName(date.type) }}</span>
                <span v-if="date.certification" :class="$style.certification">
                  {{ date.certification }}
                </span>
              </div>

              <div :class="$style.releaseDate">
                {{ formatReleaseDate(date.date) }}
              </div>

              <div v-if="date.note" :class="$style.releaseNote">
                {{ date.note }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMovieReleaseDates } from '~/utils/api';
import Loader from '~/components/Loader.vue';

export default {
  components: {
    Loader,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      releases: [],
      loading: true,
      releaseTypeNames: {
        1: 'Première',
        2: 'Cines (Limitado)',
        3: 'Cines',
        4: 'Digital',
        5: 'Físico',
        6: 'TV',
      },
    };
  },
  computed: {
    groupedReleases() {
      const grouped = {};
      
      this.releases.forEach(release => {
        const country = release.iso_3166_1;
        
        if (!grouped[country]) {
          grouped[country] = {
            country: country,
            dates: []
          };
        }
        
        release.release_dates.forEach(date => {
          grouped[country].dates.push({
            date: date.release_date,
            type: date.type,
            certification: date.certification || null,
            note: date.note || null,
          });
        });
      });
      Object.values(grouped).forEach(release => {
        release.dates.sort((a, b) => new Date(a.date) - new Date(b.date));
      });
      const releasesArray = Object.values(grouped);
      releasesArray.sort((a, b) => {
        if (a.country === 'ES') return -1;
        if (b.country === 'ES') return 1;
        return this.getCountryName(a.country).localeCompare(this.getCountryName(b.country));
      });
      return releasesArray;
    },
  },
  async mounted() {
    await this.fetchReleaseDates();
  },
  methods: {
    async fetchReleaseDates() {
      try {
        this.loading = true;
        const releases = await getMovieReleaseDates(this.item.id);
        this.releases = releases;
      } catch (error) {
        console.error('Error fetching release dates:', error);
        this.releases = [];
      } finally {
        this.loading = false;
      }
    },
    getCountryFlag(countryCode) {
      return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
    },
    getCountryName(countryCode) {
      try {
          const regionNames = new Intl.DisplayNames(['es'], { type: 'region' });
          return regionNames.of(countryCode);
      } catch (e) {
          return countryCode;
      }
    },
    getReleaseTypeName(type) {
      return this.releaseTypeNames[type] || 'Desconocido';
    },
    formatReleaseDate(dateString) {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
      };
      return date.toLocaleDateString('es-ES', options);
    },
  },
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;
.releases {
  position: relative;
  background: rgba(3, 4, 6, 0.55);
  background-image:
    radial-gradient(circle at 12% 8%, rgba(31, 84, 103, 0.16), transparent 32%),
    radial-gradient(circle at 88% 92%, rgba(139, 233, 253, 0.06), transparent 30%);
  border-radius: 20px;
  padding: 1.5rem 1.5rem 4rem;
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(31, 84, 103, 0.5),
    inset 0 0 20px rgba(139, 233, 253, 0.04);
  overflow: hidden;
  @media (min-width: $breakpoint-large) { padding: 2.5rem 2.5rem 4rem; }
}
.releases::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #8BE9FD, #1F5467, transparent);
  opacity: 0.8;
  pointer-events: none;
}
.container {
  padding-top: 1rem;
}
.title {
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: $letter-spacing;
  text-shadow: 0 0 18px rgba(139, 233, 253, 0.18);
  @media (min-width: $breakpoint-large) {
    font-size: 2.4rem;
  }
}
.noData {
  padding: 3rem 0;
  text-align: center;
  font-size: 1.5rem;
  color: $text-color;
}

.loading {
  padding: 3rem 0;
  text-align: center;
  font-size: 1.5rem;
  color: $text-color;
  background: rgba(0, 0, 0, 0.307);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
}
.releaseList {
  display: grid;
  gap: 2rem;
  
  @media (min-width: $breakpoint-medium) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: $breakpoint-large) {
    grid-template-columns: repeat(3, 1fr);
  }
}
.releaseCard {
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid rgba(139, 233, 253, 0.12);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.25s ease;
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(138, 232, 252, 0.4);
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(139, 233, 253, 0.2);
  }
}
.countryHeader {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(139, 233, 253, 0.05);
  border-bottom: 1px solid rgba(139, 233, 253, 0.12);
}
.flagIcon {
  width: 24px;
  height: 17px;
  object-fit: cover;
  border-radius: 2px;
  display: block;
  box-shadow: 0 0 1px rgba(0,0,0,0.5);
}
.countryName {
  font-size: 1.6rem;
  font-weight: 600;
  color: #fff;
  letter-spacing: $letter-spacing;
}
.releaseDetails {
  padding: 1.5rem;
}
.releaseItem {
  padding: 1rem 0;
  &:not(:last-child) {
    border-bottom: 1px solid rgba(139, 233, 253, 0.08);
  }
}
.releaseType {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.8rem;
}
.typeBadge {
  display: inline-block;
  padding: 0.4rem 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #000;
  background: #8AE8FC;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.certification {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
.releaseDate {
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 0.5rem;
  @media (min-width: $breakpoint-large) {
    font-size: 1.6rem;
  }
}
.releaseNote {
  font-size: 1.3rem;
  color: $text-color;
  font-style: italic;
  margin-top: 0.5rem;
}
</style>
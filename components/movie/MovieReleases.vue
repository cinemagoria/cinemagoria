<template>
  <div class="spacing" :class="$style.releases">
    <div :class="$style.container">
      <h2 :class="$style.title">Información de Estrenos</h2>

      <div v-if="loading" :class="$style.loading">
        <p>Cargando fechas de estrenos...</p>
      </div>

      <div v-else-if="groupedReleases.length === 0" :class="$style.noData">
        <p>No hay información de estrenos disponible para esta película.</p>
      </div>

      <div v-else :class="$style.releaseList">
        <div
          v-for="(release, index) in groupedReleases"
          :key="index"
          :class="$style.releaseCard"
        >
          <div :class="$style.countryHeader">
            <span :class="$style.flag">{{ getCountryFlag(release.country) }}</span>
            <span :class="$style.countryName">{{ getCountryName(release.country) }}</span>
          </div>

          <div :class="$style.releaseDetails">
            <div
              v-for="(date, dateIndex) in release.dates"
              :key="dateIndex"
              :class="$style.releaseItem"
            >
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
import { getMovieReleaseDates } from '~/api';

export default {
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
      countryNames: {
        'AD': 'Andorra',
        'AE': 'Emiratos Árabes Unidos',
        'AF': 'Afganistán',
        'AG': 'Antigua y Barbuda',
        'AI': 'Anguila',
        'AL': 'Albania',
        'AM': 'Armenia',
        'AO': 'Angola',
        'AQ': 'Antártida',
        'AR': 'Argentina',
        'AS': 'Samoa Americana',
        'AT': 'Austria',
        'AU': 'Australia',
        'AW': 'Aruba',
        'AX': 'Islas Åland',
        'AZ': 'Azerbaiyán',
        'BA': 'Bosnia y Herzegovina',
        'BB': 'Barbados',
        'BD': 'Bangladés',
        'BE': 'Bélgica',
        'BF': 'Burkina Faso',
        'BG': 'Bulgaria',
        'BH': 'Baréin',
        'BI': 'Burundi',
        'BJ': 'Benín',
        'BL': 'San Bartolomé',
        'BM': 'Bermudas',
        'BN': 'Brunéi',
        'BO': 'Bolivia',
        'BQ': 'Caribe Neerlandés',
        'BR': 'Brasil',
        'BS': 'Bahamas',
        'BT': 'Bután',
        'BV': 'Isla Bouvet',
        'BW': 'Botsuana',
        'BY': 'Bielorrusia',
        'BZ': 'Belice',
        'CA': 'Canadá',
        'CC': 'Islas Cocos',
        'CD': 'Congo (RDC)',
        'CF': 'República Centroafricana',
        'CG': 'Congo',
        'CH': 'Suiza',
        'CI': 'Costa de Marfil',
        'CK': 'Islas Cook',
        'CL': 'Chile',
        'CM': 'Camerún',
        'CN': 'China',
        'CO': 'Colombia',
        'CR': 'Costa Rica',
        'CU': 'Cuba',
        'CV': 'Cabo Verde',
        'CW': 'Curazao',
        'CX': 'Isla Christmas',
        'CY': 'Chipre',
        'CZ': 'Chequia',
        'DE': 'Alemania',
        'DJ': 'Yibuti',
        'DK': 'Dinamarca',
        'DM': 'Dominica',
        'DO': 'República Dominicana',
        'DZ': 'Argelia',
        'EC': 'Ecuador',
        'EE': 'Estonia',
        'EG': 'Egipto',
        'EH': 'Sáhara Occidental',
        'ER': 'Eritrea',
        'ES': 'España',
        'ET': 'Etiopía',
        'FI': 'Finlandia',
        'FJ': 'Fiyi',
        'FK': 'Islas Malvinas',
        'FM': 'Micronesia',
        'FO': 'Islas Feroe',
        'FR': 'Francia',
        'GA': 'Gabón',
        'GB': 'Reino Unido',
        'GD': 'Granada',
        'GE': 'Georgia',
        'GF': 'Guayana Francesa',
        'GG': 'Guernsey',
        'GH': 'Ghana',
        'GI': 'Gibraltar',
        'GL': 'Groenlandia',
        'GM': 'Gambia',
        'GN': 'Guinea',
        'GP': 'Guadalupe',
        'GQ': 'Guinea Ecuatorial',
        'GR': 'Grecia',
        'GS': 'Islas Georgia del Sur',
        'GT': 'Guatemala',
        'GU': 'Guam',
        'GW': 'Guinea-Bisáu',
        'GY': 'Guyana',
        'HK': 'Hong Kong',
        'HM': 'Islas Heard y McDonald',
        'HN': 'Honduras',
        'HR': 'Croacia',
        'HT': 'Haití',
        'HU': 'Hungría',
        'ID': 'Indonesia',
        'IE': 'Irlanda',
        'IL': 'Israel',
        'IM': 'Isla de Man',
        'IN': 'India',
        'IO': 'Territorio Británico del Océano Índico',
        'IQ': 'Irak',
        'IR': 'Irán',
        'IS': 'Islandia',
        'IT': 'Italia',
        'JE': 'Jersey',
        'JM': 'Jamaica',
        'JO': 'Jordania',
        'JP': 'Japón',
        'KE': 'Kenia',
        'KG': 'Kirguistán',
        'KH': 'Camboya',
        'KI': 'Kiribati',
        'KM': 'Comoras',
        'KN': 'San Cristóbal y Nieves',
        'KP': 'Corea del Norte',
        'KR': 'Corea del Sur',
        'KW': 'Kuwait',
        'KY': 'Islas Caimán',
        'KZ': 'Kazajistán',
        'LA': 'Laos',
        'LB': 'Líbano',
        'LC': 'Santa Lucía',
        'LI': 'Liechtenstein',
        'LK': 'Sri Lanka',
        'LR': 'Liberia',
        'LS': 'Lesoto',
        'LT': 'Lituania',
        'LU': 'Luxemburgo',
        'LV': 'Letonia',
        'LY': 'Libia',
        'MA': 'Marruecos',
        'MC': 'Mónaco',
        'MD': 'Moldavia',
        'ME': 'Montenegro',
        'MF': 'San Martín',
        'MG': 'Madagascar',
        'MH': 'Islas Marshall',
        'MK': 'Macedonia del Norte',
        'ML': 'Malí',
        'MM': 'Myanmar',
        'MN': 'Mongolia',
        'MO': 'Macao',
        'MP': 'Islas Marianas del Norte',
        'MQ': 'Martinica',
        'MR': 'Mauritania',
        'MS': 'Montserrat',
        'MT': 'Malta',
        'MU': 'Mauricio',
        'MV': 'Maldivas',
        'MW': 'Malaui',
        'MX': 'México',
        'MY': 'Malasia',
        'MZ': 'Mozambique',
        'NA': 'Namibia',
        'NC': 'Nueva Caledonia',
        'NE': 'Níger',
        'NF': 'Isla Norfolk',
        'NG': 'Nigeria',
        'NI': 'Nicaragua',
        'NL': 'Países Bajos',
        'NO': 'Noruega',
        'NP': 'Nepal',
        'NR': 'Nauru',
        'NU': 'Niue',
        'NZ': 'Nueva Zelanda',
        'OM': 'Omán',
        'PA': 'Panamá',
        'PE': 'Perú',
        'PF': 'Polinesia Francesa',
        'PG': 'Papúa Nueva Guinea',
        'PH': 'Filipinas',
        'PK': 'Pakistán',
        'PL': 'Polonia',
        'PM': 'San Pedro y Miquelón',
        'PN': 'Islas Pitcairn',
        'PR': 'Puerto Rico',
        'PS': 'Palestina',
        'PT': 'Portugal',
        'PW': 'Palaos',
        'PY': 'Paraguay',
        'QA': 'Catar',
        'RE': 'Reunión',
        'RO': 'Rumania',
        'RS': 'Serbia',
        'RU': 'Rusia',
        'RW': 'Ruanda',
        'SA': 'Arabia Saudita',
        'SB': 'Islas Salomón',
        'SC': 'Seychelles',
        'SD': 'Sudán',
        'SE': 'Suecia',
        'SG': 'Singapur',
        'SH': 'Santa Elena',
        'SI': 'Eslovenia',
        'SJ': 'Svalbard y Jan Mayen',
        'SK': 'Eslovaquia',
        'SL': 'Sierra Leona',
        'SM': 'San Marino',
        'SN': 'Senegal',
        'SO': 'Somalia',
        'SR': 'Surinam',
        'SS': 'Sudán del Sur',
        'ST': 'Santo Tomé y Príncipe',
        'SV': 'El Salvador',
        'SX': 'Sint Maarten',
        'SY': 'Siria',
        'SZ': 'Esuatini',
        'TC': 'Islas Turcas y Caicos',
        'TD': 'Chad',
        'TF': 'Territorios Australes Franceses',
        'TG': 'Togo',
        'TH': 'Tailandia',
        'TJ': 'Tayikistán',
        'TK': 'Tokelau',
        'TL': 'Timor Oriental',
        'TM': 'Turkmenistán',
        'TN': 'Túnez',
        'TO': 'Tonga',
        'TR': 'Turquía',
        'TT': 'Trinidad y Tobago',
        'TV': 'Tuvalu',
        'TW': 'Taiwán',
        'TZ': 'Tanzania',
        'UA': 'Ucrania',
        'UG': 'Uganda',
        'UM': 'Islas Menores de EE.UU.',
        'US': 'Estados Unidos',
        'UY': 'Uruguay',
        'UZ': 'Uzbekistán',
        'VA': 'Ciudad del Vaticano',
        'VC': 'San Vicente y las Granadinas',
        'VE': 'Venezuela',
        'VG': 'Islas Vírgenes Británicas',
        'VI': 'Islas Vírgenes de EE.UU.',
        'VN': 'Vietnam',
        'VU': 'Vanuatu',
        'WF': 'Wallis y Futuna',
        'WS': 'Samoa',
        'XK': 'Kosovo',
        'YE': 'Yemen',
        'YT': 'Mayotte',
        'ZA': 'Sudáfrica',
        'ZM': 'Zambia',
        'ZW': 'Zimbabue',
      },
      releaseTypeNames: {
        1: 'Premiere',
        2: 'Teatral (Limitada)',
        3: 'Teatral',
        4: 'Digital',
        5: 'Físico',
        6: 'TV',
      },
    };
  },

  computed: {
    groupedReleases() {
      const grouped = {};

      this.releases.forEach((release) => {
        const country = release.iso_3166_1;

        if (!grouped[country]) {
          grouped[country] = {
            country: country,
            dates: [],
          };
        }

        release.release_dates.forEach((date) => {
          grouped[country].dates.push({
            date: date.release_date,
            type: date.type,
            certification: date.certification || null,
            note: date.note || null,
          });
        });
      });

      Object.values(grouped).forEach((release) => {
        release.dates.sort((a, b) => new Date(a.date) - new Date(b.date));
      });

      const releasesArray = Object.values(grouped);
      releasesArray.sort((a, b) => {
        if (a.country === 'US') return -1;
        if (b.country === 'US') return 1;
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
        console.error('Error al cargar fechas de estreno:', error);
        this.releases = [];
      } finally {
        this.loading = false;
      }
    },

    getCountryFlag(countryCode) {
      const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map((char) => 127397 + char.charCodeAt());
      return String.fromCodePoint(...codePoints);
    },

    getCountryName(countryCode) {
      return this.countryNames[countryCode] || countryCode;
    },

    getReleaseTypeName(type) {
      return this.releaseTypeNames[type] || 'Desconocido';
    },

    formatReleaseDate(dateString) {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('es-ES', options);
    },
  },
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.releases {
  background-color: rgba(0, 0, 0, 0.307);
  border-radius: 10px;
  padding-bottom: 4rem;
}

.container {
  padding-top: 1rem;
}

.title {
  margin-bottom: 2rem;
  font-size: 1.8rem;
  color: #fff;
  letter-spacing: $letter-spacing;

  @media (min-width: $breakpoint-large) {
    font-size: 2.4rem;
  }
}

.loading,
.noData {
  padding: 3rem 0;
  text-align: center;
  font-size: 1.5rem;
  color: $text-color;
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
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(138, 232, 252, 0.3);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

.countryHeader {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.flag {
  font-size: 2.4rem;
  line-height: 1;
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
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
  background: #8ae8fc;
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
<template>
  <div class="spacing" :class="$style.releases">
    <div :class="$style.container">
      <h2 :class="$style.title">Release Information</h2>

      <div v-if="loading" :class="$style.loading">
        <Loader />
      </div>

      <div v-else-if="groupedReleases.length === 0" :class="$style.noData">
        <p>No release information available for this movie.</p>
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
      countryNames: {
        'AD': 'Andorra',
        'AE': 'United Arab Emirates',
        'AF': 'Afghanistan',
        'AG': 'Antigua and Barbuda',
        'AI': 'Anguilla',
        'AL': 'Albania',
        'AM': 'Armenia',
        'AO': 'Angola',
        'AQ': 'Antarctica',
        'AR': 'Argentina',
        'AS': 'American Samoa',
        'AT': 'Austria',
        'AU': 'Australia',
        'AW': 'Aruba',
        'AX': 'Åland Islands',
        'AZ': 'Azerbaijan',
        'BA': 'Bosnia and Herzegovina',
        'BB': 'Barbados',
        'BD': 'Bangladesh',
        'BE': 'Belgium',
        'BF': 'Burkina Faso',
        'BG': 'Bulgaria',
        'BH': 'Bahrain',
        'BI': 'Burundi',
        'BJ': 'Benin',
        'BL': 'Saint Barthélemy',
        'BM': 'Bermuda',
        'BN': 'Brunei',
        'BO': 'Bolivia',
        'BQ': 'Caribbean Netherlands',
        'BR': 'Brazil',
        'BS': 'Bahamas',
        'BT': 'Bhutan',
        'BV': 'Bouvet Island',
        'BW': 'Botswana',
        'BY': 'Belarus',
        'BZ': 'Belize',
        'CA': 'Canada',
        'CC': 'Cocos Islands',
        'CD': 'Congo (DRC)',
        'CF': 'Central African Republic',
        'CG': 'Congo (Republic)',
        'CH': 'Switzerland',
        'CI': 'Côte d\'Ivoire',
        'CK': 'Cook Islands',
        'CL': 'Chile',
        'CM': 'Cameroon',
        'CN': 'China',
        'CO': 'Colombia',
        'CR': 'Costa Rica',
        'CU': 'Cuba',
        'CV': 'Cape Verde',
        'CW': 'Curaçao',
        'CX': 'Christmas Island',
        'CY': 'Cyprus',
        'CZ': 'Czech Republic',
        'DE': 'Germany',
        'DJ': 'Djibouti',
        'DK': 'Denmark',
        'DM': 'Dominica',
        'DO': 'Dominican Republic',
        'DZ': 'Algeria',
        'EC': 'Ecuador',
        'EE': 'Estonia',
        'EG': 'Egypt',
        'EH': 'Western Sahara',
        'ER': 'Eritrea',
        'ES': 'Spain',
        'ET': 'Ethiopia',
        'FI': 'Finland',
        'FJ': 'Fiji',
        'FK': 'Falkland Islands',
        'FM': 'Micronesia',
        'FO': 'Faroe Islands',
        'FR': 'France',
        'GA': 'Gabon',
        'GB': 'United Kingdom',
        'GD': 'Grenada',
        'GE': 'Georgia',
        'GF': 'French Guiana',
        'GG': 'Guernsey',
        'GH': 'Ghana',
        'GI': 'Gibraltar',
        'GL': 'Greenland',
        'GM': 'Gambia',
        'GN': 'Guinea',
        'GP': 'Guadeloupe',
        'GQ': 'Equatorial Guinea',
        'GR': 'Greece',
        'GS': 'South Georgia',
        'GT': 'Guatemala',
        'GU': 'Guam',
        'GW': 'Guinea-Bissau',
        'GY': 'Guyana',
        'HK': 'Hong Kong',
        'HM': 'Heard Island',
        'HN': 'Honduras',
        'HR': 'Croatia',
        'HT': 'Haiti',
        'HU': 'Hungary',
        'ID': 'Indonesia',
        'IE': 'Ireland',
        'IL': 'Israel',
        'IM': 'Isle of Man',
        'IN': 'India',
        'IO': 'British Indian Ocean Territory',
        'IQ': 'Iraq',
        'IR': 'Iran',
        'IS': 'Iceland',
        'IT': 'Italy',
        'JE': 'Jersey',
        'JM': 'Jamaica',
        'JO': 'Jordan',
        'JP': 'Japan',
        'KE': 'Kenya',
        'KG': 'Kyrgyzstan',
        'KH': 'Cambodia',
        'KI': 'Kiribati',
        'KM': 'Comoros',
        'KN': 'Saint Kitts and Nevis',
        'KP': 'North Korea',
        'KR': 'South Korea',
        'KW': 'Kuwait',
        'KY': 'Cayman Islands',
        'KZ': 'Kazakhstan',
        'LA': 'Laos',
        'LB': 'Lebanon',
        'LC': 'Saint Lucia',
        'LI': 'Liechtenstein',
        'LK': 'Sri Lanka',
        'LR': 'Liberia',
        'LS': 'Lesotho',
        'LT': 'Lithuania',
        'LU': 'Luxembourg',
        'LV': 'Latvia',
        'LY': 'Libya',
        'MA': 'Morocco',
        'MC': 'Monaco',
        'MD': 'Moldova',
        'ME': 'Montenegro',
        'MF': 'Saint Martin',
        'MG': 'Madagascar',
        'MH': 'Marshall Islands',
        'MK': 'North Macedonia',
        'ML': 'Mali',
        'MM': 'Myanmar',
        'MN': 'Mongolia',
        'MO': 'Macau',
        'MP': 'Northern Mariana Islands',
        'MQ': 'Martinique',
        'MR': 'Mauritania',
        'MS': 'Montserrat',
        'MT': 'Malta',
        'MU': 'Mauritius',
        'MV': 'Maldives',
        'MW': 'Malawi',
        'MX': 'Mexico',
        'MY': 'Malaysia',
        'MZ': 'Mozambique',
        'NA': 'Namibia',
        'NC': 'New Caledonia',
        'NE': 'Niger',
        'NF': 'Norfolk Island',
        'NG': 'Nigeria',
        'NI': 'Nicaragua',
        'NL': 'Netherlands',
        'NO': 'Norway',
        'NP': 'Nepal',
        'NR': 'Nauru',
        'NU': 'Niue',
        'NZ': 'New Zealand',
        'OM': 'Oman',
        'PA': 'Panama',
        'PE': 'Peru',
        'PF': 'French Polynesia',
        'PG': 'Papua New Guinea',
        'PH': 'Philippines',
        'PK': 'Pakistan',
        'PL': 'Poland',
        'PM': 'Saint Pierre and Miquelon',
        'PN': 'Pitcairn Islands',
        'PR': 'Puerto Rico',
        'PS': 'Palestine',
        'PT': 'Portugal',
        'PW': 'Palau',
        'PY': 'Paraguay',
        'QA': 'Qatar',
        'RE': 'Réunion',
        'RO': 'Romania',
        'RS': 'Serbia',
        'RU': 'Russia',
        'RW': 'Rwanda',
        'SA': 'Saudi Arabia',
        'SB': 'Solomon Islands',
        'SC': 'Seychelles',
        'SD': 'Sudan',
        'SE': 'Sweden',
        'SG': 'Singapore',
        'SH': 'Saint Helena',
        'SI': 'Slovenia',
        'SJ': 'Svalbard and Jan Mayen',
        'SK': 'Slovakia',
        'SL': 'Sierra Leone',
        'SM': 'San Marino',
        'SN': 'Senegal',
        'SO': 'Somalia',
        'SR': 'Suriname',
        'SS': 'South Sudan',
        'ST': 'São Tomé and Príncipe',
        'SV': 'El Salvador',
        'SX': 'Sint Maarten',
        'SY': 'Syria',
        'SZ': 'Eswatini',
        'TC': 'Turks and Caicos Islands',
        'TD': 'Chad',
        'TF': 'French Southern Territories',
        'TG': 'Togo',
        'TH': 'Thailand',
        'TJ': 'Tajikistan',
        'TK': 'Tokelau',
        'TL': 'Timor-Leste',
        'TM': 'Turkmenistan',
        'TN': 'Tunisia',
        'TO': 'Tonga',
        'TR': 'Turkey',
        'TT': 'Trinidad and Tobago',
        'TV': 'Tuvalu',
        'TW': 'Taiwan',
        'TZ': 'Tanzania',
        'UA': 'Ukraine',
        'UG': 'Uganda',
        'UM': 'U.S. Minor Outlying Islands',
        'US': 'United States',
        'UY': 'Uruguay',
        'UZ': 'Uzbekistan',
        'VA': 'Vatican City',
        'VC': 'Saint Vincent and the Grenadines',
        'VE': 'Venezuela',
        'VG': 'British Virgin Islands',
        'VI': 'U.S. Virgin Islands',
        'VN': 'Vietnam',
        'VU': 'Vanuatu',
        'WF': 'Wallis and Futuna',
        'WS': 'Samoa',
        'XK': 'Kosovo',
        'YE': 'Yemen',
        'YT': 'Mayotte',
        'ZA': 'South Africa',
        'ZM': 'Zambia',
        'ZW': 'Zimbabwe',
      },
      releaseTypeNames: {
        1: 'Premiere',
        2: 'Theatrical (Limited)',
        3: 'Theatrical',
        4: 'Digital',
        5: 'Physical',
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
      return this.countryNames[countryCode] || countryCode;
    },
    getReleaseTypeName(type) {
      return this.releaseTypeNames[type] || 'Unknown';
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
      return date.toLocaleDateString('en-US', options);
    },
  },
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;
.releases {
  background-color: rgba(0, 0, 0, 0.307);
  border-radius: 15px;;
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
  background: rgba(0, 0, 0, 0.307);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
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
    border-bottom: 1px solid rgba(0, 0, 0, 0.307);
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
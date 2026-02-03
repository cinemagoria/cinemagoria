<template>
  <div :class="$style.awardsContainer">
    <div v-if="loading" :class="$style.loaderContainer">
        <div class="loader"></div> <!-- Assuming global loader style or I'll add one -->
    </div>
    
    <div v-else-if="isEmpty" :class="$style.noAwards">
        <p>No se encontraron premios.</p>
    </div>

    <div v-else>
        <!-- Oscars Section -->
        <div v-if="oscars.length" :class="$style.awardSection">
            <h3 :class="$style.awardLogo">
                <span :class="$style.goldText">OSCARS</span> PREMIOS DE LA ACADEMIA
            </h3>
            <div :class="$style.tableWrapper">
                <table :class="$style.awardsTable">
                    <thead>
                        <tr>
                            <th :class="$style.yearHeader">Año</th>
                            <th>Categoría</th>
                            <th v-if="type !== 'person'">Nominación</th>
                            <th v-if="type === 'person'">Película</th>
                            <th :class="$style.resultHeader">Resultado</th>
                        </tr>
                    </thead>
                <tbody>
                    <tr v-for="award in oscars" :key="award.id" :class="{ [$style.winnerRow]: award.won }">
                        <td :class="$style.yearCell">{{ award.year }}</td>
                        <td>{{ translateCategory(award.category) }}</td>
                        <td v-if="type !== 'person'">
                            <span 
                                :class="$style.clickableName"
                                @click="searchAndNavigateToPerson(award.nominee_name)"
                            >
                                {{ award.nominee_name }}
                            </span>
                        </td>
                        <td v-if="type === 'person'">{{ award.film_title }}</td>
                        <td>
                            <span v-if="award.won" :class="$style.winnerBadge">GANÓ</span>
                            <span v-else :class="$style.nomineeBadge">Nominación</span>
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>
        </div>

        <!-- Golden Globes Section -->
        <div v-if="goldenGlobes.length" :class="$style.awardSection">
            <h3 :class="$style.awardLogo">
                <span :class="$style.goldText">GLOBOS DE ORO</span>
            </h3>
            <div :class="$style.tableWrapper">
                <table :class="$style.awardsTable">
                    <thead>
                        <tr>
                            <th :class="$style.yearHeader">Año</th>
                            <th>Categoría</th>
                            <th v-if="type !== 'person'">Nominación</th>
                            <th v-if="type === 'person'">Película</th>
                            <th :class="$style.resultHeader">Resultado</th>
                        </tr>
                    </thead>
                <tbody>
                    <tr v-for="award in goldenGlobes" :key="award.id" :class="{ [$style.winnerRow]: award.won }">
                        <td :class="$style.yearCell">{{ award.year_award }}</td>
                        <td>{{ translateCategory(award.category) }}</td>
                        <td v-if="type !== 'person'">
                            <span 
                                :class="$style.clickableName"
                                @click="searchAndNavigateToPerson(award.nominee)"
                            >
                                {{ award.nominee }}
                            </span>
                        </td>
                        <td v-if="type === 'person'">{{ award.film }}</td>
                        <td>
                            <span v-if="award.won" :class="$style.winnerBadge">GANÓ</span>
                            <span v-else :class="$style.nomineeBadge">Nominación</span>
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tmdbId: { type: Number, default: null },
  title: { type: String, default: null }, 
  name: { type: String, default: null },  
  type: { type: String, default: 'movie' },
  oscarsProp: { type: Array, default: null },
  goldenGlobesProp: { type: Array, default: null }
});

const internalLoading = ref(true);
const internalOscars = ref([]);
const internalGoldenGlobes = ref([]);

const oscars = computed(() => {
    const data = props.oscarsProp || internalOscars.value;
    return [...data].sort((a, b) => b.year - a.year);
});
const goldenGlobes = computed(() => {
    const data = props.goldenGlobesProp || internalGoldenGlobes.value;
    return [...data].sort((a, b) => b.year_award - a.year_award);
});

const loading = computed(() => {
    if (props.oscarsProp || props.goldenGlobesProp) return false;
    return internalLoading.value;
});

const fetchAwards = async () => {
    if (props.oscarsProp || props.goldenGlobesProp) {
        return;
    }

    internalLoading.value = true;
    try {
        const data = await $fetch('/api/awards', {
            params: {
                tmdbId: props.tmdbId,
                name: props.name,
                title: props.title,
                type: props.type
            }
        });
        internalOscars.value = data.oscars || [];
        internalGoldenGlobes.value = data.goldenGlobes || [];
    } catch (e) {
        console.error("Failed to fetch awards", e);
    } finally {
        internalLoading.value = false;
    }
};

onMounted(() => {
    fetchAwards();
});

const isEmpty = computed(() => oscars.value.length === 0 && goldenGlobes.value.length === 0);

const router = useRouter();
const config = useRuntimeConfig();
const apiKey = config.public.apiKey;

const searchAndNavigateToPerson = async (personName) => {
  if (!personName) return;
  
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(personName)}&language=es-ES`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const bestMatch = data.results[0];
        router.push(`/person/${bestMatch.id}`);
      }
    }
  } catch (error) {
    console.error('Error searching for person:', error);
  }
};

const translateCategory = (category) => {
  if (!category) return '';
  
  const translations = {
    'Best Picture': 'Mejor Película',
    'Best Actor': 'Mejor Actor',
    'Best Actress': 'Mejor Actriz',
    'Best Supporting Actor': 'Mejor Actor de Reparto',
    'Best Supporting Actress': 'Mejor Actriz de Reparto',
    'Best Director': 'Mejor Director',
    'Best Adapted Screenplay': 'Mejor Guion Adaptado',
    'Best Original Screenplay': 'Mejor Guion Original',
    'Best Screenplay': 'Mejor Guion',
    'Best Score': 'Mejor Banda Sonora',
    'Best Original Score': 'Mejor Banda Sonora Original',
    'Best Production Design': 'Mejor Diseño de Producción',
    'Best Production Design (Color)': 'Mejor Diseño de Producción',
    'Best Cinematography': 'Mejor Fotografía',
    'Best Cinematography (Color)': 'Mejor Fotografía',
    'Best Film Editing': 'Mejor Montaje',
    'Best Sound Mixing': 'Mejor Mezcla de Sonido',
    'Best Sound Editing': 'Mejor Edición de Sonido',
    'Best Makeup and Hairstyling': 'Mejor Maquillaje y Peluquería',
    'Best Costume Design': 'Mejor Diseño de Vestuario',
    'Best Costume Design (Color)': 'Mejor Diseño de Vestuario',
    'Best Visual Effects': 'Mejores Efectos Visuales',
    'Best Animated Feature': 'Mejor Película de Animación',
    'Best Foreign Language Film': 'Mejor Película Extranjera',
    'Best Documentary Feature': 'Mejor Documental',
    'Best Original Song': 'Mejor Canción Original',

    'Best Performance by an Actor in a Motion Picture - Drama': 'Mejor Actor - Drama',
    'Best Performance by an Actress in a Motion Picture - Drama': 'Mejor Actriz - Drama',
    'Best Performance by an Actor in a Motion Picture - Musical or Comedy': 'Mejor Actor - Musical o Comedia',
    'Best Performance by an Actress in a Motion Picture - Musical or Comedy': 'Mejor Actriz - Musical o Comedia',
    'Best Performance by an Actor in a Supporting Role in any Motion Picture': 'Mejor Actor de Reparto',
    'Best Performance by an Actress in a Supporting Role in any Motion Picture': 'Mejor Actriz de Reparto',
    'Best Director - Motion Picture': 'Mejor Director',
    'Best Screenplay - Motion Picture': 'Mejor Guion',
    'Best Original Score - Motion Picture': 'Mejor Banda Sonora Original',
    'Best Original Song - Motion Picture': 'Mejor Canción Original',
    'Best Motion Picture - Drama': 'Mejor Película - Drama',
    'Best Motion Picture - Musical or Comedy': 'Mejor Película - Musical o Comedia',
    'Best Motion Picture - Animated': 'Mejor Película de Animación',
    'Best Motion Picture - Foreign Language': 'Mejor Película en Lengua Extranjera',
    'Best Actor - Motion Picture Drama': 'Mejor Actor - Drama',
    'Best Motion Picture - Drama': 'Mejor Película - Drama',

    'Best Television Series - Drama': 'Mejor Serie de Televisión - Drama',
    'Best Television Series - Musical or Comedy': 'Mejor Serie de Televisión - Musical o Comedia',
    'Best Mini-Series or Motion Picture Made for Television': 'Mejor Miniserie o Película para Televisión',
    'Best Performance by an Actor In A Television Series - Drama': 'Mejor Actor en Serie de Televisión - Drama',
    'Best Performance by an Actress In A Television Series - Drama': 'Mejor Actriz en Serie de Televisión - Drama',
    'Best Performance by an Actor In A Television Series - Musical or Comedy': 'Mejor Actor en Serie de Televisión - Musical o Comedia',
    'Best Performance by an Actress In A Television Series - Musical or Comedy': 'Mejor Actriz en Serie de Televisión - Musical o Comedia',
    'Best Performance by an Actor in a Mini-Series or Motion Picture Made for Television': 'Mejor Actor en Miniserie o Película para TV',
    'Best Performance by an Actress in a Mini-Series or Motion Picture Made for Television': 'Mejor Actriz en Miniserie o Película para TV',
    'Best Performance by an Actor in a Supporting Role in a Series, Mini-Series or Motion Picture Made for Television': 'Mejor Actor de Reparto en Serie, Miniserie o Película para TV',
    'Best Performance by an Actress in a Supporting Role in a Series, Mini-Series or Motion Picture Made for Television': 'Mejor Actriz de Reparto en Serie, Miniserie o Película para TV',
    'Best Performance by an Actor in a Supporting Role in a Series, Limited Series or Motion Picture Made for Television': 'Mejor Actor de Reparto en Serie, Miniserie o Película para TV',
    'Best Performance by an Actress in a Supporting Role in a Series, Limited Series or Motion Picture Made for Television': 'Mejor Actriz de Reparto en Serie, Miniserie o Película para TV',
  };

  return translations[category] || category;
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.awardsContainer {
    padding: 2rem 4rem;
    min-height: 200px;
}

.loaderContainer {
    display: flex;
    justify-content: center;
    padding: 2rem;
}

.noAwards {
    text-align: center;
    color: #888;
    font-size: 1.4rem;
    padding: 2rem;
}

.awardSection {
    margin-bottom: 3rem;
}

.awardLogo {
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
    color: #fff;
    font-weight: 700;
    letter-spacing: 1px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 0.5rem;
}

.goldText {
    color: #8AE8FC;
}

.clickableName {
    color: #8AE8FC;
    cursor: pointer;
    text-decoration: underline;
    text-decoration-color: rgba(138, 232, 252, 0.4);
    transition: all 0.2s ease;
    
    &:hover {
        color: #fff;
        text-decoration-color: #8AE8FC;
    }
}

.tableWrapper {
    overflow-x: auto;
    border-radius: 8px;
    background: rgba(0,0,0,0.2);
}

.awardsTable {
    width: 100%;
    border-collapse: collapse;
    font-size: 1.4rem;
    color: #ddd;

    th {
        text-align: left;
        padding: 1rem;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        color: #8AE8FC;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 1.2rem;
    }

    td {
        padding: 1rem;
        border-bottom: 1px solid rgba(255,255,255,0.05);
    }

    tr:last-child td {
        border-bottom: none;
    }
}

.winnerRow {
    background: linear-gradient(90deg, rgba(255, 215, 0, 0.1) 0%, transparent 100%);
    
    td {
        color: #fff;
    }
}

.yearCell {
    font-family: monospace;
    color: #aaa;
}

.winnerBadge {
    background-color: #FFD700;
    color: #000;
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 800;
    text-transform: uppercase;
}

.nomineeBadge {
    color: #666;
    font-size: 1rem;
    text-transform: uppercase;
}

.yearHeader {
    width: 80px;
}

.resultHeader {
    width: 100px;
}
</style>

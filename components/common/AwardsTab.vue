<template>
  <div :class="$style.awardsContainer">
    <div v-if="loading" :class="$style.loaderContainer">
        <div class="loader"></div>
    </div>
    
    <div v-else-if="isEmpty" :class="$style.noAwards">
        <p>No awards found.</p>
    </div>

    <div v-else>
        <!-- Oscars Section -->
        <div v-if="oscars.length" :class="$style.awardSection">
            <h3 :class="$style.awardLogo">
                <span :class="$style.goldText">OSCARS</span> ACADEMY AWARDS
            </h3>
            <div :class="$style.tableWrapper">
                <table :class="$style.awardsTable">
                    <thead>
                        <tr>
                            <th :class="$style.yearHeader">Year</th>
                            <th>Category</th>
                            <th v-if="type !== 'person'">Nominee</th>
                            <th v-if="type === 'person'">Film</th>
                            <th :class="$style.resultHeader">Result</th>
                        </tr>
                    </thead>
                <tbody>
                    <tr v-for="award in oscars" :key="award.id" :class="{ [$style.winnerRow]: award.won }">
                        <td :class="$style.yearCell">{{ award.year }}</td>
                        <td>{{ award.category }}</td>
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
                            <span v-if="award.won" :class="$style.winnerBadge">WINNER</span>
                            <span v-else :class="$style.nomineeBadge">Nominee</span>
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>
        </div>

        <!-- Golden Globes Section -->
        <div v-if="goldenGlobes.length" :class="$style.awardSection">
            <h3 :class="$style.awardLogo">
                <span :class="$style.goldText">GOLDEN GLOBES</span> AWARDS
            </h3>
            <div :class="$style.tableWrapper">
                <table :class="$style.awardsTable">
                    <thead>
                        <tr>
                            <th :class="$style.yearHeader">Year</th>
                            <th>Category</th>
                            <th v-if="type !== 'person'">Nominee</th>
                            <th v-if="type === 'person'">Film</th>
                            <th :class="$style.resultHeader">Result</th>
                        </tr>
                    </thead>
                <tbody>
                    <tr v-for="award in goldenGlobes" :key="award.id" :class="{ [$style.winnerRow]: award.won }">
                        <td :class="$style.yearCell">{{ award.year_award }}</td>
                        <td>{{ award.category }}</td>
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
                            <span v-if="award.won" :class="$style.winnerBadge">WINNER</span>
                            <span v-else :class="$style.nomineeBadge">Nominee</span>
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>
        </div>

        <!-- Palme d'Or Section -->
        <div v-if="palme.length" :class="$style.awardSection">
            <h3 :class="$style.awardLogo">
                <span :class="$style.goldText">CANNES</span> PALME D'OR
            </h3>
            <div :class="$style.tableWrapper">
                <table :class="$style.awardsTable">
                    <thead>
                        <tr>
                            <th :class="$style.yearHeader">Year</th>
                            <th>Award</th>
                            <th v-if="type !== 'person'">Director</th>
                            <th v-if="type === 'person'">Film</th>
                            <th :class="$style.resultHeader">Result</th>
                        </tr>
                    </thead>
                <tbody>
                    <tr v-for="award in palme" :key="award.id" :class="$style.winnerRow">
                        <td :class="$style.yearCell">{{ award.year }}</td>
                        <td>Palme d'Or</td>
                        <td v-if="type !== 'person'">
                             <span 
                                :class="$style.clickableName"
                                @click="searchAndNavigateToPerson(award.director)"
                            >
                                {{ award.director }}
                            </span>
                        </td>
                        <td v-if="type === 'person'">{{ award.film_title }}</td>
                        <td><span :class="$style.winnerBadge">WINNER</span></td>
                    </tr>
                </tbody>
                </table>
            </div>
        </div>

        <!-- Golden Lion Section -->
        <div v-if="goldenLion.length" :class="$style.awardSection">
            <h3 :class="$style.awardLogo">
                <span :class="$style.goldText">VENICE</span> GOLDEN LION
            </h3>
            <div :class="$style.tableWrapper">
                <table :class="$style.awardsTable">
                    <thead>
                        <tr>
                            <th :class="$style.yearHeader">Year</th>
                            <th>Award</th>
                            <th v-if="type !== 'person'">Director</th>
                            <th v-if="type === 'person'">Film</th>
                            <th :class="$style.resultHeader">Result</th>
                        </tr>
                    </thead>
                <tbody>
                    <tr v-for="award in goldenLion" :key="award.id" :class="$style.winnerRow">
                        <td :class="$style.yearCell">{{ award.year }}</td>
                        <td>Golden Lion</td>
                         <td v-if="type !== 'person'">
                             <span 
                                :class="$style.clickableName"
                                @click="searchAndNavigateToPerson(award.director)"
                            >
                                {{ award.director }}
                            </span>
                        </td>
                        <td v-if="type === 'person'">{{ award.film_title }}</td>
                        <td><span :class="$style.winnerBadge">WINNER</span></td>
                    </tr>
                </tbody>
                </table>
            </div>
        </div>

        <!-- Golden Bear Section -->
        <div v-if="goldenBear.length" :class="$style.awardSection">
            <h3 :class="$style.awardLogo">
                <span :class="$style.goldText">BERLIN</span> GOLDEN BEAR
            </h3>
            <div :class="$style.tableWrapper">
                <table :class="$style.awardsTable">
                    <thead>
                        <tr>
                            <th :class="$style.yearHeader">Year</th>
                            <th>Award</th>
                            <th v-if="type !== 'person'">Director</th>
                            <th v-if="type === 'person'">Film</th>
                            <th :class="$style.resultHeader">Result</th>
                        </tr>
                    </thead>
                <tbody>
                    <tr v-for="award in goldenBear" :key="award.id" :class="$style.winnerRow">
                        <td :class="$style.yearCell">{{ award.year }}</td>
                        <td>Golden Bear</td>
                         <td v-if="type !== 'person'">
                             <span 
                                :class="$style.clickableName"
                                @click="searchAndNavigateToPerson(award.director)"
                            >
                                {{ award.director }}
                            </span>
                        </td>
                        <td v-if="type === 'person'">{{ award.film_title }}</td>
                        <td><span :class="$style.winnerBadge">WINNER</span></td>
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
  goldenGlobesProp: { type: Array, default: null },
  palme: { type: Array, default: null },
  goldenLion: { type: Array, default: null },
  goldenBear: { type: Array, default: null }
});

const internalLoading = ref(true);
const internalOscars = ref([]);
const internalGoldenGlobes = ref([]);
const internalPalme = ref([]);
const internalLion = ref([]);
const internalBear = ref([]);

const oscars = computed(() => {
    const data = props.oscarsProp || internalOscars.value;
    return [...data].sort((a, b) => b.year - a.year);
});
const goldenGlobes = computed(() => {
    const data = props.goldenGlobesProp || internalGoldenGlobes.value;
    return [...data].sort((a, b) => b.year_award - a.year_award);
});
const palme = computed(() => {
    const data = props.palme || internalPalme.value;
    return [...data].sort((a, b) => b.year - a.year);
});
const goldenLion = computed(() => {
    const data = props.goldenLion || internalLion.value;
    return [...data].sort((a, b) => b.year - a.year);
});
const goldenBear = computed(() => {
    const data = props.goldenBear || internalBear.value;
    return [...data].sort((a, b) => b.year - a.year);
});


const loading = computed(() => {
    if (props.oscarsProp || props.goldenGlobesProp || props.palme || props.goldenLion || props.goldenBear) return false;
    return internalLoading.value;
});

const fetchAwards = async () => {
    if (props.oscarsProp || props.goldenGlobesProp || props.palme || props.goldenLion || props.goldenBear) {
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
        internalPalme.value = data.palme || [];
        internalLion.value = data.goldenLion || [];
        internalBear.value = data.goldenBear || [];
        
    } catch (e) {
        console.error("Failed to fetch awards", e);
    } finally {
        internalLoading.value = false;
    }
};


onMounted(() => {
    fetchAwards();
});

const isEmpty = computed(() => 
    oscars.value.length === 0 && 
    goldenGlobes.value.length === 0 &&
    palme.value.length === 0 &&
    goldenLion.value.length === 0 &&
    goldenBear.value.length === 0
);

const router = useRouter();
const config = useRuntimeConfig();
const apiKey = config.public.apiKey;

const searchAndNavigateToPerson = async (personName) => {
  if (!personName) return;
  
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(personName)}&language=en-US`
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

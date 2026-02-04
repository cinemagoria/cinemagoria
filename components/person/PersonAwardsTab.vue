<template>
  <div :class="$style.awardsContainer">
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
                        <th>Film/Series</th>
                        <th :class="$style.resultHeader">Result</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="award in sortedOscars" :key="award.id" :class="{ [$style.winnerRow]: award.won }">
                        <td :class="$style.yearCell">{{ award.year }}</td>
                        <td>{{ award.category }}</td>
                        <td>
                            <span 
                                :class="$style.clickableName"
                                @click="searchAndNavigateToFilm(award.film_title, award.category)"
                            >
                                {{ award.film_title }}
                            </span>
                        </td>
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
            <span :class="$style.goldText">GOLDEN GLOBES</span>
        </h3>
        <div :class="$style.tableWrapper">
            <table :class="$style.awardsTable">
                <thead>
                    <tr>
                        <th :class="$style.yearHeader">Year</th>
                        <th>Category</th>
                        <th>Film/Series</th>
                        <th :class="$style.resultHeader">Result</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="award in sortedGoldenGlobes" :key="award.id" :class="{ [$style.winnerRow]: award.won }">
                        <td :class="$style.yearCell">{{ award.year_award }}</td>
                        <td>{{ award.category }}</td>
                        <td>
                            <span 
                                :class="$style.clickableName"
                                @click="searchAndNavigateToFilm(award.film, award.category)"
                            >
                                {{ award.film }}
                            </span>
                        </td>
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
                        <th>Film</th>
                        <th :class="$style.resultHeader">Result</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="award in sortedPalme" :key="award.id" :class="$style.winnerRow">
                        <td :class="$style.yearCell">{{ award.year }}</td>
                        <td>Palme d'Or</td>
                        <td>{{ award.film_title }}</td>
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
                        <th>Film</th>
                        <th :class="$style.resultHeader">Result</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="award in sortedGoldenLion" :key="award.id" :class="$style.winnerRow">
                        <td :class="$style.yearCell">{{ award.year }}</td>
                        <td>Golden Lion</td>
                         <td>{{ award.film_title }}</td>
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
                        <th>Film</th>
                        <th :class="$style.resultHeader">Result</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="award in sortedGoldenBear" :key="award.id" :class="$style.winnerRow">
                        <td :class="$style.yearCell">{{ award.year }}</td>
                        <td>Golden Bear</td>
                         <td>{{ award.film_title }}</td>
                        <td><span :class="$style.winnerBadge">WINNER</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  oscars: { type: Array, default: () => [] },
  goldenGlobes: { type: Array, default: () => [] },
  palme: { type: Array, default: () => [] },
  goldenLion: { type: Array, default: () => [] },
  goldenBear: { type: Array, default: () => [] }
});

const sortedOscars = computed(() => [...props.oscars].sort((a, b) => b.year - a.year));
const sortedGoldenGlobes = computed(() => [...props.goldenGlobes].sort((a, b) => b.year_award - a.year_award));
const sortedPalme = computed(() => [...props.palme].sort((a, b) => b.year - a.year));
const sortedGoldenLion = computed(() => [...props.goldenLion].sort((a, b) => b.year - a.year));
const sortedGoldenBear = computed(() => [...props.goldenBear].sort((a, b) => b.year - a.year));

const router = useRouter();
const config = useRuntimeConfig();
const apiKey = config.public.apiKey;

const searchAndNavigateToFilm = async (filmTitle, category = '') => {
  if (!filmTitle) return;
  
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(filmTitle)}&language=en-US`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        let bestMatch;
        
        const catLower = category.toLowerCase();
        let preferType = null;
        if (catLower.includes('television') || catLower.includes('series') || catLower.includes('tv') || catLower.includes('miniseries')) {
            preferType = 'tv';
        } else if (catLower.includes('motion picture') || catLower.includes('film')) {
            preferType = 'movie';
        }

        if (preferType) {
            bestMatch = data.results.find(item => {
                const title = item.title || item.name;
                return title && title.toLowerCase() === filmTitle.toLowerCase() && item.media_type === preferType;
            });
        }
        
        if (!bestMatch) {
            bestMatch = data.results.find(item => {
                const title = item.title || item.name;
                return title && title.toLowerCase() === filmTitle.toLowerCase();
            });
        }
        
        if (!bestMatch) {
            bestMatch = data.results[0];
        }

        if (bestMatch.media_type === 'movie') {
            router.push(`/movie/${bestMatch.id}`);
        } else if (bestMatch.media_type === 'tv') {
            router.push(`/tv/${bestMatch.id}`);
        }
      }
    }
  } catch (error) {
    console.error('Error searching for film:', error);
  }
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.awardsContainer {
    padding: 2rem 0;
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

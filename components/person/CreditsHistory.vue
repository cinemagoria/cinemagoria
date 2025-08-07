<template>
  <div class="spacing">
    <div :class="$style.head">
      <div :class="$style.filter">
        <label for="credits_category">
          Rol
        </label>

        <select
          id="credits_category"
          v-model="active_category"
          :class="$style.select"
          :disabled="!categories.length || categories.length === 1"
          @change="filterCredits">
          <option value="all">
            Todos
          </option>

          <option
            v-for="(category) in categories"
            :key="`credit-filter-${category.toLowerCase()}`"
            :value="category.toLowerCase()">
            {{ category }}
          </option>
        </select>
      </div>

      <div :class="$style.filter">
        <label for="credits_media">
          Medio
        </label>

        <select
          id="credits_media"
          v-model="active_media"
          :class="$style.select"
          @change="getCredits">
          <option value="combined_credits">
            Todos
          </option>
          <option value="movie_credits">
            Películas
          </option>
          <option value="tv_credits">
            Series de TV
          </option>
        </select>
      </div>
    </div>

    <div
      v-for="category in active_credits"
      :key="`credits-${category.name.toLowerCase()}`"
      :class="$style.category">
      <h2 :class="$style.title">
        {{ category.name }}
      </h2>

      <table>
        <tbody>
          <CreditsHistoryGroup
            v-for="group in category.groups"
            :key="`credit-${category.name.toLowerCase()}-${group.year}`"
            :group="group" />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { getCredits } from '~/api';
import CreditsHistoryGroup from '~/components/person/CreditsHistoryGroup';

export default {
  components: {
    CreditsHistoryGroup,
  },

  props: {
    credits: {
      type: Object,
      required: true,
    },
  },

  data () {
    return {
      active_media: 'combined_credits',
      active_category: 'all',
      categories: [],
      active_credits: null,
      combined_credits: [],
      movie_credits: [],
      tv_credits: [],
    };
  },

  created () {
    const cast = this.handleCast(this.credits.cast);
    const crew = this.handleCrew(this.credits.crew);

    if (cast) this.$data[this.active_media].push({ name: 'Acting', groups: cast });
    if (crew) this.$data[this.active_media] = [...this.$data[this.active_media], ...crew];

    this.active_credits = this.$data[this.active_media];

    this.categories = this.getCategories();
  },

  methods: {
    handleCast (items) {
      if (!items || !items.length) return;

      let groups = this.groupItems(items);

      const blankGroup = groups.find(group => group.year === '');

      if (blankGroup) groups = groups.filter(group => group.year !== '');

      this.sortGroups(groups);

      if (blankGroup) groups.unshift(blankGroup);

      groups.forEach(group => this.sortCredits(group.credits));

      return groups;
    },

    handleCrew (items) {
      if (!items || !items.length) return;

      const categories = this.createCategories(items);

      categories.forEach((category) => {
        let groups = this.groupItems(category.groups);

        const blankGroup = groups.find(group => group.year === '');

        if (blankGroup) groups = groups.filter(group => group.year !== '');

        this.sortGroups(groups);

        if (blankGroup) groups.unshift(blankGroup);

        groups.forEach(group => this.sortCredits(group.credits));

        category.groups = groups;
      });

      return categories;
    },

    getCategories () {
      return this.active_credits.map(category => category.name);
    },

    getCredits () {
      const media = this.active_media;
      if (this.$data[media] && this.$data[media].length) {
        this.active_credits = this.$data[media];
        this.active_category = 'all';
        this.categories = this.getCategories();
      } else {
        getCredits(this.$route.params.id, media).then((response) => {
          const cast = this.handleCast(response.cast);
          const crew = this.handleCrew(response.crew);

          if (cast) this.$data[media].push({ name: 'Acting', groups: cast });
          if (crew) this.$data[media] = [...this.$data[media], ...crew];

          this.active_credits = this.$data[media];
          this.active_category = 'all';
          this.categories = this.getCategories();
        });
      }
    },

    filterCredits () {
      if (this.active_category === 'all') {
        this.active_credits = this.$data[this.active_media];
      } else {
        this.active_credits = this.$data[this.active_media].filter(category => category.name.toLowerCase() === this.active_category);
      }
    },

    createCategories (items) {
      const categories = [];

      items.forEach((item) => {
        const exists = categories.find(category => category.name === item.department);

        if (exists) {
          exists.groups.push(item);
        } else {
          categories.push({
            name: item.department,
            groups: [item],
          });
        }
      });

      return categories;
    },

    groupItems (items) {
      return items.reduce(function (arr, current) {
        const date = current.release_date ? current.release_date : current.first_air_date;
        const year = date ? date.split('-')[0] : '';
        const exists = arr.find(item => item.year === year);

        if (exists) {
          exists.credits.push(current);
        } else {
          arr.push({
            year,
            credits: [current],
          });
        }

        return arr;
      }, []);
    },

    sortGroups (items) {
      return items.sort((a, b) => a.year > b.year ? -1 : 1);
    },

    sortCredits (items) {
      return items.sort((a, b) => {
        const aDate = a.release_date ? a.release_date : a.first_air_date;
        const bDate = b.release_date ? b.release_date : b.first_air_date;

        if (aDate > bDate) {
          return -1;
        } else if (aDate < bDate) {
          return 1;
        }

        return 0;
      });
    },
  },
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.head {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filter {
  margin-right: 3rem;

  label {
    margin-right: 1rem;
    font-size: 1.2rem;
    font-weight: 500;
    letter-spacing: $letter-spacing;

    @media (min-width: $breakpoint-large) {
      font-size: 1.4rem;
    }
  }
}

.select {
  appearance: none;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.8rem 3rem 0.8rem 1.2rem;
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  &:hover, &:focus {
    border-color: #aaa;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    outline: none;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #f5f5f5;
  }
}

.category {
  margin-bottom: 3rem;
}

.title {
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  letter-spacing: $letter-spacing;

  @media (min-width: $breakpoint-large) {
    margin-bottom: 2rem;
    font-size: 2.4rem;
  }
}
</style>
<template>
  <div class="spacing" :class="$style.info">
    <div :class="$style.left">
      <div :class="$style.poster">
        <img
          v-if="poster"
          v-lazyload="poster"
          class="lazyload"
          :alt="name">

        <span v-else>
          <!-- eslint-disable-next-line -->
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd" fill="#999"><path d="M24 22h-24v-20h24v20zm-1-19h-22v18h22v-18zm-1 16h-19l4-7.492 3 3.048 5.013-7.556 6.987 12zm-11.848-2.865l-2.91-2.956-2.574 4.821h15.593l-5.303-9.108-4.806 7.243zm-4.652-11.135c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5zm0 1c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5z"/></svg>
        </span>
      </div>
    </div>

    <div :class="$style.right">
      <div
        v-if="item.overview"
        :class="$style.overview">
        <h2 :class="$style.title">
          Storyline
        </h2>

        <div v-html="item.overview" />
      </div>

      <div :class="$style.stats">
        <ul class="nolist">
          <li v-if="showOriginalTitle">
            <div :class="$style.label">
              Original Title
            </div>

            <div :class="$style.value">
              {{ item.original_name }}
            </div>
          </li>
          <li v-if="item.first_air_date">
            <div :class="$style.label">
              First Aired
            </div>

            <div :class="$style.value">
              {{ item.first_air_date | fullDate }}
            </div>
          </li>
          <li v-if="item.last_air_date">
            <div :class="$style.label">
              Last Aired
            </div>

            <div :class="$style.value">
              {{ item.last_air_date | fullDate }}
            </div>
          </li>
          <li v-if="item.episode_run_time && item.episode_run_time.length">
            <div :class="$style.label">
              Runtime
            </div>

            <div :class="$style.value">
              {{ formatRunTime(item.episode_run_time) }}
            </div>
          </li>
          <li v-if="creators">
            <div :class="$style.label">
              Creator
            </div>

            <div
              :class="$style.value"
              v-html="creators" />
          </li>
          <li v-if="item.genres && item.genres.length">
            <div :class="$style.label">
              Genre
            </div>

            <div
              :class="$style.value"
              v-html="formatGenres(item.genres)" />
          </li>
          <li v-if="item.number_of_seasons">
            <div :class="$style.label">
              Seasons
            </div>

            <div :class="$style.value">
              {{ item.number_of_seasons }}
            </div>
          </li>
          <li v-if="item.number_of_episodes">
            <div :class="$style.label">
              Episodes
            </div>

            <div :class="$style.value">
              {{ item.number_of_episodes }}
            </div>
          </li>
          <li v-if="item.status">
            <div :class="$style.label">
              Status
            </div>

            <div :class="$style.value">
              {{ item.status }}
            </div>
          </li>
          <li v-if="item.original_language">
            <div :class="$style.label">
              Language
            </div>

            <div :class="$style.value">
              {{ item.original_language | fullLang }}
            </div>
          </li>

          <li v-if="providers && providers.length">
            <div :class="$style.label">
              Watch On
            </div>
            <div :class="$style.value">
              {{ providers.join(', ') }}
            </div>
          </li>

        </ul>
      </div>

      <div :class="$style.external">
        <ExternalLinks
          :links="item.external_ids" />
      </div>
      <div v-if="reviews && reviews.length" class="reviews-container">
        <br>
        <strong style="letter-spacing: 2px; font-size: 16px;" class="label">Reviews ({{ reviewCount }})<br><span style="cursor: pointer; letter-spacing: 2px; font-size: 15px;  color: #8AE8FC;" @click="toggleFullReviews"> WARNING: MAY CONTAIN SPOILERS</span></strong>
        <ul class="nolist" v-show="showFullReviews">
            <li v-for="(review, index) in reviews" :key="index" style="margin-top: 3rem;">
                <p v-if="showFullReviews || (review.authorName && review.authorRating !== null)">
                    <strong style="letter-spacing: 2px; font-size: 14px;">Written By:</strong> <a style="cursor: pointer; letter-spacing: 2px; font-size: 14px;" @click="redirectToUrl(review.url)">{{ review.authorName }}</a><br>
                    <strong style="letter-spacing: 2px; font-size: 14px;">Date:</strong> <span style="letter-spacing: 2px; font-size: 14px;">{{ formatCreatedAt(review.createdAt) }}</span><br>
                    <strong style="letter-spacing: 2px; font-size: 14px;">Rating:</strong> <span style="letter-spacing: 2px; font-size: 14px;">{{ review.authorRating }}</span><br>
                    <span style="font-size: 1.5rem; color: #B1BABF; font-style: italic;" v-html="formatContent(review.content, index, review.showFullContent)"></span><br>
                    <span v-if="!review.showFullContent && review.content.split(' ').length > 200" style="cursor: pointer; color: #8AE8FC; letter-spacing: 2px; font-size: 12px;" @click="toggleReadMore(review)">..[Read More].</span>
                </p>
            </li>
        </ul>
    </div>
    </div>
  </div>
</template>

<script>
import { apiImgUrl } from '~/api';
import { getTVShowProviders } from '~/api'; 
import { getTvShowReviews } from '~/api'; 
import { name, creators } from '~/mixins/Details';
import ExternalLinks from '~/components/ExternalLinks';

export default {
  components: {
    ExternalLinks,
  },

  mixins: [
    name,
    creators,
  ],

  props: {
    item: {
      type: Object,
      required: true,
    },
    reviewsProp: Array,
    providers: {
      type: Array,
      default: () => [],
    }
  },

  data() {
    return {
      showFullReviews: false,
      reviews: [], 
    };
  },

  computed: {
    reviewCount() {
      return this.reviews.length;
    },
    poster () {
      if (this.item.poster_path) {
        return `${apiImgUrl}/w370_and_h556_bestv2${this.item.poster_path}`;
      } else {
        return false;
      }
    },
    showOriginalTitle() {
      const localizedTitle = this.item.name;
      const originalTitle = this.item.original_name;
      
      return localizedTitle && originalTitle && localizedTitle !== originalTitle;
    },
  },

  created () {
    if (this.item.homepage) {
      this.item.external_ids.homepage = this.item.homepage;
    }
    this.fetchProviders();
    this.fetchReviews();
    this.reviews = this.reviewsProp || [];
  },


  methods: {
    toggleFullReviews() {
    this.showFullReviews = !this.showFullReviews;
    },
    formatGenres (genres) {
      return genres.map(genre => `<a href="/genre/${genre.id}/tv">${genre.name}</a>`).join(', ');
    },

    toggleReadMore(review) {
    this.$set(review, 'showFullContent', !review.showFullContent);
    },

    formatRunTime (times) {
      return times.map(time => `${time}m`).join(', ');
    },
    formatContent(content, index, showFullContent) {
      if (!content) return '';

      content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      content = content.replace(/_([^_]+)_/g, (match, p1) => p1.toUpperCase());
      
      if (showFullContent) {
          return content; 
      } else {
          const words = content.split(' ');
          if (words.length > 200) {
              content = words.slice(0, 200).join(' ');
          }
          return content;
      }
    },

    formatCreatedAt(createdAt) {
      if (!createdAt) return '';
      return new Date(createdAt).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    async fetchProviders() {
      try {
        const providers = await getTVShowProviders(this.item.id); 
        this.providers = providers; 
      } catch (error) {
        console.error("Error fetching tv show providers:", error);
      }
    },
    async fetchReviews() {
      try {
        const reviews = await getTvShowReviews(this.item.id);
        this.reviews = reviews;
      } catch (error) {
        console.error("Error fetching tv show reviews:", error);
      }
    },
    redirectToUrl(url) {
      window.open(url, '_blank');
    },
  },
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.info { 
  background-color: rgba(0, 0, 0, 0.307);
  border-radius: 10px;
  padding-bottom: 4rem;
}

.info {
  @media (min-width: $breakpoint-medium) {
    display: flex;
  }
}

.left {
  display: none;

  @media (min-width: $breakpoint-medium) {
    display: block;
    width: 25%;
    max-width: 400px;
    padding-right: 3rem;
  }

  @media (min-width: $breakpoint-large) {
    padding-right: 5rem;
  }
}

.right {
  padding-top: 1rem;
}

.right {
  @media (min-width: $breakpoint-medium) {
    flex: 1;
  }
}

.poster {
  position: relative;
  height: 0;
  border-radius: 10px;
  padding-top: 150.27%;
  overflow: hidden;
  background-color: $secondary-color;

  img,
  span {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  span {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}


.overview {
  max-width: 1000px;
  margin-bottom: 3rem;
  font-size: 1.5rem;
  color: $text-color;

  @media (min-width: $breakpoint-large) {
    font-size: 1.6rem;
  }
}

.title {
  margin-bottom: 1rem;
  font-size: 1.8rem;
  color: #fff;
  letter-spacing: $letter-spacing;

  @media (min-width: $breakpoint-large) {
    font-size: 2.4rem;
  }
}

.stats {
  margin-bottom: 3rem;
  font-size: 1.5rem;
  color: $text-color;

  @media (min-width: $breakpoint-large) {
    font-size: 1.6rem;
  }

  ul {
    @media (min-width: $breakpoint-medium) {
      display: flex;
      flex-wrap: wrap;
    }
  }

  li {
    display: flex;
    padding: 0.2rem 0;

    @media (min-width: $breakpoint-medium) {
      width: 50%;
    }
    

    @media (min-width: $breakpoint-xlarge) {
      width: 100%;
    }
  }

  a {
    color: #8AE8FC;
    text-decoration: none;
  }
}

.label {
  flex: 1;
  max-width: 90px;
  margin-right: 1.5rem;
  color: #fff;

  @media (min-width: $breakpoint-xsmall) {
    max-width: 110px;
  }
}

.value {
  flex: 2;
}

.external {
  ul {
    display: flex;
    margin-left: -0.5rem;
  }

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4.4rem;
    height: 4.4rem;

    svg {
      transition: all 0.3s ease-in-out;
    }

    &:hover,
    &:focus {
      svg {
        fill: $fourth-color;
      }
    }
  }
}
</style>

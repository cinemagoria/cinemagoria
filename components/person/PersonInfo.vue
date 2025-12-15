<template>
  <div class="spacing" :class="$style.info">
    <div :class="$style.left">
      <div :class="$style.poster">
        <img
          v-if="avatar"
          v-lazyload="avatar"
          class="lazyload"
          :alt="person.name">

        <img
          v-else
          src="https://raw.githubusercontent.com/imprvhub/entercinema/es/static/image_not_found_yet_es.webp"
          alt="Imagen no encontrada"
          style="width: 100%; height: 100%; object-fit: cover;">
      </div>
    </div>

    <div :class="$style.right">
      <div :class="$style.overview">
        <div :class="$style.headerRow">
          <h2 :class="$style.title">
            {{ person.name }}
          </h2>
        </div>

        <div v-if="person.biography">
          <img v-if="avatar" :src="avatar" :alt="person.name">

          <div v-html="formatContent(person.biography)" />
        </div>
      </div>

      <div :class="$style.stats">
        <ul class="nolist">
          <li v-if="person.known_for_department">
            <div :class="$style.label">
              Profesión
            </div>

            <div :class="$style.value">
              {{ person.known_for_department }}
            </div>
          </li>
          <li v-if="person.birthday">
            <div :class="$style.label">
              Fecha de Nacimiento
            </div>

            <div :class="$style.value">
              {{ person.birthday | fullDate }}
              <span v-if="!person.deathday">({{ age }} años)</span>
            </div>
          </li>
          <li v-if="person.place_of_birth">
            <div :class="$style.label">
              Lugar de Nacimiento
            </div>

            <div :class="$style.value">
              {{ person.place_of_birth }}
            </div>
          </li>
          <li v-if="person.deathday">
            <div :class="$style.label">
              Fallecido
            </div>

            <div :class="$style.value">
              {{ person.deathday | fullDate }}
              <span v-if="person.birthday">({{ age }} años)</span>
            </div>
          </li>
        </ul>

        <div v-if="isLoggedIn" :class="$style.followSection">
            <h4 style="margin-top:2rem; font-size: 16px; font-weight:800; text-transform: uppercase;" class="section-title">Notificaciones</h4>
            <button 
                v-if="hasAccessToken && isActorOrDirector"
                @click="toggleFollow" 
                :class="[$style.followButton, { [$style.following]: isFollowing }]"
                :disabled="followLoading">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path v-if="!isFollowing" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle v-if="!isFollowing" cx="9" cy="7" r="4"/>
                  <line v-if="!isFollowing" x1="19" y1="8" x2="19" y2="14"/>
                  <line v-if="!isFollowing" x1="22" y1="11" x2="16" y2="11"/>
                  <path v-if="isFollowing" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle v-if="isFollowing" cx="9" cy="7" r="4"/>
                  <polyline v-if="isFollowing" points="16 11 18 13 22 9"/>
                </svg>
                {{ isFollowing ? 'Siguiendo' : 'Seguir' }}
              </button>
        </div>
      </div>
      <div :class="$style.external">
        <ExternalLinks
          media="person"
          :links="person.external_ids" />
      </div>
    </div>
  </div>
</template>

<script>
import { apiImgUrl } from '~/api';
import ExternalLinks from '~/components/ExternalLinks';

export default {
  components: { ExternalLinks },
  props: { person: { type: Object, required: true } },
  data() {
    return {
      hasAccessToken: false,
      isFollowing: false,
      followLoading: false,
      userEmail: null,
      followsApiUrl: 'https://entercinema-follows-rust.vercel.app'
    };
  },

  computed: {
    isLoggedIn() {
      return localStorage.getItem('access_token') !== null;
    },
    avatar () {
      if (this.person.profile_path) {
        return `${apiImgUrl}/w500${this.person.profile_path}`;
      } else {
        return null;
      }
    },
    age() {
      const born = this.person.birthday;
      const died = this.person.deathday;
      if (born && !died) return this.getAge(born);
      else if (born && died) return this.getAge(born, died);
      else return false;
    },
    isActorOrDirector() {
      const dept = this.person.known_for_department;
      return dept === 'Acting' || dept === 'Directing' || dept === 'Writing';
    },
  },
  created () {
    if (this.person.homepage) {
      this.person.external_ids.homepage = this.person.homepage;
    }
  },

  mounted() {
    this.userEmail = localStorage.getItem('email');
    this.hasAccessToken = localStorage.getItem('access_token') !== null;
    if (this.hasAccessToken && this.isActorOrDirector) {
      this.checkIfFollowing();
    }
  },

  methods: {
    formatContent(string) {
      return string.split('\n').filter(section => section !== '').map(section => `<p>${section}</p>`).join('');
    },
    getAge(born, died) {
      const startDate = new Date(born);
      let endDate = died ? new Date(died) : new Date();
      let age = endDate.getFullYear() - startDate.getFullYear();
      const month = endDate.getMonth() - startDate.getMonth();
      if (month < 0 || (month === 0 && endDate.getDate() < startDate.getDate())) age--;
      return age;
    },
    async checkIfFollowing() {
      if (!this.userEmail) return;
      try {
        const response = await fetch(`${this.followsApiUrl}/follows/list?user_email=${encodeURIComponent(this.userEmail)}`);
        if (!response.ok) return;
        const data = await response.json();
        if (data.success && data.follows) {
          this.isFollowing = data.follows.some(f => f.person_id === this.person.id);
        }
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    },
    async toggleFollow() {
      if (!this.userEmail || this.followLoading) return;
      this.followLoading = true;
      try {
        if (this.isFollowing) {
          const response = await fetch(`${this.followsApiUrl}/follows/remove?user_email=${encodeURIComponent(this.userEmail)}&person_id=${this.person.id}`, { method: 'DELETE' });
          if (response.ok) this.isFollowing = false;
        } else {
          let personType = 'actor';
          if (this.person.known_for_department === 'Directing') personType = 'director';
          else if (this.person.known_for_department === 'Writing') personType = 'writer';
          
          const response = await fetch(`https://entercinema-follows-rust.vercel.app/follows/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_email: this.userEmail,
              person_id: this.person.id,
              person_name: this.person.name,
              person_type: personType,
              profile_path: this.person.profile_path || null
            })
          });
          if (response.ok) this.isFollowing = true;
        }
      } catch (error) {
        console.error('Error toggling follow:', error);
      } finally {
        this.followLoading = false;
      }
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
  @media (min-width: $breakpoint-medium) {
    display: flex;
  }
}

.right {
  padding-top: 1rem;
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
  @media (min-width: $breakpoint-medium) {
    flex: 1;
  }
}

.poster {
  position: relative;
  height: 0;
  padding-top: 150.27%;
  overflow: hidden;
  border-radius: 10px;
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
  overflow: hidden;
  font-size: 1.5rem;
  color: $text-color;

  @media (min-width: $breakpoint-large) {
    font-size: 1.6rem;
  }

  img {
    float: left;
    width: 40%;
    max-width: 200px;
    border-radius: 10px;
    margin: 0 1.5rem 0 0;

    @media (min-width: $breakpoint-medium) {
      display: none;
    }
  }
}

.headerRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  .title {
    margin-bottom: 0;
  }
  .followSection {
    margin-top: 1rem;
    @media (min-width: $breakpoint-medium) {
      margin-top: 0;
    }
  }
}

.title {
  margin-top: 10px;
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

.followButton {
  display: inline-flex;
  margin-top: 1rem;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 2rem;
  background: linear-gradient(315deg, #0A1E26, #11323F, #1A4453);
  border-radius: 12px;
  color: #fff;
  margin-right: 10px;
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s;
  
  @media (min-width: $breakpoint-large) {
    font-size: 1.6rem;
  }
  
  &:hover,
  &:focus {
    background: linear-gradient(315deg, #0A1E26, #11323F, #35758B);
    color: #8BE9FD;
    box-shadow: 0 0 3px rgba(156, 156, 156, 0.269);
    transform: scale(1.05);

    svg {
      stroke: #8BE9FD;
      fill: #8BE9FD;
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  svg {
    flex-shrink: 0;
    transition: all 0.2s;
  }
}

.following {
  background: #8BE9FD;
  color: #000;
  
  svg {
    stroke: #000;
    fill: #000;
  }
  
  &:hover,
  &:focus {
    background: linear-gradient(315deg, #0A1E26, #11323F, #35758B);
    color: #8BE9FD;
    box-shadow: 0 0 3px rgba(156, 156, 156, 0.269);
    transform: scale(1.05);

    svg {
      stroke: #8BE9FD;
      fill: #8BE9FD;
    }
  }
}
</style>

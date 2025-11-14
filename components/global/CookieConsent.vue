<template>
  <div
    v-if="isOpen"
    style="border-radius:12px;"
    class="alert alert--alt alert--bottom"> 
    <p>We use cookies and other tracking technologies to enhance your browsing experience. By using this website, you agree to the use of cookies and other tracking technologies. <a target="_blank" href="/usage-policies" rel="noopener">More Information</a>.</p>

    <div>
      <button
        class="alert__btn alert__btn--secondary button"
        style="border-radius:12px;"
        type="button"
        aria-label="Cerrar"
        @click="decline">
        Decline
      </button>

      <button
        class="alert__btn alert__btn--primary button"
        style="border-radius:12px !important;"
        type="button"
        aria-label="Cerrar"
        @click="accept">
        Agree
      </button>
    </div>
  </div>
</template>

<script>
import { get, set } from 'tiny-cookie';
import { supportsLocalStorage } from '~/mixins/Functions';

export default {
  data () {
    return {
      isOpen: false,
      storageName: 'cookieconsent',
    };
  },

  mounted () {
    if (!this.getVisited()) {
      this.isOpen = true;
    }
  },

  methods: {
    getVisited () {
      if (supportsLocalStorage()) {
        return localStorage.getItem(this.storageName);
      } else {
        return get(this.storageName);
      }
    },

    setAccepted () {
      if (supportsLocalStorage()) {
        localStorage.setItem(this.storageName, 'accepted');
      } else {
        set(this.storageName, 'accepted');
      }
    },

    setDeclined () {
      if (supportsLocalStorage()) {
        localStorage.setItem(this.storageName, 'declined');
      } else {
        set(this.storageName, 'declined');
      }
    },

    accept () {
      this.setAccepted();
      this.isOpen = false;
    },

    decline () {
      this.setDeclined();
      this.isOpen = false;
    },
  },
};
</script>

<style>
.alert--bottom {
    position: fixed;
    bottom: -1px;
    width: 95%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2000;
    border-radius: 12px;
}
</style>

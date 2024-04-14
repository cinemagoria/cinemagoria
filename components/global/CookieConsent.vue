<template>
  <div
    v-if="isOpen"
    class="alert alert--alt">
    <p>Utilizamos cookies y otras tecnologías de tracking para mejorar su experiencia de navegación en nuestro sitio web. Al usar nuestro sitio web, usted acepta nuestro uso de cookies y otras tecnologías de tracking. <a target="_blank" href="/terms" rel="noopener">Más Información</a>.</p>

    <div>
      <button
        class="alert__btn alert__btn--secondary button"
        type="button"
        aria-label="Close"
        @click="decline">
        Rechazar
      </button>

      <button
        class="alert__btn alert__btn--primary button"
        type="button"
        aria-label="Close"
        @click="accept">
        Aceptar
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

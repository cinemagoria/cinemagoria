<template>
  <div
    v-if="isOpen"
    class="alert alert--alt alert--bottom"> 
    <p>Utilizamos cookies y otras tecnologías de seguimiento para mejorar tu experiencia de navegación. Al utilizar este sitio web, aceptas el uso de cookies y otras tecnologías de seguimiento. <a target="_blank" href="/terms" rel="noopener">Más información</a>.</p>

    <div>
      <button
        class="alert__btn alert__btn--secondary button"
        type="button"
        aria-label="Cerrar"
        @click="decline">
        Rechazar
      </button>

      <button
        class="alert__btn alert__btn--primary button"
        type="button"
        aria-label="Cerrar"
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

<style>
.alert--bottom {
    position: fixed;
    bottom: -1px;
    width: 95%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2000;
    border-radius: 10px;
}
</style>

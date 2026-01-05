<template>
  <div
    v-if="isOpen"
    style="border-radius:12px;"
    class="alert alert--default alert--bottom">
    
    <p>¿Quiere <a href="#" @click.prevent="install">Añadir a 'EnterCinema' en su pantalla de inicio?</a></p>

    <button
      class="alert__close"
      style="border-radius:12px !important;"
      type="button"
      aria-label="Cerrar"
      @click="close">
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><path fill="none" stroke="#fff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.5" d="m.75.75 13.5 13.5m0-13.5L.75 14.25"/></svg>
    </button>
  </div>
</template>

<script>
import { get, set } from 'tiny-cookie';
import { supportsLocalStorage } from '~/mixins/Functions';

let installEvent;

export default {
  data () {
    return {
      isOpen: false,
      storageName: 'installprompt',
    };
  },

  mounted () {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();

      if (!this.getVisited()) {
        installEvent = event;
        this.isOpen = true;
      }
    });
  },

  methods: {
    setVisited () {
      if (supportsLocalStorage()) {
        localStorage.setItem(this.storageName, true);
      } else {
        set(this.storageName, true);
      }
    },

    getVisited () {
      if (supportsLocalStorage()) {
        return localStorage.getItem(this.storageName);
      } else {
        return get(this.storageName);
      }
    },

    close () {
      this.setVisited();
      this.isOpen = false;
      installEvent = null;
    },

    install () {
      this.isOpen = false;
      installEvent.prompt();

      installEvent.userChoice.then((choice) => {
        if (choice.outcome !== 'accepted') {
          this.setVisited();
        }

        installEvent = null;
      });
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
    border-radius: 15px;;
}

.alert__close {
  margin-bottom: 30px !important;
}
</style>

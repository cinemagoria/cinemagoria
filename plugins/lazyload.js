import Vue from 'vue';

const imageLoaded = function (e) {
  e.target.parentElement.classList.remove('lazyerror', 'lazyloading');
  e.target.parentElement.classList.add('lazyloaded');
};

const imageError = function (e) {
  e.target.parentElement.classList.remove('lazyloaded', 'lazyloading');
  e.target.parentElement.classList.add('lazyerror');
};

const loadImage = function (el, path) {
  if (!path) return;

  el.parentElement.classList.remove('lazyerror', 'lazyloaded');
  el.parentElement.classList.add('lazyloading');

  el.addEventListener('load', imageLoaded);
  el.addEventListener('error', imageError);

  el.src = path;
};

Vue.directive('lazyload', {
  inserted(el, binding) {
    function handleIntersect(entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImage(el, binding.value);
          observer.unobserve(el);
        }
      });
    }

    function createObserver() {
      const options = {
        root: null,
        rootMargin: '200px',
        threshold: 0.01,
      };

      const observer = new IntersectionObserver(handleIntersect, options);
      observer.observe(el);
      el._observer = observer;
    }

    if (!window.IntersectionObserver) {
      loadImage(el, binding.value);
    } else {
      createObserver();
    }
  },

  update(el, binding) {
    if (binding.value !== binding.oldValue) {
      loadImage(el, binding.value);
    }
  },

  unbind(el) {
    if (el._observer) {
      el._observer.disconnect();
      delete el._observer;
    }
    el.removeEventListener('load', imageLoaded);
    el.removeEventListener('error', imageError);
  }
});

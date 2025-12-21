/**
 * Debounce
 */
export const debounce = function (func, delay) {
  let timeoutID;

  return function () {
    clearTimeout(timeoutID);

    const args = arguments;
    const that = this;

    timeoutID = setTimeout(function () {
      func.apply(that, args);
    }, delay);
  };
};

export const supportsLocalStorage = function () {
  let supports = true;

  try {
    const test = '__vue-localStorage-check';
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
    } else {
      return false;
    }
  } catch (e) {
    supports = false;
  }

  return supports;
};

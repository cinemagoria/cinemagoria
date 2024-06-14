export const state = () => ({
  searchOpen: true,
  fromPage: '/',
});

export const mutations = {
  toggleSearch (state) {
    state.searchOpen = !state.searchOpen;
  },

  openSearch (state) {
    state.searchOpen = true;
  },

  closeSearch (state) {
    state.searchOpen = false;
  },

  setFromPage (state, page) {
    state.fromPage = page;
  },
};

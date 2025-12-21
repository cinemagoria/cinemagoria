import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
    state: () => ({
        searchOpen: false,
        fromPage: '/'
    }),
    actions: {
        toggleSearch() {
            this.searchOpen = !this.searchOpen
        },
        openSearch() {
            this.searchOpen = true
        },
        closeSearch() {
            this.searchOpen = false
        },
        setFromPage(page) {
            this.fromPage = page
        }
    }
})

<template>
  <div class="app-layout">
    <Nav />
    
    <div class="main-content">
      <SearchForm />
      <div class="page-content">
        <slot />
      </div>
      <Footer />
    </div>

    <!--
      These modals render nothing until opened (v-if-gated) and only need
      their bus listeners registered shortly after load. Lazy + idle
      hydration keeps their ~6k lines of component code out of the entry
      chunk and off the critical hydration path on every page.
    -->
    <LazyAuthModal hydrate-on-idle />
    <CookieConsent />
    <InstallPrompt />
    <LazyProgressTrackingModal hydrate-on-idle />
    <LazyRatedModal hydrate-on-idle />
    <LazyFollowingModal hydrate-on-idle />
    <LazyQuickFavModal hydrate-on-idle />
    <LazyMyListsModal hydrate-on-idle />
    <LazyCreateListModal hydrate-on-idle />
  </div>
</template>

<script setup>
import Nav from '~/components/global/Nav.vue'
import SearchForm from '~/components/global/SearchForm.vue'
import Footer from '~/components/global/Footer.vue'
import CookieConsent from '~/components/global/CookieConsent.vue'
import InstallPrompt from '~/components/global/InstallPrompt.vue'
</script>

<style lang="scss" scoped>
@use '~/assets/css/utilities/variables' as *;

.app-layout {
  min-height: 100vh;
  position: relative;
}

.main-content {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
  padding-bottom: 5.6rem;

  @media (min-width: $breakpoint-large) {
    padding-bottom: 0;
  }
}

.page-content {
  flex: 1;
}
</style>

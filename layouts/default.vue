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

    <!-- Global Modals -->
    <AuthModal ref="authModal" />
    <CookieConsent />
    <InstallPrompt />
    <RatedModal />
    <FollowingModal />
    
    <!-- Modals triggered by EventBus -->
    <QuickFavModal />
    <MyListsModal />
    <CreateListModal />
  </div>
</template>

<script setup>
import Nav from '~/components/global/Nav.vue'
import SearchForm from '~/components/global/SearchForm.vue'
import Footer from '~/components/global/Footer.vue'
import AuthModal from '~/components/global/AuthModal.vue'
import CookieConsent from '~/components/global/CookieConsent.vue'
import InstallPrompt from '~/components/global/InstallPrompt.vue'
import RatedModal from '~/components/global/RatedModal.vue'
import FollowingModal from '~/components/global/FollowingModal.vue'
import QuickFavModal from '~/components/global/QuickFavModal.vue'
import MyListsModal from '~/components/global/MyListsModal.vue'
import CreateListModal from '~/components/global/CreateListModal.vue'
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
  
  padding-bottom: 4.5rem;

  @media (min-width: $breakpoint-large) {
    padding-bottom: 0;
  }
}

.page-content {
  flex: 1;
}
</style>

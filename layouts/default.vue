<template>
  <div>
    <CookieConsent />
    <InstallPrompt />

    <transition name="slidedown">
      <SearchForm />
    </transition>
    <RatedModal />
    <Nav />
    <nuxt />
    <Footer />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CookieConsent from '~/components/global/CookieConsent';
import InstallPrompt from '~/components/global/InstallPrompt';
import SearchForm from '~/components/global/SearchForm';
import Nav from '~/components/global/Nav';
import Footer from '~/components/global/Footer';
import RatedModal from '@/components/global/RatedModal';

export default {
  components: {
    CookieConsent,
    InstallPrompt,
    SearchForm,
    Nav,
    Footer,
    RatedModal, // ← AGREGAR ESTO
  },

  computed: {
    ...mapState('search', [
      'searchOpen',
    ]),
  },
};
</script>
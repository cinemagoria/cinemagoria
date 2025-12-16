<template>
  <div>
    <CookieConsent />
    <InstallPrompt />

    <transition name="slidedown">
      <SearchForm />
    </transition>
    <RatedModal />
    <FollowingModal />
    <QuickFavModal />
    <Nav />
    <nuxt />
    <ChatbotModal />
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
import FollowingModal from '@/components/global/FollowingModal';
import ChatbotModal from '@/components/global/ChatbotModal';
import QuickFavModal from '@/components/global/QuickFavModal';

export default {
  components: {
    CookieConsent,
    InstallPrompt,
    SearchForm,
    ChatbotModal,
    Nav,
    Footer,
    RatedModal,
    FollowingModal,
    QuickFavModal,
  },

  computed: {
    ...mapState('search', [
      'searchOpen',
    ]),
  },
};
</script>
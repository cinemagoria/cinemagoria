<template>
  <main class="main">
    <AuthModal ref="authModal" :initialTab="'login'" />
  </main>
</template>

<script>
import AuthModal from '@/components/global/AuthModal.vue';

export default {
  components: {
    AuthModal
  },
  mounted() {
    this.$refs.authModal.open();
  }
};
</script>
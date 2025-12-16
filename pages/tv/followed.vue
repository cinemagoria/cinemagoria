<template>
  <FollowedContent type="tv" />
</template>

<script>
import FollowedContent from '~/components/FollowedContent';

export default {
  components: {
    FollowedContent,
  },
  head() {
    return {
      title: 'EnterCinema - Followed Companies',
    };
  },
};
</script>

import { computed } from 'vue';

export function useHalloweenMarathon() {
  const { data, pending } = useFetch('/api/halloween', {
    key: 'halloween-featured',
    query: { featured: '1' },
    timeout: 8000,
    lazy: true,
  });

  const active = computed(() => Boolean(
    data.value?.active
    && data.value.movies?.length
    && Date.now() < Date.parse(data.value.event?.ends_at),
  ));

  return { data, pending, active };
}

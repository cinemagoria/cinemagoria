<script setup>
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': 'https://cinemagoria.com/#organization',
            name: 'Cinemagoria',
            url: 'https://cinemagoria.com',
            logo: {
              '@type': 'ImageObject',
              url: 'https://cinemagoria.com/icons/icon-192x192.png',
              width: 192,
              height: 192,
            },
            sameAs: [],
          },
          {
            '@type': 'WebSite',
            '@id': 'https://cinemagoria.com/#website',
            url: 'https://cinemagoria.com',
            name: 'Cinemagoria',
            description: 'Cinemagoria is a film and TV discovery platform. Browse movies, series, festival coverage, awards, and streaming availability in one place.',
            publisher: { '@id': 'https://cinemagoria.com/#organization' },
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://cinemagoria.com/search?q={search_term_string}',
              },
              'query-input': 'required name=search_term_string',
            },
          },
        ],
      }),
    },
  ],
})
</script>

<template>
  <div id="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

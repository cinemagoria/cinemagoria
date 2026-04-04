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
            alternateName: 'Cinemagoria Film & TV Discovery',
            url: 'https://cinemagoria.com',
            description: 'Film and TV discovery platform — browse movies, series, festival coverage, awards, and streaming availability in one place.',
            foundingDate: '2023',
            logo: {
              '@type': 'ImageObject',
              url: 'https://cinemagoria.com/icons/icon-192x192.png',
              width: 192,
              height: 192,
            },
            sameAs: [
              'https://github.com/cinemagoria',
              'https://es.cinemagoria.com',
            ],
          },
          {
            '@type': 'WebSite',
            '@id': 'https://cinemagoria.com/#website',
            url: 'https://cinemagoria.com',
            name: 'Cinemagoria',
            description: 'Cinemagoria is a film and TV discovery platform. Browse movies, series, festival coverage, awards, and streaming availability in one place.',
            publisher: { '@id': 'https://cinemagoria.com/#organization' },
            inLanguage: 'en',
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

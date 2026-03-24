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
            '@id': 'https://es.cinemagoria.com/#website',
            url: 'https://es.cinemagoria.com',
            name: 'Cinemagoria',
            description: 'Cinemagoria - El momento en el que descubres qué ver. Explora películas, series, festivales, premios y disponibilidad en streaming.',
            publisher: { '@id': 'https://cinemagoria.com/#organization' },
            inLanguage: 'es',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://es.cinemagoria.com/search?q={search_term_string}',
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

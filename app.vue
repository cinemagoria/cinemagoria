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
            alternateName: 'Cinemagoria — Plataforma de Descubrimiento de Cine y TV',
            url: 'https://cinemagoria.com',
            description: 'Plataforma de descubrimiento de cine y TV — explora películas, series, festivales, premios y disponibilidad en streaming.',
            foundingDate: '2023',
            logo: {
              '@type': 'ImageObject',
              url: 'https://cinemagoria.com/icons/icon-192x192.png',
              width: 192,
              height: 192,
            },
            sameAs: [
              'https://github.com/cinemagoria',
              'https://cinemagoria.com',
            ],
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

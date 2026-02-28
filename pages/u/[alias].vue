<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useNuxtApp } from '#app'
import { followUser, unfollowUser } from '~/utils/api'

const route = useRoute()
const alias = route.params.alias

const viewerEmail = ref(null)
const viewerAlias = ref(null)
const collapsedReviews = ref(false)
const collapsedLists = ref(false)
const avatarSrc = ref('/avatars/avatar-ss0.png')

const reviewsPage = ref(1)
const listsPage = ref(1)
const listsPerPage = 10
const reviewsPerPage = 5

onMounted(async () => {
  if (process.client) {
    viewerEmail.value = localStorage.getItem('email') || null
    viewerAlias.value = localStorage.getItem('alias') || null
  }
})

const FOLLOWS_API = 'https://entercinema-follows-rust.vercel.app'
const FAVORITES_API = 'https://entercinema-favorites.vercel.app/api'

const { data: profile, pending, error } = await useFetch(
  `${FOLLOWS_API}/profile/${alias}`,
  { query: computed(() => ({ viewer_email: viewerEmail.value })) }
)

const isOwner = computed(() => !!viewerEmail.value && !!profile.value?.email && viewerEmail.value === profile.value.email)

const isFollowing = ref(false)
const followLoading = ref(false)

watch(() => profile.value?.is_following, (val) => {
  isFollowing.value = val ?? false
}, { immediate: true })

const { $supabase } = useNuxtApp()
watchEffect(async () => {
  if (!profile.value?.email) return
  try {
    const { data } = await $supabase
      .from('user_data')
      .select('avatar')
      .eq('email', profile.value.email)
      .single()
    if (data?.avatar) avatarSrc.value = data.avatar
  } catch {}
})

async function toggleFollow() {
  if (!viewerEmail.value || !profile.value?.email) return
  followLoading.value = true
  try {
    if (isFollowing.value) {
      await unfollowUser(viewerEmail.value, profile.value.email)
      isFollowing.value = false
    } else {
      await followUser(viewerEmail.value, profile.value.email)
      isFollowing.value = true
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('following-updated'))
    }
  } finally {
    followLoading.value = false
  }
}

const { data: publicReviews } = useAsyncData(`reviews-${alias}`, async () => {
  if (!profile.value?.email) return []
  try {
    const r = await $fetch(`${FAVORITES_API}/ratings/${encodeURIComponent(profile.value.email)}`)
    if (!r?.favorites_json) return []

    const allReviews = []
    const processItems = (items) => {
      if (!items || !Array.isArray(items)) return
      items.forEach(wrapper => {
        const key = Object.keys(wrapper)[0]
        const d = wrapper[key]?.details
        if (d && d.userReview && d.userReview.trim().length > 0) {
          allReviews.push({
            item_id: d.idForDb,
            item_type: d.typeForDb,
            name: d.nameForDb,
            poster_url: d.posterForDb,
            rating: d.userRatingForDb,
            review: d.userReview,
            addedAt: d.addedAt || d.updated_at || null
          })
        }
      })
    }

    processItems(r.favorites_json.movies)
    processItems(r.favorites_json.tv)
    return allReviews
  } catch (e) {
    return []
  }
}, { watch: [profile] })

const { data: publicLists } = useAsyncData(`lists-${alias}`, async () => {
  if (!profile.value?.email) return []
  try {
    const r = await $fetch(`${FAVORITES_API}/lists/user/${encodeURIComponent(profile.value.email)}`)
    const filtered = (r?.lists ?? []).filter(l => l.is_public === 1)
    
    const hydratedLists = await Promise.all(filtered.map(async (list) => {
       let validCovers = (list.cover_images || []).filter(url => url && typeof url === 'string' && url.trim().length > 0)
       
       if (validCovers.length < 4 && list.item_count > validCovers.length && (!list.items || list.items.length === 0)) {
           try {
                const detailsRes = await fetch(`${FAVORITES_API}/lists/${list.slug}`)
                if (detailsRes.ok) {
                    const detailsData = await detailsRes.json()
                    if (detailsData.items && Array.isArray(detailsData.items)) {
                        validCovers = detailsData.items
                            .map(item => item.poster_url || item.poster_path)
                            .filter(url => url && typeof url === 'string' && url.trim().length > 0)
                            .slice(0, 4)
                    }
                }
           } catch (err) {
               console.error("Failed to hydrate list covers", err)
           }
       } else if (list.items && Array.isArray(list.items)) {
             validCovers = list.items
                .map(item => item.poster_url || item.poster_path)
                .filter(url => url && typeof url === 'string' && url.trim().length > 0)
                .slice(0, 4)
       }

       return { ...list, cover_images: validCovers }
    }))
    
    return hydratedLists
  } catch(e) {
    return []
  }
}, { watch: [profile] })

const paginatedReviews = computed(() => {
  if (!publicReviews.value) return []
  const start = (reviewsPage.value - 1) * reviewsPerPage
  return publicReviews.value.slice(start, start + reviewsPerPage)
})

const totalReviewsPages = computed(() => {
  if (!publicReviews.value) return 0
  return Math.ceil(publicReviews.value.length / reviewsPerPage)
})

const paginatedLists = computed(() => {
  if (!publicLists.value) return []
  const start = (listsPage.value - 1) * listsPerPage
  return publicLists.value.slice(start, start + listsPerPage)
})

const totalListsPages = computed(() => {
  if (!publicLists.value) return 0
  return Math.ceil(publicLists.value.length / listsPerPage)
})

function prevReviewsPage() { if (reviewsPage.value > 1) reviewsPage.value-- }
function nextReviewsPage() { if (reviewsPage.value < totalReviewsPages.value) reviewsPage.value++ }

function prevListsPage() { if (listsPage.value > 1) listsPage.value-- }
function nextListsPage() { if (listsPage.value < totalListsPages.value) listsPage.value++ }

function resolvePoster(path) {
  if (!path) return '/empty-list-placeholder.webp'
  if (path.startsWith('http') || path.startsWith('//')) return path
  return `https://image.tmdb.org/t/p/w500${path.startsWith('/') ? '' : '/'}${path}`
}

function handleImgError(e) {
  e.target.src = '/placeholders/plus_placeholder.webp'
}

function getTimeAgo(ts) {
  if (!ts) return ''
  const diff = Date.now() / 1000 - ts
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`
  return `hace ${Math.floor(diff / 86400)}d`
}

function formatReviewDate(tsOrDateString) {
  if (!tsOrDateString) return '';
  let dateStr = tsOrDateString;
  if (typeof dateStr === 'string' && !dateStr.includes('T') && !dateStr.includes('Z')) {
    dateStr += 'Z';
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

useSeoMeta({
  title: computed(() => profile.value?.alias ? `@${profile.value.alias} — EnterCinema` : 'Perfil — EnterCinema'),
  ogTitle: computed(() => `@${profile.value?.alias ?? alias}`),
})
</script>

<template>
  <main class="profile-main">
    <div v-if="pending" class="loader-container"><Loader /></div>
    <div v-else-if="error || !profile" class="empty-state">
      <p>Perfil no encontrado.</p>
      <NuxtLink to="/" class="back-link">← Volver al inicio</NuxtLink>
    </div>
    <div v-else class="profile-container">
      <div v-if="isOwner" class="owner-banner">
        <div class="owner-banner-left">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Este es tu perfil público</span>
        </div>
        <NuxtLink to="/settings" class="owner-settings-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          Configuración
        </NuxtLink>
      </div>

      <div class="profile-header">
        <img
          :src="avatarSrc"
          class="profile-avatar"
          :alt="profile.alias || profile.first_name"
        />
        <div class="profile-identity">
          <h1 class="profile-name">{{ profile.first_name }} {{ profile.last_name }}</h1>
          <span v-if="profile.alias" class="profile-alias">@{{ profile.alias }}</span>
          <p v-if="profile.bio" class="profile-bio">{{ profile.bio }}</p>
          <div class="profile-stats">
            <span><strong>{{ profile.followers_count }}</strong> seguidores</span>
            <span><strong>{{ profile.following_count }}</strong> siguiendo</span>
          </div>
          <button
            v-if="viewerEmail && !isOwner"
            @click="toggleFollow"
            :disabled="followLoading"
            :class="['follow-btn', { following: isFollowing }]"
          >
            {{ followLoading ? '...' : isFollowing ? 'Siguiendo' : 'Seguir' }}
          </button>
        </div>
      </div>

      <div v-if="profile.privacy_lists && publicLists?.length" class="profile-section">
        <div class="section-header" @click="collapsedLists = !collapsedLists">
          <h2 class="section-title">Listas ({{ publicLists.length }})</h2>
          <button class="expand-btn" :aria-label="collapsedLists ? 'Expandir' : 'Colapsar'">
            <svg v-if="collapsedLists" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 6 5 5 5-5"/><path d="m7 13 5 5 5-5"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 11-5-5-5 5"/><path d="m17 18-5-5-5 5"/></svg>
          </button>
        </div>
        <div v-show="!collapsedLists">
          <div class="lists-grid">
            <NuxtLink v-for="list in paginatedLists" :key="list.id" :to="`/lists/${list.slug || list.id}`" class="list-card-link">
              <div class="list-card">
                <div class="card-cover">
                  <div v-if="list.item_count > 0 && list.cover_images && list.cover_images.length > 0" class="dynamic-cover-grid">
                      <div v-for="i in 4" :key="i" class="grid-cell">
                          <img 
                            v-if="list.cover_images && list.cover_images[i-1]" 
                            :src="resolvePoster(list.cover_images[i-1])" 
                            @error="handleImgError"
                            class="cover-img" 
                            alt="Cover"
                          />
                          <div v-else class="plus-placeholder">
                              <img src="/placeholders/plus_placeholder.webp" class="plus-icon" alt="+" />
                          </div>
                      </div>
                  </div>
                  <div v-else class="empty-cover">
                    <div class="mosaic-placeholder"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg></div>
                  </div>
                </div>
                <div class="list-info">
                  <span class="list-name">{{ list.name }}</span>
                  <span v-if="list.description" class="list-desc">{{ list.description }}</span>
                </div>
              </div>
            </NuxtLink>
          </div>
          <div v-if="totalListsPages > 1" class="pagination-controls">
            <button @click="prevListsPage" :disabled="listsPage === 1" class="pagination-btn">Anterior</button>
            <span class="pagination-info">Página {{ listsPage }} de {{ totalListsPages }}</span>
            <button @click="nextListsPage" :disabled="listsPage === totalListsPages" class="pagination-btn">Siguiente</button>
          </div>
        </div>
      </div>

      <div v-if="profile.privacy_reviews && publicReviews?.length" class="profile-section">
        <div class="section-header" @click="collapsedReviews = !collapsedReviews">
          <h2 class="section-title">Reseñas ({{ publicReviews.length }})</h2>
          <button class="expand-btn" :aria-label="collapsedReviews ? 'Expandir' : 'Colapsar'">
            <svg v-if="collapsedReviews" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 6 5 5 5-5"/><path d="m7 13 5 5 5-5"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 11-5-5-5 5"/><path d="m17 18-5-5-5 5"/></svg>
          </button>
        </div>
        <div v-show="!collapsedReviews">
          <div class="reviews-grid">
            <div v-for="item in paginatedReviews" :key="item.item_id" class="review-card">
              <div class="review-poster-container">
                <img 
                  :src="item.poster_url ? resolvePoster(item.poster_url) : '/poster-placeholder.png'" 
                  :alt="item.name" 
                  class="review-poster" 
                  @error="handleImgError"
                />
              </div>
              <div class="review-body">
                <div class="review-header-info">
                  <NuxtLink :to="`/${item.item_type}/${item.item_id}`" class="review-title">{{ item.name }}</NuxtLink>
                  <span v-if="item.addedAt" class="review-date">{{ formatReviewDate(item.addedAt) }}</span>
                </div>
                <div v-if="item.rating" class="review-rating">★ {{ item.rating }}/10</div>
                <p class="review-text" :title="item.review">{{ item.review }}</p>
              </div>
            </div>
          </div>
          <div v-if="totalReviewsPages > 1" class="pagination-controls">
            <button @click="prevReviewsPage" :disabled="reviewsPage === 1" class="pagination-btn">Anterior</button>
            <span class="pagination-info">Página {{ reviewsPage }} de {{ totalReviewsPages }}</span>
            <button @click="nextReviewsPage" :disabled="reviewsPage === totalReviewsPages" class="pagination-btn">Siguiente</button>
          </div>
        </div>
      </div>

      <div v-if="!profile.privacy_reviews && !profile.privacy_lists" class="private-notice">
        <p>Este perfil es privado.</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.profile-main {
  min-height: 80vh;
  padding: 2rem 1rem;
  max-width: 860px;
  margin: 0 auto;
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--color-text-muted, #888);
}

.back-link {
  display: inline-block;
  margin-top: 1rem;
  color: var(--color-primary, #e50914);
  text-decoration: none;
}

.profile-header {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  padding: 1.5rem 0 2rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.profile-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.profile-identity {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.profile-name {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
}

.profile-alias {
  color: var(--color-text-muted, #aaa);
  font-size: 0.95rem;
}

.profile-bio {
  font-size: 0.9rem;
  color: var(--color-text-secondary, #ccc);
  max-width: 500px;
  margin: 0.25rem 0;
}

.profile-stats {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: var(--color-text-muted, #aaa);
}

.profile-stats strong {
  color: var(--color-text, #fff);
}

.follow-btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1.4rem;
  border-radius: 8px;
  border: none;
  background: #e50914;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: fit-content;
}

.follow-btn:hover {
  background: #f40612;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(229, 9, 20, 0.3);
}

.follow-btn.following {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.follow-btn.following:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: none;
}

.follow-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.owner-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  font-size: 0.95rem;
  color: rgba(255,255,255,0.9);
}

.owner-banner-left {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #fff;
}
.owner-banner-left svg {
  color: #8BE9FD;
}

.owner-settings-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #8BE9FD;
  border: none;
  color: #000;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
}

.owner-settings-btn:hover {
  background: #6ae0f9;
  transform: translateY(-1px);
}
@media (max-width: 600px) {
  .owner-banner {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
.profile-section {
  margin-top: 2.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  margin-bottom: 1.25rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.section-header:hover .section-title {
  opacity: 0.8;
}

.section-title {
  color: #8BE9FD;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  padding-left: 10px;
  border-left: 3px solid #8BE9FD;
  line-height: 1.2;
}

.expand-btn {
  background: transparent;
  border: none;
  color: #8BE9FD;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.expand-btn:hover {
  transform: scale(1.1);
}

.reviews-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.lists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 1.25rem;
}

.review-card {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(138, 232, 252, 0.15);
  border-radius: 12px;
  transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
}

.review-card:hover {
  background: rgba(0, 0, 0, 0.4);
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.review-poster-container {
  width: 140px;
  flex-shrink: 0;
}

.review-poster {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.review-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.review-header-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.review-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #8BE9FD;
  text-decoration: none;
  white-space: normal;
}

.review-title:hover {
  text-decoration: underline;
}

.review-date {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
  white-space: nowrap;
}

.review-rating {
  font-size: 1.1rem;
  color: #000;
  font-weight: 800;
  margin-bottom: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #8BE9FD;
  padding: 4px 12px;
  border-radius: 20px;
  width: fit-content;
}

.review-text {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}

@media (max-width: 600px) {
  .review-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .review-poster-container {
    width: 200px;
  }
  .review-rating {
    margin: 0 auto 0.8rem auto;
  }
}

.list-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.list-card {
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(138, 232, 252, 0.15);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
  height: 100%;
  width: 100%;
}

.list-card:hover {
  background: rgba(0, 0, 0, 0.4);
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.card-cover {
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: #111;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.empty-cover {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.03); 
}

.mosaic-placeholder {
  color: var(--color-text-muted, #555);
}

.dynamic-cover-grid {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.grid-cell {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.plus-placeholder {
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plus-icon {
  width: 40%;
  height: 40%;
  object-fit: contain;
  opacity: 1;
}

.list-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.list-name {
  font-size: 1.15rem;
  font-weight: 600;
  color: #8BE9FD;
}

.list-desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.3;
}

.private-notice {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--color-text-muted, #888);
  background: rgba(0,0,0,0.1);
  border-radius: 8px;
  margin-top: 2rem;
}


.loader-container {
  display: flex;
  justify-content: center;
  padding: 4rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.pagination-btn {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #8BE9FD;
  color: #8BE9FD;
  padding: 0.4rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #8BE9FD;
  color: #000;
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.5);
}

.pagination-info {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
}
</style>

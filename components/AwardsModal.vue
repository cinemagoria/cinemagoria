<template>
  <Teleport to="body">
    <div :class="$style.overlay" @click.self="$emit('close')">
      <div ref="card" :class="$style.modal" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="awards-modal-title">
        <header :class="$style.head">
          <div :class="$style.headText">
            <h2 id="awards-modal-title" :class="$style.title">Awards</h2>
            <p :class="$style.subtitle">{{ title }}<template v-if="summary"> · {{ summary }}</template></p>
          </div>
          <button type="button" :class="$style.close" aria-label="Close" @click="$emit('close')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 18 18 6M6 6l12 12"/></svg>
          </button>
        </header>

        <div :class="$style.body">
          <section v-for="group in groups" :key="group.id" :class="$style.group">
            <div :class="$style.groupHead">
              <img v-if="group.logo" :src="group.logo" :alt="group.name" :class="$style.logo" loading="lazy" decoding="async" @error="group.logo = null" />
              <span :class="$style.groupText">
                <span :class="$style.groupName">{{ group.name }}</span>
                <span :class="$style.groupYear">{{ group.year || groupSummary(group) }}</span>
              </span>
              <nuxt-link v-if="group.link" :to="group.link" no-prefetch :class="$style.viewAll" @click="$emit('close')">View</nuxt-link>
            </div>

            <ul :class="$style.rows">
              <li v-for="(award, i) in group.awards" :key="i" :class="[$style.row, { [$style.rowNominee]: !award.won }]">
                <span :class="[$style.medal, { [$style.medalGrand]: award.won && award.grand, [$style.medalNominee]: !award.won }]">
                  <span :class="$style.trophy" aria-hidden="true" />
                </span>
                <span :class="$style.rowMain">
                  <span :class="$style.rowName">{{ award.name }}</span>
                  <span v-if="metaParts(award).length" :class="$style.rowMeta">
                    <template v-for="(part, j) in metaParts(award)" :key="j">
                      <template v-if="j"> · </template>
                      <nuxt-link v-if="part.to" :to="part.to" no-prefetch :class="$style.metaLink" @click="$emit('close')">{{ part.text }}</nuxt-link>
                      <template v-else-if="part.people">
                        <template v-for="(person, k) in part.people" :key="k"><template v-if="k">, </template><button type="button" :class="$style.metaLink" @click="openPerson(person)">{{ person }}</button></template>
                      </template>
                      <span v-else :class="{ [$style.nomineeTag]: part.nominee }">{{ part.text }}</span>
                    </template>
                  </span>
                </span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { awardsSummary } from '~/utils/awards';

export default {
  name: 'AwardsModal',
  props: {
    title: { type: String, default: '' },
    groups: { type: Array, default: () => [] },
  },
  emits: ['close'],
  computed: {
    summary() {
      return awardsSummary(this.groups);
    },
  },
  mounted() {
    this.prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', this.onKeydown);
    this.$refs.card?.focus({ preventScroll: true });
  },
  beforeUnmount() {
    document.body.style.overflow = this.prevOverflow;
    window.removeEventListener('keydown', this.onKeydown);
  },
  methods: {
    onKeydown(e) {
      if (e.key === 'Escape') this.$emit('close');
    },
    groupSummary(group) {
      return awardsSummary([group]);
    },
    metaParts(award) {
      const people = award.recipient
        ? award.recipient.split(/,\s*|\s+&\s+|\s+and\s+/).map(p => p.trim()).filter(Boolean)
        : [];
      return [
        award.film && { text: award.film, to: award.filmLink },
        award.year && { text: String(award.year) },
        award.section && { text: award.section },
        people.length && { people },
        award.role && { text: award.role },
        award.tie && { text: 'Shared' },
        award.mention && { text: 'Honorable mention' },
        !award.won && { text: 'Nominee', nominee: true },
      ].filter(Boolean);
    },
    // Same lookup the old Awards tab used: the archive has names, not TMDB person ids.
    async openPerson(name) {
      try {
        const { apiKey } = useRuntimeConfig().public;
        const res = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(name)}&language=en-US`);
        const match = res.ok ? (await res.json()).results?.[0] : null;
        if (match) {
          this.$emit('close');
          this.$router.push(`/person/${match.id}`);
        }
      } catch (e) {
        console.error('Person lookup failed:', e);
      }
    },
  },
};
</script>

<style lang="scss" module>
$cyan: #8BE9FD;
$teal: #1F5467;
$gold: #f0c42d;
$muted: #a0aab2;
$ease-out: cubic-bezier(0.16, 1, 0.3, 1);

.overlay {
  position: fixed;
  inset: 0;
  z-index: 1002;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(3, 4, 6, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.modal {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 560px;
  max-height: calc(100dvh - 40px);
  overflow: hidden;
  border-radius: 20px;
  outline: none;
  background: rgba(3, 4, 6, 0.9);
  background-image:
    radial-gradient(circle at 15% 20%, rgba($teal, 0.2), transparent 35%),
    radial-gradient(circle at 85% 80%, rgba($cyan, 0.08), transparent 30%);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba($teal, 0.5),
    inset 0 0 24px rgba($cyan, 0.04);
  color: rgba(255, 255, 255, 0.86);
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  animation: floatIn 0.45s $ease-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    height: 3px;
    background: linear-gradient(90deg, transparent, $cyan, $teal, transparent);
    opacity: 0.8;
    pointer-events: none;
  }
}

@keyframes floatIn {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  padding: 26px 22px 16px;
}

.headText {
  min-width: 0;
}

.title {
  margin: 0;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.3px;
  color: #fff;
  text-shadow: 0 0 20px rgba($cyan, 0.25);
}

.subtitle {
  margin: 4px 0 0;
  font-size: 13.5px;
  font-weight: 300;
  line-height: 1.5;
  color: $muted;
}

.close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #e6ebf0;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    width: 20px;
    height: 20px;
    display: block;
  }

  &:hover {
    background: rgba(255, 95, 95, 0.18);
    border-color: rgba(255, 95, 95, 0.5);
    color: #ff7e7e;
  }
}

.body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 4px 22px 22px;
}

.group + .group {
  margin-top: 18px;
}

.groupHead {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.logo {
  flex-shrink: 0;
  height: 34px;
  width: auto;
  max-width: 72px;
  object-fit: contain;
  filter: invert(1);
}

.groupText {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.groupName {
  font-size: 14.5px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.groupYear {
  font-size: 12.5px;
  color: #8F989E;
}

.viewAll {
  flex-shrink: 0;
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid rgba($cyan, 0.3);
  color: $cyan;
  font-size: 12.5px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: rgba($cyan, 0.1);
    border-color: $cyan;
  }
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 12px 10px 10px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.medal {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba($cyan, 0.06);
  box-shadow: 0 0 0 1px rgba($cyan, 0.16);
}

.trophy {
  display: block;
  width: 20px;
  height: 20px;
  background: $cyan;
  -webkit-mask: url('/ui/trophy.svg') center / contain no-repeat;
  mask: url('/ui/trophy.svg') center / contain no-repeat;
}

.medalGrand {
  background: rgba($gold, 0.08);
  box-shadow: 0 0 0 1px rgba($gold, 0.3), 0 0 16px rgba($gold, 0.08);

  .trophy {
    background: linear-gradient(135deg, $gold 0%, #b8860b 100%);
  }
}

.medalNominee {
  background: rgba(255, 255, 255, 0.03);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08);

  .trophy {
    background: rgba(255, 255, 255, 0.35);
  }
}

.rowNominee {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.05);

  .rowName {
    color: rgba(255, 255, 255, 0.62);
    font-weight: 500;
  }
}

.nomineeTag {
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 11px;
}

.metaLink {
  display: inline;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  text-decoration: underline;
  text-decoration-color: rgba(139, 233, 253, 0.35);
  text-underline-offset: 2px;
  cursor: pointer;

  &:hover {
    color: $cyan;
  }
}

.rowMain {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.rowName {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  color: #fff;
}

.rowMeta {
  font-size: 12.5px;
  line-height: 1.4;
  color: #8F989E;
}

@media (max-width: 480px) {
  .overlay {
    padding: 12px;
  }

  .modal {
    max-height: calc(100dvh - 24px);
  }

  .head {
    padding: 22px 16px 14px;
  }

  .body {
    padding: 4px 16px 18px;
  }

  .row {
    gap: 12px;
    padding: 9px 10px 9px 9px;
  }

  .medal {
    width: 36px;
    height: 36px;
  }

  .trophy {
    width: 18px;
    height: 18px;
  }

  .rowName {
    font-size: 14px;
  }
}
</style>

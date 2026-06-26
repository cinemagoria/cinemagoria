<template>
  <div :class="$style.modalOverlay" @click.self="$emit('close')">
    <div :class="$style.modalContent">
      <button @click="$emit('close')" :class="$style.closeButton" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      <div :class="$style.modalBody">
        <div :class="$style.intro">
          <span :class="$style.eyebrow">Equipo técnico</span>
          <h3>Las personas detr&aacute;s de &lsquo;{{ title }}&rsquo;</h3>
        </div>

        <div :class="$style.groups">
          <section
            v-for="group in groups"
            :key="group.key"
            :class="[$style.group, isOpen(group.key) ? $style.open : '']">
            <button type="button" :class="$style.groupHead" @click="toggle(group.key)">
              <span :class="$style.groupLabel">{{ group.label }}</span>
              <span :class="$style.groupCount">{{ group.people.length }}</span>
              <svg :class="$style.chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>

            <div v-show="isOpen(group.key)" :class="$style.strip">
              <nuxt-link
                v-for="person in group.people"
                :key="`${group.key}-${person.id}`"
                :class="$style.card"
                :to="{ name: 'person-id', params: { id: person.id } }">
                <span :class="$style.avatar">
                  <img
                    v-if="person.profile_path"
                    :src="img(person.profile_path)"
                    loading="lazy"
                    decoding="async"
                    :alt="person.name">
                  <span v-else :class="$style.avatarFallback" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8.7" r="4.2"/><path d="M12 14.2c-5.2 0-9 3.1-9 7.8V24h18v-2c0-4.7-3.8-7.8-9-7.8Z"/></svg>
                  </span>
                </span>
                <span :class="$style.meta">
                  <span :class="$style.cardName">{{ person.name }}</span>
                  <span :class="$style.cardRole">{{ person.roles }}</span>
                </span>
              </nuxt-link>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiImgUrl } from '~/utils/api';

// Preferred department order; anything else is appended alphabetically after.
const DEPARTMENT_ORDER = [
  'Directing',
  'Writing',
  'Production',
  'Camera',
  'Editing',
  'Sound',
  'Art',
  'Costume & Make-Up',
  'Visual Effects',
  'Lighting',
  'Crew',
];

// Spanish labels for TMDB department names (kept in English by the API).
const DEPARTMENT_LABELS = {
  Directing: 'Direcci\u00f3n',
  Writing: 'Gui\u00f3n',
  Production: 'Producci\u00f3n',
  Camera: 'Fotograf\u00eda',
  Editing: 'Montaje',
  Sound: 'Sonido',
  Art: 'Arte',
  'Costume & Make-Up': 'Vestuario y maquillaje',
  'Visual Effects': 'Efectos visuales',
  Lighting: 'Iluminaci\u00f3n',
  Crew: 'Otros',
};

export default {
  name: 'FullCreditsModal',

  props: {
    crew: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      // Departments expanded by default; the rest open one at a time on click,
      // so the modal height stays controlled whether a title has 3 or 500 people.
      openKeys: [],
    };
  },

  created() {
    this.openKeys = this.groups.slice(0, 3).map((g) => g.key);
  },

  computed: {
    groups() {
      const byDept = new Map();

      for (const member of this.crew) {
        if (!member || !member.id) continue;
        const dept = member.department || 'Crew';
        if (!byDept.has(dept)) byDept.set(dept, new Map());

        const people = byDept.get(dept);
        const existing = people.get(member.id);
        if (existing) {
          if (member.job && !existing._jobs.includes(member.job)) {
            existing._jobs.push(member.job);
          }
        } else {
          people.set(member.id, {
            id: member.id,
            name: member.name,
            profile_path: member.profile_path,
            popularity: member.popularity || 0,
            _jobs: member.job ? [member.job] : [],
          });
        }
      }

      const ordered = [...byDept.keys()].sort((a, b) => {
        const ia = DEPARTMENT_ORDER.indexOf(a);
        const ib = DEPARTMENT_ORDER.indexOf(b);
        if (ia === -1 && ib === -1) return a.localeCompare(b);
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
      });

      return ordered.map((dept) => {
        const people = [...byDept.get(dept).values()]
          .sort((a, b) => b.popularity - a.popularity)
          .map((p) => ({ ...p, roles: p._jobs.join(', ') }));
        return {
          key: dept,
          label: DEPARTMENT_LABELS[dept] || dept,
          people,
        };
      });
    },
  },

  methods: {
    img(path) {
      return `${apiImgUrl}/w185${path}`;
    },
    isOpen(key) {
      return this.openKeys.includes(key);
    },
    toggle(key) {
      const i = this.openKeys.indexOf(key);
      if (i >= 0) this.openKeys.splice(i, 1);
      else this.openKeys.push(key);
    },
  },
};
</script>

<style lang="scss" module>
.modalOverlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 4, 6, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 20px;
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.modalContent {
  position: relative;
  background: rgba(3, 4, 6, 0.85);
  background-image:
    radial-gradient(circle at 15% 12%, rgba(31, 84, 103, 0.20), transparent 38%),
    radial-gradient(circle at 85% 88%, rgba(139, 233, 253, 0.09), transparent 32%);
  border-radius: 20px;
  width: 100%;
  max-width: 880px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(31, 84, 103, 0.5),
    inset 0 0 24px rgba(139, 233, 253, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  animation: floatIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
}

.modalContent::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #8BE9FD, #1F5467, transparent);
  opacity: 0.8;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  pointer-events: none;
}

.closeButton {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #a0aab2;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 3;
  padding: 0;

  &:hover {
    background: rgba(255, 95, 95, 0.1);
    border-color: rgba(255, 95, 95, 0.3);
    color: #ff7e7e;
  }
}

.modalContent {
  max-height: calc(100vh - 56px);
}

.modalBody {
  padding: 24px 24px 18px;
}

.intro {
  margin-bottom: 16px;
  padding-right: 36px;
}

.eyebrow {
  display: inline-block;
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #8BE9FD;
  font-weight: 700;
  background: rgba(139, 233, 253, 0.08);
  border: 1px solid rgba(139, 233, 253, 0.25);
  border-radius: 999px;
  padding: 4px 11px;
  margin-bottom: 9px;
}

.intro h3 {
  font-size: 20px;
  font-weight: 800;
  color: #fff;
  margin: 0;
  letter-spacing: -0.5px;
  text-shadow: 0 0 20px rgba(139, 233, 253, 0.25);
}

.groups {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.group {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(139, 233, 253, 0.15);
  border-radius: 12px;
  padding: 0 4px 0 14px;
  transition: border-color 0.2s ease, background 0.2s ease;

  &.open {
    background: rgba(0, 0, 0, 0.38);
    border-color: rgba(139, 233, 253, 0.25);
    padding-bottom: 8px;
  }
}

.groupHead {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 11px 10px 11px 0;
  margin: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  transition: opacity 0.2s ease;

  &:hover { opacity: 0.85; }
}

.chevron {
  margin-left: auto;
  color: rgba(139, 233, 253, 0.6);
  flex-shrink: 0;
  transition: transform 0.25s ease;

  .open & { transform: rotate(180deg); color: #8BE9FD; }
}

.groupLabel {
  font-size: 11px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #8BE9FD;
  font-weight: 700;
}

.groupCount {
  font-size: 11px;
  font-weight: 700;
  color: #a0aab2;
  background: rgba(139, 233, 253, 0.08);
  border: 1px solid rgba(139, 233, 253, 0.2);
  border-radius: 999px;
  padding: 1px 8px;
}

.strip {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(165px, 1fr));
  gap: 4px 8px;
  padding: 2px 8px 4px 0;
}

.card {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 6px 8px;
  border-radius: 10px;
  text-decoration: none;
  transition: background 0.18s ease;

  &:hover {
    background: rgba(139, 233, 253, 0.07);

    .avatar { border-color: rgba(139, 233, 253, 0.55); }
    .cardName { color: #8BE9FD; }
  }
}

.avatar {
  flex: 0 0 42px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(139, 233, 253, 0.18);
  transition: border-color 0.18s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.avatarFallback {
  width: 100%;
  height: 100%;
  display: block;
  color: rgba(154, 170, 178, 0.42);
  background: rgba(255, 255, 255, 0.05);

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.cardName {
  font-size: 12px;
  font-weight: 600;
  color: #e0e6ed;
  line-height: 1.25;
  transition: color 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cardRole {
  font-size: 10.5px;
  color: #80868b;
  line-height: 1.25;
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@keyframes floatIn {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@media (max-width: 768px) {
  .modalOverlay { padding: 10px; }
  .modalContent { border-radius: 16px; max-height: calc(100dvh - 20px); }
  .modalBody { padding: 22px 14px 16px; }
  .intro { margin-bottom: 12px; }
  .intro h3 { font-size: 17px; }
  .groups { gap: 10px; }
  .group { padding: 9px 4px 7px 12px; }
  .strip { grid-template-columns: repeat(auto-fill, minmax(138px, 1fr)); }
  .card { gap: 8px; padding: 5px 6px; }
  .avatar { flex-basis: 38px; width: 38px; height: 38px; }
  .cardName { font-size: 11.5px; }
  .cardRole { font-size: 10px; }
}
</style>

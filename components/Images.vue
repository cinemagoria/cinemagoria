<template>
  <div class="spacing">
    <div :class="$style.panel">
      <div :class="$style.head">
        <h2 :class="$style.title">
          {{ title }}
        </h2>

        <strong :class="$style.count">
          {{ imagesCount }}
        </strong>
      </div>

      <div :class="$style.items">
        <ImagesItem
          v-for="(image, index) in images"
          :key="`image-${index}`"
          :image="image"
          :index="index"
          :type="type"
          @openModal="openModal" />
      </div>
    </div>

    <Modal
      v-if="modalVisible"
      :data="images"
      modifier="modal--images"
      aria-label="Imágenes"
      nav
      :start-at="modalStartAt"
      @close="closeModal" />
  </div>
</template>

<script>
import { apiImgUrl } from '~/utils/api';
import ImagesItem from '~/components/ImagesItem';
import Modal from '~/components/Modal';

export default {
  components: {
    ImagesItem,
    Modal,
  },

  props: {
    title: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    images: {
      type: Array,
      required: true,
    },
  },

  data () {
    return {
      modalVisible: false,
      modalStartAt: 0,
    };
  },

  computed: {
    imagesCount () {
      return `${this.images.length} ${this.images.length > 1 ? 'Imágenes' : 'Imagen'}`;
    },
  },

  created () {
    this.handleData();
  },

  methods: {
    handleData () {
      let thumb;

      if (this.type === 'poster') {
        thumb = `${apiImgUrl}/w500`;
      } else {
        thumb = `${apiImgUrl}/w533_and_h300_bestv2`;
      }

      this.images.map((image) => {
        image.thumb = `${thumb}${image.file_path}`;
        image.src = `${apiImgUrl}/original${image.file_path}`;
      });
    },

    openModal (index) {
      this.modalStartAt = index;
      this.modalVisible = true;
    },

    closeModal () {
      this.modalVisible = false;
      this.modalStartAt = 0;
    },
  },
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.panel {
  position: relative;
  background: rgba(3, 4, 6, 0.55);
  background-image:
    radial-gradient(circle at 12% 12%, rgba(31, 84, 103, 0.16), transparent 34%),
    radial-gradient(circle at 88% 88%, rgba(139, 233, 253, 0.06), transparent 32%);
  border-radius: 20px;
  padding: 2rem;
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(31, 84, 103, 0.5),
    inset 0 0 20px rgba(139, 233, 253, 0.04);
  overflow: hidden;

  @media (min-width: $breakpoint-large) { padding: 2.5rem; }
}
.panel::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #8BE9FD, #1F5467, transparent);
  opacity: 0.8;
  pointer-events: none;
}

.head {
  display: flex;
  align-items: baseline;
  margin-bottom: 2rem;
}

.title {
  font-family: var(--font-display);
  font-size: var(--section-title-size);
  font-weight: var(--section-title-weight);
  letter-spacing: var(--section-title-tracking);
  line-height: var(--section-title-leading);
  color: #fff;
  text-shadow: 0 0 18px rgba(139, 233, 253, 0.18);
}

.count {
  margin-left: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #8BE9FD;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  opacity: 0.85;

  @media (min-width: $breakpoint-large) {
    font-size: 1.3rem;
  }
}

.items {
  display: flex;
  flex-wrap: wrap;
  margin-right: -0.4rem;
  margin-left: -0.4rem;
}
</style>

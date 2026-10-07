<template>
  <div v-if="product" class="detail">
    <nav class="crumbs" aria-label="Breadcrumb">
      <router-link to="/products">Collections</router-link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{{ product.name }}</span>
    </nav>

    <div class="detail-grid">
      <div class="media" :data-id="product.id">
        <img
          v-if="product.assetType === 'image'"
          :src="product.assetSrc"
          :alt="product.name"
          @load="assetReady = true"
          @error="assetReady = true"
        />
        <template v-else>
          <video
            ref="videoEl"
            :src="product.assetSrc"
            :poster="product.poster || undefined"
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
            @loadeddata="assetReady = true"
            @error="assetReady = true"
            @play="isPlaying = true"
            @pause="isPlaying = false"
          ></video>
          <button
            class="btn btn-ghost btn-sm media-toggle"
            type="button"
            :aria-label="isPlaying ? `Pause ${product.name}` : `Play ${product.name}`"
            @click="togglePlayback"
          >
            {{ isPlaying ? 'Pause' : 'Play' }}
          </button>
        </template>
        <div v-if="!assetReady" class="skeleton" aria-hidden="true"></div>
      </div>

      <div class="info">
        <p class="kicker">{{ product.category }}</p>
        <h1>{{ product.name }}</h1>
        <p class="price">{{ formatPrice(product.price) }}</p>
        <p class="desc">{{ product.description }}</p>

        <dl class="specs">
          <div v-for="spec in specs" :key="spec.label">
            <dt>{{ spec.label }}</dt>
            <dd>{{ spec.value }}</dd>
          </div>
        </dl>

        <div class="actions">
          <button class="btn btn-primary" type="button" @click="addToBag">Add to bag</button>
          <button class="btn" type="button" :aria-pressed="isSaved" @click="toggleSave">
            {{ isSaved ? 'Saved' : 'Save' }}
          </button>
        </div>

        <p class="status" role="status">{{ status }}</p>

        <router-link class="btn btn-ghost btn-sm consult" to="/support#message">
          Book a consultation
        </router-link>
      </div>
    </div>

    <section v-if="related.length" class="related">
      <h2>You may also like</h2>
      <ul>
        <li v-for="other in related" :key="other.id">
          <router-link :to="`/products/${other.id}`" class="related-card">
            <span class="related-thumb">
              <img v-if="other.assetType === 'image'" :src="other.assetSrc" alt="" loading="lazy" />
              <span v-else class="thumb-fallback" aria-hidden="true">
                {{ other.cut }}
              </span>
            </span>
            <span class="related-name">{{ other.name }}</span>
            <span class="related-price">{{ formatPrice(other.price) }}</span>
          </router-link>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { getProduct, relatedTo } from '@/data/products'
import { useBagStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { formatPrice } from '@/utils/format'

const route = useRoute()
const bag = useBagStore()
const wishlist = useWishlistStore()

const videoEl = ref<HTMLVideoElement | null>(null)
const assetReady = ref(false)
const isPlaying = ref(false)
const status = ref('')

const product = computed(() => getProduct(String(route.params.id)))

const specs = computed(() => {
  const item = product.value
  if (!item) {
    return []
  }

  return [
    { label: 'Category', value: item.category },
    { label: 'Metal', value: item.metal },
    { label: 'Carat', value: `${item.carat.toFixed(2)} ct` },
    { label: 'Cut', value: item.cut },
    { label: 'Clarity', value: item.clarity },
    { label: 'Colour', value: item.colour },
  ]
})

const related = computed(() => (product.value ? relatedTo(product.value) : []))
const isSaved = computed(() => (product.value ? wishlist.has(product.value.id) : false))

const togglePlayback = () => {
  if (!videoEl.value) {
    return
  }

  if (videoEl.value.paused) {
    void videoEl.value.play()
  } else {
    videoEl.value.pause()
  }
}

const addToBag = () => {
  if (!product.value) {
    return
  }

  bag.add(product.value.id)
  status.value = `${product.value.name} was added to your bag.`
}

const toggleSave = () => {
  if (!product.value) {
    return
  }

  wishlist.toggle(product.value.id)
  status.value = isSaved.value ? 'Saved to your wishlist.' : 'Removed from your wishlist.'
}

watch(
  product,
  () => {
    assetReady.value = false
    isPlaying.value = false
    status.value = ''
  },
  { immediate: true },
)
</script>

<style scoped>
.detail {
  min-height: 100vh;
  padding: clamp(1.3rem, 2vw, 2.2rem) clamp(1.1rem, 3vw, 3.5rem) 3rem;
  background: linear-gradient(170deg, rgba(6, 8, 15, 0.96), rgba(12, 15, 24, 0.84));
}

.crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.4rem;
  font-size: 0.74rem;
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--color-text-faint);
}

.crumbs a {
  color: var(--color-text-muted);
  text-decoration: none;
}

.crumbs a:hover {
  color: var(--gold-bright);
}

.detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: clamp(1.2rem, 3vw, 2.6rem);
  align-items: start;
}

.media {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  aspect-ratio: 4 / 3;
  background: linear-gradient(130deg, rgba(24, 28, 46, 0.95), rgba(12, 14, 23, 0.8));
  box-shadow: var(--shadow-card);
}

.media img,
.media video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-toggle {
  position: absolute;
  right: 0.7rem;
  bottom: 0.7rem;
  background: rgba(4, 5, 10, 0.78);
  backdrop-filter: blur(6px);
}

.skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    100deg,
    rgba(255, 255, 255, 0.04) 20%,
    rgba(255, 255, 255, 0.12) 45%,
    rgba(255, 255, 255, 0.04) 70%
  );
  background-size: 220% 100%;
  animation: shimmer 1.4s linear infinite;
}

@keyframes shimmer {
  from {
    background-position: 140% 0;
  }

  to {
    background-position: -40% 0;
  }
}

.info {
  display: grid;
  gap: 0.85rem;
  align-content: start;
}

.kicker {
  margin: 0;
  color: var(--gold);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 0.72rem;
}

.info h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 3.4vw, 2.8rem);
  line-height: 1.08;
}

.price {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 2.4vw, 1.7rem);
  color: var(--gold-bright);
}

.desc {
  margin: 0;
  color: var(--color-text-muted);
}

.specs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 0.7rem;
  margin: 0.4rem 0 0;
  padding: 1rem 0 0;
  border-top: 1px solid var(--border);
}

.specs div {
  display: grid;
  gap: 0.15rem;
}

.specs dt {
  font-size: 0.68rem;
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--color-text-faint);
}

.specs dd {
  margin: 0;
  font-size: 0.92rem;
  color: var(--color-ivory);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: 0.3rem;
}

.status {
  min-height: 1.2em;
  margin: 0;
  font-size: 0.8rem;
  color: var(--success);
}

.consult {
  margin-top: 0.3rem;
}

.related {
  margin-top: clamp(2rem, 4vw, 3.4rem);
  padding-top: 1.6rem;
  border-top: 1px solid var(--border);
}

.related h2 {
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 2.6vw, 1.9rem);
}

.related ul {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.related-card {
  display: grid;
  gap: 0.5rem;
  padding: 0.7rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  text-decoration: none;
  transition:
    border-color var(--speed-base) var(--ease),
    transform var(--speed-base) var(--ease);
}

.related-card:hover {
  border-color: var(--border-gold);
  transform: translateY(-3px);
}

.related-thumb {
  display: block;
  overflow: hidden;
  border-radius: var(--radius-sm);
  aspect-ratio: 4 / 3;
}

.related-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(130deg, rgba(24, 28, 46, 0.95), rgba(12, 14, 23, 0.8));
  color: var(--gold);
  font-family: var(--font-display);
  font-size: 1.1rem;
  letter-spacing: 0.06em;
}

.related-name {
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--color-ivory);
}

.related-price {
  font-size: 0.86rem;
  color: var(--gold);
}

@media (max-width: 860px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>

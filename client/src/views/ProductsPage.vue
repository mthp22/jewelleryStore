<template>
  <div class="products-page">
    <header class="headline">
      <p class="kicker">Collections</p>
      <h1>Diamond Gallery</h1>
      <p>
        Discover brilliance reimagined—each diamond tells a story of elegance, crafted to sparkle
        from every angle.
      </p>
    </header>

    <div class="toolbar">
      <div class="search">
        <label class="sr-only" for="product-search">Search pieces</label>
        <input
          id="product-search"
          v-model="query"
          type="search"
          placeholder="Search pieces, cuts, metals…"
        />
      </div>

      <div class="chips" role="group" aria-label="Filter by category">
        <button
          v-for="option in categoryOptions"
          :key="option"
          class="chip"
          type="button"
          :class="{ active: activeCategory === option }"
          :aria-pressed="activeCategory === option"
          @click="activeCategory = option"
        >
          {{ option }}
        </button>
        <button
          class="chip"
          type="button"
          :class="{ active: savedOnly }"
          :aria-pressed="savedOnly"
          @click="savedOnly = !savedOnly"
        >
          Saved · {{ wishlist.count }}
        </button>
      </div>

      <div class="sort">
        <label for="product-sort">Sort</label>
        <select id="product-sort" v-model="sortBy">
          <option value="featured">Featured</option>
          <option value="price-asc">Price · low to high</option>
          <option value="price-desc">Price · high to low</option>
          <option value="name">Name · A to Z</option>
        </select>
      </div>
    </div>

    <p class="result-count" role="status">
      {{ filteredProducts.length }} {{ filteredProducts.length === 1 ? 'piece' : 'pieces' }}
    </p>

    <div v-if="filteredProducts.length" ref="gridRef" class="products-grid">
      <article
        v-for="item in filteredProducts"
        :key="item.id"
        :ref="(element) => setCardRef(item.id, element)"
        class="product-card"
        :data-id="item.id"
        :class="{ expanded: expandedId === item.id }"
        @click="onCardClick(item, $event)"
        @mouseenter="hoveredId = item.id"
        @mouseleave="hoveredId = null"
      >
        <div class="model-stage" :style="stageTransform(item.id)">
          <img
            v-if="isAssetVisible(item.id) && item.assetType === 'image'"
            :src="item.assetSrc"
            :alt="item.name"
            loading="lazy"
            @load="mediaReady[item.id] = true"
            @error="mediaReady[item.id] = true"
          />
          <video
            v-else-if="isAssetVisible(item.id)"
            :ref="(element) => setVideoRef(item.id, element)"
            :src="item.assetSrc"
            :poster="item.poster || undefined"
            :autoplay="wantsAutoplay"
            muted
            loop
            playsinline
            preload="metadata"
            @loadedmetadata="mediaReady[item.id] = true"
            @error="mediaReady[item.id] = true"
            @play="playing[item.id] = true"
            @pause="playing[item.id] = false"
          ></video>

          <div v-if="!mediaReady[item.id]" class="stage-skeleton" aria-hidden="true"></div>

          <button
            v-if="item.assetType === 'video'"
            class="stage-btn stage-play"
            type="button"
            :aria-label="`${playing[item.id] ? 'Pause' : 'Play'} ${item.name}`"
            @click.stop="togglePlayback(item.id)"
          >
            <span aria-hidden="true">{{ playing[item.id] ? '❚❚' : '▶' }}</span>
          </button>

          <button
            class="stage-btn stage-expand"
            type="button"
            :aria-expanded="expandedId === item.id"
            :aria-controls="detailId(item.id)"
            @click.stop="toggleExpanded(item.id)"
          >
            <span>{{ expandedId === item.id ? 'Collapse' : 'Expand' }}</span>
            <svg class="chevron" width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
              <path
                d="M1 1l4 4 4-4"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>

        <div class="card-copy">
          <p class="card-category">{{ item.category }}</p>
          <h2>
            <router-link :to="`/products/${item.id}`">{{ item.name }}</router-link>
          </h2>
          <p>{{ item.description }}</p>
          <p class="card-price">{{ formatPrice(item.price) }}</p>
        </div>

        <div class="card-actions">
          <button
            class="btn btn-sm"
            type="button"
            :aria-pressed="wishlist.has(item.id)"
            @click.stop="wishlist.toggle(item.id)"
          >
            {{ wishlist.has(item.id) ? 'Saved' : 'Save' }}
          </button>
          <button class="btn btn-primary btn-sm" type="button" @click.stop="bag.add(item.id)">
            Add to bag
          </button>
        </div>

        <div :id="detailId(item.id)" class="card-detail" :class="{ open: expandedId === item.id }">
          <div class="card-detail-inner">
            <dl class="mini-specs">
              <div>
                <dt>Carat</dt>
                <dd>{{ item.carat.toFixed(2) }} ct</dd>
              </div>
              <div>
                <dt>Cut</dt>
                <dd>{{ item.cut }}</dd>
              </div>
              <div>
                <dt>Clarity</dt>
                <dd>{{ item.clarity }}</dd>
              </div>
              <div>
                <dt>Colour</dt>
                <dd>{{ item.colour }}</dd>
              </div>
              <div>
                <dt>Metal</dt>
                <dd>{{ item.metal }}</dd>
              </div>
            </dl>
            <router-link class="btn btn-sm" :to="`/products/${item.id}`">
              View full details
            </router-link>
          </div>
        </div>

        <div class="controls">
          <label class="zoom-wrap" :for="`zoom-${item.id}`">
            Zoom
            <input
              :id="`zoom-${item.id}`"
              type="range"
              min="1"
              max="1.8"
              step="0.05"
              :value="zoomValue(item.id)"
              @click.stop
              @input="setZoom(item.id, $event)"
            />
            <span class="zoom-value">{{ zoomPercent(item.id) }}</span>
          </label>
        </div>
      </article>
    </div>

    <div v-else class="empty">
      <p>No pieces match those filters yet.</p>
      <button class="btn btn-sm" type="button" @click="resetFilters">Reset filters</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { categories, products, type Category, type Product } from '@/data/products'
import { useBagStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { formatPrice } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const bag = useBagStore()
const wishlist = useWishlistStore()

const categoryOptions: Array<'All' | Category> = ['All', ...categories]

const query = ref('')
const activeCategory = ref<'All' | Category>('All')
const sortBy = ref<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured')
const savedOnly = ref(route.query.filter === 'saved')

const hoveredId = ref<string | null>(null)
const expandedId = ref<string | null>(null)
const gridRef = ref<HTMLElement | null>(null)

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const wantsAutoplay = !reducedMotion.matches

const visibleAssets = reactive<Record<string, boolean>>({})
const mediaReady = reactive<Record<string, boolean>>({})
const playing = reactive<Record<string, boolean>>({})
const userPaused = reactive<Record<string, boolean>>({})
const zoom = reactive<Record<string, number>>({})
const cardRefs = reactive<Record<string, HTMLElement | null>>({})
const videoRefs = reactive<Record<string, HTMLVideoElement | null>>({})

for (const item of products) {
  zoom[item.id] = 1
}

const filteredProducts = computed(() => {
  const needle = query.value.trim().toLowerCase()

  const matches = products.filter((item) => {
    if (activeCategory.value !== 'All' && item.category !== activeCategory.value) {
      return false
    }

    if (savedOnly.value && !wishlist.has(item.id)) {
      return false
    }

    if (!needle) {
      return true
    }

    return `${item.name} ${item.description} ${item.cut} ${item.metal} ${item.category}`
      .toLowerCase()
      .includes(needle)
  })

  switch (sortBy.value) {
    case 'price-asc':
      return [...matches].sort((a, b) => a.price - b.price)
    case 'price-desc':
      return [...matches].sort((a, b) => b.price - a.price)
    case 'name':
      return [...matches].sort((a, b) => a.name.localeCompare(b.name))
    default:
      return matches
  }
})

const resetFilters = () => {
  query.value = ''
  activeCategory.value = 'All'
  sortBy.value = 'featured'
  savedOnly.value = false
}

const detailId = (id: string) => `detail-${id}`

const setCardRef = (id: string, element: unknown) => {
  cardRefs[id] = element instanceof HTMLElement ? element : null
}

const setVideoRef = (id: string, element: unknown) => {
  videoRefs[id] = element instanceof HTMLVideoElement ? element : null
}

const stageTransform = (id: string) => {
  const scale = hoveredId.value === id ? (zoom[id] ?? 1) + 0.03 : (zoom[id] ?? 1)

  return {
    transform: `perspective(1100px) scale(${scale})`,
  }
}

const zoomValue = (id: string) => zoom[id] ?? 1

const zoomPercent = (id: string) => `${Math.round(zoomValue(id) * 100)}%`

const setZoom = (id: string, event: Event) => {
  const target = event.target as HTMLInputElement
  zoom[id] = Number(target.value)
}

const toggleExpanded = (id: string) => {
  const willExpand = expandedId.value !== id
  expandedId.value = willExpand ? id : null

  if (!willExpand) {
    return
  }

  void nextTick(() => {
    cardRefs[id]?.scrollIntoView({
      behavior: reducedMotion.matches ? 'auto' : 'smooth',
      block: 'nearest',
    })
  })
}

const togglePlayback = (id: string) => {
  const video = videoRefs[id]
  if (!video) {
    return
  }

  if (video.paused) {
    userPaused[id] = false
    void video.play().catch(() => undefined)
  } else {
    userPaused[id] = true
    video.pause()
  }
}

const isAssetVisible = (id: string) => Boolean(visibleAssets[id])

// Clicking anywhere on the card opens the piece, but real controls keep their own behaviour.
const onCardClick = (item: Product, event: MouseEvent) => {
  const target = event.target as HTMLElement | null
  if (target?.closest('button, a, input, label, select, textarea')) {
    return
  }

  void router.push(`/products/${item.id}`)
}

let observer: IntersectionObserver | null = null

const observeCards = () => {
  if (!gridRef.value) {
    return
  }

  for (const card of gridRef.value.querySelectorAll<HTMLElement>('.product-card')) {
    const id = card.getAttribute('data-id')
    if (id) {
      observer?.observe(card)
    }
  }
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const id = entry.target.getAttribute('data-id')

        if (!id) {
          continue
        }

        if (entry.isIntersecting) {
          visibleAssets[id] = true

          if (!userPaused[id] && wantsAutoplay) {
            void videoRefs[id]?.play().catch(() => undefined)
          }
        } else {
          // Stop decoding video that is off screen.
          videoRefs[id]?.pause()
        }
      }
    },
    {
      rootMargin: '120px 0px',
      threshold: 0.12,
    },
  )

  observeCards()
})

watch(filteredProducts, () => void nextTick(observeCards), { flush: 'post' })

watch(savedOnly, (value) => {
  const nextQuery = value
    ? { ...route.query, filter: 'saved' }
    : { ...route.query, filter: undefined }
  void router.replace({ query: nextQuery })
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  padding: clamp(1.3rem, 2vw, 2.2rem) clamp(1.1rem, 3vw, 3.5rem) 3rem;
  background: linear-gradient(170deg, rgba(6, 8, 15, 0.96), rgba(12, 15, 24, 0.84));
}

.headline {
  margin-bottom: 1.5rem;
  max-width: 65ch;
}

.kicker {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.72rem;
  color: var(--gold);
}

.headline h1 {
  margin: 0.3rem 0 0.7rem;
  font-family: var(--font-display);
  font-size: clamp(1.9rem, 4vw, 3.4rem);
}

.headline p {
  margin: 0;
  color: var(--color-text-muted);
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
}

.search {
  flex: 1 1 220px;
}

.search input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface-sunken);
  color: var(--color-ivory);
  font: inherit;
  font-size: 0.88rem;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.chip {
  padding: 0.45rem 0.85rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--color-text-muted);
  font: inherit;
  font-size: 0.72rem;
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background var(--speed-fast) var(--ease),
    border-color var(--speed-fast) var(--ease),
    color var(--speed-fast) var(--ease);
}

.chip:hover {
  border-color: var(--border-gold);
  color: var(--gold-bright);
}

.chip.active {
  border-color: var(--border-gold);
  background: var(--gold-soft);
  color: var(--gold-bright);
}

.sort {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.72rem;
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--color-text-faint);
}

.sort select {
  padding: 0.5rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface-sunken);
  color: var(--color-ivory);
  font: inherit;
  font-size: 0.8rem;
}

.result-count {
  margin: 0.9rem 0;
  font-size: 0.74rem;
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--color-text-faint);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 1rem;
  max-width: 1400px;
  margin-inline: auto;
}

.product-card {
  position: relative;
  display: grid;
  gap: 0.85rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: linear-gradient(160deg, rgba(18, 22, 35, 0.94), rgba(10, 12, 21, 0.6));
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition:
    transform var(--speed-base) var(--ease),
    border-color var(--speed-base) var(--ease);
}

.product-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-gold);
}

.product-card.expanded {
  grid-column: 1 / -1;
}

.model-stage {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  aspect-ratio: 4 / 3;
  transform-origin: center;
  background: linear-gradient(130deg, rgba(24, 28, 46, 0.95), rgba(12, 14, 23, 0.8));
  transition:
    transform var(--speed-base) var(--ease),
    aspect-ratio var(--speed-slow) var(--ease);
}

.product-card.expanded .model-stage {
  aspect-ratio: 16 / 7;
}

.model-stage img,
.model-stage video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stage-skeleton {
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

.stage-btn {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.7rem;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: var(--radius-pill);
  background: rgba(4, 5, 10, 0.74);
  color: var(--color-ivory);
  backdrop-filter: blur(6px);
  font-family: var(--font-body);
  font-size: 0.66rem;
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  cursor: pointer;
  transition:
    border-color var(--speed-fast) var(--ease),
    background var(--speed-fast) var(--ease);
}

.stage-btn:hover {
  border-color: var(--border-gold);
  background: rgba(4, 5, 10, 0.92);
}

.stage-play {
  right: 0.65rem;
  bottom: 0.65rem;
}

.stage-expand {
  left: 0.65rem;
  bottom: 0.65rem;
}

.chevron {
  transition: transform var(--speed-base) var(--ease);
}

.stage-expand[aria-expanded='true'] .chevron {
  transform: rotate(180deg);
}

.card-copy {
  display: grid;
  gap: 0.3rem;
}

.card-category {
  margin: 0;
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold);
}

.card-copy h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.44rem;
}

.card-copy h2 a {
  color: inherit;
  text-decoration: none;
}

.card-copy h2 a:hover {
  color: var(--gold-bright);
}

.card-copy p {
  margin: 0;
  color: var(--color-text-muted);
}

.card-price {
  margin-top: 0.35rem !important;
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--gold-bright) !important;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.card-actions .btn {
  flex: 1 1 auto;
}

.card-detail {
  display: grid;
  grid-template-rows: 0fr;
  visibility: hidden;
  transition:
    grid-template-rows var(--speed-base) var(--ease),
    visibility 0s linear var(--speed-base);
}

.card-detail.open {
  grid-template-rows: 1fr;
  visibility: visible;
  transition-delay: 0s;
}

.card-detail-inner {
  display: grid;
  gap: 0.8rem;
  overflow: hidden;
  min-height: 0;
}

.mini-specs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 0.6rem;
  margin: 0;
  padding: 0.9rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface-sunken);
}

.mini-specs div {
  display: grid;
  gap: 0.1rem;
}

.mini-specs dt {
  font-size: 0.64rem;
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--color-text-faint);
}

.mini-specs dd {
  margin: 0;
  font-size: 0.88rem;
  color: var(--color-ivory);
}

.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem;
}

.zoom-wrap {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-faint);
}

.zoom-wrap input {
  flex: 1 1 auto;
  width: min(180px, 100%);
}

.zoom-value {
  min-width: 3.2rem;
  text-align: right;
  color: var(--gold);
}

.empty {
  display: grid;
  justify-items: start;
  gap: 0.9rem;
  padding: 2.5rem 1.4rem;
  border: 1px dashed var(--border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
}

.empty p {
  margin: 0;
}

@media (max-width: 700px) {
  .product-card.expanded {
    grid-column: auto;
  }

  .product-card.expanded .model-stage {
    aspect-ratio: 4 / 3;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .sort {
    justify-content: space-between;
  }
}
</style>

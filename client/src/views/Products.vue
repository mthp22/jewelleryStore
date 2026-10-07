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

    <div class="products-grid">
      <article
        v-for="item in products"
        :key="item.id"
        class="product-card"
        :data-id="item.id"
        :class="{ expanded: expandedId === item.id }"
        @mouseenter="hoveredId = item.id"
        @mouseleave="hoveredId = null"
      >
        <button
          class="btn btn-ghost btn-sm expand-toggle"
          type="button"
          @click="toggleExpanded(item.id)"
        >
          {{ expandedId === item.id ? 'Collapse' : 'Expand' }}
        </button>

        <div class="model-stage" :style="stageTransform(item.id)">
          <template v-if="isAssetVisible(item.id)">
            <img
              v-if="item.assetType === 'image'"
              :src="item.assetSrc"
              :alt="item.name"
              loading="lazy"
            />
            <video
              v-else
              :src="item.assetSrc"
              :poster="item.poster"
              autoplay
              muted
              loop
              playsinline
              preload="none"
            ></video>
          </template>
          <div v-else class="media-placeholder">Loading preview…</div>
        </div>

        <div class="card-copy">
          <h2>{{ item.name }}</h2>
          <p>{{ item.description }}</p>
        </div>

        <div class="controls" :aria-label="`${item.name} controls`">
          <!-- <button
            type="button"
            class="control"
            @click="rotate(item.id, -8)"
            :aria-label="`Rotate ${item.name} left`"
          >
            Rotate Left
          </button>
          <button
            type="button"
            class="control"
            @click="rotate(item.id, 8)"
            :aria-label="`Rotate ${item.name} right`"
          >
            Rotate Right
          </button> -->

          <label class="zoom-wrap" :for="`zoom-${item.id}`">
            Zoom
            <input
              :id="`zoom-${item.id}`"
              type="range"
              min="1"
              max="1.8"
              step="0.05"
              :value="zoomValue(item.id)"
              @input="setZoom(item.id, $event)"
            />
          </label>
        </div>
      </article>
    </div>
    <footer class="note">
      <p>Images and videos are sourced from Ralph Jacobs https://ralphjacobs.co.za/</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'

type Product = {
  id: string
  name: string
  description: string
  assetType: 'image' | 'video'
  assetSrc: string
  poster?: string
}

const products: Product[] = [
  {
    id: 'solstice-ring',
    name: 'Arya Platinum Hidden Halo Engagement Ring',
    description: 'Timeless Elegance with the Arya Design',
    assetType: 'video',
    assetSrc:
      'https://ralphjacobs.co.za/cdn/shop/videos/c/vp/7812236f3c42459ca303183f539a06e5/7812236f3c42459ca303183f539a06e5.HD-720p-3.0Mbps-36052827.mp4?v=0',
    poster: '',
  },
  {
    id: 'aurelia-necklace',
    name: 'Betty Platinum Solitaire Engagement Ring',
    description: 'Graduated marquise drops with concealed settings for seamless sparkle.',
    assetType: 'video',
    assetSrc:
      'https://ralphjacobs.co.za/cdn/shop/videos/c/vp/207a749ea1b5470599c9353600d9c399/207a749ea1b5470599c9353600d9c399.HD-720p-3.0Mbps-36027974.mp4?v=0',
  },
  {
    id: 'north-star-earrings',
    name: 'North Star Earrings',
    description: 'Asymmetric cluster composition with exceptional light return in motion.',
    assetType: 'image',
    assetSrc:
      'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&w=1200&q=80',
  },
]

const hoveredId = ref<string | null>(null)
const expandedId = ref<string | null>(null)
const visibleAssets = reactive<Record<string, boolean>>({})

const state = reactive<Record<string, { rotation: number; zoom: number }>>(
  Object.fromEntries(products.map((item) => [item.id, { rotation: 0, zoom: 1 }])) as Record<
    string,
    { rotation: number; zoom: number }
  >,
)

let observer: IntersectionObserver | null = null
const getState = (id: string) => {
  const existing = state[id]
  if (existing) {
    return existing
  }

  state[id] = { rotation: 0, zoom: 1 }
  return state[id]
}

const stageTransform = (id: string) => {
  const current = getState(id)
  const isHovered = hoveredId.value === id
  const scale = isHovered ? current.zoom + 0.03 : current.zoom

  return {
    transform: `perspective(1100px) rotateY(${current.rotation}deg) scale(${scale})`,
  }
}

// const rotate = (id: string, amount: number) => {
//   getState(id).rotation += amount
// }

const setZoom = (id: string, event: Event) => {
  const target = event.target as HTMLInputElement
  getState(id).zoom = Number(target.value)
}

const zoomValue = (id: string) => getState(id).zoom

const toggleExpanded = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id
}

const isAssetVisible = (id: string) => Boolean(visibleAssets[id])

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const id = entry.target.getAttribute('data-id')

        if (!id || !entry.isIntersecting) {
          continue
        }

        visibleAssets[id] = true
        observer?.unobserve(entry.target)
      }
    },
    {
      rootMargin: '120px 0px',
      threshold: 0.12,
    },
  )

  for (const card of document.querySelectorAll<HTMLElement>('.product-card')) {
    const id = card.getAttribute('data-id')
    if (id) {
      observer.observe(card)
    }
  }
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
.note {
  display: flex;
  justify-content: center;
  padding: 1.4rem;
  color: var(--color-text-faint);
  font-size: 0.78rem;
  letter-spacing: 0.03em;
  text-align: center;
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

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
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

.expand-toggle {
  justify-self: flex-end;
}

.model-stage {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  aspect-ratio: 4 / 3;
  transform-origin: center;
  transition: transform var(--speed-base) var(--ease);
  background: linear-gradient(130deg, rgba(24, 28, 46, 0.95), rgba(12, 14, 23, 0.8));
}

.model-stage img,
.model-stage video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-faint);
}

.card-copy h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.44rem;
}

.card-copy p {
  margin: 0.34rem 0 0;
  color: var(--color-text-muted);
}

.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem;
}

.control {
  border: 1px solid rgba(255, 255, 255, 0.26);
  background: rgba(12, 15, 27, 0.4);
  color: #f4ecdf;
  font-size: 0.75rem;
  padding: 0.48rem 0.65rem;
}

.zoom-wrap {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.zoom-wrap input {
  width: min(180px, 100%);
}

@media (max-width: 700px) {
  .product-card.expanded {
    grid-column: auto;
  }

  .controls {
    align-items: stretch;
  }

  .control,
  .zoom-wrap {
    width: 100%;
  }

  .zoom-wrap {
    justify-content: space-between;
  }
}
</style>

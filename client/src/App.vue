<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">Skip to main content</a>

    <div class="backdrop" aria-hidden="true">
      <video v-if="showVideo" ref="videoRef" class="bg-video" autoplay muted loop playsinline>
        <source src="/video/video1.mp4" type="video/mp4" />
      </video>
      <div class="overlay"></div>
      <div class="vignette"></div>
    </div>

    <div class="site-layer">
      <nav ref="navRef" class="navbar" aria-label="Primary">
        <router-link class="logo" to="/">Diamond Shop</router-link>

        <button
          class="nav-toggle btn btn-ghost btn-sm"
          type="button"
          :aria-expanded="isMenuOpen"
          aria-controls="primary-nav"
          @click="isMenuOpen = !isMenuOpen"
        >
          <span class="burger" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
          {{ isMenuOpen ? 'Close' : 'Menu' }}
        </button>

        <ul id="primary-nav" class="nav-links" :class="{ open: isMenuOpen }">
          <li v-for="link in navLinks" :key="link.to">
            <router-link
              :to="link.to"
              :class="{ 'is-active': isActive(link.to) }"
              @click="closeMenu"
            >
              {{ link.label }}
            </router-link>
          </li>
        </ul>
      </nav>

      <main id="main-content" class="route-stage" tabindex="-1">
        <router-view />
      </main>

      <SiteFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import SiteFooter from '@/components/SiteFooter.vue'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Collections' },
  { to: '/support', label: 'Support' },
]

const route = useRoute()
const videoRef = ref<HTMLVideoElement | null>(null)
const navRef = ref<HTMLElement | null>(null)
const isMenuOpen = ref(false)

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const showVideo = computed(() => route.name === 'Home' && !reducedMotion.matches)

let navObserver: ResizeObserver | null = null

const isActive = (path: string) => (path === '/' ? route.path === '/' : route.path.startsWith(path))

const closeMenu = () => {
  isMenuOpen.value = false
}

const playVideo = async () => {
  if (!showVideo.value) {
    return
  }

  await nextTick()

  if (!videoRef.value) {
    return
  }

  videoRef.value.muted = true

  try {
    await videoRef.value.play()
  } catch {
    // Browser autoplay policies may block play in some contexts.
  }
}

// The stage height depends on a navbar that wraps at different breakpoints,
// so measure it instead of hard-coding a pixel value.
const measureNav = () => {
  if (!navRef.value) {
    return
  }

  navObserver = new ResizeObserver((entries) => {
    const entry = entries[0]
    if (entry) {
      document.documentElement.style.setProperty(
        '--nav-h',
        `${Math.round(entry.contentRect.height)}px`,
      )
    }
  })

  navObserver.observe(navRef.value)
}

onMounted(() => {
  void playVideo()
  measureNav()
})

onBeforeUnmount(() => {
  navObserver?.disconnect()
})

watch(showVideo, () => {
  void playVideo()
})

watch(
  () => route.fullPath,
  () => {
    closeMenu()
  },
)
</script>

<style scoped>
.app-shell {
  position: relative;
  min-height: 100vh;
  overflow-x: clip;
  background: var(--bg);
}

.backdrop {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.bg-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.74) contrast(1.05);
}

.overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      160deg,
      rgba(2, 2, 8, 0.72) 8%,
      rgba(6, 8, 16, 0.2) 42%,
      rgba(4, 4, 9, 0.85) 95%
    ),
    radial-gradient(circle at 22% 24%, rgba(255, 236, 190, 0.18), transparent 54%);
}

.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 38%, rgba(0, 0, 0, 0.58) 100%);
}

.site-layer {
  position: relative;
  z-index: 2;
  min-height: 100vh;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem clamp(1.25rem, 2vw, 2.2rem);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(8px);
  background: linear-gradient(180deg, rgba(4, 5, 10, 0.72), rgba(4, 5, 10, 0.35));
}

.logo {
  color: var(--color-ivory);
  text-decoration: none;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  font-size: clamp(0.82rem, 1.8vw, 0.96rem);
  font-family: var(--font-display);
}

.nav-toggle {
  display: none;
  align-items: center;
  gap: 0.55rem;
  margin-left: auto;
}

.burger {
  display: grid;
  gap: 3px;
}

.burger span {
  display: block;
  width: 15px;
  height: 1.5px;
  background: currentColor;
  transition: transform var(--speed-fast) var(--ease);
}

.nav-links {
  margin: 0;
  padding: 0;
  display: flex;
  list-style: none;
  gap: clamp(0.9rem, 2vw, 1.8rem);
}

.nav-links a {
  position: relative;
  display: inline-block;
  padding-bottom: 0.25rem;
  color: var(--color-text-muted);
  text-decoration: none;
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  font-size: 0.72rem;
  transition: color var(--speed-fast) var(--ease);
}

.nav-links a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background: var(--gold);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform var(--speed-base) var(--ease);
}

.nav-links a:hover,
.nav-links a.is-active {
  color: var(--gold-bright);
}

.nav-links a:hover::after,
.nav-links a.is-active::after {
  transform: scaleX(1);
}

.route-stage {
  min-height: calc(100vh - var(--nav-h, 72px));
}

@media (max-width: 720px) {
  .navbar {
    flex-wrap: wrap;
  }

  .nav-toggle {
    display: inline-flex;
  }

  .nav-links {
    flex-basis: 100%;
    flex-direction: column;
    gap: 0;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    border-top: 1px solid transparent;
    background: rgba(4, 5, 10, 0.97);
    transition:
      max-height var(--speed-base) var(--ease),
      opacity var(--speed-fast) var(--ease),
      border-color var(--speed-fast) var(--ease);
  }

  .nav-links.open {
    max-height: 240px;
    opacity: 1;
    border-top-color: var(--border);
  }

  .nav-links li {
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .nav-links a {
    display: block;
    padding: 0.95rem 0.25rem;
  }

  .nav-links a::after {
    bottom: 0.55rem;
    width: 2.4rem;
  }
}
</style>

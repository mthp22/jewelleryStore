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
      <nav class="navbar">
        <router-link class="logo" to="/">Diamond Shop</router-link>

        <ul class="nav-links">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/products">Collections</router-link></li>
          <li><router-link to="/support">Support</router-link></li>
        </ul>
      </nav>

      <main id="main-content" class="route-stage" tabindex="-1">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const videoRef = ref<HTMLVideoElement | null>(null)
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const showVideo = computed(() => route.name === 'Home' && !reducedMotion.matches)

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

onMounted(playVideo)

watch(showVideo, () => {
  void playVideo()
})
</script>

<style scoped>
:global(html),
:global(#app) {
  min-height: 100%;
  background: var(--bg);
}

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

.nav-links {
  margin: 0;
  padding: 0;
  display: flex;
  list-style: none;
  gap: clamp(0.9rem, 2vw, 1.8rem);
}

.nav-links a {
  color: var(--color-text-muted);
  text-decoration: none;
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  font-size: 0.72rem;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #fff;
}

.route-stage {
  min-height: calc(100vh - 72px);
}

@media (max-width: 720px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-links {
    width: 100%;
    justify-content: space-between;
  }
}
</style>

<template>
  <div class="app-shell">
    <div class="backdrop" aria-hidden="true">
      <video
        v-if="showVideo"
        ref="videoRef"
        class="bg-video"
        autoplay
        muted
        loop
        playsinline
      >
        <source src="/video/video1.mp4" type="video/mp4" />
      </video>
      <div class="overlay"></div>
      <div class="vignette"></div>
    </div>

    <div class="site-layer">
      <nav class="navbar">
        <router-link class="logo" to="/">
          <span class="logo-icon">✦</span>
          <span class="logo-text">Diamond Shop</span>
        </router-link>

        <button 
          class="mobile-menu-toggle" 
          @click="toggleMobileMenu"
          :aria-expanded="isMobileMenuOpen"
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul class="nav-links" :class="{ 'nav-open': isMobileMenuOpen }">
          <li><router-link to="/" @click="closeMobileMenu"><span class="link-inner">Home</span></router-link></li>
          <li><router-link to="/products" @click="closeMobileMenu"><span class="link-inner">Collections</span></router-link></li>
          <li><router-link to="/support" @click="closeMobileMenu"><span class="link-inner">Support</span></router-link></li>
        </ul>
      </nav>

      <main class="route-stage">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const videoRef = ref<HTMLVideoElement | null>(null)
const showVideo = computed(() => route.name === 'Home')
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
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

onMounted(playVideo)

watch(showVideo, () => {
  void playVideo()
})
</script>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

:global(html),
:global(body),
:global(#app) {
  margin: 0;
  min-height: 100%;
  background: #07080d;
  color: #f8f5ef;
  font-family: 'Avenir Next', 'Segoe UI', sans-serif;
}

.app-shell {
  position: relative;
  min-height: 100vh;
  overflow-x: clip;
  background: #07080d;
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
    linear-gradient(160deg, rgba(2, 2, 8, 0.72) 8%, rgba(6, 8, 16, 0.2) 42%, rgba(4, 4, 9, 0.85) 95%),
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  background: linear-gradient(180deg, rgba(4, 5, 10, 0.72), rgba(4, 5, 10, 0.35));
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #f7f0e4;
  text-decoration: none;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: clamp(0.82rem, 1.8vw, 0.96rem);
  font-family: 'Bodoni MT', 'Didot', serif;
}

.logo-icon {
  font-size: 1.4rem;
  color: #ffe4be;
}

.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 28px;
  height: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 30;
}

.mobile-menu-toggle span {
  display: block;
  width: 100%;
  height: 2px;
  background: #f7f0e4;
  transition: all 0.3s ease;
}

.mobile-menu-toggle[aria-expanded="true"] span:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}

.mobile-menu-toggle[aria-expanded="true"] span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-toggle[aria-expanded="true"] span:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
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
  color: rgba(245, 239, 231, 0.94);
  text-decoration: none;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.72rem;
  transition: color 0.3s ease;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #fff;
}

.link-inner::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background: rgba(255, 228, 190, 0.6);
  transition: width 0.3s ease;
}

.nav-links a:hover .link-inner::after,
.nav-links a.router-link-active .link-inner::after {
  width: 100%;
}

.route-stage {
  min-height: calc(100vh - 72px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 720px) {
  .mobile-menu-toggle {
    display: flex;
  }

  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    width: 70%;
    max-width: 300px;
    height: 100vh;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    background: rgba(4, 5, 10, 0.98);
    backdrop-filter: blur(12px);
    transition: right 0.3s ease;
    z-index: 25;
  }

  .nav-links.nav-open {
    right: 0;
  }

  .nav-links a {
    font-size: 1rem;
  }
}
</style>

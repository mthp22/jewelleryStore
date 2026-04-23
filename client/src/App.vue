<template>
  <div class="app">
    <!-- VIDEO -->
    <video
      ref="videoRef"
      class="bg-video"
      autoplay
      muted
      loop
      playsinline
    >
      <!-- ⚠️ IMPORTANT: use correct path -->
      <source src="/video/video1.mp4" type="video/mp4" />
    </video>

    <!-- OVERLAY (non-blocking) -->
    <div class="overlay"></div>

    <!-- NAVBAR -->
    <nav class="navbar">
      <div class="logo">Diamond Shop</div>

      <ul class="nav-links">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/products">Collections</router-link></li>
        <li><router-link to="/support">Contact</router-link></li>
      </ul>
    </nav>

    <!-- HERO -->
    <div class="hero">
      <div class="hero-content">
        <h1>Timeless Diamonds</h1>
        <p>Crafted to brilliance</p>
        <router-link to="/products" class="cta">
          Explore Collection
        </router-link>
      </div>
    </div>

    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const videoRef = ref<HTMLVideoElement | null>(null);

onMounted(() => {
  if (videoRef.value) {
    videoRef.value.muted = true;

    // force play (fix autoplay blocking)
    const playPromise = videoRef.value.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        console.warn("Autoplay blocked");
      });
    }
  }
});
</script>

<style scoped>
/* BASE */
.app {
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  background: black;
}

/* VIDEO */
.bg-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
}

/* OVERLAY (IMPORTANT FIX) */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: -1;

  /* 🔥 THIS FIXES CLICK BLOCKING */
  pointer-events: none;
}

/* NAVBAR */
.navbar {
  position: relative; /* FIX */
  z-index: 10;        /* ABOVE EVERYTHING */

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 60px;

  color: white;
}

/* LOGO */
.logo {
  font-family: "Playfair Display", serif;
  letter-spacing: 3px;
  font-size: 22px;
}

/* NAV */
.nav-links {
  display: flex;
  list-style: none;
  gap: 40px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-size: 13px;
  letter-spacing: 2px;
}

.nav-links a:hover {
  opacity: 0.7;
}

/* HERO */
.hero {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-content {
  text-align: center;
  color: white;
}

.hero-content h1 {
  font-size: 3rem;
  font-family: "Playfair Display", serif;
}

.hero-content p {
  margin: 15px 0;
}

/* BUTTON */
.cta {
  border: 1px solid white;
  padding: 10px 25px;
  color: white;
  text-decoration: none;
}
</style>
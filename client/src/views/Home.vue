<template>
  <div class="home">
    <section id="home" :ref="setSectionRef('home')" class="panel hero-panel">
      <!-- <p class="eyebrow"></p> -->
      <h1>Diamonds With Cinematic Presence</h1>
      <p class="lead">
        A boutique collection designed for intimate evenings and unforgettable entrances.
      </p>
      <div class="hero-actions">
        <router-link class="action primary" to="/products">Browse Pieces</router-link>
        <router-link class="action" to="/support#message">Book A Consultation</router-link>
      </div>
    </section>

    <section id="craft" :ref="setSectionRef('craft')" class="panel info-panel">
      <h2>Studio Craft</h2>
      <p>
        Each stone is hand selected for fire, then set with precision to maximize movement and light.
      </p>
    </section>

    <section id="signature" :ref="setSectionRef('signature')" class="panel info-panel">
      <h2>Signature Cuts</h2>
      <p>
        Explore pear, radiant and oval silhouettes refined for sharp sparkle and a graceful profile.
      </p>
    </section>

    <section id="visit" :ref="setSectionRef('visit')" class="panel info-panel">
      <h2>Private Appointments</h2>
      <p>
        Visit our studio for personalized styling, custom settings and sourcing support.
      </p>
      <router-link class="action" to="/support#faq">See FAQs</router-link>
    </section>
    <footer class="note">
      <p>
        Images and videos are sourced from Ralph Jacobs https://ralphjacobs.co.za/
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { onBeforeUnmount, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type SectionKey = 'home' | 'craft' | 'signature' | 'visit'

const route = useRoute()
const router = useRouter()

const sectionRefs = reactive<Record<SectionKey, HTMLElement | null>>({
  home: null,
  craft: null,
  signature: null,
  visit: null,
})

let observer: IntersectionObserver | null = null
const setSectionRef =
  (key: SectionKey) =>
  (element: Element | ComponentPublicInstance | null) => {
    sectionRefs[key] = element instanceof HTMLElement ? element : null
  }

onMounted(() => {
  const sections = Object.entries(sectionRefs)

  observer = new IntersectionObserver(
    (entries) => {
      const topEntry = [...entries]
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

      if (!topEntry?.target.id) {
        return
      }

      const nextHash = `#${topEntry.target.id}`
      if (route.hash !== nextHash) {
        router.replace({ hash: nextHash })
      }
    },
    {
      rootMargin: '-35% 0px -40% 0px',
      threshold: [0.2, 0.45, 0.7],
    },
  )

  for (const [, element] of sections) {
    if (element) {
      observer.observe(element)
    }
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<style scoped>
.home {
  display: grid;
}

.note{
  display: flex;
  justify-content: center;
  gap: 5rem;
  color: rgba(244, 216, 172, 0.7);
  padding: 2rem;
}

.note a {
  color: #f4d8ac;
  text-decoration: none;
  border-bottom: 1px solid rgba(244, 216, 172, 0.4);
  transition: border-color 0.3s ease;
}

.note a:hover {
  border-color: #f4d8ac;
}

.panel {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.1rem;
  padding: clamp(2rem, 5vw, 5.4rem) clamp(1.4rem, 5vw, 7.8rem);
  scroll-margin-top: 80px;
}

.hero-panel h1 {
  margin: 0;
  max-width: 16ch;
  font-family: 'Bodoni MT', 'Didot', serif;
  font-size: clamp(2.2rem, 6vw, 5.6rem);
  line-height: 0.98;
  letter-spacing: 0.02em;
}

.eyebrow {
  margin: 0;
  color: rgba(255, 228, 190, 0.95);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-size: 0.78rem;
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.lead {
  max-width: 44ch;
  font-size: clamp(1rem, 2vw, 1.22rem);
  color: rgba(252, 249, 242, 0.94);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: fit-content;
  text-decoration: none;
  color: #f5efe5;
  border: 1px solid rgba(255, 255, 255, 0.36);
  padding: 0.7rem 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  background: rgba(6, 8, 14, 0.4);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.action::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.action:hover::before {
  left: 100%;
}

.action.primary {
  border-color: rgba(255, 238, 200, 0.55);
  background: rgba(255, 235, 196, 0.14);
}

.action.primary:hover {
  background: rgba(255, 235, 196, 0.22);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 228, 190, 0.15);
}

.action .arrow {
  transition: transform 0.3s ease;
}

.action:hover .arrow {
  transform: translateX(4px);
}

.info-panel {
  align-items: flex-start;
  background: linear-gradient(
    100deg,
    rgba(8, 10, 18, 0.9),
    rgba(8, 10, 18, 0.52) 58%,
    rgba(8, 10, 18, 0.2)
  );
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.info-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, rgba(255, 228, 190, 0.6), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.info-panel:hover::before {
  opacity: 1;
}

.panel-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.8rem;
}

.panel-icon {
  font-size: 2rem;
  color: rgba(255, 228, 190, 0.8);
  margin-bottom: 0.5rem;
}

.info-panel h2 {
  margin: 0;
  font-family: 'Bodoni MT', 'Didot', serif;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-size: clamp(1.6rem, 3vw, 2.6rem);
}

.info-panel p {
  margin: 0;
  max-width: 50ch;
  color: rgba(242, 238, 231, 0.9);
}
</style>

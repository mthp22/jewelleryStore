<template>
  <div class="home">
    <section id="home" :ref="setSectionRef('home')" class="panel hero-panel">
      <!-- <p class="eyebrow"></p> -->
      <h1>Diamonds With Cinematic Presence</h1>
      <p class="lead">
        A boutique collection designed for intimate evenings and unforgettable entrances.
      </p>
      <div class="hero-actions">
        <router-link class="btn btn-primary" to="/products">Browse Pieces</router-link>
        <router-link class="btn" to="/support#message">Book A Consultation</router-link>
      </div>
    </section>

    <section id="craft" :ref="setSectionRef('craft')" class="panel info-panel">
      <h2>Studio Craft</h2>
      <p>
        Each stone is hand selected for fire, then set with precision to maximize movement and
        light.
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
      <p>Visit our studio for personalized styling, custom settings and sourcing support.</p>
      <router-link class="btn" to="/support#faq">See FAQs</router-link>
    </section>
    <footer class="note">
      <p>Images and videos are sourced from Ralph Jacobs https://ralphjacobs.co.za/</p>
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
const setSectionRef = (key: SectionKey) => (element: Element | ComponentPublicInstance | null) => {
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

.note {
  display: flex;
  justify-content: center;
  padding: 1.4rem;
  color: var(--color-text-faint);
  font-size: 0.78rem;
  letter-spacing: 0.03em;
  text-align: center;
}
.panel {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.1rem;
  padding: clamp(2rem, 5vw, 5.4rem) clamp(1.4rem, 5vw, 7.8rem);
  scroll-margin-top: calc(var(--nav-h, 72px) + 8px);
}

.hero-panel h1 {
  margin: 0;
  max-width: 16ch;
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 6vw, 5.6rem);
  line-height: 0.98;
  letter-spacing: 0.02em;
}

.eyebrow {
  margin: 0;
  color: rgba(255, 243, 221, 0.85);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-size: 0.72rem;
}

.lead {
  max-width: 44ch;
  font-size: clamp(1rem, 2vw, 1.22rem);
  color: var(--color-text);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
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
}

.info-panel h2 {
  margin: 0;
  font-family: var(--font-display);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-size: clamp(1.6rem, 3vw, 2.6rem);
}

.info-panel p {
  margin: 0;
  max-width: 50ch;
  color: var(--color-text-muted);
}
</style>

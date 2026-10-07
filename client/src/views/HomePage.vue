<template>
  <div ref="root" class="home">
    <section id="home" :ref="setSectionRef('home')" class="panel hero-panel">
      <p class="eyebrow">Bespoke · Certified · Hand set</p>
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
      <p class="eyebrow">01 — Studio Craft</p>
      <h2>Studio Craft</h2>
      <p>
        Each stone is hand selected for fire, then set with precision to maximize movement and
        light.
      </p>
      <ul class="stat-row">
        <li>
          <strong>40+</strong>
          <span>hours per setting</span>
        </li>
        <li>
          <strong>GIA</strong>
          <span>certified stones</span>
        </li>
        <li>
          <strong>100%</strong>
          <span>traceable origin</span>
        </li>
      </ul>
    </section>

    <section id="signature" :ref="setSectionRef('signature')" class="panel info-panel">
      <p class="eyebrow">02 — Signature Cuts</p>
      <h2>Signature Cuts</h2>
      <p>
        Explore pear, radiant and oval silhouettes refined for sharp sparkle and a graceful profile.
      </p>
      <ul class="chips">
        <li>Pear</li>
        <li>Radiant</li>
        <li>Oval</li>
        <li>Marquise</li>
        <li>Emerald</li>
      </ul>
    </section>

    <section id="visit" :ref="setSectionRef('visit')" class="panel info-panel">
      <p class="eyebrow">03 — Private Appointments</p>
      <h2>Private Appointments</h2>
      <p>Visit our studio for personalized styling, custom settings and sourcing support.</p>
      <div class="hero-actions">
        <router-link class="btn btn-primary" to="/support#message">Book A Consultation</router-link>
        <router-link class="btn" to="/support#faq">See FAQs</router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { ComponentPublicInstance } from 'vue'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

gsap.registerPlugin(ScrollTrigger)

type SectionKey = 'home' | 'craft' | 'signature' | 'visit'

const route = useRoute()
const router = useRouter()
const root = ref<HTMLElement | null>(null)

const sectionRefs = reactive<Record<SectionKey, HTMLElement | null>>({
  home: null,
  craft: null,
  signature: null,
  visit: null,
})

let observer: IntersectionObserver | null = null
let revealContext: gsap.Context | null = null
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

const setSectionRef = (key: SectionKey) => (element: Element | ComponentPublicInstance | null) => {
  sectionRefs[key] = element instanceof HTMLElement ? element : null
}

const setupReveals = () => {
  if (reducedMotion.matches || !root.value) {
    return
  }

  revealContext = gsap.context(() => {
    gsap.from('.hero-panel > *', {
      opacity: 0,
      y: 30,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.12,
    })

    gsap.utils.toArray<HTMLElement>('.info-panel').forEach((panel) => {
      gsap.from(panel.children, {
        opacity: 0,
        y: 34,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: panel,
          start: 'top 75%',
          once: true,
        },
      })
    })
  }, root.value)
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

  setupReveals()
})

onBeforeUnmount(() => {
  observer?.disconnect()
  revealContext?.revert()
})
</script>

<style scoped>
.home {
  display: grid;
}

.eyebrow {
  margin: 0;
  color: var(--gold);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-size: 0.72rem;
}

.panel {
  min-height: 88vh;
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
  border-top: 1px solid var(--border);
}

.info-panel h2 {
  margin: 0;
  font-family: var(--font-display);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-size: clamp(1.6rem, 3vw, 2.6rem);
}

.info-panel > p:not(.eyebrow) {
  margin: 0;
  max-width: 50ch;
  color: var(--color-text-muted);
}

.stat-row {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(1.2rem, 4vw, 3rem);
  margin: 0.4rem 0 0;
  padding: 1.1rem 0 0;
  list-style: none;
  border-top: 1px solid var(--border);
  width: min(100%, 46rem);
}

.stat-row li {
  display: grid;
  gap: 0.15rem;
}

.stat-row strong {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 400;
  color: var(--gold-bright);
}

.stat-row span {
  font-size: 0.74rem;
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--color-text-faint);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.3rem 0 0;
  padding: 0;
  list-style: none;
}

.chips li {
  padding: 0.42rem 0.85rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  background: var(--surface-sunken);
  font-size: 0.72rem;
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--color-text-muted);
}

@media (max-height: 700px) {
  .panel {
    min-height: auto;
    padding-block: clamp(2.5rem, 8vh, 4rem);
  }
}
</style>

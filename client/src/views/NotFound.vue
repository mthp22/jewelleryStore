<template>
  <div class="not-found">
    <p class="kicker">404</p>
    <h1>This piece is not on display</h1>
    <p class="lead">The page you are looking for has moved, been retired, or never existed.</p>

    <div class="actions">
      <router-link class="btn btn-primary" to="/">Back to home</router-link>
      <router-link class="btn" to="/products">Browse collections</router-link>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.not-found {
  min-height: calc(100vh - var(--nav-h, 72px));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 1rem;
  padding: clamp(2rem, 6vw, 6rem) clamp(1.4rem, 5vw, 7.8rem);
}

.kicker {
  margin: 0;
  color: var(--gold);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-size: 0.74rem;
}

.not-found h1 {
  margin: 0;
  max-width: 16ch;
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1.02;
}

.lead {
  margin: 0;
  max-width: 46ch;
  color: var(--color-text-muted);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 0.6rem;
}
</style>

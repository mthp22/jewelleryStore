<template>
  <footer class="site-footer">
    <div class="footer-grid">
      <div class="brand">
        <p class="brand-name">Diamond Shop</p>
        <p>Hand selected stones, set with precision in our private studio.</p>
      </div>

      <nav aria-label="Footer">
        <p class="footer-heading">Explore</p>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/products">Collections</router-link></li>
          <li><router-link to="/support">Support</router-link></li>
          <li><router-link to="/support#faq">FAQ</router-link></li>
        </ul>
      </nav>

      <div>
        <p class="footer-heading">Studio</p>
        <ul>
          <li>Mon – Sat · 10:00 – 18:00</li>
          <li><a href="mailto:studio@diamondshop.example">studio@diamondshop.example</a></li>
          <li><a href="tel:+27110000000">+27 11 000 0000</a></li>
        </ul>
      </div>

      <div class="booking">
        <p class="footer-heading">Book</p>
        <p>Private appointments, custom settings and stone sourcing.</p>
        <router-link class="btn btn-sm" to="/support#message">Book A Consultation</router-link>
      </div>
    </div>

    <p class="credit">
      Images and videos are sourced from
      <a href="https://ralphjacobs.co.za/" target="_blank" rel="noopener noreferrer">
        Ralph Jacobs
      </a>
    </p>
  </footer>
</template>

<script setup lang="ts"></script>

<style scoped>
.site-footer {
  position: relative;
  z-index: 2;
  padding: clamp(2rem, 4vw, 3.2rem) clamp(1.4rem, 5vw, 7.8rem) 1.6rem;
  border-top: 1px solid var(--border);
  background: linear-gradient(180deg, rgba(4, 5, 10, 0.72), rgba(4, 5, 10, 0.94));
  backdrop-filter: blur(8px);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: clamp(1.4rem, 3vw, 2.6rem);
  align-items: start;
}

.brand-name {
  margin: 0 0 0.5rem;
  font-family: var(--font-display);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  font-size: 0.92rem;
}

.footer-heading {
  margin: 0 0 0.6rem;
  color: var(--gold);
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.footer-grid p,
.footer-grid li {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.86rem;
}

.footer-grid ul {
  display: grid;
  gap: 0.45rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.footer-grid a {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color var(--speed-fast) var(--ease);
}

.footer-grid a:hover {
  color: var(--gold-bright);
}

.booking .btn {
  margin-top: 0.75rem;
}

.credit {
  margin: clamp(1.6rem, 3vw, 2.4rem) 0 0;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--color-text-faint);
  font-size: 0.76rem;
  text-align: center;
}

.credit a {
  color: var(--gold);
}
</style>

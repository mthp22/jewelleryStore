<template>
  <div class="support-page">
    <header class="support-header">
      <p class="script-note">A note from our studio</p>
      <h1>How Can We Help You Shine?</h1>
      <p>Send us your request and our gem consultants will respond with tailored recommendations.</p>
    </header>

    <div class="support-layout">
      <section id="message" class="chat-panel">
        <h2>Message Concierge</h2>

        <div class="bubble-list" aria-live="polite">
          <article class="bubble incoming">
            Hello, share your event date and preferred style, and we will shortlist fitting pieces.
          </article>
          <article
            v-if="statusMessage"
            class="bubble outgoing"
            :class="{ shake: feedbackState === 'error' }"
          >
            <span>{{ statusMessage }}</span>
            <span v-if="feedbackState === 'success'" class="checkmark" aria-hidden="true">✓</span>
          </article>
        </div>

        <form class="contact-form" @submit.prevent="submitForm" novalidate>
          <label>
            Name
            <input v-model.trim="form.name" type="text" autocomplete="name" />
          </label>

          <label>
            Email
            <input v-model.trim="form.email" type="email" autocomplete="email" />
          </label>

          <label>
            Message
            <textarea v-model.trim="form.message" rows="4"></textarea>
          </label>

          <button type="submit">Send Message</button>
        </form>
      </section>

      <section id="faq" class="faq-panel">
        <h2>FAQ</h2>

        <details v-for="item in faqs" :key="item.question" class="faq-item">
          <summary>{{ item.question }}</summary>
          <p>{{ item.answer }}</p>
        </details>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

type FeedbackState = 'idle' | 'success' | 'error'

const form = reactive({
  name: '',
  email: '',
  message: '',
})

const feedbackState = ref<FeedbackState>('idle')
const statusMessage = ref('')

const faqs = [
  {
    question: 'Do you offer custom diamond sourcing?',
    answer:
      'Yes, we source certified stones based on your preferred cut, clarity, budget and setting style.',
  },
  {
    question: 'Can I schedule a private appointment?',
    answer:
      'Absolutely. We provide in-studio and virtual appointments for styling, sizing and custom consultations.',
  },
  {
    question: 'How long does a custom setting take?',
    answer:
      'Most bespoke settings are completed in 3 to 5 weeks after design confirmation.',
  },
]

const isEmailValid = (email: string) => /\S+@\S+\.\S+/.test(email)

const submitForm = () => {
  if (!form.name || !form.email || !form.message || !isEmailValid(form.email)) {
    feedbackState.value = 'error'
    statusMessage.value = 'Please add a valid name, email and message before sending.'
    return
  }

  feedbackState.value = 'success'
  statusMessage.value = 'Your message has been sent. We will reply shortly.'

  form.name = ''
  form.email = ''
  form.message = ''
}
</script>

<style scoped>
.support-page {
  min-height: 100vh;
  padding: clamp(1.2rem, 3vw, 2.8rem) clamp(1rem, 3vw, 3rem) 2rem;
  background: linear-gradient(150deg, rgba(8, 10, 18, 0.96), rgba(17, 22, 33, 0.82));
}

.support-header {
  max-width: 70ch;
  margin-bottom: 1.2rem;
  text-align: center;
}

.script-note {
  margin: 0;
  font-family: 'Brush Script MT', 'Lucida Handwriting', cursive;
  font-size: clamp(1.6rem, 4vw, 2.3rem);
  color: #f4d8ac;
}

.support-header h1 {
  margin: 0.4rem 0 0.7rem;
  font-family: 'Bodoni MT', 'Didot', serif;
  font-size: clamp(1.8rem, 4vw, 3rem);
}

.support-header p {
  margin: 0;
  color: rgba(246, 240, 231, 0.86);
}

.support-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 1.5rem;
}

.chat-panel,
.faq-panel {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(11, 13, 22, 0.62);
  padding: 1.5rem;
  backdrop-filter: blur(8px);
  scroll-margin-top: 90px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.chat-panel:hover,
.faq-panel:hover {
  border-color: rgba(255, 228, 190, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.chat-panel h2,
.faq-panel h2 {
  margin: 0 0 0.8rem;
  font-family: 'Bodoni MT', 'Didot', serif;
}

.bubble-list {
  display: grid;
  gap: 0.65rem;
  margin-bottom: 0.9rem;
}

.bubble {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  width: fit-content;
  max-width: min(95%, 38ch);
  padding: 0.64rem 0.82rem;
  border-radius: 18px;
  animation: bubbleIn 0.4s ease-out;
}

@keyframes bubbleIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.incoming {
  background: rgba(255, 234, 193, 0.2);
  border-top-left-radius: 6px;
}

.outgoing {
  margin-left: auto;
  background: rgba(130, 255, 191, 0.16);
  border-top-right-radius: 6px;
}

.checkmark {
  font-weight: 700;
  color: #89ffb2;
  animation: pop 220ms ease-in-out;
}

@keyframes pop {
  from {
    transform: scale(0.5);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

.shake {
  animation: shake 360ms ease;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-6px);
  }

  75% {
    transform: translateX(6px);
  }
}

.contact-form {
  display: grid;
  gap: 0.7rem;
}

label {
  display: grid;
  gap: 0.28rem;
  font-size: 0.84rem;
}

input,
textarea,
button {
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(6, 8, 13, 0.52);
  color: #f7f1e6;
  padding: 0.58rem 0.62rem;
  font: inherit;
  border-radius: 6px;
  transition: all 0.3s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: rgba(255, 228, 190, 0.5);
  box-shadow: 0 0 0 3px rgba(255, 228, 190, 0.1);
}

button {
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  width: fit-content;
  border-radius: 6px;
  transition: all 0.3s ease;
}

button:hover {
  background: rgba(255, 228, 190, 0.15);
  border-color: rgba(255, 228, 190, 0.5);
  transform: translateY(-2px);
}

.faq-item {
  border: 1px solid rgba(255, 255, 255, 0.12);
  margin-bottom: 0.55rem;
  background: rgba(10, 12, 19, 0.35);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item:hover {
  border-color: rgba(255, 228, 190, 0.3);
}

summary {
  cursor: pointer;
  padding: 0.7rem;
  font-weight: 500;
  transition: background 0.3s ease;
}

summary:hover {
  background: rgba(255, 255, 255, 0.05);
}

.faq-item p {
  margin: 0;
  padding: 0 0.7rem 0.7rem;
  color: rgba(245, 240, 232, 0.86);
}

@media (max-width: 860px) {
  .support-layout {
    grid-template-columns: 1fr;
  }
}
</style>

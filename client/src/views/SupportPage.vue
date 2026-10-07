<template>
  <div class="support-page">
    <header class="support-header">
      <p class="script-note">A note from our studio</p>
      <h1>How Can We Help You Shine?</h1>
      <p>
        Send us your request and our gem consultants will respond with tailored recommendations.
      </p>
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
            <input
              v-model.trim="form.name"
              type="text"
              autocomplete="name"
              required
              :aria-invalid="Boolean(errors.name)"
              aria-describedby="name-error"
              @input="clearError('name')"
            />
            <span v-if="errors.name" id="name-error" class="field-error" role="alert">
              {{ errors.name }}
            </span>
          </label>

          <label>
            Email
            <input
              v-model.trim="form.email"
              type="email"
              autocomplete="email"
              required
              :aria-invalid="Boolean(errors.email)"
              aria-describedby="email-error"
              @input="clearError('email')"
            />
            <span v-if="errors.email" id="email-error" class="field-error" role="alert">
              {{ errors.email }}
            </span>
          </label>

          <label>
            Message
            <textarea
              v-model.trim="form.message"
              rows="4"
              required
              :aria-invalid="Boolean(errors.message)"
              aria-describedby="message-error"
              @input="clearError('message')"
            ></textarea>
            <span v-if="errors.message" id="message-error" class="field-error" role="alert">
              {{ errors.message }}
            </span>
          </label>

          <button type="submit" class="btn btn-primary">Send Message</button>
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
type FieldKey = 'name' | 'email' | 'message'

const form = reactive({
  name: '',
  email: '',
  message: '',
})

const errors = reactive<Record<FieldKey, string>>({
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
    answer: 'Most bespoke settings are completed in 3 to 5 weeks after design confirmation.',
  },
]

const isEmailValid = (email: string) => /\S+@\S+\.\S+/.test(email)

const validate = () => {
  errors.name = form.name ? '' : 'Please tell us your name.'
  errors.email = !form.email
    ? 'We need your email so we can reply.'
    : isEmailValid(form.email)
      ? ''
      : 'That email address does not look right.'
  errors.message = form.message ? '' : 'Share a little about what you are looking for.'

  return (Object.keys(errors) as FieldKey[]).every((field) => !errors[field])
}

const clearError = (field: FieldKey) => {
  if (errors[field]) {
    errors[field] = ''
  }
}

const focusFirstInvalid = () => {
  const invalid = document.querySelector<HTMLElement>('[aria-invalid="true"]')
  invalid?.focus()
}

const submitForm = () => {
  if (!validate()) {
    feedbackState.value = 'error'
    statusMessage.value = 'Please fix the highlighted fields and try again.'
    focusFirstInvalid()
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
}

.script-note {
  margin: 0;
  font-family: var(--font-script);
  font-size: clamp(1.6rem, 4vw, 2.3rem);
  color: var(--gold);
}

.support-header h1 {
  margin: 0.4rem 0 0.7rem;
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 3rem);
}

.support-header p {
  margin: 0;
  color: var(--color-text-muted);
}

.support-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 1rem;
}

.chat-panel,
.faq-panel {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  padding: 1rem;
  backdrop-filter: blur(8px);
  scroll-margin-top: calc(var(--nav-h, 72px) + 16px);
}

.chat-panel h2,
.faq-panel h2 {
  margin: 0 0 0.8rem;
  font-family: var(--font-display);
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
  border-radius: var(--radius-lg);
}

.incoming {
  background: var(--gold-soft);
  border-top-left-radius: var(--radius-sm);
}

.outgoing {
  margin-left: auto;
  background: rgba(141, 255, 190, 0.16);
  border-top-right-radius: var(--radius-sm);
}

.checkmark {
  font-weight: 700;
  color: var(--success);
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
textarea {
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface-sunken);
  color: var(--color-ivory);
  padding: 0.58rem 0.62rem;
  font: inherit;
  transition: border-color var(--speed-fast) var(--ease);
}

input::placeholder,
textarea::placeholder {
  color: var(--color-text-faint);
}

input:focus,
textarea:focus {
  border-color: var(--border-gold);
}

input[aria-invalid='true'],
textarea[aria-invalid='true'] {
  border-color: var(--error);
}

.field-error {
  color: var(--error);
  font-size: 0.74rem;
  letter-spacing: 0.02em;
}

.faq-item {
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  margin-bottom: 0.55rem;
  background: rgba(10, 12, 19, 0.35);
  overflow: hidden;
}

summary {
  cursor: pointer;
  padding: 0.7rem;
  font-weight: 500;
}

.faq-item p {
  margin: 0;
  padding: 0 0.7rem 0.7rem;
  color: var(--color-text-muted);
}

@media (max-width: 860px) {
  .support-layout {
    grid-template-columns: 1fr;
  }
}
</style>

import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

const STORAGE_KEY = 'diamond-shop:wishlist'

const read = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

export const useWishlistStore = defineStore('wishlist', () => {
  const ids = ref<string[]>(read())

  const count = computed(() => ids.value.length)

  const has = (id: string) => ids.value.includes(id)

  const toggle = (id: string) => {
    ids.value = has(id) ? ids.value.filter((saved) => saved !== id) : [...ids.value, id]
  }

  watch(
    ids,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } catch {
        // Storage may be unavailable (private mode, quota).
      }
    },
    { deep: true },
  )

  return { ids, count, has, toggle }
})

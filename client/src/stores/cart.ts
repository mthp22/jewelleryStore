import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import { getProduct } from '@/data/products'

const STORAGE_KEY = 'diamond-shop:bag'

export type BagLine = { id: string; qty: number }

const read = (): BagLine[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(
      (line): line is BagLine =>
        typeof line === 'object' &&
        line !== null &&
        typeof (line as BagLine).id === 'string' &&
        typeof (line as BagLine).qty === 'number',
    )
  } catch {
    return []
  }
}

export const useBagStore = defineStore('bag', () => {
  const lines = ref<BagLine[]>(read().filter((line) => getProduct(line.id)))

  const count = computed(() => lines.value.reduce((sum, line) => sum + line.qty, 0))

  const total = computed(() =>
    lines.value.reduce((sum, line) => sum + (getProduct(line.id)?.price ?? 0) * line.qty, 0),
  )

  const qtyOf = (id: string) => lines.value.find((line) => line.id === id)?.qty ?? 0

  const add = (id: string, qty = 1) => {
    const existing = lines.value.find((line) => line.id === id)

    if (existing) {
      existing.qty += qty
      return
    }

    lines.value.push({ id, qty })
  }

  const remove = (id: string) => {
    lines.value = lines.value.filter((line) => line.id !== id)
  }

  watch(
    lines,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } catch {
        // Storage may be unavailable (private mode, quota).
      }
    },
    { deep: true },
  )

  return { lines, count, total, qtyOf, add, remove }
})

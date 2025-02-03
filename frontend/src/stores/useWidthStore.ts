import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWidthStore = defineStore('width', () => {
  const width = ref<number>(window.innerWidth)

  window.addEventListener('resize', () => {
    width.value = window.innerWidth
  })

  const isMobile = computed(() => width.value < 768)

  const isDesktop = computed(() => width.value >= 768)

  return {
    width,
    isMobile,
    isDesktop,
  }
})

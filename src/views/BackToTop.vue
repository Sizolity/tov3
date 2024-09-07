<template>
  <div v-show="visible" :style="customStyle" class="back-to-ceiling" @click="backToTop">
    <svg
      width="16"
      height="16"
      viewBox="0 0 17 17"
      xmlns="http://www.w3.org/2000/svg"
      class="Icon Icon--backToTopArrow"
      aria-hidden="true"
      style="height: 16px; width: 16px"
    >
      <title>回到顶部</title>
      <g>
        <path
          d="M12.036 15.59c0 .55-.453.995-.997.995H5.032c-.55 0-.997-.445-.997-.996V8.584H1.03c-1.1 0-1.36-.633-.578-1.416L7.33.29c.39-.39 1.026-.385 1.412 0l6.878 6.88c.782.78.523 1.415-.58 1.415h-3.004v7.004z"
          fill-rule="evenodd"
        />
      </g>
    </svg>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const visibilityHeight = ref(400)
const backPosition = ref(0)
const customStyle = ref({
  right: '50px',
  bottom: '50px',
  width: '40px',
  height: '40px',
  'border-radius': '4px',
  'line-height': '45px',
  background: '#e7eaf1'
})
const transitionName = ref('fade')

const visible = ref(null)
const isMoving = ref(false)
const interval = ref(null)

const handleScroll = () => {
  visible.value = window.scrollY > visibilityHeight.value
}

const computeonscroll = computed(() => {
  return window.scrollY > visibilityHeight.value
})
visible.value = computeonscroll.value
const backToTop = () => {
  if (isMoving.value) return
  const start = window.scrollY
  let i = 0
  isMoving.value = true
  interval.value = setInterval(() => {
    const next = Math.floor(easeInOutQuad(10 * i, start, -start, 500))
    if (next <= backPosition.value) {
      window.scrollTo(0, backPosition.value)
      clearInterval(interval.value)
      isMoving.value = false
    } else {
      window.scrollTo(0, next)
    }
    i++
  }, 16.7)
}

const easeInOutQuad = (t, b, c, d) => {
  if ((t /= d / 2) < 1) return (c / 2) * t * t + b
  return (-c / 2) * (--t * (t - 2) - 1) + b
}

window.addEventListener('scroll', handleScroll)
</script>

<style scoped>
.back-to-ceiling {
  position: fixed;
  display: inline-block;
  text-align: center;
  cursor: pointer;
}
.back-to-ceiling:hover {
  background: #d5dbe7;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.back-to-ceiling .Icon {
  fill: #9aaabf;
  background: none;
}
</style>

import type { ObjectDirective, DirectiveBinding } from 'vue'

declare interface ResizeEl extends HTMLElement {
  _handleResize?: () => void
}

const Resize: ObjectDirective = {
  beforeMount(el: ResizeEl, binding: DirectiveBinding) {
    el._handleResize = () => {
      el && binding.value?.(el)
    }
    el.addEventListener('resize', el._handleResize)
  },
  beforeUnmount(el: ResizeEl) {
    el._handleResize && el.removeEventListener('resize', el._handleResize)
  }
}

export default Resize

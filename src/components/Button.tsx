import type { ButtonType, Colors, Size } from '@/types/index'
import { defineComponent, PropType, computed } from 'vue'
// import type {  } from 'vue'
import SpinSvg from '@/components/SpinSvg.vue'

import '@/styles/button.css'
export default defineComponent({
  props: {
    size: {
      type: String as PropType<Size>,
      default: () => 'medium'
    },
    color: {
      type: String as PropType<Colors>,
      default: 'purple'
    },
    outlined: {},
    type: {
      type: String as PropType<ButtonType>,
      default: 'primary'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { slots }) {
    let buttonTypeStyle = `bg-${props.color}-500 text-white shadow-sm  border-transparent`
    if (props.type === 'outlined') buttonTypeStyle = `text-${props.color}-500 border-${props.color}-500`
    if (props.type === 'text') buttonTypeStyle = `text-${props.color}-500 border-transparent`
    if (!props.disabled && !props.loading) {
      if (props.type === 'text' || props.type === 'outlined') {
        buttonTypeStyle += ` hover:bg-${props.color}-500  focus:bg-${props.color}-700 hover:bg-opacity-5  hover:border-opacity-100  focus:bg-opacity-5  focus:border-opacity-100`
      } else buttonTypeStyle += ` hover:bg-${props.color}-700   focus:ring-${props.color}-500  focus:ring-2 focus:ring-offset-2`
    }
    const disableClass = props.disabled ? 'xg-button-disabled' : ''
    const loadingTextClass = props.type === 'primary' ? 'text-white' : `text-${props.color}-500`
    const loadingClass = props.loading ? 'cursor-not-allowed' : ''
    const spinClass = computed(() => {
      switch (props.size) {
        case 'large':
          return '-ml-1 h-6 w-6 mr-2.5'
        case 'small':
          return '-ml-1 h-4 w-4 mr-1.5'
        case 'mini':
          return 'h-3 w-3 mr-1 -mt-0.5'
        case 'medium':
        default:
          return '-ml-1 h-5 w-5 mr-2'
      }
    })
    return () => (
      <button
        class={`xg-button xg-button-${props.type} ${buttonTypeStyle}    ${disableClass} ${loadingClass} xg-button-${props.size}`}>
        {props.loading ? <SpinSvg class={`animate-spin ${spinClass.value} ${loadingTextClass}`} /> : null}
        {slots.default && slots.default()}
      </button>
    )
  }
})

import type { ButtonType, Colors, Size } from '@/types/index'
import { defineComponent, PropType, computed } from 'vue'
// import type {  } from 'vue'
import SpinSvg from 'components/Svg/SpinSvg.vue'

import '@/styles/button.css'

const bgStyle = {
  gray: 'bg-gray-500',
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500',
  pink: 'bg-pink-500'
}

const hoverBgStyle = {
  gray: 'hover:bg-gray-500',
  red: 'hover:bg-red-500',
  yellow: 'hover:bg-yellow-500',
  green: 'hover:bg-green-500',
  blue: 'hover:bg-blue-500',
  indigo: 'hover:bg-indigo-500',
  violet: 'hover:bg-violet-500',
  pink: 'hover:bg-pink-500'
}

const hoverBgStyle700 = {
  gray: 'hover:bg-gray-700',
  red: 'hover:bg-red-700',
  yellow: 'hover:bg-yellow-700',
  green: 'hover:bg-green-700',
  blue: 'hover:bg-blue-700',
  indigo: 'hover:bg-indigo-700',
  violet: 'hover:bg-violet-700',
  pink: 'hover:bg-pink-700'
}

const textStyle = {
  gray: 'text-gray-500',
  red: 'text-red-500',
  yellow: 'text-yellow-500',
  green: 'text-green-500',
  blue: 'text-blue-500',
  indigo: 'text-indigo-500',
  violet: 'text-violet-500',
  pink: 'text-pink-500'
}

const borderStyle = {
  gray: 'border-gray-500',
  red: 'border-red-500',
  yellow: 'border-yellow-500',
  green: 'border-green-500',
  blue: 'border-blue-500',
  indigo: 'border-indigo-500',
  violet: 'border-violet-500',
  pink: 'border-pink-500'
}

const focusRingStyle = {
  gray: 'focus:ring-gray-500',
  red: 'focus:ring-red-500',
  yellow: 'focus:ring-yellow-500',
  green: 'focus:ring-green-500',
  blue: 'focus:ring-blue-500',
  indigo: 'focus:ring-indigo-500',
  violet: 'focus:ring-violet-500',
  pink: 'focus:ring-pink-500'
}

const focusBgStyle700 = {
  gray: 'focus:bg-gray-500',
  red: 'focus:bg-red-500',
  yellow: 'focus:bg-yellow-500',
  green: 'focus:bg-green-500',
  blue: 'focus:bg-blue-500',
  indigo: 'focus:bg-indigo-500',
  violet: 'focus:bg-violet-500',
  pink: 'focus:bg-pink-500'
}
export default defineComponent({
  props: {
    size: {
      type: String as PropType<Size>,
      default: () => 'medium'
    },
    color: {
      type: String as PropType<Colors>,
      default: 'violet'
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
    let buttonTypeStyle = ` ${bgStyle[props.color]} text-white shadow-sm  border-transparent`
    if (props.type === 'outlined') {
      buttonTypeStyle = ` ${textStyle[props.color]} ${borderStyle[props.color]}`
    }
    if (props.type === 'text') {
      buttonTypeStyle = ` ${textStyle[props.color]} border-transparent`
    }
    if (!props.disabled && !props.loading) {
      if (props.type === 'text' || props.type === 'outlined') {
        buttonTypeStyle += ` ${hoverBgStyle[props.color]} ${focusBgStyle700[props.color]} hover:bg-opacity-5  hover:border-opacity-100  focus:bg-opacity-5  focus:border-opacity-100`
      } else {
        buttonTypeStyle += ` ${hoverBgStyle700[props.color]} ${focusRingStyle[props.color]}  focus:ring-2 focus:ring-offset-2`
      }
    }
    const disableClass = props.disabled ? 'xg-button-disabled' : ''
    const loadingTextClass =
      props.type === 'primary' ? 'text-white' : `${textStyle[props.color]}`
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
        class={`xg-button xg-button-${props.type} ${buttonTypeStyle}  ${disableClass} ${loadingClass} xg-button-${props.size}`}>
        {props.loading ? (
          <SpinSvg
            class={`animate-spin ${spinClass.value} ${loadingTextClass}`}
          />
        ) : null}
        {slots.default && slots.default()}
      </button>
    )
  }
})

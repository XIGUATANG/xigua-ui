import { Size } from '@/types'
import { defineComponent, computed, PropType, ref } from 'vue'

const sizeStyle = {
  large: {
    input: ['h-10', 'text-15'],
    pend: ['h-10', 'text-15']
  },
  medium: {
    input: ['h-9', 'text-sm'],
    pend: ['h-9', 'text-sm']
  },
  small: {
    input: ['h-8', 'text-13', 'py-1.5'],
    pend: ['h-8', 'text-13']
  },
  mini: {
    input: ['h-7', 'text-xs', 'py-1.25'],
    pend: ['h-7', 'text-xs']
  }
}

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    size: {
      type: String as PropType<Size>,
      default: 'medium'
    },
    onFocus: {
      type: Function as PropType<(e: FocusEvent) => void>,
      default: () => {}
    },
    onBlur: {
      type: Function as PropType<(e: FocusEvent) => void>,
      default: () => {}
    },
    // onClick: {
    //   type: Function as PropType<(e: MouseEvent) => void>
    // },
    onInput: {
      type: Function as PropType<(e: string) => void>
    },
    onMouseenter: {
      type: Function as PropType<(e: MouseEvent) => void>
    },
    onMouseleave: {
      type: Function as PropType<(e: MouseEvent) => void>
    },
    onMousemove: {
      type: Function as PropType<(e: MouseEvent) => void>
    },
    onKeydown: {
      type: Function as PropType<(e: KeyboardEvent) => void>
    },
    onChange: {
      type: Function as PropType<(e: InputEvent) => void>
    },

    disabled: {
      type: Boolean,
      default: false
    },
    placeHolder: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    const inputStyle = computed(() => {
      const { input } = sizeStyle[props.size]
      const baseStyle =
        'flex-1 z-10 focus:ring-purple-500 text-gray-800 focus:border-purple-500 block border-gray-300  rounded-md '.split(
          ' '
        )
      baseStyle.push(...input)
      baseStyle.push(slots.leftIcon ? 'pl-8' : 'pl-3')
      slots.prepend && baseStyle.push('rounded-l-none')
      slots.pend && baseStyle.push('rounded-r-none')
      baseStyle.push(slots.righttIcon ? 'pr-8' : 'pr-3')
      if (props.disabled) {
        baseStyle.push('bg-gray-100', 'cursor-not-allowed', 'opacity-50')
      }
      return baseStyle
    })

    const pendStyle = computed(() => {
      const baseStyle =
        'text-gray-400 border  border-gray-300 px-3 bg-gray-100 flex justify-center items-center'.split(
          ' '
        )
      const { pend } = sizeStyle[props.size]
      return {
        left: [...baseStyle, 'rounded-l-md', 'border-r-0'],
        right: [...baseStyle, 'rounded-r-md', 'border-l-0']
      }
    })

    const handleInput = (e: Event) => {
      props.onInput && props.onInput((e.target as HTMLInputElement).value)
      emit('update:modelValue', (e.target as HTMLInputElement).value)
    }

    // #f9fafb
    return () => (
      <div class="relative rounded-md shadow-sm flex">
        {slots.prepend ? (
          <div class={pendStyle.value.left}>{slots.prepend()}</div>
        ) : null}
        {slots.leftIcon ? (
          <div class="absolute text-gray-500 z-20 left-0 inset-y-0  flex items-center w-8 justify-center">
            {slots.leftIcon()}
          </div>
        ) : null}
        {slots.rightIcon ? (
          <div class="absolute text-gray-500 z-20 right-0 inset-y-0  flex items-center w-8 justify-center">
            {slots.rightIcon()}
          </div>
        ) : null}
        <input
          autocomplete={props.autocomplete}
          disabled={props.disabled}
          value={props.modelValue}
          onInput={handleInput}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          type="text"
          name="price"
          id="price"
          // onClick={e => props.onClick?.(e)}
          class={inputStyle.value}
          onChange={e => props.onChange?.(e as InputEvent)}
          onMouseenter={e => props.onMouseenter?.(e)}
          onMouseleave={e => props.onMouseleave?.(e)}
          onMousemove={e => props.onMousemove?.(e)}
          onKeydown={e => props.onKeydown?.(e)}
          placeholder={props.placeHolder}></input>

        {slots.pend ? (
          <div class={pendStyle.value.right}>{slots.pend()}</div>
        ) : null}
      </div>
    )
  }
})

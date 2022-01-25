<template>
  <slot />
</template>

<script lang="ts">
import { defineComponent, inject, watch } from 'vue'
import { useForwardRef } from 'hooks/index'
import { usePopperTriggerProps } from './popper'
import { POPPER_INJECTION_KEY } from './tokens'
import { unwrapMeasurableEl } from './utils'

function strEnum<T extends string>(o: Array<T>): { [K in T]: K } {
  return o.reduce((res, key) => {
    res[key] = key
    return res
  }, Object.create(null))
}

export default defineComponent({
  name: 'ElPopperTrigger',
  inheritAttrs: false,
  props: {
    ...usePopperTriggerProps,
    onMouseenter: Function,
    onMouseleave: Function,
    onMousedown: Function,
    onKeydown: Function,
    onFocus: Function,
    onBlur: Function,
    onContextmenu: Function,
    id: String,
    open: Boolean
  },
  setup(props) {
    const { triggerRef } = inject(POPPER_INJECTION_KEY, undefined)!
    useForwardRef(triggerRef)

    watch(
      () => props.virtualRef,
      val => {
        if (val) {
          triggerRef.value = unwrapMeasurableEl(val)
        }
      },
      {
        immediate: true
      }
    )

    watch(
      () => triggerRef.value as HTMLElement,
      (el, prevEl) => {
        if (el && el instanceof HTMLElement) {
          const eventsName = [
            'onMouseenter',
            'onMouseleave',
            'onMousedown',
            'onKeydown',
            'onFocus',
            'onBlur',
            'onContextmenu'
          ]
          eventsName.forEach(eventName => {
            // ts
            // @ts-ignore
            const handler = props[eventName]
            if (handler) {
              el.addEventListener(eventName.slice(2).toLowerCase(), handler)
              prevEl?.removeEventListener(
                eventName.slice(2).toLowerCase(),
                handler
              )
            }
          })
        }
      },
      {
        immediate: true
      }
    )

    return {
      triggerRef
    }
  }
})
</script>

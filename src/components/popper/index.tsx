import {
  defineComponent,
  Teleport,
  onBeforeUnmount,
  onDeactivated,
  onActivated,
  onMounted,
  renderSlot,
  toDisplayString,
  withDirectives
} from 'vue'
import ClickOutside from '@/directives/clickoutside'
import usePopper from './use-poper'
import defaultProps from './use-poper/defaults'
import { renderPopper, renderTrigger, renderArrow } from './renderers'
const compName = 'ElPopper'
const UPDATE_VISIBLE_EVENT = 'update:visible'
export default defineComponent({
  name: compName,
  props: defaultProps,
  emits: [
    UPDATE_VISIBLE_EVENT,
    'after-enter',
    'after-leave',
    'before-enter',
    'before-leave'
  ],
  setup(props, ctx) {
    if (!ctx.slots.trigger) {
      console.error(compName, 'Trigger must be provided')
    }
    // this is a reference that we need to pass down to child component
    // to obtain the child instance
    // return usePopper(props as IPopperOptions, ctx as SetupContext)
    const popperStates = usePopper(props, ctx)
    const forceDestroy = () => popperStates.doDestroy(true)
    onMounted(popperStates.initializePopper)
    onBeforeUnmount(forceDestroy)
    onActivated(popperStates.initializePopper)
    onDeactivated(forceDestroy)
    return popperStates
  },
  render() {
    const {
      $slots,
      appendToBody,
      class: kls,
      style,
      effect,
      hide,
      onPopperMouseEnter,
      onPopperMouseLeave,
      onAfterEnter,
      onAfterLeave,
      onBeforeEnter,
      onBeforeLeave,
      popperClass,
      popperId,
      popperStyle,
      pure,
      showArrow,
      transition,
      visibility,
      sameWidth,
      stopPopperMouseEvent
    } = this
    const isManual = this.isManualMode()
    const arrow = renderArrow(showArrow)
    const popper = renderPopper(
      {
        sameWidth,
        effect,
        name: transition,
        popperClass,
        popperId,
        popperStyle,
        pure,
        stopPopperMouseEvent,
        onMouseenter: onPopperMouseEnter,
        onMouseleave: onPopperMouseLeave,
        onAfterEnter,
        onAfterLeave,
        onBeforeEnter,
        onBeforeLeave,
        visibility
      },
      [
        renderSlot($slots, 'default', {}, () => {
          return [toDisplayString(this.content)]
        }),
        arrow
      ]
    )
    const _t = $slots.trigger?.()
    const triggerProps = {
      'aria-describedby': popperId,
      class: kls,
      style,
      ref: 'triggerRef',
      ...this.events
    }

    const trigger = isManual
      ? renderTrigger(_t!, triggerProps)
      : withDirectives(renderTrigger(_t!, triggerProps)!, [
          [ClickOutside, hide]
        ])

    return (
      <>
        {trigger}
        <Teleport to="body" disabled={!appendToBody}>
          {' '}
          {popper}
        </Teleport>
      </>
    )
  }
})

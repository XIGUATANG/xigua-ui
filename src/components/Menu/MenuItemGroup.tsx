import { defineComponent, computed, getCurrentInstance, inject } from 'vue'
import type { RootMenuProvider } from './menu.type'
export default defineComponent({
  name: 'ElMenuItemGroup',
  componentName: 'ElMenuItemGroup',
  props: {
    title: {
      type: String
    }
  },
  setup(props, { slots }) {
    // inject
    const { props: rootProps } = inject<RootMenuProvider>('rootMenu') || {}
    const instance = getCurrentInstance()
    // computed
    const levelPadding = computed(() => {
      let padding = 20
      let parent = instance?.parent
      if (rootProps?.collapse) return 20
      while (parent && parent.type.name !== 'ElMenu') {
        if (parent.type.name === 'ElSubMenu') {
          padding += 20
        }
        parent = parent.parent
      }
      return padding
    })

    return () => (
      <li class="menu-item-group">
        <div
          class="menu-item-group__title"
          style={{ paddingLeft: levelPadding.value + 'px' }}>
          {slots.title ? slots.title() : props.title}
        </div>
        <ul>{slots?.default?.()}</ul>
      </li>
    )
  }
})

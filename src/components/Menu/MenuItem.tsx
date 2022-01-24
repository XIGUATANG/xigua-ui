import {
  defineComponent,
  computed,
  onMounted,
  onBeforeUnmount,
  inject,
  getCurrentInstance
} from 'vue'
import useMenu from './use-menu'
import type { RootMenuProvider, SubMenuProvider } from './menu.type'
export default defineComponent({
  name: 'ElMenuItem',
  // componentName: 'ElMenuItem',
  props: {
    index: {
      type: String,
      default: null
    },
    route: [String, Object],
    disabled: Boolean
  },
  emits: ['click'],
  setup(props, { emit, slots }) {
    const instance = getCurrentInstance()
    const rootMenu = inject<RootMenuProvider>('rootMenu')
    const { parentMenu, paddingStyle, indexPath } = useMenu(
      instance!,
      computed(() => props.index)
    )
    const { addSubMenu, removeSubMenu } =
      inject<SubMenuProvider>(`subMenu:${parentMenu?.value?.uid}`) || {}
    const active = computed(() => {
      return props.index === rootMenu?.activeIndex.value
    })
    const handleClick = () => {
      if (!props.disabled) {
        rootMenu?.methods.handleMenuItemClick({
          index: props.index,
          indexPath,
          route: props.route
        })
        emit('click', {
          index: props.index,
          indexPath: indexPath.value
        })
      }
    }
    onMounted(() => {
      addSubMenu && addSubMenu({ index: props.index, indexPath, active })
      rootMenu?.methods.addMenuItem({ index: props.index, indexPath, active })
    })
    onBeforeUnmount(() => {
      removeSubMenu && removeSubMenu({ index: props.index, indexPath, active })
      rootMenu?.methods.removeMenuItem({
        index: props.index,
        indexPath,
        active
      })
    })
    return () => (
      <li
        role="menuitem"
        tabindex="-1"
        style={paddingStyle.value}
        class={{
          'menu-item': true,
          'is-active': active.value,
          'is-disabled': props.disabled
        }}
        onClick={handleClick}>
        <>
          {slots?.default?.()}
          {slots?.title?.()}
        </>
      </li>
    )
  }
})

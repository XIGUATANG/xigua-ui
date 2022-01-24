import {
  defineComponent,
  getCurrentInstance,
  watch,
  computed,
  ref,
  provide,
  onMounted,
  isRef,
  h,
  PropType,
  withDirectives
} from 'vue'
import Resize from '@/directives/resize'
import Menubar from '@/utils/menu/menu-bar'
import ElMenuCollapseTransition from './menu-collapse-transition.vue'
import ElSubMenu from './submenu.vue'
import type { VNode, Ref, ComputedRef } from 'vue'
import type {
  IMenuProps,
  RootMenuProvider,
  RegisterMenuItem,
  SubMenuProvider
} from './menu.type'

export default defineComponent({
  name: 'ElMenu',

  props: {
    mode: {
      type: String as PropType<'vertical' | 'horizontal'>,
      default: 'vertical'
    },
    defaultActive: {
      type: String,
      default: ''
    },
    defaultOpeneds: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    uniqueOpened: Boolean,
    router: Boolean,
    menuTrigger: {
      type: String,
      default: 'hover'
    },
    collapse: {
      type: Boolean,
      default: false
    },
    backgroundColor: { type: String },
    textColor: { type: String },
    activeTextColor: { type: String },
    collapseTransition: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close', 'open', 'select'],

  setup(props: IMenuProps, { emit, slots, expose }) {
    // data
    const openedMenus = ref(
      props.defaultOpeneds && !props.collapse
        ? props.defaultOpeneds.slice(0)
        : []
    )
    const instance = getCurrentInstance()
    const activeIndex = ref(props.defaultActive || '')
    const items = ref<{ [k: string]: RegisterMenuItem }>({})
    const submenus = ref<{ [k: string]: RegisterMenuItem }>({})
    const alteredCollapse = ref(false)
    const router = instance?.appContext.config.globalProperties.$router
    const menu = ref<HTMLLIElement | null>(null)

    // computed
    const isMenuPopup = computed(() => {
      return (
        props.mode === 'horizontal' ||
        (props.mode === 'vertical' && props.collapse)
      )
    }) as Ref<boolean>

    // methods

    const initializeMenu = () => {
      const index = activeIndex.value
      const activeItem = items.value[index]
      if (!activeItem || props.mode === 'horizontal' || props.collapse) return

      const indexPath = activeItem.indexPath

      // 展开该菜单项的路径上所有子菜单
      // expand all submenus of the menu item
      indexPath.forEach((index: string) => {
        const submenu = submenus.value[index]
        submenu && openMenu(index, submenu?.indexPath)
      })
    }

    const addSubMenu = (item: RegisterMenuItem) => {
      submenus.value[item.index] = {
        index: item.index,
        indexPath: isRef(item.indexPath)
          ? item.indexPath.value
          : item.indexPath,
        active: isRef(item.active) ? item.active.value : item.active
      }
    }

    const removeSubMenu = (item: RegisterMenuItem) => {
      delete submenus.value[item.index]
    }

    const addMenuItem = (item: RegisterMenuItem) => {
      items.value[item.index] = {
        index: item.index,
        indexPath: isRef(item.indexPath)
          ? item.indexPath.value
          : item.indexPath,
        active: isRef(item.active) ? item.active.value : item.active
      }
    }

    const removeMenuItem = (item: RegisterMenuItem) => {
      delete items.value[item.index]
    }

    const openMenu = (index: string, indexPath?: Ref<string[]> | string[]) => {
      if (openedMenus.value.includes(index)) return
      // 将不在该菜单路径下的其余菜单收起
      // collapse all menu that are not under current menu item
      if (props.uniqueOpened) {
        openedMenus.value = openedMenus.value.filter((index: string) => {
          return (
            // @ts-ignore
            (isRef(indexPath) ? indexPath.value : indexPath).indexOf(index) !==
            -1
          )
        })
      }
      openedMenus.value.push(index)
    }

    const closeMenu = (index: string) => {
      const i = openedMenus.value.indexOf(index)
      if (i !== -1) {
        openedMenus.value.splice(i, 1)
      }
    }

    const open = (index: string) => {
      const { indexPath } = submenus.value[index.toString()]
      indexPath.forEach(i => openMenu(i, indexPath))
    }

    const close = (index: string) => {
      closeMenu(index)
    }

    const handleSubMenuClick = (submenu: RegisterMenuItem) => {
      const { index, indexPath } = submenu
      const isOpened = openedMenus.value.includes(index)

      if (isOpened) {
        closeMenu(index)
        emit('close', index, indexPath.value)
      } else {
        openMenu(index, indexPath)
        emit('open', index, indexPath.value)
      }
    }

    const handleMenuItemClick = (item: {
      index: string
      indexPath: ComputedRef<string[]>
      route?: any
    }) => {
      const { index, indexPath } = item
      const hasIndex = item.index !== null
      const emitParams = [index, indexPath.value, item]

      if (props.mode === 'horizontal' || props.collapse) {
        openedMenus.value = []
      }

      if (!hasIndex) {
        return
      }

      if (props.router && router) {
        const route = item.route || item.index
        const routerResult = router
          .push(route)
          .then((navigationResult: any) => {
            if (!navigationResult) {
              activeIndex.value = item.index
            }
            return navigationResult
          })
        emit('select', ...emitParams.concat(routerResult))
      } else {
        activeIndex.value = item.index
        emit('select', ...emitParams)
      }
    }

    const updateActiveIndex = (val: string) => {
      const itemsInData = items.value
      const item =
        itemsInData[val] ||
        itemsInData[activeIndex.value] ||
        itemsInData[props.defaultActive!]

      if (item) {
        activeIndex.value = item.index
        initializeMenu()
      } else {
        // Can't find item when collapsing
        // and activeIndex shouldn't be changed when 'collapse' was changed.
        // Then reset 'alteredCollapse' immediately.
        if (!alteredCollapse.value) {
          activeIndex.value = ''
        } else {
          alteredCollapse.value = false
        }
      }
    }
    const handleResize = () => instance?.proxy?.$forceUpdate()

    watch(
      () => props.defaultActive,
      currentActive => {
        if (!items.value[currentActive!]) {
          activeIndex.value = ''
        }
        updateActiveIndex(currentActive!)
      }
    )

    watch(items.value, () => {
      initializeMenu()
    })

    watch(
      () => props.collapse,
      (value, prev) => {
        if (value !== prev) {
          alteredCollapse.value = true
        }
        if (value) openedMenus.value = []
      }
    )

    // provide
    provide<RootMenuProvider>('rootMenu', {
      props,
      openedMenus,
      items,
      submenus,
      activeIndex,
      isMenuPopup,
      methods: {
        addMenuItem,
        removeMenuItem,
        addSubMenu,
        removeSubMenu,
        openMenu,
        closeMenu,
        handleMenuItemClick,
        handleSubMenuClick
      }
    })

    provide<SubMenuProvider>(`subMenu:${instance?.uid}`, {
      addSubMenu,
      removeSubMenu
    })

    // lifecycle

    onMounted(() => {
      initializeMenu()
      if (props.mode === 'horizontal') {
        instance?.vnode?.el && new Menubar(instance.vnode.el)
      }
    })

    expose({
      open,
      close
    })

    const flattedChildren = (children: any) => {
      const temp = Array.isArray(children) ? children : [children]
      const res: any[] = []
      temp.forEach(child => {
        if (Array.isArray(child.children)) {
          res.push(...flattedChildren(child.children))
        } else {
          res.push(child)
        }
      })
      return res
    }

    const useVNodeResize = (vnode: VNode) =>
      props.mode === 'horizontal'
        ? withDirectives(vnode, [[Resize, handleResize]])
        : vnode
    return () => {
      let slot = slots.default?.() ?? []
      const showMore = []

      if (props.mode === 'horizontal' && menu.value) {
        const items = Array.from(
          (menu.value as Node | undefined)?.childNodes ?? []
        ).filter(
          item => item.nodeName !== '#text' || item.nodeValue
        ) as HTMLElement[]
        const originalSlot = flattedChildren(slot)
        const moreItemWidth = 64
        const paddingLeft = parseInt(
          getComputedStyle(menu.value).paddingLeft,
          10
        )
        const paddingRight = parseInt(
          getComputedStyle(menu.value).paddingRight,
          10
        )
        const menuWidth = menu.value.clientWidth - paddingLeft - paddingRight
        let calcWidth = 0
        let sliceIndex = 0
        items.forEach((item, index) => {
          calcWidth += item.offsetWidth || 0
          if (calcWidth <= menuWidth - moreItemWidth) {
            sliceIndex = index + 1
          }
        })
        const defaultSlot = originalSlot.slice(0, sliceIndex)
        const moreSlot = originalSlot.slice(sliceIndex)
        if (moreSlot?.length) {
          slot = defaultSlot
          showMore.push(
            <ElSubMenu index="sub-menu-more" class="sub-menu__hide-arrow">
              {{
                title: () => <i class="icon-more sub-menu__icon-more"></i>,
                default: () => moreSlot
              }}
            </ElSubMenu>
          )
        }
      }

      const vnodeMenu = useVNodeResize(
        <ul
          {...{
            key: String(props.collapse),
            role: 'menubar',
            ref: menu,
            class: {
              menu: true,
              horizontal: props.mode === 'horizontal',
              'menu--collapse': props.collapse
            }
          }}>
          {[...slot.map(vnode => useVNodeResize(vnode)), ...showMore]}
        </ul>
      )

      if (props.collapseTransition && props.mode === 'vertical') {
        return <ElMenuCollapseTransition>{vnodeMenu}</ElMenuCollapseTransition>
      }

      return vnodeMenu
    }
  }
})

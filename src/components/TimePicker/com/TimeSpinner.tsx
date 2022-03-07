import { defineComponent, ref, onMounted, PropType, onBeforeUpdate } from 'vue'
import '@/styles/time-spinner.css'

export default defineComponent({
  props: {
    onPick: {
      type: Function as PropType<(value: number) => void>,
      default: () => { }
    },
    value: {
      type: Number
    }
  },
  setup(props) {
    const handleClick = (e: MouseEvent, i: number) => {
      const item = e.target as HTMLElement
      item.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
      props.onPick(i)
    }
    const cells = ref<HTMLElement[]>([])
    onMounted(() => {
      if (props.value != null) {
        cells.value[props.value]?.scrollIntoView({
          block: 'start'
        })
      }
    })
    onBeforeUpdate(() => {
      cells.value = []
    })
    return () => (
      <div class="flex relative w-16">
        <div class="snap-y h-280px overflow-auto w-16 text-gray-800">
          {
            Array(24).fill(0).map((_, i) => <div ref={item => cells.value.push(item as HTMLElement)} onClick={e => handleClick(e, i)} class={['time-panel-cell', props.value === i ? 'active' : null]}>
              {i < 10 ? `0${i}` : i}
            </div>)
          }
          <div style="height:248px"></div>
        </div>
      </div >
    )
  }
})

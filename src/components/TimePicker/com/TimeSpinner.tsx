import { defineComponent, ref, onMounted, PropType, onBeforeUpdate, computed, watch, watchEffect } from 'vue'
import '@/styles/time-spinner.css'
import dayjs, { Dayjs } from 'dayjs'
import { DisabledDate } from '../types'
import { defList } from './useTimePiker'

export default defineComponent({
  props: {
    date: {
      type: Object as PropType<Dayjs>,
      default: () => dayjs()
    },
    onPick: {
      type: Function as PropType<(value: number) => void>,
      default: () => { }
    },
    value: {
      type: Number
    },
    mode: {
      type: String as PropType<'hour'|'minute'|'second'>,
      default: 'hour'
    },
    disabledDate: {
      type: Function as PropType<DisabledDate>
    },
    secondStep: {
      type: Number,
      default: 1
    }
  },
  setup(props) {
    const handleClick = (e: MouseEvent, i: number) => {
      // const item = e.target as HTMLElement
      // item.scrollIntoView({
      //   block: 'start',
      //   behavior: 'smooth'
      // })
      props.onPick(i)
    }
    const cellList = computed(() => {
      if (props.mode === 'hour') {
        return defList(24, (i) => props.disabledDate?.(props.date.set('hour', i)) ?? false)
      } else if (props.mode === 'minute') {
        return defList(60, (i) => props.disabledDate?.(props.date.set('minute', i)) ?? false)
      }
      return defList(60, (i) => props.disabledDate?.(props.date.set('second', i)) ?? false, props.secondStep)
    })
    const cells = ref<HTMLElement[]>([])
    onMounted(() => {
      if (props.value != null) {
        cells.value[props.value]?.scrollIntoView({
          block: 'start',
          behavior: 'smooth'
        })
      }
    })

    watchEffect(() => {
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
      <div class="relative w-16 time-panel-column">
        <div class="snap-y h-280px overflow-auto w-16 text-gray-800">
          {
           cellList.value.map(item => <div ref={item => cells.value.push(item as HTMLElement)} onClick={e => handleClick(e, item.value)} class={['time-panel-cell', props.value === item.value ? 'active' : null]}>
              {item.label}
            </div>)
          }
          <div style="height:248px"></div>
        </div>
      </div >
    )
  }
})

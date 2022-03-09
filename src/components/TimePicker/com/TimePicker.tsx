import dayjs, { Dayjs } from 'dayjs'
import { computed, defineComponent, PropType } from 'vue'
import TimeSpinner from './TimeSpinner'

export default defineComponent({
  props: {
    value: Object as PropType<Dayjs>,
    onPick: Function as PropType<(v: Dayjs) => void>
  },
  emits: ['update:modelValue'],
  name: 'TimePicker',
  setup(props) {
    const hour = computed(() => props.value?.hour())
    const min = computed(() => props.value?.minute())
    const sec = computed(() => props.value?.second())

    const emitValue = (unit: 'hour' | 'minute' | 'second', value: number) => {
      const dayValue = props.value || dayjs()
      props.onPick?.(dayValue.set(unit, value))
    }
    return () => (
      <div class="flex divide-x">
        <TimeSpinner mode="hour" value={hour.value} onPick={(n) => emitValue('hour', n)} />
        <TimeSpinner mode="second" value={min.value} onPick={(n) => emitValue('minute', n)} />
        <TimeSpinner mode="minute" value={sec.value} onPick={(n) => emitValue('second', n)} />
      </div>
    )
  }

})

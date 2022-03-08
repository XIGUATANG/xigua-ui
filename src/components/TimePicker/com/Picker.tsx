import { computed, defineComponent, PropType } from 'vue'
import TimeSpinner from './TimeSpinner'

export default defineComponent({
  props: {
    modelValue: Object as PropType<Date>
  },
  emits: ['update:modelValue'],
  name: 'TimePicker',
  setup(props, { emit }) {
    const hour = computed(() => props.modelValue?.getHours())
    const min = computed(() => props.modelValue?.getMinutes())
    const sec = computed(() => props.modelValue?.getSeconds())
    return () => (
      <div class="flex divide-x">
        <TimeSpinner mode="hour" value={hour.value} onPick={(n) => props.modelValue && emit('update:modelValue', new Date(props.modelValue.setHours(n)!))}/>
        <TimeSpinner mode="second" value={min.value} onPick={(n) => props.modelValue && emit('update:modelValue', new Date(props.modelValue.setMinutes(n)!))}/>
        <TimeSpinner mode="minute" value={sec.value} onPick={(n) => props.modelValue && emit('update:modelValue', new Date(props.modelValue.setSeconds(n)!))}/>
      </div>
    )
  }

})

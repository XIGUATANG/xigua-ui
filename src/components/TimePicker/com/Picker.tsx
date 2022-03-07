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
    return () => (
      <div class="flex">
        <TimeSpinner value={hour.value} onPick={(n) => props.modelValue && emit('update:modelValue', new Date(props.modelValue.setHours(n)!))}/>
      </div>
    )
  }

})

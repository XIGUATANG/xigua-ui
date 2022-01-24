import { defineComponent, PropType } from 'vue'
import { MONTHS } from '../constant'

export default defineComponent({
  name: 'MonthTable',
  props: {
    month: {
      type: Number
    },
    onPick: {
      type: Function as PropType<(i: number) => void>,
      required: true
    }
  },
  setup(props) {
    return () => (
      <div class="grid month-table">
        {MONTHS.map((text, index) => (
          <div
            onClick={() => props.onPick(index)}
            class={{
              'month-table-cell': true,
              active: props.month === index
            }}>
            {text}
          </div>
        ))}
      </div>
    )
  }
})

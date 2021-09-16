import { defineComponent, ref, PropType } from 'vue'
import DateTable, { OnPickFunction, RangeState, SelectionMode } from './DateTable'

import '@/styles/date-picker.css'
import dayjs, { Dayjs } from 'dayjs'

export default defineComponent({
  props: {
    type: {
      type: String as PropType<SelectionMode>
    }
  },
  setup() {
    const minDate = ref<Dayjs|null>(dayjs())
    const maxDate = ref<Dayjs|null>(dayjs().add(12, 'days'))
    const handlePick:OnPickFunction = ({ minDate: _min, maxDate: _max }) => {
      minDate.value = _min
      maxDate.value = _max
    }

    const rangeState = ref<RangeState>({
      endDate: null,
      selecting: false
    })

    const onSelect = (selecting:boolean) => {
      rangeState.value.selecting = selecting
      if (!selecting) {
        rangeState.value.endDate = null
      }
    }

    const handleChangeRange = (val:RangeState) => {
      rangeState.value = val
    }
    return {
      minDate,
      rangeState,
      maxDate,
      onSelect,
      handlePick,
      handleChangeRange
    }
  },
  render() {
    return (
      <div class="inline-flex shadow-md rounded-xl xg-date-picker divide-x-1 divide-gray-500">
        <DateTable selectionMode={this.type} onChangeRange={this.handleChangeRange} rangeState={this.rangeState} onSelect={this.onSelect} onPick={this.handlePick} minDate={this.minDate} maxDate={this.maxDate} />
        <DateTable selectionMode={this.type} onChangeRange={this.handleChangeRange} date={dayjs().add(1, 'month')} rangeState={this.rangeState} onSelect={this.onSelect} onPick={this.handlePick} minDate={this.minDate} maxDate={this.maxDate} />
      </div>
    )
  }
})

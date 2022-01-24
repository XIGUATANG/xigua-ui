import { defineComponent, PropType, ref } from 'vue'

import '@/styles/date-picker.css'
import DateRangePanel from './com/DateRangePanel'
import Input from 'components/input/index'
import Picker from './com/Picker'
import DateTable from './com/DateTable'
import dayjs, { isDayjs, Dayjs } from 'dayjs'
import DatePanel from './com/DatePanel'
import { DEFAULT_FORMATS_DATEPICKER, DEFAULT_FORMATS_DATE } from './constant'
import { IDatePickerType } from './type'

export default defineComponent({
  props: {
    format: {
      type: String
    },
    type: {
      type: String as PropType<IDatePickerType>,
      default: 'date'
    }
  },
  setup(props) {
    const value = ref(new Date())
    const format =
      props.format ??
      (DEFAULT_FORMATS_DATEPICKER[props.type] || DEFAULT_FORMATS_DATE)
    return () => (
      <div>
        <Picker type="date" v-model={value.value} format={format}>
          {{
            default: (scopedProps: Record<string, unknown>) => (
              <DatePanel type="date" {...{ ...scopedProps }}></DatePanel>
            )
          }}
        </Picker>
        {/* <DateRangePanel type="range" />
        <p>Week Range</p>
        <DateRangePanel type="weekrange" /> */}
      </div>
    )
  }
})

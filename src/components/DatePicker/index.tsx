import { computed, defineComponent, PropType, ref } from 'vue'

import '@/styles/date-picker.css'
import DateRangePanel from './com/DateRangePanel'
import Input from 'components/Input/index'
import Picker from './com/Picker'
import DateTable from './com/DateTable'
import dayjs, { isDayjs, Dayjs } from 'dayjs'
import DatePanel from './com/DatePanel'
import { DEFAULT_FORMATS_DATEPICKER, DEFAULT_FORMATS_DATE } from './constant'
import { IDatePickerType } from './type'
import { datePickDefaultProps } from './com/props'

export default defineComponent({
  name: 'DatePicker',
  props: {
    ...datePickDefaultProps,
    type: {
      type: String as PropType<IDatePickerType>,
      default: 'date'
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const format = computed(
      () =>
        props.format ??
        (DEFAULT_FORMATS_DATEPICKER[props.type] || DEFAULT_FORMATS_DATE)
    )

    return () => (
      <div>
        <Picker
          {...{
            ...props,
            format: format.value,
            'onUpdate:modelValue': (value: Date) =>
              emit('update:modelValue', value)
          }}>
          {{
            default: (scopedProps: Record<string, unknown>) => (
              <DatePanel type={props.type} {...{ ...scopedProps }}></DatePanel>
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

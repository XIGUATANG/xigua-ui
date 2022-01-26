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

const DATE_RANGE_TYPES = ['daterange', 'weekrange']

const getPanel = (type: IDatePickerType) => {
  if (DATE_RANGE_TYPES.includes(type)) {
    return DateRangePanel
  } else return DatePanel
}

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
            default: (scopedProps: Record<string, unknown>) => {
              const Panel = getPanel(props.type)
              return <Panel type={props.type} {...{ ...scopedProps }} />
            }
          }}
        </Picker>
        {/* <DateRangePanel type="range" />
        <p>Week Range</p>
        <DateRangePanel type="weekrange" /> */}
      </div>
    )
  }
})

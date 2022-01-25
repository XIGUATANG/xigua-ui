import dayjs, { Dayjs } from 'dayjs'
import { computed, defineComponent, inject, PropType } from 'vue'
import { MONTHS } from '../constant'
import { IDatePickerType } from '../type'

export default defineComponent({
  name: 'MonthTable',
  props: {
    month: {
      type: Number
    },
    onPick: {
      type: Function as PropType<(i: number) => void>,
      required: true
    },
    year: {
      type: Number
    },
    yearStart: {
      type: Number,
      required: true
    },
    type: {
      type: String as PropType<IDatePickerType>
    },
    disabledDate: {
      type: Function as PropType<(date: Date) => boolean>
    }
  },

  setup(props) {
    const isMonthPick = computed(
      () => props.type === 'month' || props.type === 'monthrange'
    )
    const years = computed(() => {
      let startYear = dayjs()
        .set('year', props.yearStart)
        .startOf('year')
        .year()
      const endYear = startYear + 9
      const resValue = []
      while (startYear <= endYear) {
        resValue.push({
          text: startYear,
          disabled:
            (isMonthPick.value &&
              props.disabledDate?.(
                dayjs(startYear).startOf('year').toDate()
              )) ??
            false
        })
        startYear++
      }
      return resValue
    })

    const getCellClasses = (year: number, disabled: boolean) => {
      const classes = ['yaer-table-cell']
      if (disabled) classes.push('is-disabled')
      if (props.year === year) classes.push('active')
      return classes
    }

    return () => (
      <div class="year-table">
        {years.value.map(({ text, disabled }, index) => (
          <div
            onClick={() => props.onPick(text)}
            class={getCellClasses(text, disabled)}>
            {text}
          </div>
        ))}
      </div>
    )
  }
})

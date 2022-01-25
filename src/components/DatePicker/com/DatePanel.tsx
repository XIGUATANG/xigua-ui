import {
  defineComponent,
  ref,
  PropType,
  watchEffect,
  computed,
  watch,
  inject
} from 'vue'
import DateTable, { OnPickFunction, RangeState } from './DateTable'

import LeftArrow from '@/components/LeftArrow.vue'
import RightArrow from '@/components/RightArrow.vue'

import '@/styles/date-picker.css'
import dayjs, { Dayjs, isDayjs } from 'dayjs'
import type { IDatePickerType, PickerOptions } from '../type'

import { MONTHS } from '../constant'
import MonthTable from './MonthTable'
import YearTable from './YearTable'

export default defineComponent({
  name: 'DatePanel',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    parsedValue: {
      type: Object as PropType<Dayjs>
    },
    format: {
      type: String,
      default: ''
    },
    type: {
      type: String as PropType<IDatePickerType>,
      required: true
    },
    onPick: {
      type: Function as PropType<OnPickFunction>
    },
    onSetPickerOption: {
      type: Function as PropType<
        <T extends keyof PickerOptions>(key: T, value: PickerOptions[T]) => void
      >
    }
  },
  setup(props) {
    const minDate = ref<Dayjs | null>(dayjs())
    const maxDate = ref<Dayjs | null>(dayjs().add(12, 'days'))

    const innerDate = ref<Dayjs>(dayjs())
    const rightDate = ref<Dayjs>(dayjs().add(1, 'month'))
    const handlePick: OnPickFunction = (
      prams: Dayjs | { minDate: Dayjs | null; maxDate: Dayjs | null }
    ) => {
      if (isDayjs(prams)) {
        props.onPick?.(prams)
      }
    }

    const rangeState = ref<RangeState>({
      endDate: null,
      selecting: false
    })

    const onSelect = (selecting: boolean) => {
      rangeState.value.selecting = selecting
      if (!selecting) {
        rangeState.value.endDate = null
      }
    }

    const handlePrev = () => {
      if (currentView.value === 'date') {
        innerDate.value = innerDate.value.add(-1, 'month')
      } else if (currentView.value === 'year') {
        yearStartValue.value = yearStartValue.value + 10
      }
    }
    const handleNext = () => {
      if (currentView.value === 'date') {
        innerDate.value = innerDate.value.add(1, 'month')
      } else if (currentView.value === 'year') {
        yearStartValue.value = yearStartValue.value + 10
      }
    }

    const formatToString = (value: Dayjs | Dayjs[]) => {
      if (Array.isArray(value)) {
        return value.map(_ => _.format(props.format))
      }
      return value.format(props.format)
    }

    const pickerBase = inject('EP_PICKER_BASE') as any

    const {
      shortcuts,
      disabledDate,
      cellClassName,
      defaultTime,
      defaultValue,
      arrowControl
    } = pickerBase.props

    const isValidValue = (date: unknown) => {
      return (
        dayjs.isDayjs(date) &&
        date.isValid() &&
        (disabledDate ? !disabledDate(date.toDate()) : true)
      )
    }

    props.onSetPickerOption?.('formatToString', formatToString)
    props.onSetPickerOption?.('isValidValue', isValidValue)

    const parsedValue = computed(() => props.parsedValue)

    const currentView = ref<'month' | 'date' | 'year'>('date')

    const setDefaultInnerDate = () => {
      const year = (props.parsedValue || dayjs()).year()
      const month = (props.parsedValue || dayjs()).month()

      if (
        year !== innerDate.value.year() ||
        month !== innerDate.value.month()
      ) {
        innerDate.value = dayjs().set('year', year).set('month', month)
        yearStartValue.value = yearStart()
      }
    }

    watch(parsedValue, () => setDefaultInnerDate(), { immediate: true })

    const selectionMode = computed(() => {
      if (['week', 'month', 'year', 'dates'].includes(props.type)) {
        return props.type
      }
      return 'day'
    })

    const getDefaultView = (val: IDatePickerType | 'day') => {
      if (val === 'month' || val === 'year') {
        return val
      }
      return 'date'
    }
    watch(
      () => props.visible,
      val => {
        if (val === false) {
          currentView.value = getDefaultView(selectionMode.value)
          setDefaultInnerDate()
        }
      }
    )

    watch(
      () => selectionMode.value,
      val => {
        currentView.value = getDefaultView(val)
      },
      { immediate: true }
    )

    const yearStart = () => {
      const year = (props.parsedValue || dayjs()).year()
      return year - (year % 10)
    }

    const yearStartValue = ref(yearStart())

    const handleYearPick = (year: number) => {
      if (selectionMode.value === 'year') {
        props.onPick?.(dayjs().set('year', year).startOf('year'))
      } else {
        innerDate.value = innerDate.value.set('year', year)
        currentView.value = getDefaultView(selectionMode.value)
      }
    }

    const handleMonthPick = (i: number) => {
      if (selectionMode.value === 'month') {
        props.onPick?.(innerDate.value.set('month', i).startOf('month'))
      } else {
        innerDate.value = innerDate.value.set('month', i)
        currentView.value = getDefaultView(selectionMode.value)
      }
    }

    return {
      minDate,
      rangeState,
      maxDate,
      onSelect,
      handlePick,
      innerDate,
      rightDate,
      handlePrev,
      handleNext,
      currentView,
      handleMonthPick,
      handleYearPick,
      yearStartValue
    }
  },

  render() {
    return (
      <div class="inline-flex shadow-md rounded-xl divide-x-1 divide-gray-500 pt-5 px-6 pb-6">
        <div>
          <div class="flex justify-between items-center text-sm">
            <div
              onClick={this.handlePrev}
              class="hover:bg-gray-100 rounded-lg cursor-pointer">
              <LeftArrow />
            </div>
            <div>
              {this.currentView === 'year' ? (
                <span class="inline-flex items-center px-2 h-10">{`${
                  this.yearStartValue
                } - ${this.yearStartValue + 9}`}</span>
              ) : (
                <span
                  onClick={() => (this.currentView = 'year')}
                  class="hover:bg-gray-100 rounded-lg cursor-pointer inline-flex items-center px-2 h-10">
                  {this.innerDate.year()}
                </span>
              )}

              {this.currentView === 'date' ? (
                <span
                  onClick={() => (this.currentView = 'month')}
                  class="hover:bg-gray-100 rounded-lg cursor-pointer inline-flex items-center px-2 h-10">
                  {MONTHS[this.innerDate.month()]}
                </span>
              ) : null}
            </div>

            <div
              onClick={this.handleNext}
              class="hover:bg-gray-100 rounded-lg cursor-pointer">
              <RightArrow />
            </div>
          </div>

          {this.currentView === 'date' && (
            <DateTable
              selectionMode="day"
              parsedValue={this.parsedValue}
              onPick={this.handlePick}
              date={this.innerDate}
            />
          )}

          {this.currentView === 'month' && (
            <MonthTable
              onPick={this.handleMonthPick}
              month={this.innerDate.month()}></MonthTable>
          )}
          {this.currentView === 'year' && (
            <YearTable
              yearStart={this.yearStartValue}
              year={this.parsedValue?.year()}
              type={this.type}
              onPick={this.handleYearPick}
            />
          )}
        </div>
      </div>
    )
  }
})

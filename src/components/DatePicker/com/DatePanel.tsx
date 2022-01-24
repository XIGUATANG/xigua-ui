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

    const leftDate = ref<Dayjs>(dayjs())
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
      leftDate.value = leftDate.value.add(-1, 'month')
    }
    const handleNext = () => {
      leftDate.value = leftDate.value.add(1, 'month')
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

    const handlePickMonth = (i: number) => {
      leftDate.value = leftDate.value.set('month', i)
      currentView.value = 'date'
    }

    watch(parsedValue, () => {
      const year = (props.parsedValue || dayjs()).year()
      const month = (props.parsedValue || dayjs()).month()
      if (year !== leftDate.value.year() || month !== leftDate.value.month()) {
        leftDate.value = dayjs().set('year', year).set('month', month)
      }
    })

    return {
      minDate,
      rangeState,
      maxDate,
      onSelect,
      handlePick,
      leftDate,
      rightDate,
      handlePrev,
      handleNext,
      currentView,
      handlePickMonth
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
              <span class="hover:bg-gray-100 rounded-lg cursor-pointer inline-flex items-center px-2 h-10">
                {this.leftDate.year()}
              </span>
              <span
                onClick={() => (this.currentView = 'month')}
                class="hover:bg-gray-100 rounded-lg cursor-pointer inline-flex items-center px-2 h-10">
                {MONTHS[this.leftDate.month()]}
              </span>
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
              date={this.leftDate}
            />
          )}

          {this.currentView === 'month' && (
            <MonthTable
              onPick={this.handlePickMonth}
              month={this.leftDate.month()}></MonthTable>
          )}
        </div>
      </div>
    )
  }
})

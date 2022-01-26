import { defineComponent, ref, PropType, computed, watch, inject } from 'vue'
import DateTable, {
  OnPickFunction,
  RangeState,
  SelectionMode
} from './DateTable'

import LeftArrow from 'components/Svg/Left.vue'
import RightArrow from 'components/Svg/Right.vue'

import '@/styles/date-picker.css'
import dayjs, { Dayjs, isDayjs } from 'dayjs'
import { IDatePickerType, TableView } from '../type'

const MONTHS = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月'
]

export default defineComponent({
  name: 'DateRangePanel',
  props: {
    type: {
      type: String as PropType<IDatePickerType>
    },
    parsedValue: {
      type: Array as PropType<Dayjs[]>
    },
    onPick: {
      type: Function as PropType<(value: Dayjs[], visible: boolean) => void>
    }
  },
  setup(props, ctx) {
    const minDate = ref<Dayjs | null>(null)
    const maxDate = ref<Dayjs | null>(null)

    const pickerBase = inject('EP_PICKER_BASE') as any
    const {
      shortcuts,
      disabledDate,
      cellClassName,
      format,
      defaultTime,
      defaultValue,
      arrowControl,
      clearable
    } = pickerBase.props

    const handleConfirm = (visible = false) => {
      const pickPrams = [minDate.value, maxDate.value]
      if (isValidValue(pickPrams)) {
        props.onPick?.(pickPrams, visible)
      }
    }

    const isValidValue = (
      value: Array<Dayjs | null> | null
    ): value is Dayjs[] => {
      return (
        Array.isArray(value) &&
        !!value[0] &&
        !!value[1] &&
        value[0].valueOf() <= value[1].valueOf()
      )
    }

    const formatEmit = (emitDayjs: Dayjs | null, index: number) => {
      if (!emitDayjs) return null
      if (defaultTime as any[]) {
        const defaultTimeD = dayjs(defaultTime[index] || defaultTime)
        return defaultTimeD
          .year(emitDayjs.year())
          .month(emitDayjs.month())
          .date(emitDayjs.date())
      }
      return emitDayjs
    }
    const handlePick = (
      prams: Dayjs | { minDate: Dayjs | null; maxDate: Dayjs | null }
    ) => {
      if (isDayjs(prams)) return
      const min_ = prams.minDate
      const max_ = prams.maxDate
      const minDate_ = formatEmit(min_, 0)
      const maxDate_ = formatEmit(max_, 1)

      if (maxDate.value === maxDate_ && minDate.value === minDate_) {
        return
      }
      ctx.emit('calendar-change', [min_?.toDate(), max_ && max_.toDate()])
      maxDate.value = maxDate_
      minDate.value = minDate_

      handleConfirm()
      // props.onPick?.([_min!, _max!])
    }

    const selectionMode = computed<SelectionMode>(() => {
      if (props.type === 'daterange') {
        return 'range'
      } else if (props.type === 'weekrange') {
        return 'weekrange'
      }
      return 'day'
    })

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

    const leftView = ref<TableView>('date')
    const rightView = ref<TableView>('date')

    const leftInnerDate = ref(dayjs())
    const rightInnerDate = ref(dayjs())

    watch(
      () => props.parsedValue,
      val => {
        const [startDate, endDate] = val || []
        minDate.value = startDate ?? null
        maxDate.value = endDate ?? null
        if (!startDate) {
          leftInnerDate.value = dayjs().startOf('month')
          rightInnerDate.value = dayjs().startOf('month').add(1, 'month')
        } else {
          leftInnerDate.value = startDate.startOf('month')
          if (!endDate) {
            rightInnerDate.value = startDate.add(1, 'month').startOf('month')
          } else rightInnerDate.value = endDate.startOf('month')
          if (startDate.diff(endDate, 'month') === 0) {
            rightInnerDate.value = leftInnerDate.value.add(1, 'month')
          }
        }
      },
      {
        immediate: true
      }
    )

    const handleChangeRange = (val: RangeState) => {
      rangeState.value = val
    }
    return {
      minDate,
      rangeState,
      maxDate,
      onSelect,
      handlePick,
      handleChangeRange,
      leftInnerDate,
      rightInnerDate,
      selectionMode
    }
  },
  render() {
    return (
      <div class="grid grid-cols-2 divide-x divide-inherit shadow-md rounded-xl">
        <div class="px-6 py-5">
          <div class="flex justify-between items-center text-sm">
            <div class="hover:bg-gray-100 rounded-lg cursor-pointer">
              <LeftArrow />
            </div>
            <div>
              <span class="hover:bg-gray-100 rounded-lg cursor-pointer inline-flex items-center px-2 h-10">
                {this.leftInnerDate.year()}
              </span>
              <span class="hover:bg-gray-100 rounded-lg cursor-pointer inline-flex items-center px-2 h-10">
                {MONTHS[this.leftInnerDate.month()]}
              </span>
            </div>

            <div class="hover:bg-gray-100 rounded-lg cursor-pointer">
              <RightArrow />
            </div>
          </div>
          <DateTable
            selectionMode={this.selectionMode}
            onChangeRange={this.handleChangeRange}
            rangeState={this.rangeState}
            onSelect={this.onSelect}
            date={this.leftInnerDate}
            onPick={this.handlePick}
            minDate={this.minDate}
            maxDate={this.maxDate}
          />
        </div>
        <div class="px-6 py-5">
          <div class="flex justify-between items-center  text-sm">
            <div class="hover:bg-gray-100 rounded-lg cursor-pointer">
              <LeftArrow />
            </div>
            <div class="h-full">
              <span class="hover:bg-gray-100 rounded-lg cursor-pointer inline-flex items-center px-2 h-10">
                {this.rightInnerDate.year()}
              </span>
              <span class="hover:bg-gray-100 rounded-lg cursor-pointer inline-flex items-center  px-2 h-10">
                {MONTHS[this.rightInnerDate.month()]}
              </span>
            </div>

            <div class="hover:bg-gray-100 rounded-lg cursor-pointer">
              <RightArrow />
            </div>
          </div>
          <DateTable
            selectionMode={this.selectionMode}
            onChangeRange={this.handleChangeRange}
            date={this.rightInnerDate}
            rangeState={this.rangeState}
            onSelect={this.onSelect}
            onPick={this.handlePick}
            minDate={this.minDate}
            maxDate={this.maxDate}
          />
        </div>
      </div>
    )
  }
})

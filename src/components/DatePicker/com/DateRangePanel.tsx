import { defineComponent, ref, PropType } from 'vue'
import DateTable, {
  OnPickFunction,
  RangeState,
  SelectionMode
} from './DateTable'

import LeftArrow from '@/components/Svg/LeftArrow.vue'
import RightArrow from '@/components/Svg/RightArrow.vue'

import '@/styles/date-picker.css'
import dayjs, { Dayjs, isDayjs } from 'dayjs'
import {
  ArrowLeftIcon,
  ArrowNarrowRightIcon,
  ArrowRightIcon
} from '@heroicons/vue/outline'

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
      type: String as PropType<SelectionMode>
    }
  },
  setup() {
    const minDate = ref<Dayjs | null>(dayjs())
    const maxDate = ref<Dayjs | null>(dayjs().add(12, 'days'))

    const leftDate = ref<Dayjs>(dayjs())
    const rightDate = ref<Dayjs>(dayjs().add(1, 'month'))
    const handlePick: OnPickFunction = (
      prams: Dayjs | { minDate: Dayjs | null; maxDate: Dayjs | null }
    ) => {
      if (isDayjs(prams)) return
      const { minDate: _min, maxDate: _max } = prams
      minDate.value = _min
      maxDate.value = _max
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
      leftDate,
      rightDate
    }
  },
  render() {
    return (
      <div class="inline-flex shadow-md rounded-xl divide-x-1 divide-gray-500 pt-5 px-6 pb-6">
        <div>
          <div class="flex justify-between items-center text-sm">
            <div class="hover:bg-gray-100 rounded-lg cursor-pointer">
              <LeftArrow />
            </div>
            <div>
              <span class="hover:bg-gray-100 rounded-lg cursor-pointer inline-flex items-center px-2 h-10">
                {this.leftDate.year()}
              </span>
              <span class="hover:bg-gray-100 rounded-lg cursor-pointer inline-flex items-center px-2 h-10">
                {MONTHS[this.leftDate.month()]}
              </span>
            </div>

            <div class="hover:bg-gray-100 rounded-lg cursor-pointer">
              <RightArrow />
            </div>
          </div>
          <DateTable
            selectionMode={this.type}
            onChangeRange={this.handleChangeRange}
            rangeState={this.rangeState}
            onSelect={this.onSelect}
            onPick={this.handlePick}
            minDate={this.minDate}
            maxDate={this.maxDate}
          />
        </div>
        <div class="ml-2">
          <div class="flex justify-between items-center  text-sm">
            <div class="hover:bg-gray-100 rounded-lg cursor-pointer">
              <LeftArrow />
            </div>
            <div class="h-full">
              <span class="hover:bg-gray-100 rounded-lg cursor-pointer inline-flex items-center px-2 h-10">
                {this.rightDate.year()}
              </span>
              <span class="hover:bg-gray-100 rounded-lg cursor-pointer inline-flex items-center  px-2 h-10">
                {MONTHS[this.rightDate.month()]}
              </span>
            </div>

            <div class="hover:bg-gray-100 rounded-lg cursor-pointer">
              <RightArrow />
            </div>
          </div>
          <DateTable
            selectionMode={this.type}
            onChangeRange={this.handleChangeRange}
            date={dayjs().add(1, 'month')}
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

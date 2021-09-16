import { defineComponent, PropType, ref, computed } from 'vue'

import LeftArrow from '@/components/LeftArrow.vue'
import RightArrow from '@/components/RightArrow.vue'
import dayjs, { Dayjs } from 'dayjs'

import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefroe from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefroe)

interface Cell {
  isCurrentMonth:boolean;
  text:string;
  row: number;
  column: number;
  type: string;
  inRange: boolean;
  start: boolean;
  disabled: boolean;
  end: boolean;
}

const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

const WEEKS = ['一', '二', '三', '四', '五', '六', '日']

export type OnPickFunction = (parms:{minDate:Dayjs|null; maxDate:Dayjs|null}) =>void
export type SelectionMode = 'range'|'day'|'week' | 'weekrange'

export interface RangeState {
  endDate:null|Dayjs;
  selecting:boolean
}

export default defineComponent({
  props: {
    date: {
      type: Object as PropType<Dayjs>,
      default: () => dayjs(new Date())
    },
    selectionMode: {
      type: String as PropType<SelectionMode>,
      default: 'range'
    },
    rangeState: {
      type: Object as PropType<RangeState>,
      default: () => ({
        endDate: null,
        selecting: false
      })
    },
    minDate: {
      type: Object as PropType<Dayjs|null>
    },
    onChangeRange: {
      type: Function as PropType<(rangeState:RangeState)=>void>,
      default: () => {}
    },
    maxDate: {
      type: Object as PropType<Dayjs|null>
    },
    onPick: {
      type: Function as PropType<OnPickFunction>,
      default: () => {}
    },
    onSelect: {
      type: Function as PropType<(selecting:boolean)=>void>,
      default: () => {}
    }
  },
  setup(props) {
    const lastRow = ref<number| null>(null)
    const lastColumn = ref<number| null>(null)
    const startDate = computed(() => {
      const startDayOfMonth = props.date.startOf('month')
      const dayOfStartDayOfMonth = startDayOfMonth.day()
      return startDayOfMonth.subtract(dayOfStartDayOfMonth === 0 ? 6 : dayOfStartDayOfMonth - 1, 'day')
    })

    const monthIndex = computed(() => props.date.month())
    const calNow = dayjs().startOf('day')
    const getCellClasses = (cell:Cell) => {
      const classes:string[] = 'cell cell-day w-10 h-10 flex items-center justify-center'.split(' ')
      if ((cell.type === 'normal' || cell.type === 'today')) {
        classes.push('cell-day-available')
        if (cell.type === 'today') {
          classes.push('today')
        }
      } else {
        classes.push(cell.type)
      }
      if (!cell.isCurrentMonth) {
        classes.push('cell-not-currentmonth')
      } else {
        if (cell.start) {
          classes.push('cell-start')
        }
        if (cell.end) {
          classes.push('cell-end')
        }
        if (cell.inRange) {
          classes.push('cell-in-range')
          const { row, column } = cell
          if (!rows.value[row - 1]?.[column].inRange || !rows.value[row - 1]?.[column].isCurrentMonth) {
            column === 0 && classes.push('rounded-tl-lg')
            column === 6 && classes.push('rounded-tr-lg')
          }
          if (!rows.value[row + 1]?.[column]?.inRange || !rows.value[row + 1]?.[column]?.isCurrentMonth) {
            column === 0 && classes.push('rounded-bl-lg')
            column === 6 && classes.push('rounded-br-lg')
          }
        }
      }
      return classes
    }

    const getDateOfCell = (row:number, column:number) => {
      const offsetFromStart =
        row * 7 + column
      return startDate.value.add(offsetFromStart, 'day')
    }
    const rows = computed(() => {
      const monthStart = props.date.startOf('month')
      let calTime = dayjs(monthStart)
      let calEndDate = props.rangeState.endDate ||
                         props.maxDate ||
                        (props.rangeState.selecting && props.minDate)

      if (props.maxDate && calEndDate && props.maxDate.isAfter(calEndDate)) {
        calEndDate = props.maxDate
      }

      while (calTime.day() !== 1) {
        calTime = calTime.add(-1, 'day')
      }
      const rowsValue:Cell[][] = [[], [], [], [], [], []]
      let minDate = props.minDate

      if (props.selectionMode === 'weekrange' && props.rangeState.endDate && props.minDate && props.rangeState.endDate.isBefore(props.minDate)) {
        minDate = props.rangeState.endDate
      }
      rowsValue.forEach((row, i) => {
        for (let j = 0; j < 7; j++) {
          let cell = row[j]
          cell = {
            disabled: false,
            isCurrentMonth: false,
            text: '',
            row: i,
            column: j,
            type: 'normal',
            inRange: false,
            start: false,
            end: false
          }
          cell.text = calTime.date() + ''
          if (calTime.isSame(calNow, 'day')) {
            cell.type = 'today'
          }
          cell.isCurrentMonth = calTime.month() === props.date.month()
          if (minDate && calEndDate) {
            cell.inRange = (calTime.isSameOrAfter(minDate, 'day') && calTime.isSameOrBefore(calEndDate, 'day')) ||
             (calTime.isSameOrAfter(calEndDate, 'day') && calTime.isSameOrBefore(minDate, 'day'))
          }
          if (minDate) {
            if (minDate.isSameOrAfter(calEndDate || null)) {
              cell.start = calEndDate ? calTime.isSame(calEndDate, 'day') : false
              cell.end = calTime.isSame(minDate, 'day')
            } else {
              cell.start = calTime.isSame(minDate, 'day')
              cell.end = calEndDate ? calTime.isSame(calEndDate, 'day') : false
            }
          }

          row[j] = cell
          calTime = calTime.add(1, 'day')
        }
      })
      return rowsValue
    })

    const handleCellClick = (e:MouseEvent) => {
      const target = e.target as HTMLElement
      if (target?.tagName !== 'SPAN') {
        return false
      }

      if (props.selectionMode === 'range') {
        const rowIndex = +target.getAttribute('data-row-index')!
        const columnIndex = +target.getAttribute('data-column-index')!
        const cellDate = getDateOfCell(rowIndex, columnIndex)
        if (!props.rangeState.selecting) {
          props.onPick({ minDate: cellDate, maxDate: null })
        } else {
          const [minDate = null, maxDate = null] = [props.minDate, cellDate].sort((a, b) => a!.valueOf() - b!.valueOf())
          props.onPick({ minDate, maxDate })
        }
        props.onSelect(!props.rangeState.selecting)
      } else if (props.selectionMode === 'weekrange') {
        const rowIndex = +target.getAttribute('data-row-index')!
        const cellDate = getDateOfCell(rowIndex, 0)
        if (!props.rangeState.selecting) {
          props.onPick({ minDate: cellDate, maxDate: getDateOfCell(rowIndex, 6) })
        } else {
          let minDate = props.minDate; let maxDate = cellDate
          if (cellDate.isSameOrAfter(props.minDate)) {
            minDate = props.minDate!
            maxDate = cellDate.add(6, 'days')
          } else {
            maxDate = props.maxDate!
            minDate = cellDate
          }
          // const [minDate = null, maxDate = null] = [props.minDate, cellDate].sort((a, b) => a!.valueOf() - b!.valueOf())
          props.onPick({ minDate, maxDate })
        }
        props.onSelect(!props.rangeState.selecting)
      }
    }

    const handleMouseMove = (e:MouseEvent) => {
      if (!props.rangeState.selecting) return
      const target = e.target as HTMLElement
      if (target?.tagName !== 'SPAN') {
        return false
      }

      if (props.selectionMode === 'weekrange') {
        const row = +target.getAttribute('data-row-index')!
        if (row !== lastRow.value) {
          lastRow.value = row
          let cellDate = getDateOfCell(row, 6)
          if (cellDate.isBefore(props.minDate)) {
            cellDate = getDateOfCell(row, 0)
          }
          props.onChangeRange && props.onChangeRange({
            selecting: true,
            endDate: cellDate
          })
        }
      } else if (props.selectionMode === 'range') {
        const row = +target.getAttribute('data-row-index')!
        const column = +target.getAttribute('data-column-index')!
        // can not select disabled date
        if (rows.value[row][column].disabled) return
        // only update rangeState when mouse moves to a new cell
        // this avoids frequent Date object creation and improves performance
        if (row !== lastRow.value || column !== lastColumn.value) {
          lastRow.value = row
          lastColumn.value = column
          props.onChangeRange && props.onChangeRange({
            selecting: true,
            endDate: getDateOfCell(row, column)
          })
        }
      }
    }

    return {
      monthIndex,
      rows,
      handleCellClick,
      getCellClasses,
      startDate,
      handleMouseMove
    }
  },
  render() {
    return (
      <div class="px-6 pt-5 pb-6">
        <div class="flex justify-between items-center">
          <div class="hover:bg-gray-100 rounded-lg cursor-pointer">
            <LeftArrow />
          </div>
          <span>{MONTHS[this.monthIndex]}</span>
          <div class="hover:bg-gray-100 rounded-lg cursor-pointer">
            <RightArrow />
          </div>
        </div>
        <div class="flex font-black">
          {
            WEEKS.map(day => <div key={`week${day}`} class="cell w-10 h-10 flex items-center justify-center">{day}</div>)
          }
        </div>
        <div onClick={this.handleCellClick} onMousemove={this.handleMouseMove} >
          {
            this.rows.map((row, i) => <div key={`row_${i}`} class="flex cell-text">
              {
                row.map((cell, j) => <span data-row-index={i} data-column-index={j} key={`day_${j}`} class={this.getCellClasses(cell)}>{cell.text}</span>)
              }
            </div>)
          }
        </div>
      </div>
    )
  }
})

import { defineComponent, PropType, ref, computed, inject } from 'vue'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import updateLocale from 'dayjs/plugin/updateLocale'
import weekYear from 'dayjs/plugin/weekYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'

import 'dayjs/locale/zh-cn'

import dayjs, { Dayjs } from 'dayjs'

import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefroe from 'dayjs/plugin/isSameOrBefore'
import { WEEKS } from '../constant'
dayjs.extend(weekYear)
dayjs.extend(weekOfYear)
dayjs.extend(updateLocale)
dayjs.extend(advancedFormat) // 导入本地化语言

dayjs.locale('zh-cn')

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefroe)

interface Cell {
  isCurrentMonth: boolean
  text: string
  row: number
  column: number
  type: string
  inRange: boolean
  start: boolean
  disabled: boolean
  end: boolean
}

function onPick(parmas: Dayjs, visible?:boolean): void
function onPick(parmas: { minDate: Dayjs | null; maxDate: Dayjs | null }, visible?:boolean): void
function onPick() {}
export type OnPickFunction = typeof onPick

export type SelectionMode = 'range' | 'day' | 'week' | 'weekrange' | 'dates'

export interface RangeState {
  endDate: null | Dayjs
  selecting: boolean
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
    parsedValue: {
      type: Object as PropType<Dayjs | Dayjs[]>
    },
    rangeState: {
      type: Object as PropType<RangeState>,
      default: () => ({
        endDate: null,
        selecting: false
      })
    },
    timeValue: Object as PropType<Dayjs>,
    minDate: {
      type: Object as PropType<Dayjs | null>
    },
    onChangeRange: {
      type: Function as PropType<(rangeState: RangeState) => void>,
      default: () => {}
    },
    maxDate: {
      type: Object as PropType<Dayjs | null>
    },
    onPick: {
      type: Function as PropType<OnPickFunction>,
      default: () => {}
    },
    onSelect: {
      type: Function as PropType<(selecting: boolean) => void>,
      default: () => {}
    }
  },
  setup(props) {
    const lastRow = ref<number | null>(null)
    const lastColumn = ref<number | null>(null)
    const startDate = computed(() => {
      const startDayOfMonth = props.date.startOf('month')
      const dayOfStartDayOfMonth = startDayOfMonth.day()
      return startDayOfMonth.subtract(
        dayOfStartDayOfMonth === 0 ? 6 : dayOfStartDayOfMonth - 1,
        'day'
      )
    })

    const cellMatchesDate = (cell: Cell, date: Dayjs) => {
      if (!date) return false
      return dayjs(date).isSame(props.date.date(Number(cell.text)), 'day')
    }

    const isCurrent = (cell: Cell): boolean => {
      return (
        props.selectionMode === 'day' &&
        (cell.type === 'normal' || cell.type === 'today') &&
        cellMatchesDate(cell, props.parsedValue as Dayjs)
      )
    }

    const monthIndex = computed(() => props.date.month())
    const calNow = dayjs().startOf('day')
    const getCellClasses = (cell: Cell) => {
      const classes: string[] = 'cell cell-day'.split(' ')
      if (cell.type === 'normal' || cell.type === 'today') {
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
        if (props.selectionMode === 'day' && isCurrent(cell)) {
          classes.push('current')
        }
        if (props.selectionMode !== 'day') {
          if (cell.start) {
            classes.push('cell-start')
          }
          if (cell.end) {
            classes.push('cell-end')
          }
          if (cell.inRange) {
            classes.push('cell-in-range')
            const { row, column } = cell
            if (
              !rows.value[row - 1]?.[column].inRange ||
              !rows.value[row - 1]?.[column].isCurrentMonth
            ) {
              column === 0 && classes.push('rounded-tl-lg')
              column === 6 && classes.push('rounded-tr-lg')
            }
            if (
              !rows.value[row + 1]?.[column]?.inRange ||
              !rows.value[row + 1]?.[column]?.isCurrentMonth
            ) {
              column === 0 && classes.push('rounded-bl-lg')
              column === 6 && classes.push('rounded-br-lg')
            }
          }
        }
      }
      return classes
    }

    const getCellDate = (row: number, column: number) => {
      const offsetFromStart = row * 7 + column
      return startDate.value.add(offsetFromStart, 'day')
    }
    const rows = computed(() => {
      const monthStart = props.date.startOf('month')
      let calTime = dayjs(monthStart)
      let calEndDate =
        props.rangeState.endDate ||
        props.maxDate ||
        (props.rangeState.selecting && props.minDate)

      if (props.maxDate && calEndDate && props.maxDate.isAfter(calEndDate)) {
        calEndDate = props.maxDate
      }

      while (calTime.day() !== 1) {
        calTime = calTime.add(-1, 'day')
      }
      const rowsValue: Cell[][] = [[], [], [], [], [], []]
      let minDate = props.minDate

      if (
        props.selectionMode === 'weekrange' &&
        props.rangeState.endDate &&
        props.minDate &&
        props.rangeState.endDate.isBefore(props.minDate)
      ) {
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
            cell.inRange =
              (calTime.isSameOrAfter(minDate, 'day') &&
                calTime.isSameOrBefore(calEndDate, 'day')) ||
              (calTime.isSameOrAfter(calEndDate, 'day') &&
                calTime.isSameOrBefore(minDate, 'day'))
          }
          if (minDate) {
            if (minDate.isSameOrAfter(calEndDate || null)) {
              cell.start = calEndDate
                ? calTime.isSame(calEndDate, 'day')
                : false
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

    const handleCellClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target?.tagName !== 'SPAN') {
        return false
      }
      const rowIndex = +target.getAttribute('data-row-index')!
      const columnIndex = +target.getAttribute('data-column-index')!
      let cellDate = getCellDate(rowIndex, columnIndex)
      if (props.selectionMode === 'range') {
        if (!props.rangeState.selecting) {
          props.onPick({ minDate: cellDate, maxDate: null })
        } else {
          const [minDate = null, maxDate = null] = [
            props.minDate,
            cellDate
          ].sort((a, b) => a!.valueOf() - b!.valueOf())
          props.onPick({ minDate, maxDate })
        }
        props.onSelect(!props.rangeState.selecting)
      } else if (props.selectionMode === 'weekrange') {
        if (!props.rangeState.selecting) {
          props.onPick({
            minDate: getCellDate(rowIndex, 0),
            maxDate: getCellDate(rowIndex, 6)
          }, true)
        } else {
          let minDate = props.minDate
          let maxDate = cellDate
          cellDate = getCellDate(rowIndex, 0)
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
      } else if (props.selectionMode === 'day') {
        props.onPick(cellDate)
      } else if (props.selectionMode === 'week') {
        props.onPick(cellDate.startOf('week'))
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!props.rangeState.selecting) return
      const target = e.target as HTMLElement
      if (target?.tagName !== 'SPAN') {
        return false
      }

      const row = +target.getAttribute('data-row-index')!
      const column = +target.getAttribute('data-column-index')!
      if (props.selectionMode === 'weekrange') {
        if (row !== lastRow.value) {
          lastRow.value = row
          let cellDate = getCellDate(row, 6)
          if (cellDate.isBefore(props.minDate)) {
            cellDate = getCellDate(row, 0)
          }
          props.onChangeRange &&
            props.onChangeRange({
              selecting: true,
              endDate: cellDate
            })
        }
      } else if (props.selectionMode === 'range') {
        // can not select disabled date
        if (rows.value[row][column].disabled) return
        // only update rangeState when mouse moves to a new cell
        // this avoids frequent Date object creation and improves performance
        if (row !== lastRow.value || column !== lastColumn.value) {
          lastRow.value = row
          lastColumn.value = column
          props.onChangeRange &&
            props.onChangeRange({
              selecting: true,
              endDate: getCellDate(row, column)
            })
        }
      }
    }

    const tableCalsses = computed(() => {
      const classes = ['xg-date-table']
      if (
        props.selectionMode === 'range' ||
        props.selectionMode === 'weekrange'
      ) {
        classes.push('is-range')
      }
      if (props.selectionMode === 'week' || props.selectionMode === 'weekrange') {
        classes.push('is-week')
      }
      return classes
    })

    const injectBase = inject('EP_PICKER_BASE') as any

    const { onDateMouseEnter, onDateMouseLeave } = injectBase

    const handleCellEnter = (row: number, column: number) => {
      const cellDate = getCellDate(row, column)
      if (props.timeValue) {
        onDateMouseEnter(
          cellDate.hour(props.timeValue.hour())
          .minute(props.timeValue.minute())
          .second(props.timeValue.second()))
      } else {
        onDateMouseEnter(cellDate)
      }
    }

    const getRowClasses = (rowIndex:number) => {
      if (props.selectionMode !== 'week') return ''
      const date = getCellDate(rowIndex, 0)
      if (props.parsedValue && date.isSame(props.parsedValue as Dayjs, 'week')) return 'current-week'
      return ''
    }

    const handleCellLeave = onDateMouseLeave

    return {
      monthIndex,
      rows,
      handleCellClick,
      getCellClasses,
      startDate,
      handleMouseMove,
      tableCalsses,
      handleCellEnter,
      handleCellLeave,
      getRowClasses
    }
  },
  render() {
    return (
      <div class={this.tableCalsses}>
        <div class="flex font-black">
          {WEEKS.map(day => (
            <div key={`week${day}`} class="cell">
              {day}
            </div>
          ))}
        </div>
        <div onClick={this.handleCellClick} onMousemove={this.handleMouseMove}>
          {this.rows.map((row, i) => (
            <div key={`row_${i}`} class={`flex cell-text date-row ${this.getRowClasses(i)}`}>
              {row.map((cell, j) => (
                <span
                  onMouseenter={() =>
                    !cell.disabled && this.handleCellEnter(i, j)
                  }
                  onMouseleave={() => !cell.disabled && this.handleCellLeave()}
                  data-row-index={i}
                  data-column-index={j}
                  key={`day_${j}`}
                  class={this.getCellClasses(cell)}>
                  {cell.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }
})

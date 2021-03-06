import dayjs, { Dayjs } from 'dayjs'

export const DEFAULT_FORMATS_TIME = 'HH:mm:ss'
export const DEFAULT_FORMATS_DATE = 'YYYY-MM-DD'
export const DEFAULT_FORMATS_DATEPICKER = {
  date: DEFAULT_FORMATS_DATE,
  dates: DEFAULT_FORMATS_DATE,
  week: 'gggg-ww周',
  weekrange: 'gggg-ww周',
  year: 'YYYY',
  month: 'YYYY-MM',
  datetime: `${DEFAULT_FORMATS_DATE} ${DEFAULT_FORMATS_TIME}`,
  monthrange: 'YYYY-MM',
  daterange: DEFAULT_FORMATS_DATE,
  datetimerange: `${DEFAULT_FORMATS_DATE} ${DEFAULT_FORMATS_TIME}`
}

export const WEEKS = ['一', '二', '三', '四', '五', '六', '日']

export const MONTHS = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月'
]

// export function isValidDateValue(value:Dayjs, disabledDate?:(date:Date)=>boolean):boolean
// export function isValidDateValue(value:Dayjs[], disabledDate?:(date:Date)=>boolean):boolean
export function isValidDateValue (value:unknown, disabledDate?:(date:Date)=>boolean):boolean {
  if (Array.isArray(value)) {
    const [start, end] = value
    return (
      isValidDateValue(start) &&
      isValidDateValue(end) &&
      start.valueOf() <= end.valueOf()
    )
  }
  return (
    dayjs.isDayjs(value) &&
    value.isValid() &&
    (disabledDate ? !disabledDate(value.toDate()) : true)
  )
}

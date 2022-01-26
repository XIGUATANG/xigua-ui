import { Dayjs } from 'dayjs'
export declare type IDatePickerType =
  | 'year'
  | 'month'
  | 'date'
  | 'dates'
  | 'week'
  | 'datetime'
  | 'datetimerange'
  | 'daterange'
  | 'monthrange'
  | 'weekrange'

export function formatToString(value: Dayjs|Dayjs[], format:string) {
    if (Array.isArray(value)) {
      return value.map(day => day.format(format))
    }
    return value.format(format)
}

export interface PickerOptions {
  isValidValue: (date: unknown) => boolean
  handleKeydown: (event: KeyboardEvent) => void
  parseUserInput: (value: string) => Dayjs | null
  formatToString: typeof formatToString,
  getRangeAvailableTime: (date: Dayjs | (Dayjs | undefined)[]) => Dayjs
  getDefaultValue: () => Dayjs
  panelReady: boolean
  handleClear: () => void
}

export type TableView = 'year' | 'month' | 'date'

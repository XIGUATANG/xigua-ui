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

  export interface PickerOptions {
    isValidValue: (date: unknown) => boolean
    handleKeydown: (event: KeyboardEvent) => void
    parseUserInput: (value: string) => Dayjs | null
    formatToString: (value: Dayjs | Dayjs[]) => string | string[]
    getRangeAvailableTime: (date: Dayjs | (Dayjs | undefined)[]) => Dayjs
    getDefaultValue: () => Dayjs
    panelReady: boolean
    handleClear: () => void
  }

import Popper from 'components/popper'
import {
  defineComponent,
  renderSlot,
  unref,
  ref,
  watch,
  nextTick,
  computed,
  provide
} from 'vue'
import type { ComponentPublicInstance } from 'vue'
import LeftArrow from 'components/Svg/LeftArrow'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { isEmpty } from '@/utils/util'
import { pickerDefaultProps } from './props'
import isEqual from 'lodash.isequal'
import { onClickOutside } from '@vueuse/core'
import { EVENT_CODE } from '@/utils/aria'
import Input from 'components/Input/index'
import CalendarSvg from '@/components/Svg/CalendarSvg'
import type { PickerOptions } from '../type'
import { formatToString } from '../type'
import { isValidDateValue } from '../constant'

// Date object and string
const dateEquals = function (a: Date | any, b: Date | any) {
  const aIsDate = a instanceof Date
  const bIsDate = b instanceof Date
  if (aIsDate && bIsDate) {
    return a.getTime() === b.getTime()
  }
  if (!aIsDate && !bIsDate) {
    return a === b
  }
  return false
}

const valueEquals = function (a: Array<Date> | any, b: Array<Date> | any) {
  const aIsArray = a instanceof Array
  const bIsArray = b instanceof Array
  if (aIsArray && bIsArray) {
    if (a.length !== b.length) {
      return false
    }
    return (a as Array<Date>).every((item, index) => dateEquals(item, b[index]))
  }
  if (!aIsArray && !bIsArray) {
    return dateEquals(a, b)
  }
  return false
}

const parser = function (
  date: Date | string | number,
  format: string
): Dayjs | undefined {
  const day = isEmpty(format) ? dayjs(date) : dayjs(date, format)
  return day.isValid() ? day : undefined
}

const formatter = function (date: number | Date, format: string | undefined) {
  return isEmpty(format) ? date : dayjs(date).format(format)
}

export default defineComponent({
  props: pickerDefaultProps,
  name: 'CommonPicker',
  setup(props, ctx) {
    const refPopper = ref<InstanceType<typeof Popper>>()
    const inputRef = ref<HTMLElement | ComponentPublicInstance>()
    const pickerVisible = ref(false)
    const valueOnOpen = ref()
    const userInput = ref()

    const parseUserInput = (value: string) => {
      if (!value) return null
      return dayjs(value, props.format)
    }

    const pickerOptions = ref<Partial<PickerOptions>>({
      parseUserInput,
      formatToString,
      panelReady: true
    })

    const dateEnter = (day: Dayjs) => {
      if (!Array.isArray(parsedValue.value) && parsedValue.value) {
        placeHolderValue.value = formatDayjsToString(day) as string
      }
    }

    const dateLeave = () => {
      placeHolderValue.value = ''
    }
    provide('EP_PICKER_BASE', {

      props,
      onDateMouseEnter: dateEnter,
      onDateMouseLeave: dateLeave
    })

    const refInput = computed<HTMLInputElement[]>(() => {
      if (inputRef.value) {
        const _r = isRangeInput.value
          ? inputRef.value
          : (inputRef.value as ComponentPublicInstance).$el
        return Array.from<HTMLInputElement>(_r.querySelectorAll('input'))
      }
      return []
    })

    const placeHolderValue = ref('')

    const blurInput = () => {
      refInput.value.forEach(input => input.blur())
    }

    watch(pickerVisible, val => {
      if (!val) {
        userInput.value = null
        nextTick(() => {
          emitChange(props.modelValue)
        })
        ctx.emit('blur')
        blurInput()
      } else {
        valueOnOpen.value = props.modelValue
      }
    })
    const emitChange = (val: any, isClear?: boolean) => {
      // determine user real change only
      if (isClear || !valueEquals(val, valueOnOpen.value)) {
        ctx.emit('change', val)
      }
    }
    const emitInput = (val: any) => {
      if (!valueEquals(props.modelValue, val)) {
        let formatValue
        if (Array.isArray(val)) {
          formatValue = val.map(_ => formatter(_, props.valueFormat))
        } else if (val) {
          formatValue = formatter(val, props.valueFormat)
        }
        ctx.emit('update:modelValue', val ? formatValue : val)
      }
    }

    const refStartInput = computed(() => {
      return refInput?.value[0]
    })
    const refEndInput = computed(() => {
      return refInput?.value[1]
    })
    const setSelectionRange = (
      start: number,
      end: number,
      pos: 'min' | 'max'
    ) => {
      const _inputs = refInput.value
      if (!_inputs.length) return
      if (!pos || pos === 'min') {
        _inputs[0].setSelectionRange(start, end)
        _inputs[0].focus()
      } else if (pos === 'max') {
        _inputs[1].setSelectionRange(start, end)
        _inputs[1].focus()
      }
    }
    const onPick = (date: any = '', visible = false) => {
      placeHolderValue.value = ''
      pickerVisible.value = visible
      let result
      if (Array.isArray(date)) {
        result = date.map(_ => _.toDate())
      } else {
        // clear btn emit null
        result = date ? date.toDate() : date
      }
      userInput.value = null
      emitInput(result)
    }

    const focus = (focusStartInput = true) => {
      let input = refStartInput.value
      if (!focusStartInput && isRangeInput.value) {
        input = refEndInput.value
      }
      if (input) {
        input.focus()
      }
    }

    const handleFocus = (e: FocusEvent) => {
      if (props.readonly || props.disabled || pickerVisible.value) return
      pickerVisible.value = true
      e.stopPropagation()
      ctx.emit('focus', e)
    }

    const handleBlur = () => {
      refPopper.value?.hide()
      blurInput()
    }

    const isRangeInput = computed(() => {
      return props.type.indexOf('range') > -1
    })

    const parsedValue = computed(() => {
      let result
      if (valueIsEmpty.value) {
        if (pickerOptions.value.getDefaultValue) {
          result = pickerOptions.value.getDefaultValue()
        }
      } else {
        if (Array.isArray(props.modelValue)) {
          result = props.modelValue.map(_ => parser(_, props.valueFormat))
        } else {
          result = parser(props.modelValue, props.valueFormat)
        }
      }
      if (pickerOptions.value.getRangeAvailableTime && result) {
        const availableResult =
          pickerOptions.value.getRangeAvailableTime(result)
        if (!isEqual(availableResult, result)) {
          result = availableResult
          emitInput(
            Array.isArray(result)
              ? result.map(_ => _.toDate())
              : result.toDate()
          )
        }
      }
      if (Array.isArray(result) && result.some(_ => !_)) {
        result = []
      }
      console.log(result)
      return result
    })

    const displayValue = computed(() => {
      if (!pickerOptions.value.panelReady) return
      // @ts-ignore
      const formattedValue = formatDayjsToString(parsedValue.value)
      if (Array.isArray(userInput.value)) {
        return [
          userInput.value[0] || (formattedValue && formattedValue[0]) || '',
          userInput.value[1] || (formattedValue && formattedValue[1]) || ''
        ]
      } else if (placeHolderValue.value) {
        if (Array.isArray(placeHolderValue.value)) {
          return [
            placeHolderValue.value[0] || '',
            placeHolderValue.value[1] || ''
          ]
        }
        return placeHolderValue.value
      } else if (userInput.value != null) {
        return userInput.value
      }
      if (!isTimePicker.value && valueIsEmpty.value) return ''
      if (!pickerVisible.value && valueIsEmpty.value) return ''
      if (formattedValue) {
        return isDatesPicker.value
          ? (formattedValue as Array<string>).join(', ')
          : formattedValue
      }
      return ''
    })

    const isTimeLikePicker = computed(() => props.type.includes('time'))

    const isTimePicker = computed(() => props.type.startsWith('time'))

    const isDatesPicker = computed(() => props.type === 'dates')

    const showClose = ref(false)

    const onClearIconClick = (event: MouseEvent) => {
      if (props.readonly || props.disabled) return
      if (showClose.value) {
        event.stopPropagation()
        emitInput(null)
        emitChange(null, true)
        showClose.value = false
        pickerVisible.value = false
        pickerOptions.value.handleClear && pickerOptions.value.handleClear()
      }
    }
    const valueIsEmpty = computed(() => {
      return (
        !props.modelValue ||
        (Array.isArray(props.modelValue) && !props.modelValue.length)
      )
    })
    let timer: number
    const onMouseEnter = () => {
      if (props.readonly || props.disabled) return
      if (!valueIsEmpty.value && props.clearable) {
        timer && clearTimeout(timer)
        showClose.value = true
      }
    }
    const onMouseLeave = () => {
      timer = setTimeout(() => {
        showClose.value = false
      }, 300)
    }

    const popperPaneRef = computed(() => {
      // @ts-ignore
      return refPopper.value?.popperRef?.contentRef
    })

    // @ts-ignore
    const popperEl = computed(() => unref(refPopper)?.popperRef)
    const actualInputRef = computed(() => {
      if (unref(isRangeInput)) {
        return unref(inputRef)
      }

      return (unref(inputRef) as ComponentPublicInstance)?.$el
    })

    onClickOutside(actualInputRef, (e: PointerEvent) => {
      console.log(unref(refPopper))
      const unrefedPopperEl = unref(popperEl)
      const inputEl = unref(actualInputRef)
      if (
        (unrefedPopperEl &&
          (e.target === unrefedPopperEl ||
            e.composedPath().includes(unrefedPopperEl))) ||
        e.target === inputEl ||
        e.composedPath().includes(inputEl)
      ) {
        return
      }
      pickerVisible.value = false
    })

    const handleChange = () => {
      if (userInput.value) {
        const value = parseUserInputToDayjs(displayValue.value)
        if (value) {
          if (isValidValue(value)) {
            emitInput(
              Array.isArray(value) ? value.map(_ => _.toDate()) : value.toDate()
            )
            userInput.value = null
          }
        }
      }
      if (userInput.value === '') {
        emitInput(null)
        emitChange(null)
        userInput.value = null
      }
    }

    const parseUserInputToDayjs = (value: string | undefined) => {
      if (!value) return null
      return pickerOptions.value.parseUserInput?.(value)
    }

    const formatDayjsToString = (value: Dayjs | Dayjs[] | undefined) => {
      if (!value) return null
      return pickerOptions.value.formatToString?.(value, props.format || '')
    }

    const isValidValue = (value: unknown) => {
      return isValidDateValue(value, props.disabledDate)
    }

    const handleKeydown = (event: KeyboardEvent) => {
      const code = event.code

      if (code === EVENT_CODE.esc) {
        pickerVisible.value = false
        event.stopPropagation()
        return
      }

      if (code === EVENT_CODE.tab) {
        if (!isRangeInput.value) {
          handleChange()
          pickerVisible.value = false
          event.stopPropagation()
        } else {
          // user may change focus between two input
          setTimeout(() => {
            if (
              refInput.value.indexOf(
                document.activeElement as HTMLInputElement
              ) === -1
            ) {
              pickerVisible.value = false
              blurInput()
            }
          }, 0)
        }
        return
      }

      if (code === EVENT_CODE.enter || code === EVENT_CODE.numpadEnter) {
        if (
          userInput.value === null ||
          userInput.value === '' ||
          isValidValue(parseUserInputToDayjs(displayValue.value))
        ) {
          handleChange()
          pickerVisible.value = false
        }
        event.stopPropagation()
        return
      }

      // if user is typing, do not let picker handle key input
      if (userInput.value) {
        event.stopPropagation()
        return
      }

      if (pickerOptions.value.handleKeydown) {
        pickerOptions.value.handleKeydown(event)
      }
    }
    const onUserInput = (value: string) => {
      userInput.value = value
    }

    const handleStartInput = (event: Event) => {
      const target = event.target as HTMLInputElement
      if (userInput.value) {
        userInput.value = [target.value!, userInput.value[1]]
      } else {
        userInput.value = [target.value, null]
      }
    }

    const handleEndInput = (event: Event) => {
      const target = event.target as HTMLInputElement
      if (userInput.value) {
        userInput.value = [userInput.value[0], target.value]
      } else {
        userInput.value = [null, target.value]
      }
    }

    const handleStartChange = () => {
      const value = parseUserInputToDayjs(userInput.value && userInput.value[0])
      if (value && value.isValid()) {
        userInput.value = [formatDayjsToString(value), displayValue.value[1]]
        const newValue = [
          value,
          parsedValue.value &&
            Array.isArray(parsedValue.value) &&
            parsedValue.value[1]
        ] as Dayjs[]
        if (isValidValue(newValue)) {
          emitInput(newValue)
          userInput.value = null
        }
      }
    }

    const handleEndChange = () => {
      const value = parseUserInputToDayjs(userInput.value && userInput.value[1])
      if (value && value.isValid()) {
        userInput.value = [displayValue.value[0], formatDayjsToString(value)]
        const newValue = [
          Array.isArray(parsedValue.value) && parsedValue.value[0],
          value
        ] as Dayjs[]
        if (isValidValue(newValue)) {
          emitInput(newValue)
          userInput.value = null
        }
      }
    }
    const handleClick = (e: Event) => {
      e.stopImmediatePropagation()
      e.stopPropagation()
    }

    const onSetPickerOption = <T extends keyof PickerOptions>(
      key: T,
      value: PickerOptions[T]
    ) => {
      pickerOptions.value[key] = value
      pickerOptions.value.panelReady = true
    }

    const onCalendarChange = (e: unknown) => {
      ctx.emit('calendar-change', e)
    }

    return () => (
      <Popper
        ref={refPopper}
        // visible={pickerVisible.value}
        v-model={[pickerVisible.value, 'visible']}
        pure
        trigger="click"
        {...{ ...ctx.attrs }}
        append-to-body
        popperClass={`picker__popper ${props.popperClass}`}
        placement="bottom-start"
        fallbackPlacements={['bottom-start', 'top', 'right', 'left']}
        gpuAcceleration={false}
        stopPopperMouseEvent={false}>
        {{
          trigger: () => {
            if (!isRangeInput.value) {
              return (
                <Input
                  ref={inputRef}
                  modelValue={displayValue.value}
                  size={props.size}
                  disabled={props.disabled}
                  placeHolder={props.placeholder}
                  style={ctx.attrs.style || undefined}
                  class={{
                    'w-10': true,
                    'picker-input-placeholder': Boolean(placeHolderValue.value)
                  }}
                  //  readonly={!editisDatesPickerable || readonly ||  || type === 'week'}
                  onInput={onUserInput}
                  onFocus={handleFocus}
                  onChange={handleChange}
                  onKeydown={handleKeydown}
                  onMouseenter={onMouseEnter}
                  onMouseleave={onMouseLeave}
                  {...{ onClick: handleClick }}>
                  {{
                    leftIcon: () => <CalendarSvg class="w-4 h-4" />
                  }}
                </Input>
              )
            }
            return (
              <div
                ref={inputRef}
                class={[
                  'date-range-input-wrapper',
                  pickerVisible.value ? 'active' : null
                ]}>
                <div class="w-8 flex items-center justify-center">
                  <CalendarSvg class="w-4 h-4 text-gray-500" />
                </div>

                <input
                  autocomplete="off"
                  onFocus={handleFocus}
                  value={displayValue.value?.[0] ?? ''}
                  disabled={props.disabled}
                  onInput={handleStartInput}
                  onChange={handleStartChange}
                  placeholder={props.startPlaceholder}></input>
                <LeftArrow class="text-gray-500" />
                <input
                  onFocus={handleFocus}
                  disabled={props.disabled}
                  autocomplete="off"
                  onInput={handleEndInput}
                  onChange={handleEndChange}
                  value={displayValue.value?.[1] ?? ''}
                  placeholder={props.endPlaceholder}></input>
              </div>
            )
          },
          default: (scopedProps: any) => {
            return renderSlot(ctx.slots, 'default', {
              ...scopedProps,
              parsedValue: parsedValue.value,
              format: props.format,
              unlinkPanels: props.unlinkPanels,
              defaultValue: props.defaultValue,
              onPick: onPick,
              onSelectRange: setSelectionRange,
              onSetPickerOption: onSetPickerOption,
              selectionMode: 'day',
              visible: pickerVisible.value,
              onCalendarChange: onCalendarChange,
              onMousedown: (e: Event) => e.stopPropagation()
            })
          }
        }}
      </Popper>
    )
  }
})

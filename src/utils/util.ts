
import {
  camelize,
  capitalize,
  extend,
  hasOwn,
  isArray,
  isObject,
  isString,
  looseEqual,
  toRawType
} from '@vue/shared'

export {
  hasOwn,
  // isEmpty,
  // isEqual,
  isObject,
  isArray,
  isString,
  capitalize,
  camelize,
  looseEqual,
  extend
}

export const generateId = (): number => Math.floor(Math.random() * 10000)

export const isBool = (val: unknown) => typeof val === 'boolean'
export const isNumber = (val: unknown) => typeof val === 'number'
export const isHTMLElement = (val: unknown) => toRawType(val).startsWith('HTML')

export function isEmpty(val: unknown) {
  if (
    (!val && val !== 0) ||
    (isArray(val) && !val.length) ||
    (isObject(val) && !Object.keys(val).length)
  ) { return true }

  return false
}

export const EVENT_CODE = {
  tab: 'Tab',
  enter: 'Enter',
  space: 'Space',
  left: 'ArrowLeft', // 37
  up: 'ArrowUp', // 38
  right: 'ArrowRight', // 39
  down: 'ArrowDown', // 40
  esc: 'Escape',
  delete: 'Delete',
  backspace: 'Backspace',
  numpadEnter: 'NumpadEnter',
  pageUp: 'PageUp',
  pageDown: 'PageDown',
  home: 'Home',
  end: 'End'
}

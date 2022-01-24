export type Size = 'mini' | 'small' | 'medium' | 'large'
export type Colors =
  | 'gray'
  | 'red'
  | 'yelllow'
  | 'green'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink'

export type ButtonType = 'primary' | 'outlined' | 'text'

export type Nullable<T> = T | null

export type TimeoutHandle = ReturnType<typeof window.setTimeout>

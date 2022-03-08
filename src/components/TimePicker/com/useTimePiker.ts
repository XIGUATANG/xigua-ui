
export const defList = (n:number, disabledDateByNumber?:(n:number)=>boolean, step = 1) => {
  const arr = []
  for (let i = 0; i < n; i += step) {
    arr.push({
      value: i,
      label: i < 10 ? `0${i}` : `${i}`,
      disabled: disabledDateByNumber?.(i) ?? false
    })
  }
  return arr
}

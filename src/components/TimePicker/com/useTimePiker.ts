
const defList = (n:number, method?:(...params:any[])=>void, methodFunc?:(...params:any[])=>number[]) => {
  const arr = []
  const disabledArr = method && methodFunc?.()
  for (let i = 0; i < n; i++) {
    arr[i] = disabledArr ? disabledArr.includes(i) : false
  }
  return arr
}

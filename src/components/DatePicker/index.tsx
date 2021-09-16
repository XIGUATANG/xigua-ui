import { defineComponent } from 'vue'

import '@/styles/date-picker.css'
import DateRangePanel from './com/DateRangePanel'

export default defineComponent({
  setup() {
  },
  render() {
    return (
      <div>
        <p>Range</p>
        <DateRangePanel type="range" />
        <p>Week Range</p>
        <DateRangePanel type="weekrange" />
      </div>
    )
  }
})

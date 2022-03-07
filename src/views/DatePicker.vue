<script lang="tsx">
import { defineComponent, ref } from 'vue'
import DatePicker from '@/components/DatePicker/index'
import dayjs from 'dayjs'

import TimePicker from 'components/TimePicker/com/Picker'

export default defineComponent({
  name: 'DatePickerDemo',
  setup() {
    const value1 = ref<Date>(new Date())
    const value2 = ref(new Date())
    const value3 = ref(new Date())
    const value4 = ref([new Date(), dayjs().add(2, 'week').toDate()])
    const value5 = ref([dayjs().startOf('week').toDate(), dayjs().add(2, 'week').endOf('week').toDate()])
    const value6 = ref<Date>(new Date())
    return () => (
      <div>
        <DatePicker class="mt-2" type="date" v-model={value1.value} />
        <DatePicker class="mt-2" type="year" v-model={value2.value} />
        <DatePicker class="mt-2" type="week" v-model={value3.value} />
        <DatePicker class="mt-2" type="month" v-model={value3.value} />
        <div class="flex">
          <div class="flex-1">
            <p>unlinkPanels true</p>
            <DatePicker unlinkPanels class="mt-2 w-96" type="daterange" v-model={value4.value} />
          </div>
          <div class="flex-1">
            <p>unlinkPanels false</p>
            <DatePicker unlinkPanels={false} class="mt-2 w-96" type="daterange" v-model={value4.value} />
          </div>
        </div>

        <DatePicker class="mt-2 w-96" type="weekrange" v-model={value5.value} />
        <TimePicker v-model={value6.value} />
      </div>
    )
  }
})
</script>

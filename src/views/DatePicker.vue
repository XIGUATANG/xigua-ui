<script lang="tsx">
import { defineComponent, ref } from 'vue'
import DatePicker from '@/components/DatePicker/index'
import dayjs from 'dayjs'
export default defineComponent({
  name: 'DatePickerDemo',
  setup() {
    const value1 = ref<Date>(new Date())
    const value2 = ref(new Date())
    const value3 = ref(new Date())
    const value4 = ref([new Date(), dayjs().add(2, 'week').toDate()])
    return () => (
      <div>
        <DatePicker class="mt-2" type="date" v-model={value1.value} />
        <DatePicker class="mt-2" type="year" v-model={value2.value} />
        <DatePicker class="mt-2" type="month" v-model={value3.value} />
        <DatePicker class="mt-2 w-96" type="daterange" v-model={value4.value} />
      </div>
    )
  }
})
</script>

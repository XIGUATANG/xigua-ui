<script lang="tsx">
import { defineComponent, ref } from 'vue'
import DatePicker from '@/components/DatePicker/index'
export default defineComponent({
  name: 'DatePickerDemo',
  setup() {
    const value1 = ref<Date>(new Date())
    const value2 = ref(new Date())
    const value3 = ref(new Date())
    const value4 = ref(new Date())
    return () => (
      <div>
        <DatePicker type="daterange" v-model={value4.value} />
      </div>
    )
  }
})
</script>

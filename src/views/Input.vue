<script lang="tsx">
import { MailIcon, SearchIcon } from '@heroicons/vue/solid'
import { defineComponent } from 'vue'
import { ref } from '@vue/reactivity'
import Input from 'components/Input'
import Popper from 'components/popper'

export default defineComponent({
  setup() {
    const visible = ref(false)

    return () => (
      <div>
        <Input disabled>
          {{
            // @ts-ignore
            leftIcon: () => <MailIcon class="w-5 h-5" />
          }}
        </Input>
        <Input>
          {{
            // @ts-ignore
            prepend: () => 'https://'
          }}
        </Input>
        <Input>
          {{
            // @ts-ignore
            pend: () => <SearchIcon class="w-5 h-5" />
          }}
        </Input>
        <Popper gpuAcceleration={false} sameWidth visible={visible.value}>
          {{
            trigger: () => (
              <Input
                onFocus={() => {
                  visible.value = true
                }}
                onBlur={() => {
                  visible.value = false
                }}></Input>
            ),
            default: () => <div>123</div>
          }}
        </Popper>

        <p>Size</p>
        <Input size="mini" />
        <Input size="small" />
        <Input size="medium" />
        <Input size="large" />
      </div>
    )
  }
})
</script>

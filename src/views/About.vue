<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import XgButton from '@/components/Button'

export default defineComponent({
  compnents: { XgButton },
  setup() {
    return () => (
      <div style="margin:0 auto">
        <p class="my-4">大小</p>
        <div class="flex space-x-4 items-end">
          <XgButton size="mini">MINI</XgButton>
          <XgButton size="small">SMALL</XgButton>
          <XgButton size="medium">MEDIUM</XgButton>
          <XgButton size="large">LARGE</XgButton>
        </div>
        <p class="my-4">边框</p>
        <div class="flex space-x-4  items-end">
          <XgButton type="outlined" size="mini">
            MINI
          </XgButton>
          <XgButton type="outlined" size="small">
            SMALL
          </XgButton>
          <XgButton type="outlined" size="medium">
            MEDIUM
          </XgButton>
          <XgButton type="outlined" size="large">
            LARGE
          </XgButton>
        </div>
        <p class="my-4">纯文本</p>
        <div class="flex space-x-4  items-end">
          <XgButton type="text" size="mini">
            MINI
          </XgButton>
          <XgButton type="text" size="small">
            SMALL
          </XgButton>
          <XgButton type="text" size="medium">
            MEDIUM
          </XgButton>
          <XgButton type="text" size="large">
            LARGE
          </XgButton>
        </div>
        <p class="my-4">颜色</p>
        <div class="flex space-x-4 items-end">
          <XgButton color="red">RED</XgButton>
          <XgButton color="gray">GRAY</XgButton>
          <XgButton color="yellow">YELLOW</XgButton>
          <XgButton color="green">GREEN</XgButton>
          <XgButton color="indigo">INDIGO</XgButton>
          <XgButton color="pink">PINK</XgButton>
        </div>
        <div class="flex space-x-4 items-end space-y-2">
          <XgButton type="outlined" color="red">
            RED
          </XgButton>
          <XgButton type="outlined" color="gray">
            GRAY
          </XgButton>
          <XgButton type="outlined" color="yellow">
            YELLOW
          </XgButton>
          <XgButton type="outlined" color="green">
            GREEN
          </XgButton>
          <XgButton type="outlined" color="indigo">
            INDIGO
          </XgButton>
          <XgButton type="outlined" color="pink">
            PINK
          </XgButton>
        </div>
        <p class="my-4">禁用</p>
        <div class="flex space-x-4 items-end">
          <XgButton disabled color="red">
            RED
          </XgButton>
          <XgButton type="outlined" disabled color="gray">
            GRAY
          </XgButton>
          <XgButton type="text" disabled color="yellow">
            YELLOW
          </XgButton>
          <XgButton disabled color="green">
            GREEN
          </XgButton>
          <XgButton disabled color="indigo">
            INDIGO
          </XgButton>
          <XgButton disabled color="pink">
            PINK
          </XgButton>
        </div>

        <p class="my-4">Loading</p>
        <div class="flex space-x-4 items-end">
          <XgButton size="mini" loading color="red">
            RED
          </XgButton>
          <XgButton loading type="outlined" color="gray">
            GRAY
          </XgButton>
          <XgButton size="small" loading type="text" color="yellow">
            YELLOW
          </XgButton>
          <XgButton loading color="green">
            GREEN
          </XgButton>
          <XgButton size="large" loading color="indigo">
            INDIGO
          </XgButton>
          <XgButton loading color="pink">
            PINK
          </XgButton>
        </div>
      </div>
    )
  }
})
</script>

<template>
  <div class="flex h-full">
    <LeftMenu />
    <div class="flex-1">
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link> |
        <router-link to="/datePicker">DatePicker</router-link> |
        <router-link to="/input">Input</router-link> |
        <router-link to="/iphoneMockup">iPhome13 mock up</router-link>
      </div>
      <div style="max-width: 800px; margin: 0 auto"><router-view /></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import LeftMenu from '@/views/components/LeftMenu'

export default defineComponent({
  components: { LeftMenu },
  setup() {}
})
</script>

<style>
* {
  box-sizing: border-box;
}

#app {
  height: 100vh;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

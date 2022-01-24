import { defineComponent } from 'vue'

import Logo from '@/assets/svg-vue/logo.vue'

import './left-menu.css'

export default defineComponent({
  setup() {
    return () => (
      <div class="left-menu-root">
        <div class="wrapper-fixed">
          <div class="simplebar-wrapper">
            <div class="px-5 pt-6 pb-4">
              <div class="flex items-center h-10 justify-start">
                <Logo class="w-8 h-8"></Logo>
              </div>
              <div class="mt-6 rounded-xl bg-gray-200 flex items-center px-5 py-4">
                <div class="flex items-center justify-center rounded-full h-10 w-10 overflow-hidden">
                  <img class="object-contain" src="https://avatars.githubusercontent.com/u/21170113?v=4" alt="avatar" />
                </div>
                <div class="ml-4">
                  <h6 class="text-sm text-gray-800 font-semibold">XiGua-UI</h6>
                  <p class="text-sm text-gray-500 font-normal">admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

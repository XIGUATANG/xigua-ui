import { defineComponent } from 'vue'
import './index.css'
export default defineComponent({
  setup() {
    return () => (
      <div class="outer">
        <div class="top-signal"></div>
        <div class="right-top-signal"></div>
        <div class="right-bottom-signal"></div>
        <div class="left-signal"></div>
        <div class="speaker"></div>
        <div class="notch">
          <div class="camera"></div>
          <div class="iframe">
            <div class="left-subtract"></div>
            <div class="center"></div>
            <div class="right-subtract"></div>
          </div>
        </div>
        <div class="inner">
          <div class="screen"></div>
        </div>
      </div>
    )
  }
})

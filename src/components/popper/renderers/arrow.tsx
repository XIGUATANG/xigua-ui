import { Comment, h } from 'vue'

export default function renderArrow(showArrow: boolean) {
  return showArrow
    ? <div ref="arrowRef" class="xg-popper__arrow" data-popper-arrow=""></div> : null
}

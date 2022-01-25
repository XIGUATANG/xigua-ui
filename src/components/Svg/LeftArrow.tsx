import { FunctionalComponent } from 'vue'

interface IconProps {
  class?: string | string[]
  onClick?: (e: MouseEvent) => void
}

const LeftArrowSvg: FunctionalComponent<IconProps> = props => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.73755 12.0125L17.2375 12.0125M12.7625 16.2625L17.2625 12.0125L12.7625 7.76245"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
)

LeftArrowSvg.displayName = 'LeftArrowSvg'

export default LeftArrowSvg

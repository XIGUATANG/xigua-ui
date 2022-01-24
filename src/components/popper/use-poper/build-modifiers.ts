import type { StrictModifiers, Placement, Modifier } from '@popperjs/core'

interface ModifierProps {
  offset?: number;
  arrow?: HTMLElement;
  arrowOffset?: number;
  gpuAcceleration?: boolean;
  fallbackPlacements?: Array<Placement>;
  sameWidth:boolean;
}

export default function buildModifier(
  props: ModifierProps,
  externalModifiers: Array<Partial<Modifier<any, any>>>
) {
  const { arrow, arrowOffset, offset, gpuAcceleration, fallbackPlacements } =
    props

  const modifiers: Array<Partial<Modifier<any, any>>> = [
    {
      name: 'offset',
      options: {
        offset: [0, offset ?? 12]
      }
    },
    {
      name: 'preventOverflow',
      options: {
        padding: {
          top: 2,
          bottom: 2,
          left: 5,
          right: 5
        }
      }
    },
    {
      name: 'flip',
      options: {
        padding: 5,
        fallbackPlacements: fallbackPlacements ?? []
      }
    },
    {
      name: 'computeStyles',
      options: {
        gpuAcceleration,
        adaptive: gpuAcceleration
      }
    }
    // tippyModifier,
  ]

  if (arrow) {
    modifiers.push({
      name: 'arrow',
      options: {
        element: arrow,
        // the arrow size is an equailateral triangle with 10px side length, the 3rd side length ~ 14.1px
        // adding a offset to the ceil of 4.1 should be 5 this resolves the problem of arrow overflowing out of popper.
        padding: arrowOffset ?? 5
      }
    })
  }
  if (props.sameWidth) {
    modifiers.push({
      name: 'sameWidth',
      enabled: true,
      phase: 'beforeWrite',
      requires: ['computeStyles'],
      fn: ({ state }) => {
        state.styles.popper.width = `${state.rects.reference.width}px`
      },
      effect: ({ state }) => {
        state.elements.popper.style.width = `${
          // @ts-ignore
          state.elements.reference.offsetWidth
        }px`
      }
    })
  }

  modifiers.push(...externalModifiers)
  return modifiers
}

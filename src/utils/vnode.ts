
import {
  Fragment,
  Text,
  Comment
} from 'vue'
import type { VNode, VNodeChild } from 'vue'

const TEMPLATE = 'template'

export const isFragment = (node: VNodeChild) =>
  (node as VNode).type === Fragment

export const isTemplate = (node: VNodeChild) =>
  (node as VNode).type === TEMPLATE

export const isText = (node: VNodeChild) => (node as VNode).type === Text

export const isComment = (node: VNodeChild) => (node as VNode).type === Comment
function getChildren(node: VNode, depth: number): undefined | VNode {
  if (isComment(node)) return
  if (isFragment(node) || isTemplate(node)) {
    return depth > 0
      ? getFirstValidNode(node.children as VNodeChild, depth - 1)
      : undefined
  }
  return node
}
export const getFirstValidNode = (
  nodes: VNodeChild,
  maxDepth = 3
): ReturnType<typeof getChildren> => {
  if (Array.isArray(nodes)) {
    return getChildren(nodes[0] as VNode, maxDepth)
  } else {
    return getChildren(nodes as VNode, maxDepth)
  }
}

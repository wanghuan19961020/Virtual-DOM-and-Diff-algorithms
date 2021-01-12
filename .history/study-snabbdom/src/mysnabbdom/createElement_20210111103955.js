// 真正创建节点 将 vnode 创建为 DOM
// 是孤儿节点，不进行插入
export default function (vnode) {
  // 创建一个 DOM 节点，这个节点现在还是孤儿节点
  let domNode = document.createElement(vnode.sel)
  // 有子节点还是有文本？
  if (
    vnode.text !== '' &&
    (vnode.children === undefined || vnode.children.length === 0)
  ) {
    // 它内部是文字
    domNode.innerText = vnode.text
    // 补充 elm 属性
    vnode.elm = domNode
  } else if (Array.isArray(vnode.children) && vnode.children.length > 0) {
    // 它内部是子节点，就要递归创建节点
    for (let i = 0; i < vnode.children.length; i++) {
      let ch = vnode.children[i]
      let chDom = createElement(ch)
    }
  }
  // 返回 elm，elm是一个纯dom对象
  return vnode.elm
}

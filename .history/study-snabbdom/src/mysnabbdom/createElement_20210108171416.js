// 真正创建节点 将 vnode 创建为 DOM 插入到 pivot 这个元素之前
export default function (vnode, pivot) {
  // 目的是把虚拟节点 vnode 插入到标杆 pivot 前
  // 创建一个 DOM 节点，这个节点现在还是孤儿节点
  let domNode = document.createElement(vnode.sel)
  // 有子节点还是有文本？
  if (
    vnode.text !== '' &&
    (vnode.children === undefined || vnode.children.length === 0)
  ) {
    // 它内部是文字
    domNode.innerText = vnode.text
    // 将孤儿节点上树
    pivot.parentNode.insertBefore(domNode, pivot)
  }
}

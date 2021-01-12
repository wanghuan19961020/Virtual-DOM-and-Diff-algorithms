// 真正创建节点 将 vnode 创建为 DOM 插入到 pivot 这个元素之前
export default function (vnode, pivot) {
  // 目的是把虚拟节点 vnode 插入到标杆 pivot 前
  let domNode = document.createElement(vnode.sel)
  // 有子节点还是有文本？
}

import patchVnode from './patchVnode'
import createElement from './createElement'

// 判断是否是同一个虚拟节点
function checkSameVnode(a, b) {
  return a.sel === b.sel && a.key === b.key
}

export default function updateChildren(parentElm, oldCh, newCh) {
  console.log('我是uodateChildren')
  console.log(oldCh, newCh)
  let oldStartIdx = 0 // 旧前
  let newStartIdx = 0 // 新前
  let oldEndIdx = oldCh.length - 1 // 旧后
  let newEndIdx = newCh.length - 1 // 新后
  let oldStartVnode = oldCh[oldStartIdx] // 旧前节点
  let oldEndVnode = oldCh[oldEndIdx] // 旧后节点
  let newStartVnode = newCh[newStartIdx] // 新前节点
  let newEndVnode = newCh[newEndIdx] // 新后节点
  console.log(oldStartIdx, newEndIdx)
  // 开始循环
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    console.log('☆')

    if (checkSameVnode(oldStartVnode, newStartVnode)) {
      // 新前和旧前
      console.log('① 新前和旧前命中')
      patchVnode(oldStartVnode, newStartVnode)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (checkSameVnode(oldEndVnode, newEndVnode)) {
      // 新后和旧后
      console.log('② 新后和旧后命中')
      patchVnode(oldEndVnode, newEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (checkSameVnode(oldStartVnode, newEndVnode)) {
      // 新后和旧前
      console.log('③ 新后和旧前命中')
      patchVnode(oldStartVnode, newEndVnode)
      // 当③新后与旧前命中的时候，此时要移动节点。移动新后指向的这个节点到老节点旧后的后面
      // 如何移动节点？只要你插入一个已经在DOM树上的节点，它就会被移动
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling)
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (checkSameVnode(oldEndVnode, newStartVnode)) {
      // 新前和旧后
      console.log('④ 新前和旧后命中')
      patchVnode(oldEndVnode, newStartVnode)
      // 当④新前与旧后命中的时候，此时要移动节点。移动新前指向的这个节点到老节点旧前的前面
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      // 都没找到
    }
  }
}

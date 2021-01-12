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
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 开始循环
  }
}

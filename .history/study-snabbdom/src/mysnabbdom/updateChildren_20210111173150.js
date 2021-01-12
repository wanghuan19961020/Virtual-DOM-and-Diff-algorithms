import createElement from './createElement'
import patchVnode from './patchVnode'

// 判断是否是同一个虚拟节点
function checkSameVnode(a, b) {
  return a.sel === b.sel && a.key === b.key
}

export default function updateChildren(parentElm, oldCh, newCh) {
  // console.log('我是updateChildren')
  // console.log(oldCh, newCh)
  let oldStartIdx = 0 // 旧前
  let newStartIdx = 0 // 新前
  let oldEndIdx = oldCh.length - 1 // 旧后
  let newEndIdx = newCh.length - 1 // 新后
  let oldStartVnode = oldCh[oldStartIdx] // 旧前节点
  let oldEndVnode = oldCh[oldEndIdx] // 旧后节点
  let newStartVnode = newCh[newStartIdx] // 新前节点
  let newEndVnode = newCh[newEndIdx] // 新后节点
  let keyMap = null
  // console.log(oldStartIdx, newEndIdx)
  // 开始循环
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // console.log('☆')
    // 首先不是判断命中，而是要掠过已经加undefined标记的东西
    if (oldStartVnode === null || oldCh[oldStartIdx] === undefined) {
      oldStartVnode = oldCh[++oldStartIdx]
    } else if (oldEndVnode === null || oldCh[oldEndIdx] === undefined) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (newStartVnode === null || newCh[newStartIdx] === undefined) {
      newStartVnode = newCh[++newStartIdx]
    } else if (newEndVnode === null || newCh[newEndIdx] === undefined) {
      newEndVnode = newCh[--newEndIdx]
    } else if (checkSameVnode(oldStartVnode, newStartVnode)) {
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
      // 四种命中都没有找到
      // 制作keyMap，缓存
      if (!keyMap) {
        keyMap = {}
        // 从 oldStartIdx 开始，到oldEndIdx结束，创建keyMap映射对象
        for (let i = oldStartIdx; i <= oldEndIdx; i++) {
          const key = oldCh[i].key
          if (key !== undefined) {
            keyMap[key] = i
          }
        }
      }
      // console.log(keyMap)
      // 寻找当前这项 newStartIdx 这项在 keyMap 中映射的序号
      const idxInOld = keyMap[newStartVnode.key]
      if (idxInOld === undefined) {
        // 判断，如果idxInOld是undefined 表示它是全新的项
        // 被加入的项（就是newStartVnode这项）现在不是真实的DOM
        parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm)
      } else {
        // 判断，如果idxInOld不是undefined 表示它不是全新的项，需要移动
        const elmToMove = oldCh[idxInOld]
        patchVnode(elmToMove, newStartVnode)
        // 把这项设置为undefined，表示已经处理完了
        oldCh[idxInOld] = undefined
        // 移动，调用insertBefore
        parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm)
      }
      // 指针下移，只移动新的头
      newStartVnode = newCh[++newStartIdx]
    }
  }
  // 继续看看有没有剩余的 循环结束了 newStartIdx 还是比 newEndIdx 小
  if (newStartIdx <= newEndIdx) {
    // new这里还有剩余节点没有处理
    // 插入的标杆
    // const before = newCh[newEndIdx + 1] ? newCh[newEndIdx + 1].elm : null
    //
    for (let i = newStartIdx; i <= newEndIdx; i++) {
      // insertBefore 可以自动识别 null，如果是 null 就会自动排到队尾去。和appendChild是一致的
      // newCh[i] 还不是真正的DOM，所以需要此处需要调用createElement
      parentElm.insertBefore(createElement(newCh[i]), oldCh[i].elm)
    }
  } else if (oldStartIdx <= oldEndIdx) {
    // old这里还有剩余节点没有处理
    // 批量删除oldStartIdx~oldEndIdx之间的项
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      if (oldCh[i]) {
        parentElm.removeChild(oldCh[i].elm)
      }
    }
  }
}

import vnode from './vnode'
import createElement from './createElement'
export default function (oldVnode, newVnode) {
  // 判断传入的第一个参数，是DOM节点还是虚拟节点？
  if (oldVnode.sel === '' || oldVnode.sel === undefined) {
    // 传入的第一个参数是DOM节点，此时要包装为虚拟节点
    oldVnode = vnode(
      oldVnode.tagName.toLowerCase(),
      {},
      [],
      undefined,
      oldVnode
    )
  }
  // 判断 oldVnode和newVnode 是不是同一个节点
  if (oldVnode.key === newVnode.key && oldVnode.sel === newVnode.sel) {
    console.log('是同一个节点')
    // 判断新旧vnode是否是同一个对象
    if (oldVnode === newVnode) return
    // 判断新vnode有没有text属性
    if (
      newVnode.text != undefined &&
      (newVnode.children === undefined || newVnode.children.length === 0)
    ) {
      // 新node有text属性
      console.log('新Vnode有text属性')
      if (newVnode.text != oldVnode.text) {
        // 如果新虚拟节点中的text和唠的虚拟节点的text不同，那么直接的让新的text写入老的elm中即可。如果老的elm中是children，name也会立即消失掉
        oldVnode.elm.innerText = newVnode.text
      }
    } else {
      // 新node没有text属性，有children
      // 判断老的虚拟节点有没有children
      if (oldVnode.children !== undefined && oldVnode.children.length > 0) {
        // 老的vnode有children，此时是最复杂的情况。就是新老vnode都有children
      } else {
        // 老的vnode没有children，新的有
        console.log(newVnode)
        for (let i = 0; i < newVnode.children.length; i++) {
          const dom = createElement(newVnode.children[i])
          oldVnode.elm.appendChild(dom)
        }
      }
    }
  } else {
    console.log('不是同一个节点，暴力插入新的，删除旧的')
    let newVnodeElm = createElement(newVnode)
    if (oldVnode.elm && newVnodeElm) {
      // 插入到老节点之前
      oldVnode.elm.parentNode.insertBefore(newVnodeElm, oldVnode.elm)
    }
    // 删除老节点
    oldVnode.elm.parentNode.removeChild(oldVnode.elm)
  }
}

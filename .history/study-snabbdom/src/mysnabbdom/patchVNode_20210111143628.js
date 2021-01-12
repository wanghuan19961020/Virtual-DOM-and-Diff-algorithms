import createElement from './createElement'

export default function patchVnode(oldVnode, newVnode) {
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
      // 所有未处理节点的开头
      let un = 0
      for (let i = 0; i < newVnode.children.length; i++) {
        const ch = newVnode.children[i]
        // 再次遍历，看看 oldVnode 中有没有节点和它是 same 的
        let isExist = false
        for (let j = 0; j < oldVnode.children.length; j++) {
          const oldCh = oldVnode.children[j]
          if (oldCh.sel === ch.sel && oldCh.key === ch.key) {
            isExist = true
          }
        }
        if (!isExist) {
          console.log(ch, i)
          const dom = createElement(ch)
          ch.elm = dom
          if (un < oldVnode.children.length) {
            oldVnode.elm.insertBefore(dom, oldVnode.children[un].elm)
          } else {
            oldVnode.elm.appendChild(dom)
          }
        } else {
          // 让处理的节点的指针下移
          un++
        }
      }
    } else {
      // 老的vnode没有children，新的有
      // 清空老vnode的内容
      oldVnode.elm.innerText = ''
      // 遍历新的vnode的子节点，创建dom，上树
      for (let i = 0; i < newVnode.children.length; i++) {
        const dom = createElement(newVnode.children[i])
        oldVnode.elm.appendChild(dom)
      }
    }
  }
}

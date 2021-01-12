import h from './mysnabbdom/h'
import patch from './mysnabbdom/patch'
const myVnode1 = h('section', {}, [
  h('p', {}, 'A'),
  h('p', {}, 'B'),
  h('p', {}, 'C')
])
const container = document.getElementById('container')
// 第一次上树
patch(container, myVnode1)

// 新节点
const btn = document.getElementById('btn')
const myVnode2 = h('section', {}, '窝边草文字了')
btn.onclick = function () {
  patch(myVnode1, myVnode2)
}

// console.log(myVnode1)

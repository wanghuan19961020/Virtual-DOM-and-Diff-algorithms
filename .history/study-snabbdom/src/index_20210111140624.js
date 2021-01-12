import h from './mysnabbdom/h'
import patch from './mysnabbdom/patch'
// const myVnode1 = h('section', {}, '我是老的DOM，我就是一个破文字，我没有子节点')

const myVnode1 = h('ul', {}, [
  h('li', { key: 'A' }, 'A'),
  h('li', { key: 'B' }, 'B'),
  h('li', { key: 'C' }, 'C')
])
const container = document.getElementById('container')
// 第一次上树
patch(container, myVnode1)

const btn = document.getElementById('btn')
// 新节点
const myVnode2 = h('section', {}, [
  h('p', {}, '哈哈哈哈'),
  h('p', {}, '嘻嘻嘻嘻'),
  h('p', {}, '呵呵呵呵呵呵')
])
btn.onclick = function () {
  patch(myVnode1, myVnode2)
}

// console.log(myVnode1)

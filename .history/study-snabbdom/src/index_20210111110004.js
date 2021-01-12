import h from './mysnabbdom/h'
import patch from './mysnabbdom/patch'
const myVnode1 = h('section', {}, [
  h('p', {}, '哈哈'),
  h('p', {}, '嘻嘻'),
  h('p', {}, '呵呵'),
  h('p', {}, [h('span', {}, 'aa'), h('span', {}, 'bb')]),
  h('p', {}, h('span', {}, 'A'))
])
const container = document.getElementById('container')
// 第一次上树
patch(container, myVnode1)

// 新节点
const btn = document.getElementById('btn')
const myVnode2 = h('section', {}, [
  h('h1', {}, '我是新的h1'),
  h('h2', {}, '我是新的h2')
])
btn.onclick = function () {
  patch(myVnode1, myVnode2)
}

// console.log(myVnode1)

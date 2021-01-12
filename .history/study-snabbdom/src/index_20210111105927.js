import h from './mysnabbdom/h'
import patch from './mysnabbdom/patch'
const myVnode1 = h('div', {}, [
  h('p', {}, '哈哈'),
  h('p', {}, '嘻嘻'),
  h('p', {}, '呵呵'),
  h('p', {}, [h('span', {}, 'aa'), h('span', {}, 'bb')]),
  h('p', {}, h('span', {}, 'A'))
])

// const myVnode1 = h('ul', {}, [
//   h('li', {}, '牛奶'),
//   h('li', {}, '咖啡'),
//   h('li', {}, [h('div', {}, [h('p', {}, '可口可乐'), h('p', {}, '百事可乐')])]),
//   h('li', {}, h('p', {}, '雪碧'))
// ])
const container = document.getElementById('container')
// 第一次上树
patch(container, myVnode1)

// 新节点
const btn = document.getElementById('btn')
const myVnode2 = h('div', {}, [
  h('h1', {}, '我是新的h1'),
  h('h2', {}, '我是新的h2')
])
btn.onclick = function () {
  patch(myVnode1, myVnode2)
}

// console.log(myVnode1)

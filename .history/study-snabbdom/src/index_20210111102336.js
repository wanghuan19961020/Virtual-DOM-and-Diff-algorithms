import h from './mysnabbdom/h'
import patch from './mysnabbdom/patch'
// const myVnode1 = h('div', {}, [
//   h('p', {}, '哈哈'),
//   h('p', {}, '嘻嘻'),
//   h('p', {}, '呵呵'),
//   h('p', {}, [h('span', {}, 'aa'), h('span', {}, 'bb')]),
//   h('p', {}, h('span', {}, 'A'))
// ])

// const myVNode2 = h('ul', {}, [
//   h('li', {}, '牛奶'),
//   h('li', {}, '咖啡'),
//   h('li', {}, [h('div', {}, [h('p', {}, '可口可乐'), h('p', {}, '百事可乐')])]),
//   h('li', {}, h('p', {}, '雪碧'))
// ])
const myVnode1 = h('h1', {}, '你好')
const container = document.getElementById('container')
patch(container, myVnode1)
// console.log(myVnode1)

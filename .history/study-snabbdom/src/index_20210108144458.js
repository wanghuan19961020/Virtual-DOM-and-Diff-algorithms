import h from './mysnabbdom/h'
const myVNode1 = h('div', {}, [
  h('p', {}, '哈哈'),
  h('p', {}, '嘻嘻'),
  h('p', {}, '呵呵'),
  h('p', {}, [h('span', {}, 'aa'), h('span', {}, 'bb')]),
  h('p', {}, h('span', {}, 'A'))
])

const myVNode2 = h('ul', {}, [
  h('li', {}, '牛奶'),
  h('li', {}, '咖啡'),
  h('li', {}, [h('div', {}, [h('p', {}, '可口可乐'), h('p', {}, '百事可乐')])]),
  h('li', {}, h('p', {}, '雪碧'))
])
console.log(myVNode1, myVNode2)

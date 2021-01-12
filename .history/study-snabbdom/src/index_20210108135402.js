import h from './mysnabbdom/h'
var myVNode1 = h('div', {}, [
  h('p', {}, '哈哈'),
  h('p', {}, '嘻嘻'),
  h('p', {}, '呵呵')
])
console.log(myVNode1)

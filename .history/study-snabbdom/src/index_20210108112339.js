import { init } from 'snabbdom/init'
import { classModule } from 'snabbdom/modules/class'
import { propsModule } from 'snabbdom/modules/props'
import { styleModule } from 'snabbdom/modules/style'
import { eventListenersModule } from 'snabbdom/modules/eventlisteners'
import { h } from 'snabbdom/h' // helper function for creating vnodes

// 创建出 patch 函数
const patch = init([
  classModule,
  propsModule,
  styleModule,
  eventListenersModule
])

// 创建虚拟节点
const myVNode1 = h(
  'a',
  { props: { href: 'http://www.atguigu.com', target: '_blank' } },
  '尚硅谷'
)

const myVNode2 = h('div', { class: { box: true } }, '我是一个盒子')

const myVNode3 = h('ul', {}, [
  h('li', {}, '牛奶'),
  h('li', {}, '咖啡'),
  h('li', {}, [h('div', [h('p', '可口可乐'), h('p', '百事可乐')])]),
  h('li', {}, '雪碧')
])
// 让虚拟节点上树
const container = document.getElementById('container')
// patch(container, myVNode1)
// patch(container, myVNode2)
patch(container, myVNode3)

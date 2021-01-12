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

const vnode1 = h('ul', {}, [
  h('li', {}, 'A'),
  h('li', {}, 'B'),
  h('li', {}, 'C'),
  h('li', {}, 'D')
])
const container = document.getElementById('container')
patch(container, vnode1)

const vnode2 = h('ul', {}, [
  h('li', {}, 'A'),
  h('li', {}, 'B'),
  h('li', {}, 'C'),
  h('li', {}, 'D'),
  h('li', {}, 'E')
])

// 点击按钮时，将vnode1变为vnode2
const btn = document.getElementById('btn')
btn.onclick = function () {
  patch(container, btn)
}

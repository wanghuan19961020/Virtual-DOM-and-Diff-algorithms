import { init } from 'snabbdom/init'
import { classModule } from 'snabbdom/modules/class'
import { propsModule } from 'snabbdom/modules/props'
import { styleModule } from 'snabbdom/modules/style'
import { eventListenersModule } from 'snabbdom/modules/eventlisteners'
import { h } from 'snabbdom/h' // helper function for creating vnodes

// 创建出 patch 函数
var patch = init([classModule, propsModule, styleModule, eventListenersModule])

// 创建虚拟节点
var myVNode1 = h('a', { props: { href: 'http://www.atguigu.com' } }, '尚硅谷')
console.log(myVNode1)

// 让虚拟节点上树
const container = document.getElementById('container')
patch(container, myVNode1)

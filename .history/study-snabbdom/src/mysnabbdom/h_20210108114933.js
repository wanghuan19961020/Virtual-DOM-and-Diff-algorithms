import vnode from './vnode'
// 编写一个低配版的h函数，这个函数必须接受3个参数，缺一不可
// 相当于它的重置功能较弱
// 也就是说，调用的时候形态必须是下面的三种之一
/*
  h('div', {}, '文字')
  h('div', {}, [])
  h('div', {}, h())
*/
export default function (sel, data, c) {}

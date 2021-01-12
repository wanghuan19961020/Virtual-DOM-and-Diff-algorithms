import vnode from './vnode'
// 编写一个低配版的h函数，这个函数必须接受3个参数，缺一不可
// 相当于它的重置功能较弱
// 也就是说，调用的时候形态必须是下面的三种之一
/*
  形态①：h('div', {}, '文字')
  形态②：h('div', {}, [])
  形态③：h('div', {}, h())
*/
export default function (sel, data, c) {
  // 检查参数的个数
  if (arguments.length !== 3)
    throw new Error('对不起，h函数必须传入3个参数，我们是低配版h函数')
  // 检查参数 c 的类型
  if (typeof c === 'string' || typeof c === 'number') {
    // 说明现在调用h函数的是形态①
    return vnode(sel, data, undefined, c, undefined)
  } else if (Array.isArray(c)) {
    // 说明现在调用h函数的是形态②
    let children = []
    // 遍历c
    for (let i = 0; i < c.length; i++) {
      // 检查 c[i] 必须是个对象
      console.log(c[i], typeof c[i] === 'object', c.hasOwnProperty('sel'))
      if (!(typeof c[i] === 'object' && c.hasOwnProperty('sel')))
        throw new Error('传入的数组参数中有项不是 h 函数')
      // 这里不用执行 c[i]，因为你的调用语句中已经有了执行
      // 此时只要收集好就行了
      children.push(c[i])
    }
    // 循环结束了，就说明children收集完毕了
    return vnode(sel, data, children, undefined, undefined)
  } else if (typeof c === 'object' && c.hasOwnProperty('sel')) {
    // 说明现在调用h函数的是形态③
  } else {
    throw new Error('传入的第三个参数类型不对')
  }
}

# 虚拟DOM和diff算法
## 简述
- diff 算法
```
  以装修房子为例，如果我们仅需要在客厅新添一座沙发或者将卧室的床换个位置。那么将整个房子重新翻修显然是不切实际的，我们通常的做法是在原先装修的基础上做微小的改动即可。
  对于 DOM 树来讲，也是同样的道理，如果仅仅是新增了一个标签或者修改了某一个标签的属性或内容。那么引起整个 DOM 树的重新渲染显然是对性能和资源的极大浪费，虽然我们的计算机每秒能进行上亿次的计算。实际上，我们只需要找出新旧 DOM 树存在差异的地方，只针对这一块区域进行重新渲染就可以了。
  所以 Diff 算法应运而生，diff 取自 different (不同的)，Diff算法的作用，总结来说，就是：精细化对比，最小量更新。
```
- diff 实例
```html
<div class="box">
  <h3>我是一个标题</h3>
  <ul>
    <li>牛奶</li>
    <li>咖啡</li>
    <li>可乐</li>
  </ul>
</div>
```
```html
<div class="box">
  <h3>我是一个标题</h3>
  <span>我是一个新的span</span>
  <ul>
    <li>牛奶</li>
    <li>咖啡</li>
    <li>可乐</li>
    <li>雪碧</li>
  </ul>
</div>
```
```
  如上：从第一个 DOM 树变为第二个 DOM 树，我们不需要将整个 DOM 推倒重来，而只需要在原有 DOM 树的基础上新增一个 span 标签和一个 li 标签即可。
```
- 真实 DOM
```html
<div class="box">
  <h3>我是一个标题</h3>
  <ul>
    <li>牛奶</li>
    <li>咖啡</li>
    <li>可乐</li>
  </ul>
</div>
```
- 虚拟 DOM
```json
{
  "sel": "div",
  "data": {
    "class": { "box": true }
  },
  "children": [
    {
      "sel": "h3",
      "data": {},
      "text": "我是一个标题"
    },
    {
      "sel": "ul",
      "data": {},
      "children": [
        { "sel": "li", "data": {}, "text": "牛奶" },
        { "sel": "li", "data": {}, "text": "咖啡" },
        { "sel": "li", "data": {}, "text": "可乐" }
      ]
    }
  ]
}
```
## snabbdom
### 简介
- `snabbdom` 是瑞典语单词，单词原意为“速度”
- `snabbdom` 是著名的虚拟 `DOM` 库，是 `diff` 算法的鼻祖，`Vue` 源码就是借鉴了 `snabbdom`
- 官方 `Git`：[https://github.com/snabbdom/snabbdom](https://github.com/snabbdom/snabbdom)
### 安装
- 在 `git` 上的 `snabbdom` 源码是用 `TypeScript` 写的，`git` 上并不提供编译好的 `JavaScript` 版本
- 如果要直接使用 `build` 出来的 `JavaScript` 版的 `snabbdom` 库，可以从 `npm` 上下载：`npm i -S snabbdom`
- 学习库底层时，**建议大家阅读原汁原味的代码，最好带有库作者原注释**。这样对你的源码阅读能力会有很大的提升。
### 测试环境搭建
-  `snabbdom` 库是 `DOM` 库，当然不能在 `nodejs` 环境运行，所以我们需要搭建 `webpack` 和 `webpack-dev-server` 开发环境，好消息是**不需要安装任何loader**
- 这里需要注意，**必须安装最新版 `webpack@5`**，不能安装 `webpack@4`，这是因为 `webpack@4` 没有读取身份证(`package.json`)中 `exports` 的能力，建议大家使用这样的版本：
  ```
  npm i -D webpack@5 webpack-cli@3 webpack-dev-server@3
  ```
- 参考 `webpack` 官网，书写好 `webpack.config.js` 文件
  ```js
  // https://webpack.docschina.org/
  const path = require('path')

  module.exports = {
    // 入口
    entry: './src/index.js',
    // 出口
    output: {
      // 虚拟打包路径，就是说文件夹不会真正生成，而是在 8080 端口虚拟生成，不会真正的物理生成
      publicPath: 'xuni',
      // 打包出来的文件名
      filename: 'bundle.js'
    },
    devServer: {
      // 端口号
      port: 8080,
      // 静态资源文件夹
      contentBase: 'www'
    }
  }
  ```
- 新建目录 `src` -> 新建文件 `src/index.js` ->  新建目录 `www` -> 新建文件 `www/index.html`
  ```js
  /** src/index.js */
  alert(123)
  ```
  ```html
  <!-- www/index.html -->
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <h1>你好!!!</h1>
    <script src="xuni/bundle.js"></script>
  </body>
  </html>
  ```
- `package.json` 文件中新增命令：
  ```json
  {
    "scripts": {
      "dev": "webpack-dev-server",
    }
  }
  ```
- 终端运行 `npm run dev`
- 访问：`http://localhost:8080/` 和 `http://127.0.0.1:8080/xuni/bundle.js`， 可以看到 `www/index.html` 和 `xuni/bundle.js` 文件的内容
- 跑通 `snabbdom` 官方 `git` 首页的 `demo` 程序，即证明调试环境已经搭建成功（将下面代码复制到 `src/index.js` 中）
  ```js
  import { init } from 'snabbdom/init'
  import { classModule } from 'snabbdom/modules/class'
  import { propsModule } from 'snabbdom/modules/props'
  import { styleModule } from 'snabbdom/modules/style'
  import { eventListenersModule } from 'snabbdom/modules/eventlisteners'
  import { h } from 'snabbdom/h' // helper function for creating vnodes

  var patch = init([
    // Init patch function with chosen modules
    classModule, // makes it easy to toggle classes
    propsModule, // for setting properties on DOM elements
    styleModule, // handles styling on elements with support for animations
    eventListenersModule // attaches event listeners
  ])

  var container = document.getElementById('container')

  var vnode = h('div#container.two.classes', { on: { click: function () {} } }, [
    h('span', { style: { fontWeight: 'bold' } }, 'This is bold'),
    ' and this is just normal text',
    h('a', { props: { href: '/foo' } }, "I'll take you places!")
  ])
  // Patch into empty DOM element – this modifies the DOM as a side effect
  patch(container, vnode)

  var newVnode = h(
    'div#container.two.classes',
    { on: { click: function () {} } },
    [
      h(
        'span',
        { style: { fontWeight: 'normal', fontStyle: 'italic' } },
        'This is now italic type'
      ),
      ' and this is still just normal text',
      h('a', { props: { href: '/bar' } }, "I'll take you places!")
    ]
  )
  // Second `patch` invocation
  patch(vnode, newVnode) // Snabbdom efficiently updates the old view to the new state
  ```
- 不要忘记在 `www/index.html` 中放置一个 `div#container`
  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <div id="container"></div>
    <script src="xuni/bundle.js"></script>
  </body>
  </html>
  ```
- 刷新页面，此时页面会出现一段文本
  ```
  This is now italic type and this is still just normal textI'll take you places!
  ```
## 虚拟 DOM 和 h 函数
### 虚拟 DOM 
- 虚拟 `DOM`：用 `JavaScript` 对象描述 `DOM` 的层次结构。`DOM` 中的一切属性都在虚拟 `DOM` 中有对应的属性。
- `diff` 是发生在虚拟 `DOM` 上的：新虚拟 `DOM` 和老虚拟 `DOM` 进行 `diff` （精细化比较），算出应该如何最小量更新，最后反映到真实的 `DOM` 上
- 老 `DOM`
  ```json
  {
    "sel": "div",
    "data": {
      "class": { "box": true }
    },
    "children": [
      {
        "sel": "h3",
        "data": {},
        "text": "我是一个标题"
      },
      {
        "sel": "ul",
        "data": {},
        "children": [
          { "sel": "li", "data": {}, "text": "牛奶" },
          { "sel": "li", "data": {}, "text": "咖啡" },
          { "sel": "li", "data": {}, "text": "可乐" }
        ]
      }
    ]
  }
  ```
- `diff` 之后的新 `DOM`
  ```json
  {
    "sel": "div",
    "data": {
      "class": { "box": true }
    },
    "children": [
      {
        "sel": "h3",
        "data": {},
        "text": "我是一个标题"
      },
      {
        "sel": "span",
        "data": {},
        "text": "我是一个新的span"
      },
      {
        "sel": "ul",
        "data": {},
        "children": [
          { "sel": "li", "data": {}, "text": "牛奶" },
          { "sel": "li", "data": {}, "text": "咖啡" },
          { "sel": "li", "data": {}, "text": "可乐" }，
          { "sel": "li", "data": {}, "text": "雪碧" }
        ]
      }
    ]
  }
  ```
- `DOM` 如何变为虚拟 `DOM`，属于模板编译原理范畴，本次课不研究
- 本次课研究什么？
  - **研究1**：虚拟DOM如何被渲染函数（h函数）产生？ - 手写h函数
  - **研究2**：diff算法原理？ - 手写 diff 算法
  - **研究3**：虚拟DOM如何通过diff变为真正的DOM的 - 事实上，虚拟DOM变回真正的DOM，是涵盖在diff算法里面的
### h 函数
#### 基本使用
- `h` 函数用来产生**虚拟节点（`vnode`）**
- 比如这样调用 `h` 函数
  ```js
  h('a', { props: { href: 'http://www.atguigu.com' } }, '尚硅谷')
  ```
- 将得到这样的虚拟节点：
  ```json
  { "sel": "a", "data": { "props": { "href": "http://www.atguigu.com" } }, "text": "尚硅谷" }
  ```
- 它表示的真正的 `DOM` 节点：
  ```html
  <a href="http://www.atguigu.com">尚硅谷</a>
  ```
- 一个虚拟节点有哪些属性？
  ```js
  {
    children: undefined, // 子节点，undefined表示没有子节点
    data: {}, // 属性样式等
    elm: undefined, // 该元素对应的真正的DOM节点，undefined表示它还没有上树
    key: undefined, // 节点唯一标识
    sel: 'div', // selector选择器 节点类型（现在它是一个div）
    text: '我是一个盒子' // 文字
  }
  ```
- `demo` 创建一个虚拟节点并将虚拟节点渲染到页面上。（将以下代码复制到 `src/index.js` 中）
  ```js
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
  // 让虚拟节点上树
  const container = document.getElementById('container')
  // patch(container, myVNode1)
  patch(container, myVNode2)
  ```
#### 嵌套使用
- 比如可以这样嵌套使用 `h` 函数：
  ```js
  h('ul', {}, [
    h('li', {}, '牛奶'),
    h('li', {}, '咖啡'),
    h('li', {}, '可乐')
  ])
  ```
- 将得到这样的虚拟 `DOM` 树：
  ```json
  {
    "sel": "ul",
    "data": {},
    "children": [
      { "sel": "li", "data": {}, "text": "牛奶" },
      { "sel": "li", "data": {}, "text": "咖啡" },
      { "sel": "li", "data": {}, "text": "可乐" }
    ]
  }
  ```
- `demo`
  ```js
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
  const myVNode3 = h('ul', [
    h('li', '牛奶'),
    h('li', '咖啡'),
    h('li', [h('div', [h('p', '可口可乐'), h('p', '百事可乐')])]),
    h('li', h('p', '雪碧'))
  ])
  // 让虚拟节点上树
  const container = document.getElementById('container')
  patch(container, myVNode3)
  ```
#### 手写 h 函数
- `src` 目录下新建 `mysnabbdom` 目录
- 新建2个文件 `src/mysnabbdom/h.js`、`src/mysnabbdom/vnode.js`
- `h` 函数
```js
/** src/mysnabbdom/h.js */ 
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
      if (!(typeof c[i] === 'object' && c[i].hasOwnProperty('sel')))
        throw new Error('传入的数组参数中有项不是 h 函数')
      // 这里不用执行 c[i]，因为你的调用语句中已经有了执行
      // 此时只要收集好就行了
      children.push(c[i])
    }
    // 循环结束了，就说明children收集完毕了，此时可以返回虚拟节点了，它是有children属性的
    return vnode(sel, data, children, undefined, undefined)
  } else if (typeof c === 'object' && c.hasOwnProperty('sel')) {
    // 说明现在调用h函数的是形态③
    // 即，传入的c是唯一的children，不用执行c，因为调用的时候已经执行过了
    let children = [c]
    return vnode(sel, data, children, undefined, undefined)
  } else {
    throw new Error('传入的第三个参数类型不对')
  }
}
```
- `vnode` 函数
```js
/** src/mysnabbdom/vnode.js */ 
// 函数的功能非常简单，就是把传入的5个参数组合成对象返回
export default function (sel, data, children, text, elm) {
  return {
    sel,
    data,
    children,
    text,
    elm
  }
}
```
- 使用
```js
/** src/index.js */
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
```
## diff 算法
### 例子
```js
/** src/index.js */
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
  patch(vnode1, vnode2)
}
```
```html
<!-- www/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <button id="btn">按我改变dom</button>
  <div id="container"></div>
  <script src="xuni/bundle.js"></script>
</body>
</html>
```
- 分析
  - 我们先在浏览器中改变每个 `li` 标签的文本内容，如下：
    ![](diff算法-1.jpg)
  - 然后点击按钮，出现如下情况：
    ![](diff算法-2.jpg)
  - 可以看到，上述代码中的 `patch` 函数所做的工作其实是在原有 `vnode1` 基础上新增了一个节点
  - 这就表明：`diff` 算法比较的是虚拟节点
  - 我们把 `E` 放到前面，将 `A B C D` 改为 `1 2 3 4` 之后再点击按钮
    ```js
    const vnode2 = h('ul', {}, [
      h('li', {}, 'E'),
      h('li', {}, 'A'),
      h('li', {}, 'B'),
      h('li', {}, 'C'),
      h('li', {}, 'D')
    ])
    ```
  - 发现整个都被替换
    ![](diff算法-3.jpg)
  - 这是因为此时虚拟节点比较时，它的顺序是这样的 
    ```
    vnode2 vnode1 
      E   -   A
      A   -   B
      B   -   C
      C   -   D
      D是新加进来的节点
    ```
  - 我们给每个节点都加上唯一标识 `key`
    ```js
    const vnode1 = h('ul', {}, [
      h('li', { key: 'A' }, 'A'),
      h('li', { key: 'B' }, 'B'),
      h('li', { key: 'C' }, 'C'),
      h('li', { key: 'D' }, 'D')
    ])

    const vnode2 = h('ul', {}, [
      h('li', { key: 'E' }, 'E'),
      h('li', { key: 'A' }, 'A'),
      h('li', { key: 'B' }, 'B'),
      h('li', { key: 'C' }, 'C'),
      h('li', { key: 'D' }, 'D')
    ])
    ```
  - 重复上述步骤，这时候 `E` 代表的就是一个新增的节点
    ![](diff算法-4.jpg)
  - 这也是为什么给节点加了唯一标识 `key` 之后页面渲染效率会大大提高的原因
- 心得
  - `diff` 算法确实是最小量更新，**`key` 很重要**，`key` 是这个节点的唯一标识，告诉 `diff` 算法，在更改前后它们是同一个 `DOM` 节点
  - **只有是同一个虚拟节点，才进行虚拟化比较**，否则就是暴力删除旧的、插入新的。延伸问题：如何定义同一个虚拟节点？答：选择器相同且 `key` 相同
  - **只进行同层比较，不会进行跨层比较**。即使是同一片虚拟节点，但是如果跨层了，那么 `diff` 算法也不会进行精细化比较。而是暴力删除旧的、然后插入新的。
### diff 处理新旧节点不是同一个节点时
![](diff算法-5.jpg)
- 如何定义相比较是否是“同一个节点”？
  ```js
  // snabbdom 源码
  function sameVnode (vnode1: VNode, vnode2: VNode): boolean {
    return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel
  }
  ```
  ```
  是 “同一个节点” 需满足以下2点：
    1. 旧节点的 `key` 要和新节点的 `key` 相同；
    2. 旧节点的选择器和新节点相同
  ```
- 创建节点时，所有子节点都是通过递归创建的
  ```js
  // snabbdom 源码
  function createElm() {
    // ...
    if (is.array(children)) {
      for (i = 0; i < children.length; ++i) {
        const ch = children[i]
        if (ch != null) {
          api.appendChild(elm, createElm(ch as VNode, insertedVnodeQueue))
        }
      }
    } else if (is.primitive(vnode.text)) {
      api.appendChild(elm, api.createTextNode(vnode.text))
    }
    // ...
  }
  ```
- 手写
  ```js
  // createElement 函数
  // 真正创建节点 将 vnode 创建为 DOM
  // 是孤儿节点，不进行插入
  export default function createElement(vnode) {
    // 创建一个 DOM 节点，这个节点现在还是孤儿节点
    let domNode = document.createElement(vnode.sel)
    // 有子节点还是有文本？
    if (
      vnode.text !== '' &&
      (vnode.children === undefined || vnode.children.length === 0)
    ) {
      // 它内部是文字
      domNode.innerText = vnode.text
    } else if (Array.isArray(vnode.children) && vnode.children.length > 0) {
      // 它内部是子节点，就要递归创建节点
      for (let i = 0; i < vnode.children.length; i++) {
        // 得到当前这个 child
        let ch = vnode.children[i]
        // 创建DOM，一旦调用createElement意味着：创建出DOM了，并且它的elm属性指向了创建出的DOM，但是还没有上树，是一个孤儿节点
        let chDom = createElement(ch)
        // 上树
        domNode.appendChild(chDom)
      }
    }
    // 补充 elm 属性
    vnode.elm = domNode
    // 返回 elm，elm是一个纯dom对象
    return vnode.elm
  }
  ```
  ```js
  // patch 函数
  import vnode from './vnode'
  import createElement from './createElement'
  export default function patch(oldVnode, newVnode) {
    // 判断传入的第一个参数，是DOM节点还是虚拟节点？
    if (oldVnode.sel === '' || oldVnode.sel === undefined) {
      // 传入的第一个参数是DOM节点，此时要包装为虚拟节点
      oldVnode = vnode(
        oldVnode.tagName.toLowerCase(),
        {},
        [],
        undefined,
        oldVnode
      )
    }
    console.log(oldVnode, newVnode)
    // 判断 oldVnode和newVnode 是不是同一个节点
    if (oldVnode.key === newVnode.key && oldVnode.sel === newVnode.sel) {
      console.log('是同一个节点')
    } else {
      console.log('不是同一个节点，暴力插入新的，删除旧的')
      let newVnodeElm = createElement(newVnode)
      if (oldVnode.elm && newVnodeElm) {
        // 插入到老节点之前
        oldVnode.elm.parentNode.insertBefore(newVnodeElm, oldVnode.elm)
      }
      // 删除老节点
      oldVnode.elm.parentNode.removeChild(oldVnode.elm)
    }
  }
  ```
  ```js
  // 测试代码
  import h from './mysnabbdom/h'
  import patch from './mysnabbdom/patch'

  const myVnode1 = h('ul', {}, [
    h('li', {}, '牛奶'),
    h('li', {}, '咖啡'),
    h('li', {}, [h('div', {}, [h('p', {}, '可口可乐'), h('p', {}, '百事可乐')])]),
    h('li', {}, h('p', {}, '雪碧'))
  ])
  const container = document.getElementById('container')
  patch(container, myVnode1)

  const btn = document.getElementById('btn')
  const myVnode2 = h('section', {}, [
    h('h1', {}, '我是新的h1'),
    h('h2', {}, '我是新的h2')
  ])
  btn.onclick = function () {
    patch(myVnode1, myVnode2)
  }
  ```
### diff 处理新旧节点是同一个节点时
![](diff算法-6.jpg)
#### 手写新旧节点text的不同情况
```js
// patchVnode.js
export default function patchVnode(oldVnode, newVnode) {
  // 判断新旧vnode是否是同一个对象
  if (oldVnode === newVnode) return
  // 判断新vnode有没有text属性
  if (
    newVnode.text != undefined &&
    (newVnode.children === undefined || newVnode.children.length === 0)
  ) {
    // 新node有text属性
    console.log('新Vnode有text属性')
    if (newVnode.text != oldVnode.text) {
      // 如果新虚拟节点中的text和老的虚拟节点的text不同，那么直接的让新的text写入老的elm中即可。如果老的elm中是children，name也会立即消失掉
      oldVnode.elm.innerText = newVnode.text
    }
  } else {
    // 新node没有text属性，有children
    // 判断老的虚拟节点有没有children
    if (oldVnode.children !== undefined && oldVnode.children.length > 0) {
      // 老的vnode有children，此时是最复杂的情况。就是新老vnode都有children
    } else {
      // 老的vnode没有children，新的有
      // 清空老vnode的内容
      oldVnode.elm.innerText = ''
      // 遍历新的vnode的子节点，创建dom，上树
      for (let i = 0; i < newVnode.children.length; i++) {
        const dom = createElement(newVnode.children[i])
        oldVnode.elm.appendChild(dom)
      }
    }
  }
}
```
```js
// patch.js
import vnode from './vnode'
import createElement from './createElement'
import patchVnode from './patchVnode'
export default function patch(oldVnode, newVnode) {
  // ...
  // 判断 oldVnode和newVnode 是不是同一个节点
  if (oldVnode.key === newVnode.key && oldVnode.sel === newVnode.sel) {
    // console.log('是同一个节点')
    patchVnode(oldVnode, newVnode)
  } else {
    // ...
  }
}
```
#### 尝试书写 diff 更新子节点
- `vnode.js` 添加 `key` 属性
```js
// vnode.js
export default function (sel, data, children, text, elm) {
  const key = data.key
  return {
    sel,
    data,
    children,
    text,
    elm,
    key
  }
}
```
- 新创建的节点( `newVnode.children[i].elm` ) 插入到所有未处理的节点( `oldVnode.children[un].elm` ) 之前，而不是所有已处理节点之后
```js
import createElement from './createElement'

export default function patchVnode(oldVnode, newVnode) {
  // ...
  if (
    newVnode.text != undefined &&
    (newVnode.children === undefined || newVnode.children.length === 0)
  ) {
    // ...
  } else {
    // 新node没有text属性，有children
    // 判断老的虚拟节点有没有children
    if (oldVnode.children !== undefined && oldVnode.children.length > 0) {
      // 老的vnode有children，此时是最复杂的情况。就是新老vnode都有children
      // 所有未处理节点的开头
      let un = 0
      for (let i = 0; i < newVnode.children.length; i++) {
        const ch = newVnode.children[i]
        // 再次遍历，看看 oldVnode 中有没有节点和它是 same 的
        let isExist = false
        for (let j = 0; j < oldVnode.children.length; j++) {
          const oldCh = oldVnode.children[j]
          if (oldCh.sel === ch.sel && oldCh.key === ch.key) {
            isExist = true
          }
        }
        if (!isExist) {
          console.log(ch, i)
          const dom = createElement(ch)
          ch.elm = dom
          if (un < oldVnode.children.length) {
            oldVnode.elm.insertBefore(dom, oldVnode.children[un].elm)
          } else {
            oldVnode.elm.appendChild(dom)
          }
        } else {
          // 让处理的节点的指针下移
          un++
        }
      }
    } else {
      // ...
    }
  }
}
```
- 上述代码只实现了新增节点的逻辑，如果要加入删除和更新节点的实现，这个思路明显是非常麻烦的
#### diff 算法的子节点更新策略
- 四种命中查找（经典的diff算法优化策略）：
  ① 新前与旧前
  ② 新后与旧后
  ③ 新后与旧前（`此种命中，涉及移动节点，那么新前指向的节点，移动到旧后之后`）
  ④ 新前与旧后（`此种命中，涉及移动节点，那么新前指向的节点，移动到旧前之前`）
  ![](diff算法-7.jpg)
  - 命中一种就不在进行判断了
  - 如果都没有命中，就需要用循环来寻找了
- 新增的情况
![](diff算法-8.jpg)
- 删除的情况
![](diff算法-9.jpg)
![](diff算法-10.jpg)
- 复杂的情况
![](diff算法-11.jpg)
![](diff算法-12.jpg)
![](diff算法-13.jpg)
![](diff算法-14.jpg)
#### 手写子节点更新策略
- `snabbdom` 源码
```js
function updateChildren (parentElm: Node,
  oldCh: VNode[],
  newCh: VNode[],
  insertedVnodeQueue: VNodeQueue) {
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newEndIdx = newCh.length - 1
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]
  let oldKeyToIdx: KeyToIndexMap | undefined
  let idxInOld: number
  let elmToMove: VNode
  let before: any

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (oldStartVnode == null) {
      oldStartVnode = oldCh[++oldStartIdx] // Vnode might have been moved left
    } else if (oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (newStartVnode == null) {
      newStartVnode = newCh[++newStartIdx]
    } else if (newEndVnode == null) {
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
      api.insertBefore(parentElm, oldStartVnode.elm!, api.nextSibling(oldEndVnode.elm!))
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
      api.insertBefore(parentElm, oldEndVnode.elm!, oldStartVnode.elm!)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      if (oldKeyToIdx === undefined) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
      }
      idxInOld = oldKeyToIdx[newStartVnode.key as string]
      if (isUndef(idxInOld)) { // New element
        api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm!)
      } else {
        elmToMove = oldCh[idxInOld]
        if (elmToMove.sel !== newStartVnode.sel) {
          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm!)
        } else {
          patchVnode(elmToMove, newStartVnode, insertedVnodeQueue)
          oldCh[idxInOld] = undefined as any
          api.insertBefore(parentElm, elmToMove.elm!, oldStartVnode.elm!)
        }
      }
      newStartVnode = newCh[++newStartIdx]
    }
  }
  if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
    if (oldStartIdx > oldEndIdx) {
      before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
  }
}
```
- 动手实现 `updateChildren` 方法
```js
// updateChildren.js
import createElement from './createElement'
import patchVnode from './patchVnode'

// 判断是否是同一个虚拟节点
function checkSameVnode(a, b) {
  return a.sel === b.sel && a.key === b.key
}

export default function updateChildren(parentElm, oldCh, newCh) {
  // console.log('我是updateChildren')
  // console.log(oldCh, newCh)
  let oldStartIdx = 0 // 旧前
  let newStartIdx = 0 // 新前
  let oldEndIdx = oldCh.length - 1 // 旧后
  let newEndIdx = newCh.length - 1 // 新后
  let oldStartVnode = oldCh[oldStartIdx] // 旧前节点
  let oldEndVnode = oldCh[oldEndIdx] // 旧后节点
  let newStartVnode = newCh[newStartIdx] // 新前节点
  let newEndVnode = newCh[newEndIdx] // 新后节点
  let keyMap = null
  // console.log(oldStartIdx, newEndIdx)
  // 开始循环
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // console.log('☆')
    // 首先不是判断命中，而是要掠过已经加undefined标记的东西
    if (oldStartVnode === null || oldCh[oldStartIdx] === undefined) {
      oldStartVnode = oldCh[++oldStartIdx]
    } else if (oldEndVnode === null || oldCh[oldEndIdx] === undefined) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (newStartVnode === null || newCh[newStartIdx] === undefined) {
      newStartVnode = newCh[++newStartIdx]
    } else if (newEndVnode === null || newCh[newEndIdx] === undefined) {
      newEndVnode = newCh[--newEndIdx]
    } else if (checkSameVnode(oldStartVnode, newStartVnode)) {
      // 新前和旧前
      console.log('① 新前和旧前命中')
      patchVnode(oldStartVnode, newStartVnode)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (checkSameVnode(oldEndVnode, newEndVnode)) {
      // 新后和旧后
      console.log('② 新后和旧后命中')
      patchVnode(oldEndVnode, newEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (checkSameVnode(oldStartVnode, newEndVnode)) {
      // 新后和旧前
      console.log('③ 新后和旧前命中')
      patchVnode(oldStartVnode, newEndVnode)
      // 当③新后与旧前命中的时候，此时要移动节点。移动新后指向的这个节点到老节点旧后的后面
      // 如何移动节点？只要你插入一个已经在DOM树上的节点，它就会被移动
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling)
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (checkSameVnode(oldEndVnode, newStartVnode)) {
      // 新前和旧后
      console.log('④ 新前和旧后命中')
      patchVnode(oldEndVnode, newStartVnode)
      // 当④新前与旧后命中的时候，此时要移动节点。移动新前指向的这个节点到老节点旧前的前面
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      // 四种命中都没有找到
      // 制作keyMap，缓存
      if (!keyMap) {
        keyMap = {}
        // 从 oldStartIdx 开始，到oldEndIdx结束，创建keyMap映射对象
        for (let i = oldStartIdx; i <= oldEndIdx; i++) {
          const key = oldCh[i].key
          if (key !== undefined) {
            keyMap[key] = i
          }
        }
      }
      // console.log(keyMap)
      // 寻找当前这项 newStartIdx 这项在 keyMap 中映射的序号
      const idxInOld = keyMap[newStartVnode.key]
      if (idxInOld === undefined) {
        // 判断，如果idxInOld是undefined 表示它是全新的项
        // 被加入的项（就是newStartVnode这项）现在不是真实的DOM
        parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm)
      } else {
        // 判断，如果idxInOld不是undefined 表示它不是全新的项，需要移动
        const elmToMove = oldCh[idxInOld]
        patchVnode(elmToMove, newStartVnode)
        // 把这项设置为undefined，表示已经处理完了
        oldCh[idxInOld] = undefined
        // 移动，调用insertBefore
        parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm)
      }
      // 指针下移，只移动新的头
      newStartVnode = newCh[++newStartIdx]
    }
  }
  // 继续看看有没有剩余的 循环结束了 newStartIdx 还是比 newEndIdx 小
  if (newStartIdx <= newEndIdx) {
    // new这里还有剩余节点没有处理
    // 插入的标杆
    // const before = newCh[newEndIdx + 1] ? newCh[newEndIdx + 1].elm : null
    //
    for (let i = newStartIdx; i <= newEndIdx; i++) {
      // insertBefore 可以自动识别 null，如果是 null 就会自动排到队尾去。和appendChild是一致的
      // newCh[i] 还不是真正的DOM，所以需要此处需要调用createElement
      parentElm.insertBefore(createElement(newCh[i]), oldCh[oldStartIdx].elm)
    }
  } else if (oldStartIdx <= oldEndIdx) {
    // old这里还有剩余节点没有处理
    // 批量删除oldStartIdx~oldEndIdx之间的项
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      if (oldCh[i]) {
        parentElm.removeChild(oldCh[i].elm)
      }
    }
  }
}
```
```js
// 测试
import h from './mysnabbdom/h'
import patch from './mysnabbdom/patch'

const myVnode1 = h('ul', {}, [
  h('li', { key: 'A' }, 'A'),
  h('li', { key: 'B' }, 'B'),
  h('li', { key: 'C' }, 'C'),
  h('li', { key: 'D' }, 'D'),
  h('li', { key: 'E' }, 'E')
])
const container = document.getElementById('container')
// 第一次上树
patch(container, myVnode1)

const btn = document.getElementById('btn')
// 新节点
const myVnode2 = h('ul', {}, [
  h('li', { key: 'QQ' }, 'QQB'),
  h('li', { key: 'C' }, 'C'),
  h('li', { key: 'D' }, 'D'),
  h('li', { key: 'B' }, 'B'),
  h('li', { key: 'F' }, 'F'),
  h('li', { key: 'G' }, 'G')
])
btn.onclick = function () {
  patch(myVnode1, myVnode2)
}

```
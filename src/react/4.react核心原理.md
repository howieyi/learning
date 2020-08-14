## Fiber

> 在 `react 15` 及之前，`Reconciler(协调器)`采用递归的方式创建虚拟 Dom，递归过程中是不能中断的。如果组件树的层级很深，递归会占用线程很多时间，就会造成卡顿。这也是 `react 16` 诞生的根本原因；
>
> `react 16` 将递归的无法中断的更新重构为异步的可中断更新，由于曾经用于递归的虚拟 dom 数据结构已经无法满足需要，于是全新的`Fiber`架构应运而生。
> `Fiber` 就是 `react 16 虚拟 Dom` 的正式称呼。

### `Fiber` 主要目标

> `Fiber Reconciler` 是一个新尝试，致力于解决 `stack reconciler(react 16之前的版本，递归处理dom)` 中固有的问题，同时解决一些历史遗留问题。Fiber 从 React 16 开始变成了默认的 reconciler。

- 能够把可中断的任务切片处理。
- 能够调整优先级，重置并复用任务。
- 能够在父元素与子元素之间交错处理，以支持 React 中的布局。
- 能够在 render() 中返回多个元素。
- 更好地支持错误边界。

### `Fiber` 三层含义

- 针对架构层面，`react 16` 的 `reconciler` 采用 `fiber 节点`的实现，叫做 `Fiber Reconciler`; 而 `react 15` 的 `reconciler` 采用递归的方式处理 dom，数据保存在递归调用栈中，所以又叫 `Stack Reconciler`;
- 针对静态的数据结构来说，每个 `fiber 节点` 对应一个组件，保存了该组件的类型（函数组件、类组件、原生组件等）、对应的 dom 节点等信息；
- 针对动态的工作单元来说，每个 `fiber 节点` 保存了本次更新中该组件改变的状态、要执行的工作（删除、插入、更新等）；

#### FiberNode

> 代码在 `packages/react-reconciler/src/ReactFiber.new.js` 下，

```javascript
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode
) {
  // 作为静态数据结构的属性
  // Fiber对应组件的类型 Function/Class/Host...
  this.tag = tag;
  this.key = key;
  // 大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹
  this.elementType = null;
  // 对于 FunctionComponent，指函数本身，对于ClassComponent，指class，对于HostComponent，指DOM节点tagName
  this.type = null;
  // Fiber对应的真实DOM节点
  this.stateNode = null;

  // Fiber
  // 用于连接其他Fiber节点形成Fiber树
  // 每个Fiber节点对应一个组件，多个Fiber节点是按照以下三个节点连接形成树
  // 指向父级 fiber 节点
  this.return = null;
  // 指向子集 fiber 节点
  this.child = null;
  // 指向右边第一个兄弟 fiber 节点
  this.sibling = null;

  this.index = 0;

  this.ref = null;

  // 作为动态的工作单元的属性
  // 保存本次更新造成的状态改变相关信息
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  // Effects
  // 保存本次更新会造成的DOM操作
  this.effectTag = NoEffect;
  this.subtreeTag = NoSubtreeEffect;
  this.deletions = null;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;

  // ......
}
```

### 双缓冲机制

> `React` 使用“双缓冲”来完成 `Fiber` 树的构建与替换——对应着 `DOM` 树的创建与更新。

#### 双缓存 Fiber 树

> 在 `react` 中最多会同时存在两棵 `fiber 树`：
>
> 1. 当前界面显示的内容对应的 `fiber树` 称为 `current fiber 树`，树中的节点对应为 `current fiber`；
> 2. 正在内存中构建的 `fiber 树` 被称为 `workInProgress fiber 树`，树中的节点对应为 `workInProgress fiber`；
>
> 它们通过 `alternate` 属性连接；

```javascript
currentFiber.alternate === workInProgressFiber;
workInProgressFiber.alternate === currentFiber;
```

> `react` 应用的根节点通过 `current` 指针 在不同 `Fiber` 树的 `rootFiber` 间切换来实现 `Fiber` 树之间的切换\
> `workInProgressFiber` 树构建完成交给 `Renderer` 渲染在页面后，应用节点的 `current` 指针指向 `workInProcessFiber` 树，此时 workInProcessFiber 就变为了 currentFiber 树\
> 每次更新都会产生新的 `workInProcessFiber` 树，通过 `current` 与 `workInProgress` 的切换来实现 `dom` 的更新


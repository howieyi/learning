#### shape-outside

- 定义了一个可以是非矩形的形状，相邻的内联内容应围绕该形状进行包装。

> 默认情况下，内联内容包围其边距框; shape-outside 提供了一种自定义此包装的方法，可以将文本包装在复杂对象周围而不是简单的框中。

```html
<!-- shape-outside / display: flow-root -->
<div style="background-color: lightblue; display: flow-root">
  <img width="100" height="100" style="float: left; shape-outside: circle(50%); margin: 30px" src="https://t7.baidu.com/it/u=4162611394,4275913936&fm=193&f=GIF" /> for him at his house, after dinner,
  not later than eleven o’clock. This athletic young Frenchman belongs to a small set of Parisian sportsmen, who have taken up “ballooning” as a pastime. After having exhausted all the sensations that
  are to be found in ordinary sports, even those of “automobiling” at a breakneck speed, the members of the “Aéro Club” now seek in
</div>
```

#### display: flow-root 消除浮动

- 一个新的 display 属性的值，它可以创建无副作用的 BFC。在父级块中使用 display: flow-root 可以创建新的 BFC。

- 功能等同于 `overflow: auto/hidden`(非 `visible`)

```html
<!-- shape-outside / display: flow-root -->
<div style="background-color: lightblue; display: flow-root">
  <img width="100" height="100" style="float: left; shape-outside: circle(50%); margin: 30px" src="https://t7.baidu.com/it/u=4162611394,4275913936&fm=193&f=GIF" /> for him at his house, after dinner,
  not later than eleven o’clock. This athletic young Frenchman belongs to a small set of Parisian sportsmen, who have taken up “ballooning” as a pastime. After having exhausted all the sensations that
  are to be found in ordinary sports, even those of “automobiling” at a breakneck speed, the members of the “Aéro Club” now seek in
</div>
```

#### 如何合并 margin 引起的外边距

```html
<!-- 合并margin引起的外边距 -->
<div style="background-color: purple; overflow: hidden">
  <div style="height: 100px; margin-top: 20px"></div>
</div>
```

#### flex 与 margin 完美配合

- `margin: auto` 可以配合 flex 等比在父容器内撑开元素
- `margin-left/margin-right: auto` 可以单独在父容器内撑开某一元素

```html
<style>
  .t-flex {
    display: flex;
    flex-direction: row;
  }
  .t-flex > div {
    width: 20px;
    height: 20px;
    /* margin: auto; */
    background-color: pink;
  }
</style>
<div class="t-flex">
  <div>1</div>
  <div>2</div>
  <div style="margin-right: auto">3</div>
  <div>4</div>
  <div>5</div>
</div>
```

- `flex-grow` 之和小于 1，按照比例分配父级容器内剩余控件

```html
<style>
  .t-flex {
    display: flex;
    flex-direction: row;
    background-color: yellow;
  }
  .t-flex > div {
    width: 20px;
    height: 20px;
    /* margin: auto; */
    background-color: pink;
  }
</style>
<div class="t-flex">
  <div style="flex-grow: 0.1;">1</div>
  <div style="flex-grow: 0.3;">2</div>
  <div style="flex-grow: 0.3;">3</div>
  <div style="flex-grow: 0.3;">4</div>
  <div>5</div>
</div>
```

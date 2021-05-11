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

#### `position: sticky` 粘性定位

> 一个 sticky 元素会“固定”在离它最近的一个拥有“滚动机制”的祖先上（当该祖先的 overflow 是 hidden, scroll, auto, 或 overlay 时），即便这个祖先不是最近的真实可滚动祖先。

- 元素根据正常文档流进行定位，然后相对它的最近滚动祖先
- 该值总是创建一个新的层叠上下文（stacking context）

```html
<style>
  * {
    box-sizing: border-box;
  }

  dl {
    margin: 0;
    padding: 24px 0 0 0;
  }

  dt {
    background: #b8c1c8;
    border-bottom: 1px solid #989ea4;
    border-top: 1px solid #717d85;
    color: #fff;
    font: bold 18px/21px Helvetica, Arial, sans-serif;
    margin: 0;
    padding: 2px 0 0 12px;
    position: -webkit-sticky;
    position: sticky;
    top: -1px;
  }

  dd {
    font: bold 20px/45px Helvetica, Arial, sans-serif;
    margin: 0;
    padding: 0 0 0 12px;
    white-space: nowrap;
  }

  dd + dd {
    border-top: 1px solid #ccc;
  }
</style>
<div style="height: 300px; overflow-y: auto;">
  <dl>
    <dt>A</dt>
    <dd>Andrew W.K.</dd>
    <dd>Apparat</dd>
    <dd>Arcade Fire</dd>
    <dd>At The Drive-In</dd>
    <dd>Aziz Ansari</dd>
  </dl>
  <dl>
    <dt>C</dt>
    <dd>Chromeo</dd>
    <dd>Common</dd>
    <dd>Converge</dd>
    <dd>Crystal Castles</dd>
    <dd>Cursive</dd>
  </dl>
  <dl>
    <dt>E</dt>
    <dd>Explosions In The Sky</dd>
  </dl>
  <dl>
    <dt>T</dt>
    <dd>Ted Leo & The Pharmacists</dd>
    <dd>T-Pain</dd>
    <dd>Thrice</dd>
    <dd>TV On The Radio</dd>
    <dd>Two Gallants</dd>
  </dl>
</div>
```

#### flex、margin 实现简易居中

```html
<div style="width: 200px; height: 200px; display: flex; background-color: peru;">
  <div style="width: 20px; height: 20px; background-color: aqua; margin: auto;"></div>
</div>
```

### conic-gradient 锥形渐变

```html
<!-- 锥形渐变 -->
<div style="width: 100px; height: 100px; border-radius: 50%; background: conic-gradient(red 0 20%, orange 20% 40%, yellow 40% 60%, green 60% 80%, blue 80% 100%);"></div>
```

- 颜色盘

```html
<!-- 拾色器 -->
<style>
  /* $colors: ();
  $totalStops: 20;

  @for $i from 0 through $totalStops {
    $colors: append($colors, hsl($i * (360deg / $totalStops), 100%, 50%), comma);
  }

  .colors {
    width: 200px;
    height: 200px;
    background: conic-gradient($colors);
    border-radius: 50%;
  } */

  .colors {
    width: 200px;
    height: 200px;
    background: conic-gradient(
      red,
      #ff4d00,
      #ff9900,
      #ffe600,
      #ccff00,
      #80ff00,
      #33ff00,
      #00ff1a,
      #00ff66,
      #00ffb3,
      cyan,
      #00b3ff,
      #0066ff,
      #001aff,
      #3300ff,
      #8000ff,
      #cc00ff,
      #ff00e6,
      #ff0099,
      #ff004d,
      red
    );
    border-radius: 50%;
  }
</style>
<div class="colors"></div>
```

### repeating-conic-gradient 重复锥形渐变

```html
<!-- 重复锥形渐变  -->
<div style="width: 100px; height: 100px; border-radius: 50%; background: repeating-conic-gradient(red 0 15deg, orange 0 30deg, yellow 0 45deg);"></div>
```

### animation-play-state 停止动画

```html
<!-- css 控制动画停止 -->
<style>
  @keyframes rotate {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .animation {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: repeating-conic-gradient(red 0 15deg, orange 0 30deg, yellow 0 45deg);
    animation: rotate 1s linear infinite;
    cursor: pointer;
  }
  .animation:hover {
    animation-play-state: paused;
  }
</style>
<div class="animation"></div>
```

### filter 滤镜虚化

```html
<!-- css 滤镜虚化 -->
<style>
  .animation:hover {
    filter: blur(2px);
  }
</style>
```

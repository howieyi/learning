class Vue extends EventTarget {
  constructor(options) {
    super();

    this.options = options;
    this.$el = document.querySelector(options.el);
    this.data = this.observerData(options.data);
    this.compileTemplate(this.$el);
  }

  // 双向绑定
  observerData(data) {
    const _this = this;
    return new Proxy(data, {
      set: function (target, prop, newValue) {
        // 事件发布
        const event = new CustomEvent(prop, { detail: newValue });
        _this.dispatchEvent(event);

        return Reflect.set(...arguments);
      },
    });
  }

  // 模板编译
  compileTemplate(node) {
    const children = node.childNodes;
    children.forEach((it) => {
      if (it.nodeType === 3) {
        // text 文本节点
        const regexp = /\{\{\s*([^\s\{\}]+)\s*\}\}/gi;
        const textContent = it.textContent;
        if (textContent.match(regexp)) {
          const prop = RegExp.$1;
          it.textContent = textContent.replace(regexp, this.data[prop]);
          // 事件接收
          this.addEventListener(
            prop,
            function (event) {
              it.textContent = textContent.replace(regexp, event.detail);
            },
            false
          );
        }
      } else if (it.nodeType === 1) {
        // node 元素节点
        this.compileTemplate(it);
        // check v-model
        const attrs = it.attributes;

        if (attrs.hasOwnProperty("v-model")) {
          const _this = this;
          const prop = attrs["v-model"].nodeValue;
          it.value = this.data[prop];
          it.addEventListener(
            "input",
            function (event) {
              // TODO 入口需要做XSS校验
              _this.data[prop] = event.target.value;
            },
            false
          );
        }
      }
    });
  }
}

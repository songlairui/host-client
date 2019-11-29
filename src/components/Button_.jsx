export default {
  props: {
    secondary: Boolean
  },
  data() {
    return {
      loading: false
    };
  },
  render(h) {
    const {
      $listeners: { ...on },
      $slots: slots
    } = this;
    const vm = this;

    // 包裹 click 事件
    if (on.click && !on.click._old) {
      const old = on.click;
      on.click = async function(...args) {
        vm.loading = true;
        const result = await old.bind(this)(...args);
        vm.loading = false;
        return result;
      };
      on.click._old = old;
    }
    const loadingAttr = this.secondary ? "loadingSecondary" : "loading";
    return h(
      "VueButton",
      {
        ...this.$vnode.data,
        props: { [loadingAttr]: vm.loading, ...this.$vnode.data.attrs },
        on
      },
      slots.default
    );
  }
};

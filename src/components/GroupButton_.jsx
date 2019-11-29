export default {
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
    return vm.loading
      ? h(
          "VueButton",
          {
            ...this.$vnode.data,
            props: { loading: true, ...this.$vnode.data.attrs },
            on
          },
          slots.default
        )
      : h(
          "VueGroupButton",
          {
            ...this.$vnode.data,
            props: { ...this.$vnode.data.attrs },
            on
          },
          slots.default
        );
  }
};

<template>
  <FButton />
</template>
<script>
export default {
  data() {
    return {
      loading: false
    };
  },

  components: {
    FButton: {
      functional: true,
      render(h, context) {
        const { parent } = context;
        const { $listeners: listeners } = parent;

        const oldFn = listeners.click;
        if (oldFn) {
          listeners.click = async function() {
            context.parent.loading = true;
            await oldFn.bind(this)();
            context.parent.loading = false;
          };
        }
        const data = {
          ...parent.$vnode.data,
          on: listeners,
          props: {
            loadingSecondary: context.parent.loading,
            ...parent.$vnode.data.attrs
          }
        };

        return h("VueButton", data, parent.$slots.default);
      }
    }
  }
};
</script>
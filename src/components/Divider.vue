<template>
  <div class="divider" :class="type"></div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: "hori"
    }
  }
};
</script>
<style lang="stylus" scoped>
.divider {
  &.vert {
    display: inline-block;
    min-width: 0.5em;
  }

  &.hori {
    display: block;
    min-width: 1px;
    min-height: 0.8em;
  }
}
</style>
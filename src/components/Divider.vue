<template>
  <div class="divider" :class="type"></div>
</template>
<script>
export default {
  props: {
    type: String
  }
};
</script>
<style lang="stylus" scoped>
.divider {
  &.vert {
    display: inline-block;
    min-width: 0.5em;
  }
}
</style>
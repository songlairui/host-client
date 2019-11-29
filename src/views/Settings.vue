<template>
  <div class="about">
    <h1>Settings</h1>
    <VueFormField :subtitle="`VUE_APP_GRAPHQL_HTTP: ${gqlHttpVal}`" title="http Endpoint">
      <VueInput icon-left="event_seat" v-model.trim="gqlHttpTmp" :placeholder="gqlHttpVal" />
      <VueButton
        class="accent"
        :disabled="gqlHttpVal === gqlHttpTmp"
        label="Update"
        @click="gqlHttpVal = gqlHttpTmp"
      />
    </VueFormField>
    <Divider />
    <VueFormField :subtitle="`VUE_APP_GRAPHQL_WS: ${gqlWsVal}`" title="ws Endpoint">
      <VueInput icon-left="event_seat" v-model.trim="gqlWsTmp" :placeholder="gqlWsVal" />
      <VueButton :disabled="gqlWsVal === gqlWsTmp" label="Update" @click="gqlWsVal = gqlWsTmp" />
    </VueFormField>
  </div>
</template>
<script>
export default {
  data() {
    return {
      gqlHttpTmp: "",
      gqlWsTmp: ""
    };
  },
  computed: {
    gqlHttpVal: {
      get() {
        return (
          localStorage.getItem("VUE_APP_GRAPHQL_HTTP") ||
          process.env.VUE_APP_GRAPHQL_HTTP
        );
      },
      set(val) {
        localStorage.setItem("VUE_APP_GRAPHQL_HTTP", val);
      }
    },
    gqlWsVal: {
      get() {
        return (
          localStorage.getItem("VUE_APP_GRAPHQL_WS") ||
          process.env.VUE_APP_GRAPHQL_WS
        );
      },
      set(val) {
        localStorage.setItem("VUE_APP_GRAPHQL_WS", val);
      }
    }
  },
  mounted() {
    this.gqlHttpTmp = this.gqlHttpVal;
    this.gqlWsTmp = this.gqlWsVal;
  }
};
</script>
<style lang="stylus" scoped>
.about {
  padding: 1em;
}
</style>

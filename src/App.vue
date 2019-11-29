<template>
  <div id="app">
    <div id="nav">
      <VueButton class="flat icon-button" icon-left="zoom_out_map" @click="maxium" />
      <VueButton class="flat icon-button" icon-left="remove" @click="minize" />
      <VueButton class="flat icon-button" icon-left="home" to="/" />
      <VueButton class="flat icon-button" icon-left="settings" to="/about" />
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App",
  methods: {
    maxium() {
      window.resizeTo(440, 660);
    },
    minize() {
      window.resizeTo(80, 30);
    }
  }
};
</script>
<style lang="stylus">
html, body, #app {
  height: 100%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  >div {
    flex: 1;
    overflow: auto;
  }

  #nav {
    text-align: right;
    flex: 0 0 auto;
    -webkit-user-select: none;
    -webkit-app-region: drag;
    padding: 0.3em 2em 0 0;
    cursor: move;
  }
}

ul, li, ol {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
</style>

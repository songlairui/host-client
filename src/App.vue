<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

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
    padding: .3em 2em 0 0;
    cursor: move;
  }
}

ul, li, ol {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
</style>

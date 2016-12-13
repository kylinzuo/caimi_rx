<template>
  <div id="app">
    <Tschart></Tschart>
  </div>
</template>

<script>
import Tschart from './components/Tschart'
export default {
  name: 'app',
  components: {
    Tschart
  }
}
</script>

<style>
html, body {
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
</style>

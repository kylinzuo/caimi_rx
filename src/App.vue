<template>
  <div id="app">
    <!--<Tschart></Tschart>-->
    <!--<Kchart></Kchart>-->
    <router-link to='/'>tsChart</router-link>
    <router-link to='/k'>kChart</router-link>
    <router-link to='/9k'>9Chart</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
import Tschart from './components/Tschart'
import Kchart from './components/Kchart'
export default {
  name: 'app',
  components: {
    Tschart,
    Kchart
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
a {
  font-size: 18px;
  text-decoration: none;
}
</style>

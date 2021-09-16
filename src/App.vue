<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/datePicker">DatePicker</router-link>
  </div>
  <div style="max-width: 800px; margin: 0 auto"><router-view /></div>
</template>

<style>
* {
  box-sizing: border-box;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

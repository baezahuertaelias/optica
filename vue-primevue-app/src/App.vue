<!-- src/App.vue -->
<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

#app, .app-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>

<template>
  <div class="main-view">
    <div class="sidebar">
      <MainMenu />
    </div>
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<script>
import MainMenu from '@/components/MainMenu.vue'

export default {
  components: {
    MainMenu,
  },
}
</script>

<style scoped>
.main-view {
  display: flex;
  margin: 20px;
}

.sidebar {
  width: 250px;
  padding-right: 20px;
}

.content {
  flex-grow: 1;
}
</style>

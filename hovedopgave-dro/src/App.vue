<script setup>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <div id="app">
    <Header />
    <main class="content">
      <router-view /> <!-- VIGTIGT! Dette er der hvor LoginView vises -->
    </main>
    <Footer />
  </div>
</template>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #efefef;
}

.content {
  flex: 1;
}
</style>

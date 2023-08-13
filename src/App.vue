<script setup>
import { onBeforeMount } from 'vue';
import { RouterView } from 'vue-router'
import store from './store';

onBeforeMount(() => {
  store.dispatch("onStart");
});

</script>

<template>
  <div>
    <RouterView />
  </div>
</template>

<style scoped></style>

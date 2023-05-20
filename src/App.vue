<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import NavBar from './components/NavBar.vue';
</script>

<template>
  <ion-app>
    <NavBar />
    <ion-router-outlet />
  </ion-app>
</template>

<style>
.tabs-inner {
  display: none !important;
}
</style>
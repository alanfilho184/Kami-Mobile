
<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
</script>

<template>
  <ion-page>
    <ion-header class="header" collapse="condense">
      <ion-toolbar>
        <ion-title size="large" class="header-title">Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div id="container">

      </div>
    </ion-content>
  </ion-page>
</template>

<style>
#container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  background-color: var(--kami-background);
  width: 100%;
  height: fit-content;
}

.header {
  border-bottom: 2px solid var(--kami-primary);
  background-color: var(--kami-background);
}

.header-title {
  font-size: 1.5em;
}

.login-button {
  margin: 10px;
  background-color: var(--kami-primary);
  color: var(--kami-text);
  border-radius: 0.5em;
  width: 80%;
  height: 2.5em;
  font-size: 1.2em;
  font-weight: bold;
}

.login-button:active {
  background-color: var(--kami-primary);
}
</style>

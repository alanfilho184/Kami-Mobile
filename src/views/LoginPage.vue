
<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { Browser } from '@capacitor/browser';

function openLoginUrl() {
  Browser.open({ url: 'http://capacitorjs.com/' })
    .then((r) => {
      console.log(r)
    })
}
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Login</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <h1 class="login-title">Faça login com o Discord</h1>
        <button class="login-button" v-on:click="openLoginUrl()">
          <img src="../assets/discord.svg" alt="Logo do Discord" />
          Entrar com o Discord
        </button>
        <p class="login-message">Assim podemos sincronizar suas fichas, campanhas e afins entre plataformas</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
#container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.login-title {
  font-size: 2rem;
  text-align: center;
  width: 90%;
  margin: 20px 0px 20px 0px;
}

.login-message {
  font-size: 1.25rem;
  text-align: center;
  width: 90%;
  font-weight: normal;
  margin: 20px 0px 20px 0px;
}

.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  background-color: #7289da;
  color: var(--kami-text) !important;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin: 0;
}

.login-button:hover {
  background-color: #5f73bc;
}

.login-button:active {
  background-color: #4e62a0;
}

.login-button img {
  width: 2rem;
  height: 2rem;
  filter: brightness(0) invert(1);
}
</style>

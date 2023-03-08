
<script lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginPage',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
  },
  setup() {
    const router = useRouter();
    return { router };
  },
};
</script>

<template>
  <ion-page>
    <ion-header class="header" collapse="condense">
      <ion-toolbar>
        <ion-title size="large" class="header-title">Entrar</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div id="container">
        <img src="../assets/logo.png" />
        <ion-button class="login-button" @click="() => router.push('/login')">Entrar com a conta do Kami</ion-button>
        <ion-button class="login-button">Criar nova conta</ion-button>
        <p>Faça login para que possamos guardar suas fichas, campanhas e etc</p>
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

#container p {
  width: 90%;
  text-align: center;
}

#container img {
  width: 60%;
  margin: 5px;
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

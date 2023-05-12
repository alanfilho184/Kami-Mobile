
<script>
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';

export default {
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
  },
  async beforeMount() {
    const token = await this.$storage.get('token')

    if (token == null) {
      await this.$storage.remove('user')
      this.$router.push({ name: 'Home' })
    }
  },
}
</script>

<template>
  <ion-page>
    <ion-header class="header" collapse="condense">
      <ion-toolbar>
        <ion-title size="large" class="header-title">Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div id="container">
        <h1>{{ $route.name }}</h1>
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
  text-align: right;
}
</style>

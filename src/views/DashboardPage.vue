
<script>
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonTabs, IonRouterOutlet } from '@ionic/vue';

export default {
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonTabs,
    IonRouterOutlet
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
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-header class="header" collapse="condense">
        <ion-toolbar>
          <ion-title size="large" class="header-title">Dashboard</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content :fullscreen="true">
        <div id="container">
          <h1>Acesso Rápido</h1>
          <div class="quick-access-item-box">
            <h1>Fichas</h1>
            <img class="quick-access-next" src="../assets/navigate.svg" />
            <img class="quick-access-previous" src="../assets/navigate.svg" />
            <div class="quick-access-item-list">
              <div class="quick-acecss-item">item 1</div>
            </div>
          </div>
        </div>
      </ion-content>
    </ion-tabs>
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

.quick-access-item-box {
  display: grid;
  grid-template-columns: 0.3fr 2.4fr 0.3fr;
  grid-template-rows: 0.3fr 1.7fr;
  gap: 0px 0px;
  grid-template-areas:
    "title title title"
    "previous item next";
  width: 100%;
  height: 14em;
}

.quick-access-item-box > h1 {
  grid-area: title;
  font-size: 1.5em;
  text-align: center;
}

.quick-access-item-box > .quick-access-next {
  grid-area: next;
  align-self: center;
  justify-self: center;
}

/* transform the width and height to fill the grid area */
.quick-access-next {
  transform: rotate(180deg);
  margin: 0;
  padding: 0;
  height: 12em !important;
  width: 2em !important;
}

.quick-access-item-box > .quick-access-previous {
  grid-area: previous;
  align-self: center;
  justify-self: center;
}

.quick-access-previous {
  margin: 0;
  padding: 0;
  height: 12em !important;
  width: 2em !important;
}

.quick-access-item-list {
  grid-area: item;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

</style>

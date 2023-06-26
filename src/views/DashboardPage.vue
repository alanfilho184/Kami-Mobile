
<script>
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonTabs, IonRouterOutlet } from '@ionic/vue';
import ItemComponent from '../components/ItemComponent.vue'

export default {
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonTabs,
    IonRouterOutlet,
    ItemComponent
  },
  data() {
    return {
      username: '',
      sheets: [{ sheet_name: 'teste1' }, { sheet_name: 'teste2' }],
      campaings: [],
      notifications: []
    }
  },
  async beforeMount() {
    const token = await this.$storage.get('token')

    if (token == null) {
      await this.$storage.remove('user')
      this.$router.push({ name: 'Home' })
    }

    setTimeout(() => {
      this.$storage.get('user').then((user) => {
        this.username = user.username
      })
    }, 50)
  },
  mounted() {
    setTimeout(() => {
      this.$refs['quick-access-sheet-item'].href = `fichas/${this.username}/${this.sheets[0].sheet_name}`
      this.$refs['quick-access-sheet-item'].description = this.sheets[0].sheet_name
      this.$refs['quick-access-sheet-item'].index = 0
    }, 300)

    //this.$refs['quick-access-campaing-item'].setAttribute('href', this.campaings[0].href)
    // this.$refs['quick-access-campaing-item'].index = 0
    // this.$refs['quick-access-campaing-item'].description = this.campaings[0].campaing_name

    // this.$refs['quick-access-notification-item'].index = 0
    // this.$refs['quick-access-notification-item'].description = this.notifications[0].notification
  },
  methods: {
    nextCard(card) {
      if (card == 'sheet') {
        const actualIndex = this.$refs['quick-access-sheet-item'].index

        if (actualIndex < this.sheets.length - 1) {
          const nextSheet = this.sheets[parseInt(actualIndex) + 1]
          this.$refs['quick-access-sheet-item'].index = parseInt(actualIndex) + 1

          this.$refs['quick-access-sheet-item'].description = nextSheet.sheet_name
          this.$refs['quick-access-sheet-item'].href = `fichas/${this.username}/${nextSheet.sheet_name}`
        }
        else {
          this.$refs['quick-access-sheet-item'].index = 0

          this.$refs['quick-access-sheet-item'].href = `fichas/${this.username}/${this.sheets[0].sheet_name}`
          this.$refs['quick-access-sheet-item'].description = this.sheets[0].sheet_name
        }
      }
      // else if (card == 'campaing') {
      //   const actualIndex = this.$refs['quick-access-campaing-item'].index

      //   if (actualIndex < this.campaings.length - 1) {
      //     const nextCampaing = this.campaings[parseInt(actualIndex) + 1]
      //     this.$refs['quick-access-campaing-item'].index = parseInt(actualIndex) + 1
      //     this.$refs['quick-access-campaing-item'].description = nextCampaing.campaing_name
      //     this.$refs['quick-access-campaing-item'].href = nextCampaing.href
      //   }
      //   else {
      //     this.$refs['quick-access-campaing-item'].index = 0
      //     this.$refs['quick-access-campaing-item'].href = this.campaings[0].href
      //     this.$refs['quick-access-campaing-item'].description = this.campaings[0].campaing_name
      //   }
      // }
      // else if (card == 'notification') {
      //   const actualIndex = this.$refs['quick-access-notification-item'].index

      //   if (actualIndex < this.notifications.length - 1) {
      //     const nextNotification = this.notifications[parseInt(actualIndex) + 1]
      //     this.$refs['quick-access-notification-item'].index = parseInt(actualIndex) + 1
      //     this.$refs['quick-access-notification-item'].description = nextNotification.notification
      //   }
      //   else {
      //     this.$refs['quick-access-notification-item'].index = 0
      //     this.$refs['quick-access-notification-item'].description = this.notifications[0].notification
      //   }
      // }
    },
    previousCard(card) {
      if (card == 'sheet') {
        const actualIndex = this.$refs['quick-access-sheet-item'].index

        if (actualIndex > 0) {
          const previousSheet = this.sheets[parseInt(actualIndex) - 1]
          this.$refs['quick-access-sheet-item'].index = parseInt(actualIndex) - 1

          this.$refs['quick-access-sheet-item'].description = previousSheet.sheet_name
          this.$refs['quick-access-sheet-item'].href = `fichas/${this.username}/${previousSheet.sheet_name}`
        }
        else {
          this.$refs['quick-access-sheet-item'].index = this.sheets.length - 1

          this.$refs['quick-access-sheet-item'].href = `fichas/${this.username}/${this.sheets[this.sheets.length - 1].sheet_name}`
          this.$refs['quick-access-sheet-item'].description = this.sheets[this.sheets.length - 1].sheet_name
        }
      }
      // else if (card == 'campaing') {
      //   const actualIndex = this.$refs['quick-access-campaing-item'].index

      //   if (actualIndex > 0) {
      //     const previousCampaing = this.campaings[parseInt(actualIndex) - 1]
      //     this.$refs['quick-access-campaing-item'].index = parseInt(actualIndex) - 1

      //     this.$refs['quick-access-campaing-item'].description = previousCampaing.campaing_name
      //     this.$refs['quick-access-campaing-item'].href = previousCampaing.href
      //   }
      //   else {
      //     this.$refs['quick-access-campaing-item'].index = this.campaings.length - 1

      //     this.$refs['quick-access-campaing-item'].href = this.campaings[this.campaings.length - 1].href
      //     this.$refs['quick-access-campaing-item'].description = this.campaings[this.campaings.length - 1].campaing_name
      //   }
      // }
      // else if (card == 'notification') {
      //   const actualIndex = this.$refs['quick-access-notification-item'].index

      //   if (actualIndex > 0) {
      //     const previousNotification = this.notifications[parseInt(actualIndex) - 1]
      //     this.$refs['quick-access-notification-item'].index = parseInt(actualIndex) - 1

      //     this.$refs['quick-access-notification-item'].description = previousNotification.notification
      //   }
      //   else {
      //     this.$refs['quick-access-notification-item'].index = this.notifications.length - 1

      //     this.$refs['quick-access-notification-item'].description = this.notifications[this.notifications.length - 1].notification
      //   }
      // }
    }
  }
}
</script>

<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-header class="header" collapse="condense">
        <div class="toolbar">
          <h1 class="header-title">Dashboard</h1>
        </div>
      </ion-header>

      <ion-content :fullscreen="true">
        <div id="container">
          <h1>Acesso Rápido</h1>
          <div class="quick-access-item-box">
            <h1>Fichas</h1>
            <img class="quick-access-next" src="../assets/navigate.svg" @click="nextCard('sheet')" />
            <img class="quick-access-previous" src="../assets/navigate.svg" @click="previousCard('sheet')" />
            <div class="quick-access-item-list">
              <div class="quick-access-item">
                <ItemComponent index="0" type="1" href="" ref="quick-access-sheet-item" />
              </div>
            </div>
          </div>
          <!-- <div class="quick-access-item-box">
            <h1>Campanhas</h1>
            <img class="quick-access-next" src="../assets/navigate.svg" />
            <img class="quick-access-previous" src="../assets/navigate.svg" />
            <div class="quick-access-item-list">
              <div class="quick-access-item">
                <ItemComponent index="0" type="2" ref="quick-access-campaing-item" />
              </div>
            </div>
          </div>
          <div class="quick-access-item-box">
            <h1>Notificações</h1>
            <img class="quick-access-next" src="../assets/navigate.svg" />
            <img class="quick-access-previous" src="../assets/navigate.svg" />
            <div class="quick-access-item-list">
              <div class="quick-access-item">
                <ItemComponent index="0" type="5" ref="quick-access-notification-item" />
              </div>
            </div>
          </div> -->
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

.quick-access-item-box {
  display: grid;
  grid-template-columns: 0.3fr 2.4fr 0.3fr;
  grid-template-rows: 0.3fr 1.7fr;
  gap: 0px 0px;
  grid-template-areas:
    "title title title"
    "previous item next";
  width: 97%;
  height: 12em;
  margin: 0;
}

.quick-access-item-box>h1 {
  grid-area: title;
  font-size: 1.5em;
  text-align: center;
}

.quick-access-item-box>.quick-access-next {
  grid-area: next;
  align-self: center;
  justify-self: center;
}

.quick-access-next {
  transform: rotate(180deg);
  margin: 0;
  padding: 0;
  height: 8em !important;
  width: 2em !important;
}

.quick-access-item-box>.quick-access-previous {
  grid-area: previous;
  align-self: center;
  justify-self: center;
}

.quick-access-previous {
  margin: 0;
  padding: 0;
  height: 8em !important;
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

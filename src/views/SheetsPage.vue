<script>
import { IonPage, IonTabs, IonRouterOutlet } from '@ionic/vue'
export default {
    async beforeMount() {
        const token = await this.$storage.get('token')

        if (token == null) {
            await this.$storage.remove('user')
            this.$router.push({ name: 'Home' })
        }
    },
    components: {
        IonPage,
        IonTabs,
        IonRouterOutlet
    }
}
</script>
<template>
    <ion-page>
        <ion-tabs>
            <ion-router-outlet></ion-router-outlet>
            <ion-header class="header" collapse="condense">
                <ion-toolbar>
                    <ion-title size="large" class="header-title">Fichas</ion-title>
                </ion-toolbar>
            </ion-header>

            <ion-content :fullscreen="true">
                <div id="container">
                    <h1>Fichas</h1>
                </div>
            </ion-content>
        </ion-tabs>
    </ion-page>
</template>
<style></style>
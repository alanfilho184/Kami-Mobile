<script>
import { IonPage, IonTabs, IonRouterOutlet } from '@ionic/vue'
export default {
    async beforeMount() {
        await this.$storage.remove('token')
        await this.$storage.remove('user')
        this.$router.push({ name: 'Home' })
    },
    watch: {
        async $route(to, from) {
            if (to.name == 'Logout') {
                await this.$storage.remove('token')
                await this.$storage.remove('user')
                this.$router.push({ name: 'Home' })
            }
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
            <div id="Logout"></div>
        </ion-tabs>
    </ion-page>
</template>
<style></style>
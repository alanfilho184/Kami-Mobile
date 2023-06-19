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
                    <ion-title size="large" class="header-title">Configurações</ion-title>
                </ion-toolbar>
            </ion-header>

            <ion-content :fullscreen="true">
                <div id="container">
                    <div class="config-container">
                        <div class="config-header">
                            <h1>Configurações</h1>
                        </div>
                        <div class="config-body">
                            <div class="config-item">
                                <label>Nome de usuário</label>
                                <input type="text" placeholder="Insira um nome de usuário" />
                                <p>Aviso</p>
                            </div>
                            <div class="config-item">
                                <label>URL para foto de perfil</label>
                                <input type="url" placeholder="Insira um URL para foto de perfil" />
                                <p>Aviso</p>
                            </div>
                            <div class="config-item">
                                <label>Nova senha</label>
                                <input type="text" placeholder="Insira uma senha" />
                                <p>Aviso</p>
                            </div>
                            <div class="config-item">
                                <label>Confirmar a nova senha</label>
                                <input type="text" placeholder="Confirme sua nova senha" />
                                <p>Aviso</p>
                            </div>
                        </div>
                        <div class="config-controls">
                            <button class="config-button">Salvar</button>
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
    justify-content: center;
    align-items: center;
    height: 100%;
}

.config-container {
    width: 85%;
    height: max-content;
    border-radius: 10px;
    background-color: var(--kami-primary);
}

.config-header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
    border-bottom: 2px solid var(--kami-background);
}

.config-header h1 {
    font-size: 1.5rem;
    font-weight: 700;
}

.config-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.config-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 90%;
    margin: 5px;
}

.config-item label {
    font-size: 1rem;
    font-weight: 500;
}

.config-item input {
    width: 90%;
    height: 40px;
    margin: 5px 0;
    padding: 0 10px;
    border: 2px solid var(--kami-background);
    background-color: var(--kami-text);
    color: var(--kami-background);
    border-radius: 5px;
    outline: none;
}

.config-item p {
    display: none;
    font-size: 0.8rem;
    font-weight: 500;
    color: #f00;
    margin: 0;
}

.config-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
}

.config-button {
    width: 80%;
    height: 40px;
    margin: 10px 0px;
    border: none;
    background-color: var(--kami-background);
    color: var(--kami-text);
    border-radius: 5px;
    outline: none;
    font-size: 1em;
    font-weight: bold;
}
</style>
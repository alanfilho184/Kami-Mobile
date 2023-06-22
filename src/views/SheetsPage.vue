
<script>
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonTabs, IonRouterOutlet } from '@ionic/vue';
import ItemComponent from '../components/ItemComponent.vue'
import LoadWheel from '../components/LoadWheel.vue'

export default {
    components: {
        IonContent,
        IonHeader,
        IonPage,
        IonTitle,
        IonToolbar,
        IonTabs,
        IonRouterOutlet,
        ItemComponent,
        LoadWheel
    },
    data() {
        return {
            sheets: [],
            sheetsLoaded: false,
            username: '',
            createSheet: false,
            creatingSheet: false,
            validationErrors: {
                sheetName: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        tooShort: 'O nome da ficha deve ter no mínimo 3 caracteres',
                        tooLong: 'O nome da ficha deve ter no máximo 32 caracteres',
                        invalidChars: 'O nome de usuário deve conter apenas letras, números e _',
                    },
                },
            },
            createError: {
                state: false,
                errors: []
            },
            createSuccess: false,
            createdSheetName: ''
        }
    },
    async beforeMount() {
        const token = await this.$storage.get('token')

        if (token == null) {
            await this.$storage.remove('user')
            this.$router.push({ name: 'Home' })
        }

        this.$storage.get('user').then((user) => {
            this.username = user.username
        })

        fetch(`http://localhost:3001/sheet/all`, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => res.json())
            .then(data => {
                this.sheets = data.sheets
                this.sheetsLoaded = true
            })
    },
    methods: {
        nextCard(card) {
            if (card == 'sheet') {
                const actualIndex = this.$refs['sheet-access-sheet-item'].index

                if (actualIndex < this.sheets.length - 1) {
                    const nextSheet = this.sheets[parseInt(actualIndex) + 1]
                    this.$refs['sheet-access-sheet-item'].index = parseInt(actualIndex) + 1

                    this.$refs['sheet-access-sheet-item'].description = nextSheet.sheet_name
                    this.$refs['sheet-access-sheet-item'].href = `fichas/${this.username}/${nextSheet.sheet_name}`
                }
                else {
                    this.$refs['sheet-access-sheet-item'].index = 0

                    this.$refs['sheet-access-sheet-item'].href = `fichas/${this.username}/${this.sheets[0].sheet_name}`
                    this.$refs['sheet-access-sheet-item'].description = this.sheets[0].sheet_name
                }
            }
        },
        previousCard(card) {
            if (card == 'sheet') {
                const actualIndex = this.$refs['sheet-access-sheet-item'].index

                if (actualIndex > 0) {
                    const previousSheet = this.sheets[parseInt(actualIndex) - 1]
                    this.$refs['sheet-access-sheet-item'].index = parseInt(actualIndex) - 1

                    this.$refs['sheet-access-sheet-item'].description = previousSheet.sheet_name
                    this.$refs['sheet-access-sheet-item'].href = `fichas/${this.username}/${previousSheet.sheet_name}`
                }
                else {
                    this.$refs['sheet-access-sheet-item'].index = this.sheets.length - 1

                    this.$refs['sheet-access-sheet-item'].href = `fichas/${this.username}/${this.sheets[this.sheets.length - 1].sheet_name}`
                    this.$refs['sheet-access-sheet-item'].description = this.sheets[this.sheets.length - 1].sheet_name
                }
            }
        },
        async createNewSheet() {
            if (!this.validationErrors.sheetName.state) {
                const sheetName = this.$refs['create-sheet-name'].value.trim()
                this.creatingSheet = true

                if (sheetName != '') {
                    const token = await this.$storage.get('token')

                    if (token == null) {
                        await this.$storage.remove('user')
                        this.$router.push({ name: 'Home' })
                    }

                    const res = await fetch(`http://localhost:3001/sheet/create`, {
                        method: 'POST',
                        headers: {
                            'Authorization': token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            sheetName: sheetName
                        })
                    })

                    if (res.status == 201) {
                        this.creatingSheet = false
                        this.sheets.push({
                            sheet_name: sheetName
                        })

                        this.createdSheetName = sheetName

                        this.createSheet = false
                        this.$router.push(`fichas/${this.username}/${sheetName}`)
                    }
                    else if (res.status == 400) {
                        const data = await res.json()

                        this.createError.errors = data.errors
                        this.createError.state = true
                        this.creatingSheet = false

                        this.$refs['create-sheet-name'].style.border = '2px solid red'
                    }
                    else {
                        this.createError.errors = [{ message: 'Erro desconhecido, tente novamente mais tarde' }]
                        this.createError.state = true
                        this.creatingSheet = false
                    }
                }
                else {
                    this.createError.errors = [{ message: 'O nome da ficha não pode ser vazio' }]
                    this.createError.state = true
                    this.creatingSheet = false
                }
            }
        },
        validateSheetName() {
            this.$refs['create-sheet-name'].value = this.$refs['create-sheet-name'].value.trim()
            const sheetName = this.$refs['create-sheet-name'].value

            if (sheetName.length < 3) {
                this.validationErrors.sheetName.state = true
                this.validationErrors.sheetName.actualMessage = this.validationErrors.sheetName.messages.tooShort
                this.$refs['create-sheet-name'].style.border = '2px solid red'
            }
            else if (sheetName.length > 32) {
                this.validationErrors.sheetName.state = true
                this.validationErrors.sheetName.actualMessage = this.validationErrors.sheetName.messages.tooLong
                this.$refs['create-sheet-name'].style.border = '2px solid red'
            }
            else if (!sheetName.match(/^[a-zA-Z0-9_]+$/)) {
                this.validationErrors.sheetName.state = true
                this.validationErrors.sheetName.actualMessage = this.validationErrors.sheetName.messages.invalidChars
                this.$refs['create-sheet-name'].style.border = '2px solid red'
            }
            else {
                this.$refs['create-sheet-name'].style.border = '2px solid var(--background)'
                this.validationErrors.sheetName.actualMessage = ''
                this.validationErrors.sheetName.state = false
            }
        },
    },
    watch: {
        sheetsLoaded() {
            if (this.sheetsLoaded) {
                setTimeout(() => {
                    if (this.sheets.length > 0) {
                        try {
                            this.$refs['sheet-access-sheet-item'].href = `fichas/${this.username}/${this.sheets[0].sheet_name}`
                            this.$refs['sheet-access-sheet-item'].description = this.sheets[0].sheet_name
                            this.$refs['sheet-access-sheet-item'].index = 0
                        }
                        catch (err) {
                            err
                        }
                    }
                }, 50)
            }
        },
        createSheet() {
            if (!this.createSheet) {
                setTimeout(() => {
                    if (this.sheets.length > 0) {
                        try {
                            this.$refs['sheet-access-sheet-item'].href = `fichas/${this.username}/${this.sheets[0].sheet_name}`
                            this.$refs['sheet-access-sheet-item'].description = this.sheets[0].sheet_name
                            this.$refs['sheet-access-sheet-item'].index = 0
                        }
                        catch (err) {
                            setTimeout(() => {
                                this.$refs['sheet-access-sheet-item'].href = `fichas/${this.username}/${this.sheets[0].sheet_name}`
                                this.$refs['sheet-access-sheet-item'].description = this.sheets[0].sheet_name
                                this.$refs['sheet-access-sheet-item'].index = 0
                            }, 1000)
                        }
                    }
                }, 50)
            }
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
                    <ion-title size="large" class="header-title">Fichas</ion-title>
                </ion-toolbar>
            </ion-header>

            <ion-content :fullscreen="true">
                <div id="container">
                    <div class="sheet-access-item-box" v-if="!createSheet && sheetsLoaded && sheets.length > 0">
                        <div class="sheet-access-item-box-header">
                            <h1>Suas fichas</h1>
                            <img src="../assets/add.svg" @click="createSheet = true" />
                        </div>
                        <img class="sheet-access-next" src="../assets/navigate.svg" @click="nextCard('sheet')" />
                        <img class="sheet-access-previous" src="../assets/navigate.svg" @click="previousCard('sheet')" />
                        <div class="sheet-access-item-list">
                            <div class="sheet-access-item">
                                <ItemComponent index="0" type="1" description="Carregando..." href="Sheet"
                                    ref="sheet-access-sheet-item" />
                            </div>
                        </div>
                    </div>
                    <div class="sheet-access-empty" v-else-if="!createSheet && sheetsLoaded && sheets.length == 0">
                        <h1>Nenhuma ficha criada</h1>
                        <button>Criar nova ficha</button>
                    </div>
                    <div class="center-loading" v-else-if="!createSheet && !sheetsLoaded">
                        <LoadWheel />
                    </div>
                    <div class="create-sheet" v-if="createSheet">
                        <div class="create-sheet-box">
                            <div class="create-sheet-box-header"
                                v-if="!creatingSheet && !createError.state && !createSuccess">
                                <h1>Criar nova ficha</h1>
                            </div>
                            <div class="create-sheet-box-header"
                                v-else-if="creatingSheet && !createError.state && !createSucess">
                                <h1>Criando ficha...</h1>
                                <LoadWheel class="loading secondary-loading" />
                            </div>
                            <div class="create-sheet-box-header"
                                v-else-if="!creatingSheet && createError.state && !createSuccess">
                                <h1 v-for="error in createError.errors" :key="error">{{ error.message }}</h1>
                                <button @click="createError.state = false">Ok</button>
                            </div>
                            <div class="create-sheet-box-header"
                                v-else-if="!creatingSheet && !createError.state && createSuccess">
                                <h1>Ficha criada com sucesso!</h1>
                                <button @click="$router.push(`fichas/${username}/${createdSheetName}`)">Ok</button>
                            </div>
                            <div class="create-sheet-box-body"
                                v-if="!creatingSheet && !createError.state && !createSuccess">
                                <div class="create-sheet-box-item">
                                    <label>Nome da ficha</label>
                                    <input type="text" id="sheetName" placeholder="Insira o nome da nova ficha"
                                        ref="create-sheet-name" @keyup="validateSheetName()"
                                        @change="validateSheetName()" />
                                    <p v-if="validationErrors.sheetName.state">
                                        {{ validationErrors.sheetName.actualMessage }}
                                    </p>
                                </div>
                                <div class="create-sheet-box-controls">
                                    <button @click="createSheet = false">Cancelar</button>
                                    <button @click="createNewSheet()">Criar</button>
                                </div>
                            </div>
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

.sheet-access-item-box {
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

.sheet-access-item-box-header {
    grid-area: title;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-size: 1em;
    text-align: center;
}

.sheet-access-item-box-header img {
    width: 50px !important;
    height: 50px !important;
    margin: 0;
    padding: 0;
}

.sheet-access-item-box>.sheet-access-next {
    grid-area: next;
    align-self: center;
    justify-self: center;
}

.sheet-access-next {
    transform: rotate(180deg);
    margin: 0;
    padding: 0;
    height: 8em !important;
    width: 2em !important;
}

.sheet-access-item-box>.sheet-access-previous {
    grid-area: previous;
    align-self: center;
    justify-self: center;
}

.sheet-access-previous {
    margin: 0;
    padding: 0;
    height: 8em !important;
    width: 2em !important;
}

.sheet-access-item-list {
    grid-area: item;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.center-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 90vh;
    margin: 0;
}

.loading {
    width: 3em;
    height: 3em;
}

.sheet-access-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 95%;
    height: 90vh;
    margin: 0;
}

.sheet-access-empty h1 {
    font-size: 1.5em;
    text-align: center;
}

.sheet-access-empty button {
    width: 10em;
    height: 2em;
    border: none;
    border-radius: 0.5em;
    background-color: var(--kami-primary);
    color: var(--kami-text);
    font-size: 1em;
    font-weight: bold;
    margin: 0.5em 0;
}

.create-sheet {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 95%;
    margin: 0;
}

.create-sheet-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 20px;
    background-color: var(--kami-primary);
    border-radius: 10px;
}

.create-sheet-box-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 0;
    padding: 0;
    border-bottom: 2px solid var(--kami-background);
    font-size: 0.8em;
    text-align: center;
}

.create-sheet-box-header button {
    width: 10em;
    height: 2em;
    border: none;
    border-radius: 0.5em;
    background-color: var(--kami-background);
    color: var(--kami-text);
    font-size: 1em;
    font-weight: bold;
    margin: 0.5em 0;
}

.create-sheet-box-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 0;
    padding: 0;
}

.create-sheet-box-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 95%;
    margin: 5px;
}

.create-sheet-box-item label {
    font-size: 1em;
    font-weight: 700;
}

.create-sheet-box-item input {
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

.create-sheet-box-item p {
    font-size: 0.8rem;
    font-weight: 500;
    color: #f00;
    margin: 0;
}

.create-sheet-box-controls {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 95%;
    margin: 0;
    margin-bottom: 20px;
}

.create-sheet-box-controls button {
    width: 10em;
    height: 2em;
    border: none;
    border-radius: 0.5em;
    background-color: var(--kami-background);
    color: var(--kami-text);
    font-size: 1em;
    font-weight: bold;
    margin: 0.5em 0.5em;
}

.create-sheet-box-controls button:first-child {
    background-color: var(--kami-primary);
    border: 2px solid var(--kami-background);
}
</style>

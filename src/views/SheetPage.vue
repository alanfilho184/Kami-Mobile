<script>
import { createVNode, render } from 'vue'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonTabs, IonRouterOutlet } from '@ionic/vue';
import TextComponent from '../components/sheet/TextComponent.vue'
import NumberComponent from '../components/sheet/NumberComponent.vue'
import ImageComponent from '../components/sheet/ImageComponent.vue'
import ListComponent from '../components/sheet/ListComponent.vue'
import BarComponent from '../components/sheet/BarComponent.vue'

export default {
    components: {
        IonContent,
        IonHeader,
        IonPage,
        IonTitle,
        IonToolbar,
        IonTabs,
        IonRouterOutlet,
        TextComponent,
        NumberComponent,
        ImageComponent,
        ListComponent,
        BarComponent
    },
    data() {
        return {
            sheetName: '',
            username: '',
            sheet: {

            },
            sheetLoaded: false,
            actualSectionIndex: 0
        }
    },
    async beforeMount() {
        const token = await this.$storage.get('token')

        if (token == null) {
            await this.$storage.remove('user')
            this.$router.push({ name: 'Home' })
        }

        this.username = this.$route.params.user
        this.sheetName = this.$route.params.sheet

        fetch(`http://localhost:3001/sheet/one?username=${this.username}&sheetName=${this.sheetName}`, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.sheet.legacy) {
                    const attributes = {
                        sections: [{
                            name: 'Informações',
                            position: 0,
                            type: 0,
                            attributes: []
                        }]
                    }

                    Object.keys(data.sheet.attributes).forEach((key, index) => {
                        if (key == 'imagem') {
                            attributes.sections[0].attributes.push({
                                value: data.sheet.attributes[key],
                                name: key,
                                type: 2,
                                position: index
                            })
                            return
                        }
                        else if (data.sheet.attributes[key].match(/^[0-9]{1,}(?: [0-9]+){0,}$/gim)) {
                            attributes.sections[0].attributes.push({
                                value: data.sheet.attributes[key],
                                name: key,
                                type: 1,
                                position: index
                            })
                            return
                        }
                        else {
                            attributes.sections[0].attributes.push({
                                value: data.sheet.attributes[key],
                                name: key,
                                type: 0,
                                position: index
                            })
                        }
                    })

                    this.sheet = {
                        ...data.sheet,
                        attributes: attributes
                    }
                }
                else {
                    this.sheet = data.sheet
                }

                console.log(this.sheet)

                this.sheetLoaded = true

                // this.sheet.attributes = {
                //     sections: [{
                //         name: 'Info',
                //         position: 0,
                //         type: 0,
                //         attributes: [
                //             {
                //                 value: 'testeV1',
                //                 name: 'testeT1',
                //                 type: 0,
                //                 position: 0
                //             }
                //         ]
                //     },
                //     {
                //         name: 'Status',
                //         position: 0,
                //         type: 0,
                //         attributes: [
                //             {
                //                 value: 20,
                //                 name: 'testeT2',
                //                 type: 1,
                //                 position: 0
                //             }
                //         ]

                //     },
                //     {
                //         name: 'Imagem',
                //         position: 0,
                //         type: 0,
                //         attributes: [
                //             {
                //                 value: 'https://cdn.discordapp.com/attachments/836291199140102195/1094793290387292180/morte.jpg',
                //                 name: 'testeT3',
                //                 type: 2,
                //                 position: 0
                //             }
                //         ]
                //     }
                //     ]
                // }
            })
    },
    methods: {
        nextSection() {
            const actualIndex = this.$refs['section'].index

            if (actualIndex < this.sheet.attributes.sections.length - 1) {
                const nextSection = this.sheet.attributes.sections[parseInt(actualIndex) + 1]
                this.$refs['section'].index = parseInt(actualIndex) + 1
                this.$refs['section-title'].innerText = nextSection.name
                this.actualSectionIndex = parseInt(actualIndex) + 1
            }
            else {
                this.$refs['section'].index = 0
                this.$refs['section-title'].innerText = this.sheet.attributes.sections[0].name
                this.actualSectionIndex = 0
            }
        },
        previousSection() {
            const actualIndex = this.$refs['section'].index

            if (actualIndex > 0) {
                const previousSection = this.sheet.attributes.sections[parseInt(actualIndex) - 1]
                this.$refs['section'].index = parseInt(actualIndex) - 1
                this.$refs['section-title'].innerText = previousSection.name
                this.actualSectionIndex = parseInt(actualIndex) - 1
            }
            else {
                this.$refs['section'].index = this.sheet.attributes.sections.length - 1
                this.$refs['section-title'].innerText = this.sheet.attributes.sections[this.sheet.attributes.sections.length - 1].name
                this.actualSectionIndex = this.sheet.attributes.sections.length - 1
            }
        },
        loadAttributes() {
            render(null, this.$refs['sheet-body']);

            const components = this.sheet.attributes.sections[this.actualSectionIndex].attributes.map(attribute => {
                let component;

                if (attribute.type === 0) {
                    component = createVNode(TextComponent, {
                        title: attribute.name,
                        value: attribute.value
                    });
                } else if (attribute.type === 1) {
                    component = createVNode(NumberComponent, {
                        title: attribute.name,
                        value: attribute.value
                    });
                } else if (attribute.type === 2) {
                    component = createVNode(ImageComponent, {
                        value: attribute.value
                    });
                }

                return component;
            });

            render(createVNode('div', { class: 'sheet-body-components' }, components), this.$refs['sheet-body']);
        }
    },
    watch: {
        sheetLoaded: function (val) {
            if (val) {
                this.$refs['section-title'].innerText = this.sheet.attributes.sections[0].name
                this.$refs['section'].index = 0

                // this.loadAttributes()
            }
        },
        actualSectionIndex: function (val) {
            // this.loadAttributes()
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
                    <ion-title size="large" class="header-title">Ficha: {{ sheetName }}</ion-title>
                </ion-toolbar>
            </ion-header>

            <ion-content :fullscreen="true">
                <div id="container">
                    <div class="sheet-container">
                        <div class="sheet-section" index="0" ref="section">
                            <img src="../assets/navigate.svg" class="previous-section" @click="previousSection()" />
                            <h1 class="section-title" ref="section-title">Carregando...</h1>
                            <img src="../assets/navigate.svg" class="next-section" @click="nextSection()" />
                        </div>
                        <div class="sheet-body" ref="sheet-body">
                            <div class="sheet-body-components">
                                <ImageComponent value="https://cdn.discordapp.com/attachments/836291199140102195/1121805691582169259/favicon.png">
                                </ImageComponent>
                                <TextComponent title="Nome" value="Alan">
                                </TextComponent>
                                <NumberComponent title="Idade" value="19">
                                </NumberComponent>
                                <ListComponent title="Equipamentos" value='{"items":[{"name": "Notebook", "quantity":1}, {"name": "Smartphone", "quantity": 1}]}'>
                                </ListComponent>
                                <BarComponent title="Sanidade" value='{"actual":35,"max":100}'>
                                </BarComponent>
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

.sheet-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    background-color: var(--kami-background);
    width: 100%;
    height: fit-content;
    margin: 0;
}

.sheet-section {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: 3em;
    background-color: var(--kami-primary);
    margin: 0;
    margin-bottom: 5px;
}

.previous-section,
.next-section {
    width: 1.5em !important;
    height: 3em !important;
    margin: 0;
    filter: var(--kami-background-filter);
}

.next-section {
    transform: rotate(180deg);
}

.section-title {
    width: 80%;
    text-align: center;
    font-size: 1.2em;
    margin: 0px 10px
}

/* sheet-body is a grid with 2 columns with 50/50 size and infinite rows  */
.sheet-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    width: 100%;
    height: fit-content;
}

.sheet-body-components {
    display: grid !important;
    grid-template-columns: 49% 49% !important;
    grid-auto-rows: minmax(1em, auto) !important;
    gap: 5px;
    width: 100% !important;
    height: fit-content !important;
    margin: 0;
}
</style>

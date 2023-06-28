<script>
import { createVNode, render } from 'vue'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonTabs, IonRouterOutlet } from '@ionic/vue';
import TextComponent from '../components/sheet/TextComponent.vue'
import NumberComponent from '../components/sheet/NumberComponent.vue'
import ImageComponent from '../components/sheet/ImageComponent.vue'
import ListComponent from '../components/sheet/ListComponent.vue'
import BarComponent from '../components/sheet/BarComponent.vue'
import LoadWheel from '../components/LoadWheel.vue'
import { eventEmitter } from '../utils/EventEmitter.js'

const componentsList = [TextComponent, NumberComponent, ImageComponent, ListComponent, BarComponent]

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
        BarComponent,
        LoadWheel
    },
    data() {
        return {
            sheetName: '',
            username: '',
            sheet: {},
            sheetLoaded: false,
            actualSectionIndex: 0,
            sectionExpanded: false,
            validationErrors: {
                section: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        empty: 'O nome da seção não pode ser vazio',
                        length: 'O nome da seção deve ter entre 2 e 20 caracteres',
                        invalid: 'O nome da seção deve conter apenas letras e números',
                        alreadyExists: 'Já existe uma seção com esse nome'
                    }
                },
                newSection: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        empty: 'O nome da seção não pode ser vazio',
                        length: 'O nome da seção deve ter entre 2 e 20 caracteres',
                        invalid: 'O nome da seção deve conter apenas letras e números',
                        alreadyExists: 'Já existe uma seção com esse nome'
                    }
                },
                newComponentTitle: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        empty: 'O nome do atributo não pode ser vazio',
                        tooLong: 'O nome do atributo não pode ter mais de 32 caracteres',
                        invalidChars: 'O nome do atributo não pode conter caracteres especiais',
                        alreadyExists: 'O nome do atributo já existe',
                    }
                },
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
            actualSectionName: 'Carregando...',
            confirmSectionRemove: false,
            createNewSection: false,
            newSectionName: '',
            addNewComponent: false,
            newComponent: {
                type: 0,
                title: '',
                value: ''
            },
            sheetConfigMenu: false,
            confirmSheetRemove: false,
            componentsErrorState: {},
            sheetValidationErrors: [],
            sheetSavedSuccess: false,
            savingSheet: false
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
                if (data.error) {
                    this.$router.push({ name: 'Sheets' })
                }
                else {
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
                            else if (data.sheet.attributes[key].match(/^[0-9]{1,}(?:\/[0-9]+){0,}$/gim)) {
                                attributes.sections[0].attributes.push({
                                    value: JSON.stringify({
                                        actual: parseInt(data.sheet.attributes[key].split('/')[0]),
                                        max: parseInt(data.sheet.attributes[key].split('/')[1])
                                    }),
                                    name: key,
                                    type: 4,
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
                        if (Object.keys(data.sheet.attributes).length == 0) {
                            data.sheet.attributes = {
                                sections: [{
                                    name: 'Informações',
                                    position: 0,
                                    type: 0,
                                    attributes: []
                                }]
                            }
                        }
                        else if (data.sheet.attributes.sections.length == 0) {
                            data.sheet.attributes.sections.push({
                                name: 'Informações',
                                position: 0,
                                type: 0,
                                attributes: []
                            })
                        }

                        this.sheet = data.sheet
                    }

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

                    this.sheetLoaded = true
                }
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

            this.actualSectionName = this.sheet.attributes.sections[this.actualSectionIndex].name
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

            this.actualSectionName = this.sheet.attributes.sections[this.actualSectionIndex].name
        },
        loadAttributes(triggerEditMode) {
            render(null, this.$refs['sheet-body']);
            this.$refs['sheet-body'].innerHTML = ''

            const components = this.sheet.attributes.sections[this.actualSectionIndex].attributes.map((attribute, index) => {
                if (typeof attribute.value == 'object') {
                    attribute.value = JSON.stringify(attribute.value)
                }

                let component
                if (triggerEditMode && (triggerEditMode - 1) == index) {
                    component = createVNode(componentsList[attribute.type], {
                        title: attribute.type == 2 ? undefined : attribute.name,
                        value: attribute.value,
                        position: `${this.actualSectionIndex}-${index}`,
                        editMode: 'true'
                    })
                }
                else {
                    component = createVNode(componentsList[attribute.type], {
                        title: attribute.type == 2 ? undefined : attribute.name,
                        value: attribute.value,
                        position: `${this.actualSectionIndex}-${index}`
                    })
                }

                this.componentsErrorState[`${this.actualSectionIndex}-${index}`] = {
                    state: false,
                    errors: {}
                }

                return component;
            });

            render(createVNode('div', { class: 'sheet-body-components' }, components), this.$refs['sheet-body']);
        },
        validateSection() {
            const sectionName = this.$refs['section-edit-name'].value

            if (sectionName.length == 0) {
                this.validationErrors.section.state = true
                this.validationErrors.section.actualMessage = this.validationErrors.section.messages.empty
                return
            }
            else if (sectionName.length < 2 || sectionName.length > 20) {
                this.validationErrors.section.state = true
                this.validationErrors.section.actualMessage = this.validationErrors.section.messages.length
                return
            }
            else if (!sectionName.match(/^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ+#@$%&*{}()/.,;:?!'"-_| ]{1,}(?: [a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ+#@$%&*{}()/.,;:?!'"-_| ]+){0,}$/gim)) {
                this.validationErrors.section.state = true
                this.validationErrors.section.actualMessage = this.validationErrors.section.messages.invalid
                return
            }
            else if (this.sheet.attributes.sections.find(section => section.name == sectionName && section.position != this.actualSectionIndex)) {
                this.validationErrors.section.state = true
                this.validationErrors.section.actualMessage = this.validationErrors.section.messages.alreadyExists
                return
            }
            else {
                this.validationErrors.section.state = false
                this.validationErrors.section.actualMessage = ''

                this.sheet.attributes.sections[this.actualSectionIndex].name = sectionName
            }
        },
        removeActualSection() {
            if (this.sheet.attributes.sections.length == 1) {
                this.sheet.attributes.sections[0].name = 'Informações'
                this.sheet.attributes.sections[0].attributes = []

                this.nextSection()
                this.loadAttributes()
            }
            else {
                this.sheet.attributes.sections.splice(this.actualSectionIndex, 1)

                this.nextSection()
                this.loadAttributes()
            }
        },
        validateNewSection() {
            const sectionName = this.$refs['section-create-name'].value

            if (sectionName.length == 0) {
                this.validationErrors.newSection.state = true
                this.validationErrors.newSection.actualMessage = this.validationErrors.newSection.messages.empty
                return
            }
            else if (sectionName.length < 2 || sectionName.length > 20) {
                this.validationErrors.newSection.state = true
                this.validationErrors.newSection.actualMessage = this.validationErrors.newSection.messages.length
                return
            }
            else if (!sectionName.match(/^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ+#@$%&*{}()/.,;:?!'"-_| ]{1,}(?: [a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ+#@$%&*{}()/.,;:?!'"-_| ]+){0,}$/gim)) {
                this.validationErrors.newSection.state = true
                this.validationErrors.newSection.actualMessage = this.validationErrors.newSection.messages.invalid
                return
            }
            else if (this.sheet.attributes.sections.find(section => section.name == sectionName)) {
                this.validationErrors.newSection.state = true
                this.validationErrors.newSection.actualMessage = this.validationErrors.newSection.messages.alreadyExists
                return
            }
            else {
                this.validationErrors.newSection.state = false
                this.validationErrors.newSection.actualMessage = ''
            }
        },
        createSection() {
            if (!this.validationErrors.newSection.state && this.$refs['section-create-name'].value.length > 1) {
                const sectionName = this.$refs['section-create-name'].value

                this.sheet.attributes.sections.push({
                    name: sectionName,
                    position: this.sheet.attributes.sections.length,
                    type: 0,
                    attributes: []
                })

                this.createNewSection = false
                this.nextSection()
                this.loadAttributes()
            }
        },
        validateComponentTitle() {
            const componentTitle = this.$refs['new-component-title'].value

            if (componentTitle.length == 0) {
                this.validationErrors.newComponentTitle.state = true
                this.validationErrors.newComponentTitle.actualMessage = this.validationErrors.newComponentTitle.messages.empty
                return
            }
            else if (componentTitle.length > 32) {
                this.validationErrors.newComponentTitle.state = true
                this.validationErrors.newComponentTitle.actualMessage = this.validationErrors.newComponentTitle.messages.tooLong
                return
            }
            else if (!componentTitle.match(/^[a-zA-Z0-9 ]{1,}(?: [a-zA-Z0-9 ]+){0,}$/gim)) {
                this.validationErrors.newComponentTitle.state = true
                this.validationErrors.newComponentTitle.actualMessage = this.validationErrors.newComponentTitle.messages.invalidChars
                return
            }
            else if (this.sheet.attributes.sections[this.actualSectionIndex].attributes.find(attribute => attribute.name == componentTitle)) {
                this.validationErrors.newComponentTitle.state = true
                this.validationErrors.newComponentTitle.actualMessage = this.validationErrors.newComponentTitle.messages.alreadyExists
                return
            }
            else {
                this.validationErrors.newComponentTitle.state = false
                this.validationErrors.newComponentTitle.actualMessage = ''
            }
        },
        createNewComponent() {
            if (this.newComponent.type != 2) {
                if (!this.validationErrors.newComponentTitle.state && this.$refs['new-component-title'].value.length > 1) {
                    const componentTitle = this.$refs['new-component-title'].value

                    this.sheet.attributes.sections[this.actualSectionIndex].attributes.push({
                        value: '',
                        name: componentTitle,
                        type: this.newComponent.type,
                        position: this.sheet.attributes.sections[this.actualSectionIndex].attributes.length
                    })

                    this.addNewComponent = false
                    this.loadAttributes(this.sheet.attributes.sections[this.actualSectionIndex].attributes.length)
                }
            }
            else {
                this.sheet.attributes.sections[this.actualSectionIndex].attributes.push({
                    value: '',
                    name: `Imagem-${this.sheet.attributes.sections[this.actualSectionIndex].attributes.length}`,
                    type: this.newComponent.type,
                    position: this.sheet.attributes.sections[this.actualSectionIndex].attributes.length
                })

                this.addNewComponent = false
                this.loadAttributes(this.sheet.attributes.sections[this.actualSectionIndex].attributes.length)
            }

            this.newComponent = {
                type: 0,
                title: '',
                value: ''
            }
        },
        validateSheetName() {
            const sheetName = this.$refs['sheet-name'].value

            if (sheetName.length < 3) {
                this.validationErrors.sheetName.state = true
                this.validationErrors.sheetName.actualMessage = this.validationErrors.sheetName.messages.tooShort
                return
            }
            else if (sheetName.length > 32) {
                this.validationErrors.sheetName.state = true
                this.validationErrors.sheetName.actualMessage = this.validationErrors.sheetName.messages.tooLong
                return
            }
            else if (!sheetName.match(/^[a-zA-Z0-9_]{1,}(?: [a-zA-Z0-9_]+){0,}$/gim)) {
                this.validationErrors.sheetName.state = true
                this.validationErrors.sheetName.actualMessage = this.validationErrors.sheetName.messages.invalidChars
                return
            }
            else {
                this.validationErrors.sheetName.state = false
                this.validationErrors.sheetName.actualMessage = ''
            }
        },
        async removeSheet() {
            const res = await fetch(`http://localhost:3001/sheet/delete?id=${this.sheet.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': await this.$storage.get('token')
                },

            })

            if (res.status == 200) {
                this.$router.push({ name: 'Sheets' })
            }
        },
        async saveSheet() {
            const errors = []
            if (this.validationErrors.sheetName.state) {
                errors.push({
                    type: 'sheetName',
                    message: this.validationErrors.sheetName.actualMessage
                })
            }

            if (this.validationErrors.section.state) {
                errors.push({
                    type: 'section',
                    message: this.validationErrors.section.actualMessage
                })
            }

            const editedComponents = {}

            Object.keys(this.componentsErrorState).forEach((key) => {
                if (this.componentsErrorState[key].state) {
                    Object.keys(this.componentsErrorState[key]).forEach((errorKey) => {
                        if (errorKey != 'state') {
                            errors.push({
                                type: 'component',
                                position: key,
                                message: this.componentsErrorState[key][errorKey]
                            })
                        }
                    })
                }
                else {
                    const sectionIndex = key.split('-')[0]
                    const componentIndex = key.split('-')[1]

                    if (this.sheet.attributes.sections[sectionIndex].attributes[componentIndex].type == 1) {
                        editedComponents[key] = {
                            type: 'number',
                            value: this.sheet.attributes.sections[sectionIndex].attributes[componentIndex].value
                        }
                    }
                    else if (this.sheet.attributes.sections[sectionIndex].attributes[componentIndex].type == 4) {
                        editedComponents[key] = {
                            type: 'bar',
                            value: JSON.stringify(this.sheet.attributes.sections[sectionIndex].attributes[componentIndex].value)
                        }
                    }
                    else {
                        editedComponents[key] = {
                            type: 'text',
                            value: this.sheet.attributes.sections[sectionIndex].attributes[componentIndex].value
                        }
                    }
                }
            })

            if (errors.length > 0) {
                errors.forEach(error => {
                    if (error.type == 'sheetName') {
                        this.sheetValidationErrors.push('Nome da ficha inválido')
                    }
                    else if (error.type == 'component') {
                        const sectionIndex = error.position.split('-')[0]
                        const componentIndex = error.position.split('-')[1]

                        this.sheet.attributes.sections[sectionIndex].attributes[componentIndex].name

                        Object.keys(error.message).forEach(errorKey => {
                            if (error.message[errorKey].state) {
                                this.sheetValidationErrors.push(`No componente "${this.sheet.attributes.sections[sectionIndex].attributes[componentIndex].name}": ${error.message[errorKey].actualMessage}`)
                            }
                        })
                    }
                    else if (error.type == 'section') {
                        this.sheetValidationErrors.push(`Em uma seção da ficha: ${error.message}`)
                    }
                })

                return
            }
            else {
                this.savingSheet = true
                const updatedSheet = {
                    ...this.sheet,
                    sheet_name: this.sheetName,
                    attributes: {
                        sections: this.sheet.attributes.sections.map((section) => {
                            return {
                                ...section,
                                attributes: section.attributes.map((attribute) => {
                                    if (attribute.type == 1) {
                                        return {
                                            ...attribute,
                                            value: parseInt(attribute.value)
                                        }
                                    }
                                    else if (attribute.type == 4) {
                                        return {
                                            ...attribute,
                                            value: JSON.stringify({
                                                actual: attribute.value.actual,
                                                max: attribute.value.max,
                                                min: attribute.value.min,
                                                step: attribute.value.step
                                            })
                                        }
                                    }
                                    else {
                                        return attribute
                                    }
                                })
                            }
                        })
                    },
                    legacy: false
                }

                const res = await fetch(`http://localhost:3001/sheet/update`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': await this.$storage.get('token')
                    },
                    body: JSON.stringify(updatedSheet)
                })

                if (res.status == 200) {
                    if (this.sheet.sheet_name != this.sheetName) {
                        this.$router.push({ name: 'Sheet', params: { user: this.username, sheet: this.sheetName } })
                    }

                    this.sheetSavedSuccess = true
                }

                this.savingSheet = false
            }
        },
        reDefinePosition() {
            this.sheet.attributes.sections.forEach((section, sectionIndex) => {
                section.position = sectionIndex

                section.attributes.forEach((attribute, attributeIndex) => {
                    attribute.position = attributeIndex
                })
            })

            this.componentsErrorState = {}

            this.loadAttributes()
        }
    },
    watch: {
        sheetLoaded: function (val) {
            if (val) {
                this.actualSectionIndex = 0
                this.actualSectionName = this.sheet.attributes.sections[0].name

                this.loadAttributes()
            }
        },
        actualSectionIndex: function () {
            this.loadAttributes()
        },

    },
    mounted() {
        eventEmitter.on('remove-component', (component) => {
            const sectionIndex = component.getAttribute('position').split('-')[0]
            const componentIndex = component.getAttribute('position').split('-')[1]

            this.sheet.attributes.sections[sectionIndex].attributes.splice(componentIndex, 1)

            delete this.componentsErrorState[`${sectionIndex}-${componentIndex}`]

            this.reDefinePosition()
        })

        eventEmitter.on('update-component', (component, title, value) => {
            if (component.classList[0] == 'image-component-wrapper') {
                if (value) {
                    const sectionIndex = component.getAttribute('position').split('-')[0]
                    const componentIndex = component.getAttribute('position').split('-')[1]

                    this.sheet.attributes.sections[sectionIndex].attributes[componentIndex].name = title
                    this.sheet.attributes.sections[sectionIndex].attributes[componentIndex].value = value
                }
            }
            else {
                if (title && value) {
                    const sectionIndex = component.getAttribute('position').split('-')[0]
                    const componentIndex = component.getAttribute('position').split('-')[1]

                    this.sheet.attributes.sections[sectionIndex].attributes[componentIndex].name = title
                    this.sheet.attributes.sections[sectionIndex].attributes[componentIndex].value = value
                }
            }
        })

        eventEmitter.on('invalid-component', (component, errors) => {
            const sectionIndex = component.getAttribute('position').split('-')[0]
            const componentIndex = component.getAttribute('position').split('-')[1]

            this.componentsErrorState[`${sectionIndex}-${componentIndex}`] = {
                state: true,
                errors: errors
            }
        })

        eventEmitter.on('valid-component', (component) => {
            const sectionIndex = component.getAttribute('position').split('-')[0]
            const componentIndex = component.getAttribute('position').split('-')[1]

            this.componentsErrorState[`${sectionIndex}-${componentIndex}`] = {
                state: false,
                errors: {}
            }
        })
    }
}
</script>

<template>
    <ion-page>
        <ion-tabs>
            <ion-router-outlet></ion-router-outlet>
            <ion-header class="header" collapse="condense">
                <div class="toolbar">
                    <h1 class="header-title">Ficha: {{ sheetName }}</h1>
                </div>
            </ion-header>

            <ion-content :fullscreen="true">
                <div id="container">
                    <div class="sheet-container">
                        <div class="sheet-navigation-bar">
                            <div class="sheet-navigation-bar-icon">
                                <img src="../assets/settings.svg" @click="sheetConfigMenu = true" />
                            </div>
                            <div class="sheet-navigation-bar-icon" @click="saveSheet()" v-if="!savingSheet">
                                <img src="../assets/save.svg" />
                            </div>
                            <div class="sheet-navigation-bar-icon" v-else>
                                <LoadWheel />
                            </div>
                            <div class="sheet-navigation-bar-icon" @click="createNewSection = true">
                                <img src="../assets/add-section.svg" />
                            </div>
                            <div class="sheet-navigation-bar-icon" @click="addNewComponent = true">
                                <img src="../assets/add-component.svg" />
                            </div>
                        </div>
                        <div class="sheet-saved-sucess" v-if="sheetSavedSuccess">
                            <div class="sheet-saved-sucess-box">
                                <h1>Ficha salva com sucesso!</h1>
                                <button @click="sheetSavedSuccess = false">Ok</button>
                            </div>
                        </div>
                        <div class="sheet-save-errors" v-if="sheetValidationErrors.length > 0">
                            <div class="sheet-save-errors-box">
                                <h1>Corrija os erros listados para que a ficha possa ser salva</h1>
                                <p v-for="error in sheetValidationErrors" :key="error">{{ error }}</p>
                                <button @click="sheetValidationErrors = []">Ok</button>
                            </div>
                        </div>
                        <div class="sheet-menu-config" v-if="sheetConfigMenu">
                            <div class="sheet-menu-config-box">
                                <h1>Configurações da Ficha</h1>
                                <button @click="sheetConfigMenu = false">Voltar</button>

                                <label>Nome da ficha</label>
                                <input v-model="sheetName" ref="sheet-name" @keyup="validateSheetName()"
                                    @change="validateSheetName()">
                                <p v-if="validationErrors.sheetName.state">{{ validationErrors.sheetName.actualMessage }}
                                </p>
                                <button @click="confirmSheetRemove = true">Apagar ficha</button>
                                <div class="confirmation-pop-up" v-if="confirmSheetRemove">
                                    <p>Tem certeza que deseja apagar essa ficha?</p>
                                    <p>Todos os dados serão perdidos!</p>
                                    <div class="confirmation-pop-up-buttons">
                                        <button
                                            @click="removeSheet(); confirmSheetRemove = false; sheetConfigMenu = false;">Apagar</button>
                                        <button @click="confirmSheetRemove = false">Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="sheet-menu-create-section" v-if="createNewSection">
                            <div class="sheet-menu-create-section-box">
                                <h1>Criar nova seção</h1>
                                <button
                                    @click="createNewSection = false; newSectionName = ''; validationErrors.newSection.state = false">Voltar</button>
                                <label>Nome da seção</label>
                                <input v-model="newSectionName" :index="newSectionName" ref="section-create-name"
                                    @keyup="validateNewSection()" @change="validateNewSection()">
                                <p v-if="validationErrors.newSection.state">{{ validationErrors.newSection.actualMessage
                                }}
                                </p>
                                <button @click="createSection()">Confirmar criação</button>
                            </div>
                        </div>
                        <div class="sheet-menu-add-component" v-if="addNewComponent">
                            <div class="sheet-menu-add-component-box">
                                <h1>Adicionar novo componente</h1>
                                <button @click="addNewComponent = false;
                                newComponent = {
                                    type: 0,
                                    title: '',
                                    value: ''
                                }">Voltar</button>
                                <label>Tipo de componente</label>
                                <select v-model="newComponent.type">
                                    <option value="0">Texto</option>
                                    <option value="1">Número</option>
                                    <option value="2">Imagem</option>
                                    <option value="3">Lista</option>
                                    <option value="4">Barra</option>
                                </select>
                                <label v-if="newComponent.type != 2">Nome do componente</label>
                                <input v-model="newComponent.title" ref="new-component-title"
                                    @keyup="validateComponentTitle()" @change="validateComponentTitle()"
                                    v-if="newComponent.type != 2">
                                <p v-if="validationErrors.newComponentTitle.state">
                                    {{ validationErrors.newComponentTitle.actualMessage }}</p>
                                <h5>Você poderá definir o valor na tela a seguir</h5>
                                <button @click="createNewComponent()">Confirmar criação</button>
                            </div>
                        </div>
                        <div class="sheet-section" index="0" ref="section">
                            <img src="../assets/navigate.svg" class="previous-section" @click="previousSection()" />
                            <h1 class="section-title" @click="sectionExpanded = true" ref="section-title">{{
                                actualSectionName }}</h1>
                            <p class="section-expand" @click="sectionExpanded = true">Clique para editar</p>
                            <img src="../assets/navigate.svg" class="next-section" @click="nextSection()" />
                        </div>
                        <div class="sheet-section-expanded" v-if="sectionExpanded && sheetLoaded">
                            <div class="sheet-section-expanded-box">
                                <button @click="sectionExpanded = false">Voltar</button>
                                <label>Nome da seção</label>
                                <input v-model="actualSectionName" :index="actualSectionIndex" ref="section-edit-name"
                                    @keyup="validateSection()" @change="validateSection()">
                                <p v-if="validationErrors.section.state">{{ validationErrors.section.actualMessage }}
                                </p>
                                <button @click="confirmSectionRemove = true">Apagar seção</button>
                                <div class="confirmation-pop-up" v-if="confirmSectionRemove">
                                    <p>Tem certeza que deseja apagar essa seção?</p>
                                    <p>Todos os componentes dentro dela também serão apagados!</p>
                                    <div class="confirmation-pop-up-buttons">
                                        <button
                                            @click="removeActualSection(); confirmSectionRemove = false; sectionExpanded = false;">Apagar</button>
                                        <button @click="confirmSectionRemove = false">Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="sheet-body" ref="sheet-body">
                            <!-- <div class="sheet-body-components">
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
                            </div> -->
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

.confirmation-pop-up {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    background-color: var(--kami-background);
    width: 100%;
    height: fit-content;
    margin: 0;
    margin-bottom: 1em;
}

.confirmation-pop-up p {
    font-size: 0.9em;
    color: red;
    font-weight: bold;
    margin: 0;
    margin-bottom: 10px;
    width: 100%;
    height: min-content;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    text-align: center !important;
}

.confirmation-pop-up-buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    height: fit-content;
    margin: 0;
    margin-bottom: 1em;
}

.confirmation-pop-up-buttons button {
    width: 40% !important;
    height: 2em !important;
    background-color: var(--kami-primary);
    border: 2px solid var(--kami-primary);
    border-radius: 5px;
    margin: 0;
    margin-bottom: 10px;
    padding: 0;
    color: var(--kami-text);
    font-size: 1em;
    font-weight: bold;
}

.confirmation-pop-up-buttons button:nth-child(1) {
    background-color: red;
    border: 2px solid red;
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
    margin-bottom: 1em;
}

.sheet-section {
    display: grid;
    grid-template-columns: 15% 70% 15%;
    grid-template-rows: 70% 30%;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    grid-template-areas:
        "previous title next"
        "previous expand next"
    ;
    justify-items: center;
    align-items: center;
    width: 100%;
    height: 3em;
    background-color: var(--kami-primary);
    margin: 0;
    margin-bottom: 1em;
}

.previous-section,
.next-section {
    width: 1.5em !important;
    height: 3em !important;
    margin: 0;
    filter: var(--kami-background-filter);
}

.previous-section {
    grid-area: previous;
}

.next-section {
    grid-area: next;
    transform: rotate(180deg);
}

.section-title {
    width: 100%;
    text-align: center;
    font-size: 1.1em;
    margin: 0px;
    grid-area: title;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.section-expand {
    grid-area: expand;
    margin: 0;
    margin-bottom: 5px;
    font-size: 0.8em;
    color: var(--kami-text);
    background-color: var(--kami-background);
    border-radius: 5px 5px 0 0;
    padding: 0.2em;
    width: 50% !important;
}

.sheet-section-expanded {
    position: fixed;
    top: 52px;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--kami-background);
    z-index: 3;
    padding-top: 5px;
    overflow-y: scroll;
}

.sheet-section-expanded-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 0;
    padding: 0;
}

.sheet-section-expanded-box button {
    width: 80%;
    height: 3em;
    background-color: var(--kami-primary);
    border: 2px solid var(--kami-primary);
    border-radius: 5px;
    margin: 0;
    margin-bottom: 10px;
    padding: 0;
    color: var(--kami-text);
    font-size: 1em;
    font-weight: bold;
}

.sheet-section-expanded-box label {
    color: var(--kami-text);
    font-size: 1.1em;
    font-weight: bold;
    text-align: center;
}

.sheet-section-expanded-box input {
    width: 70%;
    height: 2.5em;
    background-color: var(--kami-background);
    border: 2px solid var(--kami-primary);
    border-radius: 10px;
    outline: none;
    color: var(--kami-text);
    font-size: 1em;
    font-weight: bold;
    margin: 0;
    margin-bottom: 10px;
    padding: 0 5px;
    text-align: center;
}

.sheet-section-expanded-box p {
    font-size: 0.9em;
    color: red;
    font-weight: bold;
    margin: 0;
    margin-bottom: 10px;
    width: 100%;
    height: min-content;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    text-align: center !important;
}

.sheet-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    width: 100%;
    height: fit-content;
    margin-bottom: 3em;
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

.sheet-navigation-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: 3em;
    background-color: var(--kami-background);
    border-top: 2px solid var(--kami-primary);
    margin: 0;
    position: fixed !important;
    bottom: 0 !important;
    left: 0;
    z-index: 2;
}

.sheet-navigation-bar-icon {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 2em;
    height: 2em;
    background-color: var(--kami-primary);
    border: 2px solid var(--kami-primary);
    border-radius: 25%;
    margin: 0;
    padding: 2px;
    box-shadow: 0px 0px 3px 0px var(--kami-primary);
}

.sheet-navigation-bar-icon .loading {
    border-color: var(--kami-background) transparent;
    border-width: 5px;
    width: 1.5em !important;
    height: 1.5em !important;
    margin: 0;
    padding: 0;
}

.sheet-navigation-bar img {
    width: 2em !important;
    height: 2em !important;
    margin: 0;
    filter: var(--kami-background-filter);
    border-radius: 5px;
}

.sheet-menu-create-section {
    position: fixed;
    top: 52px;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--kami-background);
    z-index: 3;
    padding-top: 5px;
    overflow-y: scroll;
}

.sheet-menu-create-section-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 0;
    padding: 0;
}

.sheet-menu-create-section-box button {
    width: 80%;
    height: 3em;
    background-color: var(--kami-primary);
    border: 2px solid var(--kami-primary);
    border-radius: 5px;
    margin: 0;
    margin-bottom: 10px;
    padding: 0;
    color: var(--kami-text);
    font-size: 1em;
    font-weight: bold;
}

.sheet-menu-create-section-box label {
    color: var(--kami-text);
    font-size: 1.1em;
    font-weight: bold;
    text-align: center;
}

.sheet-menu-create-section-box input {
    width: 70%;
    height: 2.5em;
    background-color: var(--kami-background);
    border: 2px solid var(--kami-primary);
    border-radius: 10px;
    outline: none;
    color: var(--kami-text);
    font-size: 1em;
    font-weight: bold;
    margin: 0;
    margin-bottom: 10px;
    padding: 0 5px;
    text-align: center;
}

.sheet-menu-create-section-box p {
    font-size: 0.9em;
    color: red;
    font-weight: bold;
    margin: 0;
    margin-bottom: 10px;
    width: 100%;
    height: min-content;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    text-align: center !important;
}

.sheet-menu-create-section-box h1 {
    font-size: 1.3em;
    color: var(--kami-text);
    font-weight: bold;
    margin: 0;
    margin-bottom: 10px;
    width: 100%;
    height: min-content;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    text-align: center !important;
}

.sheet-menu-add-component {
    position: fixed;
    top: 52px;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--kami-background);
    z-index: 3;
    padding-top: 5px;
    overflow-y: scroll;
}

.sheet-menu-add-component-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 0;
    padding: 0;
}

.sheet-menu-add-component-box button {
    width: 80%;
    height: 3em;
    background-color: var(--kami-primary);
    border: 2px solid var(--kami-primary);
    border-radius: 5px;
    margin: 0;
    margin-bottom: 10px;
    padding: 0;
    color: var(--kami-text);
    font-size: 1em;
    font-weight: bold;
}

.sheet-menu-add-component-box label {
    color: var(--kami-text);
    font-size: 1.1em;
    font-weight: bold;
    text-align: center;
}

.sheet-menu-add-component-box input {
    width: 70%;
    height: 2.5em;
    background-color: var(--kami-background);
    border: 2px solid var(--kami-primary);
    border-radius: 10px;
    outline: none;
    color: var(--kami-text);
    font-size: 1em;
    font-weight: bold;
    margin: 0;
    margin-bottom: 10px;
    padding: 0 5px;
    text-align: center;
}

.sheet-menu-add-component-box select {
    width: 70%;
    height: 2.5em;
    background-color: var(--kami-background);
    border: 2px solid var(--kami-primary);
    border-radius: 10px;
    outline: none;
    color: var(--kami-text);
    font-size: 1em;
    font-weight: bold;
    margin: 0;
    margin-bottom: 10px;
    padding: 0 5px;
    text-align: center;
}

.sheet-menu-add-component-box p {
    font-size: 0.9em;
    color: red;
    font-weight: bold;
    margin: 0;
    margin-bottom: 10px;
    width: 100%;
    height: min-content;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    text-align: center !important;
}

.sheet-menu-add-component-box h1 {
    font-size: 1.3em;
    color: var(--kami-text);
    font-weight: bold;
    margin: 0;
    margin-bottom: 10px;
    width: 100%;
    height: min-content;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    text-align: center !important;
}

.sheet-menu-add-component-box h5 {
    font-size: 0.9em;
    color: var(--kami-text);
    font-weight: bold;
    margin: 0;
    margin-bottom: 10px;
    width: 100%;
    height: min-content;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    text-align: center !important;
}

.sheet-menu-config {
    position: fixed;
    top: 52px;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--kami-background);
    z-index: 3;
    padding-top: 5px;
    overflow-y: scroll;
}

.sheet-menu-config-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 0;
    padding: 0;
}

.sheet-menu-config-box button {
    width: 80%;
    height: 3em;
    background-color: var(--kami-primary);
    border: 2px solid var(--kami-primary);
    border-radius: 5px;
    margin: 0;
    margin-bottom: 10px;
    padding: 0;
    color: var(--kami-text);
    font-size: 1em;
    font-weight: bold;
}

.sheet-menu-config-box label {
    color: var(--kami-text);
    font-size: 1.1em;
    font-weight: bold;
    text-align: center;
}

.sheet-menu-config-box input {
    width: 70%;
    height: 2.5em;
    background-color: var(--kami-background);
    border: 2px solid var(--kami-primary);
    border-radius: 10px;
    outline: none;
    color: var(--kami-text);
    font-size: 1em;
    font-weight: bold;
    margin: 0;
    margin-bottom: 10px;
    padding: 0 5px;
    text-align: center;
}

.sheet-menu-config-box p {
    font-size: 0.9em;
    color: red;
    font-weight: bold;
    margin: 0;
    margin-bottom: 10px;
    width: 100%;
    height: min-content;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    text-align: center !important;
}

.sheet-menu-config-box h1 {
    font-size: 1.3em;
    color: var(--kami-text);
    font-weight: bold;
    margin: 0;
    margin-bottom: 10px;
    width: 100%;
    height: min-content;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    text-align: center !important;
}

.sheet-save-errors {
    position: fixed;
    top: 52px;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--kami-background);
    z-index: 3;
    padding-top: 5px;
    overflow-y: scroll;
}

.sheet-save-errors-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    width: 100%;
    height: fit-content;
    margin: 0;
    margin-bottom: 3em;
    overflow-y: scroll;
}

.sheet-save-errors-box h1 {
    font-size: 1.3em;
    color: var(--kami-text);
    font-weight: bold;
    margin: 0;
    margin-bottom: 10px;
    width: 100%;
    height: min-content;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    text-align: center;
}

.sheet-save-errors-box p {
    font-size: 0.9em;
    color: var(--kami-text);
    font-weight: bold;
    margin: 0;
    margin-bottom: 10px;
    width: 100%;
    height: min-content;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
}

.sheet-save-errors-box button {
    width: 60%;
    height: 2em;
    background-color: var(--kami-primary);
    border: 2px solid var(--kami-primary);
    border-radius: 5px;
    margin: 0;
    margin-bottom: 10px;
    padding: 0;
    color: var(--kami-text);
    font-size: 1em;
    font-weight: bold;
}

.sheet-saved-sucess {
    position: fixed;
    top: 52px;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--kami-background);
    z-index: 3;
    padding-top: 5px;
    overflow-y: scroll;
}

.sheet-saved-sucess-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    width: 100%;
    height: fit-content;
    margin: 0;
    margin-bottom: 3em;
    overflow-y: scroll;
}

.sheet-saved-sucess-box h1 {
    font-size: 1.3em;
    color: var(--kami-text);
    font-weight: bold;
    margin: 0;
    margin-bottom: 10px;
    width: 100%;
    height: min-content;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    text-align: center;
}

.sheet-saved-sucess-box button {
    width: 60%;
    height: 2em;
    background-color: var(--kami-primary);
    border: 2px solid var(--kami-primary);
    border-radius: 5px;
    margin: 0;
    margin-bottom: 10px;
    padding: 0;
    color: var(--kami-text);
    font-size: 1em;
    font-weight: bold;
}
</style>

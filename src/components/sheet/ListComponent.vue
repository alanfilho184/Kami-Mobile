<script>
import { eventEmitter } from '../../utils/EventEmitter.js'

export default {
    data() {
        return {
            title: 'Carregando...',
            value: {},
            displayItems: [],
            config: {},
            expanded: false,
            visualizeMode: true,
            editMode: false,
            validationErrors: {
                title: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        empty: 'O nome do atributo não pode ser vazio',
                        tooLong: 'O nome do atributo não pode ter mais de 32 caracteres',
                        invalidChars: 'O nome do atributo não pode conter caracteres especiais',
                        alreadyExists: 'O nome do atributo já existe',
                    }
                },
                quantity: {
                    messages: {
                        empty: 'A quantidade não pode ser vazia',
                        tooLong: 'A quantidade não pode ter mais de 32 caracteres',
                        invalidChars: 'A quantidade deve conter apenas números'
                    },
                    indexes: {}
                },
                value: {
                    messages: {
                        empty: 'O item não pode ser vazio',
                        tooLong: 'O valor do atributo não pode ter mais de 1024 caracteres',
                        invalidChars: 'O valor do atributo não pode conter caracteres especiais',
                    },
                    indexes: {}
                }
            },
            confirmComponentRemove: false
        }
    },
    mounted() {
        this.title = this.$refs['list-component'].getAttribute('title')

        let value = {
            items: []
        }

        if (this.$refs['list-component'].getAttribute('value') != '') {
            value = JSON.parse(this.$refs['list-component'].getAttribute('value'))

            this.value = value
        }
        else {
            if (this.$refs['list-component'].getAttribute('editmode') == 'true') {
                this.value = value
                this.expanded = true

                setTimeout(() => {
                    this.toggleEditMode()

                    this.validateTitle()
                    this.validateName(0)
                    this.validateQuantity(0)
                }, 100)
            }
        }

        let displayItems = []
        if (value.items.length > 3) {
            for (let i = 0; i < 3; i++) {
                displayItems.push(value.items[i])
            }

            displayItems.push({ name: '...' })

            this.displayItems = displayItems
        }
        else {
            displayItems = value.items
        }

        this.displayItems = displayItems

        //this.config = JSON.parse(this.$refs.list-component.getAttribute('config'))
    },
    methods: {
        toggleEditMode() {
            this.visualizeMode = false
            this.editMode = true

            this.$refs['list-component-toggle-visualize-mode-button'].classList.remove('list-component-expanded-button-active')
            this.$refs['list-component-toggle-edit-mode-button'].classList.add('list-component-expanded-button-active')
        },
        toggleVisualizeMode() {
            this.visualizeMode = true
            this.editMode = false

            this.$refs['list-component-toggle-visualize-mode-button'].classList.add('list-component-expanded-button-active')
            this.$refs['list-component-toggle-edit-mode-button'].classList.remove('list-component-expanded-button-active')
        },
        validateTitle() {
            const title = this.title

            if (title == '') {
                this.validationErrors.title.state = true
                this.validationErrors.title.actualMessage = this.validationErrors.title.messages.empty
            }
            else if (title.length > 32) {
                this.validationErrors.title.state = true
                this.validationErrors.title.actualMessage = this.validationErrors.title.messages.tooLong
            }
            else if (!title.match(/^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ+#@$%&*{}()/.,;:?!'"-_| ]{1,}(?: [a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ+#@$%&*{}()/.,;:?!'"-_| ]+){0,}$/gim)) {
                this.validationErrors.title.state = true
                this.validationErrors.title.actualMessage = this.validationErrors.title.messages.invalidChars
            }
            else {
                this.validationErrors.title.state = false
                this.validationErrors.title.actualMessage = ''
            }
        },
        validateQuantity(index) {
            try {
                const value = this.value.items[index].quantity

                if (value == '') {
                    this.validationErrors.quantity.indexes[index] = {}
                    this.validationErrors.quantity.indexes[index].state = true
                    this.validationErrors.quantity.indexes[index].actualMessage = this.validationErrors.quantity.messages.empty
                }
                else if (value.length > 32) {
                    this.validationErrors.quantity.indexes[index] = {}
                    this.validationErrors.quantity.indexes[index].state = true
                    this.validationErrors.quantity.indexes[index].actualMessage = this.validationErrors.quantity.messages.tooLong
                }
                else if (!value.match(/^[0-9]{1,}(?: [0-9]+){0,}$/gim)) {
                    this.validationErrors.quantity.indexes[index] = {}
                    this.validationErrors.quantity.indexes[index].state = true
                    this.validationErrors.quantity.indexes[index].actualMessage = this.validationErrors.quantity.messages.invalidChars
                }
                else {
                    this.validationErrors.quantity.indexes[index] = {}
                    this.validationErrors.quantity.indexes[index].state = false
                    this.validationErrors.quantity.indexes[index].actualMessage = ''
                }
            }
            catch (err) {
               //ignore
            }
        },
        validateName(index) {
            try {
                const value = this.value.items[index].name

                if (value == '') {
                    this.validationErrors.value.indexes[index] = {}
                    this.validationErrors.value.indexes[index].state = true
                    this.validationErrors.value.indexes[index].actualMessage = this.validationErrors.value.messages.empty
                }
                else if (value.length > 1024) {
                    this.validationErrors.value.indexes[index] = {}
                    this.validationErrors.value.indexes[index].state = true
                    this.validationErrors.value.indexes[index].actualMessage = this.validationErrors.value.messages.tooLong
                }
                else if (!value.match(/^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ+#@$%&*{}()/.,;:?!'"-_| ]{1,}(?: [a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ+#@$%&*{}()/.,;:?!'"-_| ]+){0,}$/gim)) {
                    this.validationErrors.value.indexes[index] = {}
                    this.validationErrors.value.indexes[index].state = true
                    this.validationErrors.value.indexes[index].actualMessage = this.validationErrors.value.messages.invalidChars
                }
                else {
                    this.validationErrors.value.indexes[index] = {}
                    this.validationErrors.value.indexes[index].state = false
                    this.validationErrors.value.indexes[index].actualMessage = ''
                }
            }
            catch (err) {
                //ignore 
            }
        },
        removeItem(index) {
            this.value.items.splice(index, 1)

            let displayItems = []
            if (this.value.items.length > 3) {
                for (let i = 0; i < 3; i++) {
                    displayItems.push(this.value.items[i])
                }

                displayItems.push({ name: '...' })

                this.displayItems = displayItems
            }
            else {
                displayItems = this.value.items
            }

            this.displayItems = displayItems
        },
        addItem() {
            this.value.items.push({ name: '', quantity: 1 })

            let displayItems = []
            if (this.value.items.length > 3) {
                for (let i = 0; i < 3; i++) {
                    displayItems.push(this.value.items[i])
                }

                displayItems.push({ name: '...' })

                this.displayItems = displayItems
            }
            else {
                displayItems = this.value.items
            }

            this.displayItems = displayItems
        },
        updateValue(index) {
            const quantity = this.$refs['list-component-expanded-edit-quantity'][index].value
            const name = this.$refs['list-component-expanded-edit-name'][index].value

            this.value.items[index].quantity = quantity
            this.value.items[index].name = name

            let displayItems = []
            if (this.value.items.length > 3) {
                for (let i = 0; i < 3; i++) {
                    displayItems.push(this.value.items[i])
                }

                displayItems.push({ name: '...' })

                this.displayItems = displayItems
            }
            else {
                displayItems = this.value.items
            }

            this.displayItems = displayItems
        },
        removeActualComponent() {
            eventEmitter.emit('remove-component', this.$refs['list-component'])
        }
    },
    watch: {
        title() {
            eventEmitter.emit('update-component', this.$refs['list-component'], this.title, this.value)
        },
        value() {
            eventEmitter.emit('update-component', this.$refs['list-component'], this.title, this.value)
        },
        validationErrors: {
            handler() {
                if (this.validationErrors.title.state || this.validationErrors.value.state || this.validationErrors.quantity.state) {
                    const errors = {
                        title: this.validationErrors.title,
                        value: this.validationErrors.value,
                        quantity: this.validationErrors.quantity
                    }

                    eventEmitter.emit('invalid-component', this.$refs['list-component'], errors)
                }
                else {
                    eventEmitter.emit('valid-component', this.$refs['list-component'])
                }
            },
            deep: true
        }
    }
}
</script>
<template>
    <div class="list-component-wrapper" ref="list-component">
        <div class="list-component" @click="expanded = true;">
            <div class="list-component-title">
                <h4>{{ title }}</h4>
            </div>
            <div class="list-component-value">
                <p v-for="(item) in displayItems" :key="item">{{ item.quantity ? item.quantity + 'x' : '' }} {{ item.name }}
                </p>
            </div>
            <div class="list-component-footer">
                <p>Clique para expandir</p>
            </div>
        </div>
        <div class="list-component-expanded" v-if="expanded">
            <div class="list-component-expanded-box">
                <div class="list-component-expanded-controls">
                    <button @click="toggleVisualizeMode(); expanded = false;">Voltar</button>
                    <div class="row">
                        <button class="list-component-expanded-button-active" @click="toggleVisualizeMode()"
                            ref="list-component-toggle-visualize-mode-button">Visualizar</button>
                        <button @click="toggleEditMode()" ref="list-component-toggle-edit-mode-button">Editar</button>
                    </div>
                    <button v-if="editMode && !visualizeMode" @click="confirmComponentRemove = true">Remover
                        componente</button>
                    <div class="confirmation-pop-up" v-if="confirmComponentRemove">
                        <p>Tem certeza que deseja apagar esse componente?</p>
                        <div class="confirmation-pop-up-buttons">
                            <button
                                @click="removeActualComponent(); confirmComponentRemove = false; expanded = false;">Apagar</button>
                            <button @click="confirmComponentRemove = false">Cancelar</button>
                        </div>
                    </div>
                </div>
                <div class="list-component-expanded-visualize-body" v-if="visualizeMode && !editMode">
                    <div class="list-component-expanded-title">
                        <h4>{{ title }}</h4>
                    </div>
                    <div class="list-component-expanded-value">
                        <p v-for="(item) in value.items" :key="item">{{ item.quantity ? item.quantity + 'x' : '' }} {{
                            item.name }}</p>
                    </div>
                </div>
                <div class="list-component-expanded-edit-body" v-else-if="!visualizeMode && editMode">
                    <div class="list-component-expanded-title">
                        <input v-model="title" placeholder="Insira um nome para o atributo" @keyup="validateTitle()"
                            @change="validateTitle()">
                    </div>
                    <div class="list-component-expanded-value">
                        <p v-if="validationErrors.title.state">{{ validationErrors.title.actualMessage }}</p>
                        <div class="list-component-expanded-edit-value" v-for="(item, index) in value.items" :key="item">
                            <div class="list-component-validation-error-wrapper">
                                <div class="list-component-validation-error-wrapper-secondary">
                                    <input type="number" placeholder="QTD" class="list-component-expanded-edit-quantity"
                                        :value="item.quantity" @keyup="updateValue(index); validateQuantity(index)"
                                        @change="updateValue(index); validateQuantity(index)"
                                        ref="list-component-expanded-edit-quantity" />
                                    <input type="text" placeholder="Insira um item"
                                        class="list-component-expanded-edit-name" :value="item.name"
                                        @keyup="updateValue(index); validateName(index)"
                                        @change="updateValue(index); validateName(index)"
                                        ref="list-component-expanded-edit-name" />
                                    <img class="list-component-expanded-edit-remove" src="../../assets/trash.svg"
                                        @click="removeItem(index)" />
                                </div>
                                <p
                                    v-if="validationErrors.quantity.indexes[index] && validationErrors.quantity.indexes[index].state">
                                    {{ validationErrors.quantity.indexes[index].actualMessage }}</p>
                                <p
                                    v-if="validationErrors.value.indexes[index] && validationErrors.value.indexes[index].state">
                                    {{ validationErrors.value.indexes[index].actualMessage }}</p>
                            </div>
                        </div>
                        <img class="list-component-expanded-edit-add" src="../../assets/add.svg" @click="addItem()" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.list-component {
    width: 100%;
    height: 9em;
    background-color: var(--kami-primary);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0;
    transition: 0.3s;
}

.list-component-title {
    box-sizing: border-box;
    width: 100%;
    height: 25%;
    background-color: var(--kami-background);
    border: 2px solid var(--kami-primary);
    border-radius: 10px 10px 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 1em;
    font-weight: normal;
    color: var(--kami-text);
    margin: 0;
    vertical-align: middle;
}

.list-component-title h4 {
    font-size: 0.8em;
    font-weight: bold;
    margin: 0;
    width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
}

.list-component-value {
    height: 60%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    color: var(--kami-text);
    margin: 0;
    padding: 0;
}

.list-component-value p {
    font-size: 1em;
    font-weight: bold;
    margin: 0;
    padding: 0;
    width: 95% !important;
    border: none;
    color: var(--kami-text);
    text-align: justify !important;
    padding: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.list-component-footer {
    width: 100%;
    height: 15%;
    box-sizing: border-box;
    background-color: var(--kami-background);
    border: 2px solid var(--kami-primary);
    border-radius: 0 0 10px 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 0.8em;
    font-weight: normal;
    color: var(--kami-text);
    margin: 0;
    vertical-align: middle;
}

.list-component-footer p {
    font-size: 0.9em;
    font-weight: bold;
    margin: 0;
    width: 100%;
}

.row {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    margin: 5px 0;
    padding: 0;
}

.list-component-expanded {
    position: fixed;
    top: 52px;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--kami-background);
    z-index: 2;
    padding-top: 5px;
    overflow-y: scroll;
}

.list-component-expanded-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.list-component-expanded-controls {
    width: 90%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.list-component-expanded-controls button {
    width: 100%;
    height: 3em;
    background-color: var(--kami-primary);
    border: 2px solid var(--kami-background);
    border-radius: 10px;
    color: var(--kami-text);
    font-size: 1em;
    font-weight: bold;
    margin: 5px 0;
    padding: 0;
}

.list-component-expanded-controls .row button {
    width: 50%;
    height: 3em;
    background-color: var(--kami-primary);
    border: 2px solid var(--kami-background);
    border-radius: 10px;
    color: var(--kami-text);
    font-size: 1em;
    font-weight: bold;
    padding: 0;
}

.list-component-expanded-button-active {
    background-color: var(--kami-background) !important;
    border: 2px solid var(--kami-primary) !important;
    color: var(--kami-text) !important;
}

.list-component-expanded-visualize-body {
    width: 90%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
}

.list-component-expanded-title {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 3em;
    background-color: var(--kami-background);
    border: 2px solid var(--kami-primary);
    border-radius: 10px 10px 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-weight: normal;
    color: var(--kami-text);
    margin: 0;
    padding: 5px;
    vertical-align: middle;
}

.list-component-expanded-title input {
    font-size: 1.2em;
    font-weight: bold;
    margin: 0;
    width: 100%;
    height: min-content;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    text-align: center !important;
    border: none;
    outline: none;
    background-color: var(--kami-background);
    color: var(--kami-text);
}

.list-component-expanded-edit-body .list-component-expanded-value p {
    font-size: 0.9em;
    color: red;
    font-weight: bold;
    margin: 0;
    width: 100%;
    height: min-content;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    text-align: center !important;
}

.list-component-expanded-title h4 {
    font-size: 1.2em;
    font-weight: bold;
    margin: 0;
    width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
}

.list-component-expanded-value {
    height: fit-content;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    color: var(--kami-text);
    margin: 0;
    padding: 0;
    background-color: var(--kami-primary);
    border-radius: 0 0 10px 10px;
    margin-bottom: 70px;
}

.list-component-expanded-value p {
    font-size: 1.1em;
    font-weight: bold;
    margin: 0;
    padding: 0px 5px;
    width: 100%;
    height: 100%;
    border: none;
    color: var(--kami-text);
    text-align: justify !important;
    padding: 5px;
    word-break: break-all;
    hyphens: auto;
}

.list-component-expanded-edit-body {
    width: 90%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
}

.list-component-expanded-edit-value {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    margin: 0;
    padding: 0;
}

.list-component-expanded-edit-quantity {
    width: 20%;
    height: 2.5em;
    background-color: var(--kami-background);
    border: 2px solid var(--kami-primary);
    border-radius: 10px 0px 0px 10px;
    color: var(--kami-text);
    font-size: 1em;
    font-weight: bold;
    margin-left: 5px;
    padding: 0;
    text-align: center;
    outline: none;
    resize: none;
}

.list-component-expanded-edit-name {
    width: 80%;
    height: 2.5em;
    background-color: var(--kami-background);
    border: 2px solid var(--kami-primary);
    border-radius: 0px 10px 10px 0px;
    color: var(--kami-text);
    font-size: 1em;
    font-weight: bold;
    margin: 0;
    padding: 0px 5px;
    text-align: left;
    outline: none;
    resize: none;
}

.list-component-expanded-edit-remove {
    width: 1.5em !important;
    height: 1.5em !important;
    border-radius: 100%;
    border: 2px solid var(--kami-primary);
    padding: 5px;
    filter: var(--kami-background-filter);
    margin: 5px;
}

.list-component-expanded-edit-add {
    width: 3em !important;
    height: 3em !important;
    border-radius: 100%;
    padding: 0;
    filter: var(--kami-background-filter);
}

.list-component-validation-error-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.list-component-validation-error-wrapper p {
    padding: 0;
}

.list-component-validation-error-wrapper-secondary {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
}
</style>
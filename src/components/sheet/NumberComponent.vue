<script>
import { eventEmitter } from '../../utils/EventEmitter.js'

export default {
    data() {
        return {
            title: 'Carregando...',
            value: 'Carregando...',
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
                value: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        empty: 'O valor do atributo não pode ser vazio',
                        tooLong: 'O valor do atributo não pode ter mais de 1024 caracteres',
                        invalidChars: 'O valor do atributo só pode conter números',
                    }
                }
            },
            confirmComponentRemove: false
        }
    },
    mounted() {
        this.title = this.$refs['number-component'].getAttribute('title')
        this.value = this.$refs['number-component'].getAttribute('value')

        if (this.$refs['number-component'].getAttribute('editmode') == 'true') {
            this.expanded = true

            setTimeout(() => {
                this.toggleEditMode()

                this.validateTitle()
                this.validateValue()
            }, 100)
        }
        //this.config = JSON.parse(this.$refs.number-component.getAttribute('config'))
    },
    methods: {
        toggleEditMode() {
            this.visualizeMode = false
            this.editMode = true

            this.$refs['number-component-toggle-visualize-mode-button'].classList.remove('number-component-expanded-button-active')
            this.$refs['number-component-toggle-edit-mode-button'].classList.add('number-component-expanded-button-active')
        },
        toggleVisualizeMode() {
            this.visualizeMode = true
            this.editMode = false

            this.$refs['number-component-toggle-visualize-mode-button'].classList.add('number-component-expanded-button-active')
            this.$refs['number-component-toggle-edit-mode-button'].classList.remove('number-component-expanded-button-active')
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
        validateValue() {
            const value = this.value

            if (value == '') {
                this.validationErrors.value.state = true
                this.validationErrors.value.actualMessage = this.validationErrors.value.messages.empty
            }
            else if (value.length > 1024) {
                this.validationErrors.value.state = true
                this.validationErrors.value.actualMessage = this.validationErrors.value.messages.tooLong
            }
            else if (!value.match(/^[0-9]{1,}(?: [0-9]+){0,}$/gim)) {
                this.validationErrors.value.state = true
                this.validationErrors.value.actualMessage = this.validationErrors.value.messages.invalidChars
            }
            else {
                this.validationErrors.value.state = false
                this.validationErrors.value.actualMessage = ''
            }
        },
        removeActualComponent() {
            eventEmitter.emit('remove-component', this.$refs['number-component'])
        }
    },
    watch: {
        title() {
            eventEmitter.emit('update-component', this.$refs['number-component'], this.title, this.value)
        },
        value() {
            if (this.value.length > 3 && this.value.length < 6) {
                this.$refs['number-component'].querySelector('.number-component-value p').style.fontSize = `${5 - (this.value.length - 3) * (0.1 + (0.1 * this.value.length))}em`
            }
            else if (this.value.length >= 6) {
                this.$refs['number-component'].querySelector('.number-component-value p').style.fontSize = `2.5em`
                this.$refs['number-component'].querySelector('.number-component-value p').classList.add('overflow')
            }
            else {
                this.$refs['number-component'].querySelector('.number-component-value p').style.fontSize = `4.5em`
            }

            eventEmitter.emit('update-component', this.$refs['number-component'], this.title, this.value)
        },
        validationErrors: {
            handler() {
                if (this.validationErrors.title.state || this.validationErrors.value.state) {
                    const errors = {
                        title: {
                            state: this.validationErrors.title.state,
                            actualMessage: this.validationErrors.title.actualMessage
                        },
                        value: {
                            state: this.validationErrors.value.state,
                            actualMessage: this.validationErrors.value.actualMessage
                        }
                    }

                    eventEmitter.emit('invalid-component', this.$refs['number-component'], errors)
                }
                else {
                    eventEmitter.emit('valid-component', this.$refs['number-component'])
                }
            },
            deep: true
        }
    }
}
</script>
<template>
    <div class="number-component-wrapper" ref="number-component">
        <div class="number-component" @click="expanded = true">
            <div class="number-component-title">
                <h4>{{ title }}</h4>
            </div>
            <div class="number-component-value">
                <p>{{ value }}</p>
            </div>
            <div class="number-component-footer">
                <p>Clique para expandir</p>
            </div>
        </div>
        <div class="number-component-expanded" v-if="expanded">
            <div class="number-component-expanded-box">
                <div class="number-component-expanded-controls">
                    <button @click="toggleVisualizeMode(); expanded = false;">Voltar</button>
                    <div class="row">
                        <button class="number-component-expanded-button-active" @click="toggleVisualizeMode()"
                            ref="number-component-toggle-visualize-mode-button">Visualizar</button>
                        <button @click="toggleEditMode()" ref="number-component-toggle-edit-mode-button">Editar</button>
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
                <div class="number-component-expanded-visualize-body" v-if="visualizeMode && !editMode">
                    <div class="number-component-expanded-title">
                        <h4>{{ title }}</h4>
                    </div>
                    <div class="number-component-expanded-value">
                        <p>{{ value }}</p>
                    </div>
                </div>
                <div class="number-component-expanded-edit-body" v-else-if="!visualizeMode && editMode">
                    <div class="number-component-expanded-title">
                        <input v-model="title" placeholder="Insira um nome para o atributo" @keyup="validateTitle()"
                            @change="validateTitle()">
                    </div>
                    <div class="number-component-expanded-value">
                        <p v-if="validationErrors.title.state">{{ validationErrors.title.actualMessage }}</p>
                        <p v-if="validationErrors.value.state">{{ validationErrors.value.actualMessage }}</p>
                        <textarea v-model="value" placeholder="Insira um valor para o atributo" @keyup="validateValue()"
                            @change="validateValue()"></textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.number-component {
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

.number-component-title {
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

.number-component-title h4 {
    font-size: 0.8em;
    font-weight: bold;
    margin: 0;
    width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
}

.number-component-value {
    height: 60%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--kami-text);
    margin: 0;
    padding: 0;
}

.number-component-value p {
    font-size: unset;
    font-weight: bold;
    margin: 0;
    padding: 0px 5px;
    width: 100%;
    border: none;
    color: var(--kami-text);
    overflow: hidden;
    text-align: center !important;
}

.overflow {
    text-overflow: ellipsis;
    white-space: nowrap;
}

.number-component-footer {
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

.number-component-footer p {
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

.number-component-expanded {
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

.number-component-expanded-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.number-component-expanded-controls {
    width: 90%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.number-component-expanded-controls button {
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

.number-component-expanded-controls .row button {
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

.number-component-expanded-button-active {
    background-color: var(--kami-background) !important;
    border: 2px solid var(--kami-primary) !important;
    color: var(--kami-text) !important;
}

.number-component-expanded-visualize-body {
    width: 90%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
}

.number-component-expanded-title {
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

.number-component-expanded-edit-body .number-component-expanded-value p {
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

.number-component-expanded-title h4 {
    font-size: 1.2em;
    font-weight: bold;
    margin: 0;
    width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
}

.number-component-expanded-value {
    height: max-content;
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

.number-component-expanded-value p {
    font-size: 2em;
    font-weight: bold;
    margin: 0;
    padding: 0px 5px;
    width: 100%;
    height: 100%;
    border: none;
    color: var(--kami-text);
    text-align: justify !important;
    padding: 5px;
    overflow: hidden;
    word-break: break-all;
}

.number-component-expanded-edit-body {
    width: 90%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
}

.number-component-expanded-edit-body input {
    width: 100%;
    height: 100%;
    background-color: var(--kami-background);
    border: none;
    border-radius: 10px 10px 0 0;
    outline: none;
    color: var(--kami-text);
    font-size: 1em;
    font-weight: bold;
    margin: 0;
    padding: 0 5px;
    text-align: center;
}

.number-component-expanded-edit-body textarea {
    width: 95%;
    height: 50vmax;
    background-color: var(--kami-primary);
    border: none;
    border-radius: 0 0 10px 10px;
    outline: none;
    color: var(--kami-text);
    font-size: 2em;
    font-weight: bold;
    margin: 0;
    padding: 5px;
    text-align: justify;
    resize: none;
}
</style>
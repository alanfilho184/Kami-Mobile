<script>
import { eventEmitter } from '../../utils/EventEmitter.js'

export default {
    data() {
        return {
            title: 'Carregando...',
            value: 'Carregando...',
            actual: 100,
            max: 100,
            min: 0,
            step: 1,
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
                actual: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        empty: 'O valor atual não pode ser vazio',
                        biggerThanMax: 'O valor atual não pode ser maior que o valor máximo',
                        smallerThanMin: 'O valor atual não pode ser menor que o valor mínimo',
                        invalidChars: 'O valor atual deve conter apenas números inteiros',
                    }
                },
                max: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        empty: 'O valor máximo não pode ser vazio',
                        smallerThanActual: 'O valor máximo não pode ser menor que o valor atual',
                        invalidChars: 'O valor máximo deve conter apenas números inteiros',
                    }
                },
                min: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        empty: 'O valor mínimo não pode ser vazio',
                        biggerThanActual: 'O valor mínimo não pode ser maior que o valor atual',
                        invalidChars: 'O valor mínimo deve conter apenas números inteiros',
                    }
                },
                step: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        empty: 'O passo não pode ser vazio',
                        invalidChars: 'O passo deve conter apenas números inteiros',
                        greaterThanMax: 'O passo não pode ser maior que o valor máximo',
                    }
                }
            },
            confirmComponentRemove: false
        }
    },
    mounted() {
        try {
            this.title = this.$refs['bar-component'].getAttribute('title')
            this.value = JSON.parse(this.$refs['bar-component'].getAttribute('value'))
            this.actual = this.value.actual
            this.max = this.value.max
        }
        catch (err) {
            this.value = {
                actual: 100,
                max: 100,
                min: 0,
                step: 1
            }
        }
        this.actual = this.value.actual
        this.max = this.value.max
        this.min = this.value.min || 0
        this.step = this.value.step || 1

        if (this.$refs['bar-component'].getAttribute('editmode') == 'true') {
            this.expanded = true

            setTimeout(() => {
                this.toggleEditMode()

                this.validateAll()
            }, 100)
        }
        //this.config = JSON.parse(this.$refs.bar-component.getAttribute('config'))
    },
    methods: {
        toggleEditMode() {
            this.visualizeMode = false
            this.editMode = true

            this.$refs['bar-component-toggle-visualize-mode-button'].classList.remove('bar-component-expanded-button-active')
            this.$refs['bar-component-toggle-edit-mode-button'].classList.add('bar-component-expanded-button-active')
        },
        toggleVisualizeMode() {
            this.visualizeMode = true
            this.editMode = false

            this.$refs['bar-component-toggle-visualize-mode-button'].classList.add('bar-component-expanded-button-active')
            this.$refs['bar-component-toggle-edit-mode-button'].classList.remove('bar-component-expanded-button-active')
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
        validateActual() {
            const actual = this.actual

            if (actual.toString() == '') {
                this.validationErrors.actual.state = true
                this.validationErrors.actual.actualMessage = this.validationErrors.actual.messages.empty
            }
            else if (actual > this.max) {
                this.validationErrors.actual.state = true
                this.validationErrors.actual.actualMessage = this.validationErrors.actual.messages.biggerThanMax
            }
            else if (actual < this.min) {
                this.validationErrors.actual.state = true
                this.validationErrors.actual.actualMessage = this.validationErrors.actual.messages.smallerThanMin
            }
            else if (!actual.toString().match(/^[0-9]+$/gim)) {
                this.validationErrors.actual.state = true
                this.validationErrors.actual.actualMessage = this.validationErrors.actual.messages.invalidChars
            }
            else {
                this.validationErrors.actual.state = false
                this.validationErrors.actual.actualMessage = ''
            }
        },
        validateMax() {
            const max = this.max

            if (max.toString() == '') {
                this.validationErrors.max.state = true
                this.validationErrors.max.actualMessage = this.validationErrors.max.messages.empty
            }
            else if (max < this.actual) {
                this.validationErrors.max.state = true
                this.validationErrors.max.actualMessage = this.validationErrors.max.messages.smallerThanActual
            }
            else if (!max.toString().match(/^[0-9]+$/gim)) {
                this.validationErrors.max.state = true
                this.validationErrors.max.actualMessage = this.validationErrors.max.messages.invalidChars
            }
            else {
                this.validationErrors.max.state = false
                this.validationErrors.max.actualMessage = ''
            }
        },
        validateMin() {
            const min = this.min

            if (min.toString() == '') {
                this.validationErrors.min.state = true
                this.validationErrors.min.actualMessage = this.validationErrors.min.messages.empty
            }
            else if (min > this.actual) {
                this.validationErrors.min.state = true
                this.validationErrors.min.actualMessage = this.validationErrors.min.messages.biggerThanActual
            }
            else if (!min.toString().match(/^[0-9]+$/gim)) {
                this.validationErrors.min.state = true
                this.validationErrors.min.actualMessage = this.validationErrors.min.messages.invalidChars
            }
            else {
                this.validationErrors.min.state = false
                this.validationErrors.min.actualMessage = ''
            }
        },
        validateStep() {
            const step = this.step

            if (step.toString() == '') {
                this.validationErrors.step.state = true
                this.validationErrors.step.actualMessage = this.validationErrors.step.messages.empty
            }
            else if (step > this.max) {
                this.validationErrors.step.state = true
                this.validationErrors.step.actualMessage = this.validationErrors.step.messages.greaterThanMax
            }
            else if (!step.toString().match(/^[0-9]+$/gim)) {
                this.validationErrors.step.state = true
                this.validationErrors.step.actualMessage = this.validationErrors.step.messages.invalidChars
            }
            else {
                this.validationErrors.step.state = false
                this.validationErrors.step.actualMessage = ''
            }
        },
        validateAll() {
            this.validateTitle()
            this.validateActual()
            this.validateMax()
            this.validateMin()
            this.validateStep()

            this.updateValue()
        },
        updateValue() {
            this.value = {
                actual: this.actual,
                max: this.max,
                min: this.min,
                step: this.step
            }
        },
        removeActualComponent() {
            eventEmitter.emit('remove-component', this.$refs['bar-component'])
        }
    },
    watch: {
        title() {
            eventEmitter.emit('update-component', this.$refs['bar-component'], this.title, this.value)
        },
        value: {
            handler: function (newValue, oldValue) {
                this.$refs['bar-component'].setAttribute('value', JSON.stringify(newValue))

                eventEmitter.emit('update-component', this.$refs['bar-component'], this.title, this.value)
            },
            deep: true
        },
        validationErrors: {
            handler() {
                if(this.validationErrors.title.state || this.validationErrors.actual.state || this.validationErrors.max.state || this.validationErrors.min.state || this.validationErrors.step.state) {
                    const errors = {
                        title: this.validationErrors.title,
                        actual: this.validationErrors.actual,
                        max: this.validationErrors.max,
                        min: this.validationErrors.min,
                        step: this.validationErrors.step
                    }

                    eventEmitter.emit('invalid-component', this.$refs['bar-component'], errors)
                }
                else {
                    eventEmitter.emit('valid-component', this.$refs['bar-component'])
                }
            },
            deep: true
        }
    }
}
</script>
<template>
    <div class="bar-component-wrapper" ref="bar-component">
        <div class="bar-component">
            <div class="bar-component-title" @click="expanded = true">
                <h4>{{ title }}</h4>
                <h4>{{ actual }}/{{ max }}</h4>
            </div>
            <div class="bar-component-value" @click="expanded = true">
                <div class="bar-component-outter-bar-display">
                    <div class="bar-component-inner-bar-display" :style="`width: ${(actual / max) * 100}%`"></div>
                </div>
            </div>
            <div class="bar-component-controls-display">
                <div class="bar-component-icon">
                    <img src="../../assets/plus.svg" @click="actual + step > max ? actual : actual += step; updateValue()" />
                </div>
                <div class="bar-component-icon">
                    <img src="../../assets/minus.svg" @click="actual - step < min ? actual : actual -= step; updateValue()" />
                </div>
            </div>
        </div>
        <div class="bar-component-expanded" v-if="expanded">
            <div class="bar-component-expanded-box">
                <div class="bar-component-expanded-controls">
                    <button @click="expanded = false">Voltar</button>
                    <div class="row">
                        <button class="bar-component-expanded-button-active" @click="toggleVisualizeMode()"
                            ref="bar-component-toggle-visualize-mode-button">Visualizar</button>
                        <button @click="toggleEditMode()" ref="bar-component-toggle-edit-mode-button">Editar</button>
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
                <div class="bar-component-expanded-visualize-body" v-if="visualizeMode && !editMode">
                    <div class="bar-component-title" @click="expanded = true">
                        <h4>{{ title }}</h4>
                        <h4>{{ actual }}/{{ max }}</h4>
                    </div>
                    <div class="bar-component-value" @click="expanded = true">
                        <div class="bar-component-outter-bar-display">
                            <div class="bar-component-inner-bar-display" :style="`width: ${(actual / max) * 100}%`"></div>
                        </div>
                    </div>
                    <div class="bar-component-controls-display">
                        <div class="bar-component-icon">
                            <img src="../../assets/plus.svg" @click="actual + step > max ? actual : actual += step; updateValue()" />
                        </div>
                        <div class="bar-component-icon">
                            <img src="../../assets/minus.svg" @click="actual - step < min ? actual : actual -= step; updateValue()" />
                        </div>
                    </div>
                </div>
                <div class="bar-component-expanded-edit-body" v-else-if="!visualizeMode && editMode">
                    <div class="bar-component-expanded-title">
                        <input v-model="title" placeholder="Insira um nome para o atributo" @keyup="validateTitle()"
                            @change="validateTitle()">
                    </div>
                    <div class="bar-component-expanded-value">
                        <p v-if="validationErrors.title.state">{{ validationErrors.title.actualMessage }}</p>
                        <label>Valor mínimo</label>
                        <input type="number" v-model="min" @keyup="validateAll()" @change="validateAll()">
                        <p v-if="validationErrors.min.state">{{ validationErrors.min.actualMessage }}</p>
                        <label>Valor máximo</label>
                        <input type="number" v-model="max" @keyup="validateAll()" @change="validateAll()">
                        <p v-if="validationErrors.max.state">{{ validationErrors.max.actualMessage }}</p>
                        <label>Valor atual</label>
                        <input type="number" v-model="actual" @keyup="validateAll()" @change="validateAll()">
                        <p v-if="validationErrors.actual.state">{{ validationErrors.actual.actualMessage }}</p>
                        <label>Passo dos botões + e -</label>
                        <input type="number" v-model="step" @keyup="validateAll()" @change="validateAll()">
                        <p v-if="validationErrors.step.state">{{ validationErrors.step.actualMessage }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.bar-component {
    width: 100%;
    height: 9em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0;
    transition: 0.3s;
}

.bar-component-title {
    box-sizing: border-box;
    width: 100%;
    height: min-content;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    font-size: 1em;
    font-weight: normal;
    color: var(--kami-text);
    margin: 0;
    padding: 0;
    vertical-align: middle;
}

.bar-component-title h4 {
    margin: 0;
}

.bar-component-value {
    width: 100%;
    height: 1em;
    background-color: var(--kami-background);
    border-radius: 10px;
    margin: 0;
    padding: 0;
}

.bar-component-outter-bar-display {
    width: 99%;
    height: 1em;
    background-color: var(--kami-primary);
    border-radius: 10px;
    margin: 0;
    padding: 0px 2px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.bar-component-inner-bar-display {
    width: 70%;
    height: 70%;
    background-color: var(--kami-background);
    border-radius: 10px;
    margin: 0;
    padding: 0;
}

.bar-component-controls-display {
    width: 100%;
    height: 3em;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin: 0;
    margin-top: 5px;
    padding: 0;
    z-index: 0;
}

.bar-component-icon {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 2.5em;
    height: 2.5em;
    background-color: var(--kami-primary);
    border-radius: 100%;
    margin: 0;
    margin-left: 8px;
    padding: 0;

}

.bar-component-controls-display img {
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    filter: var(--kami-background-filter);
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

.bar-component-expanded {
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

.bar-component-expanded-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.bar-component-expanded-controls {
    width: 90%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.bar-component-expanded-controls button {
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

.bar-component-expanded-controls .row button {
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

.bar-component-expanded-button-active {
    background-color: var(--kami-background) !important;
    border: 2px solid var(--kami-primary) !important;
    color: var(--kami-text) !important;
}

.bar-component-expanded-visualize-body {
    width: 90%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
}

.bar-component-expanded-title {
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

.bar-component-expanded-edit-body .bar-component-expanded-value p {
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

.bar-component-expanded-title h4 {
    font-size: 1.2em;
    font-weight: bold;
    margin: 0;
    width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
}

.bar-component-expanded-value {
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

.bar-component-expanded-value p {
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
}

.bar-component-expanded-edit-body {
    width: 90%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
}

.bar-component-expanded-edit-body input {
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

.bar-component-expanded-edit-body .bar-component-expanded-value {
    width: 100%;
    background-color: var(--kami-primary);
    padding-top: 5px;
}

.bar-component-expanded-edit-body .bar-component-expanded-value label {
    font-size: 1.1em;
    font-weight: bold;
    margin: 0;
    padding: 0;
    ;
    border: none;
    color: var(--kami-text);
}

.bar-component-expanded-edit-body .bar-component-expanded-value input {
    width: 95%;
    height: 2em;
    background-color: var(--kami-background);
    border: none;
    border-radius: 10px;
    outline: none;
    color: var(--kami-text);
    font-size: 1.1em;
    font-weight: bold;
    margin: 0;
    margin-bottom: 5px;
    padding: 5px;
}
</style>
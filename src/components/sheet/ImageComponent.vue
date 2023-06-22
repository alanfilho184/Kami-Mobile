<script>
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
                value: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        empty: 'O valor do atributo não pode ser vazio',
                        invalidImageURL: 'O valor do atributo deve ser um URL de imagem válido'
                    }
                }
            }
        }
    },
    mounted() {
        this.title = this.$refs['image-component'].getAttribute('title')
        this.value = this.$refs['image-component'].getAttribute('value')
        //this.config = JSON.parse(this.$refs.image-component.getAttribute('config'))
    },
    methods: {
        toggleEditMode() {
            this.visualizeMode = false
            this.editMode = true

            this.$refs['image-component-toggle-visualize-mode-button'].classList.remove('image-component-expanded-button-active')
            this.$refs['image-component-toggle-edit-mode-button'].classList.add('image-component-expanded-button-active')
        },
        toggleVisualizeMode() {
            this.visualizeMode = true
            this.editMode = false

            this.$refs['image-component-toggle-visualize-mode-button'].classList.add('image-component-expanded-button-active')
            this.$refs['image-component-toggle-edit-mode-button'].classList.remove('image-component-expanded-button-active')
        },
        validateValue() {
            const value = this.value

            if (value == '') {
                this.validationErrors.value.state = true
                this.validationErrors.value.actualMessage = this.validationErrors.value.messages.empty
            }
            else if (!value.match(/https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp)/gi)) {
                this.validationErrors.value.state = true
                this.validationErrors.value.actualMessage = this.validationErrors.value.messages.invalidImageURL
            }
            else {
                this.validationErrors.value.state = false
                this.validationErrors.value.actualMessage = ''
            }
        }
    }
}
</script>
<template>
    <div class="image-component-wrapper" ref="image-component">
        <div class="image-component" @click="expanded = true">
            <div class="image-component-value">
                <img :src="value" />
            </div>
            <div class="image-component-footer">
                <p>Clique para expandir</p>
            </div>
        </div>
        <div class="image-component-expanded" v-if="expanded">
            <div class="image-component-expanded-box">
                <div class="image-component-expanded-controls">
                    <button @click="expanded = false">Voltar</button>
                    <div class="row">
                        <button :class="visualizeMode ? 'image-component-expanded-button-active' : ''" @click="toggleVisualizeMode()"
                            ref="image-component-toggle-visualize-mode-button">Visualizar</button>
                        <button :class="editMode ? 'image-component-expanded-button-active' : ''" @click="toggleEditMode()" ref="image-component-toggle-edit-mode-button">Editar</button>
                    </div>
                    <button v-if="editMode && !visualizeMode">Salvar</button>
                </div>
                <div class="image-component-expanded-visualize-body" v-if="visualizeMode && !editMode">
                    <div class="image-component-expanded-title">
                        <h4>{{ value }}</h4>
                    </div>
                    <div class="image-component-expanded-value">
                        <img :src="value" />
                    </div>
                </div>
                <div class="image-component-expanded-edit-body" v-else-if="!visualizeMode && editMode">
                    <div class="image-component-expanded-title">
                        <input v-model="value" placeholder="Insira um URL para o atributo" @keyup="validateValue()"
                            @change="validateValue()">
                    </div>
                    <div class="image-component-expanded-value">
                        <p v-if="validationErrors.value.state">{{ validationErrors.value.actualMessage }}</p>
                        <img v-if="!validationErrors.value.state" :src="value" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.image-component {
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

.image-component-value {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 85%;
    width: 100%;
}

.image-component-value img {
    height: 96% !important;
    width: 98% !important;
    border-radius: 10px 10px 0 0;
    margin: 0 !important;
    padding: 0 !important;
}

.image-component-footer {
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

.image-component-footer p {
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

.image-component-expanded {
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

.image-component-expanded-box {
    width: 100%;
    height: fit-content !important;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.image-component-expanded-controls {
    width: 90%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.image-component-expanded-controls button {
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

.image-component-expanded-controls .row button {
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

.image-component-expanded-button-active {
    background-color: var(--kami-background) !important;
    border: 2px solid var(--kami-primary) !important;
    color: var(--kami-text) !important;
}

.image-component-expanded-visualize-body {
    width: 90%;
    height: fit-content !important;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
}

.image-component-expanded-title {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: fit-content;
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

.image-component-expanded-edit-body .image-component-expanded-value p {
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

.image-component-expanded-title h4 {
    font-size: 1.2em;
    font-weight: bold;
    margin: 0;
    width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
}

.image-component-expanded-value {
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

.image-component-expanded-value img {
    margin: 0;
    width: 85vw !important;
    border: none;
    border-radius: 10px;
}

.image-component-expanded-edit-body {
    width: 90%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
}

.image-component-expanded-edit-body input {
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

.image-component-expanded-edit-body textarea {
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
<script>
import { IonPage, IonTabs, IonRouterOutlet } from '@ionic/vue'
import { LoadWheel } from '../components/LoadWheel.vue'

export default {
    data() {
        return {
            validationErrors: {
                username: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        tooShort: 'O nome de usuário deve ter no mínimo 3 caracteres',
                        tooLong: 'O nome de usuário deve ter no máximo 32 caracteres',
                        invalidChars: 'O nome de usuário deve conter apenas letras, números e _',
                    },
                },
                avatarUrl: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        invalid: 'O URL inserido é inválido',
                    },
                },
                password: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        tooShort: 'A senha deve ter no mínimo 8 caracteres',
                    },
                },
                confirmPassword: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        notMatch: 'As senhas não conferem',
                    },
                },
            },
            patchingUser: false,
            patchError: {
                state: false,
                errors: []
            },
            patchSuccess: false,
            originalUser: {},
            userLoaded: false
        }
    },
    async beforeMount() {
        const token = await this.$storage.get('token')

        if (token == null) {
            await this.$storage.remove('user')
            this.$router.push({ name: 'Home' })
        }
        else {
            const token = await this.$storage.get('token')

            fetch(`http://localhost:3001/user?discord=true`, {
                method: 'GET',
                headers: {
                    'Authorization': token
                },
                cache: 'no-cache'
            })
                .then(async (res) => {
                    if (res.status == 200) {
                        res.json()
                            .then(data => {
                                this.originalUser = data.user

                                if (!data.user.avatar_url) {
                                    this.originalUser.avatar_url = ''
                                }

                                this.userLoaded = true
                            })
                    }
                    else {
                        await this.$storage.remove('token')
                        this.userLoaded = false
                    }
                }).catch(async (err) => {
                    await this.$storage.remove('token')
                    this.userLoaded = false
                })
        }
    },
    components: {
        IonPage,
        IonTabs,
        IonRouterOutlet,
        LoadWheel
    },
    methods: {
        async patchUser() {
            const username = this.$refs['patch-username'].value
            const password = this.$refs['patch-password'].value
            const avatarUrl = this.$refs['patch-avatar-url'].value

            if (this.validationErrors.username.state || this.validationErrors.avatarUrl.state || this.validationErrors.password.state || this.validationErrors.confirmPassword.state) {
                this.patchError.errors = [{ message: 'Corrija os erros no formulário' }]
                this.patchError.state = true
                return
            }
            else if (username === this.originalUser.username && password === '' && avatarUrl == this.originalUser.avatar_url) {
                return
            }
            else {
                this.patchingUser = true

                const token = await this.$storage.get('token')
                const response = await fetch(`http://localhost:3001/user`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify({
                        username: username === this.originalUser.username ? undefined : username,
                        avatar: avatarUrl == this.originalUser.avatar_url ? undefined : avatarUrl == '' ? null : avatarUrl,
                        password: password === '' ? undefined : password
                    })
                })

                if (response.status === 200) {
                    this.patchSuccess = true

                    this.originalUser = {
                        username: username === this.originalUser.username ? this.originalUser.username : username,
                        avatar_url: avatarUrl == this.originalUser.avatar_url ? this.originalUser.avatar_url : avatarUrl == '' ? null : avatarUrl
                    }

                    const user = await this.$storage.get('user')

                    await this.$storage.set('user', {
                        ...user,
                        username: username === this.originalUser.username ? this.originalUser.username : username,
                        avatar_url: avatarUrl == this.originalUser.avatar_url ? this.originalUser.avatar_url : avatarUrl == '' ? null : avatarUrl
                    })

                    this.$root.$refs['nav-bar'].loadUser()
                }
                else if (response.status === 400) {
                    const data = await response.json()

                    this.patchError.errors = data.invalidFields
                    this.patchError.state = true
                }
                else {
                    this.patchError.errors = [{ message: 'Erro desconhecido, tente novamente mais tarde' }]
                    this.patchError.state = true
                }

                this.patchingUser = false
            }
        },
        validateUsername() {
            this.$refs['patch-username'].value = this.$refs['patch-username'].value.trim()
            const username = this.$refs['patch-username'].value

            if (username === this.originalUser.username) {
                this.$refs['patch-username'].style.border = '2px solid var(--background)'
                this.validationErrors.username.actualMessage = ''
                this.validationErrors.username.state = false
                return
            }

            if (username.length < 3) {
                this.validationErrors.username.state = true
                this.validationErrors.username.actualMessage = this.validationErrors.username.messages.tooShort
                this.$refs['patch-username'].style.border = '2px solid red'
            }
            else if (username.length > 32) {
                this.validationErrors.username.state = true
                this.validationErrors.username.actualMessage = this.validationErrors.username.messages.tooLong
                this.$refs['patch-username'].style.border = '2px solid red'
            }
            else if (!username.match(/^[a-zA-Z0-9_]+$/)) {
                this.validationErrors.username.state = true
                this.validationErrors.username.actualMessage = this.validationErrors.username.messages.invalidChars
                this.$refs['patch-username'].style.border = '2px solid red'
            }
            else {
                this.$refs['patch-username'].style.border = '2px solid var(--background)'
                this.validationErrors.username.actualMessage = ''
                this.validationErrors.username.state = false
            }
        },
        validateAvatarUrl() {
            this.$refs['patch-avatar-url'].value = this.$refs['patch-avatar-url'].value.trim()
            const avatarUrl = this.$refs['patch-avatar-url'].value

            if (!avatarUrl) {
                this.$refs['patch-avatar-url'].style.border = '2px solid var(--background)'
                this.validationErrors.avatarUrl.actualMessage = ''
                this.validationErrors.avatarUrl.state = false
                return
            }

            if (!avatarUrl.match(/(https?:\/\/.*.(?:png|jpg|jpeg|webp|gif|gifv))/i)) {
                this.validationErrors.avatarUrl.state = true
                this.validationErrors.avatarUrl.actualMessage = this.validationErrors.avatarUrl.messages.invalid
                this.$refs['patch-avatar-url'].style.border = '2px solid red'
            }
            else {
                this.$refs['patch-avatar-url'].style.border = '2px solid var(--background)'
                this.validationErrors.avatarUrl.actualMessage = ''
                this.validationErrors.avatarUrl.state = false
            }
        },
        validatePassword() {
            const password = this.$refs['patch-password'].value

            if (!password) {
                this.$refs['patch-password'].style.border = '2px solid var(--background)'
                this.validationErrors.password.actualMessage = ''
                this.validationErrors.password.state = false
                return
            }

            if (password.length < 8) {
                this.validationErrors.password.state = true
                this.validationErrors.password.actualMessage = this.validationErrors.password.messages.tooShort
                this.$refs['patch-password'].style.border = '2px solid red'
            }
            else {
                this.$refs['patch-password'].style.border = '2px solid var(--background)'
                this.validationErrors.password.actualMessage = ''
                this.validationErrors.password.state = false
            }
        },
        validateConfirmPassword() {
            const password = this.$refs['patch-password'].value
            const confirmPassword = this.$refs['patch-confirm-password'].value

            if (!password) {
                this.$refs['patch-confirm-password'].style.border = '2px solid var(--background)'
                this.validationErrors.confirmPassword.actualMessage = ''
                this.validationErrors.confirmPassword.state = false
                return
            }

            if (password !== confirmPassword) {
                this.validationErrors.confirmPassword.state = true
                this.validationErrors.confirmPassword.actualMessage = this.validationErrors.confirmPassword.messages.notMatch
                this.$refs['patch-confirm-password'].style.border = '2px solid red'
            }
            else {
                this.$refs['patch-confirm-password'].style.border = '2px solid var(--background)'
                this.validationErrors.confirmPassword.actualMessage = ''
                this.validationErrors.confirmPassword.state = false
            }
        },
        returnFields() {
            this.patchError.state = false
            this.patchError.message = ''
            this.patchSuccess = false

            setTimeout(() => {
                this.$refs['patch-username'].value = this.originalUser.username
                this.$refs['patch-avatar-url'].value = this.originalUser.avatar_url

                this.validateUsername()
                this.validateAvatarUrl()
                this.validatePassword()
                this.validateConfirmPassword()
            }, 100)
        }
    },
    watch: {
        userLoaded() {
            if (this.userLoaded) {
                setTimeout(() => {
                    this.$refs['patch-username'].value = this.originalUser.username
                    this.$refs['patch-avatar-url'].value = this.originalUser.avatar_url

                    this.validateUsername()
                    this.validateAvatarUrl()
                }, 100)
            }
        }
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
                    <div class="config-container" v-if="userLoaded">
                        <div class="config-header" v-if="!patchingUser && !patchError.state && !patchSuccess">
                            <h1>Configurações</h1>
                        </div>
                        <div class="config-header" v-else-if="patchingUser && !patchError.state && !patchSuccess">
                            <h1>Carregando...</h1>
                            <LoadWheel class="loading secondary-loading" v-if="patchingUser && !patchError.state && !patchSuccess" />
                        </div>
                        <div class="config-header" v-else-if="!patchingUser && !patchError.state && patchSuccess">
                            <h1>Informações atualizadas com sucesso</h1>
                            <button @click="returnFields()">Ok</button>
                        </div>
                        <div class="config-header" v-else-if="!patchingUser && patchError.state && !patchSuccess">
                            <h1 v-for="error in patchError.errors" :key="error">{{ error.message }}</h1>
                            <button @click="returnFields()">Ok</button>
                        </div>
                        <div class="config-body" v-if="!patchingUser && !patchError.state && !patchSuccess">
                            <div class="config-item">
                                <label>Nome de usuário</label>
                                <input type="text" id="name" placeholder="Insira um nome de usuário" ref="patch-username"
                                    @keyup="validateUsername()" @change="validateUsername()" />
                                <p ref="patch-username-error-message" v-if="validationErrors.username.state">{{
                                    validationErrors.username.actualMessage }}</p>
                            </div>
                            <div class="config-item">
                                <label>URL para foto de perfil</label>
                                <input type="url" id="avatar-url" placeholder="Insira um URL para foto de perfil"
                                    ref="patch-avatar-url" @keyup="validateAvatarUrl()" @change="validateAvatarUrl()" />
                                <p ref="patch-avatarUrl-error-message" v-if="validationErrors.avatarUrl.state">{{
                                    validationErrors.avatarUrl.actualMessage }}</p>
                            </div>
                            <div class="config-item">
                                <label>Nova senha</label>
                                <input type="password" id="password" placeholder="Insira uma senha" ref="patch-password"
                                    @keyup="validatePassword(); validateConfirmPassword()"
                                    @change="validatePassword(); validateConfirmPassword()" />
                                <p ref="patch-password-error-message" v-if="validationErrors.password.state">{{
                                    validationErrors.password.actualMessage }}</p>
                            </div>
                            <div class="config-item">
                                <label>Confirmar a nova senha</label>
                                <input type="password" id="confirm-password" placeholder="Confirme sua nova senha"
                                    ref="patch-confirm-password" @keyup="validateConfirmPassword(); validatePassword()"
                                    @change="validateConfirmPassword(); validatePassword()" />
                                <p ref="patch-confirm-password-error-message" v-if="validationErrors.confirmPassword.state">
                                    {{ validationErrors.confirmPassword.actualMessage }}</p>
                            </div>
                        </div>
                        <div class="config-controls" v-if="!patchingUser && !patchError.state && !patchSuccess">
                            <button class="config-button" @click="patchUser()">Salvar Alterações</button>
                        </div>
                    </div>
                    <LoadWheel class="loading" v-else />
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
    margin-top: 20px;
}

.config-header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: max-content;
    border-bottom: 2px solid var(--kami-background);
    text-align: center;
}

.config-header h1 {
    font-size: 1.5rem;
    font-weight: 700;
}

.config-header button {
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
    font-weight: 700;
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

.loading {
    width: 3em;
    height: 3em;
    border-color: var(--kami-primary) transparent
}

.secondary-loading {
    border-color: var(--kami-background) transparent;
    margin-bottom: 5px;
}
</style>
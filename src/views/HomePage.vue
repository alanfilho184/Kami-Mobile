<script>
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonTabs, IonRouterOutlet } from '@ionic/vue';
import LoadWheel from '../components/LoadWheel.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginPage',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonTabs,
    IonRouterOutlet,
    LoadWheel
  },
  data() {
    return {
      loginVisible: false,
      registerVisible: false,
      login: true,
      register: false,
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
        email: {
          state: false,
          actualMessage: '',
          messages: {
            invalid: 'O email inserido é inválido',
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
      makingLogin: false,
      registeringUser: false,
      loginError: {
        state: false,
        message: ''
      },
      registerError: {
        state: false,
        errors: []
      },
      registerTextValue: {
        username: '',
        email: '',
      },
      registerSuccess: false,
    }
  },
  methods: {
    async makeLogin() {
      this.makingLogin = true
      const email = this.$refs['login-email'].value
      const password = this.$refs['login-password'].value

      if (email == '' || password == '') {
        this.loginError.state = true
        this.loginError.message = 'Email e senha são obrigatórios'
        this.makingLogin = false
        return
      }
      else {
        const response = await fetch(`${'http://localhost:3001' /*config.API_URI*/}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        })

        if (response.status === 200) {
          const data = await response.json()
          await this.$storage.set('token', data.token)
          //socket.emit('login', { token: data.token })

          this.makingLogin = false
          this.$router.push({ name: 'Dashboard' })
        }
        else if (response.status === 400) {
          this.loginError.state = true
          this.loginError.message = 'Email ou senha faltando'
          this.makingLogin = false
          return
        }
        else if (response.status === 401) {
          this.loginError.state = true
          this.loginError.message = 'Senha incorreta'
          this.makingLogin = false
          return
        }
        else if (response.status === 404) {
          this.loginError.state = true
          this.loginError.message = 'Email não encontrado'
          this.makingLogin = false
          return
        }
        else {
          this.loginError.state = true
          this.loginError.message = 'Erro desconhecido, tente novamente mais tarde'
          this.makingLogin = false
          return
        }
      }
    },
    async registerUser() {
      this.registeringUser = true
      const username = this.$refs['register-username'].value
      const email = this.$refs['register-email'].value
      const password = this.$refs['register-password'].value
      const confirmPassword = this.$refs['register-confirm-password'].value

      if (username == '' || email == '' || password == '' || confirmPassword == '') {
        this.registerError.state = true
        this.registerError.errors.push('Todos os campos são obrigatórios')
        this.registeringUser = false
        return
      }
      else if (this.validationErrors.username.state || this.validationErrors.email.state || this.validationErrors.password.state || this.validationErrors.confirmPassword.state) {
        this.registerError.state = true
        this.registerError.errors.push('Verifique os campos')
        this.registeringUser = false
        return
      }
      else {
        const response = await fetch(`${'http://localhost:3001' /*config.API_URI*/}/user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            email: email,
            password: password,
          }),
        })

        if (response.status === 201) {
          this.registerSuccess = true
          this.registeringUser = false
          return
        }
        else if (response.status === 400) {
          const data = await response.json()
          this.registerError.state = true
          this.registerError.errors = data.invalidFields
          this.registeringUser = false
          return
        }
        else {
          this.registerError.state = true
          this.registerError.errors.push('Erro desconhecido, tente novamente mais tarde')
          this.registeringUser = false
          return
        }
      }
    },
    toggleRegister() {
      if (this.registerVisible) {
        this.registerVisible = false;
        this.loginVisible = false;
      } else {
        this.registerVisible = true;
        this.loginVisible = false;
      }
    },
    toggleLogin() {
      if (this.loginVisible) {
        this.registerVisible = false;
        this.loginVisible = false;
      } else {
        this.registerVisible = false;
        this.loginVisible = true;
      }
    },
    validateUsername() {
      const username = this.$refs['register-username'].value

      if (username.length < 3) {
        this.validationErrors.username.state = true
        this.validationErrors.username.actualMessage = this.validationErrors.username.messages.tooShort
        this.$refs['register-username'].style.border = '2px solid red'
      }
      else if (username.length > 32) {
        this.validationErrors.username.state = true
        this.validationErrors.username.actualMessage = this.validationErrors.username.messages.tooLong
        this.$refs['register-username'].style.border = '2px solid red'
      }
      else if (!username.match(/^[a-zA-Z0-9_]+$/)) {
        this.validationErrors.username.state = true
        this.validationErrors.username.actualMessage = this.validationErrors.username.messages.invalidChars
        this.$refs['register-username'].style.border = '2px solid red'
      }
      else {
        this.$refs['register-username'].style.border = '2px solid var(--background)'
        this.validationErrors.username.actualMessage = ''
        this.validationErrors.username.state = false
      }

      this.registerTextValue.username = username
    },
    validateEmail() {
      const email = this.$refs['register-email'].value

      if (!email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)) {
        this.validationErrors.email.state = true
        this.validationErrors.email.actualMessage = this.validationErrors.email.messages.invalid
        this.$refs['register-email'].style.border = '2px solid red'
      }
      else {
        this.$refs['register-email'].style.border = '2px solid var(--background)'
        this.validationErrors.email.actualMessage = ''
        this.validationErrors.email.state = false
      }

      this.registerTextValue.email = email
    },
    validatePassword() {
      const password = this.$refs['register-password'].value

      if (password.length < 8) {
        this.validationErrors.password.state = true
        this.validationErrors.password.actualMessage = this.validationErrors.password.messages.tooShort
        this.$refs['register-password'].style.border = '2px solid red'
      }
      else {
        this.$refs['register-password'].style.border = '2px solid var(--background)'
        this.validationErrors.password.actualMessage = ''
        this.validationErrors.password.state = false
      }
    },
    validateConfirmPassword() {
      const password = this.$refs['register-password'].value
      const confirmPassword = this.$refs['register-confirm-password'].value

      if (password !== confirmPassword) {
        this.validationErrors.confirmPassword.state = true
        this.validationErrors.confirmPassword.actualMessage = this.validationErrors.confirmPassword.messages.notMatch
        this.$refs['register-confirm-password'].style.border = '2px solid red'
      }
      else {
        this.$refs['register-confirm-password'].style.border = '2px solid var(--background)'
        this.validationErrors.confirmPassword.actualMessage = ''
        this.validationErrors.confirmPassword.state = false
      }
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  },
  beforeMount() {
    this.$storage.get('token').then(async (token) => {
      if (token) {
        await this.sleep(200)
        this.$router.push({ name: 'Dashboard' })
      }
    })
  },
  watch: {
    $route(to, from) {
      if (to.name == 'Home') {
        this.$storage.get('token').then(async (token) => {
          if (token) {
            await this.sleep(200)
            this.$router.push({ name: 'Dashboard' })
          }
        })
      }
    }
  }
};
</script>

<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-header class="header" collapse="condense">
        <div class="toolbar">
          <h1 class="header-title">Entrar</h1>
        </div>
      </ion-header>

      <ion-content :fullscreen="true">
        <div id="container">
          <img src="../assets/logo.png" />
          <div class="login-form" v-if="loginVisible">
            <div class="login-header" v-if="!makingLogin && !loginError.state">
              <h1>Acesse sua conta</h1>
            </div>
            <div class="login-header" v-else-if="makingLogin && !loginError.state">
              <h1>Carregando...</h1>
            </div>
            <div class="login-header" v-else>
              <h1>{{ loginError.message }}</h1>
              <button @click="loginError.state = false; loginError.message = ''">Ok</button>
            </div>
            <div class="login-body" v-if="!makingLogin && !loginError.state">
              <div class="login-item">
                <label>Email</label>
                <input type="email" ref="login-email" />
              </div>
              <div class="login-item">
                <label>Senha</label>
                <input type="password" ref="login-password" />
              </div>
              <div class="toggle-buttons">
                <button @click=" makeLogin()">Entrar</button>
                <button @click=" toggleLogin()">Voltar</button>
              </div>
            </div>
            <LoadWheel v-else-if="makingLogin && !loginError.state" />
          </div>
          <div class="register-form" v-else-if="registerVisible">
            <div class="register-header" v-if="!registeringUser && !registerError.state && !registerSuccess">
              <h1>Crie sua conta</h1>
            </div>
            <div class="register-header" v-else-if="registeringUser && !registerError.state && !registerSuccess">
              <h1>Carregando...</h1>
            </div>
            <div class="register-header" v-else-if="!registeringUser && registerError.state && !registerSuccess">
              <h1>Erro ao criar conta</h1>
              <p v-for="           error           in           registerError.errors           " :key="error">{{
                error.message
              }}
              </p>
              <button @click=" registerError.state = false; registerError.errors = []">Ok</button>
            </div>
            <div class="register-header" v-else-if="!registeringUser && !registerError.state && registerSuccess">
              <h1>Conta criada com sucesso!</h1>
              <button @click=" registerSuccess = false; registerVisible = false; loginVisible = true">Ok</button>
            </div>
            <div class="register-body" v-if="!registeringUser && !registerError.state && !registerSuccess">
              <div class="register-item">
                <label>Nome de usuário</label>
                <input type="text" ref="register-username" @input=" validateUsername()"
                  :value="registerTextValue.username" />
                <p v-if="validationErrors.username.state">{{ validationErrors.username.actualMessage }}</p>
              </div>
              <div class="register-item">
                <label>Email</label>
                <input type="email" ref="register-email" @input=" validateEmail()" :value="registerTextValue.email" />
                <p v-if="validationErrors.email.state">{{ validationErrors.email.actualMessage }}</p>
              </div>
              <div class="register-item">
                <label>Senha</label>
                <input type="password" ref="register-password" @input=" validatePassword()" />
                <p v-if="validationErrors.password.state">{{ validationErrors.password.actualMessage }}</p>
              </div>
              <div class="register-item">
                <label>Confirmar senha</label>
                <input type="password" ref="register-confirm-password" @input=" validateConfirmPassword()" />
                <p v-if="validationErrors.confirmPassword.state">{{ validationErrors.confirmPassword.actualMessage }}
                </p>
              </div>
              <div class="toggle-buttons">
                <button @click=" toggleRegister()">Voltar</button>
                <button @click=" registerUser()">Criar conta</button>
              </div>
            </div>
            <LoadWheel v-else-if="registeringUser && !registerError.state && !registerSuccess" />
          </div>
          <div class="toggle-buttons" v-else>
            <button @click=" toggleLogin()">Entrar</button>
            <button @click=" toggleRegister()">Criar nova conta</button>
            <p>Utilize uma conta para que possamos guardar suas fichas, campanhas e etc</p>
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

#container p {
  width: 90%;
  text-align: center;
}

#container img {
  width: 50%;
  margin: 5px;
}

.header {
  border-bottom: 2px solid var(--kami-primary);
  background-color: var(--kami-background);
}

.header-title {
  font-size: 1.5em;
}

.toggle-buttons,
.login-form,
.register-form,
.login-body,
.register-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.login-header,
.register-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90%;
  text-align: center;
}

.login-header h1,
.register-header h1 {
  font-size: 1.5em;
  font-weight: bold;
  margin: 10px;
}

.login-header button,
.register-header button {
  margin: 10px;
  background-color: var(--kami-primary);
  color: var(--kami-text);
  border-radius: 0.5em;
  width: 80%;
  height: 2.5em;
  font-size: 1.2em;
  font-weight: bold;
}

.login-item,
.register-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80%;
  margin: 10px;
}

.login-item label,
.register-item label {
  font-size: 1.2em;
  font-weight: bold;
  align-self: flex-start;
  margin-left: 10px;
}

.login-item input,
.register-item input {
  width: 100%;
  height: 3em;
  border-radius: 0.5em;
  border: 1px solid var(--kami-primary);
  margin: 5px;
  padding: 5px;
}

.loading {
  width: 4em;
  height: 4em;
  border-color: var(--kami-primary) transparent
}

.toggle-buttons button {
  margin: 10px;
  background-color: var(--kami-primary);
  color: var(--kami-text);
  border-radius: 0.5em;
  width: 80%;
  height: 2.5em;
  font-size: 1.2em;
  font-weight: bold;
}

.toggle-buttons button:active {
  background-color: var(--kami-primary);
}
</style>

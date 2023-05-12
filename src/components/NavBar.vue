<script>
const signedRoutes = ['Dashboard', 'Sheets', 'Macros', 'Campaigns', 'Sheet', 'Config']

export default {
    data() {
        return {
            sign: this.$storage.get('token') != null,
            userLoaded: false,
            user: {},
            signedRoute: false,
            collapsed: false
        }
    },
    methods: {
        toggleMenuMobile(action) {
            try {
                if (action == 'open') {
                    this.$refs['menu-toggle'].checked = true
                }
                else {
                    this.$refs['menu-toggle'].checked = false
                }
            } catch (err) {
                //ignore
            }
        },
        async loadUser() {
            const token = await this.$storage.get('token')
            this.sign = token != null

            if (this.sign) {
                fetch(`http://localhost:3001/user`, {
                    method: 'GET',
                    headers: {
                        'Authorization': token
                    },
                    cache: 'default'
                })
                    .then(async (res) => {
                        if (res.status == 200) {
                            res.json()
                                .then(async data => {
                                    this.user = data.user
                                    await this.$storage.set('user', data.user)
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
        }
    },
    watch: {
        async $route() {
            if (signedRoutes.includes(this.$route.name)) {
                this.signedRoute = true
            }
            else {
                this.signedRoute = false
            }

            await this.loadUser()
        },
    },
    beforeMount() {
        if (signedRoutes.includes(this.$route.name)) {
            this.signedRoute = true
        }
        else {
            this.signedRoute = false
        }

        this.loadUser()
    },
}
</script>
<template>
    <div id="nav-bar-mobile" ref="menu-mobile">
        <div id="menu-toggle">
            <input type="checkbox" ref="menu-toggle" />
            <span></span>
            <span></span>
            <span></span>

            <ul id="menu-content">
                <li><router-link to="/">Início</router-link></li>
                <li><router-link to="/comandos">Comandos</router-link></li>
                <li><router-link to="/tutoriais">Tutoriais</router-link></li>
                <li><router-link to="/convite">Adicione o Kami</router-link></li>
                <li v-if="!sign || !userLoaded"><router-link to="/login">Login</router-link></li>
                <li v-else-if="sign && userLoaded">
                    <div class="mobile-sign-menu">
                        <div class="mobile-user-profile">
                            <img :src="user.avatar_url ? user.avatar_url : `https://ui-avatars.com/api/?name=${user.username}`"
                                class="mobile-user-avatar">
                            <h5 class="mobile-username">{{ user.username }}</h5>
                        </div>
                        <div class="mobile-sign-menu-content">
                            <router-link to="/dashboard">Dashboard</router-link>
                            <router-link to="/fichas">Fichas</router-link>
                            <router-link to="/campanhas">Campanhas</router-link>
                            <router-link to="/macros">Macros</router-link>
                            <router-link to="/logout" cancel="true">Sair</router-link>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<style>
#nav-bar-mobile .user-profile {
    display: grid;
    grid-template-columns: 25% 75%;
    gap: 0px 0px;
    justify-content: center;
    align-content: center;
    justify-items: center;
    align-items: center;
    width: 100%;
    height: 45px;
    margin: 0;
    padding: 0px 5px 0px 5px;
    min-width: 160px;
}

#nav-bar-mobile .user-profile .user-avatar {
    width: 35px;
    height: 35px;
    border: 2px solid var(--kami-background);
    border-radius: 50%;
    background-color: var(--kami-background);
    margin: 0;
    padding: 0;
}

#nav-bar-mobile .user-profile .username {
    position: absolute;
    top: 14px;
    right: 0px;
    font-size: 1em;
    max-width: 115px;
    vertical-align: middle;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    margin: 0;
    padding: 0;
}

#nav-bar-mobile {
    display: flex;
    margin-left: 20px;
    height: 44px;
    z-index: 3;
}

#menu-toggle {
    display: flex;
    flex-direction: column;
    position: relative;
    top: 1em;
    left: 0em;
    z-index: 1;
    -webkit-user-select: none;
    user-select: none;
    z-index: 3;
}

#menu-toggle input {
    display: flex;
    width: 40px;
    height: 32px;
    position: absolute;
    cursor: pointer;
    opacity: 0;
    z-index: 2;
}

#menu-toggle span {
    display: flex;
    width: 2em;
    height: 4px;
    margin-bottom: 5px;
    position: relative;
    background: var(--kami-primary);
    border-radius: 3px;
    z-index: 1;
    transform-origin: 5px 0px;
    transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1.0),
        background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1.0),
        opacity 0.55s ease;
}

#menu-toggle span:first-child {
    transform-origin: 0% 0%;
}

#menu-toggle span:nth-last-child(2) {
    transform-origin: 0% 100%;
}

#menu-toggle input:checked~span {
    opacity: 1;
    transform: rotate(45deg) translate(-3px, -1px);
    background: var(--kami-background);
}

#menu-toggle input:checked~span:nth-last-child(3) {
    opacity: 0;
    transform: rotate(0deg) scale(0.2, 0.2);
}

#menu-toggle input:checked~span:nth-last-child(2) {
    transform: rotate(-45deg) translate(0, -1px);
}

#menu-content {
    position: absolute;
    box-shadow: 0 0 10px var(--kami-background);
    margin: -50px 0 0 -50px;
    padding: 6em 30px 1em 50px;
    background-color: var(--kami-primary);
    transform-origin: 0% 0%;
    transform: translate(-100%, 0);
    transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1.0);
    border-radius: 10px;
    list-style-type: none;
    width: 15em;
}

#menu-content li {
    padding: 10px 0;
    transition-delay: 2s;
}

#menu-content li a {
    font-size: 1.5em;
    color: var(--kami-text);
    font-weight: bold;
    text-decoration: none;
}

#menu-toggle input:checked~ul {
    transform: none;
}

.mobile-sign-menu {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 5px;
    background-color: var(--kami-background);
    border-radius: 10px;
}

.mobile-sign-menu .mobile-user-profile {
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}

.mobile-sign-menu .mobile-user-profile .mobile-user-avatar {
    width: 35px;
    height: 35px;
    border: 2px solid var(--kami-text);
    border-radius: 50%;
    margin: 5px;
    padding: 0;
}

.mobile-sign-menu .mobile-user-profile .mobile-username {
    font-size: 1em;
    max-width: 115px;
    vertical-align: middle;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    margin: 0;
    margin-left: 5px;
    padding: 0;
    color: var(--kami-text);
}

.mobile-sign-menu-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    margin: 0;
    margin-left: 10px;
    padding: 0;
}

.mobile-sign-menu-content a {
    margin: 5px 0px 5px 0px;
}

.mobile-sign-menu-content a[cancel="true"] {
    color: var(--cancel-secondary) !important;
}
</style>
<script>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import NavBar from './components/NavBar.vue';

export default {
  components: {
    IonApp,
    IonRouterOutlet,
    NavBar
  },
  data() {
    return {}
  },
  mounted() {
    let touchstartX = 0;
    let touchstartY = 0;
    let touchendX = 0;
    let touchendY = 0;

    const navBar = this.$refs['nav-bar']

    window.addEventListener('touchstart', (event) => {
      touchstartX = event.changedTouches[0].screenX;
      touchstartY = event.changedTouches[0].screenY;
    })

    window.addEventListener('touchend', (event) => {
      touchendX = event.changedTouches[0].screenX;
      touchendY = event.changedTouches[0].screenY;

      const x = touchendX - touchstartX;
      const y = touchendY - touchstartY;

      if (Math.abs(x) > Math.abs(y)) {
        if (x > 0) {
          navBar.toggleMenuMobile('open')
        } else {
          navBar.toggleMenuMobile('close')
        }
      }
    })

    function isDescendant(parent, child) {
      let node = child.parentNode;
      while (node != null) {
        if (node == parent) {
          return true;
        }
        node = node.parentNode;
      }
      return false;
    }

    document.addEventListener('click', function (e) {
      const target = e.target

      if (!isDescendant(navBar.$refs['menu-mobile'], target)) {
        navBar.toggleMenuMobile('close')
      }
    }, false);
  }
}
</script>

<template>
  <ion-app>
    <NavBar ref="nav-bar" />
    <ion-router-outlet />
  </ion-app>
</template>

<style>
.tabs-inner {
  display: none !important;
}
</style>
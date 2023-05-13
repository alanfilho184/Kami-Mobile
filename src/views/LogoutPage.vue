<script>
export default {
    async beforeMount() {
        await this.$storage.remove('token')
        await this.$storage.remove('user')
        this.$router.push({ name: 'Home' })
    }
}
</script>
<template>
   <div id="Logout"></div>
</template>
<style></style>
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
    <div class="loading"></div>
</template>
<style></style>
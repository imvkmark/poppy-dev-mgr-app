<template>
    <header>
        <h1>{{ title }}</h1>
    </header>
</template>

<script lang="ts" setup>
const props = defineProps({
    title: {
        type: String,
        default: ''
    }
})
</script>

<style lang="less" scoped>
header {
    height: 40px;
    display: flex;
    align-items: center;
    h1 {
        font-size: 22px;
        margin: 0;
        padding: 0;
    }
}
</style>

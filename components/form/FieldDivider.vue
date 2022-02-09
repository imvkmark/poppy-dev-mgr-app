<template>
    <div class="form-divider">
        <span>{{ label }}</span>
    </div>
</template>
<script lang="ts" setup>

const props = defineProps({
    label: String
})
</script>

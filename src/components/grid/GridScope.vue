<template>
    <ElTabs :model-value="scope" v-if="scopes.length" @update:model-value="onUpdateScope">
        <ElTabPane :label="get(item, 'label')" :name="get(item, 'value')" v-for="item in scopes" :key="get(item, 'value')"/>
    </ElTabs>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { get } from "lodash-es";

const props = defineProps({
    scope: {
        type: String,
        default: ''
    },
    scopes: {
        type: Array,
        default: () => {
            return []
        }
    }
})
const disabled = ref(false);

const emits = defineEmits([
    'update:scope'
])

const onUpdateScope = (val: string) => {
    emits('update:scope', val)
}

</script>
<style lang="less" scoped>
.text-ellipsis {
    cursor: pointer;
}

</style>

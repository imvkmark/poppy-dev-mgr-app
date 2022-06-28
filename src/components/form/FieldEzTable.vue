<template>
    <ElTable :data="ezData" border stripe>
        <ElTableColumn v-for="(title, hk) in ezHeader" :prop="hk" :key="hk" :label="title">
            <template #default="{row}">
                <template v-if="!isObjectLike(get(row, hk))">{{ get(row, hk) }}</template>
                <FieldEzTableImage v-else-if="get(get(row, hk), 'type') === 'image'" :value="get(get(row, hk), 'value')"/>
            </template>
        </ElTableColumn>
    </ElTable>
</template>
<script lang="ts" setup>
import { first, get, isObjectLike, slice } from 'lodash-es';
import { computed } from "vue";
import FieldEzTableImage from "@/components/form/FieldEzTableImage.vue";

const c = console;

const props = defineProps({
    attr: Object
})

const ezHeader = computed(() => {
    return first(get(props.attr, 'data'))
})
const ezData = computed(() => {
    return slice(get(props.attr, 'data'), 1)
})
</script>

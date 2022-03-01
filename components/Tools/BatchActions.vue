<template>
    <template v-for="item in items" :key="item">
        <ElButton @click="doRequest(item)" :plain="get(item, 'plain', false)"
            :type="get(item, 'type', 'default')"
            :circle="get(item, 'circle', false)"
            :icon="get(item, 'icon', '') ? get(icon, upperCamelCase(get(item, 'icon'))) : null"
            :loading="get(trans.loading, base64Encode(get(item, 'url')), false)"
            :disabled="!(keys(append).length > 0)">
            <template #default v-if="!get(item, 'only', false)">
                {{ get(item, 'title', '') }}
            </template>
        </ElButton>
    </template>
</template>
<script lang="ts" setup>
import { get, keys, set } from "lodash-es";
import { icon } from "@/framework/utils/icon";
import { base64Encode, upperCamelCase } from "@/framework/utils/helper";
import { computed, reactive } from "vue";
import { useStore } from "@/store";

const props = defineProps({
    items: {
        type: Array,
        default: () => {
            return []
        }
    },
    append: {
        type: Object,
        default: () => {
            return {}
        }
    }
})

const store = useStore();

const trans = reactive({
    loading: computed(() => store.state.poppy.running),
})
const doRequest = (item: any) => {
    set(item, 'params', props.append);
    store.dispatch('poppy/SetRequest', item);
}


</script>
<style lang="less" scoped>
.main-batch-actions {
    padding-bottom: 0.5rem;
}
</style>

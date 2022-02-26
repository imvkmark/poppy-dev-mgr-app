<template>
    <div class="main-actions">
        <template v-for="item in items" :key="item">
            <ElButton @click="doRequest(item)" :plain="get(item, 'plain', false)"
                :type="get(item, 'type', 'default')"
                :circle="get(item, 'circle', false)"
                :icon="get(item, 'icon', '') ? get(icon, upperCamelCase(get(item, 'icon'))) : null"
                :loading="trans.button === base64Encode(get(item, 'url'))"
                :disabled="get(item, 'disabled', false)">
                <template #default v-if="!get(item, 'only', false)">
                    {{ get(item, 'title', '') }}
                </template>
            </ElButton>
        </template>
    </div>
</template>
<script lang="ts" setup>
import { get } from "lodash-es";
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
    }
})

const store = useStore();

const trans = reactive({
    button: computed(() => store.state.poppy.requestBtnKey),
})
const doRequest = (item: any) => {
    store.commit('poppy/SET_REQUEST', item);
}


</script>
<style lang="less" scoped>

</style>

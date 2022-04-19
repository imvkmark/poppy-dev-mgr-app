<template>
    <ElCard class="cp-card">
        <template #header>
            <div class="card-header">
                配置检测
                <div class="cp-action">
                    <ElButton :icon="Refresh" circle plain size="small" @click="checkSetting"></ElButton>
                </div>
            </div>
        </template>
        <template #default>
            <ElScrollbar>
                <div v-loading="trans.loading" v-if="trans.data.length" class="checker">
                    <template v-for="setting in trans.data" :key="setting">
                        <h3>{{ get(setting, 'title') }}</h3>
                        <ul>
                            <li v-for="con in get(setting, 'content')" :key="con" :class="get(con, 'type')">
                                {{ get(con, 'title') }}
                            </li>
                        </ul>
                    </template>
                </div>
                <div class="box-center checker-null" v-else>
                    <span v-if="trans.checked" class="check-passed">已通过</span>
                    <span v-else>未检测</span>
                </div>
            </ElScrollbar>
        </template>
    </ElCard>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { Refresh } from "@element-plus/icons-vue";
import { apiMgrDevConfigCheck } from "../../services/api/mgr-dev";
import { reactive, ref } from "vue";
import { get } from "lodash-es"
import { toast } from "../../services/utils/util";

const router = useRouter();
const trans = reactive({
    loading: false,
    checked: false,
    data: [],
})
const loading = ref(false);
const checkSetting = () => {
    trans.loading = true;
    apiMgrDevConfigCheck().then(({ success, data, message }) => {
        trans.loading = false;
        trans.checked = true;
        if (success) {
            trans.data = [];
            toast(message, success);
        } else {
            trans.data = data;
        }
    });
};

</script>

<style lang="less" scoped>
.checker {
    h3 {
        font-size: 16px;
        line-height: 22px;
        margin: 0.5rem;
    }
    ul {
        padding-left: 1rem;
        margin: 0.5rem 0;
    }
    li {
        font-size: 14px;
        list-style: none;
        &.error {
            color: var(--wc-color-danger);
        }
        &.warning {
            color: var(--wc-color-warning);
        }
    }
}

.checker-null {
    font-size: 16px;
    color: var(--wc-help-color)
}

.check-passed {
    color: var(--wc-color-success);
}

.box-center {
    min-height: 400px;
}
</style>

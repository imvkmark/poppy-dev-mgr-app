<template>
    <ElCard class="ele-card">
        <template #header>
            <div class="card-header">
                用户信息
            </div>
        </template>
        <template #default>
            用户ID: {{ get(user, 'user.id') }} <br>
            用户姓名 : {{ get(user, 'user.username') }} <br>
            创建时间 : {{ get(user, 'user.created_at') }} <br>
        </template>
    </ElCard>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { computed, ref } from "vue";
import { get } from "lodash-es"
import { useStore } from "@/store";

const router = useRouter();
const store = useStore();
const user = ref({
    user: computed(() => store.state.poppy.user)
});
const loading = ref(false);
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

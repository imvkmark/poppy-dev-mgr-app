<template>
    <div class="login">
        <ElRow>
            <ElCol :span="12" :offset="6">
                <div class="logo">
                    <img src="@/assets/images/logo.png" alt="Wulicode">
                    <h4>Wulicode</h4>
                    <p>
                        用户信息 <br>
                        {{ get(info, 'user.id') }} <br>
                        {{ get(info, 'user.username') }} <br>
                        {{ get(info, 'user.created_at') }} <br>
                    </p>
                    <el-button @click="userLogout">退出登录</el-button>
                </div>
            </ElCol>
        </ElRow>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useStore } from '@/services/store';
import { useRouter } from 'vue-router';
import { get } from 'lodash-es';
import useUserUtil from '@/services/composables/useUserUtil';

const store = useStore();
const router = useRouter();
const info = ref({
    user: computed(() => store.state.poppy.user)
});
const { userLogout } = useUserUtil();

</script>

<style scoped lang="less">

.login {
    .logo {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 55px;
        img {
            width: 55px;
        }
        h4 {
            height: 40px;
            line-height: 40px;
            font-size: 18px;
            color: var(--wc-color-text);
            text-align: center;
            margin: 0;
        }
        p {
            font-size: 12px;
            color: var(--wc-text-color);
            text-align: center;
            margin-top: 0;
        }
    }
    .btn {
        padding: 32px 16px 0;
        .van-button {
            height: 46px;
            opacity: 1;
            background: linear-gradient(90deg, #C5681C, #BB0A59);
            border-radius: 47px;
            color: #FFF;
        }
    }
}

</style>

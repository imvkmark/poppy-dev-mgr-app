import { useStore } from '@/store';
import { get } from 'lodash-es';
import { useRouter } from 'vue-router';
import { onMounted, watch } from 'vue';
import useUserUtil from '@/composables/useUserUtil';
import { appLocalStore } from "@/utils/util";
import { storageTokenKey } from "@/utils/conf";

/**
 * 登录和 Token 的保存以及跳转
 */
export default function useDevelopAuth() {
    const store = useStore();
    const router = useRouter();
    const { userToLogin } = useUserUtil();

    const tokenKey = storageTokenKey('develop');

    // 不允许 token 传递参数
    let token = appLocalStore(tokenKey) ? appLocalStore(tokenKey) : '';

    // 判定权限
    const auth = get(router.currentRoute.value.meta, 'auth');

    // 监听 token 的变化
    watch(
        () => store.state.poppy.backendToken,
        (newVal, oldVal) => {
            // Token 清空, 则跳转掉用户登录界面
            if (!newVal && oldVal) {
                if (auth) {
                    userToLogin('develop');
                }
            }
        }, { deep: true }
    );

    // 监听路由变化并跳转到 Cp 页面
    watch(
        () => router.currentRoute.value.name,
        (newVal) => {
            let token = store.state.poppy.backendToken;
            if (newVal === 'dev.login' && token) {
                store.dispatch('poppy/Login', {
                    token, type: 'develop'
                }).then();
            }
        }, { deep: true }
    );

    // Login With Token
    onMounted(() => {
        // 有 Token, 进行登陆
        if (token) {
            store.dispatch('poppy/Login', {
                token, type: 'develop'
            }).then();
        } else {
            if (auth) {
                userToLogin('develop');
            }
        }
    })
}

import { useStore } from '@/services/store';
import { get } from 'lodash-es';
import { useRouter } from 'vue-router';
import { onMounted, watch } from 'vue';
import useUserUtil from '@/services/composables/useUserUtil';
import { emitter, PY_USER_LOGIN } from '@/services/bus/mitt';
import { localStore } from "@/services/utils/util";
import { pyStorageToken } from "@/services/utils/conf";

/**
 * 登录和 Token 的保存以及跳转
 */
export default function useBackendAuth() {
    const store = useStore();
    const router = useRouter();
    const {userToLogin, userOnLogin } = useUserUtil();

    const tokenKey = pyStorageToken('backend');

    // 处理 token, 存在 qs Token , 则覆盖本地的 token, 否则用户登录之后的token 也是可以使用的
    let token = localStore(tokenKey) ? localStore(tokenKey) : '';
    const qsToken = get(router.currentRoute.value, 'query.token', '');
    if (qsToken) {
        localStore(tokenKey, qsToken);
        token = qsToken;
    }

    // 判定权限
    const auth = get(router.currentRoute.value.meta, 'auth');

    // 尝试另外方法来触发 event
    emitter.on(PY_USER_LOGIN, () => {
        store.dispatch('poppy/Fetch').then(() => {
            // 如果是在登录页面
            userOnLogin('backend');
        })
    })

    // 监听 token 的变化
    watch(
        () => store.state.poppy.backendToken,
        (newVal, oldVal) => {
            // Token 清空, 则跳转掉用户登录界面
            if (!newVal && oldVal) {
                if (auth) {
                    userToLogin('backend');
                }
            }
        }, { deep: true }
    );

    // 监听路由变化并跳转到 Cp 页面
    watch(
        () => router.currentRoute.value.name,
        (newVal) => {
            let token = store.state.poppy.token;
            if (newVal === 'backend.login' && token) {
                store.dispatch('poppy/Login', {
                    token, type: 'backend'
                }).then();
            }
        }, { deep: true }
    );

    // Login With Token
    onMounted(() => {
        // 有 Token, 进行登陆
        if (token) {
            store.dispatch('poppy/Login', {
                token, type: 'backend'
            }).then();
        } else {
            if (auth) {
                userToLogin('backend');
            }
        }
    })
}

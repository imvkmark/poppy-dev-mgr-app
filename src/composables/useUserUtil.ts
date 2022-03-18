import { useStore } from '@/store';
import { get } from 'lodash-es';
import { useRouter } from 'vue-router';
import { isUrl } from '@/framework/utils/helper';

/**
 * 登录和 Token 的保存以及跳转
 */
export default function useUserUtil() {
    const store = useStore();
    const router = useRouter();

    /**
     * 跳转到指定界面或者用户中心
     */
    const goWith = () => {
        const go = get(router.currentRoute.value, 'query.go', '');
        if (!go) {
            router.push({ name: 'user.cp' }).then()
        } else {
            let to = window.atob(go);
            if (isUrl(to)) {
                window.location.href = to;
            } else {
                router.push(to).then()
            }
        }
    }

    /**
     * 用户登录成功之后调用
     * @param data
     */
    const userLogin = function (data: any) {
        const { token } = data;
        // set store
        store.dispatch('poppy/Login', {
            token
        }).then(() => {
            goWith();
        });
    }

    const userOnLogin = function () {
        if (router.currentRoute.value.name !== 'user.login') {
            return;
        }
        goWith();
    }

    const userLogout = function (fun: Function = () => {
    }) {
        store.dispatch('poppy/Logout').then(() => {
            router.push({ name: 'user.login' }).then()
        });
        if (typeof fun === 'function') {
            fun();
        }
    }

    /**
     * 让用户去跳转登录
     */
    const userToLogin = function () {
        router.push({
            name: 'user.login',
            query: {
                go: window.btoa(router.currentRoute.value.fullPath)
            }
        }).then();
    }
    return {
        userOnLogin,
        userLogin,
        userLogout,
        userToLogin
    }
}

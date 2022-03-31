import { useStore } from '@/services/store';
import { get } from 'lodash-es';
import { useRouter } from 'vue-router';
import { isUrl } from '@/services/utils/helper';

/**
 * 登录和 Token 的保存以及跳转
 */
export default function useUserUtil() {
    const store = useStore();
    const router = useRouter();

    /**
     * 跳转到指定界面或者用户中心
     */
    const goWithCp = (type: string) => {
        const go = get(router.currentRoute.value, 'query.go', '');
        if (!go) {
            let name = type === 'backend' ? 'backend.cp' : 'dev.cp';
            router.push({ name }).then()
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
     * 管理员登录成功之后调用
     * @param data
     */
    const userLogin = function (data: any) {
        store.dispatch('poppy/Login', data).then(() => {
            const { type } = data;
            goWithCp(type);
        });
    }

    const userOnLogin = function (type: string) {
        if (type === 'backend' && router.currentRoute.value.name !== 'backend.login') {
            return;
        }
        if (type === 'develop' && router.currentRoute.value.name !== 'dev.login') {
            return;
        }
        goWithCp(type);
    }

    /**
     * 让用户去跳转登录
     */
    const userToLogin = function (type: string) {
        const name = type === 'backend' ? 'backend.login' : 'dev.login';
        router.push({
            name,
            query: {
                go: window.btoa(router.currentRoute.value.fullPath)
            }
        }).then();
    }
    return {
        userOnLogin,
        userLogin,
        userToLogin

    }
}

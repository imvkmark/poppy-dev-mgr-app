import { onMounted, onUnmounted, watch } from 'vue'
import { useStore } from '@/services/store';
import { useRouter } from "vue-router";
import { each, get, keys, set, split } from "lodash-es";
import { emitter, PY_CORE_EXCEPTION, PY_CORE_LOADED, PY_CORE_LOADING, PY_USER_LOGOUT } from "@/services/bus/mitt";
import useUserUtil from "@/services/composables/useUserUtil";
import { localStore } from "@/services/utils/util";
import { pyStorageKey } from "@/services/utils/conf";

/**
 * 初始化
 */
export default function useGlobalInit() {
    const store = useStore();


    /* 使用 clear 参数来清除缓存数据
     *---------------------------------------------------*/
    const router = useRouter();
    const clear = get(router.currentRoute.value, 'query.clear', '');

    // clear 清除缓存信息 [:app-{xxx}/:x-core]
    if (clear) {
        let lsKeys = keys(localStorage);
        each(lsKeys, function (key) {
            // 设备ID | Token 不清除
            if (key.indexOf(pyStorageKey.deviceId) >= 0 || key.indexOf(pyStorageKey.token) >= 0) {
                return;
            }
            let ks = split(key, ':')
            // 清除缓存
            localStore(ks[1], null);
        });
    }


    /* 设置 TKD
     * ---------------------------------------- */
    let title = get(router.currentRoute.value, 'meta.title');

    const setTkd = () => {
        let siteTitle = get(store.state.poppy.core, 'py-system.title');
        if (siteTitle) {
            if (title) {
                document.title = `${title} - ${siteTitle}`;
            } else {
                document.title = siteTitle;
            }
        }
    }
    watch(() => store.state.poppy.core, () => {
        setTkd()
    }, { deep: true })
    onMounted(setTkd)

    /* 监听 Emitter 简单事件
     * ---------------------------------------- */
    const { userToLogin } = useUserUtil();
    emitter.on(PY_CORE_LOADING, (options) => {
        store.dispatch('poppy/Loading', options).then()
    })
    emitter.on(PY_CORE_LOADED, (options) => {
        store.dispatch('poppy/Loaded', options).then()
    })
    emitter.on(PY_CORE_EXCEPTION, (exception) => {
        const resp = get(exception, 'resp', {});
        const url = get(exception, 'options.url', '');
        const append = url ? `\n Url : ${url}` : '';
        set(resp, 'message', `${get(resp, 'message', '')} \n ${append}`)
        store.dispatch('poppy/SetMotion', {
            type: 'exception',
            action: 'dialog',
            addition: resp
        }).then()
    })
    emitter.on(PY_USER_LOGOUT, (data: any) => {
        store.dispatch('poppy/Logout', data).then(() => {
            const { type } = data;
            userToLogin(type)
        })
    })

    onUnmounted(() => {
        emitter.off(PY_CORE_LOADING)
        emitter.off(PY_CORE_LOADED)
        emitter.off(PY_CORE_EXCEPTION)
        emitter.off(PY_USER_LOGOUT)
    })

    /* 项目初始化
     * ---------------------------------------- */
    onMounted(() => {
        store.dispatch('poppy/Init').then()
    })
}

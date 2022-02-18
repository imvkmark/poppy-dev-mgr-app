import { onMounted, onUnmounted, watch } from 'vue'
import { useStore } from '@/store';
import { useRouter } from "vue-router";
import { each, get, keys, split } from "lodash-es";
import { pyStorageKey } from "@/framework/utils/conf";
import { localStore } from "@/framework/utils/helper";
import { emitter, PY_CORE_LOADED, PY_CORE_LOADING, PY_USER_LOGOUT } from "@/framework/bus/mitt";

/**
 * 初始化
 */
export default function useInit() {
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
        let siteTitle = get(store.getters.core, 'py-system.title');
        if (siteTitle) {
            if (title) {
                document.title = `${title} - ${siteTitle}`;
            } else {
                document.title = siteTitle;
            }
        }
    }
    watch(() => store.getters.core, setTkd, { deep: true })
    onMounted(setTkd)

    emitter.on(PY_CORE_LOADING, () => {
        store.dispatch('poppy/Loading').then()
    })
    emitter.on(PY_CORE_LOADED, () => {
        store.dispatch('poppy/Loaded').then()
    })
    emitter.on(PY_USER_LOGOUT, () => {
        store.dispatch('poppy/Logout').then()
    })

    /* 项目初始化
     * ---------------------------------------- */
    onMounted(() => {
        store.dispatch('poppy/Init').then()
    })


    onUnmounted(() => {
        emitter.off(PY_CORE_LOADING)
        emitter.off(PY_CORE_LOADED)
        emitter.off(PY_USER_LOGOUT)
    })
}

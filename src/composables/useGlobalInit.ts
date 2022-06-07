import { onMounted, onUnmounted, watch } from 'vue'
import { useStore } from '@/store';
import { useRouter } from "vue-router";
import { each, get, keys, split } from "lodash-es";
import { emitter } from "@popjs/core/bus/mitt";
import useUserUtil from "@/composables/useUserUtil";
import { appLocalStore } from "@/utils/util";
import { storageTokenKey } from "@/utils/conf";
import { pyStorageDeviceIdKey } from "@popjs/core/utils/conf";
import { REQUEST_401, REQUEST_EXCEPTION, REQUEST_LOADED, REQUEST_LOADING } from "@popjs/core/utils/request";
import { MGR_APP_MOTION, USER_LOGOUT } from "@/bus";

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
            if (key.indexOf(pyStorageDeviceIdKey) >= 0 || key.indexOf(storageTokenKey('')) >= 0) {
                return;
            }
            let ks = split(key, ':')
            // 清除缓存
            appLocalStore(ks[1], null);
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
    emitter.on(REQUEST_LOADING, (options) => {
        store.dispatch('poppy/Loading', options).then()
    })
    emitter.on(REQUEST_LOADED, (options) => {
        store.dispatch('poppy/Loaded', options).then()
    })
    emitter.on(REQUEST_401, () => {
        const name = String(router.currentRoute.value.name);
        let type = 'backend';
        if (name.indexOf('dev') != -1) {
            type = 'develop';
        }
        userToLogin(type)
    })
    emitter.on(REQUEST_EXCEPTION, (exception) => {
        emitter.emit(MGR_APP_MOTION, {
            type: 'exception',
            action: 'dialog',
            addition: exception
        })
    })
    emitter.on(USER_LOGOUT, (data: any) => {
        store.dispatch('poppy/Logout', data).then(() => {
            const { type } = data;
            userToLogin(type)
        })
    })

    onUnmounted(() => {
        emitter.off(REQUEST_LOADING)
        emitter.off(REQUEST_LOADED)
        emitter.off(REQUEST_EXCEPTION)
        emitter.off(REQUEST_401)
        emitter.off(USER_LOGOUT)
    })

    /* 项目初始化
     * ---------------------------------------- */
    onMounted(() => {
        store.dispatch('poppy/Init').then()
    })
}

import { onMounted, onUnmounted, watch } from 'vue'
import { useStore } from '@/store';
import { useRouter } from "vue-router";
import { each, get, keys, set, split } from "lodash-es";
import { pyStorageKey } from "@/framework/utils/conf";
import { localStore } from "@/framework/utils/helper";
import { emitter, PY_CORE_EXCEPTION, PY_CORE_LOADED, PY_CORE_LOADING, PY_USER_LOGOUT } from "@/framework/bus/mitt";
import useUserUtil from "@/composables/useUserUtil";
import { ElMessageBox } from "element-plus";

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
        let siteTitle = get(store.state.poppy.core, 'py-system.title');
        if (siteTitle) {
            if (title) {
                document.title = `${title} - ${siteTitle}`;
            } else {
                document.title = siteTitle;
            }
        }
    }
    watch(() => store.state.poppy.core, ()=>{
        setTkd()
    }, { deep: true })
    onMounted(setTkd)

    /* 监听 Emitter 简单事件
     * ---------------------------------------- */
    const { userToLogin } = useUserUtil();
    emitter.on(PY_CORE_LOADING, () => {
        store.dispatch('poppy/Loading').then()
    })
    emitter.on(PY_CORE_LOADED, () => {
        store.dispatch('poppy/Loaded').then()
    })
    emitter.on(PY_CORE_EXCEPTION, (exception) => {
        const resp = get(exception, 'resp', {});
        const url = get(exception, 'options.url', '');
        const append = url ? `\n Url : ${url}` : '';
        set(resp, 'message', `${get(resp, 'message', '')} \n ${append}`)
        store.commit('poppy/SET_MESSAGE', resp)
    })
    emitter.on(PY_USER_LOGOUT, () => {
        store.dispatch('poppy/Logout').then(() => {
            userToLogin()
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


    /* 监听全局动作
     * ---------------------------------------- */
    watch(() => store.state.poppy.action, (newVal) => {
        if (!newVal) {
            return;
        }
        if (newVal === 'reload') {
            window.location.reload();
        }
    })

    /* 监听全局错误提示
     * ---------------------------------------- */
    watch(() => store.state.poppy.message, (newVal) => {
        if (!get(newVal, 'status')) {
            return;
        }
        const status = get(newVal, 'status');
        const message = get(newVal, 'message');
        if (status === 1) {
            ElMessageBox.alert(get(newVal, 'message'), '警告').finally(() => {
                store.commit('poppy/SET_MESSAGE', {})
            })
            return;
        }

        // 标准异常触发
        ElMessageBox.alert(message, `错误:${status}`, {
            type: 'error'
        }).finally(() => {
            store.commit('poppy/SET_MESSAGE', {})
        })
    })
}

import { onMounted, watch } from 'vue'
import { useStore } from '@/store';
import { useRouter } from "vue-router";
import { each, get, keys, split } from "lodash-es";
import { appLocalStore } from "@/utils/util";
import { storageTokenKey } from "@/utils/conf";
import { pyStorageDeviceIdKey } from "@popjs/core/utils/conf";

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


    /* 项目初始化
     * ---------------------------------------- */
    onMounted(() => {
        store.dispatch('poppy/Init').then()
    })
}

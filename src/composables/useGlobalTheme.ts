import { onMounted, onUnmounted, ref } from 'vue'
import { useStore } from '@/store';
import { debounce, get } from "lodash-es";
import { appLocalStore } from "@/utils/util";
import { pyStorageKey } from "@/utils/conf";

/**
 * 页面配置 / Size
 */
export default function useGlobalTheme() {
    const store = useStore();

    /* 主题管理
     * ---------------------------------------- */
    onMounted(() => {
        let theme = appLocalStore(pyStorageKey.theme);
        let size = get(theme, 'size');
        let style = get(theme, 'style');
        if (size) {
            store.dispatch('poppy/SetSize', size).then();
        }
        if (style) {
            store.dispatch('poppy/SetStyle', style).then();
        }
    })


    /* 基于宽度的自动化布局方案
     * ---------------------------------------- */
    const style = ref('');
    const calcFluid = debounce(() => {
        let width = window.innerWidth;
        if (width <= 768) {
            style.value = 'xs';
        } else if (768 < width && width <= 992) {
            style.value = 'sm';
        } else if (992 < width && width <= 1200) {
            style.value = 'md';
        } else if (1200 < width && width <= 1920) {
            style.value = 'lg';
        } else if (1920 < width) {
            style.value = 'xl';
        }
        store.dispatch('poppy/SetMedia', style.value).then()
    }, 100)

    // 计算宽度
    onMounted(() => {
        window.addEventListener('resize', calcFluid);
        calcFluid()
    })

    onUnmounted(() => {
        window.removeEventListener('resize', calcFluid)
    })
}

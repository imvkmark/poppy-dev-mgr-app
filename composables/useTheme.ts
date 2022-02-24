import { onMounted } from 'vue'
import { useStore } from '@/store';
import { get } from "lodash-es";
import { pyStorageKey } from "@/framework/utils/conf";
import { localStore } from "@/framework/utils/helper";

/**
 * 主题管理
 */
export default function useTheme() {
    const store = useStore();

    onMounted(() => {
        let theme = localStore(pyStorageKey.theme);
        let elementSize = get(theme, 'elementSize');
        if (elementSize) {
            store.commit('poppy/SET_ELEMENT_SIZE', elementSize);
        }
    })
}

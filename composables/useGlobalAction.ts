import { watch } from 'vue'
import { useStore } from '@/store';

/**
 * 全局动作
 */
export default function useGlobalAction() {
    const store = useStore();

    /* 监听全局动作
     * ---------------------------------------- */
    watch(() => store.state.poppy.action, (newVal: string) => {
        if (!newVal) {
            return;
        }
        if (newVal === 'reload') {
            window.location.reload();
        }

        if (newVal.indexOf(':') !== -1) {
            let arrVal = newVal.split(':');
            const part = arrVal[0];
            const action = arrVal[1];
            switch (part) {
                case 'grid':
                    store.dispatch('grid/DoAction', action).then()
                    break;
            }
        }
        store.dispatch('poppy/ClearAction').then();
    })
}

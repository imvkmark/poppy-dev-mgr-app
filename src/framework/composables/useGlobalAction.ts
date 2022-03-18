import { watch } from 'vue'
import { useStore } from '@/store';
import { get } from "lodash-es";
import { ElMessageBox } from "element-plus";

/**
 * 全局动作
 */
export default function useGlobalAction() {
    const store = useStore();


    /* 监听全局动作
    * ---------------------------------------- */
    watch(() => store.state.poppy.motion, (newVal) => {
        let type = get(newVal, 'type');
        let action = get(newVal, 'action')
        let addition = get(newVal, 'addition', {})
        if (!type) {
            return;
        }
        switch (type) {
            case 'exception':
                const status = get(addition, 'status');
                const message = get(addition, 'message');
                // 如果异常有相应的 action , 可以预埋
                if (status === 1) {
                    // 默认警告
                    ElMessageBox.alert(message, '警告', {
                        type: 'warning'
                    })
                    return;
                }

                // 错误异常
                ElMessageBox.alert(message, `错误:${status}`, {
                    type: 'error'
                })
                break;
            case 'grid':
                store.dispatch('poppy/SetGrid', action).then()
                break;
            case 'window':
                if (action === 'reload') {
                    window.location.reload();
                }
                break;
        }
        store.dispatch('poppy/ClearMotion').then();
    })
}

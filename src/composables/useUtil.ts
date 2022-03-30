import { useStore } from "@/store";
import { get, set } from "lodash-es";

/**
 * 全局的操作
 */
export default function useUtil() {

    const store = useStore();

    /**
     * 进行全局动作的分派
     * @param data
     */
    const pyMotion = (data: object) => {
        const strMotion = get(data, 'motion', '');
        const time = get(data, 'time', 200);

        if (!strMotion) {
            return;
        }
        // 触发全局动作
        let motion = {};
        if (strMotion.indexOf(':') >= 0) {
            let arrMotion = strMotion.split(':');
            set(motion, 'type', arrMotion[0])
            set(motion, 'action', arrMotion[1])
        } else {
            set(motion, 'type', 'window')
            set(motion, 'action', strMotion)
        }
        setTimeout(() => {
            store.dispatch('poppy/SetMotion', motion).then()
        }, time)
    }

    return {
        pyAction: pyMotion
    }
}

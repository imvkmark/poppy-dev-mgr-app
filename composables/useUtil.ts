import { useStore } from "@/store";
import { get } from "lodash-es";
import { pyWarning } from "@/framework/utils/helper";

/**
 * 全局的操作
 */
export default function useUtil() {

    const store = useStore();

    /**
     * 进行全局动作的分派
     * @param data
     */
    const pyAction = (data: object) => {
        const action = get(data, 'action', '');
        const time = get(data, 'time', 200);

        pyWarning('py-action', data);

        // 触发全局动作
        if (action) {
            setTimeout(() => {
                store.dispatch('poppy/DoAction', action).then()
            }, time)
        }
    }

    return {
        pyAction
    }
}

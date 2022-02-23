import { get, set } from 'lodash-es';
import { onMounted, Ref, ref, watch } from 'vue';

/**
 * 模型数据匹配联动
 */
export default function useLinkage(items: Ref<any[]>) {

    const rules = ref({});


    /**
     * 解析一个字段的所有规则
     * @param itemRules
     * @param field
     */
    const toPlainRules = (field: string, itemRules: string | string[]) => {
        let rule = {};

        /* 格式化规则
         * ---------------------------------------- */
        let from;
        if (typeof itemRules === 'string') {
            from = itemRules.split('|');
        } else {
            from = itemRules;
        }
        from.forEach(function (ruleAndArgs) {
            // ruleAndArgs:
            //  - regex:/\d{5}/
            //  - min:1
            //  - max:3
            //  - between:4,20
            if (ruleAndArgs.trim()) {
                let args = ruleAndArgs.split(':');
                let name = args[0];
                let params = args[1] ? args[1].split(',') : [];
                if (name === 'required_if') {
                    let field = params[0];
                    let allowed = params.slice(1);
                    rule = {
                        field,
                        allowed,
                    }
                }
            }
        });
        return rule;
    }

    const parseRules: any = () => {
        /* 规则
         * ---------------------------------------- */
        let arr = {};
        for (let item of items.value) {
            let field = get(item, 'name');
            let rules = get(item, 'rules', []);
            if (rules.length) {
                let rule = toPlainRules(field, rules);
                console.log(get(rule, 'name'))
                set(arr, field, toPlainRules(field, rules))
            }
        }
        // {
        //   "handled-field": {
        //     "field": "radio",
        //     "allowed": [
        //       "a"
        //     ]
        //   }
        // }

        rules.value = arr;
    }

    watch(() => items.value, () => {
        parseRules();
    }, { deep: true })
    onMounted(() => {
        parseRules();
    });

    return {
        visible: rules
    }
}

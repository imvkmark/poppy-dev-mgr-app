<template>
    <!--  因为当前组件在 Setting 中使用, 所以不得将 Url 封装进来  -->
    <ElForm :model="refModel" :rules="schema" ref="formRef" class="py--form"
        :label-position="sizeLt('md', trans.media)? 'right': 'top'"
        label-width="auto" :size="trans.size"
        :inline="get(attr, 'inline', false)" :disabled="get(attr, 'disabled', false)">
        <template v-for="item in refItems" :key="get(item , 'name')">
            <!--  hidden 不进行处理, 因为不修改模型数据, props 用来验证 validation  -->
            <ElFormItem :prop="get(item , 'name')" :label="get(item, 'label')"
                v-if="!includes(['divider', 'code', 'dynamic'], get(item, 'type'))">
                <FieldText v-if="includes(['text', 'url', 'password', 'mobile', 'ip', 'decimal', 'email', 'currency'], get(item , 'type'))"
                    :attr="get(item, 'attr')" :model-value="get(refModel, item.name)" @update:model-value="(val)=>set(refModel, item.name, val)"/>
                <FieldTextarea v-if="get(item , 'type') === 'textarea'"
                    :attr="get(item, 'attr')" :model-value="get(refModel, item.name)" @update:model-value="(val)=>set(refModel, item.name, val)"/>
                <FieldNumber v-if="get(item , 'type') === 'number'"
                    :attr="get(item, 'attr')" :model-value="get(refModel, item.name)" @update:model-value="(val)=>set(refModel, item.name, val)"/>
                <FieldTable v-if="get(item , 'type') === 'table'"
                    :attr="get(item, 'attr')" :model-value="get(refModel, item.name)" @update:model-value="(val)=>set(refModel, item.name, val)"/>
                <FieldEzTable v-if="get(item , 'type') === 'ez-table'" :attr="get(item, 'attr')"/>
                <FieldRadio v-if="get(item , 'type') === 'radio'"
                    :attr="get(item, 'attr')" :model-value="get(refModel, item.name)" @update:model-value="(val)=>set(refModel, item.name, val)"/>
                <FieldCheckbox v-if="get(item , 'type') === 'checkbox'"
                    :attr="get(item, 'attr')" :model-value="get(refModel, item.name)" @update:model-value="(val)=>set(refModel, item.name, val)"/>
                <FieldColor v-if="get(item , 'type') === 'color'"
                    :attr="get(item, 'attr')" :model-value="get(refModel, item.name)" @update:model-value="(val)=>set(refModel, item.name, val)"/>
                <FieldDate v-if="includes(['date', 'month', 'year', 'datetime'], get(item , 'type'))"
                    :attr="get(item, 'attr')" :model-value="get(refModel, item.name)" @update:model-value="(val)=>set(refModel, item.name, val)"/>
                <FieldDateRange v-if="includes(['date-range','month-range', 'datetime-range'], get(item , 'type'))"
                    :attr="get(item, 'attr')" :model-value="get(refModel, item.name)" @update:model-value="(val)=>set(refModel, item.name, val)"/>
                <FieldTime v-if="includes(['time'], get(item , 'type'))"
                    :attr="get(item, 'attr')" :model-value="get(refModel, item.name)" @update:model-value="(val)=>set(refModel, item.name, val)"/>
                <FieldTimeRange v-if="includes(['time-range'], get(item , 'type'))"
                    :attr="get(item, 'attr')" :model-value="get(refModel, item.name)" @update:model-value="(val)=>set(refModel, item.name, val)"/>
                <FieldSelect v-if="includes(['select'], get(item , 'type'))" :url="url"
                    :attr="get(item, 'attr')" :model-value="get(refModel, item.name)" @update:model-value="(val)=>set(refModel, item.name, val)"/>
                <FieldCascader v-if="includes(['cascader'], get(item , 'type'))" :url="url"
                    :attr="get(item, 'attr')" :model-value="get(refModel, item.name)" @update:model-value="(val)=>set(refModel, item.name, val)"/>
                <FieldMultiSelect v-if="includes(['multi-select', 'tags'], get(item , 'type'))"
                    :attr="get(item, 'attr')" :model-value="get(refModel, item.name)" @update:model-value="(val)=>set(refModel, item.name, val)"/>
                <FieldSwitch v-if="includes(['on-off'], get(item , 'type'))"
                    :attr="get(item, 'attr')" :model-value="get(refModel, item.name)" @update:model-value="(val)=>set(refModel, item.name, val)"/>
                <FieldFile v-if="includes(['image', 'file'], get(item , 'type'))"
                    :attr="get(item, 'attr')" :model-value="get(refModel, item.name)" @update:model-value="(val)=>set(refModel, item.name, val)"/>
                <FieldMultiFile v-if="includes(['multi-image', 'multi-file'], get(item , 'type'))"
                    :attr="get(item, 'attr')" :model-value="get(refModel, item.name)" @update:model-value="(val)=>set(refModel, item.name, val)"/>
                <FieldEditor v-if="includes(['editor'], get(item , 'type'))"
                    :attr="get(item, 'attr')" :model-value="get(refModel, item.name)" @update:model-value="(val)=>set(refModel, item.name, val)"/>
                <FieldActions v-if="includes(['actions'], get(item , 'type'))"
                    :attr="get(item, 'attr')"/>
                <div class="form-help" v-if="get(item, 'help', '')" v-html="get(item, 'help', '')"/>
            </ElFormItem>
            <!-- 分割线 -->
            <FieldDivider v-else-if="get(item, 'type') === 'divider'" :label="get(item , 'label')"/>
            <FieldCode v-else-if="get(item, 'type') === 'code'" :default-value="get(model, get(item, 'name', ''), '')"/>
        </template>
        <ElFormItem v-if="props.items.length">
            <ElButton type="primary" v-if="indexOf(buttons, 'submit') !== -1" @click="onSubmit">确认</ElButton>
            <ElButton v-if="indexOf(buttons, 'reset') !== -1" @click="onReset">重置</ElButton>
        </ElFormItem>
    </ElForm>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, Ref, ref, toRef, watch } from 'vue';
import { clone, cloneDeep, each, filter, find, get, includes, indexOf, isObjectLike, map, reject, set, unset } from 'lodash-es';
import FieldText from '@/components/form/FieldText.vue';
import { ElForm } from 'element-plus';
import useValidation from '@/composables/useValidation';
import { sizeLt } from '@popjs/core/utils/helper';
import { useStore } from '@/store';
import FieldTextarea from '@/components/form/FieldTextarea.vue';
import FieldNumber from '@/components/form/FieldNumber.vue';
import FieldRadio from '@/components/form/FieldRadio.vue';
import FieldCheckbox from '@/components/form/FieldCheckbox.vue';
import FieldColor from '@/components/form/FieldColor.vue';
import FieldDate from '@/components/form/FieldDate.vue';
import FieldDateRange from '@/components/form/FieldDateRange.vue';
import FieldTime from '@/components/form/FieldTime.vue';
import FieldTimeRange from '@/components/form/FieldTimeRange.vue';
import FieldSelect from '@/components/form/FieldSelect.vue';
import FieldMultiSelect from '@/components/form/FieldMultiSelect.vue';
import FieldSwitch from '@/components/form/FieldSwitch.vue';
import FieldDivider from '@/components/form/FieldDivider.vue';
import FieldEditor from '@/components/form/FieldEditor.vue';
import FieldFile from '@/components/form/FieldFile.vue';
import FieldMultiFile from '@/components/form/FieldMultiFile.vue';
import FieldCode from "@/components/form/FieldCode.vue";
import FieldActions from "@/components/form/FieldActions.vue";
import useLinkage from "@/composables/useLinkage";
import { apiPyRequest } from "@/services/poppy";
import { toast } from "@/utils/util";
import FieldTable from "@/components/form/FieldTable.vue";
import FieldCascader from "@/components/form/FieldCascader.vue";
import FieldEzTable from "@/components/form/FieldEzTable.vue";

const props = defineProps({
    loading: Boolean,
    attr: Object,
    items: Array,
    url: {
        type: String,
        default: ''
    },
    model: {
        type: Object,
        default: () => {
            return {}
        }
    },
    buttons: Array
})
const store = useStore();
const trans = reactive({
    media: computed(() => store.state.poppy.media),
    size: computed(() => store.state.poppy.size)
})
const refModel = ref({});
const refModelCopy = ref('{}');
const refDynamic = ref<any[]>([]);
const refItems = ref<any[]>([]);
const obj = ref({
    str: {
        required: '{0}这里是自定义的提示'
    }
});

const items: Ref = toRef(props, 'items');
const { schema } = useValidation(items, refModel, obj)

const { visible } = useLinkage(items)


const checkDependVisible = (field: string) => {
    console.log(visible.value);
    // 不在规则内, 显示
    if (!get(visible.value, field)) {
        return true;
    }
    let rule = get(visible.value, field);
    // allowed: ['a']
    // field: "radio"
    let checkedField = get(rule, 'field', '');
    if (!checkedField) {
        return true;
    }
    let checkedVal = get(refModel.value, checkedField);
    return includes(get(rule, 'allowed', []), checkedVal);

}

const formRef: any = ref<InstanceType<typeof ElForm>>();
const emit = defineEmits([
    'submit'
])

const onSubmit = () => {
    formRef.value.validate().then(() => {
        console.log(refModel.value, 'model');
        let mdlCopy = cloneDeep(refModel.value);
        let formatVal = {};
        each(mdlCopy, (itModel, key) => {
            let formDef = find(refItems.value, (itForm) => {
                return get(itForm, 'name') === key;
            })

            // 表格的数据需要进行格式化
            // 因为表格在禁用状态下, 对数据格式做了非标量处理
            if (formDef && get(formDef, 'type') === 'table') {
                let formatItModel = map(itModel, (itMdlCp: any) => {
                    each(get(formDef, 'attr.cols'), (col) => {
                        let field = get(col, 'field');
                        if (isObjectLike(itMdlCp[field])) {
                            set(itMdlCp, [field], get(itMdlCp[field], 'value'));
                        }
                    })
                    unset(itMdlCp, '_idx');
                    return itMdlCp;
                })
                set(formatVal, [key], formatItModel);
            } else {
                set(formatVal, [key], itModel);
            }
        })
        emit('submit', formatVal);
    }).catch(() => {
    });
}

const onReset = () => {
    formRef.value.resetFields();
    init();
}

const init = () => {
    refModel.value = props.model;
    initRefItems(props.items)
}

// 监听变化, 触发变化
watch(() => refModel.value, (newVal) => {
    let changed = {};
    let oldVal = JSON.parse(refModelCopy.value);
    each(newVal, (val, key) => {
        if (get(oldVal, key) !== val) {
            set(changed, key, val);
        }
    })

    each(refDynamic.value, (dynamic) => {
        if (get(dynamic, 'listen') && get(changed, get(dynamic, 'listen'))) {
            let values = map(get(dynamic, 'relations'), (modelKey) => {
                return get(refModel.value, modelKey);
            })
            // 请求新的数据结构, 存在之前的值, 不保留当前请求之后的数据
            dynamic.action(values, get(oldVal, get(dynamic, 'listen')));
        }
    })
    refModelCopy.value = JSON.stringify(refModel.value);
}, { deep: true, immediate: true })

// 监听规则变化, 组合联合监听
const initRefItems = (newVal: any) => {
    refItems.value = newVal;

    // 获取所有动态监听的字段
    let dynamics = filter(newVal, (item) => {
        return get(item, 'type') === 'dynamic';
    })

    // plat listen,  扁平化监听
    if (!dynamics.length) {
        return;
    }

    each(dynamics, (item: any) => {
        let relations = get(item, 'dynamic.rel', []);
        let origin = reject(clone(item), 'dynamic')
        if (relations.length) {
            return;
        }
        each(relations, (rel) => {
            // ---- 找位置进行数据的插入
            // type:
            // name :
            // ---- 请求条件
            // dynamic :
            //   depend: area
            //   depend-params: type|city
            // ---- 监听的数据
            // listen: province
            // ---- 组合数据的顺序
            // relations: [province]
            // ---- 组合的原始数据, 移除 dynamic 参数
            // origin
            refDynamic.value.push({
                listen: rel,
                relations,
                action: function (args: any, clear = false) {
                    // 请求
                    apiPyRequest(props.url, {
                        _query: 'depend:field',
                        name: get(item, 'dynamic.depend', ''),
                        params: get(item, 'dynamic.depend-params', ''),
                        values: args
                    }).then(({ success, data, message }) => {
                        if (!success) {
                            toast(message, false);
                            return;
                        }
                        // remove dynamic-name
                        let dynamicName = `dynamic-${get(item, 'name')}`;

                        let refItemsCopy = clone(refItems.value);
                        let refItemsReject = reject(refItemsCopy, (item) => {
                            return get(item, 'dynamic-name') === dynamicName;
                        })

                        // find position & insert
                        let refItemRejectCopy = clone(refItemsReject);
                        each(refItemsReject, function (item, index) {
                            if (get(item, 'type') === 'dynamic' && get(item, 'name') === get(item, 'name')) {
                                let refAppend = ref({
                                    'type': '_preserve',
                                    'label': get(item, 'label'),
                                    'name': get(item, 'name'),
                                    'rules': get(item, 'rules'),
                                    'dynamic-name': dynamicName,
                                    ...data,
                                })
                                refItemRejectCopy.splice(index, 0, refAppend.value);
                                refItems.value = refItemRejectCopy;
                            }
                        });
                    })

                    if (clear) {
                        set(refModel.value, get(item, 'name'), null)
                    }
                }
            })
        })
    })
}

watch(() => props.model, () => {
    init();
})

onMounted(() => {
    init();
})

</script>

<style scoped lang="less">
</style>

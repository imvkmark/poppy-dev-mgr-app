<template>
    <!--  因为当前组件在 Setting 中使用, 所以不得将 Url 封装进来  -->
    <ElForm :model="transModel" :rules="schema" ref="formRef" class="py--form"
        :label-position="sizeLt('md', trans.media)? 'right': 'top'"
        label-width="auto"
        :size="trans.size"
        :inline="get(attr, 'inline', false)" :disabled="get(attr, 'disabled', false)">
        <template v-for="item in props.items" :key="get(item , 'name')">
            <!--  hidden 不进行处理, 因为不修改模型数据, props 用来验证 validation  -->
            <ElFormItem :prop="get(item , 'name')" :label="get(item, 'label')"
                v-if="!includes(['divider', 'code'], get(item, 'type')) && checkDependVisible(get(item, 'name'))">
                <FieldText v-if="includes(['text', 'url', 'password', 'mobile', 'ip', 'decimal', 'email', 'currency'], get(item , 'type'))"
                    :attr="get(item, 'field')" v-model="transModel[get(item, 'name')]"/>
                <FieldTextarea v-if="get(item , 'type') === 'textarea'"
                    :attr="get(item, 'field')" v-model="transModel[get(item, 'name')]"/>
                <FieldNumber v-if="get(item , 'type') === 'number'"
                    :attr="get(item, 'field')" v-model="transModel[get(item, 'name')]"/>
                <FieldRadio v-if="get(item , 'type') === 'radio'"
                    :attr="get(item, 'field')" v-model="transModel[get(item, 'name')]"/>
                <FieldCheckbox v-if="get(item , 'type') === 'checkbox'"
                    :attr="get(item, 'field')" v-model="transModel[get(item, 'name')]"/>
                <FieldColor v-if="get(item , 'type') === 'color'"
                    :attr="get(item, 'field')" v-model="transModel[get(item, 'name')]"/>
                <FieldDate v-if="includes(['date', 'month', 'year', 'datetime'], get(item , 'type'))"
                    :attr="get(item, 'field')" v-model="transModel[get(item, 'name')]"/>
                <FieldDateRange v-if="includes(['date-range','month-range', 'datetime-range'], get(item , 'type'))"
                    :attr="get(item, 'field')" v-model="transModel[get(item, 'name')]"/>
                <FieldTime v-if="includes(['time'], get(item , 'type'))"
                    :attr="get(item, 'field')" v-model="transModel[get(item, 'name')]"/>
                <FieldTimeRange v-if="includes(['time-range'], get(item , 'type'))"
                    :attr="get(item, 'field')" v-model="transModel[get(item, 'name')]"/>
                <FieldSelect v-if="includes(['select'], get(item , 'type'))"
                    :attr="get(item, 'field')" v-model="transModel[get(item, 'name')]"/>
                <FieldMultiSelect v-if="includes(['multi-select', 'tags'], get(item , 'type'))"
                    :attr="get(item, 'field')" v-model="transModel[get(item, 'name')]"/>
                <FieldSwitch v-if="includes(['on-off'], get(item , 'type'))"
                    :attr="get(item, 'field')" v-model="transModel[get(item, 'name')]"/>
                <FieldFile v-if="includes(['image', 'file'], get(item , 'type'))"
                    :attr="get(item, 'field')" v-model="transModel[get(item, 'name')]"/>
                <FieldMultiFile v-if="includes(['multi-image', 'multi-file'], get(item , 'type'))"
                    :attr="get(item, 'field')" v-model="transModel[get(item, 'name')]"/>
                <FieldEditor v-if="includes(['editor'], get(item , 'type'))"
                    :attr="get(item, 'field')" v-model="transModel[get(item, 'name')]"/>
                <FieldActions v-if="includes(['actions'], get(item , 'type'))"
                    :attr="get(item, 'field')"/>
                <div class="form-help" v-if="get(item, 'help', '')" v-html="get(item, 'help', '')"/>
            </ElFormItem>
            <!-- 分割线 -->
            <FieldDivider v-else-if="get(item, 'type') === 'divider'" :label="get(item , 'label')"/>
            <FieldCode v-else-if="get(item, 'type') === 'code'" :default-value="get(model, get(item, 'name', ''), '')"/>
        </template>
        <ElFormItem v-if="props.items.length">
            <ElButton type="primary" v-if="indexOf(buttons, 'submit')" @click="onSubmit">确认</ElButton>
            <ElButton v-if="indexOf(buttons, 'reset')" @click="onReset">重置</ElButton>
        </ElFormItem>
    </ElForm>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, Ref, ref, toRef, watch } from 'vue';
import { get, includes, indexOf } from 'lodash-es';
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

const props = defineProps({
    loading: Boolean,
    attr: Object,
    items: Array,
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
const transModel = ref({});
const obj = ref({
    str: {
        required: '{0}这里是自定义的提示'
    }
});

const items: Ref = toRef(props, 'items');
const { schema } = useValidation(items, transModel, obj)
const { visible } = useLinkage(items)

const checkDependVisible = (field: string) => {
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
    let checkedVal = get(transModel.value, checkedField);
    return includes(get(rule, 'allowed', []), checkedVal);

}

const formRef: any = ref<InstanceType<typeof ElForm>>();
const emit = defineEmits([
    'submit'
])

const onSubmit = () => {
    formRef.value.validate().then(() => {
        emit('submit', transModel.value);
    }).catch(() => {
    });
}

const onReset = () => {
    formRef.value.resetFields();
    init();
}

const init = () => {
    transModel.value = props.model;
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

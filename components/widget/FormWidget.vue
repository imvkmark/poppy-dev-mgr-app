<template>
    <div :class="{'py--form':true, ...sizeClass(trans.size)}">
        <h3 class="form-title" v-if="title">
            {{ title }}
            <small v-if="description">{{ description }}</small>
        </h3>
        <!-- 表格数据 -->
        <ElForm :model="transModel" :rules="schema" ref="formRef"
            :label-position="sizeLt('lg', trans.size)? 'right': 'top'"
            :label-width="get(attr, 'label-width', 'auto')"
            :size="get(attr, 'size', '')"
            :inline="get(attr, 'inline', false)" :disabled="get(attr, 'disabled', false)">

            <template v-for="item in props.items" :key="get(item , 'name')">
                <!--  hidden 不进行处理, 因为不修改模型数据  -->
                <ElFormItem :label="get(item , 'label')" :prop="get(item , 'name')"
                    v-if="!includes(['divider', 'code'], get(item, 'type'))">
                    <FieldText
                        v-if="includes(['text', 'url', 'password', 'mobile', 'ip', 'decimal', 'email', 'currency'], get(item , 'type'))"
                        :attr="get(item, 'field')" @change="onChange"
                        :name="get(item, 'name')" :value="get(transModel, get(item, 'name'))"/>
                    <FieldTextarea v-if="get(item , 'type') === 'textarea'" :attr="get(item, 'field')"
                        @change="onChange"
                        :name="get(item, 'name')" :value="get(transModel, get(item, 'name'))"/>
                    <FieldNumber v-if="get(item , 'type') === 'number'" :attr="get(item, 'field')" @change="onChange"
                        :name="get(item, 'name')" :value="get(transModel, get(item, 'name'))"/>
                    <FieldRadio v-if="get(item , 'type') === 'radio'" :attr="get(item, 'field')" @change="onChange"
                        :name="get(item, 'name')" :value="get(transModel, get(item, 'name'))"/>
                    <FieldCheckbox v-if="get(item , 'type') === 'checkbox'" :attr="get(item, 'field')"
                        @change="onChange"
                        :name="get(item, 'name')" :value="get(transModel, get(item, 'name'))"/>
                    <FieldColor v-if="get(item , 'type') === 'color'" :attr="get(item, 'field')" @change="onChange"
                        :name="get(item, 'name')" :value="get(transModel, get(item, 'name'))"/>
                    <FieldDate v-if="includes(['date', 'month', 'year', 'datetime'], get(item , 'type'))"
                        :attr="get(item, 'field')"
                        @change="onChange"
                        :name="get(item, 'name')" :value="get(transModel, get(item, 'name'))"/>
                    <FieldDateRange v-if="includes(['date-range','month-range', 'datetime-range'], get(item , 'type'))"
                        :attr="get(item, 'field')" @change="onChange"
                        :name="get(item, 'name')" :value="get(transModel, get(item, 'name'))"/>
                    <FieldTime v-if="includes(['time'], get(item , 'type'))"
                        :attr="get(item, 'field')" @change="onChange"
                        :name="get(item, 'name')" :value="get(transModel, get(item, 'name'))"/>
                    <FieldTimeRange v-if="includes(['time-range'], get(item , 'type'))"
                        :attr="get(item, 'field')" @change="onChange"
                        :name="get(item, 'name')" :value="get(transModel, get(item, 'name'))"/>
                    <FieldSelect v-if="includes(['select'], get(item , 'type'))"
                        :attr="get(item, 'field')" @change="onChange"
                        :name="get(item, 'name')" :value="get(transModel, get(item, 'name'))"/>
                    <FieldMultiSelect v-if="includes(['multi-select', 'tags'], get(item , 'type'))"
                        :attr="get(item, 'field')" @change="onChange"
                        :name="get(item, 'name')" :value="get(transModel, get(item, 'name'))"/>
                    <FieldSwitch v-if="includes(['on-off'], get(item , 'type'))"
                        :attr="get(item, 'field')" @change="onChange"
                        :name="get(item, 'name')" :value="get(transModel, get(item, 'name'))"/>
                    <FieldFile v-if="includes(['image', 'file'], get(item , 'type'))"
                        :attr="get(item, 'field')" @change="onChange"
                        :name="get(item, 'name')" :value="get(transModel, get(item, 'name'))"/>
                    <FieldMultiFile v-if="includes(['multi-image', 'multi-file'], get(item , 'type'))"
                        :attr="get(item, 'field')" @change="onChange"
                        :name="get(item, 'name')" :value="get(transModel, get(item, 'name'))"/>
                    <FieldEditor v-if="includes(['editor'], get(item , 'type'))"
                        :attr="get(item, 'field')" @change="onChange"
                        :name="get(item, 'name')" :value="get(transModel, get(item, 'name'))"/>
                </ElFormItem>
                <!-- 分割线 -->
                <FieldDivider v-else-if="get(item, 'type') === 'divider'" :label="get(item , 'label')"/>
                <FieldCode v-else-if="get(item, 'type') === 'code'" :value="get(transModel, get(item, 'name'))"/>
            </template>

            <ElFormItem>
                <ElButton type="primary" v-if="indexOf(buttons, 'submit')" @click="onSubmit">确认</ElButton>
                <ElButton v-if="indexOf(buttons, 'reset')" @click="onReset">重置</ElButton>
            </ElFormItem>
        </ElForm>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, Ref, ref, toRef, watch } from 'vue';
import { clone, get, includes, indexOf, set } from 'lodash-es';
import FieldText from '@/framework/components/form/FieldText.vue';
import { ElForm } from 'element-plus';
import useValidation from '@/framework/composables/useValidation';
import { sizeClass, sizeLt } from '@/framework/utils/helper';
import { useStore } from '@/store';
import FieldTextarea from '@/framework/components/form/FieldTextarea.vue';
import FieldNumber from '@/framework/components/form/FieldNumber.vue';
import FieldRadio from '@/framework/components/form/FieldRadio.vue';
import FieldCheckbox from '@/framework/components/form/FieldCheckbox.vue';
import FieldColor from '@/framework/components/form/FieldColor.vue';
import FieldDate from '@/framework/components/form/FieldDate.vue';
import FieldDateRange from '@/framework/components/form/FieldDateRange.vue';
import FieldTime from '@/framework/components/form/FieldTime.vue';
import FieldTimeRange from '@/framework/components/form/FieldTimeRange.vue';
import FieldSelect from '@/framework/components/form/FieldSelect.vue';
import FieldMultiSelect from '@/framework/components/form/FieldMultiSelect.vue';
import FieldSwitch from '@/framework/components/form/FieldSwitch.vue';
import FieldDivider from '@/framework/components/form/FieldDivider.vue';
import FieldEditor from '@/framework/components/form/FieldEditor.vue';
import FieldFile from '@/framework/components/form/FieldFile.vue';
import FieldMultiFile from '@/framework/components/form/FieldMultiFile.vue';
import FieldCode from "@/framework/components/form/FieldCode.vue";

const props = defineProps({
    title: String,
    loading: Boolean,
    description: String,
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
    size: computed(() => store.state.size)
})
const transModel = ref({});
const obj = ref({
    str: {
        required: '{0}这里是自定义的提示'
    }
});

const items: Ref = toRef(props, 'items');
const {schema} = useValidation(items, transModel, obj)

const formRef: any = ref<InstanceType<typeof ElForm>>();
const emit = defineEmits([
    'submit'
])

const onChange = (field: any) => {
    let inter = clone(transModel.value);
    set(inter, get(field, 'name'), get(field, 'value'));
    transModel.value = inter;
}

const onSubmit = () => {
    formRef.value.validate().then(() => {
        emit('submit', transModel.value);
    });
}

const onReset = () => {
    formRef.value.resetFields();
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
@import '../../../assets/style/vars';
</style>

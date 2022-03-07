<template>
    <ElForm label-position="top" :size="trans.size">
        <ElRow v-if="get(attr, 'items', [])" :gutter="4" class="py--filter">
            <ElCol v-for="item in attr.items" :key="item" :span="sizeWidth(trans.media, get(item , 'width'))">
                <ElFormItem :label="get(item, 'label')">
                    <FilterText v-if="get(item, 'type') === 'text' && get(item, 'explain') !== 'between'" :attr="get(item, 'options')"
                        v-model="model[get(item, 'name')]"/>
                    <FilterDate v-if="get(item, 'type') === 'datetime' && get(item, 'explain') !== 'between_date'" :attr="get(item, 'options')"
                        v-model="model[get(item, 'name')]"/>
                    <FilterSelect v-if="get(item, 'type') === 'select'" :attr="get(item, 'options')"
                        v-model="model[get(item, 'name')]"/>
                    <FilterMultiSelect v-if="get(item, 'type') === 'multi-select'" :attr="get(item, 'options')"
                        v-model="model[get(item, 'name')]"/>
                    <FilterTextBetween v-if="get(item, 'type') === 'text' && get(item, 'explain') === 'between'" :attr="get(item, 'options')"
                        v-model="model[get(item, 'name')]"/>
                    <FilterDateBetween v-if="get(item, 'type') === 'datetime' && get(item, 'explain') === 'between_date'" :attr="get(item, 'options')"
                        v-model="model[get(item, 'name')]"/>
                </ElFormItem>
            </ElCol>
            <!--    操作    -->
            <ElCol :span="sizeWidth(trans.media, get(attr , 'action.width'))">
                <ElFormItem label="操作">
                    <ElButton type="primary" @click="onSubmit" native-type="submit" :loading="trans.loading && trans.current==='submit'">
                        搜索
                    </ElButton>
                    <ElButton type="info" @click="onReset" :loading="trans.loading && trans.current==='reset'">
                        重置
                    </ElButton>
                </ElFormItem>
            </ElCol>
        </ElRow>
    </ElForm>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { get } from 'lodash-es';
import { sizeWidth } from "@/framework/utils/helper";
import FilterText from "@/framework/components/filter/FilterText.vue";
import FilterDate from "@/framework/components/filter/FilterDate.vue";
import FilterSelect from "@/framework/components/filter/FilterSelect.vue";
import FilterMultiSelect from "@/framework/components/filter/FilterMultiSelect.vue";
import { useStore } from "@/store";
import FilterTextBetween from "@/framework/components/filter/FilterTextBetween.vue";
import FilterDateBetween from "@/framework/components/filter/FilterDateBetween.vue";
import { useRouter } from "vue-router";

const props = defineProps({
    attr: Object,
    modelValue: {
        type: Object,
        default: () => {
            return {}
        }
    }
})

const store = useStore();
const router = useRouter();

const trans = reactive({
    loading: computed(() => store.state.grid.loading),
    media: computed(() => store.state.poppy.media),
    size: computed(() => store.state.poppy.size),
    current: ''
})


const emit = defineEmits([
    'search',
    'reset',
    'update:modelValue',
])

const val: any = ref([]);

const model = ref({});

const onReset = () => {
    trans.current = 'reset';
    model.value = {}
    emit('update:modelValue', model.value)
}

const onSubmit = () => {
    trans.current = 'submit'
    emit('update:modelValue', model.value)
}

watch(() => trans.loading, (newVal: boolean) => {
    if (!newVal) {
        trans.current = '';
    }
})

watch(() => props.modelValue, (newVal) => {
    model.value = newVal;
})

// set Url Has Query Scope
const init = () => {
    model.value = props.modelValue;
}

onMounted(() => {
    init();
})
</script>

<template>
    <ElForm label-position="top" :size="trans.size" v-loading="loading">
        <ElRow v-if="get(attr, 'items', []).length" :gutter="4" class="py--filter">
            <ElCol v-for="item in attr.items" :key="item" :span="sizeWidth(trans.media, get(item , 'width'))">
                <ElFormItem :label="get(item, 'label')">
                    <template v-if="get(item, 'query') === 'between'">
                        <FilterTextBetween v-if="get(item, 'type') === 'text'" :attr="get(item, 'options')" v-model="model[get(item, 'name')]"/>
                        <FilterSelectBetween v-if="get(item, 'type') === 'select'" :attr="get(item, 'options')" v-model="model[get(item, 'name')]"/>
                        <FilterDatetimeBetween v-if="get(item, 'type') === 'datetime'" :attr="get(item, 'options')" v-model="model[get(item, 'name')]"/>
                    </template>
                    <template v-if="includes(['like', 'starts_with', 'ends_with'], get(item, 'query'))">
                        <FilterText :attr="get(item, 'options')" v-model="model[get(item, 'name')]"/>
                    </template>
                    <template v-if="includes(['equal', 'gt', 'lt', 'gte', 'lte'], get(item, 'query'))">
                        <FilterText v-if="get(item, 'type') === 'text'" :attr="get(item, 'options')" v-model="model[get(item, 'name')]"/>
                        <FilterSelect v-if="get(item, 'type') === 'select'" :attr="get(item, 'options')" v-model="model[get(item, 'name')]"/>
                        <FilterDate v-if="get(item, 'type') === 'datetime'" :attr="get(item, 'options')" v-model="model[get(item, 'name')]"/>
                    </template>
                    <template v-if="includes(['not_equal'], get(item, 'query'))">
                        <FilterText v-if="get(item, 'type') === 'text'" :attr="get(item, 'options')" v-model="model[get(item, 'name')]"/>
                        <FilterSelect v-if="get(item, 'type') === 'select'" :attr="get(item, 'options')" v-model="model[get(item, 'name')]"/>
                    </template>
                    <template v-if="includes(['in', 'not_in'], get(item, 'query'))">
                        <FilterMultiSelect :attr="get(item, 'options')" v-model="model[get(item, 'name')]"/>
                    </template>
                    <template v-if="includes(['where'], get(item, 'query'))">
                        <FilterMultiSelect :attr="get(item, 'options')" v-if="get(item, 'type') === 'multi-select'" v-model="model[get(item, 'name')]"/>
                        <FilterText :attr="get(item, 'options')" v-if="get(item, 'type') === 'text'" v-model="model[get(item, 'name')]"/>
                        <FilterSelect v-if="get(item, 'type') === 'select'" :attr="get(item, 'options')" v-model="model[get(item, 'name')]"/>
                        <FilterDate v-if="get(item, 'type') === 'datetime'" :attr="get(item, 'options')" v-model="model[get(item, 'name')]"/>
                        <FilterTextBetween v-if="get(item, 'type') === 'text-between'" :attr="get(item, 'options')" v-model="model[get(item, 'name')]"/>
                        <FilterSelectBetween v-if="get(item, 'type') === 'select-between'" :attr="get(item, 'options')" v-model="model[get(item, 'name')]"/>
                        <FilterDatetimeBetween v-if="get(item, 'type') === 'datetime-between'" :attr="get(item, 'options')" v-model="model[get(item, 'name')]"/>
                    </template>
                </ElFormItem>
            </ElCol>
            <!--    操作    -->
            <ElCol :span="sizeWidth(trans.media, get(attr , 'action.width'))">
                <ElFormItem label="操作" class="filter-action">
                    <ElDropdown class="filter-export" :hide-on-click="true" @command="onExport" v-if="get(attr , 'action.export', false)">
                        <ElButton type="primary">
                            导出
                            <ElIcon class="el-icon--right">
                                <ArrowDown/>
                            </ElIcon>
                        </ElButton>
                        <template #dropdown>
                            <ElDropdownMenu>
                                <ElDropdownItem command="page">当前页</ElDropdownItem>
                                <ElDropdownItem command="select" :disabled="!pk || pkValues.length <=0">已选择数据</ElDropdownItem>
                                <ElDropdownItem command="query">当前查询条件</ElDropdownItem>
                                <ElDropdownItem command="all">所有数据</ElDropdownItem>
                            </ElDropdownMenu>
                        </template>
                    </ElDropdown>
                    <ElButton type="primary" @click="onSearch" native-type="submit" :disabled="store.getters['poppy/isLoading']() && trans.current==='search'">
                        搜索
                    </ElButton>
                    <ElButton type="info" @click="onReset" :disabled="store.getters['poppy/isLoading']() && trans.current==='reset'">
                        重置
                    </ElButton>
                </ElFormItem>
            </ElCol>
        </ElRow>
    </ElForm>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { get, includes } from 'lodash-es';
import { sizeWidth } from "@popjs/core/utils/helper";
import FilterText from "@/components/filter/FilterText.vue";
import FilterSelect from "@/components/filter/FilterSelect.vue";
import FilterMultiSelect from "@/components/filter/FilterMultiSelect.vue";
import { useStore } from "@/services/store";
import FilterTextBetween from "@/components/filter/FilterTextBetween.vue";
import { useRouter } from "vue-router";
import { ArrowDown } from "@element-plus/icons-vue";
import FilterSelectBetween from "@/components/filter/FilterSelectBetween.vue";
import FilterDate from "@/components/filter/FilterDate.vue";
import FilterDatetimeBetween from "@/components/filter/FilterDateBetween.vue";

const props = defineProps({
    attr: Object,
    loading: Boolean,
    // pk & pkValues 用于对导出操作进行启用禁用展示
    pk: {
        type: String,
        default: ''
    },
    pkValues: {
        type: Array,
        default: () => {
            return []
        }
    },
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
    media: computed(() => store.state.poppy.media),
    size: computed(() => store.state.poppy.size),
    current: ''
})


const emit = defineEmits([
    'filter',
])

const val: any = ref([]);

const model = ref({});

const onReset = () => {
    trans.current = 'reset';
    model.value = {}
    emit('filter', {
        type: 'reset',
        model: model.value
    })
}

const onSearch = () => {
    trans.current = 'search'
    emit('filter', {
        type: 'search',
        model: model.value
    })
}
const onExport = (val: string) => {
    trans.current = 'export'
    emit('filter', {
        type: 'export',
        ep: val,
        model: model.value
    })
}

watch(() => store.getters['poppy/isLoading'](), (newVal: boolean) => {
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

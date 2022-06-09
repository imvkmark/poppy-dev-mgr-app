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
import { get, includes, omit } from 'lodash-es';
import { sizeWidth } from "@popjs/core/utils/helper";
import FilterText from "@/components/grid/FilterText.vue";
import FilterSelect from "@/components/grid/FilterSelect.vue";
import FilterMultiSelect from "@/components/grid/FilterMultiSelect.vue";
import { useStore } from "@/store";
import FilterTextBetween from "@/components/grid/FilterTextBetween.vue";
import { useRouter } from "vue-router";
import { ArrowDown } from "@element-plus/icons-vue";
import FilterSelectBetween from "@/components/grid/FilterSelectBetween.vue";
import FilterDate from "@/components/grid/FilterDate.vue";
import FilterDatetimeBetween from "@/components/grid/FilterDateBetween.vue";
import { emitter } from "@popjs/core/bus/mitt";
import { MGR_APP_MOTION_GRID_EXPORT, MGR_APP_MOTION_GRID_SEARCH } from "@/bus";

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
    }
})

const store = useStore();
const router = useRouter();

const trans = reactive({
    media: computed(() => store.state.poppy.media),
    size: computed(() => store.state.poppy.size),
    current: ''
})

const val: any = ref([]);

const model = ref({});

const onReset = () => {
    model.value = {}
    emitter.emit(MGR_APP_MOTION_GRID_SEARCH, {});
}

const onSearch = () => {
    emitter.emit(MGR_APP_MOTION_GRID_SEARCH, model.value);
}
const onExport = (val: string) => {
    emitter.emit(MGR_APP_MOTION_GRID_EXPORT, {
        type: val,
        model: model.value
    });
}

watch(() => store.getters['poppy/isLoading'](), (newVal: boolean) => {
    if (!newVal) {
        trans.current = '';
    }
})

const init = () => {
    // 恢复数据, 从 Url 参数中获取, 移除结构化查询数据
    const { query } = router.currentRoute.value;
    model.value = omit(query, ['_query', '_scope', '_sort', 'pagesize', 'page']);
}

onMounted(() => {
    init();
})
</script>

<template>
    <ElForm label-position="top">
        <ElRow v-if="get(attr, 'items', [])" :gutter="4" class="py--filter">
            <ElCol v-for="item in attr.items" :key="item" :span="get(item , 'width')">
                <ElFormItem :label="get(item, 'label')">
                    <FilterText :name="get(item, 'name')" :attr="get(item, 'options')"
                        v-if="get(item, 'type') === 'text' && get(item, 'explain') !== 'between'"
                        :value="get(model, get(item, 'name'))" @change="onChange"/>
                    <FilterDate :name="get(item, 'name')" :attr="get(item, 'options')"
                        v-if="get(item, 'type') === 'datetime' && get(item, 'explain') !== 'between_date'"
                        :value="get(model, get(item, 'name'))" @change="onChange"/>
                    <FilterSelect :name="get(item, 'name')" :attr="get(item, 'options')"
                        v-if="get(item, 'type') === 'select'"
                        :value="get(model, get(item, 'name'))" @change="onChange"/>
                    <FilterMultiSelect :name="get(item, 'name')" :attr="get(item, 'options')"
                        v-if="get(item, 'type') === 'multi-select'"
                        :value="get(model, get(item, 'name'))" @change="onChange"/>

                    <FilterTextBetween :name="get(item, 'name')" :attr="get(item, 'options')"
                        v-if="get(item, 'type') === 'text' && get(item, 'explain') === 'between'"
                        :value="get(model, get(item, 'name'))" @change="onChange"/>
                    <FilterDateBetween :name="get(item, 'name')" :attr="get(item, 'options')"
                        v-if="get(item, 'type') === 'datetime' && get(item, 'explain') === 'between_date'"
                        :value="get(model, get(item, 'name'))" @change="onChange"/>
                </ElFormItem>
            </ElCol>
            <!--    操作    -->
            <ElCol :span="get(attr , 'action.width')">
                <ElFormItem label="操作">
                    <ElButton type="primary" @click="onSubmit" native-type="submit"
                        :loading="trans.loading && trans.current==='submit'">
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
import { computed, reactive, ref, watch } from 'vue';
import { clone, get, set } from 'lodash-es';
import FilterText from "@/framework/components/filter/FilterText.vue";
import FilterDate from "@/framework/components/filter/FilterDate.vue";
import FilterSelect from "@/framework/components/filter/FilterSelect.vue";
import FilterMultiSelect from "@/framework/components/filter/FilterMultiSelect.vue";
import { useStore } from "@/store";
import FilterTextBetween from "@/framework/components/filter/FilterTextBetween.vue";
import FilterDateBetween from "@/framework/components/filter/FilterDateBetween.vue";

const props = defineProps({
    attr: Object,
})

const store = useStore();

const trans = reactive({
    loading: computed(() => store.state.grid.loading),
    current: ''
})


const emit = defineEmits([
    'search',
    'reset',
])

const val: any = ref([]);

const model = ref({});

const onChange = (field: any) => {
    let inter = clone(model.value);
    set(inter, get(field, 'name'), get(field, 'value'));
    model.value = inter;
}

const onReset = () => {
    trans.current = 'reset';
    model.value = {}
    emit('reset')
}

const onSubmit = () => {
    trans.current = 'submit'
    emit('search', model.value)
}

watch(() => trans.loading, (newVal: boolean) => {
    if (!newVal) {
        trans.current = '';
    }
})
</script>

<template>
    <ElTable class="py--table" :data="refOriValue" border stripe>
        <template v-for="col in get(attr, 'cols')" :key="col">
            <ElTableColumn
                :align="get(col, 'align', 'left')" :fixed="get(col, 'fixed', false)" :sortable="get(col, 'sortable')"
                :prop="get(col, 'field')" :min-width="get(col, 'min-width', '')" :width="get(col, 'width', '')" :label="get(col, 'label')">
                <template #default="{row}">
                    <ColumnText v-if="get(col, 'type') === 'text'" :value="get(row, col.field)"
                        :ellipsis="get(col, 'ellipsis', false)" :copyable="get(col, 'copyable', false)"
                        :editable="get(col, 'editable', '')" :attr="get(col, 'edit-attr', {})" :field="get(col, 'field')" :pk-id="row[props.pk]"
                        @update="onUpdateCell"/>
                    <ColumnHidden v-else-if="get(col, 'type') === 'hidden'" :value="get(row, col.field)"
                        :pk-id="get(row, [props.pk])" :attr="get(col, 'edit-attr', {})" :field="get(col, 'field')"/>
                    <ColumnOnOff v-else-if="get(col, 'type') === 'on-off'" :value="get(row, col.field)"
                        :editable="get(col, 'editable', '')" :attr="get(col, 'edit-attr', {})" :field="get(col, 'field')" :pk-id="row[props.pk]"
                        @update="onUpdateCell"/>
                    <ColumnSelect v-else-if="get(col, 'type') === 'select'" :value="get(row, col.field)"
                        :editable="get(col, 'editable', '')" :attr="get(col, 'edit-attr', {})" :field="get(col, 'field')" :pk-id="row[props.pk]"
                        @update="onUpdateCell"/>
                    <ColumnLink v-else-if="get(col, 'type') === 'link'"
                        :ellipsis="get(col, 'ellipsis', false)" :value="get(row, col.field)"/>
                    <ColumnImage v-else-if="get(col, 'type') === 'image'"
                        :value="get(row, col.field)"/>
                    <ColumnDownload v-else-if="get(col, 'type') === 'download'"
                        :value="get(row, col.field)"/>
                    <ColumnHtml v-else-if="get(col, 'type') === 'html'"
                        :value="get(row, col.field)"/>
                    <ColumnActions v-else-if="get(col, 'type') === 'actions'"
                        :value="get(row, col.field)"/>
                    <template v-else>{{ get(row, col.field) }}</template>
                </template>
            </ElTableColumn>
        </template>
    </ElTable>
</template>
<script lang="ts" setup>
import { clone, find, get, isObjectLike, set } from 'lodash-es';
import { onMounted, ref, watch } from "vue";
import ColumnText from "@/components/grid/ColumnText.vue";
import ColumnHidden from "@/components/grid/ColumnHidden.vue";
import ColumnOnOff from "@/components/grid/ColumnOnOff.vue";
import ColumnSelect from "@/components/grid/ColumnSelect.vue";
import ColumnLink from "@/components/grid/ColumnLink.vue";
import ColumnImage from "@/components/grid/ColumnImage.vue";
import ColumnDownload from "@/components/grid/ColumnDownload.vue";
import ColumnHtml from "@/components/grid/ColumnHtml.vue";
import ColumnActions from "@/components/grid/ColumnActions.vue";


const props = defineProps({
    attr: Object,
    modelValue: {
        type: Array,
        default: () => {
            return []
        }
    }
})

const emit = defineEmits([
    'update:modelValue'
]);

const refOriValue = ref<any[]>([]);


/**
 * 进行修改
 * @param obj
 */
const onUpdateCell = (obj: object) => {
    /* modify: 更新单元格数据
     * save : 保存数据到服务端
     * ---------------------------------------- */
    let pk = get(obj, 'pk');
    let field = get(obj, 'field');
    let value = get(obj, 'value');
    // 值变动请求服务器
    let row = find(refOriValue.value, { [props.pk]: pk }) as object;

    // 当前变动的对象是 {value} | value
    let cpOriVal = get(row, [field]);


    // 首先改变数据, 根据数据的类型来定, 如果是矢量类型, 则未经过 Render
    let cpEditVal = clone(cpOriVal);
    if (isObjectLike(cpEditVal)) {
        set(cpEditVal, 'value', value);
    } else {
        cpEditVal = value;
    }
    set(row, [field], cpEditVal);
}

onMounted(() => {
    // 需要对数据进行处理加入默认PK
    refOriValue.value = props.modelValue;
})

</script>

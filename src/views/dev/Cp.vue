<template>
    <div class="group">
        <ElScrollbar>
            <div class="group-search">
                <h3>接口查询</h3>
                <ElInput v-model="kw" clearable placeholder="输入关键词来查询"/>
            </div>
            <template v-for="(items, key) in trans.groups" :key="key">
                <h4>{{ key }}</h4>
                <ul>
                    <template v-for="(item, k) in items" :key="k">
                        <li @click="item">
                            <span class="text-ellipsis">{{ get(item, 'title') }} {{ get(item, 'description') ? '-' + get(item, 'description') : '' }} </span>
                            <span class="group-url">{{ get(item, 'url') }}</span>
                        </li>
                    </template>
                </ul>
            </template>
        </ElScrollbar>
    </div>
    <div class="form">
        <h3>请求参数</h3>
        <ElForm label-position="top">
            <ElFormItem v-for="param in parameters" :key="param">
                <FieldText v-model="def[get(param, 'field')]"/>
                <template #label>
                    <span class="text-ellipsis">{{ get(param, 'title') }} <em v-html="get(param, 'description')"/> </span>
                </template>
            </ElFormItem>

        </ElForm>
    </div>
    <div class="request">
        请求结果和文档
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useStore } from '@/services/store';
import { useRouter } from 'vue-router';
import request from "@/services/utils/request";
import { filter, find, first, get, groupBy } from "lodash-es";
import { base64Decode } from "@/services/utils/helper";
import FieldText from "@/components/form/FieldText.vue";

const store = useStore();
const router = useRouter();
const apidoc = ref([]);
const kw = ref('');
const def = ref({});
const parameters = computed(() => {
    return get(def.value, 'parameter.fields.Parameter', []);
})
const trans = reactive({
    groups: computed(() => {
        let filtered = filter(apidoc.value, (item) => {
            let title: string = get(item, 'title', '');
            let description: string = get(item, 'description', '');
            let pinyin: string = get(item, 'pinyin', '');
            let name: string = get(item, 'name', '');
            let url: string = get(item, 'url', '');
            if (!kw.value) {
                return true;
            }
            return title.indexOf(kw.value) > -1
                ||
                description.indexOf(kw.value) > -1
                ||
                pinyin.indexOf(kw.value) > -1
                ||
                url.indexOf(kw.value) > -1
                ||
                name.indexOf(kw.value) > -1;
        })
        return groupBy(filtered, (item) => {
            return get(item, 'group');
        })
    }),
    url: computed(() => {
        return get(def.value, 'url');
    }),
    title: computed(() => {
        return get(def.value, 'title');
    }),
    description: computed(() => {
        return get(def.value, 'description');
    }),
});

const selectUrl = (url: string) => {
    def.value = find(apidoc.value, (item: any) => {
        return get(item, 'url') === url;
    });
}

const fetchApiDoc = () => {
    request({
        url: '/api/mgr-dev/apidoc/json',
        params: {
            type: 'web'
        }
    }, 'develop').then(({ data }) => {
        apidoc.value = get(data, 'apidoc');

        let url = String(get(router.currentRoute.value.query, 'url', ''));
        if (url) {
            let index = base64Decode(url);
            selectUrl(index);
        } else {
            let item = first(apidoc.value);
            let index = String(get(item, 'url'));
            selectUrl(index);
        }
    });
}
onMounted(() => {
    fetchApiDoc()
})

</script>

<style scoped lang="less">

.group {
    width: 260px;
    height: 100vh;
    background: #fff;
    padding: 0.3rem 0 0.3rem 0.5rem;
    box-sizing: border-box;
    div.group-search {
        box-sizing: content-box;
        padding: 0.3rem 0;
        position: sticky;
        top: 0;
        background: #fff;
        .el-input {
            width: 96%;
        }
    }
    h3 {
        font-size: 16px;
        font-weight: normal;
        line-height: 32px;
        height: 32px;
        margin: 0;
    }
    h4 {
        font-size: 14px;
        line-height: 26px;
        height: 26px;
        margin: 0;
        font-weight: normal;
    }
    ul {
        font-size: 13px;
        padding: 0.3rem 0.5rem;
        margin: 0;
        li {
            line-height: 1.3;
            padding: 0.2rem;
            .group-url {
                line-height: 1.4;
                font-size: 12px;
            }

        }
    }
}

.form {
    width: 300px;
    border-right: 1px solid #eee;
    height: 100vh;
    em {
        font-style: normal;
        p {
            margin: 0;

        }
    }
}

.request {

}
</style>

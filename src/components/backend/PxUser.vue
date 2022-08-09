<template>
    <ElDropdown trigger="click" class="dropdown" placement="top-start" popper-class="dropdown-popper">
        <div class="user">
            <ElAvatar shape="square" :size="32" class="avatar">
                {{ username.at(0) }}
            </ElAvatar>
            <ElButton type="default" link class="username">
                {{ username }}
                <ElIcon class="el-icon--right">
                    <ArrowDown/>
                </ElIcon>
            </ElButton>
        </div>
        <template #dropdown>
            <div class="dropdown-content py--shadow">
                <ul>
                    <li>
                        <router-link class="ele-link" :to="{name:'user.setting'}">设置</router-link>
                    </li>
                </ul>
            </div>
        </template>
    </ElDropdown>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";
import { useStore } from "@/store";
import { get } from "lodash-es";
import { useRouter } from "vue-router";
import { ArrowDown } from "@element-plus/icons-vue";


const store = useStore();
const router = useRouter();
const media = computed(() => store.state.poppy.media);
const username = computed(() => {
    return String(get(store.state.poppy.user, 'username'));
})

const trans = reactive({
    media: computed(() => store.state.poppy.media),
    hasMenu: computed(() => {
        return Boolean(store.state.nav.menus.length)
    }),
})

</script>
<style scoped lang="less">
.user {
    margin: 8px 0;
    padding: 0 16px;
    display: flex;
}

.dropdown {
    display: block;
}

.avatar {
    background: var(--wc-color-light-blue);
    margin-right: 8px;
}

.username.el-button {
    flex: auto;
    color: var(--wc-menu-color);
    justify-content: flex-start;
    &:hover {
        color: var(--wc-menu-active-color);
    }
}

.dropdown-content {
    width: 186px;
    padding: 8px;
    box-sizing: border-box;
    ul {
        padding-left: 0;
        margin: 0;
        li {
            list-style: none;
            a {
                cursor: pointer;
                padding: 0 15px;
            }
        }
    }
}
</style>

<template>
    <ElDropdown trigger="click" class="user" placement="top-start" popper-class="dropdown-popper">
        <div class="user-info">
            <ElAvatar shape="square" :size="32" class="user-avatar">
                {{ username.at(0) }}
            </ElAvatar>
            <ElButton type="default" link class="user-name">
                {{ username }}
                <ElIcon class="el-icon--right">
                    <ArrowDown/>
                </ElIcon>
            </ElButton>
        </div>
        <template #dropdown>
            <div class="user-dropdown-content ele-shadow">
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
import { computed } from "vue";
import { useStore } from "@/store";
import { get } from "lodash-es";
import { ArrowDown } from "@element-plus/icons-vue";

const store = useStore();
const username = computed(() => {
    return String(get(store.state.poppy.user, 'username'));
})
</script>
<style scoped lang="less">


.user {
    display: block;
    .user-info {
        margin: 8px 0;
        padding: 0 16px;
        display: flex;
    }
    .user-avatar {
        background: var(--wc-color-light-blue);
        margin-right: 8px;
        cursor: pointer;
    }
    .user-name.el-button {
        flex: auto;
        color: var(--wc-menu-color);
        justify-content: flex-start;
        &:hover {
            color: var(--wc-menu-active-color);
        }
    }
    .user-dropdown-content {
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
}

@media screen and (max-width: 768px) {
    .nav-user {
        .user-info {
            padding: 0 0 0 16px;
        }
        .user-name {
            display: none;
        }
    }
}
</style>

<template>
    <PxMain title="居中线">
        <div class="main-content">
            <p class="align--dash_middle">
                <span>duoli</span>
            </p>
        </div>
    </PxMain>
</template>
<script lang="ts" setup>
import PxMain from '../../framework/components/base/PxMain.vue';
</script>

// url : https://www.yudouyudou.com/jiaochengheji/Html_css/1248.html
<style scoped lang="less">
.align--dash_middle {
    color: #F2AE11;
    font-size: 1.3em;
    height: 1rem;
    text-align: center;
    span {
        display: block;
        color: #2B99E1;
        position: relative;
        &:before,
        &:after {
            content: "";
            position: absolute;
            top: 52%;
            background: #494949;
            width: 50%;
            height: 2px;
        }
        &:before {
            left: 0;
        }
        &:after {
            right: 0;
        }
    }
}
</style>

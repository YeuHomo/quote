<template>
    <div>
        <mt-navbar v-model="selected">
            <mt-tab-item id="1" class="my-tab-item">车险报价</mt-tab-item>
            <mt-tab-item id="2" class="my-tab-item">快速续保</mt-tab-item>
        </mt-navbar>

        <mt-tab-container v-model="selected">
            <mt-tab-container-item id="1">
                <quote-form></quote-form>
            </mt-tab-container-item>
            <mt-tab-container-item id="2">
                <renewal-form></renewal-form>
            </mt-tab-container-item>
        </mt-tab-container>
        <footer>
            <p>
                <img src="../../assets/img/promise.png" alt="" class="small-logo">郑重承诺，所有车辆信息仅用于车险投保</p>
            <p>并通过加密算法，保密不外泄</p>
        </footer>
    </div>
</template>

<script>

    import QuoteForm from '@/components/quoteform.vue'
    import RenewalForm from '@/components/renewalform.vue'

    export default {
        name: "bindcar",
        components: {
            QuoteForm,
            RenewalForm
        },
        data() {
            return {
                selected: '1',
            }
        },
        mounted() {
            if (this.$store.state.info.carno) {
                let info = this.$store.state.info;
                this.selected = info.type === '2' ? '2' : '1'
            }
        }
    }
</script>

<style scoped lang="scss">
    .my-tab-item {
        background-color: #eeeeee;
        color: #333333;
    }

    .mint-navbar .mint-tab-item {
        padding: 3vw 0;
    }

    .mint-navbar .mint-tab-item.is-selected {
        background-color: #03c8af;
        color: #ffffff;
        border: 0;
    }

    footer {
        margin-top: 4vw;
        margin-bottom: 10px;
        width: 100%;
        color: #999999;
        p {
            text-align: center;
        }
        .small-logo {
            vertical-align: center;
            width: 10px;
            margin-right: 5px;
            margin-top: 3px;
        }
    }

</style>
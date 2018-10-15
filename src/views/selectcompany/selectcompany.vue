<template>
    <div>
        <header>选择保险公司</header>
        <div class="cells mychecklist">
            <div class="cell" v-for="(item,index) in company">
                <div class="checkbox checkbox-primary">
                    <input :id="item.value" type="checkbox" v-model="mycompany" :value="item.value">
                    <label :for="item.value" class="w95">
                        <img :src="'https://kaka.kelibbb.com/quote/img/bxlogo/'+item.value+'.png'" alt=""
                             class="logo-img">
                        {{item.label}}
                    </label>
                </div>
            </div>
            <!--<mt-checklist-->
            <!--v-model="mycompany"-->
            <!--:options="company"></mt-checklist>-->
        </div>
        <div class="btn_box">
            <button class="btn_50" @click="back">上一步</button>
            <button class="btn_50" @click="submitInfo">下一步</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "selectcompany",
        data() {
            return {
                company: [
                    {
                        label: '人保财险',
                        value: 'PICC'
                    },
                    {
                        label: '太平洋产险',
                        value: 'CPIC'
                    },
                    {
                        label: '平安产险',
                        value: 'PAIC'
                    },
                    // {
                    //     label: '国寿财险',
                    //     value: 'CLPC'
                    // },
                ],
                mycompany: []
            }
        },
        mounted(){
            if(this.$store.state.info.insurcode){
                let company = this.$store.state.info.insurcode;
                this.mycompany = company.split(',');
            }
        },
        methods: {
            back() {
                this.$router.go(-1);
            },
            submitInfo() {
                let info = this.$store.state.info;
                info.insurcode  = this.mycompany.join(",");
                this.$store.state.info = info;
                this.$router.push({path: "/adjustment"});
                console.log(info);
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/css/common.scss';
    .cells {
        /*background-color: #fff;*/
    }

    .cell {
        background-color: #fff;
        margin: 10px auto;
        width: 95vw;
        /*padding: 5px;*/
        height: 17.6vw;
        line-height: 17.6vw;
        font-size: 3.7vw;
        border-bottom: solid 1px #e5e5e5;
        box-shadow: 0px 4px 12px 0px
        rgba(81, 78, 77, 0.17);
        border-radius: 6px;
    }

    .logo-img {
        width: 12vw;
        height: 12vw;
        vertical-align: middle;
        margin-right: 8.8vw;
        margin-left: 29.3vw;
    }
    input[type='checkbox']{
        width: 0;
        height: 0;
    }
    .checkbox label::before,.checkbox label::after{
        margin-left: 5.6vw;
    }
</style>
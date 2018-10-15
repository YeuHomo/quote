<template>
    <div>
        <div class="header">
            报价记录
        </div>
        <div class="cells" v-for="(item,index) in orderList">
            <div class="order-cell">
                <div class="left-cell">
                    <div class="order-carno">
                        {{item.carno?item.carno:'新车未上牌'}}
                        <div class="order-city">{{item.cityName}}</div>
                    </div>
                    <div class="order-time">
                        {{item.asktime}}
                    </div>
                </div>
                <div>
                    <button class="btn-cell" @click="showInfo(index)">查看报价</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "order",
        data(){
            return{
                orderList:{}
            }
        },
        mounted(){
            this.$indicator.open('加载中');
            this.getList();
        },
        methods:{
            async getList(){
                let self = this;
                const res = await self.$post("m=Carinsur&c=inputinsur&a=mobileOrderList", {
                    fanid: self.$store.state.fanid,
                    userid: self.$store.state.userInfo.id,
                    way: self.$store.state.way
                });
                console.log(res);
                if(res.error===0){
                    self.orderList = res.list;
                    self.$indicator.close();
                }
            },
            showInfo(index){
                this.$store.state.info = this.orderList[index];
                let orderid = this.orderList[index].id;
                this.$router.push({path: "/result", query: {orderid: orderid,history:1}});

            }
        }
    }
</script>

<style scoped lang="scss">
    .header{
        /*width: 100%;*/
        background-color: #fff;
        text-align: center;
        padding: 15px;
        font-size: 1.3rem;
        border-bottom: 2px solid #03c8af;
    }
    .order-cell{
        margin-bottom: 10px;
        background-color: #fff;
        display: flex;
        justify-content:space-between;
        align-items:center;
        padding: 10px;
    }
    .btn-cell{
        border:0;
        background-color: #03c8af;
        color:#fff;
        padding: 5px;
        width: 90px;
        height: 40px;
        border-radius: 40px;
        font-size: 14px;
    }
    .order-carno{
        font-size: 16px;
    }
    .order-time{
        color:#888;
    }
    .order-city{
        float: right;
        margin-left: 20px;
        font-size: 14px;
    }
</style>
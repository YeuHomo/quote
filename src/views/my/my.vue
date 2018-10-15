<template>
    <div>
        <div class="avatar-box">
            <img :src="avatar" class="avatar" alt="">
            <span class="name">{{name}}</span>
        </div>
        <div class="cells">
            <mt-cell title="数据统计（开发中）" is-link class="my-cell">
                <img slot="icon" src="https://kaka.kelibbb.com/klklh/carInsurance/images/my8.png" width="18" height="18">
            </mt-cell>
            <!--<router-link to="/about">-->
                <mt-cell title="关于我们" is-link class="my-cell">
                    <img slot="icon" src="https://kaka.kelibbb.com/klklh/carInsurance/images/my6.png" width="18" height="18">
                </mt-cell>
            <!--</router-link>-->

            <mt-cell title="联系客服" is-link class="my-cell">
                <img slot="icon" src="https://kaka.kelibbb.com/klklh/carInsurance/images/my7.png" width="18" height="18">
            </mt-cell>
        </div>
    </div>
</template>

<script>
    export default {
        name: "my",
        data(){
            return{
                avatar:this.$store.state.userInfo.headimgurl,
                name:this.$store.state.userInfo.userName
            }
        },
        methods:{
            // callPhone(){
            //     window.location.href = "tel://0571-85165952";
            // }

        }
    }
</script>

<style lang="scss" scoped>
    .avatar-box{
        background-color: #03c8af;
        /*width: 100vw;*/
        /*height: 30vw;*/
        padding: 5vw 10vw;
        .avatar{
            width: 80px;
            height: 80px;
            vertical-align: middle;
            border-radius: 50%;
        }
        .name{
            color:#fff;
            font-size: 2rem;
            margin-left: 10vw;
            margin-top: 2vw;
        }

    }
    .cells{
        margin-top: 15px;
        .my-cell{
            img{
                margin: 0 10px 0 5px;
            }
        }
    }

</style>
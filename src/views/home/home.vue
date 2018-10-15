<template>
    <div class="container">
        <div class="header">
            <img src="../../assets/img/index_banner.png" alt="" class="w100">
        </div>
        <div class="body">
            <router-link to="/bindcar">
                <img src="../../assets/img/index1.png" alt="" class="w100">
            </router-link>
            <router-link to="/order">
                <img src="../../assets/img/index2.png" alt="" class="w100">
            </router-link>
            <router-link to="/my">
                <div class="myavatar">
                    <img src="../../assets/img/index3.png" alt="" class="w100">
                    <img :src="avatar" alt="" class="avatar">
                </div>
            </router-link>
        </div>
        <div class="footer">
            <p>powered by 杭州可里可里科技有限公司</p>
            <p>Copyright 2018 kelibbb.com All Rights Reserved</p>
        </div>
    </div>
</template>

<script>

    export default {
        data(){
            return{
                avatar:this.$store.state.userInfo.headimgurl
            }
        },
        mounted() {
            if (!this.$store.state.fanid || this.$store.state.fanid === '0') {
                window.location.href = 'https://kaka.kelibbb.com/klkl/merchants.php?m=Carinsur&c=h5&a=index&key=kk&role=4';
            }
            this.$store.state.info = {};
        },
    }
</script>

<style lang="scss" scoped>

    body {
        background-color: #f1f1f1;
    }

    .container {
        display: flex;
        flex-direction: column;
    }

    .body {
        margin: 1vw 2.5vw 0 2.5vw;
        flex: 1;
        img {
            margin-top: 1vw;
        }
    }

    .container {
        display: flex;
        display: -webkit-flex;
        min-height: 100vh;
        flex-direction: column;
        text-align: center;
        justify-content: center;
    }



    .myavatar {
        position: relative;
        .avatar {
            width: 13.9vw;
            height: 13.9vw;
            border-radius: 50%;
            position: absolute;
            top: 4.4vw;
            left: 5.7vw;
        }
    }


</style>
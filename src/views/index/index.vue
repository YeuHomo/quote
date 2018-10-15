<template>
    <div class="index">
        <div class="error" v-show="fanid==='0'">
            <img src="../../assets/img/error.png" alt="" class="myimg">
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                fanid: null
            }
        },
        mounted() {
            console.log(this.$route);
            let fanid = this.$route.params.fanid;
            this.fanid = fanid;
            if (fanid !== '0') {
                this.$store.state.fanid = fanid;
                this.$store.state.way = this.$route.params.way;
                this.getData();
            }
        },
        methods: {
            async getData() {
                let self = this;
                const res = await self.$post("m=Carinsur&c=inputinsur&a=indexinfo", {
                    fanid: self.$store.state.fanid,
                    way: self.$store.state.way
                });
                console.log(res);
                if (res.userinfo) {
                    let userinfo = res.userinfo;
                    userinfo.headimgurl = res.faninfo.headimgurl;
                    self.$store.state.userInfo = userinfo;
                    this.$router.push('/');
                } else {
                    this.$toast('用户数据获取失败');
                    setTimeout(function () {
                        window.location.href = 'https://kaka.kelibbb.com/klkl/merchants.php?m=Carinsur&c=h5&a=index&key=kk&role=4';
                    }, 4000);
                }
            }
        }
    }
</script>

<style scoped>
    html, body {
        background-color: #fff;
        /*height: 100vh;*/
    }
    .error{
        width: 100%;
        text-align: center;
    }
    .myimg {
        width: 40vw;
        margin-top: 40vw;
    }

    .index {
        background-color: #fff;
        height: 100vh;
    }
</style>
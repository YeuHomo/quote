<template>
    <div id="app">
        <div id="nav">
            <router-link to="/home"></router-link>
        </div>
        <router-view/>
    </div>
</template>

<style lang="scss">
    @import 'app.scss';
</style>
<script>
    // import {GetUrlParam} from "@/utils/common";
    export default {
        mounted() {
            // console.log( this.$route);
            // if ((!this.$store.state.fanid || this.$store.state.fanid === '0') && this.$route.name !== 'index') {
            //     // window.location.href = 'https://kaka.kelibbb.com/klkl/merchants.php?m=Carinsur&c=h5&a=index&key=kk&role=4';
            // }
        },
        created() {
            if (sessionStorage.getItem("store")) {
                this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem("store"))))
            }

            window.addEventListener("beforeunload", () => {
                sessionStorage.setItem("store", JSON.stringify(this.$store.state))
            })
        }
    }
</script>

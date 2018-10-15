<template>
    <!--键盘-->
    <div>
        <mt-cell title="车牌号" @click.native="showKeyBoard" v-model="testCarno">
            <!--<input type="text" placeholder="请输入车牌号" v-model="info.carno" class="my-input">-->
        </mt-cell>
        <!--<div>{{testCarno}}</div>-->
        <key-board :carno="testCarno" @keyboard-carno="parentEvent" v-show="isKeyboard"></key-board>
    </div>

</template>

<script>
    import KeyBoard from '@/components/keyboard.vue'
    export default {
        name: "information",
        components: {
            KeyBoard
        },
        data(){
            return{
                testCarno:'浙AD4567',
                isKeyboard:false
            }
        },
        methods:{
            changeKeyboard(){
                this.isKeyboard = false;
            },
            showKeyBoard(){

                this.isKeyboard = true;
            },
            parentEvent(data){
                this.testCarno = data;
            },
        }
    }
</script>

<style scoped>
    .del_icon {
        width: 100%;
        height: 100%;
        background: url(https://kaka.kelibbb.com/images/cancel.png) top center;
        background-size: 100% 100%;
        background-color: #eee;
    }

    .abc_icon {
        flex: 1 1 9%;
        background-color: #eee;
        padding: 0 5px;
    }

    .keyboard {
        z-index: 9999;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: auto;
        background: #eee;
        display: -webkit-flex;
        display: flex;
        flex-wrap: wrap;
        border-bottom: 7px solid #eee;
        border-top: 10px solid #eee;
    }

    .td {
        flex-grow: 1;
        text-align: center;
        font-size: 15px;
        height: 42px;
        line-height: 42px;
        background: #fff;
        margin: 3px;
        border: 1px solid #cdd0d5;
        color: #1e1e1e;
        border-radius: 5px;
        box-shadow: 3px 3px 1px #cdd0d5;
    }

    .td_nor {
        flex: 1 1 7%;
    }

    .td_num {
        flex: 1 1 7%;
    }

    .td_abc {
        flex: 1 1 8%;
    }

    .td_spec_fin {
        background-color: #03c8af;
        color: #fff;
        flex: 1 1 20%;
    }

    .td_spec_del {
        width: 50px;
        height: 50px;
    }

    .board_bg1 {
        box-shadow: 0 0 0 #e5e5e5;
        background: #e5e5e5;
    }

    .board_bg:hover {
        box-shadow: 0 0 0 #e5e5e5;
        background: #e5e5e5;
    }

    .board_bg_spec:hover {
        box-shadow: 0 0 0 #e5e5e5;
    }

</style>
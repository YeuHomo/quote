<template>
    <!--键盘-->
    <div class="keyboard">

        <!--省份简写键盘-->
        <div class="td td_nor board_bg" v-for="(itemName,idx) in keyboardValue" :key="idx" v-if="!specialBtn">
            <div class="del_icon" v-if="idx === 38" @click="hideKeyboard(idx,itemName)"></div>
            <div class="abc_icon" v-else-if="idx === 30" @click="changeKeyboard(idx,itemName)">ABC
            </div>
            <div v-else @click="tapKeyboard(idx,itemName)">
                {{itemName}}
            </div>
        </div>

        <!--数字键盘-->
        <div v-if="specialBtn && !tapNum" class="td td_num board_bg1" v-for="(itemName,idx) in keyboardNumber">
            {{itemName}}
        </div>

        <!--数字键盘可点击-->
        <div v-if="specialBtn && tapNum" class="td td_num board_bg" v-for="(itemName,idx) in keyboardNumber"
             :val="itemName" :key="idx" @click="tapKeyboard(idx,itemName)">
            {{itemName}}
        </div>

        <!--字母键盘-->
        <div v-if="specialBtn" class="td td_abc board_bg" v-for="(itemName,idx) in keyboardAlph">
            <div :class="{del_icon:idx === 17}" @click="tapKeyboard(idx,itemName)">
                {{idx === 17?'':itemName}}
            </div>
        </div>

        <!--完成按钮-->
        <div class="td td_spec_fin board_bg_spec" v-for="(itemName,idx) in keyboard2For"
             @click="hideKeyboard" v-if="specialBtn">
            {{itemName}}
        </div>
    </div>

</template>

<script>
    export default {
        name: "keyboard",
        props: ['carno'],
        data() {
            return {
                specialBtn: false,
                tapNum: false,//数字键盘是否可以点击
                isFocus: false,//输入框聚焦
                keyflag: false,//防止多次点击的阀门
                keyboardNumber: '1234567890',
                keyboardAlph: 'QWERTYULPASDFGHJK巛ZXCVBNM',
                keyboard1: '京沪粤津冀晋蒙辽吉黑苏浙皖闽赣鲁豫鄂湘桂琼渝川贵云藏陕甘青宁>新使领警学港澳<',
                keyboard2: '',
                keyboard2For: ['关闭'],
                keyboardValue: '',
                textArr: [],
                testCarno: ''
            }
        },
        watch: {
            carno(val) {
                console.log(val);
                if (val !== '请输入车牌号') {
                    this.testCarno = val;
                }
                this.showKeyboard();
            }
        },
        mounted() {
            if (this.carno !== '请输入车牌号') {
                this.testCarno = this.carno;
            }
            this.showKeyboard();
        },
        methods: {
            showKeyboard: function () {
                let self = this;
                if (self.testCarno) {
                    self.textArr = self.testCarno.split('');
                }
                self.isFocus = true;
                self.isKeyboard = true;
                if (self.textArr.length > 1) {
                    self.changeKeyboard();
                } else {
                    self.keyboardValue = self.keyboard1;
                }
            },
            /**
             * 点击页面隐藏键盘事件
             */
            hideKeyboard: function () {
                let self = this;
                self.$emit('keyboard-show', false);
                // if (self.isKeyboard) {
                //     //说明键盘是显示的，再次点击要隐藏键盘
                //     if (self.testCarno) {
                //         self.isKeyboard = false;
                //     } else {
                //         self.isKeyboard = false;
                //         self.isFocus = false;
                //     }
                // }
            },
            changeKeyboard: function () {
                this.specialBtn = true;
                this.tapNum = true;
                this.keyboardValue = this.keyboard2;
            },
            /**
             * 输入框聚焦触发，显示键盘
             */
            bindFocus: function () {
                let self = this;
                if (self.isKeyboard) {
                    //说明键盘是显示的，再次点击要隐藏键盘
                    self.isKeyboard = false;
                    self.isFocus = true;
                } else {
                    self.isKeyboard = true;
                    self.isFocus = true;
                    //说明键盘是隐藏的，再次点击显示键盘
                }
            },
            /**
             * 键盘事件
             */
            tapKeyboard: function (tapIndex, tapVal) {
                let self = this;
                //获取键盘点击的内容，并将内容赋值到textarea框中
                let keyboardValue;
                let specialBtn;
                let tapNum;

                if (tapVal === "巛") {
                    //说明是删除
                    self.textArr.pop();
                    if (self.textArr.length === 0) {
                        //说明没有数据了，返回到省份选择键盘
                        this.specialBtn = false;
                        this.tapNum = false;
                        this.keyboardValue = self.keyboard1;
                    } else if (self.textArr.length === 1) {
                        //只能输入字母
                        this.tapNum = false;
                        this.specialBtn = true;
                        this.keyboardValue = self.keyboard2;
                    } else {
                        this.specialBtn = true;
                        this.tapNum = true;
                        this.keyboardValue = self.keyboard2;
                    }
                    self.testCarno = self.textArr.join("");
                    self.$emit('keyboard-carno', self.testCarno);
                    return false
                }
                if (self.textArr.length >= 8) {
                    return false;
                }
                self.textArr.push(tapVal);
                self.testCarno = self.textArr.join("");
                self.keyboardValue = self.keyboard2;
                self.specialBtn = true;
                if (self.textArr.length > 1) {
                    //展示数字键盘
                    self.tapNum = true;
                }
                self.$emit('keyboard-carno', self.testCarno);
            }
        }
    }
</script>

<style scoped>
    .del_icon {
        width: 100%;
        height: 100%;
        background: url(https://kaka.kelibbb.com/images/cancel.png) top center;
        background-size: 100% 100%;
        /*background-color: #eee;*/
    }

    .abc_icon {
        flex: 1 1 9%;
        /*background-color: #eee;*/
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
        height: 40px;
        line-height: 40px;
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

    .board_bg:active {
        box-shadow: 0 0 0 #e5e5e5;
        background: #e5e5e5;
    }

    .board_bg_spec:active {
        box-shadow: 0 0 0 #e5e5e5;
    }

</style>
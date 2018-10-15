<template>
    <div>
        <div class="adjust-title">强制险</div>
        <div class="cells">
            <mt-cell title="商业险、车船税">
                <mt-switch v-model="FORCEPREMIUM" disabled="disabled"></mt-switch>
            </mt-cell>
            <p>车船税信息：按《中华人民共和国车船税暂行条例》规定在投保交强险同时需缴纳车船税。</p>
        </div>
        <div class="adjust-title">商业险调整</div>
        <div class="cells">
            <mt-cell title="投保基本险"></mt-cell>
            <mt-cell :title="item.name" v-for="(item,index,no) in insure" :key="index" v-if="no<5">
                <mt-checklist
                        v-if="item.has_mp && item.premium>0"
                        class="mycheck"
                        v-model="item.is_mp"
                        :options="options">
                </mt-checklist>
                <div class="myselect">
                    <select v-if="item.preArr" v-model="item.premium">
                        <option :value="i" v-for="(p,i) in item.preArr">{{p}}</option>
                    </select>
                </div>
            </mt-cell>
        </div>
        <div class="cells other">
            <mt-cell title="投保附加险" @click.native="showOther=!showOther">
                <img :src="icon" alt="" :class="{row:showOther,row2:!showOther}">
            </mt-cell>
            <div v-show="showOther">
                <mt-cell :title="item.name" v-for="(item,index,no) in insure" :key="index" v-if="no>4">
                    <mt-checklist
                            class="mycheck"
                            v-if="item.has_mp && item.premium>0"
                            v-model="item.is_mp"
                            :options="options">
                    </mt-checklist>
                    <div class="myselect">
                        <select v-if="item.preArr" v-model="item.premium">
                            <option :value="i" v-for="(p,i) in item.preArr">{{p}}</option>
                        </select>
                    </div>
                </mt-cell>
            </div>
        </div>
        <div class="btn_box">
            <button class="btn_50" @click="back">上一步</button>
            <button class="btn_50" @click="submitInfo">提交</button>
            <button class="btn_100" @click="restart">恢复初始方案</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "adjustment",
        data() {
            return {
                FORCEPREMIUM: true,
                insure: {
                    A: {
                        has_mp: true,
                        name: "机动车损失保险",
                        is_mp: true,
                        premium: "1",
                        preArr: [
                            "不投保",
                            '投保'
                        ]
                    },
                    B: {
                        has_mp: true,
                        name: "第三者责任险",
                        premium: "7", //保额
                        is_mp: true,
                        preArr: [
                            '不投保',
                            "50000",
                            "100000",
                            "150000",
                            "200000",
                            "300000",
                            "500000",
                            "1000000",
                            "1500000",
                            "2000000",
                            "3000000",
                            "5000000"
                        ]
                    },
                    D3: {
                        has_mp: true,
                        name: "驾驶员责任险",
                        premium: "1", //保额
                        is_mp: true,
                        preArr: [
                            '不投保',
                            "10000",
                            "20000",
                            "30000",
                            "40000",
                            "50000",
                            "100000",
                            "200000"
                        ]
                    },
                    D4: {
                        name: "乘客责任险",
                        premium: "1", //保额
                        has_mp: true,
                        is_mp: true,
                        preArr: [
                            "不投保",
                            "10000",
                            "20000",
                            "30000",
                            "40000",
                            "50000",
                            "100000",
                            "200000"
                        ]
                    },
                    G1: {
                        has_mp: false,
                        name: "全车盗抢险",
                        premium: "0",
                        preArr: [
                            "不投保",
                            '投保'
                        ]
                    },
                    F: {
                        has_mp: false,
                        name: "玻璃单独破碎险",
                        premium: "0", //保额
                        preArr: ["不投保", "国产", "进口"]
                    },
                    Z: {
                        name: "自燃损失险",
                        has_mp: true,
                        is_mp: false,
                        premium: "0",
                        preArr: ["不投保", '投保']
                    },
                    // L: {
                    //     name: "车身划痕损失险",
                    //     premium: "0", //保额
                    //     has_mp: true,
                    //     is_mp: false,
                    //     preArr: ["不投保", "2000", "5000", "10000", "20000"]
                    // },
                    // X1: {
                    //     name: "发动机涉水损失险",
                    //     is_mp: false,
                    //     has_mp: true,
                    //     premium: "0",
                    //     preArr: ["不投保", '投保']
                    // },
                    // R: {
                    //     name: "精神损害抚慰金责任险",
                    //     is_mp: false,
                    //     has_mp: true,
                    //     premium: "0", //保额
                    //     preArr: ["不投保", "10000", "20000", "30000", "40000", "50000"]
                    // },
                    // Z2: {
                    //     name: "修理期间费用补偿险",
                    //     is_mp: false,
                    //     has_mp: true,
                    //     premium: "0", //保额
                    //     preArr: ["不投保", "100", "200", "300"]
                    // },
                    // Q3: {
                    //     name: "指定修理厂险",
                    //     premium: "0",
                    //     has_mp: false,
                    //     preArr: ["不投保", '投保']
                    // },
                    Z3: {
                        name: "机动车无法找到第三方特约险",
                        premium: "0",
                        has_mp: false,
                        preArr: ["不投保", '投保']
                    }
                },
                options: [{
                    label: '不计免赔',
                    value: true
                }],
                showOther: false,
                info: {},
                icon: 'https://kaka.kelibbb.com/quote/img/down_icon3.png',
            }
        },
        watch: {
            showOther(val) {
                if (val) {
                    this.icon = 'https://kaka.kelibbb.com/quote/img/down_icon2.png'
                } else {
                    this.icon = 'https://kaka.kelibbb.com/quote/img/down_icon3.png'
                }
            }
        },
        mounted() {
            this.info = this.$store.state.info;
            let self = this;
            if (this.info.bxdata2) {
                let data = JSON.parse(this.info.bxdata2);
                Object.keys(data).forEach(function (key) {
                    self.insure[key].is_mp = data[key].is_mp;
                    self.insure[key].premium = data[key].premium;
                });
            }
        },
        methods: {
            restart() {
                this.insure = {
                    A: {
                        has_mp: true,
                        name: "机动车损失保险",
                        is_mp: true,
                        premium: "1",
                        preArr: [
                            "不投保",
                            '投保'
                        ]
                    },
                    B: {
                        has_mp: true,
                        name: "第三者责任险",
                        premium: "7", //保额
                        is_mp: true,
                        preArr: [
                            '不投保',
                            "50000",
                            "100000",
                            "150000",
                            "200000",
                            "300000",
                            "500000",
                            "1000000",
                            "1500000",
                            "2000000",
                            "3000000",
                            "5000000"
                        ]
                    },
                    D3: {
                        has_mp: true,
                        name: "驾驶员责任险",
                        premium: "1", //保额
                        is_mp: true,
                        preArr: [
                            '不投保',
                            "10000",
                            "20000",
                            "30000",
                            "40000",
                            "50000",
                            "100000",
                            "200000"
                        ]
                    },
                    D4: {
                        name: "乘客责任险",
                        premium: "1", //保额
                        has_mp: true,
                        is_mp: true,
                        preArr: [
                            "不投保",
                            "10000",
                            "20000",
                            "30000",
                            "40000",
                            "50000",
                            "100000",
                            "200000"
                        ]
                    },
                    G1: {
                        has_mp: false,
                        name: "全车盗抢险",
                        premium: "0",
                        preArr: [
                            "不投保",
                            '投保'
                        ]
                    },
                    F: {
                        has_mp: false,
                        name: "玻璃单独破碎险",
                        premium: "0", //保额
                        preArr: ["不投保", "国产", "进口"]
                    },
                    Z: {
                        name: "自燃损失险",
                        has_mp: true,
                        is_mp: false,
                        premium: "0",
                        preArr: ["不投保", '投保']
                    },
                    // L: {
                    //     name: "车身划痕损失险",
                    //     premium: "0", //保额
                    //     has_mp: true,
                    //     is_mp: false,
                    //     preArr: ["不投保", "2000", "5000", "10000", "20000"]
                    // },
                    // X1: {
                    //     name: "发动机涉水损失险",
                    //     is_mp: false,
                    //     has_mp: true,
                    //     premium: "0",
                    //     preArr: ["不投保", '投保']
                    // },
                    // R: {
                    //     name: "精神损害抚慰金责任险",
                    //     is_mp: false,
                    //     has_mp: true,
                    //     premium: "0", //保额
                    //     preArr: ["不投保", "10000", "20000", "30000", "40000", "50000"]
                    // },
                    // Z2: {
                    //     name: "修理期间费用补偿险",
                    //     is_mp: false,
                    //     has_mp: true,
                    //     premium: "0", //保额
                    //     preArr: ["不投保", "100", "200", "300"]
                    // },
                    // Q3: {
                    //     name: "指定修理厂险",
                    //     premium: "0",
                    //     has_mp: false,
                    //     preArr: ["不投保", '投保']
                    // },
                    Z3: {
                        name: "机动车无法找到第三方特约险",
                        premium: "0",
                        has_mp: false,
                        preArr: ["不投保", '投保']
                    }
                };
            },
            back() {//上一步
                this.$router.go(-1);
            },
            submitInfo() {
                let bxData = this.insure;
                console.log(bxData);
                let bx_data = {};
                let bxdata2 = {};
                Object.keys(bxData).forEach(function (key) {
                    bx_data[key] = bxData[key].premium == 0 ? "N" : "Y";
                    if (parseInt(bxData[key].premium) != 0) {
                        if (key == "F") {
                            bx_data[key] = parseInt(bxData[key].premium);
                        } else if (bxData[key].preArr.length > 2) {
                            bx_data[key] = parseInt(bxData[key].preArr[bxData[key].premium]);
                        }
                    }
                    let key2 = "M" + key;
                    if (bxData[key].has_mp) {
                        bx_data[key2] = bxData[key].is_mp ? "Y" : "N";
                    }
                    bxdata2[key] = {
                        'is_mp':false,
                        'premium':'0'
                    };
                    if (bxData[key].has_mp) {
                        bxdata2[key].is_mp = bxData[key].is_mp?true:false;
                    }
                    bxdata2[key].premium = bxData[key].premium;
                });
                bx_data.FORCEPREMIUM = 'Y';
                console.log(bxdata2);
                this.info.bx_data = JSON.stringify(bx_data);
                this.info.bxdata2 = JSON.stringify(bxdata2);
                console.log(this.info);
                this.$store.state.info = this.info;
                this.start();
            },
            async start() {
                this.$indicator.open('正在提交');
                let info = this.info;
                info.username = this.$store.state.userInfo.userName;
                info.way = this.$store.state.way;
                info.userid = this.$store.state.userInfo.id;
                info.fanid = this.$store.state.fanid;
                const res = await this.$post("m=Carinsur&c=inputinsur&a=startFastPrice", info);
                let orderid = res.orderid;
                this.$router.push({path: "/result", query: {orderid: orderid}});
                this.$indicator.close();
            },
        }
    }
</script>

<style scoped lang="scss">
    .adjust-title {
        border-left: solid 5px #10c7a1;
        margin-top: 1px;
        font-size: 16px;
        color: #818181;
        padding: 1vw;
        background-color: #fff;
    }

    .cells {
        background-color: #fff;
        p {
            padding: 0 10px 5px 10px;
            color: #959191;
            font-size: 12px;
        }
    }

    select {
        border: 0;
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;
        background: #fff;
        padding-left: 10px;
    }

    .myselect {
        width: 90px;
        select {
            border: 0;
            width: 90px;
            font-size: 14px;
            color: #03c8af;
            background-color: #fff;
            background-size: 13px 9px;
            -moz-background-size: 13px 9px;
            background-image: url(https://kaka.kelibbb.com/quote/img/down_icon2.png);
            background-repeat: no-repeat;
            background-position: center right;
            padding-right: 20px;
            option {
                width: 90px;
            }
        }
    }

    .other, .btn_box, .btn_100 {
        margin-top: 15px;
    }

    .mint-cell {
        height: 6.4vw;
    }

    .row {
        width: 13px;
        height: 9px;
    }

    .row2 {
        width: 9px;
        height: 13px;
    }
</style>
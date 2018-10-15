<template>
    <div @click="showTable=false">
        <div class="adjust-title">
            报价结果
            <div class="fr" id="tips" @click.stop="showTable=true">
                去年出险记录：交1次，商1次
                <img src="https://kaka.kelibbb.com/quote/img/tips.png" alt="" class="tips">
            </div>
            <div class="record" v-show="showTable">
                <img src="../../assets/img/tip_header.png" alt="" class="tip_h">
                <div class="r-table">

                    <table class="my-table">
                        <tr>
                            <th>序号</th>
                            <th>出险时间</th>
                            <th>出险金额</th>
                            <th>保险公司</th>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>2018-03-04</td>
                            <td>￥12340.00</td>
                            <td>阳光车险阳光车险阳光车险阳光阳光车险阳光车险阳光车险阳光</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="cells">
            <div class="cell cell1">
                <div><span style="color:#10c7a1">{{successNum}}</span> 家报价成功</div>
                <div><span style="color:#e8320d">{{failNum}}</span> 家报价失败</div>
                <!--<div><span style="color:#f8581b">{{refuseNum}}</span> 家非标拒保</div>-->
            </div>
            <div class="cell" v-for="(item,index) in data" v-if="item.check">
                <div class="cell-img">
                    <img :src="'https://kaka.kelibbb.com/quote/img/bxlogo/'+index+'.png'" alt=""
                         class="logo-img">
                    <p>{{item.name}}</p>
                </div>
                <div class="cell-price">
                    <div v-if="item.state==='0' || item.state==='00'">
                        <p>报价中</p>
                    </div>
                    <div v-if="item.state==='5'">
                        <p>
                            <span style="color: #333333">总保费：</span>
                            <span style="color: #10c7a1">￥{{item.insureInfo.sunnum}}</span>
                        </p>
                        <p>商业险：￥{{item.insureInfo.biPremium}}</p>
                        <p>交强险+车船税：￥{{Number(item.insureInfo.ciPremium)+Number(item.insureInfo.carshipTax)}}</p>
                    </div>
                    <div v-if="item.state==='2'">
                        <p style="color:#e8320d;font-size: 16px">报价失败</p>
                        <!--<p>失败原因：</p>-->
                        <!--<p>{{item.remark}}</p>-->
                    </div>
                    <div v-if="item.state==='4'">
                        <p style="color:#f8581b">非标拒保</p>
                    </div>
                </div>
                <div class="cell-btn">
                    <mt-spinner type="fading-circle" v-if="item.state==='0' || item.state==='00'"
                                color="#10c7a1"></mt-spinner>
                    <button class="btn btn-success" v-if="item.state==='5'" @click="showDetail(index)">报价详情</button>
                    <!--<button class="btn btn-fail" v-if="item.state==='2'" @click="askagain(index)">再次报价</button>-->
                    <!--<button class="btn btn-fail" v-if="item.state==='2'" @click="showInfo(index)">再次报价</button>-->
                    <!--<button class="btn btn-refuse" v-if="item.state==='2'" @click="showInfo(index)">查看详情</button>-->
                    <button class="btn btn-fail" v-if="item.state==='2'" @click="showInfo(index)">查看详情</button>
                </div>
            </div>
        </div>
        <div class="btn_box">
            <button class="btn_100" @click="changeInsure" v-if="history">修改险种</button>
            <button class="btn_100" @click="back" v-if="!history">上一步</button>
            <!--<button class="btn_50" @click="getmore">查看更多保司报价</button>-->
        </div>
        <mt-popup
                @click.native="showRemark=false"
                z-index="3"
                class="mypopup"
                v-model="showRemark">
            <div class='txt-box'>
                <div class="box-header">
                    失败原因
                </div>
                <div class="box-txt">
                    {{remark}}
                </div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
    export default {
        name: "result",
        data() {
            return {
                showTable: false,
                successNum: '...',
                failNum: '...',
                refuseNum: '...',
                data: {
                    'PICC': {
                        name: '人保财险',
                        check: false,
                        insureInfo: {},
                        state: '0',
                        remark: ''
                    },
                    'CPIC': {
                        name: '太平洋产险',
                        check: false,
                        insureInfo: {},
                        state: '0',
                        remark: ''
                    },
                    'PAIC': {
                        name: '平安产险',
                        check: false,
                        insureInfo: {},
                        state: '0',
                        remark: ''
                    },
                    // 'CLPC': {
                    //     name: '国寿财险',
                    //     check: false,
                    //     insureInfo: {},
                    //     state: '0',
                    //     remark: ''
                    // }
                },
                orderid: '',
                info: {},
                orderInfo: {},
                showRemark: false,
                remark: '',
                history: false
            }
        },
        created() {
            let self = this;
            window.addEventListener("scroll", () => {
                self.showTable = false;
            })
        },
        mounted() {
            this.orderid = this.$route.query.orderid;
            if (this.$route.query.history && this.$route.query.history === 1) {
                this.history = true;
            }
            this.setCompany();
            this.getPrice();
            let self = this;
            setTimeout(function () {
                self.runtime();
            }, 500000);
        },
        methods: {
            back() {
                this.runtime();
                this.$router.go(-1);
            },
            changeInsure() {
                let orderInfo = this.orderInfo;
                let info = {
                    'carno': orderInfo.carno,
                    'cardno': orderInfo.cardno,
                    'movedate': orderInfo.movedate,
                    'is_move': orderInfo.is_move,
                    'name': orderInfo.name,
                    'drivingidentifycode': orderInfo.drivingidentifycode,
                    'drivingengineno': orderInfo.drivingengineno,
                    'drivingregisterdate': orderInfo.drivingregisterdate,
                    'insurcode': orderInfo.insurcode,
                    'bxdata2': orderInfo.bxdata2,
                    'cityName': orderInfo.cityName,
                    'type': orderInfo.type
                };
                this.$store.state.info = info;
                this.$router.push({path: "/selectcompany"});
            },
            setCompany() {
                if (this.$store.state.info.insurcode) {
                    let code = this.$store.state.info.insurcode.split(',');
                    for (let j in code) {
                        this.data[code[j]].check = true;
                    }
                }
            },

            async getPrice() {
                let self = this;
                const res = await self.$post("m=Carinsur&c=inputinsur&a=getorderdetail", {
                    orderid: self.orderid,
                    userid: self.$store.state.userInfo.id,
                    way: self.$store.state.way
                });
                console.log(res);
                if (res.error === 0) {
                    let data = res.order;
                    self.orderInfo = data;
                    for (let i in self.data) {
                        if (self.data[i].check) {
                            if (self.data[i].state !== '00') {
                                self.data[i].state = data[i + 'bxStatus'];
                                self.data[i].remark = data[i + 'remark'];
                            }
                        }
                        this.updateState();
                    }
                    for (let i in res.report) {
                        let code = res.report[i].insurerCode;
                        self.data[code].insureInfo = res.report[i];
                    }
                    setTimeout(function () {
                        for (let j in self.data) {
                            if (self.data[j].check && self.data[j].state === '0') {
                                self.getPrice();
                                return false
                            }
                        }
                        self.successNum = self.successNum === '..' ? '0' : self.successNum;
                        self.failNum = self.failNum === '..' ? '0' : self.failNum;
                    }, 5000);

                } else {
                    self.$toast("接口错误，请联系管理员");
                }
            },
            updateState() {
                let success = 0;
                let fail = 0;
                let refuse = 0;
                let self = this;
                for (let j in self.data) {
                    if (self.data[j].check) {
                        if (self.data[j].state === '5') {
                            success++;
                        } else if (self.data[j].state === '2') {
                            fail++
                        } else if (self.data[j].state === '4') {
                            refuse++
                        }
                    }
                }
                this.successNum = success > 0 ? success : '...';
                this.failNum = fail > 0 ? fail : '...';
                this.refuseNum = refuse > 0 ? refuse : '...';
            },
            getmore() {

            },
            showDetail(index) {
                this.$store.state.detail = this.data[index];
                this.runtime();
                this.$router.push({path: "/showdetail"});
            },
            askagain(index) {
                console.log(index);
                let state = this.data[index].state;
                this.$set(this.data[index], 'state', '00');
                console.log(this.data[index]);
                let self = this;
                self.updateState();
                setTimeout(function () {
                    self.data[index].state = state;
                    self.updateState();
                }, 30000);
            },
            showInfo(index) {
                this.remark = this.data[index].remark;
                this.showRemark = true;
            },
            runtime() {
                let self = this;
                for (let i in self.data) {
                    if (self.data[i].check) {
                        if (self.data[i].state === '0') {
                            self.data[i].state = '2';
                            self.data[i].remark = '报价超时';
                        }
                    }
                    this.updateState();
                }
                self.successNum = self.successNum === '...' ? '0' : self.successNum;
                self.failNum = self.failNum === '...' ? '0' : self.failNum;
            }
        },
        destroyed() {
            this.runtime();
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
    }

    .cells {
        background-color: #fff;
        font-size: 15px;
        color: #666666;
    }

    .cell {
        padding: 3vw;
        display: flex;
        border-bottom: solid 1px #e5e5e5;
        justify-content: space-between;
        align-items: center;
        .cell-img {
            text-align: center;
            flex: 0 0 22%;
            p {
                color: #333;
                margin-top: 5px;
                font-size: 3.7vw;
            }
        }
        .cell-price {
            display: flex;
            flex-direction: column;
            width: 49vw;
            margin-left: 5px;
            p {
                font-size: 3.5vw;
                line-height: 6.5vw;
            }
        }
        .cell-btn {
            width: 19vw;
            text-align: center;
        }
    }

    .btn {
        border: 0;
        width: 20vw;
        height: 8vw;
        line-height: 8vw;
        -webkit-box-shadow: 2px 3px 4px 0 rgba(100, 66, 7, 0.11);
        box-shadow: 2px 3px 4px 0 rgba(100, 66, 7, 0.11);
        border-radius: 3.7vw;
        font-size: 4vw;
        color: #fff;
    }

    .mypopup {
        border-radius: 1.6vw;
        .txt-box {
            background-color: #fff;
            width: 80vw;
            /*min-height: 30vw;*/
            border-radius: 1.6vw;
            .box-txt {
                font-size: 15px;
                padding: 10px;
                max-height: 48vh;
                overflow: scroll;
            }
        }
        .box-header {
            background-color: #03c8af;
            border-radius: 1.6vw 1.6vw 0 0;
            color: #fff;
            text-align: center;
            font-size: 16px;
            line-height: 10.7vw;
            height: 10.7vw;
        }

    }

    .cell-num {
        div {
            flex: 1;
            text-align: center;
        }
    }

    .logo-img {
        width: 12vw;
        height: 12vw;
        vertical-align: middle;
        /*margin: 2px 8vw;*/
    }

    .btn-success {
        background-color: #03c8af;
    }

    .btn-fail {
        background-color: #e8320d;
    }

    .btn-refuse {
        background-color: #f8581b;
    }

    .btn_100 {
        background-color: #03c8af;
        color: #fff;
    }

    .cell1 {
        padding: 3vw 10vw;
    }

    .tips {
        width: 14px;
        vertical-align: middle;
        margin-top: -3px;
    }

    #tips {
        font-size: 13px;
    }

    .record {
        margin: auto;
        /*padding: 3vw;*/
        position: absolute;
        width: 95vw;
        /*height: 216px;*/
        /*margin-top: 10px;*/
        background-color: #ffffff;
        box-shadow: 1px 2px 2vw 0 rgba(81, 78, 77, 0.5);
        z-index: 3;
        .r-table {
            padding: 3vw;
        }
        .tip_h {
            height: 3.1vw;
            position: absolute;
            top: -3vw;
            right: 10px
        }
    }

    .my-table {
        width: 100%;
        border: solid 1px #eeeeee;
        border-collapse: collapse;
        text-align: center;
        font-size: 14px;
        line-height: 28px;
        th {
            background-color: #f5f6fb;
            font-weight: 500;
            border: solid 1px #eeeeee;
        }
        td {
            border: solid 1px #eeeeee;
            font-size: 12px;
        }
        td:nth-child(4) {
            max-width: 40vw;
            line-height: 1.6rem;
        }
    }
</style>
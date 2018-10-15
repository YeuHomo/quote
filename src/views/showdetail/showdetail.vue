<template>
    <div class="mycell" @click="popupVisible=false">
        <header>
            投保车辆：{{driveInfo.carno}}
            <div>¥ {{info.sunnum}}</div>
        </header>
        <div class="cells">
            <div class="cell">
                <img :src="'https://kaka.kelibbb.com/quote/img/bxlogo/'+info.insurerCode+'.png'" alt=""
                     class="logo-img">
                <span class="name">{{name}}</span>
                <!--<div class="fr" id="tips" @click.stop="popupVisible=true">-->
                    <!--去年出险记录：交1次，商1次-->
                    <!--<img src="https://kaka.kelibbb.com/quote/img/tips.png" alt="" class="tips">-->
                <!--</div>-->
                <div class="record" v-show="popupVisible">
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
                                <td>￥1234.00</td>
                                <td>阳光车险</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <mt-cell title="交强险到期时间" :value="info.ciBeginDate" class="cell-date"></mt-cell>
            <mt-cell title="商业险到期时间" :value="info.biBeginDate" class="cell-date"></mt-cell>
        </div>
        <div class="cells">
            <mt-cell title="推荐投保方案">
                <button class="btn_edit" v-if="driveInfo.type===2">修改</button>
            </mt-cell>
            <mt-cell title="险种" class="cell-title">
                <div class="be">保额</div>
                <div>保费</div>
            </mt-cell>
            <template v-for="item in coverageList">
                <mt-cell :title="item.coverageName">
                    <div class="be">{{item.amount==='Y'?'':item.amount}}</div>
                    <div>￥{{item.insuredPremium}}</div>
                </mt-cell>
                <mt-cell title="--不计免赔" v-if="item.bjmp>0">
                    <div class="be">投保</div>
                    <div>￥{{item.bjmp}}</div>
                </mt-cell>
            </template>
        </div>
        <div class="cells">
            <mt-cell title="商业险" :value="'¥ '+info.biPremium"></mt-cell>
            <mt-cell title="交强险" :value="'¥ '+info.ciPremium"></mt-cell>
            <mt-cell title="车船税" :value="'¥ '+info.carshipTax"></mt-cell>
            <mt-cell title="总金额">
                <span style="color: #10c7a1">¥ {{info.sunnum}}</span>
            </mt-cell>
        </div>
        <div class="btn-box">
            <button class="btn_100" @click="txtShow=true">分享文本</button>
        </div>
        <mt-popup
                z-index="3"
                class="mypopup"
                v-model="txtShow">
            <div class='txt-box'>
                <div class="box-header">
                    分享文本
                </div>
                <div class="box-txt">
                    {{msg}}
                </div>
                <div>
                    <button class="btn btn1" @click="txtShow=false">取消</button>
                    <button class="btn btn2" @click="copytxt">复制</button>
                </div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
    import clipboard from "clipboard-polyfill";

    export default {
        name: "showdetail",
        data() {
            return {
                popupVisible: false,
                info: {},
                name: '',
                driveInfo: {},
                coverageList: {},
                txtShow: false,
                msg: ''
            }
        },
        created() {
            let self = this;
            window.addEventListener("scroll", () => {
                self.popupVisible = false;
            })
        },
        mounted() {
            let detail = this.$store.state.detail;
            this.driveInfo = this.$store.state.info;
            this.info = detail.insureInfo;
            this.name = detail.name;
            this.msg = this.info.smstxt;
            if (!this.info.flag) {
                this.handleInsure();
            } else {
                let list = this.info.coverageList;
                let coverageList = [];
                for (let i = 0; i < list.length; i++) {
                    let code = list[i].coverageCode;
                    if (code.substr(0, 1) !== 'M' && code !== 'FORCEPREMIUM') {
                        coverageList.push(list[i]);
                    }
                }
                this.coverageList = coverageList;
            }
        },
        methods: {
            handleInsure() {
                let list = this.info.coverageList;
                let mp_arr = [];
                let list_arr = [];
                for (let i = 0; i < list.length; i++) {
                    let code = list[i]['coverageCode'];
                    if (code.substr(0, 1) == 'M') {
                        mp_arr[code.substr(1)] = list[i]['insuredPremium'];
                    } else if (code != 'FORCEPREMIUM') {
                        list_arr.push(list[i]);
                    }
                }

                for (let index in list_arr) {
                    let value = list_arr[index];
                    for (let mp in mp_arr) {
                        if (mp = value['coverageCode']) {
                            value['bjmp'] = mp_arr[mp];
                        }
                    }
                    if (value['bjmp']) {
                        value['insuredPremium'] = Number(value['insuredPremium']) + Number(value['bjmp']);
                    }
                    if (value['coverageCode'] === 'B' || value['coverageCode'] === 'D3' || value['coverageCode'] === 'D4' || value['coverageCode'] === 'R') {
                        value['amount'] = parseInt(value['amount']) / 10000 + '万';
                        if (value['coverageCode'] === 'D3' || value['coverageCode'] === 'D4') {
                            value['amount'] += '/座';
                        }
                    }
                    if (value['coverageCode'] === 'Z2') {
                        value['amount'] = value['flag'].split(',')[1] + ' X ' + value['flag'].split(',')[0] + '天'
                    }
                    if (value['coverageCode'] === 'Q3') {
                        value['amount'] = '费率 ' + value['insuredAmount'];
                    }
                    if (value['coverageCode'] === 'F') {
                        if (value['insuredAmount'] === '0') {
                            value['amount'] = '国产玻璃'
                        } else if (value['insuredAmount'] === '1') {
                            value['amount'] = '进口玻璃'
                        }
                    }
                    value['insuredPremium'] = parseFloat(value['insuredPremium']).toFixed(2);
                }
                this.coverageList = list_arr;
                this.info.flag = true;
                // this.insure[insurerCode].showInfo = true;
            },
            copytxt() {
                let self = this;
                clipboard.writeText(self.msg).then(
                    function () {
                        self.$toast({
                            message: '复制成功',
                            iconClass: 'fa fa-check fa-5x'
                        });
                    },
                    function (err) {
                        console.log(err);
                        self.$toast("复制失败");
                        // resultField.textContent = err;
                        self.$toast({
                            message: '复制失败',
                            iconClass: 'fa fa-remove  fa-5x'
                        });
                    }
                );
            }
        }

    }
</script>

<style scoped lang="scss">
    .name {
        font-size: 15px;
        color: #333;
    }

    .cells {
        background-color: #fff;
        margin-bottom: 15px;
    }

    .logo-img {
        width: 10.2vw;
        height: 10.2vw;
        vertical-align: middle;
        margin-right: 3vw;
    }

    .cell {
        padding: 3vw;
        #tips {
            line-height: 10vw;
        }
    }

    .cell-title {
        color: #919090;
        font-size: 1rem;
    }

    .cell2 {
        padding: 5px 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        /*&:first-child{*/
        /*width: 33%;*/
        /*}*/
        /*&:nth-child(2){*/
        /*width: 35%;*/
        /*}*/
    }

    .btn_edit {
        border: 0;
        width: 15.87vw;
        height: 6vw;
        line-height: 6vw;
        background-color: #03c8af;
        border-radius: 3vw;
        font-size: 3.7vw;
        color: #fdfcfc;
    }

    .btn_100 {
        background-color: #03c8af;
        color: #fff;
    }

    .tips {
        width: 14px;
        vertical-align: middle;
        margin-top: -3px;
    }

    header {
        div {
            float: right;
        }
    }

    .be {
        position: absolute;
        left: 50%;
    }

    .cell-date {
        color: #999999;
    }

    .mypopup {
        border-radius: 1.6vw;
        .txt-box {
            background-color: #fff;
            width: 95vw;
            height: 80vw;
            border-radius: 1.6vw;
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
        .box-txt {
            font-size: 15px;
            padding: 10px;
            height: 48vw;
            overflow: scroll;
        }
        .btn {
            border: 0;
            width: 44.4%;
            height: 10.7vw;
            margin: 2.8%;
            border-radius: 10.7vw;
            color: #fff;
            font-size: 15px;
        }
        .btn1 {
            background-color: #eeeeee;
            color: #1e1e1e;
        }
        .btn2 {
            background-color: #03c8af;
        }
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
        }
    }
</style>
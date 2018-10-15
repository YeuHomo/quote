<template>
    <div>
        <div class="cells">

            <mt-cell title="上年保险公司">
                <span style="font-size: 14px">仅支持人保、平安、太平洋快速续保</span>
            </mt-cell>

            <div class="cell_company">
                <mt-radio
                        class="myradio"
                        v-model="mycompany"
                        :options="options"></mt-radio>
            </div>
            <mt-cell title="行驶证上传">
                <span style="font-size: 14px">可用于自动识别，免除手工录入</span>
            </mt-cell>
            <div class="img_box" @click="addImg">
                <img src="../assets/img/driving_img.png" alt="" class="bg_img">
                <img :src="info.driveImg" alt="" class="drive_img" ref="drive_img2">
            </div>
            <input @change="getImg" name="img" id="upload2" accept="image/*" type="file" class="imgBtn">
        </div>
        <div class="cells">
            <mt-cell title="车牌号" @click.native="isKeyboard=true" v-model="info.carno">
                <!--<input type="text" placeholder="请输入车牌号" v-model="info.carno" class="my-input">-->
            </mt-cell>
            <mt-cell title="车辆识别代号" v-show="mycompany==='0'||mycompany==='3'">
                <input type="text" placeholder="请输入车辆识别代号" v-model="info.drivingidentifycode" class="my-input">
            </mt-cell>
            <mt-cell title="车主姓名" v-show="mycompany!=='1'">
                <input type="text" placeholder="请输入车主姓名" v-model="info.name" class="my-input">
            </mt-cell>
            <mt-cell title="行驶区域" :value="showcity" @click.native="showPicker" is-link></mt-cell>
            <mt-cell title="车主身份证号码">
                <input type="text" placeholder="请输入身份证号码" v-model="info.cardno" class="my-input">
            </mt-cell>
        </div>
        <div class="btn_box">
            <button class="btn_50" @click="back">返回</button>
            <button class="btn_50" @click="submintInfo">提交</button>
        </div>
        <mt-popup
                class="mypicker"
                v-model="popupVisible"
                position="bottom">
            <mt-picker :valueKey="'name'" :slots="myAddressSlots" @change="onMyAddressChange"></mt-picker>
        </mt-popup>
        <key-board :carno="info.carno" @keyboard-carno="parentEvent" v-show="isKeyboard"
                   @keyboard-show="changeKeyboard"></key-board>
    </div>
</template>

<script>
    import axios from "axios";
    import {
        GetUrlParam,
        isVehicleNumber,
        getCheckCode,
        IdentityCodeValid,
        isPoneAvailable,
        getObjectURL
    } from "@/utils/common";
    import address from '@/utils/pc-code.json';
    import KeyBoard from '@/components/keyboard.vue'

    export default {
        name: "renewalform",
        components: {
            KeyBoard
        },
        data() {
            return {
                info: {
                    carno: null,
                    name: null,
                    drivingidentifycode: null,
                    cardno: null,
                    cityName: '北京',
                    driveImg: '',
                    city: ['北京市', '东城区']
                },
                mycompany: '0',
                isKeyboard: false,
                myAddressSlots: [
                    {
                        flex: 1,
                        defaultIndex: 0,
                        values: address,  //省份数组
                        className: 'slot1',
                        textAlign: 'center'
                    }, {
                        divider: true,
                        content: '-',
                        className: 'slot2'
                    }, {
                        flex: 1,
                        values: address[0].children,
                        className: 'slot3',
                        textAlign: 'center'
                    }
                ],
                myProvince: address[0],
                mycity: address[0].children,
                showcity: '北京市 东城区',
                popupVisible: false,
                options: [
                    {
                        label: '不确定',
                        value: '0'
                    },
                    {
                        label: '人保',
                        value: '1',
                        name: 'PICC'
                    },
                    {
                        label: '平安',
                        value: '2',
                        name: 'PAIC'
                    },
                    {
                        label: '太平洋',
                        value: '3',
                        name: 'CPIC'
                    }
                ]
            }
        },
        mounted() {
            if (localStorage.getItem('info')) {
                let info = JSON.parse(localStorage.getItem('info'));
                this.showcity = info.city[0] + ' ' + info.city[1];
                this.info = info;
            }
        },
        methods: {
            changeKeyboard() {
                this.isKeyboard = false;
            },
            parentEvent(data) {
                this.info.carno = data;
            },
            back() {
                this.$router.go(-1);
            },
            addImg() {
                this.isKeyboard = false;
                document.getElementById('upload2').click();
            },
            getImg(event) {
                let pic = event.target.files[0];
                this.info.driveImg = getObjectURL(pic);
                this.uploadImg(pic);
            },
            async uploadImg(pic) {
                let self = this;
                self.$indicator.open('识别中...');
                let formdata = new FormData();
                formdata.append("file", pic, pic.name);
                formdata.append("fanid", '429');
                let config = {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                };
                axios
                    .post(
                        "https://kaka.kelibbb.com/klkl/merchants.php?m=Carinsur&c=ocr&a=sendBDOCR",
                        formdata,
                        config
                    )
                    .then(res => {
                        console.log(res);
                        let data = res.data;
                        if (data.error === 0) {
                            if (data.carmsg.drivingnature !== '非营运') {
                                self.$messagebox('提示', '暂不支持该车型');
                                return false;
                            }
                            if (!isVehicleNumber(data.carmsg.carno)) {
                                self.$messagebox("提示", "识别信息有误，请重新上传");
                                return false;
                            }
                            console.log(data.carmsg);
                            self.info = data.carmsg;

                            self.info.driveImg = data.img;
                            self.$indicator.close();
                        }
                    });
            },
            showPicker() {
                this.popupVisible = true;
            },
            onMyAddressChange(picker, values) {
                if (values[0].code !== this.myProvince.code) {
                    this.myProvince = values[0];
                    this.mycity = values[0].children;
                    picker.setSlotValues(1, this.mycity);
                }
                this.showcity = values[0].name + ' ' + values[1].name;
                this.info.city = [values[0].name, values[1].name];
                if (values[0].code === '11' || values[0].code === '12' || values[0].code === '31' || values[0].code === '50') {
                    this.info.cityName = values[0].name;
                } else {
                    this.info.cityName = values[1].name;
                }
            },
            submintInfo() {
                return false;
                let self = this;
                let driveInfo = self.info;
                if (driveInfo.carno == "" ||
                    !driveInfo.carno ||
                    !isVehicleNumber(driveInfo.carno)
                ) {
                    this.$toast("请输入正确的车牌号");
                    return false;
                }
                if ((driveInfo.name == "" || !driveInfo.name) && this.mycompany !== '1') {
                    this.$toast("请输入车主姓名");
                    return false;
                }
                if ((!driveInfo.drivingidentifycode || driveInfo.drivingidentifycode == "" || !getCheckCode(driveInfo.drivingidentifycode)) && (this.mycompany === '0' || this.mycompany === '3')) {
                    this.$toast("请输入正确的车辆识别代码");
                    return false;
                }
                if (
                    !driveInfo.cardno ||
                    driveInfo.cardno == "" ||
                    !IdentityCodeValid(driveInfo.cardno)
                ) {
                    this.$toast("请输入正确的证件号码");
                    return false;
                }
                driveInfo.is_move = driveInfo.is_move ? '1' : '0';
                driveInfo.type = 2;
                if (this.mycompany === '0') {
                    driveInfo.insurcode = 'PICC,PAIC,CPIC';
                } else {
                    driveInfo.insurcode = this.options[this.mycompany].name;
                }
                console.log(driveInfo);
                this.$store.state.info = driveInfo;
                this.$router.push({path: "/result"});
            },
            shareInfo() {
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/css/common.scss';

    .my-input {
        text-align: right;
        color: #333;
        border: 0;
    }

    .cells {
        margin-bottom: 15px;
    }

    .remark {
        color: #999999;
        font-size: 12px;
    }

    .img_box {
        background-color: #fff;
        text-align: center;
        padding: 0 0 5vw 0;
        position: relative;
        .bg_img {
            width: 82.7vw;
            z-index: 1;
        }
        .drive_img {
            position: absolute;
            width: 67vw;
            height: 42vw;
            top: 3vw;
            left: 16.5vw;
            z-index: 2;
        }
    }

    #upload2 {
        position: absolute;
        opacity: 0;
    }

    .cell_company {
        display: flex;
    }

    .mint-radiolist-title {
        margin: 0;
    }

    .myradio {
        width: 100%;
        display: flex;
        div {
            flex: 1;
        }

    }

    .cell_company {
        background-color: #fff;
    }

    .mypicker {
        width: 100%;
    }
</style>
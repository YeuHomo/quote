<template>
    <div>
        <div class="cells">
            <mt-cell title="行驶证上传">
                <span style="font-size: 14px">可用于自动识别，免除手工录入</span>
            </mt-cell>
            <div class="img_box" @click="addImg">
                <img src="../assets/img/driving_img.png" alt="" class="bg_img">
                <img :src="info.driveImg" alt="" class="drive_img" ref="drive_img">
            </div>
            <input @change="getImg" name="img" id="upload" accept="image/*" type="file" class="imgBtn">
        </div>
        <div class="cells">
            <mt-cell title="车牌号" v-show="!info.newCar" @click.native="showKeyBoard" v-model="info.carno">
                <!--<input type="text" placeholder="请输入车牌号" v-model="info.carno" class="my-input">-->
            </mt-cell>
            <mt-cell title="新车未上牌">
                <mt-switch v-model="info.newCar"></mt-switch>
            </mt-cell>
            <mt-cell title="车主姓名">
                <input type="text" placeholder="请输入车主姓名" v-model="info.name" class="my-input">
            </mt-cell>
        </div>
        <div class="cells">
            <mt-cell title="车辆识别代号">
                <input type="text" placeholder="请输入车辆识别代号" v-model="info.drivingidentifycode" class="my-input">
            </mt-cell>
            <mt-cell title="发动机号码">
                <input type="text" placeholder="请输入发动机号码" v-model="info.drivingengineno" class="my-input">
            </mt-cell>
            <mt-cell title="注册日期" is-link @click.native="openPicker('drivingregisterdate')" ref="drivingregisterdate"
                     v-show="!info.newCa">
                <div>{{info.drivingregisterdate?info.drivingregisterdate:'请选择注册日期'}}</div>
            </mt-cell>
        </div>
        <div class="cells">
            <mt-cell title="行驶区域" :value="showcity" @click.native="showPicker" is-link></mt-cell>
        </div>
        <div class="cells">
            <mt-cell title="车主身份证号码">
                <input type="text" placeholder="请输入身份证号码" v-model="info.cardno" class="my-input">
            </mt-cell>
            <mt-cell title="是否一年内过户">
                <span class="remark">（此选项影响报价，必选）</span>
                <mt-switch v-model="info.is_move"></mt-switch>
            </mt-cell>
            <mt-cell title="过户时间" v-if="info.is_move" is-link @click.native="openPicker('moveDate')">
                <div>{{info.moveDate?info.moveDate:'请选择过户日期'}}</div>
            </mt-cell>
        </div>
        <div class="btn_box">
            <button class="btn_50" @click="back">返回</button>
            <button class="btn_50" @click="submitInfo">下一步</button>
        </div>
        <mt-datetime-picker
                :startDate="startDate"
                :endDate="endDate"
                v-model="dateTime"
                type="date"
                ref="picker2"
                @confirm="handleConfirm">
        </mt-datetime-picker>
        <mt-popup
                class="mypicker"
                v-model="popupVisible"
                position="bottom">
            <mt-picker :valueKey="'name'" :slots="myAddressSlots" @change="onMyAddressChange"></mt-picker>
        </mt-popup>
        <key-board :carno="info.carno" @keyboard-carno="parentEvent" v-if="isKeyboard" @keyboard-show="changeKeyboard"></key-board>
    </div>
</template>

<script>
    import moment from 'moment';
    import axios from "axios";
    import KeyBoard from '@/components/keyboard.vue'
    import {
        GetUrlParam,
        isVehicleNumber,
        getCheckCode,
        IdentityCodeValid,
        isPoneAvailable,
        getObjectURL
    } from "@/utils/common";

    import address from '@/utils/pc-code.json';

    export default {
        name: "quoteform",
        components: {
            KeyBoard
        },
        data() {
            return {
                popupVisible: false,
                dateTime: null,
                startDate: new Date(),
                endDate: new Date(),
                date: null,
                showcity: '浙江省 杭州市',
                info: {
                    carno: '请输入车牌号',
                    name: null,
                    drivingidentifycode: null,
                    drivingengineno: null,
                    drivingregisterdate: '',
                    cardno: null,
                    newCar: false,
                    is_move: false,
                    moveDate: '',
                    cityName: '杭州市',
                    driveImg: '',
                    city: ['浙江省', '杭州市']
                },
                myAddressSlots: [
                    {
                        flex: 1,
                        defaultIndex: 10,
                        values: address,  //省份数组
                        className: 'slot1',
                        textAlign: 'center'
                    }, {
                        divider: true,
                        content: '-',
                        className: 'slot2'
                    }, {
                        flex: 1,
                        values: address[10].children,
                        className: 'slot3',
                        textAlign: 'center'
                    }
                ],
                myProvince: address[0],
                mycity: address[0].children,
                isKeyboard:false
            }
        },
        mounted() {
            if (this.$store.state.info.name) {
                let info = this.$store.state.info;
                console.log(info);
                if (info.city) {
                    this.showcity = info.city[0] + ' ' + info.city[1];
                }
                if (info.is_move === '1') {
                    info.is_move = true;
                } else {
                    info.is_move = false;
                }
                this.info = info;
            }
        },
        methods: {
            changeKeyboard(){
                this.isKeyboard = false;
            },
            showKeyBoard(){

                this.isKeyboard = true;
            },
            parentEvent(data){
                this.info.carno = data;
            },
            back() {
                this.$router.go(-1);
            },
            openPicker(name) {
                let now = new Date();
                if (name === 'moveDate') {
                    now.setFullYear(now.getFullYear() - 1);
                } else {
                    now.setFullYear(now.getFullYear() - 20);
                }
                this.startDate = now;
                this.date = name;
                this.$refs.picker2.open();
            },
            handleConfirm(data) {
                let key = this.date;
                console.log(data);
                console.log(key);
                this.info[key] = moment(data).format('YYYY-MM-DD');
            },
            addImg() {
                this.isKeyboard = false;
                document.getElementById('upload').click();
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
                formdata.append("fanid", this.$store.state.fanid);
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
                            self.info = Object.assign({}, self.info, data.carmsg);
                            self.info.driveImg = data.img;
                            self.$indicator.close();
                        } else {
                            self.$indicator.close();
                            self.$messagebox("提示", "无法识别,请重新上传");
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
            submitInfo() {
                let self = this;
                let driveInfo = self.info;
                if (!self.info.newCar &&
                    (driveInfo.carno == "" ||
                        !driveInfo.carno ||
                        !isVehicleNumber(driveInfo.carno))
                ) {
                    this.$toast("请输入正确的车牌号");
                    return false;
                }
                if (driveInfo.name === "" || !driveInfo.name) {
                    this.$toast("请输入车主姓名");
                    return false;
                }
                if (!driveInfo.drivingidentifycode || driveInfo.drivingidentifycode === "" || !getCheckCode(driveInfo.drivingidentifycode)) {

                    this.$toast("请输入正确的车辆识别代码");
                    return false;
                }
                if (driveInfo.drivingengineno === "" || !driveInfo.drivingengineno) {
                    this.$toast("请输入发动机号码");
                    return false;
                }
                if (!self.info.newCar &&
                    (driveInfo.drivingregisterdate === "" ||
                        !driveInfo.drivingregisterdate)
                ) {
                    this.$toast("请选择注册日期");
                    return false;
                }
                if (
                    !driveInfo.cardno ||
                    driveInfo.cardno === "" ||
                    !IdentityCodeValid(driveInfo.cardno)
                ) {
                    this.$toast("请输入正确的证件号码");
                    return false;
                }
                driveInfo.is_move = driveInfo.is_move ? '1' : '0';
                if (driveInfo.is_move === "1" && driveInfo.moveDate === "") {
                    this.$toast("请选择过户日期");
                    return false;
                }
                if (driveInfo.newCar) {
                    driveInfo.carno = '';
                }
                driveInfo.type = 1;
                console.log(driveInfo);
                this.$store.state.info = driveInfo;
                this.$router.push({path: "/selectcompany"});
            }
        }
    }
</script>

<style lang="scss" scoped>
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

    #upload {
        position: absolute;
        opacity: 0;
    }

    .mypicker {
        width: 100%;
    }

</style>
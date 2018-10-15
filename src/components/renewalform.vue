<template>
    <div>
        <div class="cells">
            <mt-cell title="行驶证上传" value="可用于自动识别，免除手工录入"></mt-cell>
            <div class="img_box" @click="addImg">
                <img src="../assets/img/driving_img.png" alt="" class="bg_img">
                <img :src="driveImg" alt="" class="drive_img" ref="drive_img">
            </div>
            <input @change="getImg" name="img" id="upload" accept="image/*" type="file" class="imgBtn">
        </div>
        <div class="cells">
            <mt-cell title="车牌号" v-show="info.newCar">
                <input type="text" placeholder="请输入车牌号" v-model="info.carno" class="my-input">
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
            <mt-cell title="注册日期" is-link @click.native="openPicker('registeDate')" v-show="info.newCar">
                <div>{{info.drivingregisterdate}}</div>
            </mt-cell>
        </div>
        <div class="cells">
            <mt-cell title="行驶区域">
                <input type="text" placeholder="请选择行驶区域" v-model="info.city" class="my-input">
            </mt-cell>
        </div>
        <div class="cells">
            <mt-cell title="车主身份证号码">
                <input type="text" placeholder="请输入车主身份证号码" v-model="info.carid" class="my-input">
            </mt-cell>
            <mt-cell title="是否一年内过户">
                <span class="remark">（此选项影响报价，必选）</span>
                <mt-switch v-model="info.ismove"></mt-switch>
            </mt-cell>
            <mt-cell title="过户时间" v-if="info.ismove" is-link @click.native="openPicker('moveDate')">
                <div>{{info.moveDate}}</div>
            </mt-cell>
        </div>
        <div class="btn_box">
            <button class="btn_50">返回</button>
            <button class="btn_50">下一步</button>
        </div>
        <mt-datetime-picker
                :startDate="startDate"
                :endDate="endDate"
                v-model="dateTime"
                type="date"
                ref="picker2"
                @confirm="handleConfirm">
        </mt-datetime-picker>
    </div>
</template>

<script>
    import moment from 'moment';
    import axios from "axios";
    import {
        GetUrlParam,
        isVehicleNumber,
        getCheckCode,
        IdentityCodeValid,
        isPoneAvailable,
        getObjectURL
    } from "@/utils/common";

    export default {
        name: "quoteform",
        data() {
            return {
                dateTime: null,
                startDate: new Date(),
                endDate: new Date(),
                date: null,
                driveImg: '',
                info: {
                    carno: null,
                    name: null,
                    drivingidentifycode: null,
                    drivingengineno: null,
                    drivingregisterdate: '请选择注册日期',
                    carid: '',
                    newCar: true,
                    ismove: false,
                    moveDate: '请选择过户日期'
                }
            }
        },
        methods: {
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
                this.info[key] = moment(data).format('YYYY-MM-DD');
            },
            addImg() {
                document.getElementById('upload').click();
            },
            getImg(event) {
                let pic = event.target.files[0];
                this.driveImg = getObjectURL(pic);
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
                            self.info = data.carmsg;
                            console.log(self.info);
                            self.$indicator.close();
                        }
                    });
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
</style>
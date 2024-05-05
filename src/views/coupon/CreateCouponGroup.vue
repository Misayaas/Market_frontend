<script setup lang="ts">
import {ref,defineProps,defineExpose,defineEmits} from 'vue';
import {userInfo} from "../../api/user.ts";
import {couponGroupsCreate} from "../../api/couponGroups.ts";
// 定义props
const {title}=defineProps({
    title: {
        type: String,
        default: '标题',
    },
});
// 定义emits
const emit = defineEmits(['submit','closed']);
// 定义表单数据
const role = sessionStorage.getItem("role");
const storeId = ref();
const isgolbal = ref(false);
getUserInfo()
function getUserInfo() {
    if(role === 'CEO')isgolbal.value = true;
    userInfo().then(res => {
        storeId.value = res.data.result.storeId
    })
}
let dialogVisible = ref(false);
let formData = ref({
    type : 'BLUE_WHALE',//优惠券类型
    threshold : 0,//优惠门槛
    discountRate : 0,//折扣优惠力度
    discount : 0,//满减优惠量
    totalNum : 0,//优惠券数
    timeRange : '',//优惠券有效时间
});
let formRef = ref();
let formRules = ref({
    totalNum: [{
        required: true,
        message: '请输入优惠券数量',
        trigger: 'blur',
    }, ],
    threshold: [{
        required: true,
        message: '请输入优惠券门槛',
        trigger: 'blur',
    }, ],
    type: [{
        required: true,
        message: '请选择优惠券类型',
        trigger: 'blur',
    }, ],
    discountRate: [{
        required: true,
        message: '请填写优惠券规则',
        trigger: 'blur',
    }, ],
    discount: [{
        required: true,
        message: '请填写优惠券规则',
        trigger: 'blur',
    }, ],
    timeRange: [{
        required: true,
        message: '请选择优惠券有效时间',
        trigger: 'blur',
    }, ],

});
// 重置表单
function resetForm() {
    formData.value = {
        type: 'BLUE_WHALE',
        threshold: 0,
        discountRate: 0,
        discount: 0,
        totalNum: 0,
        timeRange: '',
    };
}
function Month(month: any){
    if(month === 'Jan')return '01';
    else if(month === 'Feb')return '02';
    else if(month === 'Mar')return '03';
    else if(month === 'Apr')return '04';
    else if(month === 'May')return '05';
    else if(month === 'Jun')return '06';
    else if(month === 'Jul')return '07';
    else if(month === 'Aug')return '08';
    else if(month === 'Sep')return '09';
    else if(month === 'Oct')return '10';
    else if(month === 'Nov')return '11';
    else if(month === 'Dec')return '12';
}
function transtime(time: any){
    let tran_time='';
    let times=time.toString().split(' ');
    tran_time = times[3]+"-"+Month(times[1])+"-"+times[2]+"T"+times[4]+".000+00:00"
    return tran_time;
}
// 提交数据
function submitForm() {
    formRef.value.validate((valid: any) => {
        if(Number(formData.value.discount)>Number(formData.value.threshold)){
            ElMessage({
                customClass: 'customMessage',
                type: 'error',
                message: '折扣不得大于门槛',
            })
        }else if (valid){
            emit('submit', couponGroupsCreate({
                totalNum: formData.value.totalNum,
                storeId:storeId.value,
                threshold:formData.value.threshold,
                discount:formData.value.discount,
                discountRate:formData.value.discountRate,
                isGlobal: isgolbal.value,
                type: formData.value.type,
                startTime: transtime(formData.value.timeRange[0]),
                endTime: transtime(formData.value.timeRange[1]),
                }).then(res => {
                    if (res.data.code === '000') {  //类型守卫，它检查 res.data 对象中是否存在名为 code 的属性
                        ElMessage({
                            message: "优惠券组创建成功",
                            type: 'success',
                            center: true,
                        })
                    } else if (res.data.code === '400') {
                        ElMessage({
                            message: res.data.msg,
                            type: 'error',
                            center: true,
                    })
                    }
                }));
            dialogVisible.value = false;
        }
    });
}

// 关闭弹窗
function dialogClose(){
    emit('closed');
}
defineExpose({
    showDialog: () => {
        resetForm();
        dialogVisible.value = true;
    },
    hideDialog: () => {
        dialogVisible.value = false;
    },
});
</script>

<template>
    <el-dialog v-model="dialogVisible" class="customer-container" :title="title" width="30%" @close="dialogClose">
        <!-- <el-alert style="margin-bottom: 10px" :show-icon="options.showIcon" 
        :type="options.type" :closable="false"></el-alert> -->
        <el-form label-width="100px" ref="formRef" :model="formData" :rules="formRules">
            <el-form-item label="优惠券类型" prop="type">
                <el-select id="type" 
                           v-model="formData.type"
                           placeholder="请选择"
                           style="width: 100%;">
                  <el-option value="BLUE_WHALE" class="input_font" label="蓝鲸券"/>
                  <el-option value="FULL_REDUCTION" class="input_font" label="满减券"/>
                  <el-option value="DISCOUNT" class="input_font" label="折扣券"/>
                </el-select>
            </el-form-item>
            <el-form-item label="满" prop="threshold" v-if="formData.type === 'FULL_REDUCTION'">
                <el-row :gutter="0">
                    <el-col :span="9" style="margin-right: -47px">
                        <el-input v-model="formData.threshold" />
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="减" prop="discount" >
                            <el-input v-model="formData.discount" style="margin-top: 2px"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="满" prop="threshold" v-if="formData.type === 'DISCOUNT'">
                <el-row :gutter="0">
                    <el-col :span="9" style="margin-right: -47px">
                        <el-input v-model="formData.threshold" />
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="折扣" prop="discountRate" >
                            <el-input v-model="formData.discountRate" style="margin-top: 2px"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="有效时间" prop="timeRange">
                    <el-date-picker v-model="formData.timeRange" type="daterange" 
                    range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"/>
            </el-form-item>
            <el-form-item label="优惠券数量" prop="totalNum">
                <el-input v-model="formData.totalNum" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm"> 提交
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<style scoped>
</style>
<script setup lang="ts">
import {ref,defineProps,defineExpose,defineEmits} from 'vue';
import {getCoupons} from "../../api/coupons.ts";
import {parseTime} from "../../utils";
import { orderPay } from '../../api/order.ts';
import {getThisOrder} from '../../api/order.ts'
// 定义props
const {title}=defineProps({
    title: {
        type: String,
        default: '标题',
    },
});
interface Coupon{
    id:number;
    type:string;
    isGlobal:boolean;
    discount:number;
    threshold:number;
    discountRate:number;
    startTime:string;
    endTime:string;
    storeId:any;
    storeName:string;
    isAvailable:boolean;
}
const coupons = ref<Coupon[]>([]);
const Availablecoupons = ref<Coupon[]>([]);
handleCouponData()
function handleCouponData(){
    getCoupons().then(res =>{
        coupons.value = res.data.result
        for(const coupon of coupons.value){
            let now = new Date();
            coupon.endTime=parseTime(coupon.endTime);
            if(now>new Date(coupon.endTime))coupon.isAvailable=false;
        }
    });
}
const order_id = ref(0);
const tot_price = ref(0);
const store_id = ref(0);
function handleOrderData(id: any){
    order_id.value = id;
    getThisOrder(id).then(res => {
        tot_price.value = res.totalPrice;
        store_id.value = res.storeId;
    })
}
function handlecoupons(visible: any){
    if(visible){
        for(const coupon of coupons.value){
            if(coupon.threshold>tot_price.value){
                coupon.isAvailable=false;
            }
            if(!coupon.isGlobal&&coupon.storeId != store_id.value){
                coupon.isAvailable=false;
            }
        }
        Availablecoupons.value = coupons.value.filter(coupon => coupon.isAvailable);
    }
}
function trans(id: any){
    for(const coupon of coupons.value){
        if(coupon.id === id){
            if(coupon.type ==="BLUE_WHALE") return "蓝鲸券"
            else if(coupon.type ==="FULL_REDUCTION"){
                return "满减券: 满 "+coupon.threshold+" 减 "+coupon.discount;
            }
            else {
                return "满折券: 满 "+coupon.threshold+" 打 "+coupon.discountRate*10+"折";
            }
        }
    }
}
function NewPrice(id: any){
    for(const coupon of coupons.value){
        if(coupon.id === id){
            if(coupon.type ==="FULL_REDUCTION"){
                return tot_price.value-coupon.discount;
            }
            else if(coupon.type ==="DISCOUNT"){
                return tot_price.value*coupon.discountRate;
            }
            else {
                let price=0;
                let form_price=tot_price.value;
                if(form_price<=100)price=form_price*0.95;
                else if(form_price<=200)price=95+(form_price-100)*0.9;
                else if(form_price<=300)price=185+(form_price-200)*0.85;
                else if(form_price<=400)price=270+(form_price-300)*0.8;
                else if(form_price<=500)price=350+(form_price-400)*0.75;
                else price=425+(form_price-500)*0.7;
                return price;
            }
        }
    }
    return tot_price.value;
}
// 定义emits
const emit = defineEmits(['submit','closed']);
// 定义表单数据
let dialogVisible = ref(false);
let formData = ref({
    coupon: "NULL",
});
let formRef = ref();
let formRules = ref({
    coupon: [{
        required: true,
        message: '请选择优惠券',
        trigger: 'blur',
    }, ],
});
// 重置表单
function resetForm() {
    formData.value = {
        coupon: "NULL",
    };
}
// 提交数据
function submitForm() {
    formRef.value.validate((valid: any) => {
        if (valid){
            emit('submit', orderPay({
                id: order_id.value,
                couponId: parseInt(formData.value.coupon),
                totalPrice: NewPrice(formData.value.coupon)
                }).then(res => {
                    if (res.data.code === '000') {  //类型守卫，它检查 res.data 对象中是否存在名为 code 的属性
                        ElMessage({
                            message: "支付成功",
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
    showDialog: (orderId: any) => {
        handleOrderData(orderId);
        resetForm();
        dialogVisible.value = true;
    },
    hideDialog: () => {
        dialogVisible.value = false;
    },
});
</script>

<template>
    <el-dialog v-model="dialogVisible" class="customer-container" :modal-append-to-body='false'
    append-to-body :title="title" width="30%" @close="dialogClose">
        <el-form label-width="100px" ref="formRef" :model="formData" :rules="formRules">
            <el-form-item label="总价" prop="tot_price">
                <el-tag class="price-tag"> ￥{{ tot_price }}</el-tag>
            </el-form-item>
            <el-form-item label="优惠券" prop="coupon">
                <el-select id="coupon" 
                           v-model="formData.coupon"
                           placeholder="请选择"
                           @visible-change="handlecoupons"
                           style="width: 100%;">
                    <el-option value="NULL" class="input_font" label="不使用优惠券"/>
                    <el-option v-for="coupon in Availablecoupons" 
                        :key="coupon.id" 
                        :label="trans(coupon.id)" 
                        :value="coupon.id"/>
                </el-select>
            </el-form-item>
            <el-form-item label="总价" prop="New_tot_price">
                <el-tag class="price-tag"> ￥{{ NewPrice(formData.coupon) }}</el-tag>
            </el-form-item>
        </el-form>
        <template #footer>
            <span>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm"> 支付
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<style scoped>
.price-tag {
  font-size: 24px;
  color: #FF6000;
  font-weight: bold;
  background-color: transparent;
  border: none;
}
</style>
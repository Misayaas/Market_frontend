<script setup lang="ts">
import {ref} from "vue"
import {getthisStore} from "../../api/store.ts";
import {parseCouponType,parseTime} from "../../utils";
import {router} from '../../router'
import {ElMessageBox} from 'element-plus';
import {QuestionFilled} from "@element-plus/icons-vue"
import {getCoupons,deleteCoupons} from "../../api/coupons.ts";
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
    isUsed:boolean;
}
const pictureurl1 = ref('https://blue-whale28.oss-cn-beijing.aliyuncs.com/PicsArt_04-23-03.28.35.png')
//满折券
const pictureurl2 = ref('https://blue-whale28.oss-cn-beijing.aliyuncs.com/PicsArt_04-23-03.29.01.png')
//蓝鲸券
const pictureurl3 = ref('https://blue-whale28.oss-cn-beijing.aliyuncs.com/PicsArt_04-23-03.29.19.png')
//满减券
const coupons = ref<Coupon[]>([]);
handleCouponData()
function handleCouponData(){
    getCoupons().then(res =>{
        coupons.value = res.data.result
        console.log(res.data.result)
        coupons.value = coupons.value.filter(coupon => coupon.isUsed != true);
            for(const coupon of coupons.value){
                let now = new Date();
                coupon.endTime=parseTime(coupon.endTime);
                if(now>new Date(coupon.endTime))coupon.isAvailable=false;
                if(!coupon.isGlobal){
                getthestore(coupon.storeId)
                }
            }
        });
}
function getthestore(storeId: any){
    getthisStore(storeId).then(res => {
        for(const coupon of coupons.value){
        if(coupon.storeId === storeId)
            coupon.storeName = res.storeName
        } 
    })   
}
function Find(type: string){
  if(type === 'FULL_REDUCTION') return pictureurl3.value
  else if(type === 'DISCOUNT') return pictureurl1.value
  else return pictureurl2.value
}
function Delete(Id: any){
    ElMessageBox.confirm('是否删除该优惠券?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteCoupons({
            id: Id
        }).then(res => {
            if (res.data.code === '000') {  //类型守卫，它检查 res.data 对象中是否存在名为 code 的属性
                ElMessage({
                    message: "删除成功",
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
        })
    })
}
function OpenMessage(){
  let space = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp";
  let message = "“蓝鲸券”的具体使用规则为：<br>";
  message += space+"0-100元区间打九五折,<br>";
  message += space+"100-200元区间打九折,<br>";
  message += space+"200-300元区间打八五折,<br>";
  message += space+"300-400元区间打八折,<br>";
  message += space+"400-500元区间打七五折,<br>";
  message += space+"500元以上区间打七折。<br>";
  message += "其他优惠券具体使用规则详见各自描述。<br>";
  message += "请注意：优惠券最终解释权归本购物平台所有。"
  ElMessageBox.alert(message, '详细规则', {
    confirmButtonText: '确定',
    dangerouslyUseHTMLString: true
  });
}
function GoToUse(storeid: any){
    if(storeid == null)router.push({path:'/AllStore'})
    else router.push({path:'/storeDetail',query:{storeId:storeid}})
}

</script>

<template>
    <div>
        <h1>我的优惠券
        <el-button id="parentIframe"  @click.prevent="handleCouponData()"
            type="primary" style="display: none">
        </el-button>
        <el-button type="text" @click="OpenMessage()" 
        style="float: right; font-size: 22px; color: darkgray;margin-right: 80px;margin-top: 5px">
            <el-icon name="question"><QuestionFilled/></el-icon>
            特殊优惠券规则
        </el-button>
        </h1>
    </div>
    <div>
        <el-card v-for="coupon in coupons" :key="coupon.id" style="margin: 0 auto 5px; width: 80%">
            <el-row :gutter="20">
        <el-col :span="8" style="display: flex; justify-content: center; align-items: center;">
            <img :src="Find(coupon.type)" alt="图片" class="picture-image">
        </el-col>
        <el-col :span="8">
          <!-- 第二列的内容 -->
          <h2> {{parseCouponType(coupon.type)}} </h2>
        <h2 v-if="coupon.type==='FULL_REDUCTION'"> 规则: 满{{coupon.threshold}}减{{coupon.discount}} </h2>
        <h2 v-if="coupon.type==='DISCOUNT'"> 规则: 满{{coupon.threshold}} {{coupon.discountRate*10}}折 </h2>
        <h2> 有效期至: {{coupon.endTime.split(' ')[0]}} </h2>
        <h2 v-if="coupon.isGlobal===true"> 适用门店: 所有门店</h2>
        <h2 v-if="coupon.isGlobal===false"> 适用门店: {{coupon.storeName}}</h2>
        </el-col>
        <el-col :span="4" style="display: flex; justify-content: center; align-items: center;">
          <!-- 第三列的内容 -->
            <el-button v-if="coupon.isAvailable===true" type="success" @click="GoToUse(coupon.storeId)" style="font-size: 18px;">
                去使用
            </el-button>
            <el-button v-if="coupon.isAvailable!=true" :disabled="true" style="font-size: 18px;">
                已过期
            </el-button>

        </el-col>
        <el-col :span="4" style="display: flex; justify-content: center; align-items: center;">
          <!-- 第四列的内容 -->
            <el-button v-if="coupon.isAvailable!=true" type="danger" @click="Delete(coupon.id)" style="font-size: 18px;">
                删除
            </el-button>

        </el-col>
      </el-row>
        </el-card>
    </div>
</template>


<style scoped>
h2 {
 font-size: 14px;
 font-weight: 500;
 margin-top: 5px;     /* 上间隔 */
 margin-bottom: 5px;  /* 下间隔 */
}
.picture-image {
  width:auto; /* 自适应宽度 */
  height: 100px; /* 设置固定高度 */
}
</style>

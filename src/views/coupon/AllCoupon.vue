<script setup lang="ts">
import {ref} from "vue"
import {getCouponGroups,getStoresCouponGroups} from "../../api/couponGroups.ts";
import CreateCouponGroup from './CreateCouponGroup.vue';
import {getthisStore} from "../../api/store.ts";
import {parseCouponType,parseTime} from "../../utils";
import {couponsCreate,group_check} from "../../api/coupons.ts";
import {router} from '../../router'
import {userInfo} from "../../api/user.ts";
import {ElMessage,ElMessageBox} from 'element-plus';
import {QuestionFilled} from "@element-plus/icons-vue"
const role = sessionStorage.getItem("role")
const pictureurl1 = ref('https://blue-whale28.oss-cn-beijing.aliyuncs.com/PicsArt_04-23-03.28.35.png')
//满折券
const pictureurl2 = ref('https://blue-whale28.oss-cn-beijing.aliyuncs.com/PicsArt_04-23-03.29.01.png')
//蓝鲸券
const pictureurl3 = ref('https://blue-whale28.oss-cn-beijing.aliyuncs.com/PicsArt_04-23-03.29.19.png')
//满减券
const store_id = ref()
getUserInfo()
function getUserInfo() {
  userInfo().then(res => {
    store_id.value = res.data.result.storeId
    handleCouponGroupData()
  })
}
interface CouponGroup{
  id:number;
  type:string;
  isGlobal:boolean;
  discount:number;
  threshold:number;
  discountRate:number;
  totalNum:number;
  remainNum:number;
  startTime:string;
  endTime:string;
  storeId:any;
  storeName:string;
  isAvailable:boolean;
  check:boolean;
}
const coupongroups = ref<CouponGroup[]>([]);
function handleCouponGroupData(){
  if(role === 'STAFF'){
    getStoresCouponGroups({store_id:store_id.value}).then(res => {
      coupongroups.value = res.data.result
      for(const coupongroup of coupongroups.value){
        let now = new Date();
        coupongroup.endTime=parseTime(coupongroup.endTime);
        coupongroup.startTime=parseTime(coupongroup.startTime);
        if(now>new Date(coupongroup.endTime))coupongroup.isAvailable=false;
        if(!coupongroup.isGlobal){
          getthestore(coupongroup.storeId)
        }
      }
    });
  }
  else getCouponGroups().then(res =>{
    coupongroups.value = res.data.result
      for(const coupongroup of coupongroups.value){
        let now = new Date();
        coupongroup.endTime=parseTime(coupongroup.endTime);
        coupongroup.startTime=parseTime(coupongroup.startTime);
        if(now>new Date(coupongroup.endTime))coupongroup.isAvailable=false;
        if(!coupongroup.isGlobal){
          getthestore(coupongroup.storeId)
        }
        group_check({group_id:coupongroup.id}).then(res =>{
          coupongroup.check=res.data.result;
        });
      }
  });
}
function getthestore(storeId: any){
  getthisStore(storeId).then(res => {
    for(const coupongroup of coupongroups.value){
      if(coupongroup.storeId === storeId)
        coupongroup.storeName = res.storeName
    } 
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
function My_coupon(){
  router.push({path:'/MyCoupon'})
}
function Find(type: string){
  if(type === 'FULL_REDUCTION') return pictureurl3.value
  else if(type === 'DISCOUNT') return pictureurl1.value
  else return pictureurl2.value
}
function user_coupon(coupongroupId: number){
  couponsCreate({groupId:coupongroupId}).then(res =>{
    if (res.data.code === '000') {  //类型守卫，它检查 res.data 对象中是否存在名为 code 的属性
      ElMessage({
        message: "优惠券领取成功",
        type: 'success',
        center: true,
      })
      handleCouponGroupData()
    } else if (res.data.code === '400') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}
const createCouponGroupRef = ref();
const open= () => {
    createCouponGroupRef.value.showDialog();
};
const submit = () => {
  console.log('Form submitted');
};
</script>

<template>
  <div class="coupon-list">
    <h1>优惠券列表
      <el-button id="parentIframe"  @click.prevent="handleCouponGroupData()"
      type="primary" style="display: none">
      </el-button>
      <el-button v-if="role === 'CUSTOMER'" size="large" type="primary" @click="My_coupon()">
      查看我的优惠券
      </el-button>
        <el-button v-if="role === 'STAFF'||role === 'CEO'" size="large" type="primary" @click="open()">
        发布优惠券组
      </el-button>
      <CreateCouponGroup ref="createCouponGroupRef" title="创建优惠券组" @submit="submit"></CreateCouponGroup>
      <el-button type="text" @click="OpenMessage()" 
      style="float: right; font-size: 22px; color: darkgray;margin-right: 80px;margin-top: 8px">
        <el-icon name="question"><QuestionFilled/></el-icon>
        特殊优惠券规则
      </el-button>
      
    </h1>
    <div class="home-card">
      <div class="home-item" v-for="coupongroup in coupongroups" :coupongroup="coupongroup.id">
        <img :src="Find(coupongroup.type)" alt="图片" class="picture-image">
        <h2> {{parseCouponType(coupongroup.type)}} </h2>
        <h2 v-if="coupongroup.type==='FULL_REDUCTION'"> 规则: 满{{coupongroup.threshold}}减{{coupongroup.discount}} </h2>
        <h2 v-if="coupongroup.type==='DISCOUNT'"> 规则: 满{{coupongroup.threshold}} {{coupongroup.discountRate*10}}折 </h2>
        <h2> 数量: 余{{coupongroup.remainNum}}/{{coupongroup.totalNum}} </h2>
        <h2> 有效期: {{coupongroup.startTime.split(' ')[0]}} 至 {{coupongroup.endTime.split(' ')[0]}} </h2>
        <h2 v-if="coupongroup.isGlobal===true"> 适用门店: 所有门店</h2>
        <h2 v-if="coupongroup.isGlobal===false"> 适用门店: {{coupongroup.storeName}}</h2>
        <el-button v-if="role === 'CUSTOMER'&& coupongroup.remainNum != 0 && coupongroup.isAvailable && !coupongroup.check" 
        type="success" @click="user_coupon(coupongroup.id) " style="margin-top: 5px;margin-bottom: 10px">
          领取
        </el-button>
        <el-button v-if="role === 'CUSTOMER'&& coupongroup.remainNum != 0 && coupongroup.isAvailable && coupongroup.check" 
        :disabled="true" style="margin-top: 5px;margin-bottom: 10px">
          已领取
        </el-button>
        <el-button v-if="role === 'CUSTOMER' && coupongroup.remainNum === 0 && coupongroup.isAvailable" 
        :disabled="true" style="margin-top: 5px;margin-bottom: 10px">
          已领完
        </el-button>
        <el-button v-if="role === 'CUSTOMER' && !coupongroup.isAvailable"
        :disabled="true" style="margin-top: 5px;margin-bottom: 10px">
          已过期
        </el-button>
        <el-button v-if="(role === 'STAFF'|| role === 'CEO')&& coupongroup.isAvailable"
        :disabled="true" style="margin-top: 5px;margin-bottom: 10px">
          删除
        </el-button>
        <el-button v-if="(role === 'STAFF'|| role === 'CEO')&& !coupongroup.isAvailable"
        type="danger" @click="" style="margin-top: 5px;margin-bottom: 10px">
          删除
        </el-button>
      </div>
    </div>
  </div>
</template>


<style scoped>
.home-card {
 width: 90%;
 overflow: hidden;
 padding: 20px 50px;
 display: flex;
 flex-wrap: wrap;
}
.home-item {
 border-style: solid;
 border-width: 1px;
 border-color: #E4E4E4;
 width: calc(25% - 10px);
 padding: 10px 0px 0px 0px;
 margin-right: 10px;
 margin-bottom: 10px;
 display: flex;
 align-items: center;
 flex-direction: column;
 background: #fff;
}
.home-item:nth-child(4n) {
 margin-right: 0;
}
h2 {
 font-size: 14px;
 font-weight: 500;
 margin-top: 5px;     /* 上间隔 */
 margin-bottom: 5px;  /* 下间隔 */
}
.picture-image {
  width:auto; /* 自适应宽度 */
  height: 150px; /* 设置固定高度 */
}
</style>

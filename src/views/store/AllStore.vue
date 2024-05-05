<script setup lang="ts">
import {ref} from 'vue'
import {getStoreData} from "../../api/store.ts"
import {router} from '../../router'
import StoreItem from '../../components/StoreItem.vue'
interface Store {

  id: number;
  storeName: string;
  logoUrl: string;
  description: string;

}
const stores = ref<Store[]>([]);
handleStoreData()
function handleStoreData(){
    getStoreData().then(res => {
        stores.value=res  
    })
}
function toStoreDetailPage(storeId: any) {
  router.push({
      path:'/storeDetail',
      query:{
        storeId:storeId
   }})
}
/*
let activeEffect = null
function whenDepsChange(handleStoreData) {
  const effect = () => {
    activeEffect = effect
    handleStoreData()
    activeEffect = null
  }
  effect()
}*/
//目前自动更新没有效果

</script>

<template>
    <div>
       <h1>商店列表
       <el-button @click.prevent="handleStoreData"
                       type="primary" style="display: none">
              刷新列表
       </el-button>
      </h1>
    </div>
    <div class="store-item-list">
      <StoreItem v-for="storeVO in stores" :storeId="storeVO.id" @click="toStoreDetailPage(storeVO.id)"/>
    </div>

</template>

<style scoped>
.store-item-list {
  display: flex;
  padding: 2px;
  flex-flow: wrap;
  justify-content: center;
  align-content: start;
}
</style>
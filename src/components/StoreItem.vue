<script setup lang="ts">
import {ref} from "vue"
import {getthisStore} from "../api/store.ts"

// 使用props接收父界面传来的数据
const props = defineProps({
  storeId: {
    type: Number,
    required: true
  }
})

const name = ref('')
const logoUrl = ref('')
const description = ref('')
getthisStore(props.storeId).then(res => {
  name.value = res.storeName
  logoUrl.value = res.logoUrl
  description.value = res.description
})
</script>


<template>
  <el-card class="store-item-card" :body-style="{ padding: '0px' }" shadow="hover">
    <img  :src="logoUrl" alt="图片" class="logo-image">
    <h1> {{ name }} </h1>
  </el-card>
</template>


<style scoped>
.store-item-card{
  border-style: solid;
  border-width: 1px;
  border-color: #E4E4E4;
  width: calc(33% - 30px);
  padding: 10px 0px 0px 0px;
  margin-right: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
  background: #fff;
}
.store-item-card:nth-child(3n) {
  margin-right: 0;
}
h1 {
  margin-top: 10px;
  text-align: center; 
}
.logo-image {
  width:auto; /* 自适应宽度 */
  height: 150px; /* 设置固定高度 */
}
</style>

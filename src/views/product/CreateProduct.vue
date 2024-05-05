<!--Lab2新增-创建商品界面-->
<!--你可以选择把创建商品改成一个弹窗或其他界面的一个部分。
这样的话，就不需要有这样一个views下的创建商品文件了，因为views下的文件一般会是一个单独的界面。
但如果你觉得这一个部分的代码较多，合到其他文件里会使那个文件太长，
可以在product文件夹下创建一个components子文件夹，里面存放product模块下产生的组件界面。把这个创建商品子组件放在里面。
这个传递数据的过程可能需要用到props
这边是需要实现上传至少2张图片。可以从CreateStore里提供的代码改，也可以自己搜了写。-->

<script setup lang="ts">
import {ref, computed} from 'vue'
import {uploadImage} from '../../api/tools'
import {router} from '../../router'
import {productRegister} from "../../api/product.ts"
import {userInfo} from "../../api/user.ts"

const imageFileList = ref([])
const logoList = ref([]as string[])
const logoUrl = ref('')
const productName = ref('')
const productkind = ref('')
const productprice = ref()
const Description = ref('')
const last_length = ref(0)

const hasproductName = computed(() => productName.value != '')
const hasproductkind = computed(() => productkind.value != '')
const hasproductprice = computed(() => productprice.value != '')
const hasDescription = computed(() => Description.value != '')
const haslogo = computed(() => imageFileList.value.length >= 2)
const registerDisabled = computed(() => {
    return !(hasproductName.value && hasDescription.value && haslogo.value
     && hasproductkind.value && hasproductprice.value )
})
const storeId=ref()
getUserInfo()
function getUserInfo() {
  userInfo().then(res => {
    storeId.value = res.data.result.storeId
  })
}
function handleChange(file: any, fileList: any) {
  if(file.name.length > 10){
      file.name=file.name.substr(0, 10) + "..." +file.name.substr(file.name.length-4, file.name.length)
    }
  if (fileList.length < 2) {
    ElMessage.warning('请至少选择两张图片');
  }
  imageFileList.value = fileList
  let formData = new FormData()
  formData.append('file', file.raw)
  uploadImage(formData).then(res => {
    logoUrl.value = res.data.result
    if(fileList.length<last_length.value){
      const index = logoList.value.findIndex(item => item === logoUrl.value)
      if (index !== -1) {
        logoList.value.splice(index, 1);
      }
    }
    else logoList.value.push(logoUrl.value)
    last_length.value=fileList.length
  })
}
function handleExceed() {
  ElMessage.warning(`当前限制至多选择99个文件`);
}

function uploadHttpRequest() {
  return new XMLHttpRequest()
}
function beforeUpload(file: any) {
    if (file.size / 1024 / 1024 > 1) {
      ElMessage({
        message: "上传文件大小不能超过1M!",
        type: 'error',
        center: true,
      })
      return false;
    }
    return true;
}
function handleRegister() {
  productRegister({
    imageUrl: logoList.value,
    name: productName.value,
    type: productkind.value,
    price: productprice.value,
    description: Description.value,
  }).then(res => {
    if (res.data.code === '000') {  //类型守卫，它检查 res.data 对象中是否存在名为 code 的属性
      ElMessage({
        message: "商品注册成功",
        type: 'success',
        center: true,
      })
      router.push({
      path:'/storeDetail',
      query:{
        storeId:storeId.value
   }})
    } else if (res.data.code === '400') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}
</script>


<template>
  <el-main>
    <el-row :gutter="20">
    <el-col :span="8">
    <el-card class="aside-card">
    <el-form>

      <el-form-item label="商品图片">
        <el-upload
            v-model:file-list="imageFileList"
            :limit="99"
            :before-upload="beforeUpload"
            :on-change="handleChange"
            :on-exceed="handleExceed"
            :on-remove="handleChange"
            class="upload-demo"
            list-type="picture"
            :http-request="uploadHttpRequest"
            drag>
          <el-icon class="el-icon--upload">
            <upload-filled/>
          </el-icon>
          <div class="el-upload__text">
            将文件拖到此处或单击此处上传。至少上传两份文件。
          </div>
        </el-upload>
      </el-form-item>

    </el-form>
    </el-card>

    </el-col>
    <el-col :span="16">
    <el-card>
      <el-form>
         <el-form-item>
           <label for="name">商品名称</label>
           <el-input type="text" id="name" v-model="productName"/>
         </el-form-item>
         <el-form-item>
          <label for="kind">商品类型</label>
                <el-select id="kind"
                           v-model="productkind"
                           placeholder="请选择"
                           style="width: 100%;"
                >
                  <el-option value="FOOD" label="食品"/>
                  <el-option value="CLOTHES" label="服饰"/>
                  <el-option value="FURNITURE" label="家具"/>
                  <el-option value="ELECTRONICS" label="电子产品"/>
                  <el-option value="ENTERTAINMENT" label="娱乐"/>
                  <el-option value="SPORTS" label="体育产品"/>
                  <el-option value="LUXURY" label="奢侈品"/>
                  <el-option value="OTHERS" label="其他"/>
                </el-select>
         </el-form-item>
         <el-form-item>
           <label for="price">商品价格</label>
           <el-input id="price" v-model="productprice"/>
         </el-form-item>
         <el-form-item>
           <label for="description">商品简述</label>
           <el-input id="description" type="textarea"
                rows="5"
                v-model="Description"></el-input>
           </el-form-item>
      </el-form>
      <el-button @click.prevent="handleRegister"
                   :disabled="registerDisabled"
                   type="primary">
          创建商品
        </el-button>
      </el-card>
   </el-col>
   </el-row>

  </el-main>
</template>


<style scoped>

</style>

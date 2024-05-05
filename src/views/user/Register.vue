<script setup lang="ts">
import {ref, computed} from 'vue'
import {router} from '../../router'
import {userRegister} from "../../api/user.ts"
import {getStoreData} from "../../api/store.ts"

// 输入框值（需要在前端拦截不合法输入：是否为空+额外规则）
const name = ref('')
const identity = ref('')
const tel = ref('')
const address = ref('')
const password = ref('')
const confirmPassword = ref('')
interface Store {
  id: number;
  storeName: string;
}
const stores = ref<Store[]>([]);
function handleStoreData(){
    getStoreData().then(res => {
        stores.value=res
    })
    return true
}
//对于商家用户，还需要在注册时选择所属商店，从而传入storeId。但由于Lab2才会开发商店模块，所以这里暂且设置唯一一个Id为1的商店1，待Lab2完善
const storeId = ref()

// 电话号码是否为空
const hasTelInput = computed(() => tel.value != '')
// 密码是否为空
const hasPasswordInput = computed(() => password.value != '')
// 重复密码是否为空
const hasConfirmPasswordInput = computed(() => confirmPassword.value != '')
// 地址是否为空
const hasAddressInput = computed(() => address.value != '')
// 身份是否为空
const hasIdentityChosen = computed(() => identity.value != '')
// 对于商家用户，商店Id是否为空
const hasStoreName = computed(() => storeId.value != undefined)
// 电话号码的规则
const chinaMobileRegex = /^1(3[0-9]|4[579]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[189])\d{8}$/
const telLegal = computed(() => chinaMobileRegex.test(tel.value))
// 重复密码的规则
const isPasswordIdentical = computed(() => password.value == confirmPassword.value)
// 注册按钮可用性
const registerDisabled = computed(() => {
  if (!hasIdentityChosen.value) {
    return true
  } else if (identity.value == 'CUSTOMER'||identity.value == 'CEO') {
    return !(hasTelInput.value && hasPasswordInput.value && hasConfirmPasswordInput && hasAddressInput.value &&
        telLegal.value && isPasswordIdentical.value)
  } else if (identity.value == 'STAFF') {
    return !(hasTelInput.value && hasPasswordInput.value && hasConfirmPasswordInput && hasAddressInput.value &&
        hasStoreName.value && telLegal.value && isPasswordIdentical.value)
  }
})

// 注册按钮触发
function handleRegister() {
  userRegister({
    role: identity.value,
    name: name.value,
    phone: tel.value,
    password: password.value,
    address: address.value,
    storeId: storeId.value
  }).then(res => {
    if (res.data.code === '000') {  //类型守卫，它检查 res.data 对象中是否存在名为 code 的属性
      ElMessage({
        message: "注册成功！请登录账号",
        type: 'success',
        center: true,
      })
      router.push({path: "/login"})
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
  <el-main class="main-frame bgimage">
    <el-card class="form">
      <div>
        <p class="title">Register your account</p>

        <el-form>
          <el-row>
            <el-col :span="10">
                <label for="name" class="input_font">输入你的昵称喵~</label>
                <input class="input" id="name"
                          v-model="name"
                          placeholder="请输入昵称"/>
            </el-col>

            <el-col :span="2"></el-col>

            <el-col :span="10"><label for="identity" class="input_font" >身份</label>
              <el-form-item>
                
                <el-select id="identity" class="input" 
                           v-model="identity"
                           placeholder="请选择"
                           style="width: 100%;"
                >
                  <el-option value="CUSTOMER" class="input_font" label="顾客"/>
                  <el-option value="STAFF" class="input_font" label="商家"/>
                  <el-option value="CEO" class="input_font" label="CEO"/>
                  <el-option value="MANAGER" class="input_font" label="管理员"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item>

                <label class="input_font" v-if="!hasTelInput" for="tel">
                  请注册手机号喵~
                </label>
                <label v-else-if="!telLegal" for="tel" class="error-warn">
                  手机号不合法
                </label>
                <label v-else for="tel" class="input_font">
                  请注册手机号喵~
                </label>

                <input class="input" id="tel"
                          v-model="tel" :class="{'error-warn-input' :(hasTelInput && !telLegal)}"
                          placeholder="请输入手机号"/>
              </el-form-item>
            </el-col>

            <el-col :span="2"></el-col>

            <el-col :span="10" v-if="identity!=='STAFF'">
              <el-form-item>
                <label for="address" class="input_font">
                  输入你的地址喵
                </label>
                <input id="address" class="input" 
                          v-model="address"
                          placeholder="请输入地址"/>
              </el-form-item>
            </el-col>

            <el-col :span="10" v-if="identity==='STAFF'">
              <el-form-item>
                <label for="address" class="input_font">
                  请输入你的地址喵
                </label>
                <input id="address" class="input" 
                          v-model="address"
                          placeholder="请输入地址"/>
              </el-form-item>
            </el-col>


            <el-col :span="8" v-if="identity==='STAFF'">
              <el-form-item>
                <label for="address" class="input_font">
                  所属商店
                </label>
                <el-select id="storeName" class="input" 
                           v-model="storeId"
                           placeholder="请选择"
                           style="width: 100%;
                           height: auto;"
                           @visible-change="handleStoreData"
                >
                  <el-option v-for="store in stores" :value = "store.id" :label="store.storeName"/>
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row style="visibility: hidden;">" "</el-row>

          <el-form-item> 
            <label for="password" class="input_font">密码</label>
            <el-col :span="1"></el-col>
           
            <input type="password" id="password" class="input" 
                      v-model="password"
                      placeholder="••••••••"/>
          </el-form-item>
          
          <el-form-item>
            <label v-if="!hasConfirmPasswordInput" class="input_font">确认密码</label>
            <label v-else-if="!isPasswordIdentical" class="error-warn">密码不一致</label>
            <label v-else class="input_font">确认密码</label>

            <input type="password" id="confirm-password" class="input" 
                      v-model="confirmPassword"
                      :class="{'error-warn-input' :(hasConfirmPasswordInput && !isPasswordIdentical)}"
                      placeholder="••••••••"/>
          </el-form-item>
          
            <button class="button-confirm" @click.prevent="handleRegister"
        :disabled="registerDisabled"
        type="primary"
        v-if="!registerDisabled">
        创建账户
            </button>
        <button v-else class="button-unconfirm">
  <!-- 在这里添加你希望在 registerDisabled 为 true 时显示的内容 -->
                     请填写完整
        </button>

            <router-link to="/login" v-slot="{navigate}">
              <button class="button-confirm" @click="navigate">
                去登录
              </button>
            </router-link>
         

        </el-form>
      </div>

    </el-card>
  </el-main>

</template>


<style scoped>
.main-frame {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}

.bgimage {
  background-image: url("../../assets/shopping-1s-1084px.svg");
}

.error-warn {
  color: red;
}

.error-warn-input {
  --el-input-focus-border-color: red;
}



.title {
  font-size: 28px;
  color: royalblue;
  font-weight: 600;
  letter-spacing: -1px;
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 30px;
}

.title::before,.title::after {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  border-radius: 50%;
  left: 0px;
  background-color: royalblue;
}

.title::before {
  width: 18px;
  height: 18px;
  background-color: royalblue;
}

.title::after {
  width: 18px;
  height: 18px;
  animation: pulse 1s linear infinite;
}



.signin {
  text-align: center;
}

.signin a {
  color: royalblue;
}

.signin a:hover {
  text-decoration: underline royalblue;
}

.flex {
  display: flex;
  width: 100%;
  gap: 6px;
}

.form label {
  position: relative;
}

.form label .input {
  width: 100%;
  padding: 10px 10px 20px 10px;
  outline: 0;
  border: 1px solid rgba(105, 105, 105, 0.397);
  border-radius: 10px;
}

.form label .input + span {
  position: absolute;
  left: 10px;
  top: 15px;
  color: grey;
  font-size: 0.9em;
  cursor: text;
  transition: 0.3s ease;
}

.form label .input:placeholder-shown + span {
  top: 15px;
  font-size: 0.9em;
}

.form label .input:focus + span,.form label .input:valid + span {
  top: 30px;
  font-size: 0.7em;
  font-weight: 600;
}

.form label .input:valid + span {
  color: green;
}

.submit {
  border: none;
  outline: none;
  background-color: royalblue;
  padding: 10px;
  border-radius: 10px;
  color: #fff;
  font-size: 16px;
  transform: .3s ease;
}

.submit:hover {
  background-color: rgb(56, 90, 194);
}

@keyframes pulse {
  from {
    transform: scale(0.9);
    opacity: 1;
  }

  to {
    transform: scale(1.8);
    opacity: 0;
  }
}
.form {
  --input-focus: #2d8cf0;
  --font-color: #323232;
  --font-color-sub: #666;
  --bg-color: beige;
  --main-color: black;
  padding: 20px;
  background: lightblue;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  box-shadow: 4px 4px var(--main-color);
}

.title {
  color: var(--font-color);
  font-weight: 900;
  font-size: 20px;
  margin-bottom: 25px;
}

.title span {
  color: var(--font-color-sub);
  font-weight: 600;
  font-size: 17px;
}

.input {
  width: 250px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 15px;
  font-weight: 600;
  color: var(--font-color);
  padding: 5px 10px;
  outline: none;
}
.input_font{
  font-size: 15px;
  font-weight: 600;
}
.input::placeholder {
  color: var(--font-color-sub);
  opacity: 0.8;
}

.input:focus {
  border: 2px solid var(--input-focus);
}

.button-confirm {
  margin: 10px auto 0 auto;
  width: 120px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 17px;
  font-weight: 600;
  color: var(--font-color);
  cursor: pointer;
}
.button-unconfirm {
  margin: 10px auto 0 auto;
  width: 120px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 17px;
  font-weight: 600;
  color: var(--input-focus);
  cursor: pointer;
}
</style>

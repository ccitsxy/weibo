<script setup lang="ts">
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const authcode = ref('')
</script>

<template>
  <div class="absolute left-1/2 top-1/2 w-64 p-8 -translate-1/2">
    <n-form>
      <n-form-item-row label="用户名">
        <n-input v-model:value="username" />
      </n-form-item-row>
      <n-form-item-row label="密码">
        <n-input v-model:value="password" />
      </n-form-item-row>
      <n-form-item-row label="验证码">
        <n-input-group>
          <n-input v-model:value="authcode" disabled maxlength="6"/>
          <n-button type="primary" ghost> 获取验证码 </n-button>
        </n-input-group>
      </n-form-item-row>
    </n-form>
    <n-button type="primary" block strong> 登录 </n-button>
  </div>
</template>

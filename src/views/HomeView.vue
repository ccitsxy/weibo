<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useTimeoutPoll } from '@vueuse/core'

const count = ref(1)
const expired = ref(false)

const imageUrl = ref('')
const qrid = ref('')
const alt = ref('')

const now = Date.now()

const check = () => {
  count.value = count.value + 2
  axios
    .get('sso/qrcode/check', {
      params: {
        entry: 'miniblog',
        qrid: qrid.value,
        callback: `STK_${now}${count.value}`
      }
    })
    .then((response) => {
      const data = JSON.parse(response.data.match(/(?<=\()(.+?)(?=\))/g)[0])
      if (data.retcode === 50114003) {
        expired.value = true
      } else if (data.retcode === 20000000) {
        alt.value = data.data.alt
        pause()
        login()
      }
    })
}

const { pause, resume } = useTimeoutPoll(check, 2000)

const getImage = () => {
  count.value = count.value + 2
  axios
    .get('sso/qrcode/image', {
      params: {
        entry: 'miniblog',
        size: 180,
        callback: `STK_${now}${count.value}`
      }
    })
    .then((response) => {
      const data = JSON.parse(response.data.match(/(?<=\()(.+?)(?=\))/g)[0])
      imageUrl.value = data.data.image
      qrid.value = data.data.qrid
      expired.value = false
      resume()
    })
}

const login = () => {
  count.value = count.value + 2
  axios
    .get('sso/login.php', {
      params: {
        entry: 'miniblog',
        returntype: 'TEXT',
        crossdomain: 1,
        cdult: 3,
        domain: 'weibo.com',
        alt: alt.value,
        savestate: 30,
        callback: `STK_${now}${count.value}`
      }
    })
    .then((response) => {
      const data = JSON.parse(response.data.match(/(?<=\()(.+?)(?=\))/g)[0])
      const loginUrl = new URL(data.crossDomainUrlList[2])
      const ticket = loginUrl.searchParams.get('ticket')
      const ssosavestate = loginUrl.searchParams.get('ssosavestate')
      count.value = count.value + 2
      axios
        .get('wbsso/login', {
          headers:{
            "Content-Type": 'text/plain'
          },
          params: {
            ticket: ticket,
            ssosavestate: ssosavestate,
            action: 'login',
            callback: `STK_${now}${count.value}`
          }
        })
        .then((response) => {
          const data = JSON.parse(response.data.match(/(?<=\()(.+?)(?=\))/g)[0])
          console.log(data)
        })
    })
}

getImage()
</script>

<template>
  <div class="absolute left-1/2 top-1/2 -translate-1/2 w-180px h-180px p-8">
    <button v-if="expired" @click="getImage">点击刷新</button>
    <img v-else :src="imageUrl" />
  </div>
</template>

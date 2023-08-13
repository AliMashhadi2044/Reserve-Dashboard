<script setup>
import { computed, reactive } from 'vue'
import { SquaresPlusIcon, ShieldExclamationIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'
import { responeHandeler } from '../assets/js/init'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, minLength } from '@vuelidate/validators'
import axios from 'axios'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

let loginInfo = reactive({
  username: '',
  password: ''
})

const store = useStore()

const rules = computed(() => {
  return {
    username: {
      required: helpers.withMessage(` لطفا نام کاربری را وارد نمایید.`, required)
    },
    password: {
      required: helpers.withMessage(` لطفا رمز عبور را وارد نمایید.`, required),
      minLength: helpers.withMessage(` لطفا رمز عبور حداقل 6 رقم می باشد.`, minLength(6))
    }
  }
})

const v$ = useVuelidate(rules, loginInfo)
const router = useRouter()
const loginHandler = async (vuesax) => {
  let result = await v$.value.$validate()
  if (!result) return false

  vuesax.loading({
    container: '#loadingBtn',
    scale: 0.45
  })

  axios
    .post('/auth/admin/login', {
      email: loginInfo.username,
      password: loginInfo.password
    })
    .then((response) => {
      if (response.status == 200 && response.data.msgCode == 200) {
        store.commit('login', response.data.data.token.accessToken)
        vuesax.notify({
          title: 'اطلاع رسانی',
          text: 'سلام ادمین خوش اومدی',
          color: 'success',
          icon: 'verified_user',
          position: 'top-right'
        })
        router.push('/')
      }
      vuesax.loading.close('#loadingBtn > .con-vs-loading')
    })
    .catch((error) => {
      if (error.response) {
        let errRes = error.response?.data?.msgCode
        if (errRes === 40104)
          vuesax.notify({
            title: 'خطا',
            text: 'نام کاربری یا رمز عبور شما نادرست هست.',
            color: 'danger',
            icon: 'error',
            position: 'top-right'
          })
        else if (errRes)
          vuesax.notify({
            title: 'خطا',
            text: responeHandeler(error.response.data.msgCode).mes,
            color: 'danger',
            icon: 'error',
            position: 'top-right'
          })
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }

      vuesax.loading.close('#loadingBtn > .con-vs-loading')
    })
}
</script>
<template>
  <div class="w-80 relative md:translate-x-1/2 border py-2 border-gray-100 bg-white rounded-lg shadow-xl mt-20 md:mt-0">
    <div
      class="rounded-full flex items-center justify-center absolute z-10 md:z-[999999999] -left-3 -top-3 w-10 h-10 border-4 border-white bg-[#0e45d5]"
      :class="{ '!bg-danger': v$.$error, '!bg-success': !v$.$invalid }">
      <SquaresPlusIcon v-if="!v$.$error && v$.$invalid" class="w-5 h-5 text-white" />
      <ShieldExclamationIcon v-if="v$.$error" class="w-5 h-5 text-white" />
      <ShieldCheckIcon v-if="!v$.$invalid" class="w-5 h-5 text-white" />
    </div>
    <h3 class="text-lg font-medium px-4 py-2 border-r-[3px] text-gray-800 border-[#0e45d5]">
      ورود به کارتابل
    </h3>
    <div class="p-7">
      <form action="">
        <div class="w-full">
          <vs-input val-icon-danger="close" :danger="v$.username.$error" :danger-text="v$.username.$errors[0]?.$message"
            class="!w-full" label="نام کاربری" v-model="loginInfo.username" />
        </div>
        <div class="w-full mt-3">
          <vs-input val-icon-danger="close" :danger="v$.password.$error" :danger-text="v$.password.$errors[0]?.$message"
            class="!w-full" type="password" label="رمز عبور" v-model="loginInfo.password" />
        </div>
      </form>
      <div class="w-full mt-7" id="loadingBtn">
        <vs-button @click="loginHandler($vs, $refs)" class="w-full" color="#0e45d5" type="filled">
          <span class="block py-1">ورود</span>
        </vs-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { cities, organizationalPositions } from '../assets/js/_constant'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { check_national_code, checkMobileRegex } from '../assets/js/init'
import axios from 'axios'
import { checkStatus } from '../assets/js/_erHandler'
import { useRouter } from 'vue-router'
import store from '../store'
let router = useRouter()

let emit = defineEmits(['reloadData', 'closeModal'])

let props = defineProps({
  inputItems: {
    type: Object,
    required: false
  },
  edit: {
    type: Boolean,
    required: false
  },
  btn_text: {
    type: String,
    required: false,
    default: 'افزودن'
  }
})

let userInfo = ref({
  fullName: '',
  phoneNumber: '',
  nationalCode: '',
  city: '',
  organizationalPosition: ''
})

watch(
  () => props.inputItems,
  () => {
    userInfo.value = props.inputItems
  }
)

const rules = computed(() => {
  return {
    fullName: {
      required: helpers.withMessage(`لطفا نام و نام خانوادگی را وارد کنید.`, required)
    },
    phoneNumber: {
      required: helpers.withMessage(`لطفا تلفن همراه را وارد کنید.`, required),
      check: helpers.withMessage(`تلفن همراه اشتباه است.`, checkMobileRegex)
    },
    nationalCode: {
      required: helpers.withMessage(`لطفا کدملی را وارد کنید.`, required),
      check: helpers.withMessage(`کدملی اشتباه است.`, check_national_code)
    },
    city: {
      required: helpers.withMessage(`لطفا استان را انتخاب نمایید.`, required)
    },
    organizationalPosition: {
      required: helpers.withMessage(`لطفا واحد سازمانی را انتخاب نمایید.`, required)
    }
  }
})

const v$ = useVuelidate(rules, userInfo)

const confirmRequest = async (vuesax) => {
  let result = await v$.value.$validate()
  if (!result) return false
  props.edit ? updateUser(vuesax) : insertUser(vuesax)
}


const insertUser = (vuesax) => {
  store.dispatch('setTokenHeadder')
  axios
    .post('/users', userInfo.value)
    .then((response) => {
      let validStatus = checkStatus(response.data, response.status)
      if (validStatus.status) {
        vuesax.notify({
          title: 'اطلاع رسانی',
          text: validStatus.msg,
          color: 'success',
          icon: 'verified_use',
          position: 'top-right'
        })
        emit('reloadData')
        emit('closeModal')
      }
    })
    .catch((er) => {
      if (!er.response) {
        vuesax.notify({
          title: 'خطا',
          text: 'خطایی رخ داده است لطفا بعدا امتحان کنید.',
          color: 'danger',
          icon: 'error',
          position: 'top-right'
        })
        return false
      }
      let validStatus = checkStatus(er.response.data, er.response.status)
      if (validStatus.redirect) {
        store.commit('logout')
        router.push({ path: validStatus.redirect })
        return
      }
      vuesax.notify({
        title: 'خطا',
        text: validStatus.msg,
        color: 'danger',
        icon: 'error',
        position: 'top-right'
      })
    })
}

const updateUser = (vuesax) => {
  let userId = props.inputItems._id
  store.dispatch('setTokenHeadder')
  console.log(userInfo.value)
  axios
    .put(`/users/${userId}`, {
      fullName: userInfo.value.fullName,
      phoneNumber: userInfo.value.phoneNumber,
      nationalCode: userInfo.value.nationalCode,
      city: userInfo.value.city,
      organizationalPosition: userInfo.value.organizationalPosition
    })
    .then((response) => {
      let validStatus = checkStatus(response.data, response.status)
      if (validStatus.status) {
        vuesax.notify({
          title: 'اطلاع رسانی',
          text: validStatus.msg,
          color: 'success',
          icon: 'verified_use',
          position: 'top-right'
        })
        emit('reloadData')
        emit('closeModal')
      }
    })
    .catch((er) => {
      if (!er.response) {
        vuesax.notify({
          title: 'خطا',
          text: 'خطایی رخ داده است لطفا بعدا امتحان کنید.',
          color: 'danger',
          icon: 'error',
          position: 'top-right'
        })
        return false
      }
      let validStatus = checkStatus(er.response.data, er.response.status)
      if (validStatus.redirect) {
        store.commit('logout')
        router.push({ path: validStatus.redirect })
        return
      }
      vuesax.notify({
        title: 'خطا',
        text: validStatus.msg,
        color: 'danger',
        icon: 'error',
        position: 'top-right'
      })
    })
}
</script>
<template>
  <div class="flex flex-wrap">
    <div class="w-full md:w-1/2 lg:w-1/3 p-2">
      <vs-input class="!w-full" val-icon-danger="close" label="نام و نام خانوادگی :" v-model="userInfo.fullName"
        :danger="v$.fullName.$error" :danger-text="v$.fullName.$errors[0]?.$message" />
    </div>
    <div class="w-full md:w-1/2 lg:w-1/3 p-2">
      <vs-input class="!w-full" val-icon-danger="close" label="کد ملی :" v-model="userInfo.nationalCode"
        :danger="v$.nationalCode.$error" :danger-text="v$.nationalCode.$errors[0]?.$message" />
    </div>
    <div class="w-full md:w-1/2 lg:w-1/3 p-2">
      <vs-input class="!w-full" val-icon-danger="close" label="شماره همراه :" v-model="userInfo.phoneNumber"
        :danger="v$.phoneNumber.$error" :danger-text="v$.phoneNumber.$errors[0]?.$message" />
    </div>
    <div class="w-full md:w-1/2 lg:w-1/3 p-2">
      <vs-select class="selectExample !w-full" val-icon-danger="close" label="واحد سازمانی :"
        v-model="userInfo.organizationalPosition" :danger="v$.organizationalPosition.$error"
        :danger-text="v$.organizationalPosition.$errors[0]?.$message">
        <vs-select-item :key="item" :modelValue="item" :text="item" v-for="item in organizationalPositions" />
      </vs-select>
    </div>
    <div class="w-full md:w-1/2 lg:w-1/3 p-2">
      <vs-select class="selectExample !w-full" val-icon-danger="close" label="استان :" v-model="userInfo.city"
        :danger="v$.city.$error" :danger-text="v$.city.$errors[0]?.$message">
        <vs-select-item :key="item" :modelValue="item" :text="item" v-for="item in cities" />
      </vs-select>
    </div>
    <vs-divider />
    <div class="flex w-full justify-end">
      <vs-button @click="confirmRequest($vs)">{{ btn_text }}</vs-button>
    </div>
  </div>
</template>

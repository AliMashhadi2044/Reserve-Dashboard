<script setup>
import axios from 'axios'
import { inject, onMounted, ref } from 'vue'
import BaseTable from '../components/BaseTable.vue'
import { toSolar } from '../assets/js/init'
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import store from '../store'
import { checkStatus } from '../assets/js/_erHandler'
import router from '../router'

const emit = defineEmits(['loaded'])

let loaded = ref(false)
let $vuesax = inject("$vs")

let users = ref([])
const read_all_users = () => {
  axios
    .get('/users')
    .then((response) => {
      if (response.status === 200 && response.data.msgCode === 200) {
        users.value = response.data.data
        loadedContent(true)
      } else throw response
    })
    .catch((er) => {
      if (!er.response) {
        $vuesax.notify({
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
      $vuesax.notify({
        title: 'خطا',
        text: validStatus.msg,
        color: 'danger',
        icon: 'error',
        position: 'top-right'
      })
    })
}

const loadedContent = (status) => {
  loaded.value = status
  emit('loaded', status)
}

const deleteUser = (userId, fullName) => {
  $vuesax.dialog({
    type: 'confirm',
    color: 'warning',
    title: `هشدار`,
    acceptText: 'حدف شود',
    cancelText: 'خیر',
    text: `آیا میخواهید کاربر ${fullName} را حدف نمایید ؟`,
    accept: () => {
      deleteUserReq(userId)
    }
  })
}

const deleteUserReq = (userId) => {
  store.dispatch('setTokenHeadder')
  axios
    .delete(`/users/${userId}`)
    .then((response) => {
      let validStatus = checkStatus(response.data, response.status)
      if (validStatus.status) {
        $vuesax.notify({
          title: 'اطلاع رسانی',
          text: validStatus.msg,
          color: 'success',
          icon: 'verified_use',
          position: 'top-right'
        })
        read_all_users()
      }
    })
    .catch((er) => {
      if (!er.response) {
        $vuesax.notify({
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
      $vuesax.notify({
        title: 'خطا',
        text: validStatus.msg,
        color: 'danger',
        icon: 'error',
        position: 'top-right'
      })
    })
}

const headerTable = ref([
  {
    headText: 'نام و نام خانوادگی',
    minshow: true
  },
  {
    headText: 'کدملی',
    minshow: true
  },
  {
    headText: 'واحد سازمانی',
    minshow: true
  },
  {
    headText: 'تلفن همراه',
    minshow: true
  },
  {
    headText: 'استان',
    minshow: true
  },
  {
    headText: 'تاریخ ثبت نام',
    minshow: true
  },
  {
    headText: 'عملیات',
    minshow: true
  }
])

defineExpose({
  read_all_users
})

onMounted(() => read_all_users());
</script>
<template>
  <BaseTable @reload="read_all_users()" v-if="loaded" noDataText="کاربری پیدا نشد" :max_show_row="10"
    :head_data="headerTable" :main_data="users" v-slot="props">
    <vs-td>{{ props.dataitem.fullName }}</vs-td>
    <vs-td>{{ props.dataitem.nationalCode }}</vs-td>
    <vs-td>{{ props.dataitem.organizationalPosition }}</vs-td>
    <vs-td>{{ props.dataitem.phoneNumber }}</vs-td>
    <vs-td>{{ props.dataitem.city }}</vs-td>
    <vs-td>{{ toSolar(props.dataitem.createdAt) }}</vs-td>
    <vs-td>
      <div class="flex justify-center">
        <vs-tooltip color="#139e93" text="ویرایش کاربر" position="right">
          <PencilSquareIcon @click="props.userModal(props.dataitem)" class="w-5 h-5 cursor-pointer ml-2" />
        </vs-tooltip>
        <vs-tooltip color="#139e93" text="حذف کاربر" position="left">
          <TrashIcon @click="deleteUser(props.dataitem._id, props.dataitem.fullName)"
            class="w-5 h-5 cursor-pointer text-red-600" />
        </vs-tooltip>
      </div>
    </vs-td>
  </BaseTable>
</template>

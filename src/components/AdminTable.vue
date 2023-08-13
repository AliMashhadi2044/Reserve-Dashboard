<script setup>
import axios from 'axios'
import { inject, onMounted, ref } from 'vue'
import BaseTable from '../components/BaseTable.vue'
import { toSolar } from '../assets/js/init'
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import store from '../store'
import { useRouter } from 'vue-router'
import { checkStatus } from '../assets/js/_erHandler'
let $vuesax = inject("$vs")
let router = useRouter()

const emit = defineEmits(['loaded'])
let loaded = ref(false)

let admins = ref([])

const read_all_admins = () => {
  axios
    .get('/admins')
    .then((response) => {
      if (response.status === 200 && response.data.msgCode === 200) {
        admins.value = response.data.data.filter(item => {
          return store.state.userInfo.id != item._id
        })
        loadedContent(true)
      }
      else throw response
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

defineExpose({
  read_all_admins
})

const loadedContent = (status) => {
  loaded.value = status
  emit('loaded', status)
}

const deleteAdmin = (adminId, fullName) => {
  $vuesax.dialog({
    type: 'confirm',
    color: 'warning',
    title: `هشدار`,
    acceptText: 'حدف شود',
    cancelText: 'خیر',
    text: `آیا میخواهید  ${fullName} را حدف نمایید ؟`,
    accept: () => {
      deleteAdminReq(adminId)
    }
  })
}

const deleteAdminReq = (adminId) => {
  store.dispatch('setTokenHeadder')
  axios
    .delete(`/admins/${adminId}`)
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
        read_all_admins()
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
    headText: 'ایمیل',
    minshow: true
  },
  {
    headText: 'سطح دسترسی',
    minshow: true
  },
  {
    headText: 'تاریخ ایجاد',
    minshow: true
  },
  {
    headText: 'عملیات',
    minshow: true
  }
])

onMounted(() => read_all_admins());
</script>
<template>
  <BaseTable @reload="read_all_admins()" v-if="loaded" noDataText="ادیمینی پیدا نشد" :max_show_row="10"
    :head_data="headerTable" :main_data="admins" v-slot="props">
    <vs-td>{{ props.dataitem.fullName }}</vs-td>
    <vs-td>{{ props.dataitem.email }}</vs-td>
    <vs-td class="text-center"> <span class="bg-green-600 rounded-full px-5 py-1 text-white shadow">
        {{ props.dataitem.role == 'SUPER_ADMIN' ? 'مدیر کل' : 'مدیر' }}
      </span></vs-td>
    <vs-td>{{ toSolar(props.dataitem.createdAt) }}</vs-td>
    <vs-td>
      <div class="flex justify-center">
        <vs-tooltip :color="props.dataitem.role == 'SUPER_ADMIN' ? '#ff4757' : '#139e93'"
          :text="props.dataitem.role == 'SUPER_ADMIN' ? 'عدم دسترسی' : 'ویرایش ادمین'" position="right">
          <button :disabled="props.dataitem.role == 'SUPER_ADMIN'" @click="props.adminModal(props.dataitem)">
            <PencilSquareIcon class="w-5 h-5 cursor-pointer ml-2" />
          </button>
        </vs-tooltip>
        <vs-tooltip :color="props.dataitem.role == 'SUPER_ADMIN' ? '#ff4757' : '#139e93'"
          :text="props.dataitem.role == 'SUPER_ADMIN' ? 'عدم دسترسی' : 'حذف ادمین'" position="left">
          <button :disabled="props.dataitem.role == 'SUPER_ADMIN'"
            @click="deleteAdmin(props.dataitem._id, props.dataitem.fullName)">
            <TrashIcon class="w-5 h-5 cursor-pointer text-red-600" />
          </button>
        </vs-tooltip>
      </div>
    </vs-td>
  </BaseTable>
</template>

<script setup>
import axios from 'axios'
import { inject, onMounted, ref } from 'vue'
import BaseTable from '../components/BaseTable.vue'
import { toSolar } from '../assets/js/init'
import { InformationCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import router from '../router'
import store from '../store'
import { checkStatus } from '../assets/js/_erHandler'

const emit = defineEmits(['loaded'])

let loaded = ref(false)
let $vuesax = inject("$vs")

let suites = ref([])
const read_all_suites = () => {
  axios
    .get('/suites')
    .then((response) => {
      if (response.status === 200 && response.data.msgCode === 200) {
        suites.value = response.data.data
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

const loadedContent = (status) => {
  loaded.value = status
  emit('loaded', status)
}

const deleteSuite = (suiteId, title) => {
  $vuesax.dialog({
    type: 'confirm',
    color: 'warning',
    title: `هشدار`,
    acceptText: 'حدف شود',
    cancelText: 'خیر',
    text: `آیا میخواهید  ${title} را حدف نمایید ؟`,
    accept: () => {
      deleteSuiteReq(suiteId)
    }
  })
}

const deleteSuiteReq = (suiteId) => {
  store.dispatch('setTokenHeadder')
  axios
    .delete(`/suites/${suiteId}`)
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
        read_all_suites()
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

defineExpose({
  read_all_suites
})

const headerTable = ref([
  {
    headText: 'عنوان اتاق',
    minshow: true
  },
  {
    headText: 'شماره اتاق',
    minshow: true
  },
  {
    headText: 'تعداد تخت',
    minshow: true
  },
  {
    headText: 'متراژ اتاق',
    minshow: true
  },
  {
    headText: 'تاریخ ثبت',
    minshow: true
  },
  {
    headText: 'امکانات',
    minshow: true
  },
  {
    headText: 'عملیات',
    minshow: true
  }
])

onMounted(() => read_all_suites());
</script>
<template>
  <BaseTable @reload="read_all_suites()" v-if="loaded" noDataText="سوئیتی پیدا نشد" :max_show_row="10"
    :head_data="headerTable" :main_data="suites" v-slot="props">
    <vs-td>{{ props.dataitem.title }}</vs-td>
    <vs-td>{{ props.dataitem.roomNumber }}</vs-td>
    <vs-td> {{ props.dataitem.totalBeds }} تخته </vs-td>
    <vs-td> {{ props.dataitem.Meterage }} متر </vs-td>
    <vs-td>{{ toSolar(props.dataitem.createdAt) }}</vs-td>
    <vs-td>
      <vs-tooltip title="امکانات" color="#139e93" :text="props.dataitem.facilities">
        <InformationCircleIcon class="w-5 h-5 cursor-pointer mx-auto" />
      </vs-tooltip>
    </vs-td>
    <vs-td>
      <div class="flex justify-center">
        <vs-tooltip color="#139e93" text="ویرایش سوئیت" position="right">
          <PencilSquareIcon @click="props.suiteModal(props.dataitem)" class="w-5 h-5 cursor-pointer ml-2" />
        </vs-tooltip>
        <vs-tooltip color="#139e93" text="حذف سوئیت" position="left">
          <TrashIcon @click="deleteSuite(props.dataitem._id, props.dataitem.title)"
            class="w-5 h-5 cursor-pointer text-red-600" />
        </vs-tooltip>
      </div>
    </vs-td>
  </BaseTable>
</template>

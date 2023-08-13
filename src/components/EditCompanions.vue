<script setup>
import { inject, onMounted, ref } from 'vue'
import { getCompanionsById, setCompanionsDefault } from '../assets/js/init'
import { TrashIcon } from '@heroicons/vue/24/outline'
import store from '../store'
import axios from 'axios'
import { checkStatus } from '../assets/js/_erHandler'
import { useRouter } from 'vue-router'
let $vuesax = inject("$vs")
let router = useRouter()
let emit = defineEmits(['reloadData', 'closeModal'])

let prop = defineProps({
  data: {
    type: Object,
    required: true
  }
})

let selectedCompanions = ref([])
let companions = ref([])
let allCompanions = ref([])

const getAllCompanions = () => {
  store.dispatch('setTokenHeadder')
  axios
    .get(`/travel-companions`)
    .then((response) => {
      let validStatus = checkStatus(response.data, response.status)
      if (validStatus.status) {
        allCompanions.value = getCompanionsById(response.data.data, prop.data.user._id)
        setOldCompanions()
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

const setOldCompanions = () => {
  selectedCompanions.value = setCompanionsDefault(allCompanions.value, prop.data.travelCompanions)
}

const updateCompanions = () => {
  store.dispatch('setTokenHeadder')
  axios
    .put(`/reserves/${prop.data._id}`, {
      "user": prop.data.user._id,
      "travelCompanions": selectedCompanions.value.map(item => item._id)
    })
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
        emit('reloadData')
        emit('closeModal')
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

const addnewCompanions = (vuesax) => {
  if (companions.value.length <= 0) {
    vuesax.notify({
      title: 'هشدار',
      text: 'لطفا همراهی را انتخاب نمایید.',
      color: 'warning',
      icon: 'error',
      position: 'top-right'
    })
    return false
  }
  if (selectedCompanions.value.find((item) => item._id == companions.value._id)) {
    vuesax.notify({
      title: 'هشدار',
      text: 'همراه انتخاب شده قبلا به مسافران اضافه شده',
      color: 'warning',
      icon: 'error',
      position: 'top-right'
    })
  } else {
    selectedCompanions.value.push(companions.value)
  }
}

const deleteFromList = (id) => {
  const objWithIdIndex = selectedCompanions.value.findIndex((obj) => obj._id === id)
  selectedCompanions.value.splice(objWithIdIndex, 1)
}

onMounted(() => {
  getAllCompanions()
});
</script>
<template>
  <div>
    <div class="flex items-end justify-between">
      <vs-select class="selectExample" val-icon-danger="close" label="همراهان :" v-model="companions">
        <vs-select-item modelValue="" text="انتخاب کنید ..." />
        <vs-select-item :key="item._id" :modelValue="item" :text="`${item.fullName} (${item.familyRelationship})`"
          v-for="item in allCompanions" />
      </vs-select>

      <div>
        <vs-button @click="addnewCompanions($vs)" type="filled">
          <span class="block my-[3px] whitespace-nowrap">افزودن به همراهان سفر</span>
        </vs-button>
      </div>
    </div>
    <div class="companionsTable flex flex-wrap w-full justify-center mt-6">
      <table class="w-full text-center border">
        <thead>
          <tr>
            <th class="p-2 text-center">نام و نام خانوادگی</th>
            <th class="p-2 text-center">کد ملی</th>
            <th class="p-2 text-center">نسبت</th>
            <th class="p-2 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody v-if="selectedCompanions.length > 0">
          <tr v-for="item in selectedCompanions" :key="item">
            <td class="p-2 border">{{ item?.fullName }}</td>
            <td class="p-2 border">{{ item?.nationalCode }}</td>
            <td class="p-2 border">{{ item?.familyRelationship }}</td>
            <td class="p-2 border">
              <TrashIcon @click="deleteFromList(item._id)" class="cursor-pointer w-5 h-5 text-red-600 mx-auto" />
            </td>
          </tr>
        </tbody>
        <tbody v-if="selectedCompanions.length == 0">
          <tr>
            <td class="p-2 border" colspan="4">همراهی انتخاب نشده است.</td>
          </tr>
        </tbody>
      </table>
      <vs-divider />
      <div class="w-full flex justify-end">
        <vs-button @click="updateCompanions" color="success" type="filled"><span class="block my-1">ثبت نهایی
            همراهان</span></vs-button>
      </div>
    </div>
  </div>
</template>

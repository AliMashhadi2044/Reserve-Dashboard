<script setup>
import ReportTable from '../components/ReportTable.vue'
import { ArrowPathIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import { onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import PersianDatePicker from 'vue3-persian-datetime-picker'

// let isActivePopup = ref(false)
let loadTable = ref(false)

const users = ref([])
const suites = ref([])

const filters = reactive({
  userId: '',
  suiteId: '',
  startDate: '',
  endDate: ''
})

let filterActive = ref()

const getAllUsers = () => {
  axios
    .get('/users')
    .then((response) => {
      if (response.status === 200 && response.data.msgCode === 200)
        setTimeout(() => {
          users.value = response.data.data
        }, 1000)
      else throw response
    })
    .catch((er) => {
      console.log(er)
    })
}

const getAllSuites = () => {
  axios
    .get('/suites')
    .then((response) => {
      if (response.status === 200 && response.data.msgCode === 200)
        setTimeout(() => {
          suites.value = response.data.data
        }, 1000)
      else throw response
    })
    .catch((er) => {
      console.log(er)
    })
}

onMounted(() => {
  getAllUsers()
  getAllSuites()
});
</script>
<template>
  <div class="p-10">
    <div class="w-full bg-white rounded-md shadow-md p-4">
      <div class="flex justify-between mb-10">
        <div class="flex w-full justify-between flex-col-reverse md:flex-row">
          <div class="flex w-full md:space-x-4 md:space-x-reverse space-x-0 flex-col md:flex-row mt-5 md:mt-0">
            <div class="w-full">
              <vs-select class="selectExample !w-full" val-icon-danger="close" label="کاربر :" v-model="filters.userId">
                <vs-select-item modelValue="" text="انتخاب کنید ..." />
                <vs-select-item :key="item._id" :modelValue="item._id" :text="item.fullName" v-for="item in users" />
              </vs-select>
            </div>
            <div class="w-full">
              <vs-select class="selectExample !w-full" val-icon-danger="close" label="سوئیت :" v-model="filters.suiteId">
                <vs-select-item modelValue="" text="انتخاب کنید ..." />
                <vs-select-item :key="item._id" :modelValue="item._id" :text="item.title" v-for="item in suites" />
              </vs-select>
            </div>
            <div class="w-full">
              <label for="" class="text-xs block text-black/70 mb-2 mt-1">تاریخ شروع :</label>
              <div class="relative">
                <div class="absolute left-2 top-1/2 -translate-y-1/2 z-50">
                  <XCircleIcon class="w-5 h-5 cursor-pointer hover:text-red-600" @click="filters.startDate = ''" />
                </div>
                <PersianDatePicker format="YYYY-MM-DD" display-format="jYYYY/jMM/jDD" v-model="filters.startDate">
                </PersianDatePicker>
              </div>
            </div>
            <div class="w-full">
              <label for="" class="text-xs block text-black/70 mb-2 mt-1">تاریخ پایان :</label>
              <div class="relative">
                <div class="absolute left-2 top-1/2 -translate-y-1/2 z-50">
                  <XCircleIcon class="w-5 h-5 cursor-pointer hover:text-red-600" @click="filters.endDate = ''" />
                </div>
                <PersianDatePicker format="YYYY/MM/DD" display-format="jYYYY/jMM/jDD" v-model="filters.endDate">
                </PersianDatePicker>
              </div>
            </div>
            <div class="flex items-end w-full mt-5 md:mt-0">
              <vs-button @click="filterActive.read_all_rezerves()" color="primary" type="filled"><span
                  class="block my-1">اعمال
                  فیلتر</span></vs-button>
            </div>
          </div>
          <div>
            <vs-tooltip color="#139e93" text="به روز رسانی اطلاعات" position="right">
              <vs-button color="dark" class="flex items-center ml-2">
                <ArrowPathIcon class="w-5 h-5 my-1" />
              </vs-button>
            </vs-tooltip>
          </div>
        </div>
        <div v-if="!loadTable" class="w-10">
          <div class="dbl-spinner"></div>
          <div class="dbl-spinner"></div>
        </div>
      </div>
      <ReportTable :filterItems="filters" ref="filterActive" @loaded="(flag) => (loadTable = flag)" />
    </div>
  </div>
</template>

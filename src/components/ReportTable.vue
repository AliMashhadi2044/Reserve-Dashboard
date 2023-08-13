<script setup>
import axios from 'axios'
import { inject, onMounted, ref } from 'vue'
import BaseTable from '../components/BaseTable.vue'
import { toSolar, numToChar } from '../assets/js/init'
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import store from '../store'
import { useRouter } from 'vue-router'
import { checkStatus } from '../assets/js/_erHandler'
let $vuesax = inject("$vs")
let router = useRouter()

const emit = defineEmits(['loaded', 'reloadData'])
let loaded = ref(false);

let props = defineProps({
  filterItems: {
    type: Object,
    required: false,
  }
})


let rezerves = ref([])

const createURL = () => {
  let base = '';
  let filterObj = props.filterItems;
  let checkPropEmpty = Object.keys(filterObj).length === 0;
  if (!checkPropEmpty) {
    Object.entries(filterObj).forEach((filter) => {
      (filter[1]) && (base += `${!base ? '?' : '&'}${filter[0]}=${filter[1]}`)
    })
  }
  return `/reserves${base}`
}


const read_all_rezerves = () => {
  axios
    .get(createURL())
    .then((response) => {
      if (response.status === 200 && response.data.msgCode === 200) {
        rezerves.value = response.data.data
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

defineExpose({ read_all_rezerves });

const loadedContent = (status) => {
  loaded.value = status
  emit('loaded', status)
}

const deleteSuite = (rezerveId) => {
  console.log(rezerveId)
}

const headerTable = ref([
  {
    headText: 'نام و نام خانوادگی',
    minshow: true
  },
  {
    headText: 'سوئیت',
    minshow: true
  },
  {
    headText: 'تاریخ شروع',
    minshow: true
  },
  {
    headText: 'تاریخ پایان',
    minshow: true
  },
  {
    headText: 'تعداد همراهان',
    minshow: true
  },
  {
    headText: 'تاریخ ثبت',
    minshow: true
  },
  {
    headText: 'عملیات',
    minshow: true
  }
])

onMounted(() => read_all_rezerves());
</script>
<template>
  <BaseTable @reloadData="read_all_rezerves" v-if="loaded" noDataText="رزروی پیدا نشد" :max_show_row="10"
    :head_data="headerTable" :main_data="rezerves" v-slot="props">
    <vs-td>{{ props.dataitem.user?.fullName ?? 'شخصی پیدا نشد' }}</vs-td>
    <vs-td>{{ props.dataitem.suite?.title ?? 'سوئیتی پیدا نشد' }}</vs-td>
    <vs-td> {{ toSolar(props.dataitem.startDate) }}</vs-td>
    <vs-td> {{ toSolar(props.dataitem.endDate) }}</vs-td>
    <vs-td>{{ numToChar(props.dataitem.travelCompanions.length) }} نفر </vs-td>
    <vs-td>{{ toSolar(props.dataitem.createdAt) }}</vs-td>
    <vs-td>
      <div class="flex justify-center">
        <vs-tooltip color="#139e93" text="اطلاعات کامل رزرو" position="right">
          <PencilSquareIcon @click="props.reservesModal(props.dataitem)" class="w-5 h-5 cursor-pointer ml-2" />
        </vs-tooltip>
        <vs-tooltip color="#139e93" text="لغو رزرو" position="left">
          <TrashIcon @click="deleteSuite(props.dataitem._id)" class="w-5 h-5 cursor-pointer text-red-600" />
        </vs-tooltip>
      </div>
    </vs-td>
  </BaseTable>
</template>

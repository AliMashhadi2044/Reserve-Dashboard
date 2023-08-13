<script setup>
import { reactive, ref } from 'vue'
import AddUser from './AddUser.vue'
import AddSuite from './AddSuite.vue'
import ShowReserve from './ShowReserve.vue'
import AddAdmin from '../components/AddAdmin.vue'

defineEmits(['reload', 'reloadData'])

defineProps({
  max_show_row: {
    required: false,
    type: Number,
    default: 5
  },
  head_data: {
    required: true,
    type: [Object, Array]
  },
  main_data: {
    required: true,
    type: [Object, Array]
  },
  multiple: {
    required: false,
    type: Boolean,
    default: false
  },
  noDataText: {
    required: false,
    type: String,
    default: 'آیتمی پیدا نشد'
  }
})

const isModal = reactive({
  user: false,
  suite: false,
  reserve: false,
  admin: false
})

const modalData = reactive({
  userInfo: [],
  suiteInfo: [],
  reserveInfo: [],
  adminInfo: []
})

const userHandler = (data) => {
  isModal.user = true
  modalData.userInfo = data
}

const suiteHandler = (data) => {
  isModal.suite = true
  modalData.suiteInfo = data
}

const reservesHandler = (data) => {
  isModal.reserve = true
  modalData.reserveInfo = data
}

const adminHandler = (data) => {
  isModal.admin = true
  modalData.adminInfo = data
};

const selected = ref([]);

// let selectedItems = ref([]);
</script>
<template>
  <div class="dark:!text-white ">
    <vs-table stripe pagination :max-items="max_show_row" :data="main_data" v-model="selected" :multiple="multiple"
      :noDataText="noDataText">
      <template #thead>
        <vs-th class="whitespace-nowrap" v-for="(header, index) in head_data.filter((item) => item.minshow)" :key="index">
          {{ header.headText }}
        </vs-th>
      </template>
      <template v-slot="{ data }">
        <vs-tr :data="tr" class="border-t border-[#dfe2e5] whitespace-nowrap" :key="indextr"
          v-for="(tr, indextr) in data">
          <slot :dataitem="data[indextr]" :reservesModal="reservesHandler" :suiteModal="suiteHandler"
            :userModal="userHandler" :adminModal="adminHandler">
          </slot>
        </vs-tr>
      </template>
    </vs-table>
  </div>

  <!-- <vs-table stripe pagination :noDataText="noDataText" :max-items="max_show_row" :data="main_data" :multiple="multiple">
    <template #thead>
      <vs-th v-for="(value, index) in 7" :key="index">{{ value }}</vs-th> -->

  <!-- <vs-th class="whitespace-nowrap" v-for="(header, index) in head_data.filter((item) => item.minshow)" :key="index">
        {{ header.headText }}
      </vs-th> -->
  <!-- </template>
    <template v-slot="{ data }">
      <transition-group name="fade"> -->
  <!-- <vs-tr :data="tr" class="border-t border-[#dfe2e5] whitespace-nowrap" :key="indextr"
          v-for="(tr, indextr) in data">
          <slot :dataitem="data[indextr]" :reservesModal="reservesHandler" :suiteModal="suiteHandler"
            :userModal="userHandler" :adminModal="adminHandler">
          </slot>
        </vs-tr> -->
  <!-- <vs-tr v-for="(value) in 3" :key="value">
          <vs-td :data="value" v-for="(value, index) in 7" :key="index">{{ value }}</vs-td>
        </vs-tr>
      </transition-group>
    </template> -->
  <!-- </vs-table> -->
  <vs-popup class="holamundo" title="ویراش کاربر" v-model:active="isModal.user">
    <AddUser @closeModal="isModal.user = false" @reloadData="$emit('reload')" :edit="true"
      :inputItems="{ ...modalData.userInfo }" btn_text="ویرایش" />
  </vs-popup>
  <vs-popup class="holamundo" title="ویراش کاربر" v-model:active="isModal.suite">
    <AddSuite @closeModal="isModal.suite = false" @reloadData="$emit('reload')" :edit="true"
      :inputItems="{ ...modalData.suiteInfo }" btn_text="ویرایش" />
  </vs-popup>
  <vs-popup class="holamundo" title="اطلاعات رزرو" v-model:active="isModal.reserve">
    <ShowReserve @reloadData="$emit('reloadData')" @closeModal="isModal.reserve = false" :edit="true"
      :inputItems="{ ...modalData.reserveInfo }" btn_text="ویرایش" />
  </vs-popup>
  <vs-popup class="holamundo" title="اطلاعات رزرو" v-model:active="isModal.admin">
    <AddAdmin @reloadData="$emit('reload')" @closeModal="isModal.admin = false" :edit="true"
      :inputItems="{ ...modalData.adminInfo }" btn_text="ویرایش" />
  </vs-popup>
</template>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.vs-con-tbody {
  overflow-x: scroll;
}
</style>

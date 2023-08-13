<script setup>
import { ref } from 'vue'
import AdminTable from '../components/AdminTable.vue'
import AddAdmin from '../components/AddAdmin.vue'
import EditAdmin from '../components/EditAdmin.vue'
// import jwt_decode from "jwt-decode";

let isActivePopup = ref(false)
let loadTable = ref(false);
const childComponentRef = ref();

</script>
<template>
  <div class="p-5 md:p-10" data-aos="fade-up">
    <div class="w-full bg-white rounded-md shadow-md p-4">
      <div class="px-3 flex flex-wrap w-full">
        <div class="w-full md:w-1/3">
          <div class="text-lg p-2 border-r-4 border-r-blue-600">اطلاعات حساب کاربری</div>
          <EditAdmin />
        </div>
        <div class="w-full md:w-2/3 flex flex-col">
          <div class="flex justify-between">
            <div class="text-lg p-2 border-r-4 border-r-blue-600">مدیریت ادمین ها</div>
            <div class="w-10">
              <div v-if="!loadTable" class="w-10">
                <div class="dbl-spinner"></div>
                <div class="dbl-spinner"></div>
              </div>
            </div>
          </div>
          <div class="flex my-5 space-x-4 justify-end space-x-reverse">
            <vs-button color="primary" @click="isActivePopup = true">افزودن ادمین</vs-button>
          </div>
          <div class="mx-5 h-full bg-[#fbfbfb]">
            <AdminTable ref="childComponentRef" @loaded="() => loadTable = true" />
          </div>
        </div>
        <vs-popup class="holamundo" title="افزودن ادمین" v-model:active="isActivePopup">
          <AddAdmin @reloadData="childComponentRef.read_all_admins()" @closeModal="isActivePopup = false" />
        </vs-popup>
      </div>
    </div>
  </div>
</template>

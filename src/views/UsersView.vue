<script setup>
import UsersTable from '../components/UsersTable.vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import AddUser from '../components/AddUser.vue'

let isActivePopup = ref(false)
let loadTable = ref(false)
const childComponentRef = ref();
</script>
<template>
  <div class="p-10">
    <div class="w-full bg-white rounded-md shadow-md p-4" data-aos="fade-up">
      <div class="flex justify-between mb-5">
        <div class="flex space-x-4 space-x-reverse">
          <vs-button color="primary" @click="isActivePopup = true">افزودن کاربر</vs-button>
          <vs-tooltip color="#139e93" text="به روز رسانی اطلاعات" position="left">
            <vs-button color="dark" class="flex items-center" @click="childComponentRef.read_all_users()">
              <ArrowPathIcon class="w-5 h-5 my-1" />
            </vs-button>
          </vs-tooltip>
        </div>
        <div v-if="!loadTable" class="w-10">
          <div class="dbl-spinner"></div>
          <div class="dbl-spinner"></div>
        </div>
      </div>
      <UsersTable ref="childComponentRef" @loaded="(flag) => (loadTable = flag)" />
    </div>
    <vs-popup class="holamundo" title="افزودن کاربر" v-model:active="isActivePopup">
      <AddUser @closeModal="isActivePopup = false" @reloadData="childComponentRef.read_all_users()" />
    </vs-popup>
  </div>
</template>

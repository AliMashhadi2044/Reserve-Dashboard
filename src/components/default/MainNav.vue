<script setup>
import { computed, ref } from "vue";
import { MagnifyingGlassIcon, ArrowLeftOnRectangleIcon, Bars3Icon, ChevronDoubleRightIcon } from "@heroicons/vue/24/outline"
import { _menu, changeMenu } from "@/assets/js/init.js"
import store from "../../store";
import { useRouter } from "vue-router";

let router = useRouter()

const navItems = ref([{
    text: "داشبورد",
    route: "/"
},
{
    text: "گزارش گیری",
    route: "/reports"
}])

let userInfo = computed(() => store.state.userInfo.fullName)
const logout = () => {
    store.commit('logout')
    router.push({ path: '/login' })
};

const serachInput = ref('');
</script>
<template>
    <div class="flex justify-between bg-white shadow-sm p-4">
        <div class="flex items-center space-x-4 space-x-reverse">
            <button @click="changeMenu" class="block lg:hidden">
                <Bars3Icon v-if="!_menu" class="w-6 h-6" />
                <ChevronDoubleRightIcon v-if="_menu" class="w-6 h-6" />
            </button>
            <ul class="flex space-x-2 space-x-reverse">
                <li v-for="(item, index) in navItems" :key="index">
                    <RouterLink :to="item.route">{{ item.text }}</RouterLink>
                </li>
            </ul>
            <div class="relative hidden lg:block">
                <vs-input class="serach_nav_input" v-model="serachInput" />
                <MagnifyingGlassIcon class="w-5 h-5 text-gray-500 absolute top-1/2 right-2 -translate-y-1/2" />
            </div>
        </div>
        <div class="flex items-center space-x-4 space-x-reverse">
            <div class="flex items-center">
                <img src="../../assets/img/default-profile.svg"
                    class="w-8 h-8 rounded-full border-2 border-blue-600 shadow ml-2" alt="">
                <span class="hidden lg:block">{{ userInfo }}</span>
            </div>
            <button @click="logout" class="text-red-600 flex">
                <ArrowLeftOnRectangleIcon class="w-6 h-6" />
                <span class="hidden lg:block">خروج از حساب</span>
            </button>
        </div>
    </div>
</template>
<style>
.serach_nav_input input {
    padding-right: 30px !important;
}
</style>
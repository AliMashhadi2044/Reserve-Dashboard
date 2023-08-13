<script setup>
import { Squares2X2Icon, UsersIcon, HomeModernIcon, ChartPieIcon, UserIcon } from "@heroicons/vue/24/outline";
import SildebarItem from "../SildebarItem.vue";
import { computed, ref } from "vue";
import { _menu, changeMenu } from "@/assets/js/init.js"

const menuItems = ref([
    { icon: Squares2X2Icon, title: "داشبورد", route: "/" },
    { icon: UsersIcon, title: "کاربران", route: "/users" },
    { icon: HomeModernIcon, title: "سوییت ها", route: "/suites" },
    { icon: UserIcon, title: "پروفایل", route: "/profile" },
    { icon: ChartPieIcon, title: "گزارش گیری", route: "/reports" },
]);


let active = computed(() => _menu.value);

</script>
<template>
    <div class="shadow-lg bg-white lg:mr-0 h-full pt-5 px-5 w-72 transition-all duration-700 fixed lg:static z-[99999]"
        :class="{ '-mr-80': !active }">
        <div class="flex items-center">
            <div class="w-full">
                <img src="@/assets/img/nosazi-logo.svg" class="w-full" alt="">
            </div>
        </div>
        <vs-divider />
        <div class="mt-10">
            <ul>
                <li v-for="(item, index) in menuItems" :key="index">
                    <SildebarItem :item="item" />
                </li>
            </ul>
        </div>
    </div>
    <div @click="changeMenu" class="w-full h-screen bg-gray-900/50 fixed  z-[99998] transition-all"
        :class="{ 'hidden opacity-0': !active }">
    </div>
</template>
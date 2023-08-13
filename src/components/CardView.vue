<script setup>
import { ref } from 'vue';
import StatusCard from '../components/StatusCard.vue';
import { HomeModernIcon, UserGroupIcon, ClipboardDocumentCheckIcon } from "@heroicons/vue/24/outline"

const cardData = ref([{
    theme: "bg-indigo-600",
    title: "تعداد کاربران ",
    value: "120",
    icon: UserGroupIcon
},
{
    theme: "bg-green-600",
    title: "تعداد سوئیت ها",
    value: "21",
    icon: HomeModernIcon
},
{
    theme: "bg-primary",
    title: "رزرو های ماه جاری",
    value: "23",
    icon: ClipboardDocumentCheckIcon
}, {
    theme: "bg-danger",
    title: "تعداد سوئیت ها",
    value: "23",
    icon: HomeModernIcon
}]);


</script>
<template>
    <div class="w-full p-4 sm:w-1/2 xl:w-1/4" v-for="(item, index) in cardData" :key="index">
        <StatusCard data-aos="zoom-in" :data="item" />
    </div>
</template>
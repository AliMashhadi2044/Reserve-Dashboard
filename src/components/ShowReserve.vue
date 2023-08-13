<script setup>
import { toSolar, numToChar } from '../assets/js/init';
import EditCompanions from "../components/EditCompanions.vue"
defineProps({
    inputItems: {
        type: Object,
        required: false,
    },
    edit: {
        type: Boolean,
        required: false
    },
    btn_text: {
        type: String,
        required: false,
        default: "افزودن"
    }
});

defineEmits(['reloadData'])

</script>
<template>
    <vs-tabs>
        <vs-tab :disabled="!inputItems.user" label="اطلاعات فردی">
            <div class="con-tab-ejemplo">
                <div class="flex flex-wrap">
                    <div class="w-1/2 p-3">
                        <span class="text-gray-700">نام و نام خانوادگی : </span>
                        <span class="font-medium"> {{ inputItems.user?.fullName ?? "پیدا نشد" }} </span>
                    </div>
                    <div class="w-1/2 p-3">
                        <span class="text-gray-700">کد ملی : </span>
                        <span class="font-medium"> {{ inputItems.user?.phoneNumber ?? "پیدا نشد" }} </span>
                    </div>
                    <div class="w-1/2 p-3">
                        <span class="text-gray-700">تلفن همراه : </span>
                        <span class="font-medium"> {{ inputItems.user?.nationalCode ?? "پیدا نشد" }} </span>
                    </div>
                    <div class="w-1/2 p-3">
                        <span class="text-gray-700">استان : </span>
                        <span class="font-medium"> {{ inputItems.user?.city ?? "پیدا نشد" }} </span>
                    </div>
                    <div class="w-1/2 p-3">
                        <span class="text-gray-700">واحد سازمانی : </span>
                        <span class="font-medium"> {{ inputItems.user?.organizationalPosition ?? "پیدا نشد" }} </span>
                    </div>
                    <div class="w-1/2 p-3">
                        <span class="text-gray-700">تاریخ ثبت نام : </span>
                        <span class="font-medium"> {{ toSolar(inputItems.user?.createdAt) ?? "پیدا نشد" }} </span>
                    </div>
                </div>
            </div>
        </vs-tab>
        <vs-tab label="اطلاعات رزرو">
            <div class="con-tab-ejemplo">
                <div class="flex flex-wrap">
                    <div class="w-1/2 p-3">
                        <span class="text-gray-700">تاریخ شروع : </span>
                        <span class="font-medium"> {{ toSolar(inputItems?.startDate) ?? "پیدا نشد" }} </span>
                    </div>
                    <div class="w-1/2 p-3">
                        <span class="text-gray-700">تاریخ پایان : </span>
                        <span class="font-medium"> {{ toSolar(inputItems?.endDate) ?? "پیدا نشد" }} </span>
                    </div>
                    <div class="w-1/2 p-3">
                        <span class="text-gray-700">تعداد همراهان : </span>
                        <span class="font-medium"> {{ numToChar(inputItems?.travelCompanions.length) ?? "پیدا نشد" }} نفر
                        </span>
                    </div>
                    <div class="w-1/2 p-3">
                        <span class="text-gray-700">تاریخ رزرو : </span>
                        <span class="font-medium"> {{ toSolar(inputItems?.createdAt) ?? "پیدا نشد" }} </span>
                    </div>
                </div>
            </div>
        </vs-tab>
        <vs-tab :disabled="!inputItems.suite" label="اطلاعات اتاق">
            <div class="con-tab-ejemplo">
                <div class="flex flex-wrap">
                    <div class="w-1/2 p-3">
                        <span class="text-gray-700">عنوان اتاق : </span>
                        <span class="font-medium"> {{ inputItems.suite?.title ?? "پیدا نشد" }} </span>
                    </div>
                    <div class="w-1/2 p-3">
                        <span class="text-gray-700">تعداد تخت : </span>
                        <span class="font-medium"> {{ inputItems.suite?.totalBeds ?? "پیدا نشد" }} </span>
                    </div>
                    <div class="w-1/2 p-3">
                        <span class="text-gray-700">شماره اتاق : </span>
                        <span class="font-medium"> {{ inputItems.suite?.roomNumber ?? "پیدا نشد" }} </span>
                    </div>
                    <div class="w-1/2 p-3">
                        <span class="text-gray-700">متراژ : </span>
                        <span class="font-medium"> {{ inputItems.suite?.Meterage ?? "پیدا نشد" }} </span>
                    </div>
                    <div class="w-full p-3">
                        <span class="text-gray-700">امکانات : </span>
                        <span class="font-medium"> {{ inputItems.suite?.facilities ?? "پیدا نشد" }} </span>
                    </div>
                </div>
            </div>
        </vs-tab>
        <vs-tab label="همراهان" :disabled="!inputItems.user">
            <div class="con-tab-ejemplo">
                <EditCompanions @reloadData="$emit('reloadData')" @closeModal="$emit('closeModal')" :data="inputItems" />
            </div>
        </vs-tab>
    </vs-tabs>
</template>
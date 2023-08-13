<script setup>
import { computed, inject, ref, watch } from "vue";
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import axios from "axios";
import store from "../store";
import { useRouter } from "vue-router";
import { checkStatus } from "../assets/js/_erHandler";
let $vuesax = inject("$vs")
let router = useRouter()

let emit = defineEmits(['reloadData', 'closeModal'])

let props = defineProps({
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
})

let suiteInfo = ref({
    title: "",
    totalBeds: 1,
    roomNumber: 1,
    facilities: "",
    Meterage: 1,
});

watch(() => props.inputItems, () => {
    suiteInfo.value = props.inputItems
})

const rules = computed(() => {
    return {
        title: {
            required: helpers.withMessage(
                ` عنوان اتاق را وارد نمایید.`,
                required
            ),
        },
        totalBeds: {
            required: helpers.withMessage(
                ` تعداد تخت را وارد نمایید.`,
                required
            )
        },
        roomNumber: {
            required: helpers.withMessage(
                ` شماره اتاق را وارد نمایید.`,
                required
            )
        },
        facilities: {
            required: helpers.withMessage(
                `امکانات را وارد نمایید.`,
                required
            ),
        },
        Meterage: {
            required: helpers.withMessage(
                ` متراژ اتاق را وارد نمایید.`,
                required
            ),
        },
    }
});

const v$ = useVuelidate(rules, suiteInfo);

const confirmRequest = async () => {
    let result = await v$.value.$validate()
    if (!result) return false
    props.edit ? updateSuite() : insertSuite()
};


const insertSuite = () => {
    console.log(suiteInfo.value);
    store.dispatch('setTokenHeadder')
    axios
        .post('/suites', {
            "title": suiteInfo.value.title,
            "totalBeds": +suiteInfo.value.totalBeds,
            "roomNumber": +suiteInfo.value.roomNumber,
            "facilities": suiteInfo.value.facilities,
            "Meterage": +suiteInfo.value.Meterage
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

const updateSuite = () => {
    let suiteId = props.inputItems._id
    store.dispatch('setTokenHeadder')
    axios
        .put(`/suites/${suiteId}`, {
            "title": suiteInfo.value.title,
            "totalBeds": +suiteInfo.value.totalBeds,
            "roomNumber": +suiteInfo.value.roomNumber,
            "facilities": suiteInfo.value.facilities,
            "Meterage": +suiteInfo.value.Meterage
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
};
</script>
<template>
    <div class="flex flex-wrap">
        <div class="w-full md:w-1/2 lg:w-1/4 p-2">
            <vs-input class="!w-full" val-icon-danger="close" label="عنوان اتاق :" v-model="suiteInfo.title"
                :danger="v$.title.$error" :danger-text="v$.title.$errors[0]?.$message" />
        </div>
        <div class="w-full md:w-1/2 lg:w-1/4 p-2">
            <label class="text-black/70">شماره اتاق :</label>
            <div class="w-fit mx-auto">
                <vs-input-number v-model="suiteInfo.roomNumber" :class="{ 'invalid-number': v$.roomNumber.$error }" />
                <div class="text-[.65rem] -mt-1 text-danger">{{ v$.roomNumber.$errors[0]?.$message }}</div>
            </div>
            <!-- <vs-input class="!w-full" val-icon-danger="close" v-model="" /> -->
        </div>
        <div class="w-full md:w-1/2 lg:w-1/4 p-2">
            <label class="text-black/70">تعداد تخت :</label>
            <div class="w-fit mx-auto">
                <vs-input-number min="1" max="12" v-model="suiteInfo.totalBeds"
                    :class="{ 'invalid-number': v$.totalBeds.$error }" />
                <div class="text-[.65rem] -mt-1 text-danger">{{ v$.totalBeds.$errors[0]?.$message }}</div>
            </div>
        </div>
        <div class="w-full md:w-1/2 lg:w-1/4 p-2">
            <label class="text-black/70">متراژ :</label>
            <div class="w-fit mx-auto">
                <vs-input-number min="1" max="200" v-model="suiteInfo.Meterage"
                    :class="{ 'invalid-number': v$.Meterage.$error }" />
                <div class="text-[.65rem] -mt-1 text-danger">{{ v$.Meterage.$errors[0]?.$message }}</div>
            </div>
        </div>
        <div class="w-full md:w-1/2 lg:w-full p-2">
            <vs-input class="!w-full" val-icon-danger="close" label="امکانات :" v-model="suiteInfo.facilities"
                :danger="v$.facilities.$error" :danger-text="v$.facilities.$errors[0]?.$message" />

        </div>
        <vs-divider />
        <div class="flex w-full justify-end">
            <vs-button @click="confirmRequest">{{ btn_text }}</vs-button>
        </div>
    </div>
</template>
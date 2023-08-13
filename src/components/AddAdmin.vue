<script setup>
import { computed, inject, ref, watch } from "vue";
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, email, sameAs, minLength } from '@vuelidate/validators'
import store from "../store";
import axios from "axios";
import { checkStatus } from "../assets/js/_erHandler";
import { useRouter } from "vue-router";

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

let adminInfo = ref({
    fullName: "",
    email: "",
    password: "",
    role: "ADMIN",
    confirmPassword: ""
});


watch(() => props.inputItems, () => {
    adminInfo.value = props.inputItems
})

const rules = computed(() => {
    return {
        fullName: {
            required: helpers.withMessage(
                ` لطفا نام کاربری را وارد نمایید.`,
                required
            ),
        },
        email: {
            required: helpers.withMessage(
                ` لطفا ایمیل خود را وارد نمایید.`,
                required
            ),
            minLength: helpers.withMessage(
                ` لطفا ایمیل را درست وارد نمایید.`,
                email
            )
        },
        password: {
            regex: helpers.withMessage(
                ` رمز عبور باید حداقل 6 رقم باشد.`,
                minLength(6)
            ),
        },
        confirmPassword: {
            sameAsPassword: helpers.withMessage(
                ` رمز عبور با تکرار آن برابر نیست.`,
                sameAs(adminInfo.value.password)
            ),
        },
    }
});

if (props.edit == false) {
    rules.value.password.required = helpers.withMessage(
        ` لطفا رمز عبور را وارد نمایید.`,
        required
    );

    rules.value.confirmPassword.required = helpers.withMessage(
        ` لطفا تکرار رمز عبور را وارد نمایید.`,
        required
    )
}


const v$ = useVuelidate(rules, adminInfo);


const confirmRequest = async () => {
    let result = await v$.value.$validate()
    if (!result) return false
    props.edit ? updateAdmins() : insertAdmins()
};


const insertAdmins = () => {
    store.dispatch('setTokenHeadder')
    axios
        .post('/admins', {
            fullName: adminInfo.value.fullName,
            email: adminInfo.value.email,
            password: adminInfo.value.password,
            role: "ADMIN",
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

let updateInfo = () => {
    let obj = {
        "fullName": adminInfo.value.fullName,
        "email": adminInfo.value.email,
        "role": "ADMIN",
    }
    if (adminInfo.value.password) {
        obj.password = adminInfo.value.password
    }
    return obj;
}

const updateAdmins = () => {
    let adminId = props.inputItems._id
    store.dispatch('setTokenHeadder')

    axios
        .put(`/admins/${adminId}`, updateInfo())
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
        <div class="w-full md:w-1/2 p-2">
            <vs-input class="!w-full" val-icon-danger="close" label="نام و نام خانوادگی :" v-model="adminInfo.fullName"
                :danger="v$.fullName.$error" :danger-text="v$.fullName.$errors[0]?.$message" />
        </div>
        <div class="w-full md:w-1/2  p-2">
            <vs-input class="!w-full" val-icon-danger="close" label="ایمیل :" v-model="adminInfo.email"
                :danger="v$.email.$error" :danger-text="v$.email.$errors[0]?.$message" />
        </div>
        <div class="w-full md:w-1/2  p-2">
            <vs-input class="!w-full" val-icon-danger="close" label="رمز عبور :" v-model="adminInfo.password"
                :danger="v$.password.$error" :danger-text="v$.password.$errors[0]?.$message" />
        </div>
        <div class="w-full md:w-1/2  p-2">
            <vs-input class="!w-full" val-icon-danger="close" label="تکرار عبور :" v-model="adminInfo.confirmPassword"
                :danger="v$.confirmPassword.$error" :danger-text="v$.confirmPassword.$errors[0]?.$message" />
        </div>
        <vs-divider />
        <div class="flex w-full justify-end">
            <vs-button @click="confirmRequest">{{ btn_text }}</vs-button>
        </div>
    </div>
</template>
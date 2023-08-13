<script setup>
import { useVuelidate } from '@vuelidate/core'
import { email, helpers, minLength, required, sameAs } from '@vuelidate/validators';
import axios from 'axios';
import { computed, inject, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router';
import { checkStatus } from '../assets/js/_erHandler';
import store from '../store';
let $vuesax = inject("$vs")
let router = useRouter()

const adminInfo = reactive({
    fullName: '',
    email: '',
    password: '',
    role: '',
    confirmPassword: ''
});

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
                ` رمز عبور باید حداقل 6 رقم  باشد.`,
                minLength(6)
            ),
        },
        confirmPassword: {
            sameAsPassword: helpers.withMessage(
                ` رمز عبور با تکرار آن برابر نیست.`,
                sameAs(adminInfo.password)
            ),
        },
    }
});

const v$ = useVuelidate(rules, adminInfo);

const submitForm = async () => {
    let result = await v$.value.$validate();
    if (!result) return false
    updateAdmins()
};

let updateInfo = () => {
    let obj = {
        "fullName": adminInfo.fullName,
        "email": adminInfo.email,
        "role": adminInfo.role,
    }
    if (adminInfo.password) {
        obj.password = adminInfo.password
    }
    return obj;
}

const updateAdmins = () => {
    let adminId = store.state.userInfo.id
    store.dispatch('setTokenHeadder')
    console.log(updateInfo());
    axios
        .put(`/admins/${adminId}`, updateInfo())
        .then((response) => {
            let validStatus = checkStatus(response.data, response.status)
            if (validStatus.status) {
                $vuesax.notify({
                    time: 4000,
                    title: 'اطلاع رسانی',
                    text: 'ادیمین گرامی شما تا چند لحظه دیگر از حساب خود خارج می شوید.',
                    color: 'success',
                    icon: 'query_builder',
                    position: 'top-right'
                })
                setTimeout(() => {
                    store.commit('logout')
                    router.push('/login')
                }, 4000)
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

const getAdminInfo = () => {
    let adminId = store.state.userInfo.id;
    axios
        .get(`/admins/${adminId}`)
        .then((response) => {
            let validStatus = checkStatus(response.data, response.status)
            if (validStatus.status) {
                adminInfo.fullName = response.data.data.fullName;
                adminInfo.email = response.data.data.email;
                adminInfo.role = response.data.data.role;
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

onMounted(() => {
    getAdminInfo()
});
</script>

<template>
    <form action="" autocomplete="false">
        <div class="mt-5 flex flex-wrap">
            <div class="w-full  p-3">
                <vs-input class="!w-full" val-icon-danger="close" :danger="v$.fullName.$error"
                    :danger-text="v$.fullName.$errors[0]?.$message" label="نام و نام خانوادگی"
                    v-model="adminInfo.fullName" />
            </div>
            <div class="w-full p-3">
                <vs-input class="!w-full" val-icon-danger="close" :danger="v$.email.$error"
                    :danger-text="v$.email.$errors[0]?.$message" label="ایمیل" v-model="adminInfo.email" />
            </div>
            <vs-divider position="left">
                اگر مایل به تغییر رمز عبور نیستید خالی بگزارید.
            </vs-divider>
            <div class="w-full xl:w-1/2 p-3">
                <vs-input type="password" val-icon-danger="close" :danger="v$.password.$error"
                    :danger-text="v$.password.$errors[0]?.$message" class="!w-full" label="رمز عبور"
                    v-model="adminInfo.password" />
            </div>
            <div class="w-full  xl:w-1/2  p-3">
                <vs-input type="password" val-icon-danger="close" :danger="v$.confirmPassword.$error"
                    :danger-text="v$.confirmPassword.$errors[0]?.$message" class="!w-full" label="تکرار رمز عبور"
                    v-model="adminInfo.confirmPassword" />
            </div>
            <div class="w-full  p-3">
                <vs-button @click="submitForm">ثبت ویرایش</vs-button>
            </div>
        </div>
    </form>
</template>
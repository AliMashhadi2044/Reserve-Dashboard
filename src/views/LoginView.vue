<script setup>
import VueWriter from 'vue-writer'
import LoginForm from "../components/LoginForm.vue";

</script>
<template>
    <div
        class="w-full h-screen relative flex justify-center md:justify-normal items-center bg-[#0e45d5] after:hidden md:after:block after:contents-[''] after:top-0 after:-z-0 after:absolute after:bg-white after:w-1/4 after:h-full">
        <div class="static md:absolute md:right-[25%] z-20 flex justify-center items-center flex-col-reverse md:flex-row ">
            <div>
                <LoginForm />
            </div>
            <div class="flex-grow flex items-center">
                <div class="w-max text-3xl text-white mr-0 md:-mr-32 xl:-mr-20">
                    <span class="block md:hidden">رزرو سوئیت استان قم </span>
                    <VueWriter class="hidden md:block" :array="['سامانه رزرو سوئیت استان قم']" />
                    <div class="h-1 rounded-lg bg-white w-20 mt-4"></div>
                    <span class="text-base">اداره کل نوسازی و تجهیز مدارس استان قم</span>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.cursor {
    background: #fff;
    margin: 0 4px;
    display: inline-block;
    width: 2px;
    animation: blink 0.7s linear infinite;
}

@keyframes blink {
    0% {
        opacity: 0;
    }

    50% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}
</style>
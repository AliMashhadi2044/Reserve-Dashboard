<script setup>
import MainNav from '../components/default/MainNav.vue'
import MainSildebar from '../components/default/MainSildebar.vue';
</script>

<template>
    <div class="flex">
        <div class=" border self-stretch">
            <MainSildebar />
        </div>
        <div class="w-full min-h-screen border">
            <MainNav />
            <RouterView />
            <!-- <div class="mt-auto">sdsd</div> -->
        </div>
    </div>
</template>

<style scoped></style>

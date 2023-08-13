<script setup>
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";
import { useRouter } from "vue-router"

let props = defineProps({
    item: {
        required: true
    },
})

const router = useRouter()

let menuActive = ref(false)

const openMenu = () => {
    if (props.item.child)
        menuActive.value = !menuActive.value
    else
        router.push({ path: props.item.route })
}

</script>
<template>
    <div @click="openMenu"
        class="flex flex-wrap cursor-pointer items-center space-x-4 transition-all p-2 rounded hover:bg-gray-100 space-x-reverse"
        :class="{ 'bg-primary hover:!bg-blue-600 text-white ': $route.fullPath == item.route }">
        <component :is="item.icon" class="w-5 h-5"></component>
        <span class="flex-grow">{{ item.title }}</span>
        <ChevronDownIcon v-if="item.child" :class="{ 'rotate-180': menuActive }" class="w-4 h-4 transition-all" />
    </div>
    <Transition name="fade">
        <div v-if="item.child && menuActive" class="w-full">
            <div @click="$router.push({ path: child.route })"
                class="flex cursor-pointer flex-wrap items-center space-x-4 transition-all p-2 mr-5 rounded hover:bg-gray-100 space-x-reverse"
                :class="{ 'bg-primary hover:!bg-blue-600 text-white ': $route.fullPath == child.route }"
                v-for="(child, index) in item.child " :key="index">
                <component :is="child.icon" class="w-5 h-5"></component>
                <span class="flex-grow">{{ child.title }}</span>
            </div>
        </div>
    </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: 0.8s;
    max-height: 500px;
}

.fade-enter-from,
.fade-leave-to {
    transition: 0.3s;
    max-height: 0px;
}
</style>
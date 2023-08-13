<script setup>
import { computed } from "vue"

let props = defineProps({
    data: {
        required: true
    }
})

const myTheme = computed(() => props.theme);
const item = computed(() => props.data);

</script>
<template>
    <div class="w-full flex justify-between rounded-md shadow-lg p-4" :class="item.theme">
        <div class="flex flex-col text-white items-center">
            <span class="font-semibold text-base">{{ item.title }}</span>
            <span class="font-semibold text-3xl p-4">{{ item.value }}</span>
        </div>
        <div class="flex items-center">
            <component class="w-16 h-16 text-white/70" :is="item.icon"></component>
        </div>
    </div>
</template>
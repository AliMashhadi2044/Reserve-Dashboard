<script setup>
import CardView from '../components/CardView.vue';
import ChartMonochrome from '../components/chart/ChartMonochrome.vue';
import ChartView from '../components/chart/ChartView.vue';
</script>

<template>
  <div class="flex flex-wrap p-4 md:p-10">
    <CardView />
    <div class="flex justify-between w-full flex-col lg:flex-row items-center">
      <div class="p-3 w-full lg:w-1/3 h-full">
        <div class="bg-white rounded-md shadow-md w-full h-full overflow-hidden">
          <div class="h-10 bg-slate-200 shadow-sm"></div>
          <div class="p-3 md:p-5">
            <ChartMonochrome />
          </div>
        </div>
      </div>
      <div class="p-3 w-full lg:w-2/3 h-full">
        <div class="bg-white rounded-md shadow-md w-full h-full overflow-hidden">
          <div class="h-10 bg-slate-200 shadow-sm"></div>
          <div class="p-3 md:p-5">
            <ChartView />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

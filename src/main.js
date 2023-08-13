import './style.css'
import 'vuesax3/dist/vuesax.css'
import 'animate.css'
import 'aos/dist/aos.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vuesax from 'vuesax3'
import AOS from 'aos'
import VueApexCharts from 'vue3-apexcharts'
import axios from 'axios'
import store from './store/index'

axios.defaults.baseURL = 'https://hungry-buck-nv69kpfte.iran.liara.run/api/v1'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(Vuesax, {
  rtl: true
})
app.use(AOS.init())
app.use(VueApexCharts)
app.mount('#app')

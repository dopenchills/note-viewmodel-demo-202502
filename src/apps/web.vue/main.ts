import 'src/apps/web.vue/assets/main.css'

import { createApp } from 'vue'
import App from 'src/apps/web.vue/App.vue'
import router from 'src/apps/web.vue/router'

const app = createApp(App)

app.use(router)

app.mount('#app')

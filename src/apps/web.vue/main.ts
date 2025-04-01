import 'src/apps/web.vue/assets/main.css'

import App from 'src/apps/web.vue/App.vue'
import router from 'src/apps/web.vue/router'
import { createApp } from 'vue'

const app = createApp(App)

app.use(router)

app.mount('#app')

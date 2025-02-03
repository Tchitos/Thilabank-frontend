import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import './assets/tailwind.css';
import "material-icons/iconfont/material-icons.css";
import { apiService } from './services/apiService';

const app = createApp(App);
app.use(router);

router.isReady().then(async () => {
  const currentRoute = router.currentRoute.value;

  if (currentRoute.path !== "/") {
    try {
      await apiService.get("/users/me");
    } catch (error) {
      if (currentRoute.path !== "/") {
        router.push("/");
      }
    }
  }

  app.mount("#app");
});

import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import { router } from "./router/router";
import { fireApp } from "./firebase";
const pinia = createPinia();
createApp(App).use(router).use(fireApp).use(pinia).mount("#app");

import { createApp } from "vue";
import "./styles/mug.scss";
import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import App from "./App.vue";
import { useBeverageStore } from "./stores/beverageStore";


const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedState);
app.use(pinia);

const store = useBeverageStore();

store.init().then(() => {
app.mount("#app");
});
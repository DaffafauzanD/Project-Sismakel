import './assets/main.css'
import './assets/sass/style.scss'

import { createApp } from "vue";
import { createPinia } from "pinia";
import { Tooltip } from "bootstrap";
import ui from "@nuxt/ui/vue-plugin";
import App from "./App.vue";

/*
TIP: To get started with clean router change path to @/router/clean.ts.
 */
import router from "./router";
import ElementPlus from "element-plus";
import i18n from "@/core/plugins/i18n";

//imports for app initialization
import ApiService from "@/core/services/ApiService";
import { initApexCharts } from "@/core/plugins/apexcharts";
import { initInlineSvg } from "@/core/plugins/inline-svg";
import { initVeeValidate } from "@/core/plugins/vee-validate";
import { initKtIcon } from "@/core/plugins/keenthemes";
import { syncNuxtUITheme } from "@/core/plugins/nuxt-ui-theme";

import "@/core/plugins/prismjs";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.use(ui);

ApiService.init(app);
initApexCharts(app);
initInlineSvg(app);
initKtIcon(app);
initVeeValidate();

// Initialize Nuxt UI theme sync
syncNuxtUITheme();

app.use(i18n);

app.directive("tooltip", (el) => {
  new Tooltip(el);
});

app.mount("#app");

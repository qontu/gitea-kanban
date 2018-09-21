import Vue from "vue";
import App from "./App.vue";
import VueKanban from "vue-kanban";

Vue.config.productionTip = false;
Vue.use(VueKanban);

new Vue({
  render: h => h(App),
}).$mount("#app");

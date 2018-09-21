import Vue from "vue";
import App from "./App.vue";
import vueKanban from "vue-kanban";

Vue.config.productionTip = false;
Vue.use(vueKanban);

new Vue({
  render: h => h(App),
}).$mount("#app");

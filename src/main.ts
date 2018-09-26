import Vue from "vue";
import App from "./App.vue";
import VueKanban from "vue-kanban";
import VueRouter from "vue-router";
Vue.config.productionTip = false;
Vue.use(VueKanban);
Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: "/:owner/:repo",
      component: App,
    },
  ],
});

new Vue({
  router,
}).$mount("#app");

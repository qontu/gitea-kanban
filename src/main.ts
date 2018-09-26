import Vue from "vue";
import App from "./App.vue";
import ListRepos from "./components/ListRepos.vue";
import ShowKanban from "./components/ShowKanban.vue";

import VueKanban from "vue-kanban";
import VueRouter from "vue-router";
import Vuesax from "vuesax";

import "vuesax/dist/vuesax.css";
import "material-icons/iconfont/material-icons.css";

Vue.config.productionTip = false;
Vue.use(VueKanban);
Vue.use(VueRouter);
Vue.use(Vuesax);

const router = new VueRouter({
  routes: [
    {
      path: "/",
      component: App,
      children: [
        {
          path: "",
          component: ListRepos,
          props: true,
        },
        {
          path: "/:owner/:repo",
          component: ShowKanban,
          props: true,
        },
      ],
    },
  ],
});

new Vue({
  router,
}).$mount("#app");

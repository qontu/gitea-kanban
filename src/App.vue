<template>
  <div id="app" ref="app">
    <h1 class="error" v-if="error">{{ error }}</h1>
    <div id="cover-spin" v-if="isLoading">
      <atom-spinner
          :animation-duration="1000"
          :size="100"
          :color="'#ff1d5e'"
      />
    </div>
    <router-view v-if="config" :config="config"
    @error="onError($event)" @loading="setLoading($event)"></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AtomSpinner } from "epic-spinners";
import { oneLine } from "common-tags";
import GiteaKanban from "./components/GiteaKanban.vue";

import { GiteaClient, GiteaClientConfig } from "./services/gitea-client.service";
import { HttpService } from "./services/http.service";

@Component({
  components: {
    AtomSpinner,
  },
})
export default class App extends Vue {
  private isLoading: boolean = true;
  private config: GiteaClientConfig = null;
  private error = "";

  async beforeCreate() {
    try {
      this.config = await new HttpService().get<GiteaClientConfig>("gitea.config.json");
    } catch (error) {
      this.onError({ message: "Error fetching config", context: error });
    }
  }

  setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  onError({ message, context }: { message: string; context: Error }) {
    console.error(context);
    this.error = message;
    this.setLoading(false);
  }
}
</script>

<style lang="scss">
.error {
  background-color: red;
  text-align: center;
}

#cover-spin {
  position: fixed;
  width: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(29, 25, 25, 0.7);
  z-index: 9998;
}

.atom-spinner {
  z-index: 9999;
  display: block;
  position: absolute;
  left: 48%;
  top: 40%;
  width: 40px;
  height: 40px;
}

* {
  box-sizing: border-box;
}
body {
  background: #33363d;
  color: #fff;
  font-family: Lato;
  font-weight: 300;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
.section {
  padding: 20px;
  text-align: center;
}
.section a {
  color: #fff;
  text-decoration: none;
  font-weight: 300;
}
.section h4 {
  font-weight: 400;
}
.section h4 a {
  font-weight: 600;
}
</style>

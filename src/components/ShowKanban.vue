<template>
  <gitea-kanban v-if="_config"
  :baseUrl="_config.baseUrl" :owner="_config.repositoryOwner"
  :repo="_config.repositoryName" :token="_config.token"
  @loading="$emit('loading', $event)" @error="$emit('error', $event)"
  ></gitea-kanban>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { AtomSpinner } from "epic-spinners";
import { oneLine } from "common-tags";
import GiteaKanban from "./GiteaKanban.vue";

import { Config } from "../types";

import { GiteaClient, GiteaClientConfig } from "../services/gitea-client.service";
import { HttpService } from "../services/http.service";

@Component({
  components: {
    GiteaKanban,
  },
})
export default class ShowKanban extends Vue {
  @Prop({ required: true })
  private config: GiteaClientConfig;

  private _config: GiteaClientConfig = null;

  beforeCreate() {
    this.$emit("loading", true);
  }

  created() {
    this._config = {
      ...this.config,
      repositoryOwner: this.$route.params.owner,
      repositoryName: this.$route.params.repo,
    };
  }
}
</script>

<style lang="scss" scoped>
</style>

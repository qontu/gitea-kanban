<template>
   <vs-list>
      <vs-list-item v-for="repo in repos" :key="repo.name" :title="repo.full_name">
        <router-link :to="{path: `/${repo.owner.username}/${repo.name}`}">
          <vs-button color="info">Show kanban</vs-button>
        </router-link>
      </vs-list-item>
  </vs-list>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { AtomSpinner } from "epic-spinners";
import { oneLine } from "common-tags";

import { Config } from "../types";

import { GiteaClient, GiteaClientConfig } from "../services/gitea-client.service";
import { HttpService } from "../services/http.service";
import { Repository } from "src/models";

@Component({
  components: {},
})
export default class ListRepos extends Vue {
  @Prop({ required: true })
  private config: GiteaClientConfig;

  private client: GiteaClient;
  private isLoading: boolean = true;
  private repos: Repository[] = null;

  async beforeCreate() {
    this.$emit("loading", true);
  }

  async created() {
    try {
      this.client = new GiteaClient({
        token: this.config.token,
        baseUrl: this.config.baseUrl,
      });

      this.repos = await this.client.getRepos();
    } catch {
      this.$emit("error", "Error fetching repos of user");
    }
  }

  updated() {
    this.$emit("loading", false);
  }
}
</script>

<style lang="scss">
</style>

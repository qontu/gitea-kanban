<template>
  <div id="app">
<kanban-board :stages="stages" :blocks="blocks" @update-block="updateBlock">
    <div v-for="stage in stages" :slot="stage" :key="stage">
      <h2>{{ stage }}</h2>
    </div>
    <div v-for="block in blocks" :slot="block.id" :key="block.id">
      <div>
        <strong>id:</strong> {{ block.id }}
      </div>
      <div>
        {{ block.title }}
      </div>
  </div>
</kanban-board>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { GiteaClient } from "./services/gitea-client.service";
import giteaConfig from "./gitea.config.json";

@Component({
  components: {},
})
export default class App extends Vue {
  public stages = ["TODO", "BLOCKED", "WIP", "READY-TO-REVIEW", "DONE"];
  public labels = {
    "status/todo": {
      label: "status/todo",
      stage: "TODO",
      id: -1,
    },
    "status/blocked": {
      label: "status/blocked",
      stage: "BLOCKED",
      id: -1,
    },
    "status/in progress": {
      label: "status/todo",
      stage: "WIP",
      id: -1,
    },
    "status/needsReview": {
      label: "status/todo",
      stage: "READY-TO-REVIEW",
      id: -1,
    },
    "status/done": {
      label: "status/todo",
      stage: "DONE",
      id: -1,
    },
  };

  public blocks: any[] = [];
  private giteaClient: GiteaClient;

  constructor() {
    super();
    this.giteaClient = new GiteaClient(giteaConfig);
  }

  async created() {
    await this.loadIssues();
    await this.loadLabels();
  }

  async updateBlock(id: number, newStage: string) {
    const { statusID: oldLabelID } = this.blocks.find(({ id: _id }) => _id.toString() === id);
    const { id: newLabelID } = Object.values(this.labels).find(({ stage }) => stage === newStage);

    await Promise.all([this.giteaClient.deleteLabel(id, oldLabelID), this.giteaClient.addLabels(id, [newLabelID])]);

    setTimeout(this.loadIssues.bind(this));
  }

  private proccessIssues(issues: any[]) {
    this.blocks = issues
      .filter(issue => issue.labels && issue.labels.length > 0)
      .filter(issue => issue.labels.some(({ name }) => Object.keys(this.labels).includes(name)))
      .map(issue => ({ ...issue, kanban: issue.labels.find(({ name }) => Object.keys(this.labels).includes(name)) }))
      .map(({ number: id, title, kanban }) => ({
        id,
        title,
        status: this.labels[kanban.name].stage,
        statusID: kanban.id,
      }));
  }

  private async loadIssues() {
    const issues = await this.giteaClient.getIssues();
    console.log(issues);
    this.proccessIssues(issues);
  }

  private async loadLabels() {
    const labels = await this.giteaClient.getLabels();
    console.log(labels);
    labels.forEach(({ name, id }) => this.labels[name] && (this.labels[name].id = id));
  }
}
</script>

<style lang="scss">
@import "~vue-kanban/src/assets/kanban.scss";

ul.drag-inner-list,
ul.drag-list {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
.drag-container {
  max-width: 1000px;
  margin: 20px auto;
}
.drag-list {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
}
@media (max-width: 690px) {
  .drag-list {
    display: block;
  }
}
.drag-column {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  margin: 0 10px;
  position: relative;
  background: rgba(0, 0, 0, 0.2);
  overflow: hidden;
}
@media (max-width: 690px) {
  .drag-column {
    margin-bottom: 30px;
  }
}
.drag-column h2 {
  font-size: 0.8rem;
  margin: 0;
  text-transform: uppercase;
  font-weight: 600;
}
.drag-column-header {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 10px;
}
.drag-inner-list {
  min-height: 50px;
  color: #fff;
}
.drag-item {
  padding: 10px;
  margin: 10px;
  height: 100px;
  background: rgba(0, 0, 0, 0.4);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
.drag-item.is-moving {
  -webkit-transform: scale(1.5);
  transform: scale(1.5);
  background: rgba(0, 0, 0, 0.8);
}
.drag-header-more {
  cursor: pointer;
}
.drag-options {
  position: absolute;
  top: 44px;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 10px;
  -webkit-transform: translateX(100%);
  transform: translateX(100%);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
.drag-options.active {
  -webkit-transform: translateX(0);
  transform: translateX(0);
  opacity: 1;
}
.drag-options-label {
  display: block;
  margin: 0 0 5px;
}
.drag-options-label input {
  opacity: 0.6;
}
.drag-options-label span {
  display: inline-block;
  font-size: 0.9rem;
  font-weight: 400;
  margin-left: 5px;
}
.gu-mirror {
  position: fixed !important;
  margin: 0 !important;
  z-index: 9999 !important;
  opacity: 0.8;
  list-style-type: none;
}
.gu-hide {
  display: none !important;
}
.gu-unselectable {
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
}
.gu-transit {
  opacity: 0.2;
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
.drag-column-TODO .drag-column-header,
.drag-column-TODO .drag-options,
.drag-column-TODO .is-moved {
  background: #fb7d44;
}
.drag-column-BLOCKED .drag-column-header,
.drag-column-BLOCKED .drag-options,
.drag-column-BLOCKED .is-moved {
  background: #2a92bf;
}
.drag-column-WIP .drag-column-header,
.drag-column-WIP .drag-options,
.drag-column-WIP .is-moved {
  background: rgb(245, 18, 207);
}
.drag-column-READY-TO-REVIEW .drag-column-header,
.drag-column-READY-TO-REVIEW .drag-options,
.drag-column-READY-TO-REVIEW .is-moved {
  background: #f4ce46;
}
.drag-column-DONE .drag-column-header,
.drag-column-DONE .drag-options,
.drag-column-DONE .is-moved {
  background: #00b961;
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

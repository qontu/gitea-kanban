<template>
  <div ref="kanban">
    <kanban-board :stages="stageNames" :blocks="blocks" @update-block="updateBlock">
        <div v-for="stage in stageNames" :slot="stage" :key="stage">
          <h2>{{ stage }}</h2>
        </div>
        <div v-for="block in blocks" :slot="block.id" :key="block.id">
          <div>
            <strong>id:</strong> {{ block.id }}
          </div>
          <div>
            {{ block.title }}
          </div>
          <div v-if="block.closed">
            Closed!
          </div>
          <a :href="client.getLinkOfIssue(block.id)">Link</a>
      </div>
    </kanban-board>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { oneLine } from "common-tags";

import { Issue, StateType, Label } from "../models";
import { StageList, Stage, Config, Block } from "../types";

import { GiteaClient, GiteaClientConfig } from "../services/gitea-client.service";
import { HttpService } from "../services/http.service";

const fallbackConfig: Config = {
  stages: [
    {
      label: "status/todo",
      name: "TODO",
    },
    {
      label: "status/blocked",
      name: "BLOCKED",
    },
    {
      label: "status/in progress",
      name: "WIP",
    },
    {
      label: "status/needsReview",
      name: "READY-TO-REVIEW",
    },
    {
      label: "status/done",
      name: "DONE",
      isClosedStage: true,
    },
  ],
};

@Component({})
export default class GiteaKanban extends Vue {
  @Prop({ required: true })
  private token: string;
  @Prop({ required: true })
  private baseUrl: string;
  @Prop({ required: true })
  private owner: string;
  @Prop({ required: true })
  private repo: string;

  isLoading = false;
  stages: StageList = new StageList([{ name: "" } as Stage]);

  blocks: Block[] = [];
  private client: GiteaClient;
  private config: Config;
  private styles: HTMLStyleElement;

  get stageNames() {
    return this.stages.getStageNames();
  }

  constructor() {
    super();
  }

  async created() {
    this.client = new GiteaClient({
      token: this.token,
      baseUrl: this.baseUrl,
      repositoryOwner: this.owner,
      repositoryName: this.repo,
    });

    try {
      this.config = await this.loadConfig();
    } catch {
      console.error("Using fallback config!!");
      this.config = fallbackConfig;
    }
    try {
      this.stages = await this.fetchStages();

      this.setStyles();

      await this.loadIssues();
    } catch {
      this.$emit("error", "Error fetching labels or issues from gitea");
    }
  }

  mounted() {
    const kanban = this.$refs.kanban as Element;

    const styles = document.createElement("style");
    styles.type = "text/css";

    this.styles = styles;
    kanban.appendChild(this.styles);
  }

  updated() {
    this.$emit("loading", false);
  }

  async updateBlock(issueID: string, newStage: string) {
    this.$emit("loading", true);
    const block = this.getBlock(Number.parseInt(issueID, 10));
    const stage = this.stages.getStageByName(newStage);

    if (stage.isClosedStage) {
      await this.client.closeIssue(issueID as any);
      block.closed = true;
    } else if (block.closed) {
      await this.client.openIssue(issueID as any);
      block.closed = false;
    }

    await this.replaceLabelOfIssue(issueID as any, block.statusID, stage.id);
    this.updateStageOfBlock(block, stage);
    this.$emit("loading", false);
  }

  async replaceLabelOfIssue(issueID: number, oldLabelID: number, newLabelID: number) {
    await this.client.deleteLabel(issueID, oldLabelID);
    await this.client.addLabels(issueID, [newLabelID]);
  }

  updateStageOfBlock(block: Block, { name, id }: Stage) {
    block.status = name;
    block.statusID = id;
  }

  getBlock(id: number): Block {
    return this.blocks.find(({ id: _id }) => _id === id);
  }

  private setStyles(): void {
    this.styles.innerText = this.stages.get().reduce((styles, { name, color }) => {
      return oneLine`
      ${styles}

      .drag-column-${name} .drag-column-header,
      .drag-column-${name} .drag-options,
      .drag-column-${name} .is-moved {
        background: #${color};
      }`;
    }, "");
  }

  private proccessIssues(issues: Issue[]) {
    this.blocks = issues
      .map(issue => ({ ...issue, label: this.getLabelIfExistsOnStages(issue.labels) }))
      .filter(({ label }) => label)
      .map(({ title, state, number: id, label: { name, id: labelID } }) => ({
        id,
        title,
        closed: state === StateType.CLOSED,
        status: this.translateLabelNameToStage(name),
        statusID: labelID,
      }));
  }

  private getLabelIfExistsOnStages(labels: Label[]): Label | undefined {
    const labelNames = this.stages.getLabelNames();
    return labels.find(({ name }) => labelNames.includes(name));
  }

  private translateLabelNameToStage(labelName: string): string {
    return this.stages.getStageByLabel(labelName).name;
  }

  private async loadIssues() {
    const issues = await this.client.getAllIssues();
    console.log(issues);
    this.proccessIssues(issues);
  }

  private async fetchStages(): Promise<StageList> {
    const labels = await this.client.getLabels();
    const stages = new StageList(this.config.stages as Stage[]);
    const labelNames: string[] = stages.getLabelNames();

    console.log(labels);

    labels.filter(({ name }) => labelNames.includes(name)).forEach(({ name, id, color }) => {
      const stage = stages.getStageByLabel(name);
      stage.color = color;
      stage.id = id;
    });

    return stages;
  }

  private async loadConfig(): Promise<Config> {
    return JSON.parse(await this.client.getFile(".kanban.config.json"));
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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
</style>

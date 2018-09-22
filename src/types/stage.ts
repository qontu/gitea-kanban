export interface Stage {
  id: number;
  label: string;
  name: string;
  color?: string;
  isClosedStage?: boolean;
}

export class StageList {
  constructor(public stages: Stage[]) {}

  getStageNames(): string[] {
    return this.stages.map(({ name }) => name);
  }

  getLabelNames(): string[] {
    return this.stages.map(({ label }) => label);
  }

  getStageByName(name: string): Stage {
    return this.getStageBy("name", name);
  }

  getStageByLabel(label: string): Stage {
    return this.getStageBy("label", label);
  }

  getStageBy(prop: keyof Stage, predicate: string): Stage {
    return this.stages.find(({ [prop]: propValue }) => propValue === predicate);
  }

  get() {
    return this.stages;
  }
}

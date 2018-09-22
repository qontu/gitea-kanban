import { Stage } from "./stage";

export type ConfigStage = Omit<Stage, "id">;

export interface Config {
  stages: ConfigStage[];
}

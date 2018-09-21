import { User } from "./user";
import { Label } from "./label";
import { PullRequestMeta } from "./pull-request-meta";
import { Milestone } from "./milestone";

export enum StateType {
  CLOSED = "closed",
  OPEN = "open",
}

export interface Issue {
  assignee: User;
  assignees: User[];
  body: string;
  closed_at: string;
  comments: number;
  created_at: string;
  due_date: string;
  id: number;
  labels: Label[];
  milestone: Milestone;
  number: number;
  pull_request: PullRequestMeta;
  state: StateType;
  title: string;
  updated_at: string;
  url: string;
  user: User;
}

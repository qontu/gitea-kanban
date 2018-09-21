export interface Milestone {
  description: string;
  closed_at: string;
  closed_issues: number;
  due_on: string;
  id: number;
  open_issues: number;
  state: string; // StateType
  title: string;
}

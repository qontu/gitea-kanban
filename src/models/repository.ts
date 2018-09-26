import { User } from "./user";
import { Permission } from "./permission";

export interface Repository {
  clone_url: string;
  created_at: string;
  default_branch: string;
  description: string;
  empty: boolean;
  fork: boolean;
  forks_count: number;
  full_name: string;
  html_url: string;
  id: number;
  mirror: boolean;
  name: string;
  open_issues_count: number;
  owner: User;
  parent: Repository;
  permissions: Permission;
  private: boolean;
  size: number;
  ssh_url: string;
  stars_count: number;
  updated_at: string;
  watchers_count: number;
  website: string;
}

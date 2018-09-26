import { HttpService } from "./http.service";
import { Issue, StateType, Repository, Label } from "../models";

export interface GiteaClientConfig {
  token: string;
  baseUrl: string;
  repositoryOwner?: string;
  repositoryName?: string;
}

export class GiteaClient {
  private baseURL: string;
  private baseAPIURL: string;
  private apiURL: string;
  private repoURL: string;
  private repositoryOwner: string;
  private repositoryName: string;
  private token: string;
  private http: HttpService;

  constructor(config: GiteaClientConfig) {
    this.repositoryName = config.repositoryName;
    this.repositoryOwner = config.repositoryOwner;
    this.token = config.token;

    this.baseURL = config.baseUrl;
    this.baseAPIURL = `${this.baseURL}/api/v1`;
    this.apiURL = `${this.baseAPIURL}/repos/${this.repositoryOwner}/${this.repositoryName}`;
    this.repoURL = `${this.baseURL}/${this.repositoryOwner}/${this.repositoryName}`;

    this.http = new HttpService({
      cache: "no-cache",
      headers: {
        Authorization: `token ${this.token}`,
        "Content-Type": "application/json",
      },
    });
  }

  getLinkOfIssue(id: number) {
    return `${this.repoURL}/issues/${id}`;
  }

  async getAllIssues() {
    const open = await this.http.get<Issue[]>(`${this.apiURL}/issues`);
    const closed = await this.http.get<Issue[]>(`${this.apiURL}/issues?q=&state=${StateType.CLOSED}`);

    return [...open, ...closed];
  }

  getRepos() {
    return this.http.get<Repository[]>(`${this.baseAPIURL}/user/repos`);
  }

  getIssues() {
    return this.http.get<Issue[]>(`${this.apiURL}/issues`);
  }

  openIssue(id: number) {
    return this.updateIssue(id, {
      state: StateType.OPEN,
    });
  }

  closeIssue(id: number) {
    return this.updateIssue(id, {
      state: StateType.CLOSED,
    });
  }

  updateIssue(id: number, issue: Partial<Issue>) {
    return this.http.patch<Issue[], Issue>(`${this.apiURL}/issues/${id}`, issue);
  }

  getIssue(id: number) {
    return this.http.get<Issue>(`${this.apiURL}/issues/${id}`);
  }

  getLabels() {
    return this.http.get<Label[]>(`${this.apiURL}/labels`);
  }

  addLabels(issueID: number, labelIDs: number[]) {
    return this.http.post<Label, { labels: number[] }>(`${this.apiURL}/issues/${issueID}/labels`, {
      labels: labelIDs,
    });
  }

  deleteLabel(issueID: number, labelID: number) {
    return this.http.delete(`${this.apiURL}/issues/${issueID}/labels/${labelID}`);
  }

  getFile(filepath: string) {
    return this.http.get<string>(`${this.apiURL}/raw/${filepath}`, { noJSON: true });
  }
}

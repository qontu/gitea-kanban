import { HttpService } from "./http.service";
import { Issue, StateType } from "../models/issue";
import { Label } from "../models/label";

interface GiteaClientConfig {
  token: string;
  baseUrl: string;
  repositoryOwner: string;
  repositoryName: string;
}

export class GiteaClient {
  private baseUrl: string;
  private repositoryOwner: string;
  private repositoryName: string;
  private token: string;
  private wholeUrl: string;
  private http: HttpService;

  constructor(config: GiteaClientConfig) {
    this.repositoryName = config.repositoryName;
    this.repositoryOwner = config.repositoryOwner;
    this.token = config.token;
    this.baseUrl = config.baseUrl;
    this.wholeUrl = `${this.baseUrl}/api/v1/repos/${this.repositoryOwner}/${this.repositoryName}`;
    this.http = new HttpService({
      cache: "no-cache",
      headers: {
        Authorization: `token ${this.token}`,
        "Content-Type": "application/json",
      },
    });
  }

  async getAllIssues() {
    const open = await this.http.get<Issue[]>(`${this.wholeUrl}/issues`);
    const closed = await this.http.get<Issue[]>(`${this.wholeUrl}/issues?q=&state=${StateType.CLOSED}`);

    return [...open, ...closed];
  }

  getIssues() {
    return this.http.get<Issue[]>(`${this.wholeUrl}/issues`);
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
    return this.http.patch<Issue[], Issue>(`${this.wholeUrl}/issues/${id}`, issue);
  }

  getIssue(id: number) {
    return this.http.get<Issue>(`${this.wholeUrl}/issues/${id}`);
  }

  getLabels() {
    return this.http.get<Label[]>(`${this.wholeUrl}/labels`);
  }

  addLabels(issueID: number, labelIDs: number[]) {
    return this.http.post<Label, { labels: number[] }>(`${this.wholeUrl}/issues/${issueID}/labels`, {
      labels: labelIDs,
    });
  }

  deleteLabel(issueID: number, labelID: number) {
    return this.http.delete(`${this.wholeUrl}/issues/${issueID}/labels/${labelID}`);
  }
}

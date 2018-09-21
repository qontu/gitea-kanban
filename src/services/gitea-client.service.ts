import { HttpService } from "./http.service";

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

  public getIssues() {
    return this.http.get(`${this.wholeUrl}/issues`);
  }

  public getLabels() {
    return this.http.get(`${this.wholeUrl}/labels`);
  }

  public addLabels(issueID: number, labelIDs: number[]) {
    return this.http.post(`${this.wholeUrl}/issues/${issueID}/labels`, { labels: labelIDs });
  }

  public async deleteLabel(issueID: number, labelId: number) {
    return this.http.delete(`${this.wholeUrl}/issues/${issueID}/labels/${labelId}`);
  }
}

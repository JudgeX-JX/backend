import Axios from "axios";


export class CodeforcesProblemScrapper {
  private readonly BASE_URL: string;
  constructor() {
    this.BASE_URL = process.env.CF_PROBLEM_PARSER_API_URL || 'http://localhost';
  }
  async parseProblem(problemLink: string): Promise<{}> {
    let problemID = problemLink;
    if (this.isValidCFLink(problemLink)) {
      problemID = this.extractProblemIDFromLink(problemLink);
    } else if (this.isValidProblemID(problemID)) { }
    else {
      throw new Error('Invalid problem id or link' + problemLink);
    }

    const resp = await Axios.get(`${this.BASE_URL}/?id=${problemID}`);
    if (resp.status === 200) {
      return resp.data;
    } else {
      console.error(resp);
      throw new Error(resp.data);
    }
    // return {};
  }
  isValidCFLink(link: string): boolean {
    return true;
  }
  isValidProblemID(id: string): boolean {
    return true;
  }
  extractProblemIDFromLink(link: string): string {
    return link;
  }
}

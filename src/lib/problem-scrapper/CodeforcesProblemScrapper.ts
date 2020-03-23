import Axios from 'axios';
import { IProblem } from '../../models/problem';


export class CodeforcesProblemScrapper {
  private readonly BASE_URL: string;
  constructor() {
    this.BASE_URL = process.env.CF_PROBLEM_PARSER_API_URL || 'http://localhost';
  }
  async parseProblem(problemID: string): Promise<IProblem['description']> {
    const resp = await Axios.get(`${this.BASE_URL}/?id=${problemID}`);
    if (resp.status === 200) {
      const { timeLimit, memoryLimit } = resp.data;
      if (timeLimit.unit.startsWith('second') && memoryLimit.unit.startsWith('mega')) {
        // only store values
        resp.data.timeLimit = timeLimit.value;
        resp.data.memoryLimit = memoryLimit.value;
        return resp.data;
      } else {
        throw new Error(`Unkown unit type ${timeLimit}  ${memoryLimit}`)
      }
    } else {
      console.error(resp);
      throw new Error(resp.data);
    }
  }

}

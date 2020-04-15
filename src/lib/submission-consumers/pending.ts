/**
 * This file runs separately as a consumer gets submissions from the pending Q and process them
 */

import {JudgeFactory} from '../judge/JudgeFactory';
import SubmissionsQ from './SubmissionsQ';

(async (): Promise<void> => {
  await SubmissionsQ.init();
  SubmissionsQ.channel.consume(SubmissionsQ.pendingQ, async (msg) => {
    if (!msg) {
      return;
    }
    let submission = JSON.parse(msg.content.toString());
    const response = await new JudgeFactory(submission.problem)
      .createJudge(submission)
      .getVerdict();
    if (response.isJudged) {
      submission = {
        ...submission,
        ...response,
      };
    }
    SubmissionsQ.channel.ack(msg); // remove the submission from the Q
    setTimeout(() => SubmissionsQ.send(submission), 5000);
  });
})();

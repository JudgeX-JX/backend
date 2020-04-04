import SubmissionsQ from './SubmissionsQ';
import {Submission} from '../../models/submission';

export default async (): Promise<void> => {
  await SubmissionsQ.init();
  console.log('listening for judged submissions');
  SubmissionsQ.channel.consume(SubmissionsQ.judgedQ, async (msg) => {
    if (!msg) {
      return;
    }
    const sub = JSON.parse(msg.content.toString());
    await Submission.findByIdAndUpdate(sub._id, sub);
    SubmissionsQ.channel.ack(msg);
  });
};

import amqplib from 'amqplib';
import {ISubmission} from '../../models/submission';

export default class SubmissionsQ {
  private static isInit = false;
  static channel: amqplib.Channel;
  static pendingQ = 'pending';
  static judgedQ = 'judged';

  private constructor() {}

  public static async init(): Promise<void> {
    if (this.isInit == false) {
      const URL = process.env.RABBITMQ_URL || '';
      const connection = await amqplib.connect(URL);
      this.channel = await connection.createChannel();
      await this.channel.assertQueue(this.pendingQ);
      await this.channel.assertQueue(this.judgedQ);
      this.isInit = true;
    }
  }

  public static send(qName: string, data: ISubmission): void {
    this.channel.sendToQueue(qName, Buffer.from(JSON.stringify(data)));
  }
}

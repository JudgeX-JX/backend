import {Standing} from '../../models/standing';
import {Request, Response} from 'express';
import APIResponse from '../../utils/APIResponse';

export async function getAll(req: Request, res: Response): Promise<Response> {
  const filter = req.query;
  const standings = await Standing.find(filter);
  standings.sort((first: any, second: any) => {
    return first.solved === second.solved
      ? first.penality - second.penality
      : first.solved - second.solved;
  });
  return APIResponse.Ok(res, standings);
}

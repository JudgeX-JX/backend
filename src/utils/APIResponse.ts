import { Response } from 'express';

export default {
  // Custom response
  CustomResponse: (res: Response, status: number, messsage: string): Response => {
    return res.status(status).json(messsage);
  },

  // 200 Ok
  Ok: (res: Response, data = {}): Response => {
    return res.status(200).json(data);
  },

  // 201 Ok
  Created: (res: Response, data = {}): Response => {
    return res.status(201).json(data);
  },

  // 204 No Content
  NoContent: (res: Response): Response => {
    return res.status(204).json();
  },

  // 400 Bad request
  BadRequest: (res: Response, message = 'Bad request'): Response => {
    return res.status(400).json({ message });
  },

  // 401 Unauthorized
  Unauthorized: (res: Response, message = 'Unauthorized access'): Response => {
    return res.status(401).json({ message });
  },

  // 402 PaymentRequired
  PaymentRequired: (res: Response, message = 'Payment Required'): Response => {
    return res.status(402).json({ message });
  },

  // 403 Forbidden
  Forbidden: (res: Response, message = 'Forbidden Access'): Response => {
    return res.status(403).json({ message });
  },

  // 404 Not found
  NotFound: (res: Response, message = 'Not found'): Response => {
    return res.status(404).json({ message });
  },

  // 415 Unsupported media type
  UnsupportedMediaType: (res: Response, message = 'Unsupported media type'): Response => {
    return res.status(415).json({ message });
  },

  // 422 Unprocessable Entity
  UnprocessableEntity: (res: Response, errors: any): Response => {
    return res.status(422).json({ errors });
  },

  // 500 Server error
  ServerError: (res: Response, err: any, message = 'Internal server error'): Response => {
    console.error(err.message.red);
    return res.status(500).json({ message });
  },
};

import { Request } from 'express';
import { JwtPayload } from './BaseTypes';

export interface AuthorizedRequest extends Request {
  user: JwtPayload;
}

import { JwtPayload } from '@modules/auth/interface/jwt-payload.interface';
import { Request } from 'express';

export interface AuthRequest extends Request {
  user: JwtPayload;
}

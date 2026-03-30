import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { env } from '../config';
import { IUserDocument } from '../models/User';

export interface JwtPayload {
  sub: string;
  role: string;
}

const jwtSecret: Secret = env.jwtSecret as Secret;
const jwtOptions: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] };

export const signToken = (user: IUserDocument) =>
  jwt.sign({ sub: user.id, role: user.role }, jwtSecret, jwtOptions);

export const verifyToken = (token: string): JwtPayload =>
  jwt.verify(token, jwtSecret) as JwtPayload;

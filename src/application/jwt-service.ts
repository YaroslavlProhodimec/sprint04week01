// src/application/jwt-service.ts
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  async createJWT(payload: any, secret: string, expiresIn: number): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, secret, { expiresIn: `${expiresIn}m` }, (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token as string);
        }
      });
    });
  }

  async verifyJWT(token: string, secret: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }
}

export const jwtService = new JwtService();

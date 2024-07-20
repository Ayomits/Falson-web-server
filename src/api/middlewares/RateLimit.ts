import { NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';

interface RateLimitApiRecord {
  requests: number;
  startTime: number;
}

export class RateLimitMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  private userRateLimit = new Map<string, RateLimitApiRecord>();

  private readonly IP_MAX_REQUESTS = 450;
  private readonly WINDOW_TIME = 60 * 1000;

  private resetLimits(limits: Map<string, RateLimitApiRecord>) {
    const now = Date.now();
    for (const [key, record] of limits.entries()) {
      if (now - record.startTime > this.WINDOW_TIME) {
        limits.delete(key);
      }
    }
  }

  private checkLimit(
    limits: Map<string, RateLimitApiRecord>,
    key: string,
    maxRequests: number,
  ) {
    const now = Date.now();
    if (!limits.has(key)) {
      limits.set(key, { requests: 1, startTime: now });
      return true;
    }

    const record = limits.get(key);
    if (now - record.startTime > this.WINDOW_TIME) {
      limits.set(key, { requests: 1, startTime: now });
      return true;
    }

    if (record.requests < maxRequests) {
      record.requests++;
      return true;
    }

    return false;
  }

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const botToken = req.headers['x-bot-token'];
    this.resetLimits(this.userRateLimit);
    if (botToken && this.configService.get<string>('TOKEN') === botToken) {
      return next();
    }
    if (this.checkLimit(this.userRateLimit, ip, this.IP_MAX_REQUESTS)) {
      return next();
    } else {
      res.status(429).send({
        message: 'Too many requests',
      });
    }
  }
}

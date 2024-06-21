import { CanActivate, ExecutionContext } from '@nestjs/common';
import { IsServerOwnerGuard } from '../isServerOwner.guard';
import { IsBotGuard } from '../isBot.guard';

export class MergedIsOwner implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const isOwner = new IsServerOwnerGuard();
    const isBot = new IsBotGuard();
    const flags = await Promise.all([isOwner.canActivate(context), isBot]);
    return flags.includes(true);
  }
}

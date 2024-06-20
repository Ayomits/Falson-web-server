import { CanActivate, ExecutionContext, ForbiddenException, Inject } from "@nestjs/common";
import { UsersService } from "../../users/users.service";
import { Request } from "express";
import { JwtPayload } from "src/api/common/types/base.types";
import { ClientFetcher } from "src/api/common/functions/clientFetcher.class";
import { client } from "src/discordjs";


export class IsServerOwnerGuard implements CanActivate {

  constructor(@Inject(UsersService) private userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request
    try{
      const clientFetcher = new ClientFetcher(client)
      const guildId = request.body.guildId || request.params.guildId
      const guild = clientFetcher.getGuildFromCache(guildId)
      return guild.ownerId === (request.user as JwtPayload).userId
    } catch{
      throw new ForbiddenException(`Missing access`)
    }   
  }
}
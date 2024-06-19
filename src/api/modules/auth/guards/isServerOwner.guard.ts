import { CanActivate, ExecutionContext, ForbiddenException, Inject } from "@nestjs/common";
import { UsersService } from "../../users/users.service";
import { Request } from "express";
import { JwtPayload } from "src/api/common/types/base.types";


export class IsServerOwnerGuard implements CanActivate {

  constructor(@Inject(UsersService) private userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request
    try{
      const guildId = request.body.guildId || request.params.guildId
      const guilds = await this.userService.ownersAndAdminsGuild(request)
      if (guilds.find(guild => guild.guildId === guildId)) {
        return true
      }
      return false
    } catch{
      throw new ForbiddenException(`Missing access`)
    }   
  }
}
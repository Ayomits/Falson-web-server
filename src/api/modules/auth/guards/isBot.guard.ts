import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export class IsBotGuard implements CanActivate{
  canActivate(context: ExecutionContext): boolean  {
    const req =  context.switchToHttp().getRequest()
    try{

    }catch{}
  }
}
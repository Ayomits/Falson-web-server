import { SetMetadata } from "@nestjs/common";
import { RouteType } from "../types/RouteType";


export const RouteProtectLevel = (requestType: RouteType) => SetMetadata(`RequestType`, requestType)
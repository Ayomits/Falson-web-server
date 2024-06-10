import { Document } from 'mongoose';

export type GuildId = string;
export type UserId = string;
export type ChannelId = string;
export type RoleId = string;

export type GuildIds = GuildId[];
export type UserIds = UserId[];
export type ChannelIds = ChannelId[];
export type RoleIds = RoleId[];

export enum PremiumEnum {
  NoPrem = 0,
  GoldPrem = 1,
  DiamonPrem = 2,
  ElitePrem = 3,
}


import { Document } from 'mongoose';

export enum PremiumEnum {
  NoPrem = 0,
  GoldPrem = 1,
  DiamonPrem = 2,
  ElitePrem = 3,
}

export type GuildsSchema = Document & {
  guildId: string;
  premiumStatus: number;
};

export type UserDocument = Document & {
  userId: string;
  username: string;
  balance: number;
  email: string;
};

export type GuildId = string;
export type UserId = string;
export type ChannelId = string;
export type RoleId = string;

export type GuildIds = GuildId[];
export type UserIds = UserId[];
export type ChannelIds = ChannelId[];
export type RoleIds = RoleId[];

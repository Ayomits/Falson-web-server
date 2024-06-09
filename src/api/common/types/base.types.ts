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

export type GuildsDocument = Document & {
  guildId: string;
  premiumStatus: number;

  logsChannel: {
    verifications: string;
    staffAdders: string;
  };
  verificationsRoles: Map<string, RoleId>;
  canUsePanel: string[]; // userIds
};

export type UserDocument = Document & {
  userId: string;
  username: string;
  balance: number;
  email: string;
};

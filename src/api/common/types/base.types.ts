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

export enum VerificationType {
  Traditional = 0,
  Voice = 1,
  Captcha = 2,
  Both = 3,
}

export type LanguagesType =
  | 'English'
  | 'Romanian'
  | 'Russian'
  | 'Ukrainian'
  | 'Pacan';

export enum LanguagesEnum{
  English = "English",
  Romanian = "Romanian",
  Russian = "Russian",
  Ukrainian = "Ukrainian",
  Pacan = "Pacan",
}
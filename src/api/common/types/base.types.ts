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
  Donater = 1,
  MiddleDonater = 2,
  Sponsor = 3,
  Developer = 4,
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

export enum LanguagesEnum {
  English = 'English',
  Romanian = 'Romanian',
  Russian = 'Russian',
  Ukrainian = 'Ukrainian',
  Pacan = 'Pacan',
}

export const validLanguages: string[] = [
  'english',
  'romanian',
  'russian',
  'ukrainian',
  'pacan',
];

export enum BugHunterType {
  NoBugHunter = 0,
  GreenBugHunter = 1,
  GoldBugHunter = 2,
}

export type UserGuild = {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: number;
  permissions_new: number;
  features: string[];
};
export type UserValidGuild = {
  guildId: string;
  name: string;
  icon: string;
  invited: boolean;
};

export type JwtPayload = {
  userId: string;
};

export type EmbedType = {
  title: string;
  description: string;
  thumbnail?: string;
  color: `#${string}`;
  image?: string;
  author?: {
    url?: string;
    value: string;
  };
  footer?: {
    url: string;
    value: string;
  };
};

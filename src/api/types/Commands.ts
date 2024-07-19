type Translations = {
  ru: string
  en: string
}

export type DocumentationCommand = {
  name: Translations
  description: Translations
  usage: Translations
  tag: string
  type: number
};

export type GuildCommandType = {
  roles: string[];
  channels: string[];
  isEnabled: boolean;
};



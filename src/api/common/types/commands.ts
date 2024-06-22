export enum CommandType {
  Everyone = 0,
  Donater = 1,
  MiddleDonater = 2,
  Sponsor = 3,
  Developer = 4,
}

export enum ArgumentType {
  User = 0,
  String = 1,
  Number = 2,
  Channel = 3,
  Role = 4,
}

export type Argument = {
  name: string;
  description: string;
  required: boolean;
  type: number;
  maxLength?: number
  minLength?: number
};

export type Command = {
  name: string;
  description: string;
  args?: { [key: string]: Argument };
  subcommands?: { [key: string]: Command };
  type: number;
};

export type CommandsTranslationType = { [key: string]: Command };

import {
  ArgumentType,
  CommandsTranslationType,
  CommandType,
} from 'src/api/common/types';

export const en: CommandsTranslationType = {
  bot: {
    name: 'bot',
    description: 'This commands about bot',
    type: CommandType.Everyone,
    subcommands: {
      status: {
        name: 'status',
        description: 'Information about the bot',
        type: CommandType.Everyone,
      },
    },
  },
  bot2: {
    name: 'bot2',
    description: 'This commands about bot',
    type: CommandType.Everyone,
  },
  bug: {
    name: 'bug',
    description: 'Bug controls',
    type: CommandType.Everyone,
    subcommands: {
      report: {
        name: 'report',
        description: 'Send a bug report',
        type: CommandType.Everyone,
        args: {
          name: {
            name: 'name',
            description: 'Short bug description',
            type: ArgumentType.String,
            required: true,
            minLength: 5,
            maxLength: 50,
          },
          description: {
            name: 'description',
            description: 'Tell more about this bug',
            type: ArgumentType.String,
            required: true,
            minLength: 10,
            maxLength: 250,
          },
        },
      },
      resolve: {
        name: `resolve`,
        description: 'Mark bug as resolved',
        type: CommandType.Developer,
        args: {
          name: {
            name: 'bugid',
            description: 'Bug ID',
            type: ArgumentType.String,
            required: true,
          },
        },
        subcommands: {
          resolve2: {
            name: `resolve2`,
            description: 'Mark bug as resolved',
            type: CommandType.Developer,
            args: {
              name: {
                name: 'bugid',
                description: 'Bug ID',
                type: ArgumentType.String,
                required: true,
              },
            },
          },
        },
      },
    },
  },
};

import {
  ArgumentType,
  CommandsTranslationType,
  CommandType,
} from 'src/api/common/types';

export const ru: CommandsTranslationType = {
  bot: {
    name: 'бот',
    description: 'Это команды про бота',
    type: CommandType.Everyone,
    subcommands: {
      status: {
        name: 'статус',
        description: 'Информация о боте',
        type: CommandType.Everyone,
      },
    },
  },
  bug: {
    name: 'баг',
    description: 'Контроль над багами',
    type: CommandType.Everyone,
    subcommands: {
      report: {
        name: 'жалоба',
        description: 'Отправить жалобу на ошибку бота',
        type: CommandType.Everyone,
        args: {
          name: {
            name: 'название',
            description: 'Короткое описание ошибки',
            type: ArgumentType.String,
            required: true,
            minLength: 5,
            maxLength: 50,
          },
          description: {
            name: 'описание',
            description: 'Расскажите больше о случившемся',
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
            name: "bugId",
            description: 'Bug ID',
            type: ArgumentType.String,
            required: true,
          }
        }
      }
    },
  },
};

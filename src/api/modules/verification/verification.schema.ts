import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ColorResolvable } from 'discord.js';
import {
  ChannelIds,
  LanguagesEnum,
  RoleId,
  RoleIds,
  VerificationType,
} from 'src/api/common/types/base.types';

@Schema()
export class Verification {
  /**
   * Каждая гильдия имеет СВОИ настройки
   */
  @Prop({ required: true })
  guildId: string;

  /**
   * Ну фичу ставить number в типы верификаций, премиума и т.д. я спиздил у дса)
   */
  @Prop({ required: true, default: VerificationType.Traditional })
  verificationType?: number;

  @Prop({
    required: false,
    default: {},
    type: { feedBacks: String, verifications: String },
  })
  verificationLogs?: {
    feedBacks?: string; // используется в Voice верефке
    verifications?: string; // используется везде, но интерпретация разная. В случае традиционной указывается юзер, ну пон
  };

  /**
   * Тут подробнее
   * Чел указывает рольки, что будут в команда /verify или эмбеде традиционной верефки
   * Если ролей больше 5, то селект меню, если меньше, то кнопки
   */
  @Prop({ required: true, default: [], type: {} })
  verificationRoles?: string[];

  @Prop({
    required: false,
    default: [
      {
        title: 'Шаблонный эмбед',
        description: `Привет! Это шаблонный эмбед для верификации. Настрой всё под свой вкус на нашем сайте`,
        color: `#2C2F33`,
      },
    ],
    type: {},
  })
  /**
   * Короче, традиционная верификация всегда имеет эмбед, поэтому пусть челы его настраивают
   * Не прем фича : )
   */
  tradionVerificationEmbed?: Array<{
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
  }>;

  @Prop({ required: false, default: {}, type: Object })
  /**
   * Довольно-таки интересная настройка
   * Короче, чел тут указывает каналы в которых не считаются часы
   * Также указывает категории, где сидят саппорты
   * ТОЛЬКО ГС ВЕРЕФКА
   * */
  voiceVerificationChannels?: {
    category: ChannelIds;
    ignoredChannels: ChannelIds;
  };

  @Prop({ required: false, default: {}, type: Object })
  voiceVerificationStaffRoles?: {
    curator?: RoleIds; // те кто могут добавлять новых саппортов
    support?: RoleId; // те кто являются саппортами
  };

  
  @Prop({default: LanguagesEnum.Russian})
  language?: string
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);

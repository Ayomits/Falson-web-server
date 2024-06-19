import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  ChannelIds,
  LanguagesEnum,
  RoleId,
  RoleIds,
  VerificationType,
} from 'src/api/common/types/base.types';
import { defaultEmbeds } from 'src/api/common/types/defaultEmbeds';

@Schema()
export class Verification {
  @Prop({ required: true })
  /**
   * Каждая гильдия имеет СВОИ настройки
   */
  guildId: string;

  @Prop({ required: true, default: VerificationType.Traditional })
  /**
   * Ну фичу ставить number в типы верификаций, премиума и т.д. я спиздил у дса)
   */
  verificationType?: number;

  @Prop({ required: false, default: null, type: Object })
  /**
   * Логи нужны чтобы отслеживать какие действия были сделаны
   * FeedBacks - отзывы (гс верефка)
   * Verifications - верификации (гс & традиционная верефка)
   * Acception - логи принятий в стафф (гс верефка)
   */
  verificationLogs?: {
    feedBacks?: string; // используется в Voice верефке
    verifications?: string; // используется везде, но интерпретация разная. В случае традиционной указывается юзер, ну пон
    acception?: string; // используется в Voice верефке
  };

  /**
   * Тут подробнее
   * Чел указывает рольки, что будут в команда /verify или эмбеде традиционной верефки
   * Если ролей больше 5, то селект меню, если меньше, то кнопки
   */
  @Prop({ required: true, default: [], maxlength: 25 })
  verificationRoles?: string[];

  @Prop({
    required: false,
    default: [defaultEmbeds[0]],
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

  @Prop({ required: false, default: null, type: Object })
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

  @Prop({ required: false, default: null, type: Object })
  /**
   * Для войсовой верификации нужно
   * Чтобы добавлять роли кураторов и саппортов
   * Чтобы в стафф добавлять также
   */
  voiceVerificationStaffRoles?: {
    curator?: RoleIds; // те кто могут добавлять новых саппортов
    support?: RoleId; // те кто являются саппортами
  };

  @Prop({ type: String, default: LanguagesEnum.Russian })
  /**
   * English
   * Український
   * Русский
   * Быдло
   * Румынский
   */
  language: string;

  @Prop({type: Boolean, default: false})
  doubleVerification: boolean
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);

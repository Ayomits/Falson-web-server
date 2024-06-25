import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SchemasName } from 'src/api/common';

@Schema()
export class Embed extends Document {

  @Prop({ ref: SchemasName.Guilds, type: String })
  guildId: string;

  @Prop({
    required: true,
    default: `Добро пожаловать на сервер!`,
    maxlength: 256,
  })
  title: string;

  @Prop({
    required: true,
    default: `Чтобы пройти дальше, нажмите на кнопки ниже!`,
    maxlength: 4096,
  })
  description: string;

  @Prop({ required: false, default: null })
  thumbnail: string;

  @Prop({ required: false, default: null })
  image: string;

  @Prop({
    required: false,
    default: null,
    type: {
      url: String,
      text: String,
      timestamp: Date,
    },
  })
  footer: {
    url: string;
    text: string;
    timestamp: Date;
  };

  @Prop({
    required: false,
    default: null,
    type: {
      url: String,
      text: String,
    },
  })
  author: {
    url: string;
    text: string;
  };
}

export const EmbedSchema = SchemaFactory.createForClass(Embed);

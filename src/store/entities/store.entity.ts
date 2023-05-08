import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now } from 'mongoose';
import { hashSync, genSaltSync } from 'bcryptjs';

export type StoreDocument = Store & Document;

@Schema({ timestamps: true })
export class Store {
  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop()
  branch: string;

  @Prop()
  file: string;

  @Prop()
  author: string;

  @Prop()
  author_id: string;

  @Prop({ default: now() })
  created_at: Date;
}
export const StoreSchema = SchemaFactory.createForClass(Store);

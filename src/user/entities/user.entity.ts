import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { hashSync, genSaltSync } from 'bcryptjs';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre(
  'save',
  function (this, next: (err?: Error | undefined) => void) {
    // * Make sure you don't hash the hash
    if (!this.isModified('password')) {
      return next();
    }
    if (this.password) {
      this.password = hashSync(this.password, genSaltSync(10));
      next();
    }
  },
);

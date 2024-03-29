import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'sdfghjutyetdgvn',
      signOptions: { expiresIn: '3d' },
    }),
    EmailModule,
  ],
  controllers: [UserController],
  providers: [UserService, EmailService],
})
export class UserModule {
  constructor() {
    console.log('User Module');
  }
}

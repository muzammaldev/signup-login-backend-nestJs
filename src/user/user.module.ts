import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'sdfghjutyetdgvn',
      signOptions: { expiresIn: '2d' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
  constructor() {
    console.log('User Module');
  }
}

import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { SocketModule } from './socket/socket.module';

dotenv.config();
@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL, {}),
    UserModule,
    SocketModule,
  ],
  controllers: [],
  providers: [EmailService],
})
export class AppModule {
  constructor() {
    console.log('APP module');
  }
}

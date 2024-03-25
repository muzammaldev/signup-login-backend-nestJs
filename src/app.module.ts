import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

dotenv.config();
@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL, {
      // @ts-ignore
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {
    console.log('APP module');
  }
}

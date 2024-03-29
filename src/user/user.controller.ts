import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { EmailService } from 'src/email/email.service';
import { UserModule } from './user.module';
import { Model } from 'mongoose';
import { User, userDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ForgotPassVerifyCodeDto } from './dto/forgotPassVerifyCode.dto';
import { CreatePasswordDto } from './dto/CreatePassword.dto';

@Controller('user')
export class UserController {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<userDocument>,
    private readonly userservice: UserService,
    private readonly emailService: EmailService,
  ) {}

  @Post('/signup')
  async signup(@Body() signupDto: SignupDto): Promise<{ token: string }> {
    const result = await this.userservice.signup(signupDto);
    return { token: result.token };
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    const result = this.userservice.login(loginDto);

    return { token: (await result).token };
  }
  @Post('/forgotPassword')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userservice.forgotPassword(forgotPasswordDto);

    console.log(user, 'user');

    if (user) {
      await this.emailService.sendMail(
        user.userEmail,
        `Your verification code is: ${user.code}`,
      );
    } else {
      throw new NotFoundException('User not found');
    }

    const userMessage = user.message;

    return { userMessage };
  }

  @Post('/forgotPassVerifyCode')
  async forgotPassVerifyCode(
    @Body() forgotPassVerifyCodeDto: ForgotPassVerifyCodeDto,
  ) {
    const codeVerify = await this.userservice.forgotPassVerifyCode(
      forgotPassVerifyCodeDto,
    );

    return { codeVerify };
  }

  @Post('/createPassword')
  async CreatePassword(@Body() createPasswordDto: CreatePasswordDto) {
    const result = await this.userservice.CreatePassword(createPasswordDto);

    return { result };
  }
}

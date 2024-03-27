import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userservice: UserService) {}

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
    return await this.userservice.forgotPassword(forgotPasswordDto);
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, userDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as dotenv from 'dotenv';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';

dotenv.config();
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModle: Model<userDocument>,
    private readonly jwtService: JwtService,
  ) {}
  async signup(signupDto: SignupDto): Promise<{ token: string }> {
    const { name, email, password } = signupDto;
    const alreadyUser = await this.userModle.findOne({ email, name });

    if (alreadyUser) {
      throw new UnauthorizedException('Email Already Exits');
    }

    const user = await this.userModle.create({
      name,
      email,
      password,
    });

    const token = this.jwtService.sign({
      secret: process.env.SECRET_KEY,
      id: user._id,
      name: user.name,
      email: user.email,
    });

    return { token };
  }

  // async login(loginDto: LoginDto): Promise<{ token: string }> {
  //   const { email, password } = loginDto;

  //   const user = await this.userModle.findOne({ email });

  //   const isvalidPassword = password == user.password;

  //   if (!isvalidPassword) {
  //     throw new UnauthorizedException('Invalid credenrails');
  //   }

  //   const token = this.jwtService.sign(
  //     { name: user.name, email: user.email, id: user._id },
  //     {
  //       secret: process.env.SECRET_KEY,
  //     },
  //   );

  //   return { token };
  // }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await this.userModle.findOne({ email });

    console.log(user, 'jkjjh');

    const isvalidPassword = password == user.password;
    if (!isvalidPassword) {
      throw new UnauthorizedException('Invalid credenrails');
    }
    const token = this.jwtService.sign(
      { name: user.name, email: user.email, id: user._id },
      {
        secret: process.env.SECRET_KEY,
      },
    );
    return { token };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const { email, newPassword } = forgotPasswordDto;

    const user = await this.userModle.findOne({ email });

    console.log(user, 'hhhhhhh');

    if (!user) {
      throw new Error('User not found');
    }

    user.password = newPassword;

    await user.save();

    return { message: 'Your Password  Changed ' };
  }
}

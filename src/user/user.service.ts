import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, userDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as dotenv from 'dotenv';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import * as crypto from 'crypto';
import { ForgotPassVerifyCodeDto } from './dto/forgotPassVerifyCode.dto';
import { promises } from 'fs';
import { CreatePasswordDto } from './dto/CreatePassword.dto';

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

    const VerifyCode = null;

    const user = await this.userModle.create({
      name,
      email,
      password,
      varifcationCode: VerifyCode,
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
  ): Promise<{ message: string; code: number; userEmail: string }> {
    const { email } = forgotPasswordDto;

    const user = await this.userModle.findOne({ email });

    const randomBytes = crypto.randomBytes(3);

    // Convert randomBytes to a Promise-based function
    const randomBytesAsync = () =>
      new Promise<Buffer>((resolve) => resolve(randomBytes));

    // Use async/await to generate the random number
    const randomNumber =
      (parseInt((await randomBytesAsync()).toString('hex'), 16) % 900000) +
      100000;

    if (user) {
      user.varifcationCode = randomNumber;
    } else {
      throw new Error('User not found');
    }

    await user.save();
    // console.log(user, 'hhhhhhh');

    const code = user.varifcationCode;
    const userEmail = user.email;

    return { message: 'Varifcation Code Send to your email', code, userEmail };
  }

  async forgotPassVerifyCode(
    forgotPassVerifyCodeDto: ForgotPassVerifyCodeDto,
  ): Promise<{ message: string }> {
    const { varifcationCode, email } = forgotPassVerifyCodeDto;

    const user = await this.userModle.findOne({ varifcationCode });

    // console.log(user, 'verify');

    await user.save();

    if (user.varifcationCode) {
      return { message: 'good hogya' };
    } else {
      return { message: 'code not found' };
    }
  }

  async CreatePassword(
    createPasswordDto: CreatePasswordDto,
  ): Promise<{ message: string }> {
    const { password, email } = createPasswordDto;

    const user = await this.userModle.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = password;
    await user.save();
    console.log(user, 'user');

    return { message: 'Password changed' };
  }
}

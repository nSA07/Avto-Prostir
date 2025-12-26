import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@user/user.service';
import * as argon2 from 'argon2';
import { instanceToPlain } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService, 
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {

    const user = await this.userService.findOne(email);
    
    const passwordMatch = await argon2.verify(user.password, password);

    if (user && passwordMatch) {
      return instanceToPlain(user);
    }
    throw new UnauthorizedException('Email or password are incorrect');
  }

  async login(user: any) {
    const { id, email } = user;
    return {
      id, email, token: this.jwtService.sign({ id, email }),
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.userService.create(registerDto);

    const token = this.jwtService.sign({ id: user.id, email: user.email });

    return {
      id: user.id,
      email: user.email,
      token,
    };
  }

}

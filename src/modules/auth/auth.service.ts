import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { UsersService } from '@modules/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    return await this.usersService.createUser(createUserDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ acessToken: string }> {
    const { email, password } = authCredentialsDto;
    const user = await this.usersService.findByEmail(email);
    if (
      user &&
      (await this.usersService.comparePasswords(password, user.passwordHash))
    ) {
      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        name: user.name,
      };
      const acessToken: string = this.jwtService.sign(payload);
      return { acessToken };
    } else {
      throw new UnauthorizedException('Invalid Credentials');
    }
  }
}

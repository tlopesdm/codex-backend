import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { AuthUserResponse } from './dto/auth-user-response.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<AuthUserResponse> {
    const user = await this.authService.signUp(createUserDto);
    return {
      message: 'Registration Successful',
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ acessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }
}

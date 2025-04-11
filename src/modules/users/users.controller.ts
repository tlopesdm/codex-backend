import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { Request } from 'express';

interface UserResponse {
  id: string;
  name: string;
  email: string;
}

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('userInfo')
  async getMe(@Req() req: Request): Promise<UserResponse> {
    const user = req.user as User;
    if (!user) {
      throw new NotFoundException('Current User not found');
    }
    return this.usersService.getUserProfile(user.id);
  }

  @Get(':id')
  async findUser(@Param('id') id: string): Promise<User> {
    try {
      return await this.usersService.findById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to Fetch User');
    }
  }
}

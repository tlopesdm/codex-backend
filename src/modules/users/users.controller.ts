import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from './entities/user.entity';
import { UserResponse } from './interfaces/user-response.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('userInfo')
  async getMe(@Req() req: Request): Promise<UserResponse> {
    const user = req.user as User;
    if (!user) {
      throw new NotFoundException('Current User not found');
    }
    return this.usersService.getUserProfile(user.id);
  }

  @UseGuards(JwtAuthGuard)
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

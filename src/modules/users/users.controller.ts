import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthRequest } from '../../common/utils/interfaces/auth-request.interface';
import { User } from './entities/user.entity';
import { UserResponse } from './interfaces/user-response.interface';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('profile')
  async getUserProfile(@Req() req: AuthRequest): Promise<UserResponse> {
    const user = req.user;
    if (!user) {
      throw new NotFoundException('Current User not found');
    }
    return this.usersService.getUserProfile(user.sub);
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

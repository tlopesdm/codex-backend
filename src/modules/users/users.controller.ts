import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { AuthRequest } from '@interfaces/auth-request.interface';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
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
    const userId = req.user.sub;
    return this.usersService.getUserProfile(userId);
  }

  // @Get(':id')
  // async findUser(@Param('id') id: string): Promise<User> {
  //   try {
  //     return await this.usersService.findById(id);
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     throw new Error('Failed to Fetch User');
  //   }
  // }
}

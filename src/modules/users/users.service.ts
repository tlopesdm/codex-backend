import {
  ConflictException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable({ scope: Scope.DEFAULT })
export class UsersService {
  constructor(private readonly usersRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      select: ['id', 'name', 'email', 'createdAt'],
      order: {
        name: 'DESC',
      },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findByEmail(email);
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name } = createUserDto;
    const saltRounds = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const user = this.usersRepository.create({
      name,
      email,
      passwordHash,
    });
    return this.usersRepository.save(user);
  }

  async getUserProfile(id: string): Promise<any> {
    const user = await this.findById(id);
    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return profile;
  }
}

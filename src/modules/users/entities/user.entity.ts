import { IsEmail } from 'class-validator';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  async hashPassword(password: string): Promise<void> {
    const saltRounds = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password, saltRounds);
  }
}

import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { IUserService } from '../../domain/services/user.service.interface';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { PaginatedResponse } from '../../../../common/interfaces/api-response.interface';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { CustomException } from '../../../../common/exceptions/custom.exception';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(pagination: PaginationDto): Promise<PaginatedResponse<User>> {
    return this.userRepository.findAll(pagination);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new CustomException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new CustomException('User with this email already exists', HttpStatus.CONFLICT);
    }

    return this.userRepository.create({
      ...createUserDto,
      create_at: new Date(),
      update_at: new Date(),
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new CustomException('User not found', HttpStatus.NOT_FOUND);
    }

    return this.userRepository.update(id, {
      ...updateUserDto,
      update_at: new Date(),
    });
  }

  async delete(id: string): Promise<void> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new CustomException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.delete(id);
  }
} 
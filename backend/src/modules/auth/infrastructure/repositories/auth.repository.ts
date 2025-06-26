import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { AuthRepositoryInterface } from '../../domain/repositories/auth-repositories.interface';
import { User } from '../../../users/domain/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthRepository implements AuthRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.mST_USER.findUnique({
      where: { username },
      include: {
        MST_ROLE: true,
      },
    });

    if (!user) {
      return null;
    }

    return new User({
      id: user.id,
      username: user.username,
      password: user.password,
      id_role: user.id_role,
      create_at: user.create_at ?? undefined,
      update_at: user.update_at ?? undefined,
      create_by: user.create_by ?? undefined,
      update_by: user.update_by ?? undefined,
    });
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
} 